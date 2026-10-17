#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('data/atlas-1580-1589.json'),b=read('data/atlas-1590-1599.json'),regions=read('data/followup-regional-stories-1562-1596.geojson');
assert.ok(a.events.length>=53);assert.ok(a.sources.length>=92);
assert.ok(b.events.length>=39);assert.ok(b.sources.length>=75);
assert.equal(a.events.filter(e=>e.year<=1586).length,40);
assert.equal(a.events.filter(e=>e.year<=1587).length,47,'Cavendish present by 1587 and only 1587');
assert.equal(a.events.filter(e=>e.year<=1588).length,66);
assert.equal(b.events.filter(e=>e.year<=1593).length,17,'Hawkins absent before 1594');
assert.equal(b.events.filter(e=>e.year<=1594).length,23);
const cases=[
{atlas:a,id:'PAC1587-CAVENDISH-QUINTERO',year:1587,icon:'WAR',summary:'不将金特罗标为',source:'CL-BNC-CAVENDISH-QUINTERO-1587',region:'cl-cavendish-1587-quintero-landing-defense'},
{atlas:b,id:'PAC1594-HAWKINS-VALPARAISO',year:1594,icon:'ECO',summary:'被赎回',source:'CL-BNC-HAWKINS-VALPARAISO-1594',region:'cl-hawkins-1594-valparaiso-plunder'}
];
assert.equal(regions.features.length,14,'two new regional study polygons without removing the previous 12');
const previous=regions.features.filter(f=>!f.id.startsWith('cl-cavendish-1587')&&!f.id.startsWith('cl-hawkins-1594'));
assert.equal(previous.length,12);
for(const c of cases){
 const e=c.atlas.events.find(x=>x.id===c.id);
 assert(e,'Missing documented Chilean incident '+c.id);
 assert.equal(c.atlas.events.filter(x=>x.id===c.id).length,1,'never double-count privateering');
 assert(e.year===c.year&&e.visible_from===c.year&&e.start_year===c.year&&e.end_year===c.year,'chronology');
 assert.equal(e.icon_code,c.icon);
 assert(e.description.includes(c.summary),'must describe success or defeat without fiction');
 assert(e.source_ids.includes(c.source),'national library verification mandatory');
 assert(e.source_ids.length>=3);
 const catalog=new Map(c.atlas.sources.map(s=>[s.id,s]));
 assert(e.source_ids.every(id=>catalog.has(id)),'broken event citation');
 assert(e.colonial_profit===null&&e.actual_English_land_area_sqkm===null&&e.actual_English_territory_created===false);
 assert(e.historical_control_boundary_verified===false);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),'modern coastal locality point only');
 const f=regions.features.find(x=>x.id===c.region);assert(f,'Missing regional study polygon');
 const p=f.properties,ring=f.geometry.coordinates[0];
 assert(f.geometry.type==='Polygon'&&ring.length>=5);assert.deepEqual(ring[0],ring.at(-1));
 assert(p.start_year===c.year&&p.end_year===c.year);
 for(const key of ['historical_boundary_confirmed','fill_authorized','territorial_claim'])assert.equal(p[key],false);
 assert(p.area_sqkm===null&&p.exclude_from_area_aggregation===true);
 assert(p.source_ids.every(id=>catalog.has(id)),'regional area sources must exist in original chapter');
 assert(p.source_urls.every(url=>p.source_ids.some(id=>catalog.get(id).url===url)),'regional source URL must match source registry');
 assert(p.related_event_ids.includes(c.id));
 assert(p.geometry_provenance.toLowerCase().includes('not'),'historic boundary disclaimer necessary');
 assert(p.named_anchors.length>0&&p.mapping_method);
}
assert(a.events.find(e=>e.id==='1580S-E025')?.name.includes('卡文迪什'),'existing Cavendish Manila galleon event remains separately');
assert(!a.events.some(e=>e.id==='PAC1594-HAWKINS-VALPARAISO'),'no cross-decade leakage');
assert(!b.events.some(e=>e.id==='PAC1587-CAVENDISH-QUINTERO'),'no cross-decade leakage');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes('laterRegions?.features?.length!==14'),'load all current regional studies');
console.log('PASS 07: Quintero 1587 failed Cavendish raid and Hawkins 1594 Valparaiso plunder remain distinct, well sourced and dashed non-territorial.');
