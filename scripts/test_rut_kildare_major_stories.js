#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=path.resolve(__dirname,'..'),j=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const a=j('data/atlas-1520-1529.json'),b=j('data/atlas-1530-1539.json'),idx=j('data/stories/index.json').stories;
const notes=j('data/historical-detail-notes.json').records;
const expect=[
 {id:'john-rut-north-atlantic-voyage-1527',a:a,events:['1527-JOHN-RUT','1527-JOHN-RUT-STJOHNS','RUT1527-PLYMOUTH-DEPARTURE','RUT1527-MONA-ENGLISH-VESSEL','RUT1527-SANTO-DOMINGO-ENGLISH-VESSEL']},
 {id:'silken-thomas-kildare-rebellion-1534-1537',a:b,events:['1530S-E003','1530S-E004','1530S-E005','1530S-E008','1530S-E012','KIL1534-STMARYS-RENOUNCEMENT','KIL1534-ARTANE-ALEN-KILLED','KIL1535-MAYNOOTH-GARRISON-EXECUTIONS','KIL1537-TYBURN-EXECUTIONS']}
];
assert.ok(idx.length>=12,'preserve previous eight published historical stories');
for(const {id,a:chapter,events:ids} of expect){
 const meta=idx.find(q=>q.id===id);assert(meta,'not indexed: '+id);
 const s=j(meta.file),prose=s.sections.flatMap(s=>s.paragraphs).join('');
 assert.equal(s.title,meta.title);assert(prose.length>=3000);assert(s.lead.length>=120);
 assert.deepEqual(new Set(ids),new Set(s.related_event_ids));
 assert(s.sources.length>=5 && s.sections.length>=8);
 const ss=new Set(s.sources.map(x=>x.id));
 let links=0;
 for(const section of s.sections){
  assert(section.paragraphs.length>=2);
  assert(section.source_keys.every(k=>ss.has(k)));
  for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
   assert(ids.includes(m[1]),id+': unowned event link '+m[1]);links++;
  }
 }
 assert(links>=12,id+': insufficient clickable narrative');
 for(const eid of ids){const e=chapter.events.find(q=>q.id===eid);assert(e,eid);assert(e.source_ids.every(s=>chapter.sources.some(q=>q.id===s)),eid+' source missing');}
}
assert.equal(a.events.length,35);assert.equal(a.routes.length,5);
assert.equal(b.events.length,34);assert.equal(b.routes.length,0);
assert.equal(a.colonial_polygons.length,0);assert.equal(b.colonial_polygons.length,0);
for(const id of ['RUT1527-PLYMOUTH-DEPARTURE','RUT1527-MONA-ENGLISH-VESSEL','RUT1527-SANTO-DOMINGO-ENGLISH-VESSEL']){
 const e=a.events.find(q=>q.id===id);
 assert(e && Number.isFinite(e.lat) && Number.isFinite(e.lng));
 assert.equal(e.actual_English_land_area_sqkm,null);assert(notes[id]);
}
for(const id of ['RUT1527-MONA-ENGLISH-VESSEL','RUT1527-SANTO-DOMINGO-ENGLISH-VESSEL']){
 const e=a.events.find(q=>q.id===id);
 assert(/尚不确定|未证/.test(e.name),'Spanish-observed English vessel must not be falsely attributed to Rut');
 assert(!/征服|占领|焚毁/.test(e.description),'English vessel sighting cannot become colonial conquest');
}
const r=a.routes.find(q=>q.id==='RUT1527-MONA-SANTO-DOCUMENTED-ENGLISH-SHIP');
assert(r && r.year===1527 && r.valid_years.length===1 && r.valid_years[0]===1527);
assert.equal(r.route_kind,'documented-endpoints-connection');assert.equal(r.historical_boundary_confirmed,false);
assert.equal(r.territorial_claim,false);assert.equal(r.area_sqkm,null);assert.equal(r.exclude_from_area_aggregation,true);
assert(/尚未确认/.test(r.note),'Documentary doubt must survive in route');
for(const id of ['KIL1534-STMARYS-RENOUNCEMENT','KIL1534-ARTANE-ALEN-KILLED','KIL1535-MAYNOOTH-GARRISON-EXECUTIONS','KIL1537-TYBURN-EXECUTIONS']){
 const e=b.events.find(q=>q.id===id);
 assert(e&&e.source_ids.length>=2&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert(notes[id]);
 assert.equal(e.actual_English_land_area_sqkm,null);
}
const tyburn=b.events.find(e=>e.id==='KIL1537-TYBURN-EXECUTIONS');
assert(tyburn.lat>51&&tyburn.lat<52&&tyburn.lng>-1&&tyburn.lng<1);
assert(/伦敦/.test(tyburn.name));assert.equal(tyburn.category,'repression');
assert.equal(b.events.find(e=>e.id==='1530S-E012').lat,null,'original unlocated London event must not be relocated to Ireland');
assert.equal(b.events.find(e=>e.id==='1530S-E003').lat,53.342886,'Dublin Castle archaeological modern reference absent');
console.log('PASS 09/10: 2 source-rich stories, 7 new points, 1 conditional non-territorial relation, legal/war attribution preserved');
