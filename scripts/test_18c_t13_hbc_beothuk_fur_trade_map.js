#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const read=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(read(p));
const d=J('data/stories/serial/chronology-preview-t13-hbc-beothuk-dene-1700-1792.json');
const story=J('data/stories/serial/e18-t13-hbc-beothuk-dene-cree-1700-1792.json');
const geo=J('research/continuity/1700-1792-hudson-bay/BRITISH_HBC_BEOTHUK_DENE_CREE_FUR_TRADE_TRANSITIONS.json');
const raw=J('research/18c/consolidated/series/T13.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html'),css=read('css/history-stories.css');
const cross=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,27);A.equal(idx.stories[24].id,story.id);A.equal(idx.stories[24].status,'research_preview');
A.equal(d.schema,'atlas-18c-t13-hbc-beothuk-dene-cree-fur-trade-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,29);A.equal(d.sources.length,39);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('A:')).length,11);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('C:')).length,2);
A.equal(d.provenance.original_merge_groups,7);A.equal(d.provenance.original_candidate_ids,10);
A.equal(d.provenance.original_A_keys,11);A.equal(d.provenance.original_C_keys,2);
A.equal(d.provenance.mapped_original_ids,10);
A.equal(raw.groups.length,7);
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const ids=new Set(d.events.map(e=>e.id)),srces=new Set(d.sources.map(x=>x.id));
A.equal(ids.size,29);A.equal(srces.size,39);
A(d.sources.every(x=>x.url.startsWith('https://')&&!x.original_manuscript_personally_inspected));
const originals=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(e=>[e.original_id,{year:e.year,group:g.id,keys:e.source_keys}])));
A.equal(originals.size,10);
const used=new Set;let pins=0;for(const e of d.events){
 A(/^E18C-T13-[A-Z0-9-]+$/.test(e.id)&&e.year>=1700&&e.year<=1792);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);
 A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.area_sqkm,null);
 A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length&&e.source_ids.every(x=>srces.has(x)),e.id+' missing source');
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const id of e.research_original_record_ids){
  const o=originals.get(id);A(o&&o.group===e.research_merge_group_id&&o.year===e.year,id+' bad original group/year');
  A(!used.has(id),id+' repeated');used.add(id);
  A(cross.includes('\n'+id+','),id+' missing 1126 original crosswalk');
 }
}
A.equal(used.size,10);A.equal(pins,7);
A.deepEqual(new Set(d.events.find(x=>x.id==='E18C-T13-1713-UTRECHT-HBC-CLAIMS').research_original_record_ids),new Set(['C-C27-001','E18A-1713-C27-01']));
A.equal(d.events.filter(x=>x.research_original_record_ids.length===2).length,1);
A.equal(story.sections.length,29);A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
let links=[];for(const sec of story.sections){
 A.equal(sec.paragraphs.length,3);
 A(sec.source_keys.length&&sec.source_keys.every(x=>srces.has(x)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(ids.has(m[1]));links.push(m[1]);}
}
A.equal(links.length,29);A.equal(new Set(links).size,29);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[24].event_ids));
A.equal(geo.transitions.length,29);
A(geo.transitions.every(e=>e.polygon_allowed===false&&e.area_sqkm===null&&e.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t13-hbc-beothuk-dene-1700-1792.json'"));
A(app.includes('t13Hudson25Ready=true'));A(reader.includes('draft.stories?.length===27'));
A(reader.includes("storyMeta.has('E18-T13-HBC-NEWFOUNDLAND-BEOTHUK-DENE-CREE-1700-1792')"));
A(html.includes('18c25-t13-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const E=k=>d.events.find(x=>x.id==='E18C-T13-'+k);
A(E('1700-MAR25-NEWFOUNDLAND-LAW').description.includes('3月25日'));
A(E('1715-DENE-CREE-PEACE-MISSION').description.includes('Thanadelthur'));
A(E('1771-BLOODY-FALLS-INUIT').description.includes('Inuit'));
A(E('1782-AUG9-PRINCE-SURRENDER').description.includes('39'));
A(E('1782-AUG24-YORK-SURRENDER').description.includes('8月24日'));
A.equal(d.statistics.historically_verified_HBC_actual_control_area_sqkm,null);
A.equal(d.statistics.Inuit_bloody_falls_1771_deaths_verified,null);
A.equal(d.statistics.British_colonial_beothuk_dead_total_verified,null);
A.equal(d.statistics.La_Perouse_1782_york_surrender_day,'1782-08-24');
console.log('PASS 25 stories: T13 seven predecessor groups, ten original IDs, eleven A and two C keys; 29 year-dated archive-backed events, 39 source entries, 29 chapters/87 paragraphs, 29 inline Atlas links, seven city references, zero fictional historical territorial polygons.');
