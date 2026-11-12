/* 爱英TV · 18C map-first dynamic spatial illustration
   NEVER an 18th-century cadastral/surveyed boundary or a km² measurement.
   Existing 17C GeoJSON polygons are reused only as visibly dashed reference geography.
*/
(function(){
 'use strict';
 if(new URLSearchParams(location.search).get('review18c')!=='1')return;
 const host=window.__eighteenthSpatialHost;
 if(!host)throw new Error('18C spatial host is missing');
 const map=host.map,$=host.element,escapeHTML=host.escapeHTML,openPanel=host.openPanel;
 let year=host.getYear();
 const areaPane='eighteenthReferenceAreaPane',sitePane='eighteenthControlSitePane';
 map.createPane(areaPane);map.getPane(areaPane).style.zIndex='433';
 map.createPane(sitePane);map.getPane(sitePane).style.zIndex='466';
 const areaRenderer=L.svg({pane:areaPane}),siteRenderer=L.svg({pane:sitePane});
 const areaLayer=L.layerGroup().addTo(map),coreLayer=L.layerGroup().addTo(map);
 let areas=[],sites=[],loaded=false,error=null;
 const active=periods=>periods.find(p=>p.start_year<=year&&year<=p.end_year);
 const short=p=>(p||'').replace(/^[一二三四五六七八九十0-9]+世纪/,'');
 const isOutlineOnly=c=>c.includes('纸面')||c.includes('影响')||c.includes('商贸')||c.includes('土地');
 const tint=c=>c.includes('纸面')?'#e5ba74':c.includes('土地')?'#d49a7b':
  c.includes('影响')||c.includes('商贸')?'#7ac5c2':
  c.includes('王室法政')?'#94aec0':'#ad8be8';
 const urls=arr=>[...new Set(arr||[])].map(url=>{
   let host=url;try{host=new URL(url).hostname}catch{}
   return '<li><a href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(host)+'</a></li>';
 }).join('');
 function dossier(p,period,isSite){
   host.clearSelection();
   const category=isSite?'已核实的城市驻军/公司港口核心（圆形为屏幕符号）':p.category;
   $('dossierBody').innerHTML='<div class="dossier-kicker">18世纪地图优先 · '+escapeHTML(String(year))+'年</div>'+
    '<h2>'+escapeHTML(p.title||'历史地理范围')+'</h2>'+
    '<p><strong>'+escapeHTML(category)+'</strong>　历史阶段：'+period.start_year+'—'+period.end_year+'</p>'+
    '<p>'+escapeHTML(p.note||'')+'</p>'+
    '<p>边缘虚线与淡色底面是既有地理数据复用的概略参考，未经18世纪原件测绘；城镇实芯圆圈的半径以屏幕像素计，不能外推占领平方公里。当地原住民族/自治居民权利、军事占领与王室或公司纸面声索均需分开。</p>'+
    '<details open><summary>可追溯来源</summary><ul class="source-list">'+urls(p.source_urls)+'</ul></details>';
   openPanel('dossier');
 }
 function render(){
   year=host.getYear();
   areaLayer.clearLayers();coreLayer.clearLayers();
   if(!loaded||year<1700||year>1799||!$('mapLayerTerritory').checked||
      !$('toggleTerritorialFootprints').checked||!$('toggleControlAreas').checked)return;
   const shapes=areas.filter(f=>active(f.properties.periods));
   // Approximate bounding rectangle only influences display ordering, NEVER a territorial area metric.
   const span=f=>{const pts=f.geometry.coordinates[0],xx=pts.map(c=>c[0]),yy=pts.map(c=>c[1]);
     return (Math.max(...xx)-Math.min(...xx))*(Math.max(...yy)-Math.min(...yy));};
   shapes.sort((a,b)=>span(b)-span(a));
   L.geoJSON({type:'FeatureCollection',features:shapes},{
     renderer:areaRenderer,pane:areaPane,interactive:true,bubblingMouseEvents:false,
     style:f=>{
       const p=f.properties,c=tint(p.category),outlineOnly=isOutlineOnly(p.category);
       return {color:c,weight:outlineOnly?2.1:1.8,opacity:.9,
         dashArray:outlineOnly?'4 8':'7 6',lineCap:'round',
         fill:!outlineOnly,fillColor:c,fillOpacity:outlineOnly?0:.095,
         className:'atlas-18c-dynamic-area',bubblingMouseEvents:false};
     },
     onEachFeature:(f,layer)=>{
       const p=f.properties,period=active(p.periods);
       layer.bindTooltip('<strong>'+escapeHTML(short(p.title))+'</strong><div class="atlas-hover-summary">'+
         escapeHTML(p.category+' · '+period.start_year+'—'+period.end_year+' · 非实测历史边界')+'</div>',
        {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]});
       layer.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);dossier(p,period,false);});
     }
   }).addTo(areaLayer);
   for(const site of sites){
     const period=active(site.periods);if(!period)continue;
     const ephemeral=site.category.includes('年内短占');
     const company=site.category.includes('公司')||site.category.includes('商贸')||site.category.includes('港口');
     const color=ephemeral?'#edb66a':company?'#92bfee':'#b989f4';
     const center=[site.geometry.coordinates[1],site.geometry.coordinates[0]];
     L.circleMarker(center,{pane:sitePane,renderer:siteRenderer,
       radius:19,color,weight:1.6,opacity:.8,dashArray:'3 6',fill:false,
       interactive:false,className:'atlas-18c-dynamic-core-ring'
     }).addTo(coreLayer);
     L.circleMarker(center,{pane:sitePane,renderer:siteRenderer,
       radius:9,color,weight:2,opacity:1,fillColor:color,fillOpacity:ephemeral?.21:.9,
       dashArray:ephemeral?'3 4':null,
       bubblingMouseEvents:false,className:'atlas-18c-dynamic-core'
     }).bindTooltip('<strong>'+escapeHTML(site.title)+'</strong><div class="atlas-hover-summary">'+
       escapeHTML(site.category+' · '+period.start_year+'—'+period.end_year)+'</div>',
       {sticky:true,direction:'auto',pane:'eventTooltipPane',className:'atlas-hover',offset:[12,0]})
      .on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);dossier(site,period,true);})
      .addTo(coreLayer);
   }
 }
 function checkPeriods(periods){
   return Array.isArray(periods)&&periods.length>0&&periods.every(p=>
    Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&
    p.start_year>=1700&&p.end_year<=1799&&p.end_year>=p.start_year);
 }
 function checkPolygon(f){
   const ring=f.geometry?.coordinates?.[0];
   return f.geometry?.type==='Polygon'&&Array.isArray(ring)&&ring.length>=4&&
    ring.every(c=>Array.isArray(c)&&c.length===2&&Number.isFinite(c[0])&&Number.isFinite(c[1])&&
     Math.abs(c[0])<=180&&Math.abs(c[1])<=90);
 }
 async function load(){
   try{
     const [mr,gr]=await Promise.all([
       fetch('data/eighteenth-century-dynamic-spatial-1700-1799.json',{cache:'no-store'}),
       fetch('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson',{cache:'no-store'})]);
     if(!mr.ok||!gr.ok)throw Error('18C map reference URLs unavailable');
     const meta=await mr.json(),geo=await gr.json();
     if(meta.schema!=='atlas-18c-dynamic-spatial-envelopes-v1'||meta.area_references?.length!==24||
        meta.control_sites?.length!==15||meta.approved_actual_control_polygons!==0||
        meta.area_sqkm_totals!==null||meta.area_aggregation_forbidden!==true||
        geo.type!=='FeatureCollection'||geo.features.length!==53)
       throw Error('18C area audit rejected incorrect source geometry or counts');
     const byName=new Map(geo.features.map(f=>[f.properties?.name,f]));
     const local=meta.area_references.map(r=>{
       const old=byName.get(r.geometry_key);
       if(!checkPolygon(old)||!checkPeriods(r.periods)||r.precise_historic_border!==false||
          r.fill_authorized!==false||r.territorial_control_verified!==false||r.area_sqkm!==null||
          r.uncertain_line_dashed!==true||!r.source_urls?.length)
         throw Error('18C unproven polygon: '+r.id);
       return {type:'Feature',geometry:old.geometry,
         properties:{...r,historical_boundary_confirmed:false,territorial_claim:false}};
     });
     if(new Set(local.map(x=>x.properties.id)).size!==24)throw Error('18C duplicated outline');
     for(const s of meta.control_sites){
       const c=s.geometry?.coordinates;
       if(s.geometry?.type!=='Point'||!Array.isArray(c)||c.length!==2||!Number.isFinite(c[0])||
          !Number.isFinite(c[1])||Math.abs(c[0])>180||Math.abs(c[1])>90||
          !checkPeriods(s.periods)||s.historical_city_wall_survey!==false||
          s.area_sqkm!==null||s.screen_radius_not_ground_area!==true||!s.source_urls?.length)
         throw Error('18C invalid city symbol: '+s.id);
     }
     if(new Set(meta.control_sites.map(s=>s.id)).size!==15)throw Error('18C repeated site ID');
     areas=local;sites=meta.control_sites;loaded=true;render();
   }catch(e){error=String(e);console.warn('18C geographic references withheld: ',e);}
 }
 window.eighteenthSpatial={render,getAudit:()=>({
   loaded,areaReferences:areas.length,documentedCityCores:sites.length,
   activeYear:year,activeAreas:areas.filter(x=>active(x.properties.periods)).map(x=>x.properties.id),
   activeSites:sites.filter(x=>active(x.periods)).map(x=>x.id),
   visibleAreaLayerObjects:areaLayer.getLayers().length,visibleSiteLayerObjects:coreLayer.getLayers().length,error
 })};
 void load();
})();
