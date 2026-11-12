#!/usr/bin/env python3
"""Check T25 eight original B source keys against main retained editor15 assistant ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T25.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T25' and len(t['groups'])==3
keys={key.removeprefix('B:') for g in t['groups'] for s in g['candidate_subevents'] for key in s.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 data=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in data} if isinstance(data,list) else data
 assert not(keys-set(registry)),f'Original T25 keys absent from untouched B registry: {sorted(keys-set(registry))}'
 data=json.loads((root/'data/stories/serial/chronology-preview-cape-1795-1799.json').read_text(encoding='utf8'))
 attached={s['original_registry_key'].removeprefix('B:') for s in data['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert keys==attached,f'Original B registry names mismatch {sorted(keys)} vs {sorted(attached)}'
 assert len(keys)==8,f'T25 original source count mismatch: {len(keys)}'
 print('PASS T25 original archive: 3 actual merged groups, 8 original records, 8 original assistant-B source keys from immutable ZIP')
 for key in sorted(keys):print('T25_B_SOURCE',key,json.dumps(registry[key],ensure_ascii=False))
