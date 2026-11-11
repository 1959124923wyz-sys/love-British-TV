#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const dir=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(dir,p),'utf8'),data=p=>JSON.parse(read(p));
const old17=data('data/stories/serial/index.json'),pub=data('data/chapters.json');
const draft=data('data/stories/serial/preview-18c-index.json');
const acd=data('data/stories/serial/chronology-preview-1700-1769.json');
const bengal=data('data/stories/serial/chronology-preview-bengal-1750-1779.json');
const story=data('data/stories/serial/e18-t14-t15-bengal-company-famine-1756-1773.json');
const cores=data('data/eighteenth-century-bengal-control-cores-1710-1779.geojson');
const pre=data('research/18c/TRANSITION_1699_1700_RESEARCH_SEED.json');
const transition=data('research/continuity/1700-1709/TRANSITION_1699_1700_CONTROL_REVIEW_20261108.json');
const geo=data('research/continuity/1700-1709/REFERENCE_CONTROL_CORES_1700_1709.geojson');
const crosswalk=data('research/continuity/1700-1709/OLD_1699_SPATIAL_POINTS_CROSSWALK.json');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html');
assert.equal(pub.chapters.at(-1).end,1599);
assert(old17.topics.find(x=>x.id==='E6-T12'&&x.status==='published'));
assert(!old17.topics.some(x=>x.id==='E18-T14-T15-BENGAL-1756-1773'));
assert.equal(draft.stories.length,30);
assert.equal(draft.stories[0].status,'research_preview');
assert.equal(draft.stories[1].id,story.id);
assert.equal(draft.stories[1].publication_review,'not_submitted');
assert.equal(story.start_year,1756);
assert.equal(story.end_year,1773);
assert.equal(story.sections.length,15);
assert(story.related_story_ids.includes('E6-T12'));
assert.equal(story.editorial_status,'research_preview_not_published');
assert.equal(story.publication_approval,'not_submitted');
assert.equal(bengal.events.length,17);
assert.equal(bengal.sources.length,16);
assert.equal(bengal.colonial_polygons.length,0);
assert.equal(bengal.places.length,0);
assert.equal(bengal.routes.length,0);
const allEvents=new Map([...acd.events,...bengal.events].map(x=>[x.id,x]));
assert.equal(allEvents.size,acd.events.length+bengal.events.length,'no duplicate event IDs with Acadia');
const map=new Map(bengal.events.map(e=>[e.id,e]));
const sourceIds=new Set(bengal.sources.map(s=>s.id));
assert.equal(sourceIds.size,16);
let located=0,mainCount=0,secondary=0;
for(const e of bengal.events){
 assert(e.year>=1756&&e.year<=1773);
 assert.equal(e.year,e.start_year);assert.equal(e.year,e.end_year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.area_sqkm,null);
 assert.equal(e.territorial_claim,false);
 assert.equal(e.fill_authorized,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 for(const id of e.source_ids)assert(sourceIds.has(id),'missing source ID '+id);
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false);secondary++;}
 else{located++;assert(Number.isFinite(e.lng)&&Math.abs(e.lng)<=180&&Math.abs(e.lat)<=90);
  assert(e.representative_map_point);assert(/reference_not_precise/.test(e.geo_precision));}
 if(e.map_priority)mainCount++;
}
assert.equal(located,15);assert.equal(secondary,2);assert.equal(mainCount,7);
const localSources=new Set(story.sources.map(s=>s.id));
const linked=new Set(),sectionsWithLinks=new Set();
let links=0;
for(const sec of story.sections){
 assert(sec.period_start_year<=sec.period_end_year);
 assert(sec.paragraphs.length>=2,sec.id);
 for(const sid of sec.source_keys)assert(localSources.has(sid),'unknown article source '+sid);
 for(const p of sec.paragraphs){
  for(const match of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g)){
   assert(map.has(match[1]),'unresolved actual atlas draft event '+match[1]);
   assert(match[2].trim().length>=3);
   links++;linked.add(match[1]);sectionsWithLinks.add(sec.id);
  }
 }
}
assert(links>=17&&sectionsWithLinks.size>=11);
assert.deepEqual(linked,new Set(draft.stories[1].event_ids));
assert.deepEqual(new Set(story.related_event_ids),new Set(draft.stories[1].event_ids));
assert(story.sections.some(s=>s.paragraphs.join('').includes('缓征')),'verify temporary relief, not false universal refusal');
assert(story.sections.some(s=>s.paragraphs.join('').includes('同时存在于一份文书中')),'credit recovery plus relief nuance');
assert(story.sections.some(s=>s.paragraphs.join('').includes('否认相关指控')),'1772 farmers petition must include the official response');
assert(story.sections.some(s=>s.paragraphs.join('').includes('六分之一到三分之一')),'famine mortality as range, not fake absolute deaths');
const old1770=map.get('E18C-BNG-1770-FAMINE-REGIONAL');
assert.equal(old1770.lat,null,'regional famine has no invented centre');
assert.equal(map.get('E18C-BNG-1765-DIWANI').area_sqkm,null,'Diwani not a surveyed conquest polygon');
assert.equal(cores.features.length,2);
assert.equal(cores.type,'FeatureCollection');
const core=(id,y)=>cores.features.find(f=>f.properties.stable_id===id)?.properties.periods.some(t=>t.start_year<=y&&y<=t.end_year);
assert.equal(core('C1700-ENGLISH-CALCUTTA',1755),true);
assert.equal(core('C1700-ENGLISH-CALCUTTA',1756),false,'1756 EIC Fort William garrison fell');
assert.equal(core('C1700-ENGLISH-CALCUTTA',1757),true,'1757 EIC regained Calcutta');
assert.equal(core('18C-BNG-MURSHIDABAD-REVENUE',1765),true);
assert.equal(core('18C-BNG-MURSHIDABAD-REVENUE',1764),false);
for(const f of cores.features){
 assert.equal(f.geometry.type,'Point');
 assert.equal(f.properties.historical_boundary_confirmed,false);
 assert.equal(f.properties.fill_authorized,false);
 assert.equal(f.properties.territorial_claim,false);
 assert.equal(f.properties.area_sqkm,null);
 assert.equal(f.properties.exclude_from_area_aggregation,true);
 assert(f.properties.source_urls.length>=2);
}
assert.equal(pre.reference_layers_needing_1700_review.length,27);
assert.equal(transition.reference_geometry_dispositions.length,27);
const oldRefs=new Set(pre.reference_layers_needing_1700_review.map(f=>f.reference_id));
assert.deepEqual(new Set(transition.reference_geometry_dispositions.map(f=>f.reference_id)),oldRefs);
assert.equal(crosswalk.reference_records,17);
assert.equal(crosswalk.old_point_dispositions.length,17);
assert.equal(crosswalk.connected_to_1700_anchors,4);
assert.equal(crosswalk.dated_1699_events_not_to_extend,8);
const oldPointIds=new Set(crosswalk.old_point_dispositions.map(x=>x.previous_point_id));
assert.equal(oldPointIds.size,17,'old 1699 linked point ID must be preserved');
assert(crosswalk.separate_1699_control_change.official_sources.some(s=>s.includes('nps.gov')));
assert(crosswalk.separate_1699_control_change.event.includes('Williamsburg'));
assert(crosswalk.official_st_helena_1700_note.official_source.includes('sainthelena.gov.sh'));
assert(crosswalk.old_point_dispositions.every(x=>x.current_1700_verified_territorial_area_polygon===false&&x.verified_1700_territorial_area_sqkm===null));
assert.equal(transition.assessed_site_anchors.length,7);
assert.equal(transition.annual_snapshots.length,10);
assert.equal(geo.features.length,7);
assert(geo.features.every(f=>f.geometry.type==='Point'&&f.properties.area_sqkm===null&&f.properties.fill_authorized===false));
assert.equal(transition.cartography.verified_new_or_changed_control_polygons,0);
assert(transition.known_event_1700.actor.includes('Scotland'));
assert(transition.reference_geometry_dispositions.find(x=>x.reference_id==='claim-hudson-bay-1670').continuity_review.includes('French'));
assert(app.includes("fetch('data/stories/serial/chronology-preview-bengal-1750-1779.json'"));
assert(app.includes("fetch('research/continuity/1700-1709/REFERENCE_CONTROL_CORES_1700_1709.geojson'"));
assert(app.includes('renderEighteenthReviewEvidenceCores()'));
assert(app.includes('active18cBengalCoreIds:()'));
assert(app.includes('active18cContinuityIds:()'));
assert(app.includes('...serialPreviewByDecade.values()'));
assert(app.includes("serialPreviewAtlas?Math.min(1699"),'ordinary 17th century cap must survive');
assert(reader.includes("draft.stories?.length===30")&&reader.includes('for(const item of draft.stories)registerStory'));
assert(reader.includes("article.id==='E6-T12'"),'predecessor EIC narrative must link to Bengal follow-up');
assert(html.includes('js/history-stories.js')&&html.includes('app.js?'));
console.log('PASS 18C Bengal: 17 independent dated events, 15 modern site references, 7 high priority; 15 sections, '+links+' verified inline links; 1756 old fort loss, 1757 regain, 1765 fiscal authorization not geographic annexation; 1700 27 reference audit, 7 actors, 10 annual research frames, zero territorial polygons');
