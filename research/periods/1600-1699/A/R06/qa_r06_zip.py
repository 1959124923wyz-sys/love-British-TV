#!/usr/bin/env python3
"""Agent A R06 structural QA; explicitly NOT historical/publication approval."""
import csv
import hashlib
import io
import json
import pathlib
import sys
import zipfile

EXPECTED_R05_SHA='f2540168f2befb245055150434e5e882f1ea68043c239bf3da75f790002bb8b8'
REQUIRED=('README_FIRST.md','MANIFEST.json','QA_REPORT.md','CHANGELOG.md',
          'PROGRESS.md','HANDOFF.md','CURRENT/source_A/EVENT_CANDIDATES.json',
          'CURRENT/source_A/SOURCE_REGISTER.csv','CURRENT/source_A/SPATIAL_CANDIDATES.geojson',
          'CURRENT/R06_DELTA/SOURCE_CLAIM_MATRIX.csv','CURRENT/R06_DELTA/NEW_EVENTS.json',
          'CURRENT/SERIAL_ARTICLES/E6-T03-irish-land-property.json',
          'CURRENT/SERIAL_ARTICLES/E6-T04-scotland-glencoe.json')

def run(path):
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None, 'ZIP CRC failure'
        names=z.namelist()
        assert len(names)==len(set(names)), 'duplicate ZIP paths'
        for name in REQUIRED:
            assert name in names, 'missing required file: '+name
        mf=json.loads(z.read('MANIFEST.json'))
        entries={a['path']:a for a in mf['files']}
        assert len(entries)==len(mf['files']), 'duplicate manifest path'
        assert set(entries)==set(names)-{'MANIFEST.json'}, 'manifest file coverage mismatch'
        for name,entry in entries.items():
            raw=z.read(name)
            assert hashlib.sha256(raw).hexdigest()==entry['sha256'], 'bad SHA for '+name
            assert len(raw)==entry['size_bytes'], 'bad length for '+name
        name='ALL_ROUNDS/Editor6-17C-R05-ALL-FULL-20261019.zip'
        assert hashlib.sha256(z.read(name)).hexdigest()==EXPECTED_R05_SHA
        for name,expected_count in [
            ('ALL_ROUNDS/Editor6-17C-R05-ALL-FULL-20261019.zip',211),
            ('ALL_ROUNDS/Editor6-AgentA-R05-ORIGINAL.zip',56)
        ]:
            with zipfile.ZipFile(io.BytesIO(z.read(name))) as old:
                assert old.testzip() is None, 'nested ZIP CRC failure'
                assert len([f for f in old.infolist() if not f.is_dir()])==expected_count
        rows=list(csv.DictReader(io.StringIO(z.read('CURRENT/source_A/SOURCE_REGISTER.csv').decode('utf-8-sig'))))
        assert len(rows)==214
        src_ids=[r['id'] for r in rows]
        assert len(src_ids)==len(set(src_ids))
        sources=set(src_ids)
        events=json.loads(z.read('CURRENT/source_A/EVENT_CANDIDATES.json'))['events']
        assert len(events)==199
        ids=[e['id'] for e in events]
        assert len(ids)==len(set(ids))
        for event in events:
            assert set(event.get('source_ids',[]))<=sources, 'missing sources: '+event['id']
        delta=json.loads(z.read('CURRENT/R06_DELTA/NEW_EVENTS.json'))['events']
        assert len(delta)==6
        for event in delta:
            assert event['id'] in ids
            assert event['approved_for_production'] is False
            assert event['lat'] is None and event['lng'] is None
            assert event['territorial_claim'] is False and event['area_sqkm'] is None
            assert set(event['source_ids'])<=sources
            if event.get('related_existing_event_id'):
                assert event['related_existing_event_id'] in ids
        for topic,slug in [('E6-T03','irish-land-property'),('E6-T04','scotland-glencoe')]:
            article=json.loads(z.read('CURRENT/SERIAL_ARTICLES/'+topic+'-'+slug+'.json'))
            assert article['schema']=='atlas-major-story-v1' and article['id']==topic
            assert article['editorial_status']=='draft_research_only'
            refs={r['id'] for r in article['sources']}
            assert refs<=sources
            sections={s['id'] for s in article['sections']}
            for section in article['sections']:
                assert section['source_keys'] and set(section['source_keys'])<=refs
                assert section['paragraphs'] and all(p.strip() for p in section['paragraphs'])
            for claim in article['topic_source_claims']:
                assert claim['section_id'] in sections
                assert claim['source_keys'] and set(claim['source_keys'])<=refs
                assert claim['publication_approval'] is False
        print('ARCHIVE STRUCTURAL QA: PASS')
        print('211 preserved R05 files; 56 preserved Agent A files')
        print('214 sources; 199 event candidates; 6 new events; 2 research-only articles')
        print('PUBLICATION REVIEW: NOT COVERED / NO-GO')

if __name__=='__main__':
    if len(sys.argv)!=2:
        sys.exit('Usage: python qa_r06_zip.py PATH_TO_R06_FULL_ZIP')
    run(pathlib.Path(sys.argv[1]))
