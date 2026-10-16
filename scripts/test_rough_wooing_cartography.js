#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dir=path.resolve(__dirname,'..');
const j=p=>JSON.parse(fs.readFileSync(path.join(dir,p),'utf8'));
const atlas=j('data/atlas-1540-1549.json');
const story=j('data/stories/rough-wooing-anglo-scottish-war-1543-1550.json');
const index=j('data/stories/index.json').stories.find(x=>x.id===story.id);
const area=j('data/early-war-colonial-impact-1544-1575.geojson');
const corridors=j('data/war-front-corridors-1540-1549.geojson');
const officialSources=new Map(atlas.sources.map(x=>[x.id,x]));
const added=atlas.events.filter(e=>/^RW154/.test(e.id));
assert.equal(added.length,10,'exactly ten new named events');
assert.equal(new Set(atlas.events.map(e=>e.id)).size,atlas.events.length);
assert.equal(story.title,'1543—1550年英苏粗暴求婚战争');
assert.equal(index.title,story.title);
assert.equal(new Set(index.event_ids).size,index.event_ids.length);
assert.deepEqual(new Set(index.event_ids),new Set(story.related_event_ids));
assert.equal(added.length,added.filter(x=>x.map_priority===true).length);
for(const e of added){
 assert.ok(story.related_event_ids.includes(e.id),'story not linked to new event '+e.id);
 assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng),'must be named map point');
 assert.ok(e.lat>=55.5&&e.lat<=57&&e.lng>=-4.7&&e.lng<=-2.4,'must land in correct Scottish geography');
 assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.ok(/modern|official/i.test(e.geo_precision+e.position_type));
 assert.ok(e.source_ids.length>=2);
 assert.ok(e.name.length>8&&e.description.length>85);
 for(const id of e.source_ids){
  const source=officialSources.get(id);
  assert.ok(source,'missing source '+id);
  assert.match(source.url,/^https:\/\//);
 }
 assert.ok(story.sections.some(s=>s.paragraphs.some(p=>p.includes('[['+e.id+'|'))),'missing inline article event');
}
assert.equal(area.metadata.feature_count,area.features.length);
const region=area.features.find(f=>f.id==='rough-wooing-prestonpans-dunbar-raid-locality-1544');
const line=corridors.features.find(f=>f.id==='war-reach-edinburgh-to-dunbar-1544-campaign-reference');
assert.ok(region&&line,'new distinct geographic objects needed');
assert.equal(region.geometry.type,'Polygon');
assert.equal(line.geometry.type,'LineString');
assert.deepEqual(region.geometry.coordinates[0][0],region.geometry.coordinates[0].at(-1),'closed schematic ring');
for(const f of [region,line]){
 const p=f.properties;
 assert.equal(p.start_year,1544);assert.equal(p.end_year,1544);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.ok(p.source_urls.length>=2);
 for(const key of p.source_ids)assert.ok(officialSources.has(key),'GIS source missing in chapter: '+key);
 for(const id of p.related_event_ids||[])assert.ok(atlas.events.some(e=>e.id===id),'GIS related event missing: '+id);
}
assert.match(region.properties.mapping_method,/not_surveyed/);
assert.match(line.properties.route_continuity_certainty,/unverified/);
assert.ok(corridors.features.some(f=>f.id==='war-reach-berwick-pinkie-1547'),'do not duplicate / lose original 1547 march');
for(const e of atlas.events.filter(e=>e.id.startsWith('1540S-'))){
 assert.ok(!/^RW154/.test(e.id),'existing legacy event stable');
}
const js=fs.readFileSync(path.join(dir,'app.js'),'utf8');
assert.ok(js.includes('regionalData?.metadata?.feature_count!==regionalData.features.length'),'region size must be schema driven');
console.log('PASS Rough Wooing expansion: 10 points, one already documented 1547 route retained, one new 1544 route and one schematic research region; source/area/year gates passed');
