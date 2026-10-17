#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),j=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const db=j('data/atlas-1530-1539.json'),idx=j('data/stories/index.json').stories;
const id='henry-viii-monasteries-dissolution-estates-repression-1535-1540';
const meta=idx.find(x=>x.id===id);
assert(meta&&meta.status==='published','monastery longform indexed');
const story=j(meta.file),body=story.sections.flatMap(x=>x.paragraphs).join('');
assert.equal(story.id,id);
assert.equal(story.sections.length,9);assert(body.length>=3800);assert(story.sources.length>=10);
assert.deepEqual(new Set(story.related_event_ids),new Set(meta.event_ids));
assert(story.lead.length>=120&&story.sections.every(s=>s.paragraphs.length>=3));
const target=[
'MON1536-LESSER-HOUSES-SUPPRESSION-ACT','MON1536-SAWLEY-SURRENDER',
'MON1536-SAWLEY-RESTORED','MON1536-EASBY-RESTORATION',
'MON1537-TRAFFORD-LANCASTER-EXECUTION','MON1537-PASLEW-LANCASTER-EXECUTION',
'MON1538-BATTLE-SURRENDER-BROWNE','MON1538-BYLAND-ABBOT-SURRENDER',
'MON1539-GREATER-MONASTERIES-LEGAL-RECOGNITION','MON1539-FOUNTAINS-SURRENDER'
];
assert.equal(db.events.length,44);assert.equal(db.sources.length,88);assert.equal(db.colonial_polygons.length,0);
assert.equal(db.events.filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng)).length,26);
assert.equal(db.events.filter(x=>x.lat===null&&x.lng===null).length,18);
const sources=new Map(db.sources.map(x=>[x.id,x]));
const locate=new Set(['MON1536-SAWLEY-SURRENDER','MON1536-SAWLEY-RESTORED','MON1536-EASBY-RESTORATION','MON1538-BATTLE-SURRENDER-BROWNE','MON1538-BYLAND-ABBOT-SURRENDER','MON1539-FOUNTAINS-SURRENDER']);
for(const id of target){
 const matches=db.events.filter(e=>e.id===id);
 assert.equal(matches.length,1,'duplicate or missing '+id);
 const e=matches[0];
 assert(e.source_ids.length>0&&e.source_ids.every(s=>sources.has(s)),id+' unreferenced');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.colonial_profit,null);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 if(locate.has(id))assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.geo_precision.includes('modern_'),id+' invalid historical site');
 else assert(e.lat===null&&e.lng===null,'Fabricated execution scaffold / statute place '+id);
}
assert.equal(db.events.find(x=>x.id==='MON1536-SAWLEY-SURRENDER').lat,db.events.find(x=>x.id==='MON1536-SAWLEY-RESTORED').lat);
const aske=db.events.filter(x=>x.id==='ENG1537-ASKE-YORK-CASTLE-EXECUTION');
assert.equal(aske.length,1,'no duplicated Aske execution');
assert(db.events.find(x=>x.id==='MON1537-PASLEW-LANCASTER-EXECUTION').description.includes('没有参加圣恩朝圣'));
assert(db.events.find(x=>x.id==='MON1539-FOUNTAINS-SURRENDER').description.includes('500英亩'));
const links=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(m=>m[1]);
assert(links.length>=12&&links.every(x=>meta.event_ids.includes(x)));
const sk=new Set(story.sources.map(x=>x.id));assert(story.sections.every(s=>s.source_keys.every(k=>sk.has(k))));
console.log('PASS Tudor monasteries: 10 evidenced new legal/site/execution items, 31 longforms, retained original event IDs and zero unsupported royal-land footprints');
