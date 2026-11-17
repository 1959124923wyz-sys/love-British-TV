const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const serial = 'data/stories/serial/';
const data = load(serial + 'chronology-preview-privateering-malacca-1702-1825.json');
const catalog = load(serial + 'preview-18c-index.json');
const prior = [load(serial + 'chronology-1800-1819.json'), load(serial + 'chronology-1820-1829.json')];
const originals = fs.readFileSync(path.join(root, 'research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv'), 'utf8');
const topics = ['E18-E14', 'E18-E04'];
const events = new Map(data.events.map(event => [event.id, event]));
const sourceIds = new Set(data.sources.map(source => source.id));

assert.equal(events.size, 50);
assert.equal(events.size, data.events.length);
assert.equal(data.events.filter(event => Number.isFinite(event.lat)).length, 37);
assert.equal(new Set(data.events.map(event => event.location_name).filter(Boolean)).size, 9);
assert.equal(data.editorial_status, 'research_preview_not_published');
assert(data.sources.every(source => source.url.startsWith('https://')));
assert(prior.every(dataset => dataset.events.every(event => !events.has(event.id))));

for (const event of events.values()) {
  assert.equal(event.publication_status, 'research_only');
  assert.equal(event.territorial_claim, false);
  assert.equal(event.fill_authorized, false);
  assert.equal(event.area_sqkm, null);
  assert.equal(event.start_year, event.year);
  assert.equal(event.end_year, event.year);
  assert.equal(event.lat === null, event.lng === null);
  assert(event.source_ids.length && event.source_ids.every(id => sourceIds.has(id)));
  for (const id of event.research_original_record_ids || []) {
    assert(originals.includes('\n' + id + ','));
  }
}

assert.equal(data.routes.length, 1);
const [transport] = data.routes;
assert.equal(transport.dash_only, true);
assert.equal(transport.travel_mode, 'sea');
assert.deepEqual(transport.coords, transport.related_event_ids.map(id => {
  const event = events.get(id);
  assert.equal(event.year, transport.year);
  return [event.lat, event.lng];
}));

const covered = new Set();
for (const topic of topics) {
  const entry = catalog.stories.find(item => item.id.startsWith(topic + '-'));
  const article = load(entry.file);
  assert.equal(entry.status, 'research_preview');
  assert.deepEqual(article.research_topic_ids, [topic]);
  assert.deepEqual(article.related_event_ids, entry.event_ids);
  const linked = article.sections.flatMap(section => {
    const matches = [...section.paragraphs.join(' ').matchAll(/\[\[([^|]+)\|[^\]]+\]\]/g)];
    assert(matches.length > 0);
    for (const [, id] of matches) {
      const event = events.get(id);
      assert(event && event.year >= section.period_start_year && event.year <= section.period_end_year);
      assert(event.source_ids.every(source => section.source_keys.includes(source)));
      covered.add(id);
    }
    return matches.map(([, id]) => id);
  });
  assert.deepEqual(linked, entry.event_ids);
  const later = linked.filter(id => events.get(id).year >= 1800);
  assert.deepEqual(article.cross_preview_event_years || {}, Object.fromEntries(later.map(id => [id, events.get(id).year])));
}
assert.equal(covered.size, events.size);
assert.equal(events.get('E18C-PZ-1741-SELL').date_label, '1741年8月21日');
assert.equal(events.get('E18C-PZ-1779-NAIRAC').lat, null);
assert(events.get('E18C-PZ-1779-NAIRAC').description.includes('697'));
assert(events.get('E18C-PZ-1779-JAMAICA-SALE').description.includes('692'));
assert.equal(events.get('E18C-ML-1825-HANDOVER').date_label, '1825年4月9日');
assert(events.get('E18C-ML-1825-HANDOVER').source_ids.includes('413-VANSON'));
console.log('PASS: 50 sourced events, 9 locations, the 1741 transport route, and distinct treaty/hand-over dates');
