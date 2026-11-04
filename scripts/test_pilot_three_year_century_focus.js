#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const code=read('app.js'),html=read('index.html'),css=read('css/history-stories.css');
const index=JSON.parse(read('data/stories/serial/index.json'));
const article=JSON.parse(read('data/stories/serial/e6-t02-ireland-conquest-land-finance.json'));
const archives=new Map();
for(let d=1600;d<=1690;d+=10)archives.set(d,JSON.parse(read('data/atlas-'+d+'-'+(d+9)+'.json')));
const start=code.indexOf("let eventWindowMode17c='rolling3'");
const end=code.indexOf('function isNewEventThisYear(item)',start);
assert(start>0&&end>start,'three-year helper extraction');
const env={serialPreviewByDecade:archives,atlas:{events:[{id:'legacy-1599',year:1599}]},
 decadeForYear:y=>Math.floor(Number(y)/10)*10};
const api=vm.runInNewContext(code.slice(start,end)+"\n({seventeenthEventWindowStart,seventeenthEventsForWindow,seventeenthRoutesForWindow,setPanorama:v=>{pilotCenturyPanorama17c=v},setTopic:ids=>{pilotTopicFocus17c=ids?{id:'E6-T02',eventIds:new Set(ids)}:null}})",env);
const ids=items=>Array.from(items,v=>v.id).sort();
const factual=(lo,hi)=>[...archives.values()].flatMap(d=>d.events).filter(e=>e.year>=lo&&e.year<=hi);
function verify(year,from,mode='rolling3'){
 assert.equal(api.seventeenthEventWindowStart(year,mode),from);
 const actual=Array.from(api.seventeenthEventsForWindow(year,mode));
 assert.deepEqual(ids(actual),ids(factual(from,year)));
 assert.equal(actual.length,new Set(actual.map(e=>e.id)).size);
 for(const e of actual){
  const archive=archives.get(Math.floor(Number(e.year)/10)*10);
  assert(archive.events.includes(e),'original event object: '+e.id);
  assert((e.source_ids||[]).every(id=>archive.sources.some(s=>s.id===id)),
   'missing source '+e.id);
 }
 return actual;
}
const y1650=verify(1650,1648),y1651=verify(1651,1649);
assert(y1650.some(e=>e.year===1649)&&y1650.some(e=>e.year===1650));
assert(!y1650.some(e=>e.year===1647));
assert(!y1651.some(e=>e.year===1648)&&y1651.some(e=>e.year===1649));
verify(1690,1688);verify(1699,1697);verify(1600,1600);verify(1601,1600);verify(1602,1600);
verify(1650,1650,'year');verify(1656,1650,'decade');
const routes1650=Array.from(api.seventeenthRoutesForWindow(1650));
assert(routes1650.some(e=>e.id==='E6-R1649-DUBLIN-DROGHEDA'));
assert(!Array.from(api.seventeenthRoutesForWindow(1652)).some(e=>e.id==='E6-R1649-DUBLIN-DROGHEDA'));
const topic=index.topics.find(t=>t.id==='E6-T02');
assert(topic.status==='published'&&topic.publication_review==='approved');
assert.equal(article.sections.length,15);
api.setPanorama(true);
assert.deepEqual(ids(api.seventeenthEventsForWindow(1649)),ids(factual(1600,1699)));
assert.equal(api.seventeenthEventsForWindow(1649).length,new Set(factual(1600,1699).map(e=>e.id)).size);
api.setTopic(topic.event_ids);
assert.deepEqual(ids(api.seventeenthEventsForWindow(1649)),
 ids(factual(1600,1699).filter(e=>topic.event_ids.includes(e.id))));
api.setPanorama(false);
const topicWindow=Array.from(api.seventeenthEventsForWindow(1650));
assert(topicWindow.length>0&&topicWindow.every(e=>topic.event_ids.includes(e.id)&&e.year>=1648&&e.year<=1650));
api.setTopic(null);
assert.equal(api.seventeenthEventsForWindow(1599)[0].id,'legacy-1599');
assert(html.includes('id="showRollingThreeYears" aria-pressed="true"'));
assert(html.includes('id="showCenturyEventPanorama"'));
assert(html.includes('id="topicFocusStatus"'));
assert(html.includes('id="pilotLaunchFromHeader"'));
assert(code.includes("if(!occurredByYear(e,year)&&!pilotCenturyPanorama17c)continue;"));
assert(code.includes('pilotOpenHistoricalEvent(item,record.type)'));
assert(css.includes('.workspace.topic-focus')&&css.includes('.atlas-event-future-preview'));
assert(!code.slice(code.indexOf('function setYear(v){'),code.indexOf('function stopPlay(){')).includes('map.flyTo('));
console.log('PASS 3-year 1648-50, cross-decade 1649-51, 100-year data, source-linked topic, 1599 unchanged');
