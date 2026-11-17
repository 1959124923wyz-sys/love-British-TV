const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const dir = 'data/stories/serial/';
const data = load(dir + 'chronology-preview-antigua-bermuda-bahamas-1701-1796.json');
const index = load(dir + 'preview-18c-index.json');
const topics = ['E18-A21', 'E18-A22'];
const events = new Map(data.events.map(event => [event.id, event]));
const sourceIds = new Set(data.sources.map(source => source.id));
const originals = fs.readFileSync(path.join(root, 'research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv'), 'utf8');
const groups = load('research/18c/consolidated/MERGED_EPISODE_GROUPS.json').groups;
assert.equal(events.size, 29);
assert.equal(events.size, data.events.length);
assert.equal(data.events.filter(event => Number.isFinite(event.lat)).length, 19);
assert.equal(new Set(data.events.map(event => event.location_name).filter(Boolean)).size, 4);
assert.deepEqual(data.routes, []);
assert.equal(data.editorial_status, 'research_preview_not_published');

for (const event of events.values()) {
  assert.equal(event.publication_status, 'research_only');
  assert.equal(event.territorial_claim, false);
  assert.equal(event.area_sqkm, null);
  assert.equal(event.start_year, event.year);
  assert.equal(event.end_year, event.year);
  assert.equal(event.lat === null, event.lng === null);
  assert(event.source_ids.length && event.source_ids.every(id => sourceIds.has(id)));
  assert(event.research_original_record_ids?.every(id => originals.includes('\n' + id + ',')) ?? true);
  if (event.research_merge_group_id) {
    const group = groups.find(item => item.id === event.research_merge_group_id);
    assert.deepEqual(event.research_original_record_ids, group.original_candidate_ids);
  }
}

const covered = new Set();
for (const topic of topics) {
  const entry = index.stories.find(item => item.id.startsWith(topic + '-'));
  assert.equal(entry.preview_18c_only, true);
  const article = load(entry.file);
  assert.deepEqual(article.research_topic_ids, [topic]);
  assert.deepEqual(article.related_event_ids, entry.event_ids);
  const linked = article.sections.flatMap(section => {
    const matches = [...section.paragraphs.join(' ').matchAll(/\[\[([^|]+)\|([^\]]+)\]\]/g)];
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
}
assert.equal(covered.size, events.size);
assert.equal(events.get('E18C-ISL-1784-AUCTION').date_label, '1784年7月7日');
assert.equal(events.get('E18C-ANT-1737-ROSTER').date_label, '1737年5月26日');
assert.equal(events.get('E18C-ANT-1737-ROSTER').lat, null);
console.log('PASS: 29 sourced events and article links, historic date anchors, 4 named locations and original research provenance');
