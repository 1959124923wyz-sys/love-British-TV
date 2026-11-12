#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),J=p=>JSON.parse(read(p));
const regions=['caribbean-1759-1763','gold-coast-forts','gulf-surat-factories'],d=regions.map(r=>J('data/eighteenth-century-b39-'+r+'.json'));
const zones=d.flatMap(x=>x.zones),sites=d.flatMap(x=>x.sites);
assert.deepEqual(d.map(x=>x.zones.length),[45,36,45]);
assert.deepEqual(d.map(x=>x.sites.length),[28,20,35]);
assert.deepEqual(d.map(x=>[...x.zones,...x.sites].reduce((n,z)=>n+z.periods.length,0)),[73,56,80]);
assert.equal(zones.length,126);assert.equal(sites.length,83);
const old34=J('data/eighteenth-century-dynamic-spatial-1700-1799.json'),old35=J('data/eighteenth-century-mass-schematic-zones-1700-1799.json'),old36=J('data/eighteenth-century-expansion-batch36-1700-1799.json');
const old37=['africa','india-ocean','caribbean'].map(x=>J('data/eighteenth-century-b37-'+x+'.json'));
const old38=['south-campaign','hudson-company','india-mysore'].map(x=>J('data/eighteenth-century-b38-'+x+'.json'));
const priorAreas=[...old34.area_references,...old35.zones,...old36.zones,...old37.flatMap(x=>x.zones),...old38.flatMap(x=>x.zones)];
const priorSites=[...old34.control_sites,...old35.sites,...old36.sites,...old37.flatMap(x=>x.sites),...old38.flatMap(x=>x.sites)];
assert.equal(priorAreas.length,503);assert.equal(priorSites.length,338);
assert.equal(503+zones.length,629);assert.equal(338+sites.length,421);
assert.equal([...priorAreas,...priorSites].reduce((a,z)=>a+z.periods.length,0),890);
assert.equal([...priorAreas,...priorSites,...zones,...sites].reduce((a,z)=>a+z.periods.length,0),1099);
const allowed=new Set(['administration','military','displacement','resistance','paper_claim','diplomacy','trade_influence','battle','revenue','coercion','foreign_occupation']);
const ids=new Set();
for(const group of d){
 assert.equal(group.schema,'atlas-18c-batch39-v1');
 assert.equal(group.review_only,true);
 assert.equal(group.area_sqkm_totals,null);assert.equal(group.area_aggregation_forbidden,true);
 for(const item of [...group.zones,...group.sites]){
  assert(!ids.has(item.id),'duplicate '+item.id);ids.add(item.id);
  assert(allowed.has(item.kind),item.id);
  assert(item.title.length>=8&&item.note.length>10,item.id);
  assert.equal(item.area_sqkm,null);
  assert(item.source_urls[0]?.startsWith('https://'),item.id);
  assert.equal(group.source_register[item.source_key],item.source_urls[0],item.id);
  assert(item.periods.length&&item.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year),item.id);
  if('bbox' in item){
   const b=item.bbox;assert(b.length===4&&b.every(Number.isFinite),item.id);
   assert(b[0]>=-180&&b[2]<=180&&b[1]>=-90&&b[3]<=90&&b[0]<b[2]&&b[1]<b[3],item.id);
   assert.equal(item.geometry_precision,'unsurveyed_editorial_reference_bbox');
   assert.equal(item.precise_historic_border,false);
   assert.equal(item.uncertain_line_dashed,true);
   assert.equal(item.territorial_control_verified,false);
   assert.equal(item.exclude_from_territorial_area_totals,true);
  }else{
   const parent=group.zones.find(x=>x.id===item.linked_zone_id);
   assert(parent&&parent.marker,item.id);
   assert.equal(item.kind,parent.kind);
   assert.deepEqual(item.periods,parent.periods);
   assert.equal(item.location_confidence,'proxy_region_centre');
   assert.equal(item.screen_radius_not_ground_area,true);
   assert.equal(item.historical_city_wall_survey,false);
   assert(Math.abs(item.coordinates[0]-(parent.bbox[0]+parent.bbox[2])/2)<1e-8);
   assert(Math.abs(item.coordinates[1]-(parent.bbox[1]+parent.bbox[3])/2)<1e-8);
  }
 }
}
assert.equal(ids.size,209);
const lookup=(r,s)=>{const g=d.find(x=>x.region===r);const z=g.zones.find(x=>x.title.includes(s));assert(z,'missing '+r+' '+s);return z;};
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
for(const [r,label,year,yes] of [
 ['caribbean-1759-1763','法国瓜德罗普岛英军短期占领',1758,false],
 ['caribbean-1759-1763','法国瓜德罗普岛英军短期占领',1759,true],
 ['caribbean-1759-1763','法国瓜德罗普岛英军短期占领',1763,false],
 ['caribbean-1759-1763','瓜德罗普归还法国',1763,true],
 ['caribbean-1759-1763','英国占Martinique法属殖民岛',1762,true],
 ['caribbean-1759-1763','英国占Martinique法属殖民岛',1763,false],
 ['caribbean-1759-1763','Saint Lucia英国短期占据',1762,true],
 ['caribbean-1759-1763','Saint Lucia英国短期占据',1763,false],
 ['caribbean-1759-1763','Havana英军短期占港',1762,true],
 ['caribbean-1759-1763','Havana英军短期占港',1763,false],
 ['caribbean-1759-1763','Saint Kitts法军短占',1782,true],
 ['caribbean-1759-1763','Saint Kitts法军短占',1783,false],
 ['gold-coast-forts','Otuam Tantumquery英商堡垒',1729,false],
 ['gold-coast-forts','Otuam Tantumquery英商堡垒',1730,true],
 ['gold-coast-forts','Prampram Fort Vernon',1741,false],
 ['gold-coast-forts','Prampram Fort Vernon',1742,true],
 ['gold-coast-forts','Anomabu Fort Charles英商旧堡',1730,true],
 ['gold-coast-forts','Anomabu Fort Charles英商旧堡',1731,false],
 ['gold-coast-forts','Anomabu Fort William英堡完工',1756,false],
 ['gold-coast-forts','Anomabu Fort William英堡完工',1757,true],
 ['gold-coast-forts','Beyin Apollonia英方筑堡',1767,false],
 ['gold-coast-forts','Beyin Apollonia英方筑堡',1768,true],
 ['gold-coast-forts','Ada丹麦Fort Kongenstein',1782,false],
 ['gold-coast-forts','Ada丹麦Fort Kongenstein',1783,true],
 ['gulf-surat-factories','Bushire英东印度公司Residency开办',1762,false],
 ['gulf-surat-factories','Bushire英东印度公司Residency开办',1763,true],
 ['gulf-surat-factories','Bushire Residency临时停办',1769,true],
 ['gulf-surat-factories','Bushire英东印度公司Residency开办',1769,false],
 ['gulf-surat-factories','Bushire英国公司驻地重开',1774,false],
 ['gulf-surat-factories','Bushire英国公司驻地重开',1775,true],
 ['gulf-surat-factories','Baghdad东印度公司政治Residency成立',1797,false],
 ['gulf-surat-factories','Baghdad东印度公司政治Residency成立',1798,true],
 ['gulf-surat-factories','Broach/Bharuch公司商业及税务日志',1775,true],
 ['gulf-surat-factories','Patna省税收委员会报告',1772,true],
 ['gulf-surat-factories','Tellicherry公司政治咨询和书信',1792,true]
])assert.equal(active(lookup(r,label),year),yes,label+' '+year);
assert.equal(lookup('gold-coast-forts','荷兰Sekondi Fort Orange').kind,'foreign_occupation');
assert.equal(lookup('gold-coast-forts','Accra Christiansborg丹麦').kind,'foreign_occupation');
assert.equal(lookup('gulf-surat-factories','Bushire Residency临时停办').kind,'paper_claim');
assert.equal(lookup('gulf-surat-factories','Baghdad东印度公司政治Residency成立').kind,'diplomacy');
const app=read('app.js'),html=read('index.html'),js=read('js/eighteenth-batch39-spatial.js');
assert.equal((app.match(/window\.eighteenthBatch39Spatial\?\.render\?\.\(\);/g)||[]).length,4);
assert(app.includes('.atlas-18c-b39-zone,.atlas-18c-b39-site,'));
assert(html.includes('js/eighteenth-batch39-spatial.js?v=18c-batch39-caribbean-goldcoast-gulf-126-83-20261112'));
assert(!html.includes('第39批地图扩容')&&html.includes('地图图例'),'release log should live in research docs, not the reader legend');
assert(js.includes("get('review18c')!=='1'"));
assert(js.includes("areaLayer.clearLayers();siteLayer.clearLayers();"));
assert(js.includes("window.eighteenthBatch39Spatial="));
assert(js.includes("areas.length!==126||points.length!==83"));
assert(!/area_sqkm\s*=\s*[1-9]/.test(js));
console.log('PASS 18c39 new 126 zones,83 cores,209 phase spans; cumulative 629 zones,421 points,1099 phases; geography, source, historical withdrawal, local autonomy and GIS constraints valid.');
