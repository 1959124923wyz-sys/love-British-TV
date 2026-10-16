#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const atlas=read('data/atlas-1580-1589.json');
const regions=read('data/century-violence-regions-1544-1589.geojson');
const followup=read('data/followup-regional-stories-1562-1596.geojson');
const sources=new Map(atlas.sources.map(s=>[s.id,s]));
assert.equal(atlas.events.length,37);
assert.equal(atlas.sources.length,78);
const born=atlas.events.filter(e=>e.id.startsWith('ARM1588-'));
assert.equal(born.length,5);
assert.equal(new Set(born.map(e=>e.id)).size,5);
assert.equal(born.filter(e=>e.lat===null&&e.lng===null).length,1);
assert(born.find(e=>e.id==='ARM1588-SLIGO-OHART-TORTURE').geo_precision.startsWith('unlocated_'));
assert(born.find(e=>e.id==='ARM1588-STREEDAGH-STORM').icon_code==='DOC','storm cannot be mapped as Crown massacre');
assert(born.find(e=>e.id==='ARM1588-STREEDAGH-SHORE-KILLING').icon_code==='REP');
assert(born.find(e=>e.id==='ARM1588-ROSCLOGHER-REFUGE').icon_code==='RES','Gaelic aid needs resistance icon');
assert(born.some(e=>e.id==='ARM1588-CLARE-SPANISHPOINT-EXECUTIONS'&&e.source_ids.length>=2));
assert(atlas.events.filter(e=>e.year<=1587).length===27,'No new incident before the sinking');
assert(atlas.events.filter(e=>e.year<=1588).length===34,'Five 1588 accounts appear only from 1588');
const original=atlas.events.find(e=>e.id==='GAP1588-SLIGO-ARMADA-EXECUTIONS');
assert(original&&original.description.includes('至少700')&&original.description.includes('不可与Streedagh约1,100名'));
for(const e of born){
 assert(e.year===1588&&e.visible_from===1588&&e.start_year===1588&&e.end_year===1588);
 assert(e.source_ids.length&&e.source_ids.every(s=>sources.has(s)),'unregistered evidence '+e.id);
 assert(e.colonial_profit===null&&e.actual_English_land_area_sqkm===null&&e.actual_English_territory_created===false);
 assert(e.historical_control_boundary_verified===false);
 if(e.lat!==null)assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
}
const four=regions.features.filter(f=>f.id.startsWith('ir-armada-1588-'));
assert(regions.features.length>=23,'four earlier 1588 Armada regions persist when later evidence adds unrelated studies');
assert.equal(four.length,4);
for(const f of four){
 const p=f.properties,ring=f.geometry.coordinates[0];
 assert(p.start_year===1588&&p.end_year===1588);
 assert(f.geometry.type==='Polygon'&&ring.length>=5&&JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)));
 assert(p.historical_boundary_confirmed===false&&p.territorial_claim===false&&p.fill_authorized===false);
 assert(p.area_sqkm===null&&p.exclude_from_area_aggregation===true);
 assert(/NOT|not/i.test(p.geometry_provenance));
 assert(p.source_ids.length&&p.source_urls.length&&p.related_event_ids.length);
 assert(p.source_ids.every(s=>sources.has(s)),'unknown region source '+f.id);
 assert(p.source_urls.every(url=>p.source_ids.some(id=>sources.get(id).url===url)),'source url mismatched '+f.id);
 assert(p.related_event_ids.every(id=>atlas.events.some(e=>e.id===id)),'unlinked incident '+f.id);
}
const overview=followup.features.find(f=>f.id==='connacht-armada-survivors-killings-1588-research-region');
assert(overview);
assert(overview.properties.source_ids.length===3);
assert(overview.properties.related_event_ids.includes(original.id));
assert(overview.properties.source_ids.every(id=>sources.has(id)));
assert(overview.properties.historical_boundary_confirmed===false);
assert(overview.properties.area_sqkm===null&&overview.properties.exclude_from_area_aggregation===true);
assert(overview.properties.research_event_not_yet_chapter_atlas===false,'must not leave the now published regional story orphaned');
assert(four.some(f=>f.id==='ir-armada-1588-rosclogher-refuge'&&f.properties.zone_type==='gaelic_refuge_anti_crown_resistance_schematic'));
const app=fs.readFileSync(path.resolve(__dirname,'..','app.js'),'utf8');
const regionGuard=app.match(/centuryData\?\.features\?\.length!==([0-9]+)/);
assert(regionGuard&&Number(regionGuard[1])===regions.features.length,'reader must import all extant study regions');
assert(app.includes("gaelic_refuge_anti_crown_resistance_schematic"));
console.log('PASS: 1588 storm≠royal killings, Irish rescue and Clare executions; five sourced incidents, four local non-sovereign areas, linked older overview');
