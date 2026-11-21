#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const raw=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),J=p=>JSON.parse(raw(p));
const d=J('data/eighteenth-century-editor37-5aa-bengal.geojson'),b=J('data/eighteenth-century-expansion-batch36-1700-1799.json'),i=J('data/eighteenth-century-b38-india-mysore.json');
a.equal(d.metadata.schema,'atlas-editor37-5aa-rennell-physical-and-fiscal-anchors-v1');
a.equal(d.features.length,17);a.equal(d.features.filter(f=>f.geometry.type==='Point').length,16);
a.equal(d.features.filter(f=>f.geometry.type==='MultiLineString').length,1);
a.equal(new Set(d.features.map(f=>f.id)).size,17);
for(const f of d.features){const p=f.properties;
 a.equal(p.stable_id,f.id);a.equal(p.area_sqkm,null);
 a.equal(p.uncertain_line_dashed,true);a.equal(p.exclude_from_area_aggregation,true);
 a.equal(p.territorial_control_verified,false);a.equal(p.historical_boundary_confirmed,false);
 a(p.source_urls.length>=2&&p.source_urls.every(u=>u.startsWith('https://')));
}
const coast=d.features.find(f=>f.geometry.type==='MultiLineString');
a.equal(coast.geometry.coordinates[0].length,21);
a(coast.geometry.coordinates[0].every(([x,y])=>x>=85&&x<=94&&y>=18&&y<=24.5));
const ids=d.metadata.retired_legacy_zones;a.equal(ids.length,23);a.equal(new Set(ids).size,23);
let count=0;
for(const id of ids){const doc=id.startsWith('B36')?b:i,z=doc.zones.find(x=>x.id===id);
 a(z&&z.superseded_by&&z.bbox&&z.source_urls.length&&z.area_sqkm===null,id);
 for(const s of doc.sites.filter(s=>s.linked_zone_id===id))a.equal(s.superseded_by,z.superseded_by);
 if(z.periods.some(p=>p.start_year<=1799&&p.end_year>=1799))count++;
}
a.equal(count,17);a(!d.features.some(f=>f.geometry.type==='Polygon'));
a.equal(raw('app.js').split('window.eighteenthEditor37FiveAA?.render?.();').length-1,4);
a(raw('index.html').includes('js/eighteenth-editor37-5aa-bengal.js?v=20261121-5aa-rennell'));
a(raw('js/eighteenth-editor37-5aa-bengal.js').includes('data-editor37-5aa-id'));
console.log('PASS editor37 5AA: 16 grounded sites + 21-vertex physical shore; 23 old rectangles retired.');
