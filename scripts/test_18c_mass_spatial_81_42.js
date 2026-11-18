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
 ['QUEBEC_1763',1774,true],['QUEBEC_1763',1775,false],
 ['QUEBEC_1774',1774,false],['QUEBEC_1774',1775,true],['QUEBEC_1774',1783,false],['UPPER_CANADA',1791,true],
 ['BENGAL_DIWANI',1764,false],['BENGAL_DIWANI',1765,true],
 ['SAVANNAH_GARRISON',1779,true],['SAVANNAH_GARRISON',1782,false],
 ['PONDICHERRY_BRITISH',1761,true],['PONDICHERRY_BRITISH',1765,false],
 ['PORT_EGMONT',1773,true],['PORT_EGMONT',1774,false],
 ['FALKLAND_PAPER',1774,true],
 ['NSW_CROWN_CLAIM',1787,false],['NSW_CROWN_CLAIM',1788,true],
 ['MENORCA_ISLAND',1707,false],['MENORCA_ISLAND',1708,true],['MENORCA_ISLAND',1756,true],['MENORCA_ISLAND',1798,true],
])a.equal(isOn(z(id),y),expected,id+' '+y);
const successors=JSON.parse(read('data/nineteenth-century-territorial-areas.geojson')).features;
successors.push(...[2,7].flatMap(batch=>JSON.parse(read('data/nineteenth-century-territorial-areas-batch'+batch+'.geojson')).features));
successors.push(...JSON.parse(read('data/nineteenth-century-spatial-1800-1819.geojson')).features);
for(const id of ['GIBRALTAR_PENINSULA','MENORCA_ISLAND','CAPE_BRETON','NS_REVISED','UPPER_CANADA','LOWER_CANADA']){
 const row=z(id),successor=successors.find(f=>f.id===row.cross_century_feature_id);
 a.equal(successor.properties.start_year,1800);
 a.deepEqual(row.geometry,successor.geometry);
 a.equal(row.periods.at(-1).end_year,1799);
 for(let i=1;i<row.periods.length;i++)a.equal(row.periods[i].start_year,row.periods[i-1].end_year+1);
}
a.equal(z('MENORCA_ISLAND').periods.find(p=>p.start_year===1756).kind,'foreign_occupation');
a.equal(z('MENORCA_ISLAND').periods.find(p=>p.start_year===1782).kind,'foreign_occupation');
a.equal(z('GIBRALTAR_PENINSULA').periods.find(p=>p.start_year===1713).kind,'administration');
const regional=[...data.regional_zones,...data.regional_sites,...data.regional_lines,...data.coastal_rights];
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
const islandPhase=(id,year)=>atlantic(id).periods.find(p=>p.start_year<=year&&year<=p.end_year);
for (const [oldId, replacementId] of [
 ['SYDNEY_COVE','WARRANE_SYDNEY_COVE'],
 ['PARRAMATTA','PARRAMATTA_CONVICT_HUT_ROWS'],
 ['NORFOLK_SETTLEMENT','NORFOLK_FIRST_COLONIAL_ISLAND'],
]) a.equal(z(oldId).superseded_by,replacementId);
a.equal(islandPhase('SYDNEY_MARINE_CAMP_1788',1787),undefined);
a.match(islandPhase('SYDNEY_MARINE_CAMP_1788',1788).title,/海军陆战队/);
a.equal(islandPhase('SYDNEY_MARINE_CAMP_1788',1789),undefined);
a.match(islandPhase('TOONGABBIE_GOVERNMENT_FARM',1796).title,/暂停/);
a.match(islandPhase('TOONGABBIE_GOVERNMENT_FARM',1797).title,/恢复/);
a.match(islandPhase('HAWKESBURY_1794_GRANT_50',1794).note,/弗里博迪/);
a.equal(islandPhase('HAWKESBURY_1794_GRANT_50',1795),undefined);
a.match(islandPhase('HAWKESBURY_GREEN_HILLS_POWELL_CASE',1799).note,/小杰米.*小乔治/);
a.equal(atlantic('HAWKESBURY_GREEN_HILLS_POWELL_CASE').cross_century_feature_id,undefined);
a.match(islandPhase('NORFOLK_PHILLIPSBURG',1793).note,/图基和胡鲁/);

