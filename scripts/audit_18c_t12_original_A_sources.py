#!/usr/bin/env python3
"""Editor 15 original T12: 7 groups, 11 archival candidates, 17 A registry keys, 1126 archive."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T12.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T12' and len(raw['groups'])==7
old={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(old)==11
keys={k.removeprefix('A:') for c in old.values() for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==17
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 sources=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={x['id']:x for x in sources} if isinstance(sources,list) else sources
 assert keys<=set(registry), keys-set(registry)
d=json.loads((root/'data/stories/serial/chronology-preview-t12-revolution-black-freedom-1764-1796.json').read_text(encoding='utf8'))
assert len(d['events'])==35
registered={s['original_registry_key'].removeprefix('A:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert registered==keys,(registered,keys)
used=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(used)==11 and set(used)==set(old)
groups={g['id']:g for g in raw['groups']}
for e in d['events']:
 if e['research_original_record_ids']:
  assert e['research_merge_group_id'] in groups
  for id in e['research_original_record_ids']:
   assert old[id]['year']==e['year']
assert sorted(len(e['research_original_record_ids']) for e in d['events'] if e['research_original_record_ids'])==[1]*9+[2]
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 for id in old:
  assert any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' for x in rows),id
print('PASS T12: 7 groups, 11/11 immutable original candidate IDs, 17/17 A source keys; two 1775 Dunmore originals correctly merged into one Atlas event; entire 1126 crosswalk preserved')
