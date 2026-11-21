/* Editor37 5AA: 16 historically named fiscal localities and a sourced real physical coast. */
(function(){
 'use strict';
 const host=window.__eighteenthSpatialHost;if(!host)return;
 const map=host.map,$=host.element,esc=host.escapeHTML,reader=window.AtlasReaderCopy;
 const pane='eighteenth5aaBengal';map.createPane(pane);map.getPane(pane).style.zIndex='450';
 const group=L.layerGroup().addTo(map),renderer=L.svg({pane});
 let features=[],cache=new Map(),loaded=false,error=null,year=host.getYear();
 const active=(x,y)=>x.properties.periods.some(p=>p.start_year<=y&&y<=p.end_year);
 function dossier(f){
  host.clearSelection();const p=f.properties;
  const links=[...new Set(p.source_urls)].map(u=>{let d=u;try{d=new URL(u).hostname}catch{}
   return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(d)+'</a></li>';}).join('');
  $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪 · 孟加拉与比哈尔 · '+year+'年</div>'+
   '<h2>'+esc(p.title)+'</h2><p>'+esc(reader.clean(p.historical_context))+'</p>'+
   '<details open><summary>历史来源</summary><ul class="source-list">'+links+'</ul></details>';
  host.openPanel('dossier');
 }
 function make(f){
  const line=f.geometry.type==='MultiLineString',c=line?'#77baca':f.properties.kind==='orissa_maratha_and_nominal_fiscal_claim'?'#86c9aa':'#e4bd76';
  const lay=L.geoJSON(f.geometry,{pane,renderer,color:c,weight:line?1.85:1.5,opacity:line?.85:1,dashArray:line?'5 6':'2 3',
   lineCap:'round',fill:!line,fillOpacity:line?0:.68,interactive:true,bubblingMouseEvents:false,
   pointToLayer:(_f,latlng)=>L.circleMarker(latlng,{pane,renderer,radius:5.2,color:c,weight:1.5,
    dashArray:'2 3',fillColor:c,fillOpacity:.68,interactive:true,bubblingMouseEvents:false})});
  lay.eachLayer(ch=>ch.on('add',()=>ch.getElement()?.setAttribute('data-editor37-5aa-id',f.id)));
  lay.bindTooltip('<strong>'+esc(f.properties.title)+'</strong>',{pane:'eventTooltipPane',className:'atlas-hover',
   sticky:true,direction:'auto',offset:[12,0]});
  lay.on('click',ev=>{if(ev.originalEvent)L.DomEvent.stopPropagation(ev.originalEvent);dossier(f)});
  return lay;
 }
 function render(){
  year=host.getYear();group.clearLayers();
  if(!loaded||year<1700||year>1799||!$('mapLayerTerritory').checked||
   !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
  for(const f of features)if(active(f,year))cache.get(f.id).addTo(group);
 }
 function check(data){
  if(data.type!=='FeatureCollection'||data.metadata?.schema!=='atlas-editor37-5aa-rennell-physical-and-fiscal-anchors-v1'||
    data.features?.length!==17||data.features.filter(f=>f.geometry.type==='Point').length!==16||
    data.features.filter(f=>f.geometry.type==='MultiLineString').length!==1)throw Error('5AA source counts');
  const ids=new Set();
  for(const f of data.features){const p=f.properties;
   if(!f.id||ids.has(f.id)||p.stable_id!==f.id||p.area_sqkm!==null||
    p.territorial_control_verified!==false||p.historical_boundary_confirmed!==false||
    p.uncertain_line_dashed!==true||p.exclude_from_area_aggregation!==true||
    !p.source_urls?.length||p.source_urls.some(u=>!u.startsWith('https://'))||
    !p.historical_context||!p.periods?.length)throw Error('5AA source feature '+f.id);
   ids.add(f.id);
   if(f.geometry.type==='Point'&&
    (f.geometry.coordinates.length!==2||!f.geometry.coordinates.every(Number.isFinite)))throw Error('5AA point coords');
   if(f.geometry.type==='MultiLineString'&&
    !f.geometry.coordinates.some(s=>s.length>=20&&s.every(c=>c.length===2&&c.every(Number.isFinite))))throw Error('5AA coast coords');
  }
 }
 async function load(){try{
  const r=await fetch('data/eighteenth-century-editor37-5aa-bengal.geojson',{cache:'no-store'});
  if(!r.ok)throw Error('5AA HTTP '+r.status);
  const d=await r.json();check(d);features=d.features;
  cache=new Map(features.map(f=>[f.id,make(f)]));loaded=true;render();
 }catch(e){error=String(e);console.warn('5AA Bengal sources withheld:',e);}}
 window.eighteenthEditor37FiveAA={render,getAudit:()=>({loaded,error,year,
  siteCount:features.filter(f=>f.geometry.type==='Point').length,
  lineCount:features.filter(f=>f.geometry.type==='MultiLineString').length,
  activeIds:features.filter(f=>active(f,year)).map(f=>f.id),visibleLayers:group.getLayers().length})};
 void load();
})();
