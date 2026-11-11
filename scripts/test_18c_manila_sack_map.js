#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-manila-1700-1799.json'),
 a=load('data/stories/serial/e18-t22-manila-invasion-sack-ransom-1762-1764.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T22.json'),
 actors=load('research/continuity/1762-1764-manila/BRITISH_SACK_RANSOM_CONTROL_RESEARCH.json'),
 chapters=load('data/chapters.json'),pub=load('data/stories/serial/index.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),css=read('css/history-stories.css'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,29);assert.equal(idx.stories[10].id,a.id);
assert.equal(a.id,'E18-T22-MANILA-INVASION-SACK-RANSOM-1762-1764');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[10].status,'research_preview');
assert.equal(idx.stories[10].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.deepEqual(a.predecessor_story_ids,['E6-T12']);
assert.equal(a.sections.length,18);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),54);
assert.equal(d.schema,'atlas-18c-manila-sack-ransom-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,16);assert.equal(d.sources.length,15);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,4);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,11);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T22');assert.equal(t.groups.length,1);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),4);
assert.equal(actors.schema,'atlas-18c-manila-occupation-and-looting-actor-transitions-v1');
assert.equal(actors.transitions.length,10);
assert(actors.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
const map=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)),seen=new Map();
let mapped=0,supplement=0,pointCount=0;const originals=new Set();
for(const e of d.events){
 assert(/^E18C-MNL-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id));
 seen.set(e.id,e);
 assert(e.year>=1762&&e.year<=1764&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.area_sqkm,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.fill_authorized,false);assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>src.has(id)),e.id+' source IDs');
 assert(Array.isArray(e.research_original_record_ids));
 if(e.research_merge_group_id!==null){
   mapped++;assert(e.research_original_record_ids.length>0);
   for(const id of e.research_original_record_ids){
     assert(!originals.has(id),'Duplicate original '+id); originals.add(id);
     assert(crosswalk.includes('\n'+id+','),'Original crosswalk 1126 missing '+id);
     const g=map.get(id);assert(g&&g.id===e.research_merge_group_id);
     assert(g.source_years.includes(e.year),'Merged group year mismatch '+id);
   }
   assert.equal(e.research_provenance_kind,'direct_editor15_T22_merged_child');
 }else{
   supplement++;assert.equal(e.research_original_record_ids.length,0);
   assert.equal(e.research_provenance_kind,'editor17_verified_public_record_supplement_no_fake_original_id');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{
   pointCount++;assert(e.representative_map_point);
   assert.deepEqual([e.lat,e.lng],[14.591389,120.973611],'Only UNESCO named city centre allowed');
 }
}
assert.equal(originals.size,4);assert.equal(mapped,4);assert.equal(supplement,12);assert.equal(pointCount,5);
const by=s=>seen.get('E18C-MNL-'+s);
assert.equal(by('1762-MANILA-STORM-RANSOM').research_original_record_ids[0],'AB-E01-002');
assert.equal(by('1762-ANDA-LUZON-RESISTANCE').lat,null);
assert.equal(by('1762-ANDA-LUZON-RESISTANCE').research_original_record_ids[0],'AB-E01-003');
assert.equal(by('1763-BANK-MANILA-RANSOM').research_original_record_ids[0],'AB-E01-005');
assert.equal(by('1764-BRITISH-WITHDRAWAL').research_original_record_ids[0],'AB-E01-004');
assert.equal(by('1762-SANTISIMA-TRINIDAD-PRIZE').lat,null);
assert.equal(by('1762-SACK-PRIVATE-HOUSES').year,1762);
assert.equal(d.historical_sums.ransom_demand_spanish_dollars,4000000);
assert.equal(d.historical_sums.contested_spanish_treasury_draft_spanish_dollars,2000000);
assert.equal(d.historical_sums.ransom_total_received,null);
assert.equal(d.historical_sums.actual_colonial_profit,null);
assert(a.quantitative_claims.some(q=>q.value.includes('400万')));
const linked=[];
for(const s of a.sections){
 assert.equal(s.paragraphs.length,3);
 assert(s.source_keys.length>0&&s.source_keys.every(id=>src.has(id)));
 for(const par of s.paragraphs)
  for(const m of par.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(seen.has(m[1]),'Unregistered inline Atlas link '+m[1]);linked.push(m[1]);
  }
}
assert.equal(linked.length,16);assert.equal(new Set(linked).size,16);
assert.deepEqual(new Set(linked),new Set(a.related_event_ids));
assert.deepEqual(new Set(linked),new Set(idx.stories[10].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-manila-1700-1799.json'"));
assert(app.includes('manila18cReady=true'));
assert(reader.includes('draft.stories?.length===29'));
assert(reader.includes("storyMeta.has('E18-T22-MANILA-INVASION-SACK-RANSOM-1762-1764')"));
assert(html.includes('18c12-cape-indigenous-resistance-20261110'),'Latest script remains cached freshly without reverting Manila links');
assert(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc'));
assert(!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
assert(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
assert(reader.includes('relatedMarkup+storyChronologyHtml(article)+quantitativeHistoryHtml(article)+'));
console.log('PASS T22: original T22 merged group and all four IDs, 4 registered B keys, 16 events, 15 registered sources, 18 chapters /54 paragraphs /16 real event links, 5 modern UNESCO city anchors, 12 new no-fake original ID supplements, 0 imaginary colonial area, 10 actor states, no dynamic toolbar; prior ten intact.');
