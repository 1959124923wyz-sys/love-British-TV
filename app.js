/* Imperial Expansion Atlas · scalable century/decade/year timeline
   Facts, geography and provenance live in data/atlas-1497-1500.json.
   All speculative routes are marked illustrative. */
(function(){
'use strict';
const $ = id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const map = L.map('map',{zoomControl:false,worldCopyJump:false,preferCanvas:true,minZoom:2,maxZoom:11,scrollWheelZoom:true}).setView([51,-31],3);
// Zoom by wheel, touch or double-click; the map surface stays free of floating controls.
// Read-only viewport status for visual regression; no external command can mutate historical geometry.
window.atlasReadViewport=()=>({zoom:map.getZoom(),center:{lat:map.getCenter().lat,lng:map.getCenter().lng}});
// The familiar modern OSM street map is the DEFAULT geographic reference:
// present-day names and roads let readers locate Tudor events in today's world.
// Those labels are contemporary orientation aids, not Tudor political geography.
// Readers may optionally switch to NASA's unlabeled modern physical relief.
const modernTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
 maxZoom:19,maxNativeZoom:19,
 attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
}).addTo(map);
const physicalTiles=L.tileLayer(
 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',{
 maxZoom:11,maxNativeZoom:8,noWrap:true,
 bounds:[[-85.05112878,-180],[85.05112878,180]],
 attribution:'Physical imagery: <a href="https://www.earthdata.nasa.gov/data/tools/gibs" target="_blank" rel="noopener">NASA GIBS</a>'
});
// Local Natural Earth land-only fallback is used ONLY for NASA tile failures.
// Its rendering lives below the tiles and cannot intercept historical clicks.
map.createPane('physicalFallbackPane');
map.getPane('physicalFallbackPane').style.zIndex='190';
map.getPane('physicalFallbackPane').style.pointerEvents='none';
let selectedBasemap='modern',physicalTileErrors=0;
let physicalFallbackLayer=null,physicalFallbackLoading=null;
async function activatePhysicalFallback(){
 if(selectedBasemap!=='physical')return;
 if(physicalFallbackLayer){physicalFallbackLayer.addTo(map);return;}
 if(physicalFallbackLoading)return;
 physicalFallbackLoading=(async()=>{
  try{
   const response=await fetch('data/natural-earth-land-110m.topojson');
   if(!response.ok||typeof topojson==='undefined')throw new Error('Physical geography unavailable');
   const topology=await response.json();
   if(topology.type!=='Topology'||!topology.objects?.land||topology.objects?.countries)
    throw new Error('Unverified physical geography fallback');
   const land=topojson.feature(topology,topology.objects.land);
   return L.geoJSON(land,{pane:'physicalFallbackPane',renderer:L.canvas({pane:'physicalFallbackPane'}),
    interactive:false,style:()=>({color:'#78988d',weight:.6,opacity:.7,
      fillColor:'#405950',fillOpacity:1})});
  }catch(error){console.warn('Physical map fallback unavailable:',error);return null;}
 })();
 const fallback=await physicalFallbackLoading;
 physicalFallbackLoading=null;
 if(fallback){
  physicalFallbackLayer=fallback;
  if(selectedBasemap==='physical')physicalFallbackLayer.addTo(map);
 }
}
physicalTiles.on('tileerror',()=>{
 if(selectedBasemap!=='physical'||++physicalTileErrors<3)return;
 map.removeLayer(physicalTiles);
 void activatePhysicalFallback();
});
function setBasemap(mode){
 const next=mode==='physical'?'physical':'modern';
 if(next===selectedBasemap)return;
 selectedBasemap=next;
 if(next==='modern'){
  map.removeLayer(physicalTiles);
  if(physicalFallbackLayer)map.removeLayer(physicalFallbackLayer);
  modernTiles.addTo(map);
 }else{
  map.removeLayer(modernTiles);
  if(physicalFallbackLayer)map.removeLayer(physicalFallbackLayer);
  physicalTileErrors=0;
  physicalTiles.addTo(map);
 }
 // Map center, zoom, selected historical year and all historic overlays stay unchanged.
}
// Tooltip descriptions use their own pane, always above Leaflet markers and historical outlines.
map.createPane('eventTooltipPane');
map.getPane('eventTooltipPane').style.zIndex='820';
map.getPane('eventTooltipPane').style.pointerEvents='none';
// High visibility historic control-area symbols; derived from documented city governance,
// not from invented town-wall polygons. Keep beneath Leaflet event markers.
map.createPane('controlAreaPane');
map.getPane('controlAreaPane').style.zIndex='465';
// Route hit targets above geographic polygons and below event glyphs.
map.createPane('enslavementBandPane');
map.getPane('enslavementBandPane').style.zIndex='478';
const enslavementBandRenderer=L.svg({pane:'enslavementBandPane'});
map.createPane('voyagePane');
map.getPane('voyagePane').style.zIndex='480';
const voyageRenderer=L.svg({pane:'voyagePane'});
map.createPane('territoryPane');
map.getPane('territoryPane').style.zIndex='455';
const territoryRenderer=L.svg({pane:'territoryPane'});
// The base map prefers Canvas; precise year-end garrison markers need an explicit SVG layer.
const wartimeRenderer=L.svg({pane:'controlAreaPane'});
// Narrow invisible annulus ABOVE event icons restores access to occupied-zone
// information where a 30–40px event hub covers the entire small site symbol.
// Its middle remains transparent/click-through so events still work.
map.createPane('garrisonHitPane');
map.getPane('garrisonHitPane').style.zIndex='620';
const garrisonHitRenderer=L.svg({pane:'garrisonHitPane'});
// The optional schematic area layer is below true site symbols; high zoom uses points only.
map.createPane('warVicinityPane');map.getPane('warVicinityPane').style.zIndex='463';
// Munster invasion impact study polygons remain behind historic city/event markers.
map.createPane('invasionImpactPane');map.getPane('invasionImpactPane').style.zIndex='460';
const invasionImpactRenderer=L.svg({pane:'invasionImpactPane'});
map.getPane('warVicinityPane').style.pointerEvents='auto';
const warVicinityRenderer=L.svg({pane:'warVicinityPane'});
map.createPane('warReachPane');
map.getPane('warReachPane').style.zIndex='461';
map.getPane('warReachPane').style.pointerEvents='auto';
const warReachRenderer=L.svg({pane:'warReachPane'});
map.createPane('contestedZonePane');
map.getPane('contestedZonePane').style.zIndex='462';
map.getPane('contestedZonePane').style.pointerEvents='auto';
const contestedZoneRenderer=L.svg({pane:'contestedZonePane'});
// Modern statutory monument polygons (HES) are archaeological references, not Tudor lands.
map.createPane('archaeologyReferencePane');
map.getPane('archaeologyReferencePane').style.zIndex='465';
const archaeologyReferenceRenderer=L.svg({pane:'archaeologyReferencePane'});
map.createPane('sovereigntyPane');
map.getPane('sovereigntyPane').style.zIndex='410';
const sovereigntyRenderer=L.svg({pane:'sovereigntyPane'});
const groups={territory:L.layerGroup().addTo(map),kingdom:L.layerGroup().addTo(map),controlAreas:L.layerGroup().addTo(map),wartimeControl:L.layerGroup().addTo(map),garrisonHit:L.layerGroup().addTo(map),warVicinity:L.layerGroup().addTo(map),warReach:L.layerGroup().addTo(map),contestedZones:L.layerGroup().addTo(map),politicalRelations:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),candidate:L.layerGroup().addTo(map),claim:L.layerGroup().addTo(map),event:L.layerGroup().addTo(map),place:L.layerGroup().addTo(map),cluster:L.layerGroup().addTo(map),clusterExpanded:L.layerGroup().addTo(map),archaeologyReference:L.layerGroup().addTo(map),enslavementBands:L.layerGroup().addTo(map),hypotheses:L.layerGroup().addTo(map),eleventhCores:L.layerGroup().addTo(map),eleventhHits:L.layerGroup().addTo(map),eleventhAreas:L.layerGroup().addTo(map),invasionImpact:L.layerGroup().addTo(map),tenthExtraction:L.layerGroup().addTo(map),nineYearsWar:L.layerGroup().addTo(map),atlanticContact:L.layerGroup().addTo(map),chapter11ActionLinks:L.layerGroup().addTo(map),earlyRegionalImpact:L.layerGroup().addTo(map)};
const levelOf=(item)=>Math.max(1,Math.min(3,Number(item.significance?.level||1)));
const rankName={3:'重大事件',2:'区域事件',1:'补充事件'};
// Shared year gate for archive, map symbols and voyage tracks.
function occurredByYear(item,selectedYear){return Number.isFinite(Number(item?.year))&&Number(item.year)<=selectedYear;}
// Historical facts may be well sourced while modern geocoding is only approximate.
const isUncertain=item=>{
 const precision=String(item?.geo_precision||'').toLowerCase();
 return /regional|associated|representative|approximate|modern|unverified|reference|unknown|not[-_ ]?(?:historic|historical|exact|geocoded|measured|precise)/.test(precision)
  || /uncertain/i.test(String(item?.certainty||''));
};
const fallbackCodes={political:'POL',voyage:'EXP',colonial_control:'TER',war:'WAR',repression:'REP',enslavement:'SLV',slavery:'SLV',forced_labour:'LAB',wealth_flow:'ECO',economy:'ECO',displacement:'DIS',famine:'FAM',resistance:'RES',abolition:'ABO',independence:'IND',infrastructure:'INF',claim:'CLM',documentary:'DOC',status:'DOC'};
let iconCatalog=null;
const iconMeta=item=>{
 const code=item.icon_code||fallbackCodes[item.category]||'DOC';
 const record=iconCatalog?.categories?.find(x=>x.code===code);
 return {code,color:record?.color||'#c99569'};
};
const svgIcon=(item,klass='atlas-glyph')=>{
 const meta=iconMeta(item);
 return '<svg class="'+klass+'" viewBox="0 0 24 24" aria-hidden="true" style="color:'+escapeHTML(meta.color)+'"><use href="assets/atlas-icons.svg#'+escapeHTML(meta.code)+'"></use></svg>';
};
const iconHTML=(item,annualNew=false)=>'<div class="map-pin '+escapeHTML(item.category||'voyage')+' tier-'+levelOf(item)+(isUncertain(item)?' uncertain':'')+(annualNew?' atlas-new-this-year':'')+'" aria-label="'+escapeHTML(item.name||'历史记录')+' · '+escapeHTML(rankName[levelOf(item)])+(annualNew?' · 本年新增事件':'')+'">'+svgIcon(item)+(annualNew?'<span class="atlas-new-mark" aria-hidden="true">新</span>':'')+'</div>';
const hoverCard=(title,summary,item)=>'<strong>'+escapeHTML(title)+'</strong><div class="atlas-hover-summary">'+escapeHTML(String(summary||'').replace(/\s+/g,' ').slice(0,56))+'</div>'+(item?'<small>'+escapeHTML(rankName[levelOf(item)])+' · 点击查看详情</small>':'<small>航行方向示意 · 点击查看详情</small>');
const workspace=$('workspace');
const compactMapMedia=window.matchMedia('(max-width:980px)');
const isCompactMap=()=>compactMapMedia.matches;
if(isCompactMap()){
 workspace.classList.add('sidebar-collapsed');
 $('chapterCard').open=false;
}
function syncMobileEventsButton(){
 const button=$('mobileEventsToggle');
 if(!button)return;
 const open=!workspace.classList.contains('sidebar-collapsed');
 button.setAttribute('aria-expanded',String(open));
 button.setAttribute('aria-label',open?'关闭事件列表':'打开事件列表');
 button.textContent=open?'✕ 关闭事件':'☰ 事件';
}
syncMobileEventsButton();
function syncPanels(){
setTimeout(()=>map.invalidateSize({pan:false}),250);
}
function openPanel(which){
 // One readable sidebar at a time, including the desktop layout.
 // This prevents the historical dossier from obscuring the map or timeline.
 if(which==='dossier'){
  workspace.classList.add('sidebar-collapsed');
  workspace.classList.remove('dossier-collapsed');
 }else{
  workspace.classList.add('dossier-collapsed');
  workspace.classList.remove('sidebar-collapsed');
 }
 syncMobileEventsButton();syncPanels();
}
function togglePanel(which){
 workspace.classList.toggle(which==='sidebar'?'sidebar-collapsed':'dossier-collapsed');
 syncMobileEventsButton();syncPanels();
}
const categoryName={political:'王室授权',voyage:'航海行动',claim:'王室宣称',status:'研究结论'};
const categorySymbol=fallbackCodes;
let atlas=null;let atlasEarly=null;let atlasLater=null;let atlasFirstMerged=null;let atlasThird=null;let atlasFourth=null;let atlasFifth=null;let atlasSixth=null;let atlasSeventh=null;let atlasEighth=null;let atlasNinth=null;let atlasTenth=null;let atlasEleventh=null;let drakeCircumnavigation=null;let year=1497;
// Browsing the multi-century navigator never changes the verified year on the map.
// UI contract: two independent user-facing layers, all earlier internal gate IDs
// retained only for chronology, migration and backwards-compatible renderers.
// War garrisons, Scottish political background, occupation / contest / reach
// always belong to the 'territory' checkbox. Combat/voyage/claim pins and
// schematically routed voyages belong to 'events'. Never reset on year change.
function syncMapLayers(){
 const territory=$('mapLayerTerritory').checked,events=$('mapLayerEvents').checked;
 const gates={
  toggleTerritorialFootprints:territory,
  toggleControlAreas:territory,
  togglePoliticalRelations:territory,
  toggleKingdom:territory,
  toggleHypotheses:territory,
  toggleRoutes:events,
  toggleCandidates:events,
  toggleClaims:events,
  toggleEvents:events,
  toggleMinorEvents:false
 };
 for(const [id,checked] of Object.entries(gates))$(id).checked=checked;
 for(const id of ['mapLayerTerritory','mapLayerEvents']){
  const input=$(id);
  input.parentElement.classList.toggle('selected',input.checked);
  input.parentElement.setAttribute('aria-label',(id==='mapLayerTerritory'?'版图':'事件')+(input.checked?'已显示':'已隐藏'));
 }
 if(!events){focusedEventId=null;focusRequestToken++;}
 if(atlas){renderEventList();refreshHistoricalLayers();}
}
let chapterRegistry=null,browsingDecade=1490,lastPublishedYear=1549; let selected=''; let selectedItemYear=null; let timer=null;
let researchNotes={};const sourcesById=new Map();let geographicHypotheses=null;let geographicHypothesesThird=null;let frenchCityAreas=null;let politicalRelationAreas=null;let territorialFootprints=null;let militaryControlPoints=null;let warVicinityAreas=null;let occupiedZoneAreas=null;let contestedZoneAreas=null;let warReachAreas=null;let seventhControlSites=null;let eighthControlSites=null;let ninthControlSites=null;let tenthControlSites=null;let tenthInvasionImpactAreas=null;let tenthLandRaidAreas=null;let eleventhControlCores=null;let eleventhInfluenceAreas=null;let nineYearsWarImpact=null;let atlanticContactData=null;let chapter11ActionLinks=null;let earlyRegionalAreas=null;let followupRegionalAreas=null;let centuryViolenceAreas=null;let eighthSlaveCoastalAreas=null;let archaeologicalReferenceAreas=null;let sovereigntyReferenceAreas=[];
// Resolve continuing political identities even when their first detailed entry is in a later chapter.
const findPlaceAcrossChapters=id=>[atlas,atlasFirstMerged,atlasEleventh,atlasTenth,atlasNinth,atlasEighth,atlasSeventh,atlasSixth,atlasFifth,atlasFourth,atlasThird,atlasLater,atlasEarly]
 .map(a=>a?.places?.find(p=>p.id===id)).find(Boolean);
