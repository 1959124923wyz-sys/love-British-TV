#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path');
const root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const data=J('data/stories/serial/chronology-preview-t09-tuscarora-yamasee-1702-1732.json');
const story=J('data/stories/serial/e18-t09-tuscarora-yamasee-captivity-1702-1732.json');
const geo=J('research/continuity/1702-1732-carolina/BRITISH_TRADE_CAPTIVITY_TUSCARORA_YAMASEE_TRANSITIONS.json');
const raw=J('research/18c/consolidated/series/T09.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A(idx.stories.length>=34);A.equal(idx.stories[20].id,story.id);A.equal(idx.stories[20].status,'research_preview');A.equal(idx.stories[20].publication_review,'not_submitted');
A.equal(data.schema,'atlas-18c-t09-tuscarora-yamasee-captivity-v1');A.equal(data.editorial_status,'research_preview_not_published');
A.equal(data.events.length,24);A.equal(data.sources.length,35);A.equal(data.sources.filter(s=>s.original_registry_key?.startsWith('A:')).length,9);
A.equal(raw.groups.length,5);A.equal(data.provenance.original_candidate_ids,9);A.equal(data.provenance.mapped_original_ids,9);
A.deepEqual(data.provenance.deferred_original_ids,[]);
A.equal(data.routes.length,0);A.equal(data.places.length,0);A.equal(data.colonial_polygons.length,0);
A.equal(data.publication.actual_control_polygons_approved,0);
A(data.sources.every(s=>s.url.startsWith('https://')&&!s.original_manuscript_personally_inspected));
const names=new Set(data.sources.map(s=>s.id)),known=new Set(data.events.map(e=>e.id)),used=new Set;
const originals=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{group:g.id,year:c.year}])));
A.equal(originals.size,9);let pins=0;
for(const e of data.events){
 A(/^E18C-T09-[A-Z0-9-]+$/.test(e.id)&&e.year>=1702&&e.year<=1732);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);A.equal(e.position_is_historical_survey,false);
 A(e.source_ids.length&&e.source_ids.every(k=>names.has(k)));
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const id of e.research_original_record_ids){
   A(!used.has(id));used.add(id);const r=originals.get(id);
   A(r&&r.group===e.research_merge_group_id&&r.year===e.year,'archive year/group mismatch '+id);
   A(cross.includes('\n'+id+','),'missing 1126 crosswalk '+id);
 }
}
A.equal(known.size,24);A.equal(used.size,9);A.equal(pins,4);
A([...originals.keys()].filter(id=>!used.has(id)).length===0);
A.equal(story.sections.length,24);A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
let links=[];for(const sec of story.sections){A.equal(sec.paragraphs.length,3);A(sec.source_keys.length&&sec.source_keys.every(k=>names.has(k)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(known.has(m[1]),'bad inline event '+m[1]);links.push(m[1]);}}
A.equal(links.length,24);A.equal(new Set(links).size,24);
A.deepEqual(new Set(links),new Set(story.related_event_ids));A.deepEqual(new Set(links),new Set(idx.stories[20].event_ids));
A.equal(geo.transitions.length,24);
A(geo.transitions.every(e=>e.polygon_allowed===false&&e.area_sqkm===null&&e.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t09-tuscarora-yamasee-1702-1732.json'"));
A(app.includes('t09Tuscarora21Ready=true'));A(reader.includes('Array.isArray(draft.stories)'));
A(reader.includes("storyMeta.has('E18-T09-TUSCARORA-YAMASEE-INDIGENOUS-CAPTIVITY-1702-1732')"));
A(html.includes('app.js?v='));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const E=tag=>data.events.find(e=>e.id==='E18C-T09-'+tag);
A(E('1712-APR-PEACE-BREACH-CAPTIVES').description.includes('议和'));
A(E('1713-MAR23-NEOHEROKA-BURNING').description.includes('558'));
A(E('1715-APR15-YAMASEE-RISING').research_original_record_ids.length===1);
A(E('1716-SC-GOVERNMENT-TRADE-MONOPOLY').research_original_record_ids.length===1);
A(E('1723-NC-FREED-PERSON-DEPORT').description.includes('六个月'));
A(E('1732-GEORGIA-CHARTER').lat===null);
A.deepEqual(E('1715-FEB11-COREE-PEACE').research_original_record_ids,['E18A2-TUS-FEBTREATY']);
A.match(E('1715-FEB11-COREE-PEACE').description,/科里人及其他交战者/);
A.equal(data.statistics.nooherooka_1713_reported_killed_or_captured_total,950);
A.equal(data.statistics.verified_british_killed_at_neoheroka_total,null);
console.log('PASS 21 research stories: T09 24 unique dated events/24 sections/72 paragraphs/35 sources/24 true Atlas links; 5 original groups, 9 registry keys, all 9 integrated; four modern city references, zero invented British polygons.');
