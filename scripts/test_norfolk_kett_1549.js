#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const db=read('data/atlas-1540-1549.json');
const archival=read('research/editorial/BOULOGNE_KETT_ORIGINAL_EVENT_SUMMARIES_20261016.json').events;
const areas=read('data/century-violence-regions-1544-1589.geojson');
const cohort=db.events.filter(e=>e.id==='GAP1549-KETT'||e.id.startsWith('GAP1549-NORFOLK-'));
assert.equal(cohort.length,8,'one preserved Dussindale summary plus seven new discrete Norfolk events');
assert.equal(new Set(cohort.map(e=>e.id)).size,8);
assert(cohort.every(e=>e.year===1549&&e.visible_from===1549&&Number.isFinite(e.lat)&&Number.isFinite(e.lng)));
assert(cohort.every(e=>e.historical_control_boundary_verified===false&&e.actual_English_land_area_sqkm===null));
const sources=new Set(db.sources.map(s=>s.id));
for(const e of cohort)assert(e.source_ids?.length>0&&e.source_ids.every(id=>sources.has(id)),'bad event provenance '+e.id);
const d=cohort.find(e=>e.id==='GAP1549-KETT');
assert(archival['GAP1549-KETT'].description.includes('2,000—3,000')&&d.geo_precision.includes('candidate'),'Keep casualty source note in research archive rather than visible summary');
const resistance=cohort.filter(e=>e.category==='resistance');
const repression=cohort.filter(e=>e.category==='domestic_repression');
assert.equal(resistance.length,3);
assert.equal(repression.length,5,'Royal actions or aftermath must not be conflated with rebel organization');
assert(archival['GAP1549-NORFOLK-EXECUTIONS'].description.includes('不把战场阵亡一概算作处决'),'Retain battle/execution distinction in archival original');
assert(cohort.some(e=>e.id==='GAP1549-NORFOLK-EXECUTIONS'&&e.description.includes('处决部分')));
const norfolk=areas.features.filter(f=>f.id.startsWith('en-kett-1549-'));
assert.equal(norfolk.length,2,'Norwich urban effects and Dussindale valley must be separate study areas');
for(const f of norfolk){
 const p=f.properties,ring=f.geometry?.coordinates?.[0];
 assert.equal(f.geometry.type,'Polygon');
 assert(ring.length>=5&&JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)));
 assert(p.start_year===1549&&p.end_year===1549);
 assert(p.historical_boundary_confirmed===false&&p.fill_authorized===false);
 assert(p.territorial_claim===false&&p.area_sqkm===null&&p.exclude_from_area_aggregation===true);
 assert(p.source_ids.every(id=>sources.has(id)));
 assert(p.related_event_ids.every(id=>db.events.some(e=>e.id===id)));
 assert(/\b(?:not|no)\b/i.test(p.geometry_provenance),'geometry must disclaim survey or historical-perimeter status');
 const lon=ring.map(c=>c[0]),lat=ring.map(c=>c[1]);
 const width=Math.max(...lon)-Math.min(...lon),height=Math.max(...lat)-Math.min(...lat);
 assert(width<.09&&height<.06,'historic military study area broadens beyond local-scale vicinity');
}
assert(!norfolk.some(f=>f.geometry.coordinates[0][0][0]===1.03),'prior county-size arbitrary rectangle must be gone');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const regionGuard=app.match(/centuryData\?\.features\?\.length!==([0-9]+)/);
assert(regionGuard&&Number(regionGuard[1])===areas.features.length,
 'App must validate the real total number of sourced geographic studies, including subsequent approved additions');
assert(app.includes('renderEarlyRegionalImpactAreas()'));
assert(db.events.filter(e=>e.year<=1548&&!e.id.startsWith('RW154')).length===65,'Preserve the existing 53 war records plus 1542 Calais and Morlaix sourced activity');
assert.equal(db.events.filter(e=>e.id.startsWith('RW154')).length,10,'Additional Rough Wooing sites must not disturb Norfolk records');
console.log('PASS: source-backed Norfolk 1549, eight year-gated events, two small non-territorial study polygons and actor distinction');
