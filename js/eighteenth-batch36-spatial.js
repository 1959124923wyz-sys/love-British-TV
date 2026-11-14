/* Batch 36: dense dated spatial context for 1700-1799.
 * Schematic rectangles and proxy centre-points, no historical survey or area counts.
 * Indigenous autonomy, maroon resistance, court violence and rival-state occupations
 * are separate from British administrative or military footholds.
 */
(function(){
 'use strict';
 const host=window.__eighteenthSpatialHost;
 if(!host)return;
 const map=host.map,$=host.element,esc=host.escapeHTML;
 const zonePane='eighteenthBatch36ZonePane',pointPane='eighteenthBatch36PointPane';
 map.createPane(zonePane);map.getPane(zonePane).style.zIndex='441';
 map.createPane(pointPane);map.getPane(pointPane).style.zIndex='474';
 const zonesLayer=L.layerGroup().addTo(map),pointsLayer=L.layerGroup().addTo(map);
 const zoneRenderer=L.svg({pane:zonePane}),pointRenderer=L.svg({pane:pointPane});
 let meta=null,loaded=false,error=null,year=host.getYear();
 const reader=window.AtlasReaderCopy;
 const colors={
  administration:'#a58df5',military:'#cc9ffc',displacement:'#dca18a',resistance:'#60c9ba',
  paper_claim:'#ebc479',diplomacy:'#70b8e1',trade_influence:'#7ad2cc',
  battle:'#ed9a78',revenue:'#e4bd76',coercion:'#d88da2',foreign_occupation:'#a4b9c4'
 };
 const labels={
  administration:'殖民行政涉及区',military:'英军堡垒／港口局部驻守',
  displacement:'强迫迁移／剥夺影响区',resistance:'当地抵抗与政治自主区',
  paper_claim:'条约／纸面声索',diplomacy:'多方会盟与协商地点',
  trade_influence:'贸易或间接影响范围',battle:'战斗与围攻区域',
  revenue:'东印度公司财政税收权',coercion:'强制没收与财产夺取地点',
  foreign_occupation:'他国占领、英国控制中断'
 };
 const hollow=new Set(['resistance','paper_claim','diplomacy','trade_influence','battle','foreign_occupation','displacement']);
 const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
 const period=x=>x.periods.find(p=>p.start_year<=year&&year<=p.end_year);
 function show(x,isPoint){
  host.clearSelection();
  const p=period(x),urls=[...new Set(x.source_urls||[])];
  const cleanNote=reader.clean(x.note||'');
  $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪 · '+year+'年</div>'+
   '<h2>'+esc(x.title)+'</h2>'+
   '<p><strong>'+esc(labels[x.kind])+'</strong>　'+p.start_year+'—'+p.end_year+'</p>'+
   (cleanNote?'<p>'+esc(cleanNote)+'</p>':'')+
   '<details open><summary>历史来源</summary><ul class="source-list">'+urls.map(u=>{
    let domain=u;try{domain=new URL(u).hostname}catch{}
    return '<li><a href="'+esc(u)+'" rel="noopener noreferrer" target="_blank">'+esc(domain)+'</a></li>';
   }).join('')+'</ul></details>';
  host.openPanel('dossier');
 }
 function render(){
  year=host.getYear();zonesLayer.clearLayers();pointsLayer.clearLayers();
  if(!loaded||year<1700||year>1799||!$('mapLayerTerritory').checked||
   !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
  const items=meta.zones.filter(x=>active(x,year));
  const bboxArea=x=>(x.bbox[2]-x.bbox[0])*(x.bbox[3]-x.bbox[1]);
  items.sort((a,b)=>bboxArea(b)-bboxArea(a));
  for(const z of items){
   const [w,s,e,n]=z.bbox,c=colors[z.kind],isHollow=hollow.has(z.kind),p=period(z);
   const op=z.kind==='administration'?.065:z.kind==='military'?.078:z.kind==='revenue'?.058:z.kind==='coercion'?.045:0;
   L.rectangle([[s,w],[n,e]],{
    renderer:zoneRenderer,pane:zonePane,color:c,weight:isHollow?1.45:1.7,opacity:.82,
    dashArray:isHollow?'3 8':'5 6',lineCap:'round',fill:!isHollow,fillColor:c,fillOpacity:op,
    bubblingMouseEvents:false,interactive:true,className:'atlas-18c-b36-zone'
   }).bindTooltip('<strong>'+esc(z.title)+'</strong><div class="atlas-hover-summary">'+
    esc(labels[z.kind]+' · '+p.start_year+'—'+p.end_year)+'</div>',{
     sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]
   }).on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);show(z,false)})
    .addTo(zonesLayer);
  }
  const zoom=map.getZoom();
  for(const s of meta.sites){
   if(!active(s,year))continue;
   const c=colors[s.kind],p=period(s),isHollow=hollow.has(s.kind);
   L.circleMarker([s.coordinates[1],s.coordinates[0]],{
    pane:pointPane,renderer:pointRenderer,radius:zoom<5?4:6.5,weight:1.4,color:c,opacity:.95,
    dashArray:isHollow?'2 3':null,fillColor:c,fillOpacity:isHollow?.08:.85,
    bubblingMouseEvents:false,className:'atlas-18c-b36-site'
   }).bindTooltip('<strong>'+esc(s.title)+'</strong><div class="atlas-hover-summary">'+
    esc(labels[s.kind]+' · '+p.start_year+'—'+p.end_year)+'</div>',{
     sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]
   }).on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);show(s,true)})
    .addTo(pointsLayer);
  }
 }
 function check(m){
  if(m.schema!=='atlas-18c-batch36-frontiers-mysore-atlantic-v1'||
   m.editorial_status!=='research_preview_not_published'||m.zones?.length!==130||
   m.sites?.length!==83||m.area_sqkm_totals!==null||
   m.area_aggregation_forbidden!==true||m.approved_actual_control_polygons!==0)
   throw Error('batch36 schema/count/audit mismatch');
  const IDs=new Set();
  for(const [arr,isSite] of [[m.zones,false],[m.sites,true]]){
   for(const x of arr){
    if(!x.id||IDs.has(x.id)||!colors[x.kind]||!Array.isArray(x.periods)||!x.periods.length||
     !x.periods.every(p=>Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year)||
     x.area_sqkm!==null||m.source_register[x.source_key]!==x.source_urls?.[0]||
     !/^https:\/\//.test(x.source_urls[0]))throw Error('unsafe item '+x.id);
    IDs.add(x.id);
    if(isSite){
     if(x.coordinates?.length!==2||!x.coordinates.every(Number.isFinite)||
      Math.abs(x.coordinates[0])>180||Math.abs(x.coordinates[1])>90||
      x.historical_city_wall_survey!==false||x.screen_radius_not_ground_area!==true||
      x.location_confidence!=='schematic_bbox_centre_not_surveyed')throw Error('bad site '+x.id);
    }else{
     let b=x.bbox;
     if(b?.length!==4||!b.every(Number.isFinite)||!(b[0]<b[2]&&b[1]<b[3])||
      b[0]<-180||b[2]>180||b[1]<-90||b[3]>90||
      x.geometry_precision!=='unsurveyed_editorial_reference_rectangle'||
      x.precise_historic_border!==false||x.territorial_control_verified!==false||
      x.uncertain_line_dashed!==true||x.exclude_from_territorial_area_totals!==true)
       throw Error('bad bounds '+x.id);
    }
   }
  }
  for(const s of m.sites){
   const z=m.zones.find(x=>x.id===s.linked_zone_id);
   if(!z||s.kind!==z.kind||JSON.stringify(s.periods)!==JSON.stringify(z.periods)||
    Math.abs(s.coordinates[0]-(z.bbox[0]+z.bbox[2])/2)>1e-7||
    Math.abs(s.coordinates[1]-(z.bbox[1]+z.bbox[3])/2)>1e-7)
    throw Error('unlinked locality core '+s.id);
  }
 }
 async function load(){
  try{
   const r=await fetch('data/eighteenth-century-expansion-batch36-1700-1799.json',{cache:'no-store'});
   if(!r.ok)throw Error('bulk research layer not available: '+r.status);
   const d=await r.json();check(d);meta=d;loaded=true;render();
  }catch(e){error=String(e);console.warn('18C batch36 refused invalid reference:',e)}
 }
 window.eighteenthBatch36Spatial={
  render,
  getAudit:()=>({loaded,error,year,zoneCount:meta?.zones.length||0,siteCount:meta?.sites.length||0,
   phaseCount:meta?[...meta.zones,...meta.sites].reduce((n,x)=>n+x.periods.length,0):0,
   activeZoneIds:meta?meta.zones.filter(x=>active(x,year)).map(x=>x.id):[],
   activeSiteIds:meta?meta.sites.filter(x=>active(x,year)).map(x=>x.id):[],
   activeZoneTitles:meta?meta.zones.filter(x=>active(x,year)).map(x=>x.title):[],
   visibleZoneLayers:zonesLayer.getLayers().length,visibleSiteLayers:pointsLayer.getLayers().length
  })
 };
 void load();
})();
