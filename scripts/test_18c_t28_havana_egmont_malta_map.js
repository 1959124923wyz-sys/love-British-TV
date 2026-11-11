#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t28-havana-egmont-malta-1762-1799.json');
const story=J('data/stories/serial/e18-t28-havana-egmont-malta-1762-1799.json');
const ledger=J('research/continuity/1762-1799-havana-falklands-malta/T28_SHORT_OCCUPATIONS_MULTIACTOR_TRANSITIONS.json');
const raw=J('research/18c/consolidated/series/T28.json');
const idx=J('data/stories/serial/preview-18c-index.json'),app=rd('app.js'),ui=rd('js/history-stories.js'),html=rd('index.html');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,30);A.equal(idx.stories[29].id,story.id);A.equal(idx.stories[29].status,'research_preview');
A.equal(raw.groups.length,2);A.equal(d.schema,'atlas-18c-t28-havana-egmont-malta-v1');
A.equal(d.events.length,33);A.equal(d.sources.length,24);A.equal(story.sections.length,33);
A.equal(d.provenance.original_merge_groups,2);A.equal(d.provenance.original_candidate_ids,4);
A.equal(d.provenance.original_B_keys,4);A.equal(d.provenance.mapped_original_ids,4);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('B:')).length,4);
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const old=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{...c,group:g.id}])));
A.equal(old.size,4);
const originalKeys=new Set([...old.values()].flatMap(x=>x.source_keys));A.equal(originalKeys.size,4);
const sourceIds=new Set(d.sources.map(s=>s.id)),ids=new Set(d.events.map(e=>e.id));
A.equal(sourceIds.size,24);A.equal(ids.size,33);
for(const k of originalKeys)A(sourceIds.has('18CT28-'+k.replace(':','-')),k);
let pins=0;const mapped=new Set();
for(const e of d.events){
 A(/^E18C-T28-[A-Z0-9-]+$/.test(e.id),e.id);
 A(e.year>=1762&&e.year<=1799);A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);A.equal(e.fill_authorized,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.territorial_claim,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);A.equal(e.position_is_historical_survey,false);
 A(e.source_ids.length&&e.source_ids.every(id=>sourceIds.has(id)),e.id);
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng));A.equal(e.geo_precision,'modern_city_reference');}
 for(const oldId of e.research_original_record_ids){
  const o=old.get(oldId);
  A(o&&o.year===e.year&&o.group===e.research_merge_group_id,oldId);
  A(!mapped.has(oldId));mapped.add(oldId);
  A(cross.includes('\n'+oldId+','),oldId+' not among original 1126 records');
  for(const k of o.source_keys)A(e.source_ids.includes('18CT28-'+k.replace(':','-')));
 }
}
A.equal(pins,20);A.equal(mapped.size,4);
A.equal(story.publication_approval,'not_submitted');A.equal(story.publication_status,'research_only');
A.equal(ledger.transitions.length,33);
A(ledger.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
const links=[];
for(const sec of story.sections){
 A.equal(sec.paragraphs.length,3);
 A(sec.source_keys.length&&sec.source_keys.every(k=>sourceIds.has(k)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  A(ids.has(m[1]),m[1]);links.push(m[1]);
 }
}
A.equal(links.length,33);A.equal(new Set(links).size,33);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[29].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-t28-havana-egmont-malta-1762-1799.json'"));
A(app.includes('t28HavanaMalta30Ready=true'));A(ui.includes('draft.stories?.length===30'));
A(ui.includes('t28HavanaMaltaContinuation'));A(html.includes('18c30-t28-20261111'));
A(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
const E=key=>d.events.find(e=>e.id==='E18C-T28-'+key);
A(E('1762-JUL30-MORRO').description.includes('7月30'));
A(E('1762-ENSLAVED-LABOUR').description.includes('2400'));
A(E('1762-SPANISH-FLEET-SEIZED').description.includes('缴获'));
A(E('1763-HAVANA-RETURN').description.includes('11个月'));
A(E('1770-JUN10-EGMONT-CAPTURE').description.includes('6月10'));
A.equal(E('1770-JUN10-EGMONT-CAPTURE').lat,null);
A(E('1771-JAN22-DECLARATIONS').description.includes('保留'));
A(E('1774-BRITISH-LEAVE').description.includes('撤出'));
A(E('1798-SEP2-REVOLT').description.includes('9月2'));
A(E('1799-BALL-NEAPOLITAN').description.includes('那不勒斯'));
A(E('1799-FRENCH-VALLETTA-HOLDS').description.includes('1800'));
A.equal(d.statistics.havana_1762_enslaved_labor_estimate_secondary,2400);
A.equal(d.statistics.port_egmont_british_garrison_after_1774,false);
A.equal(d.statistics.malta_1799_french_garrison_active,true);
A.equal(d.statistics.verified_net_colonial_spoils,null);
console.log('PASS T28: 30 inherited research topics, 2 T28 original groups, 4 original IDs/4 B keys, 33 year-dated events and 33 chapters/99 paragraphs/33 map links, 24 sources, 20 modern city reference points, zero British territorial polygons');
