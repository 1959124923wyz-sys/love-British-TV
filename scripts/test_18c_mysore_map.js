#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-mysore-1700-1799.json'),
 a=load('data/stories/serial/e18-t17-mysore-wars-partition-1767-1799.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T17.json'),
 pub=load('data/stories/serial/index.json'),chap=load('data/chapters.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html');
assert.equal(chap.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,29);assert.equal(idx.stories[7].id,a.id);
assert.equal(a.id,'E18-T17-MYSORE-WARS-PARTITION-1767-1799');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[7].status,'research_preview');
assert.equal(idx.stories[7].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.deepEqual(a.predecessor_story_ids,['E6-T12']);
assert.equal(a.sections.length,16);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),48);
assert.equal(d.schema,'atlas-18c-mysore-wars-partition-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,12);assert.equal(d.sources.length,16);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,8);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,8);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);
assert.equal(d.colonial_polygons.length,0);assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T17');assert.equal(t.groups.length,5);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),12);
const groupByOriginal=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)), seen=new Map();
let mapped=0,supplement=0,geocoded=0;const coveredOriginal=new Set();
for(const e of d.events){
 assert(/^E18C-MYS-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id),e.id);
 seen.set(e.id,e);
 assert(e.start_year===e.year&&e.end_year===e.year&&e.year>=1767&&e.year<=1799);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.area_sqkm,null);
 assert.equal(e.fill_authorized,false);
 assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length&&e.source_ids.every(id=>src.has(id)));
 assert(Array.isArray(e.research_original_record_ids));
 if(e.research_merge_group_id!==null){
  mapped++;assert(e.research_original_record_ids.length>0);
  for(const id of e.research_original_record_ids){
   assert(!coveredOriginal.has(id),'Original ID appears twice '+id);coveredOriginal.add(id);
   assert(crosswalk.includes('\n'+id+','),'Original 1126 archive ID missing '+id);
   const g=groupByOriginal.get(id);assert(g&&g.id===e.research_merge_group_id);
   assert(g.source_years.includes(e.year),'Group-year mismatch '+id);
  }
  assert.equal(e.research_provenance_kind,'direct_editor15_T17_merged_child');
 }else{
  supplement++;assert.equal(e.research_original_record_ids.length,0);
  assert.equal(e.research_provenance_kind,'editor17_official_research_supplement_no_fake_original_id');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{geocoded++;assert(e.representative_map_point);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(coveredOriginal.size,12);assert.equal(mapped,10);assert.equal(supplement,2);assert.equal(geocoded,5);
const by=suffix=>seen.get('E18C-MYS-'+suffix);
assert.equal(by('1780-POLLILUR-MYSORE-VICTORY').lat,null);
assert.deepEqual([by('1781-POLLILUR-COMPANY-VICTORY').lat,by('1781-POLLILUR-COMPANY-VICTORY').lng],[12.833333,79.716667]);
for(const suffix of ['1792-PRINCES-HOSTAGE','1792-SERINGAPATAM-TREATY','1799-SERINGAPATAM-STORM','1799-SERINGAPATAM-PRIZE-LIBRARY'])
 assert.deepEqual([by(suffix).lat,by(suffix).lng],[12.414,76.704]);
assert.equal(by('1799-MYSORE-PARTITION').lat,null);
assert.equal(by('1799-MYSORE-SUBSIDIARY-TREATY').lat,null);
assert.notEqual(by('1780-POLLILUR-MYSORE-VICTORY').category,by('1781-POLLILUR-COMPANY-VICTORY').category);
const linked=[];
for(const sec of a.sections){
 assert.equal(sec.paragraphs.length,3);
 assert(sec.source_keys.length>0&&sec.source_keys.every(id=>src.has(id)));
 for(const par of sec.paragraphs)
  for(const m of par.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(seen.has(m[1]),'Unregistered inline Atlas node '+m[1]);linked.push(m[1]);
  }
}
assert.equal(linked.length,12);assert.equal(new Set(linked).size,12);
assert.deepEqual(new Set(linked),new Set(a.related_event_ids));
assert.deepEqual(new Set(linked),new Set(idx.stories[7].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-mysore-1700-1799.json'"));
assert(app.includes('mysore18cReady=true'));
assert(reader.includes('draft.stories?.length===29'));
assert(reader.includes("storyMeta.has('E18-T17-MYSORE-WARS-PARTITION-1767-1799')"));
assert(html.includes('18c-scotland-union-20261108-mysore-20261109'));
console.log('PASS Mysore T17: 5 genuine groups, 12 original IDs covered, 10 group-backed events + 2 official supplements, 16 sources, 16 chapters/48 paragraphs/12 links, five modern named-point anchors, no fictitious 1792/1799 sovereignty polygons; earlier seven retained.');
