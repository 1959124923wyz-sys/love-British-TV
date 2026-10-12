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
const groups={kingdom:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),candidate:L.layerGroup().addTo(map),claim:L.layerGroup().addTo(map),event:L.layerGroup().addTo(map),place:L.layerGroup().addTo(map)};
const levelOf=(item)=>Math.max(1,Math.min(3,Number(item.significance?.level||1)));
const rankName={3:'世界／帝国级节点',2:'区域重要节点',1:'地方与补充事件'};
const isUncertain=item=>['regional-symbol-only','associated-city','representative-capital-city','approximate-area','documented-area-not-exact-battle-boundary'].includes(item.geo_precision)||/uncertain/i.test(String(item.certainty||''));
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
 const refs=(ids||[]).map(id=>atlas.sources.find(src=>src.id===id)).filter(Boolean);
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
 const events=atlas.events.filter(e=>(e.visible_from||e.year)<=year).sort((a,b)=>levelOf(b)-levelOf(a)||a.year-b.year);
 $('eventCount').textContent=events.length+'项';
 $('eventList').innerHTML=events.map(e=>'<button type="button" data-tier="'+levelOf(e)+'" class="event-item '+(e.id===selected?'selected':'')+'" data-eid="'+escapeHTML(e.id)+'"><span class="event-icon">'+svgIcon(e,'atlas-list-icon')+'</span><span><small>'+escapeHTML(e.date_label)+'</small><strong>'+escapeHTML(e.name)+(levelOf(e)===3?' <span class="priority-tag">关键</span>':'')+'</strong></span></button>').join('');
 document.querySelectorAll('.event-item').forEach(n=>n.addEventListener('click',()=>openDossier(atlas.events.find(e=>e.id===n.dataset.eid),'event')));
}
function renderPoints(){
 groups.event.clearLayers();groups.candidate.clearLayers();groups.routes.clearLayers();groups.claim.clearLayers();groups.place.clearLayers();
 atlas.events.filter(e=>(e.visible_from||e.year)<=year).forEach(e=>{
  if(e.category==='status'||!Number.isFinite(e.lat)||!Number.isFinite(e.lng))return; // Never invent an event coordinate
  if(e.category==='claim'&&!$('toggleClaims').checked)return;
  if(levelOf(e)===1&&!$('toggleMinorEvents').checked)return; // Curiosity-first; minor markers are opt-in
  const k=levelOf(e),d=k===3?34:k===2?27:21;
  const ico=L.divIcon({className:'',html:iconHTML(e),iconSize:[d,d],iconAnchor:[d/2,d/2]});
  L.marker([e.lat,e.lng],{icon:ico,title:e.name,zIndexOffset:k*250})
   .bindTooltip(hoverCard(e.name,e.description,e),{sticky:true,direction:'top',className:'atlas-hover',opacity:0.98})
   .on('click',()=>openDossier(e,'event')).addTo(groups.event);
 });
 if(atlas.candidates && year<=1499){
  atlas.candidates.forEach(c=>{
   const ico=L.divIcon({className:'',html:'<div class="candidate-pin"></div>',iconSize:[16,16],iconAnchor:[8,8]});
   L.marker([c.lat,c.lng],{icon:ico,title:'候选地：'+c.name})
     .bindTooltip(hoverCard(c.name,c.note),{direction:'top',className:'atlas-hover',opacity:0.98})
     .on('click',()=>openDossier(c,'candidate')).addTo(groups.candidate);
  });
  // A ring is used only as a symbol for a reported royal claim, NOT a territorial boundary.
  L.circleMarker([48.8,-57.2],{radius:23,color:'#b98540',weight:2,dashArray:'4 5',opacity:.9,fill:false,interactive:true})
    .on('click',()=>openDossier(atlas.events.find(e=>e.id==='landfall-1497'),'event'))
    .bindTooltip(hoverCard('1497年主权宣称','王室宣称并不等于英格兰对北美的有效殖民控制。'),{sticky:true,direction:'top',className:'atlas-hover',opacity:0.98})
    .addTo(groups.claim);
 }
 if(year>=1500 && atlas.places){
  atlas.places.forEach(q=>{
   const d=25, placeItem={...q,category:'political',significance:{level:2}};
   const icon=L.divIcon({className:'',html:iconHTML(placeItem),iconSize:[d,d],iconAnchor:[d/2,d/2]});
   L.marker([q.lat,q.lng],{icon,title:q.name,zIndexOffset:95})
    .bindTooltip(hoverCard(q.name,q.description),{sticky:true,direction:'top',className:'atlas-hover',opacity:.98})
    .on('click',()=>openDossier(q,'place')).addTo(groups.place);
  });
 }
 atlas.routes.filter(r=>r.year<=year).forEach(r=>{
  const routeColor=r.year===1497?'#d4a47d':'#97a9bc';
  // Draw the line independently from a wide invisible pointer target; hover is easy without increasing visual clutter.
  const visible=L.polyline(r.coords,{color:routeColor,weight:r.year===1497?2.8:2.1,dashArray:r.year===1497?'8 9':'4 12',opacity:.88,interactive:false,smoothFactor:1.6}).addTo(groups.routes);
  L.polyline(r.coords,{color:'#ffffff',weight:19,opacity:.012,interactive:true,smoothFactor:1.6})
   .bindTooltip(hoverCard(r.name,r.note),{sticky:true,direction:'top',className:'atlas-hover',opacity:0.98})
   .on('mouseover',()=>visible.setStyle({weight:4.5,opacity:1}))
   .on('mouseout',()=>visible.setStyle({weight:r.year===1497?2.8:2.1,opacity:.88}))
   .on('click',()=>openDossier(r,'route')).addTo(groups.routes);
 });
 updateVisibility();
}
function updateVisibility(){
 for(const [id,group] of [['toggleKingdom',groups.kingdom],['toggleRoutes',groups.routes],['toggleCandidates',groups.candidate],['toggleClaims',groups.claim],['toggleEvents',groups.event],['toggleKingdom',groups.place]]){
   if($(id).checked){if(!map.hasLayer(group))map.addLayer(group)}else if(map.hasLayer(group)){map.removeLayer(group)}
 }
}
function setYear(v){
 const next=Math.max(1497,Math.min(1509,Math.round(Number(v)||1497)));
 const chosen=next>=1500?atlasLater:atlasEarly;
 if(!chosen)return;
 if(atlas!==chosen){selected='';$('dossierBody').innerHTML=infoDefault;workspace.classList.add('dossier-collapsed');syncPanels();}
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
 $('factCDesc').innerHTML=later?'爱尔兰<br>诺克多战役':'第二次远航<br>结果尚存争议';
 $('periodTitle').textContent=!later?(year===1497?'亨利七世 · 首次远航':year===1498?'亨利七世 · 第二次远航':'英格兰与苏格兰分别统治'):year===1509?'亨利八世 · 王位更替':'亨利七世 · 英格兰王国';
 renderEventList();renderPoints();
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
$('prevYear').addEventListener('click',()=>{stopPlay();if(atlas)setYear(year-1)});
$('nextYear').addEventListener('click',()=>{stopPlay();if(atlas)setYear(year+1)});
$('playBtn').addEventListener('click',()=>{if(atlas)togglePlay()});
$('resetDossier').addEventListener('click',resetDossier);
['toggleKingdom','toggleRoutes','toggleCandidates','toggleClaims','toggleEvents','toggleMinorEvents'].forEach(id=>$(id).addEventListener('change',()=>{
 if(!atlas)return;
 if(id==='toggleMinorEvents'||id==='toggleClaims')renderPoints();
 else updateVisibility();
}));
$('toggleDossierBtn').addEventListener('click',()=>togglePanel('dossier'));
syncPanels();
window.addEventListener('keydown',e=>{if(!atlas)return;if(e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year-1)}if(e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year+1)}});
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),150);
boot();
})();