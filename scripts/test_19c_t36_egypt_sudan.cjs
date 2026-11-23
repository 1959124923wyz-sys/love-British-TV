#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const tid='E19-T36-EGYPT-SUDAN-BOMBARDMENT-CONQUEST-CONDOMINIUM';
const story=load('data/stories/serial/e19-t36-egypt-sudan-conquest-1875-1899.json'),index=load('data/stories/serial/index.json');
const topic=index.topics.find(t=>t.id===tid);
assert(topic&&story.id===tid);assert.equal(topic.article_file,'data/stories/serial/e19-t36-egypt-sudan-conquest-1875-1899.json');
assert(['editorial_review','published'].includes(topic.status));
assert(['not_submitted','approved'].includes(topic.publication_review));
assert.equal(topic.review_chapter_start,1870);
assert.equal(story.sections.length,24);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),72);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=6000);
assert.equal(story.sources.length,21);assert.equal(story.topic_source_claims.length,24);
assert.deepEqual(story.sections.reduce((a,s)=>(a[s.narrative_chapter]=(a[s.narrative_chapter]||0)+1,a),{}),{'T36.1':10,'T36.2':14});
const reg=new Set(story.sources.map(s=>s.id));assert.equal(reg.size,21);
for(const s of story.sources)assert(s.id.startsWith('19C-T36-')&&s.publisher&&s.title&&s.access&&s.url.startsWith('https://'),s.id);
const sections=new Set(story.sections.map(s=>s.id)),links=[];
assert.equal(sections.size,24);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3,s.id);
 assert(s.source_keys.length>=1&&s.source_keys.every(k=>reg.has(k)),s.id);
 assert(s.period_start_year>=1875&&s.period_end_year<=1899&&s.period_end_year>=s.period_start_year,s.id);
 for(const p of s.paragraphs){assert(!/(本轮研究|本轮任务|本母篇|GIS|地图不应画|下轮补充)/.test(p),s.id);
 links.push(...[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]));}
}
for(const c of story.topic_source_claims)assert(sections.has(c.section_id)&&c.source_keys.length>=1&&c.source_keys.every(k=>reg.has(k)),c.section_id);
const uniq=[...new Set(links)];assert.equal(uniq.length,33);assert.deepEqual(new Set(uniq),new Set(topic.event_ids));
assert(uniq.every(x=>/^E19-T36-\d{4}-C09-E\d+$/.test(x)));
const counts={1870:[4,3],1880:[10,4],1890:[19,9]},ds=[1870,1880,1890];
const hs=new Map(ds.map(d=>[d,load('data/stories/serial/chronology-'+d+'-'+(d+9)+'.json')]));
const all=new Map([...hs.values()].flatMap(h=>h.events.map(e=>[e.id,e])));
for(const id of uniq)assert(all.has(id),'missing event '+id);
let evN=0,geoN=0,unlocated=[];
for(const d of ds){
 const h=hs.get(d),ev=h.events.filter(e=>e.id.startsWith('E19-T36-')),sr=new Set(h.sources.map(s=>s.id));
 assert.equal(ev.length,counts[d][0]);evN+=ev.length;
 for(const e of ev){
  assert.equal(Math.floor(e.year/10)*10,d,e.id);assert(e.source_ids.length>=1&&e.source_ids.every(s=>sr.has(s)),e.id);
  assert(e.research_original_node_ids?.[0]?.startsWith('C09-E'),e.id);
  assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.territorial_claim,false);assert.equal(e.area_sqkm,null);
  if(e.lat==null||e.lng==null){assert.equal(e.lat,null);assert.equal(e.lng,null);unlocated.push(e.id);}
  else assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),e.id);
 }
 const map=load('data/nineteenth-century-spatial-'+d+'-'+(d+9)+'.geojson'),points=map.features.filter(f=>f.id?.startsWith('t36-'));
 assert.equal(points.length,counts[d][1]);geoN+=points.length;
 for(const f of points){
  assert.equal(f.geometry.type,'Point');
  const [lon,lat]=f.geometry.coordinates;assert(Number.isFinite(lon)&&Number.isFinite(lat)&&lon>=-15&&lon<=34&&lat>=8&&lat<=52,f.id);
  const p=f.properties;assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length,f.id);
  assert(p.source_ids.every(s=>sr.has(s))&&p.source_urls.every(url=>url.startsWith('https://')),f.id);
  assert(p.related_event_ids.length&&p.related_event_ids.every(id=>all.has(id)),f.id);
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
  assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
  assert(p.geo_precision.includes('not_historic'),f.id);
 }
}
assert.equal(evN,33);assert.equal(geoN,16);
assert.deepEqual(new Set(unlocated),new Set(['E19-T36-1897-C09-E25','E19-T36-1898-C09-E06','E19-T36-1898-C09-E08']));
assert(all.get('E19-T36-1898-C09-E07').description.includes('毁'));
assert(all.get('E19-T36-1899-C09-E13').description.includes('10,600'));
assert(all.get('E19-T36-1885-C09-E17').description.includes('8494937'));
assert(all.get('E19-T36-1899-C09-E11').source_ids.includes('19C-T36-D14'));
assert(index.topics.some(t=>t.id==='E19-T34-GOLD-COAST-ASANTE-CONQUEST-LAND-GOLD'&&t.status==='published'));
console.log('PASS T36 Egypt-Sudan: 24 sections / 72 paragraphs / 21 sources / 33 case-linked chronology / 16 city GIS anchors / 3 unlocated / no fake borders');
