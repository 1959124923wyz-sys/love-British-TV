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
assert.equal(data.features.length,6);
const pairs=[
 ['rough-wooing-leith-edinburgh-raid-1544',1544,1544],
 ['leix-offaly-crown-plantation-1556-1569',1556,null],
 ['essex-clandeboye-ulster-1573-1575',1573,1575],
 ['rathlin-island-crown-massacre-1575',1575,1575],
 ['smith-ards-colonial-military-1572-1575',1572,1575],
 ['drake-nombre-de-dios-attack-1572',1572,1572]
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
const periods=new Map([
 [1544,['rough-wooing-leith-edinburgh-raid-1544']],
 [1556,['leix-offaly-crown-plantation-1556-1569']],
 [1568,['leix-offaly-crown-plantation-1556-1569']],
 [1570,['leix-offaly-crown-plantation-1556-1569']],
 [1599,['leix-offaly-crown-plantation-1556-1569']],
 [1572,['smith-ards-colonial-military-1572-1575','drake-nombre-de-dios-attack-1572','leix-offaly-crown-plantation-1556-1569']],
 [1573,['essex-clandeboye-ulster-1573-1575','smith-ards-colonial-military-1572-1575','leix-offaly-crown-plantation-1556-1569']],
 [1574,['essex-clandeboye-ulster-1573-1575','smith-ards-colonial-military-1572-1575','leix-offaly-crown-plantation-1556-1569']],
 [1575,['essex-clandeboye-ulster-1573-1575','rathlin-island-crown-massacre-1575','smith-ards-colonial-military-1572-1575','leix-offaly-crown-plantation-1556-1569']],
 [1576,['leix-offaly-crown-plantation-1556-1569']],[1580,['leix-offaly-crown-plantation-1556-1569']]
]);
for(const [year,expected] of periods){
 const actual=data.features.filter(f=>year>=f.properties.start_year&&year<=(f.properties.display_through_year??f.properties.end_year??year)).map(f=>f.id);
 assert.deepEqual(actual.sort(),expected.sort(),'Incorrect year '+year);
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert.ok(app.includes('renderHistoricalRegionGuide()'));
assert.ok(app.includes('renderEarlyRegionalImpactAreas()'));
assert.ok(app.includes("openMapTerritoryAt(latlng)"));
assert.ok(app.includes("data/early-war-colonial-impact-1544-1575.geojson"));
const colonial=data.features.find(f=>f.id==='leix-offaly-crown-plantation-1556-1569').properties;
assert.equal(colonial.ongoing_at_atlas_end,true);
assert.equal(colonial.display_through_year,1599);
const edin=data.features.find(f=>f.id==='rough-wooing-leith-edinburgh-raid-1544');
assert.ok(edin.properties.related_event_ids.includes('1540S-008'));
assert.match(app,/function regionalFeatureKind\(/);
assert.ok(app.includes("if(p.color_role==='plantation_ochre')return 'land-dispossession'"));
console.log('PASS 6 early study areas, ongoing colonial legacy, proper classification and Leith city link');
