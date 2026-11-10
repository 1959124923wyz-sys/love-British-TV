#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-tuscarora-yamasee-1707-1732.json'),story=J('data/stories/serial/e18-t09-colonial-indigenous-slave-raids-1707-1732.json'),idx=J('data/stories/serial/preview-18c-index.json'),raw=J('research/18c/consolidated/series/T09.json'),geo=J('research/continuity/1707-1732-carolina/TUSCARORA_YAMASEE_BRITISH_ENSLAVEMENT_CONTROL_TRANSITIONS.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css'),cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,21);A.equal(idx.stories[20].id,story.id);A.equal(idx.stories[20].status,'research_preview');A.equal(idx.stories[20].publication_review,'not_submitted');
A.equal(story.id,'E18-T09-CAROLINA-TUSCARORA-YAMASEE-SLAVE-RAIDS-1707-1732');
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
A.deepEqual(story.predecessor_story_ids,['E18-T11-BRITISH-ENSLAVEMENT-LAWS-STONO-FORTMOSE-1705-1752']);
A.equal(d.schema,'atlas-18c-t09-carolina-indigenous-enslavement-v1');
A.equal(d.editorial_status,'research_preview_not_published');A.equal(d.events.length,27);A.equal(d.sources.length,26);
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('A:')).length,9);A.equal(d.sources.filter(x=>x.original_registry_key===null).length,17);
A(d.sources.every(x=>x.url.startsWith('https://')&&x.original_manuscript_personally_inspected===false));
A.equal(story.sections.length,30);A.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),90);
A.deepEqual(new Set(d.sources.map(x=>x.id)),new Set(story.sources.map(x=>x.id)));
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);A.equal(d.publication.actual_control_polygons_approved,0);
A.equal(raw.story_arc_id,'T09');A.equal(raw.groups.length,5);
const originals=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{g,c}])));
A.equal(originals.size,9);
A.equal(geo.schema,'atlas-18c-t09-tuscarora-yamasee-uk-colonial-war-transitions-v1');
A.equal(geo.transitions.length,27);A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const sources=new Set(d.sources.map(x=>x.id)),events=new Map,used=new Set;let mapped=0,supp=0,pins=0;
for(const e of d.events){
 A(!events.has(e.id)&&/^E18C-TUS-[A-Z0-9-]+$/.test(e.id));events.set(e.id,e);
 A(e.year>=1707&&e.year<=1732&&e.start_year===e.year&&e.end_year===e.year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(s=>sources.has(s)),'unregistered original source '+e.id);
 if(e.research_merge_group_id!==null){mapped++;A.equal(e.research_provenance_kind,'direct_editor15_T09_original');
  for(const id of e.research_original_record_ids){A(!used.has(id));used.add(id);const z=originals.get(id);
    A(z&&z.c.year===e.year&&z.g.id===e.research_merge_group_id,'historical original mis-assigned '+id);
    A(cross.includes('\n'+id+','),'missing original 1126 crosswalk '+id);
  }
 }else{supp++;A.deepEqual(e.research_original_record_ids,[]);}
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}else{pins++;A(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));}
}
A.equal(mapped,9);A.equal(supp,18);A.equal(used.size,9);A.equal(pins,5);
A.deepEqual(used,new Set(raw.groups.flatMap(g=>g.original_candidate_ids)));
const E=id=>events.get('E18C-TUS-'+id);
A.equal(E('E18A2-TUS-NEOHEROKA-FALL').lat,null);
A.equal(E('1715-APR14-POCOTALIGO-MEETING').lat,32.6371251);
A.equal(E('1715-CRAVEN-ARMS-ENSLAVED').lng,-79.93275);
A.equal(E('1712-BARNWELL-ENSLAVES-200').lat,null);
A(E('1712-BARNWELL-ENSLAVES-200').name.includes('200')&&E('1712-BARNWELL-ENSLAVES-200').description.includes('奴役'));
A(E('1713-NEOHEROKA-950-TOTAL').description.includes('950'));
A(E('E18A6-1723-003').description.includes('七年'));
A.equal(d.statistics.NC_Neoheroka_1713_killed_or_captured_combined,950);
A.equal(d.statistics.NC_Barnwell_1712_indigenous_women_children_sold_approximately,200);
A.equal(d.statistics.NC_overall_Tuscarora_war_indigenous_enslaved_approximately,1000);
A.equal(d.statistics.verified_Neoheroka_exact_killed_total,null);A.equal(d.statistics.verified_1723_reenslaved_freed_people_count,null);
let links=[];
for(const s of story.sections){A.equal(s.paragraphs.length,3);A(s.source_keys.length>0&&s.source_keys.every(k=>sources.has(k)));
 for(const p of s.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(events.has(m[1]),'broken map '+m[1]);links.push(m[1]);}
}
A.equal(links.length,27);A.equal(new Set(links).size,27);
A.deepEqual(new Set(links),new Set(story.related_event_ids));A.deepEqual(new Set(links),new Set(idx.stories[20].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-tuscarora-yamasee-1707-1732.json'"));A(app.includes('tuscarora21Ready=true'));
A(reader.includes('draft.stories?.length===21'));A(reader.includes("storyMeta.has('E18-T09-CAROLINA-TUSCARORA-YAMASEE-SLAVE-RAIDS-1707-1732')"));
A(html.includes('18c21-tuscarora-20261110'));A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS 21st T09: 27 events, 26 sources incl nine original A, 5 original groups and nine IDs, 30 chapters 90 paragraphs and 27 working IDs, 5 modern named city pins; 1713 950 killed-or-captive and 1712 200 enslaved not double-counted, 0 fake UK colonial polygons.');
