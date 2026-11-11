#!/usr/bin/env python3
"""Audit T23 original 5 groups, 12 B candidate IDs, 13 B source keys and immutable original archive."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T23.json').read_text(encoding='utf-8'))
assert raw['story_arc_id']=='T23' and len(raw['groups'])==5
orig={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(orig)==12
keys={x for c in orig.values() for x in c['source_keys']}
assert len(keys)==13 and all(k.startswith('B:') for k in keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 assert z.testzip() is None
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
assert len(rows)==1126
for id in orig:
 assert any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' and x['arc']=='T23' for x in rows),id
d=json.loads((root/'data/stories/serial/chronology-preview-t23-penang-kedah-moluccas-1768-1796.json').read_text(encoding='utf8'))
registered={s['original_registry_key'] for s in d['sources'] if s.get('original_registry_key')}
assert registered==keys
mapped=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(mapped)==len(orig) and set(mapped)==set(orig)
print('PASS T23 5 original groups, 12 unique original candidate IDs, 13 B registry keys, 1126 crosswalk and immutable research ZIP')
