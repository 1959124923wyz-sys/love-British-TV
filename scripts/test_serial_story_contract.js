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
assert.deepEqual(serial.topics.filter(t=>t.status==='published').map(t=>t.id).sort(),['E6-T04-GLENCOE','E6-T07-BARBADOS','E6-T12'],'only the three explicitly audited stories may publish');
const canonicalFamilies=Array.from({length:15},(_,i)=>'E6-T'+String(i+1).padStart(2,'0'));
const knownIds=new Set(serial.topics.map(t=>t.id));
assert.equal(knownIds.size,serial.topics.length,'unique IDs required');
for(const id of canonicalFamilies)assert(knownIds.has(id),'missing original mother family: '+id);
assert(serial.topics.length>=15,'may grow by reviewed subtopic additions');
const glencoe=serial.topics.find(t=>t.id==='E6-T04-GLENCOE');
assert(glencoe && glencoe.parent_topic_id==='E6-T04','approved Glencoe subtopic ID must link to unchanged Scottish parent');
assert(glencoe.status==='published' && glencoe.publication_review==='approved' && glencoe.article_file==='data/stories/serial/e6-t04-glencoe.json','Glencoe publication requires explicitly approved existing article file');
assert.deepEqual(glencoe.event_ids,['E6-GLENCOE-1692'],'1692 year slider is the only published Glencoe entry');
const barbados=serial.topics.find(t=>t.id==='E6-T07-BARBADOS');
assert(barbados&&barbados.parent_topic_id==='E6-T07'&&barbados.status==='published'&&barbados.publication_review==='approved');
assert(barbados.event_ids.length>=8,'Barbados topic must connect across multiple decades');
const eastIndia=serial.topics.find(t=>t.id==='E6-T12');
assert(eastIndia&&eastIndia.status==='published'&&eastIndia.publication_review==='approved');
assert(eastIndia.event_ids.length>=30,'EIC long story must be joined to the actual historic event records');
assert.equal(chapters.chapters.length,10,'published 1497-1599 decade chapters must not change');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(old.schema,'atlas-major-stories-index-v1');
assert(reader.includes("data/stories/serial/index.json"),'reader must opt into approved serial registry');
assert(!reader.includes('openSerialLibrary'),'do not create a separate long-story catalog');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!html.includes('serialStoriesButton'),'top header must remain as in historical map design');
const seen=new Set();
for(const t of serial.topics){
 assert(/^[A-Za-z0-9-]+$/.test(t.id));
 assert(!seen.has(t.id),'duplicate topic ID: '+t.id);seen.add(t.id);
 if(t.parent_topic_id)assert(knownIds.has(t.parent_topic_id)&&t.parent_topic_id!==t.id,'orphan or circular direct parent ID');
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
 assert.equal(article.schema,'atlas-major-story-v1');
 assert.equal(typeof article.start_year,'number');
 assert.equal(typeof article.end_year,'number');
 assert(article.start_year<=article.end_year);
 assert(Array.isArray(article.sources)&&article.sources.length>=5);
 assert(Array.isArray(article.sections)&&article.sections.length>=8,'public story must contain full narrative stages');
 assert(typeof article.lead==='string'&&article.lead.length>=120);
 assert(article.sections.flatMap(s=>s.paragraphs).join('').length>=3000,'public major-story baseline: 3000 narrative characters');
 const sourceKeys=new Set(article.sources.map(s=>s.id));
 assert.equal(sourceKeys.size,article.sources.length,'duplicate source ID');
 for(const source of article.sources){
  assert(typeof source.url==='string'&&source.url.startsWith('https://'),'original source URL required');
  assert(source.access&&!source.access.includes('placeholder'),'do not publish unverified source placeholders');
 }
 if(t.parent_topic_id)assert.equal(article.parent_serial_topic_id,t.parent_topic_id,'article must link to approved series parent');
 const sections=new Set();
 for(const sec of article.sections){
  assert(sec.id&&sec.heading&&Array.isArray(sec.paragraphs)&&sec.paragraphs.length>=2);
  assert(!sections.has(sec.id),'duplicate section ID');sections.add(sec.id);
  assert(sec.period_start_year>=article.start_year&&sec.period_end_year<=article.end_year,'section date range differs from article period');
  assert(sec.period_start_year<=sec.period_end_year,'invalid section date interval');
  assert(Array.isArray(sec.source_keys)&&sec.source_keys.length>0);
  for(const key of sec.source_keys)assert(sourceKeys.has(key),'section uses missing source key: '+key);
  for(const paragraph of sec.paragraphs){
   assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(paragraph),'work-in-progress editorial notes are not public prose');
  }
 }
 assert(Array.isArray(article.topic_source_claims)&&article.topic_source_claims.length>0,'claim matrix must ship with article');
 for(const claim of article.topic_source_claims){
  assert(sections.has(claim.section_id),'claim references missing section');
  assert(Array.isArray(claim.source_keys)&&claim.source_keys.length>0);
  for(const key of claim.source_keys)assert(sourceKeys.has(key),'claim references missing source: '+key);
  assert(claim.original_document_page||claim.verification_depth,'claim location or access depth missing');
 }
 assert(Array.isArray(t.event_ids),'topic event IDs are independent of long-form publication');
 for(const id of t.event_ids) assert(/^[A-Za-z0-9-]+$/.test(id));
}
assert(!reader.includes('data/stories/serial/atlas-'),'must not fold serial registry into decade atlas');
console.log('PASS: serial story registry,',serial.topics.length,'review families, existing 10 published chapters retained');

const preview=load('data/stories/serial/chronology-preview-1600-1699.json');
assert.equal(preview.schema,'atlas-serial-chronology-preview-v1');
assert.equal(preview.from_year,1600);assert.equal(preview.to_year,1699);
assert.equal(preview.events.length,1,'only documented 1692 event may appear before full 17c audit');
assert.equal(preview.events[0].year,1692);
assert.equal(preview.events[0].id,'E6-GLENCOE-1692');
assert.equal(preview.events[0].historical_control_boundary_verified,false);
assert.equal(preview.events[0].actual_English_land_area_sqkm,null);
assert(!preview.colonial_polygons.length,'no fabricated 17c sovereignty polygons');
assert.equal(preview.events[0].geo_precision,'historic_house_site_approximate_100m_not_all_massacre_sites');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes("function setYear(v)"),'preserve original year slider');
assert(app.includes("storyPreviewChapterForDecade"),'continue to use ten-year chapters');
assert(app.includes("serialPreviewByDecade.get(decadeForYear(next))"),'year slider must select 17c decade');
assert(!html.includes('长期专题</button>'),'no new header feature');
