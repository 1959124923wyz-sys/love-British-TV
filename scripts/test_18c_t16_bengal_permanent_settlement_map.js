#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t16-permanent-settlement-1760-1799.json');
const story=J('data/stories/serial/e18-t16-bengal-permanent-settlement-adivasi-1760-1799.json');
const led=J('research/continuity/1760-1799-bengal-permanent-land-tax/T16_EIC_ADIVASI_PAIK_LAND_REVENUE_TRANSITIONS.json');
const raw=J('research/18c/consolidated/series/T16.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,29);A.equal(idx.stories[26].id,story.id);A.equal(idx.stories[26].status,'research_preview');
A.equal(d.schema,'atlas-18c-t16-permanent-settlement-adivasi-v1');
A.equal(d.editorial_status,'research_preview_not_published');
A.equal(d.events.length,29);A.equal(d.sources.length,29);
A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('B:')).length,10);
A.equal(d.provenance.original_merge_groups,6);A.equal(d.provenance.original_candidate_ids,8);
A.equal(d.provenance.original_B_keys,10);A.equal(d.provenance.mapped_original_ids,8);
A.equal(raw.groups.length,6);A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
A(d.sources.every(s=>s.url.startsWith('https://')&&!s.original_manuscript_personally_inspected));
const srces=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(x=>x.id));
A.equal(srces.size,29);A.equal(ids.size,29);
const old=new Map(raw.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{year:c.year,group:g.id,keys:c.source_keys}])));
A.equal(old.size,8);
let pins=0;const mapped=new Set;
for(const e of d.events){
 A(/^E18C-T16-[A-Z0-9-]+$/.test(e.id),e.id);
 A(e.year>=1760&&e.year<=1799);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');
 A.equal(e.historical_control_boundary_verified,false);A.equal(e.fill_authorized,false);
 A.equal(e.territorial_claim,false);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.area_sqkm,null);A.equal(e.position_is_historical_survey,false);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);
 A(e.source_ids.length&&e.source_ids.every(k=>srces.has(k)),'Unknown cited source '+e.id);
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point);}
 for(const id of e.research_original_record_ids){
  const x=old.get(id);A(x&&x.group===e.research_merge_group_id&&x.year===e.year,id);
  A(!mapped.has(id));mapped.add(id);
  A(cross.includes('\n'+id+','),id+' absent original source crosswalk');
  for(const key of x.keys)A(e.source_ids.includes('18CT16-'+key.replace(':','-')));
 }
}
A.equal(pins,11);A.equal(mapped.size,8);
A.equal(story.sections.length,29);A.equal(story.publication_status,'research_only');
A.equal(story.publication_approval,'not_submitted');
let links=[];for(const sec of story.sections){
 A.equal(sec.paragraphs.length,3);
 A(sec.source_keys.length&&sec.source_keys.every(k=>srces.has(k)));
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  A(ids.has(m[1]));links.push(m[1]);
 }
}
A.equal(links.length,29);A.equal(new Set(links).size,29);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[26].event_ids));
A.equal(led.transitions.length,29);A(led.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t16-permanent-settlement-1760-1799.json'"));
A(app.includes('t16Bengal27Ready=true'));A(reader.includes('draft.stories?.length===29'));
A(reader.includes("storyMeta.has('E18-T16-BENGAL-PERMANENT-SETTLEMENT-ADIVASI-PAIK-1760-1799')"));
A(html.includes('18c27-t16-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const E=k=>d.events.find(x=>x.id==='E18C-T16-'+k);
A(E('1762-BURDWAN-AUCTION').description.includes('1762'));
A(E('1773-BAIKUNTHPUR-REPORT').description.includes('2月15日'));
A(E('1793-MAR22-PROCLAMATION').description.includes('3月22日'));
A(E('1793-MAY1-REGULATION-I').description.includes('5月1日'));
A(E('1793-DROUGHT-NO-RELIEF').description.includes('旱灾'));
A(E('1793-ARREARS-ESTATE-SALE').description.includes('出售'));
A(E('1799-JAGIR-PAIK-REVOLT').description.includes('Adivasi'));
A.equal(d.statistics.Rajshahi_1770_71_assessed_rupees,2676000);
A.equal(d.statistics.Rajshahi_1770_71_collected_rupees,2146247);
A.equal(d.statistics.company_net_tax_profit_verified,null);
A.equal(d.statistics.territorial_area_sqkm_verified,null);
A.equal(d.statistics['1799_rebellion_killed_exact_verified'],null);
console.log('PASS 27 stories: T16 six original research groups, eight original candidate IDs, ten B keys; 29 year-dated events, 29 source records, 29 chapters 87 paragraphs 29 linked Atlas events, eleven modern reference points, zero unauthorized colonial polygons.');
