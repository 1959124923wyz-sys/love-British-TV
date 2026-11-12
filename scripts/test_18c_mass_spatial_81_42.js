#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const data=JSON.parse(read('data/eighteenth-century-mass-schematic-zones-1700-1799.json'));
const previous=JSON.parse(read('data/eighteenth-century-dynamic-spatial-1700-1799.json'));
const app=read('app.js'),html=read('index.html'),js=read('js/eighteenth-mass-spatial.js');
a.equal(data.schema,'atlas-18c-mass-schematic-zones-v1');
a.equal(data.editorial_status,'research_preview_not_published');
a.equal(data.zones.length,81);a.equal(data.sites.length,42);
a.equal(previous.area_references.length+data.zones.length,105);
a.equal(previous.control_sites.length+data.sites.length,57);
a.equal(data.area_aggregation_forbidden,true);
a.equal(data.approved_actual_control_polygons,0);
a.equal(data.square_km_totals,null);
const phases=[...data.zones,...data.sites].reduce((n,x)=>n+x.periods.length,0);
a.equal(phases,149);
a.equal(phases+previous.area_references.reduce((n,x)=>n+x.periods.length,0)+previous.control_sites.reduce((n,x)=>n+x.periods.length,0),195);
const ids=new Set(),kindCounts={};
for(const [arr,site] of [[data.zones,false],[data.sites,true]]){
 for(const x of arr){
  a(!ids.has(x.id),'duplicate '+x.id);ids.add(x.id);
  a(x.periods.length>0&&x.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year));
  a.equal(x.area_sqkm,null);a.equal(data.sources[x.source_key],x.source_urls[0]);
  a(x.source_urls[0].startsWith('https://'));
  if(site){
   a.equal(x.historical_city_wall_survey,false);
   a.equal(x.screen_radius_not_ground_area,true);
   a(x.coordinates.length===2&&x.coordinates.every(Number.isFinite));
  }else{
   kindCounts[x.kind]=(kindCounts[x.kind]||0)+1;
   a(x.bbox.length===4&&x.bbox.every(Number.isFinite));
   a(x.bbox[0]<x.bbox[2]&&x.bbox[1]<x.bbox[3]);
   a(x.bbox[0]>=-180&&x.bbox[2]<=180&&x.bbox[1]>=-90&&x.bbox[3]<=90);
   a.equal(x.geometry_precision,'editorial_schematic_bounding_envelope_not_historical_survey');
   a.equal(x.precise_historic_border,false);
   a.equal(x.territorial_control_verified,false);
   a.equal(x.uncertain_line_dashed,true);
   a.equal(x.exclude_from_territorial_area_totals,true);
  }
 }
}
a.deepEqual(kindCounts,{administration:37,paper_claim:6,military_vicinity:1,wartime_occupation:22,trade_influence:9,revenue:6});
const z=id=>data.zones.find(x=>x.id===id);
const s=id=>data.sites.find(x=>x.id===id);
const isOn=(o,y)=>o.periods.some(p=>p.start_year<=y&&y<=p.end_year);
for(const [id,y,expected] of [
 ['QUEBEC_1763',1773,true],['QUEBEC_1763',1774,false],
 ['QUEBEC_1774',1774,true],['QUEBEC_1774',1791,false],['UPPER_CANADA',1791,true],
 ['BENGAL_DIWANI',1764,false],['BENGAL_DIWANI',1765,true],
 ['GRENADA',1778,true],['GRENADA',1779,false],['GRENADA',1783,true],
 ['SAVANNAH_GARRISON',1779,true],['SAVANNAH_GARRISON',1782,false],
 ['PONDICHERRY_BRITISH',1761,true],['PONDICHERRY_BRITISH',1765,false],
 ['PORT_EGMONT',1773,true],['PORT_EGMONT',1774,false],
 ['FALKLAND_PAPER',1774,true],['TRINIDAD_1797',1796,false],['TRINIDAD_1797',1797,true],
 ['CEYLON_COLOMBO',1795,false],['CEYLON_COLOMBO',1796,true],
 ['NSW_CROWN_CLAIM',1787,false],['NSW_CROWN_CLAIM',1788,true],
 ['MENORCA_ISLAND',1755,true],['MENORCA_ISLAND',1756,false],['MENORCA_ISLAND',1798,true],
])a.equal(isOn(z(id),y),expected,id+' '+y);
a(isOn(s('FREETOWN'),1792)&&!isOn(s('FREETOWN'),1787));
a.equal((app.match(/window\.eighteenthMassSpatial\?\.render\?\.\(\);/g)||[]).length,4);
a(app.includes('.atlas-18c-mass-zone,.atlas-18c-mass-core,'));
a(html.includes('js/eighteenth-mass-spatial.js?v=18c-81zones-42cores-20261112'));
a(html.includes('共105组区域面、57处核心'));
a(js.includes("if(new URLSearchParams(location.search).get('review18c')!=='1')return;"));
a(js.includes("areaGroup.clearLayers();siteGroup.clearLayers();"));
a(js.includes("fill:!outline"));
a(js.includes("window.eighteenthMassSpatial={render,getAudit:"));
console.log('PASS 18C batch35: 81 extra rectangles +42 dated cores +149 year-stages; combined 105 zone polygons/57 cores/195 time stages; yearly switch, no km², inherited base unchanged.');
