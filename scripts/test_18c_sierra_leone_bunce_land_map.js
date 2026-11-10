#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-sierra-leone-1700-1799.json'),
 a=load('data/stories/serial/e18-t27-sierra-leone-bunce-black-settlers-1728-1799.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 t=load('research/18c/consolidated/series/T27.json'),
 states=load('research/continuity/1728-1799-sierra-leone/BUNCE_COMPANY_BLACK_FREEHOLD_TRANSITIONS.json'),
 chapters=load('data/chapters.json'),pub=load('data/stories/serial/index.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),css=read('css/history-stories.css'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,14);assert.equal(idx.stories[13].id,a.id);
assert.equal(a.id,'E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799');
assert.equal(a.publication_status,'research_only');assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert.equal(idx.stories[13].status,'research_preview');
assert.equal(idx.stories[13].publication_review,'not_submitted');
assert(!pub.topics.some(x=>x.id===a.id));
assert(pub.topics.some(x=>x.id==='E6-T12'&&x.status==='published'));
assert.equal(a.sections.length,18);assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),54);
assert.equal(d.schema,'atlas-18c-sierra-leone-bunce-black-settler-land-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,18);assert.equal(d.sources.length,25);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('B:')).length,7);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,18);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.deepEqual(new Set(d.sources.map(s=>s.id)),new Set(a.sources.map(s=>s.id)));
assert(d.sources.every(x=>/^https:\/\//.test(x.url)&&x.original_manuscript_personally_inspected===false));
assert.equal(t.story_arc_id,'T27');assert.equal(t.groups.length,3);
assert.equal(t.groups.reduce((n,g)=>n+g.original_candidate_ids.length,0),4);
assert.equal(states.schema,'atlas-18c-sierra-leone-bunce-company-land-political-transitions-v1');
assert.equal(states.transitions.length,18);
assert(states.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
const originalGroup=new Map(t.groups.flatMap(g=>g.original_candidate_ids.map(x=>[x,g])));
const src=new Set(d.sources.map(s=>s.id)),seen=new Map(),originals=new Set();
let mapped=0,supplement=0,points=0;
for(const e of d.events){
 assert(/^E18C-SL-[A-Z0-9-]+$/.test(e.id)&&!seen.has(e.id),e.id);
 seen.set(e.id,e);
 assert(e.year>=1728&&e.year<=1799&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.area_sqkm,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.fill_authorized,false);assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>src.has(id)),e.id+' invalid source');
 assert(Array.isArray(e.research_original_record_ids));
 if(e.research_merge_group_id!==null){
  mapped++;assert(e.research_original_record_ids.length>0);
  for(const id of e.research_original_record_ids){
   assert(!originals.has(id),'Duplicate original historical candidate '+id);originals.add(id);
   assert(crosswalk.includes('\n'+id+','),'Original 1126 archive lacks '+id);
   const group=originalGroup.get(id);assert(group&&group.id===e.research_merge_group_id);
   assert(group.source_years.includes(e.year),'Archival year differs from actual event '+id);
  }
  assert.equal(e.research_provenance_kind,'direct_editor15_T27_merged_child');
 }else{
  supplement++;assert.equal(e.research_original_record_ids.length,0);
  assert.equal(e.research_provenance_kind,'independently_verified_context_no_fake_original_id');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{points++;assert(e.representative_map_point&&Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
}
assert.equal(originals.size,4);assert.equal(mapped,4);assert.equal(supplement,14);assert.equal(points,10);
assert.deepEqual(originals,new Set(['AB-F5-SL-001','AB-E09-008','AB-R7-POL-041','AB-E09-004']));
const by=s=>seen.get('E18C-SL-'+s);
for(const s of ['1728-BUNCE-RAC-ABANDONMENT','1744-BUNCE-LONDON-SLAVERS','1779-FRENCH-RAID-BUNCE','1794-FRENCH-RAID-BUNCE-SLAVE-FORT'])
 assert.deepEqual([by(s).lat,by(s).lng],[8.56940556,-13.04023333]);
for(const s of ['1792-FREETOWN-BLACK-LOYALIST-ARRIVAL','1796-SETTLER-ELECTION-QUITRENT-DISPUTE','1799-SIERRA-LEONE-COMPANY-FREEHOLD-REFUSAL'])
 assert.deepEqual([by(s).lat,by(s).lng],[8.4360141,-13.20414834]);
assert.equal(by('1787-TEMNE-LAND-LEASE-NEGOTIATION').lat,null,'Temne original rights no invented modern polygon');
assert.equal(by('1792-HALIFAX-FLEET-DEPARTURE').lat,null,'Unknown historic transatlantic route');
assert.equal(by('1792-MIGRATION-SEA-AND-LANDING-DEATHS').lat,null,'Death locations not invented');
assert.equal(by('1799-SIERRA-LEONE-COMPANY-FREEHOLD-REFUSAL').research_original_record_ids[0],'AB-R7-POL-041');
assert.equal(by('1799-BLACK-SETTLER-CONSTITUTIONAL-RESISTANCE').research_original_record_ids[0],'AB-E09-004');
assert.equal(d.quantities.migrants_1792,1190);
assert.equal(d.quantities.sea_deaths_reported_by_clarkson,65);
assert.equal(d.quantities.sea_or_shortly_after_arrival_deaths_UNB,112);
assert.equal(d.quantities.voyage_65_are_subset_of_112,true);
assert.equal(d.quantities.land_area_sqkm,null);
assert(!d.events.some(e=>e.year===1800));
const links=[];
for(const sec of a.sections){
 assert.equal(sec.paragraphs.length,3);
 assert(sec.source_keys.length>0&&sec.source_keys.every(id=>src.has(id)));
 for(const text of sec.paragraphs)for(const m of text.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
  assert(seen.has(m[1]),'Dead map link '+m[1]);links.push(m[1])
 }
}
assert.equal(links.length,18);assert.equal(new Set(links).size,18);
assert.deepEqual(new Set(links),new Set(a.related_event_ids));
assert.deepEqual(new Set(links),new Set(idx.stories[13].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-sierra-leone-1700-1799.json'"));
assert(app.includes('sierraLeone18cReady=true'));
assert(reader.includes('draft.stories?.length===14'));
assert(reader.includes("storyMeta.has('E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799')"));
assert(html.includes('18c14-sierra-leone-bunce-land-20261110'));
assert(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
assert(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
assert(reader.includes('relatedMarkup+storyChronologyHtml(article)+quantitativeHistoryHtml(article)+'));
console.log('PASS T27: 3 archived merged groups, 4 authentic old IDs, 7 old B source keys, 18 new verified episodes, 25 research sources, 18 chapters/54 paragraphs/18 unique map links, 10 modern UNESCO/UN site anchors, 18 social/fort/land control states, 0 invented 1799 battle or Temne land polygon, previous 13 subjects and no floating dynamic TOC.');
