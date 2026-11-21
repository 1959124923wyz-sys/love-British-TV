#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const J=p=>JSON.parse(read(p));
const p=J('data/eighteenth-century-editor39-5ae-point-area-promotions.json');
const m=J('data/eighteenth-century-mass-schematic-zones-1700-1799.json');
const a=J('data/eighteenth-century-editor37-5ab-physical-areas.geojson');
const b=J('data/eighteenth-century-editor37-5ac-surveyed-geography.geojson');
const c=J('data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson');
assert.equal(p.schema,'atlas_editor39_5ae_verified_point_to_area_promotions_v1');
assert.equal(p.area_totals_forbidden,true);assert.equal(p.source_polygon_already_live,true);
assert.equal(p.point_markers_replaced_by_existing_polygons.length,5);
const sources=new Map([...m.regional_zones,...a.features].map(x=>[x.id,x]));
const points=new Map([...a.features,...b.features,...c.features].map(x=>[x.id,x]));
const yearMatch=(ps,start,end)=>Array.from({length:end-start+1},(_,i)=>start+i).every(y=>ps.some(q=>q.start_year<=y&&y<=q.end_year));
for(const r of p.point_markers_replaced_by_existing_polygons){
 const point=points.get(r.id),polygon=sources.get(r.polygon_id);
 assert(point&&polygon,'missing source point or polygon: '+r.id);
 // mass.regional_zones are native atlas records (top-level periods/source_urls),
 // whereas the surveyed GeoJSON features place the same fields in properties.
 const polygonMeta=polygon.properties||polygon;
 assert.equal(point.geometry.type,'Point');
 assert(['Polygon','MultiPolygon'].includes(polygon.geometry.type));
 assert(r.start_year<=r.end_year);
 assert(yearMatch(point.properties.periods,r.start_year,r.end_year),'original point not dated for conversion '+r.id);
 assert(yearMatch(polygonMeta.periods,r.start_year,r.end_year),'original surveyed area not dated for conversion '+r.id);
 assert((polygonMeta.source_urls||[]).length>0);
 assert(polygonMeta.area_sqkm===null,'historical fort footprints must never become numeric territorial area');
 assert(r.evidence?.length>20);
}
const beyin=p.point_markers_replaced_by_existing_polygons.find(x=>x.id==='EDITOR37_5AB_BEYIN');
assert.equal(beyin.start_year,1773);
assert(p.denied_examples.find(x=>x.id==='EDITOR38_5AD_FORT_PITT_1763'),'1764 Bouquet building cannot be substituted for a 1763 siege');
for(const js of ['js/eighteenth-editor37-5ab-physical-areas.js',
 'js/eighteenth-editor37-5ac-battlefields.js','js/eighteenth-editor38-5ad-geography.js']){
 assert(read(js).includes('AtlasPointToArea5AE?.replacesPoint?.'),'legacy layer must hide duplicate marker when evidence polygon visible '+js);
}
assert(read('js/eighteenth-mass-spatial.js').includes('AtlasPointToArea5AE?.refresh?.();'));
const main=read('js/eighteenth-editor39-5ae-source-areas.js');
for(const r of p.point_markers_replaced_by_existing_polygons){
 assert(main.includes(r.id),r.id+' not registered in promotion resolver');
 assert(main.includes("polygon:'"+r.polygon_id+"'"),r.polygon_id+' not registered in promotion resolver');
}
assert(read('scripts/browser_editor37_5ab_physical_areas.cjs').includes('a.visibleLayers,21'));
console.log('PASS Editor39 5AE point-to-area: five original site records converted to dated source-backed fort footprints; zero GIS buffers; former points preserved for archival research.');
