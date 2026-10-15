#!/usr/bin/env node
'use strict';
// Test the geographical fidelity of new chapter 11 city and region references,
// and ensure historical action links never become territorial geometries.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('data/atlas-1590-1599.json'),notes=read('data/chapter11-detail-notes.json');
const geo=read('data/ch11-action-links-1590-1599.geojson'),sources=new Set(a.sources.map(s=>s.id));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
new vm.Script(app,{filename:'app.js'});
const indexed=new Map(a.events.map(e=>[e.id,e]));
assert.equal(a.events.length,37);assert.ok(indexed.has('GAP1597-FAIAL'),'Independent 1597 raid must be preserved');
const verified=['E001','E002','E004','E008','E009','E010','E013','E018','E020','E023','E024','E026','E029','E033','E035','E036'].map(s=>'1590S-'+s);
assert.equal(verified.length,16);
for(const id of verified){
 const e=indexed.get(id),note=notes.records[id];
 assert.ok(e&&note,'Missing '+id);
 assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180,id+' bad modern locator');
 assert.ok(e.position_type&&e.geo_precision&&e.geolocation_limit_zh.length>30,id+' no modern reference precision');
 assert.equal(e.position_is_historical_survey,false,id+' site may not masquerade as Tudor GPS');
 assert.equal(e.exclude_point_buffer_from_area_statistics,true,id+' no radius/area');
 assert.ok(e.geolocation_reference_url.startsWith('https://'),id+' no source for modern locale');
 assert.ok(note.geography.includes('现代地理参考坐标'),id+' dossier not updated');
 assert.ok(note.geography.includes(e.geolocation_limit_zh),id+' historical site limit not shown');
 assert.ok(note.source_links.some(s=>s.url===e.geolocation_reference_url),id+' source missing in dossier');
 assert.equal(note.historical_site_survey_verified,false,id+' false survey');
}
assert.deepEqual(a.events.filter(e=>e.lat===null).map(e=>e.id),
 ['1590S-E006','1590S-E007','1590S-E034']);
assert.equal(geo.features.length,2);
assert.equal(geo.metadata.actual_territorial_geometries,0);
assert.equal(geo.metadata.area_statistics_prohibited,true);
for(const f of geo.features){
 const p=f.properties;assert.equal(f.geometry.type,'LineString');assert.equal(p.map_layer,'territory');
 assert.ok(p.source_ids.length>0&&p.source_ids.every(s=>sources.has(s)));
 assert.ok(p.source_urls?.every(u=>u.startsWith('https://')));
 assert.ok(p.related_event_ids?.length>0&&p.related_event_ids.every(id=>indexed.has(id)));
 assert.equal(p.start_year,p.end_year);assert.equal(p.territorial_claim,false);
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert.equal(p.sequence_only,true);assert.equal(p.material_impacts_not_assumed_between_waypoints,true);
 assert.ok(f.geometry.coordinates.length>=2);
}
const s1=geo.features.find(f=>f.id==='1592-cavendish-santos-sao-vicente-documented-attack-sequence');
const s2=geo.features.find(f=>f.id==='1598-armagh-yellow-ford-blackwater-relief-defeat-order');
assert.ok(s1&&s2);assert.equal(s1.properties.start_year,1592);
assert.equal(s2.properties.start_year,1598);
for(const [f,ids] of [[s1,['E005','E009']],[s2,['E024','E029','E028']]]){
 assert.deepEqual(f.geometry.coordinates,ids.map(id=>{
  const e=indexed.get('1590S-'+id);return [e.lng,e.lat];
 }),'New line endpoints must agree exactly with published chapter events');
}
assert.ok(app.includes("chapter11ActionLinks=linksData;"));
assert.ok(app.includes('window.atlasReadActionLinks=()=>Object.freeze('), 'Browser must have immutable observability hook');
const renderer=app.slice(app.indexOf('function renderChapter11ActionLinks(){'),app.indexOf('function renderNineYearsWarImpact(){'));
assert.ok(renderer.includes('groups.chapter11ActionLinks.clearLayers()'));
assert.ok(renderer.includes("!$('toggleTerritorialFootprints').checked")&&renderer.includes("!$('toggleControlAreas').checked"));
assert.ok(renderer.includes('p.start_year!==year||p.end_year!==year'));
assert.ok(renderer.includes('atlas-ch11-brazil-two-town-link')&&renderer.includes('atlas-ch11-yellow-ford-relief-link'));
assert.ok(renderer.includes("openTerritoryDossier(feat,'linked-action')"));
const refresh=app.slice(app.indexOf('function refreshHistoricalLayers(){'),app.indexOf("$('toggleHypotheses').addEventListener"));
assert.ok(refresh.includes('renderChapter11ActionLinks();'),'Territory checkbox must switch links');
assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('ch11-source-anchor-20261015'));
console.log('PASS chapter11: 16 named events located, 3 genuinely unresolved, 2 sourced non-territorial action-order lines');
