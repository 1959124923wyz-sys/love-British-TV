#!/usr/bin/env python3
"""T21 original East India Company opium and salt archive source-key check."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T21.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T21' and len(raw['groups'])==3
assert sum(len(x['original_candidate_ids']) for x in raw['groups'])==9
keys={k.removeprefix('B:') for g in raw['groups'] for c in g['candidate_subevents'] for k in c.get('source_keys',[]) if k.startswith('B:')}
assert len(keys)==6,sorted(keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 b=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 orig={s['id']:s for s in b} if isinstance(b,list) else b
 assert keys<=set(orig),sorted(keys-set(orig))
 c=json.loads((root/'data/stories/serial/chronology-preview-india-opium-salt-1761-1799.json').read_text(encoding='utf8'))
 kept={s['original_registry_key'].removeprefix('B:') for s in c['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert kept==keys,(keys-kept,kept-keys)
 print('PASS T21 original ZIP: 3 merged groups, 9 original events, 6 actual B source keys; no mutation')
 for k in sorted(keys):print('T21_SOURCE',k,json.dumps(orig[k],ensure_ascii=False)[:420])
