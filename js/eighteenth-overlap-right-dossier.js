/* 爱英TV 18C original-map overlap picker — right dossier only.
 * Source archive remains untouched; all historical outlines stay on the map.
 * Click an overlapping polygon or dated site -> right column lists matching
 * records; hover/focus a record -> highlight exactly that record's own outline.
 */
(function(){
 'use strict';
 if(new URLSearchParams(location.search).get('review18c')!=='1')return;
 const host=window.__eighteenthSpatialHost;
 if(!host||!window.L)return;
 const map=host.map,$=host.element,esc=host.escapeHTML;
 const reader=window.AtlasReaderCopy;
 const sourceFiles=[
  'data/eighteenth-century-mass-schematic-zones-1700-1799.json',
  'data/eighteenth-century-expansion-batch36-1700-1799.json',
  ...['africa','india-ocean','caribbean'].map(x=>'data/eighteenth-century-b37-'+x+'.json'),
  ...['south-campaign','hudson-company','india-mysore'].map(x=>'data/eighteenth-century-b38-'+x+'.json'),
  ...['caribbean-1759-1763','gold-coast-forts','gulf-surat-factories'].map(x=>'data/eighteenth-century-b39-'+x+'.json')
 ];
 const classSelector=[
  '.atlas-18c-dynamic-area','.atlas-18c-dynamic-core',
  '.atlas-18c-mass-zone','.atlas-18c-mass-core',
  '.atlas-18c-b36-zone','.atlas-18c-b36-site',
  '.atlas-18c-b37-zone','.atlas-18c-b37-site',
  '.atlas-18c-b38-zone','.atlas-18c-b38-site',
  '.atlas-18c-b39-zone','.atlas-18c-b39-site'
 ].join(',');
 const named={
  military:'英方军事驻守',wartime_occupation:'短期军事占领',
  military_vicinity:'驻军周边参考',administration:'殖民行政',
  revenue:'公司财政税权',trade_influence:'贸易与商业联系',
  paper_claim:'法理声索',diplomacy:'外交与条约',
  resistance:'当地自主与抵抗',displacement:'强制迁移',
  coercion:'暴力与掠夺',battle:'战斗与撤离',
  foreign_occupation:'其他国家控制'
 };
 const rank={military:0,wartime_occupation:1,administration:2,
  resistance:3,foreign_occupation:4,battle:5,coercion:6,
  displacement:7,revenue:8,military_vicinity:9,
  trade_influence:10,diplomacy:11,paper_claim:12};
 const active=(o,y)=>o.periods.some(p=>p.start_year<=y&&y<=p.end_year);
 const phase=(o,y)=>o.periods.find(p=>p.start_year<=y&&y<=p.end_year);
 const square=b=>(b[2]-b[0])*(b[3]-b[1]);
 const within=(b,lng,lat)=>lng>=b[0]-1e-8&&lng<=b[2]+1e-8&&lat>=b[1]-1e-8&&lat<=b[3]+1e-8;
 const kindFromChinese=x=>{
  const t=String(x.category||'');
  if(/马龙|自治|抵抗|自主/.test(t))return'resistance';
  if(/贸易|商馆|商站/.test(t))return'trade_influence';
  if(/纸面|声索|条约/.test(t))return'paper_claim';
  if(/行政|殖民/.test(t))return'administration';
  if(/税|财政/.test(t))return'revenue';
  return'military';
 };
 const clip=(s,n=110)=>String(s||'').length>n?String(s).slice(0,n-1)+'…':String(s||'');
 const bounds=b=>[[b[1],b[0]],[b[3],b[2]]];
 const polygonInside=(geometry,lng,lat)=>{
  const pointInRing=ring=>{
   let inside=false;
   for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const a=ring[i],b=ring[j];
    if((a[1]>lat)!==(b[1]>lat)&&lng<(b[0]-a[0])*(lat-a[1])/(b[1]-a[1])+a[0])
     inside=!inside;
   }
   return inside;
  };
  const one=poly=>poly.length>0&&pointInRing(poly[0])&&!poly.slice(1).some(pointInRing);
  if(geometry?.type==='Polygon')return one(geometry.coordinates);
  if(geometry?.type==='MultiPolygon')return geometry.coordinates.some(one);
  return false;
 };
 const geomBBox=geometry=>{
  const points=[];
  const scan=x=>{
   if(Array.isArray(x)&&typeof x[0]==='number'&&typeof x[1]==='number'){points.push(x);return}
   if(Array.isArray(x))x.forEach(scan);
  };
  scan(geometry?.coordinates);
  if(!points.length)throw Error('Old archival polygon lacks geometry');
  return [
   Math.min(...points.map(x=>x[0])),Math.min(...points.map(x=>x[1])),
   Math.max(...points.map(x=>x[0])),Math.max(...points.map(x=>x[1]))
  ];
 };
 const areas=[],sites=[],byId=new Map();
 let loaded=false,error=null,renderYear=host.getYear(),selected=null,focused=null,activeRecords=[],clickLocation=null,lastActivation=null;
 const glowPane='atlas18cOverlapGlowPane';
 map.createPane(glowPane);map.getPane(glowPane).style.zIndex='620';
 map.getPane(glowPane).style.pointerEvents='none';
 const glowRenderer=L.svg({pane:glowPane});
 const glowGroup=L.layerGroup().addTo(map);
 function clearGlow(){glowGroup.clearLayers();focused=null}
 function geometryLayer(record,opts){
  if(record.geometry){
   return L.geoJSON({type:'Feature',geometry:record.geometry,properties:{}},
    {pane:glowPane,renderer:glowRenderer,interactive:false,style:()=>opts});
  }
  if(record.bbox){
   return L.rectangle(bounds(record.bbox),{...opts,pane:glowPane,renderer:glowRenderer,interactive:false});
  }
  const c=record.coordinates||[];
  return L.circleMarker([c[1],c[0]],{
   ...opts,pane:glowPane,renderer:glowRenderer,interactive:false,
   radius:16
  });
 }
 function glow(record){
  if(!record||focused===record.id)return;
  glowGroup.clearLayers();focused=record.id;
  const base={fill:false,interactive:false,dashArray:'6 5',lineCap:'round',
   className:'atlas-18c-overlap-glow',color:'#ffe9a3',weight:4,opacity:1};
  geometryLayer(record,{...base,color:'#ffd27a',weight:11,opacity:.32,
   className:'atlas-18c-overlap-halo'}).addTo(glowGroup);
  geometryLayer(record,base).addTo(glowGroup);
 }
 const sources=o=>[...new Set(o.source_urls||[])].filter(u=>/^https:\/\//.test(u));
 const urlName=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return'资料来源'}};
 const note=o=>reader.clean(o.note||'');
 const enabled=()=>host.getYear()>=1700&&host.getYear()<=1799&&
  $('mapLayerTerritory').checked&&$('toggleControlAreas').checked&&$('toggleTerritorialFootprints').checked;
 const intersects=(o,lng,lat)=>o.geometry?polygonInside(o.geometry,lng,lat):within(o.bbox,lng,lat);
 const nearSite=(o,latlng)=>{
  const xy=map.latLngToContainerPoint(latlng);
  const p=map.latLngToContainerPoint([o.coordinates[1],o.coordinates[0]]);
  return xy.distanceTo(p)<=11;
 };
 function locate(latlng,targetIsPoint){
  const y=host.getYear(),hits=areas.filter(o=>active(o,y)&&intersects(o,latlng.lng,latlng.lat));
  if(targetIsPoint){
   const near=sites.filter(o=>active(o,y)&&nearSite(o,latlng));
   const present=new Set(hits.map(o=>o.id));
   for(const site of near){
    const parent=site.linked_zone_id&&byId.get(site.linked_zone_id);
    if(parent&&active(parent,y)){
     if(!present.has(parent.id)){hits.push(parent);present.add(parent.id)}
    }else if(!hits.some(h=>h.title===site.title&&h.kind===site.kind)){
     hits.push(site);
    }
   }
  }
  hits.sort((a,b)=>(rank[a.kind]??99)-(rank[b.kind]??99)||
   (a.bbox?square(a.bbox):0)-(b.bbox?square(b.bbox):0)||
   a.title.localeCompare(b.title,'zh'));
  return hits;
 }
 function selectedRecord(){return activeRecords.find(r=>r.id===selected)||activeRecords[0]||null}
 function inlineCard(record,i,isOpen){
  const y=host.getYear(),p=phase(record,y),n=note(record);
  const desc=n.length>105?clip(n,105):n;
  return '<article class="atlas-18c-overlap-card'+(isOpen?' is-selected':'')+
   '" data-overlap-id="'+esc(record.id)+'" data-overlap-index="'+i+'">'+
   '<button class="atlas-18c-overlap-trigger" type="button" data-open-overlap="'+i+
   '" aria-expanded="'+String(isOpen)+'">'+
   '<span class="atlas-18c-overlap-topline"><span class="atlas-18c-overlap-order">'+String(i+1).padStart(2,'0')+
   '</span><span class="atlas-18c-overlap-kind">'+esc(reader.label(named[record.kind]||record.category||'历史地理记录'))+
   '</span><span class="atlas-18c-overlap-years">'+p.start_year+'—'+p.end_year+'</span></span>'+
   '<strong class="atlas-18c-overlap-title">'+esc(record.title)+'</strong>'+
   (desc&&!isOpen?'<span class="atlas-18c-overlap-summary">'+esc(desc)+'</span>':'')+'</button>'+
   (isOpen?'<div class="atlas-18c-overlap-detail">'+
    '<div class="atlas-18c-overlap-facts"><div><span>历史时期</span><b>'+p.start_year+'—'+p.end_year+'</b></div>'+
    '<div><span>图层性质</span><b>'+esc(reader.label(named[record.kind]||record.category||'历史记录'))+'</b></div></div>'+
    (n?'<p>'+esc(n)+'</p>':'')+
    '<details class="atlas-18c-overlap-sources"><summary>历史文献与来源</summary>'+
    '<div class="atlas-18c-overlap-source-links">'+sources(record).map(u=>
     '<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">原始来源 · '+esc(urlName(u))+' ↗</a>'
    ).join('')+'</div></details></div>':'')+'</article>';
 }
 function bindCardInteractions(){
  const container=$('atlas18cOverlapPanel');
  if(!container)return;
  for(const card of container.querySelectorAll('[data-overlap-index]')){
   const ix=Number(card.dataset.overlapIndex),record=activeRecords[ix];
   card.addEventListener('pointerenter',()=>glow(record));
   card.addEventListener('pointerleave',()=>glow(selectedRecord()));
   card.addEventListener('focusin',()=>glow(record));
   card.addEventListener('focusout',e=>{
    if(!card.contains(e.relatedTarget))glow(selectedRecord());
   });
  }
  for(const button of container.querySelectorAll('[data-open-overlap]')){
   button.addEventListener('click',()=>{
    const ix=Number(button.dataset.openOverlap),record=activeRecords[ix];
    if(!record)return;
    selected=record.id;
    paint();glow(record);
   });
  }
 }
 function paint(){
  if(!activeRecords.length)return;
  const el=$('dossierBody'),y=host.getYear(),count=activeRecords.length;
  el.innerHTML='<section id="atlas18cOverlapPanel" class="atlas-18c-overlap-panel">'+
   '<div class="dossier-kicker">历史地理区域 · '+y+'年</div>'+
   '<h2>'+(count>1?'此处涉及 '+count+' 条历史记录':'历史区域档案')+'</h2>'+   '<p class="atlas-18c-overlap-lead">悬停高亮区域 · 点击展开详情</p>'+
   '<div class="atlas-18c-overlap-list">'+activeRecords.map((r,i)=>inlineCard(r,i,r.id===selected)).join('')+'</div>'+
   '</section>';
  bindCardInteractions();
  host.openPanel('dossier');
 }
 function openAt(latlng,targetIsPoint,via='source-layer'){
  if(!loaded||!enabled())return false;
  const found=locate(latlng,targetIsPoint);
  if(!found.length)return false;
  renderYear=host.getYear();clickLocation=latlng;activeRecords=found;lastActivation=via;
  selected=found[0].id;paint();glow(found[0]);
  return true;
 }
 // One capture-phase click path for stroke, filled areas, transparent interiors
 // and overlapping polygons. The original Leaflet paths may disable bubbling.
 // Exclude real event icons/controls so their own detail actions still work.
 function captureMapClick(e){
  if(!loaded||!enabled()||!map.getContainer().contains(e.target))return;
  // Keep legacy synthetic map-container tests on the ordinary Leaflet fallback.
  if(!e.isTrusted&&e.target===map.getContainer())return;
  const target=e.target;
  if(target?.closest?.(
   '.leaflet-control-container,.leaflet-marker-icon,.leaflet-popup,.leaflet-tooltip,'+
   '.atlas-voyage-hit,[data-open-overlap],[data-historic-open]'))return;
  const coordinate=map.mouseEventToLatLng(e);
  const found=locate(coordinate,false);
  if(!found.length)return;
  const isPoint=Boolean(target.closest?.(
   '.atlas-18c-dynamic-core,.atlas-18c-mass-core,'+
   '.atlas-18c-b36-site,.atlas-18c-b37-site,.atlas-18c-b38-site,.atlas-18c-b39-site'));
  const onSource=Boolean(target.closest?.(classSelector));
  const via=onSource?'source-layer':
   found.length>1?'capture-transparent-overlap':'capture-transparent-single';
  if(!openAt(coordinate,isPoint,via))return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
 }
 map.getContainer().addEventListener('click',captureMapClick,true);
 // Leaflet's ordinary map click remains a fallback for keyboard/plugin events.
 map.on('click',ev=>{
  if(!loaded||!enabled())return;
  if(ev.originalEvent?.target?.closest?.(
   '.leaflet-control-container,.leaflet-marker-icon,.leaflet-popup,.leaflet-tooltip'))return;
  const matched=locate(ev.latlng,false);
  if(matched.length)openAt(ev.latlng,false,matched.length>1?'map-background-overlap':'map-background-single');
 });

 // Clear obsolete selection if an ordinary event/story replaces the right dossier.
 new MutationObserver(()=>{
  if(activeRecords.length&&!$('atlas18cOverlapPanel')){
   activeRecords=[];clickLocation=null;selected=null;clearGlow();
  }
 }).observe($('dossierBody'),{childList:true});
 function render(){
  const newYear=host.getYear();
  if(!loaded)return;
  if(!enabled()){
   clearGlow();
   if($('atlas18cOverlapPanel')){
    activeRecords=[];selected=null;clickLocation=null;
    $('dossierBody').innerHTML='<div class="dossier-kicker">历史地理区域</div>'+
     '<h2>本年未显示18世纪区域</h2><p>返回18世纪并开启“版图”，即可重新选择历史区块。</p>';
   }
   return;
  }
  if(newYear!==renderYear){
   renderYear=newYear;
   if(clickLocation&&$('atlas18cOverlapPanel')){
    const current=locate(clickLocation,false);
    if(current.length){
     activeRecords=current;
     if(!current.some(r=>r.id===selected))selected=current[0].id;
     paint();glow(selectedRecord());
    }else{
     activeRecords=[];selected=null;clearGlow();
     $('dossierBody').innerHTML='<div class="dossier-kicker">历史地理区域 · '+newYear+'年</div>'+
      '<h2>该位置当年没有匹配的区域记录</h2><p>请选择地图上的其他区域。</p>';
    }
   }else{clearGlow()}
  }
 }
 async function load(){
  try{
   const docs=await Promise.all(sourceFiles.map(async file=>{
    const res=await fetch(file,{cache:'no-store'});if(!res.ok)throw Error('missing '+file);
    return res.json();
   }));
   for(const data of docs){
    for(const zone of data.zones||[]){
     if(!zone.id||!zone.bbox||!zone.periods?.length||zone.area_sqkm!==null||
      zone.uncertain_line_dashed!==true||!sources(zone).length)throw Error('invalid 18C zone '+zone.id);
     const o={...zone,id:'18c:'+zone.id,kind:zone.kind||kindFromChinese(zone)};
     areas.push(o);byId.set(zone.id,o);
    }
    for(const site of data.sites||[]){
     if(!site.id||!site.coordinates?.length||!site.periods?.length||!sources(site).length)
      throw Error('invalid 18C site '+site.id);
     sites.push({...site,id:'18c-site:'+site.id,kind:site.kind||kindFromChinese(site)});
    }
   }
   const oldRes=await fetch('data/eighteenth-century-dynamic-spatial-1700-1799.json',{cache:'no-store'});
   if(!oldRes.ok)throw Error('missing batch34');
   const old=await oldRes.json();
   const geomRes=await fetch(old.original_geometry_file,{cache:'no-store'});
   if(!geomRes.ok)throw Error('missing original old reference geometry');
   const geo=await geomRes.json();
   const geoMap=new Map(geo.features.map(f=>[f.properties?.name,f.geometry]));
   for(const row of old.area_references||[]){
    const geometry=geoMap.get(row.geometry_key);
    if(!geometry)throw Error('missing historic geometry '+row.id);
    areas.push({...row,id:'18c-old:'+row.id,kind:kindFromChinese(row),
     geometry,bbox:geomBBox(geometry)});
   }
   for(const row of old.control_sites||[]){
    sites.push({...row,id:'18c-old-site:'+row.id,kind:kindFromChinese(row),
     coordinates:row.geometry.coordinates});
   }
   if(areas.length!==629||sites.length!==421)throw Error('unexpected original archive totals: '+areas.length+'/'+sites.length);
   loaded=true;render();
  }catch(e){error=String(e);console.error('18C overlap selector rejected missing historical source:',e)}
 }
 window.eighteenthOverlapDossier={
  render,
  hitCountAt:(lat,lng)=>loaded&&enabled()?locate(L.latLng(lat,lng),false).length:0,
  getAudit:()=>({loaded,error,year:host.getYear(),areas:areas.length,sites:sites.length,
   selectedCount:activeRecords.length,selected,focused,lastActivation,
   glowCount:glowGroup.getLayers().length,
   open:!!$('atlas18cOverlapPanel'),sourceRecords:activeRecords.map(r=>r.id)})
 };
 void load();
})();
