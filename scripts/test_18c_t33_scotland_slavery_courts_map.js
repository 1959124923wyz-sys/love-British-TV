#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const d=J('data/stories/serial/chronology-preview-t33-scotland-slavery-courts-1707-1792.json');
const story=J('data/stories/serial/e18-t33-scotland-slavery-courts-1707-1792.json');
const ledger=J('research/continuity/1707-1792-scotland-slavery-courts/T33_ARCHIVAL_CAPITAL_FREEDOM_LEGAL_LEDGER.json');
const raw=J('research/18c/consolidated/series/T33.json');
const idx=J('data/stories/serial/preview-18c-index.json'),app=rd('app.js'),ui=rd('js/history-stories.js'),html=rd('index.html');
A.equal(raw.story_arc_id,'T33');A.equal(raw.groups.length,0);A.equal(raw.main_map_candidates,0);A.equal(raw.topic_mode_candidates,0);
A.equal(idx.stories.length,31);A.equal(idx.stories[30].id,story.id);A.equal(idx.stories[30].status,'research_preview');
A.equal(d.schema,'atlas-18c-t33-scotland-slavery-freedom-court-v1');A.equal(d.events.length,29);
A.equal(d.sources.length,21);A.equal(story.sections.length,29);
A.equal(d.provenance.original_merge_groups,0);A.equal(d.provenance.original_candidate_ids,0);A.equal(d.provenance.original_B_keys,0);A.equal(d.provenance.mapped_original_ids,0);
A.equal(d.sources.filter(x=>x.original_registry_key!==null).length,0);
A.equal(d.places.length,0);A.equal(d.routes.length,0);A.equal(d.colonial_polygons.length,0);
A.equal(d.publication.actual_control_polygons_approved,0);
const sourceIds=new Set(d.sources.map(x=>x.id)),ids=new Set(d.events.map(e=>e.id));
A.equal(sourceIds.size,21);A.equal(ids.size,29);
A(d.sources.every(x=>x.original_manuscript_personally_inspected===false&&/^https:\/\//.test(x.url)));
let pins=0;
for(const e of d.events){
 A(/^E18C-T33-[A-Z0-9-]+$/.test(e.id));
 A(e.year>=1707&&e.year<=1792);A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.fill_authorized,false);A.equal(e.territorial_claim,false);A.equal(e.area_sqkm,null);
 A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.colonial_profit,null);
 A.equal(e.exclude_point_buffer_from_area_statistics,true);A.equal(e.position_is_historical_survey,false);
 A.equal(e.research_merge_group_id,null);A.deepEqual(e.research_original_record_ids,[]);
 A(e.source_ids.length>=1&&e.source_ids.every(id=>sourceIds.has(id)));
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);A.equal(e.geo_precision,'not_geocoded');}
 else{pins++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng));A.equal(e.geo_precision,'modern_city_reference');}
}
A.equal(pins,17);A.equal(ledger.transitions.length,29);
A(ledger.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null&&x.territorial_control_verified===false&&!x.original_event_ids.length));
A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
const links=[];
for(const section of story.sections){
 A.equal(section.paragraphs.length,3);
 A(section.source_keys.length&&section.source_keys.every(k=>sourceIds.has(k)));
 for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  A(ids.has(m[1]),m[1]);links.push(m[1]);
 }
}
A.equal(links.length,29);A.equal(new Set(links).size,29);
A.deepEqual(new Set(links),new Set(story.related_event_ids));
A.deepEqual(new Set(links),new Set(idx.stories[30].event_ids));
A(app.includes("fetch('data/stories/serial/chronology-preview-t33-scotland-slavery-courts-1707-1792.json'"));
A(app.includes('t33ScottishFreedom31Ready=true'));A(ui.includes('draft.stories?.length===31'));
A(ui.includes('t33ScottishFreedomContinuation'));A(html.includes('18c31-t33-20261111'));
A(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
const E=k=>d.events.find(e=>e.id==='E18C-T33-'+k);
A(E('1727-HORSEBURGH-BOGLE').description.includes('70余项'));
A(E('1731-GLASGOW-LETTER').description.includes('1731年5月'));
A(E('1750-MONTGOMERY-SALE').description.includes('1750年3月9'));
A(E('1756-APR21-JAMIE-ESCAPE').description.includes('4月21'));
A(E('1757-JAN4-CASE-NEVER-HEARD').description.includes('1月4'));
A(E('1769-SEP1-SPENS-BAPTISM').description.includes('9月1'));
A(E('1770-SPENS-RELEASE').description.includes('未裁决'));
A(E('1772-JUN22-SOMERSET').description.includes('6月22'));
A(E('1778-JAN15-KNIGHT-VERDICT').description.includes('10对4'));
A(E('1790-AUG6-GEORGE-DALE').description.includes('8月6'));
A(E('1792-APR-DUNDAS-GRADUAL').description.includes('gradually'));
A.equal(d.statistics.knight_1778_majority_judges,10);A.equal(d.statistics.knight_1778_minority_judges,4);
A.equal(d.statistics.original_T33_candidate_IDs,0);A.equal(d.statistics.slave_trade_abolition_royal_assent_year,1807);
A.equal(d.statistics.verified_business_profit,null);
console.log('PASS T33: 31 research stories, original T33 0 approved groups / 0 purported B keys, 29 archived and newly verified events, 29 Chinese chapters 87 paragraphs 29 Atlas links, 21 accessible authority sources, 17 modern city-only anchors, 0 fictitious slave capital profits or occupied polygons');
