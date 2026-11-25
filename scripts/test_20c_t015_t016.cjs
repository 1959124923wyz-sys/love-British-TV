'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const index=load('data/stories/serial/index.json'),events=new Map();
for(const d of ["1900-1909","1920-1929","1930-1939","1940-1949"]){
const c=load('data/stories/serial/chronology-'+d+'.json'),keys=new Set(c.sources.map(s=>s.id));
assert.equal(keys.size,c.sources.length);
for(const e of c.events){if(/^E20-T01[56]-/.test(e.id))assert(!events.has(e.id),e.id);events.set(e.id,{e,keys});}
}
for(const id of ["E20-T015-CHINA-CONCESSIONS-EXTRATERRITORIALITY-1900-1949","E20-T016-MAY-THIRTIETH-CANTON-HONG-KONG-STRIKE-1925-1927"]){
const t=index.topics.find(x=>x.id===id),a=load(t.article_file);
assert.equal(a.id,id);assert(a.sections.length>=8&&a.sources.length>=5&&a.lead.length>=120);
const sk=new Set(a.sources.map(s=>s.id));assert.equal(sk.size,a.sources.length);
assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>sk.has(k))));
const body=a.sections.flatMap(s=>s.paragraphs).join('');
assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000,id);
assert(!/(地理参照|地理配准|独立配准|地理中心|同期测绘|实控边界|未绘|具名城市参照)/.test(body),id);
const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];assert.deepEqual(links.sort(),[...t.event_ids].sort());
for(const k of links){const x=events.get(k);assert(x&&x.e.source_ids.every(k=>x.keys.has(k)),k);}
if(t.status==='published')assert.equal(t.publication_review,'approved');
}
const points=[];
for(const d of ['1920-1929','1930-1939'])for(const f of load('data/twentieth-century-spatial-'+d+'.geojson').features.filter(f=>/^china-t01[56]-/.test(f.id))){
const p=f.properties,e=events.get(p.related_event_ids[0]).e;
assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert(p.named_anchors.every(x=>typeof x==='string'));assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);points.push(f.id);
}
assert.deepEqual(points.sort(),["china-t015-han","china-t015-jiu","china-t015-weiret","china-t016-gzsup","china-t016-hk","china-t016-shunion"]);
const sha=events.get('E20-T016-SHA').e, gz=events.get('E20-T016-GZSUP').e;
assert.deepEqual([sha.lng,sha.lat],[gz.lng,gz.lat]);
assert.equal(sha.geo_precision,'named_locality_approximate');
assert(sha.source_ids.includes('E20-T016-SRC-GGZ'));
assert(load('data/twentieth-century-spatial-1920-1929.geojson').features.find(f=>f.id==='china-t016-gzsup').properties.related_event_ids.includes(sha.id));
console.log('PASS T015/T016 evidence, dated links and named locality anchors');
