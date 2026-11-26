'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const id='E20-T021-SINGAPORE-LABOUR-DETENTION-1945-1959',t=load('data/stories/serial/index.json').topics.find(t=>t.id===id),a=load(t.article_file),events=new Map();
assert.equal(a.id,id);assert(a.sections.length>=15&&a.sources.length>=14&&a.lead.length>=120);
const keys=new Set(a.sources.map(s=>s.id));assert.equal(keys.size,a.sources.length);
assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
const body=a.sections.flatMap(s=>s.paragraphs).join('');
assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000);
assert(!/(地理参照|地理配准|独立配准|地理中心|同期测绘|实控边界|未绘|具名城市参照)/.test(body));
let placed=0;
for(const d of ['1940-1949','1950-1959']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),sk=new Set(c.sources.map(s=>s.id));assert.equal(sk.size,c.sources.length);
 const g=load('data/twentieth-century-spatial-'+d+'.geojson').features.filter(f=>f.id==='malaya45-sg');
 assert.equal(g.length,1);assert.equal(g[0].geometry.type,'Point');assert.deepEqual(g[0].geometry.coordinates,[103.853,1.289]);assert.equal(g[0].properties.fill_authorized,false);assert.equal(g[0].properties.area_sqkm,null);
 for(const e of c.events.filter(e=>t.event_ids.includes(e.id))){assert(!events.has(e.id));assert(e.source_ids.every(k=>sk.has(k)));events.set(e.id,e);if(e.id.startsWith('E20-T021-')&&e.lat!=null){placed++;assert.deepEqual([e.lng,e.lat],g[0].geometry.coordinates);assert(g[0].properties.related_event_ids.includes(e.id));}}
 if(d==='1950-1959')assert(g[0].properties.year_stages.some(s=>s.start_year===1959&&s.controller==='local'));
}
const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];assert.deepEqual(links.sort(),[...t.event_ids].sort());assert.deepEqual(links,[...events.keys()].sort());assert.equal(links.length,20);assert.equal(links.filter(x=>x.startsWith('E20-T021-')).length,16);assert.equal(placed,9);
if(t.status==='published')assert.equal(t.publication_review,'approved');
console.log('PASS T021 evidence, article-event links, inherited city point and autonomy year stage');
