'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const t=load('data/stories/serial/index.json').topics.find(t=>t.id==='E20-MAL-BATANG-KALI'),a=load(t.article_file);
assert.equal(a.id,t.id);assert.equal(a.end_year,1959);assert.equal(a.sections.length,13);assert.equal(a.sources.length,58);assert.equal(t.event_ids.length,81);
const keys=new Set(a.sources.map(s=>s.id));assert.equal(keys.size,a.sources.length);
const body=a.sections.flatMap(s=>s.paragraphs).join('');
const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))])];
assert.equal(links.length,60);assert(links.every(id=>t.event_ids.includes(id)));
const all=new Map();
for(const d of ['1940-1949','1950-1959']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),sk=new Set(c.sources.map(s=>s.id));assert.equal(sk.size,c.sources.length);
 for(const e of c.events.filter(e=>t.event_ids.includes(e.id))){assert(!all.has(e.id));assert(e.source_ids.every(k=>sk.has(k)));all.set(e.id,e);}
}
assert(t.event_ids.every(id=>all.has(id)));
const added=[...all.values()].filter(e=>e.id.startsWith('E20-T020-'));assert.equal(added.length,14);
assert(added.every(e=>links.includes(e.id)&&e.source_ids.every(k=>keys.has(k))));assert(links.includes('E20-KEN-MALAYA'));
const fs50=load('data/twentieth-century-spatial-1950-1959.geojson').features;
const newFeatures=fs50.filter(f=>f.id.startsWith('malaya-t020-'));assert.equal(newFeatures.length,3);
for(const e of added.filter(e=>e.lat!=null)){
 const f=fs50.find(f=>f.properties.related_event_ids?.includes(e.id));assert(f,e.id);assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);
}
assert.equal(added.filter(e=>e.lat!=null).length,7);
assert.equal(fs50.filter(f=>f.id==='malaya45-ipoh').length,1);
assert(a.sections.slice(-8).every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
console.log('PASS T020 evidence, inherited chronology, 1950s linked points and reuse');
