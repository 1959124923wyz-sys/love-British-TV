/* 主编36第5Z批 · 从Natural Earth 1:10m数据提取的真实水岸形状。
 * 岸线/河道现代自然地理；历史使用来自国家公园、地方档案和原住民史。
 * 禁止把水体或商路充当殖民主权/行政多边形；原始参考框仍留在JSON。
 */
(function(){
 'use strict';
 const host=window.__eighteenthSpatialHost;if(!host)return;
 const map=host.map,$=host.element,esc=host.escapeHTML,reader=window.AtlasReaderCopy;
 const pane='eighteenth5zWaterways';
 map.createPane(pane);map.getPane(pane).style.zIndex='449';
 const group=L.layerGroup().addTo(map),renderer=L.svg({pane});
 let records=[],cache=new Map(),loaded=false,error=null,year=host.getYear();
 function active(x,y){return x.properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);}
 function showDossier(f){
  host.clearSelection();
  const p=f.properties;
  const sources=[...new Set(p.source_urls)];
  let links=sources.map(url=>{
   let domain=url;try{domain=new URL(url).hostname}catch{}
   return '<li><a target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+esc(domain)+'</a></li>';
  }).join('');
  const text=reader.clean(p.historical_context);
  $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪水路与港站 · '+year+'年</div>'+
   '<h2>'+esc(p.title)+'</h2>'+
   (text?'<p>'+esc(text)+'</p>':'')+
   '<details open><summary>历史来源</summary><ul class="source-list">'+links+'</ul></details>';
  host.openPanel('dossier');
 }
 function makeLayer(f){
  const lake=f.properties.kind==='lake_shore',c=lake?'#63bfd0':'#6bafd5';
  const layer=L.geoJSON(f.geometry,{
   pane,renderer,color:c,weight:lake?1.65:2.4,
   opacity:lake?.91:.85,dashArray:lake?'5 7':'7 5',
   lineCap:'round',fill:lake,fillColor:c,fillOpacity:lake?.045:0,
   bubblingMouseEvents:false,interactive:true,
   className:lake?'atlas-18c-5z-lake':'atlas-18c-5z-river'
  });
  layer.eachLayer(child=>child.on('add',()=>child.getElement()?.setAttribute('data-hydro-id',f.id)));
  layer.bindTooltip('<strong>'+esc(f.properties.title)+'</strong>',{
   pane:'eventTooltipPane',className:'atlas-hover',sticky:true,direction:'auto',offset:[12,0]
  });
  layer.on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);showDossier(f)});
  return layer;
 }
 function render(){
  year=host.getYear();group.clearLayers();
  if(!loaded||year<1700||year>1800||
   !$('mapLayerTerritory').checked||!$('toggleTerritorialFootprints').checked||
   !$('toggleControlAreas').checked)return;
  for(const f of records)if(active(f,year))cache.get(f.id).addTo(group);
 }
 function vCoord(c){return Array.isArray(c)&&c.length===2&&c.every(Number.isFinite)&&
  c[0]>=-180&&c[0]<=180&&c[1]>=-90&&c[1]<=90;}
 function validGeometry(f){
  const g=f.geometry;if(!g||!['Polygon','MultiLineString'].includes(g.type))return false;
  if(g.type==='Polygon')return Array.isArray(g.coordinates)&&g.coordinates.length>=1&&
   g.coordinates.every(r=>Array.isArray(r)&&r.length>=4&&r.every(vCoord)&&
    r[0][0]===r.at(-1)[0]&&r[0][1]===r.at(-1)[1]);
  return Array.isArray(g.coordinates)&&g.coordinates.length>0&&
   g.coordinates.every(s=>Array.isArray(s)&&s.length>=2&&s.every(vCoord));
 }
 function check(data){
  if(data.type!=='FeatureCollection'||
   data.metadata?.schema!=='atlas-editor36-5z-hydro-physical-geography-v1'||
   data.metadata?.area_aggregation_forbidden!==true||
   data.metadata?.historical_area_sqkm!==null||data.features?.length!==18||
   data.features.filter(f=>f.geometry?.type==='Polygon').length!==10||
   data.features.filter(f=>f.geometry?.type==='MultiLineString').length!==8)throw Error('5Z collection integrity');
  const ids=new Set();
  for(const f of data.features){
   const p=f.properties;
   if(!f.id||ids.has(f.id)||p?.stable_id!==f.id||
    !['lake_shore','river_course'].includes(p.kind)||!validGeometry(f)||
    (p.kind==='lake_shore')!==(f.geometry.type==='Polygon')||
    !p.title||!p.historical_context||p.area_sqkm!==null||
    p.territorial_control_verified!==false||p.historical_boundary_confirmed!==false||
    p.uncertain_line_dashed!==true||p.exclude_from_area_aggregation!==true||
    !p.geometry_precision?.startsWith('present_day_natural_earth_10m_')||
    !p.source_urls?.length||p.source_urls.some(u=>!u.startsWith('https://'))||
    p.periods?.length!==1||!Number.isInteger(p.periods[0].start_year)||
    p.periods[0].start_year<1700||p.periods[0].end_year!==1800)
    throw Error('invalid 5Z geography: '+f.id);
   ids.add(f.id);
  }
 }
 async function load(){
  try{
   const response=await fetch('data/eighteenth-century-editor36-5z-waterways.geojson',{cache:'no-store'});
   if(!response.ok)throw Error('5Z data HTTP '+response.status);
   const data=await response.json();check(data);
   records=data.features;
   cache=new Map(records.map(f=>[f.id,makeLayer(f)]));
   loaded=true;render();
  }catch(e){error=String(e);console.warn('5Z researched geography withheld:',e)}
 }
 window.eighteenthEditor36FiveZ={
  render,getAudit:()=>({loaded,error,year,areaCount:records.filter(f=>f.geometry.type==='Polygon').length,
  lineCount:records.filter(f=>f.geometry.type==='MultiLineString').length,
  activeIds:records.filter(f=>active(f,year)).map(f=>f.id),
  visibleLayers:group.getLayers().length})
 };
 void load();
})();
