#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const db=read('data/atlas-1560-1569.json'),areas=read('data/century-violence-regions-1544-1589.geojson');
const newMunster=new Set(['MUN1569-CORK-KERRY-COLONIAL-GRANT','MUN1569-FITZMAURICE-KILMALLOCK','MUN1569-CORK-RELIGIOUS-ULTIMATUM','MUN1569-BUTLER-ENNISCORTHY-FAIR','MUN1569-ORMOND-ROYAL-CAMPAIGN']);
const records=db.events.filter(e=>e.id.startsWith('MUN1569-')&&!newMunster.has(e.id));
assert.equal(records.length,9,'nine discrete 1569 Munster campaign/response events');
assert.equal(new Set(records.map(e=>e.id)).size,9);
assert.equal(db.events.length,48,'legacy events retained plus Northern Rising campaign nodes');
assert.equal(db.events.filter(e=>e.year<=1568).length,db.events.length-db.events.filter(e=>e.year===1569).length,'all additions must be constrained to 1569');
const sources=new Map(db.sources.map(s=>[s.id,s]));
assert.equal(db.sources.length,47);
for(const e of records){
 assert(e.year===1569&&e.start_year===1569&&e.end_year===1569&&e.visible_from===1569,'time barrier '+e.id);
 assert(e.date_label.startsWith('1569年'),'year label '+e.id);
 assert(e.source_ids?.length&&e.source_ids.every(id=>sources.has(id)),'missing documentary source '+e.id);
 assert(e.historical_control_boundary_verified===false&&e.actual_English_territory_created===false&&e.actual_English_land_area_sqkm===null,'wrong sovereignty '+e.id);
}
const unlocated=records.filter(e=>e.lat===null&&e.lng===null);
assert.deepEqual(unlocated.map(e=>e.id).sort(),['MUN1569-GARRYSTOWN-MASSACRE','MUN1569-HEADS-TERROR'].sort(),'uncertain site / moving tent must not be geocoded');
assert(unlocated.every(e=>e.position_type==='unlocated_historical_site_archival_only'));
assert(records.filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng)).length===7);
assert(records.filter(e=>e.category==='resistance_and_liberation').length===1,'rebel attack must be differentiated');
assert(records.filter(e=>e.category==='colonial_repression').length===4,'massacre, north Kerry, Connello and beheadings must be distinct');
assert(records.some(e=>e.id==='MUN1569-GARRYSTOWN-MASSACRE'&&e.description.includes('都柏林郡同名')));
assert(records.some(e=>e.id==='MUN1569-CONNELLO-TERROR'&&e.description.includes('近代Connello')));
const existing=db.events.filter(e=>e.id==='GAP1569-GILBERT-KILMALLOCK');
assert.equal(existing.length,1,'do not duplicate Kilmallock encounter');
assert(existing[0].source_ids.includes('IR-IMC-GILBERT-LETTERS-1569'));
const munster=areas.features.filter(f=>f.id==='ir-gilbert-1569-munster'||f.id.startsWith('ir-munster-1569-'));
assert.equal(munster.length,5,'retain narrowed Kilmallock site + four properly sourced distinct localities');
assert(areas.features.length>=19,'1569 approved study regions must remain when later research adds more areas');
for(const f of munster){
 const p=f.properties,ring=f.geometry?.coordinates?.[0];
 assert.equal(f.geometry?.type,'Polygon');assert(ring.length>=5&&JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)),'closed ring required');
 assert.equal(p.start_year,1569);assert.equal(p.end_year,1569);
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.source_ids?.length&&p.source_ids.every(id=>sources.has(id)),'bad area citation '+f.id);
 assert(p.source_urls?.length&&p.source_urls.every(url=>p.source_ids.some(id=>sources.get(id)?.url===url)),'unregistered area link '+f.id);
 assert(p.related_event_ids?.length&&p.related_event_ids.every(id=>db.events.some(e=>e.id===id)),'orphan area narrative '+f.id);
 assert(p.mapping_method&&p.named_anchors?.length&&/NOT|not/.test(p.geometry_provenance),'non-survey disclaimer '+f.id);
 for(const [lon,lat] of ring)assert(Math.abs(lon)<=180&&Math.abs(lat)<=90,'coordinate bounds '+f.id);
}
assert(areas.features.filter(f=>f.id==='ir-munster-1569-kilkenny-defense')[0].properties.zone_type==='rebellion_and_crown_response');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const currentCount=app.match(/centuryData\?\.features\?\.length!==([0-9]+)/);
assert(currentCount&&Number(currentCount[1])===areas.features.length,'app must load all extant study regions');
assert(app.includes("kind==='rebellion-conflict'"),'no distinction between rebel attack and colonial repression in dossier');
console.log('PASS: 1569 Gilbert / first Desmond rebellion, 9 distinct incidents, 2 deliberately unlocated atrocities, 5 non-sovereign regional studies');
