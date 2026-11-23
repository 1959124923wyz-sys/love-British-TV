#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T43-NYASALAND-LAND-CLAIMS-GUNBOATS-ATROCITIES';
const file='data/stories/serial/e19-t43-nyasaland-land-claims-gunboats-atrocities-1891-1896.json';
const story=load(file),registry=load('data/stories/serial/index.json'),topic=registry.topics.find(x=>x.id===id);
assert(topic&&topic.article_file===file&&story.id===id);
assert.equal(story.sections.length,37);
assert.equal(story.sections.reduce((n,x)=>n+x.paragraphs.length,0),111);
assert.equal(story.sources.length,23);assert.equal(story.topic_source_claims.length,37);
assert.deepEqual(story.sections.reduce((a,s)=>(a[s.narrative_chapter]=(a[s.narrative_chapter]||0)+1,a),{}),{'T43.1':11,'T43.2':14,'T43.3':12});
const sourceIds=new Set(story.sources.map(s=>s.id));
const sectionIds=new Set(story.sections.map(s=>s.id));
assert.equal(sourceIds.size,23);assert.equal(sectionIds.size,37);
for(const s of story.sources)assert(s.url.startsWith('https://')&&s.access&&s.id.startsWith('19C-T43-'),s.id);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3);
 assert(s.period_start_year>=1891&&s.period_end_year<=1896);
 assert(s.source_keys.length>0&&s.source_keys.every(k=>sourceIds.has(k)),s.id);
 assert(s.paragraphs.every(p=>p.length>=45),s.id);
 assert(!s.paragraphs.join('').match(/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/),s.id);
}
for(const claim of story.topic_source_claims)assert(sectionIds.has(claim.section_id)&&claim.source_keys.length&&claim.source_keys.every(k=>sourceIds.has(k)));
const links=[...story.sections.flatMap(s=>s.paragraphs).join('\n').matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]);
assert.equal(links.length,37);assert.equal(new Set(links).size,37);
assert.deepEqual(new Set(links),new Set(topic.event_ids));
const cross=load('research/19c/consolidated/T43_CASE_CROSSWALK.json');
assert.equal(cross.case_crosswalk.length,9);
const original=new Set(cross.case_crosswalk.map(x=>x.proposed_id));
const history=load('data/stories/serial/chronology-1890-1899.json');
const registered=new Set(history.sources.map(s=>s.id));
const events=history.events.filter(e=>e.id.startsWith('E19-T43-'));
assert.equal(events.length,37);
let named=0,extra=0,empty=0;
for(const e of events){
 assert(e.year>=1891&&e.year<=1896);
 assert(e.source_ids.length&&e.source_ids.every(s=>sourceIds.has(s)&&registered.has(s)),e.id);
 assert.equal(e.lat,null);assert.equal(e.lng,null);empty++;
 assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);
 assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.area_sqkm,null);
 assert(e.research_original_node_ids?.length===1,e.id);
 if(original.has(e.id))named++;else extra++;
}
assert.equal(named,9);assert.equal(extra,28);assert.equal(empty,37);
assert(links.every(id=>events.some(e=>e.id===id)));
const t22=events.find(x=>x.id==='E19-T43-1895-N22');
const t24=events.find(x=>x.id==='E19-T43-1895-N24');
const t7=events.find(x=>x.id==='E19-T43-1893-N07');
assert(t22.description.includes('燃烧弹')&&t22.description.includes('重大死伤'),'fire and civilian losses primary-source bound');
assert(t24.description.includes('200至300')&&t24.description.includes('殖民方'),'battle death estimate not repurposed as verified civilian count');
assert(t7.description.includes('73张')&&t7.description.includes('66张'),'conflicting land certificate totals kept distinct');
assert(events.find(x=>x.id==='E19-T43-1895-C-X11-E01')?.date_label==='1895-12-04');
const geo=load('data/nineteenth-century-spatial-1890-1899.geojson');
const pts=geo.features.filter(f=>f.id?.startsWith('t43-'));
assert.equal(pts.length,7);
for(const f of pts){
 assert.equal(f.geometry.type,'Point');assert(f.geometry.coordinates.every(Number.isFinite));
 const p=f.properties;
 assert(p.related_event_ids.length===1&&events.some(e=>e.id===p.related_event_ids[0]),f.id);
 assert(p.source_ids.length>=2&&p.source_ids.length===p.source_urls.length);
 assert(p.source_ids.every(x=>registered.has(x)),f.id);
 assert(p.source_urls.every(x=>x.startsWith('https://')),f.id);
 assert.equal(p.exclude_from_area_aggregation,true);assert.equal(p.area_sqkm,null);
 assert.equal(p.territorial_claim,false);assert.equal(p.fill_authorized,false);assert.equal(p.historical_boundary_confirmed,false);
 assert(p.geo_precision.includes('not_historic'));
}
const hasUnverified=geo.features.filter(f=>f.id?.startsWith('t43-')&&(f.geometry.type!=='Point'||f.properties.territorial_claim));
assert.equal(hasUnverified.length,0);
console.log('PASS T43: 37 sections/111 paragraphs/23 source records/37 events (9 original +28 added)/7 named-city GIS/37 historic locations null, scorched towns and land claims with independent casualty caveats');
