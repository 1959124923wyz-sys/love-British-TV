#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-british-slavery-stono-fortmose-1705-1752.json'),story=J('data/stories/serial/e18-t11-slavery-violence-fortmose-1705-1752.json'),idx=J('data/stories/serial/preview-18c-index.json'),raw=J('research/18c/consolidated/series/T11.json'),geo=J('research/continuity/1705-1752-british-colonies/ENSLAVEMENT_LAWS_BLACK_RESISTANCE_FORTMOSE_CONTROL_TRANSITIONS.json');
const app=rd('app.js'),ui=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css'),crosswalk=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,20);
A.equal(idx.stories[19].id,story.id);A.equal(idx.stories[19].status,'research_preview');A.equal(idx.stories[19].publication_review,'not_submitted');
A.equal(story.id,'E18-T11-BRITISH-ENSLAVEMENT-LAWS-STONO-FORTMOSE-1705-1752');
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
A.deepEqual(story.predecessor_story_ids,['E18-T01-T02-ATLANTIC-ZONG-1711-1799']);
A.equal(d.schema,'atlas-18c-t11-north-american-slavery-and-fortmose-primary-law-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,27);A.equal(d.sources.length,39);
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('A:')).length,21);
A.equal(d.sources.filter(x=>x.original_registry_key===null).length,18);
A(d.sources.every(x=>x.url.startsWith('https://')&&x.original_manuscript_personally_inspected===false));
A.equal(story.sections.length,30);
A.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),90);
A.deepEqual(new Set(d.sources.map(x=>x.id)),new Set(story.sources.map(x=>x.id)));
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
A.equal(raw.story_arc_id,'T11');A.equal(raw.groups.length,8);
const original=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{g,c}])));
A.equal(original.size,10);
A.equal(geo.schema,'atlas-18c-t11-slavery-law-and-free-black-armed-resistance-v1');
A.equal(geo.transitions.length,27);A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const ids=new Set(d.sources.map(x=>x.id)),events=new Map,used=new Set;let mapped=0,supp=0,gps=0;
for(const e of d.events){
 A(!events.has(e.id)&&/^E18C-ENS-[A-Z0-9-]+$/.test(e.id));events.set(e.id,e);
 A(e.year>=1705&&e.year<=1752&&e.year===e.start_year&&e.year===e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);
 A.equal(e.position_is_historical_survey,false);A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(k=>ids.has(k)),'missing original historical source '+e.id);
 if(e.research_merge_group_id!==null){mapped++;A.equal(e.research_provenance_kind,'direct_editor15_T11_original');
  for(const id of e.research_original_record_ids){
   A(!used.has(id),'original source ID repeated '+id);used.add(id);
   const x=original.get(id);A(x&&x.g.id===e.research_merge_group_id&&x.c.year===e.year,'original year/merge mismatch '+id);
   A(crosswalk.includes('\n'+id+','),'original 1126 crosswalk missing '+id);
  }
 }else{supp++;A.deepEqual(e.research_original_record_ids,[]);}
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{gps++;A(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
}
A.equal(mapped,10);A.equal(supp,17);A.equal(gps,14);
A.deepEqual(used,new Set(raw.groups.flatMap(g=>g.original_candidate_ids)));
const E=tag=>events.get('E18C-ENS-'+tag);
A(E('1705-KILLING-IN-CORRECTION').description.includes('不构成重罪'));
A(E('1705-KILL-FUGITIVE-LAW').description.includes('杀害'));
A(E('1712-TWENTY-HANGED-THREE-BURNED').description.includes('20'));
A(E('1729-MARYLAND-DISMEMBERMENT').description.includes('分尸'));
A(E('1739-OCT5-BULL-REPORT').description.includes('44'));
A(E('1740-JUN26-FORTMOSE-RETAKEN').description.includes('6月26'));
A.equal(E('1739-SEP9-STONO-UPRISING').lat,null);
A.equal(E('1740-JUN26-FORTMOSE-RETAKEN').lat,29.89469);
A.equal(E('1712-APR6-NEWYORK-REVOLT').lng,-74.00597);
A.equal(d.statistics.Columbia_1712_tried,43);
A.equal(d.statistics.Columbia_1712_convicted,25);
A.equal(d.statistics.Columbia_1712_hanged,20);
A.equal(d.statistics.Columbia_1712_burned,3);
A.equal(d.statistics.Bull_1739_black_killed_or_executed_combined,44);
A.equal(d.statistics.verified_law_based_enslaved_deaths_1705,null);
let links=[];
for(const section of story.sections){
 A.equal(section.paragraphs.length,3);
 A(section.source_keys.length>0&&section.source_keys.every(s=>ids.has(s)));
 for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(events.has(m[1]),'broken linked event '+m[1]);links.push(m[1]);}
}
A.equal(links.length,27);A.equal(new Set(links).size,27);
A.deepEqual(new Set(links),new Set(idx.stories[19].event_ids));
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-british-slavery-stono-fortmose-1705-1752.json'"));
A(app.includes('slaveryT11Ready=true'));
A(ui.includes('draft.stories?.length===20'));
A(ui.includes("storyMeta.has('E18-T11-BRITISH-ENSLAVEMENT-LAWS-STONO-FORTMOSE-1705-1752')"));
A(html.includes('18c20-northamerica-20261110'));
A(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T11 original 8 groups/10 one-to-one candidates/21 A original source keys; 27 historical legal and resistance nodes, 39 sources, 30 chapters/90 paragraphs/27 links, 14 modern city references, no fabricated Stono battlefield or British Florida Polygon; original 1712/1739 statistics accurate, previous 19 maps unaffected.');
