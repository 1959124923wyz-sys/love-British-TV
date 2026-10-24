'use strict';
// Independent Editor10 Newfoundland map-first contract: native Beothuk land != English/French charter.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const reg=load('data/stories/serial/index.json');
const meta=reg.topics.find(t=>t.id==='E6-T10-NEWFOUNDLAND');
assert(meta?.parent_topic_id==='E6-T10'&&meta.status==='published'&&meta.publication_review==='approved');
assert(reg.topics.find(t=>t.id==='E6-T10')?.status==='research_only','mother arc not all covered');
const story=load(meta.article_file);
assert.equal(story.id,meta.id);assert.equal(story.schema,'atlas-major-story-v1');
assert.equal(story.sections.length,16);assert.equal(story.sources.length,20);assert.equal(story.topic_source_claims.length,16);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>5500,'substantive popular history needed');
const keys=new Set(story.sources.map(s=>s.id));assert.equal(keys.size,20);
assert(story.sources.some(s=>s.url.includes('lawfoundation/articles/doc2_1699william.html')));
assert(story.sources.some(s=>s.url.includes('john-guy-letter-1612.php')));
assert(story.sources.some(s=>s.url.includes('baudoin-extracts-1696.php')));
let dates=new Map(),events=new Map();for(let y=1600;y<=1690;y+=10){const a=load('data/atlas-'+y+'-'+(y+9)+'.json');dates.set(y,a);
 assert.deepEqual(a.colonial_polygons,[],'no imaginary English or French sovereignty fill');
 for(let i=0;i<a.events.length;i++){const e=a.events[i];assert(!events.has(e.id),e.id);events.set(e.id,e);
  if(i)assert(a.events[i-1].year<=e.year,'historical event order '+y);
 }}
const required=['1610S-E091','1610S-E092','1620S-E028','1630S-E022','1650S-E094','1660S-E096','1670S-E097','1690S-E099','1690S-E100','1690S-E101','1690S-E102','1690S-E103'];
const links=[];
for(const s of story.sections){
 assert(/^[一二三四五六七八九十]+、/.test(s.heading),s.heading);
 assert(s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k)));
 assert(s.period_start_year>=1600&&s.period_end_year<=1699);
 for(const p of s.paragraphs){assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{4,120})\]\]/g)){
   let e=events.get(m[1]);assert(e,'orphan link '+m[1]);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(!/^1[5-9]\d{2}年?$/.test(m[2]),'only meaningful historical action may be linked');links.push(m[1]);
  }
 }
}
assert.equal(links.length,16);assert.deepEqual(new Set(links),new Set(meta.event_ids));
for(const id of required){
 const e=events.get(id),a=dates.get(Math.floor(e.year/10)*10);
 assert.equal(e.research_event_id,'EDITOR10-NEWFOUNDLAND:'+id);
 assert(e.source_ids.length===1&&a.sources.some(s=>s.id===e.source_ids[0]&&s.url.startsWith('https://')),'source audit '+id);
 assert(e.geolocation_limit_zh.includes('非事件精确现场'));
 assert(e.historical_control_boundary_verified===false&&e.actual_English_territory_created===false);
 assert(e.actual_English_land_area_sqkm===null&&e.exclude_point_buffer_from_area_statistics===true);
}
assert.equal(events.get('1690S-E099').year,1694);
assert.equal(events.get('1690S-E100').year,1696);
assert.equal(events.get('1690S-E103').year,1699);
assert(story.sections.find(s=>s.id==='act-1699').paragraphs.join('').includes('1700年3月25日'));
assert(story.sections.find(s=>s.id==='beothuk-contact-1612').paragraphs.join('').includes('贝奥图克'));
const points=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson'),
 areas=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(points.metadata.feature_count,164);assert.equal(areas.metadata.feature_count,29);
const cues=points.features.filter(f=>f.properties.related_story_ids?.includes(story.id));
assert.equal(cues.length,14);
for(const f of cues){const e=events.get(f.properties.related_event_ids[0]);assert(e);
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);
 assert(f.properties.start_year===e.year&&f.properties.display_through_year===e.year);
 assert(f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false);
 assert(f.properties.area_sqkm===null&&f.properties.territorial_claim===false&&f.properties.exclude_from_area_aggregation===true);
}
const boxes=areas.features.filter(f=>f.properties.related_story_ids?.includes(story.id));
assert.equal(boxes.length,2);
for(const f of boxes){assert.equal(f.geometry.type,'Polygon');
 assert.equal(f.properties.start_year,1696);assert.equal(f.properties.end_year,1696);
 assert(f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false);
 assert(f.properties.territorial_claim===false&&f.properties.area_sqkm===null&&f.properties.exclude_from_area_aggregation===true);
}
const reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8'),
 app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('map.panTo(position,{animate:true'));
for(const s of ['function renderInline(text)','function doubleOpen(item)','function returnToOrigin()'])assert(reader.includes(s));
console.log('PASS NEWFOUNDLAND: 16 narrative chapters; 20 sources; 16 meaningful map links / 14 unique Atlas events; 12 independently attested events, 14 cues and two 1696 nonmetric dashed port frames; Beothuk autonomy preserved.');
