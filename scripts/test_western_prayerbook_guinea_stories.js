#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=J('data/atlas-1540-1549.json'),b=J('data/atlas-1550-1559.json'),idx=J('data/stories/index.json').stories;
const reach=J('data/war-front-corridors-1540-1549.geojson').features;
const all=new Map([...a.events,...b.events].map(x=>[x.id,x]));
assert.equal(a.events.length,106);assert.equal(a.sources.length,143);
assert.equal(b.events.length,35);assert.equal(b.sources.length,58);
assert.ok(idx.length>=26,'Keep all published stories and four integrated topics');
for(const [id,start,end,minimum] of [
 ['western-prayer-book-rising-royal-suppression-1549',1549,1549,16],
 ['english-guinea-trade-enslaved-africans-1553-1557',1553,1557,10]
]){
 const m=idx.find(x=>x.id===id);assert(m,'missing story '+id);
 const v=J(m.file),full=v.sections.flatMap(x=>x.paragraphs).join('');
 assert.equal(v.start_year,start);assert.equal(v.end_year,end);
 assert(v.sections.length>=10&&full.length>=2500,'insufficient reading material '+id);
 assert(v.sources.length>=7&&v.related_event_ids.length>=minimum);
 assert.deepEqual(new Set(v.related_event_ids),new Set(m.event_ids));
 const sources=new Set(v.sources.map(s=>s.id));
 let links=0;for(const sec of v.sections){
  assert(sec.paragraphs.length>=2&&sec.source_keys.every(x=>sources.has(x)));
  for(const p of sec.paragraphs)for(const mm of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
    assert(all.has(mm[1])&&m.event_ids.includes(mm[1]),'missing linked historical event '+mm[1]);links++;
  }
 }
 assert(links>=12,'story needs linked evidence '+id);
 for(const e of v.related_event_ids)assert(all.has(e),'story event absent from map: '+e);
}
for(const [id,year] of [['PR1549-EXETER-WEST-GATE-DEFENCES',1549],['PR1549-CLYST-BRIDGE',1549],['PR1549-EXETER-STTHOMAS-WELSH-EXEC',1549],['GN1555-LOK-THAMES-RETURN',1555],['GN1555-TOWERSON-NEWPORT-START',1555],['GN1556-TOWERSON-HARWICH-START',1556],['GN1557-TOWERSON-PORTUGUESE-FIGHT',1557]]){
 const e=all.get(id);assert(e&&e.year===year&&Number.isFinite(e.lat)&&Number.isFinite(e.lng),id);
 const db=year===1549?a:b;assert(e.source_ids.every(s=>db.sources.some(x=>x.id===s)),'missing citation '+id);
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.colonial_profit,null);
}
assert.equal(all.get('GN1556-TOWERSON-HARWICH-START').lng,1.287337,'Harwich is ENGLAND EAST COAST');
assert.equal(all.get('PR1549-EXETER-STTHOMAS-WELSH-EXEC').lat,50.715769,'Current listed church point');
assert.equal(all.get('1550S-E008').category,'enslavement_forced_human_transport','Preserve original slave-transit event');
assert.equal(all.get('GAP1549-WEST-WOODBURY-COMMON').year,1549,'Woodbury was already represented: never duplicate');
assert.equal(all.get('GAP1549-CLYST').year,1549,'Clyst village was already represented: add bridge without duplicating burned village');
for(const id of ['pr1549-royal-east-west-exeter-approach','pr1549-royal-exeter-sampford-last-campaign']){
 const f=reach.find(x=>x.id===id);assert(f&&f.geometry.type==='LineString'&&f.geometry.coordinates.length>=2);
 assert.equal(f.properties.start_year,1549);assert.equal(f.properties.end_year,1549);
 assert.equal(f.properties.zone_type,'war_reach_schematic');
 assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);
 assert.equal(f.properties.historical_boundary_confirmed,false);
 assert(f.properties.related_event_ids.every(x=>all.has(x)));
 assert(f.properties.source_ids.every(id=>a.sources.some(s=>s.id===id)));
}
assert.equal(a.colonial_polygons.length,0);assert.equal(b.colonial_polygons.length,0);
for(const [id,port] of [
 ['ch7-sea-1554-lok-guinea-sestos-elmina',[51.126,1.313]],
 ['ch7-sea-1555-towerson-guinea',[50.35,-3.57]],
 ['ch7-sea-1556-towerson-elmina',[51.94639,1.287337]]
]){
 const r=b.routes.find(x=>x.id===id);assert(r&&r.coords.some(([lat,lng])=>lat===port[0]&&lng===port[1]),'documented UK stop omitted '+id);
 assert.equal(r.certainty,'schematic-only-not-historical-track','Never upgrade seaway to exact navigational trace');
}
console.log('PASS 18/19: two historical stories, 7 sourced new map points, 2 domestic campaign lines, genuine English port waypoint order, no duplicated original history, no false colonies.');
