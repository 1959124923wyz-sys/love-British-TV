#!/usr/bin/env python3
"""Preserve T20 four groups, nine B candidate IDs and nine original B source keys with immutable ZIP/crosswalk."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T20.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T20' and len(raw['groups'])==4
orig={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(orig)==9
keys={key for c in orig.values() for key in c['source_keys']}
assert len(keys)==9 and all(key.startswith('B:') for key in keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 assert z.testzip() is None
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
assert len(rows)==1126,len(rows)
for id in orig:
 assert any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' and x['arc']=='T20' for x in rows),id
ds=json.loads((root/'data/stories/serial/chronology-preview-t20-eic-parliament-loan-monopoly-1702-1793.json').read_text(encoding='utf8'))
got={s['original_registry_key'] for s in ds['sources'] if s.get('original_registry_key')}
assert got==keys
mapped=[id for e in ds['events'] for id in e['research_original_record_ids']]
assert set(mapped)==set(orig) and len(mapped)==len(orig)
print('PASS T20 original four research groups, nine candidate IDs, nine B source keys, 1126 original crosswalk and ZIP preserved')
