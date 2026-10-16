#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const R=path.resolve(__dirname,'..'),get=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const a=get('data/atlas-1510-1519.json'),b=get('data/atlas-1520-1529.json'),idx=get('data/stories/index.json').stories;
const events=new Map([...a.events,...b.events].map(e=>[e.id,e]));
const selected=[
 {id:'henry-viii-france-tournai-1513-1519',n:9,start:1513,end:1519,added:['FR1513-GUINEGATE-SPURS','FR1513-THEROUANNE-DESTRUCTION','FR1515-TOURNAI-HENRYVIII-CITADEL']},
 {id:'surrey-irish-expedition-1520-1522',n:9,start:1520,end:1522,added:['IR1520-SURREY-WOOD-QUAY-ARRIVAL','IR1521-SURREY-NAAS-DEFENCE','IR1521-SURREY-LEIX-SECOND-HOSTING']}
];
for(const o of selected){
 const meta=idx.find(x=>x.id===o.id);assert(meta,'missing metadata '+o.id);
 const doc=get(meta.file);assert.equal(doc.id,o.id);assert.equal(doc.title,meta.title);
 assert.equal(doc.sections.length,o.n);assert.equal(doc.start_year,o.start);assert.equal(doc.end_year,o.end);
 assert.deepEqual(new Set(doc.related_event_ids),new Set(meta.event_ids));
 const prose=[doc.lead,...doc.sections.flatMap(s=>s.paragraphs)].join('');
 assert(prose.length>=3000,'historical article too short');
 assert(!/对地图来说|图钉|读者需要|本文将|不能据此|绘制要求|历史GIS/.test(prose),'technical map lecture leaked into prose');
 const sources=new Set(doc.sources.map(x=>x.id));assert(sources.size>=6);
 let links=0;
 for(const s of doc.sections){
  for(const k of s.source_keys)assert(sources.has(k),'unknown source '+k);
  for(const p of s.paragraphs)for(const x of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)){assert(events.has(x[1]),'link points to missing event '+x[1]);links++;}
 }
 assert(links>=12,'too few geographic reading links');
 for(const id of o.added){
  const e=events.get(id);assert(e,'new war event missing '+id);
  assert(meta.event_ids.includes(id),'new event missing from article '+id);
  assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),'missing named place '+id);
  assert.equal(e.historical_control_boundary_verified,false);
  assert.equal(e.actual_English_land_area_sqkm,null);
  assert.equal(e.actual_English_territory_created,false);
  assert(e.source_ids.length>=1&&e.source_ids.every(x=>(o.start===1513?a:b).sources.some(s=>s.id===x)));
 }
 console.log('PASS '+o.id+' '+prose.length+' prose characters, '+links+' links');
}
const fr=a.routes.find(x=>x.id==='FR1513-THEROUANNE-TOURNAI-ADVANCE');
const ir=b.routes.find(x=>x.id==='IR1521-MONASTERORIS-TO-DUBLIN-RETURN');
for(const [r,y] of [[fr,1513],[ir,1521]]){
 assert(r&&r.year===y);
 assert.deepEqual(r.valid_years,[y]);
 assert.equal(r.route_kind,'documented-endpoints-connection');
 assert.equal(r.coords.length,2);
 assert.equal(r.historical_boundary_confirmed,false);
 assert.equal(r.territorial_claim,false);
 assert.equal(r.area_sqkm,null);
}
const oldFrench=get('data/french-urban-control-1500-1519.geojson').features.find(f=>f.id==='tournai-urban-core-1513-1518');
assert(oldFrench&&oldFrench.properties.end_year===1519&&oldFrench.properties.end_month===2);
assert.equal(a.colonial_polygons.length,0);
assert.equal(b.colonial_polygons.length,0);
assert.equal(idx.length,6);
console.log('PASS two historical longforms: 6 new sites, 2 annual schematic relations, original 1519 control release preserved');
