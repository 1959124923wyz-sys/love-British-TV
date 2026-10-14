#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const json=p=>JSON.parse(read(p));
const fifth=json('data/atlas-1530-1539.json'),sixth=json('data/atlas-1540-1549.json');
const last=json('data/chapters.json').chapters;
const oldGeo=json('data/territorial-footprints-1497-1539.geojson');
const nextGeo=json('data/territorial-footprints-1497-1549.geojson');
const urban=json('data/french-urban-control-1497-1549.geojson');
const relations=json('data/political-relations-1500-1549.geojson');
const garrisons=json('data/military-control-points-1540-1549.geojson');
const app=read('app.js'),html=read('index.html');
assert.deepEqual(sixth.period,{from:1540,to:1549,next:1550});
assert.deepEqual([sixth.events.length,sixth.places.length,sixth.sources.length],[54,27,87]);
assert.equal(sixth.routes.length,0,'Unknown ships routes must not be guessed');
assert.equal(sixth.colonial_polygons.length,0,'No invented historic sixteenth-century occupied border');
assert.equal(sixth.events.filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng)).length,35);
assert.equal(sixth.events.filter(e=>e.lat===null&&e.lng===null).length,19);
assert.ok(last.some(x=>x.id==='chapterSixth'&&x.start===1540&&x.end===1549&&x.status==='published'));
assert.equal(last[5].start,last[4].end+1,'Chapter six must follow 1539 without a gap');
const ids=new Set(sixth.sources.map(s=>s.id));
assert.equal(ids.size,sixth.sources.length);
const eventIds=new Set();
for(const e of sixth.events){
 assert.ok(!eventIds.has(e.id),'Duplicate chapter six event ID: '+e.id);eventIds.add(e.id);
 assert.ok(e.year>=1540&&e.year<=1549);
 assert.ok(e.date_label&&e.date_label!=='year','Unprocessed research year label: '+e.id);
 assert.ok(e.significance&&[1,2,3].includes(e.significance.level));
 assert.ok(e.source_ids?.length&&e.source_ids.every(i=>ids.has(i)),e.id+': missing publication citation');
 assert.equal(e.lat===null,e.lng===null,e.id+': incomplete coordinate pair');
 assert.ok(e.colonial_profit===null,'Do not infer profits from military/tax events');
}
const placeMap=new Map(sixth.places.map(p=>[p.id,p]));
assert.equal(placeMap.size,sixth.places.length);
for(const p of fifth.places){
 const next=placeMap.get(p.id);
 assert.ok(next,p.id+': established 1539 political relationship was lost in 1540');
 assert.equal(next.observed_through_year,1549,p.id+': historical continuity lost');
 assert.equal(next.start_year,p.start_year,p.id+': invented new 1540 acquisition');
}
for(const p of sixth.places)assert.ok(p.source_ids?.length&&p.source_ids.every(i=>ids.has(i)),p.id+': source not available');
assert.ok(placeMap.has('channel-guernsey'),'Guernsey independent continuing Crown Dependency missing');
assert.ok(placeMap.get('channel-guernsey').start_year<1540,'Guernsey must not appear annexed in 1540');
assert.ok(!placeMap.has('tournai-occupied-city-1513'),'Tournai must not return to English possession');
assert.equal(nextGeo.features.length,7);
for(const former of oldGeo.features){
 const newer=nextGeo.features.find(f=>f.id===former.id);
 assert.ok(newer,'1540 inherited outline missing: '+former.id);
 assert.deepEqual(newer.geometry,former.geometry,'Historical reference geometry silently changed');
 assert.equal(newer.properties.observed_through_year,1549);
 assert.equal(newer.properties.fill_authorized,false,'No real Tudor boundary certificate');
}
assert.equal(urban.features.find(f=>f.id==='tournai-urban-core-1513-1518')?.properties.observed_through_year,1518);
assert.ok(urban.features.some(f=>f.properties.source_place_id==='calais-crown'&&f.properties.observed_through_year===1549));
assert.ok(urban.features.some(f=>f.properties.source_place_id==='guines-crown-1520s'&&f.properties.observed_through_year===1549));
assert.equal(relations.features.length,6);
assert.ok(relations.features.every(f=>f.properties.observed_through_year===1549));
assert.ok(relations.features.some(f=>f.properties.source_place_id==='channel-guernsey'));
assert.equal(garrisons.features.length,19);
for(const id of ['castlemilk-dumfriesshire-english-1547','lochwood-tower-english-1547','dumfries-english-garrison-1547']){
 assert.ok(garrisons.features.some(f=>f.properties.stable_id===id&&f.properties.year_end_start===1547&&f.properties.year_end_stop===1547),id+' must remain 1547-only');
 assert.ok(placeMap.has(id),id+' must open a source-backed atlas place dossier');
}
assert.ok(garrisons.features.every(f=>f.geometry.type==='Point'),'Do not promote a modern fort vicinity to conquest polygon');

const archaeological=json('data/issue46-hes-archaeology-reference-1547-1549.geojson');
assert.equal(archaeological.features.length,3,'Three genuine HES statutory monument boundaries required');
assert.equal(archaeological.metadata.verified_historic_English_control_polygons,0);
assert.ok(archaeological.features.every(f=>f.geometry.type==='Polygon'&&f.properties.designation_ref.startsWith('SM')
 &&f.properties.fill_authorized===false&&f.properties.historical_boundary_confirmed===false
 &&f.properties.area_sqkm===null&&f.properties.controller_for_polygon===null));