let activeClusterKey=null,expandedPinned=false,clusterCloseTimer=null;
// Transient focus target; historical event coordinates remain immutable.
let focusedEventId=null,focusRequestToken=0;
let clusterObstacles=[];
const cancelClusterClose=()=>{if(clusterCloseTimer){clearTimeout(clusterCloseTimer);clusterCloseTimer=null}};
function closeCluster(){cancelClusterClose();activeClusterKey=null;expandedPinned=false;groups.clusterExpanded.clearLayers()}
function scheduleClusterClose(){cancelClusterClose();if(!expandedPinned)clusterCloseTimer=setTimeout(()=>{if(!expandedPinned)closeCluster()},480)}
let vectors={};
const infoDefault=$('dossierBody').innerHTML;
const earlyIntro=$('chapterIntro').textContent;
function setWarning(msg){let e=$('boundaryWarning');if(!e){e=document.createElement('div');e.id='boundaryWarning';e.className='map-warning';$('map').parentElement.appendChild(e)}e.textContent=msg;}
function hideWarning(){let e=$('boundaryWarning');if(e)e.remove();}
function listSources(ids,item){
 const refs=(ids||[]).map(id=>sourcesById.get(id)).filter(Boolean);
 const note=researchNotes[item?.id];
 if(!refs.length&&!note)return '';
 const fields=[
  ['史料背景',note?.context],
  ['历史影响',note?.impact],
  ['地理与权力关系',note?.geography],
  ['财政核算',note?.accounting]

 ].filter(x=>x[1]);
 const questions=(note?.archive_questions||[]).map(text=>'<li>'+escapeHTML(text)+'</li>').join('');
 const accountingNames={crown_reward_expenditure:'王室远航奖励',royal_ship_acquisition_bounty:'购船补助',royal_grant_expenditure:'王室拨款',royal_pension:'王室年金'};
 const sums=(note?.economic_records||[]).map(row=>{
  const time=row.year||[row.year_from,row.year_to].filter(Boolean).join('—')||'相关账期';
  const parts=[row.amount!=null?String(row.amount)+' '+(row.currency==='GBP'?'英镑':row.currency||''):'',
   row.accounting_category?(accountingNames[row.accounting_category]||row.accounting_category):'',
   row.payer?'付款方：'+row.payer:'',
   row.recipient?'收款方：'+row.recipient:'',
   '年份：'+time].filter(Boolean);
  return '<li>'+escapeHTML(parts.join('；'))+'</li>';
 }).join('');
 return '<details class="source-details"><summary>历史文献与详细考证 <span>▾</span></summary>'+
   '<div class="research-body">'+fields.map(([head,text])=>'<h3>'+escapeHTML(head)+'</h3><p>'+escapeHTML(text)+'</p>').join('')+
   (questions?'<h3>待进一步核对的档案</h3><ul>'+questions+'</ul>':'')+
   (sums?'<h3>原始账目字段</h3><ul class="accounting-list">'+sums+'</ul>':'')+
   '</div>'+
   (refs.length?'<div class="mini-heading">文献出处 · '+refs.length+'项</div><div class="source-list">'+refs.map(x=>'<a class="source-link" href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(x.publisher)+' · '+escapeHTML(x.title)+' ↗</a>').join('')+'</div>':'')+'</details>';
}
function openDossier(item,typ){
 if(!item)return;
 const candidate=typ==='candidate',route=typ==='route',place=typ==='place';
 selected=item.id;
 selectedItemYear=typ==='event'&&Number.isFinite(Number(item.year))?Number(item.year):null;
 const date=place?'历史政治关系':candidate?'1497年':route?item.year+'年':item.date_label;
 const caption=place?'地理与政治':candidate?'候选登陆地点':route?'航海':categoryName[item.category]||'历史事件';
 const description=candidate?item.note:route?item.note:item.description;
 const storyChild=typ==='event'&&Boolean(window.HistoryStories?.isLinkedEvent?.(item,typ));

 const canMapFocus=typ==='event'&&canLocateEvent(item,year);
 const locateAction=typ==='event'?
  (storyChild?
   (canMapFocus?'<div class="dossier-map-action"><button type="button" data-locate-event>◎ 地图定位</button></div>':''):
   '<div class="dossier-map-action"><button type="button" data-locate-event'+
   (canMapFocus?'':' disabled')+'>◎ 在地图上定位</button><small>'+
   (canMapFocus?'保留当前年份与缩放；手机上返回地图查看':'该事件暂无可定位地点，或尚未发生')+
   '</small></div>'):'';
 $('dossierBody').innerHTML='<div class="dossier-kicker">'+escapeHTML(caption)+' · '+escapeHTML(date)+'</div><h2>'+escapeHTML(item.name)+'</h2><p>'+escapeHTML(description)+'</p>'+
  (window.HistoryStories?.eventLinkMarkup?.(item,typ)||'')+locateAction+
  (storyChild?'':listSources(item.source_ids,item));
 openPanel('dossier');
 window.HistoryStories?.onEventOpened?.(item,typ);
 const locateButton=$('dossierBody').querySelector('[data-locate-event]');
 if(locateButton&&!locateButton.disabled)
  locateButton.addEventListener('click',()=>focusEventFromSidebar(item,{revealMap:true}));
 document.querySelectorAll('.event-item').forEach(el=>el.classList.toggle('selected',el.dataset.eid===selected));
}
// Modern heritage scheduled boundaries were fetched from the official HES ArcGIS service.
// NEVER treat these protected legal extents as 1547 English fort walls or occupied territory.
function openArchaeologyReference(feature){
 const p=feature.properties||{};
 selected='';selectedItemYear=null;
 const text='Historic Environment Scotland 登记的现代古迹保护区范围，包含多期军事考古遗存。';
 $('dossierBody').innerHTML='<div class="dossier-kicker">现代考古遗址地理参考 · '+year+'年</div>'+
  '<h2>'+escapeHTML(p.public_name||p.title_from_hes||'法定古迹参考区')+'</h2>'+
  '<p>Historic Environment Scotland 官方保护区的现代外廓，用于辅助理解历史堡垒遗址的位置。</p>'+
  '<details class="source-details"><summary>历史文献与详细考证 <span>▾</span></summary>'+
  '<div class="research-body"><h3>地图几何性质</h3><p>'+escapeHTML(text)+'</p>'+
  '<h3>军堡建造与分期</h3><p>'+escapeHTML(p.phase_reminder||'需区分后续改建与16世纪城堡分期。')+'</p>'+
  '<h3>官方地理资料</h3><p>'+escapeHTML((p.hes_precision||'HES考古登记')+'；'+(p.hes_accuracy||''))+'</p>'+
  '</div>'+
  '<div class="source-list"><a class="source-link" href="'+escapeHTML(p.designation_source_url)+'" target="_blank" rel="noopener noreferrer">Historic Environment Scotland 官方古迹档案 ↗</a>'+
  '<a class="source-link" href="'+escapeHTML(p.data_source_url)+'" target="_blank" rel="noopener noreferrer">HES 官方GIS数据接口 ↗</a></div></details>';
 openPanel('dossier');
}
function renderArchaeologyReferences(){
 groups.archaeologyReference.clearLayers();
 if(year<1547||year>1549||!archaeologicalReferenceAreas||!$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const display=archaeologicalReferenceAreas.features.filter(f=>{
  const p=f.properties||{};
  return f.geometry?.type==='Polygon'&&p.start_year<=year&&p.end_year>=year&&
   p.visual_role==='modern_archaeology_legal_extent_reference_dashed'&&
   p.historical_boundary_confirmed===false&&p.fill_authorized===false&&p.area_sqkm===null;
 });
 L.geoJSON({type:'FeatureCollection',features:display},{
  renderer:archaeologyReferenceRenderer,pane:'archaeologyReferencePane',interactive:true,bubblingMouseEvents:false,
  style:()=>({color:'#d7e3dd',weight:2.4,opacity:.98,dashArray:'2 5',fill:false,fillOpacity:0,
   className:'atlas-hes-modern-archaeology-outline'}),
  onEachFeature:(feature,layer)=>{
   layer.bindTooltip('<strong>'+escapeHTML(feature.properties.public_name)+'</strong><div class="atlas-hover-summary">HES 现代古迹保护区</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]});
   layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openArchaeologyReference(feature)});
  }
 }).addTo(groups.archaeologyReference);
}
function openHypothesis(feature){
 const p=feature.properties||{};
 const title=p.public_title||'推定地理范围';
 const url=p.source_path||'research/hypotheses/1500/README.md';
 selectedItemYear=null;
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史地理 · 虚线推定</div><h2>'+escapeHTML(title)+'</h2><p>'+escapeHTML(p.public_summary||'根据历史记载的地点绘制的范围示意。')+'</p>'+
 '<details class="source-details"><summary>历史文献与详细考证 <span>▾</span></summary>'+
 '<div class="research-body"><h3>史料与制图</h3><p>'+escapeHTML(p.method||'依据史料中的地点绘制。')+'</p></div>'+
 '<a class="source-link" href="'+escapeHTML(url)+'" target="_blank" rel="noopener">查看原始地理研究 ↗</a></details>';
 openPanel('dossier');
}
// All clickable polygon types share a source-aware map territory dossier.
// Government identity is a dated property of historic evidence, not a map style.
const historicControllerPalette={
 english_crown:{stroke:'#9e6cde',areaFill:'#9e6cde',cityFill:'#9867dd',cityHalo:'#a57de3'},
 french_crown:{stroke:'#65c9bc',areaFill:'#357f76',cityFill:'#49b6ad',cityHalo:'#93e5d7'}
};
function controllerAtYear(properties,selectedYear){
 const intervals=properties?.controller_periods;
 if(!Array.isArray(intervals))return null;
 return intervals.find(period=>Number.isInteger(period.start_year)&&Number.isInteger(period.end_year)
  &&period.start_year<=selectedYear&&selectedYear<=period.end_year)||null;
}
// Transition records contain later history for scholarly provenance, but the
// public year-end map must not reveal a future conquest in early-year tooltips.
function historicAreaDescription(properties,selectedYear){
 const periods=properties?.controller_periods||[];
 const controller=controllerAtYear(properties,selectedYear);
 if(!controller||periods.length<2)
  return properties?.summary_zh||properties?.history_description||properties?.description||'该地区的历史状态按所选年份显示。';
 const siteEnvelope=properties?.geometry_role==='attested_settlement_envelope_not_surveyed_border';
 return '所选年份由'+controller.controller_zh+'治理。'+(siteEnvelope?
  '外缘依据史料地名概略描绘，并非当年的实测行政或军事疆界。':
  '城市圆形符号仅用于标记具名地点，不代表实测城墙或统治面积。');
}
function openTerritoryDossier(feature,kind='historic'){
 const p=feature.properties||{},restoration=kind==='restoration',occupied=kind==='occupied',contested=kind==='contested',warReach=kind==='war-reach',invasionImpact=kind==='invasion-impact',landDispossession=kind==='land-dispossession',nineYearsWar=kind==='nine-years-war',atlanticContact=kind==='atlantic-contact',linkedAction=kind==='linked-action';
 const controller=kind==='historic'?controllerAtYear(p,year):null;
 const label=kind==='indigenous-encounter'?'原住民接触与抵抗 · 无占领':kind==='rebellion-conflict'?'起义军攻防与王室军事回应 · 概略范围':kind==='domestic-repression'?'王室国内军事镇压 · 概略范围':kind==='colonial-coercion'?'殖民军需与强制征赋 · 概略范围':linkedAction?(p.label_type||'有据军事行动关系线'):atlanticContact?(p.label_type||'大西洋贸易与武装行动地理参考'):nineYearsWar?(p.label_type||'九年战争及爱尔兰抵抗影响区'):landDispossession?'殖民土地没收与庄园政策涉及区':restoration?'法军围攻收复及英国撤军地理说明':invasionImpact?'英军入侵影响区':warReach?'有据军事行动方向示意':occupied?'英军驻地附近概略控制区':contested?'交战与争夺区':'历史政治地理';
 const description=controller?historicAreaDescription(p,year):(p.summary_zh||p.history_description||p.description||p.annotation||'该地区的历史状态按所选年份显示。');
 const period=p.start_year!=null?(p.start_year+(p.end_year!=null?'—'+p.end_year:p.ongoing_at_atlas_end?'起（至1599年地图研究范围）':p.observed_through_year!=null?'—'+p.observed_through_year:''))+'年':year+'年';

 const parties=p.controller_zh||p.actor||(contested?(p.contenders_zh||[]).join('、'):'');
 const relatedPlaces=(p.related_place_ids||[]).map(id=>findPlaceAcrossChapters(id)).filter(Boolean);
 const relatedEvents=(p.related_event_ids||[]).map(id=>
  [atlas,atlasEleventh,atlasTenth,atlasNinth,atlasEighth,atlasSeventh,atlasSixth,atlasFifth,atlasFourth,atlasThird,atlasLater,atlasEarly].map(x=>x?.events?.find(e=>e.id===id)).find(Boolean))
  .filter(e=>e&&occurredByYear(e,year)); // Never expose later wartime events in an earlier year's territorial dossier.
 selected='';selectedItemYear=null;
 const row=(key,value)=>value?'<div class="zone-dossier-row"><span>'+escapeHTML(key)+'</span><strong>'+escapeHTML(value)+'</strong></div>':'';
 $('dossierBody').innerHTML='<div class="dossier-kicker">'+escapeHTML(label)+' · '+year+'年</div>'+
  '<h2>'+escapeHTML(p.name||feature.id||'历史领土概况')+'</h2><p>'+escapeHTML(description)+'</p>'+
  '<div class="zone-dossier-facts">'+row('历史时段',period)+row('当年治理主体',controller?.controller_zh)+row(atlanticContact?'参与主体':'相关军事方',parties)+
  ''+'</div>'+
  (relatedPlaces.length?'<h3 class="zone-links-heading">关联据点</h3><div class="zone-related">'+relatedPlaces.map((pl,i)=>
   '<button type="button" class="zone-record-link" data-zone-place="'+i+'">'+escapeHTML(pl.name)+'</button>').join('')+'</div>':'')+
  (relatedEvents.length?'<h3 class="zone-links-heading">相关历史事件</h3><div class="zone-related">'+relatedEvents.map((ev,i)=>
   '<button type="button" class="zone-record-link" data-zone-event="'+i+'">'+escapeHTML(ev.year+'年 · '+ev.name)+'</button>').join('')+'</div>':'')+
  listSources(p.source_ids||[],{id:p.id||feature.id})+
  ((p.source_urls||[]).filter(u=>/^https:\/\//.test(u)&&!(p.source_ids||[]).some(id=>sourcesById.get(id)?.url===u)).length?
   '<div class="zone-source-links"><h3 class="zone-links-heading">补充资料</h3>'+
   [...new Set(p.source_urls.filter(u=>/^https:\/\//.test(u)&&!(p.source_ids||[]).some(id=>sourcesById.get(id)?.url===u)))].map(url=>
    '<a class="source-link" href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">阅读 ↗</a>').join('')+'</div>':'');
 openPanel('dossier');
 $('dossierBody').querySelectorAll('[data-zone-place]').forEach(n=>n.addEventListener('click',()=>openDossier(relatedPlaces[Number(n.dataset.zonePlace)],'place')));
 $('dossierBody').querySelectorAll('[data-zone-event]').forEach(n=>n.addEventListener('click',()=>openDossier(relatedEvents[Number(n.dataset.zoneEvent)],'event')));
}
function openCollection(items,title){
 if(!items.length)return;
 const choices=items.slice().sort((a,b)=>Number(b.item.significance?.level||1)-Number(a.item.significance?.level||1)||Number(a.item.year||0)-Number(b.item.year||0));
 $('dossierBody').innerHTML='<div class="dossier-kicker">同一地区的历史记录</div><h2>'+escapeHTML(title||'附近事件')+'</h2><div class="cluster-list">'+choices.map((x,i)=>'<button type="button" class="cluster-entry" data-record="'+i+'"><span class="cluster-entry-icon">'+svgIcon(x.item,'atlas-list-icon')+'</span><span><small>'+escapeHTML(x.item.date_label||'持续状态')+'</small><strong>'+escapeHTML(x.item.name)+'</strong></span><span class="cluster-entry-arrow">›</span></button>').join('')+'</div>';
 openPanel('dossier');
 $('dossierBody').querySelectorAll('.cluster-entry').forEach(btn=>btn.addEventListener('click',()=>{const x=choices[Number(btn.dataset.record)];openDossier(x.item,x.type)}));
}
function resetDossier(){window.HistoryStories?.onReset?.();selected='';selectedItemYear=null;focusedEventId=null;focusRequestToken++;$('dossierBody').innerHTML=infoDefault;document.querySelectorAll('.event-item').forEach(n=>n.classList.remove('selected'));workspace.classList.add('dossier-collapsed');if(!isCompactMap())workspace.classList.remove('sidebar-collapsed');syncMobileEventsButton();syncPanels();if(atlas)renderPoints()}

function isNewEventThisYear(item){return item&&item.category!=='status'&&Number(item.year)===year;}
let eventListClickTimer=null;
function renderEventList(){
 if(eventListClickTimer!==null){clearTimeout(eventListClickTimer);eventListClickTimer=null;}
 // Map and default sidebar reveal history at or before the selected year.
 // A deliberate archival switch allows browsing the full chapter without changing time.
 const fullArchive=$('showFullChapterArchive').checked;
 const events=atlas.events.filter(e=>(fullArchive||occurredByYear(e,year)))
  .sort((a,b)=>Number(isNewEventThisYear(b))-Number(isNewEventThisYear(a))||
    a.year-b.year||levelOf(b)-levelOf(a)||a.name.localeCompare(b.name,'zh'));
 const currentEvents=atlas.events.filter(isNewEventThisYear);
 const locatable=currentEvents.filter(e=>canLocateEvent(e,year)).length;
 $('eventCount').textContent=events.length+'项';
 const hint=$('yearArrivalSummary');
 if(hint){
  hint.textContent=currentEvents.length?
   '本年新增 '+currentEvents.length+' 项'+(locatable<currentEvents.length?' · '+locatable+' 项可定位':' · 地图金色标记'):
   '本年无新增事件记录';
  hint.classList.toggle('none',!currentEvents.length);
 }
 const mapHint=$('yearArrivalMapCount');
 if(mapHint)mapHint.textContent=currentEvents.length?'本年新事件 '+currentEvents.length+(!$('mapLayerEvents').checked?' · 事件图层已关闭':locatable?' · 金色「新」标记':' · 无可靠地图位置'):'本年无新增事件记录';
 $('eventList').innerHTML=events.map(e=>'<button type="button" data-tier="'+levelOf(e)+'" data-eid="'+escapeHTML(e.id)+'" class="event-item '+(isNewEventThisYear(e)?'event-new-this-year ':'')+(e.id===selected?'selected':'')+(e.year>year?' event-upcoming':'')+'" title="'+escapeHTML(Number.isFinite(e.lat)&&Number.isFinite(e.lng)?'双击定位地图（保持当前缩放）':'暂无可靠地图坐标')+'"><span class="event-icon">'+svgIcon(e,'atlas-list-icon')+'</span><span><small>'+escapeHTML(e.date_label)+(e.year>year?' · 档案预览':'')+'</small><strong>'+escapeHTML(e.name)+(isNewEventThisYear(e)?' <span class="year-arrival-tag">本年新</span>':'')+(levelOf(e)===3?' <span class="priority-tag">关键</span>':'')+'</strong></span></button>').join('');
 $('eventList').querySelectorAll('.event-item').forEach(node=>{
  node.addEventListener('click',ev=>{
   // A double-click must complete before the first click hides its target.
   if(eventListClickTimer!==null){clearTimeout(eventListClickTimer);eventListClickTimer=null;}
   if(ev.detail>1)return;
   const item=atlas.events.find(e=>e.id===node.dataset.eid);
   eventListClickTimer=setTimeout(()=>{
    eventListClickTimer=null;
    if(item&&atlas.events.some(e=>e.id===item.id))openDossier(item,'event');
   },290);
  });
  node.addEventListener('dblclick',ev=>{
   ev.preventDefault();
   if(eventListClickTimer!==null){clearTimeout(eventListClickTimer);eventListClickTimer=null;}
   focusEventFromSidebar(atlas.events.find(e=>e.id===node.dataset.eid));
  });
 });
}
// No map movement without a valid and already occurred source location.
function canLocateEvent(item,atYear){
 return Boolean(item&&occurredByYear(item,atYear)&&
  Number.isFinite(item.lat)&&Number.isFinite(item.lng)&&
  Math.abs(item.lat)<=90&&Math.abs(item.lng)<=180);
}
function focusEventFromSidebar(item){
 const options=arguments[1]||{};
 if(!item)return;
 if(!options.keepDossier)openDossier(item,'event');
 focusRequestToken++;
 focusedEventId=null;
 if(!canLocateEvent(item,year)){
  const note=!occurredByYear(item,year)?'请先将时间轴移至事件发生年份。':'此事件位置尚未核实，无法地图定位。';
  if(!options.keepDossier)$('dossierBody').insertAdjacentHTML('beforeend','<p class="atlas-location-note">'+escapeHTML(note)+'</p>');
  renderPoints();
  return;
 }
 stopPlay();
 focusedEventId=item.id;
 if(options.revealMap&&isCompactMap()){
  workspace.classList.add('dossier-collapsed','sidebar-collapsed');
  syncMobileEventsButton();syncPanels();
 }
 const token=focusRequestToken,position=[item.lat,item.lng];
 setTimeout(()=>{
  if(token!==focusRequestToken||focusedEventId!==item.id||!canLocateEvent(item,year))return;
  // Wait for dossier layout and then pan; never call flyTo, setZoom or change year.
  map.invalidateSize({pan:false});
  map.stop();
  map.once('moveend',()=>{
   if(token===focusRequestToken&&focusedEventId===item.id)renderPoints();
  });
  map.panTo(position,{animate:true,duration:0.9,easeLinearity:0.22});
  // Preserve smooth motion; if a remote jump is interrupted by layout/tile races,
  // settle on the requested historical event without changing zoom or the selected year.
  setTimeout(()=>{
   if(token!==focusRequestToken||focusedEventId!==item.id||!canLocateEvent(item,year))return;
   if(Math.abs(map.getCenter().lat-position[0])>0.35||Math.abs(map.getCenter().lng-position[1])>0.35){
    map.panTo(position,{animate:false});renderPoints();
   }
  },1600);
  renderPoints();
 },300);
}
function expandCluster(group,pin=false){
 // Expand only one group; never paint a shared opaque background over the map.
 const key=group.items.map(x=>x.item.id).sort().join('|');
 cancelClusterClose();
 if(activeClusterKey===key&&expandedPinned&&pin){closeCluster();return}
 const wasSame=activeClusterKey===key;
 activeClusterKey=key;
 expandedPinned=Boolean(pin||(wasSame&&expandedPinned));
 groups.clusterExpanded.clearLayers();
 const items=group.items,count=items.length;
 const pt=map.latLngToContainerPoint(group.latlng),size=map.getSize();
 const spacing=34,diameter=28,margin=14;
 const otherPoints=clusterObstacles.filter(p=>p.key!==key);
 const layouts=[];
 const widths=[Math.min(count,5),Math.min(count,4),Math.min(count,3)];
 for(const cols of [...new Set(widths)]){
  const rows=Math.ceil(count/cols),w=(cols-1)*spacing,h=(rows-1)*spacing;
  for(const side of ['right','above','left','below']){
   const x=side==='right'?pt.x+54:side==='left'?pt.x-54-w:pt.x-w/2;
   const y=side==='above'?pt.y-53-h:side==='below'?pt.y+54:pt.y-h/2;
   const positions=items.map((_,i)=>({x:x+(i%cols)*spacing,y:y+Math.floor(i/cols)*spacing}));
   let overflow=0,occlusion=0;
   for(const p of positions){
    overflow+=Math.max(0,margin+diameter/2-p.x)+Math.max(0,p.x+diameter/2-(size.x-margin));
    overflow+=Math.max(0,margin+diameter/2-p.y)+Math.max(0,p.y+diameter/2-(size.y-margin));
    for(const o of otherPoints){
     const gap=Math.hypot(p.x-o.x,p.y-o.y);
     if(gap<37)occlusion+=(37-gap)*(37-gap);
    }
    // Keep the parent hub itself unobstructed.
    const fromAnchor=Math.hypot(p.x-pt.x,p.y-pt.y);
    if(fromAnchor<44)occlusion+=(44-fromAnchor)*(44-fromAnchor);
   }
   // Prefer the sketch's right-side group when positions are comparably clear.
   const preference={right:0,above:36,left:55,below:75}[side];
   layouts.push({positions,score:overflow*250+occlusion*5+preference+rows*8,side});
  }
 }
 layouts.sort((a,b)=>a.score-b.score);
 const choice=layouts[0];
 // Positions are transient screen offsets, not modifications to historical coordinates.
 const coords=choice.positions;
 if(coords.length){
  L.polyline([group.latlng,map.containerPointToLatLng(L.point(coords[0].x,coords[0].y))],
    {color:'#d6ae87',weight:1,opacity:.35,interactive:false,dashArray:'2 6'}).addTo(groups.clusterExpanded);
 }
 coords.forEach((pos,i)=>{
  const record=items[i],item=record.item,d=27;
  const icon=L.divIcon({className:'atlas-flyout-icon'+(item.id===focusedEventId?' atlas-target-marker':''),html:'<div class="expanded-event">'+iconHTML(item,record.type==='event'&&isNewEventThisYear(item))+'</div>',iconSize:[d,d],iconAnchor:[d/2,d/2]});
  const marker=L.marker(map.containerPointToLatLng(L.point(pos.x,pos.y)),{icon,zIndexOffset:1800+i,bubblingMouseEvents:false})
   .bindTooltip(hoverCard(item.name,item.short_description||item.description,item),
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[14,0]})
   .on('mouseover',cancelClusterClose)
   .on('mouseout',scheduleClusterClose)
   .on('click',()=>{expandedPinned=true;cancelClusterClose();marker.closeTooltip();openDossier(item,record.type)});
  marker.addTo(groups.clusterExpanded);
 });
}
function renderPoints(){
 // Screen-space regrouping restores compact anchor markers on year/zoom/layer changes.
 closeCluster();
 for(const name of ['event','candidate','routes','claim','place','cluster'])groups[name].clearLayers();
 const shown=[];
 const showAll=map.getZoom()>=6||$('toggleMinorEvents').checked;
 if($('toggleEvents').checked||focusedEventId){
  for(const e of atlas.events){
   if(!occurredByYear(e,year))continue;
   if(!Number.isFinite(e.lat)||!Number.isFinite(e.lng))continue;
   if(!$('toggleEvents').checked&&e.id!==focusedEventId)continue;
   if(e.category==='status'&&e.id!==focusedEventId)continue;
   if(e.category==='claim'&&!$('toggleClaims').checked&&e.id!==focusedEventId)continue;
   if(levelOf(e)===1&&!showAll&&e.id!==focusedEventId&&!e.map_priority&&!isNewEventThisYear(e))continue;
   shown.push({item:e,type:'event',lat:e.lat,lng:e.lng});
  }
 }
 if($('toggleKingdom').checked&&year>=1500&&map.getZoom()>=6){
  for(const q of atlas.places||[]){
   if(q.render_as_event_only||q.render_as_control_core_only)continue;
   const activeMilitaryCore=$('toggleControlAreas').checked&&((year>=1540&&militaryControlPoints?.features?.some(f=>f.properties?.stable_id===q.id&&year>=f.properties.year_end_start&&year<=f.properties.year_end_stop))||(year>=1550&&seventhControlSites?.features?.some(f=>f.properties?.stable_id===q.id&&year>=f.properties.start_year&&year<=f.properties.end_year)));
   const alreadyDrawnAsArea=Boolean(activeMilitaryCore)||footprintEnabledFor(q.id)||($('togglePoliticalRelations').checked&&politicalRelationAreas?.features?.some(f=>f.properties?.source_place_id===q.id&&year>=f.properties.start_year&&year<=f.properties.observed_through_year))||($('toggleControlAreas').checked&&frenchCityAreas?.features?.some(f=>f.properties?.source_place_id===q.id&&year>=f.properties.start_year&&year<=f.properties.observed_through_year));
   if(alreadyDrawnAsArea)continue;
   const start=q.start_year??1500;
   if(year<start||(q.end_year!=null&&year>q.end_year)||(q.observed_through_year!=null&&year>q.observed_through_year))continue;
   shown.push({item:{...q,significance:{level:2}},type:'place',lat:q.lat,lng:q.lng});
  }
 }
 // Aggregate by screen distance, without changing the historically stored coordinates.
 const nearby=[],cells=new Map(),cellSize=32;
 // Spatial hashing limits grouping checks to neighboring 32-pixel cells.
 for(const record of shown.sort((a,b)=>levelOf(b.item)-levelOf(a.item)||a.item.id.localeCompare(b.item.id))){
  const point=map.latLngToLayerPoint([record.lat,record.lng]);
  const gx=Math.floor(point.x/cellSize),gy=Math.floor(point.y/cellSize);
  let group=null,earliest=Infinity;
  for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)
   for(const g of cells.get((gx+dx)+','+(gy+dy))||[]){
    if(g.order<earliest&&Math.hypot(g.pt.x-point.x,g.pt.y-point.y)<32){group=g;earliest=g.order}
   }
  if(!group){
   group={pt:point,latlng:map.layerPointToLatLng(point),items:[],order:nearby.length};
   nearby.push(group);
   const key=gx+','+gy;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(group);
  }
  group.items.push(record);
 }
 // Obstacles contain all visible group hubs and singleton icons in container pixels.
 clusterObstacles=nearby.map(g=>{
  const at=map.latLngToContainerPoint(g.latlng);
  return {x:at.x,y:at.y,key:g.items.map(x=>x.item.id).sort().join('|')};
 });
 for(const g of nearby){
  if(g.items.length===1){
   const record=g.items[0],item=record.item;
   const d=levelOf(item)===3?30:levelOf(item)===2?27:23;
   const ico=L.divIcon({className:item.id===focusedEventId?'atlas-target-marker':'',html:iconHTML(item,record.type==='event'&&isNewEventThisYear(item)),iconSize:[d,d],iconAnchor:[d/2,d/2]});
   L.marker([record.lat,record.lng],{icon:ico,zIndexOffset:500+levelOf(item)*60})
    .bindTooltip(hoverCard(item.name,item.short_description||item.description,item),{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
    .on('click',()=>openDossier(item,record.type)).addTo(groups.cluster);
   continue;
  }
  const important=g.items.some(x=>levelOf(x.item)===3);
  const newCount=g.items.filter(x=>x.type==='event'&&isNewEventThisYear(x.item)).length;
  const containsUncertain=g.items.some(x=>isUncertain(x.item));
  // The aggregation of a new event with a schematic place must retain its
  // dotted uncertainty cue. Mixed hubs are not surveyed historical sites.
  const ico=L.divIcon({className:'',html:'<div class="atlas-aggregate'+(important?' key':'')+(containsUncertain?' atlas-cluster-uncertain':'')+(newCount?' atlas-cluster-new-this-year':'')+(g.items.some(x=>x.item.id===focusedEventId)?' atlas-target-aggregate':'')+'" aria-label="'+g.items.length+'项历史记录'+(newCount?'，其中本年新增'+newCount+'项':'')+(containsUncertain?'，包含大致位置参考':'')+'"><strong>'+g.items.length+'</strong>'+(newCount?'<span class="atlas-cluster-new-count" aria-hidden="true">+'+newCount+'新</span>':'')+'</div>',iconSize:[36,36],iconAnchor:[18,18]});
  L.marker(g.latlng,{icon:ico,zIndexOffset:950})
   .on('mouseover',()=>{if(!expandedPinned||activeClusterKey===g.items.map(x=>x.item.id).sort().join('|'))expandCluster(g)})
   .on('mouseout',scheduleClusterClose)
   .on('click',()=>expandCluster(g,true))
   .addTo(groups.cluster);
 }
 if(atlas.candidates&&year<=1499){
  for(const c of atlas.candidates){
   const ico=L.divIcon({className:'',html:'<div class="candidate-pin"></div>',iconSize:[16,16],iconAnchor:[8,8]});
   L.marker([c.lat,c.lng],{icon:ico})
    .bindTooltip(hoverCard(c.name,c.note),{direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
    .on('click',()=>openDossier(c,'candidate')).addTo(groups.candidate);
  }
  if($('toggleClaims').checked){
   L.circleMarker([48.8,-57.2],{radius:23,color:'#b98540',weight:2,dashArray:'4 5',fill:false})
    .bindTooltip(hoverCard('1497年王室声索','卡博特远航后产生的英王海外权利主张。'),{className:'atlas-hover'})
    .on('click',()=>openDossier(atlas.events.find(e=>e.id==='landfall-1497'),'event')).addTo(groups.claim);
  }
 }
 // The circumnavigation is one continuous, separately sourced 1577–1580 voyage.
 // Preserve all published episode records but avoid drawing their four older,
 // disconnected Pacific/Chile direction links twice when the new itinerary loads.
 const mapRoutes=(atlas.routes||[]).filter(r=>!(drakeCircumnavigation&&
  year>=1577&&year<=1580&&drakeCircumnavigation.duplicate_old_route_ids.includes(r.id)));
 if(drakeCircumnavigation&&year>=1577&&year<=1580)mapRoutes.push(...drakeCircumnavigation.routes);
 for(const r of mapRoutes){
  if(!occurredByYear(r,year)||!$('toggleRoutes').checked)continue;
  if(Array.isArray(r.valid_years)&&!r.valid_years.includes(year))continue;
  if(!Array.isArray(r.coords)||r.coords.length<2)continue;
  const coastal=r.route_kind==='coastal-commercial-reference-schematic';
  const humanTransport=r.route_kind==='schematic-human-transport-sea-corridor'||r.route_kind==='schematic-forced-person-transport';
  const schematic=r.route_kind==='documented-endpoints-connection'||/schematic/.test(String(r.route_kind||''));
  const baseColor=humanTransport?'#c96369':coastal?'#ecc389':schematic?'#dfbb87':r.year===1497?'#d4a47d':'#97a9bc';
  const style={renderer:voyageRenderer,pane:'voyagePane',
   color:baseColor,weight:coastal?4.4:schematic?2.2:2.7,
   dashArray:coastal?'2 11':schematic?'3 10':'8 9',opacity:coastal?.7:.92,
   className:coastal?'atlas-merchant-coastline':'atlas-voyage-schematic'};
  const routeGeometry=r.voyage_id==='drake-circumnavigation-1577-1580'
   ? window.AtlasVoyageGeometry.routeGeometryForWorldWrap(r)
   : r.segments&&r.segments.length?r.segments:r.coords;
   // A faint unbroken foundation joins historical endpoints without implying GPS.
   if(schematic)L.polyline(routeGeometry,{renderer:voyageRenderer,pane:'voyagePane',
    color:baseColor,weight:2.4,opacity:.48,interactive:false,
    className:'atlas-voyage-continuity'}).addTo(groups.routes);
  const line=L.polyline(routeGeometry,{...style,interactive:false}).addTo(groups.routes);
  // Historical territory polygons cannot intercept this upper SVG hit stroke.
  L.polyline(routeGeometry,{renderer:voyageRenderer,pane:'voyagePane',
   color:baseColor,weight:22,opacity:.025,interactive:true,
   className:'atlas-voyage-hit'})
   .bindTooltip(hoverCard(r.name,r.note),{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('mouseover',()=>line.setStyle({weight:coastal?5.6:schematic?3.2:4}))
   .on('mouseout',()=>line.setStyle({weight:style.weight}))
   .on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openDossier(r,'route')})
   .addTo(groups.routes);
 }
 updateVisibility();
 // Expand a dense group so the exact target glyph, not only the hub, is highlighted.
 const targetGroup=focusedEventId&&nearby.find(g=>g.items.some(x=>x.item.id===focusedEventId));
 if(targetGroup&&targetGroup.items.length>1)expandCluster(targetGroup,true);
}
function ensureTerritorialPatterns(){
 // Geographic polygons are rendered with SVG so political classification can use true hatching.
 const root=territoryRenderer._container;
 if(!root||!root.ownerDocument||root.querySelector('#atlas-hatch-manx'))return;
 const ns='http://www.w3.org/2000/svg',doc=root.ownerDocument;
 let defs=root.querySelector('defs');
 if(!defs){defs=doc.createElementNS(ns,'defs');root.insertBefore(defs,root.firstChild)}
 for(const [id,color,cross] of [
  ['atlas-hatch-manx','#cdb18b',true],
  ['atlas-hatch-crown','#cfb0f2',false]
 ]){
  const pattern=doc.createElementNS(ns,'pattern');
  for(const [k,v] of Object.entries({id,width:'10',height:'10',patternUnits:'userSpaceOnUse'}))pattern.setAttribute(k,v);
  const bg=doc.createElementNS(ns,'rect');bg.setAttribute('width','10');bg.setAttribute('height','10');
  bg.setAttribute('fill',color);bg.setAttribute('fill-opacity','.27');pattern.appendChild(bg);
  const l=doc.createElementNS(ns,'path');l.setAttribute('d','M-2 10 L10 -2 M4 12 L12 4');
  l.setAttribute('stroke',color);l.setAttribute('stroke-width','1.7');l.setAttribute('opacity','.86');
  pattern.appendChild(l);
  if(cross){const c=doc.createElementNS(ns,'path');c.setAttribute('d','M-2 -2 L12 12');
   c.setAttribute('stroke',color);c.setAttribute('stroke-width','1.2');c.setAttribute('opacity','.68');pattern.appendChild(c)}
  defs.appendChild(pattern);
 }
}
function footprintEnabledFor(placeId){
 if(!$('toggleTerritorialFootprints').checked||!territorialFootprints)return false;
 return territorialFootprints.features.some(f=>f.properties?.source_place_id===placeId
 &&year>=f.properties.start_year&&year<=f.properties.observed_through_year
 &&(f.properties.display_group==='control'?$('toggleControlAreas').checked:
   f.properties.display_group==='political'?$('togglePoliticalRelations').checked:$('toggleHypotheses').checked));
}
function renderTerritories(){
 groups.territory.clearLayers();
 if(!territorialFootprints||!$('toggleTerritorialFootprints').checked)return;
 const selected=territorialFootprints.features.filter(f=>{
  const p=f.properties||{};
  if(year<p.start_year||year>p.observed_through_year)return false;
  return p.display_group==='control'?$('toggleControlAreas').checked:
    p.display_group==='political'?$('togglePoliticalRelations').checked:$('toggleHypotheses').checked;
 });
 if(!selected.length)return;
 const geo=L.geoJSON({type:'FeatureCollection',features:selected},{
  renderer:territoryRenderer,pane:'territoryPane',
  style:f=>{
   const p=f.properties,rel=p.relation_type;
   const research=p.display_group==='research';
   const siteEnvelope=p.geometry_role==='attested_settlement_envelope_not_surveyed_border';
   const controller=controllerAtYear(p,year);
   const palette=controller?historicControllerPalette[controller.controller_group]:null;
   const hatch=rel==='autonomous_lordship'?'atlas-hatch-manx':
     rel==='crown_dependency'?'atlas-hatch-crown':'';
   return {pane:'territoryPane',color:palette?.stroke||p.color||'#a78cdb',weight:siteEnvelope?3.8:research?2.7:2.3,
    opacity:1,dashArray:research?'7 6':siteEnvelope?'7 5':null,
    fillColor:palette?.areaFill||p.color||'#9871cc',fillOpacity:research?.12:siteEnvelope?.3:rel==='scottish_crown_territory'?.22:.26,
    className:hatch?'atlas-territory-'+(rel==='autonomous_lordship'?'manx':'crown'):'atlas-territory-solid'};
  },
  onEachFeature:(feature,layer)=>{
   const p=feature.properties||{};
   const rel=p.relation_type,klass=rel==='autonomous_lordship'?'atlas-territory-manx':rel==='crown_dependency'?'atlas-territory-crown':'atlas-territory-solid';
   layer.options.className=klass;
   const controller=controllerAtYear(p,year);
   const controllerLine=controller?'当年治理主体：'+controller.controller_zh+'。':'';
   layer.bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+escapeHTML(controllerLine+' '+historicAreaDescription(p,year))+'</div>',
      {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]});
   layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openTerritoryDossier(feature,'historic')});
  }
 }).addTo(groups.territory);
 ensureTerritorialPatterns();
}
function renderPoliticalRelationAreas(){
 groups.politicalRelations.clearLayers();
 if(!politicalRelationAreas||!$('togglePoliticalRelations').checked||year<1500)return;
 for(const f of politicalRelationAreas.features||[]){
  const p=f.properties||{},lnglat=f.geometry?.coordinates;
  if(f.geometry?.type!=='Point'||!lnglat||year<(p.start_year||1500)||year>(p.observed_through_year||1519)||footprintEnabledFor(p.source_place_id))continue;
  const center=[lnglat[1],lnglat[0]],color=p.stroke_color||'#b2a1d0';
  const radius=p.render_radius_px||19;
  const uid=String(f.id).replace(/[^a-z0-9]/gi,'-');
  // Crosshatch and diagonal hatch encode type of political relationship, not a measured island perimeter.
  // Political relationships use a compact fallback glyph, not a map-sized patterned disk.
  const stripe='<svg data-polity-id="'+escapeHTML(uid)+'" viewBox="0 0 44 44" width="26" height="26" xmlns="http://www.w3.org/2000/svg">'+
   '<defs><pattern id="pat-'+uid+'" width="8" height="8" patternUnits="userSpaceOnUse">'+
   '<path d="M-2 8 L8 -2 M2 10 L10 2" stroke="'+color+'" stroke-width="2" opacity=".8"/>'+
   (p.render_mode==='crosshatched_bounded_symbol'?'<path d="M-2 0 L8 10 M2 -2 L10 6" stroke="'+color+'" stroke-width="1.4" opacity=".65"/>':'')+
   '</pattern></defs>'+
   '<circle cx="22" cy="22" r="'+radius+'" fill="#10283e" fill-opacity=".67" stroke="'+color+'" stroke-width="2.8"/>'+
   '<circle cx="22" cy="22" r="'+(radius-2)+'" fill="'+(p.render_mode==='solid_bounded_symbol'||p.render_mode==='scottish_solid_symbol'?color:'url(#pat-'+uid+')')+'" fill-opacity="'+(p.render_mode==='solid_bounded_symbol'||p.render_mode==='scottish_solid_symbol'?'.52':'.85')+'"/>'+
   '</svg>';
  const icon=L.divIcon({className:'political-relation-symbol',html:stripe,iconSize:[26,26],iconAnchor:[13,13]});
  const place=findPlaceAcrossChapters(p.source_place_id);
  L.marker(center,{icon,pane:'controlAreaPane',zIndexOffset:0,bubblingMouseEvents:false})
   .bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+escapeHTML(p.annotation)+'</div>',
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
   .on('click',()=>{if(place)openDossier(place,'place');else openTerritoryDossier(f,'historic')})
   .addTo(groups.politicalRelations);
 }
}
function renderControlAreas(){
 groups.controlAreas.clearLayers();
 if(!frenchCityAreas||!$('toggleControlAreas').checked)return;
 for(const f of frenchCityAreas.features||[]){
  const p=f.properties||{};
  // Every selected year represents its year-end political snapshot.
  // An approximate district polygon must never hide a documented urban control core.
  if(year<(p.start_year||1497)||year>(p.observed_through_year||1519))continue;
  const coords=f.geometry?.coordinates;
  if(f.geometry?.type!=='Point'||!coords||coords.length!==2)continue;
  const center=[coords[1],coords[0]],zoom=map.getZoom();
  const isTournai=String(f.id).includes('tournai');
  const controller=controllerAtYear(p,year);
  const palette=controller?historicControllerPalette[controller.controller_group]:null;
  const mainColor=palette?.cityFill||(isTournai?'#c5a0f1':'#9867dd');
  const glowColor=palette?.cityHalo||(isTournai?'#e0bfff':'#a57de3');
  // City control is a sourced position, not a circular polygon of measured territory.
  const radius=Math.max(5.2,Math.min(8,5.6+Math.max(0,zoom-5)*.6));
  const core=L.circleMarker(center,{pane:'controlAreaPane',radius,
   color:glowColor,weight:2,opacity:1,fill:true,fillColor:mainColor,fillOpacity:.85,
   bubblingMouseEvents:false})
   .bindTooltip('<strong>'+escapeHTML(controller?p.draw_label+' · '+controller.controller_zh+'治理':p.name)+'</strong><div class="atlas-hover-summary">'+escapeHTML(historicAreaDescription(p,year))+'</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',()=>{
    const record=findPlaceAcrossChapters(p.source_place_id);
    // Source places may retain their Tudor-era text; show selected-year government.
    if(controller)openTerritoryDossier(f,'historic');
    else if(record)openDossier(record,'place');else openTerritoryDossier(f,'historic');
   }).addTo(groups.controlAreas);
  // Low-key geo-label shows which urban area changes, with no blocking background.
  if(zoom>=6){
   const label=L.divIcon({className:'',html:'<span class="control-area-label">'+escapeHTML(p.draw_label)+'</span>',
    iconSize:[60,17],iconAnchor:[30,-radius-4]});
   L.marker(center,{icon:label,interactive:false,pane:'controlAreaPane',zIndexOffset:0})
    .addTo(groups.controlAreas);
  }
 }
}
// Local year-end garrisons are sourced Point sites, not measurable colonial provinces.
// French Outreau is an opposing French fort and must not be painted as English control.
// Research locality buffers are dashed map-reading aids, NOT historic frontiers.
// They are never used for area statistics, annexation or sovereignty calculations.
function yearValidWarZone(f,y){
 const p=f.properties||{};
 return Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&y>=p.start_year&&y<=p.end_year;
}
function activeEnglishGarrisonIds(){
 return new Set((militaryControlPoints?.features||[]).filter(f=>{
  const p=f.properties||{};
  return p.not_an_English_control_feature!==true&&year>=p.year_end_start&&year<=p.year_end_stop;
 }).map(f=>f.properties.stable_id));
}
// Site localities are copied from existing uncertain research. Their borders are not
// Tudor surveyed limits. Keep the layers stable at all zooms so click/visibility never
// flickers during zoom: dashed boundaries and the dossier communicate uncertainty.
function renderWartimeVicinities(){
 groups.warVicinity.clearLayers();
 if(year<1540||!occupiedZoneAreas||!militaryControlPoints
   ||!$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const active=activeEnglishGarrisonIds();
 const selected=occupiedZoneAreas.features.filter(f=>
  f.properties?.zone_type==='occupied'&&f.properties?.historical_boundary_confirmed===false
  &&f.properties?.fill_authorized===false&&active.has(f.properties.stable_id)&&yearValidWarZone(f,year));
 if(!selected.length)return;
 L.geoJSON({type:'FeatureCollection',features:selected},{
  renderer:warVicinityRenderer,pane:'warVicinityPane',interactive:true,bubblingMouseEvents:false,
  style:()=>({color:'#bd92fa',weight:2,opacity:.95,dashArray:'4 7',
    fill:true,fillColor:'#8652dd',fillOpacity:.23,className:'atlas-violet-wartime-vicinity'}),
  onEachFeature:(feature,layer)=>{
   layer.bindTooltip('<strong>'+escapeHTML(feature.properties.name)+'</strong><div class="atlas-hover-summary">已证实英军驻点，周边范围为概略示意；点击查看领土概况</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
   layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openTerritoryDossier(feature,'occupied')});
  }
 }).addTo(groups.warVicinity);
}
// Real blue/violet SVG crosshatching instead of one ambiguous semi-solid color.
// Military reach is neither British sovereignty nor year-end area-wide occupation.
// PR38 gives four evidence-anchored coarse illustrative bands, not surveyed borders.
function renderWarReachCorridors(){
 groups.warReach.clearLayers();
 if(year<1540||!warReachAreas||!$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const selected=warReachAreas.features.filter(f=>f.geometry?.type==='LineString'&&f.properties?.zone_type==='war_reach_schematic'
  &&f.properties?.historical_boundary_confirmed===false&&f.properties?.fill_authorized===false&&yearValidWarZone(f,year));
 // Only visually represent sourced directions; these lines never imply a continuous English controlled strip.
 for(const feature of selected){
  const p=feature.properties||{},points=feature.geometry.coordinates.map(c=>[c[1],c[0]]);
  if(points.length<2)continue;
  const stroke=p.stroke_color||'#c5a4f8';
  L.polyline(points,{renderer:warReachRenderer,pane:'warReachPane',color:p.halo_color||'#9473d8',
   weight:Math.min(26,Number(p.halo_weight_px)||20),opacity:Math.min(.2,Number(p.halo_opacity)||.12),
   interactive:false,className:'atlas-war-reach-halo'}).addTo(groups.warReach);
  const visible=L.polyline(points,{renderer:warReachRenderer,pane:'warReachPane',color:stroke,
   weight:Math.max(3,Number(p.stroke_weight_px)||3),opacity:.94,dashArray:p.stroke_dashes||'7 7',
   bubblingMouseEvents:false,className:'atlas-war-reach-schematic'}).addTo(groups.warReach);
  const hit=L.polyline(points,{renderer:warReachRenderer,pane:'warReachPane',color:stroke,
   weight:22,opacity:.016,interactive:true,bubblingMouseEvents:false,
   className:'atlas-war-reach-hit'}).addTo(groups.warReach);
  for(const layer of [visible,hit]){
   layer.bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">军事行动方向 · 查看史料</div>',{
    sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
   layer.on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);openTerritoryDossier(feature,'war-reach')});
  }
 }
}

// Seventh chapter: dated sovereign/controller POINTS, not inferred land areas.
// French troops in Scotland are Scottish allies, never French annexation.
function renderSeventhControlSites(){
 if(year<1550||!seventhControlSites||!$('toggleControlAreas').checked||!$('toggleTerritorialFootprints').checked)return;
 for(const feature of seventhControlSites.features||[]){
  const p=feature.properties||{},c=feature.geometry?.coordinates;
  if(feature.geometry?.type!=='Point'||!c||year<p.start_year||year>p.end_year)continue;
  const group=p.controller_group==='english_to_french'
    ?(year>=p.change_to_french_year?'french':'english'):p.controller_group;
  const palette={english:'#ae83ef',french:'#57c9b8',scottish:'#70afcf',french_allied_scotland:'#7dbdc4'};
  const color=palette[group]||'#d8a980';
  const status={english:'英王驻军所在地点',french:'法国已收复的城市或要塞',scottish:'苏格兰恢复控制的城堡',french_allied_scotland:'苏格兰境内的法军或苏法盟军堡垒'}[group]||'历史军防地点';
  const record=findPlaceAcrossChapters(p.stable_id);
  const center=[c[1],c[0]];
  const open=e=>{
   if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   if(record)openDossier(record,'place');else openTerritoryDossier(feature,'historic');
  };
  const tt='<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(status+' · 查看史料')+'</div>';
  L.circleMarker(center,{renderer:wartimeRenderer,pane:'controlAreaPane',radius:17,weight:3,color,opacity:.98,
   dashArray:'5 5',fill:true,fillColor:color,fillOpacity:.15,bubblingMouseEvents:false,
   className:'atlas-seventh-site atlas-seventh-'+group})
   .bindTooltip(tt,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',open).addTo(groups.wartimeControl);
  L.circleMarker(center,{renderer:garrisonHitRenderer,pane:'garrisonHitPane',radius:24,weight:7,color,
   opacity:.018,fill:false,bubblingMouseEvents:false,className:'atlas-seventh-site-hit'})
   .bindTooltip(tt,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',open).addTo(groups.garrisonHit);
 }
}

// Only Le Havre 1562 has a new verified English year-end urban occupation point.
// Chapter 9: only source-confirmed English castle garrisons in old Irish lordships.
function renderNinthControlSites(){
 if(!ninthControlSites||year<1570||year>1579||!$('toggleControlAreas').checked||!$('toggleTerritorialFootprints').checked)return;
 for(const feature of ninthControlSites.features||[]){
  const p=feature.properties||{},ll=feature.geometry?.coordinates;
  if(feature.geometry?.type!=='Point'||!ll||year<p.start_year||year>p.end_year||p.fill_authorized!==false)continue;
  const coordinate=[ll[1],ll[0]],name=p.name;
  const open=e=>{
   if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   const pl=findPlaceAcrossChapters(p.stable_id);
   if(pl)openDossier(pl,'place');else openTerritoryDossier(feature,'historic');
  };
  const tt='<strong>'+escapeHTML(name)+'</strong><div class="atlas-hover-summary">英军局部据点 · 查看史料</div>';
  L.circleMarker(coordinate,{renderer:wartimeRenderer,pane:'controlAreaPane',radius:17,
    color:'#ae83ef',weight:3,dashArray:'5 5',fill:true,fillColor:'#ae83ef',
    fillOpacity:.14,opacity:.98,bubblingMouseEvents:false,
    className:'atlas-ninth-english-garrison'})
   .bindTooltip(tt,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
   .on('click',open).addTo(groups.wartimeControl);
  L.circleMarker(coordinate,{renderer:garrisonHitRenderer,pane:'garrisonHitPane',
    radius:24,color:'#ae83ef',weight:7,opacity:.018,fill:false,
    bubblingMouseEvents:false,className:'atlas-ninth-english-garrison-hit'})
   .on('click',open).addTo(groups.garrisonHit);
 }
}
// Date-gated control symbols for documented 1580s Crown and colonial localities.
// Chapter 11: precomputed historical YEAR-END local control points.
function renderEleventhControlCores(){
 groups.eleventhCores.clearLayers();groups.eleventhHits.clearLayers();
 if(!eleventhControlCores||year<1590||year>1599||!$('toggleControlAreas').checked||!$('toggleTerritorialFootprints').checked)return;
 for(const f of eleventhControlCores.features||[]){
  const p=f.properties||{},c=f.geometry?.coordinates;
  if(f.geometry?.type!=='Point'||!c||p.fill_authorized!==false||!p.year_end_visible?.includes(year))continue;
  const center=[c[1],c[0]],radius=Math.max(7,Math.min(12,Number(p.screen_radius_px)||8));
  const open=e=>{
   if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   const pl=findPlaceAcrossChapters(p.stable_id);
   if(pl)openDossier(pl,'place');else openTerritoryDossier(f,'historic');
  };
  L.circleMarker(center,{renderer:wartimeRenderer,pane:'controlAreaPane',radius,
   color:'#ac84e3',weight:3,dashArray:'5 5',fill:true,fillColor:'#a57adc',fillOpacity:.17,
   bubblingMouseEvents:false,className:'atlas-eleventh-core'})
  .bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">当年年末据点 · 查看来源</div>',
   {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
  .on('click',open).addTo(groups.eleventhCores);
  L.circleMarker(center,{renderer:garrisonHitRenderer,pane:'garrisonHitPane',radius:radius+8,
   color:'#a57adc',weight:7,opacity:.018,fill:false,bubblingMouseEvents:false,
   className:'atlas-eleventh-core-hit'}).on('click',open).addTo(groups.eleventhHits);
 }
}
// Two studied geographic envelopes: very light fill and visibly uncertain dashed edge.
function renderEleventhInfluenceAreas(){
 groups.eleventhAreas.clearLayers();
 if(!eleventhInfluenceAreas||year<1590||year>1599||!$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 L.geoJSON(eleventhInfluenceAreas,{renderer:warVicinityRenderer,pane:'warVicinityPane',
  filter:f=>f.properties?.fill_authorized===false&&f.properties?.valid_years?.includes(year),
  style:f=>({color:f.properties.stroke_hex||'#9778b5',weight:Number(f.properties.stroke_weight)||2,
   dashArray:f.properties.stroke_dash_array||'7 6',opacity:.9,fill:true,
   fillColor:f.properties.fill_hex||'#a185b1',
   fillOpacity:Math.min(.085,Number(f.properties.fill_opacity)||.055),
   className:'atlas-eleventh-research-area',bubblingMouseEvents:false}),
  onEachFeature:(f,layer)=>{
   const p=f.properties;
   layer.bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">法律地名及殖民活动参考 · 非实测边界</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
   layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openTerritoryDossier(f,'historic')});
  }
 }).addTo(groups.eleventhAreas);
}
// Distinct non-sovereign spatial history: invasion impact is a sourced regional
// reading aid and never included in actual occupation or colonial area totals.
// Only one schematic appears per year (1580 sweep; 1581-83 war consequences).

// Source-backed regional background, not a cadastral or civilian casualty map.
// A low-zoom circle is a SCREEN-SPACE cue; at local zoom readers see the
// deliberately uncertain dashed zone and may click either symbol.
function regionalFeatureKind(p){
 if(p.zone_type==='crown_internal_repression')return 'domestic-repression';
 if(p.zone_type==='colonial_fiscal_military_coercion')return 'colonial-coercion';
 if(p.zone_type==='rebellion_and_crown_response')return 'rebellion-conflict';
 if(p.zone_type==='gaelic_refuge_anti_crown_resistance_schematic')return 'rebellion-conflict';
 if(p.zone_type==='indigenous_defense_and_privateer_contact_schematic')return 'indigenous-encounter';
 if(p.zone_type==='french_recapture_after_english_occupation_schematic')return 'restoration';
 if(p.zone_type==='documented_english_urban_garrison_schematic')return 'occupied';
 if(p.color_role==='plantation_ochre')return 'land-dispossession';
 return 'invasion-impact';
}
function activeRegionalFeatures(){
 return [...(earlyRegionalAreas?.features||[]),...(followupRegionalAreas?.features||[]),...(centuryViolenceAreas?.features||[])].filter(f=>{
  const p=f.properties||{};
  return p.start_year<=year&&year<=(p.display_through_year??p.end_year??year);
 });
}
function renderEarlyRegionalImpactAreas(){
 groups.earlyRegionalImpact.clearLayers();
 if(!earlyRegionalAreas||!$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 for(const feature of activeRegionalFeatures()){
  const p=feature.properties||{};
  if(p.historical_boundary_confirmed!==false||
     p.fill_authorized!==false||p.territorial_claim!==false||p.area_sqkm!==null)continue;
  const ochre=p.color_role==='plantation_ochre',violet=p.color_role==='occupation_violet',blue=p.color_role==='restoration_blue';
  const color=ochre?'#c49c58':violet?'#9475bc':blue?'#77b3ca':'#c56873',ring=feature.geometry.coordinates[0];
  const style={color,weight:2.5,opacity:.95,dashArray:ochre?'7 6':'8 6',fill:true,fillColor:color,
   fillOpacity:ochre?.11:.14,className:'atlas-early-regional-impact'};
  const open=e=>{if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openTerritoryDossier(feature,regionalFeatureKind(p));};
  const tooltip='<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">史料支持的地区示意 · 点击阅读背景与后果</div>';
  if(map.getZoom()<5){
   const center=ring.slice(0,-1).reduce((xy,[lon,lat],_,arr)=>[xy[0]+lat/arr.length,xy[1]+lon/arr.length],[0,0]);
   L.circleMarker(center,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',radius:26,
    ...style,fillOpacity:.10,className:'atlas-early-regional-impact atlas-schematic-screen-cue',
    bubblingMouseEvents:false}).bindTooltip(tooltip,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
    .on('click',open).addTo(groups.earlyRegionalImpact);
  }else{
   L.geoJSON(feature,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',interactive:true,
    bubblingMouseEvents:false,style:()=>style,
    onEachFeature:(_f,layer)=>layer.bindTooltip(tooltip,
      {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'}).on('click',open)})
    .addTo(groups.earlyRegionalImpact);
  }
 }
}
function renderHistoricalRegionGuide(){
 const wrap=$('historicalRegionGuide'),list=$('historicalRegionList');
 if(!wrap||!list)return;
 const zones=[],displayTerritory=$('toggleTerritorialFootprints').checked&&$('toggleControlAreas').checked;
 const push=(collection,kind,valid,open)=>{for(const feature of collection?.features||[]){
  const p=feature.properties||{};
  if(!valid(feature,p))continue;
  zones.push({feature,kind,open:open||(()=>openTerritoryDossier(feature,kind)),
   name:p.name||feature.id,summary:p.summary_zh||p.history_description||p.precision_note||p.label_type||''});
 }};
 const when=(f,p)=>p.start_year<=year&&year<=(p.end_year??year);
 if(displayTerritory){
  for(const feature of activeRegionalFeatures()){
   const p=feature.properties;
   zones.push({feature,kind:regionalFeatureKind(p),name:p.name||feature.id,
    summary:p.summary_zh||p.label_type||''});
  }
  const active=activeEnglishGarrisonIds();
  push(occupiedZoneAreas,'occupied',(f,p)=>p.zone_type==='occupied'&&active.has(p.stable_id)&&yearValidWarZone(f,year));
  push(contestedZoneAreas,'contested',(f,p)=>p.zone_type==='contested'&&yearValidWarZone(f,year));
  push(warReachAreas,'war-reach',(f,p)=>p.zone_type==='war_reach_schematic'&&yearValidWarZone(f,year));
  push(tenthInvasionImpactAreas,'invasion-impact',(f,p)=>when(f,p));
  push(tenthLandRaidAreas,'invasion-impact',(f,p)=>when(f,p),
   null);
  push(nineYearsWarImpact,'nine-years-war',(f,p)=>when(f,p));
  push(eleventhInfluenceAreas,'historic',(f,p)=>p.valid_years?.includes(year));
  push(atlanticContactData,'atlantic-contact',(f,p)=>when(f,p)&&f.geometry?.type==='Polygon');
 }
 if($('toggleEvents').checked)
  push(eighthSlaveCoastalAreas,'enslavement',(f,p)=>p.start_year<=year&&p.end_year>=year,
   null);
 // A dossier entry is a readable route even when the polygon is underneath
 // a numeric hub or modern road labels. It never changes map year or geometry.
 if(!zones.length){wrap.hidden=true;list.innerHTML='';$('historicalRegionCount').textContent='0';return;}
 const unique=[...new Map(zones.map(z=>[z.feature.id,z])).values()];
 wrap.hidden=false;$('historicalRegionCount').textContent=String(unique.length);
 list.innerHTML=unique.map((z,i)=>
  '<button type="button" class="historical-region-entry" data-region-index="'+i+'">'+
  '<strong>'+escapeHTML(z.name)+'</strong></button>'
 ).join('');
 list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  const z=unique[Number(b.dataset.regionIndex)];
  if(z.kind==='enslavement')openEighthCoastalDossier(z.feature);
  else if(z.feature.properties?.zone_type==='crown_land_dispossession_policy_study'){
   const p=z.feature.properties,stage=p.year_stages?.find(x=>year>=x.start_year&&year<=x.end_year);
   const feature=stage?{...z.feature,properties:{...p,name:stage.title,summary_zh:stage.summary_zh,source_ids:stage.source_ids}}:z.feature;
   openTerritoryDossier(feature,'land-dispossession');
  }else openTerritoryDossier(z.feature,z.kind);
 }));
}

function renderTenthInvasionImpactAreas(){
 groups.invasionImpact.clearLayers();
 if(!tenthInvasionImpactAreas||year<1580||year>1583||
    !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const features=tenthInvasionImpactAreas.features.filter(f=>{
  const p=f.properties||{};
  return f.geometry?.type==='Polygon'&&p.zone_type==='english_invasion_impact_schematic'&&
   p.map_layer==='territory'&&p.fill_authorized===false&&
   p.historical_boundary_confirmed===false&&p.territorial_claim===false&&
   p.area_sqkm===null&&year>=p.start_year&&year<=p.end_year;
 });
 if(!features.length)return;
 for(const f of features){
  const p=f.properties,small=map.getZoom()<5;
  const tooltip='<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(p.label_type||'英军入侵影响区')+
   (small?' · 位置提示，放大查看地区示意面':' · 点击查看史料')+'</div>';
  const open=e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   openTerritoryDossier(f,'invasion-impact');};
  if(small){
   const ring=f.geometry.coordinates[0].slice(0,-1);
   const center=ring.reduce((acc,[lon,lat])=>[acc[0]+lat/ring.length,acc[1]+lon/ring.length],[0,0]);
   L.circleMarker(center,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',
    radius:27,color:'#bf6671',weight:2.3,opacity:.85,dashArray:'8 6',
    fill:true,fillColor:'#b34e5c',fillOpacity:.12,
    className:'atlas-tenth-invasion-impact atlas-schematic-screen-cue',
    bubblingMouseEvents:false})
    .bindTooltip(tooltip,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
    .on('click',open).addTo(groups.invasionImpact);
  }else{
   L.geoJSON(f,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',
    interactive:true,bubblingMouseEvents:false,
    style:()=>({color:'#bf6671',weight:2.3,opacity:.85,dashArray:'8 6',
     fill:true,fillColor:'#b34e5c',fillOpacity:.14,className:'atlas-tenth-invasion-impact'}),
    onEachFeature:(_f,layer)=>layer.bindTooltip(tooltip,
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'}).on('click',open)
   }).addTo(groups.invasionImpact);
  }
 }
}
// Separate land expropriation POLICY from armed raid OCCURRENCES.
// The warm Munster surface locates crown forfeiture/plantation administration,
// whereas red port-city symbols flag Drake's short-lived sacks and ransom.
// Neither graphic asserts surveyed parcels, devastation extents or sovereignty.
function renderTenthLandRaidImpactAreas(){
 groups.tenthExtraction.clearLayers();
 if(!tenthLandRaidAreas||year<1584||year>1589||
    !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const current=tenthLandRaidAreas.features.filter(f=>{
  const p=f.properties||{};
  return f.geometry?.type==='Polygon'&&p.map_layer==='territory'&&
   p.historical_boundary_confirmed===false&&p.fill_authorized===false&&
   p.territorial_claim===false&&p.area_sqkm===null&&
   year>=p.start_year&&year<=p.end_year;
 });
 for(const feature of current){
  const p=feature.properties,land=p.zone_type==='crown_land_dispossession_policy_study',
   stage=p.year_stages?.find(item=>year>=item.start_year&&year<=item.end_year);
  const title=stage?.title||p.name,zoom=map.getZoom();
  const style={color:land?'#b99a62':'#c65c68',weight:land?2.1:2.6,opacity:.9,
   dashArray:land?'6 6':'8 5',fill:true,
   fillColor:land?'#b78b4b':'#bf4656',fillOpacity:land?.13:.2,
   className:land?'atlas-tenth-land-policy-impact':'atlas-tenth-port-raid-impact'};
  // At the default world-scale zoom an urban 0.1-degree envelope is below 2px.
  // The fixed-pixel symbol is ONLY an on-screen cue, never a larger GIS area.
  const lowZoom=land?zoom<5:zoom<8;
  const tooltip='<strong>'+escapeHTML(title)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(p.label_type||'区域性历史影响')+
   (lowZoom?' · 位置提示，放大查看地区示意面':' · 查看史料')+'</div>';
  const open=e=>{
   if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   const currentFeature=stage?{...feature,properties:{...p,name:stage.title,
    summary_zh:stage.summary_zh,source_ids:stage.source_ids}}:feature;
   openTerritoryDossier(currentFeature,stage?'land-dispossession':'invasion-impact');
  };
  if(lowZoom){
   const ring=feature.geometry.coordinates[0].slice(0,-1);
   const location=land?
    ring.reduce((acc,[lon,lat])=>[acc[0]+lat/ring.length,acc[1]+lon/ring.length],[0,0]):
    p.original_event_coordinates;
   if(!Array.isArray(location)||location.length!==2||!location.every(Number.isFinite))continue;
   L.circleMarker(location,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',
    radius:land?27:zoom<=3?23:zoom<=5?27:31,
    ...style,fillOpacity:land?.11:.14,
    className:style.className+' atlas-schematic-screen-cue',
    bubblingMouseEvents:false})
    .bindTooltip(tooltip,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
    .on('click',open).addTo(groups.tenthExtraction);
  }else{
   L.geoJSON(feature,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',
    interactive:true,bubblingMouseEvents:false,
    style:()=>style,
    onEachFeature:(_f,layer)=>layer.bindTooltip(tooltip,
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
     .on('click',open)
   }).addTo(groups.tenthExtraction);
  }
 }
}
// Nine Years War: Gaelic defeats of Crown forces must NOT be painted as
// English colonial conquest. Fermanagh and Armagh are regional reading
// envelopes; Munster is a REUSED broad province study, 1599 Essex is only
// an attested order of towns (never an invented GPS march or occupation).
// No invented 'English North African empire': documented Moroccan commerce
// is a site symbol. In the Caribbean distinguish an unsuccessful raid from
// San Juan's short urban occupation, without drawing island-wide control.
function renderAtlanticContactSites(){
 groups.atlanticContact.clearLayers();
 if(!atlanticContactData||!$('toggleTerritorialFootprints').checked||
    !$('toggleControlAreas').checked)return;
 const selected=atlanticContactData.features.filter(f=>{
  const p=f.properties||{};
  return p.start_year===year&&p.end_year===year&&
   p.historical_boundary_confirmed===false&&p.fill_authorized===false&&
   p.territorial_claim===false&&p.area_sqkm===null&&
   p.map_layer==='territory_reference_not_political_control';
 });
 // Region A: Raleigh's 1595 Port of Spain -> San José raiding episode.
 // The archive attests TWO named towns; no route, damage-radius, sovereignty
 // or island-wide control is reconstructed from this editorial polygon.
 for(const f of selected.filter(x=>x.geometry.type==='Polygon')){
  const p=f.properties;
  if(p.zone_type!=='caribbean_english_raid_impact_region_schematic'||p.area_measurement_prohibited!==true||
     p.territorial_claim!==false)continue;
  const small=map.getZoom()<8;
  const tooltip='<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(p.label_type)+
   (small?' · 位置提示；放大后显示局部示意面':' · 点击查看史料')+'</div>';
  const open=e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   openTerritoryDossier(f,'atlantic-contact');};
  if(small){
   L.circleMarker(p.center_lat_lon,{
    renderer:invasionImpactRenderer,pane:'invasionImpactPane',
    radius:29,color:'#be6473',weight:2.5,dashArray:'7 6',opacity:.92,
    fill:true,fillColor:'#aa4657',fillOpacity:.14,
    className:'atlas-trinidad-1595-impact atlas-schematic-screen-cue',
    bubblingMouseEvents:false
   }).bindTooltip(tooltip,{sticky:true,pane:'eventTooltipPane',className:'atlas-hover'})
    .on('click',open).addTo(groups.atlanticContact);
  }else{
   L.geoJSON(f,{renderer:invasionImpactRenderer,pane:'invasionImpactPane',
    interactive:true,bubblingMouseEvents:false,
    style:()=>({color:'#be6473',weight:2.5,dashArray:'7 6',opacity:.9,
     fill:true,fillColor:'#aa4657',fillOpacity:.14,className:'atlas-trinidad-1595-impact'}),
    onEachFeature:(_f,layer)=>layer.bindTooltip(tooltip,{sticky:true,
     pane:'eventTooltipPane',className:'atlas-hover'}).on('click',open)
   }).addTo(groups.atlanticContact);
  }
 }
 // Route links mean DOCUMENTED sequence, not measured military tracks.
 // North African trade stays teal; the Trinidad assault sequence is red.
 // Both sit beneath historical event markers and share the 版图 switch.
 for(const f of selected.filter(x=>x.geometry.type==='LineString')){
  const isMilitary=f.properties.zone_type==='caribbean_english_military_action_sequence';
  L.geoJSON(f,{pane:'warReachPane',renderer:warReachRenderer,
   interactive:true,bubblingMouseEvents:false,style:()=>({
    color:isMilitary?'#d57c80':'#65bda7',weight:isMilitary?3.3:2.2,
    opacity:isMilitary?.93:.75,dashArray:isMilitary?'7 5':'5 7',
    className:isMilitary?'atlas-trinidad-1595-action-sequence':'atlas-maghreb-trade-sequence'}),
   onEachFeature:(item,layer)=>{
    layer.bindTooltip('<strong>'+escapeHTML(item.properties.name)+'</strong><div class="atlas-hover-summary">'+
      escapeHTML(isMilitary?'先后顺序示意，非实际行军路线':'贸易港口次序示意，非实际航线')+'</div>',
      {sticky:true,pane:'eventTooltipPane',className:'atlas-hover'});
    layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
     openTerritoryDossier(item,'atlantic-contact');});
   }
  }).addTo(groups.atlanticContact);
 }
 for(const f of selected.filter(x=>x.geometry.type==='Point')){
  const p=f.properties,c=f.geometry.coordinates,commerce=p.zone_type.startsWith('north_african_'),
   occupied=p.zone_type==='caribbean_temporary_english_occupation',
   failed=p.zone_type==='caribbean_english_failed_assault';
  const color=commerce?'#64c6b0':occupied?'#ab87dd':failed?'#d57a78':'#c86169';
  const radius=commerce?12:occupied?24:19;
  L.circleMarker([c[1],c[0]],{
   pane:'controlAreaPane',renderer:wartimeRenderer,
   radius,color,weight:commerce?2.3:3,
   dashArray:commerce?'4 5':occupied?'9 4':'5 5',
   fill:true,fillColor:color,fillOpacity:commerce?.16:.09,
   bubblingMouseEvents:false,
   className:commerce?'atlas-maghreb-commerce-site':
    occupied?'atlas-caribbean-urban-occupation':'atlas-caribbean-raid-site'
  }).bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+
   escapeHTML(commerce?'有据贸易活动，不是殖民地':occupied?'短期占据城市，非全岛统治':failed?'袭击受挫，无英军占领':'港口/岛屿行动定位示意')+
   ' · 点击查阅史料</div>',
   {sticky:true,pane:'eventTooltipPane',className:'atlas-hover'})
   .on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
    openTerritoryDossier(f,'atlantic-contact');})
   .addTo(groups.atlanticContact);
 }
}
// Published decade-11 links are two documented sequences, not real tracks.
// Reuse the accepted Leaflet route pane; historical events are clickable above.
// Read-only browser diagnostics for CI without exposing mutable internal layers.
window.atlasReadActionLinks=()=>Object.freeze({year,count:groups.chapter11ActionLinks.getLayers().length});
function renderChapter11ActionLinks(){
 groups.chapter11ActionLinks.clearLayers();
 if(!chapter11ActionLinks||year<1592||year>1598||
  !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 for(const f of chapter11ActionLinks.features){
  const p=f.properties||{};
  if(p.start_year!==year||p.end_year!==year||f.geometry?.type!=='LineString'||
   p.territorial_claim!==false||p.area_sqkm!==null||
   p.exclude_from_area_aggregation!==true||p.sequence_only!==true)continue;
  const brazil=p.zone_type==='documented_overseas_raid_town_sequence';
  L.geoJSON(f,{pane:'warReachPane',renderer:warReachRenderer,
   interactive:true,bubblingMouseEvents:false,
   style:()=>({color:brazil?'#ca7378':'#e4a86a',weight:3.0,
     opacity:.89,dashArray:'7 7',lineJoin:'round',
     className:brazil?'atlas-ch11-brazil-two-town-link':'atlas-ch11-yellow-ford-relief-link'}),
   onEachFeature:(feat,layer)=>{
    layer.bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+
      '军事行动地点顺序示意，非真实行军或航行路线 · 查看史料</div>',
      {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
    layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
      openTerritoryDossier(feat,'linked-action');});
   }
  }).addTo(groups.chapter11ActionLinks);
 }
}
function renderNineYearsWarImpact(){
 groups.nineYearsWar.clearLayers();
 if(!nineYearsWarImpact||year<1594||year>1599||
    !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
 const available=nineYearsWarImpact.features.filter(f=>{
  const p=f.properties||{};
  return p.map_layer==='territory'&&p.historical_boundary_confirmed===false&&
   p.fill_authorized===false&&p.territorial_claim===false&&p.area_sqkm===null&&
   year>=p.start_year&&year<=p.end_year;
 });
 for(const f of available){
  const p=f.properties,stage=p.year_stages?.find(q=>year>=q.start_year&&year<=q.end_year);
  const current=stage?{...f,properties:{...p,name:stage.title,
   summary_zh:stage.summary_zh,source_ids:stage.source_ids,
   related_event_ids:stage.related_event_ids,
   start_year:stage.start_year,
   end_year:stage.start_year===stage.end_year?null:stage.end_year}}:f;
  const isRoute=f.geometry.type==='LineString',isResistance=p.zone_type==='gaelic_resistance_plantation_collapse_schematic',
   isBattle=p.zone_type==='gaelic_resistance_to_crown_campaign_schematic';
  const style=isRoute?
   {color:'#e4a86a',weight:3.1,opacity:.94,dashArray:'10 7',
    lineJoin:'round',className:'atlas-essex-1599-schematic'}:
   {color:isResistance?'#66bc9e':isBattle?'#68b5bb':'#79aaa9',
    weight:2.2,opacity:.9,dashArray:'8 6',
    fill:true,fillColor:isResistance?'#3d9275':'#4e8f9f',
    fillOpacity:.12,className:'atlas-nine-years-war-study'};
  const pane=isRoute?'warReachPane':'invasionImpactPane';
  const renderer=isRoute?warReachRenderer:invasionImpactRenderer;
  L.geoJSON(current,{pane,renderer,interactive:true,bubblingMouseEvents:false,
   style:()=>style,
   onEachFeature:(_feature,layer)=>{
    layer.bindTooltip('<strong>'+escapeHTML(current.properties.name)+'</strong><div class="atlas-hover-summary">'+
     escapeHTML(p.label_type||'战争研究区')+' · 查看史料</div>',
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
    layer.on('click',e=>{
     if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
     openTerritoryDossier(current,'nine-years-war');
    });
   }
  }).addTo(groups.nineYearsWar);
 }
}
function renderTenthControlSites(){
 if(!tenthControlSites||year<1580||year>1589||!$('toggleControlAreas').checked||!$('toggleTerritorialFootprints').checked)return;
 for(const feature of tenthControlSites.features||[]){
  const p=feature.properties||{},ll=feature.geometry?.coordinates;
  if(feature.geometry?.type!=='Point'||!ll||year<p.start_year||year>p.end_year||p.fill_authorized!==false)continue;
  const center=[ll[1],ll[0]];
  const open=e=>{
   if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   const place=findPlaceAcrossChapters(p.stable_id);
   if(place)openDossier(place,'place');else openTerritoryDossier(feature,'historic');
  };
  L.circleMarker(center,{renderer:wartimeRenderer,pane:'controlAreaPane',radius:17,color:'#ae83ef',
   weight:3,dashArray:'5 5',fill:true,fillColor:'#ae83ef',fillOpacity:.14,opacity:.98,
   bubblingMouseEvents:false,className:'atlas-tenth-english-site'})
   .bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">局部历史据点 · 查看史料</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
   .on('click',open).addTo(groups.wartimeControl);
  L.circleMarker(center,{renderer:garrisonHitRenderer,pane:'garrisonHitPane',radius:24,weight:7,
   color:'#ae83ef',opacity:.018,fill:false,bubblingMouseEvents:false,
   className:'atlas-tenth-english-site-hit'}).on('click',open).addTo(groups.garrisonHit);
 }
}
function renderEighthControlSites(){
 if(!eighthControlSites||year<1560||year>1569||!$('toggleControlAreas').checked||!$('toggleTerritorialFootprints').checked)return;
 for(const f of eighthControlSites.features){
  const p=f.properties,c=f.geometry?.coordinates;
  if(f.geometry?.type!=='Point'||!c||year<p.start_year||year>p.end_year||p.fill_authorized!==false)continue;
  const english=p.controller_group==='english',color=english?'#ae83ef':'#57c9b8';
  const open=e=>{if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
   const place=findPlaceAcrossChapters(p.stable_id);
   if(place)openDossier(place,'place');else openTerritoryDossier(f,'historic');
  };
  const tt='<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">城市驻军 · 查看史料</div>';
  L.circleMarker([c[1],c[0]],{renderer:wartimeRenderer,pane:'controlAreaPane',radius:17,weight:3,color,
   opacity:.98,dashArray:'5 5',fill:true,fillColor:color,fillOpacity:.13,bubblingMouseEvents:false,
   className:english?'atlas-eighth-site atlas-eighth-english':'atlas-eighth-site atlas-eighth-french'})
   .bindTooltip(tt,{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
   .on('click',open).addTo(groups.wartimeControl);
  L.circleMarker([c[1],c[0]],{renderer:garrisonHitRenderer,pane:'garrisonHitPane',radius:24,
   weight:7,color,opacity:.018,fill:false,bubblingMouseEvents:false,className:'atlas-eighth-site-hit'})
   .on('click',open).addTo(groups.garrisonHit);
 }
}
function openEighthCoastalDossier(feature){
 const p=feature.properties||{};selected='';selectedItemYear=null;
 const refs=(p.source_ids||[]).map(id=>atlasEighth?.sources?.find(s=>s.id===id))
  .filter(Boolean).map(s=>'<a class="source-link" href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(s.publisher)+' · '+escapeHTML(s.title)+' ↗</a>').join('');
 $('dossierBody').innerHTML='<div class="dossier-kicker">第八章 · 非洲人口奴役活动 · '+year+'年</div>'+
 '<h2>'+escapeHTML(p.name)+'</h2>'+
 '<p>'+escapeHTML(p.summary_zh||'霍金斯船队在相关西非沿岸进行人口掳取、贩卖和强制装运活动。')+'</p>'+
 '<details class="source-details"><summary>历史文献与详细考证 <span>▾</span></summary>'+
 '<div class="mini-heading">历史文献</div>'+refs+'</details>';
 openPanel('dossier');
}
function ensureEighthCoastHatch(){
 const root=enslavementBandRenderer._container;
 if(!root||root.querySelector('#atlas-eighth-coast-hatch'))return;
 const ns='http://www.w3.org/2000/svg',doc=root.ownerDocument;
 let defs=root.querySelector('defs');if(!defs){defs=doc.createElementNS(ns,'defs');root.insertBefore(defs,root.firstChild)}
 const pat=doc.createElementNS(ns,'pattern');
 for(const [k,v] of Object.entries({id:'atlas-eighth-coast-hatch',width:'12',height:'12',patternUnits:'userSpaceOnUse'}))pat.setAttribute(k,v);
 const bg=doc.createElementNS(ns,'rect');bg.setAttribute('width','12');bg.setAttribute('height','12');
 bg.setAttribute('fill','#8d5735');bg.setAttribute('fill-opacity','.19');pat.appendChild(bg);
 for(const d of ['M-3 12 L12 -3','M3 15 L15 3']){const line=doc.createElementNS(ns,'path');
  line.setAttribute('d',d);line.setAttribute('stroke','#dfac78');line.setAttribute('stroke-width','2');pat.appendChild(line)}
 defs.appendChild(pat);
}
function renderEighthCoastalActivity(){
 groups.enslavementBands.clearLayers();
 if(!eighthSlaveCoastalAreas||year<1560||year>1569||!$('toggleEvents').checked)return;
 const list=eighthSlaveCoastalAreas.features.filter(f=>{
  const p=f.properties||{};
  return f.geometry?.type==='Polygon'&&p.map_layer==='events'&&p.render_as_hatched_event_activity_band===true&&
   p.fill_authorized===false&&p.historical_boundary_confirmed===false&&p.area_sqkm===null&&year>=p.start_year&&year<=p.end_year;
 });
 if(!list.length)return;
 L.geoJSON({type:'FeatureCollection',features:list},{
  renderer:enslavementBandRenderer,pane:'enslavementBandPane',interactive:true,bubblingMouseEvents:false,
  style:()=>({color:'#dca16d',weight:2.2,opacity:.94,dashArray:'6 8',
   fill:true,fillColor:'url(#atlas-eighth-coast-hatch)',fillOpacity:.6,
   className:'atlas-eighth-enslavement-coast'}),
  onEachFeature:(f,layer)=>{const p=f.properties;
   layer.bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">人口掳取与强制运输 · 查看史料</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
   layer.on('click',e=>{if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openEighthCoastalDossier(f)});
  }
 }).addTo(groups.enslavementBands);
 ensureEighthCoastHatch();
}
function ensureContestedHatch(){
 const root=contestedZoneRenderer._container;
 if(!root||!root.ownerDocument||root.querySelector('#atlas-blue-violet-contested'))return;
 const ns='http://www.w3.org/2000/svg',doc=root.ownerDocument;
 let defs=root.querySelector('defs');
 if(!defs){defs=doc.createElementNS(ns,'defs');root.insertBefore(defs,root.firstChild)}
 const pat=doc.createElementNS(ns,'pattern');
 for(const [key,value] of Object.entries({id:'atlas-blue-violet-contested',width:'14',height:'14',patternUnits:'userSpaceOnUse'}))pat.setAttribute(key,value);
 const bg=doc.createElementNS(ns,'rect');bg.setAttribute('width','14');bg.setAttribute('height','14');bg.setAttribute('fill','#456b8f');bg.setAttribute('fill-opacity','.24');pat.appendChild(bg);
 for(const [d,color]of [['M-4 10 L10 -4 M3 17 L17 3','#aa80ef'],['M-4 3 L10 17 M3 -4 L17 10','#70beda']]){
  const line=doc.createElementNS(ns,'path');line.setAttribute('d',d);
  line.setAttribute('stroke',color);line.setAttribute('stroke-width','2.5');line.setAttribute('opacity','.9');pat.appendChild(line);
 }
 defs.appendChild(pat);
}
// Campaign reference polygons remain visible at every zoom. Do not reconstruct
// or discard their SVG renderer after zoomend: Leaflet transforms the paths itself.
function renderContestedZones(){
 groups.contestedZones.clearLayers();
 if(year<1540||!contestedZoneAreas||!$('toggleTerritorialFootprints').checked
    ||!$('toggleControlAreas').checked)return;
 const selected=contestedZoneAreas.features.filter(f=>f.properties?.zone_type==='contested'
  &&f.properties?.historical_boundary_confirmed===false&&f.properties?.fill_authorized===false&&yearValidWarZone(f,year));
 if(!selected.length)return;
 L.geoJSON({type:'FeatureCollection',features:selected},{
  renderer:contestedZoneRenderer,pane:'contestedZonePane',interactive:true,bubblingMouseEvents:false,
  style:()=>({color:'#91c7ec',weight:2,opacity:.91,dashArray:'7 6',
   fill:true,fillColor:'url(#atlas-blue-violet-contested)',fillOpacity:.74,className:'atlas-contested-zone'}),
  onEachFeature:(feature,layer)=>{
   layer.bindTooltip('<strong>'+escapeHTML(feature.properties.name)+'</strong><div class="atlas-hover-summary">交战地区 · 查看史料</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'});
   layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openTerritoryDossier(feature,'contested')});
  }
 }).addTo(groups.contestedZones);
 ensureContestedHatch();
}
function renderWartimeControls(){
 groups.wartimeControl.clearLayers();
 groups.garrisonHit.clearLayers();
 if(year<1540||!militaryControlPoints||!$('toggleControlAreas').checked)return;
 for(const f of militaryControlPoints.features||[]){
  const p=f.properties||{},coords=f.geometry?.coordinates;
  if(f.geometry?.type!=='Point'||!coords||year<p.year_end_start||year>p.year_end_stop)continue;
  const french=p.not_an_English_control_feature===true;
  const color=french?'#5bb6a2':'#8e62dc';
  const center=[coords[1],coords[0]];
  const record=findPlaceAcrossChapters(p.stable_id);
  // At low/medium zoom the point symbol can fully cover its historically
  // unmeasured schematic locality polygon. Make the visible garrison ring
  // a second accessible entrance to that same area overview.
  const linkedOccupiedZone=!french?(occupiedZoneAreas?.features||[]).find(z=>
    z.properties?.zone_type==='occupied'&&z.properties?.stable_id===p.stable_id&&
    yearValidWarZone(z,year)):null;
  const showGarrisonInfo=e=>{
    if(e?.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
    if(linkedOccupiedZone)openTerritoryDossier(linkedOccupiedZone,'occupied');
    else if(record)openDossier(record,'place');
    else openTerritoryDossier(f,french?'historic':'occupied');
  };
  L.circleMarker(center,{renderer:wartimeRenderer,pane:'controlAreaPane',radius:map.getZoom()>=6?19:17,weight:3,
   color:french?'#58c6b7':'#d1acfd',opacity:.98,
   dashArray:french?'3 5':'6 4',fill:true,fillColor:color,fillOpacity:.09,
   className:french?'atlas-french-counterfort':'atlas-local-english-garrison',
   bubblingMouseEvents:false})
   .bindTooltip('<strong>'+escapeHTML(p.name||record?.name||'驻军据点')+'</strong><div class="atlas-hover-summary">'+
     escapeHTML(french?'法国守军 · 非英王控制':linkedOccupiedZone?'点击查看军控概略范围、年份与相关堡垒':'英军实际驻点 · 非整个地区的疆界')+'</div>',
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',showGarrisonInfo)
   .addTo(groups.wartimeControl);
  // The actual map hit target sits just OUTSIDE the event hub. Not a
  // territorial radius: a screen-pixel interaction only, no SVG fill.
  L.circleMarker(center,{
    renderer:garrisonHitRenderer,pane:'garrisonHitPane',
    radius:map.getZoom()>=6?24:23,weight:9,
    color:french?'#5bb6a2':'#d1acfd',opacity:.001,fill:false,
    className:'atlas-garrison-hit',interactive:true,bubblingMouseEvents:false
  }).on('click',showGarrisonInfo)
   .bindTooltip('<strong>'+escapeHTML(p.name||record?.name||'军事据点')+
     '</strong><div class="atlas-hover-summary">点击了解该驻点的控制概况及史料</div>',
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
   .addTo(groups.garrisonHit);
 }
}
function renderHypotheses(){
 groups.hypotheses.clearLayers();
 if(year<1500||!$('toggleHypotheses').checked||!geographicHypotheses)return;
 // One legacy reference geometry appears once; the territory layer owns the matching envelope.
 L.geoJSON(geographicHypotheses,{
  filter:f=>{
   const p=f.properties||{},id=String(p.id||'');
   if(p.fill_authorized!==false||!p.valid_years?.includes(year))return false;
   return !($('toggleTerritorialFootprints').checked &&
    (id==='calais-1500-attested-sites-hull-only'||id==='irish-pale-1500-presentation-envelope'));
  },
  style:f=>{
   const id=String(f.properties?.id||'');
   const calais=id.startsWith('calais'),tournai=id.includes('TOURNAISIS');
   return {color:tournai?'#e2b16e':calais?'#c58dfb':'#d4aa70',
    weight:calais?3.4:2.7,dashArray:'7 5',opacity:.96,
    fill:f.geometry.type!=='LineString',fillColor:calais?'#b58bea':'#d4aa70',
    fillOpacity:f.geometry.type==='LineString'?0:.08};
  },
  onEachFeature:(feature,layer)=>{
   const p=feature.properties||{};
   layer.bindTooltip('<strong>'+escapeHTML(p.public_title||'历史地理推定')+
    '</strong><div class="atlas-hover-summary">'+escapeHTML(p.public_summary||'')+'</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]});
   layer.on('click',()=>openHypothesis(feature));
  }
 }).addTo(groups.hypotheses);
}
// A geography-first fallback for real pointer taps on Leaflet canvas/SVG roots.
// Transparent overlay viewports can receive the click without hitting a rendered
// path; resolve the year-valid historical feature at the map coordinate instead.
// Do not create geographic claims: this only queries the existing GeoJSON shapes.
function insideWarPolygon(ring,lon,lat){
 if(!Array.isArray(ring)||ring.length<3)return false;
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[i],c=ring[j];
  if(((a[1]>lat)!==(c[1]>lat)) &&
   lon<((c[0]-a[0])*(lat-a[1])/(c[1]-a[1])+a[0]))inside=!inside;
 }
 return inside;
}
function featureContainsCoordinate(feature,lon,lat){
 const geometry=feature?.geometry;if(!geometry)return false;
 const polys=geometry.type==='Polygon'?[geometry.coordinates]:
  geometry.type==='MultiPolygon'?geometry.coordinates:[];
 return polys.some(rings=>Array.isArray(rings)&&rings.length>0 &&
  insideWarPolygon(rings[0],lon,lat) &&
  !rings.slice(1).some(hole=>insideWarPolygon(hole,lon,lat)));
}
function openMapTerritoryAt(latlng){
 const lon=latlng.lng,lat=latlng.lat;
 if(year>=1540&&$('toggleControlAreas').checked&&$('toggleTerritorialFootprints').checked){
  const active=activeEnglishGarrisonIds();
  const occupied=(occupiedZoneAreas?.features||[]).find(f=>
   f.properties?.zone_type==='occupied'&&active.has(f.properties.stable_id)&&
   yearValidWarZone(f,year)&&featureContainsCoordinate(f,lon,lat));
  if(occupied){openTerritoryDossier(occupied,'occupied');return true;}
  const contested=(contestedZoneAreas?.features||[]).find(f=>
   f.properties?.zone_type==='contested'&&yearValidWarZone(f,year)&&
   featureContainsCoordinate(f,lon,lat));
  if(contested){openTerritoryDossier(contested,'contested');return true;}
  const reach=(warReachAreas?.features||[]).find(f=>
   f.properties?.zone_type==='war_reach_schematic'&&yearValidWarZone(f,year)&&featureContainsCoordinate(f,lon,lat));
  if(reach){openTerritoryDossier(reach,'war-reach');return true;}
 }
 if($('toggleTerritorialFootprints').checked){
  // Screen-space circle cues and layered SVGs may intercept precise clicks.
  // Try sourced active impact features BEFORE modern sovereignty background.
  const lookups=[
   [earlyRegionalAreas,'invasion-impact'],[followupRegionalAreas,'invasion-impact'],[centuryViolenceAreas,'invasion-impact'],
   [tenthInvasionImpactAreas,'invasion-impact'],
   [tenthLandRaidAreas,'invasion-impact'],
   [nineYearsWarImpact,'nine-years-war'],
   [eleventhInfluenceAreas,'historic'],
   [atlanticContactData,'atlantic-contact']
  ];
  if($('toggleControlAreas').checked){
   for(const [dataset,kind] of lookups){
    const target=(dataset?.features||[]).find(f=>{
     const p=f.properties||{};
     const visible=p.valid_years?.includes(year)||(p.start_year<=year&&year<=(p.display_through_year??p.end_year??year));
     return visible&&f.geometry?.type==='Polygon'&&featureContainsCoordinate(f,lon,lat);
    });
    if(target){openTerritoryDossier(target,target.properties?.zone_type==='crown_land_dispossession_policy_study'?'land-dispossession':
      (dataset===earlyRegionalAreas||dataset===followupRegionalAreas||dataset===centuryViolenceAreas?regionalFeatureKind(target.properties):kind));return true;}
   }
  }
  const historic=(territorialFootprints?.features||[]).find(f=>{
   const p=f.properties||{};
   if(year<p.start_year||year>p.observed_through_year||!featureContainsCoordinate(f,lon,lat))return false;
   return p.display_group==='control'?$('toggleControlAreas').checked:
    p.display_group==='political'?$('togglePoliticalRelations').checked:$('toggleHypotheses').checked;
  });
  if(historic){openTerritoryDossier(historic,'historic');return true;}
 }
 if($('toggleKingdom').checked){
  const polity=sovereigntyReferenceAreas.find(x=>featureContainsCoordinate(x.feature,lon,lat));
  if(polity){openPolity(polity.group);return true;}
 }
 return false;
}
function updateVisibility(){
 for(const [id,group] of [['toggleKingdom',groups.kingdom],['toggleRoutes',groups.routes],['toggleCandidates',groups.candidate],['toggleClaims',groups.claim]]){
  if($(id).checked){if(!map.hasLayer(group))map.addLayer(group)}
  else if(map.hasLayer(group))map.removeLayer(group);
 }
 if(!map.hasLayer(groups.cluster))map.addLayer(groups.cluster);
}
// The chapter registry is the only authority for published decade cards.
// Future centuries remain navigable, but never render fictitious future atlas states.
const decadeForYear=y=>Math.floor(y/10)*10;
const chapterForDecade=d=>chapterRegistry?.chapters?.find(c=>c.start<=d+9&&c.end>=d);
const chapterForYear=y=>chapterRegistry?.chapters?.find(c=>c.start<=y&&y<=c.end);
// 1497–1499 is an exceptional prologue; normal pages align to 1500–1549 / 1550–1599.
const halfCenturyPageForYear=y=>y<1500?1490:Math.floor(y/50)*50;
const pageForBrowse=d=>d<=1490?1490:Math.floor(d/50)*50;
const clampBrowseDecade=d=>Math.max(1490,Math.min(2050,pageForBrowse(d)));
const adjacentHalfCenturyPage=(current,direction)=>current===1490&&direction>0?1550:
 current===1550&&direction<0?1500:clampBrowseDecade(current+direction*50);
function timelineStatus(message){$('timelineNotice').textContent=message||''}
function browseDecade(decade){
 browsingDecade=clampBrowseDecade(decade);
 renderTimelineNavigation();
 // Navigation is deliberately read-only until the reader selects published data.
 if(browsingDecade!==halfCenturyPageForYear(year))timelineStatus('仅浏览章节目录。地图仍显示'+year+'年；尚未发布的年代不能作为历史地图查看。');
 else timelineStatus('');
}
function browseCentury(century){
 const first=chapterRegistry.navigation.firstDecade;
 browseDecade(century===1400?1490:Math.max(first,century));
}
function renderTimelineNavigation(){
 if(!chapterRegistry)return;
 const cent=$('centuryNav'),start=chapterRegistry.navigation.firstCentury,end=chapterRegistry.navigation.lastCentury;
 cent.innerHTML=Array.from({length:(end-start)/100+1},(_,i)=>{
  const century=start+i*100,chosen=Math.floor(browsingDecade/100)*100===century;
  // Also retain a subtle cue showing the period the map is actually displaying.
  const actual=Math.floor(year/100)*100===century;
  return '<button type="button" class="timeline-century'+(chosen?' viewing':'')+(actual?' map-current':'')+
   '" data-century="'+century+'" aria-pressed="'+chosen+'" title="'+(century+1)+'—'+(century+100)+'年 · 浏览世纪（不会改动地图）">'+(i+15)+'世纪</button>';
 }).join('');
 cent.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>browseCentury(Number(btn.dataset.century))));
 // The first chapter (1497–1509) occupies one fixed-width card on either
 // 15th/16th-century browser entry. Avoid the two-slot/one-slot size jump.
 const firstVisibleDecade=browsingDecade===1490?1500:browsingDecade;
 const frame=$('chapterTrack'),decades=Array.from({length:5},(_,i)=>firstVisibleDecade+i*10);
 // A chapter may span several decade slots (1497–1509). Display its card once.
 const renderedChapters=new Set();
 frame.innerHTML=decades.map((d,i)=>{
  if(d<chapterRegistry.navigation.firstDecade||d>chapterRegistry.navigation.lastDecade)
   return '<span class="chapter-placeholder" aria-hidden="true"></span>';
  const chapter=chapterForDecade(d),published=!!chapter;
  if(chapter&&renderedChapters.has(chapter.id))return '';
  if(chapter)renderedChapters.add(chapter.id);
  const from=chapter?chapter.start:d,to=chapter?chapter.end:d+9;
  const onMap=published&&year>=from&&year<=to;
  return '<button type="button" class="chapter-segment'+(published?' published':' unpublished')+
    (i===2?' centered':'')+(onMap?' active':'')+'" data-decade="'+d+
    '" aria-pressed="'+onMap+'" title="'+escapeHTML(published?'跳到'+Math.max(d,from)+'年：'+chapter.label:'此十年尚无正式历史资料')+'">'+
    '<span>'+(published?'第'+chapter.number+'章':'尚未发布')+'</span>'+
    '<small>'+from+'—'+to+(published?' · '+escapeHTML(chapter.label):' · 待研究')+'</small></button>';
 }).join('');
 frame.querySelectorAll('button[data-decade]').forEach(btn=>btn.addEventListener('click',()=>{
  const decade=Number(btn.dataset.decade),chapter=chapterForDecade(decade);
  if(!chapter){
   timelineStatus(decade+'—'+(decade+9)+'年暂无已审核地图资料，仍显示'+year+'年。');
   return;
  }
  stopPlay();setYear(Math.max(decade,chapter.start));
 }));
 $('browseDecadePrev').disabled=browsingDecade<=chapterRegistry.navigation.firstDecade;
 $('browseDecadeNext').disabled=browsingDecade>=2050;
 const currentChapter=chapterForYear(year);
 if(currentChapter){
  const slider=$('yearRange');
  slider.min=currentChapter.start;slider.max=currentChapter.end;slider.value=year;
  $('yearStartLabel').textContent=currentChapter.start;
  $('yearEndLabel').textContent=currentChapter.end;
  $('localYearTitle').textContent=year+'年';
  $('jumpYear').max=lastPublishedYear;
  $('jumpYear').value=year;
 }
 $('timelineAvailability').textContent=browsingDecade===halfCenturyPageForYear(year)
  ?'逐年精确选择 · 已发布至'+lastPublishedYear+'年'
  :'浏览目录中 · 地图为'+year+'年';
}
function setYear(v){
 const next=Math.max(1497,Math.min(lastPublishedYear,Math.round(Number(v)||1497)));
 const chosen=next>=1590?atlasEleventh:next>=1580?atlasTenth:next>=1570?atlasNinth:next>=1560?atlasEighth:next>=1550?atlasSeventh:next>=1540?atlasSixth:next>=1530?atlasFifth:next>=1520?atlasFourth:next>=1510?atlasThird:atlasFirstMerged;
 if(!chosen)return;
 // Keep map viewport and open dossier; avoid displaying a selected event from the future.
 if(selectedItemYear!==null&&selectedItemYear>next){
  selected='';selectedItemYear=null;
  $('dossierBody').innerHTML='<div class="dossier-kicker">历史地图 · '+next+'年</div><h2>当年历史</h2><p>请选择此时已发生的历史记录。</p>';
 }
 if(focusedEventId&&!chosen.events.some(e=>e.id===focusedEventId&&occurredByYear(e,next)))focusedEventId=null;
 focusRequestToken++;
 // Full-archive preview belongs to one chapter; never carry future events into the next.
 if(atlas&&chosen!==atlas)$('showFullChapterArchive').checked=false;
 const changedYear=year!==next;
 year=next;atlas=chosen;
 $('bigYear').textContent=year;$('timeYear').textContent=year;
 const first=year<1500,second=year>=1500&&year<1510,third=year>=1510&&year<1520,fourth=year>=1520&&year<1530,fifth=year>=1530&&year<1540,sixth=year>=1540&&year<1550,seventh=year>=1550&&year<1560,eighth=year>=1560&&year<1570,ninth=year>=1570&&year<1580,tenth=year>=1580&&year<1590,eleventh=year>=1590;
 $('chapterNav').textContent=sixth?'历史地图 · 第六章':fifth?'历史地图 · 第五章':fourth?'历史地图 · 第四章':third?'历史地图 · 第三章':second?'历史地图 · 第二章':'历史地图 · 第一章';
 $('chapterNavName').textContent=sixth?'布洛涅与战争边区':fifth?'法权与边区':fourth?'边区与远航':third?'王冠越过海峡':second?'通往未知海岸的第二程':'远航与主权宣称';
 $('chapterLabel').textContent=sixth?'第六章 · 1540—1549':fifth?'第五章 · 1530—1539':fourth?'第四章 · 1520—1529':third?'第三章 · 1510—1519':second?'第二章 · 1500—1509':'第一章 · 1497—1499';
 $('chapterTitlePrimary').textContent=sixth?'布洛涅与':fifth?'王权与':fourth?'边区与':third?'王冠越过':second?'通往未知海岸':'大西洋彼岸';
 $('chapterTitleSecondary').textContent=sixth?'英苏边境':fifth?'边区变动':fourth?'远航':third?'海峡':second?'的第二程':'的第一道声索';
 $('chapterIntro').textContent=sixth?(typeof atlasSixth.intro==='string'?atlasSixth.intro:atlasSixth.intro?.description||''):fifth?(typeof atlasFifth.intro==='string'?atlasFifth.intro:atlasFifth.intro?.description||''):fourth?(typeof atlasFourth.intro==='string'?atlasFourth.intro:atlasFourth.intro?.description||''):third?atlasThird.intro.description:second?atlasLater.intro.description:earlyIntro;
 $('factA').textContent=sixth?(year>=1544?'布洛涅':'加来'):fifth?'加来':fourth?'加来':third?(year>=1513?'1513':'—'):second?'加来':'0';
 $('factADesc').innerHTML=sixth?(year>=1544?'英军占领布洛涅<br>局部驻军持续':'加来英王据点<br>仍在控制'):fifth?'英王驻军据点<br>持续控制':fourth?'英王控制核心<br>持续存在':third?(year>=1513?'弗洛登战役<br>苏格兰国王阵亡':''):second?'英王在法国的<br>控制据点':'已证实北美<br>永久殖民据点';
 $('factB').textContent=sixth?(year>=1547?'1547':year>=1544?'1544':'—'):fifth?(year>=1534?'1534':'—'):fourth?(year>=1523?'1523':'—'):third?(year>=1513?'1513':'—'):second?(year>=1502?'1502':'—'):'1497';
 $('factBDesc').innerHTML=sixth?(year>=1547?'苏格兰边区<br>英军临时据点':year>=1544?'法国布洛涅<br>英军夺城':''):fifth?(year>=1534?'都柏林防守<br>基尔代尔叛乱':''):fourth?(year>=1523?'边区战事':''):third?(year>=1513?'英军占领<br>图尔奈':''):second?(year>=1502?'英格兰与苏格兰<br>缔结和约':''):'英格兰远航<br>抵达北美沿岸';
 $('factC').textContent=sixth?(year>=1549?'1549':year>=1546?'1546':'—'):fifth?(year>=1535?'1535':'—'):fourth?(year>=1527?'1527':'—'):third?(year>=1519?'1519':'—'):second?(year>=1504?'1504':'—'):(year>=1498?'1498':'—');
 $('factCDesc').innerHTML=sixth?(year>=1549?'外围堡垒失守<br>布洛涅仍英占':year>=1546?'法国外围英军<br>增筑堡垒':''):fifth?(year>=1535?'梅努斯城堡<br>王室攻取':''):fourth?(year>=1527?'北美远航':''):third?(year>=1519?'英军撤离<br>图尔奈':''):second?(year>=1504?'爱尔兰<br>诺克多战役':''):(year>=1498?'第二次远航<br>后续出航':'');
 $('periodTitle').textContent=sixth?(year>=1547?'爱德华六世 · 英格兰王国':'亨利八世 · 英格兰王国'):fifth?'亨利八世 · 英格兰王国':fourth?'亨利八世 · 英格兰王国':third?'亨利八世 · 英格兰王国':second?(year===1509?'亨利八世 · 王位更替':'亨利七世 · 英格兰王国'):(year===1497?'亨利七世 · 首次远航':year===1498?'亨利七世 · 第二次远航':'亨利七世 · 英格兰王国');
 if(seventh){
  $('chapterNav').textContent='历史地图 · 第七章';
  $('chapterNavName').textContent='撤军、殖民与加来失守';
  $('chapterLabel').textContent='第七章 · 1550—1559';
  $('chapterTitlePrimary').textContent='撤军、殖民与';
  $('chapterTitleSecondary').textContent='加来失守';
  $('chapterIntro').textContent=atlasSeventh.intro||'';
  $('factA').textContent=year>=1558?'法国接管':'加来';
  $('factADesc').innerHTML=year>=1558?'英王大陆边区驻军<br>1558年结束':'英王加来边区驻军<br>延续至1557年底';
  $('factB').textContent=year>=1556?'1556':'1550';
  $('factBDesc').innerHTML=year>=1556?'爱尔兰中部殖民<br>设郡与地方抵抗':'布洛涅与苏格兰<br>英军撤离';
  $('factC').textContent=year>=1558?'1558':year>=1555?'1555':'—';
  $('factCDesc').innerHTML=year>=1558?'法国攻取加来<br>及吉讷':year>=1555?'西非人口奴役<br>与莫斯科贸易':'';
  $('periodTitle').textContent=year<=1552?'爱德华六世 · 英格兰王国':year<=1557?'玛丽一世 · 英格兰王国':'伊丽莎白一世 · 英格兰王国';
 }
 if(eighth){
  $('chapterNav').textContent='历史地图 · 第八章';
  $('chapterNavName').textContent='三角贸易与海上掠夺';
  $('chapterLabel').textContent='第八章 · 1560—1569';
  $('chapterTitlePrimary').textContent='奴隶贸易与';
  $('chapterTitleSecondary').textContent='大西洋掠夺';
  $('chapterIntro').textContent=atlasEighth.intro;
  $('factA').textContent=year>=1563?'法国收复':year>=1562?'英军驻城':'—';
  $('factADesc').innerHTML=year>=1563?'1563勒阿弗尔<br>法军收复':year>=1562?'1562勒阿弗尔<br>英军短期驻城':'苏格兰主权<br>持续独立';
  $('factB').textContent=year>=1567?'1567':year>=1564?'1564':year>=1562?'1562':'—';
  $('factBDesc').innerHTML='西非人口奴役<br>与跨大西洋贩运';
  $('factC').textContent=year>=1569?'1569':year>=1568?'1568':'—';
  $('factCDesc').innerHTML=year>=1569?'爱尔兰地方反抗<br>与王室镇压':year>=1568?'英西海战<br>第三次奴役航次':'';
  $('periodTitle').textContent='伊丽莎白一世 · 英格兰王国';
 }
 if(ninth){
  $('chapterNav').textContent='历史地图 · 第九章';
  $('chapterNavName').textContent='殖民暴力与海外掠夺';
  $('chapterLabel').textContent='第九章 · 1570—1579';
  $('chapterTitlePrimary').textContent='殖民暴力与';
  $('chapterTitleSecondary').textContent='海外掠夺';
  $('chapterIntro').textContent=atlasNinth.intro;
  $('factA').textContent=year>=1575?'拉斯林':year>=1574?'贝尔法斯特':year>=1572?'阿兹':'—';
  $('factADesc').innerHTML=year>=1575?'1575英军屠杀<br>守军与避难平民':year>=1574?'1574英军屠杀<br>盖尔居民':'阿兹私人殖民<br>遭遇当地抵抗';
  $('factB').textContent=year>=1579?'1579':year>=1576?'1576':'—';
  $('factBDesc').innerHTML=year>=1579?'德雷克金银劫掠<br>德斯蒙德战争':year>=1576?'洛赫雷英军驻堡<br>1579前持续':'';
  $('factC').textContent=year>=1578?'1578':year>=1577?'1577':'—';
  $('factCDesc').innerHTML='因纽特人遭绑架<br>北极矿业失败';
  $('periodTitle').textContent='伊丽莎白一世 · 英格兰王国';
 }
 if(tenth){
  $('chapterNav').textContent='历史地图 · 第十章';
  $('chapterNavName').textContent='焦土、奴役与殖民地契';
  $('chapterLabel').textContent='第十章 · 1580—1589';
  $('chapterTitlePrimary').textContent='焦土、奴役与';
  $('chapterTitleSecondary').textContent='殖民地契';
  $('chapterIntro').textContent=atlasTenth.intro;
  $('factA').textContent=year>=1586?'1586':'1580';
  $('factADesc').innerHTML=year>=1586?'芒斯特殖民地契<br>土地没收制度':'斯梅里克大屠杀<br>洛赫雷收复';
  $('factB').textContent=year>=1587?'1587':year>=1585?'1585':'—';
  $('factBDesc').innerHTML=year>=1587?'罗阿诺克第二批<br>殖民定居':year>=1585?'罗阿诺克殖民者<br>焚毁原住民村落':'';
  $('factC').textContent=year>=1589?'1589':year>=1586?'1586':'—';
  $('factCDesc').innerHTML=year>=1589?'英军袭掠<br>拉科鲁尼亚与维戈':year>=1586?'德雷克舰队掠夺<br>加勒比港口':'';
  $('periodTitle').textContent='伊丽莎白一世 · 英格兰王国';
 }
 if(eleventh){
  $('chapterNav').textContent='历史地图 · 第十一章';
  $('chapterNavName').textContent='镇压、反抗与跨洋劫掠';
  $('chapterLabel').textContent='第十一章 · 1590—1599';
  $('chapterTitlePrimary').textContent='镇压、反抗与';
  $('chapterTitleSecondary').textContent='跨洋劫掠';
  $('chapterIntro').textContent=atlasEleventh.intro;
  $('factA').textContent=year>=1598?'1598':year>=1594?'1594':'1590';
  $('factADesc').innerHTML=year>=1598?'黄福特战役<br>英军丧失驻堡':year>=1594?'九年战争<br>英军夺堡与抵抗':'爱尔兰军政扫荡<br>镇压地方领主';
  $('factB').textContent=year>=1596?'1596':year>=1595?'1595':'—';
  $('factBDesc').innerHTML=year>=1596?'英荷军队攻掠加的斯':year>=1595?'累西腓短期被掠<br>贸易货物遭夺':'';
  $('factC').textContent=year>=1599?'1599':year>=1598?'1598':'—';
  $('factCDesc').innerHTML=year>=1599?'卡希尔夺堡<br>埃塞克斯爱尔兰战事':year>=1598?'圣胡安短暂占领<br>撤军后归西班牙':'';
  $('periodTitle').textContent='伊丽莎白一世 · 英格兰王国';
 }
 // Use publication manifest chapter numbering; historical archive files retain legacy IDs.
 const displayChapter=chapterForYear(year);
 if(displayChapter){
  const numerals=['','一','二','三','四','五','六','七','八','九','十'];
  const heading='第'+(numerals[displayChapter.number]||displayChapter.number)+'章';
  $('chapterNav').textContent='历史地图 · '+heading;
  $('chapterNavName').textContent=displayChapter.label;
  $('chapterLabel').textContent=heading+' · '+displayChapter.start+'—'+displayChapter.end;
  if(year<1510){
   $('chapterTitlePrimary').textContent='大西洋远航与';
   $('chapterTitleSecondary').textContent='王室扩张';
   $('chapterIntro').textContent=atlasFirstMerged.intro;
  }
 }
 browsingDecade=halfCenturyPageForYear(year);renderTimelineNavigation();timelineStatus('');
 $('timelineContext').textContent=displayChapter?$('chapterLabel').textContent+'年事件':'';
 $('timelineNotice').textContent='';
 renderEventList();renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderPoints();renderHypotheses();renderWartimeVicinities();renderWarReachCorridors();renderContestedZones();renderWartimeControls();renderSeventhControlSites();renderArchaeologyReferences();renderEighthControlSites();renderEighthCoastalActivity();renderNinthControlSites();renderTenthControlSites();renderTenthInvasionImpactAreas();renderTenthLandRaidImpactAreas();renderEleventhControlCores();renderEleventhInfluenceAreas();renderNineYearsWarImpact();renderAtlanticContactSites();renderChapter11ActionLinks();renderEarlyRegionalImpactAreas();renderHistoricalRegionGuide();
 if(changedYear)$('eventList').scrollTop=0;
}
function stopPlay(){if(timer){clearInterval(timer);timer=null;$('playBtn').textContent='▶'}}
function togglePlay(){if(timer){stopPlay();return}if(year===lastPublishedYear)setYear(1497);$('playBtn').textContent='Ⅱ';timer=setInterval(()=>{if(year===lastPublishedYear){stopPlay();return}setYear(year+1)},1250)}
async function loadKingdomBoundaries(){
 // ONS regional geometry is MODERN and only a geographic reference, never a 1497 boundary reconstruction.
 try{
  if(typeof topojson==='undefined')throw new Error('TopoJSON decoder unavailable');
  const uri='data/modern-uk-regions.topojson';
  const res=await fetch(uri);if(!res.ok)throw new Error('HTTP '+res.status);
  const topology=await res.json();
  const objects=topology.objects||{};
  const first=objects[Object.keys(objects)[0]];if(!first)throw new Error('No TopoJSON geometry');
  let geo=topojson.feature(topology,first);
  const features=geo.type==='FeatureCollection'?geo.features:[geo];
  sovereigntyReferenceAreas=[];
  let count=0;
  for(const f of features){
   const p=Object.values(f.properties||{}).filter(v=>typeof v==='string').join(' ').toLowerCase();
   let group=null;
   if(p.includes('scotland'))group='scotland';
   else if(p.includes('wales'))group='wales';
   else if(/north east|north west|yorkshire|east midlands|west midlands|east of england|london|south east|south west/.test(p))group='england';
   if(!group)continue;
   sovereigntyReferenceAreas.push({feature:f,group});
   count++;
   const c=group==='scotland'?'#588ba8':group==='wales'?'#a78acb':'#815fd5';
   const layer=L.geoJSON(f,{renderer:sovereigntyRenderer,pane:'sovereigntyPane',interactive:true,bubblingMouseEvents:false,
     style:{color:c,weight:group==='wales'?1.8:1.4,dashArray:group==='wales'?'6 5':null,fillColor:c,fillOpacity:group==='scotland'?.25:group==='wales'?.18:.35,opacity:.95},
     onEachFeature:(_feature,shape)=>shape.on('click',e=>{
       if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
       openPolity(group);
     })
    }).addTo(groups.kingdom);
  }
  if(!count)throw new Error('Region names could not be decoded');
  hideWarning();
 }catch(err){console.warn('Modern background geography unavailable',err);}
}
function openPolity(group){
 const p=atlasEarly.polities.find(x=>x.id===(group==='scotland'?'scotland':'england'));if(!p)return;
 const title=group==='wales'?'英王治下的威尔士':p.name;
 const isScotland=group==='scotland';
 const text=isScotland?
  (year>=1567?'1567年玛丽女王被迫退位，幼王詹姆斯六世继位；1568年朗赛德等内战仍属于苏格兰王国内部的权力斗争，国家并未被英格兰兼并。':year>=1561?'1561年玛丽女王返回苏格兰执政，王国主权始终独立；法军此前驻守的军堡不能等同法国或英国吞并苏格兰。':year>=1560?'1560年利斯围城与条约使法国驻军撤离，英军亦撤出，苏格兰继续保持独立。':year>=1542?'1542年詹姆斯五世去世，玛丽女王继承苏格兰王位，国内由摄政机构与王国贵族参与治理。1540年代英格兰在若干城堡驻军，苏格兰王国整体仍独立。':year>=1513?'1513年弗洛登战役中詹姆斯四世阵亡，幼王詹姆斯五世继位。苏格兰由摄政机构与王国贵族参与治理，继续保持独立王权。':'詹姆斯四世统治下的苏格兰王国由王室、议会、贵族和地方氏族共同参与治理。'):
  (year>=1558?'1558年加来、吉讷已被法国夺取，英王在法国大陆的旧驻军控制告终。苏格兰仍是独立王国，英王在爱尔兰的殖民军堡只涉及有限据点。':year>=1550?'1550年布洛涅归还法国，苏格兰布劳蒂等英占军堡被夺回；英王继续在加来、吉讷驻军直至1558年，苏格兰国家主权并未中断。':year>=1547?'爱德华六世于1547年继承英格兰王位。英军继续驻守加来和布洛涅，并在苏格兰部分城堡驻军；英军局部占领没有使苏格兰王国整体归属英格兰。':year>=1509?'亨利八世统治英格兰，英王在加来驻有官员和军队，并通过地方贵族及都柏林机构管理爱尔兰的部分区域。':'都铎王朝英王统治英格兰本土，王室在加来设有军政机构，爱尔兰的部分区域由王室委任地方官员治理。');
 const sources=(p.source_ids||[]).concat(isScotland&&year>=1513?['NRS-FLODDEN']:[]).concat(isScotland&&year>=1542?['SC-HES-2022-HADDINGTON']:[]);
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史国家 · '+year+'年</div><h2>'+escapeHTML(title)+'</h2><p>'+escapeHTML(text)+'</p>'+listSources(sources,p);
 openPanel('dossier');
}
async function boot(){
 try{
  const [res,laterRes,thirdRes,fourthRes,fifthRes,sixthRes,seventhRes,eighthRes,ninthRes,tenthRes,eleventhRes,combinedRes]=await Promise.all([
    fetch('data/atlas-1497-1500.json',{cache:'no-store'}),
    fetch('data/atlas-1500-1509.json',{cache:'no-store'}),
    fetch('data/atlas-1510-1519.json',{cache:'no-store'}),
    fetch('data/atlas-1520-1529.json',{cache:'no-store'}),
    fetch('data/atlas-1530-1539.json',{cache:'no-store'}),
    fetch('data/atlas-1540-1549.json',{cache:'no-store'}),
    fetch('data/atlas-1550-1559.json',{cache:'no-store'}),
    fetch('data/atlas-1560-1569.json',{cache:'no-store'}),
    fetch('data/atlas-1570-1579.json',{cache:'no-store'}),
    fetch('data/atlas-1580-1589.json',{cache:'no-store'}),
    fetch('data/atlas-1590-1599.json',{cache:'no-store'}),
    fetch('data/atlas-1497-1509.json',{cache:'no-store'})
  ]);
  if(!res.ok||!laterRes.ok||!thirdRes.ok||!fourthRes.ok||!fifthRes.ok||!sixthRes.ok||!seventhRes.ok||!eighthRes.ok||!ninthRes.ok||!tenthRes.ok||!eleventhRes.ok||!combinedRes.ok)throw new Error('历史切片未正确加载');
  atlasEarly=await res.json();
  atlasLater=await laterRes.json();
  atlasThird=await thirdRes.json();
  atlasFourth=await fourthRes.json();
  atlasFifth=await fifthRes.json();
   atlasSixth=await sixthRes.json();
  atlasSeventh=await seventhRes.json();
  atlasEighth=await eighthRes.json();
  atlasNinth=await ninthRes.json();
  atlasTenth=await tenthRes.json();
  atlasEleventh=await eleventhRes.json();
  atlasFirstMerged=await combinedRes.json();
  const drakeRes=await fetch('data/drake-circumnavigation-1577-1580.json',{cache:'no-store'});
  if(!drakeRes.ok)throw new Error('德雷克环球航线补丁数据未能加载');
  drakeCircumnavigation=await drakeRes.json();
  if(drakeCircumnavigation.voyage_id!=='drake-circumnavigation-1577-1580'||
     !Array.isArray(drakeCircumnavigation.routes)||!Array.isArray(drakeCircumnavigation.duplicate_old_route_ids)||
     drakeCircumnavigation.routes.length!==14||!window.AtlasVoyageGeometry)
   throw new Error('德雷克1577—1580航线补丁结构错误');
  const chapterRes=await fetch('data/chapters.json',{cache:'no-store'});
  if(!chapterRes.ok)throw new Error('章节目录未正确加载');
  chapterRegistry=await chapterRes.json();
  if(!Array.isArray(chapterRegistry?.chapters)||!chapterRegistry.chapters.length)throw new Error('历史章节目录为空');
  const ordered=chapterRegistry.chapters;
  if(ordered.some((c,i)=>c.status!=='published'||!Number.isInteger(c.start)||!Number.isInteger(c.end)||c.end<c.start||(i>0&&c.start!==ordered[i-1].end+1)))throw new Error('历史章节时间顺序或审核状态错误');
  lastPublishedYear=ordered[ordered.length-1].end;
  if(!Array.isArray(atlasEarly.events)||!Array.isArray(atlasLater.events)||!Array.isArray(atlasLater.places)||!Array.isArray(atlasThird.events)||!Array.isArray(atlasThird.places)||!Array.isArray(atlasFourth.events)||!Array.isArray(atlasFourth.places)||!Array.isArray(atlasFifth.events)||!Array.isArray(atlasFifth.places)||!Array.isArray(atlasSixth.events)||!Array.isArray(atlasSixth.places)||!Array.isArray(atlasSeventh.events)||!Array.isArray(atlasSeventh.places)||!Array.isArray(atlasEighth.events)||!Array.isArray(atlasEighth.places)||!Array.isArray(atlasNinth.events)||!Array.isArray(atlasNinth.places)||!Array.isArray(atlasTenth.events)||!Array.isArray(atlasTenth.places)||!Array.isArray(atlasEleventh.events)||!Array.isArray(atlasEleventh.places)||!Array.isArray(atlasFirstMerged.events)||!Array.isArray(atlasFirstMerged.places))throw new Error('历史数据结构错误');
  // Constant-time citation lookup across all published years.
  for(const dataset of [atlasFirstMerged,atlasEarly,atlasLater,atlasThird,atlasFourth,atlasFifth,atlasSixth,atlasSeventh,atlasEighth,atlasNinth,atlasTenth,atlasEleventh])
   for(const source of dataset.sources||[])sourcesById.set(source.id,source);
  const spatialCitationResponse=await fetch('data/spatial-citation-registry.json',{cache:'no-store'});
  if(!spatialCitationResponse.ok)throw new Error('历史地理独立文献索引未能读取');
  const spatialCitations=await spatialCitationResponse.json();
  if(!Array.isArray(spatialCitations.sources))throw new Error('历史地理独立文献索引格式错误');
  for(const source of spatialCitations.sources){
   if(typeof source.id!=='string'||!/^https:\/\//.test(source.url)||!source.title||!source.publisher)
    throw new Error('历史地理独立文献索引来源不完整');
   if(!sourcesById.has(source.id))sourcesById.set(source.id,source);
  }
  try{
   const iconResponse=await fetch('data/icon-categories.json',{cache:'no-store'});
   if(iconResponse.ok)iconCatalog=await iconResponse.json();
  }catch(_e){ /* Existing fallback codes remain available. */ }
  try{
   const [notesResponse,geoResponse,thirdGeoResponse,controlResponse,politicalResponse,footprintResponse,wartimeResponse,occupiedResponse,contestedResponse,warReachResponse]=await Promise.all([
    fetch('data/historical-detail-notes.json',{cache:'no-store'}),
    fetch('data/geography-hypotheses-1500-1529.geojson',{cache:'no-store'}),
    fetch('data/geography-1510-1519-hypotheses.geojson',{cache:'no-store'}),
    fetch('data/french-urban-control-1497-1549.geojson',{cache:'no-store'}),
    fetch('data/political-relations-1500-1549.geojson',{cache:'no-store'}),
    fetch('data/territorial-footprints-1497-1549.geojson',{cache:'no-store'}),
     fetch('data/military-control-points-1540-1549.geojson',{cache:'no-store'}),
     fetch('data/war-occupied-zones-1540-1549.geojson',{cache:'no-store'}),
     fetch('data/war-contested-zones-1540-1549.geojson',{cache:'no-store'}),
     fetch('data/war-front-corridors-1540-1549.geojson',{cache:'no-store'})
   ]);
   if(notesResponse.ok)researchNotes=(await notesResponse.json()).records||{};
   const ninthNotesResponse=await fetch('data/chapter9-detail-notes.json',{cache:'no-store'});
   if(ninthNotesResponse.ok)Object.assign(researchNotes,(await ninthNotesResponse.json()).records||{});
   const tenthNotesResponse=await fetch('data/chapter10-detail-notes.json',{cache:'no-store'});
   if(!tenthNotesResponse.ok)throw new Error('第十章历史文献加载失败');
   Object.assign(researchNotes,(await tenthNotesResponse.json()).records||{});
   const eleventhNotesResponse=await fetch('data/chapter11-detail-notes.json',{cache:'no-store'});
   if(!eleventhNotesResponse.ok)throw new Error('第十一章史料文件缺失');
   Object.assign(researchNotes,(await eleventhNotesResponse.json()).records||{});
   if(geoResponse.ok)geographicHypotheses=await geoResponse.json();
   if(thirdGeoResponse.ok)geographicHypothesesThird=await thirdGeoResponse.json();
   if(controlResponse.ok)frenchCityAreas=await controlResponse.json();
   if(politicalResponse.ok)politicalRelationAreas=await politicalResponse.json();
   if(footprintResponse.ok)territorialFootprints=await footprintResponse.json();
    if(wartimeResponse.ok)militaryControlPoints=await wartimeResponse.json();
    if(occupiedResponse.ok)occupiedZoneAreas=await occupiedResponse.json();
    if(contestedResponse.ok)contestedZoneAreas=await contestedResponse.json();
    if(warReachResponse.ok)warReachAreas=await warReachResponse.json();
  }catch(_e){ /* Text and all vetted history records remain usable. */ }
  // Official HES modern monument geometry is optional visual context, never occupation.
  const hesReferenceResponse=await fetch('data/issue46-hes-archaeology-reference-1547-1549.geojson',{cache:'no-store'});
  if(!hesReferenceResponse.ok)throw new Error('第六章HES考古参考范围未加载');
  archaeologicalReferenceAreas=await hesReferenceResponse.json();
  if(archaeologicalReferenceAreas?.features?.length!==3||
     archaeologicalReferenceAreas.features.some(f=>f.properties?.fill_authorized!==false||f.properties?.historical_boundary_confirmed!==false))
   throw new Error('拒绝把现代古迹保护区当作英国1547实测占地');
  map.attributionControl.addAttribution('Contains HES and OS data © HES and Crown Copyright/database right 2026 · OGL v3.0');
  // Reconstruct the dated GeoJSON views from one immutable 1497–1549
  // geographic reference. No new border is inferred and no cloned coordinate
  // arrays are stored for following decades.
  if(!territorialFootprints?.features?.length||typeof AtlasTerritoryGeometry==='undefined')
   throw new Error('共享领土地理基准未正确加载');
  // Take a fixed seven-feature canonical snapshot before appending dated states.
  const canonicalTerritory={type:'FeatureCollection',features:territorialFootprints.features.slice()};
  const hydrateTerritoryPeriod=period=>AtlasTerritoryGeometry.hydrateFootprints(canonicalTerritory,period);
  // New chapter keeps original 1497–1549 layer references intact. Older layers
  // have closed year intervals; append dated seventh-chapter continuations.
  const [geo7,relation7,urban7,sites7]=await Promise.all([
   fetch('data/territorial-footprints-1550-1559.geojson',{cache:'no-store'}),
   fetch('data/political-relations-1550-1559.geojson',{cache:'no-store'}),
   fetch('data/french-urban-control-1550-1559.geojson',{cache:'no-store'}),
   fetch('data/seventh-control-sites-1550-1559.geojson',{cache:'no-store'})
  ]);
  if(!geo7.ok||!relation7.ok||!urban7.ok||!sites7.ok)
   throw new Error('第七章政治控制地理图层未能加载');
  const [newFootprints,newRelations,newUrban,newMilitary]=await Promise.all([
   geo7.json(),relation7.json(),urban7.json(),sites7.json()
  ]);
  if(!territorialFootprints||!politicalRelationAreas||!frenchCityAreas)
   throw new Error('无法延续上一章政治控制资料');
  territorialFootprints.features.push(...hydrateTerritoryPeriod(newFootprints).features);
  politicalRelationAreas.features.push(...newRelations.features);
  frenchCityAreas.features.push(...newUrban.features);
  seventhControlSites=newMilitary;
  const [geo8,political8,city8,military8,coast8]=await Promise.all([
   fetch('data/territorial-footprints-1560-1569.geojson',{cache:'no-store'}),
   fetch('data/political-relations-1560-1569.geojson',{cache:'no-store'}),
   fetch('data/french-urban-control-1560-1569.geojson',{cache:'no-store'}),
   fetch('data/eighth-control-sites-1560-1569.geojson',{cache:'no-store'}),
   fetch('data/eighth-enslavement-coastal-activity-1560-1569.geojson',{cache:'no-store'})
  ]);
  if([geo8,political8,city8,military8,coast8].some(r=>!r.ok))throw new Error('第八章地图图层文件缺失');
  const [newGeo8,newRelations8,newUrban8,newMilitary8,newCoast8]=await Promise.all([
   geo8.json(),political8.json(),city8.json(),military8.json(),coast8.json()
  ]);
  if(newMilitary8.features?.length!==2||newCoast8.features?.length!==3||
   newCoast8.features.some(f=>f.properties?.fill_authorized!==false||f.properties?.map_layer!=='events'))
   throw new Error('奴隶掠卖活动不能误转为英国领土');
  territorialFootprints.features.push(...hydrateTerritoryPeriod(newGeo8).features);
  politicalRelationAreas.features.push(...newRelations8.features);
  frenchCityAreas.features.push(...newUrban8.features);
  eighthControlSites=newMilitary8;eighthSlaveCoastalAreas=newCoast8;
  const [geo9,relation9,urban9,site9]=await Promise.all([
   fetch('data/territorial-footprints-1570-1579.geojson',{cache:'no-store'}),
   fetch('data/political-relations-1570-1579.geojson',{cache:'no-store'}),
   fetch('data/french-urban-control-1570-1579.geojson',{cache:'no-store'}),
   fetch('data/ninth-control-sites-1570-1579.geojson',{cache:'no-store'})
  ]);
  if([geo9,relation9,urban9,site9].some(r=>!r.ok))throw new Error('第九章历史政治地理图层缺失');
  const [g9,p9,u9,s9]=await Promise.all([geo9.json(),relation9.json(),urban9.json(),site9.json()]);
  if(s9.features?.length!==3||s9.features.some(f=>f.geometry?.type!=='Point'||f.properties?.fill_authorized!==false||f.properties?.area_sqkm!==null))
   throw new Error('第九章军控研究图层未通过据点及面积校验');
  territorialFootprints.features.push(...hydrateTerritoryPeriod(g9).features);
  politicalRelationAreas.features.push(...p9.features);
  frenchCityAreas.features.push(...u9.features);
  ninthControlSites=s9;
  const [geo10,relation10,urban10,site10]=await Promise.all([
   fetch('data/territorial-footprints-1580-1589.geojson',{cache:'no-store'}),
   fetch('data/political-relations-1580-1589.geojson',{cache:'no-store'}),
   fetch('data/french-urban-control-1580-1589.geojson',{cache:'no-store'}),
   fetch('data/tenth-control-sites-1580-1589.geojson',{cache:'no-store'})
  ]);
  if([geo10,relation10,urban10,site10].some(r=>!r.ok))throw new Error('第十章地理图层加载失败');
  const [g10,p10,u10,s10]=await Promise.all([geo10.json(),relation10.json(),urban10.json(),site10.json()]);
  if(s10.features?.length!==3||s10.features.some(f=>f.geometry?.type!=='Point'||f.properties?.fill_authorized!==false||f.properties?.area_sqkm!==null))
   throw new Error('第十章军事据点数据不能充当实测占领面积');
  territorialFootprints.features.push(...hydrateTerritoryPeriod(g10).features);
  politicalRelationAreas.features.push(...p10.features);
  frenchCityAreas.features.push(...u10.features);
  tenthControlSites=s10;
  const impactResponse=await fetch('data/tenth-invasion-impact-areas-1580-1583.geojson',{cache:'no-store'});
  if(!impactResponse.ok)throw new Error('1580—1583芒斯特入侵影响区地图文件未加载');
  tenthInvasionImpactAreas=await impactResponse.json();
  const impactFeatures=tenthInvasionImpactAreas?.features;
  if(impactFeatures?.length!==2||impactFeatures.some(f=>
    f.geometry?.type!=='Polygon'||f.properties?.fill_authorized!==false||
    f.properties?.historical_boundary_confirmed!==false||f.properties?.territorial_claim!==false||
    f.properties?.area_sqkm!==null||
    !f.properties?.source_ids?.every(id=>sourcesById.has(id))))
   throw new Error('芒斯特影响区资料、几何或史料引用校验失败');
  const extractionResponse=await fetch('data/tenth-land-dispossession-and-raids-1584-1589.geojson',{cache:'no-store'});
  if(!extractionResponse.ok)throw new Error('1584—1589土地没收与德雷克劫掠影响区文件未加载');
  tenthLandRaidAreas=await extractionResponse.json();
  if(tenthLandRaidAreas?.features?.length!==5||tenthLandRaidAreas.features.some(f=>
    f.geometry?.type!=='Polygon'||f.properties?.fill_authorized!==false||
    f.properties?.historical_boundary_confirmed!==false||
    f.properties?.territorial_claim!==false||f.properties?.area_sqkm!==null||
    !f.properties?.source_ids?.every(id=>sourcesById.has(id))))
   throw new Error('殖民土地政策及港市劫掠地理面未通过史料与面积校验');


  const [geo11,relation11,urban11,core11,area11]=await Promise.all([
   fetch('data/territorial-footprints-1590-1599.geojson',{cache:'no-store'}),
   fetch('data/political-relations-1590-1599.geojson',{cache:'no-store'}),
   fetch('data/french-urban-control-1590-1599.geojson',{cache:'no-store'}),
   fetch('data/eleventh-control-cores-1590-1599.geojson',{cache:'no-store'}),
   fetch('data/eleventh-influence-areas-1590-1599.geojson',{cache:'no-store'})
  ]);
  if([geo11,relation11,urban11,core11,area11].some(r=>!r.ok))throw new Error('第十一章地图文件加载失败');
  const [g11,p11,u11,c11,a11]=await Promise.all([geo11.json(),relation11.json(),urban11.json(),core11.json(),area11.json()]);
  if(c11.features?.length!==10||a11.features?.length!==2||
   c11.features.some(f=>f.geometry?.type!=='Point'||f.properties?.fill_authorized!==false||f.properties?.area_sqkm!==null)||
   a11.features.some(f=>f.geometry?.type!=='Polygon'||f.properties?.fill_authorized!==false||f.properties?.area_sqkm!==null))
   throw new Error('第十一章未证实的控制地理面不可冒充实测边界');
  territorialFootprints.features.push(...hydrateTerritoryPeriod(g11).features);
  politicalRelationAreas.features.push(...p11.features);
  frenchCityAreas.features.push(...u11.features);
  eleventhControlCores=c11;eleventhInfluenceAreas=a11;
  const nineYearsRes=await fetch('data/nine-years-war-operational-impact-1594-1599.geojson',{cache:'no-store'});
  if(!nineYearsRes.ok)throw new Error('1594—1599九年战争地理资料未能读取');
  const nineYearsData=await nineYearsRes.json();
  if(nineYearsData?.features?.length!==4||nineYearsData.features.some(f=>{
   const p=f.properties||{};
   return !['Polygon','LineString'].includes(f.geometry?.type)||
    p.map_layer!=='territory'||p.historical_boundary_confirmed!==false||
    p.fill_authorized!==false||p.territorial_claim!==false||p.area_sqkm!==null||
    p.exclude_from_area_aggregation!==true||
    !p.source_ids?.every(id=>sourcesById.has(id))||
    !p.related_event_ids?.every(id=>atlasEleventh.events.some(e=>e.id===id));
  }))throw new Error('九年战争交战及远征地理资料存在无效史料或疆界声明');
  nineYearsWarImpact=nineYearsData;
  const linksRes=await fetch('data/ch11-action-links-1590-1599.geojson',{cache:'no-store'});
  if(!linksRes.ok)throw new Error('第十章军事行动关系线未加载');
  const linksData=await linksRes.json();
  if(linksData?.features?.length!==2||linksData.features.some(f=>{
   const p=f.properties||{},coords=f.geometry?.coordinates;
   return f.geometry?.type!=='LineString'||!Array.isArray(coords)||coords.length<2||
     p.map_layer!=='territory'||p.sequence_only!==true||
     p.historical_boundary_confirmed!==false||p.fill_authorized!==false||
     p.territorial_claim!==false||p.area_sqkm!==null||
     p.exclude_from_area_aggregation!==true||
     !p.source_ids?.every(id=>sourcesById.has(id))||
     !p.related_event_ids?.every(id=>atlasEleventh.events.some(e=>e.id===id));
  }))throw new Error('第十章有据行动关联线源证或疆域声明无效');
  chapter11ActionLinks=linksData;
  const regionalRes=await fetch('data/early-war-colonial-impact-1544-1575.geojson',{cache:'no-store'});
  if(!regionalRes.ok)throw new Error('早期战争与殖民地区说明文件未加载');
  const regionalData=await regionalRes.json();
  if(!regionalData?.features||regionalData?.metadata?.feature_count!==regionalData.features.length||regionalData.features.length<7||regionalData.features.some(f=>{
   const p=f.properties||{},ring=f.geometry?.coordinates?.[0];
   return f.geometry?.type!=='Polygon'||!ring||ring.length<4||
    p.historical_boundary_confirmed!==false||p.fill_authorized!==false||
    p.territorial_claim!==false||p.area_sqkm!==null||p.exclude_from_area_aggregation!==true||
    !p.summary_zh||!p.source_urls?.every(url=>/^https:\/\//.test(url))||
    !p.source_ids?.every(id=>sourcesById.has(id));
  }))throw new Error('新增地区军史叙事未通过史料或非疆界核验');
  earlyRegionalAreas=regionalData;
  const followupRes=await fetch('data/followup-regional-stories-1562-1596.geojson',{cache:'no-store'});
  if(!followupRes.ok)throw new Error('1562—1596地区军事行动叙事图层未加载');
  const laterRegions=await followupRes.json();
  if(laterRegions?.features?.length!==14||laterRegions.features.some(f=>{
   const p=f.properties||{},ring=f.geometry?.coordinates?.[0];
   return f.geometry?.type!=='Polygon'||!ring||ring.length<4||
    p.historical_boundary_confirmed!==false||p.fill_authorized!==false||
    p.territorial_claim!==false||p.area_sqkm!==null||p.exclude_from_area_aggregation!==true||
    !p.summary_zh||!p.source_urls?.length||!p.source_urls.every(u=>/^https:\/\//.test(u))||
    !p.source_ids?.every(id=>sourcesById.has(id));
  }))throw new Error('新增英军短占与劫掠地区资料不合规');
  followupRegionalAreas=laterRegions;
  const centuryRes=await fetch('data/century-violence-regions-1544-1589.geojson',{cache:'no-store'});
  if(!centuryRes.ok)throw new Error('1544—1589地区暴力空间补档未加载');
  const centuryData=await centuryRes.json();
  if(centuryData?.features?.length!==28||centuryData.features.some(f=>{
   const p=f.properties||{},ring=f.geometry?.coordinates?.[0];
   return f.geometry?.type!=='Polygon'||!ring||ring.length<4||
    p.historical_boundary_confirmed!==false||p.fill_authorized!==false||
    p.territorial_claim!==false||p.area_sqkm!==null||
    p.exclude_from_area_aggregation!==true||
    !p.summary_zh||!p.mapping_method||!p.named_anchors?.length||
    !p.source_urls?.length||!p.source_urls.every(u=>/^https:\/\//.test(u))||
    !p.source_ids?.length||!p.source_ids.every(id=>sourcesById.has(id))||
    !p.related_event_ids?.every(id=>[atlasSixth,atlasEighth,atlasNinth,atlasTenth].some(a=>a?.events?.some(e=>e.id===id)));
  }))throw new Error('地区暴力史事GIS非疆界准入或来源检查失败');
  centuryViolenceAreas=centuryData;
  const atlanticRes=await fetch('data/caribbean-maghreb-contact-raids-1551-1598.geojson',{cache:'no-store'});
  if(!atlanticRes.ok)throw new Error('加勒比与北非史料地理点未加载');
  const atlanticData=await atlanticRes.json();
  if(atlanticData?.features?.length!==13||atlanticData.features.some(f=>{
    const p=f.properties||{},geom=f.geometry||{};
    return !['Point','LineString','Polygon'].includes(geom.type)||
     p.map_layer!=='territory_reference_not_political_control'||
     p.historical_boundary_confirmed!==false||p.fill_authorized!==false||
     p.territorial_claim!==false||p.area_sqkm!==null||
     !Array.isArray(p.source_urls)||!p.source_urls.length||
     !p.source_urls.every(url=>/^https:\/\//.test(url))||
     !(p.source_ids||[]).every(id=>sourcesById.has(id))||
     !(p.related_event_ids||[]).every(id=>atlasEleventh.events.some(e=>e.id===id));
  }))throw new Error('加勒比及北非地理来源或非殖民性质校验失败');
  atlanticContactData=atlanticData;


  // Optional deep link: ?year=1510 opens the new historical decade, while the global atlas still starts in 1497.
  let startYear=1497;
  try{
   const param=new URLSearchParams(window.location?.search||'').get('year');
   if(param && /^[0-9]{4}$/.test(param))startYear=Number(param);
  }catch(_error){}
  // Open each load in chronological mode. Full-period archival preview stays opt-in.
  $('showFullChapterArchive').checked=false;
  setYear(startYear);loadKingdomBoundaries();
 }catch(e){
  $('eventList').innerHTML='<div class="loading">无法读取历史资料，请刷新页面或查看 GitHub 原始数据。</div>';
  setWarning('历史数据未能加载：'+String(e.message||e));
 }
}
$('mobileEventsToggle').addEventListener('click',()=>{
 if(workspace.classList.contains('sidebar-collapsed'))openPanel('sidebar');
 else{
  workspace.classList.add('sidebar-collapsed');
  syncMobileEventsButton();syncPanels();
 }
});
compactMapMedia.addEventListener('change',e=>{
 if(e.matches)workspace.classList.add('sidebar-collapsed');
 else if(workspace.classList.contains('dossier-collapsed'))workspace.classList.remove('sidebar-collapsed');
 else workspace.classList.add('sidebar-collapsed');
 syncMobileEventsButton();syncPanels();
});
$('mapLayerTerritory').addEventListener('change',syncMapLayers);
$('mapLayerEvents').addEventListener('change',syncMapLayers);
$('showModernBasemap').addEventListener('change',e=>setBasemap(e.target.checked?'modern':'physical'));
$('yearRange').addEventListener('input',e=>{stopPlay();if(atlas)setYear(e.target.value)});
function jumpToEnteredYear(){
 if(!atlas)return;
 const raw=$('jumpYear').value.trim(),v=Number(raw);
 if(!/^\d{4}$/.test(raw)||!Number.isInteger(v)||v<1497||v>lastPublishedYear){
  timelineStatus('仅支持1497—'+lastPublishedYear+'年已发布的历史资料；地图仍停留'+year+'年。');return;
 }
 stopPlay();setYear(v);
}
$('jumpYear').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();jumpToEnteredYear()}});
$('jumpYear').addEventListener('change',jumpToEnteredYear);
$('chapterTrack').addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&chapterRegistry){e.preventDefault();browseDecade(adjacentHalfCenturyPage(browsingDecade,e.deltaX>0?1:-1))}},{passive:false});
$('browseDecadePrev').addEventListener('click',()=>{if(chapterRegistry)browseDecade(adjacentHalfCenturyPage(browsingDecade,-1))});
$('browseDecadeNext').addEventListener('click',()=>{if(chapterRegistry)browseDecade(adjacentHalfCenturyPage(browsingDecade,1))});
$('prevYear').addEventListener('click',()=>{stopPlay();if(atlas)setYear(year-1)});
$('nextYear').addEventListener('click',()=>{stopPlay();if(atlas)setYear(year+1)});
$('playBtn').addEventListener('click',()=>{if(atlas)togglePlay()});
$('resetDossier').addEventListener('click',resetDossier);
['toggleKingdom','toggleRoutes','toggleCandidates','toggleClaims','toggleEvents','toggleMinorEvents'].forEach(id=>$(id).addEventListener('change',()=>{
 // Explicitly hiding the event layer must remove any temporary double-click focus.
 if(id==='toggleEvents'&&!$('toggleEvents').checked){focusedEventId=null;focusRequestToken++}
 if(atlas)renderPoints();
}));
function refreshHistoricalLayers(){
 renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderHypotheses();renderPoints();renderWartimeVicinities();renderWarReachCorridors();renderContestedZones();renderWartimeControls();renderSeventhControlSites();renderArchaeologyReferences();renderEighthControlSites();renderEighthCoastalActivity();renderNinthControlSites();renderTenthControlSites();renderTenthInvasionImpactAreas();renderTenthLandRaidImpactAreas();renderEleventhControlCores();renderEleventhInfluenceAreas();renderNineYearsWarImpact();renderAtlanticContactSites();renderChapter11ActionLinks();renderEarlyRegionalImpactAreas();renderHistoricalRegionGuide();
}
$('toggleHypotheses').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('toggleControlAreas').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('togglePoliticalRelations').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('toggleTerritorialFootprints').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('showFullChapterArchive').addEventListener('change',()=>{if(atlas)renderEventList()});
map.on('zoomend',()=>{if(atlas){renderPoints();renderControlAreas();renderWartimeControls();renderSeventhControlSites();renderEighthControlSites();renderNinthControlSites();renderTenthControlSites();renderEleventhControlCores();renderEleventhInfluenceAreas();renderTenthInvasionImpactAreas();renderTenthLandRaidImpactAreas();renderEarlyRegionalImpactAreas();renderAtlanticContactSites()}});
// Opening/closing dossier or sidebar changes the map viewport without changing zoom.
map.on('resize',()=>{if(atlas)renderPoints()});
// Native capture handles clicks even where Leaflet Canvas or SVG layers consume
// the bubbling event. Historical chronology remains the authority for hit tests.
map.getContainer().addEventListener('click',event=>{
 if(!atlas)return;
 const t=event.target;
 if(t?.closest?.('.leaflet-marker-icon,.leaflet-control-container,.leaflet-popup,.leaflet-tooltip,.atlas-local-english-garrison,.atlas-french-counterfort,.atlas-voyage-hit'))return;
 openMapTerritoryAt(map.mouseEventToLatLng(event));
},true);
map.on('click',()=>{if(activeClusterKey)closeCluster()});

// Read-only event access and deliberately narrow actions for optional longform stories.
// This bridge does not expose mutable historic GIS or allow changing map coordinates.
window.atlasStoryBridge={
 currentYear:()=>year,
 activeFocusId:()=>focusedEventId,
 selectedEventId:()=>selected,
 activeHasEvent:id=>Boolean(atlas?.events?.some(e=>e.id===id)),
 eventById:id=>[atlas,atlasEleventh,atlasTenth,atlasNinth,atlasEighth,atlasSeventh,atlasSixth,atlasFifth,atlasFourth,atlasThird,atlasFirstMerged]
  .map(a=>a?.events?.find(e=>e.id===id)).find(Boolean)||null,
 clearSelectedEventYear:()=>{selectedItemYear=null},
 clearSelection:()=>{selectedItemYear=null;selected=''},
 showDossier:()=>openPanel('dossier'),
 openEvent:item=>openDossier(item,'event'),
 focusEvent:(item,opts)=>focusEventFromSidebar(item,opts),
 setYear:v=>setYear(v),
 resetDossier:()=>resetDossier()
};
syncPanels();
window.addEventListener('keydown',e=>{if(!atlas||e.target?.closest?.('input,button,select,textarea,[contenteditable="true"]'))return;if(e.key==='ArrowLeft'){stopPlay();setYear(year-1)}if(e.key==='ArrowRight'){stopPlay();setYear(year+1)}});
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),150);
boot();
})();