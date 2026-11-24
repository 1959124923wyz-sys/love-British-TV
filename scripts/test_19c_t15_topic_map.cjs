#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const chron=load('data/stories/serial/chronology-1850-1859.json'),spatial=load('data/nineteenth-century-spatial-1850-1859.geojson');
const story=load('data/stories/serial/e19-t15-indian-uprising-reprisals-1857-1859.json'),index=load('data/stories/serial/index.json');
const meta=index.topics.find(t=>t.id===story.id),ids=new Map(chron.events.map(e=>[e.id,e]));
const sourceIds=new Set(chron.sources.map(s=>s.id)),ownSource=new Set(story.sources.map(s=>s.id));
assert.equal(story.sections.length,8);assert.equal(story.sections.reduce((a,s)=>a+s.paragraphs.length,0),24);
assert(meta&&meta.article_file==='data/stories/serial/e19-t15-indian-uprising-reprisals-1857-1859.json');
assert(meta.status==='published'&&meta.publication_review==='approved');
const newEvents=chron.events.filter(e=>e.id.startsWith('E19-T15-'));
assert.equal(newEvents.length,8,'eight actual new history entries');
assert.equal(new Set(chron.events.map(e=>e.id)).size,chron.events.length,'chronology duplicate ID');
for(const e of newEvents){
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.year>=1857&&e.year<=1858,e.id+' coordinate/year');
 assert(e.source_ids?.length&&e.source_ids.every(s=>sourceIds.has(s)),e.id+' source');
 assert(e.research_v6_event_ids?.length,e.id+' T15 original research provenance');
 assert.equal(e.area_sqkm,null);assert.equal(e.fill_authorized,false);
}
const linkRe=/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g;
const inline=story.sections.flatMap(s=>s.paragraphs.flatMap(p=>Array.from(p.matchAll(linkRe),m=>[s.id,m[1],m[2]])));
assert(inline.length>=34,'longform event links');assert.equal(new Set(inline.map(x=>x[1])).size,34,'unique linked events');
assert.deepEqual(new Set(meta.event_ids),new Set(inline.map(x=>x[1])),'article/manifest event consistency');
for(const s of story.sections){assert(s.source_keys?.every(id=>ownSource.has(id)),s.id+' source keys');}
for(const [section,id,label] of inline){assert(ids.has(id),'invented event link '+section+' '+id);assert(label.trim().length>3,'noninformative hyperlink '+id);}
const features=spatial.features.filter(f=>f.id.startsWith('t15-'));
assert.equal(features.length,5,'3 named sites and 2 routes');
assert.equal(features.filter(f=>f.geometry.type==='Point').length,3);
assert.equal(features.filter(f=>f.geometry.type==='LineString').length,2);
for(const f of features){const p=f.properties;
 assert(p.source_ids?.length&&p.source_ids.every(id=>sourceIds.has(id)),f.id+' cited');
 assert(p.related_event_ids?.length&&p.related_event_ids.every(id=>ids.has(id)),f.id+' chronology join');
 assert(p.source_urls?.every(url=>url.startsWith('https://')),f.id+' links');
 assert(p.start_year>=1857&&p.end_year<=1858,f.id+' date');
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 if(f.geometry.type==='LineString'){assert(p.dash_only===true&&p.outline_style==='dashed',f.id+' uncertain line style');}
}
const fort=features.find(f=>f.id==='t15-jhansi-fort-1857-1858').geometry.coordinates;
assert(Math.abs(fort[1]-(25+27/60+28/3600))<1e-6);assert(Math.abs(fort[0]-(78+34/60+32/3600))<1e-6);
const h=ids.get('E19-T15-1857-ALLAHABAD-LETTER');
assert(/来信日期/.test(h.date_label)&&/十座/.test(h.description),'letter not retroactively dated as burning');
assert(/B46-E04/.test(ids.get('E19-T15-1858-JHANSI-AFTERMATH').research_v6_event_ids.join('')));
const topicBoard=read('research/19c/consolidated/TOPIC_WORKBOARD.csv').split('\n').find(l=>l.startsWith('T15,'));
assert(topicBoard&&topicBoard.includes('review_ready'));
const reader=read('js/history-stories.js'),app=read('app.js');
assert(reader.includes('data-story-event')&&reader.includes('navigateToEventYear'),'reader preserved');
assert(app.includes("renderNineteenthSpatial()"),'map renderer preserved');
console.log('PASS T15: 8 sections, 24 paragraphs, '+inline.length+' linked events, 8 sourced new events, 3 locations, 2 dashed links, and official Jhansi coordinate');
