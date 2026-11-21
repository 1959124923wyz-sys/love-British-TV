#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const area=read('data/seventeenth-century-editor43-5ai-localized-geometries-1600-1699.geojson');
const claims=read('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson');
const studies=read('data/seventeenth-century-regional-studies-1600-1699.geojson');
const inventory=read('docs/research/17C_5AH_EXACT_26_RECTANGLE_SOURCE_INVENTORY.json');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert.equal(area.type,'FeatureCollection');
assert.equal(area.metadata.schema,'atlas-17c-editor43-5ai-physical-islands-and-located-reference-sites-v1');
assert.equal(area.metadata.source_version,'Natural Earth 10m land v5.1.1');
assert.match(area.metadata.natural_earth_zip_sha256,/^[a-f0-9]{64}$/);
assert.equal(area.metadata.original_rectangular_source_ids_retired_from_display,26);
assert.equal(area.metadata.original_claim_rectangles_retired,14);
assert.equal(area.metadata.original_study_rectangles_retired,12);
assert.equal(area.metadata.modern_physical_island_coastline_polygons,4);
assert.equal(area.metadata.historical_polygons_authorized,0);
assert.equal(area.metadata.source_archives_unchanged,true);
assert.equal(area.features.length,34);
const reg=new Map([...claims.features,...studies.features].map(f=>[f.id,f]));
const originals=new Set(inventory.records.map(x=>x.id));
const newly=new Set(),mapped=new Map();
const isRectangle=f=>{
 if(f.geometry.type!=='Polygon')return false;
 const p=f.geometry.coordinates[0].slice(0,-1);
 return p.length===4&&new Set(p.map(x=>x[0])).size===2&&new Set(p.map(x=>x[1])).size===2;
};
for(const record of inventory.records){
 const f=reg.get(record.id);assert(f,'original source deleted '+record.id);
 assert(isRectangle(f),'original rectangle changed '+record.id);
 assert.deepEqual(record.source_urls,f.properties.source_urls);
 assert.equal(record.verified_historical_boundary,false);
 assert.equal(record.replacement_verified,false); // Frozen 5AH historical baseline is immutable.
}
for(const feature of area.features){
 const p=feature.properties,g=feature.geometry;
 assert(!newly.has(feature.id));newly.add(feature.id);
 const old=reg.get(p.supersedes_visual_reference);
 assert(old&&originals.has(old.id));
 if(!mapped.has(old.id))mapped.set(old.id,[]);
 mapped.get(old.id).push(feature);
 assert(Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year<=p.end_year);
 assert(old.properties.start_year<=p.start_year);
 assert(p.end_year<=old.properties.end_year);
 assert(Array.isArray(p.source_urls)&&p.source_urls.length>0&&p.source_urls.every(x=>x.startsWith('https://')));
 assert(old.properties.source_urls.every(src=>p.source_urls.includes(src)),'existing source not preserved '+feature.id);
 for(const k of ['historical_boundary_confirmed','territorial_claim','fill_authorized'])assert.equal(p[k],false);
 assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert.equal(p.uncertain_line_dashed,true);assert.equal(p.territorial_control_verified,false);
 assert(['Point','Polygon'].includes(g.type));
 if(g.type==='Point'){
  assert.equal(g.coordinates.length,2);
  assert(g.coordinates.every(Number.isFinite));
  if(p.anchor_event_id){
   const d=Number(p.anchor_event_id.slice(0,4));
   const start=1600+10*(Math.floor((d-1600)/10));
   const year=read('data/atlas-'+start+'-'+(start+9)+'.json');
   const e=year.events.find(e=>e.id===p.anchor_event_id);
   assert(e,'missing historical event '+p.anchor_event_id);
   assert.deepEqual(g.coordinates,[e.lng,e.lat]);
  }
 }else{
  assert.equal(p.display_kind,'natural_island_coastline');
  assert.equal(p.geometry_verified_as_historical_border,false);
  assert.equal(p.country_control_not_inferred,true);
  assert.equal(g.coordinates.length,1);
  assert(g.coordinates[0].length>=7);
  assert.deepEqual(g.coordinates[0][0],g.coordinates[0].at(-1));
  assert(new Set(g.coordinates[0].map(c=>c[0])).size>3,'accidental axis-aligned coast '+feature.id);
  assert(new Set(g.coordinates[0].map(c=>c[1])).size>3,'accidental axis-aligned coast '+feature.id);
 }
}
assert.equal(mapped.size,26);
assert.deepEqual(new Set(mapped.keys()),originals);
assert.equal(newly.size,34);
const groupCount=(start,end)=>{
 const a=area.features.filter(f=>f.properties.supersedes_visual_reference===start&&f.properties.start_year<=end&&f.properties.end_year>=end);
 return a;
};
const on=(id,y)=>area.features.filter(f=>f.id===id&&f.properties.start_year<=y&&y<=f.properties.end_year).length;
assert.equal(on('EDITOR43_5AI_ST_KITTS_ISLAND',1623),1);
assert.equal(on('EDITOR43_5AI_NEVIS_ISLAND',1623),0);
assert.equal(on('EDITOR43_5AI_NEVIS_ISLAND',1627),0);
assert.equal(on('EDITOR43_5AI_NEVIS_ISLAND',1628),1);
assert.equal(on('EDITOR43_5AI_NEVIS_ISLAND',1632),0);
assert.equal(on('EDITOR43_5AI_PROVIDENCIA_ISLAND',1629),0);
assert.equal(on('EDITOR43_5AI_PROVIDENCIA_ISLAND',1630),1);
assert.equal(on('EDITOR43_5AI_PROVIDENCIA_ISLAND',1640),1);
assert.equal(on('EDITOR43_5AI_PROVIDENCIA_ISLAND',1641),0);
assert.equal(on('EDITOR43_5AI_ST_HELENA_ISLAND',1658),0);
assert.equal(on('EDITOR43_5AI_ST_HELENA_ISLAND',1659),1);
assert.equal(on('EDITOR43_5AI_ST_HELENA_ISLAND',1699),1);
assert.equal(on('EDITOR43_5AI_ST_HELENA_ISLAND',1700),0);
assert.equal(mapped.get('17c-hbc-1686-three-james-bay-forts-review-box').length,3);
assert.equal(mapped.get('17c-ne-pequot-war-saybrook-mystic-1637-study').length,2);
assert.equal(mapped.get('17c-acadia-1696-beaubassin-nonmetric-raid').length,1);
assert.equal(mapped.get('claim-st-kitts-nevis-1623').length,2);
for(const s of ['seventeenth5aiRealGeometry=q;',
 'm.original_rectangular_source_ids_retired_from_display!==26',
 "f.properties.supersedes_visual_reference.startsWith('claim-')",
 "f.properties.supersedes_visual_reference.startsWith('17c-')",
 "className:'atlas-17c-5ai-physical-island",
 "className:'atlas-17c-5ai-localized-point",
 "className:'atlas-17c-5ai-referenced-event"])assert(app.includes(s),'5AI live map not connected '+s);
console.log('PASS 5AI: 26 archived boxes superseded by 4 actual 10m island coastlines and 30 documented dated place anchors; actor scope and chronology source-regression guards');
