#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),J=p=>JSON.parse(read(p));
const geo=J('data/eighteenth-century-editor39-5ae-source-areas.geojson');
const mass=J('data/eighteenth-century-mass-schematic-zones-1700-1799.json');
const small=[
 J('data/eighteenth-century-expansion-batch36-1700-1799.json'),
 J('data/eighteenth-century-b38-hudson-company.json'),
 J('data/eighteenth-century-b38-south-campaign.json')];
const original=J('docs/research/18C_5AE_BASELINE_26_RECTANGLES.json');
const all=small.flatMap(x=>x.zones);
const oldSites=small.flatMap(x=>x.sites);
const map=new Map([...all,...mass.zones].map(z=>[z.id,z]));
const known=new Set([
 ...geo.features.map(x=>x.id),...mass.regional_zones.map(x=>x.id),
 ...mass.regional_lines.map(x=>x.id),...mass.regional_sites.map(x=>x.id),
 ...J('data/eighteenth-century-editor37-5ab-physical-areas.geojson').features.map(x=>x.id),
 ...J('data/eighteenth-century-editor37-5ac-surveyed-geography.geojson').features.map(x=>x.id),
 ...J('data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson').features.map(x=>x.id),
 ...J('data/eighteenth-century-editor36-5y-named-sites.json').sites.map(x=>x.id)]);
const expected={
 'B36-Z023':'EDITOR39_5AE_PROCLAMATION_NORTH',
 'B36-Z024':'EDITOR39_5AE_PROCLAMATION_SOUTH',
 'B36-Z088':'EDITOR39_5AE_COORG_MADIKERI_FORT',
 'B36-Z093':'MYSORE_SOUTHERN_CESSION_1799',
 'B36-Z110':'JAMAICA_MAIN_ISLAND',
 'B36-Z121':'EDITOR39_5AE_ST_VINCENT_ISLAND_CONTEXT',
 'B36-Z122':'EDITOR39_5AE_BALICEAUX_GARIFUNA_ISLAND',
 'B38-H-Z007':'EDITOR39_5AE_YORK_HUDSON_SHORE',
 'B38-H-Z016':'EDITOR39_5AE_RIVER_COPPERMINE',
 'B38-H-Z025':'EDITOR39_5AE_HUDSON_NORTH_SHORE',
 'B38-S-Z022':'EDITOR39_5AE_LENUD_FERRY_MARKER',
 'B38-S-Z033':'EDITOR39_5AE_CAROLINA_ATLANTIC_SHORE',
 'B38-S-Z048':'EDITOR39_5AE_CAROLINA_ATLANTIC_SHORE',
 'OHIO_PROCLAMATION':'EDITOR39_5AE_PROCLAMATION_NORTH',
 'BELIZE_LOGGING':'EDITOR39_5AE_BELIZE_CARIBBEAN_SHORE',
 'NORTHERN_CIRCARS':'EDITOR37_5AB_CIRCARS_BAY_SHORE',
 'CARNATIC_RELATIONS':'EDITOR37_5AC_COROMANDEL_COAST',
 'SURAT_FACTORY':'EDITOR36_5Y_SURAT',
 'BENARES_ESTATES':'EDITOR38_5AD_BENARES_REVENUE',
 'SENEGAL_FORTS':'SENEGAL_NDAR_SAINT_LOUIS_FORT',
 'GOLD_COAST_TRADE':'EDITOR37_5AB_GOLD_COAST_SHORE',
 'FALKLAND_PAPER':'EDITOR39_5AE_FALKLANDS_ISLANDS_1774',
 'CORSICA_1794':'EDITOR39_5AE_CORSICA_ISLAND_1794'
};
a.equal(Object.keys(expected).length,23);
a.equal(original.count,26);a.equal(original.active_1799,12);
a.equal(geo.metadata.schema,'atlas-editor39-5ae-verified-geography-v1');
a.equal(geo.metadata.feature_count,15);a.equal(geo.features.length,15);
a.equal(geo.metadata.natural_lines,6);a.equal(geo.metadata.historic_polygons,5);
a.equal(geo.features.filter(x=>x.geometry.type==='Point').length,1);
a.equal(geo.features.filter(x=>['Polygon','MultiPolygon'].includes(x.geometry.type)).length,5);
a.equal(geo.features.filter(x=>['LineString','MultiLineString'].includes(x.geometry.type)).length,9);
const retiredOriginal=[];
for(const z of original.records){
 const cur=map.get(z.id);a(cur,'original source was deleted '+z.id);
 a.deepEqual(cur.bbox,z.bbox,'raw bbox mutated '+z.id);
 a.deepEqual(cur.periods,z.periods,'historical year period mutated '+z.id);
 a(cur.source_urls?.length>0,'sources deleted '+z.id);
 if(Object.hasOwn(expected,z.id)){
  a.equal(cur.superseded_by,expected[z.id],'incorrect GIS mapping '+z.id);
  a(known.has(cur.superseded_by),'missing source geometry '+z.id);
  retiredOriginal.push(z.id);
 }else a(!cur.superseded_by,'unverified shapes should be retained for followup '+z.id);
}
a.equal(retiredOriginal.length,23);
for(const s of oldSites.filter(s=>expected[s.linked_zone_id]))
 a.equal(s.superseded_by,expected[s.linked_zone_id]);
