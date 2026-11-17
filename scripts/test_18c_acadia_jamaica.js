const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const load = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const serial = 'data/stories/serial/';
const chronology = load(serial + 'chronology-preview-acadia-jamaica-1704-1774.json');
const catalog = load(serial + 'preview-18c-index.json');
const entries = catalog.stories.filter(story => /ACADIA-RAIDS-BOUNTIES|JAMAICA-WHITEHALL-MANUMISSION/.test(story.id));
const events = new Map(chronology.events.map(event => [event.id, event]));
const sourceIds = new Set(chronology.sources.map(source => source.id));
const exactRecords = new Set();
const covered = new Set();

assert.equal(chronology.editorial_status, 'research_preview_not_published');
assert.equal(events.size, 25);
assert.equal(events.size, chronology.events.length);
assert.equal(chronology.events.filter(event => Number.isFinite(event.lat)).length, 14);
assert.equal(new Set(chronology.events.filter(event => event.lat !== null).map(event => event.location_name)).size, 6);
assert.deepEqual(chronology.routes, []);
assert.equal(entries.length, 2);

for (const event of events.values()) {
  assert.equal(event.year, event.start_year);
  assert.equal(event.year, event.end_year);
  assert.equal(event.publication_status, 'research_only');
  assert.equal(event.lat === null, event.lng === null);
  assert.equal(event.territorial_claim, false);
  assert.equal(event.fill_authorized, false);
  assert.equal(event.area_sqkm, null);
  assert(event.source_ids.length && event.source_ids.every(id => sourceIds.has(id)));
  for (const id of event.research_original_record_ids || []) {
    assert.match(event.research_merge_group_id, /^E18-MRG-T0[37]-0[1-6]$/);
    exactRecords.add(id);
  }
}

for (const entry of entries) {
  const article = load(entry.file);
  assert.equal(entry.status, 'research_preview');
  assert.deepEqual(article.related_event_ids, entry.event_ids);
  const links = article.sections.flatMap(section =>
    [...section.paragraphs.join(' ').matchAll(/\[\[([^|]+)\|[^\]]+\]\]/g)].map(([, id]) => {
      const event = events.get(id);
      assert(event && event.year >= section.period_start_year && event.year <= section.period_end_year);
      assert(event.source_ids.every(source => section.source_keys.includes(source)));
      covered.add(id);
      return id;
    })
  );
  assert.deepEqual(links, entry.event_ids);
}
assert.equal(covered.size, events.size);
assert.equal(exactRecords.size, 6);
assert.equal(events.get('E18C-JWH-1765-WHITEHALL').date_label, '1765年11月25日（同期函件）');
assert(events.get('E18C-JWH-1767-YORK-CUFFEE').source_ids.includes('414-1767-SCAN'));
assert(events.get('E18C-JWH-1767-YORK-CUFFEE').description.includes('各有每年5镑'));
assert.equal(events.get('E18C-JWH-1774-WESTMORELAND').lat, null);
assert.equal(events.get('E18C-ACR-1749-COUNCIL').date_label, '1749年10月1日');
assert.equal(events.get('E18C-ACR-1749-BOUNTY').date_label, '1749年10月2日（省公文刊本）');
assert.match(events.get('E18C-ACR-1750-RAISE').description, /50英镑.*50基尼/);
console.log('PASS: Acadia and Jamaica chronology, archival citations, exact research crosswalk and preview index');
