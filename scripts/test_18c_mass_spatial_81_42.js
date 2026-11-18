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
a.equal(phases,161);
a.equal(phases+previous.area_references.reduce((n,x)=>n+x.periods.length,0)+previous.control_sites.reduce((n,x)=>n+x.periods.length,0),207);
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
   a.equal(x.geometry_precision,x.geometry?'source_backed_historical_outline':'editorial_schematic_bounding_envelope_not_historical_survey');
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
 ['MENORCA_ISLAND',1707,false],['MENORCA_ISLAND',1708,true],['MENORCA_ISLAND',1756,true],['MENORCA_ISLAND',1798,true],
])a.equal(isOn(z(id),y),expected,id+' '+y);
const successors=[2,7].flatMap(batch=>JSON.parse(read('data/nineteenth-century-territorial-areas-batch'+batch+'.geojson')).features);
for(const id of ['GIBRALTAR_PENINSULA','MENORCA_ISLAND','CAPE_BRETON','NS_REVISED']){
 const row=z(id),successor=successors.find(f=>f.id===row.cross_century_feature_id);
 a.equal(successor.properties.start_year,1800);
 a.deepEqual(row.geometry,successor.geometry);
 a.equal(row.periods.at(-1).end_year,1799);
 for(let i=1;i<row.periods.length;i++)a.equal(row.periods[i].start_year,row.periods[i-1].end_year+1);
}
a.equal(z('MENORCA_ISLAND').periods.find(p=>p.start_year===1756).kind,'foreign_occupation');
a.equal(z('MENORCA_ISLAND').periods.find(p=>p.start_year===1782).kind,'foreign_occupation');
a.equal(z('GIBRALTAR_PENINSULA').periods.find(p=>p.start_year===1713).kind,'administration');
const regional=[...data.regional_zones,...data.regional_sites,...data.coastal_rights];
a.equal(regional.length,new Set(regional.map(item=>item.id)).size);
for(const item of regional){
 a.equal(item.area_sqkm,null);
 a.equal(item.uncertain_line_dashed,true);
 a(item.source_urls.every(url=>url.startsWith('https://')));
 for(let i=1;i<item.periods.length;i++)a(item.periods[i].start_year>item.periods[i-1].end_year);
 if(item.cross_century_feature_id){
  const successor=successors.find(f=>f.id===item.cross_century_feature_id);
  a.equal(successor.properties.start_year,1800);
  a.deepEqual(item.geometry,successor.geometry);
 }
}
const atlantic=id=>regional.find(item=>item.id===id);
for(const [id,y,expected] of [
 ['PLACENTIA_FORT_ROYAL',1713,true],['PLACENTIA_FORT_ROYAL',1715,false],['PLACENTIA_FORT_ROYAL',1761,false],
 ['PLACENTIA_FORT_ROYAL',1762,true],['FORT_ANNE_FLAG_BASTION_1726',1725,false],['FORT_ANNE_FLAG_BASTION_1726',1726,true],
 ['YORK_FACTORY_I_II',1791,true],['YORK_FACTORY_I_II',1792,false],['YORK_FACTORY_III',1792,true],
 ['NF_FRENCH_SHORE_1713',1712,false],['NF_FRENCH_SHORE_1713',1782,true],['NF_FRENCH_SHORE_1713',1783,false],
 ['NF_FRENCH_SHORE_1783',1783,true],['NF_FRENCH_SHORE_1783',1800,true],['NF_FRENCH_SHORE_1783',1904,false],
])a.equal(isOn(atlantic(id),y),expected,id+' '+y);
a(data.coastal_rights.every(item=>item.geometry.type==='LineString'&&item.geometry.coordinates.length>500));
a.equal(atlantic('YORK_FACTORY_I_II').periods.find(p=>p.start_year===1782).kind,'conflict_damage');
const town=atlantic('LOUISBOURG_WALLED_TOWN');
a.equal(town.outline_only,true);
a.equal(town.geometry.type,'Polygon');
a(town.geometry.coordinates[0].length>50);
a.deepEqual(town.periods.map(p=>[p.start_year,p.end_year,p.kind]),[
 [1744,1744,'foreign_occupation'],[1745,1747,'wartime_occupation'],[1748,1748,'wartime_occupation'],
 [1749,1757,'foreign_occupation'],[1758,1759,'wartime_occupation'],
]);
a.deepEqual(z('CAPE_BRETON').periods.map(p=>[p.start_year,p.kind]),[
 [1713,'paper_claim'],[1745,'paper_claim'],[1748,'paper_claim'],[1749,'paper_claim'],
 [1758,'paper_claim'],[1763,'administration'],[1784,'administration'],
]);
a(!isOn(atlantic('LOUISBOURG_EARLY_PORT'),1712)&&isOn(atlantic('LOUISBOURG_EARLY_PORT'),1743));
a(!isOn(atlantic('LOUISBOURG_EARLY_PORT'),1744)&&isOn(atlantic('LOUISBOURG_AFTER_DEMOLITION'),1760));
a.equal(atlantic('PORT_DAUPHIN_SAINTE_ANNE').periods[2].start_year,1719);
a.deepEqual(z('NS_MAIN').geometry,z('NS_REVISED').geometry);
a(z('NS_MAIN').bbox[2]<-60.9,'mainland outline cannot reach Louisbourg');
a(z('CAPE_BRETON').geometry.coordinates[0].length>1000);

