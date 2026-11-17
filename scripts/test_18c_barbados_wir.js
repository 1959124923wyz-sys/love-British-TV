const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const serial = 'data/stories/serial/';
const data = load(serial + 'chronology-preview-barbados-west-india-regiments-1701-1807.json');
const catalog = load(serial + 'preview-18c-index.json');
const prior = load(serial + 'chronology-1800-1819.json');
const originals = fs.readFileSync(path.join(root, 'research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv'), 'utf8');
const topics = ['E18-A06', 'E18-A17'];
const events = new Map(data.events.map(event => [event.id, event]));
const sourceIds = new Set(data.sources.map(source => source.id));

assert.equal(events.size, 42);
assert.equal(events.size, data.events.length);
assert.equal(data.events.filter(event => Number.isFinite(event.lat)).length, 23);
assert.equal(new Set(data.events.map(event => event.location_name).filter(Boolean)).size, 6);
assert.equal(data.editorial_status, 'research_preview_not_published');
assert(data.sources.every(source => source.url.startsWith('https://')));
assert(prior.events.every(event => !events.has(event.id)));

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
const [march] = data.routes;
assert.equal(march.dash_only, true);
assert.equal(march.travel_mode, 'land');
assert.deepEqual(march.coords, march.related_event_ids.map(id => {
  const event = events.get(id);
  assert.equal(event.year, march.year);
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
assert.equal(events.get('E18C-BBD-1783-PAYNE').date_label, '1783年10月11日');
assert.equal(events.get('E18C-WIR-1801-ACCOUNT').lat, null);
assert(events.get('E18C-WIR-1807-TERMS').source_ids.includes('412-ACT'));
assert(events.get('E18C-WIR-1807-TRANSITION').source_ids.includes('412-ABOLITION'));
console.log('PASS: 42 source-linked events, 6 locations, 1738 protest route, and distinct cross-century act anchors');
