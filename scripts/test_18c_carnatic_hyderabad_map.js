#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-carnatic-hyderabad-1700-1799.json'),
 a=load('data/stories/serial/e18-t19-carnatic-hyderabad-palayakkarar-1746-1799.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T19.json'),
 chap=load('data/chapters.json'),pub=load('data/stories/serial/index.json'),
 actor=load('research/continuity/1746-1799-carnatic/ACTOR_TREATY_CONTROL_DISPOSITIONS.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html');
assert.equal(chap.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,16);assert.equal(idx.stories[9].id,a.id);
assert.equal(a.id,'E18-T19-CARNATIC-HYDERABAD-PALAYAKKARAR-1746-1799');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[9].status,'research_preview');assert.equal(idx.stories[9].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.deepEqual(a.predecessor_story_ids,['E6-T12']);
assert.equal(a.sections.length,18);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),54);
assert.equal(d.schema,'atlas-18c-carnatic-hyderabad-palayakkarar-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,14);assert.equal(d.sources.length,20);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,7);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,13);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T19');assert.equal(t.groups.length,3);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),5);
assert.equal(actor.schema,'atlas-18c-carnatic-actor-dispositions-v1');
assert.equal(actor.transitions.length,13);
assert(actor.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
const groupByOriginal=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)),seen=new Map();
let mapped=0,supplement=0,geocoded=0;const originals=new Set();
for(const e of d.events){
 assert(/^E18C-CKT-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id),e.id);
 seen.set(e.id,e);
 assert(e.year>=1746&&e.year<=1799&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.area_sqkm,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.fill_authorized,false);assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>src.has(id)));
 assert(Array.isArray(e.research_original_record_ids));
 if(e.research_merge_group_id!==null){
  mapped++;assert(e.research_original_record_ids.length>0);
  for(const id of e.research_original_record_ids){
   assert(!originals.has(id),'Duplicated archive ID '+id);
   originals.add(id);assert(crosswalk.includes('\n'+id+','),'No original 1126 archive record '+id);
   const g=groupByOriginal.get(id);assert(g&&g.id===e.research_merge_group_id);
   assert(g.source_years.includes(e.year),'T19 merged-group event-year mismatch '+id);
  }
  assert.equal(e.research_provenance_kind,'direct_editor15_T19_merged_child');
 }else{
  supplement++;assert.equal(e.research_original_record_ids.length,0);
  assert.equal(e.research_provenance_kind,'editor17_institutional_cross_checked_supplement_without_fake_original_id');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{geocoded++;assert(e.representative_map_point);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(originals.size,5);assert.equal(mapped,5);assert.equal(supplement,9);assert.equal(geocoded,4);
const by=s=>seen.get('E18C-CKT-'+s);
assert.deepEqual([by('1746-MADRAS-FRENCH-CAPTURE').lat,by('1746-MADRAS-FRENCH-CAPTURE').lng],[13.087778,80.278333]);
assert.deepEqual([by('1760-WANDIWASH-BATTLE').lat,by('1760-WANDIWASH-BATTLE').lng],[12.504167,79.605556]);
for(const s of ['1760-PONDICHERRY-SIEGE-BEGINS','1761-PONDICHERRY-SURRENDER'])
 assert.deepEqual([by(s).lat,by(s).lng],[11.93,79.83]);
for(const s of ['1748-AIX-CHAPELLE-MADRAS-RESTITUTION','1763-PARIS-FRENCH-FACTORIES','1798-HYDERABAD-SUBSIDIARY-TREATY','1798-KATTABOMMAN-REVENUE-CONFLICT','1799-PANCHALANKURICHI-FORT-ATTACK'])
 assert.equal(by(s).lat,null,'No verified singular historical GPS for '+s);
assert.equal(by('1761-PONDICHERRY-SURRENDER').research_merge_group_id,'E18-MRG-T19-01');
assert.equal(by('1763-PARIS-FRENCH-FACTORIES').research_merge_group_id,'E18-MRG-T19-01');
assert.equal(by('1798-HYDERABAD-SUBSIDIARY-TREATY').research_merge_group_id,'E18-MRG-T19-02');
assert.equal(by('1799-PANCHALANKURICHI-FORT-ATTACK').research_merge_group_id,'E18-MRG-T19-03');
assert(a.quantitative_claims.some(q=>q.value.includes('2417100')));
assert(a.historic_control_note.includes('1800'));
const linked=[];
for(const sec of a.sections){
 assert.equal(sec.paragraphs.length,3);
 assert(sec.source_keys.length>0&&sec.source_keys.every(id=>src.has(id)));
 for(const par of sec.paragraphs)
  for(const m of par.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(seen.has(m[1]),'Missing history Atlas event '+m[1]);linked.push(m[1]);
  }
}
assert.equal(linked.length,14);assert.equal(new Set(linked).size,14);
assert.deepEqual(new Set(linked),new Set(a.related_event_ids));
assert.deepEqual(new Set(linked),new Set(idx.stories[9].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-carnatic-hyderabad-1700-1799.json'"));
assert(app.includes('carnatic18cReady=true'));
assert(!app.includes('ds.routes?.length||ds.places?.length'));
assert(reader.includes('draft.stories?.length===16'));
assert(reader.includes("storyMeta.has('E18-T19-CARNATIC-HYDERABAD-PALAYAKKARAR-1746-1799')"));
assert(html.includes('carnatic-20261110'));
console.log('PASS T19: 3 real merged groups / five original IDs, seven original B keys, 14 dated events, 20 sources, 18 sections/54 paragraphs/14 unique map links, four Royal Collection modern point refs, 13 historical actor transitions, 0 invented colonial polygons and nine earlier story regressions retained.');
