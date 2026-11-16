const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const dir = 'data/stories/serial/';
const data = read(dir + 'chronology-preview-statia-bencoolen-1704-1786.json');
const index = read(dir + 'preview-18c-index.json');
const ids = ['E18-STATIA-CONFISCATION-1776-1786', 'E18-E15-BENCOOLEN-1704-1723'];
const topics = new Set(read('research/18c/MAJOR_TOPICS.json').topics.map(topic => topic.id));
const sources = new Set(data.sources.map(source => source.id));
const events = new Map(data.events.map(event => [event.id, event]));
const groups = new Map(read('research/18c/consolidated/MERGED_EPISODE_GROUPS.json').groups.map(group => [group.id, group]));

assert.equal(data.editorial_status, 'research_preview_not_published');
assert.equal(events.size, 28);
assert.equal(sources.size, data.sources.length);
assert.equal(data.events.filter(event => Number.isFinite(event.lat)).length, 16);
assert.equal(new Set(data.events.map(event => event.location_name).filter(Boolean)).size, 6);
for (const event of events.values()) {
  assert.equal(event.year, event.start_year);
  assert.equal(event.year, event.end_year);
  assert.equal(event.publication_status, 'research_only');
  assert.equal(event.territorial_claim, false);
  assert.equal(event.area_sqkm, null);
  assert(event.source_ids.length && event.source_ids.every(id => sources.has(id)));
  assert.equal(event.lat === null, event.lng === null);
  if (event.research_merge_group_id) {
    assert.deepEqual(event.research_original_record_ids, groups.get(event.research_merge_group_id).original_candidate_ids);
  }
}
for (const id of ids) {
  const entry = index.stories.find(item => item.id === id);
  assert.equal(entry.preview_18c_only, true);
  const story = read(entry.file);
  assert.equal(story.id, entry.id);
  assert.equal(story.publication_status, 'research_only');
  assert.equal(story.sources.every(source => sources.has(source.id)), true);
  assert.equal(story.research_topic_ids.every(topic => topics.has(topic)), true);
  const links = story.sections.flatMap(section => {
    const sectionLinks = [...section.paragraphs.join(' ').matchAll(/\[\[([^|]+)\|([^\]]+)\]\]/g)];
    assert(sectionLinks.length);
    for (const [, eventId] of sectionLinks) {
      const event = events.get(eventId);
      assert(event && event.year >= section.period_start_year && event.year <= section.period_end_year);
      assert(event.source_ids.every(key => section.source_keys.includes(key)));
    }
    return sectionLinks.map(match => match[1]);
  });
  assert.deepEqual(links.slice().sort(), entry.event_ids.slice().sort());
  assert.deepEqual(story.related_event_ids, entry.event_ids);
}
assert.equal(data.routes.length, 2);
for (const route of data.routes) {
  assert.equal(route.dash_only, true);
  assert.equal(route.coords.length, 2);
  assert(route.source_ids.length && route.source_ids.every(id => sources.has(id)));
  const event = events.get(route.related_event_ids[0]);
  assert.equal(event.year, route.year);
  assert.deepEqual(route.coords[1], [event.lat, event.lng]);
}
const inherited = read('data/eighteenth-century-dynamic-spatial-1700-1799.json').area_references;
const mapped = read('data/eighteenth-century-b37-india-ocean.json');
for (const record of [inherited.find(r => r.id === 'BENCOOLEN'),
  mapped.zones.find(r => r.id === 'B37-I-Z038'), mapped.sites.find(r => r.id === 'B37-I-P038')]) {
  assert.equal(record.periods[0].end_year, 1718);
  assert.equal(record.periods[1].start_year, 1721);
}
assert.deepEqual(events.get('E18C-BENCOOLEN-1719-SIEGE').research_predecessor_event_ids,
  ['E18-BRIDGE-1719-BENCOOLEN-UPRISING']);
console.log('PASS 18C Statia and Bencoolen: 28 events, 16 geocoded, 2 dashed connections, sources and 1719–1721 garrison transition');
