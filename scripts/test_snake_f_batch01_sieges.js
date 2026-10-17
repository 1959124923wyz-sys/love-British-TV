#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const ir=read('data/atlas-1550-1559.json'),en=read('data/atlas-1560-1569.json');
const sid='IR1558-MARYBOROUGH-OMORE-SIEGE',bid='ENG1569-BARNARD-CASTLE-REBEL-SIEGE';
assert.equal(ir.events.filter(e=>e.id===sid).length,1);
assert.equal(en.events.filter(e=>e.id===bid).length,1);
const siege=ir.events.find(e=>e.id===sid),north=en.events.find(e=>e.id===bid);
const prior=ir.events.find(e=>e.id==='1550S-E013');
assert(prior && prior.year===1556);
assert.equal(siege.year,1558);
assert.equal(siege.lat,prior.lat);assert.equal(siege.lng,prior.lng);
assert(siege.description.includes('奥莫尔')&&siege.description.includes('科斯比'));
assert.equal(north.year,1569);assert(north.description.includes('起义军围攻'));
assert(north.description.includes('王室守军')&&north.description.includes('投降'));
assert(Math.abs(north.lat-54.542910)<0.000002&&Math.abs(north.lng+1.925619)<0.000002);
const references=[
 [ir,siege,['IR-DIB-COSBY-MARYBOROUGH-SIEGE-1558','IE-LAOIS-COUNTY-DEVELOPMENT-FORT']],
 [en,north,['EN-ENGLISH-HERITAGE-BARNARD-SIEGE-1569','EN-HISTENG-BARNARD-CASTLE-SCHEDULED-NGR']]
];
for(const [db,e,refs] of references){
 assert.deepEqual(e.source_ids,refs);
 const all=new Map(db.sources.map(x=>[x.id,x]));
 assert(refs.every(x=>all.has(x)),e.id+' source unresolved');
 for(const ref of refs)assert(all.get(ref).url.startsWith('https://'));
 assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.colonial_profit,null);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert.equal(e.icon_code,'RES');
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
}
assert.equal(ir.colonial_polygons.length,0);assert.equal(en.colonial_polygons.length,0);
const idx=read('data/stories/index.json').stories;
const meta=idx.find(x=>x.id==='laois-offaly-crown-plantation-martial-law-1547-1566');
const story=read(meta.file);
assert(meta.event_ids.includes(sid)&&story.related_event_ids.includes(sid));
assert(story.sections.some(s=>s.paragraphs.join('').includes('[['+sid+'|')));
assert.equal(idx.filter(s=>s.event_ids.includes(bid)).length,1,'Barnard Castle siege belongs to the now-published Northern Rising story');
console.log('PASS historical phase-1: June 1558 Maryborough royal fort counterattack and December 1569 Barnard Castle rebel siege; original events and 0 invented borders retained');
