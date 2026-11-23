#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const tid='E19-T40-SOUTH-AFRICA-DIAMOND-LABOUR-BOER-WAR',story=load('data/stories/serial/e19-t40-south-africa-mining-labour-war-1866-1899.json');
const idx=load('data/stories/serial/index.json'),topic=idx.topics.find(t=>t.id===tid);
assert(topic&&topic.id===story.id&&topic.article_file==='data/stories/serial/e19-t40-south-africa-mining-labour-war-1866-1899.json');
assert(['editorial_review','published'].includes(topic.status));assert(['not_submitted','approved'].includes(topic.publication_review));assert.equal(topic.review_chapter_start,1860);
assert.equal(story.sections.length,26);assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),78);assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=6000);
assert.equal(story.sources.length,27);assert.equal(story.topic_source_claims.length,26);
assert.deepEqual(story.sections.reduce((o,s)=>(o[s.narrative_chapter]=(o[s.narrative_chapter]||0)+1,o),{}),{'T40.1':15,'T40.2':11});
const refs=new Set(story.sources.map(s=>s.id));assert.equal(refs.size,27);
for(const s of story.sources)assert(s.id.startsWith('19C-T40-')&&s.publisher&&s.title&&s.access&&s.url.startsWith('https://'),s.id);
const sec=new Set(story.sections.map(s=>s.id)),links=[];
assert.equal(sec.size,26);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3,s.id);
 assert(s.source_keys.length>=1&&s.source_keys.every(k=>refs.has(k)),s.id);
 assert(s.period_start_year>=1866&&s.period_end_year<=1899&&s.period_end_year>=s.period_start_year,s.id);
 for(const p of s.paragraphs)links.push(...[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]));
}
for(const s of story.topic_source_claims)assert(sec.has(s.section_id)&&s.source_keys.length>=1&&s.source_keys.every(k=>refs.has(k)),s.section_id);
const distinct=[...new Set(links)];assert.equal(distinct.length,33);assert.deepEqual(new Set(distinct),new Set(topic.event_ids));
assert(distinct.every(k=>/^E19-T40-\d{4}-C(?:\d+|-X\d+)-E\d+$/.test(k)));
assert(!distinct.some(k=>k.includes('1905-C87-E09')),'1905 retrospective Hansard is supporting source, not 19c historical event');
const years=[1860,1870,1880,1890],expected={1860:[1,0],1870:[9,6],1880:[8,3],1890:[15,6]};
const h=new Map(years.map(y=>[y,load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json')]));
const known=new Map([...h.values()].flatMap(d=>d.events.map(x=>[x.id,x])));
for(const x of distinct)assert(known.has(x),'dangling inline link '+x);
let nEvent=0,nPoint=0,nUnlocated=0;
for(const y of years){
 const d=h.get(y),reg=new Set(d.sources.map(s=>s.id)),ev=d.events.filter(e=>e.id.startsWith('E19-T40-'));
 assert.equal(ev.length,expected[y][0],y+' event count');nEvent+=ev.length;
 for(const e of ev){
  assert.equal(Math.floor(e.year/10)*10,y,e.id);assert(e.source_ids.length>=1&&e.source_ids.every(s=>reg.has(s)),e.id);
  assert(e.research_original_node_ids?.[0]?.includes('-E'),e.id);assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.territorial_claim,false);assert.equal(e.area_sqkm,null);
  if(e.lat==null||e.lng==null){assert.equal(e.lat,null);assert.equal(e.lng,null);nUnlocated++;}
  else assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.lat<-25&&e.lng>15&&e.lng<33||e.lat>50&&e.lng<0,e.id);
 }
 const geo=load('data/nineteenth-century-spatial-'+y+'-'+(y+9)+'.geojson'),pts=geo.features.filter(f=>f.id?.startsWith('t40-'));
 assert.equal(pts.length,expected[y][1],y+' GIS points');nPoint+=pts.length;
 for(const f of pts){
  assert.equal(f.geometry.type,'Point',f.id);const [lon,lat]=f.geometry.coordinates;
  assert(Number.isFinite(lon)&&Number.isFinite(lat)&&((lat<-25&&lon>=15&&lon<=33)||(lat>50&&lon<0)),f.id);
  const p=f.properties;assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length,f.id);
  assert(p.source_ids.every(id=>reg.has(id))&&p.source_urls.every(url=>url.startsWith('https://')),f.id);
  assert(p.related_event_ids.length&&p.related_event_ids.every(id=>known.has(id)),f.id);
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);assert(p.geo_precision.includes('not_historic'),f.id);
 }
}
assert.equal(nEvent,33);assert.equal(nPoint,15);assert(nUnlocated>=10);
assert(known.get('E19-T40-1898-C87-E08').description.includes('Davitt'));
assert(known.get('E19-T40-1885-C08-E12').description.includes('工棚'));
assert(known.get('E19-T40-1899-C08-E23').source_ids.includes('19C-T40-D34'));
assert(known.get('E19-T40-1866-C87-E01').lat===null);
assert(idx.topics.some(x=>x.id==='E19-T36-EGYPT-SUDAN-BOMBARDMENT-CONQUEST-CONDOMINIUM'&&x.status==='published'),'keep T36 live');
console.log('PASS T40: 26 sections, 78 paragraphs, 27 evidence sources, 33 original 19c events, 15 sourced GIS points, '+nUnlocated+' unlocated, no fabricated historical border; 1905 afterword kept outside event time series');
