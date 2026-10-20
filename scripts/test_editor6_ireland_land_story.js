'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/stories/serial/index.json');
const story=read('data/stories/serial/e6-t03-ireland-land-1642-1698.json');
const me=index.topics.find(t=>t.id===story.id),mother=index.topics.find(t=>t.id==='E6-T03');
assert(mother&&mother.status==='research_only'&&!mother.article_file,'long E6-T03 parent stays research');
assert(me&&me.status==='published'&&me.publication_review==='approved'&&me.parent_topic_id==='E6-T03');
assert.equal(story.sections.length,11);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=4000);
assert(story.sources.length>=12);
assert(story.topic_source_claims.length>=11);
assert(story.related_event_ids.length>=25);
let events=new Map;
for(let y=1600;y<=1690;y+=10){
 const atlas=read('data/atlas-'+y+'-'+(y+9)+'.json');
 assert.deepEqual(atlas.colonial_polygons,[],'new story cannot manufacture control polygons');
 for(const e of atlas.events)events.set(e.id,e);
}
for(const id of story.related_event_ids)assert(events.has(id),'story related event missing '+id);
assert.equal(new Set(story.related_event_ids).size,story.related_event_ids.length,'duplicate event link');
const sources=new Set(story.sources.map(s=>s.id));
assert.equal(sources.size,story.sources.length);
for(const section of story.sections){
 assert(section.period_start_year>=story.start_year&&section.period_end_year<=story.end_year);
 assert(section.paragraphs.length>=3,'complete public storyline required');
 for(const id of section.source_keys)assert(sources.has(id));
}
assert(story.reading_note.includes('1641/1670'),'survey benchmark caution must remain');
assert(story.map_note.includes('不')&&story.map_note.includes('边界'),'cannot claim precise unsurveyed borders');
assert(!read('data/chapters.json').chapters.some(x=>x.start>=1600),'old chapters unchanged');
console.log('PASS: 11-section sourced Ireland confiscation story + 27 current events; no invented land polygons');
