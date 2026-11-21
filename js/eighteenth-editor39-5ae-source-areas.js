/* Editor39 batch 5AE: audited GIS borders, native island rings, coast and river paths. */
(function(){
'use strict';
const host=window.__eighteenthSpatialHost;if(!host)return;
// Promote a historical point to an existing source-backed fort footprint only while
// that polygon is demonstrably active. The original point and dated record remain in JSON.
const pointAreaPromotions=Object.freeze({
 EDITOR38_5AD_TELLICHERRY_FORT:{layer:'mass',polygon:'MYSORE_TELLICHERRY_FORT',start:1708,end:1799},
 EDITOR38_5AD_MADRAS_TREATY_1769:{layer:'mass',polygon:'MADRAS_ST_GEORGE_SIEGE',start:1769,end:1769},
 EDITOR38_5AD_ARCOT_1780:{layer:'mass',polygon:'ARCOT_FORT_CORE',start:1780,end:1780},
 EDITOR37_5AC_ANNAPOLIS_FORT_ANNE:{layer:'mass',polygon:'FORT_ANNE_ROYAL_PORT',start:1755,end:1755},
 EDITOR37_5AB_BEYIN:{layer:'5ab',polygon:'EDITOR37_5AB_BEYIN_FORT_AFTER_1773',start:1773,end:1799}
});
window.AtlasPointToArea5AE={
 replacesPoint(id,y){
  const p=pointAreaPromotions[id];
  if(!p||y<p.start||y>p.end)return false;
  const upstream=p.layer==='mass'?window.eighteenthMassSpatial:window.eighteenthEditor37FiveAB;
  const audit=upstream?.getAudit?.();
  if(!audit?.loaded)return false;
  return p.layer==='mass'?audit.activeRegionalZones?.includes(p.polygon)===true:
   audit.activeIds?.includes(p.polygon)===true;
 },
 refresh(){
  window.eighteenthEditor37FiveAB?.render?.();
  window.eighteenthEditor37FiveAC?.render?.();
  window.eighteenthEditor38FiveAD?.render?.();
 },
 getAudit:()=>({promotions:Object.keys(pointAreaPromotions).length,
  source_backed_only:true,polygon_ids:Object.values(pointAreaPromotions).map(x=>x.polygon)})
};
const map=host.map,$=host.element,esc=host.escapeHTML,reader=window.AtlasReaderCopy;
const areaPane='editor39FiveAEArea',sitePane='editor39FiveAESite';
map.createPane(areaPane);map.getPane(areaPane).style.zIndex='419';
map.createPane(sitePane);map.getPane(sitePane).style.zIndex='447';
const areaRenderer=L.svg({pane:areaPane}),siteRenderer=L.svg({pane:sitePane});
const group=L.layerGroup().addTo(map);
let records=[],layers=new Map(),loaded=false,error=null,year=host.getYear();
const active=(f,y)=>f.properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const palette={
 historic_proclamation_line:'#bc9b76',historic_indigenous_treaty_line:'#a6c7b2',
 physical_coastline:'#78adc1',physical_river:'#6baec7',american_revolution_battle_site:'#cba587',
 independent_coorg_royal_fort:'#c3a68b',forced_deportation_island:'#cf97a6',
 indigenous_land_island_context:'#baa88e',anglo_corsican_kingdom_island:'#9faec9',
 paper_claim_falkland_island_geography:'#c7b1a0'
};
function show(f){
 host.clearSelection();const p=f.properties;
 const links=[...new Set(p.source_urls)].map(u=>{
  let domain=u;try{domain=new URL(u).hostname}catch{}
  return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(domain)+'</a></li>';
 }).join('');
 $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪历史地理 · '+year+'年</div>'+
  '<h2>'+esc(p.title)+'</h2><p>'+esc(reader.clean(p.historical_context))+'</p>'+
  '<details open><summary>历史来源</summary><ul class="source-list">'+links+'</ul></details>';
 host.openPanel('dossier');
}
function make(f){
 const p=f.properties,geom=f.geometry.type,point=geom==='Point',line=['LineString','MultiLineString'].includes(geom);
 const pane=point?sitePane:areaPane,renderer=point?siteRenderer:areaRenderer;
 const color=palette[p.kind]||'#b6aabc';
 // Existing original dossiers, treaty clicks and historic fort overlays retain priority.
 const interactive=!p.source_geometry_id;
 const layer=L.geoJSON(f.geometry,{pane,renderer,color,opacity:.84,weight:line?2.2:1.7,
  fill:!line&&!point,fillColor:color,fillOpacity:line?0:.055,
  dashArray:line?'5 7':'4 6',lineCap:'round',interactive,bubblingMouseEvents:false,
  className:'atlas-editor39-5ae-source-area',
  pointToLayer:(_f,latlng)=>L.circleMarker(latlng,{pane,renderer,radius:5.6,color,
   weight:1.55,fillColor:color,fillOpacity:.8,dashArray:'2 3',
   interactive,bubblingMouseEvents:false})});
 layer.eachLayer(el=>el.on('add',()=>el.getElement()?.setAttribute('data-editor39-5ae-id',f.id)));
 if(interactive){
  layer.bindTooltip('<strong>'+esc(p.title)+'</strong>',
   {pane:'eventTooltipPane',className:'atlas-hover',sticky:true,direction:'auto',offset:[12,0]});
  layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);show(f)});
 }
 return layer;
}
function valid(d){
 if(d.type!=='FeatureCollection'||d.metadata?.schema!=='atlas-editor39-5ae-verified-geography-v1'||
  d.metadata.area_aggregation_forbidden!==true||d.metadata.no_invented_concession_polygons!==true||
  d.metadata.no_invented_sea_or_army_routes!==true||
  !Array.isArray(d.features)||d.features.length<14||
  d.metadata.feature_count!==d.features.length)throw Error('5AE source GIS schema missing');
 const ids=new Set(),validXY=xy=>Array.isArray(xy)&&xy.length>=2&&
  xy.slice(0,2).every(Number.isFinite)&&Math.abs(xy[0])<=180&&Math.abs(xy[1])<=90;
 for(const f of d.features){
  const p=f.properties,g=f.geometry;
  if(!f.id||ids.has(f.id)||p.stable_id!==f.id||p.area_sqkm!==null||
   p.territorial_control_verified!==false||p.historical_boundary_confirmed!==false||
   p.exclude_from_area_aggregation!==true||p.uncertain_line_dashed!==true||
   !p.source_urls?.length||p.source_urls.some(u=>!u.startsWith('https://'))||
   !p.historical_context||!p.periods?.length||
   p.periods.some(x=>x.start_year>x.end_year))throw Error('5AE unverified properties '+f.id);
  let paths=g.type==='Point'?[[g.coordinates]]:
   g.type==='LineString'?[g.coordinates]:
   g.type==='MultiLineString'?g.coordinates:
   g.type==='Polygon'?g.coordinates:
   g.type==='MultiPolygon'?g.coordinates.flat():null;
  if(!paths||!paths.length||paths.some(path=>path.length<(g.type==='Point'?1:g.type.includes('Line')?2:4)||
   path.some(x=>!validXY(x))||(['Polygon','MultiPolygon'].includes(g.type)&&
   JSON.stringify(path[0])!==JSON.stringify(path.at(-1)))))throw Error('5AE non-source shape '+f.id);
  ids.add(f.id);
 }
}
function render(){
 year=host.getYear();group.clearLayers();
 if(!loaded||year<1700||year>1800||!$('mapLayerTerritory').checked||
  !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 for(const f of records)if(active(f,year))layers.get(f.id).addTo(group);
}
async function load(){
 try{
  const r=await fetch('data/eighteenth-century-editor39-5ae-source-areas.geojson',{cache:'no-store'});
  if(!r.ok)throw Error('5AE HTTP '+r.status);const d=await r.json();
  valid(d);records=d.features;layers=new Map(records.map(f=>[f.id,make(f)]));loaded=true;render();
  window.AtlasPointToArea5AE.refresh();
 }catch(err){error=String(err);console.warn('5AE source GIS withheld:',err)}
}
window.eighteenthEditor39FiveAE={render,getAudit:()=>({loaded,error,year,
 featureCount:records.length,activeIds:records.filter(f=>active(f,year)).map(f=>f.id),
 visibleLayers:group.getLayers().length,
 polygonCount:records.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).length,
 physicalLineCount:records.filter(f=>f.properties.kind.startsWith('physical_')).length})};
void load();
})();
