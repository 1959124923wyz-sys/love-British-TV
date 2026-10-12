/* Imperial Expansion Atlas · 1497–1500 pilot
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
const groups={kingdom:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),candidate:L.layerGroup().addTo(map),claim:L.layerGroup().addTo(map),event:L.layerGroup().addTo(map),place:L.layerGroup().addTo(map),cluster:L.layerGroup().addTo(map),hypotheses:L.layerGroup().addTo(map)};
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
let researchNotes={};let geographicHypotheses=null;
let vectors={};
const infoDefault=$('dossierBody').innerHTML;
const earlyIntro=$('chapterIntro').textContent;
function setWarning(msg){let e=$('boundaryWarning');if(!e){e=document.createElement('div');e.id='boundaryWarning';e.className='map-warning';$('map').parentElement.appendChild(e)}e.textContent=msg;}
function hideWarning(){let e=$('boundaryWarning');if(e)e.remove();}
function listSources(ids,item){
 const refs=(ids||[]).map(id=>[...(atlas?.sources||[]),...(atlasEarly?.sources||[]),...(atlasLater?.sources||[])].find(src=>src.id===id)).filter(Boolean);
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
 const date=place?'历史政治关系':candidate?'1497年':route?item.year+'年':item.date_label;
 const caption=place?'地理与政治':candidate?'候选登陆地点':route?'航海':categoryName[item.category]||'历史事件';
 const description=candidate?item.note:route?item.note:item.description;
 $('dossierBody').innerHTML='<div class="dossier-kicker">'+escapeHTML(caption)+' · '+escapeHTML(date)+'</div><h2>'+escapeHTML(item.name)+'</h2><p>'+escapeHTML(description)+'</p>'+listSources(item.source_ids,item);
 openPanel('dossier');
 document.querySelectorAll('.event-item').forEach(el=>el.classList.toggle('selected',el.dataset.eid===selected));
}
function openHypothesis(feature){
 const p=feature.properties||{};
 const title=p.public_title||'推定地理范围';
 const url='research/hypotheses/1500/README.md';
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
 const zoom=map.getZoom();
 const showAll=zoom>=4 || $('toggleMinorEvents').checked;
 if($('toggleEvents').checked){
  for(const e of atlas.events){
   if(atlas===atlasEarly&&e.year>1499)continue;
   if(e.category==='status'||!Number.isFinite(e.lat)||!Number.isFinite(e.lng))continue;
   if(e.category==='claim'&&!$('toggleClaims').checked)continue;
   if(levelOf(e)===1&&!showAll)continue;
   shown.push({item:e,type:'event',lat:e.lat,lng:e.lng});
  }
 }
 if($('toggleKingdom').checked&&year>=1500){
  for(const q of atlasLater.places){
   const from=q.start_year==null?1500:q.start_year;
   if(year<from||(q.end_year!=null&&year>q.end_year)||(q.observed_through_year!=null&&year>q.observed_through_year))continue;
   shown.push({item:{...q,significance:{level:2}},type:'place',lat:q.lat,lng:q.lng});
  }
 }
 // Screen-space grouping only plans a fan of real SVG icons, never replacing them with number bubbles.
 const groupsNearby=[];
 for(const item of shown.sort((a,b)=>levelOf(b.item)-levelOf(a.item)||a.item.id.localeCompare(b.item.id))){
  const point=map.latLngToLayerPoint([item.lat,item.lng]);
  let group=groupsNearby.find(g=>Math.hypot(point.x-g.anchor.x,point.y-g.anchor.y)<34);
  if(!group){group={anchor:point,items:[]};groupsNearby.push(group)}
  group.items.push(item);
 }
 const occupied=[];
 const collides=box=>occupied.some(x=>!(box.x2<x.x1||box.x1>x.x2||box.y2<x.y1||box.y1>x.y2));
 for(const g of groupsNearby){
  const n=g.items.length;
  const columns=n===1?1:Math.min(5,Math.ceil(Math.sqrt(n)));
  const rows=Math.ceil(n/columns);
  const step=32;
  const boundsWidth=(columns-1)*step+31;
  const boundsHeight=(rows-1)*step+31;
  const offsets=[];
  // Prefer placing event icons above their associated city; if nearby labels collide, slide the entire fan sideways.
  for(const slide of [0,-45,45,-90,90,-135,135,-180,180]){
   const yBase=n>1?-(rows*step+10):0;
   const bbox={x1:g.anchor.x+slide-boundsWidth/2-5,x2:g.anchor.x+slide+boundsWidth/2+5,y1:g.anchor.y+yBase-5,y2:g.anchor.y+yBase+boundsHeight+5};
   if(!collides(bbox)){offsets.push(slide,yBase,bbox);break}
  }
  if(!offsets.length){const yBase=n>1?-(rows*step+10):0;offsets.push(0,yBase,{x1:g.anchor.x-boundsWidth/2-5,x2:g.anchor.x+boundsWidth/2+5,y1:g.anchor.y+yBase-5,y2:g.anchor.y+yBase+boundsHeight+5})}
  const [slide,yBase,bbox]=offsets;occupied.push(bbox);
  if(n>1){
   const topCenter=map.layerPointToLatLng(L.point(g.anchor.x+slide,g.anchor.y+yBase+boundsHeight));
   const origin=map.layerPointToLatLng(g.anchor);
   L.polyline([origin,topCenter],{color:'#d8bd97',weight:1,opacity:.45,interactive:false,dashArray:'2 5'}).addTo(groups.cluster);
  }
  for(let i=0;i<n;i++){
   const record=g.items[i],item=record.item,k=levelOf(item);
   const d=k===3?30:k===2?27:23;
   const col=i%columns,row=Math.floor(i/columns);
   const x=g.anchor.x+slide+(col-(columns-1)/2)*step;
   const y=g.anchor.y+yBase+row*step+(n>1?15:0);
   const displayLatLng=map.layerPointToLatLng(L.point(x,y));
   const icon=L.divIcon({className:'',html:iconHTML(item),iconSize:[d,d],iconAnchor:[d/2,d/2]});
   L.marker(displayLatLng,{icon,title:item.name,zIndexOffset:500+k*50+i})
    .bindTooltip(hoverCard(item.name,item.short_description||item.description,item),{sticky:true,direction:'top',className:'atlas-hover'})
    .on('click',()=>openDossier(item,record.type)).addTo(groups.cluster);
  }
 }
 if(atlas.candidates&&year<=1499){
  for(const c of atlas.candidates){
   const icon=L.divIcon({className:'',html:'<div class="candidate-pin"></div>',iconSize:[16,16],iconAnchor:[8,8]});
   L.marker([c.lat,c.lng],{icon,title:c.name}).bindTooltip(hoverCard(c.name,c.note),{direction:'top',className:'atlas-hover'})
    .on('click',()=>openDossier(c,'candidate')).addTo(groups.candidate);
  }
  if($('toggleClaims').checked){
   L.circleMarker([48.8,-57.2],{radius:23,color:'#b98540',weight:2,dashArray:'4 5',fill:false})
    .bindTooltip(hoverCard('1497年王室声索','卡博特远航后产生的英王海外权利主张。'),{className:'atlas-hover'})
    .on('click',()=>openDossier(atlas.events.find(e=>e.id==='landfall-1497'),'event')).addTo(groups.claim);
  }
 }
 for(const r of atlas.routes||[]){
  const line=L.polyline(r.coords,{color:r.year===1497?'#d4a47d':'#97a9bc',weight:2.7,dashArray:'8 9',opacity:.88,interactive:false}).addTo(groups.routes);
  L.polyline(r.coords,{color:'#fff',weight:18,opacity:.015,interactive:true})
   .bindTooltip(hoverCard(r.name,r.note),{sticky:true,direction:'top',className:'atlas-hover'})
   .on('mouseover',()=>line.setStyle({weight:4})).on('mouseout',()=>line.setStyle({weight:2.7}))
   .on('click',()=>openDossier(r,'route')).addTo(groups.routes);
 }
 updateVisibility();
}
function renderHypotheses(){
 groups.hypotheses.clearLayers();
 if(!geographicHypotheses||year<1500||!$('toggleHypotheses').checked)return;
 L.geoJSON(geographicHypotheses,{
  filter:f=>['LineString','Polygon','MultiPolygon'].includes(f.geometry?.type),
  style:f=>({
   color:f.geometry.type==='LineString'?'#e9b06e':f.properties?.id?.startsWith('calais')?'#ae85e0':'#d4aa70',
   weight:2.1,dashArray:f.geometry.type==='LineString'?'7 7':'5 7',opacity:.83,
   fill:f.geometry.type!=='LineString',fillOpacity:f.geometry.type==='LineString'?0:.035
  }),
  onEachFeature:(feature,layer)=>{
   const p=feature.properties||{};
   layer.bindTooltip('<strong>'+escapeHTML(p.public_title||'历史地理推定')+'</strong><div class="atlas-hover-summary">'+escapeHTML(p.public_summary||'')+'</div>',{sticky:true,className:'atlas-hover'});
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
 renderEventList();renderPoints();renderHypotheses();renderMilestones();
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
 }catch(err){console.warn('Modern background geography unavailable',err);}
}
function openPolity(group){
 const p=atlasEarly.polities.find(x=>x.id===(group==='scotland'?'scotland':'england'));if(!p)return;
 const title=group==='wales'?'英格兰王权时期的威尔士':p.name;
 const text=group==='scotland'?'1500年前后，苏格兰由詹姆斯四世统治，王室、贵族与地方氏族共同参与本土及群岛的治理。':'1500年前后，英格兰由都铎王朝统治，王室在英格兰本土、加来和部分爱尔兰地区设立军事与行政机构。';
 $('dossierBody').innerHTML='<div class="dossier-kicker">历史国家 · 1500年前后</div><h2>'+escapeHTML(title)+'</h2><p>'+escapeHTML(text)+'</p>'+listSources(p.source_ids,p);
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
  try{
   const [notesResponse,geoResponse]=await Promise.all([
    fetch('data/historical-detail-notes.json',{cache:'no-store'}),
    fetch('data/geography-1500-hypotheses.geojson',{cache:'no-store'})
   ]);
   if(notesResponse.ok)researchNotes=(await notesResponse.json()).records||{};
   if(geoResponse.ok)geographicHypotheses=await geoResponse.json();
  }catch(_e){ /* Text and all vetted history records remain usable. */ }
  setYear(1497);loadKingdomBoundaries();
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
$('toggleHypotheses').addEventListener('change',()=>{if(atlas)renderHypotheses()});
map.on('zoomend',()=>{if(atlas)renderPoints()});

syncPanels();
window.addEventListener('keydown',e=>{if(!atlas)return;if(e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year-1)}if(e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT'){stopPlay();setYear(year+1)}});
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),150);
boot();
})();