#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const tid='E19-T14-SINDH-PUNJAB-AWADH-CONQUEST-EXPROPRIATION';
const article=load('data/stories/serial/e19-t14-sindh-punjab-awadh-conquest-expropriation-1842-1859.json');
const index=load('data/stories/serial/index.json');
const topic=index.topics.find(t=>t.id===tid);
const ledger=load('data/research/19c-t14-existing-event-crosswalk.json');
assert(topic&&article.id===tid,'T14 mother story indexed');
assert(['editorial_review','published'].includes(topic.status));
assert.equal(topic.status,'published','public T14 must not require preview');
assert.equal(topic.publication_review,'approved','T14 needs editorial acceptance');

assert.equal(article.sections.length,29);assert.equal(article.sections.reduce((n,s)=>n+s.paragraphs.length,0),87);
assert(article.sections.flatMap(x=>x.paragraphs).join('').length>5200);
assert.deepEqual(article.sections.reduce((s,x)=>(s[x.narrative_chapter]=(s[x.narrative_chapter]||0)+1,s),{}),{'T14.1':8,'T14.2':10,'T14.3':11});
assert(article.sources.length>=25&&article.sources.length<=50,'sources count');
const sources=new Set(article.sources.map(x=>x.id));
assert.equal(sources.size,article.sources.length,'source IDs unique');
for(const s of article.sources)assert(s.url.startsWith('https://')&&s.access&&s.title&&s.publisher,s.id);
const links=article.sections.flatMap(s=>{
 assert(s.paragraphs.length===3);
 assert(s.source_keys?.length>=1&&s.source_keys.every(k=>sources.has(k)),s.id);
 assert(article.topic_source_claims.some(k=>k.section_id===s.id&&k.source_keys.length),s.id);
 return s.paragraphs.flatMap(p=>[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(z=>z[1]));
});
assert.equal(links.length,51);assert.equal(new Set(links).size,51,'no repeated story links');
assert.deepEqual(new Set(links),new Set(topic.event_ids));assert.deepEqual(new Set(links),new Set(ledger.reused_event_ids));
assert.equal(ledger.new_event_ids.length,0,'T14 reuses audited old child-story records');
const children=['E19-SINDH-ANNEXATION','E19-FIRST-SIKH-WAR-TREATIES','E19-SECOND-SIKH-WAR-ANNEXATION','E19-AWADH-ANNEXATION-AND-LAND'];
const childTopics=index.topics.filter(x=>children.includes(x.id));
assert.equal(childTopics.length,4);
const childEvents=new Set(childTopics.flatMap(x=>x.event_ids));
for(const id of links)assert(childEvents.has(id),'not a previously researched event '+id);
const decades=[load('data/stories/serial/chronology-1840-1849.json'),load('data/stories/serial/chronology-1850-1859.json')];
const actual=new Map(decades.flatMap(d=>d.events.map(e=>[e.id,e])));
for(const id of links){
 assert(actual.has(id),'missing live chronological node '+id);
 assert(actual.get(id).source_ids.length,'event missing source '+id);
}
const g40=load('data/nineteenth-century-spatial-1840-1849.geojson').features;
const g50=load('data/nineteenth-century-spatial-1850-1859.geojson').features;
const gNew=g40.filter(x=>x.id.startsWith('t14-'));
assert.equal(gNew.length,3,'only three verified named-place additions');
assert(gNew.every(x=>x.geometry.type==='Point'));
const sources40=new Set(decades[0].sources.map(s=>s.id));
for(const f of gNew){
 const p=f.properties;
 assert(p.source_ids.length && p.source_ids.every(k=>sources40.has(k)),'map refs to old chronology source '+f.id);
 assert(p.source_urls.length===p.source_ids.length);
 assert(p.related_event_ids.length===1 && childEvents.has(p.related_event_ids[0]));
 assert(p.mapping_method && p.geo_precision.includes('not_'),'place must disclose limited precision '+f.id);
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
}
const awadh=g50.find(f=>f.id==='awadh-kingdom-boundary-1855');
assert(awadh && awadh.geometry.type==='Polygon');
assert.equal(awadh.properties.historical_boundary_confirmed,false);
assert.equal(awadh.properties.fill_authorized,false);
assert.equal(awadh.properties.territorial_claim,false);
assert.equal(awadh.properties.area_sqkm,null);
assert.equal(awadh.properties.exclude_from_area_aggregation,true);
assert.equal(awadh.properties.dash_only,true,'uncertain old Oudh perimeter must be dashed');
assert.equal(awadh.properties.outline_style,'dashed');
const body=article.sections.flatMap(s=>s.paragraphs).join('\n');
for(const term of ['683,522','光之山','凯萨尔巴格','没收','拉合尔','阿瓦德','信德','产权'])assert(body.includes(term),'missing evidence thread '+term);
assert(body.includes('不能')&&body.includes('原始'),'must retain evidence constraints');
for(const x of index.topics.filter(t=>['E19-T05-MORANT-BAY-MARTIAL-LAW-CROWN-COLONY','E19-T37-MAQDALA-EXPEDITION-LOOTING','E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE'].includes(t.id)))assert.equal(x.status,'published','prior releases preserved');
console.log('PASS T14: 29 sections / 87 paragraphs / '+article.sources.length+' sources / 51 pre-existing distinct story links / 3 named-only GIS and dashed historical Awadh outline');
