#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const txt=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const now=read('data/atlas-1570-1579.json'),old=read('data/atlas-1560-1569.json');
const manifest=read('data/chapters.json'),mil=read('data/ninth-control-sites-1570-1579.geojson');
const geo=read('data/territorial-footprints-1570-1579.geojson'),prevGeo=read('data/territorial-footprints-1560-1569.geojson');
const icons=new Set(read('data/icon-categories.json').categories.map(x=>x.code));
const html=txt('index.html'),app=txt('app.js');new vm.Script(app);
const ledger=read('data/chapter9-economic-violence-ledger.json');
const detail=read('data/chapter9-detail-notes.json');
assert.equal(ledger.records.length,31,'Main database must include 28 independent gross/cost/victim evidence records');
assert.equal(Object.keys(detail.records).length,16,'Detailed historical document entries missing');
assert.ok(ledger.records.every(r=>r.source_ids?.length&&r.source_ids.every(id=>now.sources.some(s=>s.id===id))),'Economic records must cite chapter sources');
assert.ok(Object.keys(detail.records).every(id=>now.events.some(e=>e.id===id)),'Research notes must attach to an event');
assert.ok(app.includes("fetch('data/chapter9-detail-notes.json'"),'Published dossier does not load editorial research notes');

assert.deepEqual(now.period,{from:1570,to:1579,next:1580});
assert.ok(manifest.chapters.length>=9);
assert.ok(manifest.chapters.some(c=>c.number===9&&c.start===1570&&c.end===1579&&c.status==='published'));
assert.equal(now.events.length,41);assert.equal(now.places.length,43);assert.equal(now.sources.length,60);
assert.equal(now.routes.length,18);assert.equal(now.colonial_polygons.length,0);
assert.equal(old.events.length,26);
const ids=new Set(),src=new Set(now.sources.map(s=>s.id));
assert.equal(icons.size,16);assert.equal(src.size,60);
for(const e of now.events){
 assert.ok(e.year>=1570&&e.year<=1579&&e.date_label.includes(String(e.year)),e.id+' chronology');
 assert.ok(!ids.has(e.id));ids.add(e.id);
 assert.ok(icons.has(e.icon_code)&&e.icon_code!=='TRA',e.id+' disallowed glyph');
 assert.ok(e.source_ids.length&&e.source_ids.every(id=>src.has(id)),e.id+' source unknown');
 assert.equal(e.colonial_profit,null,e.id+' financial fabrication');
 if(e.id==='1570S-E018'){assert.equal(e.lat,null);assert.equal(e.lng,null)}
 else assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng),e.id+' invalid GIS');
}
assert.equal(now.events.find(e=>e.id==='1570S-E010').icon_code,'REP');
assert.equal(now.events.find(e=>e.id==='1570S-E028').year,1578);
assert.equal(now.events.find(e=>e.id==='1570S-E035').year,1577);
for(const [id,year,icon,placeId] of [
 ['1570S-E038',1570,'EXP','winter-guinea-1570-regional'],
 ['1570S-E039',1571,'WAR','winter-jamaica-piracy-1571-regional'],
 ['1570S-E040',1572,'WAR','winter-st-augustine-failed-1572'],
 ['1570S-E041',1572,'EXP','hawkins-1572-possible-guinea-voyage-region']
]){
 const e=now.events.find(x=>x.id===id),p=now.places.find(x=>x.id===placeId);
 assert.ok(e&&p,id+' missing new expedition/raid');
 assert.equal(e.year,year);assert.equal(e.icon_code,icon);
 assert.ok(e.source_ids.length&&e.source_ids.every(s=>src.has(s)));
 assert.equal(p.render_as_event_only,true,'Commercial encounter must remain in EVENT layer');
 assert.equal(p.area_polygon_verified,false,'Unconfirmed voyage must not create British territory');
 assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);
 assert.ok(Number.isFinite(p.lat)&&Number.isFinite(p.lng));
 assert.equal(e.colonial_profit,null);
}
for(const sid of ['C9-S54','C9-S55','C9-S56','C9-S57','C9-S58','C9-S59','C9-S60'])assert.ok(src.has(sid),'New documented source missing '+sid);
for(const lid of ['C9-F29','C9-F30','C9-F31']){
 const r=ledger.records.find(x=>x.id===lid);
 assert.ok(r&&r.source_ids.length&&r.source_ids.every(id=>src.has(id)));
 assert.equal(r.quantity,null,'Do not infer abductee or loot totals');
}
assert.equal(now.routes.length,18,'Do not fabricate undated voyages for newly discovered 1570s fleets');

