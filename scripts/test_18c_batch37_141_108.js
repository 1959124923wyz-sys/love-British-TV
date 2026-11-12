#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const a=json('data/eighteenth-century-b37-africa.json');
const i=json('data/eighteenth-century-b37-india-ocean.json');
const c=json('data/eighteenth-century-b37-caribbean.json');
const old34=json('data/eighteenth-century-dynamic-spatial-1700-1799.json');
const old35=json('data/eighteenth-century-mass-schematic-zones-1700-1799.json');
const old36=json('data/eighteenth-century-expansion-batch36-1700-1799.json');
const app=read('app.js'),html=read('index.html'),render=read('js/eighteenth-batch37-spatial.js');
const records=[a,i,c],zone=records.flatMap(d=>d.zones),sites=records.flatMap(d=>d.sites);
const pcount=records.map(d=>[...d.zones,...d.sites].reduce((sum,x)=>sum+x.periods.length,0));
assert.deepEqual(records.map(d=>d.region),['africa','india-ocean','caribbean']);
assert.deepEqual(records.map(d=>d.zones.length),[40,60,41]);
assert.deepEqual(records.map(d=>d.sites.length),[27,44,37]);
assert.deepEqual(pcount,[67,104,86]);assert.equal(zone.length,141);assert.equal(sites.length,108);
assert.equal(zone.length+old34.area_references.length+old35.zones.length+old36.zones.length,376);
assert.equal(sites.length+old34.control_sites.length+old35.sites.length+old36.sites.length,248);
assert.equal(pcount.reduce((a,b)=>a+b,0)+
 old34.area_references.reduce((s,x)=>s+x.periods.length,0)+
 old34.control_sites.reduce((s,x)=>s+x.periods.length,0)+
 [...old35.zones,...old35.sites].reduce((s,x)=>s+x.periods.length,0)+
 [...old36.zones,...old36.sites].reduce((s,x)=>s+x.periods.length,0),673);
