#!/usr/bin/env python3
"""T11 original Editor15 A source keys and 1126 source-disposition integrity."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T11.json').read_text(encoding='utf-8'))
assert raw['story_arc_id']=='T11' and len(raw['groups'])==8
ids={c['original_id'] for g in raw['groups'] for c in g['candidate_subevents']}
assert len(ids)==10,ids
keys={k.removeprefix('A:') for g in raw['groups'] for c in g['candidate_subevents'] for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==21,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 items=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={s['id']:s for s in items} if isinstance(items,list) else items
 assert keys<=set(registry),sorted(keys-set(registry))
d=json.loads((root/'data/stories/serial/chronology-preview-t11-slavery-law-resistance-1702-1741.json').read_text(encoding='utf-8'))
registered={s['original_registry_key'].removeprefix('A:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert registered==keys,(keys-registered,registered-keys)
used=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(used)==10 and len(set(used))==10 and set(used)==ids
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as fh:
 rows=list(csv.DictReader(fh))
 assert all(any(r['original_id']==id and r['consolidation_disposition']=='assigned_to_group' for r in rows) for id in ids)
print('PASS T11: 8 groups 10 original IDs exactly once; 21 original A keys exist in immutable ZIP and all original records remain in 1126 crosswalk')