const churches=[
 ['bristol-st-stephen-Inuit-Kalicho-Arnaq-burials-1577',1577,1577,51.454311,-2.596003],
 ['london-st-olave-captive-Inuit-burial-payments-1576-1577',1576,1577,51.5109,-0.07947]
];
for(const [id,start,end,lat,lng] of churches){
 const p=now.places.find(s=>s.id===id);
 assert.ok(p,'Missing PR56 heritage site '+id);
 assert.equal(p.start_year,start);assert.equal(p.end_year,end);
 assert.equal(p.lat,lat);assert.equal(p.lng,lng);
 assert.equal(p.render_as_event_only,true,'Church must not enter the territory control layer');
 assert.equal(p.icon_code,'DIS');
 assert.ok(p.source_ids.length&&p.source_ids.every(id=>src.has(id)));
}
for(const [id,y,expected] of [
 ['Inuit-captive-1576-Baffin-to-London',1576,1],
 ['Inuit-captive-1577-Baffin-to-Bristol',1577,3],
 ['Nutaaq-1577-Bristol-to-London',1577,1]
]){
 const r=now.routes.find(z=>z.id==='ch9-'+id);
 assert.ok(r,'Forced Inuit transportation map leg missing '+id);
 assert.equal(r.year,y);assert.equal(r.route_kind,'schematic-forced-person-transport');
 assert.equal(r.historic_abducted_aboard_count,expected);
 assert.ok(r.victims_overlap_other_legs,'No counting transfers as additional abductees');
 assert.equal(r.verified_English_territorial_control,false);
}
assert.equal(now.events.find(e=>e.id==='1570S-E035').location_reference_place_id,churches[0][0]);
assert.equal(now.events.find(e=>e.id==='1570S-E036').location_reference_place_id,churches[1][0]);
assert.ok(app.includes("r.route_kind==='schematic-forced-person-transport'"),'Forced transportation map line must use existing red slavery/trafficking track');
assert.equal(read('data/chapter9-primary-folio-index.json').inventory.length,14);
assert.equal(read('data/chapter9-primary-folio-index.json').primary_manuscript_full_texts_read,false);

const polity=['calais-crown','guines-crown-1520s','dublin-pale','channel-jersey','channel-guernsey','isle-of-man','orkney-scotland','shetland-scotland','kingdom-of-scotland'];
for(const id of polity){
 const p=now.places.find(x=>x.id===id),o=old.places.find(x=>x.id===id);
 assert.ok(p&&o,id+' political continuity');
 assert.equal(p.start_year,o.start_year);
 assert.equal(p.observed_through_year,1579);
}
assert.equal(mil.features.length,3);
const role=new Map(mil.features.map(f=>[f.id,f.properties]));
assert.deepEqual([role.get('carrickfergus-English-castle-pre1570').start_year,role.get('carrickfergus-English-castle-pre1570').end_year],[1570,1579]);
assert.deepEqual([role.get('smith-newcastle-comber-1572-1575').start_year,role.get('smith-newcastle-comber-1572-1575').end_year],[1572,1572]);
assert.deepEqual([role.get('loughrea-english-warders-1576-1580').start_year,role.get('loughrea-english-warders-1576-1580').end_year],[1576,1579]);
assert.ok(mil.features.every(f=>f.geometry.type==='Point'&&f.properties.fill_authorized===false&&f.properties.area_sqkm===null));
assert.equal(geo.features.length,prevGeo.features.length);
for(const g of geo.features){
 const old=prevGeo.features.find(f=>f.id===g.id);
 assert.ok(old&&JSON.stringify(old.geometry)===JSON.stringify(g.geometry),g.id+' invented historic border');
 assert.equal(g.properties.observed_through_year,1579);
}
const yearEvents=[2,4,8,11,13,16,21,28,33,41],yearRoutes=[0,0,1,2,4,5,12,14,14,18];
for(let y=1570;y<=1579;y++){
 assert.equal(now.events.filter(x=>x.year<=y).length,yearEvents[y-1570],'events at '+y);
 assert.equal(now.routes.filter(x=>x.year<=y).length,yearRoutes[y-1570],'route count '+y);
}
for(const rt of now.routes){
 assert.ok(rt.source_ids.length&&rt.source_ids.every(id=>src.has(id)),rt.id);
 assert.ok(rt.related_event_ids?.every(id=>ids.has(id)),rt.id);
 assert.ok(rt.coords.length>=2&&rt.coords.every(p=>p.length===2&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180),rt.id);
 assert.equal(rt.certainty,'schematic-only-not-historical-track');
}
const ocean=now.routes.find(r=>r.id==='ch9-Drake-1579-California-Ternate');
assert.ok(ocean.segments?.length===2,'Pacific dateline must split into two short paths');
assert.ok(ocean.segments.every(segment=>Math.abs(segment.at(-1)[1]-segment[0][1])<180),'Date line wrap across Eurasia');
assert.ok(app.includes('next>=1570?atlasNinth:next>=1560?atlasEighth'));
assert.ok(app.includes('function renderNinthControlSites()'));
assert.ok(app.includes('const routeGeometry=r.segments&&r.segments.length?r.segments:r.coords'));
assert.ok(html.includes('max="1589"')&&html.includes('1497—1589'));
console.log('PASS ch9: 41 events, 60 sources, 43 places, 18 source-backed routes, three dated local garrison symbols, zero newly surveyed Tudor territory polygons.');
