/* Imperial Expansion Atlas · 1497–1500 pilot
   Facts, geography and provenance live in data/atlas-1497-1500.json.
   All speculative routes are marked illustrative. */
(function(){
'use strict';
const $ = id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const map = L.map('map',{zoomControl:false,worldCopyJump:false,preferCanvas:true,minZoom:2,maxZoom:11,scrollWheelZoom:true}).setView([51,-31],3);
L.control.zoom({position:'topright'}).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
 maxZoom:19,maxNativeZoom:19,
 attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);
const groups={kingdom:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),candidate:L.layerGroup().addTo(map),claim:L.layerGroup().addTo(map),event:L.layerGroup().addTo(map),place:L.layerGroup().addTo(map),cluster:L.layerGroup().addTo(map)};
const levelOf=(item)=>Math.max(1,Math.min(3,Number(item.significance?.level||1)));
const rankName={3:'重大事件',2:'区域事件',1:'补充事件'};
const isUncertain=item=>['regional-symbol-only','associated-city','representative-capital-city','approximate-area','documented-area-not-exact-battle-boundary','associated-modern-town-centre'].includes(item.geo_precision)||/uncertain/i.test(String(item.certainty||''));
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
const iconHTML=item=>'<div class="map-pin '+escapeHTML(item.category||'voyage')+' tier-'+levelOf(item)+(isUncertain(item)?' uncertain':'')+'" aria-label="'+escapeHTML(rankName[levelOf(item)])+(isUncertain(item)?'，地点待考':'')+'">'+svgIcon(item)+(isUncertain(item)?'<span class="uncertain-badge" aria-hidden="true">?</span>':'')+'</div>';
const hoverCard=(title,summary,item)=>'<strong>'+escapeHTML(title)+'</strong><div class="atlas-hover-summary">'+escapeHTML(String(summary||'').replace(/\s+/g,' ').slice(0,56))+'</div>'+(item?'<small>'+escapeHTML(rankName[levelOf(item)])+' · 点击查看详情</small>':'<small>航行方向示意 · 点击查看详情</small>');
const workspace=$('workspace');
function syncPanels(){
 $('toggleDossierBtn').setAttribute('aria-expanded',String(!workspace.classList.contains('dossier-collapsed')));
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
let atlas=null;let atlasEarly=null;let atlasLater=null;let year=1497; let selected=''; let timer=null;
let vectors={};
const infoDefault=$('dossierBody').innerHTML;
const earlyIntro=$('chapterIntro').textContent;
function setWarning(msg){let e=$('boundaryWarning');if(!e){e=document.createElement('div');e.id='boundaryWarning';e.className='map-warning';$('map').parentElement.appendChild(e)}e.textContent=msg;}
function hideWarning(){let e=$('boundaryWarning');if(e)e.remove();}
function listSources(ids){
 const refs=(ids||[]).map(id=>[...(atlas?.sources||[]),...(atlasEarly?.sources||[]),...(atlasLater?.sources||[])].find(src=>src.id===id)).filter(Boolean);
 if(!refs.length)return '';
 return '<details class="source-details"><summary>历史文献 · '+refs.length+'项 <span>▾</span></summary><div class="source-list">'+refs.map(x=>'<a class="source-link" href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(x.publisher)+' · '+escapeHTML(x.title)+' ↗</a>').join('')+'</div></details>';
}
function openDossier(item,typ){
 if(!item)return;
 const candidate=typ==='candidate',route=typ==='route',place=typ==='place';
 selected=item.id;
 const date=place?'历史政治关系':candidate?'1497年':route?item.year+'年':item.date_label;
 const caption=place?'地理与政治':candidate?'候选登陆地点':route?'航海':categoryName[item.category]||'历史事件';
 const description=candidate?item.note:route?item.note:item.description;
 $('dossierBody').innerHTML='<div class="dossier-kicker">'+escapeHTML(caption)+' · '+escapeHTML(date)+'</div><h2>'+escapeHTML(item.name)+'</h2><p>'+escapeHTML(description)+'</p>'+listSources(item.source_ids);
 openPanel('dossier');
 document.querySelectorAll('.event-item').forEach(el=>el.classList.toggle('selected',el.dataset.eid===selected));
}
function openCollection(items,title){
 if(!items.length)return;
 const choices=items.slice().sort((a,b)=>Number(b.item.significance?.level||1)-Number(a.item.significance?.level||1)||Number(a.item.year||0)-Number(b.item.year||0));
 $('dossierBody').innerHTML='<div class="dossier-kicker">同一地区的历史记录</div><h2>'+escapeHTML(title||'附近事件')+'</h2><div class="cluster-list">'+choices.map((x,i)=>'<button type="button" class="cluster-entry" data-record="'+i+'"><span class="cluster-entry-icon">'+svgIcon(x.item,'atlas-list-icon')+'</span><span><small>'+escapeHTML(x.item.date_label||'持续状态')+'</small><strong>'+escapeHTML(x.item.name)+'</strong></span><span class="cluster-entry-arrow">›</span></button>').join('')+'</div>';
 openPanel('dossier');
 $('dossierBody').querySelectorAll('.cluster-entry').forEach(btn=>btn.addEventListener('click',()=>{const x=choices[Number(btn.dataset.record)];openDossier(x.item,x.type)}));
}
function resetDossier(){selected='';$('dossierBody').innerHTML=infoDefault;document.querySelectorAll('.event-item').forEach(n=>n.classList.remove('selected'));workspace.classList.add('dossier-collapsed');syncPanels()}
function renderEventList(){
 // The whole chapter remains available at every point of its ten-year window.
 const events=atlas.events.filter(e=>atlas!==atlasEarly||e.year<=1499).sort((a,b)=>levelOf(b)-levelOf(a)||a.year-b.year||a.name.localeCompare(b.name,'zh'));
 $('eventCount').textContent=events.length+'项';
 $('eventList').innerHTML=events.map(e=>'<button type="button" data-tier="'+levelOf(e)+'" data-eid="'+escapeHTML(e.id)+'" class="event-item '+(e.id===selected?'selected':'')+(e.year>year?' event-upcoming':'')+'"><span class="event-icon">'+svgIcon(e,'atlas-list-icon')+'</span><span><small>'+escapeHTML(e.date_label)+(e.year>year?' · 本章稍后':'')+'</small><strong>'+escapeHTML(e.name)+(levelOf(e)===3?' <span class="priority-tag">关键</span>':'')+'</strong></span></button>').join('');
 $('eventList').querySelectorAll('.event-item').forEach(node=>node.addEventListener('click',()=>openDossier(atlas.events.find(e=>e.id===node.dataset.eid),'event')));
}
function renderPoints(){
 for(const name of ['event','candidate','routes','claim','place','cluster'])groups[name].clearLayers();
 const shown=[];
 if($('toggleEvents').checked){
  for(const e of atlas.events){
   if(atlas===atlasEarly&&e.year>1499)continue;
   if(e.category==='status'||!Number.isFinite(e.lat)||!Number.isFinite(e.lng))continue;
   if(e.category==='claim'&&!$('toggleClaims').checked)continue;
   if(levelOf(e)===1&&!$('toggleMinorEvents').checked)continue;
   shown.push({item:e,type:'event',lat:e.lat,lng:e.lng});
  }
 }
 if($('toggleKingdom').checked && year>=1500){
  for(const q of atlasLater.places){
   const started=q.start_year==null?1500:q.start_year;
   if(started>year || (q.end_year!=null&&q.end_year<year) || (q.observed_through_year!=null&&year>q.observed_through_year))continue;
   shown.push({item:{...q,significance:{level:2}},type:'place',lat:q.lat,lng:q.lng});
  }
 }
 // Visual clustering is screen-space only. Original geographic coordinates remain unchanged.
 const clusters=[];
 for(const item of shown.sort((a,b)=>levelOf(b.item)-levelOf(a.item))){
  const pt=map.latLngToLayerPoint([item.lat,item.lng]);
  let group=clusters.find(g=>Math.hypot(pt.x-g.pt.x,pt.y-g.pt.y)<42);
  if(!group){group={pt,items:[]};clusters.push(group);}
  group.items.push(item);
 }
 for(const cluster of clusters){
  const items=cluster.items,first=items[0],max=Math.max(...items.map(x=>levelOf(x.item)));
  const center=map.layerPointToLatLng(cluster.pt);
  if(items.length===1){
   const item=first.item,k=levelOf(item),d=k===3?34:k===2?27:21;
   const icon=L.divIcon({className:'',html:iconHTML(item),iconSize:[d,d],iconAnchor:[d/2,d/2]});
   L.marker(center,{icon,title:item.name,zIndexOffset:k*250})
    .bindTooltip(hoverCard(item.name,item.short_description||item.description,item),{sticky:true,direction:'top',className:'atlas-hover',opacity:.98})
    .on('click',()=>openDossier(item,first.type)).addTo(groups.cluster);
  }else{
   const d=max===3?44:39;
   const icon=L.divIcon({className:'',html:'<div class="atlas-event-cluster"><strong>'+items.length+'</strong><small>项</small></div>',iconSize:[d,d],iconAnchor:[d/2,d/2]});
   const tooltip='<strong>附近'+items.length+'项记录</strong><div class="atlas-hover-summary">'+escapeHTML(items.slice(0,3).map(x=>x.item.name).join('、').slice(0,62))+'</div><small>点击逐条选择</small>';
   L.marker(center,{icon,title:'附近'+items.length+'项历史记录',zIndexOffset:500})
    .bindTooltip(tooltip,{sticky:true,direction:'top',className:'atlas-hover',opacity:.98})
    .on('click',()=>openCollection(items,'此处汇集'+items.length+'条历史记录')).addTo(groups.cluster);
  }
 }
 if(atlas.candidates && year<=1499){
  for(const c of atlas.candidates){
   const icon=L.divIcon({className:'',html:'<div class="candidate-pin"></div>',iconSize:[16,16],iconAnchor:[8,8]});
   L.marker([c.lat,c.lng],{icon,title:c.name})
    .bindTooltip(hoverCard(c.name,c.note),{sticky:true,direction:'top',className:'atlas-hover'})
    .on('click',()=>openDossier(c,'candidate')).addTo(groups.candidate);
  }
  if($('toggleClaims').checked){
   L.circleMarker([48.8,-57.2],{radius:23,color:'#b98540',weight:2,dashArray:'4 5',fill:false})
    .bindTooltip(hoverCard('1497年王室声索','卡博特航行期间产生的英王海外权利主张。'),{className:'atlas-hover'})
    .on('click',()=>openDossier(atlas.events.find(e=>e.id==='landfall-1497'),'event')).addTo(groups.claim);
  }
 }
 for(const r of atlas.routes||[]){
  const color=r.year===1497?'#d4a47d':'#97a9bc';
  const visible=L.polyline(r.coords,{color,weight:2.8,dashArray:'8 9',opacity:.88,interactive:false}).addTo(groups.routes);
  L.polyline(r.coords,{color:'#ffffff',weight:18,opacity:.015,interactive:true})
   .bindTooltip(hoverCard(r.name,r.note),{sticky:true,direction:'top',className:'atlas-hover'})
   .on('mouseover',()=>visible.setStyle({weight:4}))
   .on('mouseout',()=>visible.setStyle({weight:2.8}))
   .on('click',()=>openDossier(r,'route')).addTo(groups.routes);
 }
 updateVisibility();
}
function updateVisibility(){
 for(const [id,group] of [['toggleKingdom',groups.kingdom],['toggleRoutes',groups.routes],['toggleCandidates',groups.candidate],['toggleClaims',groups.claim]]){
  if($(id).checked){if(!map.hasLayer(group))map.addLayer(group)}
  else if(map.hasLayer(group))map.removeLayer(group);
 }
 if(!map.hasLayer(groups.cluster))map.addLayer(groups.cluster);
}
function renderMilestones(){
 const all=[...atlasEarly.events,...atlasLater.events];
 const rail=$('milestoneDots');
 const years=[...new Set(all.filter(e=>e.id!=='status-1500').map(e=>e.year).filter(y=>y>=1497&&y<=1509))].sort((a,b)=>a-b);
 rail.innerHTML=years.map(y=>{
  const yearEvents=all.filter(e=>e.year===y);
  const peak=Math.max(...yearEvents.map(e=>levelOf(e)));
  const percent=(y-1497)/12*100;
  return '<button type="button" class="milestone-dot tier-'+peak+(y===year?' current':'')+'" style="left:'+percent+'%" data-year="'+y+'" title="'+escapeHTML(y+'年 · '+yearEvents.map(e=>e.name).slice(0,3).join(' / '))+'" aria-label="'+y+'年：'+yearEvents.length+'个事件"><span>'+y+'</span></button>';
 }).join('');
 rail.querySelectorAll('.milestone-dot').forEach(node=>node.addEventListener('click',()=>{
  const y=Number(node.dataset.year);stopPlay();setYear(y);
  const matches=atlas.events.filter(e=>e.year===y);
  if(matches.length===1)openDossier(matches[0],'event');
  else if(matches.length>1)openCollection(matches.map(item=>({item,type:'event'})),y+'年的历史事件');
 }));
}
function setYear(v){
 const next=Math.max(1497,Math.min(1509,Math.round(Number(v)||1497)));
 const chosen=next>=1500?atlasLater:atlasEarly;
 if(!chosen)return;
 const changed=atlas!==chosen;
 if(changed){selected='';$('dossierBody').innerHTML=infoDefault;workspace.classList.add('dossier-collapsed');syncPanels();}
 year=next;atlas=chosen;
 $('yearRange').value=year;$('bigYear').textContent=year;$('timeYear').textContent=year;
 const later=year>=1500;
 $('chapterNav').textContent=later?'历史地图 · 第二章':'历史地图 · 第一章';
 $('chapterNavName').textContent=later?'通往未知海岸的第二程':'远航与主权宣称';
 $('chapterLabel').textContent=later?'CHAPTER 002 / 1500—1509':'CHAPTER 001 / 1497—1499';
 $('chapterTitlePrimary').textContent=later?'通往未知海岸':'大西洋彼岸';
 $('chapterTitleSecondary').textContent=later?'的第二程':'的第一道声索';
 $('chapterIntro').textContent=later?atlasLater.intro.description:earlyIntro;
 $('factA').textContent=later?'加来':'0';
 $('factADesc').innerHTML=later?'英王在法国的<br>控制据点':'已证实北美<br>永久殖民据点';
 $('factB').textContent=later?'1502':'1497';
 $('factBDesc').innerHTML=later?'英格兰与苏格兰<br>缔结和约':'英格兰远航<br>抵达北美沿岸';
 $('factC').textContent=later?'1504':'1498';
 $('factCDesc').innerHTML=later?'爱尔兰<br>诺克多战役':'第二次远航<br>后续出航';
 $('periodTitle').textContent=!later?(year===1497?'亨利七世 · 首次远航':year===1498?'亨利七世 · 第二次远航':'亨利七世 · 英格兰王国'):year===1509?'亨利八世 · 王位更替':'亨利七世 · 英格兰王国';
 $('chapterOne').classList.toggle('active',!later);
 $('chapterTwo').classList.toggle('active',later);
 $('timelineContext').textContent=later?'第二章 · 1500—1509年事件':'第一章 · 1497—1499年事件';
 $('timelineNotice').textContent=later?'第二章全部事件已展开 · 第一章可在紫色章节带中回顾':'第一章全部事件已展开 · 点击右侧章节带进入1500年代';
 renderEventList();renderPoints();renderMilestones();
 // Selected year changes focus only, never removes events from its chapter.
}
function stopPlay(){if(timer){clearInterval(timer);timer=null;$('playBtn').textContent='▶'}}
function togglePlay(){if(timer){stopPlay();return}if(year===1509)setYear(1497);$('playBtn').textContent='Ⅱ';timer=setInterval(()=>{if(year===1509){stopPlay();return}setYear(year+1)},1250)}
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
   const c=group==='scotland'?'#588ba8':'#815fd5';
   const layer=L.geoJSON(f,{style:{color:c,weight:1.4,fillColor:c,fillOpacity:group==='scotland'?.25:.35,opacity:.95},interactive:true})
     .on('click',()=>openPolity(group)).addTo(groups.kingdom);
  }
  if(!count)throw new Error('Region names could not be decoded');
  hideWarning();
 }catch(err){setWarning('王国地理参考轮廓暂时不可用；地图事件与航线仍可独立浏览。此时不使用臆造历史边界。');}
}
function openPolity(group){
 const p=atlasEarly.polities.find(x=>x.id===(group==='scotland'?'scotland':'england'));if(!p)return;
 const subtitle=group==='wales'?'英格兰王权统治下的威尔士（现代边界参考）':p.name;
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史国家 · 1497—1500</div><h2>'+escapeHTML(subtitle)+'</h2><p>'+escapeHTML(p.note)+'</p>'+listSources(p.source_ids);
 openPanel('dossier');
}
async function boot(){
 try{
  const [res,laterRes]=await Promise.all([
    fetch('data/atlas-1497-1500.json',{cache:'no-store'}),
    fetch('data/atlas-1500-1509.json',{cache:'no-store'})
  ]);
  if(!res.ok||!laterRes.ok)throw new Error('历史切片未正确加载');
  atlasEarly=await res.json();
  atlasLater=await laterRes.json();
  if(!Array.isArray(atlasEarly.events)||!Array.isArray(atlasLater.events)||!Array.isArray(atlasLater.places))throw new Error('历史数据结构错误');
  try{
   const iconResponse=await fetch('data/icon-categories.json',{cache:'no-store'});
   if(iconResponse.ok)iconCatalog=await iconResponse.json();
  }catch(_e){ /* Existing fallback codes remain available. */ }
  setYear(1497); loadKingdomBoundaries();
 }catch(e){
  $('eventList').innerHTML='<div class="loading">无法读取历史资料，请刷新页面或查看 GitHub 原始数据。</div>';
  setWarning('历史数据未能加载：'+String(e.message||e));
 }
}
$('yearRange').addEventListener('input',e=>{stopPlay();if(atlas)setYear(e.target.value)});
$('chapterOne').addEventListener('click',()=>{stopPlay();if(atlasEarly)setYear(1497)});
$('chapterTwo').addEventListener('click',()=>{stopPlay();if(atlasLater)setYear(1500)});
$('prevYear').addEventListener('click',()=>{stopPlay();if(atlas)setYear(year-1)});
$('nextYear').addEventListener('click',()=>{stopPlay();if(atlas)setYear(year+1)});
$('playBtn').addEventListener('click',()=>{if(atlas)togglePlay()});
$('resetDossier').addEventListener('click',resetDossier);
['toggleKingdom','toggleRoutes','toggleCandidates','toggleClaims','toggleEvents','toggleMinorEvents'].forEach(id=>$(id).addEventListener('change',()=>{if(atlas)renderPoints()}));
map.on('zoomend',()=>{if(atlas)renderPoints()});
$('toggleDossierBtn').addEventListener('click',()=>togglePanel('dossier'));
syncPanels();
window.addEventListener('keydown',e=>{if(!atlas)return;if(e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year-1)}if(e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year+1)}});
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),150);
boot();
})();