#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const html=read('index.html'),app=read('app.js'),css=read('css/dark-atlas-v2.css');
new vm.Script(app,{filename:'app.js'});
assert.equal((html.match(/id="mapLayerTerritory"/g)||[]).length,1);
assert.equal((html.match(/id="mapLayerEvents"/g)||[]).length,1);
assert.match(html,/id="mapLayerTerritory" checked/);
assert.match(html,/id="mapLayerEvents" checked/);
assert.ok(!html.includes('id="mapControls"'),'Old confusing layer menu must not survive');
assert.ok(!html.includes('id="controlStatus"'),'Do not resurrect the unwanted yearly military statistics card');
assert.ok(!app.includes('renderAnnualControlSummary('),'Do not resurrect military statistics logic');
assert.ok(html.includes('id="mapModeHelp"')&&html.includes('id="internalLayerFlags" hidden'));
for(const gate of ['toggleTerritorialFootprints','toggleControlAreas','togglePoliticalRelations','toggleKingdom',
 'toggleHypotheses','toggleRoutes','toggleCandidates','toggleClaims','toggleEvents','toggleMinorEvents'])
 assert.equal((html.match(new RegExp('id="'+gate+'"','g'))||[]).length,1,'Compatibility ID '+gate);
assert.ok(css.includes('#internalLayerFlags,[id="internalLayerFlags"][hidden]{display:none!important;}'));
assert.ok(css.includes('.map-layer-switch')&&css.includes('.map-mode-help-body'));
for(const fragment of ["renderWarReachCorridors();renderContestedZones();renderWartimeControls()",
 "map.getContainer().addEventListener('click'","function openMapTerritoryAt(latlng)"])
 assert.ok(app.includes(fragment),'Preserve PR37/38 previous stable mapping: '+fragment);
const definition=app.slice(app.indexOf('function syncMapLayers()'),app.indexOf('function syncMapLayers()')+1550);
for(const gate of ['toggleTerritorialFootprints:territory','toggleControlAreas:territory','togglePoliticalRelations:territory',
 'toggleKingdom:territory','toggleHypotheses:territory','toggleRoutes:events','toggleCandidates:events',
 'toggleClaims:events','toggleEvents:events'])assert.ok(definition.includes(gate),'Layer gate lost '+gate);
assert.ok(!definition.includes('setYear('),'Switch must never reset year');
assert.ok(!definition.includes('map.setView')&&!definition.includes('map.flyTo'),'Switch must preserve zoom and map position');
assert.ok(app.includes("$('mapLayerTerritory').addEventListener('change',syncMapLayers)"));
assert.ok(app.includes("$('mapLayerEvents').addEventListener('change',syncMapLayers)"));
for(const file of ['data/war-front-corridors-1540-1549.geojson','data/war-occupied-zones-1540-1549.geojson','data/war-contested-zones-1540-1549.geojson']){
 const geo=JSON.parse(read(file));
 assert.ok(geo.features.length>0);
 assert.ok(geo.features.every(f=>f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false));
}
assert.ok(html.includes('app.js?v=timeline-v1770-ch9')&&html.includes('css/dark-atlas-v2.css?v=timeline-v1770-ch9'));
console.log('PASS PR39 modes: two independent public checkboxes, ten compatible hidden gates, PR37/38 retained, no resurrected stats, no fabricated borders');
