'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/stories/serial/index.json');
const topic=index.topics.find(t=>t.id==='E6-T06');
const story=read('data/stories/serial/e6-t06-new-england-indigenous-wars.json');
assert(topic&&topic.status==='published'&&topic.publication_review==='approved','new native history may only enter published registry with sources audited');
assert.equal(topic.article_file,'data/stories/serial/e6-t06-new-england-indigenous-wars.json');
assert.equal(story.schema,'atlas-major-story-v1');
assert.equal(story.start_year,1620);
assert.equal(story.end_year,1679);
assert.equal(story.historical_end_year,null,'suppress false assertion that Indigenous land struggles ended');
assert.equal(story.sections.length,12);
assert.equal(story.sources.length,11);
assert.equal(story.topic_source_claims.length,12);
assert.equal(story.sections.flatMap(x=>x.paragraphs).join('').length>=4200,true);
const known=new Map();
for(let decade=1600;decade<=1690;decade+=10)
 for(const e of read('data/atlas-'+decade+'-'+(decade+9)+'.json').events)known.set(e.id,e);
const links=[];
for(const sect of story.sections){
 assert(sect.source_keys.every(k=>story.sources.some(s=>s.id===k)));
 assert(sect.paragraphs.length>=2);
 for(const p of sect.paragraphs)
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]]+)\]\]/g)){
   const event=known.get(m[1]);
   assert(event,'historical link cannot invent event '+m[1]);
   assert(Number.isFinite(event.lat)&&Number.isFinite(event.lng),'no fabricated camera focus for '+m[1]);
   assert(!/^(?:1[5-9]\d{2})(?:年(?:\d{1,2}月(?:\d{1,2}日)?)?)?$/.test(m[2]),'link anchor may not be a bare year '+m[2]);
   assert(m[2].length>=4,'link anchor needs specific event meaning');
   links.push(m[1]);
  }
}
assert.equal(links.length,34,'New England story loses event backlinks');
assert.equal(new Set(links).size,33);
assert.deepEqual(new Set(topic.event_ids),new Set(links));
for(const key of ['1630S-E011','1630S-E016','1650S-E009','1660S-E032','1670S-E017','1670S-E019','1670S-E041','1670S-E048','1670S-E061','1670S-E063'])
 assert(links.includes(key),'Native war, survival, captive or family case missing: '+key);
for(const x of story.sources)assert(x.url.startsWith('https://')&&!x.access.includes('placeholder'));
assert(story.sources.some(x=>x.url==='https://www.mptn-nsn.gov/history/'));
assert(story.sources.some(x=>x.url==='https://www.nps.gov/rowi/learn/historyculture/kingphilip.htm'));
assert(story.sources.some(x=>x.url==='https://www.colonialsociety.org/node/1397'));
const points=read('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const regions=read('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(points.features.length,73);assert.equal(regions.features.length,20);
const indigenous=points.features.filter(f=>f.properties.related_story_ids?.includes('E6-T06'));
assert.equal(indigenous.length,10,'new story source-attested geography cues must not silently shrink');
for(const p of indigenous){
 assert.equal(p.geometry.type,'Point');
 assert(p.properties.related_event_ids?.length>0);
 const ev=known.get(p.properties.related_event_ids[0]);
 assert(ev,'cue missing recorded atlas event');
 assert.deepEqual(p.geometry.coordinates,[ev.lng,ev.lat],'never invent alternative geographic coordinates');
 assert.equal(p.properties.start_year,ev.year);
 assert.equal(p.properties.display_through_year,ev.year);
 assert.equal(p.properties.historical_boundary_confirmed,false);
 assert.equal(p.properties.fill_authorized,false);
 assert.equal(p.properties.territorial_claim,false);
 assert.equal(p.properties.area_sqkm,null);
 assert.equal(p.properties.exclude_from_area_aggregation,true);
}
const battle=regions.features.find(f=>f.id==='17c-ne-pequot-war-saybrook-mystic-1637-study');
assert(battle&&battle.geometry.type==='Polygon');
assert.deepEqual(battle.properties.related_event_ids,['1630S-E010','1630S-E011','1630S-E012']);
assert.equal(battle.properties.start_year,1637);
assert.equal(battle.properties.end_year,1637);
assert.equal(battle.properties.area_sqkm,null);
assert.equal(battle.properties.territorial_claim,false);
assert.equal(battle.properties.fill_authorized,false);
assert(battle.properties.mapping_method.includes('NOT a surveyed'));
assert(!read('data/atlas-1630-1639.json').colonial_polygons.length,'schematic study region cannot become English sovereignty');
assert(!read('data/atlas-1670-1679.json').colonial_polygons.length);
const js=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(js.includes('function renderInline(text)')&&js.includes('function doubleOpen(item)'));
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('map.panTo(position,{animate:true'));
console.log('PASS E6-T06 New England: 12 stages, 11 public sources, 12 audited claims, 34 natural event links, 10 accurate one-year symbolic site cues, 1 not-surveyed dotted reading range, no colony area');
