#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),J=p=>JSON.parse(read(p));
const g=J('data/eighteenth-century-editor37-5ab-physical-areas.geojson');
const b37=J('data/eighteenth-century-b37-africa.json'),
 b39=J('data/eighteenth-century-b39-gold-coast-forts.json'),
 bc=J('data/eighteenth-century-b39-caribbean-1759-1763.json'),
 b36=J('data/eighteenth-century-expansion-batch36-1700-1799.json');
const m=new Map(g.features.map(f=>[f.id,f]));a.equal(m.size,26);
a.equal(g.metadata.retired_legacy_zones.length,26);
a.equal(g.metadata.area_aggregation_forbidden,true);
a.equal(g.metadata.historical_area_sqkm,null);
a.equal(g.features.filter(f=>f.geometry.type==='Point').length,15);
a.equal(g.features.filter(f=>f.geometry.type==='MultiLineString').length,4);
a.equal(g.features.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).length,7);
let active1799=0;
for(const id of g.metadata.retired_legacy_zones){
 const doc=id.startsWith('B37')?b37:id.startsWith('B39-A')?b39:id.startsWith('B39-C')?bc:b36;
 const z=doc.zones.find(x=>x.id===id);
 a(z&&z.bbox&&!z.geometry&&z.superseded_by&&z.source_urls.length,id);
 a(m.has(z.superseded_by),id+' -> '+z.superseded_by);
 for(const site of (doc.sites||[]).filter(x=>x.linked_zone_id===id))a.equal(site.superseded_by,z.superseded_by);
 if(z.periods.some(p=>p.start_year<=1799&&1799<=p.end_year))active1799++;
}
a.equal(active1799,22);
for(const f of g.features){
 const p=f.properties;
 a.equal(f.id,p.stable_id);a(p.historical_context?.length>22);
 a.equal(p.area_sqkm,null);a.equal(p.historical_boundary_confirmed,false);
 a.equal(p.territorial_control_verified,false);a.equal(p.uncertain_line_dashed,true);
 a.equal(p.exclude_from_area_aggregation,true);
 a(p.source_urls.every(u=>u.startsWith('https://')));
 a(p.periods.every(t=>t.start_year<=t.end_year));
}
const beyin=m.get('EDITOR37_5AB_BEYIN').geometry.coordinates;
const fortBeyin=m.get('EDITOR37_5AB_BEYIN_FORT_AFTER_1773').geometry.coordinates[0];
const center=fortBeyin.slice(0,-1).reduce((a,c)=>[a[0]+c[0],a[1]+c[1]],[0,0]).map(n=>n/(fortBeyin.length-1));
a(Math.hypot(beyin[0]-center[0],beyin[1]-center[1])<0.00005,'Beyin early site must match registered fort locality, never invent distant point');
a(m.get('EDITOR37_5AB_VIZAGAPATAM').properties.source_urls.some(u=>u.includes('geonames.nga.mil')));
a.equal(m.get('EDITOR37_5AB_1763_FRENCH_RESTORED_ISLANDS').geometry.type,'MultiPolygon');
a(m.get('EDITOR37_5AB_GUADELOUPE_SUGAR_SHORE').geometry.coordinates.length>=2);
a(m.get('EDITOR37_5AB_GOLD_COAST_SHORE').geometry.coordinates[0].length>=25);
a(m.get('EDITOR37_5AB_CIRCARS_BAY_SHORE').geometry.coordinates[0].length>=40);
a(m.get('EDITOR37_5AB_GODAVARI_RIVER').geometry.coordinates.some(s=>s.length>=6));
a(m.get('EDITOR37_5AB_KRISHNA_RIVER').geometry.coordinates.some(s=>s.length>=6));
a.equal(read('app.js').split('window.eighteenthEditor37FiveAB?.render?.();').length-1,4);
a(read('index.html').includes('js/eighteenth-editor37-5ab-physical-areas.js?v=20261121-5ab-coasts-islands-forts'));
a(read('js/eighteenth-editor37-5ab-physical-areas.js').includes('data-editor37-5ab-id'));
console.log('PASS 5AB: 26 historic zones retired; 7 verified-source geographic polygons, 4 real physical lines, 15 anchored sites; 1799 legacy 44 -> 22.');
