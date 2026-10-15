#!/usr/bin/env node
'use strict';
// Contract for every future contributor: geolocate attested named places with
// honest modern reference precision; NEVER turn military research geometry
// or trade into occupied Crown territory or fabricated historic tracks.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),txt=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(txt(p));
const standard=txt('docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md');
const checklist=txt('docs/HISTORICAL_SPATIAL_REVIEW_CHECKLIST.md');
const agents=txt('AGENTS.md'),readme=txt('README.md');
const wars=txt('docs/WAR_CONTROL_AND_CONTESTED_ZONES.md');
for(const word of ['具名','示意','影响区','source_ids','area_sqkm','排除','原住民','时间'])assert.ok(standard.includes(word),'Standard misses '+word);
for(const k of ['具名','影响区','实际','时间','Git'])assert.ok(checklist.includes(k),'Checklist missing '+k);
for(const content of [agents,readme,wars])assert.ok(content.includes('HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md'));
assert.ok(agents.includes('HISTORICAL_SPATIAL_REVIEW_CHECKLIST.md'),'Required for future agents');
const atlas=json('data/atlas-1590-1599.json');
const notes=json('data/chapter11-detail-notes.json');
const geo=json('data/caribbean-maghreb-contact-raids-1551-1598.geojson');
const app=txt('app.js');
const r=atlas.events.find(e=>e.id==='1590S-E014');
const san=geo.features.find(f=>f.id==='caribbean-trinidad-raiders-1595');
const port=geo.features.find(f=>f.id==='trinidad-puerto-de-los-espanoles-1595-raleigh-arrival');
const region=geo.features.find(f=>f.id==='trinidad-1595-puerto-espana-san-jose-operation-schematic');
const route=geo.features.find(f=>f.id==='trinidad-1595-puerto-espana-san-jose-operation-sequence');
assert.ok(r&&san&&port&&region&&route,'Raleigh site/route/region link missing');
assert.equal(atlas.events.length,37,'Must keep 36 existing events plus 1597 Faial supported event');
assert.equal(new Set(atlas.events.map(e=>e.id)).size,37,'Must not duplicate any existing events');
assert.ok(atlas.events.some(e=>e.id==='GAP1597-FAIAL'&&e.year===1597),'New Faial event missing');
assert.ok(Number.isFinite(r.lat)&&Number.isFinite(r.lng));
assert.deepEqual([r.lng,r.lat],san.geometry.coordinates,'Main atlas must match researched site');
assert.deepEqual(route.geometry.coordinates,[port.geometry.coordinates,san.geometry.coordinates],'Line must connect only documented anchored endpoints');
assert.equal(route.geometry.type,'LineString');
assert.equal(route.properties.sequence_only,true);
assert.equal(route.properties.start_year,1595);
assert.equal(route.properties.end_year,1595);
assert.ok(route.properties.mapping_method.includes('NO military buffer'),'Line is not a conquered corridor');
assert.equal(route.properties.material_impacts_not_assumed_between_waypoints,true);
for(const feature of [san,port,route,region]){
 const p=feature.properties;
 assert.equal(p.territorial_claim,false);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.ok(p.source_urls?.length>0);
 assert.ok(p.source_ids.includes('C11-S23'));
 assert.ok(p.related_event_ids?.includes(r.id));
}
assert.equal(region.geometry.type,'Polygon');
assert.equal(region.properties.area_measurement_prohibited,true);
assert.ok(!notes.records[r.id].geography.includes('坐标空值'));
assert.ok(notes.records[r.id].geography.includes('现代城市级参考坐标'));
assert.ok(standard.includes('两处具名地点是绘制**有据关系线**的充分入口，不自动证明'));
assert.ok(standard.includes('catalogue_only'));
const selected=app.slice(app.indexOf('function renderAtlanticContactSites(){'),app.indexOf('function renderNineYearsWarImpact(){'));
assert.ok(selected.includes('atlas-trinidad-1595-impact'));
assert.ok(selected.includes('atlas-trinidad-1595-action-sequence'));
assert.ok(selected.includes('atlas-maghreb-trade-sequence'));
assert.ok(selected.includes("p.start_year===year&&p.end_year===year"));
assert.ok(selected.includes("!$('toggleTerritorialFootprints').checked")&&selected.includes("!$('toggleControlAreas').checked"));
assert.ok(!selected.includes("L.circle(route.geometry"),'Sequence is not inflated into territory');
console.log('PASS: mandatory spatial standard + geolocated 1595 San Jose event + verified two-site raid sequence + explicit non-territorial area limits');
