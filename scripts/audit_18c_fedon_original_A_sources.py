#!/usr/bin/env python3
"""Editor15 T06 8 original A source keys, 9 dated candidate originals checked in ZIP+1126 CSV."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T06.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T06' and len(raw['groups'])==2
ids={c['original_id'] for g in raw['groups'] for c in g['candidate_subevents']}
assert len(ids)==9
keys={k.removeprefix('A:') for g in raw['groups'] for c in g['candidate_subevents'] for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==8,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 items=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={s['id']:s for s in items} if isinstance(items,list) else items
 assert keys<=set(registry),sorted(keys-set(registry))
d=json.loads((root/'data/stories/serial/chronology-preview-fedon-grenada-haiti-1789-1798.json').read_text(encoding='utf8'))
registered={s['original_registry_key'].removeprefix('A:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert registered==keys,(keys-registered,registered-keys)
used=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(used)==9 and len(set(used))==9 and set(used)==ids
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' for x in rows) for id in ids)
print('PASS T06: 2 merged groups, nine original editor15 IDs exactly once, eight real A source keys in immutable ZIP and 1126 archive crosswalk')
for k in sorted(keys):print('T06_A',k,json.dumps(registry[k],ensure_ascii=False)[:380])
