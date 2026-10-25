'use strict';
// Editor10 E6-T04-DARIEN: national institutional sources, Guna treaty and interruption of Scottish settlement.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=load('data/stories/serial/index.json');
const meta=idx.topics.find(x=>x.id==='E6-T04-DARIEN');
assert(meta?.parent_topic_id==='E6-T04'&&meta.status==='published'&&meta.publication_review==='approved');
assert(idx.topics.find(x=>x.id==='E6-T04').status==='research_only','Scottish larger century incomplete');
const art=load(meta.article_file);
assert(art.schema==='atlas-major-story-v1'&&art.id===meta.id&&art.start_year===1695&&art.end_year===1699&&art.historical_end_year===null);
assert(art.sections.length===16&&art.sources.length===15&&art.topic_source_claims.length===16);
assert(art.sections.flatMap(s=>s.paragraphs).join('').length>5300,'complete readable historical story');
const keys=new Set(art.sources.map(x=>x.id));assert(keys.size===15);
for(const suffix of ['rps.ac.uk','nls.uk','nms.ac.uk','pares.cultura.gob.es','cia.gov'])assert(art.sources.some(x=>x.url.includes(suffix)),suffix);
const a=load('data/atlas-1690-1699.json'),events=new Map(a.events.map(e=>[e.id,e]));
assert.equal(events.size,a.events.length);assert.deepEqual(a.colonial_polygons,[],'historically unverified Guna / Spanish / Scottish land border not allowed');
const newIds=Array.from({length:8},(_,i)=>'1690S-E'+(122+i));
const links=[];
for(const s of art.sections){
 assert(/^[一二三四五六七八九十]+、/.test(s.heading),s.heading);
 assert(s.paragraphs.length===3&&s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k)));
 assert(s.period_start_year>=1695&&s.period_end_year<=1699);
 for(const p of s.paragraphs){
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{4,120})\]\]/g)){
   const e=events.get(m[1]);assert(e,'missing Atlas target '+m[1]);
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
   assert(!/^1[5-9]\d{2}年?$/.test(m[2]));
   links.push(m[1]);
  }
 }
}
assert(links.length===15,'all major stages must link meaningful real event actions');
assert.deepEqual(new Set(links),new Set(meta.event_ids));
for(const id of newIds){const e=events.get(id);assert(e&&e.research_event_id==='EDITOR10-DARIEN:'+id);
 assert(e.year===1698||e.year===1699);assert(e.representative_map_point===true&&e.geo_precision.startsWith('representative_'));
 assert(e.geolocation_limit_zh.includes('非事件精确现场'));assert(e.geolocation_limit_zh.includes('不表示'));
 assert(e.source_ids.length===1&&a.sources.some(x=>x.id===e.source_ids[0]&&x.url.startsWith('https://')));
 assert(e.actual_English_land_area_sqkm===null&&e.actual_English_territory_created===false&&e.historical_control_boundary_verified===false);
 assert(e.exclude_point_buffer_from_area_statistics===true);
}
assert.equal(events.get('1690S-E123').year,1698);
assert.deepEqual([events.get('1690S-E123').lat,events.get('1690S-E123').lng],[8.916667,-77.7]);
assert.equal(events.get('1690S-E127').year,1699);
assert.equal(events.get('1690S-E129').year,1699);
assert(art.sections.find(x=>x.id==='indigenous-treaty').paragraphs.join('').includes('1699年2月24日'));
assert(art.sections.find(x=>x.id==='collapse').paragraphs.join('').includes('1699年7月'));
assert(art.sections.find(x=>x.id==='second').paragraphs.join('').includes('1699年11月30日'));
assert(!a.events.some(x=>x.year===1699&&x.name.includes('1700年')&&x.research_event_id?.startsWith('EDITOR10-DARIEN')),'do not misdate 1700 siege');
const sites=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const areas=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(sites.features.length,186);assert.equal(sites.metadata.feature_count,186);
assert.equal(areas.features.length,32);assert.equal(areas.metadata.feature_count,32);
let pts=sites.features.filter(x=>x.properties.related_story_ids?.includes(art.id));assert.equal(pts.length,8);
for(let f of pts){let e=events.get(f.properties.related_event_ids[0]);assert(e);
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert(f.properties.start_year===e.year&&f.properties.display_through_year===e.year);
 assert(f.properties.area_sqkm===null&&f.properties.historical_boundary_confirmed===false&&f.properties.territorial_claim===false&&f.properties.exclude_from_area_aggregation===true);
}
let linksGeo=areas.features.filter(x=>x.properties.related_story_ids?.includes(art.id));
assert(linksGeo.length===1&&linksGeo[0].geometry.type==='LineString');
const link=linksGeo[0];assert.deepEqual(link.geometry.coordinates,[[-3.177,55.981],[-77.7,8.916667]]);
assert(link.properties.route_kind.includes('not_measured')&&link.properties.geometry_precision.includes('not_measured'));
assert(link.properties.historical_boundary_confirmed===false&&link.properties.area_sqkm===null&&link.properties.exclude_from_area_aggregation===true);
assert(areas.metadata.total_confirmed_historical_control_polygons===0);
for(const needle of ['function renderInline(text)','function doubleOpen(item)','function returnToOrigin()'])assert(fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8').includes(needle));
console.log('PASS Darien/Guna: 16 paragraphs sections, 15 sources + contextual links, 8 reliable 1698-99 events, 8 annual symbols and 1 dated nonmetric voyage endpoint relation; no 1700 events, no occupation area inferred.');
