'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const index=load('data/stories/serial/index.json');
for(const id of ['E20-T003-BENGAL-PARTITION-DETENTION-1905-1919','E20-AMRITSAR-MASSACRE']){const old=index.topics.find(t=>t.id===id);assert(old&&old.status==='published'&&old.publication_review==='approved');}
const a=load('data/stories/serial/e20-salt-march-1930-1939.json'),t=load('data/stories/serial/index.json').topics.find(x=>x.id==='E20-SALT-MARCH');
assert(t&&a.id===t.id&&a.sections.length===9&&a.sources.length===63);
assert(['editorial_review','published'].includes(t.status));assert.equal(t.origin_year,1920);assert.equal(a.start_year,1920);if(t.status==='published')assert.equal(t.publication_review,'approved');
const sources=new Set(a.sources.map(s=>s.id));assert(a.sections.every(s=>s.source_keys.every(k=>sources.has(k))));
const links=[...new Set([...a.sections.flatMap(s=>s.paragraphs).join('').matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(m=>m[1]))];
assert.equal(links.length,80);assert.deepEqual(links.sort(),[...t.event_ids].sort());
const events=new Map();
for(const y of [1920,1930]){const c=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),keys=new Set(c.sources.map(s=>s.id));for(const e of c.events){assert(!events.has(e.id));events.set(e.id,e);if(e.id.startsWith('E20-T006-'))assert(e.source_ids.every(k=>keys.has(k)));}}
assert(links.every(id=>events.has(id)));assert.equal(events.get('E20-SALT-PACT').source_ids.filter(id=>id==='E20-T006-SRC-PACT').length,1);assert(!events.has('E20-T006-PROPERTY'));assert.equal([...events.keys()].filter(id=>id.startsWith('E20-T006-')).length,7);
const p=load('data/twentieth-century-spatial-1920-1929.geojson').features.find(f=>f.id==='india-t006-ahmedabad-trial'),e=events.get('E20-T006-TRIAL');
assert.deepEqual(p.geometry.coordinates,[e.lng,e.lat]);assert.deepEqual(p.properties.named_anchors,['艾哈迈达巴德']);assert.equal(p.properties.fill_authorized,false);assert.equal(p.properties.area_sqkm,null);
console.log('PASS T006 event, provenance and GIS contracts');
