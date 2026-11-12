#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-fedon-grenada-haiti-1789-1798.json'),story=J('data/stories/serial/e18-t06-fedon-grenada-haiti-colonial-repression-1789-1798.json'),idx=J('data/stories/serial/preview-18c-index.json'),raw=J('research/18c/consolidated/series/T06.json'),geo=J('research/continuity/1789-1798-grenada-haiti/BRITISH_SLAVERY_REPRESSION_FEDON_HAITI_TRANSITIONS.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css'),cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,34);A.equal(idx.stories[18].id,story.id);A.equal(idx.stories[18].status,'research_preview');A.equal(idx.stories[18].publication_review,'not_submitted');
A.equal(story.id,'E18-T06-FEDON-GRENADA-HAITI-BRITISH-REPRESSION-1789-1798');
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
A.deepEqual(story.predecessor_story_ids,['E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797']);
A.equal(d.schema,'atlas-18c-fedon-grenada-haiti-slavery-repression-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,25);A.equal(d.sources.length,30);
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('A:')).length,8);
A.equal(d.sources.filter(x=>x.original_registry_key===null).length,22);
A(d.sources.every(x=>x.url.startsWith('https://')&&!x.original_manuscript_personally_inspected));
A.equal(story.sections.length,28);A.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),84);
A.equal(d.routes.length,0);A.equal(d.places.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
A.deepEqual(new Set(d.sources.map(x=>x.id)),new Set(story.sources.map(x=>x.id)));
A.equal(raw.story_arc_id,'T06');A.equal(raw.groups.length,2);
const original=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{g,c}])));
A.equal(original.size,9);
A.equal(geo.schema,'atlas-18c-fedon-colonial-naval-courts-and-saint-domingue-v1');
A.equal(geo.transitions.length,25);A(geo.transitions.every(x=>!x.polygon_allowed&&x.area_sqkm===null&&!x.territorial_control_verified));
const sources=new Set(d.sources.map(x=>x.id)),events=new Map,used=new Set;
let matched=0,supp=0,pins=0;
for(const e of d.events){
 A(!events.has(e.id)&&/^E18C-FED-[A-Z0-9-]+$/.test(e.id));events.set(e.id,e);
 A(e.year>=1789&&e.year<=1798&&e.year===e.start_year&&e.year===e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(k=>sources.has(k)),'unregistered source '+e.id);
 if(e.research_merge_group_id!==null){matched++;A.equal(e.research_provenance_kind,'direct_editor15_T06_original');
  for(const id of e.research_original_record_ids){
   A(!used.has(id));used.add(id);const z=original.get(id);
   A(z&&z.c.year===e.year&&z.g.id===e.research_merge_group_id,'original archive group/year mismatch '+id);
   A(cross.includes('\n'+id+','),'crosswalk missing '+id);
  }
 }else{supp++;A.deepEqual(e.research_original_record_ids,[]);}
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
}
A.equal(matched,9);A.equal(supp,16);A.equal(used.size,9);A.equal(pins,6);
A.deepEqual(used,new Set(raw.groups.flatMap(g=>g.original_candidate_ids)));
const E=tag=>events.get('E18C-FED-'+tag);
A.equal(E('1795-MAR15-LINDSAY-ATTACK').lat,12.16462);
A.equal(E('1795-GRENVILLE-ATTACK').lng,-61.62498);
A.equal(E('1793-JEREMIE-ENSLAVEMENT').lat,18.65);
A.equal(E('1794-PORT-AU-PRINCE-CAPTURE').lng,-72.33881);
A.equal(E('1795-APR2-PIERRE-ALEXANDRE-EXECUTION').lat,null);
A.equal(E('1795-APR8-NAVY-STRONGHOLD-ASSAULT').lat,null);
A(E('1796-JUN7-ENSLAVED-REBEL-LAW').description.includes('6月7日'));
A(E('1797-MAY13-CHAINS-ESCAPE-DEATH-LAW').description.includes('48小时'));
A(E('1796-GRENADA-POSTWAR-EXECUTIONS').description.includes('100'));
A(E('1796-WAR-ENSLAVED-DEATH-ESTIMATE').description.includes('7000'));
A.equal(d.statistics.Hamilton_1795_1796_postwar_white_free_colour_executed_approx,100);
A.equal(d.statistics.Candlin_1795_1796_all_enslaved_war_deaths_estimate_approx,7000);
A.equal(d.statistics.verified_enslaved_executed_by_british_courts_total,null);
A.equal(d.statistics.verified_all_british_direct_military_kills,null);
let links=[];
for(const section of story.sections){
 A.equal(section.paragraphs.length,3);
 A(section.source_keys.length>0&&section.source_keys.every(k=>sources.has(k)));
 for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(events.has(m[1]),'broken story map '+m[1]);links.push(m[1]);}
}
A.equal(links.length,25);A.equal(new Set(links).size,25);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[18].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-fedon-grenada-haiti-1789-1798.json'"));
A(app.includes('fedon19Ready=true'));
A(reader.includes('draft.stories?.length===34'));
A(reader.includes("storyMeta.has('E18-T06-FEDON-GRENADA-HAITI-BRITISH-REPRESSION-1789-1798')"));
A(html.includes('18c19-fedon-20261110'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS nineteenth story T06: 9 authentic A candidates / 8 A source keys, 25 dated actions 30 registered sources 28 chapters 84 paragraphs 25 links, 6 modern city locators, no imaginary British Haitian control polygons, 1795 2 April execution and 1796/1797 slavery law verified, separate 100 executions and 7000 war death estimate.');
