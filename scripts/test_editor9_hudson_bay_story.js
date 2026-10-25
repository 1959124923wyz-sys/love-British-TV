'use strict';
// Editor9 E6-T10-HBC: archive-backed narrative and chronology/actual sovereignty model.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const registry=load('data/stories/serial/index.json'),topic=registry.topics.find(x=>x.id==='E6-T10-HBC');
assert(topic&&topic.parent_topic_id==='E6-T10'&&topic.status==='published'&&topic.publication_review==='approved');
assert(registry.topics.find(x=>x.id==='E6-T10')?.status==='research_only','Acadia and Newfoundland must remain research');
const story=load(topic.article_file);assert(story.id===topic.id&&story.schema==='atlas-major-story-v1');
assert.equal(story.sections.length,15);assert.equal(story.sources.length,17);assert.equal(story.topic_source_claims.length,15);
assert(story.start_year===1668&&story.end_year===1699&&story.historical_end_year===null);
assert(story.lead.length>130&&story.sections.flatMap(x=>x.paragraphs).join('').length>4500);
const all=new Map(),years=new Map();
for(let d=1600;d<=1690;d+=10){
 const a=load('data/atlas-'+d+'-'+(d+9)+'.json');
 assert.deepEqual(a.colonial_polygons,[],'Do not produce any British political territory solely from 1670 watershed charter');
 years.set(d,a);
 for(const e of a.events){assert(!all.has(e.id),'duplicate event '+e.id);all.set(e.id,e);}
}
const sourceKeys=new Set(story.sources.map(x=>x.id));assert.equal(sourceKeys.size,17);
const links=[],linkedSections=new Set();
for(const s of story.sections){
 assert(/^[一二三四五六七八九十]+、/.test(s.heading),'invalid chapter heading '+s.heading);
 assert(s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(x=>sourceKeys.has(x)));
 assert(s.period_start_year>=1668&&s.period_end_year<=1699);
 for(const p of s.paragraphs){
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,100})\]\]/g)){
   let e=all.get(m[1]);assert(e,'Unknown cited Atlas event '+m[1]);
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(m[2].length>=5&&!/^1[5-9]\d{2}年?$/.test(m[2]),'only natural action links allowed');
   links.push(m[1]);linkedSections.add(s.id);
  }
 }
}
assert.equal(links.length,19);assert.equal(linkedSections.size,15);
assert.deepEqual(new Set(links),new Set(topic.event_ids));
for(const id of ['1660S-E095','1670S-E095','1680S-E094','1680S-E095','1690S-E094']){
 const e=all.get(id),a=years.get(Math.floor(e.year/10)*10);
 assert(e?.research_event_id==='EDITOR9-HBC:'+id);
 assert(e.geo_precision.startsWith('representative_')&&e.geolocation_limit_zh.includes('非事件精确现场'));
 assert(e.source_ids.length===1&&a.sources.some(s=>s.id===e.source_ids[0]&&s.url.startsWith('https://')));
 assert(e.actual_English_land_area_sqkm===null&&e.actual_English_territory_created===false&&e.historical_control_boundary_verified===false);
 assert(e.exclude_point_buffer_from_area_statistics===true);
}
const old=[['1680S-E013',1686],['1680S-E014',1686],['1680S-E015',1686],['1690S-E021',1694],['1690S-E030',1696],['1690S-E036',1697]];
for(const [id,year] of old)assert(all.get(id)?.year===year,'French/English fort shift '+id);
assert(story.sections.find(x=>x.id==='york-1697').paragraphs.join(' ').includes('1696'));
assert(story.sections.find(x=>x.id==='charter-1670').paragraphs.join(' ').includes('原住民'));
assert(story.sources.some(x=>x.url.includes('uwinnipeg.ca')));
assert(story.sources.some(x=>x.url.includes('canadahistory.ca')));
assert(story.sources.some(x=>x.url.includes('parks.canada.ca')));
const sites=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const areas=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(sites.features.length,181);assert.equal(areas.features.length,31);
const pt=sites.features.filter(x=>x.properties.related_story_ids?.includes('E6-T10-HBC'));
assert.equal(pt.length,16);for(const f of pt){const e=all.get(f.properties.related_event_ids[0]);
 assert(e);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert(f.properties.start_year===e.year&&f.properties.display_through_year===e.year);
 assert(f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false&&f.properties.territorial_claim===false);
 assert(f.properties.area_sqkm===null&&f.properties.exclude_from_area_aggregation===true);
}
const env=areas.features.find(x=>x.id==='17c-hbc-1686-three-james-bay-forts-review-box');
assert(env?.geometry.type==='Polygon'&&env.properties.start_year===1686&&env.properties.end_year===1686);
assert.deepEqual(env.properties.anchor_event_ids,['1680S-E013','1680S-E014','1680S-E015']);
assert(env.properties.historical_boundary_confirmed===false&&env.properties.fill_authorized===false&&env.properties.territorial_claim===false);
assert(env.properties.area_sqkm===null&&env.properties.exclude_from_area_aggregation===true);
assert(!areas.features.some(f=>f.properties.related_story_ids?.includes('E6-T10-HBC')&&f.properties.territorial_claim));
for(const yy of [1668,1670,1685,1687,1697])assert(!(env.properties.start_year<=yy&&yy<=env.properties.end_year));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('map.panTo(position,{animate:true'));
for(const func of ['function renderInline(text)','function doubleOpen(item)','function returnToOrigin()'])assert(reader.includes(func));
console.log('PASS HBC 1668-1699: 15 chapters, 17 sources, 19 natural historic links, 5 official-record points, 16 nonmetric cues, one 1686 three-fort reader box, 1694/1696/1697 exact handover order');
