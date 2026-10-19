'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cfg=json('docs/research/EDITOR6_17C_REPRESENTATIVE_POINT_DECISIONS_R02.json');
assert.equal(cfg.schema,'editor6-representative-geopoints-v1');
const used=new Set(),core=new Set();
let newRefs=0,originalRefs=0,unmapped=0,admin=0,regional=0;
for(let d=1600;d<=1690;d+=10){
 const events=json('data/atlas-'+d+'-'+(d+9)+'.json').events;
 const assignments=cfg.approved_event_to_reference[d];
 assert(assignments&&Object.keys(assignments).length>0);
 for(const e of events){
  assert(!used.has(e.id),'duplicate event '+e.id);
  used.add(e.id);core.add(e.research_event_id);
  assert(e.historical_control_boundary_verified===false);
  assert(e.actual_English_land_area_sqkm===null);
  assert(e.actual_English_territory_created===false);
  const refcode=assignments[e.id];
  if(refcode){
   newRefs++;
   const ref=cfg.gazetteer[refcode];
   assert(ref,'gazetteer reference missing '+refcode);
   assert(e.representative_map_point===true);
   assert(e.geo_reference_code===refcode);
   assert(e.lat===ref.lat&&e.lng===ref.lng);
   assert(e.geography_label.length>=6,'a named place or impacted area is required');
   assert(e.geolocation_limit_zh.includes('代表性位置')&&e.geolocation_limit_zh.includes('非事件精确现场'));
   assert(e.geolocation_limit_zh.includes('不表示由英方控制'),'must disclose no sovereignty inference');
   assert(e.map_priority===true);
   assert(e.geo_precision.startsWith('representative_'),'not accurate physical event location');
   if(ref.kind==='administrative'){
    admin++;
    assert(e.position_type==='administrative_policy_decision_reference');
   }else{
    regional++;
    assert(e.position_type==='main_affected_region_or_named_locality_reference');
   }
  }else if(e.lat!==null){
   originalRefs++;
   assert(e.representative_map_point!==true,'unmapped marker cannot be passed off as reviewed regional reference');
  }else{
   unmapped++;
   assert(e.lng===null,'coordinate pair must remain null together');
  }
 }
 assert(Object.keys(assignments).every(id=>events.some(e=>e.id===id)),'mapping cannot point to missing event');
}
assert.equal(used.size,268);
assert.equal(newRefs,219);
assert.equal(originalRefs,48);
assert.equal(unmapped,1);
assert.equal(admin+regional,219);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes('atlas-representative-notice'),'representative reference disclaimer must be visible in event dossier');
assert(app.includes('geo_precision')&&app.includes('representative_map_point'));
assert(app.includes('地区参考点'),'left event list must disclose representative marker');
assert(app.includes('非事件现场'),'map hover must disclose approximate interpretation');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!html.includes('serialStoriesButton'),'independent long-story navbar must remain removed');
console.log('PASS: 268 unchanged IDs / 219 new explicitly labeled proxy map points / 48 original / 1 unplaced / zero GIS polygons or area claims; policy/admin='+admin+' region='+regional);
