#!/usr/bin/env node
'use strict';
// Research-only 18C seed validation. No 18C files in production data/ or main app.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const topics=load('research/18c/MAJOR_TOPICS.json');
const registry=load('research/18c/SOURCE_REGISTRY.json');
const continuity=load('research/18c/TRANSITION_1699_1700_RESEARCH_SEED.json');
const events=load('research/18c/ACADIAN_REVIEW_EVENTS.json');
const points=load('research/18c/ACADIAN_REVIEW_POINTS.geojson');
const story=load('research/18c/ACADIAN_REVIEW_STORY.json');
const old=load('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson');
assert.equal(topics.period.start,1700);assert.equal(topics.period.end,1799);
assert.equal(topics.topics.length,105);assert.equal(registry.sources.length,88);
const sources=new Set(registry.sources.map(s=>s.id));
assert.equal(sources.size,88);assert(registry.sources.every(s=>/^https:\/\//.test(s.url)));
assert(registry.sources.every(s=>s.original_manuscript_personally_inspected===false));
const topicIds=new Set();
for(const t of topics.topics){
 assert(!topicIds.has(t.id),t.id);topicIds.add(t.id);
 assert.equal(t.status,'research_only');assert.equal(t.publication_review,'not_submitted');
 assert.equal(t.article_file,null);assert.deepEqual(t.event_ids,[]);assert.equal(t.geometry_researched,false);
 assert(t.research_window.start_year>=1700&&t.research_window.end_year<=1799);
 for(const id of t.source_ids)assert(sources.has(id),t.id+' cites missing '+id);
}
assert.equal(continuity.previous_year,1699);
const active=old.features.filter(f=>Number(f.properties.start_year)<=1699&&Number(f.properties.end_year)>=1699);
assert.equal(active.length,27);
assert.equal(continuity.reference_layers_needing_1700_review.length,27);
for(const item of continuity.reference_layers_needing_1700_review){
 assert(active.some(f=>f.id===item.reference_id));
 assert.equal(item.next_year_political_status,'unknown_pending_institutional_and_year_end_check');
 assert.equal(item.carry_polygon_into_published_1700,false);
 assert.equal(item.area_sqkm,null);
}
assert.equal(continuity.annual_research_slots.length,10);
assert(continuity.annual_research_slots.every((v,i)=>v.year===1700+i&&v.publication_approved===false));
assert.equal(events.events.length,18);assert.equal(events.status,'research_only');
const eventIds=new Set();
for(const e of events.events){
 assert(!eventIds.has(e.id),e.id);eventIds.add(e.id);
 assert(e.year>=1713&&e.year<=1764);
 assert.equal(e.publication_status,'research_only');assert.equal(e.publication_review,'not_submitted');
 assert.equal(e.territorial_claim,false);assert.equal(e.actual_military_control_polygon,false);assert.equal(e.area_sqkm,null);
 for(const id of e.source_ids)assert(sources.has(id),e.id+' cites missing '+id);
 if(e.lat!==null){assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert.equal(e.representative_map_point,true)}
 else assert.equal(e.lng,null);
}
assert.equal(points.features.length,14);
assert(points.features.every(f=>f.type==='Feature'&&f.geometry.type==='Point'));
const featureIds=new Set(points.features.map(f=>f.id));assert.equal(featureIds.size,14);
for(const feature of points.features){
 const e=events.events.find(x=>x.id===feature.id);
 assert(e&&e.lat!==null);assert.deepEqual(feature.geometry.coordinates,[e.lng,e.lat]);
 assert.equal(feature.properties.publication_status,'research_only');
 assert.equal(feature.properties.fill_authorized,false);
 assert.equal(feature.properties.historical_boundary_confirmed,false);
 assert.equal(feature.properties.area_sqkm,null);
 assert.equal(feature.properties.actual_military_control_polygon,false);
 for(const id of feature.properties.source_ids)assert(sources.has(id));
}
assert.equal(story.id,'E18-C07-ACADIA-DEPORTATION');
assert.equal(story.publication_status,'research_only');assert.equal(story.publication_review,'not_submitted');
assert.equal(story.sections.length,10);
const links=[...JSON.stringify(story.sections).matchAll(/\[\[([A-Z0-9-]+)\|([^\]]+)\]\]/g)];
assert(links.length>=18);
for(const m of links)assert(eventIds.has(m[1]),'undefined linked source event '+m[1]);
for(const sec of story.sections){
 assert(sec.source_keys.length>0);
 assert(sec.period_start_year<=sec.period_end_year);
 assert(sec.paragraphs.length>0);
 for(const k of sec.source_keys)assert(sources.has(k));
}
assert(story.sections.some(s=>s.paragraphs.join('').includes('法军及盟友在撤离时烧毁')));
assert(story.sections.some(s=>s.paragraphs.join('').includes('不能机械相加')));
assert.equal(story.sources.length,new Set(story.sources.map(s=>s.id)).size);
assert.equal(story.related_event_ids.length,18);
const previous=load('data/stories/serial/index.json');
const continuityTopics=load('research/18c/CROSS_CENTURY_STORY_CONTINUITY.json');
const bridge=load('research/18c/CROSS_CENTURY_REVIEW_EVENTS.json');
assert.equal(previous.topics.length,36);
assert.equal(continuityTopics.stories.length,36);
assert.equal(continuityTopics.counts.reported_status_published,29);
assert.equal(continuityTopics.counts.reported_status_research_only,7);
const oldIds=new Set(previous.topics.map(t=>t.id));
const newIds=new Set(topics.topics.map(t=>t.id));
const bridgedIds=new Set();
for(const story of continuityTopics.stories){
 const old=previous.topics.find(t=>t.id===story.previous_story_id);
 assert(old, 'old manifest item disappeared '+story.previous_story_id);
 assert(!bridgedIds.has(story.previous_story_id));
 bridgedIds.add(story.previous_story_id);
 assert.equal(old.status,story.previous_status);
 assert.equal(old.title,story.previous_title);
 assert.deepEqual(old.research_window,story.previous_research_window);
 assert.deepEqual(story.previous_event_ids_count,old.event_ids.length);
 assert.equal(story.article_auto_extend,false);
 assert.equal(story.geometry_auto_carry,false);
 assert.equal(story.year1700_state,'requires_separate_political_and_cartographic_verification');
 for(const id of story.next_century_topic_ids){
  assert(newIds.has(id),story.previous_story_id+' points to missing 18C '+id);
  const next=topics.topics.find(x=>x.id===id);
  assert(next.seventeenth_century_precursor_ids.includes(story.previous_story_id),
   'reverse 17C link missing for '+story.previous_story_id+' -> '+id);
 }
 for(const id of story.source_ids)assert(sources.has(id),'bad continuation source '+id);
}
assert.equal(bridgedIds.size,oldIds.size);
assert.equal(continuityTopics.counts.continuation_kinds.direct_cross_boundary_episode,2);
assert.equal(continuityTopics.counts.continuation_kinds.closed_earlier_no_same_event,2);
assert.equal(topics.topics.filter(t=>(t.seventeenth_century_precursor_ids||[]).length).length,48);
assert.equal(bridge.status,'research_only');
assert.equal(bridge.events.length,10);
const bridgeIds=new Set();
for(const e of bridge.events){
 assert(!bridgeIds.has(e.id),e.id);bridgeIds.add(e.id);
 assert(e.year>=1700&&e.year<=1799);
 assert(oldIds.has(e.previous_story_id)&&newIds.has(e.next_century_topic_id));
 assert.equal(e.latitude,null);assert.equal(e.longitude,null);
 assert.equal(e.year_end_control_status,'not_inferred_from_event');
 assert.equal(e.actual_military_control_polygon,false);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.area_sqkm,null);
 for(const id of e.source_ids)assert(sources.has(id),e.id+' source missing '+id);
}
assert(bridge.events.some(x=>x.id==='E18-BRIDGE-1700-DARIEN-FINAL-EVACUATION'));
assert(bridge.events.some(x=>x.id==='E18-BRIDGE-1700-NEWFOUNDLAND-FISHERY-ACT'));
assert.deepEqual(story.predecessor_17c_story_ids,['E6-T10-ACADIA']);
console.log('PASS: 105 topics, 88 sources, 36/36 prior stories linked, 10 cross-century dated candidates, 27 1699 references, 18 Acadian draft events, 14 Point-only maps; no 18C publication or polygons');
