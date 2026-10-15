#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'));
const study=read('followup-regional-stories-1562-1596.geojson');
assert.equal(study.features.length,11);
const byId=new Map(study.features.map(f=>[f.id,f]));
const registry=new Map();
for(const span of ['1497-1509','1510-1519','1520-1529','1530-1539','1540-1549','1550-1559','1560-1569','1570-1579','1580-1589','1590-1599']){
 const ch=read('atlas-'+span+'.json');
 for(const s of ch.sources)registry.set(s.id,s);
}
const checks=[
 ['english-hold-le-havre-1562-city-reference',1562,'occupation_violet',['1560S-E007']],
 ['french-recovery-le-havre-1563-city-reference',1563,'restoration_blue',['1560S-E009']],
 ['drake-panama-mule-train-1573-study',1573,'raid_red',['1570S-E006']],
 ['cadiz-anglo-dutch-sack-1596-city-reference',1596,'raid_red',['1590S-E022']],
 ['drake-cadiz-bay-1587-naval-attack-schematic',1587,'raid_red',['1580S-E024']],
 ['drake-norreys-vigo-sack-1589-schematic',1589,'raid_red',['1580S-E028']],
 ['roanoke-aquascogoc-1585-burning-schematic',1585,'raid_red',['1580S-E015']],
 ['roanoke-wingina-killed-1586-schematic',1586,'raid_red',['1580S-E022']],
 ['roanoke-croatoan-friendly-fire-1587-schematic',1587,'raid_red',['1580S-E023']],
 ['coruna-pescaderia-english-attack-1589-schematic',1589,'raid_red',['1580S-E026']],
 ['breifne-bingham-1590-war-and-displacement-schematic',1590,'raid_red',['1590S-E002']]
];
for(const [id,year,role,events] of checks){
 const f=byId.get(id);assert.ok(f,id);const p=f.properties;
 assert.equal(f.geometry.type,'Polygon');assert.equal(p.start_year,year);assert.equal(p.end_year,year);
 assert.equal(p.color_role,role);assert.ok(p.summary_zh.length>120);assert.equal(p.area_sqkm,null);
 for(const k of ['historical_boundary_confirmed','fill_authorized','territorial_claim'])assert.equal(p[k],false);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.ok(Array.isArray(p.source_urls)&&p.source_urls.length>=2);
 assert.ok(p.source_urls.every(u=>/^https:\/\/[^ ]+$/.test(u)));
 assert.ok(p.source_ids.every(id=>registry.has(id)),id+' unknown source');
 assert.ok(events.every(id=>p.related_event_ids.includes(id)),id+' missing source event');
 const ring=f.geometry.coordinates[0];assert.ok(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1));
 for(const [lon,lat] of ring)assert.ok(Number.isFinite(lon)&&Math.abs(lon)<=180&&Number.isFinite(lat)&&Math.abs(lat)<=90);
}
for(const [year,expected] of [
 [1561,[]],[1562,[checks[0][0]]],[1563,[checks[1][0]]],[1564,[]],
 [1572,[]],[1573,[checks[2][0]]],[1574,[]],[1584,[]],
 [1585,[checks[6][0]]],[1586,[checks[7][0]]],
 [1587,[checks[4][0],checks[8][0]]],[1588,[]],
 [1589,[checks[5][0],checks[9][0]]],[1590,[checks[10][0]]],
 [1591,[]],[1595,[]],[1596,[checks[3][0]]],[1597,[]]]){
 assert.deepEqual(study.features.filter(f=>f.properties.start_year<=year&&year<=f.properties.end_year).map(f=>f.id).sort(),expected.sort(),
                  'Time gate error in '+year);
}

const ch1544=read('atlas-1540-1549.json').events.find(e=>e.id==='1540S-008');
assert.equal(ch1544.geo_precision,'unlocated_event_list_only');
assert.equal(ch1544.lat,null);
assert.equal(ch1544.lng,null);
assert.ok(read('early-war-colonial-impact-1544-1575.geojson').features.some(f=>f.id==='rough-wooing-leith-edinburgh-raid-1544'&&f.properties.related_event_ids.includes('1540S-008')));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
for(const token of ['followupRegionalAreas','activeRegionalFeatures()','renderHistoricalRegionGuide()',
                    "data/followup-regional-stories-1562-1596.geojson"])assert.ok(app.includes(token),token);
console.log('PASS: 11 independently sourced regions incl 1585–1587 Roanoke, 1589 Coruna, 1590 Breifne; 1562 Le Havre English garrison, 1563 French reoccupation, 1573 bullion raid, 1587 Cadiz naval raid, 1589 Vigo sack, 1596 joint Cadiz sack; sources/periods/non-sovereign metadata');
