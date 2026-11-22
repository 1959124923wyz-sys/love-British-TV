#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T34-GOLD-COAST-ASANTE-CONQUEST-LAND-GOLD';
const story=load('data/stories/serial/e19-t34-gold-coast-asante-conquest-1844-1899.json');
const idx=load('data/stories/serial/index.json'),topic=idx.topics.find(t=>t.id===id);
assert(topic&&story.id===id&&topic.article_file==='data/stories/serial/e19-t34-gold-coast-asante-conquest-1844-1899.json');
assert(['editorial_review','published'].includes(topic.status));
assert(['not_submitted','approved'].includes(topic.publication_review));
assert.equal(topic.review_chapter_start,1840,'draft preview must attach to 1840 decade, not 1844');
assert.equal(story.sections.length,32);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),96);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=7500);
assert.equal(story.sources.length,32);
assert.equal(story.topic_source_claims.length,32);
assert.deepEqual(story.sections.reduce((o,s)=>(o[s.narrative_chapter]=(o[s.narrative_chapter]||0)+1,o),{}),{'T34.1':6,'T34.2':18,'T34.3':8});
const keys=new Set(story.sources.map(s=>s.id));assert.equal(keys.size,32);
for(const s of story.sources)assert(s.id.startsWith('19C-T34-')&&s.title&&s.publisher&&s.url.startsWith('https://')&&s.access,s.id);
const sections=new Set(story.sections.map(s=>s.id)),links=[];
assert.equal(sections.size,32);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3,s.id);
 assert(s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k)),s.id);
 assert(s.period_start_year>=1844&&s.period_end_year<=1899&&s.period_end_year>=s.period_start_year);
 for(const p of s.paragraphs){
  assert(!/(本轮研究|本轮任务|本母篇|下轮补充|GIS|地图不应画|未伪称)/.test(p),'editorial text '+s.id);
  links.push(...[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]));
 }
}
for(const c of story.topic_source_claims)assert(sections.has(c.section_id)&&c.source_keys.length>=2&&c.source_keys.every(k=>keys.has(k)),c.section_id);
const uniq=[...new Set(links)];
assert.equal(uniq.length,35);
assert.deepEqual(new Set(uniq),new Set(topic.event_ids));
assert(uniq.every(x=>/^E19-T34-\d{4}-C(?:06|79|-X0[2-4])-E\d+$/.test(x)));
const decades=[1840,1850,1870,1880,1890],counts={1840:[1,1],1850:[1,1],1870:[12,3],1880:[2,1],1890:[19,7]};
const chron=new Map(decades.map(d=>[d,load('data/stories/serial/chronology-'+d+'-'+(d+9)+'.json')]));
const all=new Map([...chron.values()].flatMap(x=>x.events.map(e=>[e.id,e])));
for(const k of uniq)assert(all.has(k),'broken clickable event '+k);
let totalEvents=0,totalPoints=0,unlocated=[];
for(const d of decades){
 const c=chron.get(d),ev=c.events.filter(e=>e.id.startsWith('E19-T34-')),reg=new Set(c.sources.map(x=>x.id));
 assert.equal(ev.length,counts[d][0],d+' chronology count');
 totalEvents+=ev.length;
 for(const x of ev){
  assert.equal(Math.floor(x.year/10)*10,d,x.id);
  assert(x.source_ids.length>=2&&x.source_ids.every(k=>reg.has(k)),x.id+' dangling source');
  assert(x.research_original_node_ids?.[0]?.startsWith('C'),x.id+' missing original record');
  assert.equal(x.historical_control_boundary_verified,false);
  assert.equal(x.territorial_claim,false);
  assert.equal(x.area_sqkm,null);
  if(x.lat==null||x.lng==null){
   assert.equal(x.lat,null);assert.equal(x.lng,null);unlocated.push(x.id);
  }else assert(Number.isFinite(x.lat)&&Number.isFinite(x.lng),x.id);
 }
 const geo=load('data/nineteenth-century-spatial-'+d+'-'+(d+9)+'.geojson');
 const points=geo.features.filter(f=>f.id?.startsWith('t34-'));assert.equal(points.length,counts[d][1],d+' GIS point count');
 totalPoints+=points.length;
 for(const f of points){
  assert.equal(f.geometry.type,'Point',f.id);
  const [lng,lat]=f.geometry.coordinates;assert(Number.isFinite(lng)&&Number.isFinite(lat)&&Math.abs(lng)<20&&lat>4&&lat<55,f.id);
  const p=f.properties;
  assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length);
  assert(p.source_ids.every(x=>reg.has(x))&&p.source_urls.every(x=>x.startsWith('https://')),f.id);
  assert(p.related_event_ids.length&&p.related_event_ids.every(x=>all.has(x)),f.id);
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
  assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
  assert(p.geo_precision.includes('not_historic'),f.id);
 }
}
assert.equal(totalEvents,35);assert.equal(totalPoints,13);
assert(unlocated.length>=6,'ambiguous territorial and fiscal actions must not be assigned guessed map coordinates');
assert(all.get('E19-T34-1874-C06-E04').description.includes('50,000')||all.get('E19-T34-1874-C06-E04').description.includes('50，000'));
assert(all.get('E19-T34-1896-C06-E30').description.includes('Prempeh'));
assert(all.get('E19-T34-1896-C06-E32').description.includes('Bantama'));
assert(all.get('E19-T34-1897-C79-E05').lat===null,'Akyem unverified mineral concession shall remain unmapped');
assert(idx.topics.some(t=>t.id==='E19-T33-LAGOS-NIGER-BENIN-COMPANY-CONQUEST'&&t.status==='published'),'keep prior T33 publication');
console.log('PASS T34 Gold Coast/Asante: 32 sections, 96 paragraphs, 32 sources, 35 linked historical events, 13 modern named GIS points, 0 fabricated colonial land polygons, '+unlocated.length+' intentionally unlocated');
