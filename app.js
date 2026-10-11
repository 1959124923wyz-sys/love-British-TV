/* Imperial Expansion Atlas · 1497–1500 pilot
   Facts, geography and provenance live in data/atlas-1497-1500.json.
   All speculative routes are marked illustrative. */
(function(){
'use strict';
const $ = id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const map = L.map('map',{zoomControl:false,worldCopyJump:false,preferCanvas:true,minZoom:2,maxZoom:11,scrollWheelZoom:true}).setView([51,-31],3);
L.control.zoom({position:'topright'}).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
 subdomains:'abcd',maxZoom:19,maxNativeZoom:19,
 attribution:'&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);
const groups={kingdom:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),candidate:L.layerGroup().addTo(map),claim:L.layerGroup().addTo(map),event:L.layerGroup().addTo(map)};
const iconHTML=(name)=>'<div class="map-pin '+escapeHTML(name)+'"></div>';
const categoryName={political:'王室授权',voyage:'航海行动',claim:'王室宣称',status:'研究结论'};
const categorySymbol={political:'♜',voyage:'➤',claim:'⚑',status:'✓'};
let atlas=null; let year=1497; let selected=''; let timer=null;
let vectors={};
const infoDefault=$('dossierBody').innerHTML;
function setWarning(msg){let e=$('boundaryWarning');if(!e){e=document.createElement('div');e.id='boundaryWarning';e.className='map-warning';$('map').parentElement.appendChild(e)}e.textContent=msg;}
function hideWarning(){let e=$('boundaryWarning');if(e)e.remove();}
function listSources(ids){if(!ids||!ids.length)return '<p>本条资料尚未列出单独的引文索引。</p>';return '<div class="source-list">'+ids.map(id=>{const s=atlas.sources.find(v=>v.id===id);return s?'<a class="source-link" href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(s.publisher)+' · '+escapeHTML(s.title)+' ↗</a>':''}).join('')+'</div>';}
function openDossier(item,typ){
 if(!item)return;
 const isCandidate=typ==='candidate'; const isRoute=typ==='route'; selected=item.id;
 const title=item.name;const date=isCandidate?'1497年 · 登陆候选地点':isRoute?item.year+'年 · 航线示意':item.date_label;
 const label=isCandidate?'位置假说':isRoute?'方向示意':(categoryName[item.category]||'历史资料');
 const desc=isCandidate?item.note:isRoute?item.note:item.description;
 let details='';
 if(!isCandidate&&!isRoute){details='<div class="dossier-meta"><span class="meta-chip">'+escapeHTML(item.certainty)+'</span><span class="meta-chip">'+escapeHTML(item.geo_precision)+'</span></div>';}
 else details='<div class="dossier-meta"><span class="meta-chip">地理不确定</span><span class="meta-chip">不得作为精确轨迹或实际控制区</span></div>';
 const warning=(isCandidate||isRoute||item.category==='claim'||item.category==='status')?'<div class="dossier-note"><strong>史料边界</strong><p>地图上的位置或形状用于辨识历史问题，并不表示实际登陆点、精确航路或已确立的殖民统治边界。</p></div>':'';
 $('dossierBody').innerHTML='<div class="dossier-kicker">'+escapeHTML(label)+' · '+escapeHTML(date)+'</div><h2>'+escapeHTML(title)+'</h2>'+details+'<p>'+escapeHTML(desc)+'</p>'+warning+'<div class="mini-heading">文献与研究来源</div>'+listSources(item.source_ids);
 $('dossier').classList.add('visible');
 document.querySelectorAll('.event-item').forEach(n=>n.classList.toggle('selected',n.dataset.eid===selected));
}
function resetDossier(){selected='';$('dossierBody').innerHTML=infoDefault;document.querySelectorAll('.event-item').forEach(n=>n.classList.remove('selected'));$('dossier').classList.remove('visible')}
function renderEventList(){
 const events=atlas.events.filter(e=>(e.visible_from||e.year)<=year).sort((a,b)=>a.year-b.year);
 $('eventCount').textContent=events.length+'项';
 $('eventList').innerHTML=events.map(e=>'<button type="button" class="event-item '+(e.id===selected?'selected':'')+'" data-eid="'+escapeHTML(e.id)+'"><span class="event-icon">'+(categorySymbol[e.category]||'•')+'</span><span><small>'+escapeHTML(e.date_label)+'</small><strong>'+escapeHTML(e.name)+'</strong></span></button>').join('');
 document.querySelectorAll('.event-item').forEach(n=>n.addEventListener('click',()=>openDossier(atlas.events.find(e=>e.id===n.dataset.eid),'event')));
}
function renderPoints(){
 groups.event.clearLayers();groups.candidate.clearLayers();groups.routes.clearLayers();groups.claim.clearLayers();
 atlas.events.filter(e=>(e.visible_from||e.year)<=year).forEach(e=>{
  if(e.category==='claim'&&!$('toggleClaims').checked)return;
  if(e.category==='status')return; // status is a dossier entry; avoids a fabricated colony location
  const ico=L.divIcon({className:'',html:iconHTML(e.category),iconSize:[16,16],iconAnchor:[8,8]});
  L.marker([e.lat,e.lng],{icon:ico,title:e.name}).on('click',()=>openDossier(e,'event')).addTo(groups.event);
 });
 if(year>=1497){
  atlas.candidates.forEach(c=>{
   const ico=L.divIcon({className:'',html:'<div class="candidate-pin"></div>',iconSize:[16,16],iconAnchor:[8,8]});
   L.marker([c.lat,c.lng],{icon:ico,title:'候选地：'+c.name})
     .bindTooltip(c.name,{direction:'top',className:'place-label',opacity:0.95})
     .on('click',()=>openDossier(c,'candidate')).addTo(groups.candidate);
  });
  // A ring is used only as a symbol for a reported royal claim, NOT a territorial boundary.
  L.circleMarker([48.8,-57.2],{radius:23,color:'#b98540',weight:2,dashArray:'4 5',opacity:.9,fill:false,interactive:true})
    .on('click',()=>openDossier(atlas.events.find(e=>e.id==='landfall-1497'),'event'))
    .bindTooltip('1497王室宣称：不等于实际控制', {direction:'top',className:'place-label'})
    .addTo(groups.claim);
 }
 atlas.routes.filter(r=>r.year<=year).forEach(r=>{
  L.polyline(r.coords,{color:r.year===1497?'#9e623a':'#9a8b76',weight:r.year===1497?2.8:2,dashArray:r.year===1497?'8 9':'3 11',opacity:r.year===1497?.85:.75,
   smoothFactor:1.8,interactive:true
  }).on('click',()=>openDossier(r,'route')).bindTooltip(r.name+' · 非精确航线',{sticky:true,className:'place-label'}).addTo(groups.routes);
 });
 updateVisibility();
}
function updateVisibility(){
 for(const [id,group] of [['toggleKingdom',groups.kingdom],['toggleRoutes',groups.routes],['toggleCandidates',groups.candidate],['toggleClaims',groups.claim]]){
   if($(id).checked){if(!map.hasLayer(group))map.addLayer(group)}else if(map.hasLayer(group)){map.removeLayer(group)}
 }
}
function setYear(v){
 year=Math.max(1497,Math.min(1500,Math.round(Number(v)||1497)));
 $('yearRange').value=year;$('bigYear').textContent=year;$('timeYear').textContent=year;
 $('periodTitle').textContent=year===1497?'亨利七世 · 首次远航':year===1498?'亨利七世 · 第二次远航':year===1499?'英格兰与苏格兰仍为独立王国':'阶段观察 · 无已证实殖民地';
 renderEventList();renderPoints();
 // Deliberately do not pan, fit bounds, or reset zoom on time changes.
}
function stopPlay(){if(timer){clearInterval(timer);timer=null;$('playBtn').textContent='▶'}}
function togglePlay(){if(timer){stopPlay();return}if(year===1500)setYear(1497);$('playBtn').textContent='Ⅱ';timer=setInterval(()=>{if(year===1500){stopPlay();return}setYear(year+1)},1250)}
function fitAtlantic(){map.fitBounds([[33,-75],[65,13]],{padding:[35,35],animate:true})}
function fitAmerica(){map.fitBounds([[42,-70],[57,-49]],{padding:[35,35],animate:true})}
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
   const c=group==='scotland'?'#c4aa8a':'#d68b55';
   const layer=L.geoJSON(f,{style:{color:c,weight:1.4,fillColor:c,fillOpacity:group==='scotland'?.22:.36,opacity:.95},interactive:true})
     .on('click',()=>openPolity(group)).addTo(groups.kingdom);
  }
  if(!count)throw new Error('Region names could not be decoded');
  hideWarning();
 }catch(err){setWarning('王国地理参考轮廓暂时不可用；地图事件与航线仍可独立浏览。此时不使用臆造历史边界。');}
}
function openPolity(group){
 const p=atlas.polities.find(x=>x.id===(group==='scotland'?'scotland':'england'));if(!p)return;
 const subtitle=group==='wales'?'英格兰王权统治下的威尔士（现代边界参考）':p.name;
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史国家 · 1497—1500</div><h2>'+escapeHTML(subtitle)+'</h2><p>'+escapeHTML(p.note)+'</p><div class="dossier-note"><strong>地图边界说明</strong><p>着色形状来自现代英国统计区边界，仅用于定位英格兰、苏格兰及威尔士的地理范围；不是1497年的精确政治边界，不可据此判断边境争议地区的历史归属。</p></div>'+listSources(p.source_ids);
 $('dossier').classList.add('visible');
}
async function boot(){
 try{
  const res=await fetch('data/atlas-1497-1500.json',{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);
  atlas=await res.json();
  if(!atlas||!Array.isArray(atlas.events)||!Array.isArray(atlas.routes))throw new Error('数据结构错误');
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
$('focusAtlantic').addEventListener('click',fitAtlantic);
$('focusAmerica').addEventListener('click',fitAmerica);
$('resetDossier').addEventListener('click',resetDossier);
['toggleKingdom','toggleRoutes','toggleCandidates','toggleClaims'].forEach(id=>$(id).addEventListener('change',()=>{if(atlas)updateVisibility()}));
window.addEventListener('keydown',e=>{if(!atlas)return;if(e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year-1)}if(e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year+1)}});
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),150);
boot();
})();