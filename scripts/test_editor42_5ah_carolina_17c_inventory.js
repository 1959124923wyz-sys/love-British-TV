#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const J=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const map=J('data/eighteenth-century-mass-schematic-zones-1700-1799.json');
const loc=J('data/eighteenth-century-editor42-5ah-carolina-localized-sites.json');
const audit=J('docs/research/18C_5AH_CAROLINA_EXISTING_GEOMETRY_AUDIT.json');
const prior=J('docs/research/18C_5AG_OLD_RECTANGLE_INVENTORY.json');
const old17=J('docs/research/17C_5AH_EXACT_26_RECTANGLE_SOURCE_INVENTORY.json');
const rect=J('docs/research/18C_5AH_OLD_RECTANGLE_INVENTORY.json');
const previous=J('data/eighteenth-century-editor41-5ag-localized-replacements.json');
const isOn=(p,y)=>(p.periods||[]).some(q=>q.start_year<=y&&y<=q.end_year);
a.equal(loc.schema,'editor42_5ah_carolina_1700_1711_places_v1');
a.equal(loc.historical_boundary_reconstruction_count,0);
a.equal(loc.new_localized_record_count,3);
a.equal(loc.local_sites.length,3);
a.equal(loc.supersession_pointer,'CAROLINA_CHARLESTOWN_1700_1711');
a.equal(map.zones.length,81);a.equal(map.sites.length,42);
a.equal(map.regional_sites.length,482);
a.equal(map.regional_zones.length,280);
a.equal(audit.read_only,true);
a.equal(audit.year_overlapping_local_records_count.regional_zones,0);
a.equal(audit.year_overlapping_local_records_count.regional_sites,1);
a.equal(audit.year_overlapping_local_records.regional_sites[0].id,'CHARLESTON_FORT_JOHNSON');
const zones=new Map(map.zones.map(x=>[x.id,x]));
const locs=new Map(map.regional_sites.map(x=>[x.id,x]));
a.equal(locs.size,482);
const old=zones.get('CAROLINA_PROPRIETORS');
const before=prior.records[0];
a.deepEqual(old.bbox,before.bbox);
a.deepEqual(old.periods,before.periods);
a.deepEqual(old.source_urls,before.source_urls);
a.equal(old.superseded_by,loc.supersession_pointer);
a.equal(old.geometry,undefined);
a.equal(old.territorial_control_verified,false);
a.equal(old.area_sqkm,null);
for(const s of loc.local_sites){
 a.deepEqual(locs.get(s.id),s,'source coordinate or documented time modified '+s.id);
 a.equal(s.geometry.type,'Point');
 a.equal(s.area_sqkm,null);
 a.equal(s.territorial_control_verified,false);
 a.equal(s.historical_boundary_confirmed,false);
 a.equal(s.geometry_precision,'modern_named_place_reference_point_only');
 a.equal(s.uncertain_line_dashed,true);
 a.equal(s.exclude_from_territorial_area_totals,true);
 a(s.source_urls.length>=2&&s.source_urls.every(x=>x.startsWith('https://')));
 a(isOn(s,s.periods[0].start_year)&&isOn(s,1711)&&!isOn(s,1712));
}
a(isOn(locs.get('CHARLESTON_FORT_JOHNSON'),1708));
a(!isOn(locs.get('CHARLESTON_FORT_JOHNSON'),1707));
const all=map.zones.filter(x=>x.bbox&&!x.geometry&&!x.superseded_by);
a.equal(all.length,0,'18C unverified old reference envelopes must have been retired by 5AH');
a.equal(rect.count,0);
a.equal(rect.active_1799,0);
a.deepEqual(rect.retired_in_5ah,['CAROLINA_PROPRIETORS']);
a.equal(rect.total_remaining_1497_1799,26);
a.equal(previous.remaining_old_reference_count,1,'5AG historical source snapshot must not be erased');
a.equal(prior.count,1,'5AG inventory frozen at historical baseline');
a.equal(old17.legacy_inventory_count,26);
a.equal(old17.records.length,26);
a.equal(old17.claim_layer_rectangle_count,14);
a.equal(old17.regional_study_rectangle_count,12);
a.equal(new Set(old17.records.map(x=>x.id)).size,26);
const isRect=f=>{
 if(f.geometry?.type!=='Polygon')return false;
 const ring=f.geometry.coordinates[0],p=ring.slice(0,-1);
 return p.length===4&&new Set(p.map(z=>z[0].toFixed(8))).size===2&&
  new Set(p.map(z=>z[1].toFixed(8))).size===2&&
  ring[0][0]===ring.at(-1)[0]&&ring[0][1]===ring.at(-1)[1];
};
const paths=['data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson','data/seventeenth-century-regional-studies-1600-1699.geojson'];
for(const path of paths){
 const feats=J(path).features.filter(isRect),records=old17.records.filter(x=>x.file===path);
 a.equal(feats.length,records.length);
 for(const rec of records){
  const src=feats.find(x=>x.id===rec.id);
  a(src&&src.properties.source_urls.length,'deleted original rectangle '+rec.id);
  const pts=src.geometry.coordinates[0],bbox=[
   Math.min(...pts.map(q=>q[0])),Math.min(...pts.map(q=>q[1])),
   Math.max(...pts.map(q=>q[0])),Math.max(...pts.map(q=>q[1]))];
  a.deepEqual(rec.rectangle_bbox,bbox);
  a.equal(rec.verified_historical_boundary,false);
  a.equal(rec.legitimate_area_sqkm,null);
  a.equal(rec.replacement_verified,false);
  a.deepEqual(rec.source_urls,src.properties.source_urls);
 }
}
const originalCandidates=J('docs/research/18C_5AG_479_MASS_POINT_AREA_CANDIDATES.json');
const triage=J('docs/research/18C_5AH_165_POINT_AREA_SEMANTIC_TRIAGE.json');
a.equal(triage.baseline_count,165);a.equal(triage.records.length,165);
a.equal(triage.semantically_blocked_count,30);a.equal(triage.still_pending_count,135);
a.equal(triage.additional_historical_polygons_this_review,0);
a.deepEqual(triage.records.map(x=>x.point_id),originalCandidates.candidate_sites.map(x=>x.point_id));
for(let i=0;i<165;i++){
 const rec=triage.records[i],old=originalCandidates.candidate_sites[i];
 a.deepEqual(rec.source_urls,old.point_source_urls);
 a.deepEqual(rec.candidate_polygon_ids,old.shortlisted_polygon_candidates.map(p=>p.polygon_id));
 a(rec.original_point_preserved&&!rec.historical_polygon_promoted);
 if(rec.disposition.startsWith('do_not_promote'))a(rec.issue_code&&rec.reason_zh.length>=20);
}
console.log('PASS 5AH: 3 dated Carolina sites, last 18C reference frame retired, 26 exact 17C rectangles registered, 165 source candidates/30 unsafe proximity substitutions traced.');
