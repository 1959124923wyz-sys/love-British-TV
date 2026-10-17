#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const a=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/atlas-1550-1559.json'),'utf8'));
const events=new Map(a.events.map(e=>[e.id,e])),sources=new Map(a.sources.map(s=>[s.id,s]));
assert.equal(a.events.length,40);assert.equal(a.sources.length,68);
const targets=[["MR1555-HERESY-LAWS-EFFECTIVE",1555,null],["MR1555-JOHN-ROGERS-SMITHFIELD",1555,51.518237],["MR1555-OXFORD-RIDLEY-LATIMER",1555,51.753922],["MR1556-OXFORD-CRANMER",1556,51.753922]];
for(const [id,year,lat] of targets){
 const e=events.get(id);assert(e,id);
 assert.equal(e.year,year);assert.equal(e.lat,lat);
 assert.equal(e.actual_English_territory_created,false);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.historical_point_verified,false);
 assert.equal(e.colonial_profit,null);
 assert(e.source_ids.length>=2&&e.source_ids.every(s=>sources.has(s)),id+' sources missing');
 assert.equal(e.icon_code,'REP');
 if(lat!==null)assert(e.geo_precision.includes('not_'),'Location reference must not be claimed exact');
}
assert(events.get(targets[0][0]).description.includes('1555年1月20日'));
assert(events.get(targets[1][0]).description.includes('1555年2月4日'));
assert(events.get(targets[2][0]).description.includes('1555年10月16日'));
assert(events.get(targets[3][0]).description.includes('1556年3月21日'));
const ox=events.get('MR1555-OXFORD-RIDLEY-LATIMER'),cr=events.get('MR1556-OXFORD-CRANMER');
assert.equal(ox.lat,cr.lat);assert.equal(ox.lng,cr.lng);
assert.equal(a.colonial_polygons.length,0);
assert(!a.events.some(e=>/玛丽时期共有.*[0-9]+人/.test(e.description||'')));
console.log('PASS Marian 1555–56: 4 independent law/execution records, 8 authoritative sources, modern references non-exact, no fabricated controls');
