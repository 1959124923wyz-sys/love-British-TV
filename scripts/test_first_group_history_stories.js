#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/stories/index.json');
const first=read('data/atlas-1497-1509.json'),third=read('data/atlas-1510-1519.json');
const map=new Map([...first.events,...third.events].map(x=>[x.id,x]));
const owned=new Map();
const keys=['cabot-bristol-atlantic-voyages-1496-1498','kildare-gaelic-lordship-wars-1503-1519'];
for(const id of keys){
 const meta=index.stories.find(s=>s.id===id);assert(meta,id+' missing in major story index');
 const article=read(meta.file);
 assert.equal(article.id,id);assert.equal(article.title,meta.title);
 assert.deepEqual(new Set(article.related_event_ids),new Set(meta.event_ids));
 assert(article.sources.length>=5&&article.sections.length>=8);
 assert(article.sections.flatMap(x=>x.paragraphs).join('').length>=3000);
 const srcs=new Set(article.sources.map(s=>s.id));
 let clickable=0;
 for(const section of article.sections){
  for(const key of section.source_keys)assert(srcs.has(key),'missing scholarly source '+key);
  for(const para of section.paragraphs)for(const [,eid]of para.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)){
   assert(map.has(eid),'unknown official event '+eid);clickable++;
  }
 }
 assert(clickable>=12);
 for(const eid of meta.event_ids){
  assert(map.has(eid),'not a published event: '+eid);
  assert(!owned.has(eid),'event claimed by two new stories '+eid);
  owned.set(eid,id);
 }
}
const cabot=index.stories.find(s=>s.id===keys[0]);
assert.equal(cabot.start_year,1496);
assert(cabot.event_ids.includes('patent-1496'));
assert(!first.colonial_polygons.some(x=>/north america|cabot|canada|newfoundland/i.test(JSON.stringify(x))));
const patent=map.get('patent-1496'),landfall=map.get('landfall-1497');
assert.equal(patent.year,1496);
assert.equal(landfall.actual_English_territory_created,false);
assert.match(landfall.geo_precision,/hypothetical/);
assert.match(landfall.geography_label,/不是实测登陆点/);
const multi=map.get('1504-OKELLY-CASTLES');
assert.match(multi.geo_precision,/multi_site/);
assert.match(multi.description,/乌利克·伯克/);
assert.equal(multi.actual_English_territory_created,false);
assert.equal(third.events.length,18,'15 older and three new sourced records');
const newIds=['KILDARE1512-ROSCOMMON','KILDARE1512-DUNGANNON-ODONNELL','KILDARE1516-KILLYBEGS-CANNON-SHIP'];
for(const id of newIds){
 const e=map.get(id);assert(e,id);
 assert(owned.get(id)===keys[1]);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.actual_English_territory_created,false);
 assert(e.source_ids.includes('UCC-FOURMASTERS-1510s'));
}
assert.equal(new Set(third.events.map(e=>e.id)).size,third.events.length);
assert.equal(third.colonial_polygons.length,0);
assert(first.events.every(x=>x.actual_English_territory_created!==true),'unexpectedly fabricated Cabot acquisition');
console.log('PASS first batch: 2 sourced articles, restored 1496 legal-vs-contact difference, 18 Irish decade events, 3 new region-safe named points');
