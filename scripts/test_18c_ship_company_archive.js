const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const serial = 'data/stories/serial/';
const supplemental = load(serial + 'chronology-preview-ship-resistance-and-company-treaties-1722-1765.json');
const datasets = [
  supplemental,
  load(serial + 'chronology-preview-bengal-1750-1779.json'),
  load(serial + 'chronology-preview-atlantic-zong-1700-1799.json'),
  load(serial + 'chronology-preview-t33-scotland-slavery-courts-1707-1792.json')
];
const events = new Map(datasets.flatMap(data => data.events.map(event => [event.id, event])));
const topics = load(serial + 'preview-18c-index.json').stories;
const eventSet = new Set();
for (const id of ['E18-A01-SHIPBOARD-RESISTANCE-1722-1765', 'E18-B03-B06-BENGAL-AWADH-COMPANY-REVENUE-1756-1765']) {
  const index = topics.find(item => item.id === id);
  const article = load(index.file);
  const links = article.sections.flatMap(section => section.paragraphs.flatMap(paragraph =>
    [...paragraph.matchAll(/\[\[([^|]+)\|[^\]]+\]\]/g)].map(([, eventId]) => {
      const event = events.get(eventId);
      assert(event && event.year >= section.period_start_year && event.year <= section.period_end_year, eventId);
      assert(event.source_ids.every(sourceId => section.source_keys.includes(sourceId)), eventId);
      eventSet.add(eventId);
      return eventId;
    })));
  assert.deepEqual(links, index.event_ids);
  assert.deepEqual(links, article.related_event_ids);
}
assert.deepEqual(supplemental.routes, []);
const sourceIds = new Set(supplemental.sources.map(source => source.id));
for (const event of supplemental.events) {
  assert(eventSet.has(event.id), event.id);
  assert.equal(event.territorial_claim, false);
  assert.equal(event.area_sqkm, null);
  assert(event.source_ids.every(sourceId => sourceIds.has(sourceId)), event.id);
}
for (const id of ['E18C-SR-1722-FERRERS', 'E18C-SR-1750-KING-DAVID', 'E18C-ATL-1765-SALLY-REVOLT']) {
  const event = events.get(id);
  assert.equal(event.lat, null);
  assert.equal(event.lng, null);
  assert.equal(event.show_dossier_sources, true);
}
assert.match(events.get('E18C-SR-1750-KING-DAVID').date_label, /5月8日.*蒙哥马利/);
assert.equal(events.get('E18C-CT-1760-THREE-DISTRICTS').research_original_record_ids[0], 'AB-NEW-032-001');
assert.equal(events.get('E18C-BNG-1765-DIWANI').date_label, '1765年8月12日');
assert.equal(events.get('E18C-CT-1765-AWADH-INDEMNITY').date_label, '1765年8月16日');
assert.equal(events.get('E18C-CT-1765-AWADH-INDEMNITY').research_original_record_ids[0], 'AB-B06-002');
assert.deepEqual(events.get('E18C-T33-1778-JAN15-KNIGHT-VERDICT').research_audited_cross_arc_original_ids,
  ['E18A3-KNIGHT-JUDGMENT-1778']);
console.log('PASS shipboard resistance and Bengal treaty links, original records, and evidence bounds');