for(const id of ['CEYLON_JAFFNA','CEYLON_COLOMBO','CEYLON_GALLE','CEYLON_TRINCOMALEE']){
 a.equal(z(id).superseded_by,'CEYLON_BRITISH_MARITIME_ESTATES');
}
for(const id of ['CEYLON_DUTCH_COAST_1766','CEYLON_KANDY_1766']){
 a.equal(islandPhase(id,1765),undefined);
 a(islandPhase(id,1766));
 a(islandPhase(id,1795));
 a.equal(islandPhase(id,1796),undefined);
}
for(const id of ['CEYLON_BRITISH_MARITIME_ESTATES','CEYLON_KANDY_INLAND_KINGDOM']){
 a.equal(islandPhase(id,1795),undefined);
 a(islandPhase(id,1796));
 a(islandPhase(id,1799));
}
a.match(islandPhase('CEYLON_COLOMBO_DUTCH_FORT',1796).note,/2月15日|15日/);
a.match(islandPhase('CEYLON_GALLE_FORTIFIED_TOWN',1796).note,/23日/);
a.match(islandPhase('JAFFNA_FORT_1792',1795).note,/28日/);
a.match(islandPhase('CEYLON_BATTICALOA_FORT',1795).note,/18日/);
a.equal(z('MYSORE_1799_PARTITION').superseded_by,'MYSORE_WODEYAR_1799');
a.equal(z('SERINGAPATAM_ZONE').superseded_by,'SERINGAPATAM_WALLED_CITY_1799');
a.equal(z('HYDERABAD_INFLUENCE').superseded_by,'MYSORE_HYDERABAD_SUBSIDIARY');
a(islandPhase('MYSORE_TIPU_RETAINED_1792',1792));
a(islandPhase('MYSORE_TIPU_RETAINED_1792',1798));
a.equal(islandPhase('MYSORE_TIPU_RETAINED_1792',1799),undefined);
a.equal(islandPhase('MYSORE_WODEYAR_1799',1798),undefined);
a.match(islandPhase('MYSORE_WODEYAR_1799',1799).note,/6月30日.*7月8日/);
a.equal(islandPhase('MYSORE_PESHWA_PROPOSED_1799',1799).kind || atlantic('MYSORE_PESHWA_PROPOSED_1799').kind,'paper_claim');
a.equal(atlantic('MYSORE_PESHWA_PROPOSED_1799').cross_century_feature_id,undefined);
for(const id of ['mysore-nizam-cession-1792-1800','mysore-nizam-cession-1799-1800']){
 const later=successors.find(f=>f.id===id);
 a.match(later.properties.year_stages[0].title,/10月12日转让公司/);
}
a.match(islandPhase('MYSORE_BANGALORE_PETTAH',1791).note,/财物|织物|民居/);
a.match(islandPhase('SERINGAPATAM_WALLED_CITY_1799',1799).note,/5月4日|掠夺/);
a.equal(atlantic('SERINGAPATAM_WEST_WALL_BREACH').geometry.type,'LineString');
const maritimeAfterAmiens=successors.find(feature=>feature.id==='19CT7-ceylon-maritime-1802');
const maritimeBeforeAmiens=successors.find(feature=>feature.id==='19CT7-ceylon-maritime-1800');
a.match(maritimeAfterAmiens.properties.summary_zh,/亚眠和约.*第五条/);
a.deepEqual(maritimeAfterAmiens.geometry,maritimeBeforeAmiens.geometry);
for(const id of ['GRENADA','DOMINICA','GUADELOUPE','TRINIDAD_1797'])a(z(id).superseded_by);
for(const [id,year,kind] of [
 ['GRENADA_ISLAND_MAIN',1762,'wartime_occupation'],['GRENADA_ISLAND_MAIN',1779,'foreign_occupation'],
 ['GRENADA_ISLAND_MAIN',1783,'foreign_occupation'],['GRENADA_ISLAND_MAIN',1784,'administration'],
 ['DOMINICA_ISLAND_MAIN',1761,'wartime_occupation'],['DOMINICA_ISLAND_MAIN',1778,'foreign_occupation'],
 ['DOMINICA_ISLAND_MAIN',1783,'foreign_occupation'],['DOMINICA_ISLAND_MAIN',1784,'administration'],
 ['GUADELOUPE_MAIN_ISLANDS',1759,'wartime_occupation'],['GUADELOUPE_MAIN_ISLANDS',1763,'foreign_occupation'],
 ['GUADELOUPE_MAIN_ISLANDS',1794,'foreign_occupation'],['TRINIDAD_MAIN_ISLAND',1796,'foreign_occupation'],
 ['TRINIDAD_MAIN_ISLAND',1797,'wartime_occupation'],
])a.equal(islandPhase(id,year).kind||atlantic(id).kind,kind,id+' '+year);
a.match(islandPhase('GRENADA_ISLAND_MAIN',1783).note,/次年1月/);
a.match(islandPhase('DOMINICA_ISLAND_MAIN',1784).title,/1月10日/);
a.match(islandPhase('GUADELOUPE_MAIN_ISLANDS',1763).note,/7月6日/);
a.match(islandPhase('GUADELOUPE_MAIN_ISLANDS',1794).note,/10月.*12月/);
a.match(islandPhase('TRINIDAD_PORT_OF_SPAIN_CORE',1797).title,/2月17日/);
a.match(islandPhase('TRINIDAD_MAIN_ISLAND',1797).title,/2月18日/);
a.equal(atlantic('GUADELOUPE_MAIN_ISLANDS').geometry.coordinates.length,2);
a.equal(atlantic('TRINIDAD_CHAGUARAMAS_ANCHORAGE').geometry.coordinates.length,4);
const earlyIslandData=id=>previous.area_references.find(x=>x.id===id);
a.equal(earlyIslandData('JAMAICA').superseded_by,'JAMAICA_MAIN_ISLAND');
a.match(islandPhase('JAMAICA_MAIN_ISLAND',1754).title,/令议会赴金斯敦/);
a.match(islandPhase('JAMAICA_MAIN_ISLAND',1758).title,/回到西班牙镇/);
a.match(islandPhase('JAMAICA_PORT_ROYAL_TOWN_EARLY',1700).title,/1692年沉城后的重建/);
a.match(islandPhase('JAMAICA_PORT_ROYAL_TOWN_EARLY',1703).title,/重建镇火灾/);
a.match(islandPhase('JAMAICA_FORT_HALDANE_TACKY',1760).title,/夺取军需/);
a.match(islandPhase('JAMAICA_PORT_ROYAL_VICTUALLING_EAST',1799).title,/被奴役者住处/);
a.match(islandPhase('KINGSTON_COLONIAL_PORT',1792).title,/上岸出售/);
a.match(islandPhase('KINGSTON_COLONIAL_PORT',1799).title,/85,528人/);
a.match(islandPhase('JAMAICA_TRELAWNY_FLAGSTAFF',1796).title,/驱逐与土地没收/);
a.match(islandPhase('JAMAICA_TRELAWNY_FLAGSTAFF',1799).title,/旧镇地上的殖民军营/);
a.equal(earlyIslandData('BARBADOS').superseded_by,'BARBADOS_MAIN_ISLAND');
a.match(islandPhase('BARBADOS_BRIDGETOWN_1766',1766).title,/5月14日大火/);
a.equal(islandPhase('BARBADOS_BRIDGETOWN_FIRE_BLOCKS_1766',1767),undefined);
a.match(islandPhase('BARBADOS_ST_ANNS_CASTLE',1705).title,/施工/);
a.match(islandPhase('BARBADOS_ST_ANNS_CASTLE',1707).title,/竣工/);
a.equal(atlantic('BARBADOS_BRIDGETOWN_BROAD_STREET').geometry.type,'LineString');
a.equal(successors.find(f=>f.id==='bridgetown-port-1800').geometry.type,'Polygon');
const maroonCores=JSON.parse(read('data/eighteenth-century-jamaica-maroon-autonomy-cores-1739-1799.geojson')).features;
for(const [index,id] of ['accompong-maroon-1800','moore-town-maroon-1800'].entries()){
 a.deepEqual(maroonCores[index].geometry,successors.find(f=>f.id===id).geometry);
 a.equal(maroonCores[index].properties.periods.at(-1).end_year,1799);
}
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

