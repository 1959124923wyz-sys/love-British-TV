#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-cape-1795-1799.json'),
 a=load('data/stories/serial/e18-t25-cape-invasion-khoekhoe-xhosa-1795-1799.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T25.json'),
 actors=load('research/continuity/1795-1799-cape/BRITISH_INVASION_INDIGENOUS_TERRITORIAL_TRANSITIONS.json'),
 chapters=load('data/chapters.json'),pub=load('data/stories/serial/index.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),css=read('css/history-stories.css'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,28);assert.equal(idx.stories[11].id,a.id);
assert.equal(a.id,'E18-T25-CAPE-INVASION-KHOEKHOE-XHOSA-1795-1799');
assert.equal(a.publication_status,'research_only');
assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[11].status,'research_preview');
assert.equal(idx.stories[11].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.equal(a.sections.length,19);
assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),57);
assert.equal(d.schema,'atlas-18c-cape-first-british-occupation-indigenous-resistance-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,17);assert.equal(d.sources.length,20);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,8);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,12);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T25');assert.equal(t.groups.length,3);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),8);
assert.equal(actors.schema,'atlas-18c-cape-political-and-indigenous-land-control-transitions-v1');
assert.equal(actors.transitions.length,17);
assert(actors.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
const groupByOriginal=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)),seen=new Map();
let mapped=0,supplement=0,points=0;const originals=new Set();
for(const e of d.events){
 assert(/^E18C-CAP-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id),e.id);
 seen.set(e.id,e);
 assert([1795,1799].includes(e.year)&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.area_sqkm,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.fill_authorized,false);assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>src.has(id)),e.id+' source ID');
 assert(Array.isArray(e.research_original_record_ids));
 if(e.research_merge_group_id!==null){
  mapped++;assert(e.research_original_record_ids.length>0);
  for(const id of e.research_original_record_ids){
   assert(!originals.has(id),'Original archival ID duplicated '+id);originals.add(id);
   assert(crosswalk.includes('\n'+id+','),'Missing original 1126 archive record '+id);
   const g=groupByOriginal.get(id);assert(g&&g.id===e.research_merge_group_id);
   assert(g.source_years.includes(e.year),'Merged group year mismatch '+id);
  }
  assert.equal(e.research_provenance_kind,'direct_editor15_T25_merged_child');
 }else{
  supplement++;assert.equal(e.research_original_record_ids.length,0);
  assert.equal(e.research_provenance_kind,'new_archival_and_academic_supplement_without_original_id');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{points++;assert(e.representative_map_point);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(originals.size,8);assert.equal(mapped,8);assert.equal(supplement,9);assert.equal(points,5);
const by=s=>seen.get('E18C-CAP-'+s);
for(const s of ['1795-SIMONS-BAY-BRITISH-FLEET','1795-SIMONS-BAY-DUTCH-VESSELS'])
 assert.deepEqual([by(s).lat,by(s).lng],[-34.1782,18.4202]);
assert.deepEqual([by('1795-MUIZENBERG-NAVAL-BOMBARDMENT').lat,by('1795-MUIZENBERG-NAVAL-BOMBARDMENT').lng],[-34.113,18.465]);
for(const s of ['1799-GRAAFF-REINET-BOER-REVOLT','1799-VANDELEUR-BOER-SUPPRESSION'])
 assert.deepEqual([by(s).lat,by(s).lng],[-32.249,24.532]);
for(const s of ['1795-CAPE-TOWN-VOC-CAPITULATION','1799-GQUNUKHWEBE-BRITISH-AMBUSH',
                '1799-ZUURVELD-NEGOTIATED-RETENTION','1799-KLAAS-STUURMAN-WAGES-PROTECTION'])
 assert.equal(by(s).lat,null,'No verified historic single GPS '+s);
assert.deepEqual(new Set([
 'AB-E06-001','AB-NEW-046-001','AB-NEW-046-002','AB-NEW-046-003',
 'AB-F5-ZA-001','AB-F5-ZA-002','AB-F5-ZA-005','AB-F5-ZA-006'
]),originals);
assert.equal(by('1799-ZUURVELD-NEGOTIATED-RETENTION').research_merge_group_id,'E18-MRG-T25-03');
assert.equal(by('1799-KHOEKHOE-XHOSA-COALITION').research_merge_group_id,null);
assert.equal(d.statistics.verified_1799_indigenous_killed,null);
assert.equal(d.statistics.verified_historical_british_occupied_land_area_sqkm,null);
const links=[];
for(const section of a.sections){
 assert.equal(section.paragraphs.length,3);
 assert(section.source_keys.length>0&&section.source_keys.every(id=>src.has(id)));
 for(const para of section.paragraphs)
  for(const m of para.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(seen.has(m[1]),'Nonexistent Atlas chronology ID '+m[1]);links.push(m[1]);
  }
}
assert.equal(links.length,17);assert.equal(new Set(links).size,17);
assert.deepEqual(new Set(links),new Set(a.related_event_ids));
assert.deepEqual(new Set(links),new Set(idx.stories[11].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-cape-1795-1799.json'"));
assert(app.includes('cape18cReady=true'));
assert(reader.includes('draft.stories?.length===28'));
assert(reader.includes("storyMeta.has('E18-T25-CAPE-INVASION-KHOEKHOE-XHOSA-1795-1799')"));
assert(html.includes('18c12-cape-indigenous-resistance-20261110'));
assert(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
assert(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
assert(reader.includes('relatedMarkup+storyChronologyHtml(article)+quantitativeHistoryHtml(article)+'));
console.log('PASS T25 Cape: 3 genuine original groups, 8 original IDs, 8 original B sources, 17 events, 20 registered links, 19 parts/57 paragraphs/17 true map-linked events, 5 verified modern place anchors, 17 separate political/economic-control states and 0 invented 1795-99 British territories; all earlier 11 articles untouched and no dynamic reading toolbar.');
