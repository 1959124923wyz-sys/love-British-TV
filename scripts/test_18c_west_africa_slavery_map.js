#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),rd=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(rd(p));
const c=load('data/stories/serial/chronology-preview-west-africa-1727-1792.json');
const a=load('data/stories/serial/e18-t26-west-africa-slave-forts-1727-1792.json');
const idx=load('data/stories/serial/preview-18c-index.json');
const src=load('research/18c/consolidated/series/T26.json');
const geo=load('research/continuity/1727-1792-west-africa/BRITISH_SLAVE_FORTS_AFRICAN_STATES_CONTROL_TRANSITIONS.json');
const pub=load('data/stories/serial/index.json'),app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const csv=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
assert.equal(idx.stories.length,16);assert.equal(idx.stories[12].id,a.id);
assert.equal(a.id,'E18-T26-WEST-AFRICA-SLAVE-FORTS-1727-1792');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.deepEqual(a.predecessor_story_ids,['E6-T13','E6-T17-AFRICAN-FORTS']);
assert(pub.topics.some(x=>x.id==='E6-T13'&&x.status==='published'));
assert(pub.topics.some(x=>x.id==='E6-T17-AFRICAN-FORTS'&&x.status==='published'));
assert(reader.includes("['E6-T13','E6-T17-AFRICAN-FORTS','E6-T11-VOYAGES']"));
assert.equal(idx.stories[12].status,'research_preview');assert.equal(idx.stories[12].publication_review,'not_submitted');
assert(!pub.topics.some(s=>s.id===a.id&&s.status==='published'),'new article cannot be public');
assert.equal(c.schema,'atlas-18c-west-africa-slave-forts-trade-resistance-v1');
assert.equal(c.editorial_status,'research_preview_not_published');
assert.equal(c.events.length,17);assert.equal(c.sources.length,40);assert.equal(c.sources.filter(s=>s.original_registry_key?.startsWith('B:')).length,20);
assert.equal(c.sources.filter(s=>s.original_registry_key===null).length,20);
assert.equal(c.places.length,0);assert.equal(c.routes.length,0);assert.equal(c.colonial_polygons.length,0);
assert.equal(c.publication.actual_control_polygons_approved,0);
assert.equal(a.sections.length,20);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),60);
assert.equal(new Set(c.sources.map(s=>s.id)).size,40);
assert.deepEqual(new Set(c.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(c.sources.every(s=>/^https:\/\//.test(s.url)&&s.original_manuscript_personally_inspected===false));
assert.equal(src.story_arc_id,'T26');assert.equal(src.groups.length,7);
assert.equal(src.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),13);
assert.equal(geo.schema,'atlas-18c-west-africa-multi-actor-slave-forts-transitions-v1');
assert.equal(geo.transitions.length,17);assert(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
const originalByID=new Map(src.groups.flatMap(g=>g.candidate_subevents.map(child=>[child.original_id,{group:g,child}])));
const originals=new Set,sourceIDs=new Set(c.sources.map(x=>x.id)),byEvent=new Map,links=[];
let mapped=0,supplement=0,points=0;
for(const e of c.events){
 assert(/^E18C-WAF-[A-Z0-9-]+$/.test(e.id)&&!byEvent.has(e.id),'unique ID '+e.id);byEvent.set(e.id,e);
 assert(e.year>=1727&&e.year<=1792&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.area_sqkm,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);
 assert.equal(e.position_is_historical_survey,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>sourceIDs.has(id)),'source '+e.id);
 if(e.research_merge_group_id){
  mapped++;assert(e.research_original_record_ids.length>0);
  for(const id of e.research_original_record_ids){
   assert(!originals.has(id),'duplicate original '+id);originals.add(id);
   assert(csv.includes('\n'+id+','),'missing archive crosswalk '+id);
   const z=originalByID.get(id);assert(z&&z.group.id===e.research_merge_group_id&&z.child.year===e.year,'incorrect original mapping '+id);
  }
  assert.equal(e.research_provenance_kind,'direct_editor15_T26_merged_child');
 }else{
  supplement++;assert.deepEqual(e.research_original_record_ids,[]);
  assert.equal(e.research_provenance_kind,'new_official_or_scholarly_supplement_without_original_id');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{points++;assert(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(originals.size,13);assert.equal(mapped,12);assert.equal(supplement,5);assert.equal(points,10);
assert.deepEqual(originals,new Set(src.groups.flatMap(x=>x.original_candidate_ids)));
const get=x=>byEvent.get('E18C-WAF-'+x);
assert.equal(get('1727-DAHOMEY-HUEDA').control_state,'Dahomey independent conquest, not British sovereignty');
assert.equal(get('1779-SAINT-LOUIS-RECAPTURE').control_state,'French retake Saint-Louis; British occupation ended');
assert.equal(get('1779-JAMES-ISLAND-DESTRUCTION').lat,13.317642);
assert.equal(get('1783-JAMES-FORT-RIGHTS').control_state,'Treaty right, no evidence of rebuilt fort occupation');
assert.equal(get('1788-DOLBEN-SHIP-LIMITS').lat,null);
assert.equal(get('1757-ANOMABO-PRISON').lat,5.174119);
assert.equal(get('1752-CASTLE-SLAVES-TRANSFER').lat,5.103524);
assert.equal(c.statistics.verified_british_slaving_profit,null);
assert.equal(c.statistics.verified_1700s_slaves_died_in_forts,null);
for(const sec of a.sections){
 assert.equal(sec.paragraphs.length,3);
 assert(sec.source_keys.length>0&&sec.source_keys.every(id=>sourceIDs.has(id)));
 for(const para of sec.paragraphs)for(const m of para.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  assert(byEvent.has(m[1]),'nonexistent map event '+m[1]);links.push(m[1]);
 }
}
assert.equal(links.length,17);assert.equal(new Set(links).size,17);
assert.deepEqual(new Set(links),new Set(a.related_event_ids));
assert.deepEqual(new Set(links),new Set(idx.stories[12].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-west-africa-1727-1792.json'"));
assert(app.includes('westafrica18cReady=true'));
assert(reader.includes('draft.stories?.length===16'));
assert(reader.includes("storyMeta.has('E18-T26-WEST-AFRICA-SLAVE-FORTS-1727-1792')"));
assert(html.includes('18c13-westafrica-20261110'));
assert(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
assert(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T26 West Africa 17 year events, 20 sections, 60 paragraphs, 17 true map links, 40 sources incl 20 preserved B keys and 13 archived IDs, 10 modern site points, zero invented colonial polygons, 12 previous topics and no floating reader toolbar.');
