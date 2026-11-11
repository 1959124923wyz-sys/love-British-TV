#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const pilot=load('data/stories/serial/chronology-preview-1700-1769.json');
const index=load('data/stories/serial/preview-18c-index.json');
const story=load('data/stories/serial/e18-c07-acadia-deportation-1713-1764.json');
const old=load('data/stories/serial/index.json');
const chapters=load('data/chapters.json');
const group=load('research/18c/consolidated/series/T07.json');
const coreSites=load('data/eighteenth-century-acadia-control-cores-1710-1769.geojson');
const app=read('app.js'),ui=read('js/history-stories.js'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599,'Unapproved 18C MUST NOT be published as a chapter');
assert.equal(old.topics.length,36);
assert.equal(old.topics.find(x=>x.id==='E6-T10-ACADIA')?.status,'published');
assert(!old.topics.some(x=>x.id==='E18-C07-ACADIA-DEPORTATION'),'18C pilot never registers in published serial index');
assert.equal(pilot.schema,'atlas-serial-chronology-preview-18c-v1');
assert.equal(pilot.editorial_status,'research_preview_not_published');
assert.deepEqual(pilot.period,{from:1700,to:1769});
assert.equal(pilot.events.length,19);
assert.equal(pilot.routes.length,0);
assert.equal(pilot.places.length,0);
assert.equal(pilot.colonial_polygons.length,0);
const byId=new Map(pilot.events.map(x=>[x.id,x]));
assert.equal(byId.size,19);
const sources=new Map(pilot.sources.map(s=>[s.id,s]));
assert.equal(sources.size,17);
let locatable=0,major=0,groupLinks=0;
const mergedIds=new Set(group.groups.map(g=>g.id));
for(const e of pilot.events){
 assert(e.year>=1700&&e.year<=1769);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.actual_English_territory_created,false);
 assert.equal(e.territorial_claim,false);
 assert.equal(e.fill_authorized,false);
 assert.equal(e.area_sqkm,null);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert.equal(e.start_year,e.end_year);
 assert.equal(e.start_year,e.year);
 assert(!String(e.name).includes('正式发表'));
 assert(e.source_ids.length);
 for(const k of e.source_ids)assert(sources.has(k),e.id+' missing source '+k);
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false);}
 else{
  locatable++;
  assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
  assert(Math.abs(e.lat)<=90&&Math.abs(e.lng)<=180);
  assert.equal(e.representative_map_point,true);
  assert(/modern|reference|historic/i.test(e.geo_precision),e.id+' must declare approximate geolocation');
 }
 if(e.map_priority)major++;
 if(e.research_merge_group_id){groupLinks++;assert(mergedIds.has(e.research_merge_group_id),e.id+' missing parent merge group');}
}
assert.equal(locatable,15);
assert.equal(major,7);
assert.equal(groupLinks,7);
assert.equal(index.schema,'atlas-18c-story-review-index-v1');
assert.equal(index.editorial_status,'research_preview_not_published');
assert.equal(index.stories.length,26);
assert.equal(index.stories[0].status,'research_preview');
assert.equal(index.stories[0].publication_review,'not_submitted');
assert.equal(index.stories[0].id,story.id);
assert.equal(index.stories[1].id,'E18-T14-T15-BENGAL-1756-1773');
assert.equal(index.stories[1].status,'research_preview');
assert.equal(index.stories[1].publication_review,'not_submitted');
assert.equal(story.id,'E18-C07-ACADIA-DEPORTATION');
assert.equal(story.editorial_status,'research_preview_not_published');
assert.equal(story.publication_approval,'not_submitted');
assert.equal(story.parent_serial_topic_id,'E6-T10-ACADIA');
assert(story.related_story_ids.includes('E6-T10-ACADIA'));
assert.equal(story.sections.length,11);
assert.deepEqual(new Set(index.stories[0].event_ids),new Set(story.related_event_ids));
let links=0,sections=0;const localSrc=new Set(story.sources.map(s=>s.id));
for(const sec of story.sections){
 let seen=0;
 for(const sid of sec.source_keys)assert(localSrc.has(sid),'source key '+sid);
 for(const p of sec.paragraphs){
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g)){
   assert(byId.has(m[1]),'no matching 18C Atlas review event '+m[1]);
   assert(m[2].trim().length>2,'meaningful event phrase required');
   seen++;links++;
  }
 }
 if(seen>0)sections++;
}
assert(links>=19&&sections>=8);
assert(story.sections.some(sec=>sec.paragraphs.join('').includes('法军及盟友在撤离时烧毁')),'do not misattribute 1750 Beaubassin burning to the British');
assert(story.sections.some(sec=>sec.paragraphs.join('').includes('不能机械相加')),'different deportation headcounts must not be summed');
assert(app.includes("get('review18c')==='1'"),'public site must require explicit opt-in');
assert(app.includes("preview18cReady=true;"));
assert(app.includes('serialPreviewByDecade.set(d,'));
assert(app.includes("previewYearCap()"));
assert(app.includes('...serialPreviewByDecade.values()'),'link target year may differ from entry year');
assert(ui.includes("data/stories/serial/preview-18c-index.json"));
assert(ui.includes("draft.stories[0].status==='research_preview'"));
assert(ui.includes('y<1600||y>1799'));
assert(ui.includes('data-story-back')&&ui.includes('focusStoryEvent')&&ui.includes('navigateToEventYear'));
assert(html.includes('js/history-stories.js')&&html.includes('app.js?'));
assert.equal(coreSites.type,'FeatureCollection');
assert.equal(coreSites.metadata.schema,'atlas-18c-acadia-evidence-led-control-cores-v1');
assert.equal(coreSites.features.length,4);
const coreIds=new Set();
for(const core of coreSites.features){
 const p=core.properties;
 assert.equal(core.geometry.type,'Point');
 assert(!coreIds.has(p.stable_id));coreIds.add(p.stable_id);
 assert(p.start_year>=1710&&p.observed_through_year<=1769);
 assert(p.start_year<=p.observed_through_year);
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert.equal(p.position_is_historical_survey,false);
 assert(p.source_urls.length>=1&&p.source_urls.every(x=>x.startsWith('https://')));
 assert(p.year_stages.length>=1);
}
const active=(year)=>coreSites.features.filter(f=>f.properties.start_year<=year&&year<=f.properties.observed_through_year).map(f=>f.properties.stable_id);
assert.deepEqual(active(1700),[]);
assert.deepEqual(active(1710),['ACD-CORE-ANNAPOLIS-1710']);
assert.equal(active(1749).length,2);
assert.equal(active(1755).length,4);
assert(active(1768).includes('ACD-CORE-FORT-CUMBERLAND-1755'));
assert(!active(1769).includes('ACD-CORE-FORT-CUMBERLAND-1755'),'British troops left Fort Cumberland 1768, no invented garrison 1769');
assert(!active(1769).includes('ACD-CORE-FORT-EDWARD-1750'),'do not extend unreviewed Edward garrison years');
assert.equal(byId.get('E18C-ACD-1710-PORT-ROYAL-CAPTURE')?.year,1710);
assert(app.includes('renderEighteenthAcadiaControlCores()'));
assert(app.includes('active18cControlCoreIds:()'));
assert(ui.includes("article.id==='E6-T10-ACADIA'"),'17C predecessor should show 18C successor only in research preview');
console.log('PASS: 19 dated source-linked events, 15 Parks Canada reference points, 7 main candidates, 11 story sections, 19+ event links, 4 period-limited British cores, Fort Cumberland correctly ends 1768; 0 claimed territorial polygons, 16/17C unchanged');
