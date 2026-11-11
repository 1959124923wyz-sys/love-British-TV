#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t20-eic-parliament-loan-monopoly-1702-1793.json');
const s=J('data/stories/serial/e18-t20-eic-parliament-loan-monopoly-1702-1793.json');
const ledger=J('research/continuity/1702-1793-eic-state-parliament/T20_EIC_PARLIAMENT_LOANS_TRADE_RIGHTS_TRANSITIONS.json');
const raw=J('research/18c/consolidated/series/T20.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,28);A.equal(idx.stories[27].id,s.id);A.equal(idx.stories[27].status,'research_preview');
A.equal(d.schema,'atlas-18c-t20-eic-parliament-finance-monopoly-v1');
A.equal(d.editorial_status,'research_preview_not_published');A.equal(d.events.length,29);A.equal(s.sections.length,29);
A.equal(d.provenance.original_merge_groups,4);A.equal(d.provenance.original_candidate_ids,9);
A.equal(d.provenance.original_B_keys,9);A.equal(d.provenance.mapped_original_ids,9);
A.equal(raw.groups.length,4);A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const orig=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{...c,group:g.id}])));
A.equal(orig.size,9);
const keys=new Set([...orig.values()].flatMap(x=>x.source_keys));A.equal(keys.size,9);
const srces=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(x=>x.id));
A.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,9);
A.equal(srces.size,d.sources.length);A.equal(ids.size,29);
for(const key of keys)A(srces.has('18CT20-'+key.replace(':','-')),key);
const seen=new Set();let pins=0;
for(const e of d.events){
 A(/^E18C-T20-[A-Z0-9-]+$/.test(e.id),e.id);
 A(e.year>=1702&&e.year<=1793);A.equal(e.start_year,e.year);A.equal(e.end_year,e.year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);
 A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.area_sqkm,null);
 A.equal(e.position_is_historical_survey,false);A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length>0&&e.source_ids.every(id=>srces.has(id)),e.id);
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.geo_precision==='modern_city_reference');}
 for(const id of e.research_original_record_ids){
  const o=orig.get(id);A(o&&o.group===e.research_merge_group_id&&o.year===e.year,id);
  A(!seen.has(id),id);seen.add(id);
  A(cross.includes('\n'+id+','),id+' missing from 1126 original crosswalk');
  for(const key of o.source_keys)A(e.source_ids.includes('18CT20-'+key.replace(':','-')));
 }
}
A.equal(seen.size,9);A(pins>=20&&pins<29);
A.equal(s.publication_status,'research_only');A.equal(s.publication_approval,'not_submitted');
A.equal(ledger.transitions.length,29);
A(ledger.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
let links=[];
for(const sec of s.sections){
 A.equal(sec.paragraphs.length,3);A(sec.source_keys.length>0&&sec.source_keys.every(x=>srces.has(x)));
 for(const para of sec.paragraphs)for(const match of para.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  A(ids.has(match[1]),match[1]);links.push(match[1]);
 }
}
A.equal(links.length,29);A.equal(new Set(links).size,29);
A.deepEqual(new Set(links),new Set(s.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[27].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-t20-eic-parliament-loan-monopoly-1702-1793.json'"));
A(app.includes('t20Eic28Ready=true'));
A(reader.includes('draft.stories?.length===28')&&reader.includes('eicParliament28Continuation'));
A(html.includes('18c28-t20-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
const E=k=>d.events.find(e=>e.id==='E18C-T20-'+k);
A(E('1709-MAY7').description.includes('5月7日'));
A(E('1748-PEPPER').description.includes('1748'));
A(E('1767-PAYMENT').description.includes('40万'));
A(E('1772-CRISIS').description.includes('1772'));
A(E('1773-LOAN').description.includes('140万'));
A(E('1773-REGULATING').description.includes('四人'));
A(E('1784-INDIA-ACT').description.includes('六人'));
A(E('1793-CHARTER').description.includes('1793'));
A.equal(d.statistics.government_loan_1773_pounds,1400000);
A.equal(d.statistics.payment_1767_annual_pounds,400000);
A.equal(d.statistics.payment_1773_biennial_pounds,40000);
A.equal(d.statistics.company_net_colonial_profit_verified,null);
console.log('PASS T20: 28 indexed research stories, 29 events, 29 sections and inline Atlas links, '+d.sources.length+' sources, nine original B IDs and keys, '+pins+' modern-city reference points, 0 invented occupied polygons');
