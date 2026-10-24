'use strict';
// E6-T09-NY: historical accountability + actual atlas navigation bindings.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=load('data/stories/serial/index.json'),meta=idx.topics.find(x=>x.id==='E6-T09-NY');
assert(meta?.status==='published'&&meta.publication_review==='approved'&&meta.parent_topic_id==='E6-T09');
assert(idx.topics.find(x=>x.id==='E6-T09')?.status==='research_only','Carolina parent stays under research');
const story=load(meta.article_file);
assert(story.id===meta.id&&story.schema==='atlas-major-story-v1');
assert(story.start_year===1609&&story.end_year===1691&&story.historical_end_year===null);
assert.equal(story.sections.length,14);assert.equal(story.sources.length,15);
assert.equal(story.topic_source_claims.length,14);
assert(story.sections.flatMap(x=>x.paragraphs).join('').length>=4500);
assert(story.lead.length>=120);
const all=new Map(),decades=new Map();
for(let y=1600;y<=1690;y+=10){const a=load('data/atlas-'+y+'-'+(y+9)+'.json');
 assert.deepEqual(a.colonial_polygons,[],'no charter may make an entire English-controlled province polygon');
 decades.set(y,a);for(const e of a.events){assert(!all.has(e.id),'duplicate event '+e.id);all.set(e.id,e);}}
const sourceIds=new Set(story.sources.map(s=>s.id));
assert.equal(sourceIds.size,15);
const linked=[];
for(const s of story.sections){assert(/^[一二三四五六七八九十]+、/.test(s.heading));
 assert(s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(id=>sourceIds.has(id)));
 assert(s.period_start_year>=1609&&s.period_end_year<=1691);
 for(const p of s.paragraphs){
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g)){
   const e=all.get(m[1]);assert(e,'unregistered atlas event '+m[1]);
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(m[2].length>=5&&!/^1[5-9]\d{2}年?$/.test(m[2]),'bad date-only link');
   linked.push(m[1]);
  }
 }
}
assert.equal(linked.length,17);assert.deepEqual(new Set(meta.event_ids),new Set(linked));
for(const id of ['1640S-E090','1640S-E091','1640S-E092','1660S-E091','1660S-E092','1670S-E091','1680S-E091']){
 const e=all.get(id),dec=decades.get(Math.floor(e.year/10)*10);
 assert(e&&e.research_event_id=== 'EDITOR9:'+id,'missing authentic new event '+id);
 assert(e.source_ids.length===1&&dec.sources.some(s=>s.id===e.source_ids[0]&&s.url.startsWith('https://')));
 assert(e.geo_precision.startsWith('representative_'));
 assert(e.geolocation_limit_zh.includes('非事件精确现场'));
 assert(!e.actual_English_territory_created&&!e.historical_control_boundary_verified);
 assert(e.actual_English_land_area_sqkm===null&&e.exclude_point_buffer_from_area_statistics);
}
assert.equal(all.get('1660S-E023').year,1664);
assert.equal(all.get('1670S-E010').year,1673);
assert.equal(all.get('1670S-E014').year,1674);
assert(story.sections.find(s=>s.id==='pavonia-1643').paragraphs.join(' ').includes('荷兰'));
assert(story.sections.find(s=>s.id==='staten-deed').paragraphs.join(' ').includes('1671年5月1日'));
assert(story.sources.some(x=>x.url.includes('nationaalarchief.nl')));
assert(story.sources.some(x=>x.url.includes('findingaids.nysed.gov')));
assert(story.sources.some(x=>x.url.includes('wams.nyhistory.org')));
const pts=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const regions=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(pts.features.length,130);assert.equal(regions.features.length,24);
const cues=pts.features.filter(x=>x.properties.related_story_ids?.includes('E6-T09-NY'));
assert.equal(cues.length,13);
for(const f of cues){const e=all.get(f.properties.related_event_ids[0]);assert(e);
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);
 assert(f.properties.start_year===e.year&&f.properties.display_through_year===e.year);
 assert(f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false&&f.properties.territorial_claim===false);
 assert(f.properties.area_sqkm===null&&f.properties.exclude_from_area_aggregation===true);
}
const box=regions.features.find(x=>x.id==='17c-ny-1643-pavonia-corlears-hook-education-only');
assert(box&&box.geometry.type==='Polygon'&&box.properties.start_year===1643&&box.properties.end_year===1643);
assert.deepEqual(box.properties.anchor_event_ids,['1640S-E090','1640S-E091']);
assert(box.properties.historical_boundary_confirmed===false&&box.properties.fill_authorized===false&&box.properties.territorial_claim===false);
assert(box.properties.area_sqkm===null&&box.properties.exclude_from_area_aggregation===true);
assert(!regions.features.some(x=>x.properties.related_story_ids?.includes('E6-T09-NY')&&x.properties.territorial_claim));
for(const y of [1642,1644,1664,1673,1674,1691])assert(!(box.properties.start_year<=y&&y<=box.properties.end_year));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('map.panTo(position,{animate:true'));
assert(reader.includes('function renderInline(text)')&&reader.includes('function doubleOpen(item)')&&reader.includes('function returnToOrigin()'));
console.log('PASS New Netherland/New York: 14 historical chapters, 15 sources, 17 semantic links/17 real events, 7 extra primary-backed events, 13 named cues, 1 nonmetric Dutch 1643 box');
