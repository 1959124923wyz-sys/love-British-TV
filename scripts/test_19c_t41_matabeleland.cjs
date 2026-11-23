#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sid='E19-T41-MATABELELAND-CONQUEST-CATTLE-LOOT-CHIMURENGA',sp='data/stories/serial/e19-t41-matabeleland-conquest-cattle-chimurenga-1888-1899.json';
const s=read(sp),index=read('data/stories/serial/index.json'),t=index.topics.find(x=>x.id===sid);
assert(t&&s.id===sid&&t.article_file===sp,'T41 must remain registered with exact article source file');
assert(['editorial_review','published'].includes(t.status));
if(t.status==='published')assert.equal(t.publication_review,'approved');
else assert.equal(t.publication_review,'not_submitted');
assert.equal(s.sections.length,34);assert.equal(s.sections.reduce((n,x)=>n+x.paragraphs.length,0),102);
assert.equal(s.sources.length,24);assert.equal(s.topic_source_claims.length,34);
assert.deepEqual(s.sections.reduce((o,x)=>(o[x.narrative_chapter]=(o[x.narrative_chapter]||0)+1,o),{}),{'T41.1':9,'T41.2':9,'T41.3':16});
const sources=new Set(s.sources.map(x=>x.id)),sect=new Set(s.sections.map(x=>x.id));
assert.equal(sources.size,24);assert.equal(sect.size,34);
for(const x of s.sources)assert(x.id.startsWith('19C-T41-')&&x.title&&x.publisher&&x.url.startsWith('https://')&&x.access);
for(const section of s.sections){
 assert.equal(section.paragraphs.length,3,section.id);
 assert(section.period_start_year>=1888&&section.period_end_year<=1899);
 assert(section.source_keys.length&&section.source_keys.every(k=>sources.has(k)),section.id);
}
for(const x of s.topic_source_claims)assert(sect.has(x.section_id)&&x.source_keys.every(k=>sources.has(k)));
const links=[...s.sections.flatMap(x=>x.paragraphs).join('\n').matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(x=>x[1]);
assert.equal(links.length,37);assert.equal(new Set(links).size,37);
assert.deepEqual(new Set(t.event_ids),new Set(links));
const research=read('research/19c/consolidated/T41_CASE_CROSSWALK.json');
assert.equal(research.case_crosswalk.length,20);const originalIds=new Set(research.case_crosswalk.map(x=>x.original_case_id));
const history=new Map(),specs={1880:0,1890:0};let original=0,extra=0,unlocated=0,points=0;
for(const decade of [1880,1890]){
 const h=read('data/stories/serial/chronology-'+decade+'-'+(decade+9)+'.json'),register=new Set(h.sources.map(x=>x.id));
 const events=h.events.filter(x=>x.id.startsWith('E19-T41-'));specs[decade]=events.length;
 for(const e of events){
  assert(!history.has(e.id)&&e.research_original_node_ids?.length===1,e.id);
  history.set(e.id,e);
  assert.equal(Math.floor(e.year/10)*10,decade);
  assert(e.source_ids.length&&e.source_ids.every(k=>register.has(k)),e.id);
  assert.equal(e.territorial_claim,false);assert.equal(e.historical_control_boundary_verified,false);
  assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
  if(e.research_original_node_ids[0].startsWith('N'))extra++;else{original++;assert(originalIds.has(e.research_original_node_ids[0]));}
  if(e.lat===null||e.lng===null){assert(e.lat===null&&e.lng===null);unlocated++;}
  else{assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
 }
 const map=read('data/nineteenth-century-spatial-'+decade+'-'+(decade+9)+'.geojson');
 for(const f of map.features.filter(x=>x.id?.startsWith('t41-'))){
  points++;assert.equal(f.geometry.type,'Point');const p=f.properties;
  assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length);
  assert(p.source_ids.every(k=>register.has(k))&&p.source_urls.every(x=>x.startsWith('https://')));
  assert(p.related_event_ids.length&&p.related_event_ids.every(k=>history.has(k)));
  assert.equal(p.exclude_from_area_aggregation,true);assert.equal(p.area_sqkm,null);
  assert.equal(p.territorial_claim,false);assert.equal(p.fill_authorized,false);
  assert.equal(p.historical_boundary_confirmed,false);assert(p.geo_precision.includes('not_historic'));
 }
}
assert.equal(history.size,37);assert.equal(original,20);assert.equal(extra,17);
assert.deepEqual(specs,{1880:2,1890:35});assert.equal(points,8);assert.equal(unlocated,28);
assert(links.every(x=>history.has(x)));
assert(history.get('E19-T41-1896-N08').description.includes('没有信息'),'100 explosion deaths only unconfirmed inquiry');
assert(history.get('E19-T41-1895-N06').description.includes('79,500'),'cattle administrative figures kept distinct');
assert(history.get('E19-T41-1897-N15').description.includes('武力'),'Martin forced labour confirmation');
console.log('PASS T41: 34 sections/102 paragraphs/24 sources/37 chronology links (20 original +17 new)/8 city-only GIS/28 unlocated, parliamentary and Oxford evidence, no imaginary colonial polygons');
