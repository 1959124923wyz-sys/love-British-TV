#!/usr/bin/env node
'use strict';
// Historical correctness: contemporary OSM labels are a user-selected
// geographic REFERENCE, not the political labels used for the selected year.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const app=read('app.js'),html=read('index.html'),css=read('css/dark-atlas-v2.css');
new vm.Script(app,{filename:'app.js'});

assert.match(app,/const modernTiles=L\.tileLayer\('https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png'/,
 'The familiar modern geographic reference must be available');
const modernSnippet=app.split('const modernTiles=')[1]?.split('const physicalTiles=')[0]||'';
assert.match(modernSnippet,/\.addTo\(map\)/,
 'Modern reference is the default, as explicitly requested');
assert.match(modernSnippet,/openstreetmap\.org\/copyright/,
 'OSM contributor attribution is mandatory');
assert.match(app,/let selectedBasemap='modern'/,
 'Initial map mode must never silently default to NASA');

assert.ok(app.includes('BlueMarble_ShadedRelief_Bathymetry'),
 'NASA no-label physical basemap should remain optional');
assert.match(app,/GoogleMapsCompatible_Level8\/\{z\}\/\{y\}\/\{x\}\.jpg/);
assert.match(app,/maxNativeZoom:8/);
assert.ok(app.includes("physicalTiles.on('tileerror'"));
assert.ok(app.includes('data/natural-earth-land-110m.topojson'));
const land=JSON.parse(read('data/natural-earth-land-110m.topojson'));
assert.equal(land.type,'Topology');
assert.ok(land.objects.land&&!land.objects.countries);

assert.match(html,/id="showModernBasemap" checked/,
 'Modern map should be the initial checked reference option');
assert.match(html,/现代地名与道路/);
assert.match(html,/古今地点对照/);
assert.match(html,/不代表所选年份的国名、疆界/);
assert.ok(html.includes('app.js?v=timeline-v1800-merged-ch1ch2-singlecard-stablewidth-basemap-compare-20261015'));
assert.ok(html.includes('dark-atlas-v2.css?v=timeline-v1800-merged-ch1ch2-singlecard-stablewidth-basemap-compare-20261015'));
assert.ok(css.includes('.basemap-option')&&css.includes('.leaflet-tile-pane'));

assert.ok(app.includes("$('showModernBasemap').addEventListener('change',e=>setBasemap(e.target.checked?'modern':'physical'))"));
const switcher=app.split('function setBasemap(mode){')[1]?.split('// Tooltip descriptions')[0]||'';
assert.match(switcher,/map\.removeLayer\(physicalTiles\)/);
assert.match(switcher,/map\.removeLayer\(modernTiles\)/);
assert.match(switcher,/modernTiles\.addTo\(map\)/);
assert.match(switcher,/physicalTiles\.addTo\(map\)/);
assert.doesNotMatch(switcher,/setYear\(|setView\(|flyTo\(|renderPoints\(/,
 'Switch must preserve the historical year, map viewport and layers');
assert.ok(app.includes("if(selectedBasemap==='physical')physicalFallbackLayer.addTo(map)"),
 'An async fallback must not reappear over the modern reference');

console.log('PASS: default modern reference, optional unlabeled physical geography, unchanged historic layers');
