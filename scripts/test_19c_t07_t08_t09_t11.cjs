#!/usr/bin/env node
'use strict';
const fs=require('fs');
const assert=require('assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const files={
T07:'e19-t07-rio-de-la-plata-invasion-blockade-1806-1850.json',
T08:'e19-t08-falklands-guiana-boundary-1832-1899.json',
T09:'e19-t09-british-capital-latin-america-slavery-mining-1810-1882.json',
T11:'e19-t11-irish-land-war-coercion-transportation-1803-1888.json'};
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
assert.equal(sections,40);
assert.equal(linked.size,40);
assert.equal(sourced,45);
assert(allEventIds.has('E19-YI-1848-MITCHEL'),'1848 Mitchel old event not reused');
const officialPoints=[];for(const dec of [1800,1820,1840,1850,1880]){
 const last=dec===1800?1819:dec+9;
 const spatial=read('data/nineteenth-century-spatial-'+dec+'-'+last+'.geojson');
 officialPoints.push(...spatial.features.filter(x=>x.id.startsWith('GIS-19C-T07-')||x.id.startsWith('GIS-19C-T09-')||x.id.startsWith('GIS-19C-T11-1887-CORK-')));
}
assert.equal(officialPoints.length,7);
for(const f of officialPoints){
 assert.equal(f.geometry.type,'Point');
 assert.equal(f.properties.territorial_claim,false);
 assert.equal(f.properties.fill_authorized,false);
 assert.equal(f.properties.exclude_from_area_aggregation,true);
 assert.equal(f.properties.historical_boundary_confirmed,false);
 assert(f.properties.source_urls.some(u=>u.includes('geonames.org')));
 assert(f.properties.related_event_ids.every(id=>allEventIds.has(id)),'dead GIS link '+f.id);
}
const cork=officialPoints.find(x=>x.id.includes('CORK-MITCHELSTOWN'));
assert(cork && cork.geometry.coordinates[0]===-8.26806,'wrong Mitchelstown');
console.log('PASS T07/T08/T09/T11: 40 article sections, 40 event links (39 new, one reused), 45 article refs and 7 time-scoped place Points. No invented territory.');
