'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const id='E20-T002-INDIA-LAND-REVENUE-1900-1947',a=load('data/stories/serial/e20-t002-india-land-revenue-1900-1947.json'),t=load('data/stories/serial/index.json').topics.find(x=>x.id===id);
assert(t&&a.id===id&&['editorial_review','published'].includes(t.status));
assert.equal(a.sections.length,13);assert.equal(a.sources.length,33);assert(a.sections.flatMap(s=>s.paragraphs).join('').length>=3000);
const links=[...a.sections.flatMap(s=>s.paragraphs).join('').matchAll(/\[\[([A-Z0-9-]+)\|([^\]]+)\]\]/g)].map(m=>m[1]);assert.equal(new Set(links).size,28);assert.deepEqual([...new Set(links)].sort(),[...t.event_ids].sort());
let n=0,points=0;
for(const y of [1900,1910,1920,1930,1940]){const c=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),g=load('data/twentieth-century-spatial-'+y+'-'+(y+9)+'.geojson'),keys=new Set(c.sources.map(s=>s.id)),rows=c.events.filter(e=>t.event_ids.includes(e.id));n+=rows.length;assert(rows.every(e=>e.year>=y&&e.year<=y+9&&e.source_ids.every(k=>keys.has(k))));const pts=g.features.filter(f=>f.id.startsWith('india-land-e20-t002-'));points+=pts.length;for(const f of pts){assert(f.geometry.type==='Point'&&f.properties.area_sqkm===null&&f.properties.fill_authorized===false&&f.properties.source_ids.every(k=>keys.has(k)));for(const id of f.properties.related_event_ids){const e=rows.find(x=>x.id===id);assert(e);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);}}}
assert.equal(n,28);assert.equal(points,10);console.log('PASS T002: historical chronology, links and grounded city points');
