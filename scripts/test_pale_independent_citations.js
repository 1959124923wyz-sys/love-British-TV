#!/usr/bin/env node
'use strict';
// Public GIS Pale dossier can resolve a real publication citation even when
// the standalone archival ID is intentionally not a chapter event-source ID.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const citations=read('data/spatial-citation-registry.json');
const ellis=citations.sources.find(s=>s.id==='IR-ELLIS-2021');
assert.ok(ellis && ellis.title.includes('English Pale') && ellis.publisher);
assert.ok(/^https:\/\/www\.cambridge\.org\/core\/books\//.test(ellis.url));
const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');
assert.ok(app.includes("fetch('data/spatial-citation-registry.json'"),'public app must load GIS citations');
assert.ok(app.includes('sourcesById.set(source.id,source)'),'independent references must enter clickable source index');
for(const period of ['1497-1549','1550-1559','1560-1569','1570-1579','1580-1589','1590-1599']){
 const file=read('data/territorial-footprints-'+period+'.geojson');
 const pale=file.features.find(x=>x.id==='irish-pale-1488-localities-approx-1497-1519');
 assert.ok(pale,'Pale research continuity missing '+period);
 assert.ok(pale.properties.source_ids.includes(ellis.id),'GIS source ID mismatch '+period);
 assert.equal(pale.properties.historical_boundary_confirmed,false);
 assert.equal(pale.properties.fill_authorized,false);
}
const ch11=read('data/eleventh-influence-areas-1590-1599.geojson').features.find(f=>f.id==='ch11-pale-statutory-1488-comparison');
assert.ok(ch11);
assert.equal(ch11.properties.historical_boundary_confirmed,false);
assert.equal(ch11.properties.area_sqkm,null);
console.log('PASS: dated Irish Pale reference retains nonterritorial meaning and clickable scholarly citation');
