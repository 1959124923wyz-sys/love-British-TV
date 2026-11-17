const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const root = process.env.ATLAS_TEST_URL || 'http://127.0.0.1:8765/';
const topics = [
  {
    id: 'E18-STATIA-CONFISCATION-1776-1786',
    entry: 'E18C-STATIA-1781-PETITION',
    year: 1781,
    other: 'E18C-STATIA-1784-DUTCH-RETURN',
    otherYear: 1784,
    route: 'R18-STATIA-KITTS-1781',
    archiveSource: '荷兰文化遗产局'
  },
  {
    id: 'E18-E15-BENCOOLEN-1704-1723',
    entry: 'E18C-BENCOOLEN-1719-SIEGE',
    year: 1719,
    other: 'E18C-BENCOOLEN-1721-RETURN',
    otherYear: 1721,
    route: 'R18-BENCOOLEN-BATAVIA-1719',
    archiveSource: '英国图书馆'
  },
  {
    id: 'E18-A21-ANTIGUA-TRIALS-1701-1738',
    entry: 'E18C-ANT-1736-INQUIRY',
    year: 1736,
    other: 'E18C-ANT-1737-BANISH',
    otherYear: 1737,
    archiveSource: 'David Barry Gaspar'
  },
  {
    id: 'E18-A22-BERMUDA-BAHAMAS-1718-1796',
    entry: 'E18C-ISL-1730-EXCLUSION',
    year: 1730,
    other: 'E18C-ISL-1784-AUCTION',
    otherYear: 1784,
    archiveSource: '英国下院刊本'
  },
  {
    id: 'E18-A06-BARBADOS-SUGAR-LAW-1701-1785',
    entry: 'E18C-BBD-1738-PETITION',
    year: 1738,
    other: 'E18C-BBD-1783-PAYNE',
    otherYear: 1783,
    route: 'R18-CODRINGTON-BRIDGETOWN-1738',
    archiveSource: '大英图书馆'
  },
  {
    id: 'E18-A17-WEST-INDIA-REGIMENTS-1795-1807',
    entry: 'E18C-WIR-1798-CABRITS',
    year: 1798,
    other: 'E18C-WIR-1807-FREE',
    otherYear: 1807,
    crossCentury: true,
    archiveSource: '英国国家档案馆立法库'
  },
  {
    id: 'E18-E14-CARIBBEAN-PRIZE-COURTS-1702-1779',
    entry: 'E18C-PZ-1741-NASSAU',
    year: 1741,
    other: 'E18C-PZ-1742-ROSA',
    otherYear: 1742,
    route: 'R18-REVENGE-NASSAU-1741',
    archiveSource: 'Beatriz Carolina Peña'
  },
  {
    id: 'E18-E04-MALACCA-OCCUPATION-1795-1825',
    entry: 'E18C-ML-1795-SURRENDER',
    year: 1795,
    other: 'E18C-ML-1825-HANDOVER',
    otherYear: 1825,
    crossCentury: true,
    archiveSource: '马六甲移交公告'
  }
];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_TEST_CHROME });
  try {
    const page = await browser.newPage({ viewport: { width: 1780, height: 1020 } });
    page.setDefaultTimeout(30000);
    const yearIs = year => page.waitForFunction(value => window.atlasStoryBridge?.currentYear() === value, year);
    async function visit(params) {
      await page.goto(root + params, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelector('#workspace')?.dataset.atlasReady === 'true');
    }
    for (const topic of topics) {
      await visit((topic.crossCentury ? '?review18c=1&review19c=1&year=' : '?review18c=1&year=') + topic.year);
      await yearIs(topic.year);
      if (topic.route) {
        const route = page.locator('[data-route-id="' + topic.route + '"]');
        await route.waitFor({ state: 'attached' });
        assert(await route.evaluate(element => element instanceof SVGElement));
      }
      const article = page.locator('article[data-story-id="' + topic.id + '"]');
      await page.locator('#eventList [data-eid="' + topic.entry + '"]').click();
      await page.locator('#dossierBody [data-story-open="' + topic.id + '"]').click();
      await article.waitFor();
      const anchor = article.locator('[data-story-event="' + topic.other + '"]');
      const before = await page.evaluate(() => window.atlasReadViewport().zoom);
      await anchor.click();
      await yearIs(topic.otherYear);
      await page.waitForFunction(event => window.atlasStoryBridge.activeFocusId() === event, topic.other);
      assert.equal(await page.evaluate(() => window.atlasReadViewport().zoom), before);
      await anchor.dblclick();
      await page.waitForFunction(event => window.atlasStoryBridge.selectedEventId() === event, topic.other);
      await page.locator('#dossierBody .source-details summary').click();
      assert((await page.locator('#dossierBody .source-details').innerText()).includes(topic.archiveSource));
      await page.locator('#dossierBody [data-story-back]').click();
      await article.waitFor();
      assert.equal(await page.evaluate(() => window.AtlasPublicCopyGuard.visibleWarnings().length), 0);
      await article.locator('header [data-story-return]').click();
      await yearIs(topic.year);
      await page.waitForFunction(event => window.atlasStoryBridge.selectedEventId() === event, topic.entry);
    }
    await visit('?review18c=1&year=1718');
    await page.waitForFunction(() => window.eighteenthBatch37Spatial?.getAudit().loaded);
    for (const [year, present] of [[1718,true],[1719,false],[1720,false],[1721,true],[1723,true]]) {
      await page.evaluate(year => window.atlasStoryBridge.setYear(year), year);
      await yearIs(year);
      const state = await page.evaluate(() => {
        const data = window.eighteenthBatch37Spatial.getAudit();
        return [data.activeZoneIds.includes('B37-I-Z038'), data.activeSiteIds.includes('B37-I-P038'),
          window.eighteenthSpatial.getAudit().activeAreas.includes('BENCOOLEN')];
      });
      assert.deepEqual(state, [present,present,present], 'Bencoolen in ' + year);
    }
    await visit('?year=1781');
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-STATIA-1781-PETITION') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-ISL-1784-AUCTION') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-WIR-1807-FREE') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-ML-1825-HANDOVER') === null));
    await visit('?review18c=1&year=1798');
    assert.equal(await page.locator('#jumpYear').getAttribute('max'), '1799');
    const wir = 'E18-A17-WEST-INDIA-REGIMENTS-1795-1807';
    await page.locator('#eventList [data-eid="E18C-WIR-1798-CABRITS"]').click();
    await page.locator('#dossierBody [data-story-open="' + wir + '"]').click();
    const crossYearLink = page.locator('article[data-story-id="' + wir + '"] a[href="?review18c=1&review19c=1&year=1807"]').first();
    await crossYearLink.click();
    await page.waitForFunction(() => document.querySelector('#workspace')?.dataset.atlasReady === 'true');
    await yearIs(1807);
    await page.locator('#eventList [data-eid="E18C-WIR-1807-FREE"]').click();
    await page.locator('#dossierBody [data-story-open="' + wir + '"]').click();
    await page.locator('article[data-story-id="' + wir + '"]').waitFor();
    await visit('?review18c=1&year=1795');
    const malacca = 'E18-E04-MALACCA-OCCUPATION-1795-1825';
    await page.locator('#eventList [data-eid="E18C-ML-1795-SURRENDER"]').click();
    await page.locator('#dossierBody [data-story-open="' + malacca + '"]').click();
    await page.locator('article[data-story-id="' + malacca + '"] a[href="?review18c=1&review19c=1&year=1825"]').first().click();
    await page.waitForFunction(() => document.querySelector('#workspace')?.dataset.atlasReady === 'true');
    await yearIs(1825);
    await page.locator('#eventList [data-eid="E18C-ML-1825-HANDOVER"]').waitFor();
    await visit('?review19c=1&year=1820');
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-BENCOOLEN-1719-SIEGE') === null));
    console.log('PASS desktop 18C topics: route hit targets, cross-year links, original sources and return paths, garrison transition, preview isolation');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
