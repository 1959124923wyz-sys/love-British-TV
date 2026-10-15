#!/usr/bin/env node
'use strict';
// Published-data integrity gate. It only validates; it never backfills
// a conjectural frontier, source, map coordinate or historic revenue.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const {hydrateFootprints,CANONICAL}=require('../js/territory-geometry.js');
const canonicalFootprints=read(CANONICAL);
const periods=[
 ['data/atlas-1497-1509.json',1497,1509],
 ['data/atlas-1510-1519.json',1510,1519],
 ['data/atlas-1520-1529.json',1520,1529],
 ['data/atlas-1530-1539.json',1530,1539],
 ['data/atlas-1540-1549.json',1540,1549],
 ['data/atlas-1550-1559.json',1550,1559],
 ['data/atlas-1560-1569.json',1560,1569],
 ['data/atlas-1570-1579.json',1570,1579],
 ['data/atlas-1580-1589.json',1580,1589],
 ['data/atlas-1590-1599.json',1590,1599]
];
const records=periods.map(([file,start,end])=>({file,start,end,data:read(file)}));
const catalog=read('data/chapters.json');
assert.equal(catalog.chapters.length,periods.length,'Published chapter count changed: review before extending this gate');
for(let i=0;i<records.length;i++){
 const {file,start,end,data}=records[i],chapter=catalog.chapters[i];
 assert.equal(chapter.start,start,file+' start year vs chapter index');
 assert.equal(chapter.end,end,file+' end year vs chapter index');
 assert.ok(data.events.length>0&&data.sources.length>0,file+' empty core datasets');
}
const eventIds=new Set(),placeIds=new Set(),sourceMap=new Map();
for(const {file,start,end,data} of records){
 const local=new Set();
 for(const src of data.sources){
  assert.ok(typeof src.id==='string'&&src.id, file+' blank source ID');
  assert.match(src.url||'',/^https?:\/\//,file+' unresolved source URL '+src.id);
  if(sourceMap.has(src.id))assert.equal(src.url,sourceMap.get(src.id),src.id+' reused with conflicting URL');
  sourceMap.set(src.id,src.url);
 }
 for(const e of data.events){
  assert.ok(typeof e.id==='string'&&e.id, file+' event missing ID');
  assert.ok(!local.has(e.id),file+' duplicate event ID '+e.id);
  assert.ok(!eventIds.has(e.id),'Event reused in another published chapter: '+e.id);
  eventIds.add(e.id);local.add(e.id);
  // The prologue deliberately contains a background 1496 patent and
  // unpublished 1500 status: no unreviewed extra exceptions are allowed.
  const knownBackground=file==='data/atlas-1497-1509.json' && e.id==='patent-1496' && e.year===1496;
  assert.ok(knownBackground||e.year>=start&&e.year<=end,file+' out-of-period event '+e.id);
  if(e.lat!=null||e.lng!=null){
   assert.ok(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180,
    file+' invalid event coordinate '+e.id);
  }
 }
 for(const pl of data.places||[]){
  assert.ok(typeof pl.id==='string'&&pl.id,file+' place missing stable ID');
  placeIds.add(pl.id);
 }
}
const allReferences=(item,where)=>{
 for(const id of item.source_ids||[])assert.ok(sourceMap.has(id),where+' has unregistered citation '+id);
};
for(const {file,data,start,end}of records){
 for(const e of data.events)allReferences(e,file+' / '+e.id);
 for(const pl of data.places||[])allReferences(pl,file+' / '+pl.id);
 for(const v of data.routes||[]){
  allReferences(v,file+' / '+v.id);
  assert.ok(Number.isInteger(v.year)&&v.year>=start&&v.year<=end,file+' route year '+v.id);
  assert.ok(Array.isArray(v.coords)&&v.coords.length>=2,file+' missing route '+v.id);
  for(const c of v.coords){
   assert.ok(Array.isArray(c)&&c.length===2&&Number.isFinite(c[0])&&Number.isFinite(c[1])
    &&Math.abs(c[0])<=90&&Math.abs(c[1])<=180,file+' bad route lat/lng '+v.id);
  }
  if(v.route_kind?.includes('schematic')){
   assert.ok(v.certainty?.includes('not-historical-track'),file+' incorrectly exact voyage '+v.id);
   assert.ok(v.note?.length>=12&&typeof v.geometry_precision==='string'&&v.geometry_precision.length>8,file+' historical route must retain structured provenance '+v.id);
  }
 }
}
const overlayPaths=[
 'data/military-control-points-1540-1549.geojson',
 'data/war-occupied-zones-1540-1549.geojson',
 'data/war-contested-zones-1540-1549.geojson',
 'data/war-front-corridors-1540-1549.geojson',
 'data/french-urban-control-1497-1549.geojson',
 'data/political-relations-1500-1549.geojson',
 'data/territorial-footprints-1497-1549.geojson',
 'data/french-urban-control-1550-1559.geojson',
 'data/political-relations-1550-1559.geojson',
 'data/territorial-footprints-1550-1559.geojson',
 'data/seventh-control-sites-1550-1559.geojson',
 'data/territorial-footprints-1560-1569.geojson',
 'data/political-relations-1560-1569.geojson',
 'data/french-urban-control-1560-1569.geojson',
 'data/eighth-control-sites-1560-1569.geojson',
 'data/eighth-enslavement-coastal-activity-1560-1569.geojson',
 'data/territorial-footprints-1570-1579.geojson',
 'data/political-relations-1570-1579.geojson',
 'data/french-urban-control-1570-1579.geojson',
 'data/ninth-control-sites-1570-1579.geojson',
 'data/territorial-footprints-1580-1589.geojson',
 'data/political-relations-1580-1589.geojson',
 'data/french-urban-control-1580-1589.geojson',
 'data/tenth-control-sites-1580-1589.geojson',
 'data/tenth-invasion-impact-areas-1580-1583.geojson',
 'data/tenth-land-dispossession-and-raids-1584-1589.geojson',
 'data/territorial-footprints-1590-1599.geojson',
 'data/political-relations-1590-1599.geojson',
 'data/french-urban-control-1590-1599.geojson',
 'data/eleventh-control-cores-1590-1599.geojson',
 'data/eleventh-influence-areas-1590-1599.geojson',
 'data/nine-years-war-operational-impact-1594-1599.geojson',
 'data/caribbean-maghreb-contact-raids-1551-1598.geojson',
 'data/issue46-hes-archaeology-reference-1547-1549.geojson'
];
function validCoord(coord,file,id){
 assert.ok(Array.isArray(coord)&&coord.length>=2&&Number.isFinite(coord[0])&&Number.isFinite(coord[1])
  &&Math.abs(coord[0])<=180&&Math.abs(coord[1])<=90,file+' invalid lon/lat '+id);
}
function validateGeometry(geo,file,id){
 assert.ok(geo&&geo.coordinates,file+' no geometry '+id);
 if(geo.type==='Point'){validCoord(geo.coordinates,file,id);return}
 if(geo.type==='LineString'){
  assert.ok(Array.isArray(geo.coordinates)&&geo.coordinates.length>=2,file+' short line '+id);
  geo.coordinates.forEach(c=>validCoord(c,file,id));return;
 }
 const polys=geo.type==='Polygon'?[geo.coordinates]:geo.type==='MultiPolygon'?geo.coordinates:null;
 assert.ok(polys,file+' unhandled geometry '+id+' '+geo.type);
 for(const poly of polys){
  assert.ok(Array.isArray(poly)&&poly.length>0,file+' empty polygon '+id);
  for(const ring of poly){
   assert.ok(Array.isArray(ring)&&ring.length>=4,file+' short ring '+id);
   ring.forEach(c=>validCoord(c,file,id));
   assert.deepEqual(ring[0],ring.at(-1),file+' unclosed ring '+id);
  }
 }
}
const results={};
for(const file of overlayPaths){
 const raw=read(file);
 const referenced=file.startsWith('data/territorial-footprints-')&&file!==CANONICAL;
 if(referenced)for(const f of raw.features){
  assert.equal(f.geometry,null,file+' must not copy inherited coordinates');
  assert.equal(f.properties?.geometry_ref,f.id,file+' missing/invalid shared geometric identity');
 }
 const geo=referenced?hydrateFootprints(canonicalFootprints,raw):raw,ids=new Set();
 assert.equal(geo.type,'FeatureCollection',file);
 for(const f of geo.features){
  const p=f.properties||{},id=f.id||p.id||p.stable_id;
  assert.ok(id!=null,file+' feature without key');
  assert.ok(!ids.has(id),file+' duplicate feature ID '+id);
  ids.add(id);validateGeometry(f.geometry,file,id);
  // Some inherited 1497–1519 research footprints use source identifiers
  // outside the six published chapter source tables. Their source_urls and
  // provenance remain intact; never invent missing sources in the atlas.
  if(!file.includes('territorial-footprints'))allReferences(p,file+' / '+id);
  if(p.related_event_ids)for(const rid of p.related_event_ids)
   assert.ok(eventIds.has(rid),file+' / '+id+' unknown event link '+rid);
  if(p.related_place_ids)for(const pid of p.related_place_ids)
   assert.ok(placeIds.has(pid),file+' / '+id+' unknown place link '+pid);
  if(p.stable_id&&p.zone_type!=='enslavement_event_activity_schematic')assert.ok(placeIds.has(p.stable_id),file+' / '+id+' missing stable linked site '+p.stable_id);
  if(p.start_year!=null&&p.end_year!=null)
   assert.ok(p.start_year<=p.end_year,file+' impossible effective years '+id);
  if(p.zone_type==='enslavement_event_activity_schematic'){
    assert.equal(p.map_layer,'events',file+' slavery trade bands must not be territory');
    assert.equal(p.fill_authorized,false,file+' nonhistoric colonial fill '+id);
    assert.equal(p.historical_boundary_confirmed,false,file+' inaccurate historic region '+id);
    assert.equal(p.area_sqkm,null,file+' do not invent a conquest area '+id);
    assert.equal(p.territorial_claim,false,file+' African independent political status '+id);
   }
   if(p.zone_type==='archaeological-reference-not-occupation'){
   assert.equal(p.fill_authorized,false,file+' modern legal polygon must never be painted as English occupation');
   assert.equal(p.historical_boundary_confirmed,false,file+' modern legal outline is not 1547 rampart');
   assert.equal(p.area_sqkm,null,file+' legal scheduled area may not enter Tudor conquest statistics');
   assert.equal(p.controller_for_polygon,null,file+' ancient controller cannot be attributed to a modern legal perimeter');
  }
  if(['occupied','contested','war_reach_schematic'].includes(p.zone_type)){
   assert.equal(p.historical_boundary_confirmed,false,file+' needs actual surveyed historical border');
   assert.equal(p.fill_authorized,false,file+' must not present schematic extent as actual verified area');
   assert.equal(p.area_sqkm,null,file+' area statistics prohibited');
   assert.ok(p.source_ids?.length>0,file+' evidence missing on war zone');
  }
 }
 results[file]=geo.features.length;
}
// Research-backlog references are intentionally NOT inserted into the six
// public atlas source tables until investigators supply the corresponding
// verifiable full bibliographic entries. Treat any *new* gap as a CI error.
const permittedUnregistered={
 'data/territorial-footprints-1497-1549.geojson':new Set([
  'FR-MINISTRY-2026','FR-TNA-CALAIS','FR-ROSE-GRUMMITT',
  'GEONAMES-FR','IR-STATUTE-1488-JOYCE-1921','IR-OKEEFFE-1992',
  'IR-ELLIS-2021'
 ]),
 'data/financial-evidence-1530-1539.json':new Set(['GB-TNA-FRENCH-LANDS']),
 'data/welsh-legal-shires-1535.json':new Set(['WLS-1535-ACT-TRANSCRIPT'])
};
const missingSourceIds={};
for(const [file,permitted] of Object.entries(permittedUnregistered)){
 const data=read(file),features=data.features||data.records||[];
 const gaps=new Set();
 for(const item of features){
  const obj=item.properties||item;
  for(const id of obj.source_ids||[])if(!sourceMap.has(id))gaps.add(id);
 }
 for(const id of gaps)assert.ok(permitted.has(id),file+' new unregistered source ID: '+id);
 // When researchers register old sources, remove them from this reviewed
 // exception list in the same PR to record the exact database migration.
 assert.deepEqual([...gaps].sort(),[...permitted].sort(),file+' known bibliography debt changed; review it explicitly');
 missingSourceIds[file]=[...gaps].sort();
}
const finance=read('data/financial-evidence-1530-1539.json');
assert.equal(finance.colonial_profit_total,null,
 'Domestic tax/forfeiture/pension evidence must never be summed as a colonial-profit total');
const wales=read('data/welsh-legal-shires-1535.json');
assert.equal(wales.verified_new_historic_border_polygons,0,'Unsurveyed old Welsh shire polygons must remain undisclosed');
for(const c of wales.records)
 assert.equal(c.verified_polygon,false,'Welsh legal status cannot silently become surveyed ancient borders');
const notes=read('data/historical-detail-notes.json').records;
for(const id of Object.keys(notes))
 assert.ok(eventIds.has(id)||placeIds.has(id),'Deep-archive note orphaned from published history: '+id);
console.log('PASS published data: '+eventIds.size+' unique historical events, '+placeIds.size+
 ' stable political sites, '+sourceMap.size+' registered source IDs, '+Object.keys(notes).length+
 ' attached deep notes; geographic layers='+JSON.stringify(results)+
 '; explicitly unregistered legacy source IDs='+JSON.stringify(missingSourceIds));
