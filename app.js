/* Imperial Expansion Atlas · 1497–1529 historical atlas
   Facts, geography and provenance live in data/atlas-1497-1500.json.
   All speculative routes are marked illustrative. */
(function(){
'use strict';
const $ = id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const map = L.map('map',{zoomControl:false,worldCopyJump:false,preferCanvas:true,minZoom:2,maxZoom:11,scrollWheelZoom:true}).setView([51,-31],3);
// Zoom by wheel, touch or double-click; the map surface stays free of floating controls.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
 maxZoom:19,maxNativeZoom:19,
 attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);
// Tooltip descriptions use their own pane, always above Leaflet markers and historical outlines.
map.createPane('eventTooltipPane');
map.getPane('eventTooltipPane').style.zIndex='820';
map.getPane('eventTooltipPane').style.pointerEvents='none';
// High visibility historic control-area symbols; derived from documented city governance,
// not from invented town-wall polygons. Keep beneath Leaflet event markers.
map.createPane('controlAreaPane');
map.getPane('controlAreaPane').style.zIndex='465';
// Route hit targets above geographic polygons and below event glyphs.
map.createPane('voyagePane');
map.getPane('voyagePane').style.zIndex='480';
const voyageRenderer=L.svg({pane:'voyagePane'});
map.createPane('territoryPane');
map.getPane('territoryPane').style.zIndex='455';
const territoryRenderer=L.svg({pane:'territoryPane'});
const groups={territory:L.layerGroup().addTo(map),kingdom:L.layerGroup().addTo(map),controlAreas:L.layerGroup().addTo(map),politicalRelations:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),candidate:L.layerGroup().addTo(map),claim:L.layerGroup().addTo(map),event:L.layerGroup().addTo(map),place:L.layerGroup().addTo(map),cluster:L.layerGroup().addTo(map),clusterExpanded:L.layerGroup().addTo(map),hypotheses:L.layerGroup().addTo(map)};
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
const iconHTML=item=>'<div class="map-pin '+escapeHTML(item.category||'voyage')+' tier-'+levelOf(item)+(isUncertain(item)?' uncertain':'')+'" aria-label="'+escapeHTML(rankName[levelOf(item)])+(isUncertain(item)?'，历史定位为参考位置':'')+'">'+svgIcon(item)+'</div>';
const hoverCard=(title,summary,item)=>'<strong>'+escapeHTML(title)+'</strong><div class="atlas-hover-summary">'+escapeHTML(String(summary||'').replace(/\s+/g,' ').slice(0,56))+'</div>'+(item?'<small>'+escapeHTML(rankName[levelOf(item)])+' · 点击查看详情</small>':'<small>航行方向示意 · 点击查看详情</small>');
const workspace=$('workspace');
function syncPanels(){
setTimeout(()=>map.invalidateSize({pan:false}),250);
}
function openPanel(which){
 workspace.classList.remove(which==='sidebar'?'sidebar-collapsed':'dossier-collapsed');syncPanels();
}
function togglePanel(which){
 workspace.classList.toggle(which==='sidebar'?'sidebar-collapsed':'dossier-collapsed');syncPanels();
}
const categoryName={political:'王室授权',voyage:'航海行动',claim:'王室宣称',status:'研究结论'};
const categorySymbol=fallbackCodes;
let atlas=null;let atlasEarly=null;let atlasLater=null;let atlasThird=null;let atlasFourth=null;let year=1497; let selected=''; let selectedItemYear=null; let timer=null;
let researchNotes={};let geographicHypotheses=null;let geographicHypothesesThird=null;let frenchCityAreas=null;let politicalRelationAreas=null;let territorialFootprints=null;
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
 const refs=(ids||[]).map(id=>[...(atlas?.sources||[]),...(atlasEarly?.sources||[]),...(atlasLater?.sources||[]),...(atlasThird?.sources||[]),...(atlasFourth?.sources||[])].find(src=>src.id===id)).filter(Boolean);
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
 const routeWarning=route&&item.route_kind==='documented-endpoints-connection'?
  '<p class="atlas-route-disclaimer">这条虚线只连接有史料支持的起讫地点，不表示船只实际航行轨迹。</p>':'';
 $('dossierBody').innerHTML='<div class="dossier-kicker">'+escapeHTML(caption)+' · '+escapeHTML(date)+'</div><h2>'+escapeHTML(item.name)+'</h2><p>'+escapeHTML(description)+'</p>'+routeWarning+listSources(item.source_ids,item);
 openPanel('dossier');
 document.querySelectorAll('.event-item').forEach(el=>el.classList.toggle('selected',el.dataset.eid===selected));
}
function openHypothesis(feature){
 const p=feature.properties||{};
 const title=p.public_title||'推定地理范围';
 const url=p.source_path||'research/hypotheses/1500/README.md';
 selectedItemYear=null;
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史地理 · 虚线推定</div><h2>'+escapeHTML(title)+'</h2><p>'+escapeHTML(p.public_summary||'根据历史记载的地点绘制的范围示意。')+'</p>'+
 '<details class="source-details"><summary>历史文献与详细考证 <span>▾</span></summary>'+
 '<div class="research-body"><h3>构建方法</h3><p>'+escapeHTML(p.method||'按有史料的地名构建地理形状。')+'</p><h3>资料类型</h3><p>当地城镇及历史记载地点的现代地理参考，用于分析可能范围。正式边界研究持续进行。</p></div>'+
 '<a class="source-link" href="'+escapeHTML(url)+'" target="_blank" rel="noopener">查看原始地理研究 ↗</a></details>';
 openPanel('dossier');
}
function openCollection(items,title){
 if(!items.length)return;
 const choices=items.slice().sort((a,b)=>Number(b.item.significance?.level||1)-Number(a.item.significance?.level||1)||Number(a.item.year||0)-Number(b.item.year||0));
 $('dossierBody').innerHTML='<div class="dossier-kicker">同一地区的历史记录</div><h2>'+escapeHTML(title||'附近事件')+'</h2><div class="cluster-list">'+choices.map((x,i)=>'<button type="button" class="cluster-entry" data-record="'+i+'"><span class="cluster-entry-icon">'+svgIcon(x.item,'atlas-list-icon')+'</span><span><small>'+escapeHTML(x.item.date_label||'持续状态')+'</small><strong>'+escapeHTML(x.item.name)+'</strong></span><span class="cluster-entry-arrow">›</span></button>').join('')+'</div>';
 openPanel('dossier');
 $('dossierBody').querySelectorAll('.cluster-entry').forEach(btn=>btn.addEventListener('click',()=>{const x=choices[Number(btn.dataset.record)];openDossier(x.item,x.type)}));
}
function resetDossier(){selected='';selectedItemYear=null;focusedEventId=null;focusRequestToken++;$('dossierBody').innerHTML=infoDefault;document.querySelectorAll('.event-item').forEach(n=>n.classList.remove('selected'));workspace.classList.add('dossier-collapsed');syncPanels();if(atlas)renderPoints()}
function renderEventList(){
 // Map and default sidebar reveal history at or before the selected year.
 // A deliberate archival switch allows browsing the full chapter without changing time.
 const fullArchive=$('showFullChapterArchive').checked;
 const events=atlas.events.filter(e=>(atlas!==atlasEarly||e.year<=1499)&&(fullArchive||occurredByYear(e,year)))
  .sort((a,b)=>a.year-b.year||levelOf(b)-levelOf(a)||a.name.localeCompare(b.name,'zh'));
 const chapterTotal=atlas.events.filter(e=>atlas!==atlasEarly||e.year<=1499).length;
 $('eventCount').textContent=events.length+'项';
 $('eventList').innerHTML=events.map(e=>'<button type="button" data-tier="'+levelOf(e)+'" data-eid="'+escapeHTML(e.id)+'" class="event-item '+(e.id===selected?'selected':'')+(e.year>year?' event-upcoming':'')+'" title="'+escapeHTML(Number.isFinite(e.lat)&&Number.isFinite(e.lng)?'双击定位地图（保持当前缩放）':'暂无可靠地图坐标')+'"><span class="event-icon">'+svgIcon(e,'atlas-list-icon')+'</span><span><small>'+escapeHTML(e.date_label)+(e.year>year?' · 档案预览':'')+'</small><strong>'+escapeHTML(e.name)+(levelOf(e)===3?' <span class="priority-tag">关键</span>':'')+'</strong></span></button>').join('');
 $('eventList').querySelectorAll('.event-item').forEach(node=>{
  node.addEventListener('click',()=>openDossier(atlas.events.find(e=>e.id===node.dataset.eid),'event'));
  node.addEventListener('dblclick',ev=>{
   ev.preventDefault();
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
 if(!item)return;
 openDossier(item,'event');
 focusRequestToken++;
 focusedEventId=null;
 if(!canLocateEvent(item,year)){
  const note=!occurredByYear(item,year)?'请先将时间轴移至事件发生年份。':'此事件位置尚未核实，无法地图定位。';
  $('dossierBody').insertAdjacentHTML('beforeend','<p class="atlas-location-note">'+escapeHTML(note)+'</p>');
  renderPoints();
  return;
 }
 stopPlay();
 focusedEventId=item.id;
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
  const icon=L.divIcon({className:'atlas-flyout-icon'+(item.id===focusedEventId?' atlas-target-marker':''),html:'<div class="expanded-event">'+iconHTML(item)+'</div>',iconSize:[d,d],iconAnchor:[d/2,d/2]});
  const marker=L.marker(map.containerPointToLatLng(L.point(pos.x,pos.y)),{icon,title:item.name,zIndexOffset:1800+i,bubblingMouseEvents:false})
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
 const showAll=map.getZoom()>=4||$('toggleMinorEvents').checked;
 if($('toggleEvents').checked||focusedEventId){
  for(const e of atlas.events){
   if((atlas===atlasEarly&&e.year>1499)||!occurredByYear(e,year))continue;
   if(!Number.isFinite(e.lat)||!Number.isFinite(e.lng))continue;
   if(!$('toggleEvents').checked&&e.id!==focusedEventId)continue;
   if(e.category==='status'&&e.id!==focusedEventId)continue;
   if(e.category==='claim'&&!$('toggleClaims').checked&&e.id!==focusedEventId)continue;
   if(levelOf(e)===1&&!showAll&&e.id!==focusedEventId)continue;
   shown.push({item:e,type:'event',lat:e.lat,lng:e.lng});
  }
 }
 if($('toggleKingdom').checked&&year>=1500){
  for(const q of atlas.places||[]){
   const alreadyDrawnAsArea=footprintEnabledFor(q.id)||($('togglePoliticalRelations').checked&&politicalRelationAreas?.features?.some(f=>f.properties?.source_place_id===q.id))||($('toggleControlAreas').checked&&frenchCityAreas?.features?.some(f=>f.properties?.source_place_id===q.id));
   if(alreadyDrawnAsArea)continue;
   const start=q.start_year??1500;
   if(year<start||(q.end_year!=null&&year>q.end_year)||(q.observed_through_year!=null&&year>q.observed_through_year))continue;
   shown.push({item:{...q,significance:{level:2}},type:'place',lat:q.lat,lng:q.lng});
  }
 }
 // Aggregate by screen distance, without changing the historically stored coordinates.
 const nearby=[];
 for(const record of shown.sort((a,b)=>levelOf(b.item)-levelOf(a.item)||a.item.id.localeCompare(b.item.id))){
  const point=map.latLngToLayerPoint([record.lat,record.lng]);
  let g=nearby.find(x=>Math.hypot(x.pt.x-point.x,x.pt.y-point.y)<32);
  if(!g){g={pt:point,latlng:map.layerPointToLatLng(point),items:[]};nearby.push(g)}
  g.items.push(record);
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
   const ico=L.divIcon({className:item.id===focusedEventId?'atlas-target-marker':'',html:iconHTML(item),iconSize:[d,d],iconAnchor:[d/2,d/2]});
   L.marker([record.lat,record.lng],{icon:ico,title:item.name,zIndexOffset:500+levelOf(item)*60})
    .bindTooltip(hoverCard(item.name,item.short_description||item.description,item),{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
    .on('click',()=>openDossier(item,record.type)).addTo(groups.cluster);
   continue;
  }
  const important=g.items.some(x=>levelOf(x.item)===3);
  const ico=L.divIcon({className:'',html:'<div class="atlas-aggregate'+(important?' key':'')+(g.items.some(x=>x.item.id===focusedEventId)?' atlas-target-aggregate':'')+'"><strong>'+g.items.length+'</strong></div>',iconSize:[36,36],iconAnchor:[18,18]});
  L.marker(g.latlng,{icon:ico,title:g.items.length+'项历史记录',zIndexOffset:950})
   .on('mouseover',()=>{if(!expandedPinned||activeClusterKey===g.items.map(x=>x.item.id).sort().join('|'))expandCluster(g)})
   .on('mouseout',scheduleClusterClose)
   .on('click',()=>expandCluster(g,true))
   .addTo(groups.cluster);
 }
 if(atlas.candidates&&year<=1499){
  for(const c of atlas.candidates){
   const ico=L.divIcon({className:'',html:'<div class="candidate-pin"></div>',iconSize:[16,16],iconAnchor:[8,8]});
   L.marker([c.lat,c.lng],{icon:ico,title:c.name})
    .bindTooltip(hoverCard(c.name,c.note),{direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
    .on('click',()=>openDossier(c,'candidate')).addTo(groups.candidate);
  }
  if($('toggleClaims').checked){
   L.circleMarker([48.8,-57.2],{radius:23,color:'#b98540',weight:2,dashArray:'4 5',fill:false})
    .bindTooltip(hoverCard('1497年王室声索','卡博特远航后产生的英王海外权利主张。'),{className:'atlas-hover'})
    .on('click',()=>openDossier(atlas.events.find(e=>e.id==='landfall-1497'),'event')).addTo(groups.claim);
  }
 }
 for(const r of atlas.routes||[]){
  if(!occurredByYear(r,year)||!$('toggleRoutes').checked)continue;
  if(!Array.isArray(r.coords)||r.coords.length<2)continue;
  const schematic=r.route_kind==='documented-endpoints-connection';
  const baseColor=schematic?'#dfbb87':r.year===1497?'#d4a47d':'#97a9bc';
  const style={renderer:voyageRenderer,pane:'voyagePane',
   color:baseColor,weight:schematic?2.2:2.7,dashArray:schematic?'3 10':'8 9',opacity:.92};
  const line=L.polyline(r.coords,{...style,interactive:false}).addTo(groups.routes);
  // Historical territory polygons cannot intercept this upper SVG hit stroke.
  L.polyline(r.coords,{renderer:voyageRenderer,pane:'voyagePane',
   color:baseColor,weight:22,opacity:.025,interactive:true,
   className:'atlas-voyage-hit'})
   .bindTooltip(hoverCard(r.name,r.note),{sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('mouseover',()=>line.setStyle({weight:schematic?3.2:4}))
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
   const research=p.display_group==='research',calais=rel==='direct_crown_control';
   const hatch=rel==='autonomous_lordship'?'atlas-hatch-manx':
     rel==='crown_dependency'?'atlas-hatch-crown':'';
   return {pane:'territoryPane',color:p.color||'#a78cdb',weight:calais?3.8:research?2.7:2.3,
    opacity:1,dashArray:research?'7 6':calais?'7 5':null,
    fillColor:p.color||'#9871cc',fillOpacity:research?.12:calais?.3:rel==='scottish_crown_territory'?.22:.26,
    className:hatch?'atlas-territory-'+(rel==='autonomous_lordship'?'manx':'crown'):'atlas-territory-solid'};
  },
  onEachFeature:(feature,layer)=>{
   const p=feature.properties||{};
   const rel=p.relation_type,klass=rel==='autonomous_lordship'?'atlas-territory-manx':rel==='crown_dependency'?'atlas-territory-crown':'atlas-territory-solid';
   layer.options.className=klass;
   layer.bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+escapeHTML(p.history_description)+'</div>',
      {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]});
   layer.on('click',()=>{
    const place=(atlas?.places||[]).find(x=>x.id===p.source_place_id) ||
      (atlasLater?.places||[]).find(x=>x.id===p.source_place_id) ||
      (atlasThird?.places||[]).find(x=>x.id===p.source_place_id) ||
      (atlasFourth?.places||[]).find(x=>x.id===p.source_place_id);
    if(place){openDossier(place,'place');return}
    const citations=(p.source_urls||[]).filter(x=>/^https:\/\//.test(x))
     .map(url=>'<p><a href="'+escapeHTML(url)+'" target="_blank" rel="noopener">查看地理与史料来源 ↗</a></p>').join('');
    $('dossierBody').innerHTML='<div class="dossier-kicker">历史政治地理 · '+year+'年</div><h2>'+escapeHTML(p.name)+
      '</h2><p>'+escapeHTML(p.history_description)+'</p>'+citations;
    openPanel('dossier');
   });
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
  const stripe='<svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">'+
   '<defs><pattern id="pat-'+uid+'" width="8" height="8" patternUnits="userSpaceOnUse">'+
   '<path d="M-2 8 L8 -2 M2 10 L10 2" stroke="'+color+'" stroke-width="2" opacity=".8"/>'+
   (p.render_mode==='crosshatched_bounded_symbol'?'<path d="M-2 0 L8 10 M2 -2 L10 6" stroke="'+color+'" stroke-width="1.4" opacity=".65"/>':'')+
   '</pattern></defs>'+
   '<circle cx="22" cy="22" r="'+radius+'" fill="#10283e" fill-opacity=".67" stroke="'+color+'" stroke-width="2.8"/>'+
   '<circle cx="22" cy="22" r="'+(radius-2)+'" fill="'+(p.render_mode==='solid_bounded_symbol'||p.render_mode==='scottish_solid_symbol'?color:'url(#pat-'+uid+')')+'" fill-opacity="'+(p.render_mode==='solid_bounded_symbol'||p.render_mode==='scottish_solid_symbol'?'.52':'.85')+'"/>'+
   '</svg>';
  const icon=L.divIcon({className:'political-relation-symbol',html:stripe,iconSize:[44,44],iconAnchor:[22,22]});
  const place=(atlas.places||[]).find(q=>q.id===p.source_place_id);
  L.marker(center,{icon,pane:'controlAreaPane',zIndexOffset:0,bubblingMouseEvents:false})
   .bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+escapeHTML(p.annotation)+'</div>',
     {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover'})
   .on('click',()=>{if(place)openDossier(place,'place')})
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
  const mainColor=isTournai?'#c5a0f1':'#9867dd';
  const glowColor=isTournai?'#e0bfff':'#a57de3';
  // City control is a sourced position, not a circular polygon of measured territory.
  const radius=Math.max(5.2,Math.min(8,5.6+Math.max(0,zoom-5)*.6));
  const core=L.circleMarker(center,{pane:'controlAreaPane',radius,
   color:glowColor,weight:2,opacity:1,fill:true,fillColor:mainColor,fillOpacity:.85,
   bubblingMouseEvents:false})
   .bindTooltip('<strong>'+escapeHTML(p.name)+'</strong><div class="atlas-hover-summary">'+escapeHTML(p.description)+'</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
   .on('click',()=>{
    const record=(atlas.places||[]).find(q=>q.id===p.source_place_id)
      ||(atlasThird?.places||[]).find(q=>q.id===p.source_place_id)
      ||(atlasLater?.places||[]).find(q=>q.id===p.source_place_id)
      ||(atlasFourth?.places||[]).find(q=>q.id===p.source_place_id);
    if(record)openDossier(record,'place');
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
function updateVisibility(){
 for(const [id,group] of [['toggleKingdom',groups.kingdom],['toggleRoutes',groups.routes],['toggleCandidates',groups.candidate],['toggleClaims',groups.claim]]){
  if($(id).checked){if(!map.hasLayer(group))map.addLayer(group)}
  else if(map.hasLayer(group))map.removeLayer(group);
 }
 if(!map.hasLayer(groups.cluster))map.addLayer(groups.cluster);
}
function renderMilestones(){
 const all=[...atlasEarly.events,...atlasLater.events,...atlasThird.events,...atlasFourth.events];
 const rail=$('milestoneDots');
 const years=[...new Set(all.filter(e=>e.id!=='status-1500').map(e=>e.year)
   .filter(y=>y>=1497&&y<=year))].sort((a,b)=>a-b);
 rail.innerHTML=years.map(y=>{
  const events=all.filter(e=>e.year===y);
  const peak=Math.max(...events.map(e=>levelOf(e)));
  return '<button type="button" class="milestone-dot tier-'+peak+(y===year?' current':'')+
   '" style="left:'+((y-1497)/32*100)+'%" data-year="'+y+
   '" title="'+escapeHTML(y+'年 · '+events.map(e=>e.name).slice(0,3).join(' / '))+
   '" aria-label="'+y+'年：'+events.length+'个事件"><span>'+y+'</span></button>';
 }).join('');
 rail.querySelectorAll('.milestone-dot').forEach(node=>node.addEventListener('click',()=>{
  const y=Number(node.dataset.year);stopPlay();setYear(y);
  const matches=atlas.events.filter(e=>e.year===y);
  if(matches.length===1)openDossier(matches[0],'event');
  else if(matches.length>1)openCollection(matches.map(item=>({item,type:'event'})),y+'年的历史事件');
 }));
}
function setYear(v){
 const next=Math.max(1497,Math.min(1529,Math.round(Number(v)||1497)));
 const chosen=next>=1520?atlasFourth:next>=1510?atlasThird:next>=1500?atlasLater:atlasEarly;
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
 year=next;atlas=chosen;
 $('yearRange').value=year;$('bigYear').textContent=year;$('timeYear').textContent=year;
 const first=year<1500,second=year>=1500&&year<1510,third=year>=1510&&year<1520,fourth=year>=1520;
 $('chapterNav').textContent=fourth?'历史地图 · 第四章':third?'历史地图 · 第三章':second?'历史地图 · 第二章':'历史地图 · 第一章';
 $('chapterNavName').textContent=fourth?'边区与远航':third?'王冠越过海峡':second?'通往未知海岸的第二程':'远航与主权宣称';
 $('chapterLabel').textContent=fourth?'CHAPTER 004 / 1520—1529':third?'CHAPTER 003 / 1510—1519':second?'CHAPTER 002 / 1500—1509':'CHAPTER 001 / 1497—1499';
 $('chapterTitlePrimary').textContent=fourth?'边区与':third?'王冠越过':second?'通往未知海岸':'大西洋彼岸';
 $('chapterTitleSecondary').textContent=fourth?'远航':third?'海峡':second?'的第二程':'的第一道声索';
 $('chapterIntro').textContent=fourth?(typeof atlasFourth.intro==='string'?atlasFourth.intro:atlasFourth.intro?.description||''):third?atlasThird.intro.description:second?atlasLater.intro.description:earlyIntro;
 $('factA').textContent=fourth?'加来':third?(year>=1513?'1513':'—'):second?'加来':'0';
 $('factADesc').innerHTML=fourth?'英王控制核心<br>持续存在':third?(year>=1513?'弗洛登战役<br>苏格兰国王阵亡':''):second?'英王在法国的<br>控制据点':'已证实北美<br>永久殖民据点';
 $('factB').textContent=fourth?(year>=1523?'1523':'—'):third?(year>=1513?'1513':'—'):second?(year>=1502?'1502':'—'):'1497';
 $('factBDesc').innerHTML=fourth?(year>=1523?'边区战事':''):third?(year>=1513?'英军占领<br>图尔奈':''):second?(year>=1502?'英格兰与苏格兰<br>缔结和约':''):'英格兰远航<br>抵达北美沿岸';
 $('factC').textContent=fourth?(year>=1527?'1527':'—'):third?(year>=1519?'1519':'—'):second?(year>=1504?'1504':'—'):(year>=1498?'1498':'—');
 $('factCDesc').innerHTML=fourth?(year>=1527?'北美远航':''):third?(year>=1519?'英军撤离<br>图尔奈':''):second?(year>=1504?'爱尔兰<br>诺克多战役':''):(year>=1498?'第二次远航<br>后续出航':'');
 $('periodTitle').textContent=fourth?'亨利八世 · 英格兰王国':third?'亨利八世 · 英格兰王国':second?(year===1509?'亨利八世 · 王位更替':'亨利七世 · 英格兰王国'):(year===1497?'亨利七世 · 首次远航':year===1498?'亨利七世 · 第二次远航':'亨利七世 · 英格兰王国');
 for(const [id,on] of [['chapterOne',first],['chapterTwo',second],['chapterThree',third],['chapterFour',fourth]])$(id).classList.toggle('active',on);
 $('timelineContext').textContent=fourth?'第四章 · 1520—1529年事件':third?'第三章 · 1510—1519年事件':second?'第二章 · 1500—1509年事件':'第一章 · 1497—1499年事件';
 $('timelineNotice').textContent='事件逐年揭示；政治状态跨章节延续，未核实边界保持虚线。';
 renderEventList();renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderPoints();renderHypotheses();renderMilestones();
}
function stopPlay(){if(timer){clearInterval(timer);timer=null;$('playBtn').textContent='▶'}}
function togglePlay(){if(timer){stopPlay();return}if(year===1529)setYear(1497);$('playBtn').textContent='Ⅱ';timer=setInterval(()=>{if(year===1529){stopPlay();return}setYear(year+1)},1250)}
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
  let count=0;
  for(const f of features){
   const p=Object.values(f.properties||{}).filter(v=>typeof v==='string').join(' ').toLowerCase();
   let group=null;
   if(p.includes('scotland'))group='scotland';
   else if(p.includes('wales'))group='wales';
   else if(/north east|north west|yorkshire|east midlands|west midlands|east of england|london|south east|south west/.test(p))group='england';
   if(!group)continue;
   count++;
   const c=group==='scotland'?'#588ba8':group==='wales'?'#a78acb':'#815fd5';
   const layer=L.geoJSON(f,{style:{color:c,weight:group==='wales'?1.8:1.4,dashArray:group==='wales'?'6 5':null,fillColor:c,fillOpacity:group==='scotland'?.25:group==='wales'?.18:.35,opacity:.95},interactive:true})
     .on('click',()=>openPolity(group)).addTo(groups.kingdom);
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
  (year>=1513?'1513年弗洛登战役中詹姆斯四世阵亡，幼王詹姆斯五世继位。苏格兰由摄政机构与王国贵族参与治理，继续保持独立王权。':'詹姆斯四世统治下的苏格兰王国由王室、议会、贵族和地方氏族共同参与治理。'):
  (year>=1509?'亨利八世统治英格兰，英王在加来驻有官员和军队，并通过地方贵族及都柏林机构管理爱尔兰的部分区域。':'都铎王朝英王统治英格兰本土，王室在加来设有军政机构，爱尔兰的部分区域由王室委任地方官员治理。');
 const sources=(p.source_ids||[]).concat(isScotland&&year>=1513?['NRS-FLODDEN']:[]);
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史国家 · '+year+'年</div><h2>'+escapeHTML(title)+'</h2><p>'+escapeHTML(text)+'</p>'+listSources(sources,p);
 openPanel('dossier');
}
async function boot(){
 try{
  const [res,laterRes,thirdRes,fourthRes]=await Promise.all([
    fetch('data/atlas-1497-1500.json',{cache:'no-store'}),
    fetch('data/atlas-1500-1509.json',{cache:'no-store'}),
    fetch('data/atlas-1510-1519.json',{cache:'no-store'}),
    fetch('data/atlas-1520-1529.json',{cache:'no-store'})
  ]);
  if(!res.ok||!laterRes.ok||!thirdRes.ok||!fourthRes.ok)throw new Error('历史切片未正确加载');
  atlasEarly=await res.json();
  atlasLater=await laterRes.json();
  atlasThird=await thirdRes.json();
  atlasFourth=await fourthRes.json();
  if(!Array.isArray(atlasEarly.events)||!Array.isArray(atlasLater.events)||!Array.isArray(atlasLater.places)||!Array.isArray(atlasThird.events)||!Array.isArray(atlasThird.places)||!Array.isArray(atlasFourth.events)||!Array.isArray(atlasFourth.places))throw new Error('历史数据结构错误');
  try{
   const iconResponse=await fetch('data/icon-categories.json',{cache:'no-store'});
   if(iconResponse.ok)iconCatalog=await iconResponse.json();
  }catch(_e){ /* Existing fallback codes remain available. */ }
  try{
   const [notesResponse,geoResponse,thirdGeoResponse,controlResponse,politicalResponse,footprintResponse]=await Promise.all([
    fetch('data/historical-detail-notes.json',{cache:'no-store'}),
    fetch('data/geography-hypotheses-1500-1529.geojson',{cache:'no-store'}),
    fetch('data/geography-1510-1519-hypotheses.geojson',{cache:'no-store'}),
    fetch('data/french-urban-control-1497-1529.geojson',{cache:'no-store'}),
    fetch('data/political-relations-1500-1529.geojson',{cache:'no-store'}),
    fetch('data/territorial-footprints-1497-1529.geojson',{cache:'no-store'})
   ]);
   if(notesResponse.ok)researchNotes=(await notesResponse.json()).records||{};
   if(geoResponse.ok)geographicHypotheses=await geoResponse.json();
   if(thirdGeoResponse.ok)geographicHypothesesThird=await thirdGeoResponse.json();
   if(controlResponse.ok)frenchCityAreas=await controlResponse.json();
   if(politicalResponse.ok)politicalRelationAreas=await politicalResponse.json();
   if(footprintResponse.ok)territorialFootprints=await footprintResponse.json();
  }catch(_e){ /* Text and all vetted history records remain usable. */ }
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
$('yearRange').addEventListener('input',e=>{stopPlay();if(atlas)setYear(e.target.value)});
$('chapterOne').addEventListener('click',()=>{stopPlay();if(atlasEarly)setYear(1497)});
$('chapterTwo').addEventListener('click',()=>{stopPlay();if(atlasLater)setYear(1500)});
$('chapterThree').addEventListener('click',()=>{stopPlay();if(atlasThird)setYear(1510)});
$('chapterFour').addEventListener('click',()=>{stopPlay();if(atlasFourth)setYear(1520)});
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
 renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderHypotheses();renderPoints();
}
$('toggleHypotheses').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('toggleControlAreas').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('togglePoliticalRelations').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('toggleTerritorialFootprints').addEventListener('change',()=>{if(atlas)refreshHistoricalLayers()});
$('showFullChapterArchive').addEventListener('change',()=>{if(atlas)renderEventList()});
map.on('zoomend',()=>{if(atlas){renderPoints();renderTerritories();renderControlAreas();renderPoliticalRelationAreas()}});
// Opening/closing dossier or sidebar changes the map viewport without changing zoom.
map.on('resize',()=>{if(atlas)renderPoints()});
map.on('click',()=>{if(activeClusterKey)closeCluster()});

syncPanels();
window.addEventListener('keydown',e=>{if(!atlas)return;if(e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year-1)}if(e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year+1)}});
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),150);
boot();
})();