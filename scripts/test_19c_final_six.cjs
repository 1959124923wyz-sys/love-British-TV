'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const root='research/19c/consolidated/';
const plan=load(root+'FINAL_SIX_RELEASE_PLAN.json');
const index=load('data/stories/serial/index.json');
const cache=new Map();
const get=p=>{if(!cache.has(p))cache.set(p,load(p));return cache.get(p)};
const period=y=>y<1820?'1800-1819':(Math.floor(y/10)*10)+'-'+(Math.floor(y/10)*10+9);
let count=0,points=0,sources=0,reused=0;const ids=new Set();
assert.equal(plan.reports.length,6);
assert.equal(index.topics.filter(t=>/^E19-T\d\d-/.test(t.id)&&t.status==='published').length,59);
for(const r of plan.reports){
 const a=load(r.path),review=load(r.reviewPath),m=index.topics.find(t=>t.id===a.id);
 assert(m);assert.equal(m.status,'published');assert.equal(m.publication_review,'approved');
 assert.equal(a.sections.length,r.sections);assert.equal(a.sources.length,r.source_count);
 assert(a.sections.flatMap(s=>s.paragraphs).join('').length>=3000);
 assert.deepEqual(m.event_ids,a.sections.map(s=>s.primary_event_id));
 assert.equal(review.mappings.length,a.sections.length);assert(review.original_archive_retained);
 const original=fs.readFileSync(review.source_archive,'utf8');
 const sourceIds=new Set(a.sources.map(s=>s.id));assert.equal(sourceIds.size,a.sources.length);
 for(const s of a.sources)assert(s.url.startsWith('https://')&&s.access);
 let n=0,old=0;
 for(const s of a.sections){
  const id=s.primary_event_id;assert(!ids.has(id));ids.add(id);count++;
  const row=review.mappings.find(x=>x.event_id===id);assert(row,id);
  const p=period(row.year),d=get('data/stories/serial/chronology-'+p+'.json');
  const match=d.events.filter(e=>e.id===id);assert.equal(match.length,1,id);const e=match[0];
  assert.equal(e.year,row.year);assert.equal(e.year,s.period_start_year);
  assert(s.paragraphs.some(p=>p.includes('[['+id+'|')));
  assert.deepEqual(s.source_keys,row.source_ids);
  assert(s.source_keys.every(k=>sourceIds.has(k)));
  assert(e.source_ids.every(k=>d.sources.some(x=>x.id===k)));
  assert(s.archive_event_ids.every(x=>original.includes(x)));
  if(row.reused){old++;reused++;if(row.coordinates)assert.deepEqual(row.coordinates,[e.lng,e.lat]);continue;}
  assert.deepEqual(e.source_ids,row.source_ids);
  assert.deepEqual(e.research_original_node_ids,s.archive_event_ids);
  assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
  if(row.coordinates){
   const g=get('data/nineteenth-century-spatial-'+p+'.geojson');
   const f=g.features.filter(f=>f.id?.startsWith('GIS-19C-'+r.topic+'-')&&f.properties.related_event_ids.includes(id));
   assert.equal(f.length,1,id);const v=f[0],pr=v.properties;
   assert.equal(v.geometry.type,'Point');assert.deepEqual(v.geometry.coordinates,row.coordinates);
   assert.deepEqual(v.geometry.coordinates,[e.lng,e.lat]);assert.equal(pr.start_year,row.year);assert.equal(pr.end_year,row.year);
   assert.equal(pr.fill_authorized,false);assert.equal(pr.territorial_claim,false);assert.equal(pr.historical_boundary_confirmed,false);
   assert.equal(pr.exclude_from_area_aggregation,true);assert.equal(pr.area_sqkm,null);
   assert.equal(pr.geometry_source,row.geometry_source);assert(pr.source_urls.includes(pr.geometry_source));
   assert(pr.source_ids.every(k=>sourceIds.has(k)));n++;points++;
  }else{assert.equal(e.lat,null);assert.equal(e.lng,null)}
 }
 assert.equal(n,r.points);assert.equal(old,r.reused);sources+=a.sources.length;
 console.log('PASS '+r.topic+': '+r.sections+' sections; '+n+' source-backed points');
}
assert.equal(count,93);assert.equal(points,19);assert.equal(sources,129);assert.equal(reused,15);
console.log('PASS batch: 93 unique dated links (78 new, 15 reused); 129 sources; 19 safe points');
