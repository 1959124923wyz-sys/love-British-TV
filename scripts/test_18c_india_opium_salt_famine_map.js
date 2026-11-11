#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),j=p=>JSON.parse(rd(p));
const d=j('data/stories/serial/chronology-preview-india-opium-salt-1761-1799.json'),a=j('data/stories/serial/e18-t21-east-india-opium-salt-famine-1761-1799.json'),index=j('data/stories/serial/preview-18c-index.json'),raw=j('research/18c/consolidated/series/T21.json'),g=j('research/continuity/1761-1799-india/EIC_OPIUM_SALT_TEXTILE_FAMINE_ACTOR_TRANSITIONS.json'),pub=j('data/stories/serial/index.json');
const app=rd('app.js'),ui=rd('js/history-stories.js'),css=rd('css/history-stories.css'),html=rd('index.html');
A.equal(index.stories.length,22);A.equal(index.stories[14].id,a.id);A.equal(index.stories[14].status,'research_preview');A.equal(index.stories[14].publication_review,'not_submitted');
A.equal(a.id,'E18-T21-EIC-OPIUM-SALT-FAMINE-1761-1799');A.equal(a.publication_status,'research_only');A.equal(a.publication_approval,'not_submitted');
A.deepEqual(a.predecessor_17c_story_ids,['E6-T12']);A(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));A(!pub.topics.some(x=>x.id===a.id));
A.equal(d.schema,'atlas-18c-india-eic-opium-salt-famine-coercion-v1');A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,18);A.equal(d.sources.length,22);A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,6);A.equal(d.sources.filter(x=>x.original_registry_key===null).length,16);
A(d.sources.every(x=>x.url.startsWith('https://')&&x.original_manuscript_personally_inspected===false));
A.equal(d.colonial_polygons.length,0);A.equal(d.places.length,0);A.equal(d.routes.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
A.equal(a.sections.length,21);A.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),63);
A.deepEqual(new Set(d.sources.map(x=>x.id)),new Set(a.sources.map(x=>x.id)));
A.equal(raw.story_arc_id,'T21');A.equal(raw.groups.length,3);A.equal(raw.groups.reduce((n,x)=>n+x.original_candidate_ids.length,0),9);
A.equal(g.schema,'atlas-18c-india-east-india-company-multi-actor-fiscal-control-v1');A.equal(g.transitions.length,18);
A(g.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const originals=new Map(raw.groups.flatMap(group=>group.candidate_subevents.map(sub=>[sub.original_id,{sub,group}])));
const by=new Map,originalIDs=new Set,sourceIDs=new Set(d.sources.map(s=>s.id)),crosswalk=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
let mapped=0,supp=0,locs=0;
for(const e of d.events){
 A(!by.has(e.id)&&/^E18C-IND-[A-Z0-9-]+$/.test(e.id),'duplicate/bad ID '+e.id);by.set(e.id,e);
 A(e.year>=1761&&e.year<=1799&&e.start_year===e.year&&e.end_year===e.year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(id=>sourceIDs.has(id)),'source missing for '+e.id);
 if(e.research_merge_group_id!==null){
  mapped++;A(e.research_original_record_ids.length>0);A.equal(e.research_provenance_kind,'direct_editor15_T21_merged_child');
  for(const id of e.research_original_record_ids){
   A(!originalIDs.has(id));originalIDs.add(id);
   const orig=originals.get(id);A(orig&&orig.sub.year===e.year&&orig.group.id===e.research_merge_group_id,'year mismatch '+id);
   A(crosswalk.includes('\n'+id+','),'missing T21 archive original '+id);
  }
 }else{supp++;A.deepEqual(e.research_original_record_ids,[]);A.equal(e.research_provenance_kind,'independent_official_or_peer_reviewed_supplement');}
 if(e.lat!==null){locs++;A(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
 else{A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
}
A.equal(originalIDs.size,9);A.equal(mapped,8);A.equal(supp,10);A.equal(locs,9);
A.deepEqual(originalIDs,new Set(raw.groups.flatMap(x=>x.original_candidate_ids)));
const E=x=>by.get('E18C-IND-'+x);
A.equal(E('1773-HASTINGS-OPIUM-CONTRACT').research_original_record_ids.length,2);
A.equal(E('1780-SALT-PRIVATE-PRODUCTION-BAN').research_original_record_ids.length,1);
A.equal(E('1792-NORTHERN-CIRCARS-STARVATION').research_original_record_ids.length,1);
A.equal(E('1792-MADRAS-CHILD-RELIEF-ORDER').research_original_record_ids.length,1);
A.equal(E('1792-NORTHERN-CIRCARS-STARVATION').lat,null);
A.equal(E('1776-WEAVER-PROCUREMENT-PENALTIES').lat,null);
A.equal(E('1786-BENARES-OPIUM-MONOPOLY').lat,25.2);
A.equal(E('1799-REGULATION-VI-OPIUM').lat,25.5941);
A.equal(E('1788-BENGAL-SALT-CALCUTTA-AUCTION').lat,22.55);
A(E('1793-BIHAR-CULTIVATION-OPTIONAL').description.includes('自'));
A(E('1788-CORNWALLIS-OPIUM-COERCION-INQUIRY').description.includes('强'));
A(E('1792-MADRAS-CHILD-RELIEF-ORDER').description.includes('儿童'));
A.equal(d.statistics.verified_18c_eic_opium_profit_annual,null);
A.equal(d.statistics.verified_1792_southern_famine_deaths,null);
let links=[];
for(const s of a.sections){A.equal(s.paragraphs.length,3);A(s.source_keys.length>0&&s.source_keys.every(id=>sourceIDs.has(id)));
 for(const para of s.paragraphs)for(const m of para.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(by.has(m[1]),m[1]);links.push(m[1]);}}
A.equal(links.length,18);A.equal(new Set(links).size,18);
A.deepEqual(new Set(links),new Set(a.related_event_ids));A.deepEqual(new Set(links),new Set(index.stories[14].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-india-opium-salt-1761-1799.json'"));
A(app.includes('indiaFiscal18cReady=true'));A(ui.includes('draft.stories?.length===22'));
A(ui.includes("storyMeta.has('E18-T21-EIC-OPIUM-SALT-FAMINE-1761-1799')"));
A(html.includes('18c15-india-fiscal-20261110'));
A(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T21: 3 original groups/9 IDs/6 B keys, 18 events/22 sources, 21 chapters 63 paragraphs/18 links, 9 modern city reference points, 0 invented polygons, earlier 14 and 16C intact.');
