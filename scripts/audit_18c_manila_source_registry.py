#!/usr/bin/env python3
"""Ensure original editor15 T22 Manila evidence keys resolve to unchanged assistant B sources."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T22.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T22' and len(t['groups'])==1
keys={key.removeprefix('B:') for g in t['groups'] for sub in g['candidate_subevents'] for key in sub.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 data=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in data} if isinstance(data,list) else data
 assert not(keys-set(registry)),f'Missing original B sources: {keys-set(registry)}'
 sources=json.loads((root/'data/stories/serial/chronology-preview-manila-1700-1799.json').read_text(encoding='utf8'))['sources']
 recorded={s['original_registry_key'].removeprefix('B:') for s in sources if (s.get('original_registry_key') or '').startswith('B:')}
 assert keys==recorded,f'Original B keys vs registered sources mismatch: {sorted(keys)} != {sorted(recorded)}'
 assert len(keys)==4
 print('PASS Manila T22: 1 original research group, 4 original candidate records, 4 original B source keys archived')
 for key in sorted(keys): print('T22_B_SOURCE',key,json.dumps(registry[key],ensure_ascii=False))
