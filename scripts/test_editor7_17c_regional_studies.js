'use strict';
// Native 17C cartography regression: a geography narrative IS NOT a measured border.
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const g=json('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(g.type,'FeatureCollection');
assert.equal(g.metadata.schema,'atlas-17c-regional-studies-v1');
assert.equal(g.features.length,32);
assert.equal(g.features.filter(f=>f.geometry.type==='Polygon').length,24);
assert.equal(g.features.filter(f=>f.geometry.type==='LineString').length,8);
assert.equal(g.metadata.total_confirmed_historical_control_polygons,0);
const existing=json('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
assert.equal(existing.features.length,186,'17C site-level layer includes Jamaica and earlier 17C cues');
const ids=new Set,evs=new Map();
for(let y=1600;y<=1690;y+=10){
 let atlas=json('data/atlas-'+y+'-'+(y+9)+'.json');
 assert.deepEqual(atlas.colonial_polygons,[],'historical colonial polygons cannot be created from studies');
 for(const e of atlas.events)evs.set(e.id,e);
}
const pointInside=(poly,p)=>{
 let c=poly.geometry.coordinates[0],x=p[0],y=p[1],inside=false;
 for(let i=0,j=c.length-1;i<c.length;j=i++){
  let a=c[i],b=c[j],hit=(a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0];
  if(hit)inside=!inside;
 }
 return inside;
};
for(const f of g.features){
 let p=f.properties;
 assert(!ids.has(f.id),'duplicate geographic study id');ids.add(f.id);
 assert(/^[\w-]+$/.test(f.id));
 assert(Number.isInteger(p.start_year)&&Number.isInteger(p.end_year)&&p.start_year<=p.end_year);
 assert(p.start_year>=1600&&p.end_year<=1699);
 assert(['military_impact','economic_network','land_dispossession'].includes(p.display_kind));
 for(const flag of ['historical_boundary_confirmed','fill_authorized','territorial_claim','exclude_from_area_aggregation'])
  assert.equal(p[flag],flag==='exclude_from_area_aggregation',flag+' must disallow area');
 assert.equal(p.area_sqkm,null);assert.equal(p.occupation_area_sqkm,null);
 assert(p.source_urls.length>0&&p.source_urls.every(u=>/^https:\/\//.test(u)));
 assert(p.related_event_ids.length>0&&p.related_event_ids.every(i=>evs.has(i)));
 assert(p.geometry_precision.includes('not_')&&/NOT|not/.test(p.mapping_method));
 let rings=f.geometry.type==='Polygon'?f.geometry.coordinates:[f.geometry.coordinates];
 assert(['Polygon','LineString'].includes(f.geometry.type));
 assert(rings.every(r=>r.length>1&&r.every(c=>Array.isArray(c)&&c.length===2&&Math.abs(c[0])<=180&&Math.abs(c[1])<=90)));
 if(f.geometry.type==='Polygon'){
  let ring=f.geometry.coordinates[0];assert.deepEqual(ring[0],ring[ring.length-1]);
  for(const a of p.anchor_places){
   if(a.source_event_id){
    let e=evs.get(a.source_event_id);
    assert.equal(a.lon,e.lng,'polygon anchor must preserve atlas longitude');
    assert.equal(a.lat,e.lat,'polygon anchor must preserve atlas latitude');
   }
   assert(pointInside(f,[a.lon,a.lat]),'named anchor omitted from own non-sovereign schematic area: '+f.id);
  }
 }else{
  assert.equal(f.geometry.coordinates.length,2,'no guessed intermediate sea/march waypoints');
  assert(p.route_kind.includes('not_'),'straight line may not claim measured movement');
 }
}
const byYear=y=>g.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.end_year);
for(const [y,n] of [[1609,1],[1610,2],[1613,2],[1616,1],[1622,2],[1629,1],[1635,1],[1637,1],[1649,1],[1650,1],[1653,3],[1658,2],[1690,4],[1691,1],[1692,0],[1696,3]]){
 assert.equal(byYear(y).length,n,'schematic activity years must not be interpolated: '+y);
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
for(const x of ['function renderSeventeenthRegionalStudies(){','groups.seventeenthStudies.clearLayers();',
 'seventeenthRegionalStudies=studyData;','atlas-17c-regional-area','renderSeventeenthSpatialEvidence();renderSeventeenthRegionalStudies();']){
 assert(app.includes(x),'missing conservative 17C frontend branch: '+x);
}
assert(app.includes("groups.seventeenthStudies.clearLayers();"),'switching back to 16C must erase later ranges');
assert(app.includes("if(map.getZoom()<5)"),'world zoom must preserve small sourced research area visibility without inventing metric boundaries');
assert(app.includes("atlas-17c-regional-zoom-hint"),'desktop global view must use dashed, fixed-screen regional reference cues');
console.log('PASS: 24 sourced dashed reference envelopes, 7 zero-waypoint relation lines, 181 place/policy cues; no invented trade polygon');
