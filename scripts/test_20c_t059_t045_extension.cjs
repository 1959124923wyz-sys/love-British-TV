'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const idx=load('data/stories/serial/index.json'),c=load('data/stories/serial/chronology-1900-1909.json'),c60=load('data/stories/serial/chronology-1960-1969.json');
for(const [id,ds,newIds] of [['E20-SOUTH-AFRICAN-WAR-CAMPS',c,["E20-T059-SCHOOL01","E20-T059-PLEA02","E20-T059-COUNT02"]],['E20-KEN-HOLA',c60,['E20-T045-END60']]]){
 const t=idx.topics.find(t=>t.id===id),a=load(t.article_file),src=new Set(a.sources.map(s=>s.id));
 assert.equal(t.status,'editorial_review');assert.equal(t.review_entry_required,true);
 assert(a.sections.flatMap(s=>s.paragraphs).join('').replace(/\[\[[^|]+\|([^\]]+)\]\]/g,'$1').length>=3000);
 assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>src.has(k))&&s.period_start_year>=a.start_year&&s.period_end_year<=a.end_year));
 const links=[...a.sections.flatMap(s=>s.paragraphs).join('').matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]);
 assert(links.every(id=>t.event_ids.includes(id)));
 assert.deepEqual(t.review_event_ids,newIds);
 for(const id of newIds){const e=ds.events.filter(e=>e.id===id);assert.equal(e.length,1);assert(links.includes(id));assert(e[0].source_ids.every(k=>src.has(k)&&ds.sources.some(s=>s.id===k)));assert.equal(e[0].lat,null);assert.equal(e[0].lng,null);assert.equal(e[0].fill_authorized,false);assert.equal(e[0].area_sqkm,null);}
}
const app=fs.readFileSync('app.js','utf8'),gate=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas(')),fn=new Function('reviewParams',gate+'\nreturn modern20cReviewGate;');
for(const [y,ids] of [[1900,["E20-T059-SCHOOL01","E20-T059-PLEA02","E20-T059-COUNT02"]],[1960,['E20-T045-END60']]]){assert(ids.every(id=>fn({get:()=>null})(y,idx).eventIds.has(id)));assert(ids.every(id=>!fn({get:()=>'1'})(y,idx).eventIds.has(id)));}
console.log('PASS T059/T045 source keys, stable links, actual candidate isolation, no new geometry');
