'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const idx=load('data/stories/serial/index.json'),events=new Map(),maps=new Map();
for(const d of ['1920-1929','1930-1939','1940-1949','1950-1959']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),g=load('data/twentieth-century-spatial-'+d+'.geojson');
 const keys=new Set(c.sources.map(s=>s.id));assert.equal(keys.size,c.sources.length);
 for(const e of c.events){if(e.id.startsWith('E20-T028-')||e.id.startsWith('E20-T029-')||['E20-CORK-EGYPT','E20-SALT-EGYPT','E20-KEN-SUEZ'].includes(e.id)){assert(!events.has(e.id),e.id);events.set(e.id,e);assert(e.source_ids.every(k=>keys.has(k)),e.id);maps.set(e.id,g.features);}}
}
for(const [n,count,ns] of [['028',15,20],['029',16,15]]){
 const m=load('research/20c/T'+n+'_EVENT_REGISTER.json'),t=idx.topics.find(t=>t.id===m.id),a=load(t.article_file),keys=new Set(a.sources.map(s=>s.id));
 assert.equal(a.id,t.id);assert.equal(a.sections.length,count);assert.equal(keys.size,ns);assert(a.lead.length>=120);
 assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
 const body=a.sections.flatMap(s=>s.paragraphs).join('');assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000);
 const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(x=>x[1]))];assert.deepEqual(links,t.event_ids);assert.deepEqual(links,m.events.map(e=>e.id));
 for(const x of m.events){const e=events.get(x.id);assert(e,x.id);assert.equal(e.year,x.year);if(x.reuse)continue;
 assert.deepEqual(e.source_ids,x.source_ids);assert(e.source_ids.every(k=>keys.has(k)));assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
 if(x.loc){const f=maps.get(x.id).find(f=>f.properties.related_event_ids?.includes(x.id));assert(f,x.id);assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.properties.territorial_claim,false);assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);}
 else assert.equal(e.lat,null,x.id);
 }if(t.status==='published')assert.equal(t.publication_review,'approved');
}
assert.equal(events.size,31);
assert.deepEqual([events.get('E20-T028-IS52').lat,events.get('E20-T028-IS52').lng],[30.60427,32.27225]);
assert.equal(events.get('E20-T029-HOME').year,1957);
for(const d of ['1920-1929','1930-1939','1940-1949','1950-1959']){
 const f=load('data/twentieth-century-spatial-'+d+'.geojson').features.find(f=>f.id==='egypt-cairo-protectorate');
 assert(f.properties.year_stages.filter(s=>s.end_year>=1922).every(s=>s.controller==='local'));
}
console.log('PASS Egypt/Suez evidence, 31 narrative links, named-place anchors and Egyptian political continuity');
