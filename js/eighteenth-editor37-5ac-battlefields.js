/* Editor37 5AC: NPS surveyed battlefield STUDY AREAS and source physical geography */
(function(){
'use strict';
const host=window.__eighteenthSpatialHost;if(!host)return;
const map=host.map,$=host.element,esc=host.escapeHTML,reader=window.AtlasReaderCopy;
const polyPane='eighteenth5acSurvey',sitePane='eighteenth5acSite';
map.createPane(polyPane);map.getPane(polyPane).style.zIndex='425';
map.createPane(sitePane);map.getPane(sitePane).style.zIndex='454';
const polygons=L.svg({pane:polyPane}),sites=L.svg({pane:sitePane}),group=L.layerGroup().addTo(map);
let features=[],layers=new Map(),loaded=false,error=null,year=host.getYear();
const active=(f,y)=>f.properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const colors={nps_abpp_revolutionary_war_study_polygon:'#d9aa81',disconnected_historic_garrison_areas:'#bd99b4',
 historical_fort_main_wall:'#e2c58b',physical_coastline:'#6cb9d3',physical_river:'#68aed0',
 forced_deportation:'#dcb0ac',southern_war_locality:'#cdbba2',south_indian_war_site:'#c2b89b'};
function open(f){
 const p=f.properties;host.clearSelection();
 const urls=[...new Set(p.source_urls)].map(u=>{let domain=u;try{domain=new URL(u).hostname}catch{}
  return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(domain)+'</a></li>'}).join('');
 $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪历史地理 · '+year+'年</div>'+
 '<h2>'+esc(p.title)+'</h2><p>'+esc(reader.clean(p.historical_context))+'</p>'+
 '<details open><summary>历史来源</summary><ul class="source-list">'+urls+'</ul></details>';
 host.openPanel('dossier');
}
function createLayer(f){
 const line=f.geometry.type==='MultiLineString',point=f.geometry.type==='Point';
 const pane=point?sitePane:polyPane,renderer=point?sites:polygons;
 const color=colors[f.properties.kind]||'#d3ae9c';
 // Existing detailed official site dossiers remain above our new regional source geometry.
 const interactive=f.id!=='EDITOR37_5AC_FORT_CUMBERLAND_CHIGNECTO';
 const layer=L.geoJSON(f.geometry,{pane,renderer,color,weight:line?2.05:1.7,
  dashArray:line?'5 7':'4 6',opacity:.83,fill:!line&&!point,fillColor:color,fillOpacity:.045,
  interactive,bubblingMouseEvents:false,lineCap:'round',
  className:'atlas-editor37-5ac-source-shape',
  pointToLayer:(_f,latlng)=>L.circleMarker(latlng,{pane,renderer,radius:5.5,weight:1.5,
   color,fillColor:color,fillOpacity:.7,dashArray:'2 3',interactive,bubblingMouseEvents:false,
   className:'atlas-editor37-5ac-source-point'})});
 layer.eachLayer(el=>el.on('add',()=>el.getElement()?.setAttribute('data-editor37-5ac-id',f.id)));
 if(interactive){
  layer.bindTooltip('<strong>'+esc(f.properties.title)+'</strong>',
   {sticky:true,pane:'eventTooltipPane',className:'atlas-hover',direction:'auto',offset:[12,0]});
  layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);open(f)});
 }
 return layer;
}
function valid(geo){
 if(geo.type!=='FeatureCollection'||geo.metadata?.schema!=='atlas-editor37-5ac-abpp-acadian-source-maps-v1'||
  geo.features?.length!==38||geo.metadata.retired_legacy_zone_ids.length!==33||
  geo.metadata.area_aggregation_forbidden!==true||
  geo.features.filter(f=>f.properties.kind==='nps_abpp_revolutionary_war_study_polygon').length!==19)
   throw Error('5AC integrity mismatch');
 const seen=new Set(),validCoord=xy=>Array.isArray(xy)&&xy.length>=2&&
  xy.slice(0,2).every(Number.isFinite)&&Math.abs(xy[0])<=180&&Math.abs(xy[1])<=90;
 for(const f of geo.features){
  const p=f.properties,g=f.geometry;
  if(!f.id||seen.has(f.id)||p.stable_id!==f.id||p.area_sqkm!==null||p.territorial_control_verified!==false||
   p.uncertain_line_dashed!==true||p.exclude_from_area_aggregation!==true||!p.source_urls?.length||
   !p.periods?.length||p.periods.some(z=>z.start_year>z.end_year))throw Error('invalid 5AC '+f.id);
  const rings=g.type==='Point'?[[g.coordinates]]:
    g.type==='MultiLineString'?g.coordinates:g.type==='Polygon'?g.coordinates:
    g.type==='MultiPolygon'?g.coordinates.flat():null;
  if(!rings||!rings.length||rings.some(r=>r.length<1||r.some(x=>!validCoord(x))))throw Error('invalid geometry '+f.id);
  seen.add(f.id);
 }
}
function render(){
 year=host.getYear();group.clearLayers();
 if(!loaded||year<1700||year>1800||!$('mapLayerTerritory').checked||
  !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 for(const f of features)if(active(f,year))layers.get(f.id).addTo(group);
}
async function load(){
 try{const res=await fetch('data/eighteenth-century-editor37-5ac-surveyed-geography.geojson',{cache:'no-store'});
  if(!res.ok)throw Error('5AC HTTP '+res.status);const d=await res.json();
  valid(d);features=d.features;layers=new Map(features.map(f=>[f.id,createLayer(f)]));loaded=true;render();
 }catch(e){error=String(e);console.warn('5AC geography withheld:',e)}
}
window.eighteenthEditor37FiveAC={render,getAudit:()=>({loaded,error,year,featureCount:features.length,
 activeIds:features.filter(f=>active(f,year)).map(f=>f.id),visibleLayers:group.getLayers().length,
 polygonCount:features.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).length,
 riverCoastCount:features.filter(f=>f.geometry.type==='MultiLineString').length,
 pointCount:features.filter(f=>f.geometry.type==='Point').length})};
void load();
})();
