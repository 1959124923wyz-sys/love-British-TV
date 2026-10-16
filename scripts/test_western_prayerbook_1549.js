#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const db=read('data/atlas-1540-1549.json'),geo=read('data/century-violence-regions-1544-1589.geojson');
const western=db.events.filter(e=>e.id.startsWith('GAP1549-WEST-'));
const bornEarlier=db.events.filter(e=>e.year<=1548);
assert.equal(western.length,12,'twelve separately named rising/battle/reprisal locations are required');
assert.equal(bornEarlier.filter(e=>!e.id.startsWith('RW154')).length,54,'all 53 original records plus Calais 1542 account retained');
assert.equal(bornEarlier.filter(e=>e.id.startsWith('RW154')).length,10);
assert.equal(db.events.filter(e=>e.year<=1549&&!e.id.startsWith('RW154')).length,81,'80 previous unrelated records and new Calais account retained');
assert.equal(new Set(western.map(e=>e.id)).size,12);
const sources=new Map(db.sources.map(s=>[s.id,s]));
for(const e of western){
 assert.equal(e.year,1549);
 assert.equal(e.start_year,1549);
 assert.equal(e.end_year,1549);
 assert.equal(e.visible_from,1549);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),'modern locality must be locatable');
 assert(e.geo_precision?.includes('modern'),'modern reference precision required');
 assert(e.source_ids?.length&&e.source_ids.every(id=>sources.has(id)),'source absent '+e.id);
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.actual_English_territory_created,false);
}
assert.equal(western.filter(e=>e.category==='resistance').length,3,'do not attribute rebel mobilization to Crown');
assert.equal(western.filter(e=>e.category==='domestic_repression').length,8,'label royal force battles and reprisals as domestic repression');
assert.equal(western.filter(e=>e.category==='military_siege').length,1,'identify rebel siege separately');
assert(western.find(e=>e.id==='GAP1549-WEST-CLYST-PRISONERS')?.description.includes('不能将战场阵亡全部算作处决'));
for(const id of ['GAP1549-CLYST','GAP1549-SAMPFORD'])assert(db.events.filter(e=>e.id===id).length===1,'do not duplicate existing battle records');
const regions=geo.features.filter(f=>f.id.startsWith('en-western-1549-'));
assert.equal(regions.length,7,'seven regional supplements for named town/landscape envelopes');
const allWest=geo.features.filter(f=>f.id.startsWith('en-western-1549-')||f.id==='en-clyst-1549-devon'||f.id==='en-sampford-1549-devon');
assert.equal(allWest.length,9,'nine separate Western Rising regions including existing ones');
for(const f of regions){
 const p=f.properties, ring=f.geometry?.coordinates?.[0]||[];
 assert.equal(f.geometry?.type,'Polygon');
 assert(ring.length>=5&&JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)),'unclosed polygon');
 assert(p.start_year===1549&&p.end_year===1549);
 assert(p.territorial_claim===false&&p.historical_boundary_confirmed===false&&p.fill_authorized===false);
 assert(p.area_sqkm===null&&p.exclude_from_area_aggregation===true);
 assert(p.mapping_method&&p.named_anchors?.length&&/not|no /i.test(p.geometry_provenance));
 assert(p.source_ids.length&&p.source_ids.every(id=>sources.has(id)));
 assert(p.related_event_ids?.length&&p.related_event_ids.every(id=>db.events.some(e=>e.id===id)));
 const canonical=p.source_ids.map(id=>sources.get(id)?.url);
 for(const u of p.source_urls)assert(canonical.includes(u),'region web link does not derive from its cited archival entry '+f.id);
 const xy=f.geometry.coordinates[0];
 for(const [lon,lat] of xy)assert(Math.abs(lon)<=180&&Math.abs(lat)<=90);
 const width=Math.max(...xy.map(x=>x[0]))-Math.min(...xy.map(x=>x[0]));
 const height=Math.max(...xy.map(x=>x[1]))-Math.min(...xy.map(x=>x[1]));
 assert(width<.13&&height<.08,'unexpectedly large schematic locality rectangle '+f.id);
}
const js=fs.readFileSync(path.join(root,'app.js'),'utf8');
const expectedGate=js.match(/centuryData\?\.features\?\.length!==([0-9]+)/);
assert(expectedGate&&Number(expectedGate[1])===geo.features.length,'JS region gate must match total historical study areas, including later research');
console.log('PASS: 1549 Western Prayer Book rising: 12 independent events, 9 distinct sourced non-territorial study areas, and all previous decade continuity');
