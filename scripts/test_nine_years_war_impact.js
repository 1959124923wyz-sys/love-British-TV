#!/usr/bin/env node
'use strict';
// War campaigns, successful Irish resistance, and a Crown expedition are
// separate from annexation, territorial ownership and audited historic frontiers.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const g=JSON.parse(read('data/nine-years-war-operational-impact-1594-1599.geojson'));
const a=JSON.parse(read('data/atlas-1590-1599.json'));
const prev=JSON.parse(read('data/tenth-invasion-impact-areas-1580-1583.geojson'));
const app=read('app.js'),html=read('index.html');
new vm.Script(app,{filename:'app.js'});
assert.equal(g.type,'FeatureCollection');
assert.equal(g.features.length,4);
assert.equal(g.metadata.actual_english_occupation_boundaries,0);
assert.equal(g.metadata.footprint_area_measurement_allowed,false);
const sourceIds=new Set(a.sources.map(s=>s.id)),events=new Map(a.events.map(e=>[e.id,e]));
function active(y){return g.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.end_year);}
for(const [y,n] of [[1590,0],[1593,0],[1594,1],[1595,1],[1596,0],[1597,0],[1598,2],[1599,1],[1600,0]])
 assert.equal(active(y).length,n,'War overlay wrong visible year '+y);
const byId=new Map(g.features.map(f=>[f.id,f]));assert.equal(byId.size,4);
const fenn=byId.get('nine-years-war-enniskillen-fermanagh-1594-1595-study');
const blackwater=byId.get('nine-years-war-yellow-ford-armagh-1598-study');
const munster=byId.get('nine-years-war-munster-plantation-resistance-1598-study');
const essex=byId.get('essex-1599-southern-march-verified-towns-schematic');
assert.ok(fenn&&blackwater&&munster&&essex);
function pointInside(lon,lat,ring){
 let result=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [xi,yi]=ring[i],[xj,yj]=ring[j];
  if((yi>lat)!==(yj>lat)&&lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)result=!result;
 }
 return result;
}
for(const f of g.features){
 const p=f.properties;
 assert.equal(p.map_layer,'territory');
 assert.equal(p.territorial_claim,false);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.occupation_area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.ok(Array.isArray(p.source_ids)&&p.source_ids.length>0&&p.source_ids.every(x=>sourceIds.has(x)));
 assert.ok(Array.isArray(p.related_event_ids)&&p.related_event_ids.length>0);
 for(const id of p.related_event_ids)assert.ok(events.has(id),'Unknown event '+id);
 assert.ok(p.source_urls?.every(u=>u.startsWith('https://')));
 if(f.geometry.type==='Polygon'){
  const ring=f.geometry.coordinates[0];
  assert.ok(ring.length>=6);
  assert.deepEqual(ring[0],ring.at(-1),'Unclosed study polygon '+f.id);
  for(const [lon,lat] of ring)assert.ok(Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90);
 }else{
  assert.equal(f.geometry.type,'LineString');
  assert.ok(f.geometry.coordinates.length>=3);
 }
}
assert.ok(pointInside(-7.644771,54.346171,fenn.geometry.coordinates[0]),'Enniskillen must be inside Fermanagh locality');
assert.ok(pointInside(-6.70544,54.41288,blackwater.geometry.coordinates[0]),'Existing geocoded Blackwater site outside area');
const prevMunster=prev.features.find(f=>f.id==='munster-war-devastation-1581-1583-schematic');
assert.deepEqual(munster.geometry,prevMunster.geometry,'Munster reference may not silently expand or change');
assert.ok(munster.properties.name.includes('反殖民'));
assert.ok(munster.properties.summary_zh.includes('被杀害'),'Irish resistance must acknowledge harms to civilians');
assert.ok(!munster.properties.summary_zh.includes('英王军队占领'));
assert.equal(fenn.properties.year_stages.length,2);
for(let y of [1594,1595]){
 let stages=fenn.properties.year_stages.filter(z=>z.start_year<=y&&y<=z.end_year);
 assert.equal(stages.length,1,'Fermanagh stage missing '+y);
 assert.ok(stages[0].source_ids.every(id=>sourceIds.has(id)));
 assert.ok(stages[0].related_event_ids.every(id=>events.get(id).year<=y),'Future battle leaked at '+y);
}
assert.ok(!fenn.properties.year_stages[0].summary_zh.includes('1595'),'No future recapture in 1594');
assert.ok(fenn.properties.year_stages[1].title.includes('重新夺回'));
assert.equal(essex.properties.start_year,1599);
const towns=essex.properties.waypoints.map(x=>x.name);
assert.deepEqual(towns,['都柏林','基尔肯尼','克朗梅尔','利默里克','基尔马洛克','沃特福德','恩尼斯科西','阿克洛','都柏林']);
assert.equal(essex.geometry.coordinates.length,essex.properties.waypoints.length);
for(let i=0;i<essex.geometry.coordinates.length;i++)
 assert.deepEqual(essex.geometry.coordinates[i],[essex.properties.waypoints[i].lon,essex.properties.waypoints[i].lat]);
assert.equal(essex.properties.material_impacts_not_assumed_between_waypoints,true);
assert.equal(essex.properties.material_impacts_not_assumed_between_waypoints,true);assert.ok(essex.properties.geometry_precision.includes('schematic_not_historical_control_border'),'Cartographic caution must remain in research data, not repeated in every public caption');
const r=app.slice(app.indexOf('function renderNineYearsWarImpact(){'),app.indexOf('function renderTenthControlSites(){'));
assert.ok(r.includes('groups.nineYearsWar.clearLayers()'));
assert.ok(r.includes("year<1594||year>1599"));
assert.ok(r.includes("!$('toggleTerritorialFootprints').checked")&&r.includes("!$('toggleControlAreas').checked"));
assert.ok(r.includes("stage.source_ids")&&r.includes("stage.related_event_ids"));
assert.ok(r.includes('atlas-nine-years-war-study')&&r.includes('atlas-essex-1599-schematic'));
assert.ok(r.includes("openTerritoryDossier(current,'nine-years-war')"));
assert.ok(app.includes("nineYearsWarImpact=nineYearsData"));
const refresh=app.slice(app.indexOf('function refreshHistoricalLayers(){'),app.indexOf("$('toggleHypotheses').addEventListener"));
assert.ok(refresh.includes('renderNineYearsWarImpact();'));
assert.ok(app.includes('renderNineYearsWarImpact();'));
assert.ok(html.includes('1497—1599'));
console.log('PASS: 1594–95 Fermanagh, 1598 Gaelic victory/plantation resistance, 1599 Essex city itinerary; no fabricated land controls');
