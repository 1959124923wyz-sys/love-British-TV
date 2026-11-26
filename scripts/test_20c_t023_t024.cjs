'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const idx=load('data/stories/serial/index.json'),c=load('data/stories/serial/chronology-1940-1949.json'),g=load('data/twentieth-century-spatial-1940-1949.geojson'),sk=new Set(c.sources.map(s=>s.id));
assert.equal(sk.size,c.sources.length);
assert.equal(new Set(c.events.map(e=>e.id)).size,c.events.length);
for(const [n,id,num,sources,placed] of [['023','E20-T023-INDONESIA-BRITISH-INTERVENTION-1945-1946',16,21,3],['024','E20-T024-INDOCHINA-BRITISH-INTERVENTION-1945-1946',15,17,6]]){
 const t=idx.topics.find(t=>t.id===id),a=load(t.article_file),keys=new Set(a.sources.map(s=>s.id));
 assert.equal(a.id,id);assert.equal(a.sections.length,num);assert.equal(keys.size,sources);assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
 const body=a.sections.flatMap(s=>s.paragraphs).join('');
 assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000);
 assert(!/(地理参照|地理配准|独立配准|地理中心|同期测绘|实控边界|未绘|具名城市参照)/.test(body));
 const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];
 assert.equal(links.length,num);assert.deepEqual(links.sort(),[...t.event_ids].sort());
 const es=c.events.filter(e=>e.id.startsWith('E20-T'+n+'-'));assert.deepEqual(es.map(e=>e.id).sort(),links);
 assert(es.every(e=>e.source_ids.every(k=>keys.has(k)&&sk.has(k))));assert.equal(es.filter(e=>e.lat!=null).length,placed);
 const ps=g.features.filter(f=>f.id.startsWith('t'+n+'-'));assert.equal(ps.length,2);
 for(const e of es.filter(e=>e.lat!=null)){const p=ps.find(f=>f.properties.related_event_ids.includes(e.id));assert(p,e.id);assert.equal(p.geometry.type,'Point');assert.deepEqual(p.geometry.coordinates,[e.lng,e.lat]);assert.equal(p.properties.fill_authorized,false);assert.equal(p.properties.territorial_claim,false);assert.equal(p.properties.area_sqkm,null);}
 if(t.status==='published')assert.equal(t.publication_review,'approved');
}
assert.deepEqual(g.features.find(f=>f.id==='t023-jakarta').geometry.coordinates,[106.84513,-6.21462]);
assert.deepEqual(g.features.find(f=>f.id==='t023-surabaya').geometry.coordinates,[112.75083,-7.24917]);
assert.deepEqual(g.features.find(f=>f.id==='t024-hanoi').geometry.coordinates,[105.84117,21.0245]);
assert.deepEqual(g.features.find(f=>f.id==='t024-saigon').geometry.coordinates,[106.62965,10.82302]);
console.log('PASS T023/T024 evidence, linked chronology and four non-territorial city points');
