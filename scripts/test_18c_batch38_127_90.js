#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const regions=['south-campaign','hudson-company','india-mysore'];
const docs=regions.map(region=>json('data/eighteenth-century-b38-'+region+'.json'));
const old34=json('data/eighteenth-century-dynamic-spatial-1700-1799.json'),
 old35=json('data/eighteenth-century-mass-schematic-zones-1700-1799.json'),
 old36=json('data/eighteenth-century-expansion-batch36-1700-1799.json');
const old37=['africa','india-ocean','caribbean'].map(r=>json('data/eighteenth-century-b37-'+r+'.json'));
const zones=docs.flatMap(d=>d.zones),sites=docs.flatMap(d=>d.sites);
assert.deepEqual(docs.map(d=>d.zones.length),[48,32,47]);
assert.deepEqual(docs.map(d=>d.sites.length),[41,16,33]);
assert.equal(zones.length,127);assert.equal(sites.length,90);
const phases=docs.map(d=>[...d.zones,...d.sites].reduce((n,x)=>n+x.periods.length,0));
assert.deepEqual(phases,[89,48,80]);assert.equal(phases.reduce((s,n)=>s+n,0),217);
const previousZones=old34.area_references.length+old35.zones.length+old36.zones.length+old37.reduce((n,d)=>n+d.zones.length,0);
const previousSites=old34.control_sites.length+old35.sites.length+old36.sites.length+old37.reduce((n,d)=>n+d.sites.length,0);
assert.equal(previousZones,376);assert.equal(previousSites,248);
assert.equal(previousZones+zones.length,503);assert.equal(previousSites+sites.length,338);
const previousPhases=[...old34.area_references,...old34.control_sites,...old35.zones,...old35.sites,...old36.zones,...old36.sites,...old37.flatMap(d=>[...d.zones,...d.sites])].reduce((n,x)=>n+x.periods.length,0);
assert.equal(previousPhases,673);assert.equal(previousPhases+217,890);
const ids=new Set(),kinds=new Set(['administration','military','displacement','resistance','paper_claim','diplomacy','trade_influence','battle','revenue','coercion','foreign_occupation']);
for(const d of docs){
 assert.equal(d.schema,'atlas-18c-batch38-v1');assert.equal(d.review_only,true);
 assert.equal(d.area_sqkm_totals,null);assert.equal(d.area_aggregation_forbidden,true);
 for(const x of [...d.zones,...d.sites]){
  assert(!ids.has(x.id),x.id);ids.add(x.id);
  assert(kinds.has(x.kind),x.kind);
  assert(x.title.length>5&&x.note.length>10,x.id);
  assert.equal(x.area_sqkm,null);
  assert.equal(x.source_urls[0],d.source_register[x.source_key],x.id);
  assert(x.source_urls[0]?.startsWith('https://'));
  assert(x.periods.length>0&&x.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year),x.id);
  if(x.bbox){
   const b=x.bbox;
   assert(b.length===4&&b.every(Number.isFinite)&&b[0]>=-180&&b[2]<=180&&b[1]>=-90&&b[3]<=90&&b[0]<b[2]&&b[1]<b[3],x.id);
   assert.equal(x.uncertain_line_dashed,true);
   assert.equal(x.precise_historic_border,false);
   assert.equal(x.territorial_control_verified,false);
   assert.equal(x.exclude_from_territorial_area_totals,true);
   assert.equal(x.geometry_precision,'unsurveyed_editorial_reference_bbox');
  }else{
   assert(x.coordinates.length===2&&x.coordinates.every(Number.isFinite),x.id);
   assert.equal(x.historical_city_wall_survey,false);
   assert.equal(x.screen_radius_not_ground_area,true);
   assert.equal(x.location_confidence,'proxy_region_centre');
   const linked=d.zones.find(z=>z.id===x.linked_zone_id);
   assert(linked&&linked.marker, x.id);
   assert.deepEqual(x.periods,linked.periods);assert.equal(x.kind,linked.kind);
   assert(Math.abs(x.coordinates[0]-(linked.bbox[0]+linked.bbox[2])/2)<1e-7);
   assert(Math.abs(x.coordinates[1]-(linked.bbox[1]+linked.bbox[3])/2)<1e-7);
  }
 }
}
assert.equal(ids.size,217);
const find=(region,term)=>{
 const x=docs.find(d=>d.region===region)?.zones.find(x=>x.title.includes(term));
 assert(x,'source title missing '+region+' '+term);return x;
};
const on=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
for(const [region,title,year,expected] of [
 ['south-campaign','英军在卡姆登军事驻镇',1780,true],
 ['south-campaign','英军在卡姆登军事驻镇',1781,false],
 ['south-campaign','Fort Watson英方',1780,true],
 ['south-campaign','Fort Watson英方',1781,false],
 ['south-campaign','Fort Watson美军',1781,true],
 ['south-campaign','Fort Cornwallis投降',1781,true],
 ['south-campaign','Charleston英军港区',1781,true],
 ['south-campaign','Charleston英军港区',1782,false],
 ['south-campaign','1782年Charleston撤军',1782,true],
 ['south-campaign','Yorktown英国包围圈',1781,true],
 ['south-campaign','Yorktown英国包围圈',1782,false],
 ['hudson-company','1714年后York Factory',1713,false],
 ['hudson-company','1714年后York Factory',1714,true],
 ['hudson-company','1714年后York Factory',1782,false],
 ['hudson-company','1782年法国军舰',1782,true],
 ['hudson-company','1788后York Factory III',1787,false],
 ['hudson-company','1788后York Factory III',1788,true],
 ['hudson-company','Prince of Wales Fort英军',1781,true],
 ['hudson-company','1782法国舰队攻取',1782,true],
 ['hudson-company','Prince of Wales Fort英军',1782,false],
 ['hudson-company','Cumberland House首处内陆',1773,false],
 ['hudson-company','Cumberland House首处内陆',1774,true],
 ['hudson-company','Niagara旧英军堡延迟',1795,true],
 ['hudson-company','Niagara旧英军堡延迟',1796,false],
 ['india-mysore','1746年法国夺占Madras',1746,true],
 ['india-mysore','1749年后Madras',1748,false],
 ['india-mysore','1749年后Madras',1749,true],
 ['india-mysore','1756年Bengal纳瓦卜',1756,true],
 ['india-mysore','1757年Clive重新攻取',1757,true],
 ['india-mysore','1761年Pondicherry法国商馆',1764,true],
 ['india-mysore','1761年Pondicherry法国商馆',1765,false],
 ['india-mysore','1765年后Pondicherry法属',1765,true],
 ['india-mysore','1784年Tipu Sultan',1783,false],
 ['india-mysore','1784年Tipu Sultan',1784,true],
 ['india-mysore','1784年Burma征服Arakan',1784,true],
 ['india-mysore','1799年Seringapatam英军',1799,true]
 ])assert.equal(on(find(region,title),year),expected,title+' '+year);
