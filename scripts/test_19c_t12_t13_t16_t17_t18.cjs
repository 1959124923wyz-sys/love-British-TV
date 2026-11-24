#!/usr/bin/env node
'use strict';
const fs=require('fs');
const assert=require('assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const files={"T12":"e19-t12-highland-clearances-crofter-land-1811-1883.json","T13":"e19-t13-british-labour-repression-transportation-1817-1855.json","T16":"e19-t16-eastern-india-land-adivasi-resistance-1814-1899.json","T17":"e19-t17-bengal-indigo-assam-tea-coercion-1840-1882.json","T18":"e19-t18-ceylon-land-plantations-paddy-tax-1815-1892.json"};
const index=read('data/stories/serial/index.json');
const years=[1800,1820,1830,1840,1850,1860,1870,1880,1890];
const decades={};const allEventIds=new Set();
for(const year of years){
const end=year===1800?1819:year+9;
const doc=read('data/stories/serial/chronology-'+year+'-'+end+'.json');
decades[year]=doc;
for(const event of doc.events){assert(!allEventIds.has(event.id),'duplicate chronology event ID '+event.id);allEventIds.add(event.id);}
}
let sections=0;let linked=new Set();let sourced=0;
for(const [topic,file] of Object.entries(files)){
 const story=read('data/stories/serial/'+file);
 const item=index.topics.find(x=>x.id===story.id);
 assert(item,'missing index entry '+topic);
 assert(['editorial_review','published'].includes(item.status),'invalid publication status '+topic);
 assert.equal(item.publication_review,item.status==='published'?'approved':'not_submitted');
 assert.equal(item.event_ids.length,story.sections.length);
 const sourceIds=new Set(story.sources.map(x=>x.id));
 for(const section of story.sections){
  sections++;
  assert.equal(section.paragraphs.length,3,'three paragraphs: '+section.id);
  assert(section.primary_event_id,'missing primary link: '+section.id);
  assert(item.event_ids.includes(section.primary_event_id),'index mismatch: '+section.id);
  assert(allEventIds.has(section.primary_event_id),'missing chronology event: '+section.primary_event_id);
  assert(section.paragraphs[0].includes('[['+section.primary_event_id+'|'),'missing clickable event: '+section.id);
  assert(section.source_keys.length>0,'unsourced section: '+section.id);
  for(const key of section.source_keys)assert(sourceIds.has(key),'unregistered source '+key);
  linked.add(section.primary_event_id);
 }
 sourced+=story.sources.length;
}
assert.equal(sections,68);
assert.equal(linked.size,68);
assert.equal(sourced,81);

const plan=read('research/19c/consolidated/T12_T13_T16_T17_T18_RELEASE_PLAN.json');
assert.equal(plan.eventPlans.filter(x=>x.reuse).length,22);
assert.equal(plan.eventPlans.filter(x=>!x.reuse).length,46);
for(const e of plan.eventPlans){
 const d=Object.values(decades).find(d=>d.events.some(x=>x.id===e.eid));
 assert(d,'missing event '+e.eid);const v=d.events.find(x=>x.id===e.eid);
 assert.equal(v.year,e.y);
 const ids=new Set(d.sources.map(s=>s.id));
 assert(v.source_ids.every(id=>ids.has(id)),'missing event source '+e.eid);
}
const points=[];
for(const y of years){
 const d=decades[y],ids=new Set(d.sources.map(s=>s.id));
 const g=read('data/nineteenth-century-spatial-'+y+'-'+(y===1800?1819:y+9)+'.geojson');
 for(const f of g.features.filter(f=>/^GIS-19C-T(12|13|16|17|18)-/.test(f.id))){
  const p=f.properties;
  assert.equal(f.geometry.type,'Point');
  assert(p.source_ids.every(id=>ids.has(id)));
  assert(p.related_event_ids.every(id=>d.events.some(e=>e.id===id)));
  assert(p.source_urls.includes(p.geometry_source));
  assert.equal(p.territorial_claim,false);assert.equal(p.fill_authorized,false);
  assert.equal(p.exclude_from_area_aggregation,true);assert.equal(p.historical_boundary_confirmed,false);
  assert(f.geometry.coordinates.every(Number.isFinite));
  points.push(f);
 }
}
assert.equal(points.length,8);
const bad=points.find(f=>f.id.includes('BADINLOSKIN'));
assert(Math.abs(bad.geometry.coordinates[0]+4.183678044765837)<1e-8);
assert(Math.abs(bad.geometry.coordinates[1]-58.3151306713437)<1e-8);
console.log('PASS five topics: 68 sections, 81 source records, 46 new + 22 reused events, 8 documentary points; no territorial geometry.');
