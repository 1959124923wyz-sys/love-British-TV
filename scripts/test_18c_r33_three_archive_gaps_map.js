#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const J=p=>JSON.parse(F.readFileSync(P.join(root,p),'utf8')),rd=p=>F.readFileSync(P.join(root,p),'utf8');
const d=J('data/stories/serial/chronology-preview-r33-three-archival-gaps-1761-1790.json');
const idx=J('data/stories/serial/preview-18c-index.json'),ui=rd('js/history-stories.js'),app=rd('app.js'),html=rd('index.html');
const led=J('research/continuity/18c-1126-coverage/R33_THREE_ORIGINAL_GROUPS_TRANSITIONS.json');
const cases=[
 {code:'AW',path:'data/stories/serial/e18-r33-awadh-bahu-begam-1765-1783.json',group:'E18-MRG-T14-07',arc:'T14',n:12,orig:['AB-R6-057-01','AB-R6-057-02']},
 {code:'CAL',path:'data/stories/serial/e18-r33-old-calabar-robin-johns-1766-1790.json',group:'E18-MRG-T02-02',arc:'T02',n:10,orig:['AB-R6-064-02']},
 {code:'MIK',path:'data/stories/serial/e18-r33-mikmaq-peace-treaties-1761.json',group:'E18-MRG-T07-06',arc:'T07',n:4,orig:['E18A5-ACD-1761-MIRAMICHI-TREATY','E18A5-ACD-1761-MUIS-TREATY']}
];
a.equal(d.schema,'atlas-18c-r33-three-original-gaps-v1');a.equal(idx.stories.length,34);
a.equal(d.events.length,26);a.equal(d.sources.length,24);
a.equal(d.places.length,0);a.equal(d.routes.length,0);a.equal(d.colonial_polygons.length,0);
a.equal(d.provenance.original_merge_groups,3);a.equal(d.provenance.original_candidate_ids,5);
a.equal(d.provenance.mapped_original_ids,5);a.equal(d.provenance.original_source_key_count,8);
a.equal(d.sources.filter(s=>s.original_registry_key).length,8);
a.equal(d.publication.actual_control_polygons_approved,0);
a.equal(led.records.length,26);a.equal(led.georeferenced_historic_control_polygons_approved,0);
a(led.records.every(x=>x.polygon_allowed===false&&x.territorial_control_verified===false&&x.area_sqkm===null));
const ids=new Set(d.events.map(e=>e.id)),ss=new Set(d.sources.map(s=>s.id));a.equal(ids.size,26);a.equal(ss.size,24);
let pins=0;const got=new Set();
for(const e of d.events){
 a(/^E18C-R33-(AW|CAL|MIK)-[A-Z0-9-]+$/.test(e.id),e.id);
 a(e.year>=1761&&e.year<=1790);
 a.equal(e.start_year,e.year);a.equal(e.end_year,e.year);
 a.equal(e.publication_status,'research_only');a.equal(e.historical_control_boundary_verified,false);
 a.equal(e.fill_authorized,false);a.equal(e.territorial_claim,false);
 a.equal(e.area_sqkm,null);a.equal(e.actual_English_land_area_sqkm,null);a.equal(e.colonial_profit,null);
 a.equal(e.position_is_historical_survey,false);a.equal(e.exclude_point_buffer_from_area_statistics,true);
 a(e.source_ids.length>0&&e.source_ids.every(s=>ss.has(s)));
 if(e.lat===null){a.equal(e.lng,null);a.equal(e.geo_precision,'not_geocoded');}
 else{pins++;a(Number.isFinite(e.lat)&&Number.isFinite(e.lng));a.equal(e.geo_precision,'modern_city_reference');}
 if(e.research_original_record_ids?.length){
  a.equal(e.research_original_record_ids.length,1);
  a(!got.has(e.research_original_record_ids[0]),e.id);got.add(e.research_original_record_ids[0]);
 }
}
a.equal(pins,7);a.equal(got.size,5);
let linkedTotal=0;
for(let i=0;i<cases.length;i++){
 const c=cases[i],raw=J('research/18c/consolidated/series/'+c.arc+'.json'),g=raw.groups.find(x=>x.id===c.group);
 const story=J(c.path),entry=idx.stories[31+i],sub=d.events.filter(e=>e.id.startsWith('E18C-R33-'+c.code+'-'));
 a(g&&g.original_candidate_count===c.orig.length);
 a.equal(story.id,entry.id);a.equal(story.sections.length,c.n);a.equal(sub.length,c.n);
 a.equal(story.publication_status,'research_only');a.equal(story.publication_approval,'not_submitted');
 const orig=g.candidate_subevents;
 a.deepEqual(new Set(orig.map(x=>x.original_id)),new Set(c.orig));
 const mapped=sub.filter(x=>x.research_original_record_ids.length);
 a.deepEqual(new Set(mapped.map(x=>x.research_original_record_ids[0])),new Set(c.orig));
 for(const e of mapped){
  const old=orig.find(x=>x.original_id===e.research_original_record_ids[0]);
  a(old&&old.year===e.year&&e.research_merge_group_id===g.id,e.id);
  for(const sk of old.source_keys)a(e.source_ids.includes('18CR33-'+sk.replace(':','-')),e.id);
 }
 let links=[];
 for(const s of story.sections){
  a.equal(s.paragraphs.length,3);
  a(s.source_keys.length&&s.source_keys.every(x=>ss.has(x)));
  for(const p of s.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   a(ids.has(m[1]),m[1]);links.push(m[1]);
  }
 }
 a.equal(links.length,c.n);a.equal(new Set(links).size,c.n);
 a.deepEqual(new Set(links),new Set(story.related_event_ids));
 a.deepEqual(new Set(links),new Set(entry.event_ids));
 linkedTotal+=links.length;
}
a.equal(linkedTotal,26);
const find=x=>d.events.find(e=>e.id==='E18C-R33-'+x);
a(find('AW-1775-QAULNAMA').description.includes('1775'));
a(find('AW-1781-ORDER-SEIZURE').description.includes('1782'));
a(find('AW-1782-JAN-PALACE').description.includes('1782年1月'));
a.equal(find('AW-1782-JAN-PALACE').lat,26.775486);
a(find('CAL-1767-OLD-CALABAR-MASSACRE').description.includes('300多'));
a.equal(find('CAL-1767-OLD-CALABAR-MASSACRE').lat,null);
a(find('MIK-1761-JUN25-MIRAMICHI').description.includes('6月25'));
a(find('MIK-1761-NOV9-FRANCIS-MUIS').description.includes('1812年'));
a.equal(d.statistics.verified_colonial_net_profit,null);
a(app.includes('r33OriginalResearchThreeStoriesReady=true'));
a(app.includes('chronology-preview-r33-three-archival-gaps-1761-1790.json'));
a(ui.includes('draft.stories?.length===34'));a(ui.includes('r33Dossiers'));
a(html.includes('18c33-gaps-20261112'));
a(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
console.log('PASS R33: 34 old/new stories, 3 original 1126-row groups, five original IDs eight preserved original keys, 26 events, 26 Chinese chapters 78 paragraphs 26 true map links 24 sources 7 modern city reference points 0 fabricated occupied polygons');
