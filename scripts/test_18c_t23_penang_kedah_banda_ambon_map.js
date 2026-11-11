#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t23-penang-kedah-moluccas-1768-1796.json');
const story=J('data/stories/serial/e18-t23-penang-kedah-andaman-ambon-banda-1768-1796.json');
const led=J('research/continuity/1768-1796-penang-moluccas-andaman/T23_KEDAH_SULU_MOLUCCAS_INDIGENOUS_TRANSITIONS.json');
const original=J('research/18c/consolidated/series/T23.json');
const idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,31);A.equal(idx.stories[28].id,story.id);
A.equal(idx.stories[28].status,'research_preview');
A.equal(original.groups.length,5);A.equal(d.schema,'atlas-18c-t23-eic-penang-moluccas-indigenous-v1');
A.equal(d.editorial_status,'research_preview_not_published');A.equal(d.events.length,36);
A.equal(story.sections.length,36);A.equal(d.sources.length,36);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('B:')).length,13);
A.equal(d.provenance.original_merge_groups,5);A.equal(d.provenance.original_candidate_ids,12);
A.equal(d.provenance.original_B_keys,13);A.equal(d.provenance.mapped_original_ids,12);
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const orig=new Map(original.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{...c,group:g.id}])));
A.equal(orig.size,12);const bkeys=new Set([...orig.values()].flatMap(o=>o.source_keys));A.equal(bkeys.size,13);
const srces=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(x=>x.id));A.equal(srces.size,36);A.equal(ids.size,36);
const used=new Set();let pins=0;
for(const e of d.events){
 A(/^E18C-T23-[A-Z0-9-]+$/.test(e.id),e.id);
 A(e.year>=1768&&e.year<=1796);A.equal(e.start_year,e.year);A.equal(e.end_year,e.year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.position_is_historical_survey,false);A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(k=>srces.has(k)),e.id);
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng));A.equal(e.geo_precision,'modern_city_reference');A(e.representative_map_point);}
 for(const id of e.research_original_record_ids){
  const old=orig.get(id);A(old&&old.year===e.year&&old.group===e.research_merge_group_id,id);
  A(!used.has(id),id);used.add(id);A(cross.includes('\n'+id+','),id+' not in original crosswalk');
  for(const key of old.source_keys)A(e.source_ids.includes('18CT23-'+key.replace(':','-')));
 }
}
A.equal(used.size,12);A.equal(pins,27);
for(const key of bkeys)A(srces.has('18CT23-'+key.replace(':','-')));
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
A.equal(led.transitions.length,36);A(led.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const links=[];for(const sec of story.sections){
 A.equal(sec.paragraphs.length,3);A(sec.source_keys.length>0&&sec.source_keys.every(k=>srces.has(k)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(ids.has(m[1]));links.push(m[1]);}
}
A.equal(links.length,36);A.equal(new Set(links).size,36);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[28].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-t23-penang-kedah-moluccas-1768-1796.json'"));
A(app.includes('t23Penang29Ready=true'));
A(reader.includes('draft.stories?.length===31'));A(reader.includes('penangT23Continuation'));
A(html.includes('18c29-t23-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
const E=k=>d.events.find(e=>e.id==='E18C-T23-'+k);
A(E('1775-BALAMBANGAN-SULU').description.includes('苏禄'));
A(E('1786-AUG11-FLAG').description.includes('8月11日'));
A(E('1786-SULTAN-30000').description.includes('30,000'));
A(E('1786-NO-SIGNED-TREATY').description.includes('1786'));
A(E('1791-TREATY-ANNUITY').description.includes('6,000'));
A(E('1791-TREATY-FUGITIVES').description.includes('奴役'));
A(E('1789-PHOENIX-FRONTIER').lat===null);
A(E('1796-MAR9-BANDA-CAPITULATION').description.includes('3月9日'));
A(E('1796-AMBON-CLOVE-MONOPOLY').description.includes('专卖'));
A.equal(d.statistics.kedah_1786_requested_annual_spanish_dollars,30000);
A.equal(d.statistics.kedah_1791_contract_annual_spanish_dollars,6000);
A.equal(d.statistics.company_net_spice_profit_verified,null);
console.log('PASS T23 29 indexed topics: five original groups, twelve original IDs, thirteen B source keys, 36 year-dated events, 36 substantive Chinese chapters 108 paragraphs, 36 links, 36 sources, 27 modern place references, zero invented colonial boundaries');
