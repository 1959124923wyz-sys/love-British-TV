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
assert.ok(fifth.events.length>=24&&fifth.places.length===7&&fifth.sources.length>=41);
assert.equal(fifth.colonial_polygons.length,0,'Unverified conquest boundary must not be promoted');
assert.equal(fifth.routes.length,0,'No invented transatlantic ship routes');
const ids=new Set(fifth.sources.map(q=>q.id)),placeIds=new Set(fifth.places.map(q=>q.id));
assert.equal(ids.size,fifth.sources.length);assert.equal(placeIds.size,fifth.places.length);
assert.deepEqual([...placeIds].sort(),fourth.places.map(q=>q.id).sort(),'1530 must inherit all seven 1529 political places');
for(const item of [...fifth.events,...fifth.places]){
 assert.ok(item.source_ids?.length&&item.source_ids.every(id=>ids.has(id)),item.id+': source missing');
}
assert.equal(fifth.events.filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng)).length,9);
assert.equal(fifth.events.filter(e=>e.lat===null&&e.lng===null).length,15);
const chronological={1530:0,1531:0,1532:0,1533:1,1534:3,1535:6,1536:12,1537:15,1538:19,1539:24};
for(const [v,n] of Object.entries(chronological)){
 const y=Number(v),actual=fifth.events.filter(e=>e.year<=y);
 assert.equal(actual.length,n,'1530s incomplete year-gated event data '+y);
 assert.ok(actual.every(e=>e.year<=y));
 const controls=urban.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 const ps=new Set(controls.map(f=>f.properties.source_place_id));
 assert.ok(ps.has('calais-crown')&&ps.has('guines-crown-1520s'),y+': Calais or Guînes disappeared');
 assert.ok(!ps.has('tournai-occupied-city-1513'),y+': Tournai incorrectly restored');
 const pol=relations.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 assert.ok(pol.length>=5,y+': island and Irish political relations disappeared');
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
assert.ok(JSON.parse(read('data/chapters.json')).chapters.some(c=>c.id==='chapterFifth'&&c.end===1539)&&html.includes('id="yearRange"'));
assert.ok(html.includes('app.js?v=timeline-v160'));
assert.ok(app.includes("fetch('data/atlas-1530-1539.json'"));
assert.ok(app.includes("fetch('data/territorial-footprints-1497-1539.geojson'"));
assert.ok(app.includes("fetch('data/political-relations-1500-1539.geojson'"));
assert.ok(app.includes("Math.min(lastPublishedYear")&&app.includes("year===lastPublishedYear"));
assert.ok(app.includes('e.year>=chapter.start&&e.year<=year')&&app.includes('((y-chapter.start)/span*100)'));
assert.ok(app.includes('fullArchive||occurredByYear(e,year)'),'Unoccurred chapter events leaked');
assert.ok(app.includes('atlasFifth?.sources'),'fifth chapter source citations not available to dossier');
assert.ok(app.includes("focusedEventId"),'sidebar event location must remain available');
console.log('PASS 1530s: 24 chronological records, 7 carried control places, 9 reference sites, 0 fake areas or routes');