assert.equal(find('india-mysore','1765年公司名义Orissa').kind,'paper_claim');
assert.equal(find('hudson-company','Assiniboin原住民').kind,'resistance');
assert.equal(find('india-mysore','1784年Mangalore公司撤回').kind,'diplomacy');
const app=read('app.js'),html=read('index.html'),js=read('js/eighteenth-batch38-spatial.js');
assert.equal((app.match(/window\.eighteenthBatch38Spatial\?\.render\?\.\(\);/g)||[]).length,4);
assert(app.includes('.atlas-18c-b38-zone,.atlas-18c-b38-site,'));
assert(html.includes('js/eighteenth-batch38-spatial.js?v=18c-batch38-south-hudson-mysore-127-90-20261112'));
assert(html.includes('累计503组区域面、338个地点核心、890个时间阶段'));
assert(js.includes("get('review18c')!=='1'"));
assert(js.includes("areaLayer.clearLayers();siteLayer.clearLayers();"));
assert(js.includes('window.eighteenthBatch38Spatial='));
assert(js.includes('counts={\'south-campaign\':[48,41],'));
assert(!/area_sqkm\s*=\s*[1-9]/.test(js));
console.log('PASS: 127 new schematic zones,90 linked reference cores,217 time phases; cumulative 503,338,890. Exact 18C reversals, proxy geometry, origins and preview access validated.');
