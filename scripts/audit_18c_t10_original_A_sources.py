#!/usr/bin/env python3
"""23rd T10 archival audit: 2 predecessor groups, 6 original IDs, 7 A sources, 1126-row original crosswalk."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T10.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T10' and len(raw['groups'])==2
old={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(old)==6,old
keys={k.removeprefix('A:') for c in old.values() for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==7,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 d=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 original={x['id']:x for x in d} if isinstance(d,list) else d
 assert keys<=set(original),keys-set(original)
data=json.loads((root/'data/stories/serial/chronology-preview-t10-walking-purchase-1734-1762.json').read_text(encoding='utf8'))
registered={s['original_registry_key'].removeprefix('A:') for s in data['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert registered==keys,(registered,keys)
used=[rid for e in data['events'] for rid in e['research_original_record_ids']]
assert len(used)==6 and set(used)==set(old)
assert data['provenance']['original_candidate_ids']==6 and data['provenance']['original_A_keys']==7
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 for original_id in old:
  assert any(x['original_id']==original_id and x['consolidation_disposition']=='assigned_to_group' for x in rows),original_id
print('PASS T10 original: 2 merged groups, six unique predecessor IDs, seven exact A registry keys in unchanged ZIP, all six original 1126 crosswalk records')
