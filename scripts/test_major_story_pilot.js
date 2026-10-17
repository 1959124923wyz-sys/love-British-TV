#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=JSON.parse(read('data/stories/index.json'));
assert.equal(index.schema,'atlas-major-stories-index-v1');
assert.ok(index.stories.length>=2,'both Munster and Scottish war must be present');
assert.equal(new Set(index.stories.map(x=>x.id)).size,index.stories.length,'story IDs must be unique');
const eventIndex=new Map();
for(const period of ['1497-1509','1510-1519','1520-1529','1530-1539','1540-1549','1550-1559','1560-1569','1570-1579','1580-1589','1590-1599']){
 for(const e of JSON.parse(read('data/atlas-'+period+'.json')).events)eventIndex.set(e.id,e);
}
let linked=0,allSources=0,totalChars=0,allEvents=0;
const usedEventIds=new Map();
for(const meta of index.stories){
 const story=JSON.parse(read(meta.file));
 assert.equal(story.schema,'atlas-major-story-v1');
 assert.equal(story.id,meta.id);
 assert.equal(story.start_year,meta.start_year);
 assert.equal(story.end_year,meta.end_year);
 assert.ok(story.start_year<=story.end_year,'Single-year historic documentary narratives are permitted');
 assert.ok(story.sections.length>=8,'multi-stage historical narrative');
 assert.ok(story.lead.length>=120,'explain the significance without boilerplate');
 const paragraphs=story.sections.flatMap(s=>s.paragraphs);
 assert.ok(paragraphs.join('').length>=3000,meta.id+': too little narrative');
 totalChars+=paragraphs.join('').length;
 assert.ok(story.sources.length>=5,'historical references required');
 const sources=new Map(story.sources.map(s=>[s.id,s]));
 assert.equal(sources.size,story.sources.length);
 allSources+=story.sources.length;
 for(const s of story.sources){
  assert.match(s.url,/^https:\/\/[^/]+\/(?:.*)?$/,'HTTPS host root paths are valid references');
  assert.ok(s.access,'disclose whether full scholarly work was available');
 }
 assert.equal(new Set(meta.event_ids).size,meta.event_ids.length,meta.id+': duplicate event');
 if(meta.id==='munster-plantation-land-grants-and-aftermath-1584-1589'){
  assert.ok(meta.event_ids.every(id=>story.related_event_ids.includes(id)),'Munster companion links must not steal original story ownership');
 }else assert.deepEqual(new Set(meta.event_ids),new Set(story.related_event_ids),'manifest parity');
 allEvents+=meta.event_ids.length;
 for(const id of meta.event_ids){
  assert.ok(eventIndex.has(id),'Story points to nonexistent official event: '+id);
  const prev=usedEventIds.get(id)||[];
  if(prev.length)assert.equal(id,'1580S-E029','Only approved 1586 Munster charter may share two stories');
  usedEventIds.set(id,[...prev,meta.id]);
  const e=eventIndex.get(id);
  assert.ok((e.year>=story.start_year&&e.year<=story.end_year)||(story.historical_context_event_ids?.includes(id)&&e.year<story.start_year&&e.year>=story.start_year-3),meta.id+': event outside article period '+id);
 }
 const sectionIds=new Set();
 let localLinks=0;
 for(const section of story.sections){
  assert.ok(section.id && section.heading && section.paragraphs.length>=2);
  assert.ok(!sectionIds.has(section.id),'duplicate section heading id');
  sectionIds.add(section.id);
  assert.ok(section.source_keys.length>=1);
  for(const key of section.source_keys)assert.ok(sources.has(key),'Unknown source key: '+key);
  for(const p of section.paragraphs){
   for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
    linked++;localLinks++;
    assert.ok(eventIndex.has(m[1]),'Unknown story event link: '+m[1]);
    assert.ok(meta.id==='munster-plantation-land-grants-and-aftermath-1584-1589'?story.related_event_ids.includes(m[1]):meta.event_ids.includes(m[1]),'Unindexed inline link '+m[1]);
    assert.ok(m[2].length>1);
   }
   assert.ok(!/<script|onerror\s*=|javascript:/i.test(p));
  }
 }
 assert.ok(localLinks>=(['munster-plantation-land-grants-and-aftermath-1584-1589','roanoke-colony-native-conflict-disappearance-1585-1590'].includes(meta.id)?6:Math.min(12,meta.event_ids.length)),'Longform must contain meaningful map links');
 console.log('PASS story',meta.id,story.sections.length,'sections,',paragraphs.join('').length,'characters,',localLinks,'inline links,',meta.event_ids.length,'events');
}
assert.deepEqual(usedEventIds.get('1580S-E029'),[
 'munster-desmond-1579-1586','munster-plantation-land-grants-and-aftermath-1584-1589'
],'One real 1586 land-grant event must offer two non-duplicated histories');
const scottish=index.stories.find(x=>x.id==='rough-wooing-anglo-scottish-war-1543-1550');
assert.ok(scottish,'Scottish longform missing');
assert.ok(scottish.event_ids.includes('1540S-004')&&scottish.event_ids.includes('1550S-E001'));
assert.ok(scottish.event_ids.includes('GAP1545-ANCRUM')&&scottish.event_ids.includes('1540S-019'));
const ui=read('js/history-stories.js'),app=read('app.js'),html=read('index.html');
assert.ok(html.includes('js/history-stories.js')&&html.includes('css/history-stories.css'));
assert.ok(html.indexOf('js/history-stories.js')>html.indexOf('app.js?'));
assert.ok(ui.includes('data-story-event')&&ui.includes('story-event-preview')&&ui.includes('data-story-back'));
assert.ok(ui.includes("document.addEventListener('dblclick'")&&ui.includes("document.addEventListener('click'"));
assert.ok(ui.includes('readingScroll=activeBody().scrollTop'));
assert.ok(ui.includes('navigateToEventYear(item)'));
assert.ok(ui.includes('showUnlocatedPreview(item,anchor)'));
assert.ok(!ui.includes('function showStatus('));
assert.ok(!ui.includes('data-story-year'));
assert.ok(app.includes('window.HistoryStories?.eventLinkMarkup'));
assert.ok(app.includes('window.HistoryStories?.onEventOpened'));
assert.ok(app.includes("(storyChild?'':listSources(item.source_ids,item))"));
assert.ok(ui.includes('closePreview()')&&ui.includes("e.key==='Escape'"));
assert.ok(ui.includes('data-story-source')&&ui.includes('sourceEventId'),'Returning to exact child must remain possible');
assert.ok(ui.includes("storyByEvent.get(item.id)||[]")&&ui.includes('metas.length===1'),'Multi-story card must remain simple for single-story events');
console.log('PASS history library: ',index.stories.length,'articles',totalChars,'characters',linked,'inline links',allEvents,'event relations',allSources,'source references');