a.equal(atlantic('LOUISBOURG_ROYAL_BATTERY').periods.at(-1).start_year,1760);
a.equal(previous.control_sites.find(x=>x.id==='LOUISBOURG').superseded_by,town.id);

a.equal(successors.find(f=>f.id==='annapolis-fort-anne-1800').properties.end_year,1853);
const frenchCumberland=atlantic('FORT_BEAUSEJOUR_FRENCH');
const firstCumberland=atlantic('FORT_BEAUSEJOUR_CUMBERLAND');
const rebuiltCumberland=atlantic('FORT_CUMBERLAND_REBUILT');
a(!isOn(frenchCumberland,1750)&&isOn(frenchCumberland,1751)&&!isOn(frenchCumberland,1755));
a(isOn(firstCumberland,1755)&&!isOn(firstCumberland,1784)&&isOn(rebuiltCumberland,1784));
a.equal(firstCumberland.periods.find(p=>p.start_year===1768).kind,'historic_ruins');
const cumberland1776=firstCumberland.periods.find(p=>p.start_year===1776);
a.equal(cumberland1776.kind||firstCumberland.kind,'military');
a.notDeepEqual(frenchCumberland.geometry,firstCumberland.geometry);
a.notDeepEqual(firstCumberland.geometry,rebuiltCumberland.geometry);
a([frenchCumberland,firstCumberland,rebuiltCumberland].every(f=>f.stable_id===rebuiltCumberland.stable_id));
const nextCumberland=successors.find(f=>f.id===rebuiltCumberland.cross_century_feature_id);
a.equal(nextCumberland.properties.end_year,1834);
a.deepEqual(nextCumberland.properties.year_stages.map(x=>x.start_year),[1800,1809,1812,1815]);
a(isOn(atlantic('BEAUBASSIN_VILLAGE'),1750)&&!isOn(atlantic('BEAUBASSIN_VILLAGE'),1751));
a(isOn(atlantic('FORT_LAWRENCE'),1753)&&!isOn(atlantic('FORT_LAWRENCE'),1754));
a(isOn(atlantic('FORT_LAWRENCE_DITCH'),1754)&&isOn(atlantic('FORT_LAWRENCE_DITCH'),1755));
a(!isOn(atlantic('FORT_LAWRENCE_DITCH'),1756));
a(isOn(atlantic('FORT_LAWRENCE_DISMANTLED'),1756));
a(isOn(atlantic('FORT_GASPAREAUX_MONCKTON'),1756)&&!isOn(atlantic('FORT_GASPAREAUX_MONCKTON'),1757));

const manila=atlantic('MANILA_INTRAMUROS');
const cavite=atlantic('CAVITE_PUERTO');
for (const port of [manila,cavite]) {
 a.equal(port.outline_only,true);
 a.equal(port.periods.find(p=>p.start_year<=1763&&p.end_year>=1763).kind,'wartime_occupation');
 const handover=port.periods.find(p=>p.start_year<=1764&&p.end_year>=1764);
 a.equal(handover.kind||port.kind,'foreign_occupation');
}
const philippines=[...data.regional_zones,...data.regional_sites].filter(x=>
 /^(MANILA_|CAVITE_|BACOLOR_|PASIG_|ZAMBOANGA_)/.test(x.id));
for (const place of philippines.filter(x=>isOn(x,1799))) {
 const next=successors.find(x=>x.id===place.cross_century_feature_id);
 a(next,place.id);
 a.equal(next.properties.stable_id,place.stable_id);
 a.deepEqual(next.geometry,place.geometry);
 a.equal(next.properties.start_year,1800);
}
a.equal(z('MANILA_PORT').superseded_by,manila.id);
a.equal(z('CAVITE_PORT').superseded_by,cavite.id);
a.equal(s('CAVITE').superseded_by,'CAVITE_FORT_SAN_FELIPE');
a(isOn(atlantic('MANILA_PUERTA_REAL_OLD'),1762)&&!isOn(atlantic('MANILA_PUERTA_REAL_OLD'),1780));
a(!isOn(atlantic('MANILA_PUERTA_REAL_1780'),1779)&&isOn(atlantic('MANILA_PUERTA_REAL_1780'),1780));
a(isOn(atlantic('ZAMBOANGA_LA_CALDERA_PORT'),1764)&&!isOn(atlantic('ZAMBOANGA_LA_CALDERA_PORT'),1765));

a(isOn(s('FREETOWN'),1792)&&!isOn(s('FREETOWN'),1787));
a.equal((app.match(/window\.eighteenthMassSpatial\?\.render\?\.\(\);/g)||[]).length,4);
a(read('js/eighteenth-overlap-right-dossier.js').includes("'.atlas-18c-mass-zone','.atlas-18c-mass-core'"));
a(html.includes('js/eighteenth-mass-spatial.js?v='));
a(js.includes("!$('mapLayerTerritory').checked"));
a(js.includes("areaGroup.clearLayers();siteGroup.clearLayers();"));
a(js.includes("fill:!outline"));
a(js.includes("window.eighteenthMassSpatial={render,getAudit:"));
console.log('PASS eighteenth-century layer: 81 areas, 42 sites and 161 dated phases, including identical Gibraltar, Menorca, Cape Breton and Nova Scotia outlines across 1799–1800.');
