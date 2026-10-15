#!/usr/bin/env node
'use strict';
// This regression intentionally inspects stored bytes as well as hydrated map
// objects, to prevent a new decade from copying 566 GIS positions yet again.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {hydrateFootprints,CANONICAL}=require('../js/territory-geometry.js');
const base=read(CANONICAL);
assert.equal(base.features.length,7);
assert.ok(base.features.every(f=>f.geometry?.coordinates&&!Object.hasOwn(f.properties,'geometry_ref')));
let totalRemoved=0;
const periods=['1550-1559','1560-1569','1570-1579','1580-1589','1590-1599'];
for(const period of periods){
 const filename='data/territorial-footprints-'+period+'.geojson';
 const raw=read(filename);
 assert.equal(raw.type,'FeatureCollection');
 assert.equal(raw.metadata.geometry_reference_file,CANONICAL);
 assert.equal(raw.features.length,7);
 for(const f of raw.features){
  assert.equal(f.geometry,null,filename+' cannot inline repeat geometry for '+f.id);
  assert.equal(f.properties.geometry_ref,f.id);
  assert.ok(base.features.some(c=>c.id===f.id));
 }
 const expanded=hydrateFootprints(base,raw);
 assert.equal(expanded.features.length,raw.features.length);
 for(let i=0;i<expanded.features.length;i++){
  const original=base.features.find(f=>f.id===expanded.features[i].id);
  assert.strictEqual(expanded.features[i].geometry,original.geometry,'Shared data should reuse original coordinate objects');
  assert.deepEqual(expanded.features[i].properties,raw.features[i].properties,'History states must remain untouched');
  assert.equal(expanded.features[i].properties.historical_boundary_confirmed,false);
  assert.equal(expanded.features[i].properties.fill_authorized,false);
 }
 const stored=fs.statSync(path.join(root,filename)).size;
 const reference=fs.statSync(path.join(root,CANONICAL)).size;
 assert.ok(stored<reference*.5,'Period geometry accidentally duplicated: '+filename);
 totalRemoved+=reference-stored;
}
// No missing/ambiguous/unknown/overridden reference may be silently rendered.
const one=read('data/territorial-footprints-1580-1589.geojson');
const badRef=JSON.parse(JSON.stringify(one));
badRef.features[0].properties.geometry_ref='not-a-geographic-feature';
assert.throws(()=>hydrateFootprints(base,badRef),/Invalid canonical territory geometry reference/);
const badMissing=JSON.parse(JSON.stringify(one));
delete badMissing.features[0].properties.geometry_ref;
assert.throws(()=>hydrateFootprints(base,badMissing),/lacks geometry/);
const badInline=JSON.parse(JSON.stringify(one));
badInline.features[0].geometry=base.features[0].geometry;
assert.throws(()=>hydrateFootprints(base,badInline),/Invalid canonical territory geometry reference/);
const badSource=JSON.parse(JSON.stringify(one));
badSource.metadata.geometry_reference_file='data/not-original.geojson';
assert.throws(()=>hydrateFootprints(base,badSource),/Invalid canonical territory geometry reference/);
const duplicate=JSON.parse(JSON.stringify(one));
duplicate.features[1].id=duplicate.features[0].id;
assert.throws(()=>hydrateFootprints(base,duplicate),/Duplicate or missing/);
const foreign=JSON.parse(JSON.stringify(one));
foreign.features[0].id='foreign-feature';
foreign.features[0].properties.geometry_ref='foreign-feature';
assert.throws(()=>hydrateFootprints(base,foreign),/Unknown canonical/);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(html,/src="js\/territory-geometry\.js\?v=shared-geo-v1"/);
assert.ok(html.indexOf('src="js/territory-geometry.js')<html.indexOf('src="app.js'));
assert.ok(app.includes('const canonicalTerritory={type:\'FeatureCollection\',features:territorialFootprints.features.slice()}'));
for(const fragment of ['newFootprints','newGeo8','g9','g10','g11'])
 assert.ok(app.includes('hydrateTerritoryPeriod('+fragment+').features'),fragment+' fails to hydrate');
assert.ok(totalRemoved>200000,'Should remove 5 x ~48KB duplicated coordinates');
console.log('PASS shared historical geometry: 7 canonical GIS features, 5 periods, valid references, original per-year states; removed ~'+Math.round(totalRemoved/1024)+'KiB duplicated source');
