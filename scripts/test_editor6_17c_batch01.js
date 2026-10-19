'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const expected=[13,24,22,18,18,24,42,38,27,42];
const existing=read('data/stories/serial/chronology-preview-1600-1699.json');
assert.deepEqual(existing.events.map(e=>e.id),['E6-GLENCOE-1692']);
const topics=read('data/stories/serial/index.json');
assert(topics.topics.some(t=>t.id==='E6-T04-GLENCOE'&&t.status==='published'));
const chapters=read('data/chapters.json');
assert.equal(chapters.chapters.length,10,'Never change already published Tudor chapter count');
assert.equal(chapters.chapters.at(-1).end,1599);
const allIds=new Set(existing.events.map(e=>e.id));
const researchIds=new Set();
let sum=0,points=0,representative=0,legacyPoints=0,sources=0;
for(let d=1600,i=0;d<=1690;d+=10,i++){
 const file='data/atlas-'+d+'-'+(d+9)+'.json';
 const dataset=read(file),events=dataset.events;
 assert.equal(dataset.period.from,d);assert.equal(dataset.period.to,d+9);
 assert.equal(dataset.editorial_status,'published_partial_source_linked_in_progress_not_complete_decade');
 assert(dataset.publication.not_deemed_complete);
 assert.equal(dataset.intro,null,'decade overview is pending by editor decision');
 assert.equal(events.length,expected[i],'unexpected change without audit: '+d);
 assert.deepEqual(dataset.places,[]);assert.deepEqual(dataset.routes,[]);
 assert.deepEqual(dataset.colonial_polygons,[],'no new GIS control polygon is approved');
 const sourceIds=new Set(dataset.sources.map(s=>s.id));
 assert.equal(sourceIds.size,dataset.sources.length,'duplicated decade source keys');
 for(const src of dataset.sources){
  assert(/^https:\/\//.test(src.url),'non-clickable source: '+src.id);
  assert(src.title && src.original_source_id);
  assert.equal(src.verification_status,'agent_register_linked_not_individually_audited_for_publication');
 }
 let prev=d-1;
 for(let index=0;index<events.length;index++){
  const e=events[index],expectedId=d+'S-E'+String(index+1).padStart(3,'0');
  assert.equal(e.id,expectedId,'IDs must append within each decade and remain frozen across updates');
  assert(!allIds.has(e.id),'duplicate map event ID '+e.id);allIds.add(e.id);
  assert(!researchIds.has(e.research_event_id),'duplicate source record '+e.research_event_id);
  researchIds.add(e.research_event_id);
  assert(e.year>=d&&e.year<=d+9&&e.year>=prev,'invalid chronology for '+e.id);
  prev=e.year;
  assert(e.date_label&&e.name&&e.description&&e.historical_actor);
  assert(e.arc_id&&e.research_event_id,'cross-century process and agent provenance IDs required');
  assert(e.significance?.review_status==='editor6_batch_source_register_screening_not_full_primary_audit');
  assert(Array.isArray(e.source_ids)&&e.source_ids.length>0);
  for(const sid of e.source_ids)assert(sourceIds.has(sid),'dangling source '+e.id+': '+sid);
  assert.equal(e.historical_control_boundary_verified,false);
  assert.equal(e.actual_English_land_area_sqkm,null);
  assert.equal(e.actual_English_territory_created,false);
  if(e.lat===null||e.lng===null){
   assert(e.lat===null&&e.lng===null,'partial GPS pair');
   assert.equal(e.geo_precision,'not_geocoded_historical_place_recorded');
  }else{
   points++;
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180);
   if(e.representative_map_point){
    representative++;
    assert(e.geo_precision.startsWith('representative_'),'explicit uncertain geographical marker required');
    assert(e.geolocation_limit_zh.includes('非事件精确现场')&&e.geolocation_limit_zh.includes('不表示由英方控制'),'representative site must not masquerade as event site or control');
    assert(e.geography_label&&e.geo_reference_code&&e.map_priority===true);
   }else{
    legacyPoints++;
    assert(e.geo_precision.includes('approximate')&&e.geolocation_limit_zh.includes('并非'));
   }
  }
 }
 sum+=events.length;sources+=dataset.sources.length;
}
assert.equal(sum,268);
assert.equal(points,267);
assert.equal(representative,219);
assert.equal(legacyPoints,48);
assert.equal(sources,298);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes("fetch('data/atlas-'+d+'-'+(d+9)+'.json'"),'actual decade batches must load');
assert(app.includes("existingGlencoe")||app.includes("existingGlencoe="),'preserve prior independently published 1692 record');
assert(app.includes("serialPreviewByDecade.set(decade,ds)"));
assert(app.includes("showFullChapterArchive').checked=false"),'future archive preview must reset across decades');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!html.includes('serialStoriesButton'),'previous independent story tab must remain removed');
console.log('PASS E6 17c batch 01: '+sum+' new unique events + Glencoe, 298 decade-specific source references, '+points+' cautious reference points ('+representative+' administrative/impact area references); all ten years, chronology and old atlas contract intact');
