#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const tid='E19-T55-CANADIAN-PACIFIC-RAILWAY-CHINESE-HEAD-TAX-1878-1899',filename='data/stories/serial/e19-t55-canadian-pacific-railway-chinese-head-tax-1878-1899.json';
const story=load(filename),topic=load('data/stories/serial/index.json').topics.find(t=>t.id===tid),m=load('research/19c/consolidated/T55_CASE_CROSSWALK.json');
assert(topic&&story.id===tid&&topic.article_file===filename);
assert.equal(story.sections.length,20);assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),60);
assert.deepEqual(story.sections.reduce((o,s)=>(o[s.narrative_chapter]=(o[s.narrative_chapter]||0)+1,o),{}),{"T55.1":9,"T55.2":11});
assert.equal(story.sources.length,17);assert.equal(story.topic_source_claims.length,20);
const sourceIds=new Set(story.sources.map(s=>s.id));assert.equal(sourceIds.size,17);
for(const s of story.sources)assert(s.url.startsWith('https://')&&s.access,s.id);
const sectids=new Set(story.sections.map(s=>s.id));assert.equal(sectids.size,20);
for(const s of story.sections){assert.equal(s.paragraphs.length,3);assert(s.paragraphs.every(p=>p.length>=10));assert(s.source_keys.length&&s.source_keys.every(k=>sourceIds.has(k)),s.id);}
for(const c of story.topic_source_claims)assert(sectids.has(c.section_id)&&c.source_keys.length&&c.source_keys.every(k=>sourceIds.has(k)));
const links=[...story.sections.flatMap(s=>s.paragraphs).join('\n').matchAll(/\[\[(E19-[A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]);
assert.equal(links.length,20);assert.equal(new Set(links).size,20);assert.deepEqual(new Set(links),new Set(topic.event_ids));assert.deepEqual(new Set(links),new Set(m.events.map(x=>x.id)));
assert.equal(m.reuse_existing.length,0);assert.equal(m.events.filter(x=>!x.already_in_site).length,20);
const chronicles=fs.readdirSync(path.resolve(__dirname,'..','data/stories/serial')).filter(p=>/^chronology-18\d\d-18\d\d\.json$/.test(p)).map(p=>load('data/stories/serial/'+p));
const all=chronicles.flatMap(c=>c.events),events=new Map(all.map(e=>[e.id,e]));
for(const e of m.events)assert(events.has(e.id),e.id);
const added=all.filter(e=>e.id.startsWith('E19-T55-'));assert.equal(added.length,20);
const registry=new Set(chronicles.flatMap(c=>c.sources.map(s=>s.id)));
for(const e of added){
 const ref=m.events.find(x=>x.id===e.id);assert.equal(e.year,ref.year);assert.equal(e.visible_from,e.year);
 assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
 assert(e.source_ids.length&&e.source_ids.every(x=>sourceIds.has(x)&&registry.has(x)),e.id);
 if(ref.anchor){assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert(e.geo_precision.includes('not_historic'))}else{assert.equal(e.lat,null);assert.equal(e.lng,null)}
 assert.deepEqual(e.research_original_node_ids,ref.original_refs);
}
const pts=[1870,1880,1890].flatMap(n=>load('data/nineteenth-century-spatial-'+n+'-'+(n+9)+'.geojson').features).filter(f=>f.properties.stable_id?.startsWith('t55-'));
assert.equal(pts.length,7);
for(const f of pts){const p=f.properties;assert.equal(f.geometry.type,'Point');assert(f.geometry.coordinates.every(Number.isFinite));assert(p.related_event_ids.every(id=>events.has(id)));assert(p.source_urls.length&&p.source_ids.every(k=>sourceIds.has(k)&&registry.has(k)),p.stable_id);assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);}
console.log('PASS T55 source, links and GIS invariants');
