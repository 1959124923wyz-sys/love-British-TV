'use strict';
// E6-T10-ACADIA: official Parks Canada distinct physical sites, English/Scottish/French changing rule and autonomous Mi'kmaq.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=load('data/stories/serial/index.json'),meta=idx.topics.find(x=>x.id==='E6-T10-ACADIA');
assert(meta&&meta.status==='published'&&meta.parent_topic_id==='E6-T10'&&meta.publication_review==='approved');
assert.equal(idx.topics.find(x=>x.id==='E6-T10')?.status,'research_only','The parent family stays research-only despite completed child topics');
assert(idx.topics.find(x=>x.id==='E6-T10-HBC')?.status==='published','Hudson Bay preserved');
const story=load(meta.article_file);
assert(story.id===meta.id&&story.schema==='atlas-major-story-v1'&&story.start_year===1604&&story.end_year===1699&&story.historical_end_year===null);
assert.equal(story.sections.length,18);assert.equal(story.sources.length,21);assert.equal(story.topic_source_claims.length,18);
assert(story.sections.flatMap(x=>x.paragraphs).join('').length>6200);
const all=new Map(),decades=new Map();for(let y=1600;y<=1690;y+=10){const a=load('data/atlas-'+y+'-'+(y+9)+'.json');decades.set(y,a);assert.deepEqual(a.colonial_polygons,[],'No inferred European province-control polygons');for(const e of a.events){assert(!all.has(e.id),e.id);all.set(e.id,e)}}
const keys=new Set(story.sources.map(s=>s.id));assert.equal(keys.size,21);
let links=[],sections=new Set();for(const s of story.sections){
 assert(/^[一二三四五六七八九十]+、/.test(s.heading),s.heading);
 assert(s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(x=>keys.has(x)));
 assert(s.period_start_year>=1604&&s.period_end_year<=1699);
 for(const p of s.paragraphs){
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,120})\]\]/g)){
   const e=all.get(m[1]);assert(e,'missing published Atlas target '+m[1]);
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(m[2].length>=5&&!/^1[5-9]\d{2}年?$/.test(m[2]),'bare year violates 16C editorial interaction');
   links.push(m[1]);sections.add(s.id);
  }
 }
}
assert.equal(links.length,21);assert.equal(sections.size,18);
assert.deepEqual(new Set(meta.event_ids),new Set(links));
for(const id of ['1600S-E090','1600S-E091','1610S-E090','1640S-E093','1650S-E092','1650S-E093','1670S-E096','1680S-E096','1690S-E095','1690S-E096','1690S-E097','1690S-E098']){
 const e=all.get(id),a=decades.get(Math.floor(e.year/10)*10);
 assert.equal(e?.research_event_id,'EDITOR9-ACADIA:'+id);
 assert(e.geo_precision.startsWith('representative_')&&e.geolocation_limit_zh.includes('非事件精确现场'));
 assert(e.source_ids.length===1&&a.sources.some(s=>s.id===e.source_ids[0]&&s.url.startsWith('https://')),'source '+id);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert(e.actual_English_territory_created===false&&e.historical_control_boundary_verified===false&&e.exclude_point_buffer_from_area_statistics===true);
}
const loc=(id)=>{const e=all.get(id);return [e.lng,e.lat]};
assert.deepEqual(loc('1600S-E091'),[-65.60947,44.71146],'1605 French first Habitation official modern site');
assert.deepEqual(loc('1600S-E005'),[-65.60947,44.71146],'1607 Membertou must be at ORIGINAL Habitation');
assert.deepEqual(loc('1610S-E090'),[-65.60947,44.71146],'1610 Mi’kmaw diplomacy at original Habitation');
assert.deepEqual(loc('1610S-E014'),[-65.60947,44.71146],'1613 Argall burns ORIGINAL Habitation not Fort Anne');
for(const id of ['1620S-E021','1630S-E004','1640S-E093','1650S-E017','1670S-E004','1690S-E095'])assert.deepEqual(loc(id),[-65.51861,44.74185],id+' needs distinct Fort Anne archaeological reference');
assert.equal(all.get('1620S-E006').year,1621);assert.equal(all.get('1620S-E021').year,1629);
assert.equal(all.get('1630S-E004').year,1632);
assert.equal(all.get('1650S-E093').year,1654);
assert.equal(all.get('1670S-E004').year,1670);
assert.equal(all.get('1690S-E095').year,1690);
assert.equal(all.get('1690S-E033').year,1696);
assert.equal(all.get('1690S-E097').year,1696);
assert.equal(all.get('1690S-E098').year,1697);
const raid=story.sections.find(s=>s.id==='phips-1690').paragraphs.join(' ');
assert(raid.includes('劫掠')&&raid.includes('未留下'));
assert(story.sections.find(s=>s.id==='scottish-charles-fort').paragraphs.join(' ').includes('苏格兰'));
assert(story.sections.find(s=>s.id==='ryswick-1697').paragraphs.join(' ').includes('1710年'));
assert(story.sources.some(x=>x.url.includes('archives.novascotia.ca')));
assert(story.sources.some(x=>x.url.includes('biographi.ca')));
assert(story.sources.some(x=>x.url.includes('parks.canada.ca')));
const sites=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const areas=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(sites.features.length,164);assert.equal(areas.features.length,29);
const cues=sites.features.filter(f=>f.properties.related_story_ids?.includes('E6-T10-ACADIA'));
assert.equal(cues.length,20);
for(const f of cues){const e=all.get(f.properties.related_event_ids[0]);assert(e);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);
assert(f.properties.start_year===e.year&&f.properties.display_through_year===e.year&&f.properties.historical_boundary_confirmed===false);
assert(f.properties.fill_authorized===false&&f.properties.territorial_claim===false&&f.properties.area_sqkm===null&&f.properties.exclude_from_area_aggregation===true);
}
const boxes=areas.features.filter(f=>f.properties.related_story_ids?.includes('E6-T10-ACADIA'));
assert.equal(boxes.length,3);assert.deepEqual(boxes.map(f=>f.properties.start_year).sort(),[1629,1690,1696]);
for(const f of boxes){assert.equal(f.geometry.type,'Polygon');assert(f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false&&f.properties.territorial_claim===false);
assert(f.properties.area_sqkm===null&&f.properties.exclude_from_area_aggregation===true);}
const comp=boxes.find(f=>f.properties.start_year===1629);assert.deepEqual(new Set(comp.properties.anchor_event_ids),new Set(['1600S-E091','1620S-E021']));
for(const yr of [1628,1630,1689,1691,1695,1697])assert(!boxes.some(x=>x.properties.start_year<=yr&&yr<=x.properties.end_year));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('map.panTo(position,{animate:true'));
for(const item of ['function renderInline(text)','function doubleOpen(item)','function returnToOrigin()'])assert(reader.includes(item));
console.log('PASS E6-T10-ACADIA: 18 chapters, 21 official sources, 21 semantic links and 20 actual events; 12 new archival events, 20 nonmetric cues, three carefully dated dashed frames, 1605/1629 geographic correction and 1690 transient conquest');