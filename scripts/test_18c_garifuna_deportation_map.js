#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-garifuna-1763-1797.json'),story=J('data/stories/serial/e18-t05-garifuna-forced-exile-1763-1797.json'),index=J('data/stories/serial/preview-18c-index.json'),raw=J('research/18c/consolidated/series/T05.json'),geo=J('research/continuity/1763-1797-garifuna/BRITISH_GARIFUNA_EXILE_LAND_CONTROL_TRANSITIONS.json'),published=J('data/stories/serial/index.json');
const app=rd('app.js'),ui=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
A.equal(index.stories.length,29);A.equal(index.stories[17].id,story.id);A.equal(index.stories[17].status,'research_preview');A.equal(index.stories[17].publication_review,'not_submitted');
A.equal(story.id,'E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797');A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
A.deepEqual(story.predecessor_17c_story_ids,['E6-T08']);A(published.topics.some(x=>x.id==='E6-T08'&&x.status==='published'));
A(!published.topics.some(x=>x.id===story.id));
A.equal(d.schema,'atlas-18c-garifuna-forced-deportation-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,23);A.equal(d.sources.length,22);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('A:')).length,5);
A.equal(d.sources.filter(s=>s.original_registry_key===null).length,17);
A(d.sources.every(s=>s.url.startsWith('https://')&&s.original_manuscript_personally_inspected===false));
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
A.equal(story.sections.length,26);A.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),78);
A.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(story.sources.map(s=>s.id)));
A.equal(raw.story_arc_id,'T05');A.equal(raw.groups.length,3);A.equal(raw.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),9);
A.equal(geo.schema,'atlas-18c-garifuna-exile-multiactor-control-v1');
A.equal(geo.transitions.length,23);A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const sourceIds=new Set(d.sources.map(s=>s.id)),originals=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{g,c}])));
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv'),seen=new Map,originalIDs=new Set;
let originalNodes=0,supp=0,points=0;
for(const e of d.events){
 A(!seen.has(e.id)&&/^E18C-GAR-[A-Z0-9-]+$/.test(e.id));seen.set(e.id,e);
 A(e.year>=1763&&e.year<=1797&&e.start_year===e.year&&e.end_year===e.year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(k=>sourceIds.has(k)),'missing source '+e.id);
 if(e.research_merge_group_id!==null){originalNodes++;
   A.equal(e.research_provenance_kind,'direct_editor15_T05_original');
   for(const id of e.research_original_record_ids){
     A(!originalIDs.has(id));originalIDs.add(id);
     const o=originals.get(id);A(o&&o.c.year===e.year&&o.g.id===e.research_merge_group_id,'wrong group/year '+id);
     A(cross.includes('\n'+id+','),'missing 1126 registry '+id);
   }
 }else{supp++;A.deepEqual(e.research_original_record_ids,[]);}
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{points++;A(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
}
A.equal(originalNodes,9);A.equal(supp,14);A.equal(originalIDs.size,9);A.equal(points,13);
A.deepEqual(originalIDs,new Set(raw.groups.flatMap(g=>g.original_candidate_ids)));
const E=tag=>seen.get('E18C-GAR-'+tag);
A.equal(E('1795-CALLIAQUA-ASSAULT').lat,13.12867);
A.equal(E('1795-CHATEAUBELAIR-BOMBARDMENT').lng,-61.24043);
A.equal(E('1796-BALICEAUX-MASS-DETENTION').lat,12.94773);
A.equal(E('1797-APR-ROATAN-ARRIVE').lat,16.37219);
A.equal(E('1797-TRUJILLO-REBUILD').lat,15.9174115);
A.equal(E('1795-SETON-EXTIRPATION').lat,null);
A.equal(E('1795-ROEBUCK-SHELLS').lat,null);
A(E('1795-SETON-EXTIRPATION').name.includes('消灭') && E('1795-SETON-EXTIRPATION').description.includes('清除'));
A(E('1796-BALICEAUX-MORTALITY').description.includes('死亡'));
A(E('1797-APR-ROATAN-ARRIVE').description.includes('4月12'));
A.equal(d.statistics.Hamilton_baliceaux_displacement,4776);
A.equal(d.statistics.Gonzalez_baliceaux_registration,4338);
A.equal(d.statistics.SVG_public_banishment_report,5080);
A.equal(d.statistics.Gonzalez_march_1797_embarked,2248);
A.equal(d.statistics.Taylor_april_1797_roatan_arrival,2026);
A.equal(d.statistics.verified_all_detainee_deaths,null);
let links=[];
for(const s of story.sections){A.equal(s.paragraphs.length,3);A(s.source_keys.length>0&&s.source_keys.every(k=>sourceIds.has(k)));
 for(const p of s.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(seen.has(m[1]),'missing target '+m[1]);links.push(m[1]);}}
A.equal(links.length,23);A.equal(new Set(links).size,23);
A.deepEqual(new Set(links),new Set(story.related_event_ids));A.deepEqual(new Set(links),new Set(index.stories[17].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-garifuna-1763-1797.json'"));
A(app.includes('garifuna18cReady=true'));
A(ui.includes('draft.stories?.length===29'));
A(ui.includes("storyMeta.has('E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797')"));
A(html.includes('18c18-garifuna-20261110'));
A(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T05: 9 original T05 candidate IDs/5 archival A source keys; 23 event nodes/22 source references, 26 chapters 78 paragraphs/23 correct links, 13 modern named-place reference points and 0 fabricated coast-control polygons or forced-shipping routes, prior 17 topics and 16C intact.');
