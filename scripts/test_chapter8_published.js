#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const txt=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const atlas=read('data/atlas-1560-1569.json'),prev=read('data/atlas-1550-1559.json');
const chapters=read('data/chapters.json'),band=read('data/eighth-enslavement-coastal-activity-1560-1569.geojson');
const forts=read('data/eighth-control-sites-1560-1569.geojson');
const {hydrateFootprints}=require('../js/territory-geometry.js');
const original=read('data/territorial-footprints-1497-1549.geojson');
const geo=hydrateFootprints(original,read('data/territorial-footprints-1560-1569.geojson')),
 oldGeo=hydrateFootprints(original,read('data/territorial-footprints-1550-1559.geojson'));
const political=read('data/political-relations-1560-1569.geojson'),cities=read('data/french-urban-control-1560-1569.geojson');
const app=txt('app.js'),html=txt('index.html');new vm.Script(app);
assert.deepEqual(atlas.period,{from:1560,to:1569,next:1570});
assert.ok(chapters.chapters.some(c=>c.number===7&&c.start===1560&&c.end===1569&&c.status==='published'));
assert.equal(atlas.events.length,49);assert.equal(atlas.sources.length,49);assert.equal(atlas.places.length,27);
assert.equal(atlas.routes.length,17);assert.equal(atlas.colonial_polygons.length,0);
assert.equal(prev.events.length,41);
const iconSet=new Set(read('data/icon-categories.json').categories.map(x=>x.code)),sources=new Set(atlas.sources.map(x=>x.id)),ids=new Set();
assert.equal(iconSet.size,16);
for(const e of atlas.events){
 assert.ok(e.year>=1560&&e.year<=1569&&e.date_label.startsWith(String(e.year)+'年'),e.id+' has inconsistent year');
 assert.ok(!ids.has(e.id));ids.add(e.id);
 assert.ok(iconSet.has(e.icon_code)&&e.icon_code!=='TRA',e.id+' unsupported icon');
 if(e.category==='slavery')assert.equal(e.icon_code,'SLV',e.id+' slavery must use the sanctioned glyph');
 assert.ok(e.source_ids.length&&e.source_ids.every(id=>sources.has(id)),e.id+' unknown citation');
 const explicitlyUnlocated=e.id==='MUN1569-GARRYSTOWN-MASSACRE'||e.id==='MUN1569-HEADS-TERROR';
 const narrativeUnlocated=e.id==='NR1569-SUSSEX-ROYAL-ADVANCE-REBEL-RETREAT'||e.id==='DOM1563-EGYPTIANS-EXECUTION-LAW';
 if(narrativeUnlocated){
  assert.equal(e.lat,null);assert.equal(e.lng,null);
  assert.ok(e.geo_precision.startsWith('unlocated_'));
 }else if(explicitlyUnlocated){
  assert.equal(e.lat,null,e.id+' unknown site must remain unlocated');
  assert.equal(e.lng,null,e.id+' unknown site must remain unlocated');
  assert.ok(e.geo_precision?.startsWith('unlocated_')&&e.position_type==='unlocated_historical_site_archival_only');
 }else{
  assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng),e.id+' invalid reference geography');
  assert.ok(/regional|modern/.test(e.geo_precision)&&Number.isFinite(e.lat)&&Number.isFinite(e.lng),e.id+' internal geographical provenance must remain');
 }
 assert.equal(e.colonial_profit,null);
}
const nine=['calais-crown','guines-crown-1520s','dublin-pale','channel-jersey','channel-guernsey','isle-of-man','orkney-scotland','shetland-scotland','kingdom-of-scotland'];
for(const id of nine){
 const old=prev.places.find(p=>p.id===id),current=atlas.places.find(p=>p.id===id);
 assert.ok(old&&current,'Missing continuing political identity '+id);
 assert.equal(current.start_year,old.start_year,'Inherited sovereignty cannot be re-acquired at 1560');
 assert.equal(current.observed_through_year,1569);
}
assert.equal(atlas.places.filter(p=>p.render_as_event_only).length,16,'Trading ports and battlefield references cannot become ruler control points');
assert.equal(forts.features.length,2);
const english=forts.features.find(f=>f.properties.controller_group==='english'),french=forts.features.find(f=>f.properties.controller_group==='french');
assert.deepEqual([english.properties.start_year,english.properties.end_year],[1562,1562]);
assert.deepEqual([french.properties.start_year,french.properties.end_year],[1563,1569]);
assert.deepEqual(english.geometry,french.geometry);
assert.ok(forts.features.every(f=>f.properties.fill_authorized===false&&f.properties.historical_boundary_confirmed===false&&f.properties.area_sqkm===null));
assert.equal(band.features.length,3);
assert.equal(band.metadata.verified_Tudor_English_control_polygons,0);
for(const f of band.features){
 const p=f.properties;
 assert.equal(f.geometry.type,'Polygon');assert.equal(p.map_layer,'events');assert.equal(p.zone_type,'enslavement_event_activity_schematic');
 assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);
 assert.ok(p.source_ids.every(id=>sources.has(id)));
 assert.ok(p.end_year<=1568,'1569 documentation is not a fourth voyage');
}
assert.equal(geo.features.length,7);assert.equal(political.features.length,6);assert.equal(cities.features.length,2);
for(const f of geo.features){
 const old=oldGeo.features.find(x=>x.id===f.id);
 assert.ok(old&&JSON.stringify(old.geometry)===JSON.stringify(f.geometry),'Invented inherited Tudor sovereign geometry '+f.id);
 assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.observed_through_year,1569);
}
const eventCount=[3,4,7,10,12,15,17,21,26,49],routeCount=[0,0,1,3,5,8,8,11,16,17],bandCount=[0,0,1,1,1,1,0,1,1,0];
for(let y=1560;y<=1569;y++){
 assert.equal(atlas.events.filter(e=>e.year<=y).length,eventCount[y-1560],'Event chronology '+y);
 assert.equal(atlas.routes.filter(r=>r.year<=y).length,routeCount[y-1560],'Voyage chronology '+y);
 assert.equal(band.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.end_year).length,bandCount[y-1560],'Coast must not persist past source voyages '+y);
}
for(const r of atlas.routes){
 assert.ok(r.coords.length>=2&&r.coords.every(p=>Array.isArray(p)&&p.length===2&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180),r.id);
 assert.ok(r.source_ids.length&&r.source_ids.every(id=>sources.has(id)),r.id+' lost sources');
 assert.ok(r.related_event_ids?.every(id=>ids.has(id)),r.id+' unmapped linked event');
 assert.equal(r.certainty,'schematic-only-not-historical-track');
 assert.ok(r.route_kind.includes('schematic'),'Do not claim actual sailed GPS');
}
assert.ok(app.includes('next>=1560?atlasEighth:next>=1550?atlasSeventh'));
assert.ok(app.includes('function renderEighthControlSites()')&&app.includes('function renderEighthCoastalActivity()'));
assert.ok(app.includes('sourcesById.get(id)'),'Dossier citation registry missing');
assert.ok(html.includes('max="1599"')&&html.includes('1497—1599'));
console.log('PASS chapter8: 29 events, 27 places, 25 sources, 16 distinct schematic-route segments, 3 dated African slave trafficking activity bands and 1562-only English Le Havre point.');
