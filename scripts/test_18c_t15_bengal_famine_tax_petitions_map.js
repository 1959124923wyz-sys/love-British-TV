#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t15-bengal-famine-tax-1770-1772.json');
const s=J('data/stories/serial/e18-t15-bengal-famine-tax-peasant-resistance-1770-1772.json');
const geo=J('research/continuity/1770-1772-bengal-famine/COMPANY_TAX_GRAIN_AND_PEASANT_PETITIONS.json');
const raw=J('research/18c/consolidated/series/T15.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,30);A.equal(idx.stories[25].id,s.id);A.equal(idx.stories[25].status,'research_preview');
A.equal(d.schema,'atlas-18c-t15-bengal-famine-original-letters-v1');A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,26);A.equal(d.sources.length,22);
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,7);
A.equal(d.provenance.original_merge_groups,1);A.equal(d.provenance.original_candidate_ids,9);
A.equal(d.provenance.original_B_keys,7);A.equal(d.provenance.mapped_original_ids,9);
A.equal(raw.groups.length,1);A.equal(d.places.length,0);A.equal(d.routes.length,0);
A.equal(d.colonial_polygons.length,0);A.equal(d.publication.actual_control_polygons_approved,0);
A(d.sources.every(x=>x.url.startsWith('https://')&&!x.original_manuscript_personally_inspected));
const srces=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(x=>x.id));
A.equal(srces.size,22);A.equal(ids.size,26);
const old=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{year:c.year,group:g.id,keys:c.source_keys}])));
A.equal(old.size,9);let pins=0;const mapped=new Set;
for(const e of d.events){
 A(/^E18C-T15-[A-Z0-9-]+$/.test(e.id)&&e.year>=1770&&e.year<=1772);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);
 A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.area_sqkm,null);
 A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids?.length>0&&e.source_ids.every(x=>srces.has(x)),e.id+' unknown source');
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const id of e.research_original_record_ids){
  const x=old.get(id);A(x&&x.group===e.research_merge_group_id&&x.year===e.year);
  A(!mapped.has(id));mapped.add(id);A(cross.includes('\n'+id+','),id+' not in 1126 source crosswalk');
 }
}
A.equal(pins,11);A.equal(mapped.size,9);
A.equal(s.sections.length,26);A.equal(s.publication_status,'research_only');A.equal(s.publication_approval,'not_submitted');
let links=[];for(const sec of s.sections){
 A.equal(sec.paragraphs.length,3);A(sec.source_keys.length>0&&sec.source_keys.every(x=>srces.has(x)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(ids.has(m[1]));links.push(m[1]);}
}
A.equal(links.length,26);A.equal(new Set(links).size,26);
A.deepEqual(new Set(links),new Set(s.related_event_ids));A.deepEqual(new Set(links),new Set(idx.stories[25].event_ids));
A.equal(geo.transitions.length,26);
A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t15-bengal-famine-tax-1770-1772.json'"));
A(app.includes('t15Famine26Ready=true'));A(reader.includes('draft.stories?.length===30'));
A(reader.includes("storyMeta.has('E18-T15-BENGAL-FAMINE-TAX-PEASANT-PETITIONS-1770-1772')"));
A(html.includes('18c26-t15-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const E=k=>d.events.find(x=>x.id==='E18C-T15-'+k);
A(E('1770-APR24-PYKES').description.includes('4月24日'));
A(E('1770-MAY23-SUJAN').description.includes('三万'));
A(E('1771-AUG28-SEED').description.includes('8月28日'));
A(E('1772-AUG5-PEASANTS').description.includes('8月5日'));
A(E('1772-AUG24-DUCAREL').description.includes('8月24日'));
A.equal(d.statistics.verified_Bengal_famine_total_deaths,null);
A.equal(d.statistics.company_net_tax_transfer_rupees_verified,null);
A.equal(d.statistics.company_actual_territorial_control_sqkm_verified,null);
console.log('PASS T15 26 stories: nine original B candidate IDs, seven B source keys, 26 year-dated primary archival events, 22 registered sources, 26 chapters 78 paragraphs 26 Atlas links, eleven modern city references, zero invented British colonial polygons.');
