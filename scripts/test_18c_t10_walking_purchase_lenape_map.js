#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t10-walking-purchase-1734-1762.json');
const s=J('data/stories/serial/e18-t10-walking-purchase-lenape-lancaster-easton-1734-1762.json');
const geo=J('research/continuity/1734-1762-pennsylvania/BRITISH_WALKING_PURCHASE_LENAPE_LANCASTER_EASTON_TRANSITIONS.json');
const raw=J('research/18c/consolidated/series/T10.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,29);A.equal(idx.stories[22].id,s.id);A.equal(idx.stories[22].status,'research_preview');
A.equal(d.schema,'atlas-18c-t10-walking-purchase-lenape-land-fraud-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,29);A.equal(d.sources.length,29);
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('A:')).length,7);
A.equal(d.provenance.original_merge_groups,2);A.equal(d.provenance.original_candidate_ids,6);
A.equal(d.provenance.original_A_keys,7);A.equal(d.provenance.mapped_original_ids,6);
A.equal(raw.groups.length,2);A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const source=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(e=>e.id));
A.equal(ids.size,29);
const old=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{year:c.year,group:g.id,source_keys:c.source_keys}])));
A.equal(old.size,6);
let pins=0;const mapped=new Set;
for(const e of d.events){
 A(/^E18C-T10-[A-Z0-9-]+$/.test(e.id)&&e.year>=1734&&e.year<=1762);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);A.equal(e.fill_authorized,false);
 A.equal(e.territorial_claim,false);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.area_sqkm,null);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids?.length>0&&e.source_ids.every(z=>source.has(z)),e.id+' unknown source');
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const rid of e.research_original_record_ids){
  const o=old.get(rid);A(o&&o.group===e.research_merge_group_id&&o.year===e.year);
  A(!mapped.has(rid));mapped.add(rid);
  A(cross.includes('\n'+rid+','),'not in 1126 '+rid);
 }
}
A.equal(mapped.size,6);A.equal(pins,12);
A.equal(s.sections.length,29);A.equal(s.publication_status,'research_only');A.equal(s.publication_approval,'not_submitted');
let links=[];
for(const sec of s.sections){
 A.equal(sec.paragraphs.length,3);A(sec.source_keys.length&&sec.source_keys.every(k=>source.has(k)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(ids.has(m[1]));links.push(m[1]);}
}
A.equal(links.length,29);A.equal(new Set(links).size,29);
A.deepEqual(new Set(links),new Set(s.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[22].event_ids));
A.equal(geo.transitions.length,29);
A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t10-walking-purchase-1734-1762.json'"));
A(app.includes('t10Lenape23Ready=true'));A(reader.includes('draft.stories?.length===29'));
A(reader.includes("storyMeta.has('E18-T10-WALKING-PURCHASE-LENAPE-LANCASTER-EASTON-1734-1762')"));
A(html.includes('18c23-t10-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const lookup=x=>d.events.find(e=>e.id==='E18C-T10-'+x);
A(lookup('1737-AUG25-DEED').description.includes('8月25日')||lookup('1737-AUG25-DEED').description.includes('1737年8月25日')||lookup('1737-AUG25-DEED').description.includes('RG26第35号'));
A(lookup('1737-SEP19-RUN').description.includes('9月19日'));
A(lookup('1744-JUN30-GACHRADODOW').description.includes('英王'));
A(lookup('1756-NOV12-TEEDYUSCUNG').description.includes('11月12日'));
A.equal(d.statistics.historic_walking_purchase_exact_area_sqkm_verified,null);
A.equal(d.statistics.verified_actual_British_land_area_sqkm,null);
A.equal(d.statistics.verified_colonial_profit,null);
console.log('PASS T10 23-story: 2 original groups, 6 original IDs, 7 A source keys, 29 dated events, 29 sources, 29 chapters 87 paragraphs 29 true links, 12 modern city references and zero unreviewed colonial polygons.');
