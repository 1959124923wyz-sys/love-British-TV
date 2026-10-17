#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const chapters=[
 ['data/atlas-1530-1539.json','DOM1537-ASKE-YORK-EXECUTION',1537,34,70],
 ['data/atlas-1540-1549.json','DOM1547-VAGABONDS-ACT-FORCED-LABOUR',1547,107,145],
 ['data/atlas-1560-1569.json','DOM1569-NORTHERN-RISING-DURHAM',1569,44,37]
];
for(const [p,id,year,total,sourcesCount] of chapters){
 const atlas=read(p),events=atlas.events,sources=new Map(atlas.sources.map(x=>[x.id,x]));
 assert.equal(events.length,total,p+' event count');assert.equal(atlas.sources.length,sourcesCount,p+' source count');
 const e=events.find(x=>x.id===id);assert(e,id);assert.equal(e.year,year);
 assert(e.source_ids.length>=2&&e.source_ids.every(k=>sources.has(k)),id+' verifiable citations');
 assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(atlas.colonial_polygons.length,0,'No invented occupation land in '+p);
 assert.equal(new Set(events.map(x=>x.id)).size,events.length,'No duplicate ID '+p);
 assert.deepEqual(e.source_ids.map(id=>sources.get(id).url).every(u=>u.startsWith('https://')),true);
}
const york=read(chapters[0][0]).events.find(x=>x.id===chapters[0][1]);
const law=read(chapters[1][0]).events.find(x=>x.id===chapters[1][1]);
const durham=read(chapters[2][0]).events.find(x=>x.id===chapters[2][1]);
assert.equal(york.geo_precision,'Historic_England_Cliffords_Tower_modern_site_NGR_not_scaffold');
assert(Math.abs(york.lat-53.955770)<0.00001&&Math.abs(york.lng+1.080078)<0.00001);
assert.equal(law.lat,null);assert.equal(law.lng,null);assert.equal(law.position_type,'chronology_only_not_map_point');
assert(law.description.includes('规定')&&!law.description.includes('万人'));
assert.equal(durham.icon_code,'RES','1569 action is rebel gathering, not royal repression');
assert(Math.abs(durham.lat-54.773474)<0.00001&&Math.abs(durham.lng+1.576217)<0.00001);
console.log('PASS 1537 Aske, 1547 Vagabonds, 1569 Rising: dates and authoritative site anchors without fabricated execution totals or control polygons');
