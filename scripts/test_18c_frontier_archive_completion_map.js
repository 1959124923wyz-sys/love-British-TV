#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-australia-frontier-1788-1799.json'),story=J('data/stories/serial/e18-t35-aboriginal-frontier-violence-1788-1799.json'),idx=J('data/stories/serial/preview-18c-index.json'),orig=J('research/18c/consolidated/series/T35.json'),prev=J('data/stories/serial/chronology-preview-australia-1700-1799.json'),oldStory=J('data/stories/serial/e18-t34-t35-australia-first-fleet-1717-1799.json'),geo=J('research/continuity/1788-1799-australia/BRITISH_FRONTIER_MASSACRE_RESISTANCE_TRANSITIONS.json');
A.equal(idx.stories.length,20);A.equal(idx.stories[16].id,story.id);
A.equal(idx.stories[16].status,'research_preview');A.equal(idx.stories[16].publication_review,'not_submitted');
A.equal(story.id,'E18-T35-ABORIGINAL-FRONTIER-MASSACRE-1788-1799');
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
A.deepEqual(story.predecessor_story_ids,['E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799']);
A.equal(d.schema,'atlas-18c-aboriginal-frontier-violence-archive-completion-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,25);A.equal(d.sources.length,34);
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('C:')).length,14);
A.equal(d.sources.filter(x=>x.original_registry_key===null).length,20);
A(d.sources.every(x=>x.url.startsWith('https://')&&x.original_manuscript_personally_inspected===false));
A.deepEqual(new Set(story.sources.map(x=>x.id)),new Set(d.sources.map(x=>x.id)));
A.equal(story.sections.length,28);
A.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),84);
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
A.equal(orig.story_arc_id,'T35');A.equal(orig.groups.length,7);
const originals=new Map(orig.groups.flatMap(g=>g.candidate_subevents.map(child=>[child.original_id,{g,child}])));
A.equal(originals.size,15);
const already=new Set(prev.events.flatMap(e=>e.research_original_record_ids||[]));
const usedBefore=new Set([...originals.keys()].filter(k=>already.has(k)));
const omitted=new Set([...originals.keys()].filter(k=>!already.has(k)));
const expected=new Set(['C6-D11-003','C4-D11-004','C6-D11-004','C4-D11-005']);
A.equal(usedBefore.size,11);A.deepEqual(omitted,expected);
A.equal(oldStory.related_event_ids.length,23);
A.deepEqual(new Set(d.provenance.originals_previously_registered_in_sixth_topic),usedBefore);
A.deepEqual(new Set(d.provenance.originals_newly_recovered_in_seventeenth_topic),expected);
A.equal(geo.schema,'atlas-18c-australia-frontier-military-and-judicial-transitions-v1');
A.equal(geo.transitions.length,25);
A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const sourceSet=new Set(d.sources.map(x=>x.id)),cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv'),found=new Map,used=new Set;
let restored=0,supplement=0,points=0;
for(const e of d.events){
 A(!found.has(e.id)&&/^E18C-FRONTIER-[A-Z0-9-]+$/.test(e.id));found.set(e.id,e);
 A(!prev.events.some(old=>old.id===e.id),'collides with sixth-story map '+e.id);
 A(e.year>=1788&&e.year<=1799&&e.year===e.start_year&&e.year===e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(s=>sourceSet.has(s)),'missing source '+e.id);
 if(e.research_merge_group_id!==null){
  restored++;A.equal(e.research_provenance_kind,'recovered_previously_unmapped_T35_original');
  for(const id of e.research_original_record_ids){
   A(!used.has(id)&&!already.has(id));used.add(id);
   const a=originals.get(id);A(a&&a.g.id===e.research_merge_group_id&&a.child.year===e.year);
   A(cross.includes('\n'+id+','),'archive crosswalk not found '+id);
  }
 }else{supplement++;A.deepEqual(e.research_original_record_ids,[]);A.equal(e.research_provenance_kind,'supplemental_dated_action_not_a_duplicate_original');}
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{points++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
}
A.equal(restored,4);A.equal(supplement,21);A.equal(points,4);A.deepEqual(used,expected);
const E=id=>found.get('E18C-FRONTIER-'+id);
A(E('1790-PHILLIP-ORDER-TEN-HEADS').description.includes('十'));
A(E('1790-DEC14-FAILED-EXPEDITION').description.includes('没有抓住'));
A(E('1795-PATERSON-MILITARY-KILLS').description.includes('七或八'));
A(E('1799-FEB-HEWITT-WILLIE-CUTHIE').description.includes('遗孀'));
A(E('1799-OCT-POWELL-TRIAL').description.includes('五名'));
A.equal(E('1795-PATERSON-MILITARY-KILLS').lat,null);
A.equal(E('1790-WILLEMERING-SPEARS-PHILLIP').lat,-33.800094);
A(!d.events.some(x=>x.year>=1800));
A.equal(d.statistics.colonial_punishment_1790_ordered_beheadings,10);
A.equal(d.statistics.colonial_1790_punitive_missions_reported_actual_kills,0);
A.equal(d.statistics.colonial_1795_military_reported_deaths_min,7);
A.equal(d.statistics.colonial_1795_military_reported_deaths_max,8);
A.equal(d.statistics.colonial_1795_reported_captives,5);
A.equal(d.statistics.colonial_frontier_war_total_deaths,null);
let links=[];
for(const section of story.sections){
 A.equal(section.paragraphs.length,3);A(section.source_keys.length>0&&section.source_keys.every(k=>sourceSet.has(k)));
 for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(found.has(m[1]),m[1]);links.push(m[1]);}
}
A.equal(links.length,25);A.equal(new Set(links).size,25);
A.deepEqual(new Set(links),new Set(idx.stories[16].event_ids));
A.deepEqual(new Set(links),new Set(story.related_event_ids));
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
A(app.includes("fetch('data/stories/serial/chronology-preview-australia-frontier-1788-1799.json'"));
A(app.includes('frontier17Ready=true'));
A(reader.includes('draft.stories?.length===20'));
A(reader.includes("storyMeta.has('E18-T35-ABORIGINAL-FRONTIER-MASSACRE-1788-1799')"));
A(html.includes('18c17-frontier-20261110'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T35 NSW archives 17th study: 15 originals=11 prior+4 recovered, 14 unchanged C keys, 25 new timed events, 34 sources, 28 chapters/84 paragraphs/25 map links; 1790 planned 10 killings versus actual zero, 1795 real 7–8 killed five prisoners, 1799 legal atrocity and 0 fabricated historic polygons.');
