'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=load('data/stories/serial/index.json'),topic=index.topics.find(x=>x.id==='E6-T05');
const story=load('data/stories/serial/e6-t05-virginia-powhatan-slavery.json');
assert(topic?.status==='published'&&topic.publication_review==='approved'&&topic.article_file==='data/stories/serial/e6-t05-virginia-powhatan-slavery.json');
assert.equal(story.id,'E6-T05');assert.equal(story.schema,'atlas-major-story-v1');
assert.equal(story.start_year,1606);assert.equal(story.end_year,1677);assert.equal(story.historical_end_year,null);
assert.equal(story.sections.length,14);assert.equal(story.sources.length,15);assert.equal(story.topic_source_claims.length,14);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=5500,'entire narrative may not be reduced to placeholders');
const ev=new Map();
for(let year=1600;year<=1690;year+=10)for(const e of load('data/atlas-'+year+'-'+(year+9)+'.json').events)ev.set(e.id,e);
const used=[],known=new Set(story.sources.map(s=>s.id));
assert.equal(known.size,15);
for(const s of story.sources){assert(s.url.startsWith('https://'));assert(!s.access.includes('placeholder'));}
const numerals=/^[一二三四五六七八九十]+、/;
for(const sect of story.sections){
 assert(numerals.test(sect.heading),'no unnumbered section '+sect.id);
 assert(sect.source_keys.length&&sect.source_keys.every(k=>known.has(k)));
 assert(sect.period_start_year>=story.start_year&&sect.period_end_year<=story.end_year);
 assert(sect.paragraphs.length>=2);
 for(const p of sect.paragraphs){
  assert(!/本轮研究|本轮任务|GIS|地图不应画/.test(p));
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length,'broken event token');
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   const e=ev.get(m[1]);assert(e,'invented event '+m[1]);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(!/^1[5-9]\d{2}(?:年(?:\d{1,2}月(?:\d{1,2}日)?)?)?$/.test(m[2]),'link label is year-only '+m[2]);
   assert(m[2].length>=5&&m[2].length<=90,'nonspecific or too-long anchor '+m[2]);
   used.push(m[1]);
  }
 }
}
assert.equal(used.length,36);assert.equal(new Set(used).size,35);assert.deepEqual(new Set(topic.event_ids),new Set(used));
for(const id of ['1600S-E004','1610S-E002','1610S-E003','1620S-E008','1640S-E008','1640S-E015','1660S-E015','1660S-E035','1670S-E022','1670S-E027'])assert(used.includes(id));
const c=story.topic_source_claims;
assert.equal(new Set(c.map(x=>x.section_id)).size,14);
assert(c.some(x=>x.original_document_page.includes('Hening Statutes at Large vol 1')));
assert(c.some(x=>x.original_document_page.includes('Articles of Peace')));
const sites=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson'),areas=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(sites.features.length,86);assert.equal(areas.features.length,21);
const virginia=sites.features.filter(f=>f.properties.related_story_ids?.includes('E6-T05'));
assert.equal(virginia.length,12);
for(const f of virginia){
 const p=f.properties;const e=ev.get(p.related_event_ids[0]);
 assert(e&&e.year===p.start_year,'atlas canonical year copied');
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat],'event referenced geographic locality must use its known atlas coordinates');
 assert.equal(p.display_through_year,p.start_year);assert(!p.historical_boundary_confirmed&&!p.fill_authorized&&!p.territorial_claim);
 assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
}
const a=areas.features.find(f=>f.id==='17c-va-first-war-jamestown-kecoughtan-1610-study');
assert(a&&a.geometry.type==='Polygon'&&a.properties.start_year===1610&&a.properties.end_year===1610);
assert(!a.properties.territorial_claim&&!a.properties.fill_authorized);
assert.equal(a.properties.area_sqkm,null);
assert(a.properties.mapping_method.includes('NOT a surveyed'));
for(const anchor of a.properties.anchor_places){const e=ev.get(anchor.source_event_id);assert.deepEqual([anchor.lon,anchor.lat],[e.lng,e.lat]);}
for(const y of [1609,1611,1646,1662,1677])assert(!(a.properties.start_year<=y&&y<=a.properties.end_year),'schematic envelope leaked into unsupported year');
for(const y of [1600,1610,1620,1630,1640,1650,1660,1670,1680,1690])assert.equal(load('data/atlas-'+y+'-'+(y+9)+'.json').colonial_polygons.length,0,'cannot convert treaty description into false proven sovereignty polygon');
const js=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(js.includes('function renderInline(text)')&&js.includes('function doubleOpen(item)')&&js.includes('function returnToOrigin()'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');assert(app.includes('map.panTo(position,{animate:true'));
console.log('PASS Virginia-Powhatan E6-T05: 14 chapters/15 published sources/14 audited claims/36 semantic links, 12 source-backed cues, one 1610 schematic reference region; 1646/1677 NOT territorial sovereignty');
