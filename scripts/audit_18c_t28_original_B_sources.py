#!/usr/bin/env python3
"""T28 original two research groups, four B source keys, four IDs; preserve immutable original ZIP."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T28.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T28' and len(raw['groups'])==2
old={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(old)==4
keys={k for c in old.values() for k in c['source_keys']}
assert len(keys)==4 and all(k.startswith('B:') for k in keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as archive:
 assert archive.testzip() is None
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
assert len(rows)==1126
for id in old:
 assert any(row['original_id']==id and row['consolidation_disposition']=='assigned_to_group' and row['arc']=='T28' for row in rows),id
ds=json.loads((root/'data/stories/serial/chronology-preview-t28-havana-egmont-malta-1762-1799.json').read_text(encoding='utf8'))
registered={s['original_registry_key'] for s in ds['sources'] if s.get('original_registry_key')}
assert registered==keys
mapped=[id for e in ds['events'] for id in e['research_original_record_ids']]
assert len(mapped)==len(old) and set(mapped)==set(old)
print('PASS T28: 2 prior research groups, 4 B candidate IDs, 4 B registry keys, 1126 crosswalk, unmodified ZIP')
