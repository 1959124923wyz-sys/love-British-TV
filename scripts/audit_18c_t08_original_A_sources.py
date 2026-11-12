#!/usr/bin/env python3
"""T08 Editor15 11 groups, 12 candidate actions, 24 A source keys, and 1126-row immutable archive."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T08.json').read_text(encoding='utf8'))
assert raw['story_arc_id']=='T08' and len(raw['groups'])==11
records={c['original_id'] for g in raw['groups'] for c in g['candidate_subevents']}
assert len(records)==12,records
keys={k.removeprefix('A:') for g in raw['groups'] for c in g['candidate_subevents'] for k in c['source_keys'] if k.startswith('A:')}
assert len(keys)==24,keys
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 data=json.loads(z.read('18c_consolidation/SOURCES_A.json'))['sources']
 original_sources={x['id']:x for x in data} if isinstance(data,list) else data
 assert keys<=set(original_sources),keys-set(original_sources)
d=json.loads((root/'data/stories/serial/chronology-preview-t08-seven-years-1740-1775.json').read_text(encoding='utf8'))
registered={s['original_registry_key'].removeprefix('A:') for s in d['sources'] if (s.get('original_registry_key') or '').startswith('A:')}
assert registered==keys,(keys-registered,registered-keys)
used=[id for e in d['events'] for id in e['research_original_record_ids']]
assert len(used)==12 and len(set(used))==12 and set(used)==records
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(x['original_id']==id and x['consolidation_disposition']=='assigned_to_group' for x in rows) for id in records)
print('PASS T08: 11 merged groups, 12 original candidate IDs exactly once, 24 A registry keys in untouched ZIP and all 12 original records in 1126 archive crosswalk')