for(const s of mass.sites.filter(s=>expected[s.linked_zone_id]))
 a.equal(s.superseded_by,expected[s.linked_zone_id]);
const remain=original.records.filter(x=>!expected[x.id]);a.equal(remain.length,3);
a.deepEqual(new Set(remain.map(x=>x.id)),new Set(['CAROLINA_PROPRIETORS','GREAT_LAKES_POSTS','NSW_CROWN_CLAIM']));
const y=(z,n)=>z.periods.some(p=>p.start_year<=n&&n<=p.end_year);
a.equal(remain.filter(z=>y(z,1799)).length,1);
const sourceIndex=new Map([...mass.regional_zones,...mass.regional_lines].map(x=>[x.id,x]));
const ids=new Set(),points=c=>Array.isArray(c)&&typeof c[0]==='number'?[c]:c.flatMap(points);
for(const f of geo.features){
 const p=f.properties,g=f.geometry;
 a(!ids.has(f.id),'duplicate '+f.id);ids.add(f.id);
 a.equal(p.stable_id,f.id);a.equal(p.area_sqkm,null);
 a.equal(p.historical_boundary_confirmed,false);
 a.equal(p.territorial_control_verified,false);a.equal(p.uncertain_line_dashed,true);
 a.equal(p.exclude_from_area_aggregation,true);
 a(p.source_urls.every(u=>u.startsWith('https://')));
 a(p.periods.every(x=>x.start_year<=x.end_year));
 a(points(g.coordinates).every(([lon,lat])=>Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90));
 if(p.source_geometry_id){
  const source=sourceIndex.get(p.source_geometry_id);a(source,'original historic shape absent '+f.id);
  a.deepEqual(g,source.geometry,'original registered historic shape changed '+f.id);
 }
 if(['Polygon','MultiPolygon'].includes(g.type)){
  const rings=g.type==='Polygon'?g.coordinates:g.coordinates.flat();
  for(const ring of rings){a(ring.length>=4);a.deepEqual(ring[0],ring.at(-1));}
 }
 if(p.source_vertices)a(p.source_vertices>=4);
}
a.equal(geo.features.find(f=>f.id==='EDITOR39_5AE_BALICEAUX_GARIFUNA_ISLAND').properties.source_vertices,427);
a.equal(geo.features.find(f=>f.id==='EDITOR39_5AE_ST_VINCENT_1773_TREATY_DIVIDE').properties.source_vertices,61);
a.equal(geo.features.find(f=>f.id==='EDITOR39_5AE_COORG_MADIKERI_FORT').properties.source_vertices,78);
a.equal(geo.features.find(f=>f.id==='EDITOR39_5AE_PROCLAMATION_NORTH').properties.source_vertices,84);
a.equal(geo.features.find(f=>f.id==='EDITOR39_5AE_PROCLAMATION_SOUTH').properties.source_vertices,135);
a(geo.features.find(f=>f.id==='EDITOR39_5AE_FALKLANDS_ISLANDS_1774').properties.historic_claim_not_occupation);
a(geo.features.find(f=>f.id==='EDITOR39_5AE_CORSICA_ISLAND_1794').geometry.type==='MultiPolygon');
a(!geo.features.some(f=>f.id.includes('BELIZE_TREATY_POLYGON')),'no speculative Belize 1783/86 polygon');
a.equal(read('app.js').split('window.eighteenthEditor39FiveAE?.render?.();').length-1,4);
a(read('index.html').includes('js/eighteenth-editor39-5ae-source-areas.js?v=20261121-5ae-original-gis'));
console.log('PASS 5AE: 15 verified GIS features, 23/26 real-source retirements, source legacy records intact; 3 remain (1 in 1799).');