const stageAt=(name,year)=>atlantic(name).periods.find(p=>p.start_year<=year&&year<=p.end_year);
a.equal(stageAt('MADRAS_ST_GEORGE_EARLY',1748).kind,'foreign_occupation');
a.match(stageAt('MADRAS_ST_GEORGE_EARLY',1749).title,/8月21日/);
a.equal(stageAt('CALCUTTA_OLD_FORT_WILLIAM',1756).kind,'foreign_occupation');
a.match(stageAt('CALCUTTA_OLD_FORT_WILLIAM',1757).title,/1月2日/);
a.equal(stageAt('CALCUTTA_OLD_FORT_WILLIAM',1767),undefined);
a.match(stageAt('CALCUTTA_OLD_FORT_CUSTOMS',1767).title,/海关/);
for (const id of ['MADRAS_ST_GEORGE_EARLY','MADRAS_ST_GEORGE_SIEGE','MADRAS_ST_GEORGE_LATE'])
 a.equal(atlantic(id).stable_id,atlantic('MADRAS_ST_GEORGE_LATE').stable_id);
for(const id of ['BENGAL_DIWANI','BIHAR_DIWANI','ORISSA_DIWANI','CALCUTTA_24_PARGANAS'])
 a(atlantic(z(id).superseded_by),id);
