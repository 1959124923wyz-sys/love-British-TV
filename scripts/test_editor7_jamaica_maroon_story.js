'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=load('data/stories/serial/index.json'),meta=index.topics.find(x=>x.id==='E6-T08'),story=load('data/stories/serial/e6-t08-jamaica-conquest-maroons.json');
assert(meta?.status==='published'&&meta.publication_review==='approved'&&meta.article_file==='data/stories/serial/e6-t08-jamaica-conquest-maroons.json');
assert.equal(story.id,'E6-T08');assert.equal(story.schema,'atlas-major-story-v1');
assert.equal(story.start_year,1654);assert.equal(story.end_year,1699);
assert.equal(story.historical_end_year,null,'Maroon independence persists beyond 1699');
assert.equal(story.sections.length,14);assert.equal(story.sources.length,15);assert.equal(story.topic_source_claims.length,14);
assert(story.sections.flatMap(x=>x.paragraphs).join('').length>=4500);
const all=new Map(),decades=new Map();
for(let y=1600;y<=1690;y+=10){let a=load('data/atlas-'+y+'-'+(y+9)+'.json');decades.set(y,a);for(const e of a.events){assert(!all.has(e.id),'duplicate ID '+e.id);all.set(e.id,e)}}
const ids=[],src=new Set(story.sources.map(s=>s.id));assert.equal(src.size,15);
for(const s of story.sections){
 assert(/^[一二三四五六七八九十]+、/.test(s.heading));assert(s.source_keys.length&&s.source_keys.every(key=>src.has(key)));
 assert(s.period_start_year>=1654&&s.period_end_year<=1699);
 assert(s.paragraphs.length>=3);
 for(const p of s.paragraphs){
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]]+)\]\]/g)){
   const e=all.get(m[1]);assert(e,'missing canonical event '+m[1]);
   assert(Number.isFinite(e.lng)&&Number.isFinite(e.lat));
   assert(!/^1[5-9]\d{2}(?:年(?:\d{1,2}月(?:\d{1,2}日)?)?)?$/.test(m[2]),'bare year label '+m[2]);
   assert(m[2].length>=5&&m[2].length<=90,'poor event anchor '+m[2]);ids.push(m[1]);
  }
 }
}
assert.equal(ids.length,21);assert.equal(new Set(ids).size,17);
assert.deepEqual(new Set(meta.event_ids),new Set(ids));
for(const id of ['1650S-E018','1650S-E019','1650S-E090','1660S-E090','1660S-E014','1660S-E022','1670S-E066','1670S-E090','1680S-E090','1690S-E012','1690S-E090','1690S-E091'])
 assert(ids.includes(id),'Jamaica chronology missing '+id);
const fresh=['1650S-E090','1660S-E090','1670S-E090','1680S-E090','1690S-E090','1690S-E091'];
for(const id of fresh){const e=all.get(id),a=decades.get(Math.floor(e.year/10)*10);assert(e.source_ids.length===1&&a.sources.some(s=>s.id===e.source_ids[0]&&s.url.startsWith('https://')));
 assert(e.historical_control_boundary_verified===false&&!e.actual_English_territory_created&&e.actual_English_land_area_sqkm===null);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
}
assert.equal(all.get('1650S-E090').year,1658);
assert.equal(all.get('1690S-E091').year,1699);
const nlj=story.sources.find(s=>s.url.includes('nlj.gov.jm/history-notes/'));assert(nlj);
assert(story.sources.some(s=>s.url.endsWith('/laws/jamaica-1699')&&s.access.includes('1716')));
assert(story.sections.find(s=>s.id==='war-1699').paragraphs.join(' ').includes('1723年'));
const regions=load('data/seventeenth-century-regional-studies-1600-1699.geojson'),pts=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
assert.equal(regions.features.length,24);assert.equal(pts.features.length,130);
const mine=pts.features.filter(x=>x.properties.related_story_ids?.includes('E6-T08'));
assert.equal(mine.length,13);
for(const f of mine){const e=all.get(f.properties.related_event_ids[0]);assert(e);
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat],'site must use atlas coordinate, not invented point');
 assert.equal(f.properties.start_year,e.year);assert.equal(f.properties.display_through_year,e.year);
 assert(!f.properties.historical_boundary_confirmed&&!f.properties.fill_authorized&&!f.properties.territorial_claim);
 assert.equal(f.properties.area_sqkm,null);assert(f.properties.exclude_from_area_aggregation);
}
const g=regions.features.find(x=>x.id==='17c-jamaica-rio-nuevo-1658-reading-envelope');
assert(g&&g.geometry.type==='Polygon'&&g.properties.start_year===1658&&g.properties.end_year===1658);
assert(g.properties.mapping_method.includes('NOT an actual controlled territory'));
assert(!g.properties.historical_boundary_confirmed&&!g.properties.fill_authorized&&!g.properties.territorial_claim&&g.properties.area_sqkm===null);
for(const y of [1655,1657,1659,1670,1699])assert(!(g.properties.start_year<=y&&g.properties.end_year>=y));
assert(!JSON.stringify(regions).includes('Nanny Town 1655'));
for(const y of [1600,1610,1620,1630,1640,1650,1660,1670,1680,1690])assert.deepEqual(decades.get(y).colonial_polygons,[]);
const reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8'),bridge=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(reader.includes('function renderInline(text)')&&reader.includes('function doubleOpen(item)'));
assert(bridge.includes('map.panTo(position,{animate:true'));
console.log('PASS Jamaica E6-T08 14 Tudor history chapters, 15 institutional sources, 21 semantic map links/17 events, 13 genuine locality cues, one 1658 nonmetric outline; Maroon freedom not erased');
