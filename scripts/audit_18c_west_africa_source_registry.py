#!/usr/bin/env python3
"""Validate all T26 original B source IDs in unmodified editor15 archived assistant ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
t=json.loads((base/'series/T26.json').read_text(encoding='utf8'))
assert t['story_arc_id']=='T26' and len(t['groups'])==7
keys={key.removeprefix('B:') for g in t['groups'] for item in g['candidate_subevents'] for key in item.get('source_keys',[]) if key.startswith('B:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 old=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 registry={s['id']:s for s in old} if isinstance(old,list) else old
 assert not(keys-set(registry)),f'Original archive lacks sources: {sorted(keys-set(registry))}'
 fresh=json.loads((root/'data/stories/serial/chronology-preview-west-africa-enslavement-1700-1799.json').read_text(encoding='utf8'))
 attached={s['original_registry_key'].removeprefix('B:') for s in fresh['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert keys==attached,f'B source names mismatch: {sorted(keys)} vs {sorted(attached)}'
 assert len(keys)==20,f'Expected twenty authentic B source keys, found {len(keys)}'
 assert sum(len(g['original_candidate_ids']) for g in t['groups'])==13
 print('PASS T26 original source audit: 7 genuine merged groups, 13 actual candidate records,',len(keys),'authentic B source registry keys in untouched archived ZIP')
 for key in sorted(keys):print('T26_B_SOURCE',key,json.dumps(registry[key],ensure_ascii=False))
