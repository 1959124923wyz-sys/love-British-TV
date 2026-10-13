#!/usr/bin/env node
'use strict';
// Published fourth-decade invariants: this tests topology, source integrity and
// year-specific behaviors. It does not claim ancient borders are survey-grade.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>JSON.parse(read(p));
const app=read('app.js'),html=read('index.html');
new vm.Script(app,{filename:'app.js'});
const fourth=data('data/atlas-1520-1529.json');
const third=data('data/atlas-1510-1519.json');
const prior=data('data/atlas-1500-1509.json');
const core=data('data/french-urban-control-1497-1529.geojson');
const relations=data('data/political-relations-1500-1529.geojson');
const grounds=data('data/territorial-footprints-1497-1529.geojson');
const hypotheses=data('data/geography-hypotheses-1500-1529.geojson');
assert.deepEqual(fourth.period,{from:1520,to:1529,next:1530});
assert.ok(fourth.events.length>=24&&fourth.places.length>=7&&fourth.sources.length>=49);
assert.equal(fourth.colonial_polygons.length,0,'Unsourced 1520s land polygons must not be manufactured');
assert.equal(fourth.routes.length,1,'1527 must display one carefully limited voyage reference connector');
assert.equal(fourth.routes[0].route_kind,'documented-endpoints-connection');
assert.equal(fourth.routes[0].coords.length,2,'Do not fabricate ocean waypoint geometry');
assert.ok(fourth.routes[0].source_ids.every(id=>fourth.sources.some(s=>s.id===id)));
const ids=new Set(fourth.sources.map(x=>x.id));assert.equal(ids.size,fourth.sources.length);
const places=new Set(fourth.places.map(q=>q.id)),evtIds=new Set(fourth.events.map(e=>e.id));
assert.equal(evtIds.size,fourth.events.length,'Duplicated fourth chapter events');
assert.equal(places.size,fourth.places.length,'Duplicated political identities');
for(const x of [...fourth.events,...fourth.places]){
 assert.ok(x.source_ids?.length&&x.source_ids.every(id=>ids.has(id)),x.id+': missing citation');
}
const eventGate=(item,y)=>Number.isFinite(Number(item.year))&&Number(item.year)<=y;
let previous=0;
for(let y=1520;y<=1529;y++){
 const current=fourth.events.filter(e=>eventGate(e,y));
 assert.ok(current.length>=previous,y+': event reveal reversed');
 assert.ok(current.every(e=>e.year<=y),y+': future event leaked');
 previous=current.length;
 const active=core.features.filter(f=>f.properties.start_year<=y && y<=f.properties.observed_through_year);
 const activeIds=new Set(active.map(f=>f.properties.source_place_id));
 assert.ok(activeIds.has('calais-crown')&&activeIds.has('guines-crown-1520s'),y+': Calais/Guines vanished');
 assert.ok(!activeIds.has('tournai-occupied-city-1513'),y+': Tournai still held after cession');
 const political=relations.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 assert.ok(political.length>=5,y+': dependency/lordship continuity broken');
 const mapped=grounds.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 assert.ok(mapped.length>=7,y+': coastal reference map erased on decade boundary');
}
assert.equal(fourth.events.filter(e=>e.year===1520).length,4);
assert.ok(fourth.events.some(e=>e.id==='1529-GUINES-LAWS'),'Guines legislation lost');
assert.ok(!places.has('tournai-occupied-city-1513'),'Tournai wrongly persisted into chapter 4');
assert.ok(third.places.some(q=>q.id==='tournai-occupied-city-1513'));
assert.ok(prior.places.some(q=>q.id==='calais-crown'));
for(const feature of hypotheses.features){
 assert.equal(feature.properties.fill_authorized,false,'Speculative outline became approved solid region');
 if(feature.properties.id.includes('TOURNAISIS'))assert.deepEqual(feature.properties.valid_years,[1513,1514,1515,1516,1517,1518]);
}
for(const feature of grounds.features){
 assert.equal(feature.properties.verified_1520s_historical_border,false,'Modern coastlines must not be interpreted as exact Tudor boundaries');
}
assert.match(html,/id="chapterFour"/);
assert.match(html,/max="1529"/);
assert.match(html,/app\.js\?v=voyage-fix-v144/);
assert.ok(app.includes("fetch('data/atlas-1520-1529.json'"),'Public frontend fetches research staging instead of released archive');
assert.ok(app.includes("fetch('data/territorial-footprints-1497-1529.geojson'"));
assert.ok(app.includes("Math.min(1529"),'Years capped at old third chapter');
assert.ok(app.includes("year===1529"),'Autoplay must reach 1529 then stop');
assert.ok(app.includes("y>=1497&&y<=year"),'Milestones expose future dates');
assert.ok(app.includes("fullArchive||occurredByYear(e,year)"),'Chapter sidebar reveals future events');
assert.ok(app.includes("if(!occurredByYear(r,year)||!$('toggleRoutes').checked)continue;"),'Routes have no year gate');
assert.ok(app.includes("focusEventFromSidebar(item)"),'Double-click navigation missing');
assert.ok(!app.includes('第四章（研究预览）'),'Public chapter still labelled research preview');
console.log('PASS: fourth chapter published source provenance, 1520–1529 reveal and uninterrupted historic controls');
