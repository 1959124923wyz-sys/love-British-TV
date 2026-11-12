/* 爱英TV 18th century batch38: 127 dated schematic polygons +90 proxy locality symbols.
 * These editorial bbox envelopes are UNSURVEYED reference geography and imply no km2.
 * British garrison, fiscal authority, rival naval capture, local sovereignty and
 * anti-slavery/Indigenous resistance must remain semantically distinct.
 */
(function(){
 'use strict';
 if(new URLSearchParams(location.search).get('review18c')!=='1')return;
 const host=window.__eighteenthSpatialHost;if(!host)return;
 const map=host.map,$=host.element,esc=host.escapeHTML;
 const areaPane='eighteenth38DatedZones',sitePane='eighteenth38DatedSites';
 map.createPane(areaPane);map.getPane(areaPane).style.zIndex='445';
 map.createPane(sitePane);map.getPane(sitePane).style.zIndex='480';
 const areaLayer=L.layerGroup().addTo(map),siteLayer=L.layerGroup().addTo(map);
 const areaRenderer=L.svg({pane:areaPane}),siteRenderer=L.svg({pane:sitePane});
 const regions=['south-campaign','hudson-company','india-mysore'];
 const counts={'south-campaign':[48,41], 'hudson-company':[32,16],'india-mysore':[47,33]};
 const colors={administration:'#a58df5',military:'#c29dfe',displacement:'#dca18a',
  resistance:'#5cccc0',paper_claim:'#ebc479',diplomacy:'#6cb4e7',
  trade_influence:'#7bd2c6',battle:'#ed9a78',revenue:'#e4bd76',
  coercion:'#e399ab',foreign_occupation:'#879eac'};
 const label={administration:'殖民行政',military:'英方军事堡垒／局部占领',
  displacement:'强制迁移／人口剥夺',resistance:'当地政治自治／抵抗',
  paper_claim:'纸面或外交声索',diplomacy:'外交会商与条约',
  trade_influence:'贸易航路和商业联系',battle:'局部战役和围城',
  revenue:'东印度公司财税权',coercion:'掠夺、财产没收及强制行为',
  foreign_occupation:'非英军控制／英国失去据点'};
 const outline=new Set(['displacement','resistance','paper_claim','diplomacy',
  'trade_influence','battle','coercion','foreign_occupation']);
 const active=(obj,yr)=>obj.periods.some(p=>p.start_year<=yr&&yr<=p.end_year);
 const phase=(obj,yr)=>obj.periods.find(p=>p.start_year<=yr&&yr<=p.end_year);
 let year=host.getYear(),loaded=false,error=null,areas=[],points=[],loadedRegions=[];
 const reader=window.AtlasReaderCopy;
 const sourceHTML=x=>([...new Set(x.source_urls||[])]).map(url=>{
  let domain=url;try{domain=new URL(url).hostname}catch{}
  return '<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(domain)+'</a></li>';
 }).join();
 function dossier(x,isSite){
  host.clearSelection();const p=phase(x,year);
  $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪地图 · 第38批 · '+year+'年</div>'+
   '<h2>'+esc(x.title)+'</h2>'+
   '<p><strong>'+esc(label[x.kind])+'</strong>　'+p.start_year+'—'+p.end_year+'</p>'+
   (reader.clean(x.note)?'<p>'+esc(reader.clean(x.note))+'</p>':'')+
   '<details open><summary>可追溯历史来源</summary><ul class="source-list">'+sourceHTML(x)+'</ul></details>';
  host.openPanel('dossier');
 }
 function render(){
  year=host.getYear();
  areaLayer.clearLayers();siteLayer.clearLayers();
  if(!loaded||year<1700||year>1799||!$('mapLayerTerritory').checked||
     !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
  const sorted=areas.filter(x=>active(x,year)).sort((a,b)=>{
   const size=x=>(x.bbox[2]-x.bbox[0])*(x.bbox[3]-x.bbox[1]);
   return size(b)-size(a);
  });
  for(const z of sorted){
   const [w,s,e,n]=z.bbox,c=colors[z.kind],p=phase(z,year),hollow=outline.has(z.kind);
   const fill=hollow?0:z.kind==='revenue'?.052:z.kind==='military'?.085:.060;
   L.rectangle([[s,w],[n,e]],{
    pane:areaPane,renderer:areaRenderer,color:c,weight:hollow?1.4:1.8,
    opacity:.86,dashArray:hollow?'3 8':'5 6',lineCap:'round',fill:!hollow,
    fillColor:c,fillOpacity:fill,interactive:true,bubblingMouseEvents:false,
    className:'atlas-18c-b38-zone'
   }).bindTooltip('<strong>'+esc(z.title)+'</strong><div class="atlas-hover-summary">'+
    esc(label[z.kind]+' · '+p.start_year+'—'+p.end_year)+'</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
    .on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);dossier(z,false)})
    .addTo(areaLayer);
  }
  for(const x of points){
   if(!active(x,year))continue;
   const p=phase(x,year),c=colors[x.kind],hollow=outline.has(x.kind);
   L.circleMarker([x.coordinates[1],x.coordinates[0]],{
    pane:sitePane,renderer:siteRenderer,radius:5.7,color:c,weight:1.5,opacity:.98,
    dashArray:hollow?'2 3':null,fill:!hollow,fillColor:c,fillOpacity:hollow?0:.86,
    interactive:true,bubblingMouseEvents:false,className:'atlas-18c-b38-site'
   }).bindTooltip('<strong>'+esc(x.title)+'</strong><div class="atlas-hover-summary">'+
    esc(label[x.kind]+' · '+p.start_year+'—'+p.end_year)+'</div>',
    {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
    .on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);dossier(x,true)})
    .addTo(siteLayer);
  }
 }
 function validPeriods(ps){
  return Array.isArray(ps)&&ps.length>0&&ps.every(p=>Number.isInteger(p.start_year)&&
   Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year);
 }
 function verify(data,region){
  if(data.schema!=='atlas-18c-batch38-v1'||data.region!==region||
   data.review_only!==true||data.area_sqkm_totals!==null||
   data.area_aggregation_forbidden!==true||
   data.zones?.length!==counts[region][0]||data.sites?.length!==counts[region][1])
   throw Error('incorrect batch38 region count: '+region);
  const ids=new Set();
  for(const [collection,isSite] of [[data.zones,false],[data.sites,true]]){
   for(const obj of collection){
    if(!obj.id||ids.has(obj.id)||!colors[obj.kind]||!validPeriods(obj.periods)||
     obj.area_sqkm!==null||!obj.note||data.source_register[obj.source_key]!==obj.source_urls?.[0]||
     !obj.source_urls[0].startsWith('https://'))throw Error('invalid source/year: '+obj.id);
    ids.add(obj.id);
    if(isSite){
     const z=data.zones.find(z=>z.id===obj.linked_zone_id);
     if(!z||!z.marker||z.kind!==obj.kind||JSON.stringify(z.periods)!==JSON.stringify(obj.periods)||
      obj.coordinates?.length!==2||!obj.coordinates.every(Number.isFinite)||
      obj.coordinates[0]<-180||obj.coordinates[0]>180||
      obj.coordinates[1]<-90||obj.coordinates[1]>90||
      Math.abs(obj.coordinates[0]-(z.bbox[0]+z.bbox[2])/2)>1e-7||
      Math.abs(obj.coordinates[1]-(z.bbox[1]+z.bbox[3])/2)>1e-7||
      obj.location_confidence!=='proxy_region_centre'||obj.historical_city_wall_survey!==false||
      obj.screen_radius_not_ground_area!==true)throw Error('inaccurate proxy core: '+obj.id);
    }else{
     const b=obj.bbox;
     if(b?.length!==4||!b.every(Number.isFinite)||!(b[0]<b[2]&&b[1]<b[3])||
      b[0]<-180||b[2]>180||b[1]<-90||b[3]>90||
      obj.geometry_precision!=='unsurveyed_editorial_reference_bbox'||
      obj.precise_historic_border!==false||obj.territorial_control_verified!==false||
      obj.uncertain_line_dashed!==true||obj.exclude_from_territorial_area_totals!==true)
      throw Error('unauthorized polygon: '+obj.id);
    }
   }
  }
 }
 async function load(){
  try{
   const files=await Promise.all(regions.map(async region=>{
    const r=await fetch('data/eighteenth-century-b38-'+region+'.json',{cache:'no-store'});
    if(!r.ok)throw Error('missing 18c batch38 '+region+': '+r.status);
    const d=await r.json();verify(d,region);return d;
   }));
   areas=files.flatMap(d=>d.zones);points=files.flatMap(d=>d.sites);
   if(areas.length!==127||points.length!==90||
    new Set([...areas,...points].map(x=>x.id)).size!==217)
    throw Error('cumulative batch38 surface integrity failure');
   loadedRegions=files.map(d=>d.region);loaded=true;render();
  }catch(err){error=String(err);console.warn('18C batch38 source-grounded polygons withheld:',err)}
 }
 window.eighteenthBatch38Spatial={
  render,getAudit:()=>({
   loaded,error,year,loadedRegions,
   zoneCount:areas.length,siteCount:points.length,
   phases:[...areas,...points].reduce((n,x)=>n+x.periods.length,0),
   activeZoneIds:areas.filter(x=>active(x,year)).map(x=>x.id),
   activeSiteIds:points.filter(x=>active(x,year)).map(x=>x.id),
   activeZoneTitles:areas.filter(x=>active(x,year)).map(x=>x.title),
   visibleAreas:areaLayer.getLayers().length,visibleSites:siteLayer.getLayers().length
  })
 };
 void load();
})();
