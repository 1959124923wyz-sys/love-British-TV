/* Editor40 5AF: source-backed 1790 Niagara archival raster.
 * This is a library scan reprojected by its GIS ImageServer, NOT a drawn
 * eighteenth-century political border, new land claim or area statistic.
 */
(function(){
'use strict';
const host=window.__eighteenthSpatialHost;
const toggle=document.getElementById('showNiagara1790Survey');
const hint=document.getElementById('niagara1790SurveyStatus');
if(!host||!toggle||!hint)return;
const map=host.map;
let record=null,layer=null,loaded=false,error=null,imageError=null;
let year=host.getYear();
const pane='atlasEditor40Archive1790';
map.createPane(pane);
map.getPane(pane).style.zIndex='407'; // behind real site and political geometry
toggle.disabled=true;
const sourceYear=1790;
function active(){
 year=host.getYear();
 return loaded&&year===sourceYear&&
  document.getElementById('mapLayerTerritory').checked&&
  document.getElementById('toggleTerritorialFootprints').checked;
}
function render(){
 const yes=active();
 toggle.disabled=!yes;
 if(!yes){
  if(layer&&map.hasLayer(layer))map.removeLayer(layer);
  toggle.checked=false;
 }
 if(yes&&toggle.checked&&layer&&!map.hasLayer(layer))layer.addTo(map);
 if(yes&&!toggle.checked&&layer&&map.hasLayer(layer))map.removeLayer(layer);
 hint.textContent=error?'史图资料暂未加载，请打开原始馆藏':
  imageError?'原图影像暂不可用，请打开原始馆藏':
  yes?'1790年配准史图，仅作堡垒与地形对照':
  '切换到1790年可对照原始军事测绘图';
}
function validate(d){
 if(d.schema!=='atlas-editor40-5af-source-registered-archival-raster-v1'||
    d.survey_year!==1790||d.visible_years?.[0]!==1790||d.visible_years?.[1]!==1790||
    d.source_spatial_reference!==26917||d.display_spatial_reference!==4326||
    d.historical_fort_boundary_digitized!==false||
    d.historical_territorial_control_verified!==false||
    d.excluded_from_area_totals!==true||d.display_bbox_is_raster_request_only!==true||
    d.show_by_default!==false||!d.source_image_service?.startsWith(
     'https://terra.library.brocku.ca/arcgis/rest/services/EarlyNiagara/')||
    !Array.isArray(d.source_extent_m)||d.source_extent_m.length!==4||
    !Array.isArray(d.display_export_bbox_wgs84)||d.display_export_bbox_wgs84.length!==4||
    d.display_export_bbox_wgs84.some(x=>!Number.isFinite(x))||
    !d.archive_reference||!d.source_urls?.length)
    throw Error('Invalid historical GIS raster record');
 const [w,s,e,n]=d.display_export_bbox_wgs84;
 if(w>=e||s>=n||Math.abs(w)>180||Math.abs(e)>180||
    Math.abs(s)>90||Math.abs(n)>90)throw Error('Invalid source raster request bounds');
}
async function load(){
 try{
  const r=await fetch('data/eighteenth-century-editor40-5af-niagara-1790-survey.json',{cache:'no-store'});
  if(!r.ok)throw Error('5AF source inventory HTTP '+r.status);
  const d=await r.json();validate(d);record=d;
  const [w,s,e,n]=d.display_export_bbox_wgs84;
  const bounds=L.latLngBounds([s,w],[n,e]);
  const url=new URL(d.source_image_service+'/exportImage');
  url.searchParams.set('bbox',[w,s,e,n].join(','));
  url.searchParams.set('bboxSR','4326');
  url.searchParams.set('imageSR','4326');
  url.searchParams.set('size','1800,1150');
  url.searchParams.set('format','png32');
  url.searchParams.set('f','image');
  layer=L.imageOverlay(url.href,bounds,{pane,opacity:.67,interactive:false,
   attribution:'1790 NMC 17879; Brock University, Map, Data & GIS Library'});
  layer.on('load',()=>{imageError=null;render()});
  layer.on('error',()=>{imageError='Remote archival map image failed';render()});
  loaded=true;render();
 }catch(e){
  error=String(e);toggle.disabled=true;render();
  console.warn('5AF archival survey withheld:',e);
 }
}
toggle.addEventListener('change',()=>{
 render();
 if(toggle.checked&&layer)map.fitBounds(layer.getBounds(),{padding:[30,30],maxZoom:15,animate:false});
});
document.getElementById('mapLayerTerritory').addEventListener('change',render);
document.getElementById('toggleTerritorialFootprints').addEventListener('change',render);
const yearLabel=document.getElementById('bigYear');
if(yearLabel){
 new MutationObserver(render).observe(yearLabel,{subtree:true,childList:true,characterData:true});
}
window.atlasHistoricalSurvey5AF={render,getAudit:()=>({
 loaded,year,eligible:active(),enabled:toggle.checked,
 visible:!!layer&&map.hasLayer(layer),error,imageError,
 source_archive_reference:record?.archive_reference||null,
 source_map_year:record?.survey_year||null,
 real_eighteenth_century_control_polygon:false,
 original_image_service:record?.source_image_service||null
})};
void load();
})();
