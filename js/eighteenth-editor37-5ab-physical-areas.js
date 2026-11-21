/* 5AB source-based coastline/island and surveyed historic fort overlays */
(function(){
 'use strict';
 const host=window.__eighteenthSpatialHost;if(!host)return;
 const map=host.map,$=host.element,esc=host.escapeHTML,reader=window.AtlasReaderCopy;
 const areaPane='eighteenth5abGeography',pointPane='eighteenth5abSites';
 map.createPane(areaPane);map.getPane(areaPane).style.zIndex='451';
 map.createPane(pointPane);map.getPane(pointPane).style.zIndex='484';
 const group=L.layerGroup().addTo(map),areaRenderer=L.svg({pane:areaPane}),siteRenderer=L.svg({pane:pointPane});
 let records=[],layers=new Map(),loaded=false,error=null,year=host.getYear();
 const active=(f,y)=>f.properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);
 const palette={physical_shore:'#68b8cd',physical_river:'#67a9d4',
  gold_coast_historic_fort_trade_locality:'#e0bc81',fort_main_enclosure:'#d4bd84',
  northern_circars_revenue_locality:'#e9bf74',island_trade_wartime:'#c49ce0',
  island_war_context:'#bb9bd7',named_harbour:'#bfa5d9','1763_treaty_return':'#8db0db'};
 function open(f){
  host.clearSelection();const p=f.properties;
  const links=[...new Set(p.source_urls)].map(u=>{let domain=u;
   try{domain=new URL(u).hostname}catch{}
   return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(domain)+'</a></li>';}).join('');
  $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪历史地理 · '+year+'年</div>'+
   '<h2>'+esc(p.title)+'</h2><p>'+esc(reader.clean(p.historical_context))+'</p>'+
   '<details open><summary>历史来源</summary><ul class="source-list">'+links+'</ul></details>';
  host.openPanel('dossier');
 }
 const passThroughLegacy=new Set([
  // Keep the existing 18C source dossiers for these source-rich overlapping sites:
  'EDITOR37_5AB_APAM','EDITOR37_5AB_CHRISTIANSBORG',
  'EDITOR37_5AB_KORMANTIN','EDITOR37_5AB_BEYIN',
  'EDITOR37_5AB_BEYIN_FORT_AFTER_1773'
 ]);
 function make(f){
  const clickable=!passThroughLegacy.has(f.id);
  const geom=f.geometry.type,point=geom==='Point',line=geom==='MultiLineString';
  const c=palette[f.properties.kind]||'#c7aedb',pane=point?pointPane:areaPane,renderer=point?siteRenderer:areaRenderer;
  const layer=L.geoJSON(f.geometry,{pane,renderer,color:c,weight:line?2.1:1.7,opacity:.85,
   fill:!line&&!point,fillColor:c,fillOpacity:line?0:.048,
   dashArray:line?'5 6':'4 6',lineCap:'round',interactive:clickable,bubblingMouseEvents:false,
   pointToLayer:(_f,loc)=>L.circleMarker(loc,{pane,renderer,radius:5.2,color:c,weight:1.5,
    dashArray:'2 3',fillColor:c,fillOpacity:.78,interactive:clickable,bubblingMouseEvents:false})});
  layer.eachLayer(el=>el.on('add',()=>el.getElement()?.setAttribute('data-editor37-5ab-id',f.id)));
  if(clickable){
   layer.bindTooltip('<strong>'+esc(f.properties.title)+'</strong>',{pane:'eventTooltipPane',
    className:'atlas-hover',sticky:true,direction:'auto',offset:[12,0]});
   layer.on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);open(f)});
  }
  return layer;
 }
 function render(){
  year=host.getYear();group.clearLayers();
  if(!loaded||year<1700||year>1800||
   !$('mapLayerTerritory').checked||!$('toggleTerritorialFootprints').checked||
   !$('toggleControlAreas').checked)return;
  for(const f of records)if(active(f,year))layers.get(f.id).addTo(group);
 }
 function validate(g){
  if(g.type!=='FeatureCollection'||g.metadata?.schema!=='atlas-editor37-5ab-physical-coasts-historic-forts-v1'||
   g.metadata?.area_aggregation_forbidden!==true||g.features?.length!==26||
   g.features.filter(f=>f.geometry.type==='Point').length!==15||
   g.features.filter(f=>f.geometry.type==='MultiLineString').length!==4||
   g.features.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).length!==7)
   throw Error('5AB invalid summary');
  const ids=new Set();
  const coordValid=p=>Array.isArray(p)&&p.length>=2&&p.slice(0,2).every(Number.isFinite)&&
   p[0]>=-180&&p[0]<=180&&p[1]>=-90&&p[1]<=90;
  function shapeValid(f){
   const g=f.geometry;
   if(g.type==='Point')return coordValid(g.coordinates);
   const lines=g.type==='MultiLineString'?g.coordinates:
    g.type==='Polygon'?g.coordinates:g.type==='MultiPolygon'?g.coordinates.flat():[];
   if(!Array.isArray(lines)||!lines.length)return false;
   return lines.every(line=>Array.isArray(line)&&line.length>1&&line.every(coordValid));
  }
  for(const f of g.features){
   const p=f.properties;
   if(!f.id||ids.has(f.id)||p.stable_id!==f.id||!p.historical_context||
    p.area_sqkm!==null||p.territorial_control_verified!==false||
    p.historical_boundary_confirmed!==false||p.uncertain_line_dashed!==true||
    p.exclude_from_area_aggregation!==true||!p.source_urls?.length||
    p.source_urls.some(x=>!x.startsWith('https://'))||!shapeValid(f))throw Error('invalid 5AB feature: '+f.id);
   ids.add(f.id);
  }
 }
 async function load(){
  try{const r=await fetch('data/eighteenth-century-editor37-5ab-physical-areas.geojson',{cache:'no-store'});
   if(!r.ok)throw Error('5AB HTTP '+r.status);
   const d=await r.json();validate(d);records=d.features;
   layers=new Map(records.map(f=>[f.id,make(f)]));loaded=true;render();
  }catch(e){error=String(e);console.warn('5AB geography withheld:',e)}
 }
 window.eighteenthEditor37FiveAB={render,getAudit:()=>({loaded,error,year,
  featureCount:records.length,activeIds:records.filter(f=>active(f,year)).map(f=>f.id),
  visibleLayers:group.getLayers().length,
  physicalPolygons:records.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).length,
  physicalLines:records.filter(f=>f.geometry.type==='MultiLineString').length,
  historicSites:records.filter(f=>f.geometry.type==='Point').length})};
 void load();
})();
