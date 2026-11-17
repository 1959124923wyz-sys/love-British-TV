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
  const position = await page.evaluate(([lat, lon]) => {
   const map = window.__historicOverlapHost.map;
   const point = map.latLngToContainerPoint([lat, lon]);
   const frame = map.getContainer().getBoundingClientRect();
   return [frame.left + point.x, frame.top + point.y];
  }, [35.04, 33.22]);
  await page.mouse.click(...position);
  const drawer = page.locator('#atlasHistoricOverlapPanel');
  await drawer.waitFor();
  assert.match(await drawer.textContent(), /塞浦路斯.*(奥斯曼|英国)/);
  await drawer.locator('summary').click();
  assert(await drawer.locator('a[href="https://www.loc.gov/item/2021588568/"]').isVisible());
  await drawer.locator('.atlas-18c-overlap-title').hover();
  assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1880-cyprus-dossier.png') });

  for (const [year, present, absent] of [
   [1877, ['canada-nwt-1876-era'], [colony]],
   [1879, [colony, 'canada-nwt-1876-era'], ['canada-nwt-1880-arctic-transfer']],
   [1881, ['manitoba-1881-expansion', 'manitoba-ontario-disputed-area'], ['manitoba-1870-postage-stamp']],
   [1882, ['canada-nwt-1882-districting', 'saskatchewan-1882-district'], ['canada-nwt-1880-arctic-transfer']],
   [1884, [], ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation']],
   [1885, ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation'], ['png-1888-separate-possession']],
   [1888, ['png-1888-separate-possession'], ['png-1885-protectorate-delimitation']],
   [1889, ['manitoba-1889-confirmed'], ['manitoba-ontario-disputed-area']],
   [1896, ['canada-nwt-1882-districting'], ['yukon-1897-phase']],
   [1897, ['yukon-1897-phase', 'franklin-1897-district'], ['canada-nwt-1882-districting']],
   [1898, ['yukon-1898-phase'], ['yukon-1897-phase']],
   [1900, [], [colony, 'yukon-1898-phase']]
  ]) {
   await jump(year);
   const visible = await ids();
   for (const id of present) assert(visible.includes(id), year + ' is missing ' + id);
   for (const id of absent) assert(!visible.includes(id), year + ' incorrectly shows ' + id);
  }
  assert.deepEqual(errors, []);
  console.log('19C desktop: annual changes, dashed SVGs, independent layer switch, Cyprus archive and hover outline passed');
 } finally {
  await browser.close();
 }
}

verify().catch(error => {
 console.error(error);
 process.exitCode = 1;
});
