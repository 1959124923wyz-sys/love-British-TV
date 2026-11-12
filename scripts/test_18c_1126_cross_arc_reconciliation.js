#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),P=require('node:path');
const root=P.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(P.join(root,p),'utf8'));
const t14=J('research/18c/consolidated/series/T14.json');
const t20=J('research/18c/consolidated/series/T20.json');
const map=J('data/stories/serial/chronology-preview-t20-eic-parliament-loan-monopoly-1702-1793.json');
const ledger=J('research/continuity/18c-1126-coverage/T14_T20_1767_1793_CROSS_ARC_RECONCILIATION.json');
a.equal(t20.groups.length,4);a.equal(map.provenance.original_candidate_ids,9);a.equal(map.provenance.mapped_original_ids,9);
a.equal(map.events.length,29);a.equal(map.routes.length,0);a.equal(map.colonial_polygons.length,0);
a.equal(ledger.extra_event_count,0);a.equal(ledger.records.length,2);
for(const entry of ledger.records){
 const orig=t14.groups.flatMap(g=>g.candidate_subevents.map(c=>({...c,group:g.id}))).find(x=>x.original_id===entry.original_id);
 const ev=map.events.find(x=>x.id===entry.existing_atlas_event_id);
 a(orig&&ev,entry.original_id);a.equal(orig.group,entry.original_merge_group_id);
 a.equal(orig.year,ev.year);a.equal(ev.research_original_record_ids.length,0);a.equal(ev.research_merge_group_id,null);
 a(ev.research_audited_cross_arc_original_ids.includes(orig.original_id));
 a(ev.research_audited_cross_arc_group_ids.includes(orig.group));
 a(entry.corroborating_existing_atlas_source_ids.every(x=>ev.source_ids.includes(x)));
 a.equal(ev.area_sqkm,null);a.equal(ev.fill_authorized,false);a.equal(ev.historical_control_boundary_verified,false);
}
a.equal(map.provenance.audited_cross_arc_originals.length,2);
console.log('PASS two exact cross-arc T14-to-T20 original ID aliases (1767/1793), zero duplicate event, original 9 T20 candidates unchanged, no fabricated polygons');
