const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const load = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const serial = 'data/stories/serial/';
const newData = load(serial + 'chronology-preview-deportation-and-slave-laws-1755-1788.json');
const datasets = [newData, load(serial + 'chronology-preview-1700-1769.json'), load(serial + 'chronology-preview-jamaica-1700-1799.json')];
const events = new Map(datasets.flatMap(ds => ds.events.map(event => [event.id, event])));
const catalog = load(serial + 'preview-18c-index.json');
const originals = new Map(['T03', 'T04', 'T07'].flatMap(arc =>
  load('research/18c/consolidated/series/' + arc + '.json').groups.flatMap(group =>
    group.candidate_subevents.map(record => [record.original_id, { ...record, group: group.id }])
  )
));

assert.equal(newData.events.length, 13);
assert.equal(newData.events.filter(event => event.lat !== null).length, 10);
assert.equal(events.size, datasets.reduce((count, data) => count + data.events.length, 0));
assert.deepEqual(newData.routes, []);
const matched = new Set();
for (const dataset of datasets) {
  const sources = new Set(dataset.sources.map(source => source.id));
  for (const event of dataset.events) {
    assert(event.source_ids.every(source => sources.has(source)));
    for (const id of event.research_original_record_ids || []) {
      const record = originals.get(id);
      assert(record && record.year === event.year && record.group === event.research_merge_group_id, id);
      matched.add(id);
    }
  }
}
assert.equal(matched.size, 23);
const covered = new Set();
for (const id of ['E18-C07-GRAND-PRE-MARYLAND-1755', 'E18-A06-JAMAICA-PUNISHMENT-LAWS-1718-1788']) {
  const entry = catalog.stories.find(story => story.id === id);
  const story = load(entry.file);
  const links = story.sections.flatMap(section => section.paragraphs.flatMap(paragraph =>
    [...paragraph.matchAll(/\[\[([^|]+)\|[^\]]+\]\]/g)].map(([, id]) => {
      const event = events.get(id);
      assert(event && event.year >= section.period_start_year && event.year <= section.period_end_year);
      assert(event.source_ids.every(source => section.source_keys.includes(source)));
      covered.add(id);
      return id;
    })
  ));
  assert.deepEqual(links, story.related_event_ids);
  assert.deepEqual(links, entry.event_ids);
}
for (const event of newData.events) {
  assert(covered.has(event.id));
  assert.equal(event.area_sqkm, null);
  assert.equal(event.territorial_claim, false);
  assert.equal(event.lat === null, event.lng === null);
}
assert.match(events.get('E18C-DA-1755-SEP10-DETENTION').description, /141名年轻男子与89名已婚男子/);
assert.match(events.get('E18C-DA-1755-OCT8-FAMILIES').description, /两船合计约80户/);
assert.equal(events.get('E18C-DA-1755-HEBERT').lat, null);
assert.equal(events.get('E18C-JAM-1788-MAROON-COURTS').date_label, '1788年1月10日');
assert.equal(events.get('E18C-JLC-1788-CONSOLIDATION').date_label, '1788年12月6日');
console.log('PASS: 13 new chronology entries, 23 exact archive matches, distinct 1755 headcounts and 1788 laws');
