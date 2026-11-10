#!/usr/bin/env python3
"""Verify all T27 original B-source keys from editor15 immutable consolidated ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T27.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T27' and len(t['groups'])==3
keys={key.removeprefix('B:') for g in t['groups'] for sub in g['candidate_subevents'] for key in sub.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 registry_raw=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in registry_raw} if isinstance(registry_raw,list) else registry_raw
 assert not(keys-set(registry)),f'Original archival B IDs missing: {keys-set(registry)}'
 d=json.loads((root/'data/stories/serial/chronology-preview-sierra-leone-1700-1799.json').read_text(encoding='utf8'))
 registered={x['original_registry_key'].removeprefix('B:') for x in d['sources'] if (x.get('original_registry_key') or '').startswith('B:')}
 assert keys==registered,f'B registration differs from original ZIP: {sorted(keys)} vs {sorted(registered)}'
 assert len(keys)==7 and sum(len(g['original_candidate_ids']) for g in t['groups'])==4
 print('PASS T27: 3 actual original groups, 4 original IDs, 7 unmodified historical assistant-B reference keys')
 for k in sorted(keys):print('T27_B_SOURCE',k,json.dumps(registry[k],ensure_ascii=False))
