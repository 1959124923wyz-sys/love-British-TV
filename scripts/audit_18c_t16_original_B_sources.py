#!/usr/bin/env python3
"""T16 six inherited B-source research groups, eight original ids, ten B keys: immutable archive integrity."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T16.json').read_text(encoding='utf-8'))
assert raw['story_arc_id']=='T16' and len(raw['groups'])==6
old={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(old)==8
keys={k for c in old.values() for k in c['source_keys']}
assert len(keys)==10 and all(x.startswith('B:') for x in keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 assert z.testzip() is None
data=json.loads((root/'data/stories/serial/chronology-preview-t16-permanent-settlement-1760-1799.json').read_text(encoding='utf8'))
registered={s['original_registry_key'] for s in data['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
assert registered==keys,(registered,keys)
mapped=[id for e in data['events'] for id in e['research_original_record_ids']]
assert len(mapped)==8 and len(set(mapped))==8 and set(mapped)==set(old)
for e in data['events']:
 for oid in e['research_original_record_ids']:
  original=old[oid]
  assert original['year']==e['year']
  for k in original['source_keys']:
   assert any(s['original_registry_key']==k and s['id'] in e['source_ids'] for s in data['sources'])
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 for id in old:
  assert any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' and x['arc']=='T16' for x in rows),id
assert data['statistics']['1793_March22_proclamation']=='1793-03-22'
assert data['statistics']['1793_May1_RegI']=='1793-05-01'
print('PASS T16: six original merge groups, eight original B candidate IDs once, ten original B source keys, original 1126 crosswalk and immutable ZIP intact')
