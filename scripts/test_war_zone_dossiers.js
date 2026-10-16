#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8'),json=p=>JSON.parse(read(p));
const occupied=json('data/war-occupied-zones-1540-1549.geojson'),contested=json('data/war-contested-zones-1540-1549.geojson');
const source=json('data/war-control-vicinity-1540-1549.geojson');
const military=json('data/military-control-points-1540-1549.geojson'),atlas=json('data/atlas-1540-1549.json');
const oldFootprints=json('data/territorial-footprints-1497-1549.geojson');
const militaryReach=json('data/war-front-corridors-1540-1549.geojson');
const app=read('app.js'),css=read('css/dark-atlas-v2.css'),html=read('index.html');
new vm.Script(app,{filename:'app.js'});
const citations=new Set(atlas.sources.map(x=>x.id));
assert.equal(occupied.features.length,10,'Keep ten research-sourced schematic occupied localities, not ten invented Tudor boundaries');
assert.equal(contested.features.length,4,'Four evidence-anchored low-precision campaign theaters');
assert.ok(contested.metadata.archival_evidence_for_actual_polygon_boundaries===false);
assert.ok(contested.metadata.area_statistics_forbidden);
assert.equal(military.features.length,19,'18 previously reviewed garrisons plus one separately cited Roxburgh 1547 site');
assert.ok(military.features.some(f=>f.properties.stable_id==='roxburgh-english-artillery-fort-1547-1550'&&f.properties.fill_authorized===false),'PR50 Roxburgh point is not a certified occupied territory');
assert.equal(oldFootprints.features.length,7,'Inherited territorial references must remain intact');
const ids=new Set(military.features.filter(f=>f.properties.not_an_English_control_feature!==true).map(f=>f.properties.stable_id));
const originals=new Map(source.features.map(x=>[x.id,x]));
for(const f of occupied.features){
 const p=f.properties;assert.equal(f.geometry.type,'Polygon');
 assert.equal(p.zone_type,'occupied');
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);
 assert.ok(ids.has(p.stable_id),'An unsubstantiated additional military occupation must not appear');
 assert.deepEqual(f.geometry,originals.get(f.id)?.geometry,'Historic geometry may not be invented during UI repair');
 assert.ok(p.source_ids.length&&p.source_ids.every(i=>citations.has(i)),f.id+' missing published sources');
 assert.ok(p.summary_zh&&p.precision_note&&p.related_place_ids.includes(p.stable_id));
}
for(const f of contested.features){
 const p=f.properties;
 assert.equal(f.geometry.type,'Polygon');
 assert.equal(p.zone_type,'contested');assert.equal(p.area_sqkm,null);
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
 assert.equal(p.area_statistics_forbidden,true);
 assert.ok(p.construction_method.includes('hand_sketch'),'Never present an illustrative war area as an old surveyed border');
 assert.ok(p.source_ids.length&&p.source_ids.every(i=>citations.has(i)),f.id+' missing sources');
 assert.ok(p.related_event_ids.every(i=>atlas.events.some(x=>x.id===i)),f.id+' missing actual events');
 assert.ok(p.precision_note?.includes('示意'),f.id+' must disclose invented illustrative outline');
 assert.deepEqual(f.geometry.coordinates[0][0],f.geometry.coordinates[0].at(-1),'Close GeoJSON polygons');
}
assert.equal(militaryReach.features.length,8,'Preserve six historical Scots/English military corridors and add two named Devon 1549 domestic battle axes');
assert.equal(militaryReach.metadata.unapproved_occupation_polygon_count,0);
for(const f of militaryReach.features){
 const p=f.properties;
 assert.equal(p.zone_type,'war_reach_schematic');
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.area_statistics_forbidden,true);
 assert.equal(p.not_actual_occupied_area,true);
 assert.ok(p.summary_zh&&p.precision_note&&p.map_disclaimer);
 assert.equal(f.geometry.type,'LineString','Military axes must not be guessed land surfaces');
 assert.ok(f.geometry.coordinates.length>=2,'Historical direction needs at least two reference points');
 assert.ok(p.source_ids?.length&&p.source_ids.every(id=>citations.has(id)),f.id+' missing sources');
 assert.ok((p.related_event_ids||[]).every(id=>atlas.events.some(e=>e.id===id)),f.id+' missing historic events');
}
const yearlyReach={1543:0,1544:2,1545:0,1546:0,1547:1,1548:2,1549:3};
for(const [y,expected] of Object.entries(yearlyReach))
 assert.equal(militaryReach.features.filter(f=>f.properties.start_year<=Number(y)&&Number(y)<=f.properties.end_year).length,expected,'Reach chronology '+y);
