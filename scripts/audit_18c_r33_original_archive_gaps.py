#!/usr/bin/env python3
"""Five original 1126-row candidates and 8 A/B keys among 3 archive gaps; read-only originals."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
gids=['E18-MRG-T14-07','E18-MRG-T02-02','E18-MRG-T07-06']
groups=[]
for arc,gid in zip(('T14','T02','T07'),gids):
 raw=json.loads((base/'series'/f'{arc}.json').read_text(encoding='utf8'))
 assert raw['story_arc_id']==arc
 groups.append(next(g for g in raw['groups'] if g['id']==gid))
old={e['original_id']:(e,g) for g in groups for e in g['candidate_subevents']}
assert len(old)==5 and sum(len(g['candidate_subevents']) for g in groups)==5
keys={k for g in groups for k in g['source_keys']}
assert len(keys)==8
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 assert z.testzip() is None
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
assert len(rows)==1126
for oid,(v,g) in old.items():
 assert any(row['original_id']==oid and row['merged_group_id']==g['id'] and row['arc']==g['story_arc_id'] and row['consolidation_disposition']=='assigned_to_group' for row in rows),oid
dataset=json.loads((root/'data/stories/serial/chronology-preview-r33-three-archival-gaps-1761-1790.json').read_text(encoding='utf8'))
assert dataset['provenance']['original_merge_groups']==3
assert dataset['provenance']['mapped_original_ids']==dataset['provenance']['original_candidate_ids']==5
assert set(dataset['provenance']['original_source_keys'])==keys
assert {s['original_registry_key'] for s in dataset['sources'] if s.get('original_registry_key')}==keys
mapped=[(oid,e) for e in dataset['events'] for oid in e['research_original_record_ids']]
assert len(mapped)==5 and {oid for oid,e in mapped}==set(old)
for oid,e in mapped:
 v,g=old[oid]
 assert e['year']==v['year'] and e['research_merge_group_id']==g['id']
 assert all('18CR33-'+k.replace(':','-') in e['source_ids'] for k in v['source_keys'])
print('PASS R33 original 1126 archive unchanged: 3 groups / 5 original IDs / 8 A/B source keys / no invented cross-arc group mapping')
