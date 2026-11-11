#!/usr/bin/env python3
"""T15 immutable predecessor B-source research audit: 9 original candidates, 7 B keys, 1126 master crosswalk."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T15.json').read_text(encoding='utf-8'))
assert raw['story_arc_id']=='T15' and len(raw['groups'])==1
old={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(old)==9
keys={k for c in old.values() for k in c['source_keys']}
assert len(keys)==7 and all(k.startswith('B:') for k in keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 assert z.testzip() is None
data=json.loads((root/'data/stories/serial/chronology-preview-t15-bengal-famine-tax-1770-1772.json').read_text(encoding='utf-8'))
registered={s['original_registry_key'] for s in data['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
assert registered==keys,(registered,keys)
mapped=[oid for e in data['events'] for oid in e['research_original_record_ids']]
assert len(mapped)==9 and set(mapped)==set(old) and len(set(mapped))==9
for e in data['events']:
 for oid in e['research_original_record_ids']:
  assert old[oid]['year']==e['year'] and e['research_merge_group_id']==raw['groups'][0]['id']
  for k in old[oid]['source_keys']:
   assert any(s['original_registry_key']==k and s['id'] in e['source_ids'] for s in data['sources'])
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 for oid in old:
  assert any(x['original_id']==oid and x['consolidation_disposition']=='assigned_to_group' and x['arc']=='T15' for x in rows),oid
assert (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').exists()
print('PASS T15: 1 original group, all nine unique B candidate IDs, seven exact B-source registry keys and intact 1126 CSV / archival ZIP')
