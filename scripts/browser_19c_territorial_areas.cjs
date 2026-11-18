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
   [1800, ['wellesley-cession-1800', 'great-britain-1800-kingdom', 'ireland-1800-kingdom',
    'menorca-1800-third-occupation', 'barbados-continuity-1800', 'grenada-continuity-1800',
    'martinique-occupation-1800', 'tobago-occupation-1800', 'st-lucia-occupation-1800',
    '19CT7-ceylon-maritime-1800', '19CT7-kandy-kingdom-1800', 'upper-canada-1800', 'lower-canada-1800',
    '19CT7-malacca-garrison-fort'],
    ['wellesley-core-1831', 'malacca-mainland-1833-settled', 'uk-great-britain-ireland-union', 'ceylon-crown-island']],
   [1801, ['uk-great-britain-ireland-union', 'martinique-occupation-1800'],
    ['great-britain-1800-kingdom', 'ireland-1800-kingdom']],
   [1802, ['trinidad-1802-cession', '19CT7-ceylon-maritime-1802', '19CT7-kandy-kingdom-1800'],
    ['martinique-occupation-1800', 'tobago-occupation-1800', 'st-lucia-occupation-1800',
     'menorca-1800-third-occupation', '19CT7-ceylon-maritime-1800']],
   [1803, ['tobago-occupation-1803', 'st-lucia-occupation-1803'], ['martinique-occupation-1809']],
   [1806, ['19CT7-malacca-garrison-fort'], ['heligoland-1807-occupation']],
   [1807, ['heligoland-1807-occupation'], ['heligoland-1814-british', '19CT7-malacca-garrison-fort']],
   [1809, ['martinique-occupation-1809', 'lower-canada-1809', 'newfoundland-anticosti-1809'], ['lower-canada-1800']],
   [1814, ['heligoland-1814-british', 'tobago-1814-cession', 'saint-lucia-1814-cession',
    'norfolk-1814-settlement-evacuated'],
    ['heligoland-1807-occupation', 'martinique-occupation-1809', 'norfolk-1800-first-penal']],
   [1815, ['ceylon-crown-island'], ['19CT7-kandy-kingdom-1800', '19CT7-ceylon-maritime-1802']],
   [1819, ['cape-breton-separate-colony'], ['nova-scotia-1820-cape-breton-union']],
   [1820, ['nova-scotia-1820-cape-breton-union'], ['cape-breton-separate-colony']],
   [1824, ['nsw-1800-commission', '19CT7-bencoolen-marlborough-company'], ['tasmania-1825-van-diemens-land']],
   [1825, ['nsw-1825-westward', 'tasmania-1825-van-diemens-land', 'lower-canada-1825', 'norfolk-1825-second-penal-nsw'],
    ['nsw-1800-commission', '19CT7-bencoolen-marlborough-company', 'newfoundland-anticosti-1809']],
   [1826, ['arakan-ramree-island-cession', 'arakan-cheduba-island-cession'], []],
   [1829, ['western-australia-1829-proclamation'], ['western-australia-commission-1831']],
   [1830, ['wellesley-cession-1800'], ['wellesley-core-1831']],
   [1831, ['western-australia-commission-1831', 'wellesley-core-1831'],
    ['western-australia-1829-proclamation', 'wellesley-cession-1800']],
   [1832, ['wellesley-core-1831'], ['malacca-mainland-1833-settled']],
   [1833, ['malacca-mainland-1833-settled'], ['malacca-mainland-1858-india']],
   [1835, ['nsw-1825-westward'], ['south-australia-1836-province']],
   [1836, ['nsw-1836-south-australia', 'south-australia-1836-province'], ['nsw-1825-westward']],
   [1838, [], ['aden-main-1839-company']],
   [1839, ['aden-main-1839-company'], ['aden-main-1858-india']],
   [1840, ['upper-canada-1800', 'lower-canada-1825'], ['hong-kong-island-1841-occupation', 'chatham-1842-annexation']],
   [1841, ['hong-kong-island-1841-occupation', 'province-of-canada-1841'],
    ['hong-kong-island-1842-treaty', 'upper-canada-1800', 'lower-canada-1825']],
   [1842, ['hong-kong-island-1842-treaty', 'chatham-1842-annexation'], ['hong-kong-island-1841-occupation']],
   [1843, ['hong-kong-island-1843-crown'], ['hong-kong-island-1842-treaty']],
   [1850, ['nsw-1836-south-australia'], ['victoria-1851-mainland']],
   [1851, ['victoria-1851-mainland', 'nsw-1851-victoria'], ['nsw-1836-south-australia']],
   [1853, [], ['kuria-muria-1854-cession']],
   [1854, ['kuria-muria-1854-cession'], ['perim-1857-reoccupation']],
   [1857, ['haida-gwaii-colonial-jurisdiction-1853-1857', 'singapore-1826-straits-company',
    'perim-1857-reoccupation', 'aden-main-1839-company'], ['british-columbia-mainland-1858']],
   [1858, ['british-columbia-mainland-1858', 'haida-gwaii-colonial-jurisdiction-1858-1862',
    'singapore-1858-straits-india', 'malacca-mainland-1858-india', 'perim-1858-aden-dependency', 'aden-main-1858-india'],
    ['haida-gwaii-colonial-jurisdiction-1853-1857', 'singapore-1826-straits-company', 'malacca-mainland-1833-settled',
     'perim-1857-reoccupation', 'aden-main-1839-company']],
   [1859, ['queensland-1859-separation', 'borneo-labuan-island', 'british-columbia-mainland-1858'],
    ['borneo-labuan-1860', 'kowloon-south-1860-cession', 'stonecutters-1860-cession']],
   [1860, ['borneo-labuan-1860', 'cape-kaffraria-1860', 'kowloon-south-1860-cession', 'stonecutters-1860-cession',
    'aden-main-1858-india', 'perim-1858-aden-dependency', 'kuria-muria-1854-cession'], ['borneo-labuan-island']],
   [1861, ['south-australia-1861-southern', 'kowloon-south-1861-hong-kong', 'stonecutters-1861-hong-kong'],
    ['south-australia-1836-province', 'kowloon-south-1860-cession', 'stonecutters-1860-cession']],
   [1862, ['queensland-1862-western-extension', 'nsw-1862-queensland-westward'], ['queensland-1859-separation']],
   [1863, ['south-australia-northern-territory-1863', 'nsw-1863-northern-territory-transfer', 'british-columbia-mainland-1863-boundary',
    'haida-gwaii-colonial-jurisdiction-1863-1865'], ['nsw-1862-queensland-westward', 'british-columbia-mainland-1858']],
   [1864, [], ['tauranga-proclaimed-1865', 'taranaki-waitara-south-1865', 'taranaki-ngatiruanui-coast-1865',
    'waikato-confiscated-1865']],
   [1865, ['tauranga-proclaimed-1865', 'taranaki-waitara-south-1865', 'taranaki-oakura-1865',
    'taranaki-ngatiawa-coast-1865', 'taranaki-ngatiruanui-coast-1865', 'waikato-confiscated-1865'],
    ['tauranga-revised-1868', 'eastern-bay-of-plenty-raupatu-1866']],
   [1866, ['cape-kaffraria-1866', 'british-columbia-united-colony', 'eastern-bay-of-plenty-raupatu-1866'],
    ['cape-kaffraria-1860', 'vancouver-island-separate-colony', 'haida-gwaii-colonial-jurisdiction-1863-1865']],
   [1867, ['singapore-1867-straits-crown', 'penang-1867-straits-crown', 'malacca-mainland-1867-crown',
    'taranaki-ngatiruanui-coast-1867'],
    ['singapore-1858-straits-india', 'penang-1858-straits-india', 'malacca-mainland-1858-india',
     'taranaki-ngatiruanui-coast-1865']],
   [1868, ['wellesley-core-1831', 'tauranga-revised-1868'],
    ['wellesley-redemarcation-1869', 'tauranga-proclaimed-1865', 'tauranga-retained-confiscated-block',
     'basutoland-aliwal-north-1869', 'little-aden-1869-purchase']],
   [1869, ['wellesley-redemarcation-1869', 'tauranga-retained-confiscated-block', 'basutoland-aliwal-north-1869',
    'little-aden-1869-purchase'],
    ['wellesley-core-1831', 'basutoland-leribe-return-1870']],
   [1870, ['chatham-1870-land-court', 'basutoland-leribe-return-1870'],
    ['chatham-1854-resident-magistrate', 'basutoland-aliwal-north-1869']],
   [1871, ['british-columbia-1871-province', 'basutoland-cape-annexation-1871', 'griqualand-west-british-1871'],
    ['british-columbia-united-colony', 'basutoland-leribe-return-1870']],
   [1873, ['wellesley-redemarcation-1869', 'griqualand-west-crown-1873'],
    ['wellesley-pangkor-1874', 'pangkor-islands-1874-straits', 'griqualand-west-british-1871']],
   [1874, ['wellesley-pangkor-1874', 'pangkor-islands-1874-straits'], ['wellesley-redemarcation-1869']],
   [1876, ['griqualand-west-east-boundary-1876'], ['griqualand-west-crown-1873']],
   [1877, ['canada-nwt-1876-era', 'keewatin-1876-phase'], [colony, 'cape-kaffraria-1866']],
   [1879, [colony, 'canada-nwt-1876-era'], ['canada-nwt-1880-arctic-transfer']],
   [1880, ['rotuma-1880-fiji-proclamation', 'griqualand-west-cape-1880'],
    ['rotuma-1881-fiji-cession', 'griqualand-west-east-boundary-1876']],
   [1881, ['manitoba-1881-expansion', 'manitoba-ontario-disputed-area', 'rotuma-1881-fiji-cession'],
    ['manitoba-1870-postage-stamp', 'rotuma-1880-fiji-proclamation']],
   [1882, ['canada-nwt-1882-districting', 'saskatchewan-1882-district'], ['canada-nwt-1880-arctic-transfer']],
   [1884, ['basutoland-high-commission-1884'],
    ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation', 'basutoland-cape-annexation-1871']],
   [1885, ['mandalay-walled-city-garrison', 'png-1885-protectorate-delimitation'], ['png-1888-separate-possession']],
   [1886, ['socotra-1886-protectorate'], []],
   [1887, ['kermadec-1887-annexation'], []],
   [1888, ['png-1888-separate-possession'], ['png-1885-protectorate-delimitation']],
   [1889, ['manitoba-1889-confirmed', 'trinidad-tobago-1889-union', 'ontario-1889-boundary-act', 'canada-nwt-1889-ontario-boundary', 'heligoland-1814-british'],
    ['manitoba-ontario-disputed-area', 'trinidad-1802-cession', 'tobago-1814-cession', 'canada-nwt-1882-districting',
     'zanzibar-unguja-1890-protectorate', 'zanzibar-pemba-1890-protectorate']],
   [1890, ['borneo-labuan-1890', 'zanzibar-unguja-1890-protectorate', 'zanzibar-pemba-1890-protectorate'],
    ['borneo-labuan-1860', 'heligoland-1814-british']],
   [1891, ['basutoland-quaneka-marker-1891'],
    ['gilbert-1892-protectorate', 'ellice-1892-protectorate', 'basutoland-high-commission-1884']],
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

  for (const [year, lat, lon, zoom, title, source, screenshot] of [
   [1839, 12.7920, 45.0264, 11, /亚丁半岛 · 英军占领与公司管辖/,
    'https://dl.tufts.edu/downloads/6108vp897?filename=9g54xw036.pdf', 'aden'],
   [1857, 12.6506, 43.4295, 11, /佩里姆岛 · 英方再占领/,
    'https://www.qdl.qa/archive/81055/vdc_100107714444.0x0000ad', 'perim'],
   [1865, -37.5255, 175.0683, 8, /怀卡托及奥克兰南部 · 1865年累计没收范围/,
    'https://forms.justice.govt.nz/search/Documents/WT/wt_DOC_68330839/Hauraki%20Vol%201.pdf#page=256', 'waikato'],
   [1866, -37.9844, 176.8500, 8, /丰盛湾东部 · 1866年修订没收区/,
    'https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1866/1866%20ISSUE%20051.pdf', 'eastern-bay-of-plenty'],
   [1867, -39.5003, 174.1992, 9, /恩加蒂鲁阿努伊海岸 · 怀托塔拉以南撤销后/,
    'https://forms.justice.govt.nz/search/Documents/WT/wt_DOC_68453721/Taranaki%201996.compressed.pdf#page=142', 'taranaki'],
   [1868, -37.6809, 175.9530, 9, /陶朗加大陆 · 1868年重划没收区/,
    'https://www.legislation.govt.nz/act/public/1868/35/en/1868-10-16/official_scan.pdf', 'tauranga'],
   [1876, -28.6275, 23.5119, 7, /格里夸兰西 · 东界协定/,
    'https://archive.org/details/mapofafricabytr01hert/page/215/mode/2up', 'griqualand-west'],
   [1884, -29.6599, 28.1448, 7, /巴苏陀兰 · 英国高级专员管辖/,
    'https://www.loc.gov/item/98681209/', 'basutoland'],
   [1889, 54.1829, 7.8853, 13, /赫尔戈兰主岛 · 英国统治/,
    'https://www.legislation.gov.uk/ukpga/Vict/53-54/32/pdfs/ukpga_18900032_en.pdf', 'heligoland'],
   [1890, -5.16, 39.77, 9, /奔巴主岛 · 桑给巴尔苏丹辖下的英国保护地/,
    'https://history.state.gov/historicaldocuments/frus1890/d292', 'pemba']
  ]) {
   await page.goto(root + '?year=' + year, { waitUntil: 'domcontentloaded' });
   await page.waitForFunction(value => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
    window.atlasStoryBridge.currentYear() === value, year);
   await page.locator('#mapLayerEvents').uncheck();
   await page.evaluate(([y, x, value]) =>
    window.__historicOverlapHost.map.setView([y, x], value, { animate: false }), [lat, lon, zoom]);
   await clickAreaAt(lat, lon);
   await drawer.waitFor();
   assert.match(await drawer.textContent(), title);
   await drawer.locator('.atlas-18c-overlap-trigger', { hasText: title }).click();
   await drawer.locator('summary').click();
   assert(await drawer.locator('a[href="' + source + '"]').isVisible(), 'Missing archive link for ' + screenshot);
   await page.screenshot({ path: join(screenshotDir, '19c-territory-' + year + '-' + screenshot + '-dossier.png') });
  }

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

  await page.goto(root + '?year=1703', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   window.eighteenthMassSpatial?.getAudit().loaded && window.eighteenthOverlapDossier?.getAudit().loaded &&
   window.atlasStoryBridge.currentYear() === 1703, undefined, { timeout: 45000 });
  await page.locator('#mapLayerEvents').uncheck();
  const outline = page.locator('.atlas-18c-source-outline');
  const preGibraltarOutlines = await outline.count();
  await jump(1704);
  assert.equal(await outline.count(), preGibraltarOutlines + 1);
  assert((await outline.evaluateAll(paths => paths.some(path => path.getAttribute('stroke-dasharray') === '5 6'))));
  const historicalHit = (lat, lng) => page.evaluate(([y, x]) => window.eighteenthOverlapDossier.hitCountAt(y, x), [lat, lng]);
  assert.equal(await historicalHit(36.1408, -5.3526), 1);
  assert.equal(await historicalHit(36.147, -5.354), 0);
  await jump(1713);
  await page.evaluate(() => window.__historicOverlapHost.map.setView([36.130, -5.345], 10, { animate: false }));
  await clickAreaAt(36.130, -5.345);
  const mediterraneanDrawer = page.locator('#atlas18cOverlapPanel');
  const gibraltarCard = mediterraneanDrawer.locator('[data-overlap-id="18c:GIBRALTAR_PENINSULA"]');
  await gibraltarCard.waitFor();
  assert.match(await gibraltarCard.textContent(), /乌得勒支和约割让/);
  await gibraltarCard.locator('summary').click();
  assert(await gibraltarCard.locator('a[href*="36615.htm"]').isVisible());
  await jump(1756);
  await page.evaluate(() => window.__historicOverlapHost.map.setView([39.982, 4.09], 8, { animate: false }));
  assert.equal(await historicalHit(40.07, 3.82), 0);
  await clickAreaAt(39.982, 4.09);
  const menorcaCard = mediterraneanDrawer.locator('[data-overlap-id="18c:MENORCA_ISLAND"]');
  await menorcaCard.waitFor();
  assert.match(await menorcaCard.textContent(), /法国占领/);
  await menorcaCard.locator('.atlas-18c-overlap-title').hover();
  assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
  for (const [year, title] of [[1763, /英国接收/], [1782, /西班牙管辖/], [1798, /英军第三次占领/]]) {
   await jump(year);
   assert.match(await menorcaCard.textContent(), title);
  }
  await page.screenshot({ path: join(screenshotDir, '18c-mediterranean-1798-menorca.png') });

  await page.goto(root + '?year=1713', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   window.eighteenthMassSpatial?.getAudit().loaded && window.eighteenthOverlapDossier?.getAudit().loaded &&
   window.atlasStoryBridge.currentYear() === 1713, undefined, { timeout: 45000 });
  await page.locator('#mapLayerEvents').uncheck();
  const atlantic = () => page.evaluate(() => window.eighteenthMassSpatial.getAudit());
  const coast = page.locator('.atlas-18c-treaty-shore');
  const shownSite = page.locator('.atlas-18c-regional-site');
  const dossierTitle = page.locator('#dossierBody h2');
  const setView = ([lat, lon, zoom]) => page.evaluate(([y, x, z]) =>
   window.__historicOverlapHost.map.setView([y, x], z, { animate: false }), [lat, lon, zoom]);
  assert.equal(await shownSite.count(), 0);
  assert.deepEqual((await atlantic()).activeCoastalRights, ['NF_FRENCH_SHORE_1713']);
  assert.equal(await coast.getAttribute('stroke-dasharray'), '6 5');
  await setView([47.25098, -53.97172, 10]);
  await clickAreaAt(47.25098, -53.97172);
  await dossierTitle.filter({ hasText: '条约与先遣驻军' }).waitFor();
  await jump(1714);
  await setView([47.25098, -53.97172, 10]);
  await clickAreaAt(47.25098, -53.97172);
  await dossierTitle.filter({ hasText: '普拉森舍皇家堡 · 交接完成' }).waitFor();
  await jump(1715);
  assert(!(await atlantic()).activeRegionalSites.includes('PLACENTIA_FORT_ROYAL'));
  await jump(1762);
  assert((await atlantic()).activeRegionalSites.includes('PLACENTIA_FORT_ROYAL'));
  await jump(1726);
  await setView([44.74169, -65.51969, 10]);
  await clickAreaAt(44.74169, -65.51969);
  const treatyCard = page.locator('[data-overlap-id="18c:FORT_ANNE_FLAG_BASTION_1726"]');
  await treatyCard.waitFor();
  assert.match(await treatyCard.textContent(), /西面旗堡缔约地/);
  assert(!(await page.locator('[data-overlap-id="18c:B36-Z001"]').count()));
  await jump(1782);
  await setView([57.008, -92.2955, 10]);
  await clickAreaAt(57.008, -92.2955);
  await dossierTitle.filter({ hasText: '约克堡旧址 · 法军袭击与毁堡' }).waitFor();
  await jump(1783);
  assert.deepEqual((await atlantic()).activeCoastalRights, ['NF_FRENCH_SHORE_1783']);
  await setView([49.999829, -55.523341, 8]);
  await clickAreaAt(49.999829, -55.523341);
  await dossierTitle.filter({ hasText: '圣约翰角至雷角' }).waitFor();
  await page.screenshot({ path: join(screenshotDir, '18c-atlantic-1783-treaty-shore.png') });
  await page.locator('#mapLayerTerritory').uncheck();
  assert.equal(await coast.count(), 0);
  await page.locator('#mapLayerTerritory').check();
  assert.equal(await coast.count(), 1);
  await jump(1800);
  assert((await ids()).includes('annapolis-fort-anne-1800'));
  assert.equal(await coast.count(), 1);
  await jump(1854);
  assert(!(await ids()).includes('annapolis-fort-anne-1800'));
  await jump(1904);
  assert.equal(await coast.count(), 0);

  await jump(1712);
  assert(!(await atlantic()).activeZones.includes('CAPE_BRETON'));
  await jump(1713);
  await setView([46.295, -60.927928, 8]);
  await clickAreaAt(46.295, -60.927928);
  const capeBreton = page.locator('[data-overlap-id="18c:CAPE_BRETON"]');
  await capeBreton.waitFor();
  assert.match(await capeBreton.textContent(), /乌得勒支和约确认法方权利/);
  await setView([45.891667, -59.982778, 11]);
  await clickAreaAt(45.891667, -59.982778);
  await dossierTitle.filter({ hasText: '路易堡 · 法国初设港站' }).waitFor();
  await jump(1719);
  assert((await atlantic()).activeRegionalSites.includes('LOUISBOURG_EARLY_PORT'));
  assert(!(await atlantic()).activeRegionalZones.includes('LOUISBOURG_WALLED_TOWN'));
  await jump(1724);
  await clickAreaAt(45.909214, -59.97979);
  await dossierTitle.filter({ hasText: '皇家炮台 · 法军开工' }).waitFor();
  await setView([45.8921228, -59.9827624, 15]);
  assert.equal(await page.evaluate(() => window.atlasReadViewport().zoom), 15);
  const louisbourg = page.locator('[data-overlap-id="18c:LOUISBOURG_WALLED_TOWN"]');
  for (const [year, title] of [[1744, /法军驻守/], [1745, /英军接管/], [1748, /条约议定归还/],
   [1749, /法军恢复驻防/], [1758, /英军再次接管/]]) {
   await jump(year);
   assert((await atlantic()).activeRegionalZones.includes('LOUISBOURG_WALLED_TOWN'));
   assert(!(await atlantic()).activeRegionalSites.includes('LOUISBOURG_EARLY_PORT'));
   await clickAreaAt(45.8921228, -59.9827624);
   await louisbourg.waitFor();
   assert.match(await louisbourg.textContent(), title);
   for (const obsolete of ['B36-Z008', 'B36-P008', 'LOUISBOURG', 'NS_MAIN', 'NS_REVISED']) {
    assert.equal(await page.locator('[data-overlap-id="18c:' + obsolete + '"]').count(), 0);
   }
  }
  await louisbourg.locator('.atlas-18c-overlap-title').hover();
  assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
  await page.screenshot({ path: join(screenshotDir, '18c-louisbourg-1758-walled-town.png') });
  await jump(1760);
  assert(!(await atlantic()).activeRegionalZones.includes('LOUISBOURG_WALLED_TOWN'));
  await clickAreaAt(45.891667, -59.982778);
  await dossierTitle.filter({ hasText: '路易堡 · 拆防与驻军留守' }).waitFor();
  await jump(1768);
  await clickAreaAt(45.891667, -59.982778);
  await dossierTitle.filter({ hasText: '路易堡 · 英军撤离后的旧城遗址' }).waitFor();

  await jump(1749);
  await setView([45.847633, -64.262064, 15]);
  await clickAreaAt(45.847633, -64.262064);
  await dossierTitle.filter({ hasText: '博巴桑 · 阿卡迪亚村庄' }).waitFor();
  await jump(1750);
  await clickAreaAt(45.847633, -64.262064);
  await dossierTitle.filter({ hasText: '博巴桑 · 焚村与居民外逃' }).waitFor();
  await jump(1755);
  await clickAreaAt(45.8474984, -64.2617181);
  const lawrenceCard = page.locator('[data-overlap-id="18c:FORT_LAWRENCE_DITCH"]');
  await lawrenceCard.waitFor();
  assert.match(await lawrenceCard.textContent(), /拘押与越狱/);
  assert.match(await lawrenceCard.textContent(), /10月13日/);
  await jump(1756);
  assert(!(await atlantic()).activeRegionalZones.includes('FORT_LAWRENCE_DITCH'));
  await clickAreaAt(45.847762, -64.26171);
  await dossierTitle.filter({ hasText: '劳伦斯堡 · 拆除' }).waitFor();
  await setView([46.043211, -64.070743, 13]);
  await clickAreaAt(46.043211, -64.070743);
  await dossierTitle.filter({ hasText: '蒙克顿堡 · 英军撤出并焚毁' }).waitFor();

  await jump(1755);
  await setView([45.887, -64.246, 13]);
  await clickAreaAt(45.887, -64.246);
  await dossierTitle.filter({ hasText: '庞特阿布奥渡口一带 · 英军过河' }).waitFor();
  await setView([45.866963, -64.371598, 13]);
  await clickAreaAt(45.866963, -64.371598);
  await dossierTitle.filter({ hasText: '韦斯特科克 · 英军焚毁民居' }).waitFor();

  const cumberlandCenter = [45.8646248, -64.2914647];
  await setView([...cumberlandCenter, 16]);
  for (const [year, title] of [[1751, /法方驻守/], [1755, /接管与强制驱逐/], [1768, /主力撤走/],
   [1776, /重新进驻/], [1784, /修缮后的英方主堡/], [1799, /看守驻地/]]) {
   await jump(year);
   const id = year < 1755 ? 'FORT_BEAUSEJOUR_FRENCH' :
    year < 1784 ? 'FORT_BEAUSEJOUR_CUMBERLAND' : 'FORT_CUMBERLAND_REBUILT';
   assert((await atlantic()).activeRegionalZones.includes(id));
   await clickAreaAt(...cumberlandCenter);
   const cumberland = page.locator('[data-overlap-id="18c:' + id + '"]');
   await cumberland.waitFor();
   assert.match(await cumberland.textContent(), title);
   assert.equal(await page.locator('[data-overlap-id="18c:B36-Z003"]').count(), 0);
   if (year === 1755) {
    assert.match(await cumberland.textContent(), /四百余人/);
    await cumberland.locator('.atlas-18c-overlap-title').hover();
    assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
    await page.screenshot({ path: join(screenshotDir, '18c-chignecto-1755-cumberland.png') });
   }
  }
  await jump(1800);
  assert((await ids()).includes('fort-cumberland-1800'));
  await clickAreaAt(...cumberlandCenter);
  const nextCumberland = page.locator('[data-historic-overlap-id$=":fort-cumberland-1800"]');
  await nextCumberland.waitFor();
  assert.match(await nextCumberland.textContent(), /看守驻地/);
  await jump(1809);
  await clickAreaAt(...cumberlandCenter);
  assert.match(await nextCumberland.textContent(), /英军再次进驻/);
  await jump(1812);
  await clickAreaAt(...cumberlandCenter);
  assert.match(await nextCumberland.textContent(), /战争期间增兵/);
  await jump(1835);
  assert(!(await ids()).includes('fort-cumberland-1800'));

  const fredericaCenter = [31.2238567, -81.392998];
  await jump(1735);
  assert(!(await atlantic()).activeRegionalZones.includes('FORT_FREDERICA_MAIN'));
  await setView([...fredericaCenter, 16]);
  for (const [year, title] of [[1736, /英方筑堡/], [1740, /英方加固主堡/],
   [1749, /主力解散后小部驻守/], [1756, /防御拆卸后的旧址/],
   [1762, /英方短暂修缮/], [1763, /最后一批常驻士兵撤出/], [1776, /革命方调走军械/]]) {
   await jump(year);
   await clickAreaAt(...fredericaCenter);
   const frederica = page.locator('[data-overlap-id="18c:FORT_FREDERICA_MAIN"]');
   await frederica.waitFor();
   assert.match(await frederica.textContent(), title);
  }
  await setView([31.22386, -81.3913, 15]);
  await jump(1742);
  assert(!(await atlantic()).activeRegionalZones.includes('FREDERICA_TOWN_ENCLOSURE'));
  for (const [year, title] of [[1743, /镇防外廓/], [1758, /大火与镇址遗存/]]) {
   await jump(year);
   await clickAreaAt(31.22386, -81.3913);
   const town = page.locator('[data-overlap-id="18c:FREDERICA_TOWN_ENCLOSURE"]');
   await town.waitFor();
   assert.match(await town.textContent(), title);
  }
  await jump(1799);
  assert(!(await atlantic()).activeRegionalZones.includes('FORT_FREDERICA_MAIN'));

  const castilloCenter = [29.89784, -81.31149];
  const matanzasCenter = [29.71524, -81.23902];
  await setView([...castilloCenter, 16]);
  for (const [year, title] of [[1700, /西班牙石堡/], [1740, /英军围城，西班牙守住主堡/],
   [1763, /英军接管/], [1783, /约定归还，英军仍守/], [1784, /西班牙恢复驻防/], [1799, /西班牙恢复驻防/]]) {
   await jump(year);
   await clickAreaAt(...castilloCenter);
   const castillo = page.locator('[data-overlap-id="18c:CASTILLO_SAN_MARCOS"]');
   await castillo.waitFor();
   assert.match(await castillo.textContent(), title);
   for (const id of ['B36-Z046', 'B36-P046', 'ST_AUGUSTINE']) {
    assert.equal(await page.locator('[data-overlap-id="18c:' + id + '"]').count(), 0);
   }
   if (year === 1763) {
    await castillo.locator('details summary').click();
    assert(await castillo.locator('a[href*="paris763.asp"]').isVisible());
    await castillo.locator('.atlas-18c-overlap-title').hover();
    assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
   }
  }
  const moseCenter = [29.9278, -81.3253];
  await jump(1740);
  assert(!(await atlantic()).activeRegionalSites.includes('FORT_MOSE_SECOND'));
  await setView([...moseCenter, 6]);
  await jump(1752);
  assert((await atlantic()).activeRegionalSites.includes('FORT_MOSE_SECOND'));
  assert.equal(await shownSite.count(), 0);
  await setView([...moseCenter, 15]);
  await clickAreaAt(...moseCenter);
  await dossierTitle.filter({ hasText: '莫塞堡 · 自由黑人聚落与驻防' }).waitFor();
  await jump(1763);
  await clickAreaAt(...moseCenter);
  await dossierTitle.filter({ hasText: '莫塞堡 · 社区迁往古巴' }).waitFor();
  for (const [year, title] of [[1764, '英军驻守第二处堡址'], [1775, '英军拆除部分堡体']]) {
   await jump(year);
   await clickAreaAt(...moseCenter);
   await dossierTitle.filter({ hasText: title }).waitFor();
  }
  await jump(1776);
  assert(!(await atlantic()).activeRegionalSites.includes('FORT_MOSE_SECOND'));

  await jump(1741);
  assert(!(await atlantic()).activeRegionalZones.includes('FORT_MATANZAS'));
  await setView([...matanzasCenter, 17]);
  for (const [year, title] of [[1742, /西班牙驻防/], [1783, /英军仍守/], [1784, /西班牙接收/],
   [1799, /修缮地基/]]) {
   await jump(year);
   await clickAreaAt(...matanzasCenter);
   const matanzas = page.locator('[data-overlap-id="18c:FORT_MATANZAS"]');
   await matanzas.waitFor();
   assert.match(await matanzas.textContent(), title);
  }
  for (const [year, title] of [[1800, /西班牙驻防/], [1809, /局部坍塌与修复/], [1821, /美国接收/]]) {
   await jump(year);
   assert((await ids()).includes('fort-matanzas-1800'));
   await clickAreaAt(...matanzasCenter);
   const matanzas = page.locator('[data-historic-overlap-id$=":fort-matanzas-1800"]');
   await matanzas.waitFor();
   assert.match(await matanzas.textContent(), title);
  }
  await setView([...castilloCenter, 16]);
  for (const [year, title] of [[1800, /西班牙驻防延续/], [1819, /割让条约与实际接收之间/], [1821, /美国接收/]]) {
   await jump(year);
   assert((await ids()).includes('castillo-san-marcos-1800'));
   await clickAreaAt(...castilloCenter);
   const castillo = page.locator('[data-historic-overlap-id$=":castillo-san-marcos-1800"]');
   await castillo.waitFor();
   assert.match(await castillo.textContent(), title);
  }

  const santiagoCenter = [9.5538067, -79.6584031];
  await setView([...santiagoCenter, 16]);
  for (const [year, title] of [[1738, /西班牙驻防/], [1739, /英军接收与破坏/]]) {
   await jump(year);
   await clickAreaAt(...santiagoCenter);
   const santiago = page.locator('[data-overlap-id="18c:PORTOBELO_SANTIAGO_OLD"]');
   await santiago.waitFor();
   assert.match(await santiago.textContent(), title);
  }
  const ironFortCenter = [9.55795, -79.6768];
  await setView([...ironFortCenter, 14]);
  await clickAreaAt(...ironFortCenter);
  await dossierTitle.filter({ hasText: '铁堡 · 英军攻占后拆防' }).waitFor();
  const sanJeronimoCenter = [9.55559, -79.65534];
  await setView([...sanJeronimoCenter, 16]);
  await clickAreaAt(...sanJeronimoCenter);
  await dossierTitle.filter({ hasText: '圣赫罗尼莫旧炮台 · 攻港时火炮已卸架' }).waitFor();
  await jump(1740);
  assert(!(await atlantic()).activeRegionalSites.includes('PORTOBELO_CASTILLO_DEL_FIERRO'));
  assert(!(await atlantic()).activeRegionalZones.includes('PORTOBELO_SANTIAGO_OLD'));

  const sanLuis = { id: 'BOCACHICA_SAN_LUIS_OLD', point: [10.3202665, -75.5831261] };
  const oldSanJose = { id: 'BOCACHICA_SAN_JOSE_OLD', point: [10.31401, -75.5785224] };
  for (const { id, point } of [sanLuis, oldSanJose]) {
   await setView([...point, 16]);
   for (const [year, title] of [[1740, /西班牙/], [1741, /4月5日/]]) {
    await jump(year);
    assert((await atlantic()).activeRegionalZones.includes(id));
    await clickAreaAt(...point);
    const fort = page.locator('[data-overlap-id="18c:' + id + '"]');
    await fort.waitFor();
    assert.match(await fort.textContent(), title);
   }
  }
  await jump(1742);
  assert(!(await atlantic()).activeRegionalZones.includes(sanLuis.id));
  assert(!(await atlantic()).activeRegionalZones.includes(oldSanJose.id));
  const rebuiltSanJose = [10.314321, -75.5783776];
  await setView([...rebuiltSanJose, 16]);
  const reconstructionSite = 'BOCACHICA_SAN_JOSE_RECONSTRUCTION_SITE';
  await jump(1750);
  assert(!(await atlantic()).activeRegionalSites.includes(reconstructionSite));
  for (const [year, title] of [[1751, '圣何塞堡 · 西班牙重筑工程'],
   [1759, '圣何塞堡 · 重筑完成'], [1777, '圣何塞堡 · 重筑完成']]) {
   await jump(year);
   const active = await atlantic();
   assert(active.activeRegionalSites.includes(reconstructionSite));
   assert(!active.activeRegionalZones.includes('BOCACHICA_SAN_JOSE_REBUILT'));
   await clickAreaAt(...rebuiltSanJose);
   await dossierTitle.filter({ hasText: title }).waitFor();
  }
  for (const year of [1778, 1799]) {
   await jump(year);
   assert(!(await atlantic()).activeRegionalSites.includes(reconstructionSite));
   await clickAreaAt(...rebuiltSanJose);
   const fort = page.locator('[data-overlap-id="18c:BOCACHICA_SAN_JOSE_REBUILT"]');
   await fort.waitFor();
   assert.match(await fort.textContent(), /西班牙重筑炮台/);
  }
  for (const [year, title] of [[1800, /西班牙外湾防线/], [1815, /12月7日/], [1821, /7月6日/]]) {
   await jump(year);
   assert((await ids()).includes('bocachica-san-jose-1800'));
   await clickAreaAt(...rebuiltSanJose);
   const fort = page.locator('[data-historic-overlap-id$=":bocachica-san-jose-1800"]');
   await fort.waitFor();
   assert.match(await fort.textContent(), title);
  }

  const boneteCenter = [10.4220056, -75.5390059];
  await jump(1739);
  assert(!(await atlantic()).activeRegionalZones.includes('CARTAGENA_SAN_FELIPE_BONETE'));
  await setView([...boneteCenter, 17]);
  for (const [year, title] of [[1740, /西班牙山顶驻堡/], [1741, /西班牙守住山顶旧堡/],
   [1762, /旧堡与山坡防御增建/], [1799, /西班牙山顶驻堡/]]) {
   await jump(year);
   assert((await atlantic()).activeRegionalZones.includes('CARTAGENA_SAN_FELIPE_BONETE'));
   await clickAreaAt(...boneteCenter);
   const bonete = page.locator('[data-overlap-id="18c:CARTAGENA_SAN_FELIPE_BONETE"]');
   await bonete.waitFor();
   assert.match(await bonete.textContent(), title);
   if (year === 1741) {
    assert.match(await bonete.textContent(), /4月20日/);
    await bonete.locator('details summary').click();
    assert(await bonete.locator('a[href*="MANUAL-DE-USO-2.pdf"]').isVisible());
    await bonete.locator('.atlas-18c-overlap-title').hover();
    assert((await page.locator('.atlas-18c-overlap-glow').count()) > 0);
    await page.screenshot({ path: join(screenshotDir, '18c-cartagena-1741-bonete.png') });
   }
  }
  assert.equal(await historicalHit(10.42284, -75.53855), 0);
  for (const [year, title] of [[1800, /西班牙驻防延续/], [1811, /独立政府管辖/], [1815, /西班牙围城后接收/],
   [1821, /共和国接收卡塔赫纳城防/]]) {
   await jump(year);
   assert((await ids()).includes('cartagena-san-felipe-bonete-1800'));
   await clickAreaAt(...boneteCenter);
   const bonete = page.locator('[data-historic-overlap-id$=":cartagena-san-felipe-bonete-1800"]');
   await bonete.waitFor();
   assert.match(await bonete.textContent(), title);
  }

  // Lake Ontario. These coordinates lie inside the mapped fort or an individual barrack.
  for (const { point, stages } of [
   { point: [43.4616497, -76.5142832], stages: [[1727, 'OSWEGO_STONE_REDOUT', /石砌堡屋/],
    [1755, 'OSWEGO_WEST_EARTHWORKS', /西岸增筑土垒/], [1756, 'OSWEGO_WEST_EARTHWORKS', /法军攻取后拆除/]] },
   { point: [43.4658875, -76.5082375], stages: [[1755, 'FORT_ONTARIO_FIRST', /第一期木栅堡/],
    [1763, 'FORT_ONTARIO_SECOND', /间歇驻防/], [1778, 'FORT_ONTARIO_SECOND', /堡垒被焚/],
    [1782, 'FORT_ONTARIO_THIRD', /英军重筑/], [1796, 'FORT_ONTARIO_THIRD', /美军接收/]] },
   { point: [44.2334986, -76.4785832], stages: [[1758, 'FORT_FRONTENAC_FRENCH_WALLS', /夺取船只/],
    [1759, 'FORT_FRONTENAC_FRENCH_WALLS', /旧堡遗址/]] },
   { point: [44.2333329, -76.4785073], stages: [[1799, 'FORT_FRONTENAC_BRITISH_BARRACKS', /桥头营房/]] },
   { point: [43.2630097, -79.0641267], stages: [[1726, 'FORT_NIAGARA_FRENCH_HOUSE', /法国石屋与贸易站/]] },
   { point: [43.2629078, -79.0634523], stages: [[1759, 'FORT_NIAGARA_MAIN', /7月25日法军投降/],
    [1783, 'FORT_NIAGARA_MAIN', /和约后英军延迟撤离/], [1796, 'FORT_NIAGARA_MAIN', /美军接收/]] },
   { point: [43.2499284, -79.0601398], stages: [[1796, 'FORT_GEORGE_NIAGARA_MAGAZINE', /西岸建火药库/]] },
   { point: [43.2507592, -79.0612168], stages: [[1799, 'FORT_GEORGE_NIAGARA_MAIN', /六棱堡防线施工/]] },
  ]) {
   await setView([...point, 16]);
   for (const [year, id, title] of stages) {
    await jump(year);
    assert((await atlantic()).activeRegionalZones.includes(id));
    assert(!(await atlantic()).activeSites.includes('NIAGARA_BRITISH'));
    await clickAreaAt(...point);
    const record = page.locator('[data-overlap-id="18c:' + id + '"]');
    await record.waitFor();
    assert.match(await record.textContent(), title);
   }
  }
  const westGeorge = [43.4600667, -76.5195167];
  await jump(1756);
  await setView([...westGeorge, 15]);
  await clickAreaAt(...westGeorge);
  await dossierTitle.filter({ hasText: '奥斯威戈乔治堡 · 河口失守后拆除' }).waitFor();
  await jump(1757);
  assert(!(await atlantic()).activeRegionalSites.includes('OSWEGO_FORT_GEORGE_SITE'));
  assert(!(await atlantic()).activeRegionalZones.includes('FORT_ONTARIO_FIRST'));
  await jump(1759);
  assert((await atlantic()).activeRegionalSites.includes('FORT_ONTARIO_SECOND_CONSTRUCTION'));
  await jump(1763);
  assert(!(await atlantic()).activeRegionalSites.includes('FORT_ONTARIO_SECOND_CONSTRUCTION'));

  for (const { point, stages } of [
   { point: [43.4659353, -76.5083256], stages: [[1800, 'oswego-fort-ontario-third-1800', /美军驻守延续/],
    [1814, 'oswego-fort-ontario-third-1800', /英军突袭拆防后撤回加拿大/]] },
   { point: [44.2333329, -76.4785073], stages: [[1800, 'frontenac-tete-de-pont-1800', /英军继续驻守/],
    [1812, 'frontenac-tete-de-pont-1800', /英美战争期间驻用/]] },
   { point: [43.2629078, -79.0634523], stages: [[1800, 'fort-niagara-east-bank-1800', /美军驻守延续/],
    [1813, 'fort-niagara-east-bank-1800', /英军夜渡夺堡/], [1815, 'fort-niagara-east-bank-1800', /5月22日美军复驻/]] },
   { point: [43.2507592, -79.0612168], stages: [[1800, 'fort-george-niagara-main-1800', /继续施工/],
    [1813, 'fort-george-niagara-main-1800', /美军攻占后撤离/]] },
   { point: [43.2511058, -79.061725], stages: [[1814, 'fort-george-niagara-reduced', /缩小后的工事/]] },
  ]) {
   await setView([...point, 16]);
   for (const [year, id, title] of stages) {
    await jump(year);
    assert((await ids()).includes(id));
    await clickAreaAt(...point);
    const record = page.locator('[data-historic-overlap-id$=":' + id + '"]');
    await record.waitFor();
    assert.match(await record.textContent(), title);
   }
  }
  await jump(1814);
  assert(!(await ids()).includes('fort-george-niagara-main-1800'));
  await jump(1828);
  assert(!(await ids()).includes('fort-george-niagara-reduced'));

  // Saint Lawrence: distinct dated plans on the same island, and cities changing hands.
  for (const { point, stages } of [
   { point: [46.8119093, -71.2084106], stages: [[1759, 'QUEBEC_UPPER_TOWN_CORE', /9月18日英军接收/],
    [1760, 'QUEBEC_UPPER_TOWN_CORE', /圣福瓦战败后据城/], [1775, 'QUEBEC_UPPER_TOWN_CORE', /大陆军攻城失败/]] },
   { point: [45.5059843, -73.5551906], stages: [[1760, 'MONTREAL_STONE_ENCEINTE', /9月8日英军接收/],
    [1775, 'MONTREAL_STONE_ENCEINTE', /大陆军进城/], [1776, 'MONTREAL_STONE_ENCEINTE', /6月15日英军复入/]] },
   { point: [44.74099, -75.44107], stages: [[1760, 'FORT_LEVIS_FRENCH_WORKS', /8月25日法军投降/],
    [1761, 'FORT_WILLIAM_AUGUSTUS_WORKS', /英军重建后驻守/]] },
   { point: [46.3434895, -72.5369530], stages: [[1776, 'TROIS_RIVIERES_RECOLLETS_COMPOUND', /修会离开，英方接收/],
    [1799, 'TROIS_RIVIERES_RECOLLETS_COMPOUND', /改作法院与监狱/]] },
  ]) {
   await setView([...point, 17]);
   for (const [year, id, title] of stages) {
    await jump(year);
    assert((await atlantic()).activeRegionalZones.includes(id));
    await clickAreaAt(...point);
    const record = page.locator('[data-overlap-id="18c:' + id + '"]');
    await record.waitFor();
    assert.match(await record.textContent(), title);
   }
  }
  const threeRivers = [46.3434895, -72.5369530];
  await jump(1800);
  await setView([...threeRivers, 17]);
  await clickAreaAt(...threeRivers);
  const convent = page.locator('[data-historic-overlap-id$=":trois-rivieres-recollets-compound-1800"]');
  await convent.waitFor();
  assert.match(await convent.textContent(), /法院与监狱延续/);
  const cityWalls = [45.5059843, -73.5551906];
  await jump(1804);
  await setView([...cityWalls, 16]);
  await clickAreaAt(...cityWalls);
  const montrealWall = page.locator('[data-historic-overlap-id$=":montreal-stone-enceinte-1800"]');
  await montrealWall.waitFor();
  assert.match(await montrealWall.textContent(), /石城墙分段拆除/);
  await jump(1818);
  assert(!(await ids()).includes('montreal-stone-enceinte-1800'));
  assert(!(await ids()).includes('sainte-helene-imperial-depot'));
  await jump(1825);
  const arsenal = [45.5195182, -73.5365442];
  await setView([...arsenal, 17]);
  await clickAreaAt(...arsenal);
  const depot = page.locator('[data-historic-overlap-id$=":sainte-helene-imperial-depot"]');
  await depot.waitFor();
  assert.match(await depot.textContent(), /英军军械库/);

  // Havana: the siege positions, fortified city and permanent defenses have separate dates.
  const havanaTown = [23.136595, -82.3527393];
  const morro = [23.150584, -82.3568209];
  const cabana = [23.1464735, -82.3491753];
  const arsenalSite = [23.12843, -82.35515];
  for (const { point, stages } of [
   { point: havanaTown, stages: [[1762, 'HAVANA_WALLED_TOWN', /8月14日英军进城/],
    [1763, 'HAVANA_WALLED_TOWN', /7月6日西班牙接收/]] },
   { point: morro, stages: [[1762, 'HAVANA_CASTILLO_DEL_MORRO', /7月30日英军夺堡/]] },
   { point: cabana, stages: [[1774, 'HAVANA_CABANA_FORT', /西班牙建成后驻守/]] },
  ]) {
   await setView([...point, 16]);
   for (const [year, id, title] of stages) {
    await jump(year);
    const atlas = await atlantic();
    assert(atlas.activeRegionalZones.includes(id));
    assert(!atlas.activeZones.includes('HAVANA_HARBOR'));
    const legacy = await page.evaluate(() => window.eighteenthBatch39Spatial.getAudit());
    assert(!legacy.activeZoneIds.some(id => /^B39-C-Z03[2-6]$/.test(id)));
    assert(!legacy.activeSiteIds.some(id => /^B39-C-P03[2-4]$/.test(id)));
    await clickAreaAt(...point);
    const record = page.locator('[data-overlap-id="18c:' + id + '"]');
    await record.waitFor();
    assert.match(await record.textContent(), title);
   }
  }
  await jump(1762);
  assert(!(await atlantic()).activeRegionalZones.includes('HAVANA_CABANA_FORT'));
  assert((await atlantic()).activeRegionalSites.includes('HAVANA_CABANA_HEIGHTS'));
  await jump(1763);
  await setView([...arsenalSite, 16]);
  await clickAreaAt(...arsenalSite);
  await dossierTitle.filter({ hasText: '王家船坞 · 英军撤离前拆毁设备' }).waitFor();
  await jump(1799);
  assert((await atlantic()).activeRegionalZones.includes('HAVANA_WALLED_TOWN'));
  await page.locator('#nextYear').click();
  await page.waitForFunction(() => window.atlasStoryBridge.currentYear() === 1800);
  await setView([...havanaTown, 16]);
  await clickAreaAt(...havanaTown);
  const havanaWall = page.locator('[data-historic-overlap-id$=":havana-walled-town-1800"]');
  await havanaWall.waitFor();
  assert.match(await havanaWall.textContent(), /石城垣继续围合/);
  await jump(1864);
  assert(!(await ids()).includes('havana-walled-town-1800'));
  await jump(1899);
  await setView([...morro, 16]);
  await clickAreaAt(...morro);
  const havanaFort = page.locator('[data-historic-overlap-id$=":havana-morro-fort-1800"]');
  await havanaFort.waitFor();
  assert.match(await havanaFort.textContent(), /1月1日美军接收/);

  const manilaTown = [14.590149, 120.975944];
  const caviteTown = [14.4822, 120.9120];
  for (const [point, id, stages] of [
   [manilaTown, 'MANILA_INTRAMUROS', [[1762, /10月6日英军攻陷/],
    [1763, /和约后英军仍占城/], [1764, /西班牙接收/]]],
   [caviteTown, 'CAVITE_PUERTO', [[1762, /10月英军接收/], [1764, /4月9日/]]],
  ]) {
   await setView([...point, 16]);
   for (const [year, title] of stages) {
    await jump(year);
    await clickAreaAt(...point);
    const card = page.locator('[data-overlap-id="18c:' + id + '"]');
    await card.waitFor();
    assert.match(await card.textContent(), title);
   }
  }
  await jump(1762);
  const manilaLegacy = await page.evaluate(() => ({
   b37: window.eighteenthBatch37Spatial.getAudit(),
   b39: window.eighteenthBatch39Spatial.getAudit(),
   old: window.eighteenthSpatial.getAudit(),
  }));
  assert(!manilaLegacy.b37.activeZoneIds.includes('B37-C-Z039'));
  assert(!manilaLegacy.b37.activeSiteIds.includes('B37-C-P039'));
  assert(!manilaLegacy.b39.activeZoneIds.includes('B39-C-Z037'));
  assert(!manilaLegacy.b39.activeSiteIds.includes('B39-C-P037'));
  assert(!manilaLegacy.old.activeSites.includes('MANILA'));
  assert(!(await atlantic()).activeRegionalSites.includes('ZAMBOANGA_LA_CALDERA_PORT'));
  const sanAgustin = [14.5887439, 120.9751319];
  await setView([...sanAgustin, 17]);
  await clickAreaAt(...sanAgustin);
  await dossierTitle.filter({ hasText: '圣奥古斯丁教堂 · 英军掠取堂内财物' }).waitFor();
  await jump(1764);
  assert((await atlantic()).activeRegionalSites.includes('ZAMBOANGA_LA_CALDERA_PORT'));
  await jump(1799);
  await page.locator('#nextYear').click();
  await page.waitForFunction(() => window.atlasStoryBridge.currentYear() === 1800);
  await setView([...manilaTown, 16]);
  await clickAreaAt(...manilaTown);
  const manila1800 = page.locator('[data-historic-overlap-id$=":manila-intramuros-1800"]');
  await manila1800.waitFor();
  assert.match(await manila1800.textContent(), /西班牙续修城防/);
  await setView([...caviteTown, 16]);
  await clickAreaAt(...caviteTown);
  await page.locator('[data-historic-overlap-id$=":cavite-historic-puerto-1800"]').waitFor();

  await page.goto(root + '?year=1799', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#workspace').dataset.atlasReady === 'true' &&
   window.eighteenthMassSpatial?.getAudit().loaded && window.eighteenthBatch37Spatial?.getAudit().loaded &&
   window.atlasStoryBridge.currentYear() === 1799, undefined, { timeout: 45000 });
  const oldZones = await page.evaluate(() => window.eighteenthMassSpatial.getAudit().activeZones);
  for (const id of ['GRENADA', 'MENORCA_ISLAND', 'UPPER_CANADA', 'LOWER_CANADA', 'CAPE_BRETON', 'NS_REVISED']) assert(oldZones.includes(id));
  assert.equal(await page.evaluate(() => window.atlasStoryBridge.active18cMaroonCoreIds().length), 2);
  assert.deepEqual(await ids(), []);
  await page.locator('#nextYear').click();
  await page.waitForFunction(() => window.atlasStoryBridge.currentYear() === 1800);
  const nextZones = await ids();
  for (const id of ['grenada-continuity-1800', 'menorca-1800-third-occupation',
   'upper-canada-1800', 'lower-canada-1800', 'cape-breton-separate-colony', 'nova-scotia-peninsular-colony']) assert(nextZones.includes(id));
  assert.equal(await page.evaluate(() => window.atlasStoryBridge.active18cMaroonCoreIds().length), 0);
  assert.equal(await siteMarkers.count(), 0);
  await page.screenshot({ path: join(screenshotDir, '19c-territory-1800-handoff.png') });
  await page.locator('#prevYear').click();
  assert.equal(await page.evaluate(() => window.atlasStoryBridge.currentYear()), 1799);
  assert.deepEqual(await ids(), []);
  await page.locator('#nextYear').click();
  await page.locator('#mapLayerEvents').uncheck();
  await page.evaluate(() => window.__historicOverlapHost.map.setView([18.233333, -77.75], 10, { animate: false }));
  await clickAreaAt(18.233333, -77.75);
  await page.locator('#dossierBody h2').filter({ hasText: '阿康蓬' }).waitFor();
  assert.match(await page.locator('#dossierBody h2').textContent(), /马龙条约社区/);
  await page.locator('#resetDossier').click();
  await page.waitForFunction(() => {
   const map = window.__historicOverlapHost.map;
   return document.querySelector('#workspace').getAnimations().every(animation => animation.playState !== 'running') &&
    map.getSize().x === map.getContainer().clientWidth;
  });
  await jump(1842);
  await page.evaluate(() => window.__historicOverlapHost.map.setView([18.233333, -77.75], 10, { animate: false }));
  await clickAreaAt(18.233333, -77.75);
  await page.locator('#dossierBody h2').filter({ hasText: '阿康蓬' }).waitFor();
  assert.match(await page.locator('#dossierBody h2').textContent(), /马龙社区与地方治理/);

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
