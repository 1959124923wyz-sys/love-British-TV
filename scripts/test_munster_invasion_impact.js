#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const area=JSON.parse(read('data/tenth-invasion-impact-areas-1580-1583.geojson'));
const atlas=JSON.parse(read('data/atlas-1580-1589.json'));
const app=read('app.js');
new vm.Script(app,{filename:'app.js'});
assert.equal(area.type,'FeatureCollection');
assert.equal(area.features.length,2);
const active=y=>area.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.end_year);
for(const [y,count] of [[1579,0],[1580,1],[1581,1],[1582,1],[1583,1],[1584,0],[1586,0],[1599,0]])
 assert.equal(active(y).length,count,'Munster overlay must follow source years, not persist into colonial plantation '+y);
assert.deepEqual(area.features.map(f=>f.properties.start_year),[1580,1581]);
assert.deepEqual(area.features.map(f=>f.properties.end_year),[1580,1583]);
const eventById=new Map(atlas.events.map(e=>[e.id,e])),sourceById=new Map(atlas.sources.map(x=>[x.id,x]));
function pointInside(lon,lat,ring){
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [xi,yi]=ring[i],[xj,yj]=ring[j];
  if((yi>lat)!==(yj>lat)&&lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)inside=!inside;
 }
 return inside;
}
for(const f of area.features){
 const p=f.properties,geometry=f.geometry;
 assert.equal(geometry.type,'Polygon');
 assert.equal(geometry.coordinates.length,1);
 const ring=geometry.coordinates[0];
 assert.ok(ring.length>=8);
 assert.deepEqual(ring[0],ring.at(-1),'GIS ring must close');
 for(const point of ring)assert.ok(point.length===2&&Math.abs(point[0])<=180&&Math.abs(point[1])<=90);
 assert.equal(p.zone_type,'english_invasion_impact_schematic');
 assert.equal(p.map_layer,'territory');
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.occupation_area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.ok(p.method.includes('schematic')||p.method.includes('Schematic'));
 assert.ok(p.source_ids.length>=2&&p.source_ids.every(x=>sourceById.has(x)),'Linked source must already exist in chapter10');
 assert.ok(p.related_event_ids.length>=3&&p.related_event_ids.every(x=>eventById.has(x)),'Do not invent events');
 for(const id of p.related_event_ids){
  assert.ok(eventById.get(id).year<=p.end_year,'No future fact in overlay');
 }
 for(const anchor of p.named_anchors||[]){
  if(!Number.isFinite(anchor.lon))continue;
  assert.ok(pointInside(anchor.lon,anchor.lat,ring),f.id+' named evidence site falls OUTSIDE drawn impact envelope: '+anchor.name);
 }
}
assert.ok(area.features[0].properties.related_event_ids.includes('1580S-E007'));
assert.ok(area.features[1].properties.related_event_ids.includes('1580S-E009'));
const region=app.slice(app.indexOf('function renderTenthInvasionImpactAreas(){'),app.indexOf('function renderTenthControlSites(){'));
assert.ok(region.includes("year<1580||year>1583"));
assert.ok(region.includes("className:'atlas-tenth-invasion-impact'"));
assert.ok(region.includes("openTerritoryDossier(f,'invasion-impact')"));
assert.ok(region.includes('fillOpacity:.14')&&region.includes("dashArray:'8 6'"));
assert.ok(region.includes("!$('toggleTerritorialFootprints').checked")&&region.includes("!$('toggleControlAreas').checked"));
assert.ok(!region.includes('area_sqkm>0')&&!region.includes('calculateArea'));
assert.ok(app.includes('tenthInvasionImpactAreas=await impactResponse.json()'));
assert.ok(app.includes('renderTenthInvasionImpactAreas();'));
assert.ok(app.slice(app.indexOf('function refreshHistoricalLayers(){'),app.indexOf("$('toggleHypotheses').addEventListener")).includes('renderTenthInvasionImpactAreas();'), 'Impact areas must refresh on territory checkbox without changing year');
assert.ok(app.includes("invasionImpact?'英军入侵影响区'"));
assert.ok(app.includes('[atlas,atlasEleventh,atlasTenth,atlasNinth,atlasEighth,atlasSeventh,atlasSixth'));
console.log('PASS: Munster source-backed non-sovereign invasion impact polygons, stable 1580-83 time gates and evidence linked');