const allowed=new Set(['administration','military','displacement','resistance','paper_claim','diplomacy','trade_influence','battle','revenue','coercion','foreign_occupation']);
const ids=new Set(),matched=new Map();
for(const d of records){
 assert.equal(d.schema,'atlas-18c-batch37-region-v1');
 assert.equal(d.status,'research_preview_not_published');
 assert.equal(d.area_sqkm_totals,null);assert.equal(d.area_aggregation_forbidden,true);
 for(const x of [...d.zones,...d.sites]){
  assert(!ids.has(x.id),'duplicate '+x.id);ids.add(x.id);
  assert(allowed.has(x.kind));assert(x.title.length>5&&x.note.length>6);
  assert.equal(x.area_sqkm,null);
  assert.equal(x.source_urls[0],d.source_register[x.source_key]);
  assert(/^https:\/\//.test(x.source_urls[0]));
  assert(x.periods.length&&x.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year));
  if('bbox' in x){
   matched.set(x.id,x);
   assert.equal(x.precise_historic_border,false);
   assert.equal(x.uncertain_line_dashed,true);
   assert.equal(x.territorial_control_verified,false);
   assert.equal(x.exclude_from_territorial_area_totals,true);
   assert.equal(x.geometry_precision,'editorial_schematic_envelope_not_historical_survey');
   assert.equal(x.bbox.length,4);
   assert(x.bbox.every(Number.isFinite));assert(x.bbox[0]>=-180&&x.bbox[2]<=180&&x.bbox[1]>=-90&&x.bbox[3]<=90);
   assert(x.bbox[0]<x.bbox[2]&&x.bbox[1]<x.bbox[3]);
  }else{
   assert.equal(x.historical_city_wall_survey,false);
   assert.equal(x.screen_radius_not_ground_area,true);
   assert.equal(x.location_confidence,'proxy_bbox_centre');
   assert(x.coordinates.length===2&&x.coordinates.every(Number.isFinite));
  }
 }
 for(const s of d.sites){
  const z=d.zones.find(z=>z.id===s.linked_zone_id);
  assert(z&&z.marker&&z.kind===s.kind);
  assert.equal(s.title,z.title);assert.deepEqual(s.periods,z.periods);
  assert(Math.abs(s.coordinates[0]-(z.bbox[0]+z.bbox[2])/2)<1e-7);
  assert(Math.abs(s.coordinates[1]-(z.bbox[1]+z.bbox[3])/2)<1e-7);
 }
}
assert.equal(ids.size,249);
const search=(term,region)=>{const ds=region?records.filter(d=>d.region===region):records;const x=ds.flatMap(d=>d.zones).find(x=>x.title.includes(term));assert(x,'missing '+term);return x;};
const active=(x,y)=>x.periods.some(p=>y>=p.start_year&&y<=p.end_year);
for(const [term,region,y,expected] of [
 ['Fort Charles旧英国堡','africa',1730,true],
 ['Fort Charles旧英国堡','africa',1731,false],
 ['1757后阿诺马布','africa',1756,false],
 ['1757后阿诺马布','africa',1757,true],
 ['Dixcove Fort Metal Cross','africa',1700,true],
 ['Beyin Fort Apollonia','africa',1767,false],
 ['Beyin Fort Apollonia','africa',1768,true],
 ['Gambia James Island英商','africa',1778,true],
 ['Gambia James Island英商','africa',1779,false],
 ['1728 Bunce Island','africa',1728,true],
 ['1744—1778 Bunce Island','africa',1744,true],
 ['1744—1778 Bunce Island','africa',1779,false],
 ['Old Calabar英商协助','africa',1767,true],
 ['Old Calabar英商协助','africa',1768,false],
 ['马德拉斯Fort St George英公司旧驻城','india-ocean',1745,true],
 ['马德拉斯Fort St George英公司旧驻城','india-ocean',1746,false],
 ['马德拉斯Fort St George法军占城','india-ocean',1746,true],
 ['马德拉斯Fort St George英公司恢复','india-ocean',1749,true],
 ['1765后加尔各答','india-ocean',1764,false],
 ['1765后加尔各答','india-ocean',1765,true],
 ['1773—1774 Balambangan','india-ocean',1774,true],
 ['1773—1774 Balambangan','india-ocean',1775,false],
 ['1775 Balambangan','india-ocean',1775,true],
 ['1795 Malacca','india-ocean',1794,false],
 ['1795 Malacca','india-ocean',1795,true],
 ['1796 Ambon','india-ocean',1796,true],
 ['1796 Banda','india-ocean',1795,false],
 ['1763后英属Grenada','caribbean',1778,true],
 ['1763后英属Grenada','caribbean',1779,false],
 ['1779—1782法国夺取','caribbean',1782,true],
 ['1783后Grenada','caribbean',1783,true],
 ['1794英军短占Guadeloupe','caribbean',1794,true],
 ['1794英军短占Guadeloupe','caribbean',1795,false],
 ['1796英军攻占Saint Lucia','caribbean',1795,false],
 ['1796英军攻占Saint Lucia','caribbean',1796,true],
 ['1781英军短占St Eustatius','caribbean',1781,true],
 ['1781英军短占St Eustatius','caribbean',1782,false],
 ['1797英军占Trinidad','caribbean',1797,true],
 ['1798英军从Saint Domingue','caribbean',1798,true],
 ['1798英军从Saint Domingue','caribbean',1799,false]
])assert.equal(active(search(term,region),y),expected,term+' '+y);
assert.equal(search('Gold Coast英荷丹葡','africa').kind,'foreign_occupation');
assert.equal(search('Ouidah原住王国','africa').kind,'resistance');
assert.equal(search('Kandy内陆王国','india-ocean').kind,'resistance');
assert.equal(search('1763后英属Grenada','caribbean').kind,'administration');
assert.equal((app.match(/window\.eighteenthBatch37Spatial\?\.render\?\.\(\);/g)||[]).length,4);
assert(app.includes('.atlas-18c-b37-zone,.atlas-18c-b37-site,'));
assert(html.includes('js/eighteenth-batch37-spatial.js?v=18c-batch37-three-region-141-108-20261112'));
assert(html.includes('累计376区域、248据点、673时间阶段'));
assert(render.includes("get('review18c')!=='1'"));
assert(render.includes("areaLayer.clearLayers();siteLayer.clearLayers();"));
assert(render.includes('window.eighteenthBatch37Spatial='));
assert(!/area_sqkm\s*=\s*[1-9]/.test(render));
console.log('PASS B37: 141 region polygons,108 proxy cores,257 time phases; cumulative 376 area references,248 site cores,673 time stages. Historical flips, source keys, dashed GIS, legacy 34/35/36 unchanged.');
