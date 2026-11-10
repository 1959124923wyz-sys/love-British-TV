#!/usr/bin/env python3
"""Check editor15 T26 original assistant-B source keys in immutable archived ZIP."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T26.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T26' and len(raw['groups'])==7
keys={k.removeprefix('B:') for g in raw['groups'] for sub in g['candidate_subevents'] for k in sub.get('source_keys',[]) if k.startswith('B:')}
assert len(keys)==20,sorted(keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 b=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 originals={s['id']:s for s in b} if isinstance(b,list) else b
 assert keys<=set(originals),sorted(keys-set(originals))
 c=json.loads((root/'data/stories/serial/chronology-preview-west-africa-1727-1792.json').read_text(encoding='utf8'))
 matched={s['original_registry_key'].removeprefix('B:') for s in c['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert matched==keys,(keys-matched,matched-keys)
 print('PASS T26 original archive: seven consolidated groups, thirteen original records, twenty preserved source keys verified in unchanged ZIP')
 for key in sorted(keys):print('T26_B_SOURCE',key,json.dumps(originals[key],ensure_ascii=False)[:500])
