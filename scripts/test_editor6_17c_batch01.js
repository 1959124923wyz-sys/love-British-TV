'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const original=[13,24,22,18,18,24,42,38,27,42];
const baseline=[18,32,27,21,29,38,47,67,36,62];
const expanded=[20,35,28,22,33,43,57,79,46,89];
const JamaicaEvents={1650:['1650S-E090'],1660:['1660S-E090'],1670:['1670S-E090'],1680:['1680S-E090'],1690:['1690S-E090','1690S-E091']};
const originalSources=298;
const legacy=load('data/stories/serial/chronology-preview-1600-1699.json');
assert.deepEqual(legacy.events.map(x=>x.id),['E6-GLENCOE-1692']);
const topics=load('data/stories/serial/index.json').topics;
assert(topics.some(t=>t.id==='E6-T04-GLENCOE'&&t.status==='published'&&t.event_ids.includes('E6-GLENCOE-1692')));
const chapters=load('data/chapters.json').chapters;
assert.equal(chapters.length,10);assert.equal(chapters.at(-1).end,1599);
const oldGeo=load('docs/research/EDITOR6_17C_REPRESENTATIVE_POINT_DECISIONS_R02.json');
const allIds=new Set(legacy.events.map(x=>x.id)),usedResearchIds=new Set();
let total=0,points=0,refs=0,olderNamed=0,olderProxy=0,added=0,sources=0,newDecades=0;
for(let d=1600,i=0;d<=1690;d+=10,i++){
 const data=load('data/atlas-'+d+'-'+(d+9)+'.json');
 assert.equal(data.period.from,d);assert.equal(data.period.to,d+9);
 assert.equal(data.period.next,d+10,'old next-decade navigation remains intact');
 assert.equal(data.intro,null);assert(data.publication.not_deemed_complete);
 assert.equal(data.editorial_status,'published_partial_source_linked_in_progress_not_complete_decade');
 for(const field of ['places','colonial_polygons'])assert.deepEqual(data[field],[],field+' must not imply unverified sovereignty');
 assert.equal(data.events.length,expanded[i],'unexpected R03 decade event count');
 const numbering=new Set(),sourceKeys=new Set(data.sources.map(x=>x.id));
 assert.equal(sourceKeys.size,data.sources.length);
 for(const s of data.sources){
  assert(s.url?.startsWith('https://')&&s.title&&(s.original_source_id||(s.verification_status?.startsWith('editor9_')||s.verification_status?.startsWith('editor10_')||s.verification_status?.startsWith('editor11_')||s.verification_status?.startsWith('editor12_'))));
  assert(s.verification_status==='agent_register_linked_not_individually_audited_for_publication'||(s.verification_status?.startsWith('editor6_')||s.verification_status?.startsWith('editor7_')||s.verification_status?.startsWith('editor9_')||s.verification_status?.startsWith('editor10_')||s.verification_status?.startsWith('editor11_')||s.verification_status?.startsWith('editor12_')),'source verification must have documented level');
 }
 let prior=d-1;
 for(const e of data.events){
  assert(new RegExp('^'+d+'S-E[0-9]{3}$').test(e.id),'decade ID must have 3-digit suffix');
  const ix=Number(e.id.slice(-3));assert(!numbering.has(ix),'duplicate decade number');numbering.add(ix);
  assert(!allIds.has(e.id),'duplicate global ID');allIds.add(e.id);
  assert(!usedResearchIds.has(e.research_event_id),'already imported source record '+e.research_event_id);usedResearchIds.add(e.research_event_id);
  assert(e.year>=d&&e.year<=d+9&&e.year>=prior,'year order');prior=e.year;
  assert(e.date_label&&e.name&&e.description&&e.historical_actor&&e.arc_id);
  assert((e.significance?.review_status?.startsWith('editor6_')||e.significance?.review_status?.startsWith('editor7_')||e.significance?.review_status?.startsWith('editor9_')||e.significance?.review_status?.startsWith('editor10_')||e.significance?.review_status?.startsWith('editor11_')||e.significance?.review_status?.startsWith('editor12_')),'record is missing research review flag');
  assert(Array.isArray(e.source_ids)&&e.source_ids.length>0);
  for(const k of e.source_ids)assert(sourceKeys.has(k),'broken cited source '+k);
  assert(e.actual_English_land_area_sqkm===null&&e.actual_English_territory_created===false);
  assert(e.historical_control_boundary_verified===false);
  const afterBaseline=ix>original[i];
  if(afterBaseline)added++;
  const oldRef=oldGeo.approved_event_to_reference[d]?.[e.id];
  if(oldRef){
   olderProxy++;
   const g=oldGeo.gazetteer[oldRef];
   assert(g&&e.lat===g.lat&&e.lng===g.lng,'R02 anchored location changed '+e.id);
   assert(e.geo_reference_code===oldRef,'R02 geo reference code changed');
  }
  if(Number.isFinite(e.lat)&&Number.isFinite(e.lng)){
   points++;
   assert(Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180);
   if(e.representative_map_point){
    refs++;
    assert(e.geo_precision.startsWith('representative_'),'representative coordinate must be marked');
    assert(e.geolocation_limit_zh?.includes('非事件精确现场'),'must describe imprecision');
    assert(e.geolocation_limit_zh.includes('不表示')||e.geolocation_limit_zh.includes('不构成'),'cannot imply real control');
   }else{
    olderNamed++;
    assert(e.geo_precision?.includes('approximate'),'original locality is approximate');
   }
  }else{
   assert(e.lat===null&&e.lng===null,'partial coordinate pair');
   assert(!afterBaseline,'new research records should map to justified region in R03');
  }
 }
 for(let number=1;number<=baseline[i];number++)assert(numbering.has(number),'append-only original R03 identifier gap '+d+'S-E'+number);
 for(const id of JamaicaEvents[d]||[])assert(numbering.has(Number(id.slice(-3))),'missing editor7 sourced Jamaica addition '+id);
 newDecades++;total+=data.events.length;sources+=data.sources.length;
}
assert.equal(newDecades,10);assert.equal(total,452);assert.equal(added,184);
assert.equal(points,451);assert.equal(olderNamed,48);assert.equal(olderProxy,219);
assert.equal(refs,403,'R02 219 + R03 base plus six additional evidence-linked Jamaica events');
assert.equal(sources,490);assert.equal(sources-originalSources,192);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes("fetch('data/atlas-'+d+'-'+(d+9)+'.json'"));
assert(app.includes('existingGlencoe'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!html.includes('serialStoriesButton'),'no separate navigation for this century');
console.log('PASS Editor6 R03: '+total+' unique new century decade records, '+added+' append-only new, '+sources+' provenance sources, '+points+' cautious map points, old 16th century and Glencoe intact');
