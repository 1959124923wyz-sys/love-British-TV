#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const story=load('data/stories/serial/e19-t05-morant-bay-martial-law-crown-colony-1865-1879.json');
const meta=load('data/stories/serial/index.json').topics.find(t=>t.id===story.id);
assert(meta && ['editorial_review','published'].includes(meta.status));
if(meta.status==='published') assert.equal(meta.publication_review,'approved');
assert.equal(story.sections.length,18);assert.equal(story.sources.length,19);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),54);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>4000);
assert.deepEqual(story.sections.reduce((a,s)=>(a[s.narrative_chapter]=(a[s.narrative_chapter]||0)+1,a),{}),{'T05.1':14,'T05.2':4});
const src=new Set(story.sources.map(s=>s.id));assert.equal(src.size,19);
for(const source of story.sources) assert(source.url.startsWith('https://')&&source.publisher&&source.access);
const links=story.sections.flatMap(s=>{
 assert(s.source_keys.length && s.source_keys.every(k=>src.has(k)),s.id);
 assert(story.topic_source_claims.some(c=>c.section_id===s.id),s.id+' missing source claims');
 return s.paragraphs.flatMap(p=>[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,100})\]\]/g)].map(m=>m[1]));
});
const ledger=load('data/research/19c-t05-editorial-event-ledger.json');
const ids=new Set(ledger.event_ids);
assert.equal(links.length,23);assert.equal(new Set(links).size,23);assert.equal(ids.size,23);
assert.deepEqual(new Set(links),ids);assert.deepEqual(new Set(meta.event_ids),ids);
const newEvents=load('data/research/19c-t05-new-chronology-events.json').events;
assert.equal(newEvents.length,23);assert.deepEqual(new Set(newEvents.map(e=>e.id)),ids);
const ch=load('data/stories/serial/chronology-1860-1869.json'),ch70=load('data/stories/serial/chronology-1870-1879.json');
assert.equal(new Set(ch.events.map(e=>e.id)).size,ch.events.length);
const live=new Map(ch.events.map(e=>[e.id,e]));
const sources60=new Set(ch.sources.map(s=>s.id)),sources70=new Set(ch70.sources.map(s=>s.id));
for(const id of ids)assert(live.has(id),'missing live event '+id);
for(const ev of ch.events.filter(e=>ids.has(e.id))){
 assert(ev.year>=1860&&ev.year<1870);
 assert(ev.source_ids?.length&&ev.source_ids.every(k=>sources60.has(k)),ev.id+' missing sources');
 assert.equal(ev.area_sqkm,null);assert.equal(ev.fill_authorized,false);assert.equal(ev.territorial_claim,false);
}
assert.equal(live.get('E19-T05-1865-OCT13-MARTIAL-LAW').lat,null,'Surrey county boundaries were not geocoded');
assert(live.get('E19-T05-1865-OCT23-GORDON-EXECUTION').date_label.includes('23日'));
assert(live.get('E19-T05-1865-OCT24-BOGLE-EXECUTION').date_label.includes('24日'));
const geo60=load('data/nineteenth-century-spatial-1860-1869.geojson').features.filter(f=>f.id.startsWith('t05-'));
const geo70=load('data/nineteenth-century-spatial-1870-1879.geojson').features.filter(f=>f.id.startsWith('t05-'));
assert.equal(geo60.length,5);assert.equal(geo70.length,1);
assert.equal(geo60.filter(f=>f.geometry.type==='Point').length,4);
assert.equal(geo60.filter(f=>f.geometry.type==='LineString').length,1);
assert.equal(geo70[0].geometry.type,'Point');
for(const feature of [...geo60,...geo70]){
 const p=feature.properties;
 assert(p.source_ids?.length && p.source_ids.every(k=>(p.start_year>=1870?sources70:sources60).has(k)),feature.id);
 assert(p.related_event_ids?.length && p.related_event_ids.every(k=>ids.has(k)),feature.id);
 assert(p.source_urls?.length && p.source_urls.every(u=>u.startsWith('https://')));
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.mapping_method&&p.geo_precision&&p.named_anchors?.length,feature.id);
 if(feature.geometry.type==='LineString') {
  assert.equal(p.dash_only,true);assert.equal(p.outline_style,'dashed');
  assert.equal(feature.geometry.coordinates.length,2);
 }
}
assert(geo60.find(f=>f.id==='t05-kingston-civil-jurisdiction-1865').properties.summary_zh.includes('排除'));
const all=load('data/stories/serial/index.json').topics;
for(const topic of ['E19-T37-MAQDALA-EXPEDITION-LOOTING','E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE'])
 assert(all.some(t=>t.id===topic&&t.status==='published'),topic);
console.log('PASS T05 two chapters / 18 sections / 54 paragraphs / 19 sources / 23 links / 6 GIS / zero fabricated Surrey polygons');
