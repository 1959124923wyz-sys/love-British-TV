#!/usr/bin/env node
'use strict';
// Actual historical date/geometry gates for editor-published 1550–1559.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const raw=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const atlas=read('data/atlas-1550-1559.json'),previous=read('data/atlas-1540-1549.json'),chapter=read('data/chapters.json');
const old=read('data/territorial-footprints-1497-1549.geojson'),geo=read('data/territorial-footprints-1550-1559.geojson');
const military=read('data/seventh-control-sites-1550-1559.geojson');
const relations=read('data/political-relations-1550-1559.geojson'),urban=read('data/french-urban-control-1550-1559.geojson');
const app=raw('app.js'),html=raw('index.html');
new vm.Script(app);
assert.deepEqual(atlas.period,{from:1550,to:1559,next:1560});
assert.equal(atlas.events.length,29);assert.equal(atlas.places.length,18);assert.equal(atlas.sources.length,49);
assert.equal(atlas.routes.length,0);assert.equal(atlas.colonial_polygons.length,0);
assert.equal(previous.events.length,54,'Do not modify 1540s published events');
assert.ok(chapter.chapters.some(c=>c.number===7&&c.start===1550&&c.end===1559&&c.status==='published'));
const sources=new Set(atlas.sources.map(s=>s.id)),events=new Set();
for(const e of atlas.events){
 assert.ok(e.year>=1550&&e.year<=1559&&e.source_ids.every(id=>sources.has(id)),e.id+' missing dated citation');
 assert.ok(e.date_label.startsWith(String(e.year)+'年'),e.id+' must use Chinese historical date');
 assert.ok(!events.has(e.id));events.add(e.id);
 assert.equal(e.colonial_profit,null,'Unquantified slave trade / treaty amount is not proven colonial profit');
 assert.equal(Number.isFinite(e.lat),Number.isFinite(e.lng),'Point pair is incomplete: '+e.id);
}
for(const p of atlas.places)assert.ok(p.source_ids?.length&&p.source_ids.every(id=>sources.has(id)),p.id);
const oldPlaces=new Map(previous.places.map(p=>[p.id,p]));
for(const id of ['calais-crown','guines-crown-1520s','dublin-pale','channel-jersey','channel-guernsey','isle-of-man','orkney-scotland','shetland-scotland','kingdom-of-scotland']){
 const p=atlas.places.find(p=>p.id===id);assert.ok(p,'Continuing political identity lost: '+id);
 if(oldPlaces.has(id))assert.equal(p.start_year,oldPlaces.get(id).start_year,'Cannot invent 1550 start for inherited '+id);
}
assert.equal(geo.features.length,7);assert.equal(old.features.length,7);
for(const f of geo.features){
 const earlier=old.features.find(o=>o.id===f.id);
 assert.ok(earlier,'Modern geography reference dropped: '+f.id);
 assert.deepEqual(f.geometry,earlier.geometry,'Historic geometries must NOT be invented or changed');
 assert.equal(f.properties.start_year,1550);assert.equal(f.properties.observed_through_year,1559);
 assert.equal(f.properties.historical_boundary_confirmed,false);
 assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);
}
assert.equal(relations.features.length,6);
assert.equal(urban.features.length,2);
assert.ok(urban.features.every(f=>f.properties.French_controller_year_start===1558));
assert.equal(military.features.length,9);
const geography=read('data/seventh-event-geographic-anchors.geojson');
assert.equal(geography.features.length,4,'Four sourced modern reading anchors required');
assert.ok(geography.features.every(f=>f.geometry.type==='Point'&&!f.properties.territorial_claim &&f.properties.fill_authorized===false&&f.properties.area_sqkm===null&&f.properties.not_event_location===true),'Modern sites cannot masquerade as control areas or actual voyages');
for(const f of geography.features){
 assert.ok(f.properties.related_event_ids.length&&f.properties.source_ids.length,f.id);
 assert.ok(f.properties.related_event_ids.every(id=>events.has(id)),f.id+' links unknown event');
 assert.ok(f.properties.source_ids.every(id=>sources.has(id)),f.id+' lacks source');
 assert.ok(f.properties.locator_source_urls.every(url=>url.startsWith('https://')),f.id);
}
for(const id of ['1550S-E005','1550S-E008','1550S-E011','1550S-E012','1550S-E015']){
 const e=atlas.events.find(e=>e.id===id);
 assert.equal(e.lat,null,'Never invent an event coordinate: '+id);
 assert.equal(e.lng,null,'Never invent an event coordinate: '+id);
 assert.ok(geography.features.some(f=>f.properties.related_event_ids.includes(id)),id+' must have visual reading reference');
}
assert.ok(app.includes('function renderSeventhGeographies()'));
assert.ok(app.includes('function navigateSeventhGeography(feature)'));
assert.ok(html.includes('id="chapter7GeographyNav"'));
assert.ok(military.features.every(f=>f.geometry.type==='Point'&&f.properties.fill_authorized===false&&f.properties.area_sqkm===null));
const active=(id,y)=>military.features.some(f=>f.properties.stable_id===id&&f.properties.start_year<=y&&y<=f.properties.end_year);
for(const y of [1550,1555,1559]){
 assert.ok(active('irish-fort-governor-1550s',y)&&active('irish-fort-protector-1550s',y),'Irish military sites built before 1556 missing '+y);
 assert.ok(active('french-boulogne-from-1550',y)&&active('scottish-broughty-from-1550',y));
}
assert.ok(!active('eyemouth-french-allied-1557-1559',1556));
assert.ok(active('eyemouth-french-allied-1557-1559',1558));
assert.ok(!active('eyemouth-french-allied-1557-1559',1559),'Unproven 1559 Eyemouth French continuous garrison');
for(const id of ['boulogne-english-1544-1550','broughty-english-1547-1550','eyemouth-fort-English-1547-1550'])
 assert.ok(!active(id,1550),'Old English site must never be carried unchanged');
assert.ok(app.includes('next>=1550?atlasSeventh'),'Chapter selection must permit new decade');
assert.ok(app.includes("year>=1558&&p.source_place_id==='calais-crown'"),'Calais needs French annual area recolor');
assert.ok(app.includes('function renderSeventhControlSites()'));
assert.ok(app.includes('atlasSeventh?.sources'),'Seventh chapter bibliographies must be clickable');
assert.ok(html.includes('max="1559"')&&html.includes('1497—1559'));
const expected=[6,6,6,8,9,12,19,21,26,29];
for(let y=1550;y<=1559;y++)assert.equal(atlas.events.filter(e=>e.year<=y).length,expected[y-1550],'year reveals future events: '+y);
console.log('PASS seventh chapter: 29 events, 18 sites, 49 sources, 7 intact reference geometries, 9 military nodes; year-end 1558 French Calais transition and 1556 Irish plantation semantics.');
