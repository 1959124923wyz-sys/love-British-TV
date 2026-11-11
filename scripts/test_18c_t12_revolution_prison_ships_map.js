#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t12-revolution-black-freedom-1764-1796.json');
const story=J('data/stories/serial/e18-t12-revolution-prison-ships-black-loyalists-1764-1796.json');
const geo=J('research/continuity/1764-1796-north-america/BRITISH_REPRESSION_BLACK_FREEDOM_PRISON_SHIPS_TRANSITIONS.json');
const old=J('research/18c/consolidated/series/T12.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,29);A.equal(idx.stories[23].id,story.id);A.equal(idx.stories[23].status,'research_preview');
A.equal(d.schema,'atlas-18c-t12-revolution-prison-ships-black-freedom-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,35);A.equal(d.sources.length,47);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('A:')).length,17);
A.equal(d.provenance.original_merge_groups,7);A.equal(d.provenance.original_candidate_ids,11);
A.equal(d.provenance.original_A_keys,17);A.equal(d.provenance.mapped_original_ids,11);
A.equal(old.groups.length,7);
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const source=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(x=>x.id));
A.equal(ids.size,35);A(d.sources.every(s=>s.url.startsWith('https://')&&!s.original_manuscript_personally_inspected));
const orig=new Map(old.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{year:c.year,group:g.id,keys:c.source_keys}])));
A.equal(orig.size,11);let pins=0;const mapped=new Set;
for(const e of d.events){
 A(/^E18C-T12-[A-Z0-9-]+$/.test(e.id)&&e.year>=1764&&e.year<=1796);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);
 A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.area_sqkm,null);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length&&e.source_ids.every(k=>source.has(k)),e.id+' source not registered');
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const id of e.research_original_record_ids){
  const o=orig.get(id);A(o&&o.group===e.research_merge_group_id&&o.year===e.year);
  A(!mapped.has(id));mapped.add(id);
  A(cross.includes('\n'+id+','),'absent original 1126 crosswalk '+id);
 }
}
A.equal(mapped.size,11);A.equal(pins,17);
A.equal(d.events.filter(x=>x.research_original_record_ids.length===2).length,1);
A.deepEqual(new Set(d.events.find(x=>x.id==='E18C-T12-1775-DUNMORE').research_original_record_ids),new Set(['E18A-1775-C17-02','E18A5-DUNMORE-1775-NOV7-EDICT']));
A.equal(story.sections.length,35);A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
let links=[];
for(const sec of story.sections){
 A.equal(sec.paragraphs.length,3);A(sec.source_keys.length&&sec.source_keys.every(s=>source.has(s)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(ids.has(m[1]));links.push(m[1]);}
}
A.equal(links.length,35);A.equal(new Set(links).size,35);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[23].event_ids));
A.equal(geo.transitions.length,35);
A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t12-revolution-black-freedom-1764-1796.json'"));
A(app.includes('t12Revolution24Ready=true'));A(reader.includes('draft.stories?.length===29'));
A(reader.includes("storyMeta.has('E18-T12-REVOLUTION-PRISON-SHIPS-BLACK-FREEDOM-1764-1796')"));
A(html.includes('18c24-t12-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const E=tag=>d.events.find(e=>e.id==='E18C-T12-'+tag);
A(E('1770-MASSACRE').description.includes('五')||E('1770-MASSACRE').description.includes('两人伤重'));
A(E('1776-WHITBY').description.includes('10月20日'));
A(E('1783-JUL24-CHILDREN').description.includes('Peter'));
A(E('1783-AUG2-BETTY').description.includes('Betty'));
A(E('1793-COOLEY').description.includes('3月'));
A.equal(d.statistics.Boston_1770_British_gunfire_killed,5);
A.equal(d.statistics.British_prison_ship_total_killed_verified,null);
A.equal(d.statistics.Chloe_1793_day_verified,null);
A.equal(d.statistics.historical_British_control_area_sqkm_verified,null);
console.log('PASS 24 topics: T12 7 original research groups 11 IDs 17 A keys, 35 dated events 47 sources, 35 chapters 105 paragraphs 35 Atlas inline links, 17 modern city references and zero fabricated colonial polygons.');
