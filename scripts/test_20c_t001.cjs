'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const id='E20-T001-INDIA-FAMINE-RELIEF-1900-1909',a=load('data/stories/serial/e20-t001-india-famine-relief-1900-1909.json'),c=load('data/stories/serial/chronology-1900-1909.json'),g=load('data/twentieth-century-spatial-1900-1909.geojson'),t=load('data/stories/serial/index.json').topics.find(x=>x.id===id);
assert(t&&a.id===id&&['editorial_review','published'].includes(t.status));
assert.equal(a.sections.length,11);assert.equal(a.sources.length,15);assert(a.sections.flatMap(s=>s.paragraphs).join('').length>=3000);
const links=[...a.sections.flatMap(s=>s.paragraphs).join('').matchAll(/\[\[([A-Z0-9-]+)\|([^\]]+)\]\]/g)].map(m=>m[1]);
assert.equal(new Set(links).size,15);assert.deepEqual([...new Set(links)].sort(),[...t.event_ids].sort());
const keys=new Set(c.sources.map(s=>s.id)),rows=c.events.filter(e=>t.event_ids.includes(e.id));assert.equal(rows.length,15);
assert(rows.every(e=>e.year>=1900&&e.year<=1909&&e.source_ids.every(k=>keys.has(k))));
const pts=g.features.filter(f=>['ahmedabad-famine-1900','bombay-famine-report-1901'].includes(f.id));assert.equal(pts.length,2);
for(const f of pts){const e=rows.find(x=>x.id===f.properties.related_event_ids[0]);assert(e&&f.geometry.type==='Point'&&f.properties.area_sqkm===null&&f.properties.fill_authorized===false&&f.properties.source_ids.every(k=>keys.has(k)));assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);}
console.log('PASS T001: 11 sections, 15 dated source-linked events, two grounded city points');
