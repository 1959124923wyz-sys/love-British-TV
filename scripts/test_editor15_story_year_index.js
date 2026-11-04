#!/usr/bin/env node
'use strict';
// Editor15: test the actual production chronology renderer with real source IDs.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('data/stories/serial/index.json'));
const available=new Map();
for(let d=1600;d<=1690;d+=10){
 const file=JSON.parse(read('data/atlas-'+d+'-'+(d+9)+'.json'));
 for(const e of file.events){
  assert(!available.has(e.id),'17C event ID must not be duplicated '+e.id);
  available.set(e.id,e);
 }
}
const topics=manifest.topics.filter(t=>t.status==='published'&&t.publication_review==='approved');
assert(topics.length>=20,'published serial-story inventory missing');
const metas=new Map(topics.map(t=>[t.id,{...t,is_serial_topic:true}]));
const code=read('js/history-stories.js');
const start=code.indexOf('function storyChronologyHtml(article){'),end=code.indexOf('function storyHtml(article){',start);
assert(start>0&&end>start,'optional chronology renderer must be isolated before storyHtml');
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const render=vm.runInNewContext(code.slice(start,end)+'\nstoryChronologyHtml',{
 storyMeta:metas,eventInMemory:id=>available.get(id)||null,esc,eventHeadline:item=>item.name
});
let reviewed=0;
for(const meta of topics){
 const availableIds=[...new Set(meta.event_ids||[])].filter(id=>available.has(id));
 const html=render({id:meta.id});
 if(availableIds.length<2){assert.equal(html,'');continue;}
 reviewed++;
 assert(html.includes('class="story-chronology"'),meta.id+': missing year index');
 assert(!html.includes('data-story-year'),'year navigation must use verified event IDs, not synthetic year-only records');
 assert(!html.includes('undefined年'),'not all chronology years have a source');
 for(const id of availableIds){
  assert(html.includes('data-story-index-event="'+esc(id)+'"'),meta.id+': missing linked event '+id);
 }
 const years=[...new Set(availableIds.map(id=>available.get(id).year))];
 for(const y of years)assert(html.includes(y+'年'),meta.id+': missing observed year '+y);
 assert.equal((html.match(/data-story-index-event="/g)||[]).length,availableIds.length,
  meta.id+': every verified source is linked exactly once');
}
assert(reviewed>=20,'expected multi-event 17C topics');
const cross=render({id:'E6-T02'});
assert(cross.includes('1640年代')&&cross.includes('1650年代'),
 '1641-1670 Ireland topic crosses decade boundaries without splitting the story');
assert.equal(render({id:'cabot-bristol-atlantic-voyages-1496-1498'}),'',
 'pre-1600 articles must not acquire new chronology UI');
assert(code.includes('relatedMarkup+storyChronologyHtml(article)+quantitativeHistoryHtml(article)+'),
 'chronology belongs to long story reader, not the world event map');
console.log('PASS Editor15 story-year source index: '+reviewed+' published 17C topics, all original event IDs preserved');
