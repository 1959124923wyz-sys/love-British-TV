#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const J=p=>JSON.parse(read(p));
const data=J('data/eighteenth-century-editor36-5z-waterways.geojson');
const b36=J('data/eighteenth-century-expansion-batch36-1700-1799.json');
const hbc=J('data/eighteenth-century-b38-hudson-company.json');
const app=read('app.js'),html=read('index.html'),layer=read('js/eighteenth-editor36-5z-waterways.js');
a.equal(data.type,'FeatureCollection');
a.equal(data.metadata.schema,'atlas-editor36-5z-hydro-physical-geography-v1');
a.equal(data.metadata.area_aggregation_forbidden,true);
a.equal(data.metadata.historical_area_sqkm,null);
a.equal(data.features.length,18);
const poly=data.features.filter(f=>f.geometry.type==='Polygon');
const line=data.features.filter(f=>f.geometry.type==='MultiLineString');
a.equal(poly.length,10);a.equal(line.length,8);
const map=new Map(data.features.map(f=>[f.id,f]));
a.equal(map.size,18);
function validCoords(value){return Array.isArray(value)&&value.length===2&&value.every(Number.isFinite)&&value[0]>=-180&&value[0]<=180&&value[1]>=-90&&value[1]<=90;}
function check(f){
 const p=f.properties;
 a.equal(p.stable_id,f.id);
 a(p.title.length>=6&&p.historical_context.length>12,f.id);
 a.equal(p.area_sqkm,null);a.equal(p.exclude_from_area_aggregation,true);
 a.equal(p.historical_boundary_confirmed,false);a.equal(p.territorial_control_verified,false);a.equal(p.uncertain_line_dashed,true);
 a(p.geometry_precision.startsWith('present_day_natural_earth_10m_'),f.id);
 a(p.source_urls.every(u=>/^https:\/\//.test(u))&&p.source_urls.length>=2,f.id);
 a.equal(p.periods.length,1);a.equal(p.periods[0].end_year,1800);
 a(p.periods[0].start_year>=1732&&p.periods[0].start_year<=1799,f.id);
 if(f.geometry.type==='Polygon'){
  a.equal(p.kind,'lake_shore');
  for(const ring of f.geometry.coordinates){
   a(ring.length>=4&&ring.every(validCoords),f.id);
   a.deepEqual(ring[0],ring.at(-1),f.id);
  }
  a(f.geometry.coordinates[0].length>=15,'historic coastline reduced to crude box: '+f.id);
 }else {
  a.equal(p.kind,'river_course');
  for(const segment of f.geometry.coordinates){
   a(segment.length>=2&&segment.every(validCoords),f.id);
  }
  a(f.geometry.coordinates.some(s=>s.length>=6),'river reduced to straight chord: '+f.id);
 }
}
data.features.forEach(check);
for(const id of ['LAKE_WINNIPEG','LAKE_HURON','LAKE_SUPERIOR','LAKE_ERIE','LAKE_ONTARIO','LAKE_MICHIGAN','LAKE_MANITOBA','LAKE_WINNIPEGOSIS','LAKE_OF_WOODS','SIPIWESK_LAKE'])
 a(map.has('EDITOR36_5Z_'+id),'missing lake '+id);
for(const id of ['HAYES_LOWER','NELSON_RIVER','SASKATCHEWAN_RIVER','NORTH_SASKATCHEWAN_RIVER','RED_RIVER','ASSINIBOINE_RIVER','OTTAWA_RIVER','MISSISSIPPI_UPPER'])
 a(map.has('EDITOR36_5Z_'+id),'missing river '+id);
const legacy=[...hbc.zones,...b36.zones],oldMap=new Map(legacy.map(x=>[x.id,x]));
const retired=new Map([
 ['B38-H-Z006','EDITOR36_5Z_NELSON_RIVER'],
 ['B38-H-Z018','EDITOR36_5Z_SASKATCHEWAN_RIVER'],
 ['B38-H-Z021','EDITOR36_5Z_ASSINIBOINE_RIVER'],
 ['B38-H-Z023','EDITOR36_5Z_RED_RIVER'],
 ['B36-Z028','EDITOR36_5Z_MISSISSIPPI_UPPER'],
 ['B36-Z030','EDITOR36_5Z_LAKE_HURON'],
 ['B36-Z031','EDITOR36_5Z_OTTAWA_RIVER']
]);
a.equal(retired.size,7);
a.deepEqual(new Set(data.metadata.retired_legacy_zones),new Set(retired.keys()));
for(const [old,newid] of retired){
 const item=oldMap.get(old);
 a(item&&item.bbox&&!item.geometry&&item.area_sqkm===null&&item.source_urls.length,old);
 a.equal(item.superseded_by,newid);a(map.has(newid),newid);
}
const retired1799=[...retired.keys()].filter(id=>oldMap.get(id).periods.some(p=>p.start_year<=1799&&p.end_year>=1799));
a.equal(retired1799.length,6);
a(!legacy.some(z=>z.area_sqkm>0&&retired.has(z.id)));
const active=(id,y)=>map.get('EDITOR36_5Z_'+id).properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);
a.equal(active('LAKE_OF_WOODS',1731),false);a.equal(active('LAKE_OF_WOODS',1732),true);
a.equal(active('LAKE_HURON',1762),false);a.equal(active('LAKE_HURON',1763),true);
a.equal(active('SASKATCHEWAN_RIVER',1773),false);a.equal(active('SASKATCHEWAN_RIVER',1774),true);
a(data.features.every(f=>f.properties.periods[0].end_year===1800));
const miss=map.get('EDITOR36_5Z_MISSISSIPPI_UPPER');
a(miss.geometry.coordinates.length>=2);
a(miss.geometry.coordinates.every(segment=>segment.every(x=>x[0]>=-96&&x[0]<=-89&&x[1]>=42.8&&x[1]<=47.6)));
a(!miss.geometry.coordinates.some(seg=>seg.some((pt,i)=>i>0&&Math.abs(seg[i-1][0]-pt[0])>2)),'unrealistic straight Mississippi connector');
a.equal((app.match(/window\.eighteenthEditor36FiveZ\?\.render\?\.\(\);/g)||[]).length,4);
a(html.includes('js/eighteenth-editor36-5z-waterways.js?v=20261121-5z-nat-earth-10m'));
a(layer.includes('area_sqkm')&&layer.includes('uncertain_line_dashed')&&layer.includes('data-hydro-id'));
console.log('PASS Editor36 5Z: 10 precise physical lake polygons, 8 river groups, 7 former rectangles retired; 6 retired in 1799, all 18 hydro shapes connect to 1800.');
