'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const id='E20-T027-EGYPT-OCCUPATION-DENSHAWAI-REVOLUTION-1900-1922',t=load('data/stories/serial/index.json').topics.find(t=>t.id===id),a=load(t.article_file),keys=new Set(a.sources.map(s=>s.id));
assert.equal(a.id,id);assert.equal(a.sections.length,20);assert.equal(keys.size,30);
assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
const body=a.sections.flatMap(s=>s.paragraphs).join('');
assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000);
const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];
assert.equal(links.length,20);assert.deepEqual(links.sort(),[...t.event_ids].sort());
const es=new Map();let placed=0;
for(const d of ['1900-1909','1910-1919','1920-1929']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),sk=new Set(c.sources.map(s=>s.id)),fs=load('data/twentieth-century-spatial-'+d+'.geojson').features;
 assert.equal(sk.size,c.sources.length);
 for(const e of c.events.filter(e=>t.event_ids.includes(e.id))){
  assert(!es.has(e.id));es.set(e.id,e);assert(e.source_ids.every(k=>sk.has(k)));
  if(e.id.startsWith('E20-T027-')&&e.lat!=null){placed++;const f=fs.find(f=>f.properties.related_event_ids?.includes(e.id));assert(f,e.id);assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);}
 }
}
assert.equal(placed,6);assert.equal(es.size,20);assert.equal([...es.keys()].filter(k=>k.startsWith('E20-T027-')).length,18);
assert(es.has('E20-AMR-EGYPT')&&es.has('E20-CORK-EGYPT'));
const g=load('data/twentieth-century-spatial-1900-1909.geojson').features.filter(f=>f.id==='egypt-t027-denshawai');
assert.equal(g.length,1);assert.deepEqual(g[0].geometry.coordinates,[30.8206,30.6014]);assert.equal(g[0].properties.territorial_claim,false);
const cairo=load('data/twentieth-century-spatial-1920-1929.geojson').features.find(f=>f.id==='egypt-cairo-protectorate');
assert(cairo.properties.year_stages.some(s=>s.start_year===1922&&s.controller==='local'));
assert(es.get('E20-T027-COURTS').description.includes('死刑判决不等于执行'));
if(t.status==='published')assert.equal(t.publication_review,'approved');
console.log('PASS T027 evidence, cross-decade links, inherited political stages and named point');
