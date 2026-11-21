#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const J=p=>JSON.parse(read(p));
const g=J('data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson');
const hydro=J('data/eighteenth-century-editor36-5z-waterways.geojson');
const paths=['data/eighteenth-century-expansion-batch36-1700-1799.json',
 'data/eighteenth-century-b38-hudson-company.json',
 'data/eighteenth-century-b38-india-mysore.json',
 'data/eighteenth-century-b38-south-campaign.json'];
const files=paths.map(J),legacy=files.flatMap(x=>x.zones||[]);
const sites=files.flatMap(x=>x.sites||[]);
const index=new Map(legacy.map(z=>[z.id,z]));
const ids=new Set(g.features.map(f=>f.id));
a.equal(g.type,'FeatureCollection');a.equal(g.metadata.schema,'atlas-editor38-5ad-source-nodes-hydro-treaty-v1');
a.equal(g.metadata.area_aggregation_forbidden,true);
a.equal(g.features.length,27);a.equal(ids.size,27);
a.equal(g.features.filter(f=>f.geometry.type==='Point').length,26);
a.equal(g.features.filter(f=>f.geometry.type==='MultiLineString').length,1);
a.equal(g.metadata.retired_legacy_zone_ids.length,25);
a.equal(new Set(g.metadata.retired_legacy_zone_ids).size,25);
a.equal(g.metadata.retired_1799,10);
const direct=new Map(g.features.filter(f=>f.properties.source_legacy_zone_id)
 .map(f=>[f.properties.source_legacy_zone_id,f.id]));
direct.set('B38-H-Z005','EDITOR36_5Z_HAYES_LOWER');
direct.set('B38-H-Z026','EDITOR36_5Z_LAKE_HURON');
a.equal(direct.size,25);
const hydroIds=new Set(hydro.features.map(f=>f.id));
for(const old of g.metadata.retired_legacy_zone_ids){
 const zone=index.get(old);a(zone,'original zone absent '+old);
 a(zone.bbox&&!zone.geometry,'original source zone not preserved '+old);
 a.equal(zone.superseded_by,direct.get(old),'wrong replacement '+old);
 a(zone.source_urls.length,'source removed '+old);
 a(ids.has(zone.superseded_by)||hydroIds.has(zone.superseded_by),'replacement missing '+old);
 for(const s of sites.filter(s=>s.linked_zone_id===old))
  a.equal(s.superseded_by,zone.superseded_by,'source site not preserved '+s.id);
}
const remain=legacy.filter(z=>z.bbox&&!z.geometry&&!z.superseded_by);
a(remain.length<=13,'future source-verified batches must not reintroduce 5AD era rectangles');
const active=(z,y)=>z.periods?.some(p=>p.start_year<=y&&y<=p.end_year);
a(remain.filter(z=>active(z,1799)).length<=4,'subsequent source replacements cannot raise 1799 old boxes');
const coords=c=>{if(Array.isArray(c)&&typeof c[0]==='number')return[c];return c.flatMap(coords)};
for(const f of g.features){
 const p=f.properties,xy=coords(f.geometry.coordinates);
 a.equal(p.stable_id,f.id);a(p.periods?.every(q=>q.start_year<=q.end_year));
 a.equal(p.area_sqkm,null);a.equal(p.territorial_control_verified,false);
 a.equal(p.historical_boundary_confirmed,false);a.equal(p.uncertain_line_dashed,true);
 a.equal(p.exclude_from_area_aggregation,true);
 a(p.source_urls?.length>0&&p.source_urls.every(u=>u.startsWith('https://')));
 a(p.historical_context?.length>12);
 a(xy.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&
  Math.abs(x)<=180&&Math.abs(y)<=90));
}
const river=g.features.find(f=>f.id==='EDITOR38_5AD_HAYES_SASKATCHEWAN_WATERWAYS');
a(river&&river.geometry.type==='MultiLineString');
const riverIds=['EDITOR36_5Z_HAYES_LOWER','EDITOR36_5Z_SASKATCHEWAN_RIVER'];
const actual=riverIds.flatMap(id=>{
 const f=hydro.features.find(x=>x.id===id);a(f,'missing source river '+id);
 return f.geometry.coordinates.map(line=>line.map(x=>x.slice(0,2)));
});
a.deepEqual(river.geometry.coordinates,actual,'actual river vertices must be reused without invented lines');
a.equal(river.properties.source_vertices,actual.reduce((s,l)=>s+l.length,0));
a.equal(river.properties.source_parts,actual.length);
a.equal(river.properties.area_sqkm,null);
const belize=id=>g.features.find(f=>f.id===id);
a.equal(belize('EDITOR38_5AD_BELIZE_HONDO_1783').properties.periods[0].start_year,1783);
a.equal(belize('EDITOR38_5AD_BELIZE_SIBUN_1786').properties.periods[0].start_year,1786);
a.equal(belize('EDITOR38_5AD_TANJORE_1799').properties.periods[0].start_year,1799);
a(!g.features.some(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)),'no invented concession border');
a.equal(read('app.js').split('window.eighteenthEditor38FiveAD?.render?.();').length-1,4);
a(read('index.html').includes('js/eighteenth-editor38-5ad-geography.js?v=20261121-5ad-hayes-belize-historic-sites'));
console.log('PASS Editor38 5AD original 25 boxes retained; future 5AE supersessions allowed; 26 named points, 1 preserved 298-vertex sourced hydrological feature, Belize staged 1783/1786.');
