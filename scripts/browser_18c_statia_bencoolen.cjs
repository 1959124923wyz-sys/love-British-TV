const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const root = process.env.ATLAS_TEST_URL || 'http://127.0.0.1:8765/';
const topics = [
  {
    id: 'E18-T26-GOLD-COAST-GOREE-1722-1783',
    entry: 'E18C-419-1754-QUODJEBAH',
    year: 1754,
    other: 'E18C-419-1779-GOREE-REOCCUPATION',
    otherYear: 1779,
    archiveSource: '英国历史手稿委员会'
  },
  {
    id: 'E18-T02-OLD-CALABAR-AFTERMATH-1767-1773',
    entry: 'E18C-419-1769-EPHRAIM-LETTER',
    year: 1769,
    other: 'E18C-419-1773-CALABAR-SHELLING-LETTER',
    otherYear: 1773,
    archiveSource: '罗德岛历史学会',
    unlocated: true
  },
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
  },
  {
    id: 'E18-C01-C05-ACADIA-RAIDS-BOUNTIES-1704-1752',
    entry: 'E18C-ACR-1704-GRAND-PRE',
    year: 1704,
    other: 'E18C-ACR-1749-BOUNTY',
    otherYear: 1749,
    archiveSource: '新斯科舍省公文选编'
  },
  {
    id: 'E18-A06-A07-JAMAICA-WHITEHALL-MANUMISSION-1760-1774',
    entry: 'E18C-JWH-1765-WHITEHALL',
    year: 1765,
    other: 'E18C-JWH-1767-YORK-CUFFEE',
    otherYear: 1767,
    archiveSource: '1767年第9章'
  },
  {
    id: 'E18-E10-HANNOVER-1719-1727',
    entry: 'E18C-HNV-1720-CALABAR',
    year: 1720,
    other: 'E18C-HNV-1719-DEPART',
    otherYear: 1719,
    route: 'R18-HNV-1720-ANNOBON-BARBADOS',
    archiveSource: '汉诺威号账簿'
  },
  {
    id: 'E18-A04-INDIGO-BOUNTY-1748-1771',
    entry: 'E18C-IND-1748-BOUNTY',
    year: 1748,
    other: 'E18C-IND-1749-LOBBY',
    otherYear: 1749,
    archiveSource: '卡罗来纳贸易'
  },
  {
    id: 'E18-B18-CARNATIC-NABOB-DEBTS-1785-1787',
    entry: 'E18C-ARC-1785-DEBT',
    year: 1785,
    other: 'E18C-ARC-1787-DEFENCE',
    otherYear: 1787,
    archiveSource: 'IOR/H/320'
  },
  {
    id: 'E18-F06-CARNEW-REPRISALS-1798',
    entry: 'E18C-CAR-1798-ATTACK',
    year: 1798,
    other: 'E18C-CAR-1798-HOSPITAL',
    otherYear: 1798,
    archiveSource: '克洛尼回忆录'
  },
  {
    id: 'E18-C07-GRAND-PRE-MARYLAND-1755',
    entry: 'E18C-DA-1755-OCT8-FAMILIES',
    year: 1755,
    other: 'E18C-DA-1755-MARYLAND-ARRIVAL',
    otherYear: 1755,
    archiveSource: '马里兰历史杂志'
  },
  {
    id: 'E18-A06-JAMAICA-PUNISHMENT-LAWS-1718-1788',
    entry: 'E18C-JLC-1788-CONSOLIDATION',
    year: 1788,
    other: 'E18C-JAM-1760-TAKY-REVOLT',
    otherYear: 1760,
    archiveSource: '牙买加政府新闻署'
  },
  {
    id: 'E18-A01-SHIPBOARD-RESISTANCE-1722-1765',
    entry: 'E18C-SR-1750-KING-DAVID',
    year: 1750,
    other: 'E18C-SR-1722-ANOMABO',
    otherYear: 1722,
    archiveSource: '斯内尔格雷夫1734年著作'
  },
  {
    id: 'E18-B03-B06-BENGAL-AWADH-COMPANY-REVENUE-1756-1765',
    entry: 'E18C-CT-1765-AWADH-INDEMNITY',
    year: 1765,
    other: 'E18C-BNG-1756-FORT-WILLIAM-FALL',
    otherYear: 1756,
    archiveSource: '希尔编《1756—1757年的孟加拉》',
    nineteenthOnly: true
  },
  {
    id: 'E18-T31-DARIEN-SIEGE-CAPITULATION-1700',
    entry: 'E18C-SCT-1700-DARIEN-SURRENDER',
    year: 1700,
    other: 'E18C-DAR-1700-APR01-VEITCH',
    otherYear: 1700,
    archiveSource: '苏格兰国家图书馆'
  },
  {
    id: 'E18-T29-IRISH-PENAL-BILL-RESIDENCE-1703-1705',
    entry: 'E18C-PL-1705-URBAN-DEPARTURE',
    year: 1705,
    other: 'E18C-PL-1703-COMMONS-BILL',
    otherYear: 1703,
    archiveSource: '爱尔兰历史研究',
    unlocated: true
  },
  {
    id: 'E18-T30-IRISH-REBELLION-PRISONERS-REPRISALS-1798',
    entry: 'E18C-IR-1798-JUL17-MCCRACKEN',
    year: 1798,
    other: 'E18C-CAR-1798-HOSPITAL',
    otherYear: 1798,
    archiveSource: '爱德华·海',
    nineteenthOnly: true
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
      const review = topic.nineteenthOnly ? '?review19c=1'
        : topic.crossCentury ? '?review18c=1&review19c=1' : '?review18c=1';
      await visit(review + '&year=' + topic.year);
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
      await page.waitForFunction(event => window.atlasStoryBridge.activeFocusId() === event, topic.unlocated ? null : topic.other);
      assert.equal(await page.evaluate(() => window.atlasReadViewport().zoom), before);
      await anchor.dblclick();
      await page.waitForFunction(event => window.atlasStoryBridge.selectedEventId() === event, topic.other);
      await page.locator('#dossierBody .source-details summary').click();
      const archiveText = await page.locator('#dossierBody .source-details').innerText();
      assert(archiveText.includes(topic.archiveSource), `${topic.id} missing ${topic.archiveSource} in ${archiveText}`);
      await page.locator('#dossierBody [data-story-back]').click();
      await article.waitFor();
      await article.locator('header [data-story-return]').click();
      assert.equal(await page.evaluate(() => window.AtlasPublicCopyGuard.visibleWarnings().length), 0);
      await yearIs(topic.year);
      await page.waitForFunction(event => window.atlasStoryBridge.selectedEventId() === event, topic.entry);
    }
    await visit('?review18c=1&year=1718');
    await page.waitForFunction(() => window.eighteenthBatch37Spatial?.getAudit().loaded &&
      window.eighteenthBatch39Spatial?.getAudit().loaded);
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
    for (const [year, present] of [[1721, false], [1722, true]]) {
      await page.evaluate(year => window.atlasStoryBridge.setYear(year), year);
      await yearIs(year);
      const state = await page.evaluate(() => {
        const africa = window.eighteenthBatch37Spatial.getAudit();
        const coast = window.eighteenthBatch39Spatial.getAudit();
        return [africa.activeZoneIds.includes('B37-A-Z009'), africa.activeSiteIds.includes('B37-A-P008'),
          coast.activeZoneIds.includes('B39-A-Z001'), coast.activeSiteIds.includes('B39-A-P001')];
      });
      assert.deepEqual(state, [false, true, present, present], 'Gold Coast records in ' + year);
    }
    await visit('?year=1781');
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-STATIA-1781-PETITION') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-ISL-1784-AUCTION') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-WIR-1807-FREE') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-ML-1825-HANDOVER') === null));
    assert(await page.evaluate(() => window.atlasStoryBridge.eventById('E18C-JWH-1765-WHITEHALL') === null));
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
    const priorPreviewEvents = [
      'E18C-JWH-1765-WHITEHALL',
      'E18C-HNV-1720-CALABAR',
      'E18C-DA-1755-MARYLAND-ARRIVAL',
      'E18C-JLC-1788-CONSOLIDATION'
    ];
    for (const id of priorPreviewEvents) {
      assert(await page.evaluate(eventId => window.atlasStoryBridge.eventById(eventId)?.id === eventId, id), id);
    }
    console.log('PASS desktop 18C topics: route hit targets, cross-year links, original sources and return paths, garrison transition, preview isolation');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
