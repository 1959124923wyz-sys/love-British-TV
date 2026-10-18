#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('data/atlas-1590-1599.json'),idx=read('data/stories/index.json').stories;
const id='bristol-charles-african-captives-prize-1590',m=idx.find(x=>x.id===id);
assert(m&&m.status==='published'&&idx.length===39);
const story=read(m.file),body=story.sections.flatMap(x=>x.paragraphs).join('');
assert.equal(story.sections.length,9);assert(body.length>=3200);assert.equal(story.sources.length,6);
assert(story.sources.every(x=>x.url.startsWith('https://')&&x.access));
const keys=new Set(story.sources.map(s=>s.id));
assert(story.sections.every(s=>s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k))));
const eventIds=['BRI1590-CHARLES-PRIZE-AT-SEA','BRI1590-BRISTOL-135-AFRICANS-ARRIVAL','BRI1590-BRISTOL-135-AFRICANS-BARN','BRI1590-AFRICANS-SENT-SPAIN','BRI1590-MAYOR-302-POUNDS-CLAIM'];
assert.deepEqual(m.event_ids,eventIds);assert.deepEqual(story.related_event_ids,eventIds);
const links=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);assert.deepEqual(links,eventIds);
const events=new Map(a.events.map(x=>[x.id,x])),sources=new Set(a.sources.map(s=>s.id));
assert.equal(a.events.length,67);assert.equal(a.sources.length,102);
assert.equal(a.colonial_polygons.length,0);assert.equal(a.routes.length,4);
for(const eid of eventIds){
 const e=events.get(eid);assert(e&&e.year===1590&&e.source_ids.length>=3);
 assert(e.source_ids.every(s=>sources.has(s)),eid+' unresolved primary citation');
 assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.actual_English_territory_created,false);assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert.equal(e.position_is_historical_survey,false);
}
for(const eid of [eventIds[0],eventIds[3]]){
 assert.equal(events.get(eid).lat,null);assert.equal(events.get(eid).lng,null);
 assert(events.get(eid).geo_precision.startsWith('unlocated_'));
}
for(const eid of [eventIds[1],eventIds[2],eventIds[4]]){
 const e=events.get(eid);assert.equal(e.lat,51.4545);assert.equal(e.lng,-2.5879);
 assert(e.geo_precision.includes('not_1590'));
}
const capture=events.get(eventIds[0]),arrival=events.get(eventIds[1]),held=events.get(eventIds[2]),returnTrip=events.get(eventIds[3]),reimbursement=events.get(eventIds[4]);
assert(capture.description.includes('捕获者')&&capture.description.includes('不是'));
assert(arrival.description.includes('135名非洲人')&&arrival.description.includes('32名')&&arrival.description.includes('734箱糖')&&arrival.description.includes('13大桶糖蜜'));
assert(held.description.includes('一周')&&held.description.includes('没有足够证据')&&held.description.includes('谷仓'));
assert(returnTrip.description.includes('西班牙')&&returnTrip.description.includes('不能')&&returnTrip.lat===null);
assert(reimbursement.description.includes('302英镑13先令3便士')&&reimbursement.description.includes('申请补偿')&&reimbursement.description.includes('不能推断已经拨付'));
assert(body.includes('身份')&&body.includes('不是两份')===false);
assert(body.includes('不是四份互相独立的目击证词'));
assert(body.includes('查尔斯号属于英方捕获者'));
assert(body.includes('未获得后续报销批复')||body.includes('没有后续报销批复'));
assert.equal(a.events.filter(x=>x.id.startsWith('BRI1590-')).length,5);
console.log('PASS 1590 Bristol Charles prize: 9 sections, 5 non-duplicate events, 135 and 32 historically reported persons, original Lansdowne provenance, no invented Africa legal status, no false royal reimbursement, port or privateer track');
