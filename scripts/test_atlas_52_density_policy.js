#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(base,f),'utf8');
const policy=require('../js/atlas-density-policy.js');
const mapApp=read('app.js'),html=read('index.html'),css=read('css/atlas-density-map.css');
const expected=[[2,'wide',76],[3,'wide',76],[4,'wide',62],
 [5,'regional',48],[6,'regional',38],[7,'local',32],[8,'local',28],[12,'local',28]];
for(const [zoom,mode,radius] of expected){
 assert.equal(policy.modeForZoom(zoom),mode,'zoom mode '+zoom);
 assert.equal(policy.radiusForZoom(zoom),radius,'cluster radius '+zoom);
}
for(let z=2;z<12;z++)assert(policy.radiusForZoom(z)>=policy.radiusForZoom(z+1),
 'cluster grouping must relax (never grow) when zooming in');
assert(mapApp.includes('const densityMode=densityPolicy?.modeForZoom(map.getZoom())'),
 'map must recompute density at each render');
assert(mapApp.includes('mapNode.classList.toggle(\'atlas-density-\'+mode'),
 'map must expose density mode to SVG paint layer');
assert(mapApp.includes('const clusterRadius=densityPolicy?.radiusForZoom(map.getZoom())'),
 'cluster radius must vary with zoom');
assert(!mapApp.includes('levelOf(e)===1&&!showAll'),
 'low priority source events must not disappear on low zoom');
assert(mapApp.includes("if(count>8||(map.getZoom()<=4&&pin))"),
 'global and large clusters must open the right record list');
assert(mapApp.includes('window.atlasDensityAudit=()=>densityAudit'),
 'auditable member conservation is mandatory');
assert(mapApp.includes('groupedRecords:nearby.reduce((sum,g)=>sum+g.items.length,0)'));
assert(mapApp.includes('eligibleKeys:Object.freeze(shown.map('));
assert(mapApp.includes('groupedKeys:Object.freeze(nearby.flatMap('));
assert(!mapApp.includes("on('mouseover',()=>{if(g.items.length<=8"),
 'moving mouse across dense hubs must not spray flyout icons');
assert(mapApp.includes("if(t?.closest?.('.leaflet-marker-icon,.leaflet-control-container,.leaflet-popup,.leaflet-tooltip,.leaflet-interactive'))return"),
 'SVG source and event markers must not be intercepted by map background hit test');
assert(mapApp.includes("group.items.map(x=>x.item.id).sort().join('|')"),
 'clusters preserve original event identifiers');
assert(html.includes('js/atlas-density-policy.js?v=atlas52-display-density-20261113'));
assert(html.indexOf('js/atlas-density-policy.js?v=')<html.indexOf('app.js?v='),
 'policy must load before map');
assert(html.includes('css/atlas-density-map.css?v=atlas52-display-density-20261113'));
assert(html.includes('app.js?v=atlas46-click-notes-20261112-atlas52-display-density-20261113'),
 'force refresh old cached application');
assert(css.includes('#map.atlas-density-wide')&&css.includes('#map.atlas-density-regional'));
assert(!/(?:pointer-events\s*:\s*none|display\s*:\s*none|visibility\s*:\s*hidden)/i.test(css),
 'dim scheme may never make polygon hitboxes disappear');
assert(css.includes('.atlas-18c-overlap-glow'),
 'selected historic outline must remain clearly visible');
console.log('PASS atlas52: 8 zoom rules, monotonic grouping, all geocoded events enter clusters, click ownership and paint-only area declutter.');
