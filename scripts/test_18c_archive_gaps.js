const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const load = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const serial = 'data/stories/serial/';
const data = load(serial + 'chronology-preview-archive-gaps-1719-1798.json');
const catalog = load(serial + 'preview-18c-index.json');
const events = new Map(data.events.map(event => [event.id, event]));
const sources = new Set(data.sources.map(source => source.id));

assert.equal(events.size, 21);
assert.equal(events.size, data.events.length);
assert.equal(data.events.filter(event => Number.isFinite(event.lat)).length, 14);
assert.equal(new Set(data.events.filter(event => Number.isFinite(event.lat)).map(event => event.location_name)).size, 12);
for (const event of events.values()) {
  assert.equal(event.year, event.start_year);
  assert.equal(event.year, event.end_year);
  assert.equal(event.lat === null, event.lng === null);
  assert.equal(event.publication_status, 'research_only');
  assert.equal(event.territorial_claim, false);
  assert.equal(event.area_sqkm, null);
  assert(event.source_ids.length && event.source_ids.every(source => sources.has(source)));
}
assert.equal(data.routes.length, 3);
for (const route of data.routes) {
  assert.equal(route.dash_only, true);
  assert(route.source_ids.every(source => sources.has(source)));
  assert.deepEqual(route.coords, route.related_event_ids.map(id => {
    const event = events.get(id);
    assert.equal(event.year, route.year);
    return [event.lat, event.lng];
  }));
}

const covered = new Set();
for (const id of ['E18-E10-HANNOVER-1719-1727', 'E18-A04-INDIGO-BOUNTY-1748-1771',
  'E18-B18-CARNATIC-NABOB-DEBTS-1785-1787', 'E18-F06-CARNEW-REPRISALS-1798']) {
  const entry = catalog.stories.find(story => story.id === id);
  const story = load(entry.file);
  assert.equal(entry.status, 'research_preview');
  assert.deepEqual(entry.event_ids, story.related_event_ids);
  const links = story.sections.flatMap(section => [...section.paragraphs.join(' ').matchAll(/\[\[([^|]+)\|[^\]]+\]\]/g)].map(([, id]) => {
    const event = events.get(id);
    assert(event && event.year >= section.period_start_year && event.year <= section.period_end_year);
    assert(event.source_ids.every(source => section.source_keys.includes(source)));
    covered.add(id);
    return id;
  }));
  assert.deepEqual(links, entry.event_ids);
}
assert.equal(covered.size, 21);
assert.equal(events.get('E18C-ARC-1785-DEBT').date_label, '1785年6月28日');
assert.match(events.get('E18C-ARC-1785-DEBT').description, /120万帕戈达.*40万帕戈达/);
assert.equal(events.get('E18C-ARC-1787-DEFENCE').date_label, '1787年2月24日');
assert.equal(events.get('E18C-CAR-1798-ATTACK').date_label, '1798年6月7—8日');
assert.equal(events.get('E18C-CAR-1798-GARRISON').date_label, '1798年6月30日');
assert.match(events.get('E18C-HNV-1720-CALABAR').description, /75名.*8人/);
console.log('PASS four 18C topics, 21 sourced events with 14 located, and three documented Atlantic passage links');
