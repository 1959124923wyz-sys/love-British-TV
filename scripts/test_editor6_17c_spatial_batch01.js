'use strict';
// Editorial regression: 17C route chronology and conservative influence cues.
// Does NOT pretend that route-screen segments are measured historical tracks.
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const expected={'1600':1,'1640':2,'1650':3,'1690':2};
let routeCount=0;const stable=new Set();
for(let d=1600;d<=1690;d+=10){
 const a=load('data/atlas-'+d+'-'+(d+9)+'.json');
 assert.equal(a.colonial_polygons.length,0,'no fabricated historic land control in 17C');
 const sourceIds=new Set(a.sources.map(s=>s.id)),eventIds=new Set(a.events.map(e=>e.id));
 assert.equal(a.routes.length,expected[d]||0,'17C route batch cardinality differs');
 for(const r of a.routes){
  assert(!stable.has(r.id),'duplicate route id');stable.add(r.id);routeCount++;
  assert(Number.isInteger(r.year)&&r.year>=d&&r.year<=d+9);
  assert(r.valid_years?.every(y=>Number.isInteger(y)&&y>=d&&y<=d+9),'invalid year-scoped route');
  assert(r.coords?.length===2&&r.coords.every(c=>c?.length===2&&Math.abs(c[0])<=90&&Math.abs(c[1])<=180),'historical waypoints invented');
  assert(r.route_kind.includes('schematic')&&r.geometry_precision.includes('not_measured'));
  assert(r.note.includes('非历史实测航迹'),'route must disclaim survey geometry');
  assert(r.territorial_claim===false&&r.exclude_from_area_aggregation===true);
  assert(r.source_ids?.length&&r.source_ids.every(s=>sourceIds.has(s)),'route source missing in same decade');
  assert(r.related_event_ids?.length&&r.related_event_ids.every(id=>eventIds.has(id)),'route event link unknown');
 }
}
assert.equal(routeCount,8);
const geo=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
assert.equal(geo.type,'FeatureCollection');
assert.equal(geo.features.length,188);
assert.equal(geo.metadata.confirmed_territorial_polygons,0);
const cape=geo.features.find(f=>f.id==='rac-cape-coast-castle-1665');
const lost=geo.features.find(f=>f.id==='rac-cormantin-fort-dutch-capture-1665');
assert(cape&&lost&&cape.properties.display_kind==='local_governance'&&lost.properties.display_kind==='military_impact');
assert.equal(lost.properties.display_through_year,1665,'Dutch capture is not a permanent British-held fort');
assert.notDeepEqual(cape.geometry.coordinates,lost.geometry.coordinates,'two historically distinct Gold Coast forts must not share a point');
assert.equal(cape.properties.territorial_claim,false);
const keys=new Set();
for(const f of geo.features){
 const p=f.properties;
 assert(!keys.has(f.id),'duplicate place id');keys.add(f.id);
 assert.equal(f.geometry.type,'Point','one uncertain center only, no fabricated areal border');
 assert(f.geometry.coordinates.length===2&&Math.abs(f.geometry.coordinates[0])<=180&&Math.abs(f.geometry.coordinates[1])<=90);
 assert(p.start_year>=1600&&p.display_through_year<=1699&&p.display_through_year>=p.start_year);
 assert(['economic_network','military_impact','local_governance','land_dispossession'].includes(p.display_kind));
 assert(p.source_urls?.length&&p.source_urls.every(url=>/^https:\/\//.test(url)));
 assert(p.historical_boundary_confirmed===false&&p.fill_authorized===false&&p.territorial_claim===false);
 assert(p.area_sqkm===null&&p.exclude_from_area_aggregation===true);
 assert(/screen-pixel/.test(p.mapping_method));
 if(p.episodes){
  assert(p.episodes.length>0,'episodic legal cues cannot imply permanently active scope');
  for(const ep of p.episodes){
   assert(ep.start_year>=p.start_year&&ep.end_year<=p.display_through_year);
   assert(ep.source_urls?.length&&Array.isArray(ep.related_event_ids));
   if(ep.related_event_ids.length===0)assert(f.id==='17c-barbados-slavery-legislation-1661-1692'&&ep.start_year===1688&&ep.source_only===true,'unmapped source-only statute must not fabricate a clickable atlas event');
   assert(ep.source_urls.every(u=>/^https:\/\//.test(u)));
  }
 }
}
const js=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(js.includes('renderSeventeenthSpatialEvidence();'),'17C spatial render must be called');
assert(js.includes("renderEventList();renderPoints();renderSeventeenthSpatialEvidence();"),'17C year slider must draw historic spatial cues');
assert(!js.includes('ds.routes?.length||ds.places?.length'),'17C must allow referenced route data');
assert(js.includes("'land_dispossession'"),'Ireland land influence category must be actually rendered');
assert(js.includes("p.episodes.find"),'past legislation cannot be shown without dated episodes');
assert(js.includes("seventeenthSpatialEvidence=spatialData;"),'17C source geometry must be validated and loaded');
const s=load('data/stories/serial/index.json').topics.find(t=>t.id==='E6-T07-BARBADOS');
const manuscript=load(s.article_file);
assert(s.status==='published'&&s.publication_review==='approved');
assert(s.event_ids.length>=10&&manuscript.sections.length>=8);
assert(manuscript.sections.flatMap(x=>x.paragraphs).join('').length>=3000);
console.log('PASS editor6 17C: '+routeCount+' source linked routes; '+geo.features.length+' vetted symbolic hints incl Irish land dispossession and EIC commercial nodes; no fabricated land polygons');
