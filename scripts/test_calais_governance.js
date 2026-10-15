#!/usr/bin/env node
'use strict';
// The Calais/Guines change of sovereignty must be explicit in historic data,
// not in a special front-end 'if year >= 1558 && id === calais' condition.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const app=read('app.js');
new vm.Script(app,{filename:'app.js'});
const source=app.slice(app.indexOf('const historicControllerPalette='),app.indexOf('function openTerritoryDossier('));
assert.ok(source.startsWith('const historicControllerPalette='));
const {controllerAtYear,historicControllerPalette}=vm.runInNewContext('(()=>{'+source+'return {controllerAtYear,historicControllerPalette};})()');
assert.equal(Object.keys(historicControllerPalette).length,2);
assert.equal(historicControllerPalette.english_crown.stroke,'#9e6cde');
assert.equal(historicControllerPalette.french_crown.stroke,'#65c9bc');
assert.ok(!app.includes('frenchCalais')&&!app.includes('recoveredFrench'));
assert.ok(!app.includes("year>=1558&&p.source_place_id==='calais-crown'"));
const areaRenderer=app.split('function renderTerritories(){')[1]?.split('function renderPoliticalRelationAreas(){')[0]||'';
const cityRenderer=app.split('function renderControlAreas(){')[1]?.split('function yearValidWarZone(')[0]||'';
assert.ok(areaRenderer.includes('controllerAtYear(p,year)'));
assert.ok(cityRenderer.includes('controllerAtYear(p,year)'));
assert.ok(areaRenderer.includes("p.geometry_role==='attested_settlement_envelope_not_surveyed_border'"));
assert.ok(app.includes("row('当年治理主体',controller?.controller_zh)"));
const decades=[[1497,1549],[1550,1559],[1560,1569],[1570,1579],[1580,1589],[1590,1599]];
const file=(kind,a,b)=>'data/'+kind+'-'+a+'-'+b+'.geojson';
let baseGeo=null;
for(const [a,b] of decades){
 const areas=JSON.parse(read(file('territorial-footprints',a,b)));
 const points=JSON.parse(read(file('french-urban-control',a,b)));
 const area=areas.features.filter(f=>f.properties?.source_place_id==='calais-crown');
 assert.equal(area.length,1,file('territorial-footprints',a,b));
 assert.equal(areas.features.length,7,'Never add an artificial territorial polygon');
 const shape=area[0].geometry;
 if(baseGeo)assert.deepEqual(shape,baseGeo,'Do not invent/change inherited reference polygon');
 else baseGeo=shape;
 assert.equal(area[0].properties.fill_authorized,false);
 assert.equal(area[0].properties.historical_boundary_confirmed,false);
 assert.equal(area[0].properties.area_sqkm,null);
 assert.ok(!Object.hasOwn(area[0].properties,'color'),'Calais color must derive from historical controller, not data styles');
 const city=points.features.filter(f=>['calais-crown','guines-crown-1520s'].includes(f.properties?.source_place_id));
 assert.equal(city.length,2);
 for(const item of [area[0],...city]){
  const p=item.properties;
  assert.ok(Array.isArray(p.controller_periods)&&p.controller_periods.length>0);
  assert.ok(p.controller_periods.every(t=>Number.isInteger(t.start_year)&&Number.isInteger(t.end_year)&&t.start_year<=t.end_year
   &&['english_crown','french_crown'].includes(t.controller_group)&&t.controller_zh&&t.relation_type));
  for(let year=Math.max(a,p.start_year);year<=b;year++){
   const matches=p.controller_periods.filter(t=>t.start_year<=year&&year<=t.end_year);
   assert.equal(matches.length,1,item.id+' year '+year+' must have one documented controller');
   const expected=year<1558?'english_crown':'french_crown';
   assert.equal(controllerAtYear(p,year).controller_group,expected,item.id+' control incorrectly assigned at '+year);
  }
  assert.equal(controllerAtYear(p,a-1),null);
  assert.equal(controllerAtYear(p,b+1),null);
  if(a>=1560)assert.ok(!/english/i.test(p.historical_state||''),'French years must not carry English active-state metadata');
 }
 if(a===1550){
  assert.equal(area[0].properties.relation_type,'crown_governance_transition');
  for(const p of [area[0].properties,...city.map(f=>f.properties)]){
   assert.equal(controllerAtYear(p,1557).controller_group,'english_crown');
   assert.equal(controllerAtYear(p,1558).controller_group,'french_crown');
  }
 }else if(a>=1560){
  assert.equal(area[0].properties.relation_type,'direct_french_crown_control');
  assert.equal(area[0].properties.political_control_proof,'documented_French_governance_after_1558');
  assert.ok(city.every(x=>x.properties.polity==='Kingdom of France'));
 }
}
assert.ok(cityRenderer.includes("if(controller)openTerritoryDossier(f,'historic')"),
 'Clicking a French city must not open a stale English-era place dossier');
console.log('PASS: Calais/Guines yearly controllers and geometry unchanged 1497–1599, no hardcoded year/place styling');