assert.deepEqual(archaeological.features.map(f=>f.properties.designation_ref).sort(),['SM1718','SM3190','SM3191']);
assert.deepEqual(archaeological.features.map(f=>f.properties.start_year),[1547,1548,1547]);
const rox=sixth.places.find(p=>p.id==='roxburgh-english-artillery-fort-1547-1550');
assert.ok(rox&&rox.observed_through_year===1549&&rox.end_year===1550&&rox.fill_authorized===false&&rox.area_polygon_verified===false);
assert.ok(garrisons.features.some(f=>f.properties.stable_id===rox.id
 &&f.properties.year_end_start===1547&&f.properties.year_end_stop===1549));
const badSM='SC-HES-EYEMOUTH-FORT-SM4577';
assert.ok(!sixth.places.find(p=>p.id==='eyemouth-fort-English-1547-1550').source_ids.includes(badSM),
 'Wrong SM4577 Corn Fort must not be primary Eyemouth 1547 proof');
assert.ok(sixth.places.find(p=>p.id==='eyemouth-fort-English-1547-1550').source_ids.includes('SC-HES-EYEMOUTH-SM3190'));
assert.ok(app.includes('function renderArchaeologyReferences()'));
assert.ok(app.includes("fill:false,fillOpacity:0"),'Modern legal heritage outlines must stay empty');
assert.ok(app.includes('function openArchaeologyReference(feature)'),'Official HES polygon click dossier missing');

const active=(id,y)=>garrisons.features.some(f=>f.properties.stable_id===id&&f.properties.year_end_start<=y&&f.properties.year_end_stop>=y);
for(const y of [1544,1545,1546,1547,1548,1549]){
 assert.equal(active('boulogne-english-1544-1550',y),true,'Boulogne center lost English occupation '+y);
}
for(const y of [1546,1547,1548])for(const id of ['ambleteuse-english-fort-1546-1549','boulemberg-english-fort-1546-1549'])assert.ok(active(id,y),id+' not shown '+y);
for(const id of ['ambleteuse-english-fort-1546-1549','boulemberg-english-fort-1546-1549','haddington-english-1548-1549'])assert.ok(!active(id,1549),id+' must cease English occupation by 1549 year end');
assert.ok(active('lochmaben-english-1544-1545',1544)&&!active('lochmaben-english-1544-1545',1545));
assert.ok(active('inchcolm-english-1547-1548',1547)&&!active('inchcolm-english-1547-1548',1548));
assert.ok(active('hume-english-1547-1548',1547)&&!active('hume-english-1547-1548',1548));
assert.ok(!active('hailes-english-1548-date_unknown',1548)&&!active('hailes-english-1548-date_unknown',1549),'HES confirms Hailes Scottish recapture during 1548');
assert.ok(active('dundee-english-town-late-1547',1547)&&!active('dundee-english-town-late-1547',1548),'Dundee town was briefly occupied in 1547, not demonstrably English-held in 1548 year-end');
assert.ok(sixth.events.some(e=>e.id==='1540S-ED-HAILES-1548-SCOTTISH-RETURN'),'Hailes recapture event missing');
assert.ok(sixth.events.some(e=>e.id==='1540S-C3-NEW-DUNDEE-STMARY-1548'),'Dundee church plunder event missing');
const vicinity=json('data/war-control-vicinity-1540-1549.geojson');
assert.equal(vicinity.features.length,10);
assert.ok(vicinity.features.every(f=>f.properties.fill_authorized===false&&f.properties.historical_boundary_confirmed===false&&f.properties.area_sqkm===null));
const activeVicinity=(id,y)=>vicinity.features.some(f=>f.properties.stable_id===id&&f.properties.start_year<=y&&y<=f.properties.end_year&&active(id,y));
assert.ok(!activeVicinity('haddington-english-1548-1549',1549));
assert.ok(activeVicinity('boulogne-english-1544-1550',1549));
assert.ok(!activeVicinity('ambleteuse-english-fort-1546-1549',1549));
assert.ok(app.includes('function renderWartimeVicinities()')&&!app.includes('map.getZoom()>9'),'Documented garrison locality overlays must no longer disappear suddenly at high zoom');
const frenchId='outreau-french-opposing-fort-from-1545';
assert.ok(active(frenchId,1545)&&active(frenchId,1549),'French counterfort missing');
assert.equal(placeMap.get(frenchId).status,'French_sovereign_counter_fort_not_English_control');
assert.ok(garrisons.features.find(f=>f.properties.stable_id===frenchId).properties.not_an_English_control_feature);
for(let y=1540;y<=1549;y++){
 let expected=sixth.events.filter(e=>e.year<=y);
 assert.deepEqual(expected.map(x=>x.id).length,[1,2,4,6,11,17,24,34,49,54][y-1540],y+' event count mismatch');
 assert.ok(expected.every(e=>e.year<=y));
}
assert.ok(app.includes("fetch('data/atlas-1540-1549.json'"));
assert.ok(app.includes("fetch('data/military-control-points-1540-1549.geojson'"));
assert.ok(app.includes("function renderWartimeControls()")&&app.includes('p.year_end_start')&&app.includes('p.year_end_stop'));
assert.ok(app.includes('atlasSixth?.sources'),'New chapter dossier must resolve academic source links');
assert.ok(app.includes("next>=1540?atlasSixth"),'Map must load the correct sixth Atlas slice');
assert.ok(!app.includes("map.flyTo("),'Historical map focus must not auto-zoom');
assert.ok(html.includes('max="1559"')&&html.includes('app.js?v=timeline-v176'),'Seventh chapter extends global timeline without changing chapter six');
console.log('PASS sixth chapter: 54 dated sourced events, 26 recorded places, 7 existing geographic outlines, 18 independent garrison/counterfort point features and exact annual control transitions');
