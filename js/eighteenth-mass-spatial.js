/* 18C batch 35 — generous schematic geography for desktop historical map.
 * All outlines are editorial reference envelopes and NEVER verified real 18C boundaries.
 * No area square kilometers, no blanket transfer of Indigenous sovereignty.
 */
(function(){
'use strict';
if(new URLSearchParams(location.search).get('review18c')!=='1')return;
const host=window.__eighteenthSpatialHost;
if(!host){console.warn('18C batch35 host absent');return;}
const map=host.map,$=host.element,escapeHTML=host.escapeHTML,openPanel=host.openPanel;
const areaPane='eighteenthMassAreaPane',corePane='eighteenthMassCorePane';
map.createPane(areaPane);map.getPane(areaPane).style.zIndex='438';
map.createPane(corePane);map.getPane(corePane).style.zIndex='472';
const areaGroup=L.layerGroup().addTo(map),siteGroup=L.layerGroup().addTo(map);
const polyRenderer=L.svg({pane:areaPane}),pointRenderer=L.svg({pane:corePane});
let meta=null,loaded=false,error=null,year=host.getYear();
 const reader=window.AtlasReaderCopy;
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const color={administration:'#a78bfa',wartime_occupation:'#e0a17c',paper_claim:'#e2ba79',
revenue:'#dfb66c',trade_influence:'#73cbbf',military_vicinity:'#d0a8ff'};
const classText={administration:'殖民行政涉及区',wartime_occupation:'英军短期占领',
paper_claim:'法律/主权名义声索',revenue:'公司税收及财政权',trade_influence:'贸易、外交与间接影响',
military_vicinity:'驻军活动地区'};
function showDossier(x,period,isSite){
 host.clearSelection();
 const urls=[...new Set(x.source_urls||[])].filter(u=>/^https:\/\//.test(u));
 $('dossierBody').innerHTML=
  '<div class="dossier-kicker">18世纪 · 批量动态版图 · '+year+'年</div>'+
  '<h2>'+escapeHTML(x.title)+'</h2>'+
  '<p><strong>'+escapeHTML(isSite?'地点驻军/港口核心':classText[x.kind]||x.kind)+'</strong>　阶段：'+period.start_year+'—'+period.end_year+'</p>'+
  (reader.clean(x.note||'')?'<p>'+escapeHTML(reader.clean(x.note))+'</p>':'')+
  '<details open><summary>历史依据</summary><ul class="source-list">'+urls.map(u=>{
   let h=u;try{h=new URL(u).hostname}catch{}
   return '<li><a href="'+escapeHTML(u)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(h)+'</a></li>';
  }).join('')+'</ul></details>';
 openPanel('dossier');
}
function render(){
 year=host.getYear();
 areaGroup.clearLayers();siteGroup.clearLayers();
 if(!loaded||year<1700||year>1799||!$('mapLayerTerritory').checked||
 !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const zones=meta.zones.filter(z=>active(z,year));
 // The big paper claims are not filled: avoid a world-sized opaque sovereignty illusion.
 // Small and local envelopes sort last and remain clickable atop larger references.
 zones.sort((a,b)=>{
  let aa=(a.bbox[2]-a.bbox[0])*(a.bbox[3]-a.bbox[1]);
  let bb=(b.bbox[2]-b.bbox[0])*(b.bbox[3]-b.bbox[1]);return bb-aa;
 });
 for(const z of zones){
  const [w,s,e,n]=z.bbox,c=color[z.kind],outline=['paper_claim','trade_influence','military_vicinity'].includes(z.kind);
  const opacity=z.kind==='wartime_occupation'?.12:z.kind==='administration'?.075:z.kind==='revenue'?.07:0;
  const p=z.periods.find(p=>p.start_year<=year&&year<=p.end_year);
  L.rectangle([[s,w],[n,e]],{pane:areaPane,renderer:polyRenderer,
   color:c,weight:z.kind==='wartime_occupation'?1.9:1.55,opacity:.84,
   dashArray:outline?'3 8':'5 6',lineCap:'round',
   fill:!outline,fillColor:c,fillOpacity:opacity,
   interactive:true,bubblingMouseEvents:false,className:'atlas-18c-mass-zone'
  }).bindTooltip('<strong>'+escapeHTML(z.title)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(classText[z.kind]+' · '+p.start_year+'—'+p.end_year)+'</div>',
   {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);showDossier(z,p,false)})
   .addTo(areaGroup);
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
}
const validPeriods=ps=>Array.isArray(ps)&&ps.length>0&&ps.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&
 p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year);
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
    x.geometry_precision!=='editorial_schematic_bounding_envelope_not_historical_survey'||
    x.precise_historic_border!==false||x.territorial_control_verified!==false||
    x.uncertain_line_dashed!==true||x.exclude_from_territorial_area_totals!==true)throw Error('invalid envelope '+x.id);
   }
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
 visibleZoneLayers:areaGroup.getLayers().length,visibleCoreLayers:siteGroup.getLayers().length
 })};
void load();
})();
