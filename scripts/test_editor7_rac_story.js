'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const list=read('data/stories/serial/index.json');
const topic=list.topics.find(x=>x.id==='E6-T13');
const story=read('data/stories/serial/e6-t13-royal-african-company.json');
assert(topic&&topic.status==='published'&&topic.publication_review==='approved');
assert(topic.article_file==='data/stories/serial/e6-t13-royal-african-company.json');
assert.deepEqual(topic.event_ids,story.related_event_ids);
assert.equal(story.schema,'atlas-major-story-v1');
assert.equal(story.sections.length,13);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>3800);
assert(story.sources.length>=16);
assert.equal(story.topic_source_claims.length,13);
assert.equal(story.historical_end_year,null,'1698 is a monopoly transition, not company extinction');
const keys=new Set(story.sources.map(x=>x.id));
assert.equal(keys.size,story.sources.length);
for(const s of story.sections){
 assert(s.period_start_year>=1618&&s.period_end_year<=1698);
 assert(s.paragraphs.length>=3);
 for(const k of s.source_keys)assert(keys.has(k),'source missing '+k);
}
assert(!story.related_event_ids.includes('1690S-E024'),'unattributed Hannibal voyage must not be claimed as RAC ship');
const events=new Map;
for(let d=1610;d<=1690;d+=10){
 let a=read('data/atlas-'+d+'-'+(d+9)+'.json');
 assert.deepEqual(a.colonial_polygons,[],'trade charter cannot fill coast-wide empire');
 for(const e of a.events)events.set(e.id,e);
}
assert(story.related_event_ids.length>=20);
for(const id of story.related_event_ids)assert(events.has(id),'RAC story event ID not in main decade '+id);
assert.equal(events.get('1661S-E045').year,1665);
assert.equal(events.get('1661S-E045').lat,5.2025,'Kormantin modern fort site corrected');
assert.equal(events.get('1661S-E045').lng,-1.090278);
const g=read('data/seventeenth-century-spatial-evidence-1610-1699.geojson');
assert.equal(g.features.length,61);
for(const id of ['rac-cormantin-fort-dutch-capture-1665','rac-cape-coast-castle-1665']){
 const f=g.features.find(x=>x.id===id);
 assert(f&&f.geometry.type==='Point'&&f.properties.source_urls.length>0);
 assert.equal(f.properties.territorial_claim,false);
 assert.equal(f.properties.area_sqkm,null);
 assert.equal(f.properties.exclude_from_area_aggregation,true);
}
assert(list.topics.find(x=>x.id==='E6-T11').status==='research_only','do not auto-publish separate slave-voyage research family');
console.log('PASS: Royal African Company 13 sections, 16 sources, 22 linked existing events, 2 distinct Ghana sites, no fabricated slave voyage/colonial border');
