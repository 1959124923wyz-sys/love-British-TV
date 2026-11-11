#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),fs=require('node:fs'),P=require('node:path');
const root=P.resolve(__dirname,'..'),rd=p=>fs.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const ds=J('data/stories/serial/chronology-preview-ceylon-coastal-invasion-1791-1797.json');
const story=J('data/stories/serial/e18-t24-ceylon-british-invasion-tax-rebellion-1791-1797.json');
const index=J('data/stories/serial/preview-18c-index.json');
const orig=J('research/18c/consolidated/series/T24.json');
const geo=J('research/continuity/1791-1797-ceylon/BRITISH_COASTAL_FORTS_KANDY_TAX_REVOLT_TRANSITIONS.json');
const published=J('data/stories/serial/index.json'),app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
A.equal(index.stories.length,30);
A.equal(index.stories[15].id,story.id);
A.equal(index.stories[15].publication_review,'not_submitted');
A.equal(index.stories[15].status,'research_preview');
A.equal(story.id,'E18-T24-CEYLON-COASTAL-INVASION-KANDY-RESISTANCE-1791-1797');
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');A.equal(story.editorial_status,'research_preview_not_published');
A.deepEqual(story.predecessor_17c_story_ids,['E6-T12']);A(published.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));A(!published.topics.some(x=>x.id===story.id));
A.equal(ds.schema,'atlas-18c-ceylon-british-coastal-invasion-kandy-tax-resistance-v1');
A.equal(ds.editorial_status,'research_preview_not_published');
A.equal(ds.events.length,20);A.equal(ds.sources.length,34);
A.equal(ds.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,9);
A.equal(ds.sources.filter(x=>x.original_registry_key===null).length,25);
A(ds.sources.every(x=>x.url.startsWith('https://')&&x.original_manuscript_personally_inspected===false));
A.equal(story.sections.length,23);A.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),69);
A.equal(ds.routes.length,0);A.equal(ds.places.length,0);A.equal(ds.colonial_polygons.length,0);
A.equal(ds.publication.actual_control_polygons_approved,0);
A.equal(geo.schema,'atlas-18c-ceylon-british-forts-kandyan-kingdom-fiscal-rebellion-control-v1');
A.equal(geo.transitions.length,20);A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
A.equal(orig.story_arc_id,'T24');A.equal(orig.groups.length,5);
A.equal(orig.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),7);
A.deepEqual(new Set(ds.sources.map(s=>s.id)),new Set(story.sources.map(s=>s.id)));
const originals=new Map(orig.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{group:g,child:c}])));
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const srcIDs=new Set(ds.sources.map(x=>x.id)),used=new Set,seen=new Map;
let mapped=0,additional=0,points=0;
for(const e of ds.events){
 A(!seen.has(e.id)&&/^E18C-CEY-[A-Z0-9-]+$/.test(e.id),'bad duplicate '+e.id);seen.set(e.id,e);
 A(e.year>=1791&&e.year<=1797&&e.start_year===e.year&&e.end_year===e.year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.area_sqkm,null);A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);
 A.equal(e.position_is_historical_survey,false);A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(x=>srcIDs.has(x)),'missing source for '+e.id);
 if(e.research_merge_group_id!==null){
  mapped++;A(e.research_original_record_ids.length>0);A.equal(e.research_provenance_kind,'direct_editor15_T24_merged_child');
  for(const id of e.research_original_record_ids){
   A(!used.has(id),'original reused '+id);used.add(id);const o=originals.get(id);
   A(o&&o.child.year===e.year&&o.group.id===e.research_merge_group_id,'bad source year/group '+id);
   A(cross.includes('\n'+id+','),'missing original archival crosswalk '+id);
  }
 }else{additional++;A.deepEqual(e.research_original_record_ids,[]);}
 if(e.lat!==null){points++;A(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
 else{A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
}
A.equal(mapped,7);A.equal(additional,13);A.equal(points,10);A.equal(used.size,7);
A.deepEqual(used,new Set(orig.groups.flatMap(g=>g.original_candidate_ids)));
const E=id=>seen.get('E18C-CEY-'+id);
A.equal(E('1791-COCHIN-TRIBUTARY-TREATY').lat,9.964793);
A.equal(E('1795-COCHIN-DUTCH-FORT-CAPTURE').lng,76.242943);
A.equal(E('1795-FORT-FREDERICK-CAPTURE').lng,81.2421);
A(E('1795-COCHIN-DUTCH-FORT-CAPTURE').lng<E('1795-FORT-FREDERICK-CAPTURE').lng-4);
A.equal(E('1795-KANDY-ALLIANCE-TREATY').lat,7.2930778);
A(E('1795-KANDY-ALLIANCE-TREATY').control_state.includes('Independent Kandyan'));
A(E('1796-COLOMBO-CAPITULATION').description.includes('15日'));
A(E('1796-COLOMBO-FORT-ENTRY').description.includes('16日'));
A(E('1796-GALLE-FORT-SURRENDER').description.includes('23日'));
A.equal(E('1797-COASTAL-PETITIONS-AND-RESISTANCE').lat,null);
A.equal(E('1797-BRITISH-ARMED-COUNTERINSURGENCY').lat,null);
A(E('1797-BRITISH-ARMED-COUNTERINSURGENCY').description.includes('英军'));
A.equal(ds.statistics.confirmed_1797_british_repression_deaths,null);
A.equal(ds.statistics.confirmed_british_land_sqkm,null);
let links=[];
for(const s of story.sections){
 A.equal(s.paragraphs.length,3);A(s.source_keys.length>0&&s.source_keys.every(x=>srcIDs.has(x)));
 for(const p of s.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  A(seen.has(m[1]),'event id missing '+m[1]);links.push(m[1]);
 }
}
A.equal(links.length,20);A.equal(new Set(links).size,20);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(index.stories[15].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-ceylon-coastal-invasion-1791-1797.json'"));
A(app.includes('ceylon18cReady=true'));
A(reader.includes('draft.stories?.length===30'));
A(reader.includes("storyMeta.has('E18-T24-CEYLON-COASTAL-INVASION-KANDY-RESISTANCE-1791-1797')"));
A(html.includes('18c16-ceylon-20261110'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T24 16th story: 20 dated real events, 34 sources, 23 chapters 69 paragraphs / 20 links; seven editor15 originals and 9 B keys preserved; Cochin India not Sri Lanka, Kandy independent; 10 modern heritage site references, 0 invented territorial polygons or deaths.');
