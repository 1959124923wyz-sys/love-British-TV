#!/usr/bin/env python3
"""Checks that the Snake E03 story patch was applied and does not regress map narrative."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent

def read(p):return json.loads((ROOT/p).read_text(encoding='utf-8'))

def test():
  a80=read('data/atlas-1580-1589.json');a90=read('data/atlas-1590-1599.json')
  index=read('data/stories/index.json')
  e80={e['id']:e for e in a80['events']};e90={e['id']:e for e in a90['events']};events={**e80,**e90}
  sources80={s['id'] for s in a80['sources']}
  ids=['munster-plantation-land-grants-and-aftermath-1584-1589','roanoke-colony-native-conflict-disappearance-1585-1590']
  stories={}
  for slug in ids:
    s=read('data/stories/'+slug+'.json');stories[slug]=s
    assert s['id']==slug
    assert len(s['sections'])>=8,(slug,'few sections')
    assert len(''.join(p for sec in s['sections'] for p in sec['paragraphs']))>=2200,slug
    assert s['sources'] and all(x in {q['id'] for q in s['sources']} for x in s['source_keys'])
    for sec in s['sections']:
      assert sec['source_keys'] and all(x in {q['id'] for q in s['sources']} for x in sec['source_keys'])
      for p in sec['paragraphs']:
        assert not re.search(r'(?:本专题|从地图|对地图|需要读者|GIS|GPS|坐标)',p),(slug,p)
        for eid in re.findall(r'\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]',p):
          assert eid in events,(slug,'bad inline event',eid)
    assert all(x in events for x in s['related_event_ids']),slug
  ownership={};listed={x['id']:x for x in index['stories']}
  assert all(x in listed for x in ids)
  for story in index['stories']:
    for eid in story['event_ids']:
      previous=ownership.get(eid,[])
      assert not previous or eid=='1580S-E029',('unexpected shared story entry',eid,previous,story['id'])
      ownership[eid]=previous+[story['id']]
  assert ownership['1580S-E029']==['munster-desmond-1579-1586','munster-plantation-land-grants-and-aftermath-1584-1589']
  assert 'munster-desmond-1579-1586' in stories[ids[0]]['related_story_ids']
  old=read('data/stories/munster-desmond-1579-1586.json')
  assert ids[0] in old['related_story_ids']
  assert '1580S-E013' in listed['munster-desmond-1579-1586']['event_ids']
  assert '1580S-E013' not in listed[ids[0]]['event_ids']
  assert '1580S-E027' in listed[ids[0]]['event_ids']
  assert '1580S-E015' in e80 and '1580S-E022' in e80 and '1580S-E023' in e80
  for k in ['MUN1587-LAND-CLAIMS-COMMISSION','ROA1586-LANE-COLONY-EVACUATION','ROA1587-GEORGE-HOWE-KILLED','ROA1587-JOHN-WHITE-DEPARTURE']:
    assert k in e80,('missing new event',k)
    assert all(sid in sources80 for sid in e80[k]['source_ids']),('missing source',k)
  wingina=e80['1580S-E022']
  assert wingina['lat'] is None or 'marker' in wingina['geo_precision'].lower()
  assert e80['1580S-E023']['lat'] is None, 'The 1587 friendly Croatoan attack must not be pinned to Croatoan Island'
  assert e90['1590S-E003']['year']==1590
  assert not any(r for r in a90.get('routes',[]) if re.search(r'croatoan|lost.colony|migration',r['id'],re.I)),'Unsourced migration route'
  if wingina['lat'] is not None:
    routes=[x for x in a80['routes'] if x['id']=='snake-e03-roanoke-attack-dasemunkepeuc-1586']
    assert len(routes)==1
    assert routes[0]['route_kind']=='documented-endpoints-connection'
    assert routes[0]['valid_years']==[1586]
    assert routes[0]['real_historical_track'] is False
  reader=(ROOT/'js/history-stories.js').read_text(encoding='utf-8')
  assert 'const relatedStories=(article.related_story_ids||[])' in reader
  assert 'relatedMarkup+' in reader
  assert 'sourceEventId=current&&eventInMemory(current)?current:' in reader
  assert all(e['actual_English_land_area_sqkm'] is None for e in [e80['ROA1586-LANE-COLONY-EVACUATION'],e80['ROA1587-JOHN-WHITE-DEPARTURE']])
  print('PASS: Two long stories, event IDs, source IDs, story cross-links, no ownership collisions, cautious geography, no invented Croatoan migration route.')

if __name__=='__main__':test()
