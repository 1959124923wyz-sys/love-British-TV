#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('data/atlas-1580-1589.json'),b=read('data/atlas-1590-1599.json'),idx=read('data/stories/index.json').stories;
assert.equal(a.events.length,76);assert.equal(a.sources.length,120);
assert.equal(b.events.length,68);assert.equal(b.sources.length,104);
const cases=[
['IR1581-SOLDIER-MEALS-RATES',1581,'munster-desmond-1579-1586','famine','定额'],
['IR1583-TOWNS-PROVISIONS-ARREARS',1583,'munster-desmond-1579-1586','famine','款项'],
['IR1588-TROOPS-PROVISIONS-WARRANT',1588,'munster-plantation-land-grants-and-aftermath-1584-1589','phase-6','授权'],
['IR1589-MUNSTER-OFFICERS-OPPRESSION-REDRESS',1589,'munster-plantation-land-grants-and-aftermath-1584-1589','phase-6','纠正'],
['IR1589-CORN-VICTUALS-RESTRAINT-DEATH-PENALTY',1589,'munster-plantation-land-grants-and-aftermath-1584-1589','phase-6','死刑'],
['IR1590-ROYAL-MARTIAL-LAW-RESTRAINT',1590,'bingham-connacht-military-exactions-1586-1591','phase-12','限制']
];
const manuscriptIndex='https://www.irishstatutebook.ie/eli/2015/act/23/schedule/2/enacted/en/html';
for(const[id,year,storyId,sectionId,term]of cases){
 const atlas=year<1590?a:b,e=atlas.events.find(x=>x.id===id);
 assert(e&&e.year===year&&e.description.includes(term),id);
 assert(e.source_ids.length>=2&&e.source_ids.every(k=>atlas.sources.some(s=>s.id===k)),id+' source');
 assert(e.source_ids.some(k=>atlas.sources.find(s=>s.id===k).url===manuscriptIndex),'Official original index');
 assert.equal(e.lat,null);assert.equal(e.lng,null);
 assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 const meta=idx.find(m=>m.id===storyId),doc=read(meta.file),sec=doc.sections.find(s=>s.id===sectionId);
 assert(meta.event_ids.includes(id)&&doc.related_event_ids.includes(id)&&sec,'linked history '+id);
 assert(sec.paragraphs.some(p=>p.includes('[['+id+'|')),'inline link '+id);
 assert(doc.sources.some(s=>s.url===manuscriptIndex),'article official source');
}
assert.equal(a.colonial_polygons.length,0);assert.equal(b.colonial_polygons.length,0);
assert.equal(a.events.filter(e=>e.id.startsWith('IR158')).length,5);
assert.equal(b.events.filter(e=>e.id==='IR1590-ROYAL-MARTIAL-LAW-RESTRAINT').length,1);
assert(a.events.find(x=>x.id==='IR1589-CORN-VICTUALS-RESTRAINT-DEATH-PENALTY').description.includes('不能被计算为已经发生'));
assert(b.events.find(x=>x.id==='IR1590-ROYAL-MARTIAL-LAW-RESTRAINT').description.includes('不能说爱尔兰各地'));
const m=idx.find(s=>s.id==='bristol-charles-african-captives-prize-1590');
assert(m&&m.event_ids.length===5,'Bristol 1590 retains five distinct events');
console.log('PASS official 1581-1590 Ireland proclamations: military meals, unpaid provisions, 1588 supplies, Munster extortion redress, 1589 grain sanction and royal restraint of martial law; 3 existing essays enriched, no unverified fiscal receipt or capital punishment');
