#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path');
const root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const data=J('data/stories/serial/chronology-preview-t08-seven-years-1740-1775.json');
const story=J('data/stories/serial/e18-t08-seven-years-cherokee-pontiac-paxton-1740-1775.json');
const geo=J('research/continuity/1740-1775-seven-years/BRITISH_WAR_INDIGENOUS_LAND_TRANSITIONS.json');
const original=J('research/18c/consolidated/series/T08.json');
const idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,34);A.equal(idx.stories[21].id,story.id);A.equal(idx.stories[21].status,'research_preview');
A.equal(data.schema,'atlas-18c-t08-seven-years-colonial-atrocities-v1');A.equal(data.editorial_status,'research_preview_not_published');
A.equal(data.events.length,32);A.equal(data.sources.length,50);A.equal(data.sources.filter(s=>s.original_registry_key?.startsWith('A:')).length,24);
A.equal(original.groups.length,11);A.equal(data.provenance.original_candidate_ids,12);A.equal(data.provenance.original_A_keys,24);
A.equal(data.places.length,0);A.equal(data.routes.length,0);A.equal(data.colonial_polygons.length,0);
A.equal(data.publication.actual_control_polygons_approved,0);
A(data.sources.every(s=>s.url.startsWith('https://')&&s.original_manuscript_personally_inspected===false));
const keys=new Set(data.sources.map(s=>s.id)),known=new Set(data.events.map(e=>e.id)),used=new Set;
const orig=new Map(original.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{year:c.year,group:g.id}])));
A.equal(orig.size,12);let pointCount=0;
for(const e of data.events){
 A(/^E18C-T08-[A-Z0-9-]+$/.test(e.id)&&e.year>=1740&&e.year<=1775);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);
 A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.area_sqkm,null);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);A.equal(e.position_is_historical_survey,false);
 A(e.source_ids.length>0&&e.source_ids.every(k=>keys.has(k)),e.id+' unregistered source');
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else {pointCount++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const id of e.research_original_record_ids){
  A(!used.has(id));used.add(id);const r=orig.get(id);
  A(r&&r.group===e.research_merge_group_id&&r.year===e.year,'bad original '+id);
  A(cross.includes('\n'+id+','),'missing 1126 crosswalk '+id);
 }
}
A.equal(known.size,32);A.equal(used.size,12);A.equal(pointCount,5);
A.equal(story.sections.length,32);A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
let links=[];for(const sec of story.sections){A.equal(sec.paragraphs.length,3);
 A(sec.source_keys.length>0&&sec.source_keys.every(k=>keys.has(k)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(known.has(m[1]));links.push(m[1]);}}
A.equal(links.length,32);A.equal(new Set(links).size,32);
A.deepEqual(new Set(links),new Set(story.related_event_ids));A.deepEqual(new Set(links),new Set(idx.stories[21].event_ids));
A.equal(geo.transitions.length,32);
A(geo.transitions.every(e=>e.polygon_allowed===false&&e.area_sqkm===null&&e.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t08-seven-years-1740-1775.json'"));
A(app.includes('t08SevenYears22Ready=true'));A(reader.includes('draft.stories?.length===34'));
A(reader.includes("storyMeta.has('E18-T08-SEVEN-YEARS-CHEROKEE-PONTIAC-PAXTON-1740-1775')"));
A(html.includes('18c22-t08-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const names=tag=>data.events.filter(e=>e.id.includes(tag));
A.equal(names('E18A-1760-C11-02').length,1);
A.equal(names('E18A-1763-C14-02').length,1);
A(names('1763-POX-BLANKETS')[0].description.includes('Trent'));
A(names('1763-PAXTON-SIX')[0].description.includes('3男2女'));
A.equal(data.statistics.paxton_1763_total_murdered,20);
A.equal(data.statistics.verified_deaths_causally_due_to_blankets,null);
A.equal(data.statistics.verified_actual_british_land_sqkm,null);
console.log('PASS twenty-second T08: 22-topic index, 11 groups 12 original candidates 24 A keys; 32 dated events, 50 source entries, 32 chapters 96 paragraphs 32 inline link targets; 5 modern city references and zero invented historic control polygons.');
