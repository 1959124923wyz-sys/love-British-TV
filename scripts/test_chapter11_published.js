#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const txt=p=>fs.readFileSync(path.join(root,p),'utf8');
const now=read('data/atlas-1590-1599.json'),last=read('data/atlas-1580-1589.json'),catalog=read('data/chapters.json');
const core=read('data/eleventh-control-cores-1590-1599.geojson'),area=read('data/eleventh-influence-areas-1590-1599.geojson');
const plan=read('data/chapter11-year-end-render-plan.json'),geo=read('data/territorial-footprints-1590-1599.geojson');
const rel=read('data/political-relations-1590-1599.geojson'),city=read('data/french-urban-control-1590-1599.geojson');
const notes=read('data/chapter11-detail-notes.json'),ledger=read('data/chapter11-economic-violence-ledger.json');
const app=txt('app.js'),html=txt('index.html');new vm.Script(app);
assert.deepEqual(now.period,{from:1590,to:1599,next:1600});
assert.equal(catalog.chapters.length,10);
assert.ok(catalog.chapters.some(c=>c.number===10&&c.status==='published'&&c.start===1590&&c.end===1599));
assert.equal(now.events.length,36);assert.equal(now.sources.length,70);assert.equal(now.places.length,31);
assert.equal(now.routes.length,0);assert.equal(now.colonial_polygons.length,0);
assert.equal(last.events.length,30);
assert.equal(Object.keys(notes.records).length,36);assert.equal(ledger.records.length,32);
const sources=new Set(now.sources.map(s=>s.id));
const icons=new Set(read('data/icon-categories.json').categories.map(c=>c.code));
let unlocated=0;const ids=new Set();
for(const e of now.events){
 assert.ok(!ids.has(e.id),e.id+' duplicate');ids.add(e.id);
 assert.ok(e.year>=1590&&e.year<=1599,e.id+' year');
 assert.ok(e.date_label.startsWith(e.year+'年'),e.id+' date');
 assert.ok(icons.has(e.icon_code),e.id+' icon');
 assert.ok(e.source_ids?.length&&e.source_ids.every(id=>sources.has(id)),e.id+' provenance');
 assert.equal(e.colonial_profit,null,e.id+' fabricated royal profit');
 if(e.lat==null){unlocated++;assert.equal(e.lng,null,e.id+' geographic invention')}
 else assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180,e.id+' invalid GIS');
}
assert.equal(unlocated,20);
for(const id of ['calais-crown','guines-crown-1520s','dublin-pale','channel-jersey','channel-guernsey','isle-of-man','orkney-scotland','shetland-scotland','kingdom-of-scotland']){
 const old=last.places.find(p=>p.id===id),x=now.places.find(p=>p.id===id);
 assert.ok(old&&x,id+' polity lost');assert.equal(x.start_year,old.start_year);
 assert.equal(x.observed_through_year,1599);
}
assert.equal(now.places.filter(x=>x.render_as_event_only).length,12);
assert.equal(now.places.filter(x=>x.render_as_control_core_only).length,10);
assert.equal(core.features.length,10);assert.equal(area.features.length,2);
assert.equal(plan.year_end_slices.length,10);
assert.ok(core.features.every(f=>f.geometry.type==='Point'&&f.properties.fill_authorized===false&&f.properties.area_sqkm===null));
assert.ok(area.features.every(f=>f.geometry.type==='Polygon'&&f.properties.fill_authorized===false&&f.properties.area_sqkm===null&&f.properties.historical_boundary_confirmed===false));
assert.ok(area.features.every(f=>f.properties.source_ids.every(id=>sources.has(id))));
assert.deepEqual(geo.features.map(f=>f.geometry),read('data/territorial-footprints-1580-1589.geojson').features.map(f=>f.geometry));
assert.equal(rel.features.length,6);assert.equal(city.features.length,2);assert.equal(geo.features.length,7);
assert.ok(city.features.every(f=>f.properties.controller_periods?.length===1
 &&f.properties.controller_periods[0].controller_group==='french_crown'
 &&f.properties.controller_periods[0].start_year<=1590
 &&f.properties.controller_periods[0].end_year>=1599
 &&f.properties.polity==='Kingdom of France'),'Calais and Guines must remain French throughout this chapter');
for(const [y,n] of Object.entries({1590:3,1591:4,1592:3,1594:5,1595:3,1598:2,1599:2})){
 const listed=plan.year_end_slices.find(s=>s.year_end===Number(y));
 const active=core.features.filter(f=>f.properties.year_end_visible.includes(Number(y))).map(f=>f.id).sort();
 assert.equal(active.length,n,y+' count');
 assert.deepEqual(active,listed.active_historical_city_core_symbols.slice().sort(),y+' year-end');
}
assert.ok(!core.features.find(f=>f.id==='san-juan-1598').properties.year_end_visible.includes(1598));
assert.ok(!core.features.find(f=>f.id==='recife-1595').properties.year_end_visible.includes(1595));
assert.ok(!core.features.find(f=>f.id==='blackwater-fort-1598').properties.year_end_visible.includes(1598));
assert.ok(app.includes('atlasEleventh=await eleventhRes.json()')&&app.includes('renderEleventhControlCores()')&&app.includes('renderEleventhInfluenceAreas()'));
assert.ok(app.includes('p.year_end_visible?.includes(year)'),'published annual precomputed status skipped');
assert.ok(app.includes('const nearby=[],cells=new Map(),cellSize=32'),'map point spatial index regressed');
assert.ok(app.includes("className:'atlas-voyage-continuity'"),'route continuity underlay absent');
assert.ok(html.includes('max="1599"')&&html.includes('1497—1599'));
console.log('PASS ch11: 36 events, 70 sources, 31 places, 20 unmapped, 10 sites, 2 dashed areas, zero fabricated boundaries');
