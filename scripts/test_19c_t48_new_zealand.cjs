#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T48-NEW-ZEALAND-MAORI-LAND-CONFISCATION-WARS';
const story=load('data/stories/serial/e19-t48-new-zealand-maori-confiscation-1840-1883.json');
const idx=load('data/stories/serial/index.json'),topic=idx.topics.find(t=>t.id===id);
assert(topic&&story.id===id);
assert(['editorial_review','published'].includes(topic.status));
assert(['not_submitted','approved'].includes(topic.publication_review));
assert.equal(story.sections.length,43);
assert.equal(story.sections.reduce((sum,s)=>sum+s.paragraphs.length,0),129);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=10000);
assert.equal(story.sources.length,73);
assert.equal(story.topic_source_claims.length,43);
assert.deepEqual(story.sections.reduce((out,s)=>(out[s.narrative_chapter]=(out[s.narrative_chapter]||0)+1,out),{}),{'T48.1':22,'T48.2':12,'T48.3':9});
const sourceKeys=new Set(story.sources.map(s=>s.id));
assert.equal(sourceKeys.size,story.sources.length);
for(const s of story.sources)assert(s.id.startsWith('19C-T48-')&&s.publisher&&s.title&&s.url.startsWith('https://')&&s.access,s.id);
const secIDs=new Set(story.sections.map(s=>s.id)),links=[];
assert.equal(secIDs.size,43);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3,s.id);
 assert(s.source_keys.length>=2&&s.source_keys.every(k=>sourceKeys.has(k)),s.id);
 assert(s.period_start_year>=1840&&s.period_end_year<=1883,s.id);
 for(const p of s.paragraphs){
  assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|本项目|未伪称)/.test(p),'editorial language in story '+s.id);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g))links.push(m[1]);
 }
}
for(const c of story.topic_source_claims){assert(secIDs.has(c.section_id));assert(c.source_keys.length>=2&&c.source_keys.every(k=>sourceKeys.has(k)),c.section_id);}
const unique=[...new Set(links)];assert.equal(unique.length,81);
assert.deepEqual(new Set(unique),new Set(topic.event_ids));
assert.equal(unique.filter(k=>k.startsWith('E19-T48-')).length,71);
const decades=[1840,1860,1870,1880];const chronicles=new Map(decades.map(y=>[y,load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json')]));
const eventByID=new Map([...chronicles.values()].flatMap(c=>c.events.map(e=>[e.id,e])));
for(const k of unique)assert(eventByID.has(k),'broken clickable history event '+k);
for(const [dec,count] of [[1860,42],[1870,10],[1880,21]]){
 const c=chronicles.get(dec),events=c.events.filter(e=>e.id.startsWith('E19-T48-')),reg=new Set(c.sources.map(s=>s.id));
 assert.equal(events.length,count,dec+' event count');
 for(const e of events){
  assert(e.id.includes(String(e.year)));
  assert(e.source_ids.length>=1&&e.source_ids.every(k=>reg.has(k)),e.id+' unregistered evidence');
  assert(e.research_original_node_ids?.[0]&&/^C(01|02|21|22|49|50)-E/.test(e.research_original_node_ids[0]));
  assert.equal(e.historical_control_boundary_verified,false);
  assert.equal(e.territorial_claim,false);
  assert.equal(e.area_sqkm,null);
 }
 const geo=load('data/nineteenth-century-spatial-'+dec+'-'+(dec+9)+'.geojson');
 const points=geo.features.filter(f=>f.id?.startsWith('t48-nz-'+dec+'-'));
 assert.equal(points.length,({1860:10,1870:2,1880:3})[dec]);
 for(const f of points){
  assert.equal(f.geometry.type,'Point',f.id);
  assert(f.geometry.coordinates[0]>166&&f.geometry.coordinates[0]<180&&f.geometry.coordinates[1]<-34&&f.geometry.coordinates[1]>-48,f.id+' bad NZ geo');
  let p=f.properties;
  assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length);
  assert(p.source_ids.every(k=>reg.has(k)),f.id+' unregistered source');
  assert(p.related_event_ids.length>0&&p.related_event_ids.every(k=>eventByID.has(k)),f.id+' missing story history');
  assert.equal(p.historical_boundary_confirmed,false);
  assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);
  assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
  assert(p.geo_precision.includes('not_historic'),f.id);
 }
}
assert(eventByID.get('E19-T48-1864-C01-E16').description.includes('Rangiaowhia'));
assert(eventByID.get('E19-T48-1865-C01-E24').description.includes('没收'));
assert(eventByID.get('E19-T48-1869-C22-E07').description.includes('120'));
assert(eventByID.get('E19-T48-1869-C50-E04').description.includes('焚'));
assert(eventByID.get('E19-T48-1881-C02-E18').description.includes('1600'));
assert(eventByID.get('E19-T48-1881-C02-E20').description.includes('房屋'));
assert(eventByID.get('E19-T48-1882-C02-E66').description.includes('豁免'));
for(const old of ['E19-T21-BURMA-THREE-WARS-DISPOSSESSION','E19-T10-IRISH-FAMINE-EVICTIONS-ESTATES','E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE'])assert.equal(idx.topics.find(t=>t.id===old)?.status,'published');
console.log('PASS 19C T48 Maori wars: 43 sections / 129 paragraphs / 73 primary sources / 81 verified links (71 new + 10 old) / 73 audited new chronology events / 15 modern named GIS reference points');
