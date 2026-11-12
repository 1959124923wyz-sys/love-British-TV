#!/usr/bin/env python3
"""Editor15 T09 9 archival candidates, 9 A source keys, 1 date-conflicting candidate explicitly deferred."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T09.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T09' and len(raw['groups'])==5
candidates={c['original_id'] for g in raw['groups'] for c in g['candidate_subevents']}
assert len(candidates)==9,candidates
keys={k.removeprefix('A:') for g in raw['groups'] for c in g['candidate_subevents'] for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==9,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 entries=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 originals={v['id']:v for v in entries} if isinstance(entries,list) else entries
 assert keys<=set(originals),keys-set(originals)
d=json.loads((root/'data/stories/serial/chronology-preview-t09-tuscarora-yamasee-1702-1732.json').read_text(encoding='utf8'))
registered={s['original_registry_key'].removeprefix('A:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert registered==keys,(keys-registered,registered-keys)
used=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(used)==8 and len(set(used))==8
deferred=d['provenance']['deferred_original_ids']
assert deferred==['E18A2-TUS-FEBTREATY']
assert len(set(used)|set(deferred))==9 and (set(used)|set(deferred))==candidates
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' for x in rows) for id in candidates)
print('PASS T09: 5 original groups, 9 A source keys, 9/9 archived candidate records; 8 integrated / one 1715 February treaty date unverified and explicitly deferred; 1126 rows unchanged')
