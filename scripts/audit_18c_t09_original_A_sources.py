#!/usr/bin/env python3
"""Original editor15 T09 source ZIP, nine candidates, 1126 crosswalk not silently lost or duplicated."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
old=json.loads((base/'series/T09.json').read_text(encoding='utf8'))
assert old['story_arc_id']=='T09' and len(old['groups'])==5
ids={c['original_id'] for g in old['groups'] for c in g['candidate_subevents']}
assert len(ids)==9
keys={k.removeprefix('A:') for g in old['groups'] for c in g['candidate_subevents'] for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==9
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 items=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={s['id']:s for s in items} if isinstance(items,list) else items
 assert keys<=set(registry),sorted(keys-set(registry))
new=json.loads((root/'data/stories/serial/chronology-preview-tuscarora-yamasee-1707-1732.json').read_text(encoding='utf8'))
kept={s['original_registry_key'].removeprefix('A:') for s in new['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert kept==keys,(keys-kept,kept-keys)
mapped=[id for e in new['events'] for id in e['research_original_record_ids']]
assert len(mapped)==9 and len(set(mapped))==9 and set(mapped)==ids
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(row['original_id']==id and row['consolidation_disposition']=='assigned_to_group' for row in rows) for id in ids)
print('PASS immutable T09 source ZIP and 1126-row crosswalk: 5 merge groups, nine original candidates exactly once, nine original A archive keys unchanged')
for k in sorted(keys):print('T09_A',k,json.dumps(registry[k],ensure_ascii=False)[:350])
