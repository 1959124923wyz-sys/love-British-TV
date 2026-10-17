#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=get('data/atlas-1580-1589.json'),b=get('data/atlas-1590-1599.json'),all=new Map([...a.events,...b.events].map(e=>[e.id,e]));
const index=get('data/stories/index.json').stories,id='spanish-armada-invasion-channel-battles-and-war-1585-1599',meta=index.find(s=>s.id===id);
assert(meta&&meta.status==='published','Armada article missing');
const st=get(meta.file),body=st.sections.flatMap(s=>s.paragraphs).join('');
assert(st.id===id&&st.sections.length===15&&body.length>=3700);
assert(st.sources.length>=16&&st.sources.every(s=>/^https:\/\/[^/]+\//.test(s.url)&&s.access));
assert.deepEqual(new Set(meta.event_ids),new Set(st.related_event_ids));
const new80=['ARM1585-NONSUCH-TREATY','ARM1588-LISBON-MUSTER','ARM1588-LIZARD-SIGHTING','ARM1588-PLYMOUTH-BATTLE','ARM1588-ROSARIO-CAPTURE','ARM1588-PORTLAND-ENGAGEMENT','ARM1588-WIGHT-ENGAGEMENT','ARM1588-CALAIS-ANCHORAGE','ARM1588-FIRESHIPS-CALAIS','ARM1588-GRAVELINES','ARM1588-NORTHABOUT-RETREAT','ARM1588-TILBURY-REVIEW','ARM1589-LISBON-FAILED'];
const new90=['ARM1595-CORNWALL-SPANISH-RAID','ARM1596-SPANISH-EXPEDITION-STORM','ARM1597-SPANISH-EXPEDITION-STORM'];
const reuse=['1580S-E024','ARM1588-STREEDAGH-STORM','ARM1588-STREEDAGH-SHORE-KILLING','ARM1588-ROSCLOGHER-REFUGE','ARM1588-CLARE-SPANISHPOINT-EXECUTIONS','GAP1588-SLIGO-ARMADA-EXECUTIONS','1580S-E026','1580S-E028','1590S-E022','GAP1597-FAIAL'];
assert.deepEqual(new Set(meta.event_ids),new Set([...new80,...new90,...reuse]));
assert.equal(new80.filter(x=>a.events.some(e=>e.id===x)).length,13);
assert.equal(new90.filter(x=>b.events.some(e=>e.id===x)).length,3);
const keys=new Set(st.sources.map(s=>s.id));
assert(st.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.length>=1&&s.source_keys.every(k=>keys.has(k))));
const links=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);assert(links.length>=24&&links.every(x=>all.has(x)&&meta.event_ids.includes(x)));
for(const id of [...new80,...new90]){const e=all.get(id);assert(e);assert(e.source_ids.length&&e.source_ids.every(k=>(e.year<1590?a.sources:b.sources).some(s=>s.id===k)));
assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.actual_English_territory_created,false);assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);assert(e.geo_precision.length>22);}
for(const id of ['ARM1588-ROSARIO-CAPTURE','ARM1588-WIGHT-ENGAGEMENT','ARM1588-NORTHABOUT-RETREAT','ARM1596-SPANISH-EXPEDITION-STORM']){assert.equal(all.get(id).lat,null);assert.equal(all.get(id).lng,null)}
const lizard=all.get('ARM1588-LIZARD-SIGHTING'),calais=all.get('ARM1588-FIRESHIPS-CALAIS'),gravelines=all.get('ARM1588-GRAVELINES');
assert(Math.abs(lizard.lat-49.95889)<.0001&&Math.abs(lizard.lng+5.20638)<.0001);
assert.equal(calais.lng,1.8587,'Calais must be on French coastline, never minus longitude');
assert.equal(calais.lat,50.9513);
assert(gravelines.date_label.includes('公历8月8日')&&calais.date_label.includes('公历8月7日'));
assert(body.includes('10天')||body.includes('十天'));
assert(body.includes('火船')&&body.includes('格拉沃利讷')&&body.includes('英国海军')&&body.includes('西班牙'));
assert(a.colonial_polygons.length===0&&b.colonial_polygons.length===0);
for(const shared of ['ARM1588-STREEDAGH-STORM','ARM1588-STREEDAGH-SHORE-KILLING','ARM1588-ROSCLOGHER-REFUGE','GAP1588-SLIGO-ARMADA-EXECUTIONS']){
 const owners=index.filter(m=>m.event_ids.includes(shared)).map(m=>m.id);
 assert.deepEqual(owners,['bingham-connacht-military-exactions-1586-1591',id],'Shared 1588 survivor event MUST show both history entrances');
}
const ui=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(ui.includes('storyByEvent.get(item.id)||[]')&&ui.includes('choices=metas.map')&&ui.includes('storyByEvent.set(id,choices)'),'Multiple entry cards required');
console.log('PASS Armada epic: 15 sections, 16 new independently sourced map-year events, 10 existing reused without duplication, 4 overlapping Ireland episodes shown with two history links, no fabricated 1588 route or sovereignty');
