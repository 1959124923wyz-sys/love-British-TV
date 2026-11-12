#!/usr/bin/env python3
"""Audit T19: each B source registry key exists in preserved editor15 assistant original ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T19.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T19' and len(t['groups'])==3
keys={key.removeprefix('B:') for g in t['groups'] for sub in g['candidate_subevents'] for key in sub.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 data=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in data} if isinstance(data,list) else data
 missing=keys-set(registry)
 assert not missing,f'Unknown B sources in editor15 archive: {sorted(missing)}'
 d=json.loads((root/'data/stories/serial/chronology-preview-carnatic-hyderabad-1700-1799.json').read_text(encoding='utf8'))
 attached={s['original_registry_key'].removeprefix('B:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert keys==attached, f'Original source names mismatch {sorted(keys)} != {sorted(attached)}'
 assert len(keys)==7,f'Expected seven unique T19 B refs, got {len(keys)}'
 print('PASS T19 original source integrity:',len(t['groups']),'groups,',len(keys),'B original registry references, all present in untouched consolidated ZIP')
 for key in sorted(keys):print('T19_ORIGINAL_B',key,json.dumps(registry[key],ensure_ascii=False))
