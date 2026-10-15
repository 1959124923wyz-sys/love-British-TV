#!/usr/bin/env node
'use strict';
// Non-sovereign editorial regions for 1584–89 land policy & 1586 city attacks.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const geo=JSON.parse(read('data/tenth-land-dispossession-and-raids-1584-1589.geojson'));
const atlas=JSON.parse(read('data/atlas-1580-1589.json'));
const prev=JSON.parse(read('data/tenth-invasion-impact-areas-1580-1583.geojson'));
const app=read('app.js');
new vm.Script(app,{filename:'app.js'});
assert.equal(geo.type,'FeatureCollection');
assert.equal(geo.features.length,5);
assert.equal(geo.metadata.actual_colonial_control_sqkm,null);
assert.equal(geo.metadata.actual_occupation_sqkm,null);
const byId=new Map(geo.features.map(f=>[f.id,f]));
assert.equal(byId.size,5);
const land=byId.get('munster-crown-forfeiture-plantation-study-1584-1589');
assert.ok(land);
const prevMunster=prev.features.find(f=>f.id==='munster-war-devastation-1581-1583-schematic');
assert.deepEqual(land.geometry,prevMunster.geometry,'Must reuse existing schematic region exactly; no newly invented estate perimeter');
const events=new Map(atlas.events.map(e=>[e.id,e]));
const sources=new Set(atlas.sources.map(s=>s.id));
for(const f of geo.features){
 const p=f.properties;
 assert.equal(f.geometry.type,'Polygon');
 const ring=f.geometry.coordinates[0];
 assert.ok(ring.length>=8);
 assert.deepEqual(ring[0],ring.at(-1));
 for(const c of ring)assert.ok(Number.isFinite(c[0])&&Number.isFinite(c[1])&&Math.abs(c[0])<=180&&Math.abs(c[1])<=90);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.occupation_area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.equal(p.map_layer,'territory');
 assert.ok(Array.isArray(p.source_urls)&&p.source_urls.every(url=>url.startsWith('https://')));
 assert.ok(p.source_ids.length>=2&&p.source_ids.every(s=>sources.has(s)));
 assert.ok(p.related_event_ids.length>=1&&p.related_event_ids.every(id=>events.has(id)));
 assert.ok(p.start_year<=p.end_year);
}
assert.equal(land.properties.zone_type,'crown_land_dispossession_policy_study');
assert.equal(land.properties.start_year,1584);
assert.equal(land.properties.end_year,1589);
const stages=land.properties.year_stages;
assert.equal(stages.length,4);
for(let year=1584;year<=1589;year++){
 const v=stages.filter(stage=>stage.start_year<=year&&year<=stage.end_year);
 assert.equal(v.length,1,'Exactly one story for the current year '+year);
 assert.ok(v[0].summary_zh.length>=20&&v[0].source_ids.every(s=>sources.has(s)));
}
assert.ok(!stages[0].title.includes('1586')&&!stages[0].summary_zh.includes('1586'),'Do not announce future legal grants in 1584');
const raided=geo.features.filter(f=>f.properties.zone_type==='english_crown_privateering_port_raid_schematic');
assert.equal(raided.length,4);
const targets=new Set(['1580S-E016','1580S-E019','1580S-E020','1580S-E021']);
function inPoly(point,ring){
 let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [x,y]=ring[i],[xj,yj]=ring[j];
  if((y>point[1])!==(yj>point[1])&&point[0]<(xj-x)*(point[1]-y)/(yj-y)+x)yes=!yes;
 }return yes;
}
for(const f of raided){
 const p=f.properties;
 assert.ok([1585,1586].includes(p.start_year));assert.equal(p.end_year,p.start_year);
 assert.equal(p.related_event_ids.length,1);
 const id=p.related_event_ids[0],ev=events.get(id);
 assert.ok(targets.has(id));
 targets.delete(id);
 assert.equal(ev.year,p.start_year);
 assert.ok(inPoly([ev.lng,ev.lat],f.geometry.coordinates[0]),id+' existing source city coordinates not inside symbolic region');
 assert.ok(/illustrative|editorial/i.test(p.research_geo_method)&&p.research_geo_method.includes('ellipse'),'Must not claim historical walls/areas');
 assert.equal(p.historical_map_catalogue_url,'https://www.loc.gov/item/2007626708/');
 assert.equal(p.approximate_symbol_display,true);
}
assert.equal(targets.size,0);
const active=y=>geo.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.end_year);
for(const [y,n] of [[1583,0],[1584,1],[1585,2],[1586,4],[1587,1],[1588,1],[1589,1],[1590,0]])
 assert.equal(active(y).length,n,'Wrong year-gated extraction/raid surface '+y);
const r=app.split('function renderTenthLandRaidImpactAreas(){')[1]?.split('function renderTenthControlSites(){')[0]||'';
assert.ok(r.includes('groups.tenthExtraction.clearLayers()'),'Must clear the old year');
assert.ok(r.includes("!$('toggleTerritorialFootprints').checked")&&r.includes("!$('toggleControlAreas').checked"));
assert.ok(r.includes("year<1584||year>1589"));
assert.ok(r.includes('f.properties')||r.includes('const p=f.properties'));
assert.ok(r.includes("atlas-tenth-land-policy-impact")&&r.includes("atlas-tenth-port-raid-impact"));
assert.ok(r.includes('year_stages?.find(item=>year>=item.start_year&&year<=item.end_year)'));
assert.ok(r.includes("source_ids:stage.source_ids"),'Pre-1586 dossiers must not cite future legislation');
assert.ok(r.includes("openTerritoryDossier(currentFeature,stage?'land-dispossession':'invasion-impact')"));
assert.ok(app.includes("renderTenthLandRaidImpactAreas();"));
assert.ok(app.slice(app.indexOf('function refreshHistoricalLayers(){'),app.indexOf("$('toggleHypotheses').addEventListener")).includes('renderTenthLandRaidImpactAreas();'));
assert.ok(app.includes("tenthLandRaidAreas=await extractionResponse.json()"));
assert.ok(r.includes('atlas-schematic-screen-cue')&&r.includes('const lowZoom=land?zoom<5:zoom<8'), 'Urban assaults must remain visible at default world zoom');
assert.ok(app.includes('renderTenthLandRaidImpactAreas()}});'), 'Zoom changes must update cue into local polygon');
console.log('PASS: 1584–89 Munster policy, 1585 Santiago and three 1586 raid towns, zoom cues and source links; no territorial claims');
