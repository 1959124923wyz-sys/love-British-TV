#!/usr/bin/env python3
"""Verify T35 14 original C keys and all 15 historical candidate IDs without duplicating sixth study."""
import pathlib,json,zipfile,csv
root=pathlib.Path(__file__).resolve().parents[1];base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T35.json').read_text(encoding='utf8'))
assert len(raw['groups'])==7
ids={child['original_id'] for g in raw['groups'] for child in g['candidate_subevents']}
assert len(ids)==15
keys={k.removeprefix('C:') for g in raw['groups'] for sub in g['candidate_subevents'] for k in sub['source_keys'] if k.startswith('C:')}
assert len(keys)==14
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
 records=json.loads(z.read('18c_consolidation/SOURCES_C.json'))['sources']
 source_index={s['id']:s for s in records} if isinstance(records,list) else records
 assert keys<=set(source_index),sorted(keys-set(source_index))
latest=json.loads((root/'data/stories/serial/chronology-preview-australia-frontier-1788-1799.json').read_text(encoding='utf8'))
prior=json.loads((root/'data/stories/serial/chronology-preview-australia-1700-1799.json').read_text(encoding='utf8'))
kept={s['original_registry_key'].removeprefix('C:') for s in latest['sources'] if (s.get('original_registry_key') or '').startswith('C:')}
assert kept==keys,(keys-kept,kept-keys)
older={id for e in prior['events'] for id in e.get('research_original_record_ids',[]) if id in ids}
new={id for e in latest['events'] for id in e.get('research_original_record_ids',[])}
assert len(older)==11 and len(new)==4 and older.isdisjoint(new) and older|new==ids
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
 assert all(any(r['original_id']==id and r['consolidation_disposition']=='assigned_to_group' for r in rows) for id in ids)
print('PASS T35 immutable original archive: 7 groups, 15 unique original IDs, 11 already sixth-batch + 4 newly mapped, 14 C sources verified in real ZIP')
for key in sorted(keys):print('T35_C',key,json.dumps(source_index[key],ensure_ascii=False)[:380])
