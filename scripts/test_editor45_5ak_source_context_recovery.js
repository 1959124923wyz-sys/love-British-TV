#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const txt=p=>fs.readFileSync(path.join(root,p),'utf8');
const reg=J('data/eighteenth-century-editor45-5ak-recovered-source-contexts.json');
const cohort=J('docs/research/18C_5AK_PRE5D_VISIBLE_RECTANGLE_COHORT.json');
const promotion=J('data/eighteenth-century-editor39-5ae-point-area-promotions.json');
const known=promotion.point_markers_replaced_by_existing_polygons;
const pre5d=new Set(cohort.files.flatMap(q=>q.pre5d_displayed_ids));
const sources=new Map(),points=new Map();
for(const row of cohort.files){
 const o=J(row.path);
 for(const z of o.zones)sources.set(z.id,{...z,file:row.path});
}
const geom=[
 'data/eighteenth-century-editor37-5aa-bengal.geojson',
 'data/eighteenth-century-editor37-5ab-physical-areas.geojson',
 'data/eighteenth-century-editor37-5ac-surveyed-geography.geojson',
 'data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson',
 'data/eighteenth-century-editor39-5ae-source-areas.geojson'
];
for(const f of geom){
 for(const feature of J(f).features){
  if(feature.geometry.type==='Point')points.set(feature.id,{...feature,file:f});
 }
}
const periodsOverlap=(a,b)=>a.some(x=>b.some(y=>x.start_year<=y.end_year&&y.start_year<=x.end_year));
const on=(a,y)=>a.some(p=>p.start_year<=y&&y<=p.end_year);
assert.equal(reg.schema,'atlas-18c-editor45-5ak-source-point-overview-recovery-v1');
assert.equal(cohort.ref,'7e5c6cc835fe6629dca0c5e9c8f137fac7cbd8d1');
assert.equal(pre5d.size,338);
assert.equal(cohort.original_5d_eighteenth_century_total,377);
assert.equal(reg.records_recovered,56);assert.equal(reg.records.length,56);
assert.equal(reg.excluded_known_point_replacements,14);
assert.equal(reg.excluded.length,14);
assert.equal(new Set(reg.records.map(x=>x.id)).size,56);
assert.equal(new Set(reg.excluded.map(x=>x.id)).size,14);
for(const r of reg.records){
 const old=sources.get(r.id),f=points.get(r.replacement_id);
 assert(old&&f&&pre5d.has(r.id),r.id);
 assert.equal(old.superseded_by,r.replacement_id,r.id);
 assert.equal(f.geometry.type,'Point',r.id);
 assert.deepEqual(old.bbox,r.bbox,r.id);
 assert.deepEqual(old.periods,r.periods,r.id);
 assert.deepEqual(old.source_urls,r.old_source_urls,r.id);
 assert.deepEqual(f.properties.periods,r.replacement_periods,r.id);
 assert.deepEqual(f.properties.source_urls,r.replacement_source_urls,r.id);
 assert.equal(r.replacement_source_file,f.file,r.id);
 assert.equal(r.source_file,old.file,r.id);
 assert(periodsOverlap(r.periods,r.replacement_periods),r.id);
 assert(r.old_source_urls.some(u=>u.startsWith('https://')));
 assert(r.replacement_source_urls.some(u=>u.startsWith('https://')));
 assert(!known.some(x=>x.id===r.replacement_id),'surveyed promotion must win '+r.id);
 assert.equal(r.area_sqkm,null);
 assert.equal(r.historical_boundary_confirmed,false);
 assert.equal(r.territorial_control_verified,false);
 assert.equal(r.fill_authorized,false);
 assert.equal(r.uncertain_line_dashed,true);
 const dx=r.bbox[2]-r.bbox[0],dy=r.bbox[3]-r.bbox[1],cap=r.kind==='revenue'?1.7:.55;
 assert(dx>0&&dy>0&&dx<=cap+1e-8&&dy<=cap+1e-8,r.id);
}
for(const item of reg.excluded){
 assert(sources.has(item.id)&&pre5d.has(item.id),item.id);
 assert(!reg.records.some(r=>r.id===item.id),item.id);
 assert(['has_surveyed_polygon','broad_arbitrary_envelope','paper_only_grant'].includes(item.reason),item.id);
 if(item.reason==='has_surveyed_polygon')assert(known.some(x=>x.id===item.replacement_id),item.id);
}
const count=id=>reg.records.filter(r=>r.id.startsWith(id)).length;
assert.equal(count('B36-'),33);
assert.equal(count('B37-A-'),3);
assert.equal(count('B38-S-'),8);
assert.equal(count('B38-I-'),3);
assert.equal(count('B39-C-'),1);
assert.equal(count('B39-A-'),8);
const active=(id,y)=>{const r=reg.records.find(x=>x.id===id);return r&&on(r.periods,y)&&on(r.replacement_periods,y)};
assert.equal(active('B36-Z059',1764),false);
assert.equal(active('B36-Z059',1765),true);
assert.equal(active('B36-Z059',1799),true);
assert.equal(active('B36-Z004',1755),true);
assert.equal(active('B38-S-Z022',1779),false);
assert.equal(active('B38-S-Z022',1780),true);
assert.equal(active('B38-S-Z022',1781),false);
assert(!reg.records.some(x=>x.id==='B36-Z023'||x.id==='B36-Z024'));
const js=txt('js/eighteenth-editor45-5ak-context-overlays.js'),app=txt('app.js'),index=txt('index.html');
assert(js.includes("dashArray:'2 9'"));
assert(js.includes('fill:false,fillOpacity:0'));
assert(js.includes('within(r.periods,year)&&within(r.replacement_periods,year)'));
assert(js.includes('atlas-18c-5ak-reference-outline'));
assert(js.includes('areaStatisticsSupported:false'));
assert.equal((app.match(/window\.eighteenthEditor45FiveAK\?\.render\?\.\(\)/g)||[]).length,4);
assert(index.includes('js/eighteenth-editor45-5ak-context-overlays.js'));
console.log('PASS 5AK: 56 original-403 pre5D records, matching documented point and year; 14 excluded, zero polygon-overwrites / area fill');
