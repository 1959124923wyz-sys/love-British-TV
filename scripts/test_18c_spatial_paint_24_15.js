#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const text=p=>fs.readFileSync(path.join(root,p),'utf8'),J=p=>JSON.parse(text(p));
const d=J('data/eighteenth-century-dynamic-spatial-1700-1799.json');
const geo=J('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson');
const app=text('app.js'),code=text('js/eighteenth-dynamic-spatial.js'),html=text('index.html');
A.equal(d.schema,'atlas-18c-dynamic-spatial-envelopes-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.area_references.length,24);A.equal(d.control_sites.length,15);
A.equal(d.area_references.reduce((n,x)=>n+x.periods.length,0),28);
A.equal(d.control_sites.reduce((n,x)=>n+x.periods.length,0),18);
A.equal(geo.features.length,53);A.equal(d.approved_actual_control_polygons,0);
A.equal(d.area_sqkm_totals,null);A.equal(d.area_aggregation_forbidden,true);
A.equal(d.original_geometry_reused_in_place,undefined);
const validPeriods=p=>p.length>0&&p.every(x=>Number.isInteger(x.start_year)&&Number.isInteger(x.end_year)&&x.start_year>=1700&&x.end_year<=1799&&x.start_year<=x.end_year);
const allIds=new Set(),geoNames=new Set(geo.features.map(f=>f.properties.name));
for(const r of d.area_references){
 A(!allIds.has(r.id),r.id);allIds.add(r.id);
 A(geoNames.has(r.geometry_key),r.id);
 const original=geo.features.find(f=>f.properties.name===r.geometry_key);
 A.equal(original.geometry.type,'Polygon');
 A(validPeriods(r.periods));A.equal(r.precise_historic_border,false);A.equal(r.fill_authorized,false);
 A.equal(r.territorial_control_verified,false);A.equal(r.area_sqkm,null);
 A.equal(r.uncertain_line_dashed,true);A(r.source_urls.length>0);
 for(const url of r.source_urls)A(url.startsWith('https://'));
}
for(const s of d.control_sites){
 A(!allIds.has(s.id));allIds.add(s.id);
 A.equal(s.geometry.type,'Point');
 A(s.geometry.coordinates.length===2&&s.geometry.coordinates.every(Number.isFinite));
 A(validPeriods(s.periods));A.equal(s.historical_city_wall_survey,false);
 A.equal(s.screen_radius_not_ground_area,true);A.equal(s.area_sqkm,null);
 A(s.source_urls.length>0);
}
const area=id=>d.area_references.find(x=>x.id===id);
const city=id=>d.control_sites.find(x=>x.id===id);
const active=(p,y)=>p.periods.some(q=>y>=q.start_year&&y<=q.end_year);
for(const y of [1700,1713,1756,1762,1763,1776,1781,1782,1798,1799]){
 A(active(area('JAMAICA'),y));A(active(area('RUPERT_LAND'),y));
}
A(active(area('VIRGINIA'),1775));A(!active(area('VIRGINIA'),1776));
A(active(area('PENNSYLVANIA'),1775));A(!active(area('PENNSYLVANIA'),1776));
A(active(area('MADRAS'),1745));A(!active(area('MADRAS'),1746));A(!active(area('MADRAS'),1748));A(active(area('MADRAS'),1749));
A(active(area('CALCUTTA'),1755));A(!active(area('CALCUTTA'),1756));A(active(area('CALCUTTA'),1757));
A(active(city('MENORCA'),1755));A(!active(city('MENORCA'),1756));A(active(city('MENORCA'),1763));
A(active(city('MENORCA'),1781));A(!active(city('MENORCA'),1782));A(active(city('MENORCA'),1798));
A(active(city('HAVANA'),1762));A(!active(city('HAVANA'),1763));
A(active(city('MANILA'),1763));A(!active(city('MANILA'),1764));
A(active(city('ST_EUSTATIUS'),1781));A(!active(city('ST_EUSTATIUS'),1782));
A(city('ST_EUSTATIUS').category.includes('年内短占'));A(city('ST_EUSTATIUS').note.includes('11月'));
A(active(city('PENANG'),1786));A(!active(city('PENANG'),1785));
A(!active(city('CAPE_TOWN'),1794));A(active(city('CAPE_TOWN'),1795));
A(active(city('NEW_YORK_CITY'),1782));A(!active(city('NEW_YORK_CITY'),1783));
A(app.includes('window.eighteenthSpatial?.render?.()'), 'no annual area render integration');
A(app.includes('atlas-18c-dynamic-area,.atlas-18c-dynamic-core'), 'map click interception not protected');
A(html.includes('eighteenth-dynamic-spatial.js?v=18c-map-first-dynamic-areas-20261112'));
A(html.includes('24组动态区域参考面与15处驻军/港口核心'));
A(code.includes('if(!loaded||year<1700||year>1799'));A(code.includes('render()'));
A(code.includes('areaLayer.clearLayers();coreLayer.clearLayers();'));
A(code.includes("const period=active(site.periods)"));
A(code.includes("className:'atlas-18c-dynamic-area'"));
A(code.includes("className:'atlas-18c-dynamic-core'"));
A(code.includes('fillOpacity:outlineOnly?0:.095'));
A(code.includes("void load();"));
A(!/area_sqkm\s*=\s*\d/.test(code));
console.log('PASS 18C map-first 24 historical jurisdiction reference polygons + 15 real occupied city symbols, 46 year-stages, active and vanishing in 1756/1762/1763/1776/1781/1782/1798; all area_sqkm null and 0 false occupied territory polygons');
