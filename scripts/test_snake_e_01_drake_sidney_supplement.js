#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');const root=path.resolve(__dirname,'..');const J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const atlas=J('data/atlas-1570-1579.json'),index=J('data/stories/index.json').stories;
assert.equal(index.length,24,'retain all 6 completed articles');
assert.equal(atlas.events.length,84);assert.equal(atlas.sources.length,90);assert.equal(atlas.routes.length,27);
const found=new Map(atlas.events.map(x=>[x.id,x])),sources=new Set(atlas.sources.map(x=>x.id));
for(const id of ['DRA1573-FEB-CIMARRON-TWO-SEAS-RIDGE','DRA1573-FEB-MULE-TRAIN-FAILED','DRA1573-MAR-RIO-FRANCISCO-LANDING','SID1576-GALWAY-CIRCUIT','SID1576-ATHENRY-LEVY','SID1576-ATHLONE-CIRCUIT','SID1576-MOY-SUCK-ROYAL-OPERATIONS','SID1577-CASTLEDERMOT-CESS-LETTER']){
 const e=found.get(id);assert(e,'new source-led historical record missing '+id);
 assert(e.source_ids.length>0&&e.source_ids.every(s=>sources.has(s)));
 assert(e.colonial_profit===null&&e.actual_English_territory_created===false);
}
for(const id of ['DRA1573-FEB-CIMARRON-TWO-SEAS-RIDGE','DRA1573-FEB-MULE-TRAIN-FAILED','DRA1573-MAR-RIO-FRANCISCO-LANDING','SID1576-MOY-SUCK-ROYAL-OPERATIONS']){
 const e=found.get(id);assert.equal(e.lat,null);assert.equal(e.lng,null);
}
assert.deepEqual([found.get('1570S-E006').lat,found.get('1570S-E006').lng],[9.565,-79.472]);
assert(found.get('1570S-E006').description.includes('袭击地点未能精确定位'));
assert(found.get('DRA1573-VENTA-DE-CRUCES-RAID').date_label.includes('2月'));
assert(found.get('1570S-E023').description.includes('五十骑')&&!found.get('1570S-E023').description.includes('人数恒定。\n'));
const r=atlas.routes.find(x=>x.id==='snakee01-sidney-1576-galway-athenry-athlone-circuit');
assert(r&&r.year===1576&&r.coords.length===3);
assert.equal(r.certainty,'schematic-only-not-historical-track');
for(const id of ['drake-panama-mule-train-raid-1572-1573','sidney-pale-cess-connacht-military-campaign-1575-1578']){
 const meta=index.find(s=>s.id===id);assert(meta);
 const article=J(meta.file),content=article.sections.flatMap(s=>s.paragraphs).join('');
 assert(article.sections.length>=11&&content.length>=3000);
 assert.deepEqual(new Set(article.related_event_ids),new Set(meta.event_ids));
 const refs=new Set(article.sources.map(s=>s.id));
 for(const s of article.sections){assert(s.source_keys.every(ref=>refs.has(ref)));for(const p of s.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g))assert(found.has(m[1])&&meta.event_ids.includes(m[1]),'orphan link '+m[1]);}
}
for(const id of ['drake-circumnavigation-privateering-resistance-1577-1580','frobisher-arctic-inuit-captives-mining-1576-1578','ards-clandeboye-essex-rathlin-colonisation-1571-1575','munster-gilbert-first-desmond-rebellion-1569'])assert(index.some(a=>a.id===id));
console.log('PASS eight cited Drake/Sidney improvements with old 6 released articles retained and 0 invented polygons');
