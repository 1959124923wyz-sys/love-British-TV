#!/usr/bin/env node
'use strict';
// Caribbean Crown raids and documented Moroccan trade are not interchangeable
// with Crown territorial rule, even when their GIS markers share a map layer.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const o=JSON.parse(read('data/caribbean-maghreb-contact-raids-1551-1598.geojson'));
const app=read('app.js'),html=read('index.html');
new vm.Script(app,{filename:'app.js'});
assert.equal(o.type,'FeatureCollection');
assert.equal(o.features.length,13);
assert.equal(o.metadata.north_africa_colonial_polygons,0);
assert.equal(o.metadata.caribbean_historical_measured_occupation_polygons,0);
assert.equal(o.metadata.area_statistics_prohibited,true);
assert.ok(o.features.every(f=>['Point','LineString','Polygon'].includes(f.geometry.type)));
assert.equal(o.features.filter(f=>f.geometry.type==='Point').length,10);
assert.equal(o.features.filter(f=>f.geometry.type==='LineString').length,2);
assert.equal(o.features.filter(f=>f.geometry.type==='Polygon').length,1);
const a10=JSON.parse(read('data/atlas-1580-1589.json'));
const a11=JSON.parse(read('data/atlas-1590-1599.json'));
const knownSources=new Set([...a10.sources,...a11.sources].map(s=>s.id));
const knownEvents=new Map(a11.events.map(e=>[e.id,e]));
const ids=new Set();
for(const f of o.features){
 const p=f.properties;
 assert.ok(!ids.has(f.id),'duplicate id '+f.id);ids.add(f.id);
 assert.equal(p.territorial_claim,false);assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert.equal(p.start_year,p.end_year);
 assert.equal(p.map_layer,'territory_reference_not_political_control');
 assert.ok(p.summary_zh.length>=35);
 assert.ok(Array.isArray(p.source_urls)&&p.source_urls.length>0&&p.source_urls.every(s=>s.startsWith('https://')));
 assert.ok(p.source_ids.every(id=>knownSources.has(id)),'Unregistered source reference');
 for(const id of p.related_event_ids||[]){
  assert.ok(knownEvents.has(id),'Missing cited event '+id);
  assert.equal(knownEvents.get(id).year,p.start_year,'Related event historical-year mismatch');
 }
 let coords=f.geometry.type==='Point'?[f.geometry.coordinates]:f.geometry.type==='Polygon'?f.geometry.coordinates[0]:f.geometry.coordinates;
 for(const c of coords)assert.ok(Array.isArray(c)&&c.length===2&&Math.abs(c[0])<=180&&Math.abs(c[1])<=90);
 assert.ok(!f.geometry.coordinates[0]?.type,'Do not embed territory polygons');
}
const count=y=>o.features.filter(f=>f.properties.start_year===y).length;
for(const [y,n] of [[1550,0],[1551,1],[1552,3],[1553,0],[1585,0],[1588,1],[1594,0],[1595,7],[1596,0],[1598,1],[1599,0]])
 assert.equal(count(y),n,'Incorrect year gating '+y);
const sanjuans=o.features.filter(f=>f.id.startsWith('caribbean-san-juan-'));
assert.equal(sanjuans.length,2);
assert.deepEqual(sanjuans[0].geometry,sanjuans[1].geometry);
assert.equal(sanjuans.find(f=>f.properties.start_year===1595).properties.zone_type,'caribbean_english_failed_assault');
const occupied=sanjuans.find(f=>f.properties.start_year===1598).properties;
assert.equal(occupied.zone_type,'caribbean_temporary_english_occupation');
assert.equal(occupied.temporary_occupation_from,'1598-06-16');
assert.equal(occupied.temporary_occupation_to,'1598-08-27');
assert.ok(occupied.summary_zh.includes('西班牙控制'),'1598 year-end must remain Spanish');
const marrakesh=o.features.find(f=>f.id==='morocco-marrakesh-barbary-company-1588');
assert.ok(marrakesh.properties.summary_zh.includes('并非公司取得摩洛哥领土'));
const santa=o.features.find(f=>f.id==='morocco-santa-cruz-wyndham-1552');
assert.ok(santa.properties.geo_precision.includes('approx'));
const line=o.features.find(f=>f.properties.zone_type==='north_african_commerce_sequential_line');
assert.equal(line.properties.sequence_only,true);
assert.deepEqual(line.geometry.coordinates,[
 o.features.find(f=>f.id==='morocco-safi-wyndham-1552').geometry.coordinates,
 santa.geometry.coordinates
]);
assert.equal(line.properties.sequence_only,true);assert.equal(line.properties.territorial_claim,false);
const trinidadLine=o.features.find(f=>f.id==='trinidad-1595-puerto-espana-san-jose-operation-sequence');
assert.ok(trinidadLine&&trinidadLine.geometry.type==='LineString');
assert.equal(trinidadLine.properties.start_year,1595);
assert.equal(trinidadLine.properties.end_year,1595);
assert.equal(trinidadLine.properties.sequence_only,true);
assert.equal(trinidadLine.properties.territorial_claim,false);
assert.equal(trinidadLine.properties.area_sqkm,null);
assert.equal(trinidadLine.properties.material_impacts_not_assumed_between_waypoints,true);
assert.equal(trinidadLine.properties.material_impacts_not_assumed_between_waypoints,true);
assert.ok(trinidadLine.properties.source_urls.some(u=>u.includes('nalis.gov.tt')));
assert.ok(trinidadLine.properties.source_ids.includes('C11-S23'));
assert.deepEqual(trinidadLine.properties.related_event_ids,['1590S-E014']);
assert.deepEqual(trinidadLine.geometry.coordinates,[
 o.features.find(f=>f.id==='trinidad-puerto-de-los-espanoles-1595-raleigh-arrival').geometry.coordinates,
 o.features.find(f=>f.id==='caribbean-trinidad-raiders-1595').geometry.coordinates
]);
const linked= a11.events.find(e=>e.id==='1590S-E014');
assert.deepEqual([linked.lng,linked.lat],
 o.features.find(f=>f.id==='caribbean-trinidad-raiders-1595').geometry.coordinates);
