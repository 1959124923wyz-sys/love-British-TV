'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const id='E20-T019-MALAYA-RUBBER-TIN-LABOUR-1900-1942',t=load('data/stories/serial/index.json').topics.find(t=>t.id===id),a=load(t.article_file),events=new Map();
assert.equal(a.id,id);
assert(a.sections.length>=13&&a.sources.length>=11&&a.lead.length>=120);
const keys=new Set(a.sources.map(s=>s.id));assert.equal(keys.size,a.sources.length);
assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
const body=a.sections.flatMap(s=>s.paragraphs).join('');
assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000);
assert(!/(地理参照|地理配准|独立配准|地理中心|同期测绘|实控边界|未绘|具名城市参照)/.test(body));
for(const d of ['1900-1909','1910-1919','1920-1929','1930-1939','1940-1949']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),sk=new Set(c.sources.map(s=>s.id));assert.equal(sk.size,c.sources.length);
 for(const e of c.events.filter(e=>e.id.startsWith('E20-T019-'))){assert(!events.has(e.id));assert(e.source_ids.every(k=>sk.has(k)));events.set(e.id,e);}
}
const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];assert.deepEqual(links.sort(),[...t.event_ids].sort());assert.deepEqual(links,[...events.keys()].sort());assert.equal(links.length,17);
const f=load('data/twentieth-century-spatial-1940-1949.geojson').features.filter(f=>f.id==='malaya-t019-klang');assert.equal(f.length,1);const p=f[0].properties,e=events.get('E20-T019-KLANG');assert.equal(f[0].geometry.type,'Point');assert.deepEqual(f[0].geometry.coordinates,[e.lng,e.lat]);assert.deepEqual(f[0].geometry.coordinates,[101.44333,3.03667]);assert(p.related_event_ids.includes(e.id)&&p.start_year===1941&&p.end_year===1941);assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);
if(t.status==='published')assert.equal(t.publication_review,'approved');
console.log('PASS T019 sources, article-event links and Klang GIS anchor');
