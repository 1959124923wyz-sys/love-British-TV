#!/usr/bin/env python3
"""Check T18 source keys against preserved editor15 assistant B register in original ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T18.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T18' and len(t['groups'])==3
keys={key.removeprefix('B:') for g in t['groups'] for sub in g['candidate_subevents'] for key in sub.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 data=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in data} if isinstance(data,list) else data
 missing=keys-set(registry)
 assert not missing,f'Original B register keys missing: {sorted(missing)}'
 d=json.loads((root/'data/stories/serial/chronology-preview-maratha-rohilla-awadh-1700-1799.json').read_text(encoding='utf8'))
 attached={s['original_registry_key'].removeprefix('B:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert keys==attached, f'Original sources mismatch: {sorted(keys)} vs {sorted(attached)}'
 assert len(keys)==9,f'Expected 9 distinct original B keys, got {len(keys)}'
 print('PASS T18 source audit: 3 groups,',len(keys),'genuine B source keys matched to original retained ZIP')
 for key in sorted(keys):
  print('T18_B_SOURCE',key,json.dumps(registry[key],ensure_ascii=False))
