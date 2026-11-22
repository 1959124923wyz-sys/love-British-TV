#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const story=load('data/stories/serial/e19-t37-maqdala-expedition-looting-1867-1872.json');
const index=load('data/stories/serial/index.json');
const meta=index.topics.find(t=>t.id===story.id);
assert(meta&&meta.status==='editorial_review'&&meta.publication_review==='not_submitted');
assert.equal(story.sections.length,12);
const sourceIds=new Set(story.sources.map(s=>s.id));assert.equal(sourceIds.size,15);
for(const s of story.sources)assert(s.url.startsWith('https://')&&s.label&&s.access);
const pattern=/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,100})\]\]/g;
const ids=story.sections.flatMap(sec=>{assert(sec.source_keys.length&&sec.source_keys.every(id=>sourceIds.has(id)),sec.id);assert(story.topic_source_claims.some(s=>s.section_id===sec.id));return sec.paragraphs.flatMap(p=>[...p.matchAll(pattern)].map(m=>m[1]));});
assert.equal(ids.length,12);assert.equal(new Set(ids).size,12);assert.deepEqual(new Set(meta.event_ids),new Set(ids));
const events=new Map(),maps=[];
for(const start of [1860,1870]){
  const chronology=load('data/stories/serial/chronology-'+start+'-'+(start+9)+'.json');
  const cs=new Set(chronology.sources.map(s=>s.id));
  for(const e of chronology.events.filter(e=>e.id.startsWith('E19-T37-'))){
    assert(!events.has(e.id),'duplicate '+e.id);events.set(e.id,e);
    assert(e.year>=start&&e.year<=start+9);
    assert(e.source_ids.length&&e.source_ids.every(id=>cs.has(id)));
    assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
  }
  const geo=load('data/nineteenth-century-spatial-'+start+'-'+(start+9)+'.geojson');
  for(const f of geo.features.filter(f=>f.id.startsWith('t37-'))){
    maps.push(f);const p=f.properties;
    assert(p.start_year>=start&&p.end_year<=start+9);
    assert(p.source_ids.length&&p.source_ids.every(s=>cs.has(s)),f.id+' unregistered source');
    assert(p.source_urls.length&&p.source_urls.every(s=>s.startsWith('https://')));
    assert.equal(p.historical_boundary_confirmed,false);
    assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);
    assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
    assert(p.mapping_method&&p.named_anchors?.length);
    if(f.geometry.type==='LineString'){assert.equal(p.dash_only,true);assert.equal(p.outline_style,'dashed');assert.equal(f.geometry.coordinates.length,2);}
    else{assert.equal(f.geometry.type,'Point');const [lon,lat]=f.geometry.coordinates;assert(Math.abs(lon)<=180&&Math.abs(lat)<=90);}
  }
}
assert.deepEqual(new Set(events.keys()),new Set(ids));
assert.equal(maps.length,11);
assert.equal(maps.filter(f=>f.geometry.type==='Point').length,8);
assert.equal(maps.filter(f=>f.geometry.type==='LineString').length,3);
assert(!maps.some(f=>f.geometry.type==='Polygon'));
assert.equal(events.get('E19-T37-1868-AROGE-BATTLE').lat,null);
assert.equal(events.get('E19-T37-1872-YOHANNES-REQUEST').lng,null);
assert(maps.some(f=>f.id==='t37-maqdala-1868'&&f.properties.mapping_method.includes('11.2N')));
const board=fs.readFileSync(path.join(root,'research/19c/consolidated/TOPIC_WORKBOARD.csv'),'utf8').split('\n').find(x=>x.startsWith('T37,'));
assert(board.includes('review_ready'));
console.log('PASS T37: 12 sections, 12 live chronology links, 11 GIS (8 sourced reference points / 3 dashed links), no territorial polygon');
