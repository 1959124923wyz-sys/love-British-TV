'use strict';
// E6-T14-NAV: law dates, human costs, English/Dutch diplomacy and nonmetric map references.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=load('data/stories/serial/index.json'),meta=idx.topics.find(x=>x.id==='E6-T14-NAV');
assert(meta?.parent_topic_id==='E6-T14'&&meta.status==='published'&&meta.publication_review==='approved');
assert(idx.topics.find(x=>x.id==='E6-T14')?.status==='research_only','broader privateer case docket remains research');
const d=load(meta.article_file);
assert(d.id===meta.id&&d.schema==='atlas-major-story-v1'&&d.start_year===1651&&d.end_year===1699&&d.historical_end_year===null);
assert.equal(d.sections.length,16);assert.equal(d.sources.length,23);assert.equal(d.topic_source_claims.length,16);
assert(d.sections.flatMap(s=>s.paragraphs).join('').length>5000);
const keys=new Set(d.sources.map(s=>s.id));assert.equal(keys.size,23);
assert(d.sources.some(s=>s.url.includes('legislation.gov.uk/aep/Will3/7-8/22')));
assert(d.sources.some(s=>s.url.includes('rmg.co.uk/collections/objects/')));
assert(d.sources.some(s=>s.url.includes('nationaalarchief.nl')));
const all=new Map(),bydec=new Map();
for(let decade=1600;decade<=1690;decade+=10){const a=load('data/atlas-'+decade+'-'+(decade+9)+'.json');
 assert.deepEqual(a.colonial_polygons,[],'none of the naval battles creates sovereign sea polygons');
 bydec.set(decade,a);
 for(let i=0;i<a.events.length;i++){let e=a.events[i];assert(!all.has(e.id));all.set(e.id,e);
  if(i)assert(a.events[i-1].year<=e.year,'chronological sorting in '+decade);}
}
const added=['1650S-E120','1660S-E120','1660S-E121','1670S-E120','1670S-E121','1670S-E122','1680S-E120','1690S-E120','1690S-E121'];
for(const id of added){let e=all.get(id);assert(e,'required independent event '+id);
 assert(e.research_event_id==='EDITOR11-NAVIGATION:'+id);
 assert(e.geo_precision?.startsWith('representative_')&&e.geolocation_limit_zh.includes('非事件精确现场'));
 assert(e.historical_control_boundary_verified===false&&e.actual_English_land_area_sqkm===null);
 assert(e.actual_English_territory_created===false&&e.representative_map_point===true);
 const dec=bydec.get(Math.floor(e.year/10)*10);
 assert(e.source_ids.length>0&&e.source_ids.every(s=>dec.sources.some(x=>x.id===s&&x.url.startsWith('https://'))));
}
const links=[];for(const s of d.sections){
 assert(/^[一二三四五六七八九十]+、/.test(s.heading),s.heading);
 assert(s.paragraphs.length>=3&&s.source_keys.length>=2&&s.source_keys.every(k=>keys.has(k)));
 assert(s.period_start_year>=1651&&s.period_end_year<=1699);
 for(const p of s.paragraphs){
  assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
  for(const match of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{4,90})\]\]/g)){let e=all.get(match[1]);assert(e,'orphan link '+match[1]);
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert(!/^1[5-9]\d{2}年?$/.test(match[2]));
   links.push(match[1]);}
 }
}
assert.equal(links.length,24);assert.deepEqual(new Set(links),new Set(meta.event_ids));
const articleText=d.sections.flatMap(s=>s.paragraphs).join(' ');
for(const required of ['[[1660S-E037|','[[1670S-E010|','[[1670S-E014|','[[1690S-E120|','[[1690S-E121|'])assert(articleText.includes(required),required);
assert(articleText.includes('1698年3月25日'));
const geo=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const regions=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(geo.features.length,191);assert.equal(geo.metadata.feature_count,191);
assert.equal(regions.features.length,32);assert.equal(regions.metadata.feature_count,32);
const pts=geo.features.filter(f=>f.properties.related_story_ids?.includes('E6-T14-NAV'));
assert.equal(pts.length,9);assert.deepEqual(new Set(pts.flatMap(p=>p.properties.related_event_ids)),new Set(added));
for(const cue of pts){let e=all.get(cue.properties.related_event_ids[0]);assert.deepEqual(cue.geometry.coordinates,[e.lng,e.lat]);
 assert(cue.properties.start_year===e.year&&cue.properties.display_through_year===e.year);
 assert(cue.properties.mapping_method.includes('screen-pixel'));
 assert(cue.properties.historical_boundary_confirmed===false&&cue.properties.area_sqkm===null&&cue.properties.territorial_claim===false);}
const ms=regions.features.filter(f=>f.properties.related_story_ids?.includes('E6-T14-NAV'));assert.equal(ms.length,1);
const box=ms[0];assert(box.id.includes('medway')&&box.properties.start_year===1667&&box.properties.end_year===1667);
assert(box.properties.related_event_ids.includes('1660S-E037'));assert(box.properties.fill_authorized===false&&box.properties.territorial_claim===false&&box.properties.area_sqkm===null);
console.log('PASS Navigation Acts and Anglo-Dutch Wars: 16 chapters, 23 cited records, 24 inline map actions, 9 institution-linked Atlas events, 9 pixel cues, 1 nonmetric 1667 Medway dashed study frame.');
