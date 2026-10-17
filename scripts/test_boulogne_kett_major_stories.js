#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),j=p=>JSON.parse(read(p));
const idx=j('data/stories/index.json').stories,old=j('data/atlas-1540-1549.json'),later=j('data/atlas-1550-1559.json'),notes=j('data/historical-detail-notes.json').records;
const editorial=read('js/history-stories.js');
const all=new Map([...old.events,...later.events].map(x=>[x.id,x]));
assert.ok(idx.length>=22,'Previously published historical stories must remain');
const cases=[
 {id:'boulogne-tudor-conquest-colonisation-withdrawal-1544-1550',start:1544,end:1550,minimumEvents:16},
 {id:'kett-rebellion-norfolk-enclosures-royal-repression-1549',start:1549,end:1549,minimumEvents:10}
];
for(const t of cases){
 const m=idx.find(s=>s.id===t.id);assert(m,'new story absent');
 const a=j(m.file),txt=a.sections.flatMap(s=>s.paragraphs).join('');
 assert.equal(a.start_year,t.start);assert.equal(a.end_year,t.end);
 assert(a.sections.length>=10&&txt.length>=3000&&a.lead.length>=120);
 assert(a.sources.length>=7);
 assert(a.related_event_ids.length>=t.minimumEvents);
 assert.deepEqual(new Set(a.related_event_ids),new Set(m.event_ids));
 const sourceIds=new Set(a.sources.map(s=>s.id));
 let links=0;for(const s of a.sections){
  assert(s.paragraphs.length>=2&&s.source_keys.every(k=>sourceIds.has(k)));
  for(const p of s.paragraphs)for(const mm of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
   links++;assert(m.event_ids.includes(mm[1]),'unowned story link '+mm[1]);
  }
 }
 assert(links>=12,'not enough inline historical event links');
 for(const id of a.related_event_ids)assert(all.has(id),'missing event '+id);
}
assert.equal(old.events.length,106);assert.equal(old.sources.length,143);
assert.equal(later.events.find(x=>x.id==='1550S-E003').year,1550);
assert.equal(later.events.find(x=>x.id==='1550S-E004').year,1550);
assert.equal(all.get('1540S-033').year,1549,'Ambleteuse French recapture');
assert.equal(all.get('1540S-036').category,'resistance','French Outreau must not be mapped as English fort');
assert.equal(all.get('1540S-040').lat,null,'English 1546 population controls have no precise street address');
for(const id of ['KET1549-BISHOPS-BRIDGE','KET1549-PALACE-PLAIN']){
 const e=all.get(id);
 assert(e&&e.year===1549&&e.source_ids.length>=2);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
 assert(e.source_ids.every(s=>old.sources.some(x=>x.id===s)));
 assert(notes[id]&&notes[id].actual_English_land_area_sqkm===null);
 assert.equal(e.colonial_profit,null);
}
assert(old.colonial_polygons.length===0&&later.colonial_polygons.length===0);
const zone=j('data/war-contested-zones-1540-1549.geojson').features.find(x=>x.id==='front-boulonnais-1545-1549');
assert(zone&&zone.properties.historical_boundary_confirmed===false&&zone.properties.fill_authorized===false);
const garrison=j('data/military-control-points-1540-1549.geojson').features;
for(const id of ['boulogne-english-1544-1550','tour-d-ordre-english-fort-1544-1550','ambleteuse-english-fort-1546-1549','outreau-french-opposing-fort-from-1545']){
 assert(garrison.some(f=>f.properties.stable_id===id),'Missing separate military site '+id);
}
const amble=garrison.find(x=>x.properties.stable_id==='ambleteuse-english-fort-1546-1549');
assert.equal(amble.properties.year_end_stop,1548,'1549 French recovery must remove English occupied-garrison ring');
const french=garrison.find(x=>x.properties.stable_id==='outreau-french-opposing-fort-from-1545');
assert.equal(french.properties.not_an_English_control_feature,true);
assert(editorial.includes('readerFriendly(p)')&&editorial.includes('<summary>参考资料 · '),'Reader must suppress technical digressions while preserving references');
assert(!editorial.includes('esc(article.reading_note)')&&!editorial.includes('esc(article.map_note)')&&!editorial.includes('esc(s.access)'),'Reader must not display archival precision notes');
console.log('PASS 15/16: two 3000+ Chinese historical stories, Boulogne English garrison/French fort separate, 1549 royal repression and reader-only academic cleanup');
