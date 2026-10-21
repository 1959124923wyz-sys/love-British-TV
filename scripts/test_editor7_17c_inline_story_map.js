'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const base='data/stories/serial/';
const expected={'E6-T03-LAND-1642-1698':23,'E6-T04-GLENCOE':8,'E6-T07-BARBADOS':12,'E6-T12':21,'E6-T13':13};
const index=json(base+'index.json'),lookups=new Map;
for(let y=1600;y<=1690;y+=10){
 let d=json('data/atlas-'+y+'-'+(y+9)+'.json');
 for(const e of d.events){assert(!lookups.has(e.id));lookups.set(e.id,e);}
}
for(const e of json(base+'chronology-preview-1600-1699.json').events||[]){
 if(!lookups.has(e.id))lookups.set(e.id,e);
}
let allLinks=0;
for(const [topicId,minLinks] of Object.entries(expected)){
 const meta=index.topics.find(x=>x.id===topicId);
 assert(meta&&meta.status==='published'&&meta.publication_review==='approved',topicId+' must be published');
 const story=json(meta.article_file);
 assert.equal(story.id,topicId);
 const found=new Set,links=[];
 for(const section of story.sections){
  for(const paragraph of section.paragraphs){
   const rx=/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g;
   for(const match of paragraph.matchAll(rx)){
    const item=lookups.get(match[1]);
    assert(item,topicId+': unresolved inline event '+match[1]);
    assert(Number.isInteger(item.year)&&item.year>=1600&&item.year<=1699,'link outside 17c year');
    assert(Number.isFinite(item.lat)&&Number.isFinite(item.lng),'linked map item lacks a verified reference point');
    assert(match[2].trim()!==''&&!/地图定位|点击这里|了解更多/.test(match[2]),'must annotate meaningful historical prose');
    links.push({id:match[1],section:section.id,name:match[2]});
    found.add(section.id);
   }
   assert.equal((paragraph.match(/\[\[/g)||[]).length,(paragraph.match(/\]\]/g)||[]).length,'malformed markup');
  }
 }
 assert(links.length>=minLinks,topicId+' missing 16c-style inline links');
 assert(found.size>=Math.min(4,story.sections.length),'inline map navigation must cover meaningful parts of public text');
 if(topicId==='E6-T04-GLENCOE'){
  assert(meta.event_ids.includes('1690S-E027')&&meta.event_ids.includes('1690S-E049')&&meta.event_ids.includes('1690S-E050'),'1692 and 1695 entry continuity');
 }
 if(topicId==='E6-T13')assert(!meta.event_ids.includes('1690S-E024'),'RAC link to distinct Hannibal dossier must not claim corporate affiliation');
 allLinks+=links.length;
}
const bridge=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(bridge.includes('...serialPreviewByDecade.values()'),'link lookup must contain all 1600–1699 decades');
const reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
for(const code of ['data-story-event','focusStoryEvent','navigateToEventYear','map.panTo']) {
 assert(reader.includes(code)||bridge.includes(code),'must retain actual historic map navigation: '+code);
}
const old=json('data/stories/drake-panama-mule-train-raid-1572-1573.json');
assert(old.sections.flatMap(s=>s.paragraphs).some(p=>p.includes('[[1570S-E004|')),'16th inline reader reference must survive');
console.log('PASS: '+allLinks+' in-paragraph 17C historic event links across 5 published stories; no invented event IDs, 16C reader preserved');
