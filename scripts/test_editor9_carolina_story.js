'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=load('data/stories/serial/index.json'),topic=index.topics.find(t=>t.id==='E6-T09-CAR');
assert(topic&&topic.parent_topic_id==='E6-T09'&&topic.status==='published'&&topic.publication_review==='approved');
assert(index.topics.find(t=>t.id==='E6-T09')?.status==='research_only','parent with unrelated research is not fully published');
const story=load(topic.article_file);assert.equal(story.schema,'atlas-major-story-v1');assert.equal(story.id,'E6-T09-CAR');
assert.equal(story.sections.length,15);assert.equal(story.sources.length,22);assert.equal(story.topic_source_claims.length,15);
assert(story.start_year===1661&&story.end_year===1699&&story.historical_end_year===null);
assert(story.lead.length>=120&&story.sections.flatMap(s=>s.paragraphs).join('').length>4500);
const all=new Map(),decades=new Map();for(let d=1600;d<=1690;d+=10){
 let a=load('data/atlas-'+d+'-'+(d+9)+'.json');assert.deepEqual(a.colonial_polygons,[]);
 decades.set(d,a);for(const e of a.events){assert(!all.has(e.id),'duplicate '+e.id);all.set(e.id,e);}
}
const sourceKeys=new Set(story.sources.map(s=>s.id));assert.equal(sourceKeys.size,22);
const links=[];let linkedSections=new Set;
for(const sec of story.sections){
 assert(/^[一二三四五六七八九十]+、/.test(sec.heading));assert(sec.paragraphs.length>=3);
 assert(sec.period_start_year>=1661&&sec.period_end_year<=1699);
 assert(sec.source_keys.length>=2&&sec.source_keys.every(x=>sourceKeys.has(x)));
 for(const para of sec.paragraphs){
  assert.equal((para.match(/\[\[/g)||[]).length,(para.match(/\]\]/g)||[]).length);
  for(const m of para.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g)){
   const ev=all.get(m[1]);assert(ev,'Missing canonical event '+m[1]);
   assert(Number.isInteger(ev.year)&&Number.isFinite(ev.lat)&&Number.isFinite(ev.lng));
   assert(m[2].trim().length>=5&&!/^1[5-9]\d{2}年?$/.test(m[2]),'year-only or meaningless link');
   links.push(m[1]);linkedSections.add(sec.id);
  }
 }
}
assert.equal(linkedSections.size,15);assert.equal(links.length,25);
assert.deepEqual(new Set(topic.event_ids),new Set(links));
for(const id of ['1660S-E093','1660S-E094','1670S-E092','1670S-E093','1670S-E094','1680S-E092','1680S-E093','1690S-E092','1690S-E093']){
 const e=all.get(id),d=decades.get(Math.floor(e.year/10)*10);
 assert(e?.research_event_id==='EDITOR9-CAR:'+id);
 assert(e.source_ids.length===1&&d.sources.some(s=>s.id===e.source_ids[0]&&s.url.startsWith('https://')));
 assert(e.geo_precision.startsWith('representative_')&&e.geolocation_limit_zh.includes('非事件精确现场'));
 assert(e.actual_English_land_area_sqkm===null&&!e.actual_English_territory_created&&!e.historical_control_boundary_verified);
 assert(e.exclude_point_buffer_from_area_statistics===true);
}
assert(all.get('1660S-E018').year===1663&&all.get('1660S-E042').year===1669);
assert(all.get('1670S-E002').year===1670&&all.get('1680S-E003').year===1680);
assert(all.get('1680S-E036').year===1680);
const lawA=story.sections.find(s=>s.id==='slave-law-1690').paragraphs.join(' ');
const lawB=story.sections.find(s=>s.id==='1696-slave-law').paragraphs.join(' ');
assert(lawA.includes('领主否决')&&lawB.includes('再次通过'));
assert(story.sections.find(s=>s.id==='constitution').paragraphs.join(' ').includes('从未完整实施'));
assert(story.sources.some(s=>s.url.includes('americanhistory.si.edu')));
assert(story.sources.some(s=>s.url.includes('avalon.law.yale.edu')));
const pts=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson'),areas=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(pts.features.length,186);assert.equal(areas.features.length,32);
const group=pts.features.filter(x=>x.properties.related_story_ids?.includes('E6-T09-CAR'));assert.equal(group.length,15);
for(const f of group){let e=all.get(f.properties.related_event_ids[0]);assert(e);
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);
 assert(f.properties.start_year===e.year&&f.properties.display_through_year===e.year);
 assert(f.properties.historical_boundary_confirmed===false&&f.properties.fill_authorized===false&&f.properties.territorial_claim===false);
 assert(f.properties.exclude_from_area_aggregation&&f.properties.area_sqkm===null);
}
const h=areas.features.find(x=>x.id==='17c-car-1680-charlestown-two-sites-nonmetric-reader');assert(h);
assert(h.geometry.type==='Polygon'&&h.properties.start_year===1680&&h.properties.end_year===1680);
assert.deepEqual(new Set(h.properties.anchor_event_ids),new Set(['1670S-E002','1680S-E003']));
assert(h.properties.historical_boundary_confirmed===false&&h.properties.fill_authorized===false&&h.properties.territorial_claim===false);
assert(h.properties.area_sqkm===null&&h.properties.exclude_from_area_aggregation===true);
assert(!areas.features.some(x=>x.properties.related_story_ids?.includes('E6-T09-CAR')&&x.properties.territorial_claim));
for(const yr of [1670,1679,1681,1690])assert(!(h.properties.start_year<=yr&&yr<=h.properties.end_year));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('map.panTo(position,{animate:true'));
for(const x of ['function renderInline(text)','function doubleOpen(item)','function returnToOrigin()'])assert(reader.includes(x));
console.log('PASS E6-T09-CAR: 15 chapters, 20 institutional sources, 24 historical-action links, 9 source-linked events, 15 nonmetric atlas cues and one 1680 two-site study frame');
