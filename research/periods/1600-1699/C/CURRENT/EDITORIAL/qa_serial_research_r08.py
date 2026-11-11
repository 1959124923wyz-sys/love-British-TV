#!/usr/bin/env python3
"""Read current research JSON and source register; gate unsafe auto-publication."""
from pathlib import Path
import csv,json,re,sys
base=Path(__file__).resolve().parents[1]
rows=list(csv.DictReader((base/'SOURCE_REGISTER.csv').open(encoding='utf-8-sig',newline='')))
keys={r['source_id'] for r in rows}
assert len(keys)==len(rows)
filenames=sorted((base/'SERIAL_ARTICLES').glob('E6-T*.json'))
assert len(filenames)>=2
for path in filenames:
 d=json.loads(path.read_text(encoding='utf-8'))
 assert d['schema']=='atlas-major-story-v1'
 assert d['editorial_status']=='draft_research_only' and d['publication_approval'] is False
 assert d['id']==d['parent_serial_topic_id']
 secs=d['sections']; assert len({s['id'] for s in secs})==len(secs)
 sourceids={s['id'] for s in d['sources']};assert len(sourceids)==len(d['sources'])
 claimids={x['claim_id'] for x in d['topic_source_claims']};assert len(claimids)==len(d['topic_source_claims'])
 text='\n'.join(p for s in secs for p in s['paragraphs'])
 for forbidden in ['本轮','下轮','本稿','地图不应','GPS','研究切片','source_key','待上线','本文不授权']:
  assert forbidden not in text,(d['id'],forbidden)
 assert all(d['start_year']<=s['period_start_year']<=s['period_end_year']<=d['end_year'] for s in secs)
 assert all(s['paragraphs'] and all(p.strip() for p in s['paragraphs']) and s['source_keys'] for s in secs)
 assert all(k in sourceids and k in keys for s in secs for k in s['source_keys'])
 assert {x['section_id'] for x in d['topic_source_claims']} == {s['id'] for s in secs}
 assert all(not x.get('publication_approval') for x in d['topic_source_claims'])
 assert not d.get('related_event_ids'),'research-only: do not bind to unpublished atlas events'
 print('PASS STRUCTURE ONLY',d['id'],'sections',len(secs),'sources',len(d['sources']))
print('PASS SOURCE KEYS / dates / no premature approval; HISTORY AND PUBLICATION STILL REQUIRE EDITOR REVIEW')