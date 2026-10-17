#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=get('data/atlas-1560-1569.json'),b=get('data/atlas-1570-1579.json'),idx=get('data/stories/index.json').stories;
const id='northern-earls-rebellion-martial-law-forfeitures-1569-1571',m=idx.find(x=>x.id===id);
assert(m&&m.status==='published'&&idx.length>=32);
const story=get(m.file),all=[...a.events,...b.events],map=new Map(all.map(x=>[x.id,x]));
assert.equal(story.id,id);assert.equal(story.sections.length,10);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=3500);
assert.equal(story.sources.length,9);
assert.deepEqual(new Set(m.event_ids),new Set(story.related_event_ids));
assert.equal(m.event_ids.length,10);
const keys=new Set(story.sources.map(x=>x.id));
for(const s of story.sections){
 assert(s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k)));
}
const content=story.sections.flatMap(x=>x.paragraphs).join('');
const links=[...content.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);
assert(links.length>=10);assert(links.every(x=>m.event_ids.includes(x)&&map.has(x)));
assert(content.includes('拟处决')&&content.includes('不能将305人写作已经死亡'));
for(const k of m.event_ids){
 const e=map.get(k);assert(e&&e.source_ids.every(id=>(e.year<1570?a.sources:b.sources).some(x=>x.id===id)));
}
const new1569=a.events.filter(e=>e.id.startsWith('NR1569-'));
const new1570=b.events.filter(e=>e.id.startsWith('NR1570-')||e.id.startsWith('NR1571-'));
assert.equal(new1569.length,3);assert.equal(new1570.length,5);
for(const e of new1569.concat(new1570)){
 assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
}
assert.equal(new1569.filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng)).length,2);
assert.equal(new1570.filter(e=>e.lat===null&&e.lng===null).length,5);
assert.equal(map.get('NR1570-DURHAM-MARTIAL-LAW-305-PLANNED').lat,null);
assert(map.get('NR1570-DURHAM-MARTIAL-LAW-305-PLANNED').description.includes('拟处决'));
assert(map.get('NR1570-DARLINGTON-CONSTABLE-EXECUTIONS').description.includes('已处决'));
assert(map.get('NR1570-RICHMOND-MARSHAL-COURT').description.includes('1570年1月9'));
assert.equal(a.colonial_polygons.length,0);assert.equal(b.colonial_polygons.length,0);
assert(!Object.keys(get('data/atlas-1570-1579.json')).includes('invented_territorial_boundary'));
console.log('PASS Northern Rising 1569–71: full 10-section narrative, 10 atlas entries, Bowes planned-vs-executed distinction, 2 verified modern castle anchors, no forged control polygons');
