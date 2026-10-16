#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=JSON.parse(read('data/stories/index.json'));
assert.equal(index.schema,'atlas-major-stories-index-v1');
assert.equal(index.stories.length,1,'pilot must not alter other historic chapters');
const meta=index.stories[0],story=JSON.parse(read(meta.file));
assert.equal(story.id,meta.id);
assert.equal(story.sections.length,9);
assert.equal(story.start_year,1579);
assert.equal(story.end_year,1586);
assert.ok(story.lead.length>=120);
const paragraphs=story.sections.flatMap(s=>s.paragraphs);
assert.ok(paragraphs.join('').length>=3000,'pilot should have substantive sourced long-form history');
assert.ok(story.sources.length>=5);
const sources=new Map(story.sources.map(s=>[s.id,s]));
assert.equal(sources.size,story.sources.length);
for(const s of story.sources){assert.match(s.url,/^https:\/\/[^/]+\/.+/);assert.ok(s.access);}
let linked=0;
const eventIndex=new Map();
for(const period of ['1570-1579','1580-1589']){
 const atlas=JSON.parse(read('data/atlas-'+period+'.json'));
 for(const e of atlas.events)eventIndex.set(e.id,e);
}
assert.ok(meta.event_ids.length>=12);
for(const id of meta.event_ids){assert.ok(eventIndex.has(id),'Story points to nonexistent official event: '+id);}
for(const section of story.sections){
 assert.ok(section.id && section.heading && section.paragraphs.length>=2);
 assert.ok(section.source_keys.length>=1);
 for(const key of section.source_keys)assert.ok(sources.has(key),'Unknown bibliographic entry: '+key);
 for(const p of section.paragraphs){
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   linked++;
   assert.ok(eventIndex.has(m[1]),'Unknown story event link: '+m[1]);
   assert.ok(meta.event_ids.includes(m[1]),'Event link not present in story index: '+m[1]);
   assert.ok(m[2].length>1);
  }
  assert.ok(!/<script|onerror\s*=|javascript:/i.test(p));
 }
}
assert.ok(linked>=12,'Interactive inline event references missing');
const ui=read('js/history-stories.js'),app=read('app.js'),html=read('index.html');
assert.ok(html.includes('js/history-stories.js')&&html.includes('css/history-stories.css'));
assert.ok(html.indexOf('js/history-stories.js')>html.indexOf('app.js?'),'Story must load after core atlas');
assert.ok(ui.includes('data-story-event')&&ui.includes('story-event-preview')&&ui.includes("data-story-back"));
assert.ok(ui.includes("document.addEventListener('dblclick'")&&ui.includes("document.addEventListener('click'"));
assert.ok(ui.includes('readingScroll=activeBody().scrollTop'));
assert.ok(app.includes('if(!options.keepDossier)openDossier(item'));
assert.ok(app.includes('window.HistoryStories?.eventLinkMarkup'));
assert.ok(app.includes('window.HistoryStories?.onEventOpened'));
assert.ok(ui.includes('navigateToEventYear(item)'), 'Article inline events must own explicit year navigation');
assert.ok(ui.includes('showUnlocatedPreview(item,anchor)'), 'Coordinate-free events must show a small card');
assert.ok(!ui.includes('function showStatus('), 'Old story status banners must not return');
assert.ok(!ui.includes('data-story-year'), 'Manual advance link must be replaced by direct event navigation');
assert.ok(app.includes("(storyChild?'':listSources(item.source_ids,item))"), 'Only subevents already linked to major stories omit duplicated source dossier');
assert.ok(ui.includes('closePreview()')&&ui.includes("e.key==='Escape'"));
console.log('PASS Major story pilot:',story.sections.length,'sections,',paragraphs.join('').length,'characters,',linked,'inline event links,',meta.event_ids.length,'linked existing events');

