#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const story=load('data/stories/serial/e19-t46-australian-frontier-land-violence-1829-1897.json');
const meta=load('data/stories/serial/index.json').topics.find(x=>x.id===story.id);
const ledger=load('data/research/19c-t46-editorial-event-ledger.json');
const newEvents=load('data/research/19c-t46-new-chronology-events.json').events;
assert(meta&&meta.status==='editorial_review'&&meta.publication_review==='not_submitted','This project is a historical editorial preview, not final formal approval');
assert.equal(story.sections.length,25);
assert.equal(story.sources.length,48);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>6000);
assert.deepEqual(story.sections.reduce((m,s)=>(m[s.narrative_chapter]=(m[s.narrative_chapter]||0)+1,m),{}),{'T46.1':6,'T46.2':6,'T46.3':5,'T46.4':4,'T46.5':4});
const refs=new Set(story.sources.map(s=>s.id));assert.equal(refs.size,48);
for(const s of story.sources)assert(s.url.startsWith('https://')&&s.publisher&&s.access);
const exp=new Set(ledger.event_ids);
assert.equal(exp.size,39);
assert.equal(ledger.reused_event_ids.length,10);
assert.equal(ledger.new_event_ids.length,29);
assert.equal(newEvents.length,29);
const links=story.sections.flatMap(sec=>{
 assert(sec.source_keys.length&&sec.source_keys.every(s=>refs.has(s)),sec.id);
 assert(story.topic_source_claims.some(x=>x.section_id===sec.id&&x.source_keys.length),sec.id+' claim');
 return sec.paragraphs.flatMap(p=>[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,100})\]\]/g)].map(x=>x[1]));
});
assert.equal(links.length,39,'39 independent story-map links');
assert.deepEqual(new Set(links),exp);
assert.deepEqual(new Set(meta.event_ids),exp);
const all=new Map(),sourceSets=new Map(),gis=[];
for(const dec of [1820,1830,1840,1850,1860,1870,1880,1890]){
 const ch=load('data/stories/serial/chronology-'+dec+'-'+(dec+9)+'.json');
 const pool=new Set(ch.sources.map(s=>s.id));sourceSets.set(dec,pool);
 assert.equal(ch.events.length,new Set(ch.events.map(e=>e.id)).size,'duplicate chronology '+dec);
 for(const e of ch.events.filter(x=>exp.has(x.id))){
  assert(!all.has(e.id),'duplicate across decades '+e.id);all.set(e.id,e);
  assert(e.source_ids?.length&&e.source_ids.every(s=>pool.has(s)),e.id+' missing chronology source');
  assert(e.year>=dec&&e.year<dec+10,e.id+' wrong decade');
  assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
 }
 const features=load('data/nineteenth-century-spatial-'+dec+'-'+(dec+9)+'.geojson').features;
 for(const f of features.filter(x=>x.id.startsWith('t46-'))){
  const p=f.properties;gis.push(f);
  assert(p.start_year>=dec&&p.end_year<dec+10,'wrong GIS decade '+f.id);
  assert(p.related_event_ids?.length&&p.related_event_ids.every(id=>all.has(id)||ch.events.some(e=>e.id===id)),'unlinked GIS '+f.id);
  assert(p.source_ids?.length&&p.source_ids.every(k=>pool.has(k)),'unregistered GIS source '+f.id);
  assert(p.source_urls.length&&p.source_urls.every(x=>x.startsWith('https://')));
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
  assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
  assert(p.mapping_method&&p.named_anchors?.length&&p.geo_precision);
  assert(!/(GIS|原图|配准|地图边界|坐标示意|不构成|仅供参考)/.test(p.summary_zh),'map reader-copy contamination '+f.id);
  if(f.geometry.type==='Point'){
   assert.equal(f.geometry.coordinates.length,2);
   assert(Math.abs(f.geometry.coordinates[0])<=180&&Math.abs(f.geometry.coordinates[1])<=90);
  }else{
   assert.equal(f.geometry.type,'LineString');assert.equal(p.dash_only,true);assert.equal(p.outline_style,'dashed');assert.equal(f.geometry.coordinates.length,2);
  }
 }
}
assert.deepEqual(new Set(all.keys()),exp,'each of 39 links resolves to the real decade chronology');
assert.deepEqual(new Set(newEvents.map(x=>x.id)),new Set(ledger.new_event_ids));
assert.equal(gis.length,17);
assert.equal(gis.filter(x=>x.geometry.type==='Point').length,16);
assert.equal(gis.filter(x=>x.geometry.type==='LineString').length,1);
assert.equal(gis.filter(x=>x.geometry.type==='Polygon').length,0);
assert.equal(all.get('E19-T46-1868-FLYING-FOAM-KING-BAY').lat,null,'site-sensitive King Bay massacre not GPS fabricated');
assert.equal(all.get('E19-T46-1874-BARROW-REPRISALS').lat,null,'Kaytetye reprisal killing sites not fabricated');
assert.equal(all.get('E19-T46-1897-TUNNEL').lat,null,'Tunnel Creek death spot not substituted from national park location');
assert(gis.some(x=>x.id==='t46-roebourne-murujuga-1868'&&x.properties.dash_only===true));
const notice=load('data/stories/serial/index.json').topics;
for(const t of ['E19-T37-MAQDALA-EXPEDITION-LOOTING'])assert(notice.some(x=>x.id===t&&x.status==='published'),'do not alter released T37');
for(const t of ['E19-T15-INDIA-1857-REPRISALS','E19-T26-OPIUM-WARS-CHINA-TREATY-PORTS'])if(notice.find(x=>x.id===t))assert.equal(notice.find(x=>x.id===t).status,'editorial_review','never prematurely approve unrelated T15/T26');
console.log('PASS T46 preview: 25 sections, 48 sources, 39 unique live links (29 new, 10 reused), 17 GIS (16 named heritage references / 1 dashed endpoint line), all 5 chapters and 1829-1897 chronology, no invented territories');
