#!/usr/bin/env python3
"""25th T13: preserve 7 editor15 groups, ten candidates, eleven A plus two C keys, original ZIP/crosswalk."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T13.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T13' and len(raw['groups'])==7
original={c['original_id']:c for g in raw['groups'] for c in g['candidate_subevents']}
assert len(original)==10
allkeys={k for c in original.values() for k in c['source_keys']}
akey={k.removeprefix('A:') for k in allkeys if k.startswith('A:')}
ckey={k for k in allkeys if k.startswith('C:')}
assert len(akey)==11 and ckey=={'C:S81','C:S85'},(akey,ckey)
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 a=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 registry={x['id']:x for x in a} if isinstance(a,list) else a
 assert akey<=set(registry),akey-set(registry)
d=json.loads((root/'data/stories/serial/chronology-preview-t13-hbc-beothuk-dene-1700-1792.json').read_text(encoding='utf8'))
assert len(d['events'])==29 and d['provenance']['original_candidate_ids']==10
registered={x['original_registry_key'] for x in d['sources'] if x.get('original_registry_key')}
assert registered==allkeys,(registered,allkeys)
mapped=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(mapped)==10 and len(set(mapped))==10 and set(mapped)==set(original)
assert len([e for e in d['events'] if len(e['research_original_record_ids'])==2])==1
for e in d['events']:
 for id in e['research_original_record_ids']:
  assert e['year']==original[id]['year']
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 for id in original:
  assert any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' for x in rows),id
print('PASS T13 seven groups, ten original 1126 candidate IDs once, eleven A keys in immutable ZIP, both original C keys retained independently; duplicated 1713 treaty originals consolidated into one real map event.')
