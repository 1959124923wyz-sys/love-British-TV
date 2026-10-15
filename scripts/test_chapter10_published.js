#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),txt=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('data/atlas-1580-1589.json'),prior=read('data/atlas-1570-1579.json'),manifest=read('data/chapters.json');
const sites=read('data/tenth-control-sites-1580-1589.geojson'),foot=read('data/territorial-footprints-1580-1589.geojson');
const rel=read('data/political-relations-1580-1589.geojson'),city=read('data/french-urban-control-1580-1589.geojson');
const ledger=read('data/chapter10-economic-violence-ledger.json'),notes=read('data/chapter10-detail-notes.json');
const app=txt('app.js'),html=txt('index.html');new vm.Script(app);
assert.deepEqual(main.period,{from:1580,to:1589,next:1590});
assert.ok(manifest.chapters.some(c=>c.number===9&&c.status==='published'&&c.start===1580&&c.end===1589));
assert.equal(main.events.length,30);assert.equal(main.sources.length,70);assert.equal(main.places.length,25);
assert.equal(main.routes.length,6);assert.equal(main.colonial_polygons.length,0);
assert.equal(prior.events.length,41);assert.equal(prior.routes.length,18);
assert.equal(ledger.records.length,31);assert.equal(Object.keys(notes.records).length,30);
const source=new Set(main.sources.map(s=>s.id)),icons=new Set(read('data/icon-categories.json').categories.map(c=>c.code));
const ids=new Set();let unknown=0;
for(const e of main.events){
 assert.ok(e.year>=1580&&e.year<=1589,e.id);
 assert.ok(!ids.has(e.id),e.id+' duplicate');ids.add(e.id);
 assert.ok(icons.has(e.icon_code),e.id+' unapproved event symbol');
 assert.ok(e.source_ids?.length&&e.source_ids.every(s=>source.has(s)),e.id+' broken citation');
 assert.ok(e.date_label.startsWith(String(e.year)+'年'),e.id+' year label');
 assert.doesNotMatch(e.date_label,/^\d{4}年\d{2}日$/,e.id+' malformed month label');
 assert.equal(e.colonial_profit,null,e.id+' fabricated colonial profit');
 if(e.lat===null){unknown++;assert.equal(e.lng,null,e.id+' invented location')}
 else assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng),e.id+' invalid anchor');
}
assert.equal(unknown,14,'Unlocated events must remain unlocated until evidence exists');
assert.equal(main.places.filter(p=>p.render_as_event_only).length,16);
const carried=['calais-crown','guines-crown-1520s','dublin-pale','channel-jersey','channel-guernsey','isle-of-man','orkney-scotland','shetland-scotland','kingdom-of-scotland'];
for(const id of carried){
 const now=main.places.find(p=>p.id===id),last=prior.places.find(p=>p.id===id);
 assert.ok(now&&last,id+' dropped at new decade');
 assert.equal(now.observed_through_year,1589,id+' not continued');
 assert.equal(now.start_year,last.start_year,id+' invented conquest');
}
const prevFoot=read('data/territorial-footprints-1570-1579.geojson');
assert.deepEqual(foot.features.map(f=>f.geometry),prevFoot.features.map(f=>f.geometry),'old research references reshaped');
assert.equal(rel.features.length,6);assert.equal(city.features.length,2);assert.equal(foot.features.length,7);
assert.ok(city.features.every(f=>f.properties.controller_periods?.length===1
 &&f.properties.controller_periods[0].controller_group==='french_crown'
 &&f.properties.controller_periods[0].start_year<=1580
 &&f.properties.controller_periods[0].end_year>=1589
 &&f.properties.polity==='Kingdom of France'),'Calais and Guines must remain French throughout this chapter');
assert.ok(sites.features.every(f=>f.geometry.type==='Point'&&f.properties.fill_authorized===false&&f.properties.area_sqkm===null));
assert.equal(sites.features.length,3);
assert.ok(!sites.features.some(f=>f.properties.stable_id==='loughrea-english-warders-1576-1580'),'1580 Burke recapture ignored');
const active=y=>sites.features.filter(f=>y>=f.properties.start_year&&y<=f.properties.end_year);
assert.deepEqual([active(1580).length,active(1585).length,active(1586).length,active(1587).length,active(1589).length],[1,2,1,2,1]);
for(const r of main.routes){
 assert.ok(r.year>=1585&&r.year<=1589);assert.equal(r.route_kind,'documented-endpoints-connection');
 assert.ok(r.source_ids.every(id=>source.has(id)));assert.equal(r.coords.length,2);
 assert.ok(r.coords.every(c=>Math.abs(c[0])<=90&&Math.abs(c[1])<=180));
}
assert.ok(app.includes('renderTenthControlSites()')&&app.includes('atlasTenth=await tenthRes.json()'));
assert.ok(app.includes('sourcesById.get(id)'),'Source index performance regression');
assert.ok(app.includes('ninth=year>=1570&&year<1580,tenth=year>=1580'),'Ninth chapter leaks into tenth');
assert.ok(html.includes('max="1599"')&&html.includes('1497—1599'));
assert.ok(app.includes("fetch('data/chapter10-detail-notes.json'"));
console.log('PASS ch10: 30 events, 70 sources, 25 places, 6 schematic routes, 31 ledgers, 14 null GIS, 3 dated point episodes, zero measured land polygons');
