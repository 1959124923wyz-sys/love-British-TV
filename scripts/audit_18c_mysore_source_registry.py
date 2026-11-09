#!/usr/bin/env python3
"""Validate all original assistant B sources used in T17 against preserved editor15 ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T17.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T17' and len(t['groups'])==5
keys={key.removeprefix('B:') for g in t['groups'] for sub in g['candidate_subevents'] for key in sub.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 data=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in data} if isinstance(data,list) else data
 missing=keys-set(registry)
 assert not missing,f'Missing original assistant B registry keys: {sorted(missing)}'
 sources=json.loads((root/'data/stories/serial/chronology-preview-mysore-1700-1799.json').read_text(encoding='utf8'))['sources']
 recorded={s['original_registry_key'].removeprefix('B:') for s in sources if (s.get('original_registry_key') or '').startswith('B:')}
 assert keys==recorded, f'Mismatch: original {sorted(keys)}, displayed {sorted(recorded)}'
 print('PASS T17 original five groups,',len(keys),'unique B registry refs, all bound to atlas source records')
 for key in sorted(keys): print('T17_B_SOURCE',key,json.dumps(registry[key],ensure_ascii=False))
