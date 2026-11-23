#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T40-SOUTHERN-AFRICA-MINES-CONVICT-LABOUR-BOER-WAR',story=load('data/stories/serial/e19-t40-southern-africa-mines-labour-war-1866-1899.json'),index=load('data/stories/serial/index.json');
const entry=index.topics.find(x=>x.id===id);
assert(entry&&story.id===id&&entry.article_file==='data/stories/serial/e19-t40-southern-africa-mines-labour-war-1866-1899.json');
assert.equal(entry.status,'editorial_review');assert.equal(entry.publication_review,'not_submitted');
assert.equal(story.sections.length,22);assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),66);
assert(story.sources.length>=18&&story.topic_source_claims.length===22);
const sources=new Map(story.sources.map(s=>[s.id,s]));
for(const s of story.sections){assert(s.paragraphs.length===3,s.id);assert(s.source_keys.every(k=>sources.has(k)),s.id);assert(s.period_end_year<=1899);}
const links=[...story.sections.flatMap(s=>s.paragraphs).join('\n').matchAll(/\\[\\[([A-Za-z0-9-]+)\\|([^\\]\\n]+)\\]\\]/g)].map(m=>m[1]);
assert.equal(links.length,33);assert.equal(new Set(links).size,33);
assert.equal(links.filter(x=>x==='E19-SAW-1899-WAR').length,1);
assert.deepEqual(new Set(entry.event_ids),new Set(links));
let newEvents=0,newGeo=0,unloc=0;
const existing=[];
for(const d of [1860,1870,1880,1890]){let h=load('data/stories/serial/chronology-'+d+'-'+(d+9)+'.json');let ev=h.events.filter(e=>e.id.startsWith('E19-T40-'));
newEvents+=ev.length;existing.push(...h.events);
const registered=new Set(h.sources.map(s=>s.id));
for(const e of ev){assert.equal(Math.floor(e.year/10)*10,d);assert(e.source_ids.every(s=>registered.has(s)));assert(e.research_original_node_ids?.[0]);assert.equal(e.area_sqkm,null);assert.equal(e.territorial_claim,false);assert.equal(e.historical_control_boundary_verified,false);if(e.lat===null){assert.equal(e.lng,null);unloc++;}}
if(d===1860)continue;
const g=load('data/nineteenth-century-spatial-'+d+'-'+(d+9)+'.geojson');
for(const f of g.features.filter(f=>f.id?.startsWith('t40-'))){
 newGeo++;assert.equal(f.geometry.type,'Point');assert(f.properties.source_ids.length>=2);
 assert.equal(f.properties.exclude_from_area_aggregation,true);assert.equal(f.properties.historical_boundary_confirmed,false);
 assert.equal(f.properties.area_sqkm,null);assert.equal(f.properties.fill_authorized,false);
 assert(f.properties.source_ids.every(x=>registered.has(x)));
 assert(f.properties.related_event_ids.every(x=>h.events.some(e=>e.id===x)));
 }
}
assert.equal(newEvents,32);assert.equal(newGeo,12);
assert(existing.some(x=>x.id==='E19-SAW-1899-WAR'));
assert(!existing.some(x=>x.id.startsWith('E19-T40-1905')));
assert(links.every(x=>existing.some(e=>e.id===x)));
console.log('PASS T40 production preview: 22 sections, 66 paragraphs, '+story.sources.length+' sources, 33 deduplicated links, 32 new events, 12 city-only GIS points, '+unloc+' unlocated events, no historical area fabrications');
