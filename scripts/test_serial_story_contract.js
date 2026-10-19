/* Cross-century mother-topic contract: old ten-year chapters must remain untouched. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const serial=load('data/stories/serial/index.json');
const chapters=load('data/chapters.json');
const old=load('data/stories/index.json');
const reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert.equal(serial.schema,'atlas-serial-stories-v1');
assert.equal(serial.navigation_contract,'existing_decade_chapters_unchanged');
assert.equal(serial.topics.length,15,'Editor6 must retain 15 source research topic families');
assert.equal(chapters.chapters.length,10,'published 1497-1599 decade chapters must not change');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(old.schema,'atlas-major-stories-index-v1');
assert(reader.includes("data/stories/serial/index.json"),'reader must opt into approved serial registry');
assert(reader.includes('openSerialLibrary'),'standalone long-form library must support publishing before decade events');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(/id="serialStoriesButton"[^>]+hidden/.test(html),'library entry must remain hidden without approved topics');
const seen=new Set();
for(const t of serial.topics){
 assert(/^[A-Za-z0-9-]+$/.test(t.id));
 assert(!seen.has(t.id),'duplicate mother topic ID: '+t.id);seen.add(t.id);
 assert(typeof t.title==='string'&&t.title.length>0);
 assert(Number.isInteger(t.origin_year));
 assert(t.historical_end_year===null||(Number.isInteger(t.historical_end_year)&&t.historical_end_year>=t.origin_year));
 assert(Number.isInteger(t.research_window.start_year)&&Number.isInteger(t.research_window.end_year));
 assert(t.research_window.start_year<=t.research_window.end_year);
 assert(['research_only','editorial_review','published'].includes(t.status));
 assert(Array.isArray(t.event_ids)&&Array.isArray(t.segments));
 assert(Array.isArray(t.predecessor_ids)&&Array.isArray(t.successor_ids));
 const segmentIds=new Set();
 for(const s of t.segments){
  assert(s.id&& !segmentIds.has(s.id));segmentIds.add(s.id);
  assert(Number.isInteger(s.start_year)&&Number.isInteger(s.end_year)&&s.end_year>=s.start_year);
  // decade time slices are a display-only plan; do not cap historic_end_year
  assert(Math.floor(s.start_year/10)===Math.floor(s.end_year/10),'segment must be decade slice');
 }
 for(const s of t.segments){
  for(const k of ['prev_segment_id','next_segment_id'])if(s[k])assert(segmentIds.has(s[k]),'dangling decade slice link '+s[k]);
 }
 if(t.status!=='published')continue;
 assert.equal(t.publication_review,'approved','publication requires explicit editor approval');
 assert.equal(typeof t.article_file,'string');
 assert(/^data\/stories\/serial\/[a-z0-9-]+\.json$/.test(t.article_file));
 const article=load(t.article_file);
 assert.equal(article.id,t.id,'parent and article IDs must match');
 assert(Array.isArray(article.sources)&&article.sources.length>0);
 assert(Array.isArray(article.sections)&&article.sections.length>0);
 for(const s of article.sections){assert(s.id&&Array.isArray(s.paragraphs)&&s.paragraphs.length>0);}
 for(const id of t.event_ids) assert(/^[A-Za-z0-9-]+$/.test(id));
}
assert(!reader.includes('data/stories/serial/atlas-'),'must not fold serial registry into decade atlas');
console.log('PASS: serial story registry,',serial.topics.length,'review families, existing 10 published chapters retained');
