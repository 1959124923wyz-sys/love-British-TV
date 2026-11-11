#!/usr/bin/env python3
"""Verify T33 was genuinely an EMPTY prior arc; source research added without fabricated inherited IDs."""
import csv,json,pathlib,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
raw=json.loads((base/'series/T33.json').read_text(encoding='utf-8'))
assert raw['story_arc_id']=='T33' and raw['groups']==[]
assert raw['main_map_candidates']==0 and raw['topic_mode_candidates']==0 and raw['narrative_only_groups']==0
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as a:
 assert a.testzip() is None
with (base/'COMPLETE_1126_ARCHIVE_CROSSWALK.csv').open(encoding='utf-8-sig',newline='') as f:
 rows=list(csv.DictReader(f))
assert len(rows)==1126
ds=json.loads((root/'data/stories/serial/chronology-preview-t33-scotland-slavery-courts-1707-1792.json').read_text(encoding='utf-8'))
assert ds['provenance']['original_merge_groups']==0 and ds['provenance']['original_candidate_ids']==0
assert ds['provenance']['original_B_keys']==0 and ds['provenance']['mapped_original_ids']==0
assert all(not x.get('original_registry_key') for x in ds['sources'])
assert all(not x['research_original_record_ids'] and x['research_merge_group_id'] is None for x in ds['events'])
assert len(ds['events'])==29 and len(ds['sources'])==21
print('PASS T33 zero original research groups, zero B IDs, 29 independently sourced events, 1126 original unchanged crosswalk and intact original research ZIP')
