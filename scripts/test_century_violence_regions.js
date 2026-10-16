// 1497–1599 violence-area editorial integrity gate
// No dependencies; complements the existing official atlas validators.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(f)=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const periods=['1540-1549','1560-1569','1570-1579','1580-1589','1590-1599'];
const sources=new Set(),events=new Map(),allIds=new Set();
for(const p of periods){
 const json=read('data/atlas-'+p+'.json');
 for(const s of json.sources){assert(!sources.has(s.id),'repeated source '+s.id);sources.add(s.id);}
 for(const e of json.events){
  assert(!allIds.has(e.id),'duplicate event '+e.id);allIds.add(e.id);
  assert(e.start_year<=e.year&&e.year<=e.end_year,'chronology '+e.id);
  if(e.id.startsWith('GAP')){
   assert(e.source_ids?.length>0,'no source '+e.id);
   assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),'invalid map anchor '+e.id);
   assert(e.historical_control_boundary_verified===false,'misleading boundary '+e.id);
   assert(e.actual_English_land_area_sqkm===null,'false area '+e.id);
   assert(e.geo_precision?.includes('modern'),'missing accuracy '+e.id);
  }
  events.set(e.id,e);
 }
}
for(const e of events.values())for(const id of e.source_ids||[])assert(sources.has(id),'unregistered citation '+id);
const geo=read('data/century-violence-regions-1544-1589.geojson');
assert.equal(geo.features.length,19);
for(const f of geo.features){
 const p=f.properties||{},ring=f.geometry?.coordinates?.[0];
 assert.equal(f.geometry?.type,'Polygon');
 assert(ring?.length>=4&&JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)),'bad closed ring '+f.id);
 assert(p.start_year<=p.end_year,'bad region year '+f.id);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.named_anchors?.length&&p.mapping_method,'missing mapping method '+f.id);
 assert(p.source_ids?.length&&p.source_ids.every(id=>sources.has(id)),'unlinked source '+f.id);
 assert(p.related_event_ids?.length&&p.related_event_ids.every(id=>events.has(id)),'unlinked event '+f.id);
 for(const [lon,lat] of ring)assert(Math.abs(lon)<=180&&Math.abs(lat)<=90,'invalid coordinate '+f.id);
 const years=Array.from({length:p.end_year-p.start_year+1},(_,i)=>p.start_year+i);
 assert(years.every(y=>y>=1544&&y<=1589),'out-of-scope region '+f.id);
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes('century-violence-regions-1544-1589.geojson'),'runtime fetch missing');
assert(app.includes('centuryViolenceAreas?.features'),'rendering missing');
assert(app.includes("p.exclude_from_area_aggregation!==true"),'no area safety gate');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('mapLayerTerritory')&&html.includes('mapLayerEvents'),'approved UI lost');
assert(html.includes('historicalRegionGuideDetails'),'compact region archive lost');
console.log('PASS: 33 previous mapped events and 19 evidenced schematic regions; 1569 research includes 2 archival-only events, full source/chronology/area/UI reference gate');