assert.ok(!militaryReach.features.find(f=>f.properties.start_year===1549).properties.name.includes('哈丁顿英军占领'),'Haddington must no longer be English occupied at the end of 1549');
assert.ok(app.includes('function renderWarReachCorridors()')&&app.includes("openTerritoryDossier(feature,'war-reach')"), 'PR38 military reach must render as clickable historical schematic');
assert.ok(app.includes('function openMapTerritoryAt(latlng)')&&app.includes('featureContainsCoordinate(f,lon,lat)'),'Mouse point-in-polygon fallback must also cover PR38');
const activeIds=y=>new Set(military.features.filter(f=>f.properties.not_an_English_control_feature!==true&&f.properties.year_end_start<=y&&y<=f.properties.year_end_stop).map(f=>f.properties.stable_id));
const countOccupied=y=>occupied.features.filter(f=>f.properties.start_year<=y&&f.properties.end_year>=y&&activeIds(y).has(f.properties.stable_id)).length;
const countContested=y=>contested.features.filter(f=>f.properties.start_year<=y&&f.properties.end_year>=y).length;
const countByYear={1540:[0,0],1544:[2,0],1545:[2,1],1546:[4,1],1547:[7,3],1548:[9,3],1549:[6,2]};
for(const[y,v]of Object.entries(countByYear)){
 assert.deepEqual([countOccupied(+y),countContested(+y)],v,'Year '+y+' schematic sites/contests inconsistent');
}
assert.equal(countOccupied(1539),0);assert.equal(countContested(1539),0);
assert.ok(!activeIds(1548).has('hailes-english-1548-date_unknown'),'Hailes was recaptured by Scots in 1548');
assert.ok(!activeIds(1549).has('haddington-english-1548-1549'),'Haddington must disappear after English withdrawal');
assert.ok(activeIds(1549).has('boulogne-english-1544-1550'),'Boulogne still English-held at end of 1549');
for(const t of ["function openTerritoryDossier(feature,kind='historic')","openTerritoryDossier(feature,'occupied')","openTerritoryDossier(feature,'contested')","openTerritoryDossier(feature,'historic')",
 "function renderContestedZones()","function renderWartimeVicinities()","function ensureContestedHatch()",
 "renderWartimeVicinities();renderWarReachCorridors();renderContestedZones();renderWartimeControls();","renderer:sovereigntyRenderer",
 "fetch('data/war-occupied-zones-1540-1549.geojson'","fetch('data/war-contested-zones-1540-1549.geojson'"])
 assert.ok(app.includes(t),t+' missing');
assert.ok(!app.includes('map.getZoom()>9')&&!app.includes('map.getZoom()>8'),'Uncertain war zones should persist while zooming instead of suddenly vanishing');
assert.ok(!app.includes("map.flyTo("),'Clicking territorial polygons must not change zoom');
assert.ok(app.includes('map.getPane(\'warVicinityPane\').style.zIndex=\'463\''),'Occupied site clickable above theater stripes');
assert.ok(app.includes('map.getPane(\'contestedZonePane\').style.zIndex=\'462\''),'Theater must be clickable above base sovereignty');
assert.ok(app.includes('activeEnglishGarrisonIds()'),'Occupation surfaces must be gated by historical year-end garrisons');
assert.ok(app.includes("if(linkedOccupiedZone)openTerritoryDossier(linkedOccupiedZone,'occupied')"),'Garrison ring must expose linked control-area dossier if tiny polygon is masked by a larger symbol');
assert.ok(!html.includes('id="controlStatus"')&&!app.includes('renderAnnualControlSummary'),'Delete the unwanted statistics box in both DOM and JS');
assert.ok(html.includes('swatch contested-war'),'Keep contested zone legend');
assert.ok(html.includes('app.js?v=timeline-v1800-merged-ch1ch2')&&html.includes('css/dark-atlas-v2.css?v=timeline-v1800-merged-ch1ch2'));
assert.ok(css.includes('display:inline-flex!important'),'Year title must remain compact after removing statistic rows');
assert.ok(css.includes('.zone-dossier-facts')&&!css.includes('.control-status-value'));
assert.ok(app.includes("map.createPane('garrisonHitPane')")&&app.includes('className:\'atlas-garrison-hit\''),'Above-event icon stroke-hit ring must expose otherwise occluded territory dossiers');
assert.ok(css.includes('pointer-events:stroke!important'),'Hit ring should be annular and must not obscure event centers');
assert.ok(css.includes('.atlas-contested-zone')&&css.includes('pointer-events:visiblePainted'));
assert.ok(app.includes('function openMapTerritoryAt(latlng)')&&app.includes('function featureContainsCoordinate(feature,lon,lat)'),'Real map click fallback needed for source-based territory intros');
assert.ok(!app.includes("map.getZoom()>8")&&!app.includes("map.getZoom()>9"),'Avoid sudden disappearance at high zoom');
console.log('PASS historical territory hit testing, removed badge, continuous war zone zoom and source-qualified chronology');
