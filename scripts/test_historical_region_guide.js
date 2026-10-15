#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'data/early-war-colonial-impact-1544-1575.geojson'),'utf8'));
const all=new Map();
for(const period of ['1497-1509','1510-1519','1520-1529','1530-1539','1540-1549','1550-1559','1560-1569','1570-1579','1580-1589','1590-1599']){
 const j=JSON.parse(fs.readFileSync(path.join(root,'data/atlas-'+period+'.json'),'utf8'));
 for(const s of j.sources)all.set(s.id,s);
}
assert.equal(data.type,'FeatureCollection');
assert.equal(data.features.length,4);
const pairs=[
 ['rough-wooing-leith-edinburgh-raid-1544',1544,1544],
 ['leix-offaly-crown-plantation-1556-1569',1556,1569],
 ['essex-clandeboye-ulster-1573-1575',1573,1575],
 ['rathlin-island-crown-massacre-1575',1575,1575]
];
for(const [id,start,end] of pairs){
 const f=data.features.find(x=>x.id===id);assert.ok(f,id);
 const p=f.properties;
 assert.equal(f.geometry.type,'Polygon');assert.equal(p.start_year,start);assert.equal(p.end_year,end);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);
 assert.equal(p.exclude_from_area_aggregation,true);assert.equal(p.area_sqkm,null);
 assert.ok(p.summary_zh.length>80,'Readable source-based history required');
 assert.ok(p.source_urls.length>=2&&p.source_urls.every(u=>/^https:\/\//.test(u)));
 for(const s of p.source_ids)assert.ok(all.has(s),'Unknown atlas source '+s);
 const ring=f.geometry.coordinates[0];assert.ok(ring.length>=4&&JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)));
 for(const [lon,lat] of ring)assert.ok(Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90);
}
for(const year of [1544,1556,1568,1573,1574,1575,1576,1580]){
 const active=data.features.filter(f=>year>=f.properties.start_year&&year<=f.properties.end_year).map(f=>f.id);
 if(year===1544)assert.deepEqual(active,[pairs[0][0]]);
 if(year===1556||year===1568)assert.deepEqual(active,[pairs[1][0]]);
 if(year===1574)assert.deepEqual(active,[pairs[2][0]]);
 if(year===1575)assert.deepEqual(active,[pairs[2][0],pairs[3][0]]);
 if(year===1576||year===1580)assert.deepEqual(active,[]);
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert.ok(app.includes('renderHistoricalRegionGuide()'));
assert.ok(app.includes('renderEarlyRegionalImpactAreas()'));
assert.ok(app.includes("openMapTerritoryAt(latlng)"));
assert.ok(app.includes("data/early-war-colonial-impact-1544-1575.geojson"));
console.log('PASS 4 source-backed illustrative early war/plantation areas + year gating + visible region dossiers');
