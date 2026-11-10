#!/usr/bin/env python3
"""T24 Sri Lanka invasion source archivist: no invented original B references."""
import json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
orig=json.loads((base/'series/T24.json').read_text(encoding='utf8'))
assert orig['story_arc_id']=='T24' and len(orig['groups'])==5
assert sum(len(g['original_candidate_ids']) for g in orig['groups'])==7
keys={k.removeprefix('B:') for g in orig['groups'] for sub in g['candidate_subevents'] for k in sub.get('source_keys',[]) if k.startswith('B:')}
assert len(keys)==9,sorted(keys)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 b=json.loads(z.read('18c_consolidation/SOURCES_B.json'))['sources']
 archived={s['id']:s for s in b} if isinstance(b,list) else b
 assert keys<=set(archived),sorted(keys-set(archived))
 latest=json.loads((root/'data/stories/serial/chronology-preview-ceylon-coastal-invasion-1791-1797.json').read_text(encoding='utf8'))
 retained={s['original_registry_key'].removeprefix('B:') for s in latest['sources'] if (s.get('original_registry_key') or '').startswith('B:')}
 assert retained==keys,(keys-retained,retained-keys)
 print('PASS T24 archive: 5 original groups, 7 candidate IDs, 9 unchanged B source registry keys in preserved ZIP.')
 for key in sorted(keys):print('T24_B_SOURCE',key,json.dumps(archived[key],ensure_ascii=False)[:380])
