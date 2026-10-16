#!/usr/bin/env node
'use strict';
// Independent, read-only audit of the PUBLIC 1497–1599 atlas spatial objects.
// It tests geometry syntax, chronology, citations and representation semantics.
// It CANNOT establish the true historical perimeter of a raid/fort/colony.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const chapters = read('data/chapters.json').chapters.filter(x => x.status === 'published');
const atlas = chapters.map(c => ({chapter:c, data:read(c.source)}));
const sourceIDs = new Set(atlas.flatMap(x => (x.data.sources || []).map(s => s.id)));
const eventIDs = new Set();
const places = new Map();
const findings = [];
let routes = 0, events = 0, pointFeatures = 0, lineFeatures = 0, polygonFeatures = 0;
const bad = (where, why) => findings.push(where + ': ' + why);
const validLatLon = (lat, lon) => typeof lat === 'number' && typeof lon === 'number' &&
  Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
function assertPublishedRefs(obj, where) {
  for(const id of obj.source_ids || []) if(!sourceIDs.has(id)) bad(where, 'unresolved source ' + id);
  for(const id of obj.related_event_ids || []) if(!eventIDs.has(id)) bad(where, 'unresolved event ' + id);
}
function forEachGeoCoord(geometry, callback) {
  if(!geometry) return;
  function descend(a) {
    if(Array.isArray(a) && a.length >= 2 && typeof a[0] === 'number' && typeof a[1] === 'number') {
      callback(a[1], a[0]); return;
    }
    if(Array.isArray(a)) for(const b of a) descend(b);
  }
  descend(geometry.coordinates);
}
function verifyPolygon(feature, where) {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  for(const poly of polygons) for(const ring of poly) {
    if(!Array.isArray(ring) || ring.length < 4) {bad(where, 'polygon ring with fewer than four vertices');continue;}
    if(ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])
      bad(where, 'unclosed polygon ring');
  }
}
function isInside(ring, lon, lat) {
  let inside = false;
  for(let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if((a[1] > lat) !== (b[1] > lat) &&
        lon < (b[0] - a[0]) * (lat - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function distanceKm(la1,lo1,la2,lo2) {
  const rad = Math.PI / 180, dlat = (la2-la1)*rad, dlon = (lo2-lo1)*rad;
  const a = Math.sin(dlat/2)**2 + Math.cos(la1*rad)*Math.cos(la2*rad)*Math.sin(dlon/2)**2;
  return 6371 * 2 * Math.asin(Math.min(1,Math.sqrt(a)));
}
// Chapter events intentionally include one 1496 charter as historical prelude;
// route chronology remains constrained to the publication period.
for(const {chapter, data} of atlas) {
  if(data.period && data.period[0] > chapter.start) bad(chapter.id, 'atlas period starts after navigation period');
  for(const e of data.events || []) {
    events++;
    if(eventIDs.has(e.id)) bad(chapter.id, 'duplicate public event ID ' + e.id);
    eventIDs.add(e.id);
    if((e.lat == null) !== (e.lng == null)) bad(e.id, 'only one geographic coordinate provided');
    if(e.lat != null && !validLatLon(e.lat,e.lng)) bad(e.id,'invalid event latitude/longitude');
    if(e.start_year != null && e.end_year != null && e.start_year > e.end_year)
      bad(e.id,'reversed event interval');
    if(e.year > chapter.end) bad(e.id,'future event in earlier published chapter');
    if(e.year < chapter.start && !(chapter.start === 1497 && e.year === 1496))
      bad(e.id,'unexplained earlier-than-chapter event');
    for(const id of e.source_ids || []) if(!(data.sources || []).some(s => s.id === id))
      bad(e.id,'source missing from its own published chapter ' + id);
  }
  for(const p of data.places || []) if(p.id && Number.isFinite(p.lat) && Number.isFinite(p.lng))
    places.set(p.id,p);
  for(const r of data.routes || []) {
    routes++;
    const where = r.id || chapter.id + '/unnamed-route';
    if(!Array.isArray(r.coords) || r.coords.length < 2) {bad(where,'route has fewer than two points');continue;}
    for(const [lat,lon] of r.coords) if(!validLatLon(lat,lon)) bad(where,'invalid [latitude,longitude] waypoint');
    if(r.year > chapter.end || r.year < chapter.start) bad(where,'route year outside public chapter');
    if(!Array.isArray(r.related_event_ids) || !r.related_event_ids.length)
      bad(where,'voyage/action line is not linked to a published historic event');
    assertPublishedRefs(r, where);
    if(r.segments && r.segments.length) {
      for(const seg of r.segments) {
        if(!Array.isArray(seg) || seg.length < 2) bad(where,'invalid route segment');
        for(const [lat,lon] of seg) if(!validLatLon(lat,lon)) bad(where,'invalid segmented waypoint');
      }
      // A 180-degree antimeridian cut is a deliberate split, not a missing route.
      for(let i = 1; i < r.segments.length; i++) {
        const a=r.segments[i-1].at(-1), b=r.segments[i][0];
        if(Math.abs(Math.abs(a[1])-180) > 0.000001 ||
           Math.abs(Math.abs(b[1])-180) > 0.000001 ||
           Math.abs(a[0]-b[0]) > 0.001)
          bad(where, 'segment discontinuity is not a valid antimeridian split');
      }
    }
  }
}
const files = [
  'military-control-points-1540-1549.geojson',
  'war-occupied-zones-1540-1549.geojson',
  'war-contested-zones-1540-1549.geojson',
  'war-front-corridors-1540-1549.geojson',
  'seventh-control-sites-1550-1559.geojson',
  'eighth-control-sites-1560-1569.geojson',
  'eighth-enslavement-coastal-activity-1560-1569.geojson',
  'ninth-control-sites-1570-1579.geojson',
  'tenth-control-sites-1580-1589.geojson',
  'tenth-invasion-impact-areas-1580-1583.geojson',
  'tenth-land-dispossession-and-raids-1584-1589.geojson',
  'eleventh-control-cores-1590-1599.geojson',
  'eleventh-influence-areas-1590-1599.geojson',
  'nine-years-war-operational-impact-1594-1599.geojson',
  'ch11-action-links-1590-1599.geojson',
  'caribbean-maghreb-contact-raids-1551-1598.geojson'
];
// These are deliberately drawn areas and must never enter the historical area total.
const symbolicPolygons = new Set([
  'war-occupied-zones-1540-1549.geojson',
  'war-contested-zones-1540-1549.geojson',
  'eighth-enslavement-coastal-activity-1560-1569.geojson',
  'tenth-invasion-impact-areas-1580-1583.geojson',
  'tenth-land-dispossession-and-raids-1584-1589.geojson',
  'eleventh-influence-areas-1590-1599.geojson',
  'nine-years-war-operational-impact-1594-1599.geojson',
  'caribbean-maghreb-contact-raids-1551-1598.geojson'
]);
const idToFeature = new Map();
for(const file of files) {
  const collection = read('data/' + file);
  assert.equal(collection.type, 'FeatureCollection',file);
  for(const feature of collection.features || []) {
    const props = feature.properties || {}, type = feature.geometry?.type;
    const id = feature.id || props.stable_id || props.name || '?';
    const where = file + ' / ' + id;
    if(type === 'Point') pointFeatures++;
    else if(type === 'LineString') lineFeatures++;
    else if(type === 'Polygon' || type === 'MultiPolygon') polygonFeatures++;
    else bad(where,'unsupported geometry type ' + type);
    forEachGeoCoord(feature.geometry,(lat,lon)=>{if(!validLatLon(lat,lon))bad(where,'invalid GeoJSON [longitude,latitude] coordinate')});
    if(type === 'Polygon' || type === 'MultiPolygon') verifyPolygon(feature,where);
    if(props.start_year != null && props.end_year != null && props.end_year < props.start_year)
      bad(where,'reversed GIS interval');
    if(props.year_end_visible) for(const y of props.year_end_visible)
      if(y < props.start_year || y > props.end_year)bad(where,'year-end point outside stated episode ' + y);
    if(props.valid_years) for(const y of props.valid_years)
      if(y < props.start_year || y > props.end_year)bad(where,'area valid_years outside declared period ' + y);
    assertPublishedRefs(props,where);
    if(symbolicPolygons.has(file) && (type === 'Polygon' || type === 'MultiPolygon')) {
      if(props.historical_boundary_confirmed !== false || props.fill_authorized !== false ||
          props.territorial_claim === true || props.area_sqkm !== null ||
          props.exclude_from_area_aggregation !== true)
        bad(where, 'schematic polygon is not explicitly prohibited from claiming/measuring English territory');
    }
    if(file === 'tenth-invasion-impact-areas-1580-1583.geojson' && type === 'Polygon')
      for(const a of props.named_anchors || []) if(Number.isFinite(a.lat) && Number.isFinite(a.lon) &&
           !isInside(feature.geometry.coordinates[0],a.lon,a.lat))
        bad(where,'documented named anchor outside reading envelope: ' + a.name);
    if(type === 'Point' && props.stable_id && places.has(props.stable_id)) {
      const p = places.get(props.stable_id), c = feature.geometry.coordinates;
      if(distanceKm(p.lat,p.lng,c[1],c[0]) > 2)
        bad(where,'official chapter point and linked GIS location differ by more than 2 km');
    }
    if(idToFeature.has(file + '/' + id)) bad(where,'duplicate GeoJSON feature ID');
    idToFeature.set(file + '/' + id,true);
  }
}
// Historical facts independently checked against U.S. National Park Service:
// Francis Drake's 1595 attack FAILED; Cumberland occupied San Juan in Jun–Aug 1598.
// A within-year symbol must not become a false English year-end occupation.
const cores = read('data/eleventh-control-cores-1590-1599.geojson').features;
for(const id of ['san-juan-1598','recife-1595','blackwater-fort-1598','cahir-1599']) {
  const f=cores.find(z=>z.id===id);
  if(!f || f.properties.year_end_visible.length !== 0)
    bad(id,'short-lived or relinquished control must not appear as year-end English occupation');
}
const officialSanJuan = read('data/caribbean-maghreb-contact-raids-1551-1598.geojson').features;
if(!officialSanJuan.some(f=>f.properties?.zone_type==='caribbean_english_failed_assault' && f.properties.start_year===1595))
  bad('San Juan','1595 failed raid must be distinct from 1598 occupation');
if(!officialSanJuan.some(f=>f.properties?.zone_type==='caribbean_temporary_english_occupation' && f.properties.start_year===1598))
  bad('San Juan','1598 temporary occupation must remain separately classified');
const counts = {published_chapters:chapters.length,events,routes,geojson_files:files.length,
  geospatial_point_features:pointFeatures,geospatial_line_features:lineFeatures,
  geospatial_polygon_features:polygonFeatures,findings:findings.length};
console.log('Spatial red-team audit:',JSON.stringify(counts));
if(findings.length) {
  for(const f of findings) console.error('FAIL:',f);
  process.exitCode = 1;
} else console.log('PASS: structural, chronological and semantic cartographic safeguards. Historical boundaries are NOT certified.');
