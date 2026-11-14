/* 爱英TV historical right-hand territory history inspector.
 * Applies the validated 18C experience to published Tudor territories and
 * 17C archival claims/studies. NO separate reader mode or inferred borders.
 * Only currently displayed, source-attached Leaflet polygons qualify.
 */
(function(){
 'use strict';
 const host=window.__historicOverlapHost;
 if(!host||!window.L)return;
 const {map}=host,$=host.element,esc=host.escapeHTML;
 const reader=window.AtlasReaderCopy;
 const insideRing=(ring,lon,lat)=>{
  let ok=false;
  if(!Array.isArray(ring)||ring.length<3)return false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
   const a=ring[i],b=ring[j],dx=b[0]-a[0],dy=b[1]-a[1];
   const cross=(lon-a[0])*dy-(lat-a[1])*dx;
   if(Math.abs(cross)<1e-8&&lon>=Math.min(a[0],b[0])-1e-8&&lon<=Math.max(a[0],b[0])+1e-8&&
      lat>=Math.min(a[1],b[1])-1e-8&&lat<=Math.max(a[1],b[1])+1e-8)return true;
   if((a[1]>lat)!==(b[1]>lat)&&lon<(b[0]-a[0])*(lat-a[1])/(b[1]-a[1])+a[0])ok=!ok;
  }
  return ok;
 };
 const inGeom=(g,lon,lat)=>{
  const inside=poly=>Array.isArray(poly)&&poly.length>0&&insideRing(poly[0],lon,lat)&&
   !poly.slice(1).some(hole=>insideRing(hole,lon,lat));
  if(g?.type==='Polygon')return inside(g.coordinates);
  if(g?.type==='MultiPolygon')return g.coordinates.some(inside);
  return false;
 };
 const bounds=g=>{
  const result=[];
  const visit=x=>{
   if(Array.isArray(x)&&typeof x[0]==='number'&&typeof x[1]==='number'){result.push(x);return}
   if(Array.isArray(x))x.forEach(visit);
  };
  visit(g.coordinates);
  if(!result.length)return[0,0,0,0];
  return[Math.min(...result.map(x=>x[0])),Math.min(...result.map(x=>x[1])),
   Math.max(...result.map(x=>x[0])),Math.max(...result.map(x=>x[1]))];
 };
 const labelByKind={
  charter:'王室／公司纸面特许',company:'公司商站与贸易',island:'岛屿殖民参考',
  conquest:'军事行动与殖民争夺',administrative:'殖民行政与政策',
  economic_network:'贸易经济网络',land_dispossession:'土地没收与殖民',
  military_impact:'军事行动与抵抗',local_governance:'地方治理',
  control:'历史军事／行政控制',political:'政治关系及地方治理',
  research:'研究参考区'
 };
 const groupName={
  territory:'王室治理／历史区域',colonialClaims:'殖民声索／公司特许',
  seventeenthStudies:'17世纪地区专题',archaeologyReference:'古迹与现代考古参照',
  warVicinity:'战争影响与驻军',warReach:'军事影响参考',
  contestedZones:'冲突争夺区',earlyRegionalImpact:'军事与殖民影响',
  invasionImpact:'入侵与战争影响',tenthExtraction:'土地没收与掠夺',
  nineYearsWar:'爱尔兰战争与抵抗',atlanticContact:'港口与海上军事贸易',
  eleventhAreas:'16世纪末控制／影响区',
  hypotheses:'未核证地理参考',enslavementBands:'强迫迁移／奴役贸易'
 };
 const category=r=>{
  const p=r.feature.properties||{};
  const key=p.display_class||p.display_kind||p.display_group;
  if(p.controller_periods?.length){
   const interval=p.controller_periods.find(z=>z.start_year<=host.getYear()&&host.getYear()<=z.end_year);
   if(interval?.controller_zh)return interval.controller_zh+' · 政治治理';
  }
  return reader.label(p.label_type||labelByKind[key]||groupName[r.group]||'历史区域');
 };
 const title=r=>{
  const p=r.feature.properties||{},y=host.getYear();
  const stage=p.year_stages?.find(x=>x.start_year<=y&&y<=x.end_year);
  return String(stage?.title||p.name||p.title||r.feature.id||'历史区域参考');
 };
 const summary=r=>{
  const p=r.feature.properties||{},y=host.getYear();
  const stage=p.year_stages?.find(x=>x.start_year<=y&&y<=x.end_year);
  return reader.clean(stage?.summary_zh||p.summary_zh||p.history_description||p.description||
   p.annotation||p.note||'');
 };
 const clip=(t,n=120)=>t.length>n?t.slice(0,n-1)+'…':t;
 const period=r=>{
  const p=r.feature.properties||{},y=host.getYear();
  const stage=p.year_stages?.find(x=>x.start_year<=y&&y<=x.end_year);
  const start=stage?.start_year??p.start_year??p.year??y;
  const end=stage?.end_year??p.end_year??p.observed_through_year??p.display_through_year??start;
  return start===end?String(start):start+'—'+end;
 };
 const validYear=()=>(host.getYear()>=1497&&host.getYear()<=1699)||host.hasNineteenthAreas?.();
 const enabled=()=>validYear()&&$('mapLayerTerritory')?.checked&&$('toggleTerritorialFootprints')?.checked;
 const urlHost=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return'历史资料'}};
 const links=r=>{
  const p=r.feature.properties||{},urls=[...(p.source_urls||[])];
  for(const sid of p.source_ids||[]){
   const ref=host.sourceForId(sid);
   if(ref?.url)urls.push(ref.url);
  }
  return[...new Set(urls)].filter(u=>typeof u==='string'&&u.startsWith('https://'));
 };
 const score=r=>{
  const p=r.feature.properties||{},k=p.display_class||p.display_kind||p.display_group||'';
  if(['conquest','military_impact','control','administrative'].includes(k))return 0;
  if(['land_dispossession','local_governance'].includes(k))return 1;
  if(['island','company','economic_network'].includes(k))return 2;
  if(k==='charter')return 4;
  if(k==='research')return 5;
  return 3;
 };
 const size=r=>{const b=bounds(r.feature.geometry);return Math.abs((b[2]-b[0])*(b[3]-b[1]))};
 let activeRecords=[],selected=null,focused=null,point=null,currentYear=host.getYear(),openedVia=null;
 const pane='atlasHistoricalOverlapFocusPane';
 map.createPane(pane);map.getPane(pane).style.zIndex='630';
 map.getPane(pane).style.pointerEvents='none';
 const renderer=L.svg({pane});
 const glowLayers=L.layerGroup().addTo(map);
 const clearGlow=()=>{glowLayers.clearLayers();focused=null};
 const idOf=r=>r.group+':'+(r.feature.id||r.feature.properties?.id||r.feature.properties?.name||L.stamp(r.layer));
 function live(){
  if(!enabled())return[];
  return host.visibleAreaFeatures().filter(x=>x.feature?.geometry&&
   ['Polygon','MultiPolygon'].includes(x.feature.geometry.type)).map(x=>({...x,key:idOf(x)}));
 }
 function at(coord){
  return live().filter(r=>inGeom(r.feature.geometry,coord.lng,coord.lat))
   .sort((a,b)=>score(a)-score(b)||size(a)-size(b)||title(a).localeCompare(title(b),'zh'));
 }
 function outline(record){
  if(!record||focused===record.key)return;
  clearGlow();focused=record.key;
  const make=(col,weight,opacity,cls)=>L.geoJSON(record.feature,{
   pane,renderer,interactive:false,style:()=>({pane,color:col,weight,opacity,
    fill:false,dashArray:'7 6',lineJoin:'round',className:cls})
  }).addTo(glowLayers);
  make('#ffcf7e',10,.36,'atlas-18c-overlap-halo');
  make('#fff0b2',4,1,'atlas-18c-overlap-glow');
 }
 function card(r,i){
  const isOpen=r.key===selected,desc=summary(r),src=links(r),is19c=r.group==='nineteenthAreas';
  const events=is19c&&isOpen?(r.feature.properties.related_event_ids||[])
   .map(id=>host.eventForId(id)).filter(e=>e&&e.year<=host.getYear()):[];
  return '<article class="atlas-18c-overlap-card'+(isOpen?' is-selected':'')+
   '" data-historic-overlap-id="'+esc(r.key)+'" data-historic-index="'+i+'">'+
   '<button class="atlas-18c-overlap-trigger" data-historic-open="'+i+
   '" type="button" aria-expanded="'+String(isOpen)+'">'+
   '<span class="atlas-18c-overlap-topline">'+(is19c?'':'<span class="atlas-18c-overlap-order">'+String(i+1).padStart(2,'0')+'</span>')+
   '<span class="atlas-18c-overlap-kind">'+esc(clip(category(r),47))+'</span>'+
   '<span class="atlas-18c-overlap-years">'+esc(period(r))+'</span></span>'+
   '<strong class="atlas-18c-overlap-title">'+esc(title(r))+'</strong>'+
   (desc&&!isOpen?'<span class="atlas-18c-overlap-summary">'+esc(clip(desc))+'</span>':'')+'</button>'+
   (isOpen?'<div class="atlas-18c-overlap-detail">'+
    (is19c?'':'<div class="atlas-18c-overlap-facts"><div><span>历史时段</span><b>'+esc(period(r))+'</b></div>'+
    '<div><span>图层性质</span><b>'+esc(clip(category(r),75))+'</b></div></div>')+
    (desc?'<p>'+esc(desc)+'</p>':'')+
    (events.length?'<div class="zone-related">'+events.map(e=>
     '<button type="button" class="zone-record-link" data-area-event="'+esc(e.id)+'">'+esc(e.name)+'</button>'
    ).join('')+'</div>':'')+
    '<details class="atlas-18c-overlap-sources"><summary>历史文献与来源 ('+src.length+')</summary>'+
    '<div class="atlas-18c-overlap-source-links">'+src.map(u=>
     '<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">资料来源 · '+esc(urlHost(u))+' ↗</a>').join('')+

    '</div></details></div>':'')+'</article>';
 }
 function renderCards(){
  if(!activeRecords.length)return;
  const container=$('dossierBody');
  container.innerHTML='<section id="atlasHistoricOverlapPanel" class="atlas-18c-overlap-panel">'+
   '<div class="dossier-kicker">历史地理区块 · '+host.getYear()+'年</div>'+
   '<h2>'+(activeRecords.length===1?'历史区域档案':'此处涉及 '+activeRecords.length+' 条历史区域记录')+'</h2>'+
   '<p class="atlas-18c-overlap-lead">悬停高亮区域 · 点击展开详情</p>'+
   '<div class="atlas-18c-overlap-list">'+activeRecords.map(card).join('')+'</div>'+
   '</section>';
  for(const el of container.querySelectorAll('[data-historic-index]')){
   const rec=activeRecords[Number(el.dataset.historicIndex)];
   el.addEventListener('pointerenter',()=>outline(rec));
   el.addEventListener('pointerleave',()=>outline(activeRecords.find(r=>r.key===selected)));
   el.addEventListener('focusin',()=>outline(rec));
   el.addEventListener('focusout',e=>{if(!el.contains(e.relatedTarget))outline(activeRecords.find(r=>r.key===selected))});
  }
  for(const btn of container.querySelectorAll('[data-historic-open]')){
   btn.addEventListener('click',()=>{
    const rec=activeRecords[Number(btn.dataset.historicOpen)];
    if(!rec)return;
    selected=rec.key;renderCards();outline(rec);
   });
  }
  for(const btn of container.querySelectorAll('[data-area-event]')){
   btn.addEventListener('click',()=>host.openEvent(host.eventForId(btn.dataset.areaEvent)));
  }
  host.openPanel('dossier');
 }
 function openAt(ll,source,preferredFeatureId){
  if(!enabled())return false;
  const found=at(ll);
  if(!found.length)return false;
  const first=found.find(r=>r.feature.id===preferredFeatureId)||found[0];
  activeRecords=found;point=ll;currentYear=host.getYear();
  selected=first.key;openedVia=source;
  renderCards();outline(first);
  return true;
 }
 // Capture actual map pixels before other Leaflet layers can stop propagation.
 // Event glyphs and their dedicated interactive paths retain their own actions.
 function capture(e){
  if(!enabled()||!map.getContainer().contains(e.target))return;
  // Keep legacy synthetic map-container tests on the ordinary Leaflet fallback.
  if(!e.isTrusted&&e.target===map.getContainer())return;
  if(e.target.closest?.('.leaflet-control-container,.leaflet-marker-icon,.leaflet-popup,.leaflet-tooltip,.atlas-voyage-hit'))return;
  const candidates=live();
  const hit=candidates.find(r=>r.layer._path&&(r.layer._path===e.target||r.layer._path.contains(e.target)));
  if(!hit&&e.target.closest?.('.leaflet-interactive'))return;
  const ll=map.mouseEventToLatLng(e),records=at(ll);
  if(!records.length&&!hit)return;
  if(!records.length&&hit){
   activeRecords=[hit];point=ll;currentYear=host.getYear();openedVia='visible-polygon';
   selected=hit.key;renderCards();outline(hit);
  }else{
   openAt(ll,hit?'visible-polygon':records.length>1?'capture-transparent-overlap':'capture-transparent-single');
  }
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
 }
 document.addEventListener('click',capture,true);
 // A transparent interior over TWO OR MORE current source envelopes must be
 // directly inspectable, without demanding a pixel-perfect stroke click.
 map.on('click',ev=>{
  if(!enabled()||ev.originalEvent?.target?.closest?.('.leaflet-marker-icon,.leaflet-popup'))return;
  const matches=at(ev.latlng);
  if(matches.length)openAt(ev.latlng,matches.length>1?'transparent-overlap':'transparent-single');
 });
 // Do not leave historic hover focus behind after a normal story is opened.
 new MutationObserver(()=>{
  if(activeRecords.length&&!$('atlasHistoricOverlapPanel')){
   activeRecords=[];point=null;selected=null;clearGlow();
  }
 }).observe($('dossierBody'),{childList:true});
 function render(){
  const newYear=host.getYear();
  if(point&&!$('atlasHistoricOverlapPanel')){
   activeRecords=[];point=null;selected=null;clearGlow();
  }
  if(!enabled()){
   clearGlow();
   if($('atlasHistoricOverlapPanel')){
    activeRecords=[];selected=null;point=null;
    $('dossierBody').innerHTML='<div class="dossier-kicker">历史地图</div>'+
     '<h2>本年代没有正在显示的对应区域</h2><p>开启“版图”，或选择其他年份查看。</p>';
   }
   currentYear=newYear;return;
  }
  if(!point){currentYear=newYear;return}
  const old=activeRecords.length,refreshed=at(point);
  if(newYear!==currentYear||refreshed.length!==old||refreshed.some((x,i)=>x.key!==activeRecords[i]?.key)){
   currentYear=newYear;
   if(!refreshed.length){
    activeRecords=[];point=null;selected=null;clearGlow();
    $('dossierBody').innerHTML='<div class="dossier-kicker">历史地图 · '+newYear+'年</div>'+
     '<h2>所选位置本年没有对应区块</h2><p>请在地图上重新选择。</p>';
    return;
   }
   activeRecords=refreshed;
   if(!activeRecords.some(r=>r.key===selected))selected=activeRecords[0].key;
   renderCards();outline(activeRecords.find(r=>r.key===selected));
  }
 }
 window.historicOverlapDossier={
  render,openAt,
  hitCountAt:(lat,lng)=>at(L.latLng(lat,lng)).length,
  getAudit:()=>{
   const current=enabled()?live():[],groups={};
   for(const r of current)groups[r.group]=(groups[r.group]||0)+1;
   return {year:host.getYear(),enabled:enabled(),liveAreas:current.length,groups,
    selectedCount:activeRecords.length,selected,focused,openedVia,
    glowCount:glowLayers.getLayers().length,open:!!$('atlasHistoricOverlapPanel'),
    sourceRecordIds:activeRecords.map(r=>r.key)};
  }
 };
})();
