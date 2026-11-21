#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),J=p=>JSON.parse(read(p));
const g=J('data/eighteenth-century-editor37-5ac-surveyed-geography.geojson');
const files=[J('data/eighteenth-century-expansion-batch36-1700-1799.json'),
 J('data/eighteenth-century-b38-south-campaign.json'),
 J('data/eighteenth-century-b38-india-mysore.json')];
const find=id=>files.flatMap(x=>x.zones||[]).find(x=>x.id===id);
const ids=new Set(g.features.map(f=>f.id));
a.equal(g.features.length,38);a.equal(ids.size,38);
a.equal(g.metadata.retired_legacy_zone_ids.length,33);
a.equal(g.metadata.retired_1799,0);
a.equal(g.features.filter(f=>f.properties.kind==='nps_abpp_revolutionary_war_study_polygon').length,19);
a.equal(g.features.filter(f=>f.geometry.type==='MultiLineString').length,5);
a.equal(g.features.filter(f=>f.geometry.type==='Point').length,11);
a.equal(g.features.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).length,22);
for(const old of g.metadata.retired_legacy_zone_ids){
 const z=find(old);a(z,'missing '+old);a(z.bbox&&!z.geometry&&z.superseded_by,'unretired '+old);
 a(ids.has(z.superseded_by),'destination missing '+old);
 a(z.source_urls.length>0,'source lost '+old);
 const sites=files.flatMap(x=>x.sites||[]).filter(x=>x.linked_zone_id===old);
 for(const s of sites)a.equal(s.superseded_by,z.superseded_by);
}
const coords=c=>{if(Array.isArray(c)&&typeof c[0]==='number')return [c];return c.flatMap(coords)};
for(const f of g.features){
 const p=f.properties,xy=coords(f.geometry.coordinates);
 a.equal(p.stable_id,f.id);a.equal(p.area_sqkm,null);a.equal(p.territorial_control_verified,false);
 a.equal(p.uncertain_line_dashed,true);a.equal(p.exclude_from_area_aggregation,true);
 a(p.source_urls.every(u=>u.startsWith('https://')));
 a(xy.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90));
 if(p.kind==='nps_abpp_revolutionary_war_study_polygon'){
  a.equal(p.source_abpp_boundary,'STUDY AREA');
  a.equal(p.source_abpp_war,'REVOLUTIONARY WAR');
  a(p.source_abpp_site&&p.source_abpp_name);
  const rings=f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat();
  a(rings.length>=1);
  for(const ring of rings){a(ring.length>=4);a.deepEqual(ring[0],ring.at(-1));}

 }
 if(p.kind.startsWith('physical_'))a(p.source_vertices>=10);
}
const king=g.features.find(f=>f.id==='EDITOR37_5AC_ABPP_28');
a(king.geometry.coordinates[0].some(x=>x[0]<-81.45));
a(!ids.has('EDITOR37_5AC_ABPP_126'),'Gloucester MA must not substitute Virginia Gloucester Point');
a(g.features.some(f=>f.id==='EDITOR37_5AC_FORT_CUMBERLAND_CHIGNECTO'));
a.equal(read('app.js').split('window.eighteenthEditor37FiveAC?.render?.();').length-1,4);
a(read('index.html').includes('js/eighteenth-editor37-5ac-battlefields.js?v=20261121-5ac-official-abpp'));
console.log('PASS 5AC source GIS: 33 original boxes retired; 19 actual NPS battlefield survey polygons + 3 contextual historic/nodal polygons, 5 natural water lines and 11 named sites.');