assert.ok(linked.geo_precision.includes('modern_St_Joseph_named_city'));
assert.equal(linked.actual_English_territory_created,false);
for(const f of [trinidadLine, ...o.features.filter(f=>f.id==='trinidad-1595-puerto-espana-san-jose-operation-schematic')]){
 assert.ok(f.properties.source_ids.includes('C11-S24'));
 assert.ok(f.properties.related_event_ids.includes('1590S-E014'));
}
const renderer=app.slice(app.indexOf('function renderAtlanticContactSites(){'),app.indexOf('function renderNineYearsWarImpact(){'));
assert.ok(renderer.includes("groups.atlanticContact.clearLayers()"));
assert.ok(renderer.includes("p.start_year===year&&p.end_year===year"));
assert.ok(renderer.includes("!$('toggleTerritorialFootprints').checked")&&renderer.includes("!$('toggleControlAreas').checked"));
for(const name of ['atlas-maghreb-commerce-site','atlas-maghreb-trade-sequence','atlas-caribbean-raid-site','atlas-caribbean-urban-occupation'])
 assert.ok(renderer.includes(name),'Missing distinct marker style '+name);
const trinidad=o.features.find(f=>f.id==='trinidad-1595-puerto-espana-san-jose-operation-schematic');
assert.ok(trinidad&&trinidad.geometry.type==='Polygon');
assert.equal(trinidad.properties.mapped_raid_sites_count,2);
assert.equal(trinidad.properties.area_measurement_prohibited,true);
assert.equal(trinidad.properties.area_measurement_prohibited,true);assert.equal(trinidad.properties.territorial_claim,false);
assert.equal(o.metadata.northwest_trinidad_schematic_impact_polygons,1);
assert.equal(o.metadata.caribbean_historical_measured_occupation_polygons,0);
const ring=trinidad.geometry.coordinates[0];assert.deepEqual(ring[0],ring.at(-1));
function within(lon,lat,ring){let inArea=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
 const [xi,yi]=ring[i],[xj,yj]=ring[j];
 if((yi>lat)!==(yj>lat)&&lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)inArea=!inArea;
}return inArea;}
for(const place of trinidad.properties.named_anchors){
 assert.ok(within(place.lon,place.lat,ring),'Trinidad evidence anchor outside study envelope '+place.name);
 const attested=o.features.find(f=>f.id===place.id);
 assert.ok(attested&&attested.geometry.type==='Point');
 assert.deepEqual(attested.geometry.coordinates,[place.lon,place.lat]);
}
const sanJose=o.features.find(f=>f.id==='caribbean-trinidad-raiders-1595');
assert.ok(sanJose.properties.name.includes('焚毁西班牙殖民城镇'));
assert.ok(sanJose.properties.source_urls.some(x=>x.includes('nalis.gov.tt')));
assert.ok(trinidad.properties.source_urls.some(x=>x.includes('searcharchives.bl.uk')));
assert.ok(renderer.includes('atlas-trinidad-1595-impact'));
assert.ok(renderer.includes('atlas-trinidad-1595-action-sequence'));
assert.ok(renderer.includes('const isMilitary=f.properties.zone_type'));
assert.ok(renderer.includes("'atlas-maghreb-trade-sequence'"));
assert.ok(renderer.includes("if(small)")&&renderer.includes("map.getZoom()<8"));
assert.ok(app.includes('renderAtlanticContactSites()}});'),'The impact cue must update on zoom');
assert.ok(renderer.includes("openTerritoryDossier(f,'atlantic-contact')"));
const refresh=app.slice(app.indexOf('function refreshHistoricalLayers(){'),app.indexOf("$('toggleHypotheses').addEventListener"));
assert.ok(refresh.includes('renderAtlanticContactSites();'));
assert.ok(app.includes('atlanticContactData=atlanticData;'));
assert.ok(html.includes('1497—1599'));
console.log('PASS 1551–88 Maghreb commercial contacts, 1595 Venezuelan raids & failed San Juan, 1598 temporary San Juan, no fictitious territorial claims');
