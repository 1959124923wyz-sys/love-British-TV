#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const storyPath='data/stories/serial/e19-t42-basotho-cattle-disarmament-southern-protectorates-1852-1890.json';
const story=load(storyPath),index=load('data/stories/serial/index.json');
const id='E19-T42-BASOTHO-CATTLE-DISARMAMENT-SOUTHERN-PROTECTORATES';
const topic=index.topics.find(x=>x.id===id);
assert(topic&&topic.article_file===storyPath&&story.id===id,'T42 single registered story');
assert.equal(story.sections.length,20);assert.equal(story.sections.reduce((n,x)=>n+x.paragraphs.length,0),60);
assert.equal(story.sources.length,27);assert.equal(story.topic_source_claims.length,20);
const sources=new Set(story.sources.map(x=>x.id));
assert.equal(sources.size,27);
for(const x of story.sources)assert(x.id.startsWith('19C-T42-')&&x.url.startsWith('https://')&&x.access);
const sectionIds=new Set(story.sections.map(x=>x.id));
assert.equal(sectionIds.size,20);
for(const section of story.sections){
 assert.equal(section.paragraphs.length,3,section.id);
 assert(section.period_start_year>=1852&&section.period_end_year<=1890&&section.period_start_year<=section.period_end_year);
 assert(section.source_keys.length&&section.source_keys.every(id=>sources.has(id)));
}
for(const x of story.topic_source_claims)assert(sectionIds.has(x.section_id)&&x.source_keys.every(k=>sources.has(k)));
const body=story.sections.flatMap(x=>x.paragraphs).join('\n');
const links=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(x=>x[1]);
assert.equal(links.length,27);
assert.equal(new Set(links).size,20);
assert.deepEqual(new Set(topic.event_ids),new Set(links));
const cross=load('research/19c/consolidated/T42_CASE_CROSSWALK.json');
assert.equal(cross.case_crosswalk.length,16);
const cases=new Set(cross.case_crosswalk.map(e=>e.candidate_id));
const found=new Map(),actualCount={1850:0,1870:0,1880:0,1890:0};
let sourcesValidated=0;
for(const decade of [1850,1870,1880,1890]){
 const c=load('data/stories/serial/chronology-'+decade+'-'+(decade+9)+'.json');
 const reg=new Set(c.sources.map(x=>x.id));
 const events=c.events.filter(e=>e.id.startsWith('E19-T42-'));
 actualCount[decade]=events.length;
 for(const e of events){
  assert(!found.has(e.id)&&e.year>=decade&&e.year<decade+10,e.id);
  assert(e.source_ids.length&&e.source_ids.every(k=>reg.has(k)),e.id);
  assert(e.source_ids.every(k=>sources.has(k)),e.id);
  assert.strictEqual(e.lat,null);assert.strictEqual(e.lng,null);
  assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);assert.equal(e.territorial_claim,false);
  assert.equal(e.historical_control_boundary_verified,false);
  found.set(e.id,e);sourcesValidated++;
 }
}
assert.deepEqual(actualCount,{1850:6,1870:2,1880:11,1890:1});
assert.equal(found.size,20);
assert.equal([...found.keys()].filter(id=>cases.has(id)).length,16);
assert.equal([...found.keys()].filter(id=>!cases.has(id)).length,4);
assert(links.every(id=>found.has(id)));
assert(found.get('E19-T42-1852-C71-E03').description.includes('4,500'),'1852 captured cattle recorded');
assert(found.get('E19-T42-1881-C14-E04').description.includes('5,000'),'1881 proposed fine separate from amount captured');
let points=0;
for(const decade of [1870,1880,1890]){
 const map=load('data/nineteenth-century-spatial-'+decade+'-'+(decade+9)+'.geojson');
 const reg=new Set(load('data/stories/serial/chronology-'+decade+'-'+(decade+9)+'.json').sources.map(s=>s.id));
 for(const f of map.features.filter(x=>x.id?.startsWith('t42-'))){
  points++;
  assert.equal(f.geometry.type,'Point');assert.equal(f.geometry.coordinates.length,2);
  assert(f.geometry.coordinates.every(Number.isFinite));
  const p=f.properties;
  assert(p.source_ids.length>=2&&p.source_ids.every(k=>reg.has(k)));
  assert.equal(p.source_ids.length,p.source_urls.length);
  assert(p.related_event_ids.length&&p.related_event_ids.every(k=>found.has(k)));
  assert.equal(p.exclude_from_area_aggregation,true);
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.territorial_claim,false);
  assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);
  assert(p.geo_precision.includes('not_historic'));
 }
}
assert.equal(points,6);
assert(story.lead.includes('4,500')&&story.lead.includes('5,000'));
console.log('PASS T42: 20 sections, 60 paras, 27 sources, 20 unique events (16+4), 27 article links, six named-city map points; no invented control areas');
