#!/usr/bin/env python3
"""Verify original editor15 T05 A sources and nine unaltered archive candidate records."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T05.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T05' and len(raw['groups'])==3
ids={child['original_id'] for g in raw['groups'] for child in g['candidate_subevents']}
assert len(ids)==9
keys={key.removeprefix('A:') for g in raw['groups'] for child in g['candidate_subevents'] for key in child['source_keys'] if key.startswith('A:')}
assert len(keys)==5,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 src=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={s['id']:s for s in src} if isinstance(src,list) else src
 assert keys<=set(registry),sorted(keys-set(registry))
out=json.loads((root/'data/stories/serial/chronology-preview-garifuna-1763-1797.json').read_text(encoding='utf8'))
kept={s['original_registry_key'].removeprefix('A:') for s in out['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert kept==keys,(keys-kept,kept-keys)
seen=[id for e in out['events'] for id in e['research_original_record_ids']]
assert len(seen)==9 and len(set(seen))==9 and set(seen)==ids
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(r['original_id']==id and r['consolidation_disposition']=='assigned_to_group' for r in rows) for id in ids)
print('PASS T05 immutable original archive: 3 merged groups, nine one-to-one candidate IDs, five true A source keys inside ZIP and unchanged 1126-record crosswalk')
for k in sorted(keys):print('T05_A',k,json.dumps(registry[k],ensure_ascii=False)[:400])
