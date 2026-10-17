#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const base=get('data/atlas-1530-1539.json'),a=get('data/atlas-1540-1549.json'),b=get('data/atlas-1560-1569.json');
const aske=base.events.find(e=>e.id==='ENG1537-ASKE-YORK-CASTLE-EXECUTION');
assert(aske&&aske.year===1537&&base.events.filter(e=>/ASKE/.test(e.id)).length===1,'Keep parallel editor\'s single source-reviewed Aske site');
const cases=[
 [a,'DOM1547-VAGABONDS-ACT-FORCED-LABOUR',1547,107,145],
 [b,'DOM1569-NORTHERN-RISING-DURHAM',1569,48,47]
];
for(const [db,id,year,total,sourceN] of cases){
 assert.equal(db.events.length,total);assert.equal(db.sources.length,sourceN);
 assert.equal(db.colonial_polygons.length,0);
 const e=db.events.find(x=>x.id===id),src=new Set(db.sources.map(s=>s.id));
 assert(e&&e.year===year&&e.source_ids.length===2&&e.source_ids.every(id=>src.has(id)),id);
 assert.equal(db.events.filter(x=>x.id===id).length,1);
 assert.equal(e.actual_English_territory_created,false);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.colonial_profit,null);
}
const law=cases[0][0].events.find(e=>e.id===cases[0][1]);
assert.equal(law.lat,null);assert.equal(law.lng,null);assert.equal(law.position_type,'chronology_only_not_map_point');
assert(law.description.includes('两年')&&law.description.includes('规定')&&!law.description.includes('实际上'));
const rising=cases[1][0].events.find(e=>e.id===cases[1][1]);
assert.equal(rising.icon_code,'RES');assert.equal(rising.year,1569);
assert(Math.abs(rising.lat-54.773474)<0.00001&&Math.abs(rising.lng+1.576217)<0.00001);
console.log('PASS: Aske single existing marker, 1547 law as unlocated statute, 1569 rebel religious gathering at Historic England cathedral modern site');
