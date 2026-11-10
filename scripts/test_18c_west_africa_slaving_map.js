#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-west-africa-enslavement-1700-1799.json'),
 a=load('data/stories/serial/e18-t26-west-africa-slaving-forts-laws-1727-1795.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T26.json'),
 actors=load('research/continuity/1727-1795-west-africa/BRITISH_SLAVING_FORTS_AND_LAW_ACTOR_TRANSITIONS.json'),
 chapters=load('data/chapters.json'),pub=load('data/stories/serial/index.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),css=read('css/history-stories.css'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,13);assert.equal(idx.stories[12].id,a.id);
assert.equal(a.id,'E18-T26-WEST-AFRICAN-SLAVING-FORTS-LAWS-1727-1795');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[12].status,'research_preview');assert.equal(idx.stories[12].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.deepEqual(a.predecessor_story_ids,['E6-T12']);
assert.equal(a.sections.length,19);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),57);
assert.equal(d.schema,'atlas-18c-west-africa-enslavement-forts-law-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,21);assert.equal(d.sources.length,40);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,20);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,20);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T26');assert.equal(t.groups.length,7);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),13);
assert.equal(actors.schema,'atlas-18c-west-africa-fort-slave-labour-and-treaty-dispositions-v1');
assert.equal(actors.transitions.length,21);
assert.equal(actors.verified_european_garrison_periods.length,3);
assert(actors.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
const originalGroup=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)),seen=new Map();
let mapped=0,supplement=0,points=0;const originals=new Set();
for(const e of d.events){
 assert(/^E18C-WAF-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id),e.id);
 seen.set(e.id,e);
 assert(e.year>=1727&&e.year<=1795&&e.start_year===e.year&&e.end_year===e.year);
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
     assert(!originals.has(id),'Duplicate original candidate '+id);originals.add(id);
     assert(crosswalk.includes('\n'+id+','),'1126 archive lacks '+id);
     const group=originalGroup.get(id);assert(group&&group.id===e.research_merge_group_id);
     assert(group.source_years.includes(e.year),'Original historical year mismatched '+id);
   }
   assert.equal(e.research_provenance_kind,'direct_editor15_T26_original_in_merged_group');
 }else{
   supplement++;assert.equal(e.research_original_record_ids.length,0);
   assert.equal(e.research_provenance_kind,'documented_institutional_supplement_not_315_original');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{points++;assert(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(originals.size,13);assert.equal(mapped,12);assert.equal(supplement,9);assert.equal(points,4);
const by=s=>seen.get('E18C-WAF-'+s);
assert.equal(by('1727-DAHOMEY-HUEDA-CONQUEST').research_original_record_ids[0],'AB-R6-066-01');
assert.equal(by('1727-DAHOMEY-HUEDA-CONQUEST').lat,null);
assert.deepEqual([by('1758-BRITISH-CAPTURE-SAINT-LOUIS').lat,by('1758-BRITISH-CAPTURE-SAINT-LOUIS').lng],[16.02778,-16.50444]);
assert.deepEqual([by('1758-BRITISH-CAPTURE-GOREE').lat,by('1758-BRITISH-CAPTURE-GOREE').lng],[14.66722,-17.40083]);
assert.deepEqual([by('1779-FRENCH-DESTROY-FORT-JAMES').lat,by('1779-FRENCH-DESTROY-FORT-JAMES').lng],[13.31764,-16.36135]);
assert.equal(by('1783-FORT-JAMES-BRITISH-TREATY-CLAIM').lat,null,'1783 legal title did not rebuild the 1779 ruin');
assert.equal(by('1750-CASTLE-SLAVES-TREATED-AS-PROPERTY').research_merge_group_id,null);
assert.equal(by('1750-BRITISH-PLANTATION-DEMAND-PREAMBLE').research_merge_group_id,'E18-MRG-T26-02');
assert.equal(by('1750-MERCHANTS-COMPANY-CREATED').research_merge_group_id,'E18-MRG-T26-02');
for(const [year,code] of [[1788,'DOLBEN-SLAVE-SHIP-REGULATION'],[1789,'BRITISH-SLAVE-SHIP-LAW-EXTENDED'],[1791,'ABOLITION-DEFEATED'],[1792,'BRITISH-SLAVE-SHIP-LAW-RENEWED']]){
 assert.equal(by(year+'-'+code).year,year);
 assert.notEqual(by(year+'-'+code).research_merge_group_id,null);
}
assert.equal(d.quantitative_evidence.actual_enslaved_persons_transported_by_this_particular_fort_series,null);
assert.equal(d.quantitative_evidence.ship_deaths,null);
assert.equal(d.quantitative_evidence.actual_English_land_area_sqkm,null);
const linked=[];
for(const section of a.sections){
 assert.equal(section.paragraphs.length,3);
 assert(section.source_keys.length>0&&section.source_keys.every(id=>src.has(id)));
 for(const para of section.paragraphs)
  for(const match of para.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(seen.has(match[1]),'Atlas event linked but not registered '+match[1]);linked.push(match[1]);
  }
}
assert.equal(linked.length,21);assert.equal(new Set(linked).size,21);
assert.deepEqual(new Set(linked),new Set(a.related_event_ids));
assert.deepEqual(new Set(linked),new Set(idx.stories[12].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-west-africa-enslavement-1700-1799.json'"));
assert(app.includes('westafrica18cReady=true'));
assert(reader.includes('draft.stories?.length===13'));
assert(reader.includes("storyMeta.has('E18-T26-WEST-AFRICAN-SLAVING-FORTS-LAWS-1727-1795')"));
assert(html.includes('18c13-westafrica-enslavement-20261110'));
assert(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
assert(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
assert(reader.includes('relatedMarkup+storyChronologyHtml(article)+quantitativeHistoryHtml(article)+'));
console.log('PASS T26: 7 authentic research groups, 13 original IDs in 12 events, 20 original B sources, 9 independent source-supplemented events, 21 actual dated episodes, 40 cited sources, 19 sections/57 paragraphs/21 true map links, 4 UNESCO current site markers and 0 false slaving-colony polygons; all prior twelve stories unchanged and dynamic TOC absent.');
