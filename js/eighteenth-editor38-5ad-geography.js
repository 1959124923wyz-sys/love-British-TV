/* Editor38 5AD: treaty sites, colonial and Indigenous historical nodes, sourced hydrology. */
(function(){
'use strict';
const host=window.__eighteenthSpatialHost;if(!host)return;
const map=host.map,$=host.element,esc=host.escapeHTML,reader=window.AtlasReaderCopy;
const hydroPane='eighteenth5adHydro',sitePane='eighteenth5adSites';
map.createPane(hydroPane);map.getPane(hydroPane).style.zIndex='422';
map.createPane(sitePane);map.getPane(sitePane).style.zIndex='449';
const hydroRenderer=L.svg({pane:hydroPane}),siteRenderer=L.svg({pane:sitePane});
const group=L.layerGroup().addTo(map);
let records=[],layers=new Map(),loaded=false,error=null,year=host.getYear();
const active=(f,y)=>f.properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const colors={
 indigenous_resistance:'#b89c7a',fur_trade_site:'#c8b17f',fiscal_administration:'#d1b17d',
 fiscal_coercion:'#c9a190',coastal_factory:'#a6b9c8',enslaved_resistance:'#d09da1',
 anti_colonial_resistance:'#db9d92',south_india_war_site:'#d4a18a',
 south_india_diplomacy:'#a7b89d',south_india_naval_site:'#9cbec9',
 american_revolution_battle:'#d2a08f',american_revolution_river_site:'#95b9c9',
 belize_treaty_reference:'#cab38b',belize_logwood_settlement:'#c4b18d',
 physical_trade_waterways:'#70b9cf'
};
function open(f){
 host.clearSelection();const p=f.properties;
 const sources=[...new Set(p.source_urls)].map(u=>{
  let domain=u;try{domain=new URL(u).hostname}catch{}
  return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(domain)+'</a></li>';
 }).join('');
 $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪历史地理 · '+year+'年</div>'+
  '<h2>'+esc(p.title)+'</h2><p>'+esc(reader.clean(p.historical_context))+'</p>'+
  '<details open><summary>历史来源</summary><ul class="source-list">'+sources+'</ul></details>';
 host.openPanel('dossier');
}
function make(f){
 const line=f.geometry.type==='MultiLineString';
 const pane=line?hydroPane:sitePane,renderer=line?hydroRenderer:siteRenderer;
 const color=colors[f.properties.kind]||'#a4afc0';
 const layer=L.geoJSON(f.geometry,{pane,renderer,color,weight:line?2.05:1.55,opacity:.85,
  dashArray:line?'5 7':'2 3',lineCap:'round',interactive:true,bubblingMouseEvents:false,
  pointToLayer:(_f,loc)=>L.circleMarker(loc,{pane,renderer,radius:5.1,color,weight:1.55,
   fillColor:color,fillOpacity:.78,dashArray:'2 3',interactive:true,bubblingMouseEvents:false,
   className:'atlas-editor38-5ad-site'})});
 layer.eachLayer(el=>el.on('add',()=>el.getElement()?.setAttribute('data-editor38-5ad-id',f.id)));
 layer.bindTooltip('<strong>'+esc(f.properties.title)+'</strong>',
  {pane:'eventTooltipPane',className:'atlas-hover',sticky:true,direction:'auto',offset:[12,0]});
 layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);open(f)});
 return layer;
}
function validate(d){
 if(d.type!=='FeatureCollection'||d.metadata?.schema!=='atlas-editor38-5ad-source-nodes-hydro-treaty-v1'||
  d.metadata.area_aggregation_forbidden!==true||d.metadata.retired_legacy_zone_ids?.length!==25||
  d.features?.length!==27||d.features.filter(f=>f.geometry?.type==='Point').length!==26||
  d.features.filter(f=>f.geometry?.type==='MultiLineString').length!==1)
  throw Error('5AD schema/count mismatch');
 const ids=new Set(),validCoord=p=>Array.isArray(p)&&p.length>=2&&
  p.slice(0,2).every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90;
 for(const f of d.features){
  const p=f.properties,g=f.geometry;
  if(!f.id||ids.has(f.id)||p.stable_id!==f.id||p.area_sqkm!==null||
   p.historical_boundary_confirmed!==false||p.territorial_control_verified!==false||
   p.uncertain_line_dashed!==true||p.exclude_from_area_aggregation!==true||
   !p.historical_context||!p.source_urls?.length||p.source_urls.some(x=>!x.startsWith('https://'))||
   !p.periods?.length||p.periods.some(z=>z.start_year>z.end_year))
    throw Error('5AD metadata invalid '+f.id);
  if(g.type==='Point'?!validCoord(g.coordinates):
   !Array.isArray(g.coordinates)||!g.coordinates.length||g.coordinates.some(line=>
    !Array.isArray(line)||line.length<2||line.some(v=>!validCoord(v))))
    throw Error('5AD geometry invalid '+f.id);
  ids.add(f.id);
 }
}
function render(){
 year=host.getYear();group.clearLayers();
 if(!loaded||year<1700||year>1800||!$('mapLayerTerritory').checked||
  !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 for(const f of records)if(active(f,year)&&!window.AtlasPointToArea5AE?.replacesPoint?.(f.id,year))layers.get(f.id).addTo(group);
}
async function load(){
 try{
  const res=await fetch('data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson',{cache:'no-store'});
  if(!res.ok)throw Error('5AD HTTP '+res.status);
  const data=await res.json();validate(data);
  records=data.features;layers=new Map(records.map(f=>[f.id,make(f)]));loaded=true;render();
 }catch(e){error=String(e);console.warn('5AD historical geography withheld:',e)}
}
window.eighteenthEditor38FiveAD={
 render,
 getAudit:()=>({loaded,error,year,featureCount:records.length,
  activeIds:records.filter(f=>active(f,year)).map(f=>f.id),
  visibleLayers:group.getLayers().length,
  pointCount:records.filter(f=>f.geometry.type==='Point').length,
  waterwayCount:records.filter(f=>f.geometry.type==='MultiLineString').length})
};
void load();
})();
