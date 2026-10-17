#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),read=x=>JSON.parse(fs.readFileSync(path.join(base,x),'utf8'));
const db=read('data/atlas-1570-1579.json'),areas=read('data/century-violence-regions-1544-1589.geojson');
const allSources=new Map(db.sources.map(s=>[s.id,s]));
const core=db.events.find(e=>e.id==='GAP1578-VALPARAISO');
const newcomers=db.events.filter(e=>e.id.startsWith('PAC1578-'));
assert(core&&core.year===1578,'original 1578 Valparaiso raid must survive without duplication');
assert.equal(newcomers.length,2,'add only Mocha and failed La Serena, do not double count already-published raid');
assert.equal(db.events.length,89);
assert.equal(db.sources.length,94);
assert.equal(db.routes.length,27);
assert.equal(db.events.filter(e=>e.year<=1577).length,60,'no premature publication before Chile voyage');
assert.equal(db.events.filter(e=>e.year<=1578).length,77);
assert(core.name.includes('瓦尔帕莱索')&&core.name.includes('房屋'));
assert(core.description.includes('总督托莱多'),'contemporary Spanish dispatch cited');
assert(core.description.includes('12月6日')&&core.description.includes('12月4日'),'record day uncertainty rather than false exact date');
assert(core.description.includes('不能据此推断智利居民普遍受害'),'territorial harms not imagined');
assert(core.source_ids.includes('US-LOC-TOLEDO-MANUSCRIPT-1579'));
assert(core.source_ids.includes('CL-BNC-DRAKE-CHILE-1578'));
const mocha=newcomers.find(e=>e.id==='PAC1578-MOCHA-LAFKENCHE'),laSerena=newcomers.find(e=>e.id==='PAC1578-LA-SERENA-DEFENSE');
assert(mocha?.icon_code==='RES'&&mocha.description.includes('Lafkenche')&&mocha.description.includes('不可凭此点断言英军屠杀原住民'));
assert(laSerena?.icon_code==='RES'&&laSerena.description.includes('未能攻下拉塞雷纳'));
for(const e of [core,...newcomers]){
 assert(e.year===1578&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));
 assert(e.source_ids.length>=1&&e.source_ids.every(id=>allSources.has(id)),'unregistered primary or national-library source');
 assert(e.colonial_profit===null&&e.actual_English_land_area_sqkm===null&&e.actual_English_territory_created===false,'no invented profits / occupation');
 assert(e.historical_control_boundary_verified===false);
}
const legs=db.routes.filter(r=>r.id.startsWith('ch9-Drake-1578-'));
assert.equal(legs.length,2,'two direction legs, no spurious open-ended Pacific travel polygon');
assert.deepEqual(legs.map(r=>r.id).sort(),['ch9-Drake-1578-Mocha-Valparaiso','ch9-Drake-1578-Valparaiso-LaSerena'].sort());
for(const r of legs){
 assert.equal(r.year,1578);assert.equal(r.route_kind,'schematic-privateering-voyage');
 assert.equal(r.certainty,'schematic-only-not-historical-track');
 assert.equal(r.verified_English_territorial_control,false);
 assert.equal(r.actual_area_sqkm,null);
 assert(r.source_ids.every(x=>allSources.has(x)));
 assert(r.related_event_ids.every(x=>db.events.some(e=>e.id===x)));
 assert(r.coords.length===2&&r.coords.every(([lat,lng])=>Math.abs(lat)<=90&&Math.abs(lng)<=180));
}
const selected=areas.features.filter(f=>f.id.startsWith('cl-drake-1578-'));
assert.equal(selected.length,3,'three different coastline studies, not a single Chile-wide claim');
assert.equal(areas.features.length,28);
for(const f of selected){
 const p=f.properties,ring=f.geometry?.coordinates?.[0];
 assert(f.geometry?.type==='Polygon'&&ring?.length>=5);
 assert.deepEqual(ring[0],ring.at(-1));
 assert(p.start_year===1578&&p.end_year===1578);
 assert(p.historical_boundary_confirmed===false&&p.fill_authorized===false);
 assert(p.territorial_claim===false&&p.area_sqkm===null&&p.exclude_from_area_aggregation===true);
 assert(p.source_ids?.length>=1&&p.source_ids.every(id=>allSources.has(id)),'unregistered locale source '+f.id);
 assert(p.source_urls?.length>=1&&p.source_urls.every(url=>p.source_ids.some(id=>allSources.get(id).url===url)));
 assert(p.related_event_ids?.length>=1&&p.related_event_ids.every(id=>db.events.some(e=>e.id===id)));
 assert(/NOT|not/.test(p.geometry_provenance),'non-survey label is mandatory');
 assert(p.mapping_method&&p.named_anchors?.length);
 assert(ring.every(([lon,lat])=>lon< -70&&lon> -75&&lat< -28&&lat> -40),'Chile west coast only, no made-up colonial land elsewhere');
}
assert(selected.find(x=>x.id==='cl-drake-1578-la-serena-defense-region').properties.summary_zh.includes('袭击失败'),'must show local victory');
assert(selected.find(x=>x.id==='cl-drake-1578-isla-mocha-lafkenche-contact').properties.color_role==='restoration_blue','indigenous locality distinguish from raid-red Crown aggression');
const app=fs.readFileSync(path.join(base,'app.js'),'utf8');
assert(app.includes('centuryData?.features?.length!==28'));
assert(app.includes('[atlasSixth,atlasEighth,atlasNinth,atlasTenth]'),'Ninth chapter region references verified at load time');
assert(app.includes('indigenous_defense_and_privateer_contact_schematic'));
console.log('PASS 06: 1578 Valparaiso original raid enhanced, Mocha and La Serena named incidents, two archival schematic routes, three dashed non-territorial zones, no invented Chile conquest');
