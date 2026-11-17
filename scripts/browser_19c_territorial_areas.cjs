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
   [1800, ['wellesley-cession-1800'], ['wellesley-core-1831', 'malacca-mainland-1833-settled']],
   [1819, ['cape-breton-separate-colony'], ['nova-scotia-1820-cape-breton-union']],
   [1820, ['nova-scotia-1820-cape-breton-union'], ['cape-breton-separate-colony']],
   [1824, ['nsw-1800-commission'], ['tasmania-1825-van-diemens-land']],
   [1825, ['nsw-1825-westward', 'tasmania-1825-van-diemens-land'], ['nsw-1800-commission']],
   [1826, ['arakan-ramree-island-cession', 'arakan-cheduba-island-cession'], []],
   [1829, ['western-australia-1829-proclamation'], ['western-australia-commission-1831']],
   [1830, ['wellesley-cession-1800'], ['wellesley-core-1831']],
   [1831, ['western-australia-commission-1831', 'wellesley-core-1831'],
    ['western-australia-1829-proclamation', 'wellesley-cession-1800']],
   [1832, ['wellesley-core-1831'], ['malacca-mainland-1833-settled']],
   [1833, ['malacca-mainland-1833-settled'], ['malacca-mainland-1858-india']],
   [1835, ['nsw-1825-westward'], ['south-australia-1836-province']],
   [1836, ['nsw-1836-south-australia', 'south-australia-1836-province'], ['nsw-1825-westward']],
   [1840, [], ['hong-kong-island-1841-occupation', 'chatham-1842-annexation']],
   [1841, ['hong-kong-island-1841-occupation'], ['hong-kong-island-1842-treaty']],
   [1842, ['hong-kong-island-1842-treaty', 'chatham-1842-annexation'], ['hong-kong-island-1841-occupation']],
   [1843, ['hong-kong-island-1843-crown'], ['hong-kong-island-1842-treaty']],
   [1850, ['nsw-1836-south-australia'], ['victoria-1851-mainland']],
   [1851, ['victoria-1851-mainland', 'nsw-1851-victoria'], ['nsw-1836-south-australia']],
   [1857, ['haida-gwaii-colonial-jurisdiction-1853-1857', 'singapore-1826-straits-company'], ['british-columbia-mainland-1858']],
   [1858, ['british-columbia-mainland-1858', 'haida-gwaii-colonial-jurisdiction-1858-1862',
    'singapore-1858-straits-india', 'malacca-mainland-1858-india'],
    ['haida-gwaii-colonial-jurisdiction-1853-1857', 'singapore-1826-straits-company', 'malacca-mainland-1833-settled']],
   [1859, ['queensland-1859-separation', 'borneo-labuan-island', 'british-columbia-mainland-1858'],
    ['borneo-labuan-1860', 'kowloon-south-1860-cession', 'stonecutters-1860-cession']],
   [1860, ['borneo-labuan-1860', 'cape-kaffraria-1860', 'kowloon-south-1860-cession', 'stonecutters-1860-cession'], ['borneo-labuan-island']],
   [1861, ['south-australia-1861-southern', 'kowloon-south-1861-hong-kong', 'stonecutters-1861-hong-kong'],
    ['south-australia-1836-province', 'kowloon-south-1860-cession', 'stonecutters-1860-cession']],
   [1862, ['queensland-1862-western-extension', 'nsw-1862-queensland-westward'], ['queensland-1859-separation']],
   [1863, ['south-australia-northern-territory-1863', 'nsw-1863-northern-territory-transfer', 'british-columbia-mainland-1863-boundary',
    'haida-gwaii-colonial-jurisdiction-1863-1865'], ['nsw-1862-queensland-westward', 'british-columbia-mainland-1858']],
   [1866, ['cape-kaffraria-1866', 'british-columbia-united-colony'], ['cape-kaffraria-1860', 'vancouver-island-separate-colony',
    'haida-gwaii-colonial-jurisdiction-1863-1865']],
   [1867, ['singapore-1867-straits-crown', 'penang-1867-straits-crown', 'malacca-mainland-1867-crown'],
    ['singapore-1858-straits-india', 'penang-1858-straits-india', 'malacca-mainland-1858-india']],
   [1868, ['wellesley-core-1831'], ['wellesley-redemarcation-1869']],
   [1869, ['wellesley-redemarcation-1869'], ['wellesley-core-1831']],
   [1870, ['chatham-1870-land-court'], ['chatham-1854-resident-magistrate']],
   [1871, ['british-columbia-1871-province'], ['british-columbia-united-colony']],
   [1873, ['wellesley-redemarcation-1869'], ['wellesley-pangkor-1874', 'pangkor-islands-1874-straits']],
   [1874, ['wellesley-pangkor-1874', 'pangkor-islands-1874-straits'], ['wellesley-redemarcation-1869']],
   [1877, ['canada-nwt-1876-era', 'keewatin-1876-phase'], [colony, 'cape-kaffraria-1866']],
   [1879, [colony, 'canada-nwt-1876-era'], ['canada-nwt-1880-arctic-transfer']],
   [1880, ['rotuma-1880-fiji-proclamation'], ['rotuma-1881-fiji-cession']],
   [1881, ['manitoba-1881-expansion', 'manitoba-ontario-disputed-area', 'rotuma-1881-fiji-cession'],
    ['manitoba-1870-postage-stamp', 'rotuma-1880-fiji-proclamation']],
   [1882, ['canada-nwt-1882-districting', 'saskatchewan-1882-district'], ['canada-nwt-1880-arctic-transfer']],
   [1884, [], ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation']],
   [1885, ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation'], ['png-1888-separate-possession']],
   [1887, ['kermadec-1887-annexation'], []],
   [1888, ['png-1888-separate-possession'], ['png-1885-protectorate-delimitation']],
   [1889, ['manitoba-1889-confirmed', 'trinidad-tobago-1889-union', 'ontario-1889-boundary-act', 'canada-nwt-1889-ontario-boundary'],
    ['manitoba-ontario-disputed-area', 'trinidad-1802-cession', 'tobago-1814-cession', 'canada-nwt-1882-districting']],
   [1890, ['borneo-labuan-1890'], ['borneo-labuan-1860']],
   [1891, [], ['gilbert-1892-protectorate', 'ellice-1892-protectorate']],
   [1892, ['gilbert-1892-protectorate', 'ellice-1892-protectorate'], []],
   [1896, ['canada-nwt-1889-ontario-boundary'], ['yukon-1897-phase']],
   [1897, ['yukon-1897-phase', 'franklin-1897-district'], ['canada-nwt-1889-ontario-boundary',
    'lantau-1898-new-territories-lease', 'hong-kong-new-territories-mainland-1898', 'dindings-mainland-1898-survey']],
   [1898, ['yukon-1898-phase', 'quebec-1898-northern-boundary', 'hong-kong-island-1843-crown',
    'kowloon-south-1861-hong-kong', 'lantau-1898-new-territories-lease', 'lamma-1898-new-territories-lease',
    'hong-kong-new-territories-mainland-1898', 'dindings-mainland-1898-survey'],
    ['yukon-1897-phase', 'quebec-1867-founding-province', 'hong-kong-new-territories-mainland-1899']],
   [1899, ['hong-kong-new-territories-mainland-1899', 'dindings-mainland-1898-survey'],
    ['hong-kong-new-territories-mainland-1898']],
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

  await page.goto(root + '?year=1860', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   window.atlasStoryBridge.currentYear() === 1860);
  await page.locator('#mapLayerEvents').uncheck();
  await page.evaluate(() => window.__historicOverlapHost.map.setView([22.317, 114.176], 12, { animate: false }));
  assert(await page.evaluate(() => window.historicOverlapDossier.hitCountAt(22.316, 114.175)));
  await clickAreaAt(22.316, 114.175);
  await drawer.waitFor();
  assert.match(await drawer.textContent(), /九龙半岛南部 · 《北京条约》割让/);
  await drawer.locator('summary').click();
  assert(await drawer.locator('a[href="https://www.grs.gov.hk/ws/rhk/en/1860s.html"]').isVisible());
  assert(await drawer.locator('[data-area-event="E19-PEK-1860-KOWLOON"]').isVisible());
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1860-kowloon-dossier.png') });

  await page.goto(root + '?year=1898', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   window.atlasStoryBridge.currentYear() === 1898);
  const walledCityHits = () => page.evaluate(() => window.historicOverlapDossier.hitCountAt(22.33233, 114.19021));
  assert.equal(await walledCityHits(), 0);
  await jump(1899);
  assert.equal(await walledCityHits(), 1);
  await page.locator('#mapLayerEvents').uncheck();
  await page.evaluate(() => window.__historicOverlapHost.map.setView([22.417, 114.143], 10, { animate: false }));
  await clickAreaAt(22.417, 114.143);
  await drawer.waitFor();
  assert.match(await drawer.textContent(), /新界大陆 · 清英勘界与英国接收/);
  await drawer.locator('summary').click();
  assert(await drawer.locator('a[href="https://cdn.nationalarchives.gov.uk/documents/hong-kong-and-the-opium-wars.pdf#page=16"]').isVisible());
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1899-new-territories-dossier.png') });

  await page.goto(root + '?year=1879', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   window.atlasStoryBridge.currentYear() === 1879);
  const siteMarkers = page.locator('.atlas-19c-site');
  const layers1879 = await ids();
  assert(layers1879.includes('canada-nwt-1876-era'));
  assert.equal(await siteMarkers.count(), 0);
  const events1879 = await page.evaluate(() => window.atlasDensityAudit());
  assert(events1879.eligibleKeys.length > 0);
  assert.deepEqual(events1879.groupedKeys, events1879.eligibleKeys);
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1879-overview.png') });

  const showCapeTown = zoom => page.evaluate(value =>
   window.__historicOverlapHost.map.setView([-33.925, 18.427], value, { animate: false }), zoom);
  await showCapeTown(6);
  assert.equal(await siteMarkers.count(), 0);
  await showCapeTown(10);
  assert((await siteMarkers.count()) > 0);
  assert(await siteMarkers.evaluateAll(markers => markers.every(marker => marker.getAttribute('stroke-dasharray') === '3 3')));
  assert.deepEqual(await ids(), layers1879);
  await page.locator('#mapLayerEvents').uncheck();
  await clickAreaAt(-33.925, 18.427);
  const siteDossier = page.locator('#dossierBody h2').filter({ hasText: '开普敦' });
  await siteDossier.waitFor();
  await page.locator('#resetDossier').click();
  await page.locator('#mapLayerTerritory').uncheck();
  assert.equal(await siteMarkers.count(), 0);
  await page.locator('#mapLayerTerritory').check();
  assert((await siteMarkers.count()) > 0);
  await showCapeTown(6);
  assert.equal(await siteMarkers.count(), 0);
  assert.deepEqual(await ids(), layers1879);

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
