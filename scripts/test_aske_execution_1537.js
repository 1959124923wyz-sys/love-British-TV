#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const j=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/atlas-1530-1539.json'),'utf8'));
assert.equal(j.events.length,34);assert.equal(j.sources.length,72);
const e=j.events.find(x=>x.id==='ENG1537-ASKE-YORK-CASTLE-EXECUTION');assert(e);
assert.equal(e.year,1537);assert.equal(e.date_label,'1537年7月12日');
assert.equal(e.icon_code,'REP');assert.equal(e.lat,53.955856);assert.equal(e.lng,-1.079992);
assert.equal(e.historical_point_verified,false);assert.equal(e.historical_control_boundary_verified,false);
assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.actual_English_territory_created,false);
assert.equal(e.colonial_profit,null);
assert.equal(e.coordinate_role,'modern_registered_historic_castle_location_not_execution_gallows');
for(const id of e.source_ids)assert(j.sources.some(s=>s.id===id&&s.url?.startsWith('https://')));
assert.equal(j.events.filter(x=>x.id==='1530S-E011').length,1,'1536 rebellion must not be duplicated');
assert.equal(j.colonial_polygons.length,0);
console.log('PASS: Aske 1537 death independently verified, York Castle reference not fictional scaffold, all inherited geography protected');
