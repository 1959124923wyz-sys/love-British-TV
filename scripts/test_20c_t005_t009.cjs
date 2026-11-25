'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const index=load('data/stories/serial/index.json'),events=new Map();
for(const d of ['1900-1909','1910-1919','1920-1929','1930-1939','1940-1949']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),keys=new Set(c.sources.map(s=>s.id));
 assert.equal(keys.size,c.sources.length);
 for(const e of c.events){if(/^E20-T00[59]-/.test(e.id))assert(!events.has(e.id),e.id);events.set(e.id,{e,keys});}
}
for(const id of ['E20-T005-FRONTIER-COLLECTIVE-PUNISHMENT-1901-1947','E20-T009-PARTITION-REFUGEES-1946-1948']){
 const t=index.topics.find(x=>x.id===id),a=load(t.article_file);
 assert.equal(a.id,id);assert(a.sections.length>=8&&a.sources.length>=5&&a.lead.length>=120);
 const sk=new Set(a.sources.map(s=>s.id));assert.equal(sk.size,a.sources.length);
 assert(a.sections.every(s=>Array.isArray(s.paragraphs)&&s.paragraphs.length>=2&&s.paragraphs.every(p=>typeof p==='string')&&s.source_keys.every(k=>sk.has(k))));
 const body=a.sections.flatMap(s=>s.paragraphs).join('');
 assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000,id);
 const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];assert.deepEqual(links.sort(),[...t.event_ids].sort());
 for(const k of links){const x=events.get(k);assert(x&&x.e.source_ids.every(k=>x.keys.has(k)),k);}
 if(t.status==='published')assert.equal(t.publication_review,'approved');
}
const points=[];
for(const d of ['1930-1939','1940-1949'])for(const f of load('data/twentieth-century-spatial-'+d+'.geojson').features.filter(f=>/^india-t00[59]-/.test(f.id))){
 const p=f.properties,e=events.get(p.related_event_ids[0]).e;
 assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert(p.named_anchors.every(x=>typeof x==='string'));assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);points.push(f.id);
}
assert.deepEqual(points.sort(),['india-t005-miranshah','india-t009-delhi','india-t009-lahore']);
console.log('PASS T005/T009 sourced text, cross-decade events and three named-city map anchors');
