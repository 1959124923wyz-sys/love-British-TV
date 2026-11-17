const assert = require('node:assert/strict');
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');
const { chromium } = require('playwright');

const root = process.env.ATLAS_TEST_URL || 'http://127.0.0.1:8765/';
const screenshotDir = process.env.ATLAS_TEST_SCREENSHOTS || 'browser-smoke-results';
const colony = 'cyprus-1878-convention-administration';

async function verify() {
 const args = ['--no-sandbox', '--ignore-certificate-errors'];
 if (process.env.ATLAS_TEST_SINGLE_PROCESS === '1') args.push('--no-zygote', '--single-process');
 const browser = await chromium.launch({ executablePath: process.env.ATLAS_TEST_CHROME, args });
 try {
  const page = await browser.newPage({ viewport: { width: 1780, height: 1020 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', entry => {
   if (entry.text().includes('Nineteenth-century territory areas not loaded')) errors.push(entry.text());
  });
  if (process.env.ATLAS_TEST_CDN_MIRROR) {
   const directory = process.env.ATLAS_TEST_CDN_MIRROR;
   for (const [host, file] of [
    ['https://unpkg.com/leaflet@1.9.4/dist/', 'leaflet.js'],
    ['https://unpkg.com/leaflet@1.9.4/dist/', 'leaflet.css'],
    ['https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/', 'topojson-client.min.js']
   ]) await page.route(host + file, route => route.fulfill({ path: join(directory, file) }));
  }

  await mkdir(screenshotDir, { recursive: true });
  const ids = () => page.evaluate(() => window.__historicOverlapHost.visibleAreaFeatures()
   .filter(item => item.layer._path?.classList.contains('atlas-19c-area'))
   .map(item => item.feature.id));
  const jump = async year => {
   await page.locator('#jumpYear').fill(String(year));
   await page.locator('#jumpYear').press('Enter');
   await page.waitForFunction(value => window.atlasStoryBridge.currentYear() === value, year);
  };
  await page.goto(root + '?year=1880', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   document.querySelector('#bigYear').textContent === '1880', undefined, { timeout: 45000 });
  const opening = await ids();
  assert.equal(opening.filter(id => ['cyprus-1878-convention-administration',
   'canada-nwt-1880-arctic-transfer', 'mandalay-walled-city-garrison', 'fiji-cession-principal-islands']
   .includes(id)).length, 3);
  assert((await page.locator('.atlas-19c-area[stroke-dasharray="7 6"]').count()) >= 12);
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1880-world.png') });

  await page.locator('#mapLayerTerritory').uncheck();
  assert.deepEqual(await ids(), []);
  await page.locator('#mapLayerTerritory').check();
  assert.deepEqual(await ids(), opening);
  await page.locator('#mapLayerEvents').uncheck();
  await page.evaluate(() => window.__historicOverlapHost.map.setView([35.04, 33.22], 8, { animate: false }));
  const clickAreaAt = async (lat, lon) => {
   const position = await page.evaluate(([lat, lon]) => {
    const map = window.__historicOverlapHost.map;
    const point = map.latLngToContainerPoint([lat, lon]);
    const frame = map.getContainer().getBoundingClientRect();
    return [frame.left + point.x, frame.top + point.y];
   }, [lat, lon]);
   await page.mouse.click(...position);
  };
  await clickAreaAt(35.04, 33.22);
  const drawer = page.locator('#atlasHistoricOverlapPanel');
  await drawer.waitFor();
  assert.match(await drawer.textContent(), /塞浦路斯.*(奥斯曼|英国)/);
  await drawer.locator('summary').click();
  assert(await drawer.locator('a[href="https://www.loc.gov/item/2021588568/"]').isVisible());
  await drawer.locator('.atlas-18c-overlap-title').hover();
  assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1880-cyprus-dossier.png') });

  for (const [year, present, absent] of [
   [1819, ['cape-breton-separate-colony'], ['nova-scotia-1820-cape-breton-union']],
   [1820, ['nova-scotia-1820-cape-breton-union'], ['cape-breton-separate-colony']],
   [1824, ['nsw-1800-commission'], ['tasmania-1825-van-diemens-land']],
   [1825, ['nsw-1825-westward', 'tasmania-1825-van-diemens-land'], ['nsw-1800-commission']],
   [1826, ['arakan-ramree-island-cession', 'arakan-cheduba-island-cession'], []],
   [1829, ['western-australia-1829-proclamation'], ['western-australia-commission-1831']],
   [1831, ['western-australia-commission-1831'], ['western-australia-1829-proclamation']],
   [1835, ['nsw-1825-westward'], ['south-australia-1836-province']],
   [1836, ['nsw-1836-south-australia', 'south-australia-1836-province'], ['nsw-1825-westward']],
   [1850, ['nsw-1836-south-australia'], ['victoria-1851-mainland']],
   [1851, ['victoria-1851-mainland', 'nsw-1851-victoria'], ['nsw-1836-south-australia']],
   [1859, ['queensland-1859-separation', 'borneo-labuan-island'], ['borneo-labuan-1860']],
   [1860, ['borneo-labuan-1860', 'cape-kaffraria-1860'], ['borneo-labuan-island']],
   [1861, ['south-australia-1861-southern'], ['south-australia-1836-province']],
   [1862, ['queensland-1862-western-extension', 'nsw-1862-queensland-westward'], ['queensland-1859-separation']],
   [1863, ['south-australia-northern-territory-1863', 'nsw-1863-northern-territory-transfer'], ['nsw-1862-queensland-westward']],
   [1866, ['cape-kaffraria-1866', 'british-columbia-united-colony'], ['cape-kaffraria-1860', 'vancouver-island-separate-colony']],
   [1871, ['british-columbia-1871-province'], ['british-columbia-united-colony']],
   [1877, ['canada-nwt-1876-era', 'keewatin-1876-phase'], [colony, 'cape-kaffraria-1866']],
   [1879, [colony, 'canada-nwt-1876-era'], ['canada-nwt-1880-arctic-transfer']],
   [1881, ['manitoba-1881-expansion', 'manitoba-ontario-disputed-area'], ['manitoba-1870-postage-stamp']],
   [1882, ['canada-nwt-1882-districting', 'saskatchewan-1882-district'], ['canada-nwt-1880-arctic-transfer']],
   [1884, [], ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation']],
   [1885, ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation'], ['png-1888-separate-possession']],
   [1888, ['png-1888-separate-possession'], ['png-1885-protectorate-delimitation']],
   [1889, ['manitoba-1889-confirmed', 'trinidad-tobago-1889-union', 'ontario-1889-boundary-act', 'canada-nwt-1889-ontario-boundary'],
    ['manitoba-ontario-disputed-area', 'trinidad-1802-cession', 'tobago-1814-cession', 'canada-nwt-1882-districting']],
   [1890, ['borneo-labuan-1890'], ['borneo-labuan-1860']],
   [1896, ['canada-nwt-1889-ontario-boundary'], ['yukon-1897-phase']],
   [1897, ['yukon-1897-phase', 'franklin-1897-district'], ['canada-nwt-1889-ontario-boundary']],
   [1898, ['yukon-1898-phase', 'quebec-1898-northern-boundary'], ['yukon-1897-phase', 'quebec-1867-founding-province']],
   [1900, [], [colony, 'yukon-1898-phase']]
  ]) {
   await jump(year);
   const visible = await ids();
   for (const id of present) assert(visible.includes(id), year + ' is missing ' + id);
   for (const id of absent) assert(!visible.includes(id), year + ' incorrectly shows ' + id);
  }
  await jump(1880);
  await page.evaluate(() => window.__historicOverlapHost.map.setView([-20, 145], 5, { animate: false }));
  await clickAreaAt(-20, 145);
  await drawer.waitFor();
  assert.match(await drawer.textContent(), /昆士兰 · 1862年西扩/);
  await drawer.locator('summary').click();
  assert(await drawer.locator('a[href="https://www.foundingdocs.gov.au/item-sdid-51.html"]').isVisible());
  assert(await drawer.locator('[data-area-event="E19-QNP-1859-PATENT"]').isVisible());
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1880-queensland-dossier.png') });

  assert.deepEqual(errors, []);
  console.log('19C desktop: annual transitions, territory switches, source drawers and hover outlines passed');
 } finally {
  await browser.close();
 }
}

verify().catch(error => {
 console.error(error);
 process.exitCode = 1;
});
