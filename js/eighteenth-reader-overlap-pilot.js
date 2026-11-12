/* 爱英TV: reader-first pilot for 18C source-backed schematic map.
 * Query: ?review18c=1&reader18c=1
 * All PR329-334 source data and old renderers are preserved; this layer
 * visually consolidates overlapping research polygons without discarding records.
 */
(function(){
 'use strict';
 const q=new URLSearchParams(location.search);
 if(q.get('review18c')!=='1'||q.get('reader18c')!=='1')return;
 const host=window.__eighteenthSpatialHost;
 if(!host)return;
 const map=host.map,$=host.element,esc=host.escapeHTML;
 const doc=document;
 const src=[
  'data/eighteenth-century-mass-schematic-zones-1700-1799.json',
  'data/eighteenth-century-expansion-batch36-1700-1799.json',
  ...['africa','india-ocean','caribbean'].map(x=>'data/eighteenth-century-b37-'+x+'.json'),
  ...['south-campaign','hudson-company','india-mysore'].map(x=>'data/eighteenth-century-b38-'+x+'.json'),
  ...['caribbean-1759-1763','gold-coast-forts','gulf-surat-factories'].map(x=>'data/eighteenth-century-b39-'+x+'.json')
 ];
 const thematic={
  control:{label:'驻军与殖民行政',help:'仅将有驻军／行政记载的地点作为淡色参考；未核边界仍为虚线',
   kinds:['military','administration','wartime_occupation','military_vicinity']},
  conflict:{label:'反抗、战争与控制中断',help:'当地抵抗、被迫迁移、围城及非英军控制均为空心轮廓',
   kinds:['resistance','displacement','coercion','battle','foreign_occupation']},
  finance:{label:'税收与贸易',help:'财政权与商贸通道只是影响关系，空心显示，不计英国占领',
   kinds:['revenue','trade_influence']},
  claim:{label:'条约及纸面声索',help:'法律主张、协约谈判和实际驻军分别理解',
   kinds:['paper_claim','diplomacy']},
  all:{label:'全部类型（研究）',help:'仅作目录研究，重叠聚合后可查看同地全部记录',
   kinds:null}
 };
 const kindLabel={
  military:'军事驻守／港口短占',administration:'殖民行政参考',
  wartime_occupation:'战争短期占领',military_vicinity:'军事影响背景',
  resistance:'当地抵抗与自治',displacement:'强迫迁移与奴役伤害',
  coercion:'掠夺、暴力与财产没收',battle:'战斗／围城／撤退',
  foreign_occupation:'外国占领／英国失去控制',
  revenue:'公司税收或财政权',trade_influence:'贸易和间接影响',
  diplomacy:'外交条约／本地政治',paper_claim:'法律与纸面声索'
 };
 const kindGroup={
  military:'control',administration:'control',wartime_occupation:'control',military_vicinity:'control',
  resistance:'conflict',displacement:'conflict',coercion:'conflict',battle:'conflict',foreign_occupation:'conflict',
  revenue:'finance',trade_influence:'finance',diplomacy:'claim',paper_claim:'claim'
 };
 const palette={control:'#ac94eb',conflict:'#72cdbb',finance:'#e1bd78',claim:'#8db4d3'};
 const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
 const phase=(x,y)=>x.periods.find(p=>p.start_year<=y&&y<=p.end_year);
 const magnitude=b=>(b[2]-b[0])*(b[3]-b[1]);
 const midpoint=x=>x.bbox?[(x.bbox[1]+x.bbox[3])/2,(x.bbox[0]+x.bbox[2])/2]:
  x.coordinates?[x.coordinates[1],x.coordinates[0]]:[0,0];
 const inside=(x,coord)=>x.bbox&&coord.lng>=x.bbox[0]&&coord.lng<=x.bbox[2]&&
  coord.lat>=x.bbox[1]&&coord.lat<=x.bbox[3];
 const matches=(x,y)=>active(x,y)&&(!thematic[current].kinds||thematic[current].kinds.includes(x.kind));
 const prefix=x=>String(x.title||'').replace(/^\d{4}[-—年]?.{0,1}/,'');
 const trim=(s,n)=>s.length<=n?s:s.slice(0,n-1)+'…';
 const areas=[],cores=[],all=[],byKey=new Map();
 let ready=false,error=null,year=host.getYear(),current='control',mode='reader',query='',selected=[],lastCoord=null,selectedIndex=null;
 let groupsRendered=0,collapsed=0;
 const pane='reader18cZonePane',pointPane='reader18cPointPane';
 map.createPane(pane);map.getPane(pane).style.zIndex='445';
 map.createPane(pointPane);map.getPane(pointPane).style.zIndex='496';
 const zones=L.layerGroup().addTo(map),markers=L.layerGroup().addTo(map),focus=L.layerGroup().addTo(map);
 const renderer=L.svg({pane});
 const cssQuery='.atlas-18c-dynamic-area,.atlas-18c-dynamic-core,.atlas-18c-dynamic-core-ring,'+
  '.atlas-18c-mass-zone,.atlas-18c-mass-core,'+
  '.atlas-18c-b36-zone,.atlas-18c-b36-site,.atlas-18c-b37-zone,.atlas-18c-b37-site,'+
  '.atlas-18c-b38-zone,.atlas-18c-b38-site,.atlas-18c-b39-zone,.atlas-18c-b39-site';
 doc.body.classList.add('atlas-18c-reader-enabled');
 const stage=doc.querySelector('.map-stage');
 const panel=doc.createElement('section');
 panel.id='atlas18cReaderPanel';panel.className='atlas-18c-reader-panel';
 panel.setAttribute('aria-label','18世纪地图读者模式');
 panel.innerHTML='<div class="atlas-18c-reader-heading"><strong>读者视图 · 18世纪</strong>'+
  '<button type="button" id="atlas18cOriginal" aria-pressed="false">查看原始重叠图层</button></div>'+
  '<p class="atlas-18c-reader-sub">一次看一种关系；点击色块可查看同地点的全部史料</p>'+
  '<label class="atlas-18c-reader-select">地图主题 <select id="atlas18cTheme">'+
  Object.keys(thematic).map(k=>'<option value="'+k+'">'+thematic[k].label+'</option>').join('')+
  '</select></label>'+
  '<label class="atlas-18c-reader-select">查找地点 <input id="atlas18cQuery" type="search" placeholder="例如：牙买加、孟加拉、堡垒"></label>'+
  '<div class="atlas-18c-reader-aux"><button type="button" id="atlas18cFind">查看检索结果</button>'+
  '<span id="atlas18cReaderCount" role="status" aria-live="polite">正在整理本年记录…</span></div>'+
  '<p class="atlas-18c-reader-hint" id="atlas18cReaderHint"></p>';
 stage.appendChild(panel);
 const theme=$('atlas18cTheme'),search=$('atlas18cQuery'),count=$('atlas18cReaderCount');
 function enabled(){return mode==='reader'&&host.getYear()>=1700&&host.getYear()<=1799&&
  $('mapLayerTerritory').checked&&$('toggleControlAreas').checked&&$('toggleTerritorialFootprints').checked}
 function legacyVisibility(){
  doc.body.classList.toggle('atlas-18c-reader-enabled',mode==='reader');
  $('atlas18cOriginal').textContent=mode==='reader'?'查看原始重叠图层':'返回简洁读者视图';
  $('atlas18cOriginal').setAttribute('aria-pressed',String(mode==='raw'));
 }
 const hrefs=x=>[...new Set(x.source_urls||[])].filter(u=>/^https:\/\//.test(u));
 const domain=u=>{try{return new URL(u).hostname}catch{return u}};
 const note=x=>String(x.note||'本记录仅保留史料类别及地理位置，待补专题摘要。');
 function showDetail(index){
  const x=all[index];if(!x||!active(x,year))return;
  selectedIndex=index;focus.clearLayers();
  if(x.bbox){
   const [w,s,e,n]=x.bbox;
   L.rectangle([[s,w],[n,e]],{pane,renderer,color:'#fff5c5',weight:3,fillOpacity:.03,
    dashArray:'7 5',interactive:false}).addTo(focus);
  }else if(x.coordinates){
   L.circleMarker(midpoint(x),{pane:pointPane,radius:13,color:'#fff5c5',weight:2.5,
    fillOpacity:.03,interactive:false}).addTo(focus);
  }
  const p=phase(x,year),links=hrefs(x);
  $('dossierBody').innerHTML='<div class="dossier-kicker">读者视图 · '+year+'年 · 历史依据</div>'+
   '<button type="button" class="atlas-18c-reader-back" data-reader-back="1">← 返回此地 '+selected.length+' 条记录</button>'+
   '<h2>'+esc(x.title)+'</h2>'+
   '<p class="atlas-18c-reader-status"><strong>'+esc(kindLabel[x.kind]||x.kind)+'</strong>　'+p.start_year+'—'+p.end_year+'</p>'+
   '<h3>这里发生了什么</h3><p>'+esc(note(x))+'</p>'+
   '<h3>如何理解地图上的色块</h3>'+
   '<p>这片虚线或地标是现代概略定位。'+
    (['military','administration','wartime_occupation'].includes(x.kind)?
     '此记录涉及英方军政活动；参考框不能作为已核实的边界。':
     '本条记录属于贸易、当地自主行动、交战、强制行为、外交或他国驻守，不计入英国领土。')+'</p>'+
   '<h3>可核查的历史资料</h3><ul class="source-list">'+links.map(u=>
    '<li><a href="'+esc(u)+'" rel="noopener noreferrer" target="_blank">'+esc(domain(u))+'</a></li>').join('')+'</ul>';
  host.openPanel('dossier');
 }
 function ranked(x,y){
  return ((x.bbox?0:1)*-1)+(/军|战|占|殖民/.test(x.title)?1:0);
 }
 function showCollection(coord,first){
  if(!ready)return;
  year=host.getYear();lastCoord=coord;
  const locals=all.filter(x=>active(x,year)&&(
   inside(x,coord)||(x.coordinates&&map.latLngToContainerPoint(L.latLng(midpoint(x))).distanceTo(
    map.latLngToContainerPoint(L.latLng(coord)))<17)));
  const chosen=new Map(locals.map(x=>[x._readerId,x]));
  if(first)for(const x of first){if(active(x,year))chosen.set(x._readerId,x)}
  selected=[...chosen.values()].sort((a,b)=>{
   const aa=a.bbox?magnitude(a.bbox):0,bb=b.bbox?magnitude(b.bbox):0;
   return aa-bb||ranked(b,year)-ranked(a,year)||String(a.title).localeCompare(String(b.title),'zh');
  }).map(x=>x._readerId);
  selectedIndex=null;focus.clearLayers();
  const kinds=new Set(selected.map(n=>kindLabel[all[n].kind]||all[n].kind));
  const present=selected.length,shown=selected.slice(0,24);
  const ll=coord.lat.toFixed(2)+', '+coord.lng.toFixed(2);
  $('dossierBody').innerHTML='<div class="dossier-kicker">读者视图 · '+year+'年 · 位置 '+ll+'</div>'+
   '<h2>这里有 '+present+' 条历史地理记录</h2>'+
   '<p>涉及 '+kinds.size+' 种性质。色块的重叠主要来自同一地方的军政、贸易、税务及反抗材料；分别选择阅读，避免把几层颜色相加理解为控制面积。</p>'+
   '<div class="atlas-18c-reader-results">'+shown.map((n,k)=>{
    const x=all[n],p=phase(x,year);
    return '<button type="button" class="atlas-18c-reader-result" data-reader-index="'+n+'">'+
     '<strong>'+esc(x.title)+'</strong><small>'+esc(kindLabel[x.kind]||x.kind)+' · '+p.start_year+'—'+p.end_year+'</small>'+
     '<span>'+esc(trim(note(x),112))+'</span></button>';
   }).join('')+'</div>'+
   (present>shown.length?'<button class="atlas-18c-reader-more" type="button" data-reader-more="1">再显示 '+(present-shown.length)+' 条记录</button>':'')+
   '<p class="atlas-18c-reader-caveat">以上为同一地图位置的资料索引，不声称所有记录在该点实际发生，亦不表示历史边界精确。</p>';
  host.openPanel('dossier');
 }
 function more(){
  if(selected.length<=24)return;
  const extra=selected.slice(24);
  const wrap=doc.createElement('div');wrap.className='atlas-18c-reader-results';
  wrap.innerHTML=extra.map(n=>{
   const x=all[n],p=phase(x,year);
   return '<button type="button" class="atlas-18c-reader-result" data-reader-index="'+n+'">'+
    '<strong>'+esc(x.title)+'</strong><small>'+esc(kindLabel[x.kind]||x.kind)+' · '+p.start_year+'—'+p.end_year+'</small>'+
    '<span>'+esc(trim(note(x),112))+'</span></button>';
  }).join('');
  const button=doc.querySelector('[data-reader-more]');
  if(button){button.replaceWith(wrap)}
 }
 function showSearch(){
  const term=search.value.trim().toLocaleLowerCase();
  if(!term){count.textContent='先输入要查找的地名或历史关键词';search.focus();return}
  const matches=all.filter(x=>active(x,year)&&((x.title||'')+' '+note(x)).toLocaleLowerCase().includes(term));
  selected=matches.map(x=>x._readerId).slice(0,100);
  $('dossierBody').innerHTML='<div class="dossier-kicker">读者检索 · '+year+'年</div>'+
   '<h2>“'+esc(search.value.trim())+'” · 找到 '+matches.length+' 条</h2>'+
   '<p>以下按史料记录排列，点击可查看日期、性质和来源。检索仅限当前年份。</p>'+
   '<div class="atlas-18c-reader-results">'+matches.slice(0,100).map(x=>{
    const p=phase(x,year);
    return '<button type="button" class="atlas-18c-reader-result" data-reader-index="'+x._readerId+'">'+
     '<strong>'+esc(x.title)+'</strong><small>'+esc(kindLabel[x.kind]||x.kind)+' · '+p.start_year+'—'+p.end_year+'</small>'+
     '<span>'+esc(trim(note(x),112))+'</span></button>';
   }).join('')+'</div>'+
   (matches.length>100?'<p>结果过多，仅展示前100条，请缩小关键词范围。</p>':'');
  host.openPanel('dossier');
 }
 function update(){
  const newYear=host.getYear();
  if(newYear!==year){year=newYear;selected=[];selectedIndex=null;focus.clearLayers()}
  zones.clearLayers();markers.clearLayers();
  if(!ready||!enabled())return;
  let actual=areas.filter(x=>matches(x,year));
  if(query)actual=actual.filter(x=>((x.title||'')+' '+note(x)).toLocaleLowerCase().includes(query));
  const extent=map.getBounds().pad(.25);
  actual=actual.filter(x=>extent.intersects(L.latLngBounds([[x.bbox[1],x.bbox[0]],[x.bbox[3],x.bbox[2]]])));
  // Only representative surfaces are drawn, not all overlapping six research generations.
  // Geographic pixel clustering is display-only; the 605 original records remain readable.
  actual.sort((a,b)=>magnitude(a.bbox)-magnitude(b.bbox));
  const clusters=[],threshold=map.getZoom()<4?36:map.getZoom()<6?31:23;
  for(const x of actual){
   const xy=map.latLngToContainerPoint(L.latLng(midpoint(x))),grp=kindGroup[x.kind]||'claim';
   let c=clusters.find(c=>c.group===grp&&c.center.distanceTo(xy)<threshold);
   if(c){c.items.push(x);continue}
   clusters.push({group:grp,centre:midpoint(x),center:xy,items:[x]});
  }
  let visible=0;collapsed=actual.length-clusters.length;
  // Every cluster has ONE representative light reference outline.
  for(const c of clusters){
   const x=c.items[0],box=x.bbox,[w,s,e,n]=box;
   const color=palette[c.group],p=phase(x,year),isControl=c.group==='control';
   // Very large illustrative travel/charter envelopes never fill the globe.
   const huge=box[2]-box[0]>10||box[3]-box[1]>10;
   const fill=isControl&&!huge;
   const boxLayer=L.rectangle([[s,w],[n,e]],{
    pane,renderer,color,weight:1.7,opacity:.76,dashArray:'4 7',
    fill,fillColor:color,fillOpacity:fill?.095:0,interactive:true,
    bubblingMouseEvents:false,className:'atlas-18c-reader-zone'
   });
   const tooltip='<strong>'+esc(x.title)+'</strong><div class="atlas-hover-summary">'+
    esc(kindLabel[x.kind]||x.kind)+' · '+p.start_year+'—'+p.end_year+'</div><div>'+
    esc(trim(note(x),110))+'</div><div>此处叠合 '+c.items.length+' 条同类资料；点击查看同地全部记录</div>';
   boxLayer.bindTooltip(tooltip,{sticky:true,direction:'auto',pane:'eventTooltipPane',
    className:'atlas-hover',offset:[12,0]});
   boxLayer.on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);showCollection(ev.latlng,c.items)});
   boxLayer.addTo(zones);
   // Use compact count badges; only introduce permanent location names at closer zoom.
   const title=map.getZoom()>=6?trim(prefix(x),17):'';
   const bubble='<span class="atlas-18c-reader-bubble" style="--reader-group:'+color+'">'+
    (c.items.length>1?c.items.length:'·')+'</span>'+
    (title?'<span class="atlas-18c-reader-bubble-title">'+esc(title)+'</span>':'');
   const marker=L.marker(c.centre,{
    pane:pointPane,icon:L.divIcon({className:'atlas-18c-reader-pin',html:bubble,iconSize:null,
     iconAnchor:[11,11]}),keyboard:true
   }).bindTooltip(tooltip,{direction:'top',pane:'eventTooltipPane',className:'atlas-hover'});
   marker.on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);
    showCollection(L.latLng(c.centre),c.items)});
   marker.addTo(markers);
   visible++;
  }
  groupsRendered=visible;
  count.textContent=year+'年 · 当前主题 '+actual.length+'条，合并显示 '+visible+'组';
  $('atlas18cReaderHint').textContent=thematic[current].help+
   '。重叠只合并外观，历史原件均保留；放大或点击数字可查看详情。';
 }
 function render(){update()}
 $('atlas18cTheme').addEventListener('change',()=>{current=theme.value;update()});
 $('atlas18cQuery').addEventListener('input',()=>{query=search.value.trim().toLocaleLowerCase();update()});
 $('atlas18cQuery').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();showSearch()}});
 $('atlas18cFind').addEventListener('click',showSearch);
 $('atlas18cOriginal').addEventListener('click',()=>{
  mode=mode==='reader'?'raw':'reader';legacyVisibility();update();
  count.textContent=mode==='raw'?'原始六批图层已显示；可随时返回简洁视图':count.textContent;
 });
 $('dossierBody').addEventListener('click',e=>{
  const choose=e.target.closest('[data-reader-index]');
  if(choose){showDetail(Number(choose.dataset.readerIndex));return}
  if(e.target.closest('[data-reader-back]')&&lastCoord){showCollection(lastCoord);return}
  if(e.target.closest('[data-reader-more]'))more();
 });
 map.on('zoomend moveend',()=>{if(ready)update()});
 map.on('click',e=>{if(enabled()&&ready){const found=all.some(x=>active(x,host.getYear())&&inside(x,e.latlng));if(found)showCollection(e.latlng)}});
 // Preserve source original geometry/validation in all six historical modules.
 // CSS only hides original DOM paths within this voluntary pilot view.
 async function load(){
  try{
   const inputs=await Promise.all(src.map(async u=>{
    const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('missing '+u+' '+r.status);
    return r.json();
   }));
   if(inputs.length!==11)throw Error('source list incomplete');
   for(let i=0;i<inputs.length;i++){
    const data=inputs[i];
    for(const x of data.zones){
     if(!x.id||!x.bbox||x.bbox.length!==4||!x.periods||!x.source_urls||
      x.area_sqkm!==null||x.uncertain_line_dashed!==true)throw Error('unapproved envelope '+x.id);
     const obj={...x,kind:x.kind||'paper_claim',_readerId:all.length,sourceFile:src[i]};
     all.push(obj);areas.push(obj);byKey.set(obj.id,obj);
    }
   }
   // The 421 original click cores are retained in their source arrays; the
   // reader's dense-map symbols are aggregate zone markers, not fictional ports.
   const old=await fetch('data/eighteenth-century-dynamic-spatial-1700-1799.json',{cache:'no-store'});
   if(!old.ok)throw Error('legacy core data unavailable');
   const oldest=await old.json();
   for(const x of oldest.control_sites||[]){
    const originalKind=String(x.category||'');
    const oldKind=originalKind.includes('贸易')?'trade_influence':originalKind.includes('纸面')?'paper_claim':'military';
    const obj={...x,kind:oldKind,coordinates:x.geometry.coordinates,
     _readerId:all.length,sourceFile:'oldest18c'};
    all.push(obj);cores.push(obj);
   }
   if(areas.length!==605||cores.length!==15||all.length!==620)throw Error('source tally mismatch 605/15');
   ready=true;update();
  }catch(e){error=String(e);count.textContent='读取失败：可切换回原始地图';console.error('Reader lens rejected invalid research input',e)}
 }
 legacyVisibility();
 window.eighteenthReaderPilot={
  render,getAudit:()=>({ready,error,year,mode,theme:current,areas:areas.length,legacyCores:cores.length,
   groupsRendered,collapsed,activeAreas:areas.filter(x=>active(x,year)).length,
   legacyHidden:doc.body.classList.contains('atlas-18c-reader-enabled'),
   choiceCount:selected.length})
 };
 void load();
})();
