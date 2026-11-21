#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const J=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const map=J('data/eighteenth-century-mass-schematic-zones-1700-1799.json');
const cross=J('data/eighteenth-century-editor41-5ag-localized-replacements.json');
const original=J('docs/research/18C_5AE_BASELINE_26_RECTANGLES.json');
const promotions=J('data/eighteenth-century-editor39-5ae-point-area-promotions.json');
const points=J('docs/research/18C_5AE_POINT_AREA_CANDIDATES.json');
const expanded=J('docs/research/18C_5AG_479_MASS_POINT_AREA_CANDIDATES.json');
const zones=new Map(map.zones.map(z=>[z.id,z]));
const polygons=new Map(map.regional_zones.map(z=>[z.id,z]));
const sites=new Map(map.regional_sites.map(z=>[z.id,z]));
const on=(p,y)=>(p.periods||[]).some(t=>t.start_year<=y&&y<=t.end_year);
a.equal(cross.schema,'atlas-18c-5ag-localized-archival-source-replacements-v1');
a.equal(cross.area_aggregation_forbidden,true);
a.equal(cross.retired_legacy_rectangles.length,2);
a.deepEqual(cross.retired_legacy_rectangles.map(x=>x.id),['GREAT_LAKES_POSTS','NSW_CROWN_CLAIM']);
a.equal(cross.remaining_old_reference_count,1);
a.equal(cross.remaining_old_1799_count,0);
a.equal(cross.all_original_records_preserved,true);
a.equal(cross.not_claimed_as_full_historic_control_boundary,true);
for(const row of cross.retired_legacy_rectangles){
 const z=zones.get(row.id);
 const baseline=original.records.find(x=>x.id===row.id);
 a(z&&baseline,'historical original disappeared '+row.id);
 a.deepEqual(z.bbox,baseline.bbox);
 a.deepEqual(z.periods,baseline.periods);
 a(z.source_urls.length>0);
 a.equal(z.area_sqkm,null);
 a.equal(z.territorial_control_verified,false);
 a.equal(z.superseded_by,row.primary_cross_reference);
 a(z.bbox&&!z.geometry,'original historic research bbox must remain intact');
 a.equal(row.original_years[0],z.periods[0].start_year);
 a.equal(row.original_years[1],z.periods.at(-1).end_year);
}
const gl=cross.retired_legacy_rectangles[0], nsw=cross.retired_legacy_rectangles[1];
a.equal(gl.mapped_footprints.length,3);
for(const row of gl.mapped_footprints){
 const rec=polygons.get(row.id);
 a(rec&&rec.geometry.type==='Polygon');
 a.equal(rec.area_sqkm,null);
 a(rec.source_urls.includes(row.source),'mapped source should be archived: '+row.id);
 a(rec.uncertain_line_dashed===true);
 for(let y=1783;y<=1795;y++)a(on(rec,y),'mapped fort missing year '+y+' '+row.id);
}
a(gl.additional_historically_attested_posts_needing_individual_footprints.length>=3);
a.equal(nsw.continuous_named_site.id,'WARRANE_SYDNEY_COVE');
const anchor=sites.get(nsw.continuous_named_site.id);
a(anchor&&anchor.geometry.type==='Point'&&anchor.source_urls.length>0);
for(let y=1788;y<=1799;y++)a(on(anchor,y),'Sydney settlement marker missing year '+y);
a.equal(nsw.mapped_local_footprints.length,5);
for(const row of nsw.mapped_local_footprints){
 const rec=polygons.get(row.id);
 a(rec&&['Polygon','MultiPolygon'].includes(rec.geometry.type),'unsourced footprint '+row.id);
 a.equal(rec.area_sqkm,null);
 a(rec.source_urls.includes(row.source),'source omitted '+row.id);
 a.equal(rec.territorial_control_verified,false);
 for(let y=row.start_year;y<=row.end_year;y++)a(on(rec,y),'invalid dated footprint '+row.id+' '+y);
}
for(const id of nsw.evidence_grant_parcels_1794_only){
 const r=polygons.get(id);
 a(r&&['Polygon','MultiPolygon'].includes(r.geometry.type));
 a(on(r,1794)&&!on(r,1793)&&!on(r,1795),'grant must remain dated 1794 only: '+id);
}
a(nsw.australian_indigenous_sovereignty_not_assigned_to_britain);
a(nsw.has_years_with_site_only_no_surveyed_polygon);
a.equal(cross.still_unresolved[0].id,'CAROLINA_PROPRIETORS');
const unresolved=map.zones.filter(z=>z.bbox&&!z.geometry&&!z.superseded_by);
a.deepEqual(unresolved.map(z=>z.id),['CAROLINA_PROPRIETORS']);
a.equal(unresolved.filter(x=>on(x,1799)).length,0);
a.equal(promotions.point_markers_replaced_by_existing_polygons.length,5);
a.equal(points.confirmed_upgrades,5);
a.equal(points.pending_upgrades,4);
a.equal(points.candidate_site_count,9);
a.equal(points.confirmed_upgrade_ids.length,5);
a.equal(points.candidates.filter(x=>x.promotion_status==='promoted_existing_surveyed_polygon').length,5);
a.equal(points.candidates.filter(x=>x.promotion_status==='requires_further_historical_scope_review').length,4);
a.equal(expanded.schema,'editor41_5ag_extended_historic_point_area_candidate_audit_v1');
a.equal(expanded.reviewed_mass_point_count,479);
a.equal(expanded.source_polygon_count,280);
a.equal(expanded.shortlisted_mass_point_count,165);
a.equal(expanded.no_near_candidate_mass_point_count,314);
a.equal(expanded.supplementary_5ae_point_count,77);
a.equal(expanded.total_distinct_sites_in_two_audits,556);
a.equal(expanded.area_aggregation_forbidden,true);
a.equal(expanded.auto_promotions,0);
a.equal(expanded.candidate_sites.length,165);
a.equal(new Set(expanded.candidate_sites.map(x=>x.point_id)).size,165);
a.equal(expanded.candidate_sites.filter(x=>x.shortlisted_polygon_candidates[0].bbox_edge_km===0).length,80);
const siteIndex=new Map(map.regional_sites.map(x=>[x.id,x]));
for(const row of expanded.candidate_sites){
 const site=siteIndex.get(row.point_id);
 a(site&&site.geometry.type==='Point','unregistered regional point '+row.point_id);
 a.deepEqual(row.coordinates,site.geometry.coordinates);
 a.equal(row.upgrade_status,'unverified_spatial_neighbour_only');
 a.equal(row.must_preserve_original_point,true);
 a(row.shortlisted_polygon_candidates.length>0&&row.shortlisted_polygon_candidates.length<=5);
 for(const p of row.shortlisted_polygon_candidates){
  const shape=polygons.get(p.polygon_id);
  a(shape&&['Polygon','MultiPolygon'].includes(shape.geometry.type),'unregistered research polygon '+p.polygon_id);
  a(shape.source_urls.length>0);
  a(p.bbox_edge_km>=0&&p.bbox_edge_km<1);
  a(p.bbox_area_upper_bound_sqkm<=25.001);
  a(site.periods.some(t=>shape.periods.some(q=>t.start_year<=q.end_year&&q.start_year<=t.end_year)));
 }
}
a.equal(expanded.high_risk_examples.length,5);
console.log('PASS 5AG: two superseded broad areas, 3 dated Great Lakes fort walls, 5 local NSW surveyed footprints, 3 1794 grants; one legacy rectangle remains, none in 1799.');
