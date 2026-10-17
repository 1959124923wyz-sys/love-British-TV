#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const atlas=read('data/atlas-1560-1569.json'),stories=read('data/stories/index.json').stories;
const id='hawkins-lovell-atlantic-enslavement-1562-1569',meta=stories.find(x=>x.id===id);
assert(meta&&meta.status==='published'&&stories.length===37);
const doc=read(meta.file),body=doc.sections.flatMap(s=>s.paragraphs).join('');
assert(doc.id===meta.id&&doc.sections.length===10&&body.length>=3700);
assert(doc.sources.length===10&&doc.sources.every(s=>s.url.startsWith('https://')&&s.access));
assert(doc.lead.length>=120);
const keys=new Set(doc.sources.map(s=>s.id));
assert(doc.sections.every(s=>s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k))));
assert.deepEqual(new Set(meta.event_ids),new Set(doc.related_event_ids));assert.equal(meta.event_ids.length,18);
const all=new Map(atlas.events.map(e=>[e.id,e])),refs=new Map(atlas.sources.map(s=>[s.id,s]));
const inline=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);
assert(inline.length>=18&&inline.every(id=>all.has(id)&&meta.event_ids.includes(id)));
const newids=['LOV1566-PLYMOUTH-SLAVING-EXPEDITION','LOV1566-PORTUGUESE-SHIP-CAPTIVES','LOV1567-RIOHACHA-ENSLAVED-ABANDONED','LOV1567-PLYMOUTH-AFRICAN-CAPTIVES-TRANSFER'];
assert.deepEqual(meta.event_ids.filter(x=>x.startsWith('LOV156')),newids);
assert.equal(atlas.events.length,60);assert.equal(atlas.sources.length,63);
assert.equal(atlas.routes.length,17,'Retain existing historically qualified schematic Hawkins sailing legs; no invented Lovell exact route');
assert.equal(atlas.colonial_polygons.length,0);
for(const id of newids){
const e=all.get(id);assert(e&&e.source_ids.length>=2&&e.source_ids.every(s=>refs.has(s)));
assert.equal(e.icon_code,'SLV');assert.equal(e.category,'slavery');
assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);
assert.equal(e.actual_English_territory_created,false);assert.equal(e.historical_control_boundary_verified,false);
assert.equal(e.exclude_point_buffer_from_area_statistics,true);
}
const capture=all.get(newids[1]);assert.equal(capture.lat,null);assert.equal(capture.lng,null);assert(capture.geo_precision.startsWith('unlocated_'));
const first=all.get(newids[0]),returnSite=all.get(newids[3]),rio=all.get(newids[2]);
assert.equal(first.year,1566);assert.equal(returnSite.year,1567);assert.equal(rio.year,1567);
assert.deepEqual([first.lat,first.lng],[50.3755,-4.1427]);
assert.deepEqual([returnSite.lat,returnSite.lng],[50.3755,-4.1427]);
assert.deepEqual([rio.lat,rio.lng],[11.55,-72.91]);
assert(rio.description.includes('约92名')&&rio.description.includes('不能据此推定'));
assert(returnSite.description.includes('不足以确定')&&returnSite.description.includes('牛津大学'));
assert(body.includes('三次率领')&&body.includes('洛弗尔')&&body.includes('不得合并'));
assert(body.includes('约92人')&&body.includes('不能直接推断'));
for(const eid of ['1560S-E005','1560S-E010','1560S-E015','1560S-E018','1560S-E021']){
 assert.equal(atlas.events.filter(e=>e.id===eid).length,1,'Do not duplicate existing Hawkins source-mapped events');
}
console.log('PASS Hawkins/Lovell/Drake 1562–69: 10 sections, 18 linked historical events, 4 novel Lovell 1566–67 nodes, 17 old sourced schematic route segments unchanged, unsupported slave ship GPS null');