#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const data=load('data/stories/serial/chronology-preview-atlantic-zong-1700-1799.json');
const story=load('data/stories/serial/e18-t01-t02-atlantic-zong-1711-1799.json');
const index=load('data/stories/serial/preview-18c-index.json');
const published=load('data/stories/serial/index.json'),chapters=load('data/chapters.json');
const a=load('research/18c/consolidated/series/T01.json'),b=load('research/18c/consolidated/series/T02.json'),c=load('research/18c/consolidated/series/T26.json');
const provenance=load('research/18c/EDITOR16_T01_T02_ORIGINAL_1126_PROVENANCE_AUDIT_20261108.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),ui=read('js/history-stories.js'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(published.topics.find(t=>t.id==='E6-T11-VOYAGES').status,'published');
assert(!published.topics.some(t=>t.id===story.id));
assert.equal(index.stories.length,30);
assert.deepEqual(index.stories.slice(0,3).map(s=>s.id),
 ['E18-C07-ACADIA-DEPORTATION','E18-T14-T15-BENGAL-1756-1773','E18-T03-T04-JAMAICA-MAROONS-1718-1799']);
assert.equal(index.stories[3].id,story.id);
assert.equal(index.stories[3].publication_review,'not_submitted');
assert.equal(story.id,'E18-T01-T02-ATLANTIC-ZONG-1711-1799');
assert.deepEqual(story.predecessor_story_ids,['E6-T11-VOYAGES']);
assert.equal(story.publication_status,'research_only');
assert.equal(story.publication_approval,'not_submitted');
assert.equal(story.editorial_status,'research_preview_not_published');
assert.equal(story.sections.length,15);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),45);
assert.equal(data.schema,'atlas-18c-atlantic-zong-insurance-preview-v1');
assert.equal(data.events.length,14);assert.equal(data.sources.length,23);
assert.equal(data.places.length,0);assert.equal(data.routes.length,0);assert.equal(data.colonial_polygons.length,0);
assert.equal(story.sources.length,23);
const registry=new Set(data.sources.map(s=>s.id)),sourceLocal=new Set(story.sources.map(s=>s.id));
assert.equal(registry.size,23);assert.equal(sourceLocal.size,23);
const allGroups=[...a.groups,...b.groups,...c.groups];
const merged=new Map(allGroups.map(g=>[g.id,g]));
assert.equal(provenance.counts.preview_events,14);
assert.equal(provenance.counts.direct_group_events,8);
assert.equal(provenance.counts.archival_narrative_only_events,2);
assert.equal(provenance.counts.new_supplementary_events,4);
const events=new Map(),years=new Set();let points=0;
for(const e of data.events){
 assert(e.id.startsWith('E18C-ATL-'));assert(!events.has(e.id));events.set(e.id,e);
 assert(e.year>=1700&&e.year<=1799);years.add(e.year);
 assert.equal(e.year,e.start_year);assert.equal(e.year,e.end_year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.area_sqkm,null);
 assert.equal(e.fill_authorized,false);assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 if(e.research_merge_group_id!==null){
  const group=merged.get(e.research_merge_group_id);
  assert(group,'unmapped T01/T02/T26 research group '+e.id);
  assert(group.source_years.includes(e.year),'group falsely assigned to wrong historic year '+e.id);
  assert(e.research_original_record_ids.some(id=>group.original_candidate_ids.includes(id)),
   'direct merge group must contain actual candidate ID '+e.id);
 }else assert(['archived_narrative_evidence_promoted_for_review','supplementary_institutional_source_outside_original_1126'].includes(e.research_provenance_kind));
 assert(Array.isArray(e.research_original_record_ids));
 assert(Array.isArray(e.research_related_group_ids));
 for(const id of e.research_original_record_ids)
  assert(crosswalk.includes('\n'+id+','),'original research source ID absent from 1126 crosswalk '+id);
 assert(provenance.records.some(x=>x.event_id===e.id&&x.direct_group_id===e.research_merge_group_id),
  'missing immutable original-research linkage '+e.id);
 assert(e.source_ids.length>0);
 for(const sid of e.source_ids)assert(registry.has(sid),'unregistered '+sid);
 if(e.lat===null){
  assert.equal(e.lng,null);assert.equal(e.representative_map_point,false);
  assert.equal(e.geo_precision,'no_verified_single_event_point');
 }else{
  assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
  assert(e.geo_precision.includes('reference_not_exact'));points++;
 }
}
assert.equal(points,7);
for(const suffix of ['1781-ZONG-MASS-KILLING','1765-SALLY-REVOLT'])assert.equal(events.get('E18C-ATL-'+suffix).lat,null);
const black=events.get('E18C-ATL-1781-ZONG-BLACK-RIVER');
const trial=events.get('E18C-ATL-1783-ZONG-INSURANCE-TRIAL');
assert(Math.abs(black.lat-18.0264)<0.01);assert(Math.abs(black.lng+77.8487)<0.01);
assert(Math.abs(trial.lat-51.5159)<0.01);assert(Math.abs(trial.lng+0.092)<0.01);
assert(story.quantitative_claims.some(q=>q.value.includes('130')));
assert(!story.sections.some(s=>s.paragraphs.some(p=>p.includes('法院判处船员谋杀罪'))));
assert(story.sections.some(s=>s.paragraphs.join('').includes('并未在此案中以谋杀罪惩处')));
assert(story.sections.some(s=>s.paragraphs.join('').includes('不是英国直接吞并西班牙殖民地')));
assert(story.sections.some(s=>s.paragraphs.join('').includes('尚未废除制度')));
const links=[],sectionsWithLinks=new Set();
for(const sec of story.sections){
 assert(sec.paragraphs.length>=3);assert(sec.source_keys.length>0);
 for(const sid of sec.source_keys)assert(sourceLocal.has(sid),'article local source missing '+sid);
 for(const paragraph of sec.paragraphs)
  for(const match of paragraph.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{3,100})\]\]/g)){
   assert(events.has(match[1]),'unregistered map-story target '+match[1]);
   links.push(match[1]);sectionsWithLinks.add(sec.id);
  }
}
assert.equal(links.length,14);assert.equal(new Set(links).size,14);
assert.equal(sectionsWithLinks.size,14);
assert.deepEqual(new Set(links),new Set(story.related_event_ids));
assert.deepEqual(new Set(links),new Set(index.stories[3].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-atlantic-zong-1700-1799.json'"));
assert(app.includes('atlantic18cReady=true'));
assert(app.includes("const enable18cPilot=new URLSearchParams(window.location.search).get('review18c')==='1'"));
assert(ui.includes('draft.stories?.length===30'));
assert(ui.includes("article.id==='E6-T11-VOYAGES'"));
assert(ui.includes("storyMeta.has('E18-T01-T02-ATLANTIC-ZONG-1711-1799')"));
assert(html.includes('18c-scotland-union-20261108'),'Fifth story cache revision must not revert Atlantic source files');
console.log('PASS 18C Atlantic/Zong fourth story: 14 dated candidates, 23 source entries, 15 sections/45 paragraphs, 14 valid inline map links, 7 modern place references, 0 ocean fake locations and 0 colonial polygons, E6-T11 link and prior 3 stories intact.');
