#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-australia-1700-1799.json'),
 story=load('data/stories/serial/e18-t34-t35-australia-first-fleet-1717-1799.json'),
 index=load('data/stories/serial/preview-18c-index.json'),
 published=load('data/stories/serial/index.json'),
 chapters=load('data/chapters.json'),
 t34=load('research/18c/consolidated/series/T34.json'),
 t35=load('research/18c/consolidated/series/T35.json');
const original=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),ui=read('js/history-stories.js'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(index.stories.length,16);
assert.deepEqual(index.stories.slice(0,5).map(x=>x.id),[
 'E18-C07-ACADIA-DEPORTATION',
 'E18-T14-T15-BENGAL-1756-1773',
 'E18-T03-T04-JAMAICA-MAROONS-1718-1799',
 'E18-T01-T02-ATLANTIC-ZONG-1711-1799',
 'E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799'
]);
assert.equal(index.stories[5].id,story.id);
assert.equal(index.stories[5].status,'research_preview');
assert.equal(index.stories[5].publication_review,'not_submitted');
assert.equal(story.id,'E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799');
assert(!published.topics.some(x=>x.id===story.id));
assert.deepEqual(story.predecessor_story_ids,[],'Do not invent published Australian 17C predecessor');
assert.equal(story.publication_status,'research_only');
assert.equal(story.editorial_status,'research_preview_not_published');
assert.equal(story.publication_approval,'not_submitted');
assert.equal(story.sections.length,21);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),63);
assert.equal(d.schema,'atlas-18c-australia-first-fleet-resistance-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,23);assert.equal(d.sources.length,47);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
assert.equal(story.sources.length,47);
const sourceIds=new Set(d.sources.map(s=>s.id));
assert.equal(sourceIds.size,47);
assert.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('C:')).length,23);
assert.equal(d.sources.filter(s=>s.original_registry_key===null).length,24);
const merged=new Map([...t34.groups,...t35.groups].map(g=>[g.id,g]));
assert.equal(merged.size,10);
const byId=new Map();let points=0,direct=0,archived=0;
for(const e of d.events){
 assert(/^E18C-AUS-[0-9A-Z-]+$/.test(e.id)&&!byId.has(e.id),e.id);
 byId.set(e.id,e);
 assert(e.year>=1700&&e.year<=1799);
 assert(e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.area_sqkm,null);assert.equal(e.fill_authorized,false);
 assert.equal(e.territorial_claim,false);assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(x=>sourceIds.has(x)));
 assert(e.research_original_record_ids.length>0);
 for(const id of e.research_original_record_ids)
  assert(original.includes('\n'+id+','),'original 1126 source ID missing '+id);
 if(e.research_merge_group_id){
  const g=merged.get(e.research_merge_group_id);
  assert(g,'Invented research merge group '+e.id);
  assert(g.source_years.includes(e.year),'Historical group year mismatch '+e.id);
  assert(e.research_original_record_ids.some(id=>g.original_candidate_ids.includes(id)),
   'No original child directly in referenced merger '+e.id);
  direct++;
 }else{archived++;assert.equal(e.research_provenance_kind,
   'archived_or_narrative_evidence_promoted_by_supplementary_authority')}
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{
  assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
  assert.equal(e.representative_map_point,true);
  assert(e.geo_precision.includes('modern_named_place'));points++;
 }
}
assert.equal(points,9);assert.equal(direct,18);assert.equal(archived,5);
for(const suffix of ['1787-NSW-135-MERIDIAN','1787-FIRST-FLEET-SAILS','1790-PHILLIP-PUNITIVE','1795-HAWKESBURY-MILITARY','1799-BOYS-MURDER-TRIAL'])
 assert.equal(byId.get('E18C-AUS-'+suffix).lat,null,'Unverified ocean/paper/violence coordinate: '+suffix);
assert(byId.get('E18C-AUS-1770-COOK-PAPER-CLAIM').research_merge_group_id===null);
assert(byId.get('E18C-AUS-1770-COOK-PAPER-CLAIM').research_original_record_ids.includes('C-D01-001'));
assert(byId.get('E18C-AUS-1788-SYDNEY-COVE').research_merge_group_id==='E18-MRG-T34-02');
assert(byId.get('E18C-AUS-1790-SECOND-FLEET-DEATHS').research_merge_group_id==='E18-MRG-T34-03');
assert(byId.get('E18C-AUS-1794-TOONGABBIE-BEHEADING').research_merge_group_id==='E18-MRG-T35-04');
assert(byId.get('E18C-AUS-1795-HAWKESBURY-MILITARY').research_merge_group_id==='E18-MRG-T35-05');
assert(byId.get('E18C-AUS-1799-BOYS-MURDER-TRIAL').research_merge_group_id==='E18-MRG-T35-07');
assert(story.reading_note.includes('1789'));
assert(story.map_note.includes('零新增'));
assert(story.quantitative_claims.some(q=>q.value.includes('62')));
const articleSources=new Set(story.sources.map(x=>x.id));
const links=[];
for(const section of story.sections){
 assert.equal(section.paragraphs.length,3);
 assert(section.source_keys.length>0);
 for(const id of section.source_keys)assert(articleSources.has(id),'Unregistered article source '+id);
 for(const p of section.paragraphs){
  for(const match of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(byId.has(match[1]),'Unregistered linked map event '+match[1]);links.push(match[1]);
  }
 }
}
assert.equal(links.length,23);assert.equal(new Set(links).size,23);
assert.deepEqual(new Set(links),new Set(story.related_event_ids));
assert.deepEqual(new Set(links),new Set(index.stories[5].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-australia-1700-1799.json'"));
assert(app.includes('australia18cReady=true'));
assert(app.includes("const enable18cPilot=new URLSearchParams(window.location.search).get('review18c')==='1'"));
assert(ui.includes('draft.stories?.length===16'));
assert(html.includes('18c-scotland-union-20261108'));
console.log('PASS 18C Australia T34/T35: 23 events, 47 registered sources, 21 sections/63 paragraphs, 23 atlas links, 9 modern named locations, 10 original research groups, 0 invented land claims or sea tracks, 5 earlier topics intact.');
