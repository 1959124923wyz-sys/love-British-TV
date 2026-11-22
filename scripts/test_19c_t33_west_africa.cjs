#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T33-LAGOS-NIGER-BENIN-COMPANY-CONQUEST';
const story=load('data/stories/serial/e19-t33-lagos-niger-benin-conquest-1851-1899.json');
const index=load('data/stories/serial/index.json'),entry=index.topics.find(t=>t.id===id);
assert(entry&&entry.article_file.endsWith('e19-t33-lagos-niger-benin-conquest-1851-1899.json'));
assert(['editorial_review','published'].includes(entry.status));
assert(['not_submitted','approved'].includes(entry.publication_review));
assert.equal(story.id,id);assert.equal(story.sections.length,26);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),78);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>10000);
assert.equal(story.sources.length,39);assert.equal(story.topic_source_claims.length,26);
assert.deepEqual(story.sections.reduce((o,s)=>(o[s.narrative_chapter]=(o[s.narrative_chapter]||0)+1,o),{}),{'T33.1':6,'T33.2':13,'T33.3':7});
const reg=new Set(story.sources.map(s=>s.id));
assert.equal(reg.size,39);
for(const s of story.sources)assert(s.id.startsWith('19C-T33-')&&s.publisher&&s.title&&s.url.startsWith('https://')&&s.access,s.id);
let links=[];const sectionIds=new Set(story.sections.map(s=>s.id));assert.equal(sectionIds.size,26);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3,s.id);
 assert(s.source_keys.length>=2&&s.source_keys.every(k=>reg.has(k)),s.id);
 assert(s.period_start_year>=1851&&s.period_end_year<=1899,s.id);
 for(const p of s.paragraphs){
  assert(!/(本轮研究|本轮任务|本母篇|GIS|地图不应画|不为.*编造坐标|下轮补充)/.test(p),'editorial text '+s.id);
  links.push(...[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]));
 }
}
for(const c of story.topic_source_claims)assert(sectionIds.has(c.section_id)&&c.source_keys.every(k=>reg.has(k)),c.section_id);
const uniq=[...new Set(links)];
assert.equal(uniq.length,39);
assert.deepEqual(new Set(uniq),new Set(entry.event_ids));
assert.equal(uniq.filter(x=>x.startsWith('E19-T33-')).length,26);
assert.equal(uniq.filter(x=>x.startsWith('E19-BEN-')).length,13);
const decades=[1850,1860,1870,1880,1890];
const hist=new Map(decades.map(d=>[d,load('data/stories/serial/chronology-'+d+'-'+(d+9)+'.json')]));
const lookup=new Map([...hist.values()].flatMap(h=>h.events.map(e=>[e.id,e])));
for(const x of uniq)assert(lookup.has(x),'unresolved click event '+x);
const counts={1850:[2,1],1860:[2,1],1870:[0,1],1880:[7,5],1890:[15,9]};
let pts=0,evCount=0;
for(const d of decades){
 const c=hist.get(d),a=c.events.filter(e=>e.id.startsWith('E19-T33-')),r=new Set(c.sources.map(s=>s.id));
 assert.equal(a.length,counts[d][0],d+' event count');
 for(const e of a){assert(e.source_ids.length>=1&&e.source_ids.every(k=>r.has(k)),e.id);
 assert(e.research_original_node_ids?.[0]?.startsWith('C'),e.id);
 assert.equal(e.area_sqkm,null);
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.territorial_claim,false);
 if(e.lat==null||e.lng==null)assert(['E19-T33-1885-SOKOTO-TREATY','E19-T33-1894-EBROHIMI-BLOCKADE','E19-T33-1894-EBROHIMI-FALL','E19-T33-1894-NANA-CONFISCATION'].includes(e.id),'unexplained blank map '+e.id);
 else assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),e.id);
 }
 evCount+=a.length;
 const geo=load('data/nineteenth-century-spatial-'+d+'-'+(d+9)+'.geojson');
 const features=geo.features.filter(f=>f.id?.startsWith('t33-'));
 assert.equal(features.length,counts[d][1],d+' feature count');pts+=features.length;
 for(const f of features){
  assert.equal(f.geometry.type,'Point',f.id);
  const [lng,lat]=f.geometry.coordinates;
  assert(Number.isFinite(lng)&&Number.isFinite(lat)&&Math.abs(lng)<20&&lat>3&&lat<55,f.id);
  const p=f.properties;
  assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length,f.id);
  assert(p.source_urls.every(u=>u.startsWith('https://')),f.id);
  assert(p.source_ids.every(x=>r.has(x)),f.id);
  assert(p.related_event_ids.length&&p.related_event_ids.every(x=>lookup.has(x)),f.id);
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
  assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);
  assert.equal(p.exclude_from_area_aggregation,true);
  assert(p.geo_precision.includes('not_historic'),f.id);
 }
}
assert.equal(evCount,26);assert.equal(pts,17);
assert(lookup.get('E19-T33-1899-NIGER-FUND').description.includes('£865,000'));
assert(lookup.get('E19-T33-1892-IJEBU-ODE').description.includes('非战地'));
assert(lookup.get('E19-T33-1894-EBROHIMI-FALL').lat===null);
assert(index.topics.some(t=>t.id==='E19-BENIN-PALACE-LOOTING'));
console.log('PASS 19C T33: 26 sections, 78 paragraphs, 39 evidence sources, 39 linked events (26 new / 13 reused), 17 sourced named GIS points, 0 fabricated colonial polygons');
