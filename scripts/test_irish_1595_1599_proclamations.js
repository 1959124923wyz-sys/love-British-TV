#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const db=get('data/atlas-1590-1599.json'),src='IR-STATUTEBOOK-REVISION-2015-TUDOR-PROCLAMATIONS-1595-1599';
const item=db.sources.find(x=>x.id===src);
assert(item&&item.publisher.includes('Attorney General')&&item.url==='https://www.irishstatutebook.ie/eli/2015/act/23/schedule/2/enacted/en/html');
assert(item.evidence_read_level.includes('not full Tudor instruments'));
const cases=[
 ['IR1595-ROYAL-SEIZE-TRAITOR-CHATTELS',1595,'Steele',2],
 ['IR1595-ROYAL-POWDER-TRADE-RESTRICTION',1595,'火药',2],
 ['IR1595-ROYAL-CORN-CARRIAGE-BAN',1595,'谷物',2],
 ['IR1596-ROYAL-PROHIBIT-SOLDIER-EXTORTION',1596,'敲诈',2],
 ['IR1599-ELIZABETH-REVOKES-ESSEX-KNIGHTHOODS',1599,'38',2]
];
for(const[id,year,term]of cases){
 assert.equal(db.events.filter(x=>x.id===id).length,1,'Missing or duplicate '+id);
 const x=db.events.find(x=>x.id===id);
 assert.equal(x.year,year);assert(x.description.includes(term),id+' imprecise content');
 assert.deepEqual(x.source_ids,[src]);
 assert.equal(x.lat,null);assert.equal(x.lng,null);
 assert(x.geo_precision.startsWith('unlocated_'));assert.equal(x.map_priority,false);
 assert.equal(x.actual_English_territory_created,false);assert.equal(x.actual_English_land_area_sqkm,null);
 assert.equal(x.colonial_profit,null);assert.equal(x.historical_control_boundary_verified,false);
}
const essex=db.events.find(x=>x.id==='1590S-E032');
assert(essex&&essex.source_ids.includes(src)&&essex.description.includes('1599年3月31日'));
assert(db.events.length===68&&db.sources.length===104);
assert.equal(db.colonial_polygons.length,0);
assert(!db.events.some(e=>e.id.startsWith('IR159')&&e.lat!==null));
console.log('PASS Ireland proclamations: 1595 chattels/powder/corn, 1596 anti-extortion, 1599 Essex knighthoods, 1599 army order linked to existing event; official index ≠ verified enforcement');