for(const row of data.regional_lines){
 a(['LineString','MultiLineString'].includes(row.geometry.type));
 if(!row.cross_century_feature_id)continue;
 const next=successors.find(f=>f.id===row.cross_century_feature_id);
 a.equal(next.properties.geometry_precision,'source_backed_historical_line');
 a.equal(next.properties.stable_id,row.stable_id);
}
const blackTown=successors.find(f=>f.id==='madras-new-black-town-1800');
const blackTownAfter=successors.find(f=>f.id==='madras-new-black-town-after-demolition');
a.equal(blackTown.properties.end_year,1858);
a.equal(blackTownAfter.properties.start_year,1859);
a.equal(blackTown.properties.stable_id,blackTownAfter.properties.stable_id);
a.equal(blackTownAfter.geometry.type,'Point');

const quebecAfterParis=atlantic('QUEBEC_POST_PARIS');
a(!isOn(quebecAfterParis,1782)&&isOn(quebecAfterParis,1783)&&!isOn(quebecAfterParis,1791));
a.equal(z('QUEBEC_1763').stable_id,quebecAfterParis.stable_id);
a.equal(z('QUEBEC_1774').stable_id,quebecAfterParis.stable_id);
a.match(stageAt('DETROIT_FORT_LERNOULT',1783).title,/英军仍驻/);
a.match(stageAt('DETROIT_FORT_LERNOULT',1796).title,/7月11日/);
a.match(stageAt('MACKINAC_ISLAND_FORT',1796).title,/9月1日/);
a(!isOn(atlantic('LABRADOR_YORK_FORT'),1775));
a.match(stageAt('LABRADOR_YORK_FORT_REMNANT',1775).title,/撤去驻军/);
const late=id=>successors.find(f=>f.id===id);
const anticosti=z=>late(z).properties;
a.equal(anticosti('anticosti-island-lower-canada-1800').end_year,1808);
a.equal(anticosti('newfoundland-anticosti-1809').end_year,1824);
a.equal(anticosti('anticosti-island-lower-canada-1825').start_year,1825);
a.deepEqual(late('newfoundland-anticosti-1809').geometry,late('anticosti-island-lower-canada-1825').geometry);
const block=late('fort-st-joseph-blockhouse-1800'),palisade=late('fort-st-joseph-palisade-1802');
a.equal(block.properties.end_year,1801);
a.equal(palisade.properties.start_year,1802);
a.equal(block.properties.stable_id,palisade.properties.stable_id);
a.notDeepEqual(block.geometry,palisade.geometry);
const shore=late('labrador-lower-north-shore-1800');
a.deepEqual(shore.properties.year_stages.map(p=>p.start_year),[1800,1809,1825]);
a.equal(atlantic('LABRADOR_OUTER_COAST').geometry.coordinates.length,2);

for(const [legacyId,replacement] of [
 ['NEW_YORK_HARBOR','NYC_LOWER_MANHATTAN_1767'],
 ['NEWPORT_GARRISON','NEWPORT_TOWN_1777'],
 ['PHILADELPHIA_GARRISON','PHILADELPHIA_TOWN_1777'],
]){
 a.equal(z(legacyId).superseded_by,replacement);
 a.equal(atlantic(replacement).geometry.type,'Polygon');
 a.equal(atlantic(replacement).outline_only,true);
}
a.equal(s('NEWPORT_OCCUPIED').superseded_by,'NEWPORT_TOWN_1777');
a.equal(s('PHILADELPHIA_OCCUPIED').superseded_by,'PHILADELPHIA_TOWN_1777');
a.match(stageAt('NYC_LOWER_MANHATTAN_1767',1776).title,/9月15日/);
a(!isOn(atlantic('NYC_LOWER_MANHATTAN_1767'),1783));
a.match(stageAt('NYC_GOVERNORS_ISLAND_EARTHWORK',1783).title,/12月3日/);
a.match(stageAt('NYC_WALLABOUT_PRISON_SHIPS',1776).title,/惠特比号/);
const batch36=JSON.parse(read('data/eighteenth-century-expansion-batch36-1700-1799.json'));
for(const record of [batch36.zones.find(x=>x.id==='B36-Z039'),batch36.sites.find(x=>x.id==='B36-P039')])
 a.equal(record.superseded_by,'NYC_FORT_WASHINGTON');
