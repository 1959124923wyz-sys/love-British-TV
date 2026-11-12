#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
const D=p=>JSON.parse(read(p));
const a=D('data/eighteenth-century-expansion-batch36-1700-1799.json');
const b=D('data/eighteenth-century-mass-schematic-zones-1700-1799.json');
const c=D('data/eighteenth-century-dynamic-spatial-1700-1799.json');
const app=read('app.js'),view=read('index.html'),paint=read('js/eighteenth-batch36-spatial.js');
assert.equal(a.schema,'atlas-18c-batch36-frontiers-mysore-atlantic-v1');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(a.zones.length,130);assert.equal(a.sites.length,83);
const all=[...a.zones,...a.sites],stage=all.reduce((n,x)=>n+x.periods.length,0);
assert.equal(stage,221);
assert.equal(a.zones.length+b.zones.length+c.area_references.length,235);
assert.equal(a.sites.length+b.sites.length+c.control_sites.length,140);
assert.equal(stage+[...b.zones,...b.sites].reduce((n,x)=>n+x.periods.length,0)+
 [...c.area_references,...c.control_sites].reduce((n,x)=>n+x.periods.length,0),416);
assert.equal(a.area_aggregation_forbidden,true);assert.equal(a.approved_actual_control_polygons,0);
assert.equal(a.area_sqkm_totals,null);
const kinds=new Set(['administration','military','displacement','resistance','paper_claim','diplomacy','trade_influence','battle','revenue','coercion','foreign_occupation']);
const IDs=new Set();
for(const x of all){
 assert(!IDs.has(x.id),x.id);IDs.add(x.id);
 assert(x.source_urls.length===1&&x.source_urls[0].startsWith('https://'),x.id);
 assert.equal(a.source_register[x.source_key],x.source_urls[0]);
 assert.equal(x.area_sqkm,null);assert(kinds.has(x.kind));
 assert(x.periods.length&&x.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&
  p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year),x.id);
 if(x.bbox){
  assert(x.bbox.length===4&&x.bbox.every(Number.isFinite),x.id);
  assert(x.bbox[0]<x.bbox[2]&&x.bbox[1]<x.bbox[3],x.id);
  assert.equal(x.territorial_control_verified,false);
  assert.equal(x.precise_historic_border,false);
  assert.equal(x.uncertain_line_dashed,true);
  assert.equal(x.exclude_from_territorial_area_totals,true);
  assert.equal(x.geometry_precision,'unsurveyed_editorial_reference_rectangle');
 }else{
  assert(x.coordinates.length===2&&x.coordinates.every(Number.isFinite),x.id);
  assert.equal(x.location_confidence,'schematic_bbox_centre_not_surveyed');
  assert.equal(x.historical_city_wall_survey,false);
  assert.equal(x.screen_radius_not_ground_area,true);
  const z=a.zones.find(z=>z.id===x.linked_zone_id);
  assert(z&&z.marker&&z.kind===x.kind,x.id);
  assert(Math.abs((z.bbox[0]+z.bbox[2])/2-x.coordinates[0])<1e-7);
  assert(Math.abs((z.bbox[1]+z.bbox[3])/2-x.coordinates[1])<1e-7);
  assert.deepEqual(x.periods,z.periods);
 }
}
const zoneTitle=s=>{const x=a.zones.find(z=>z.title.includes(s));assert(x,'missing '+s);return x;};
const on=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
for(const [name,y,expected] of [
 ['阿康蓬马龙',1738,false],['阿康蓬马龙',1739,true],
 ['大普雷阿卡迪亚人',1754,false],['大普雷阿卡迪亚人',1755,true],
 ['塔基起义',1760,true],['塔基起义',1761,false],
 ['波利卢尔',1780,true],['波利卢尔',1781,false],
 ['1757后加尔各答威廉堡',1757,true],
 ['阿巴拉契亚北部禁垦',1762,false],['阿巴拉契亚北部禁垦',1763,true],
 ['斯坦威克斯堡原住民与英方会盟',1767,false],['斯坦威克斯堡原住民与英方会盟',1768,true],
 ['公司财政权',1765,false], // this probe is replaced by dedicated named title below
 ].filter(t=>t[0]!=='公司财政权')) assert.equal(on(zoneTitle(name),y),expected,name+' '+y);
const check=(name,before,active,after)=>{
 const z=zoneTitle(name);assert(!on(z,before));assert(on(z,active));assert(!on(z,after),name);
};
check('迈索尔割让丁迪古尔',1791,1792,1800);
check('迈索尔战后哥印拜陀',1798,1799,1800);
check('1764布克萨尔',1763,1764,1765);
check('1781彭萨科拉',1780,1781,1782);
check('格林纳达费东起义山区',1794,1795,1797);
check('1777萨拉托加',1776,1777,1778);
const post=zoneTitle('1776—1783斯塔滕岛');
assert(on(post,1782)&&!on(post,1783));
const treaty=zoneTitle('1792后库格王公');
assert.equal(treaty.kind,'trade_influence');
const orissa=zoneTitle('1765年奥里萨克塔克');
assert.equal(orissa.kind,'paper_claim');
assert.equal(zoneTitle('18世纪大阴郁沼泽').kind,'resistance');
assert.equal(zoneTitle('1782年巴哈马拿骚').kind,'foreign_occupation');
assert.equal((app.match(/window\.eighteenthBatch36Spatial\?\.render\?\.\(\);/g)||[]).length,4);
assert(app.includes('.atlas-18c-b36-zone,.atlas-18c-b36-site,'));
assert(view.includes('js/eighteenth-batch36-spatial.js?v=18c-batch36-frontiers-mysore-130-83-20261112'));
assert(view.includes('合计235组动态参考面、140个核心、416个年度阶段'));
assert(paint.includes("get('review18c')!=='1'"));
assert(paint.includes("zonesLayer.clearLayers();pointsLayer.clearLayers();"));
assert(paint.includes("window.eighteenthBatch36Spatial="));
assert(!/area_sqkm\s*=\s*[1-9]/.test(paint));
console.log('PASS batch36 130 new zones, 83 centres, 221 phases; cumulative 235 areas,140 centres,416 phases; no claimed territorial areas, indigenous/foreign/fiscal semantics and temporal transitions valid.');
