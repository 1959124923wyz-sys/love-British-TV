/* 18C batch 35 — generous schematic geography for desktop historical map.
 * Outlines use either a dated geographic source or a legacy reference envelope.
 * No area square kilometers, no blanket transfer of Indigenous sovereignty.
 */
(function(){
'use strict';
const host=window.__eighteenthSpatialHost;
if(!host){console.warn('18C batch35 host absent');return;}
const map=host.map,$=host.element,escapeHTML=host.escapeHTML,openPanel=host.openPanel;
const areaPane='eighteenthMassAreaPane',corePane='eighteenthMassCorePane';
map.createPane(areaPane);map.getPane(areaPane).style.zIndex='438';
map.createPane(corePane);map.getPane(corePane).style.zIndex='472';
const areaGroup=L.layerGroup().addTo(map),siteGroup=L.layerGroup().addTo(map);
const coastalRights=L.layerGroup().addTo(map),regionalSites=L.layerGroup();
const polyRenderer=L.svg({pane:areaPane}),pointRenderer=L.svg({pane:corePane});
let meta=null,loaded=false,error=null,year=host.getYear();
 const reader=window.AtlasReaderCopy;
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const color={administration:'#a78bfa',wartime_occupation:'#e0a17c',paper_claim:'#e2ba79',
revenue:'#dfb66c',trade_influence:'#73cbbf',military_vicinity:'#d0a8ff',foreign_occupation:'#7faab6',
 treaty_fishing:'#61c9ca',company_post:'#cbb2f5',conflict_damage:'#e2af7a',diplomacy:'#65c7b6',historic_ruins:'#c2b6a2'};
const classText={administration:'殖民行政涉及区',wartime_occupation:'英军短期占领',
paper_claim:'法律/主权名义声索',revenue:'公司税收及财政权',trade_influence:'贸易、外交与间接影响',
military_vicinity:'驻军活动地区',foreign_occupation:'其他国家管辖',
 treaty_fishing:'条约渔权',company_post:'公司商站',conflict_damage:'战时毁损',diplomacy:'外交与条约',historic_ruins:'堡垒遗迹'};
function showDossier(x,period,isSite){
 host.clearSelection();
 const urls=[...new Set(x.source_urls||[])].filter(u=>/^https:\/\//.test(u));
 const historicalNote=reader.clean(period.note||x.note||'');
 $('dossierBody').innerHTML=
  '<div class="dossier-kicker">18世纪 · 批量动态版图 · '+year+'年</div>'+
  '<h2>'+escapeHTML(period.title||x.title)+'</h2>'+
  '<p><strong>'+escapeHTML(isSite?'地点驻军/港口核心':classText[period.kind||x.kind])+'</strong>　阶段：'+period.start_year+'—'+period.end_year+'</p>'+
  (historicalNote?'<p>'+escapeHTML(historicalNote)+'</p>':'')+
  '<details open><summary>历史依据</summary><ul class="source-list">'+urls.map(u=>{
   let h=u;try{h=new URL(u).hostname}catch{}
   return '<li><a href="'+escapeHTML(u)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(h)+'</a></li>';
  }).join('')+'</ul></details>';
 openPanel('dossier');
}
function bindRecord(layer,record,period){
 return layer.bindTooltip('<strong>'+escapeHTML(period.title||record.title)+'</strong><div class="atlas-hover-summary">'+
  escapeHTML(classText[period.kind||record.kind]+' · '+period.start_year+'—'+period.end_year)+'</div>',
  {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
  .on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);showDossier(record,period,false)});
}
function syncRegionalSites(){
 if(map.getZoom()>=7)regionalSites.addTo(map);
 else regionalSites.remove();
}
function render(){
 year=host.getYear();
 areaGroup.clearLayers();siteGroup.clearLayers();
 regionalSites.clearLayers();coastalRights.clearLayers();
 if(!loaded||year<1700||!$('mapLayerTerritory').checked||
 !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 for(const record of meta.coastal_rights||[]){
  const period=record.periods.find(p=>p.start_year<=year&&year<=p.end_year);
  if(!period)continue;
  const line=L.geoJSON(record.geometry,{pane:corePane,renderer:pointRenderer,color:color.treaty_fishing,
   weight:3.5,dashArray:'6 5',lineCap:'round',fill:false,bubblingMouseEvents:false,className:'atlas-18c-treaty-shore'});
  bindRecord(line,record,period).addTo(coastalRights);
 }
 if(year>1799)return;
 const zones=[...meta.zones,...(meta.regional_zones||[])].filter(z=>active(z,year));
 // The big paper claims are not filled: avoid a world-sized opaque sovereignty illusion.
 // Small and local envelopes sort last and remain clickable atop larger references.
 zones.sort((a,b)=>{
  let aa=(a.bbox[2]-a.bbox[0])*(a.bbox[3]-a.bbox[1]);
  let bb=(b.bbox[2]-b.bbox[0])*(b.bbox[3]-b.bbox[1]);return bb-aa;
 });
 for(const z of zones){
  const p=z.periods.find(p=>p.start_year<=year&&year<=p.end_year);
  const [w,s,e,n]=z.bbox,kind=p.kind||z.kind,c=color[kind];
  const outline=z.outline_only===true||['paper_claim','trade_influence','military_vicinity','diplomacy'].includes(kind);
  const opacity=kind==='wartime_occupation'?.12:kind==='administration'||kind==='foreign_occupation'?.075:kind==='revenue'?.07:0;
  const style={pane:areaPane,renderer:polyRenderer,
   color:c,weight:kind==='wartime_occupation'?1.9:1.55,opacity:.84,
   dashArray:outline?'3 8':'5 6',lineCap:'round',
   fill:!outline,fillColor:c,fillOpacity:opacity,
   interactive:true,bubblingMouseEvents:false,className:'atlas-18c-mass-zone'+(z.geometry?' atlas-18c-source-outline':'')
  };
  const layer=z.geometry?L.geoJSON(z.geometry,style):L.rectangle([[s,w],[n,e]],style);
  bindRecord(layer,z,p).addTo(areaGroup);
 }
 for(const x of meta.sites){
  if(!active(x,year))continue;
  const p=x.periods.find(p=>p.start_year<=year&&year<=p.end_year);
  L.circleMarker([x.coordinates[1],x.coordinates[0]],{
   pane:corePane,renderer:pointRenderer,radius:5.5,color:'#d7c1ff',weight:1.35,
   fillColor:'#9d79df',fillOpacity:.88,bubblingMouseEvents:false,
   className:'atlas-18c-mass-core'
  }).bindTooltip('<strong>'+escapeHTML(x.title)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(p.start_year+'—'+p.end_year)+'</div>',
   {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);showDossier(x,p,true)})
   .addTo(siteGroup);
 }
 for(const record of meta.regional_sites||[]){
  const period=record.periods.find(p=>p.start_year<=year&&year<=p.end_year);
  if(!period)continue;
  const [lon,lat]=record.geometry.coordinates;
  const stroke=color[period.kind||record.kind];
  const marker=L.circleMarker([lat,lon],{pane:corePane,renderer:pointRenderer,radius:5,
   color:stroke,weight:1.6,dashArray:'3 3',fill:true,fillColor:stroke,fillOpacity:.36,
   bubblingMouseEvents:false,className:'atlas-18c-regional-site'});
  bindRecord(marker,record,period).addTo(regionalSites);
 }
 syncRegionalSites();
}
const validPeriods=(ps,end=1799)=>Array.isArray(ps)&&ps.length>0&&ps.every(p=>
 Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=end&&p.start_year<=p.end_year);
const validCoordinate=c=>Array.isArray(c)&&c.length===2&&c.every(Number.isFinite)&&Math.abs(c[0])<=180&&Math.abs(c[1])<=90;
function validOutline(geometry,bbox){
 const polygons=geometry?.type==='Polygon'?[geometry.coordinates]:
  geometry?.type==='MultiPolygon'?geometry.coordinates:[];
 return Array.isArray(polygons)&&polygons.length>0&&polygons.every(polygon=>
  Array.isArray(polygon)&&polygon.length>0&&polygon.every(ring=>Array.isArray(ring)&&ring.length>=4&&
   ring.every(point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)&&
    point[0]>=bbox[0]&&point[0]<=bbox[2]&&point[1]>=bbox[1]&&point[1]<=bbox[3])&&
   ring[0][0]===ring.at(-1)[0]&&ring[0][1]===ring.at(-1)[1]));
}
function validate(m){
 if(m.schema!=='atlas-18c-mass-schematic-zones-v1'||m.editorial_status!=='research_preview_not_published'||
 m.area_aggregation_forbidden!==true||m.approved_actual_control_polygons!==0||m.square_km_totals!==null||
 m.zones?.length!==81||m.sites?.length!==42)throw Error('18C 35 bulk data audit mismatch');
 const ids=new Set(),knownKinds=new Set(Object.keys(color));
 for(const [array,isSite] of [[m.zones,false],[m.sites,true]]){
  for(const x of array){
   if(!x.id||ids.has(x.id)||!validPeriods(x.periods)||x.area_sqkm!==null||
    !x.source_key||m.sources[x.source_key]!==x.source_urls?.[0]||
    !x.source_urls[0].startsWith('https://'))throw Error('invalid item '+x.id);
   ids.add(x.id);
   if(isSite){
    if(x.coordinates?.length!==2||!x.coordinates.every(Number.isFinite)||
     Math.abs(x.coordinates[0])>180||Math.abs(x.coordinates[1])>90||
     x.historical_city_wall_survey!==false||x.screen_radius_not_ground_area!==true)throw Error('invalid core '+x.id);
   }else{
    const b=x.bbox;
    if(!knownKinds.has(x.kind)||b?.length!==4||!b.every(Number.isFinite)||
    !(b[0]<b[2]&&b[1]<b[3])||b[0]<-180||b[2]>180||b[1]<-90||b[3]>90||
    (x.geometry?x.geometry_precision!=='source_backed_historical_outline'||!validOutline(x.geometry,b):
     x.geometry_precision!=='editorial_schematic_bounding_envelope_not_historical_survey')||
    x.periods.some(p=>p.kind!==undefined&&!knownKinds.has(p.kind))||
    x.precise_historic_border!==false||x.territorial_control_verified!==false||
    x.uncertain_line_dashed!==true||x.exclude_from_territorial_area_totals!==true)throw Error('invalid envelope '+x.id);
   }
  }
 }
 for(const [records,geometryType] of [[m.regional_zones,'Polygon'],[m.regional_sites,'Point'],[m.coastal_rights,'LineString']]){
  for(const x of records||[]){
   const g=x.geometry,kind=geometryType==='LineString'?'treaty_fishing':x.kind;
   if(!x.id||ids.has(x.id)||g?.type!==geometryType||!knownKinds.has(kind)||kind!==x.kind||
    !x.title||x.area_sqkm!==null||x.uncertain_line_dashed!==true||x.exclude_from_territorial_area_totals!==true||
    !x.source_urls?.length||x.source_urls.some(url=>!url?.startsWith('https://'))||
    !validPeriods(x.periods,geometryType==='LineString'?1903:1799)||
    x.periods.some((p,i)=>!p.title||!p.note||(p.kind!==undefined&&!knownKinds.has(p.kind))||
     (i>0&&p.start_year<=x.periods[i-1].end_year)))throw Error('invalid regional record '+x.id);
   const coords=g.coordinates;
   if(geometryType==='Polygon'&&(!x.bbox?.length||!validOutline(g,x.bbox))||
    geometryType==='Point'&&!validCoordinate(coords)||
    geometryType==='LineString'&&(!Array.isArray(coords)||coords.length<2||!coords.every(validCoordinate)))
    throw Error('invalid regional geometry '+x.id);
   ids.add(x.id);
  }
 }
}
async function load(){
 try{
  const res=await fetch('data/eighteenth-century-mass-schematic-zones-1700-1799.json',{cache:'no-store'});
  if(!res.ok)throw Error('18C mass data fetch '+res.status);
  const data=await res.json();validate(data);meta=data;loaded=true;render();
 }catch(e){error=String(e);console.warn('18C mass geography withheld:',e);}
}
window.eighteenthMassSpatial={render,getAudit:()=>({
 loaded,error,year,zoneCount:meta?.zones.length||0,coreCount:meta?.sites.length||0,
 timePhases:meta?[...meta.zones,...meta.sites].reduce((s,x)=>s+x.periods.length,0):0,
 activeZones:meta?meta.zones.filter(x=>active(x,year)).map(x=>x.id):[],
 activeSites:meta?meta.sites.filter(x=>active(x,year)).map(x=>x.id):[],
 activeRegionalZones:(meta?.regional_zones||[]).filter(x=>active(x,year)).map(x=>x.id),
 activeRegionalSites:(meta?.regional_sites||[]).filter(x=>active(x,year)).map(x=>x.id),
 activeCoastalRights:(meta?.coastal_rights||[]).filter(x=>active(x,year)).map(x=>x.id),
 visibleZoneLayers:areaGroup.getLayers().length,visibleCoreLayers:siteGroup.getLayers().length
 })};
map.on('zoomend',syncRegionalSites);
void load();
})();
