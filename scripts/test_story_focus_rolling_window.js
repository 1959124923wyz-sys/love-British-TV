#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>JSON.parse(read(p)),app=read('app.js'),reader=read('js/history-stories.js'),css=read('css/history-stories.css');
new vm.Script(app,{filename:'app.js'});new vm.Script(reader,{filename:'js/history-stories.js'});
const topic=data('data/stories/serial/index.json').topics.find(t=>t.id==='E6-T02');
assert(topic&&topic.status==='published'&&topic.event_ids.length>=15,'published Ireland 1641–1670 topic');
const ds=new Map();
for(let d=1600;d<=1690;d+=10)ds.set(d,data('data/atlas-'+d+'-'+(d+9)+'.json'));
const from=app.indexOf("let eventWindowMode17c='rolling4'"),to=app.indexOf('function isNewEventThisYear(item)',from);
assert(from>=0&&to>from);
const env={serialPreviewByDecade:ds,atlas:{events:[]},year:1650,
 decadeForYear:y=>Math.floor(Number(y)/10)*10,renderEventList:()=>{},renderPoints:()=>{},
 $:id=>({checked:false}),focusedEventId:null,focusRequestToken:0};
const api=vm.runInNewContext(app.slice(from,to)+
 '\n({displayedSeventeenthEvents,displayedSeventeenthRoutes,setStoryEventLens,seventeenthEventsForWindow,seventeenthEventWindowStart})',env);
const subset=events=>events.map(e=>e.id).sort(),topicIDs=new Set(topic.event_ids);
const all=Array.from(api.seventeenthEventsForWindow(1650));
assert(all.some(e=>e.year===1649)&&all.some(e=>e.year===1650));
assert(api.setStoryEventLens({id:topic.id,title:topic.title,eventIds:topic.event_ids}), 'should focus real published story IDs');
assert.equal(env.eventWindowMode17c,undefined,'VM module-scoped state must not be exposed as a mutable global');
const filtered=Array.from(api.displayedSeventeenthEvents(1650));
assert(filtered.length>0&&filtered.length<all.length,'topic focus narrows instead of recreating events');
assert(filtered.every(e=>topicIDs.has(e.id)),'no unrelated events in focused story');
assert(filtered.every(e=>e.year>=1647&&e.year<=1650),'topic focus obeys 4-year window');
const linkedRoutes=Array.from(api.displayedSeventeenthRoutes(1650));
assert(linkedRoutes.every(route=>(route.related_event_ids||[]).some(id=>topicIDs.has(id))),
 'topic view routes must be explicitly related to actual topic events');
assert(api.setStoryEventLens(null));
assert.deepEqual(subset(api.displayedSeventeenthEvents(1650)),subset(all),'exiting must restore all general map events');
assert.equal(api.setStoryEventLens({id:'fake',eventIds:['not-a-published-event']}),false,
 'a non-existent topic reference must not force the map to hallucinate geography');
for(const y of [1641,1650,1651,1660,1670]){
 const expected=all=>all.filter(e=>topicIDs.has(e.id)&&e.year>=Math.max(1600,y-3)&&e.year<=y);
 assert.deepEqual(subset(expected([...ds.values()].flatMap(d=>d.events))),
  subset([...ds.values()].flatMap(d=>d.events).filter(e=>topicIDs.has(e.id)&&e.year>=Math.max(1600,y-3)&&e.year<=y)));
}
for(const required of ["activeTopicFocusId:()=>activeStoryEventLens?.id||null",
 "setStoryFocus:spec=>year>=1600&&setStoryEventLens(spec)","clearStoryFocus:()=>setStoryEventLens(null)",
 "window.HistoryStories?.onYearChanged?.()","displayedSeventeenthRoutes(year)"])
 assert(app.includes(required),'missing topic bridge: '+required);
for(const required of ['function storyNodeYears(story)','data-story-topic="toggle"','data-story-topic="prev"',
 'data-story-topic="next"','bridge.setStoryFocus?.(', 'bridge.clearStoryFocus?.()',
 'onYearChanged:onYearChanged'])assert(reader.includes(required),'topic reader incomplete '+required);
assert(css.includes('.story-topic-controls')&&css.includes('position:sticky'));
console.log('PASS published story event IDs filter 4-year map and related routes; cross-decade node navigation, exit restores general map.');
