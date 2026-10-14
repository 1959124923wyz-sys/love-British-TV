#!/usr/bin/env node
'use strict';
// Production fifth-chapter admission: facts, chronology, inherited control and precise mapping limitations.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),html=read('index.html');
new vm.Script(app,{filename:'app.js'});
const fifth=j('data/atlas-1530-1539.json'),fourth=j('data/atlas-1520-1529.json');
const geo=j('data/territorial-footprints-1497-1539.geojson'),old=j('data/territorial-footprints-1497-1529.geojson');
const urban=j('data/french-urban-control-1497-1539.geojson'),relations=j('data/political-relations-1500-1539.geojson');
assert.deepEqual(fifth.period,{from:1530,to:1539,next:1540});
assert.ok(fifth.events.length===27&&fifth.places.length===8&&fifth.sources.length===55);
assert.equal(fifth.colonial_polygons.length,0,'Unverified conquest boundary must not be promoted');
assert.equal(fifth.routes.length,0,'No invented transatlantic ship routes');
const ids=new Set(fifth.sources.map(q=>q.id)),placeIds=new Set(fifth.places.map(q=>q.id));
assert.equal(ids.size,fifth.sources.length);assert.equal(placeIds.size,fifth.places.length);
assert.ok(fourth.places.every(p=>placeIds.has(p.id)),'All seven 1529 political places must survive into 1530');
assert.ok(placeIds.has('channel-guernsey'),'Documented historic Guernsey relation must not disappear');
for(const item of [...fifth.events,...fifth.places]){
 assert.ok(item.source_ids?.length&&item.source_ids.every(id=>ids.has(id)),item.id+': source missing');
}
assert.equal(fifth.events.filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng)).length,12);
assert.equal(fifth.events.filter(e=>e.lat===null&&e.lng===null).length,15);
const chronological={1530:0,1531:1,1532:3,1533:4,1534:6,1535:9,1536:15,1537:18,1538:22,1539:27};
for(const [v,n] of Object.entries(chronological)){
 const y=Number(v),actual=fifth.events.filter(e=>e.year<=y);
 assert.equal(actual.length,n,'1530s incomplete year-gated event data '+y);
 assert.ok(actual.every(e=>e.year<=y));
 const controls=urban.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 const ps=new Set(controls.map(f=>f.properties.source_place_id));
 assert.ok(ps.has('calais-crown')&&ps.has('guines-crown-1520s'),y+': Calais or Guînes disappeared');
 assert.ok(!ps.has('tournai-occupied-city-1513'),y+': Tournai incorrectly restored');
 const pol=relations.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 assert.ok(pol.length>=6,y+': Guernsey, Scottish islands, Jersey and Man political relations must survive');
 const landscape=geo.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 assert.equal(landscape.length,7,y+': historical regions reset on decade boundary');
}
assert.equal(geo.features.length,7,'Unlicensed modern Welsh reference polygon must stay in research archive');
for(const f of geo.features){
 const prior=old.features.find(q=>q.id===f.id);
 assert.ok(prior&&JSON.stringify(prior.geometry)===JSON.stringify(f.geometry),'Old cartography was changed: '+f.id);
 assert.equal(f.properties.fill_authorized,false,'Never publish an unsurveyed historical border as certain');
 assert.equal(f.properties.observed_through_year,1539);
 assert.ok(f.properties.actual_area_sqkm===undefined||f.properties.actual_area_sqkm===null,'Unverified area amount');
}
assert.ok(fifth.events.some(e=>e.id==='1530S-E004'&&e.year===1535));
assert.ok(fifth.events.some(e=>e.id==='1530S-E023'&&e.lat===null&&e.lng===null),
 'Richard Hore voyage must not receive fictional precise map coordinates');
assert.ok(fifth.events.some(e=>e.id==='1530S-E024'&&e.year===1537));
for(const [id,y] of [['1530S-E025',1531],['1530S-E026',1532],['1530S-E027',1532]])assert.ok(fifth.events.some(e=>e.id===id&&e.year===y),id+' incremental documentary record missing');
assert.ok(fifth.events.find(e=>e.id==='1530S-E025').lat===null,'Unknown Leixlip arbitration meeting venue must stay unplotted');
assert.ok(fifth.events.find(e=>e.id==='1530S-E016').lat!==null&&fifth.events.find(e=>e.id==='1530S-E017').lat!==null,'Official heritage monastery sites missing');
assert.ok(relations.features.some(f=>f.properties.source_place_id==='channel-guernsey' && f.geometry.type==='Point'));
const shires=j('data/welsh-legal-shires-1535.json');
assert.equal(shires.records.length,13);assert.equal(shires.verified_new_historic_border_polygons,0);
assert.ok(shires.records.every(r=>r.verified_polygon===false&&r.coordinates===null));
const financial=j('data/financial-evidence-1530-1539.json');
assert.equal(financial.colonial_profit_total,null);
assert.ok(financial.records.some(r=>r.amount_value===20&&r.accounting_class==='private_manorial_income_entitlement'));
assert.ok(financial.records.some(r=>r.disaggregated_awards?.some(x=>x.annual_gbp===42)&&r.disaggregated_awards?.some(x=>x.annual_gbp===10)));

assert.ok(JSON.parse(read('data/chapters.json')).chapters.some(c=>c.id==='chapterFifth'&&c.end===1539)&&html.includes('id="yearRange"'));
assert.ok(html.includes('app.js?v=timeline-v1770-ch9'));
assert.ok(app.includes("fetch('data/atlas-1530-1539.json'"));
assert.ok(app.includes("fetch('data/territorial-footprints-1497-1549.geojson'"));
assert.ok(app.includes("fetch('data/political-relations-1500-1549.geojson'"));
assert.ok(app.includes("Math.min(lastPublishedYear")&&app.includes("year===lastPublishedYear"));
assert.ok(app.includes('e.year>=chapter.start&&e.year<=year')&&app.includes('((y-chapter.start)/span*100)'));
assert.ok(app.includes('fullArchive||occurredByYear(e,year)'),'Unoccurred chapter events leaked');
assert.ok(app.includes('atlasFifth?.sources'),'fifth chapter source citations not available to dossier');
assert.ok(app.includes("focusedEventId"),'sidebar event location must remain available');
console.log('PASS 1530s: 27 chronological records, 8 continued polities, 12 reference sites, 13 no-border statutory shires, 0 fake area/colonial profit');
