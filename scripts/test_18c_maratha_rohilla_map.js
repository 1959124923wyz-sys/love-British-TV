#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-maratha-rohilla-awadh-1700-1799.json'),
 a=load('data/stories/serial/e18-t18-maratha-rohilla-awadh-1773-1782.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T18.json'),
 chap=load('data/chapters.json'),pub=load('data/stories/serial/index.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html');
assert.equal(chap.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,30);assert.equal(idx.stories[8].id,a.id);
assert.equal(a.id,'E18-T18-MARATHA-ROHILLA-AWADH-1773-1782');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[8].status,'research_preview');
assert.equal(idx.stories[8].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.deepEqual(a.predecessor_story_ids,['E6-T12']);
assert.equal(a.sections.length,16);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),48);
assert.equal(d.schema,'atlas-18c-maratha-rohilla-awadh-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,12);assert.equal(d.sources.length,20);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,9);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,11);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T18');assert.equal(t.groups.length,3);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),8);
const groupByOriginal=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)),seen=new Map();
let mapped=0,supplement=0,geocoded=0;const originals=new Set();
for(const e of d.events){
 assert(/^E18C-MRA-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id),e.id);
 seen.set(e.id,e);
 assert(e.year>=1773&&e.year<=1782&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.area_sqkm,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.fill_authorized,false);assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>src.has(id)));
 assert(Array.isArray(e.research_original_record_ids));
 if(e.research_merge_group_id!==null){
  mapped++;
  assert(e.research_original_record_ids.length>0);
  for(const id of e.research_original_record_ids){
   assert(!originals.has(id),'Original archive ID duplicated: '+id);
   originals.add(id);assert(crosswalk.includes('\n'+id+','),'1126 archive ID missing: '+id);
   const g=groupByOriginal.get(id);assert(g&&g.id===e.research_merge_group_id);
   assert(g.source_years.includes(e.year),'Year mismatch for T18 original '+id);
  }
  assert.equal(e.research_provenance_kind,'direct_editor15_T18_merged_child');
 }else{
  supplement++;assert.equal(e.research_original_record_ids.length,0);
  assert.equal(e.research_provenance_kind,'editor17_extra_documented_institutional_event');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{geocoded++;assert(e.representative_map_point);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(originals.size,8);assert.equal(mapped,7);assert.equal(supplement,5);assert.equal(geocoded,3);
const by=s=>seen.get('E18C-MRA-'+s);
assert.deepEqual([by('1775-SURAT-TREATY').lat,by('1775-SURAT-TREATY').lng],[21.170240,72.831062]);
for(const s of ['1773-BENARES-AWADH-TREATY','1781-BENARES-CHAIT-SINGH'])
 assert.deepEqual([by(s).lat,by(s).lng],[25.28,82.95]);
for(const s of ['1774-KATRA-ROHILLA-BATTLE','1779-WADGAON-CONVENTION','1780-GWALIOR-FORT-CAPTURE','1782-SALBAI-PEACE-TREATY'])
 assert.equal(by(s).lat,null,s+' unsupported exact GPS');
assert.equal(by('1779-WADGAON-RETREAT').research_merge_group_id,null);
assert.equal(by('1779-WADGAON-CONVENTION').research_merge_group_id,'E18-MRG-T18-02');
assert.equal(by('1782-SALBAI-PEACE-TREATY').research_original_record_ids.length,2);
const linked=[];
for(const sec of a.sections){
 assert.equal(sec.paragraphs.length,3);
 assert(sec.source_keys.length>0&&sec.source_keys.every(id=>src.has(id)));
 for(const par of sec.paragraphs)
  for(const m of par.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(seen.has(m[1]),'Unknown Atlas ID link '+m[1]);linked.push(m[1]);
  }
}
assert.equal(linked.length,12);assert.equal(new Set(linked).size,12);
assert.deepEqual(new Set(linked),new Set(a.related_event_ids));
assert.deepEqual(new Set(linked),new Set(idx.stories[8].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-maratha-rohilla-awadh-1700-1799.json'"));
assert(app.includes('maratha18cReady=true'));
assert(!app.includes('ds.routes?.length||ds.places?.length'),'17C spatial referenced routes regression');
assert(reader.includes('draft.stories?.length===30'));
assert(reader.includes("storyMeta.has('E18-T18-MARATHA-ROHILLA-AWADH-1773-1782')"));
assert(html.includes('maratha-20261109'));
console.log('PASS T18 Maratha/Rohilla/Awadh: 3 genuine merged groups, 8 original IDs tracked by 1126 archive, 7 group-backed nodes + 5 independent supplements, 12 dated events, 20 sources, 16 chapters/48 paragraphs/12 real interactive links, 3 modern official city point anchors, 0 fabricated territorial polygons; first eight stories preserved.');
