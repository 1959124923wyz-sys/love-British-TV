/* 5AK: 56 archived, sourced, locality-only context outlines from the original 403.
 * Unrectified editorial BBOX is a hollow dashed reading cue, not occupied territory,
 * historical legal line, displacement acreage or fiscal-district survey.
 * 5AA/5AB/5AC/5AD/5AE real GIS and all source Points remain authoritative.
 */
(function(){
 'use strict';
 const host=window.__eighteenthSpatialHost;
 if(!host||!window.L)return;
 const map=host.map,$=host.element,esc=host.escapeHTML;
 const pane='eighteenth5akContextPane';
 map.createPane(pane);
 map.getPane(pane).style.zIndex='439';
 const renderer=L.svg({pane});
 const group=L.layerGroup().addTo(map);
 const kindColor=window.AtlasMapColors.map(["revenue","battle","resistance","displacement","coercion","trade_influence","diplomacy","military","administration"]);
 const kindLabel={
  revenue:'财政活动地区',battle:'历史战事地点',
  resistance:'当地抵抗地区',displacement:'强制迁移相关地点',
  coercion:'强制行为相关地点',trade_influence:'历史商贸联系',
  diplomacy:'外交交涉地点',military:'军事驻防地点',
  administration:'殖民行政活动'
 };
 const within=(ps,y)=>ps?.some(p=>p.start_year<=y&&y<=p.end_year);
 let records=[],loaded=false,error=null,year=host.getYear();
 const enabled=()=>year>=1700&&year<=1799&&
  $('mapLayerTerritory').checked&&$('toggleControlAreas').checked&&
  $('toggleTerritorialFootprints').checked;
 const active=r=>within(r.periods,year)&&within(r.replacement_periods,year);
 function open(record){
  const urls=[...new Set([...record.old_source_urls,...record.replacement_source_urls])]
   .filter(u=>typeof u==='string'&&u.startsWith('https://'));
  const p=record.periods.find(x=>x.start_year<=year&&year<=x.end_year);
  if(!p)return;
  host.clearSelection();
  $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪历史地点 · '+year+'年</div>'+
   '<h2>'+esc(record.title)+'</h2>'+
   '<p><strong>'+esc(kindLabel[record.kind]||'历史地区')+'</strong>　'+
   p.start_year+'—'+p.end_year+'年</p>'+
   (record.old_note?'<p>'+esc(record.old_note)+'</p>':'')+
   '<details><summary>历史来源</summary><ul class="source-list">'+
   urls.map(u=>'<li><a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+
     esc((new URL(u)).hostname)+'</a></li>').join('')+
   '</ul></details>';
  host.openPanel('dossier');
 }
 function render(){
  year=host.getYear();
  group.clearLayers();
  if(!loaded||!enabled())return;
  const chosen=records.filter(active).sort((a,b)=>{
   const area=r=>(r.bbox[2]-r.bbox[0])*(r.bbox[3]-r.bbox[1]);
   return area(b)-area(a);
  });
  for(const r of chosen){
   const [w,s,e,n]=r.bbox,c=kindColor[r.kind]||window.AtlasMapColors.resolve('neutral');
   const shape=L.rectangle([[s,w],[n,e]],{
    renderer,pane,color:c,weight:1.35,opacity:.56,dashArray:'2 9',
    lineCap:'round',fill:false,fillOpacity:0,
    interactive:true,bubblingMouseEvents:false,
    className:'atlas-18c-5ak-reference-outline'
   });
   shape.bindTooltip('<strong>'+esc(r.title)+'</strong><div class="atlas-hover-summary">'+
    esc(kindLabel[r.kind]||'历史地区')+'</div>',{
    sticky:true,direction:'auto',pane:'eventTooltipPane',
    className:'atlas-hover',offset:[12,0]
   });
   shape.on('click',ev=>{
    if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);
    open(r);
   });
   shape.on('add',()=>shape.getElement()?.setAttribute('data-old-id',r.id));
   shape.addTo(group);
  }
 }
 function valid(r){
  const b=r.bbox,delta=b&&[b[2]-b[0],b[3]-b[1]];
  const cap=r.kind==='revenue'?1.7:.55;
  return r.in_pre5d_active_403===true&&r.replacement_type==='Point'&&
   r.uncertain_line_dashed===true&&r.fill_authorized===false&&
   r.territorial_control_verified===false&&
   r.historical_boundary_confirmed===false&&r.area_sqkm===null&&
   b?.length===4&&b.every(Number.isFinite)&&
   b[0]>=-180&&b[2]<=180&&b[1]>=-90&&b[3]<=90&&
   delta[0]>0&&delta[1]>0&&delta[0]<=cap+1e-8&&delta[1]<=cap+1e-8&&
   r.periods?.length&&r.replacement_periods?.length&&
   r.old_source_urls?.some(u=>u.startsWith('https://'))&&
   r.replacement_source_urls?.some(u=>u.startsWith('https://'))&&
   r.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&
    p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year)&&
   r.periods.some(p=>r.replacement_periods.some(q=>
    p.start_year<=q.end_year&&q.start_year<=p.end_year));
 }
 async function load(){
  try{
   const response=await fetch('data/eighteenth-century-editor45-5ak-recovered-source-contexts.json',{cache:'no-store'});
   if(!response.ok)throw Error('5AK registry unavailable '+response.status);
   const doc=await response.json();
   if(doc.schema!=='atlas-18c-editor45-5ak-source-point-overview-recovery-v1'||
     doc.records?.length!==56||doc.excluded?.length!==14||
     new Set(doc.records.map(r=>r.id)).size!==56||
     doc.records.some(r=>!valid(r)))
    throw Error('5AK source, extent or year registry integrity failure');
   records=doc.records;
   loaded=true;render();
  }catch(e){error=String(e);console.warn('5AK context outlines unavailable; original map unaffected',e)}
 }
 window.eighteenthEditor45FiveAK={
  render,
  getAudit:()=>({loaded,error,year,records:records.length,
   activeIds:loaded&&enabled()?records.filter(active).map(r=>r.id):[],
   visibleOutlines:group.getLayers().length,
   areaStatisticsSupported:false})
 };
 void load();
})();