a.match(stageAt('NYC_FORT_WASHINGTON',1776).title,/11月16日陷落/);
a.match(stageAt('NYC_BLACK_EVACUATION_PORT',1783).note,/艾丽莎白·特鲁安特/);
a.match(stageAt('NEWPORT_TOWN_1777',1776).title,/12月8日/);
a.match(stageAt('NEWPORT_TOWN_1777',1779).title,/10月25日英军撤离/);
a.equal(stageAt('NEWPORT_TOWN_1777',1779).kind,'settlement');
a.equal(stageAt('NEWPORT_TOWN_1777',1780).kind,'military_vicinity');
a.match(stageAt('PHILADELPHIA_TOWN_1777',1777).title,/9月26日英军入城/);
a.match(stageAt('PHILADELPHIA_TOWN_1777',1778).title,/6月18日英军撤出/);
a.equal(stageAt('PHILADELPHIA_TOWN_1777',1778).kind,'settlement');
a.equal(atlantic('DELAWARE_FORT_MIFFLIN_ORIGINAL_SCARP').geometry.type,'LineString');
const jay=late('nyc-governors-island-fort-1800');
a.match(jay.properties.year_stages[0].title,/交联邦政府/);
a.equal(jay.properties.stable_id,atlantic('NYC_FORT_JAY').stable_id);

const saintLucia=atlantic('ST_LUCIA_MAIN_ISLAND');
a.equal(z('ST_LUCIA').superseded_by,saintLucia.id);
for(const [year,kind] of [[1762,'wartime_occupation'],[1763,'foreign_occupation'],[1778,'wartime_occupation'],
 [1782,'wartime_occupation'],[1783,'foreign_occupation'],[1794,'wartime_occupation'],
 [1795,'foreign_occupation'],[1796,'wartime_occupation']])
 a.equal(stageAt(saintLucia.id,year).kind||saintLucia.kind,kind);
const b39Caribbean=JSON.parse(read('data/eighteenth-century-b39-caribbean-1759-1763.json'));
a.equal(b39Caribbean.zones.find(x=>x.id==='B39-C-Z025').superseded_by,saintLucia.id);
a.match(stageAt('ST_LUCIA_MORNE_FORTUNE',1796).title,/5月26日/);
a.match(stageAt('SAVANNAH_TOWN_1778',1778).title,/12月29日英军占城/);
a.match(stageAt('SAVANNAH_TOWN_1778',1782).title,/7月11日英军撤离/);
a.equal(z('SAVANNAH_GARRISON').superseded_by,'SAVANNAH_TOWN_1778');
a.match(stageAt('CHARLESTON_OLD_TOWN_1780',1780).title,/5月12日英军占城/);
a.match(stageAt('CHARLESTON_OLD_TOWN_1780',1782).title,/12月14日英军撤离/);
a.equal(z('CHARLESTON_GARRISON').superseded_by,'CHARLESTON_OLD_TOWN_1780');
a.match(stageAt('TRINCOMALEE_FORT_FREDERICK',1795).title,/8月26日/);
a.match(stageAt('TRINCOMALEE_FORT_OOSTENBURG',1795).title,/8月31日/);

a(isOn(s('FREETOWN'),1792)&&!isOn(s('FREETOWN'),1787));
a.equal((app.match(/window\.eighteenthMassSpatial\?\.render\?\.\(\);/g)||[]).length,4);
a(read('js/eighteenth-overlap-right-dossier.js').includes("'.atlas-18c-mass-zone','.atlas-18c-mass-core'"));
a(html.includes('js/eighteenth-mass-spatial.js?v='));
a(js.includes("!$('mapLayerTerritory').checked"));
a(js.includes("areaGroup.clearLayers();siteGroup.clearLayers();"));
a(js.includes("fill:!outline"));
a(js.includes("window.eighteenthMassSpatial={render,getAudit:"));
console.log('PASS eighteenth-century layer: 81 areas, 42 sites and 161 dated phases, including identical Gibraltar, Menorca, Cape Breton and Nova Scotia outlines across 1799–1800.');
