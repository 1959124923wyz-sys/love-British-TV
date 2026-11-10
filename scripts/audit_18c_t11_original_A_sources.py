#!/usr/bin/env python3
"""Audit immutable editor15 T11 original A source keys and all 10 candidate actions."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
original=json.loads((base/'series/T11.json').read_text(encoding='utf8'))
assert original['story_arc_id']=='T11' and len(original['groups'])==8
ids={c['original_id'] for g in original['groups'] for c in g['candidate_subevents']}
assert len(ids)==10,ids
keys={k.removeprefix('A:') for g in original['groups'] for c in g['candidate_subevents'] for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==21,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 items=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={x['id']:x for x in items} if isinstance(items,list) else items
 assert keys<=set(registry),sorted(keys-set(registry))
d=json.loads((root/'data/stories/serial/chronology-preview-british-slavery-stono-fortmose-1705-1752.json').read_text(encoding='utf8'))
kept={s['original_registry_key'].removeprefix('A:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert kept==keys,(keys-kept,kept-keys)
new=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(new)==10 and len(set(new))==10 and set(new)==ids
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' for x in rows) for id in ids)
print('PASS immutable T11 source ZIP: 8 groups 10 original candidate IDs mapped once, 21 authentic A keys from editor15 SOURCE_A registry and original 1126 crosswalk unchanged.')
for k in sorted(keys): print('T11_A',k,json.dumps(registry[k],ensure_ascii=False)[:330])
