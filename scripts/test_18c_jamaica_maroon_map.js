#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const draft=load('data/stories/serial/preview-18c-index.json');
const data=load('data/stories/serial/chronology-preview-jamaica-1700-1799.json');
const story=load('data/stories/serial/e18-t03-t04-jamaica-maroons-1718-1799.json');
const core=load('data/eighteenth-century-jamaica-maroon-autonomy-cores-1739-1799.geojson');
const acd=load('data/stories/serial/chronology-preview-1700-1769.json');
const bng=load('data/stories/serial/chronology-preview-bengal-1750-1779.json');
const published=load('data/stories/serial/index.json'),chapters=load('data/chapters.json');
const group=load('research/18c/consolidated/series/T04.json');
const related=load('research/18c/consolidated/series/T03.json');
const jamaica=read('app.js'),ui=read('js/history-stories.js'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599,'Do not ship an unapproved 18C chapter');
assert.equal(published.topics.find(t=>t.id==='E6-T08').status,'published');
assert(!published.topics.some(t=>t.id===story.id));
assert.equal(draft.stories.length,12);
assert.equal(draft.stories[2].id,story.id);
assert.equal(draft.stories[2].status,'research_preview');
assert.equal(draft.stories[2].publication_review,'not_submitted');
assert.equal(story.id,'E18-T03-T04-JAMAICA-MAROONS-1718-1799');
assert.equal(story.publication_status,'research_only');
assert.equal(story.publication_approval,'not_submitted');
assert.equal(story.editorial_status,'research_preview_not_published');
assert.equal(story.start_year,1718);assert.equal(story.end_year,1799);
assert.deepEqual(story.predecessor_story_ids,['E6-T08']);
assert(story.related_story_ids.includes('E6-T08'));
assert.equal(story.sections.length,16);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),48);
assert.equal(data.schema,'atlas-18c-jamaica-maroon-preview-v1');
assert.equal(data.editorial_status,'research_preview_not_published');
assert.equal(data.events.length,17);
assert.equal(data.sources.length,18);
assert.equal(data.places.length,0);
assert.equal(data.routes.length,0);
assert.equal(data.colonial_polygons.length,0);
const sources=new Set(data.sources.map(s=>s.id));
const localSources=new Set(story.sources.map(s=>s.id));
assert.equal(sources.size,18);
assert.equal(localSources.size,18);
const mergedGroups=new Set([...group.groups,...related.groups].map(g=>g.id));
const all=[...acd.events,...bng.events,...data.events];
assert.equal(new Set(all.map(e=>e.id)).size,all.length,'3 research topics must have nonoverlapping event IDs');
let points=0,priority=0;
const ids=new Map();
for(const e of data.events){
 assert(e.id.startsWith('E18C-JAM-'));
 assert(!ids.has(e.id));ids.set(e.id,e);
 assert(e.year>=1700&&e.year<=1799);
 assert.equal(e.year,e.start_year);assert.equal(e.year,e.end_year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.area_sqkm,null);
 assert.equal(e.territorial_claim,false);
 assert.equal(e.fill_authorized,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(mergedGroups.has(e.research_merge_group_id),'source merger T04/T03 lookup missing '+e.id);
 assert(e.source_ids?.length);
 for(const s of e.source_ids)assert(sources.has(s),'missing source '+s);
 if(e.lat===null){
  assert.equal(e.lng,null);assert.equal(e.representative_map_point,false);
  assert.equal(e.geo_precision,'no_verified_single_event_point');
 }else{
  points++;
  assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
  assert(Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180);
  assert(e.geo_precision.includes('reference_not_')||e.geo_precision.includes('reference_not_exact')||e.geo_precision.includes('populated_place_reference'));
  assert.equal(e.representative_map_point,true);
 }
 if(e.map_priority)priority++;
}
assert.equal(points,5);
assert.equal(priority,10);
assert.equal(ids.get('E18C-JAM-1718-PURSUIT-LAW').date_label,'1718年（精确日未核）');
assert(ids.get('E18C-JAM-1739-CUDJOE-TREATY').description.includes('1500英亩'));
assert(ids.get('E18C-JAM-1739-QUAO-TREATY').description.includes('十二月'));
assert.equal(ids.get('E18C-JAM-1795-SECOND-WAR').lat,null,'Trelawny War no fictitious battlefield coordinates');
assert.equal(ids.get('E18C-JAM-1796-APR-DEPORTATION').lat,null,'No invented Jamaica port');
assert.equal(ids.get('E18C-JAM-1796-PRESTON-MOVE').lat,null,'No invented 1796 family plot location');
assert(ids.get('E18C-JAM-1796-APR-DEPORTATION').description.includes('同一批流放者'));
const links=[],linked=new Set(),withLink=new Set();
for(const section of story.sections){
 assert(section.paragraphs.length>=3);
 assert(section.period_start_year<=section.period_end_year);
 for(const key of section.source_keys)assert(localSources.has(key),'article source not registered '+key);
 for(const paragraph of section.paragraphs){
  for(const match of paragraph.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{3,100})\]\]/g)){
   assert(ids.has(match[1]),'unregistered inline event link '+match[1]);
   linked.add(match[1]);withLink.add(section.id);links.push(match[1]);
  }
 }
}
assert.equal(links.length,17,'each dated principal event should be linked once in the narrative');
assert.equal(linked.size,17);
assert.deepEqual(linked,new Set(story.related_event_ids));
assert.deepEqual(linked,new Set(draft.stories[2].event_ids));
assert(withLink.size>=12);
const allText=story.sections.flatMap(s=>s.paragraphs).join('\n');
for(const concept of ['捕回','Nanny','Cudjoe','Quao','1760年','1788年','1795','1796','1800年']){
 assert(allText.includes(concept),'story is missing important full-period history '+concept);
}
assert(allText.includes('不能把四月离岛500多人和七月抵达的同一批人口相加'));
assert(story.sections.some(s=>s.heading.includes('1740年')),'uncertain Nanny/Quao post-treaty timing must be visible in heading');
assert(allText.includes('条约'));
assert(data.sources.find(s=>s.id==='18J-J07').notes.includes('Inexact'));
assert.equal(core.type,'FeatureCollection');
assert.equal(core.features.length,2);
assert.equal(core.metadata.control_area_polygons_approved,0);
const autonomyIds=new Set();
for(const f of core.features){
 const p=f.properties;
 assert.equal(f.geometry.type,'Point');
 assert(p.control_class.startsWith('maroon_'));
 assert(!p.actor.startsWith('Great Britain'));
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.equal(p.position_is_historical_survey,false);
 assert(p.source_urls.length>=2);
 assert(!autonomyIds.has(p.stable_id));
 autonomyIds.add(p.stable_id);
}
const coreActive=year=>core.features.filter(f=>f.properties.periods.some(p=>year>=p.start_year&&year<=p.end_year)).map(f=>f.properties.stable_id);
assert.deepEqual(coreActive(1738),[]);
assert.deepEqual(coreActive(1739),['18C-MAROON-ACCOMPONG']);
assert.equal(coreActive(1740).length,2);
assert.equal(coreActive(1795).length,2,'Trelawny conflict does not erase independent Accompong/Moore Town');
assert.equal(coreActive(1799).length,2);
assert(jamaica.includes("fetch('data/stories/serial/chronology-preview-jamaica-1700-1799.json'"));
assert(jamaica.includes("fetch('data/eighteenth-century-jamaica-maroon-autonomy-cores-1739-1799.geojson'"));
assert(jamaica.includes("jamaica18cReady?1799:"));
assert(jamaica.includes('active18cMaroonCoreIds:()'));
assert(jamaica.includes('renderEighteenthReviewEvidenceCores()'));
assert(jamaica.includes("serialPreviewAtlas?Math.min(1699"),'original nonopt-in year cap regression');
assert(ui.includes('draft.stories?.length===12'));
assert(ui.includes("article.id==='E6-T08'"));
assert(ui.includes("storyMeta.has('E18-T03-T04-JAMAICA-MAROONS-1718-1799')"));
assert(html.includes('app.js?')&&html.includes('js/history-stories.js?'));
console.log('PASS 18C Jamaica Maroon: 17 dated events, 18 research sources, 5 modern site references, 10 priority cases, 16 sections, 48 paragraphs, 17 inline links, 2 autonomous Maroon community town points with zero colonial Polygon; predecessor 17C Jamaica intact');
