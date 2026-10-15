#!/usr/bin/env node
'use strict';
// P0 regression: the historic atlas must never silently reintroduce current
// national labels through its modern base tiles.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const app=read('app.js'),html=read('index.html'),css=read('css/dark-atlas-v2.css');
new vm.Script(app,{filename:'app.js'});
const match=app.match(/L\.tileLayer\(\s*'([^']+)'/);
assert.ok(match,'Map must have a documented geographic tile source');
const url=match[1];
assert.ok(url.startsWith('https://gibs.earthdata.nasa.gov/wmts/epsg3857/'),
 'Physical basemap should use NASA GIBS without login/key');
assert.ok(url.includes('BlueMarble_ShadedRelief_Bathymetry'));
assert.match(url,/GoogleMapsCompatible_Level8\/\{z\}\/\{y\}\/\{x\}\.jpg$/);
assert.doesNotMatch(app,/tile\.openstreetmap\.org|basemaps\.cartocdn\.com|World_Street_Map/,
 'Do not reintroduce contemporary street/country labels');
assert.ok(app.includes('maxNativeZoom:8'),'GIBS physical imagery supports native tiles only to zoom 8');
assert.ok(app.includes('attribution:'),'Physical raster provider needs visible attribution');
assert.ok(app.includes("physicalTiles.on('tileerror'"),'Network failures require a bundled, no-label fallback');
assert.ok(app.includes("map.removeLayer(physicalTiles)"),'Broken raster tiles must be removed for the fallback to show');
assert.ok(app.includes("data/natural-earth-land-110m.topojson"));
const land=JSON.parse(read('data/natural-earth-land-110m.topojson'));
assert.equal(land.type,'Topology');
assert.ok(land.objects.land,'Bundled physical outline must contain land');
assert.ok(!land.objects.countries,'Modern national borders are forbidden in the default fallback');
assert.ok(Object.keys(land.objects).every(x=>x==='land'));
assert.match(html,/现代观测资料/);
assert.match(html,/app\.js\?v=[^"]*unlabeled-physical-20261015/,'Bust browser cache for tile-layer change');
assert.ok(css.includes('.leaflet-tile-pane'),'Historic tile appearance must keep its approved dark style');
// No online API / browser fetch is needed to run this contract check.
console.log('PASS: unlabelled physical geography, provenance, fallback, modern labels excluded');
