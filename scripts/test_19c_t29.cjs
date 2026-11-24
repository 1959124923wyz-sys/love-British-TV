'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const a=load('data/stories/serial/e19-t29-malaya-north-borneo-1824-1898.json');
const m=load('data/stories/serial/index.json').topics.find(t=>t.id===a.id);
assert(m);assert.equal(a.sections.length,22);
assert.equal(a.sources.length,38);
assert.equal(new Set(a.sections.map(s=>s.primary_event_id)).size,22);
assert.deepEqual(m.event_ids,a.sections.map(s=>s.primary_event_id));
const archived=load('research/19c/consolidated/T29_EDITORIAL_DRAFT.json');
assert.equal(archived.archive_events.length,51);
let added=0,reused=0;
for(const s of a.sections){
 const y=Math.floor(s.period_start_year/10)*10;
 const d=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json');
 const matches=d.events.filter(e=>e.id===s.primary_event_id);
 assert.equal(matches.length,1,s.primary_event_id);
 const e=matches[0];
 assert.equal(e.year,s.period_start_year);
 assert(s.paragraphs.some(p=>p.includes('[['+e.id+'|')));
 assert(s.source_keys.every(k=>a.sources.some(x=>x.id===k&&x.url.startsWith('https://'))));
 assert(e.source_ids.every(k=>d.sources.some(x=>x.id===k)));
 assert(s.archive_event_ids.every(id=>archived.archive_events.some(x=>x.id===id)));
 if(e.id.startsWith('E19-T29-')){added++;assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);assert.deepEqual(e.research_original_node_ids,s.archive_event_ids);}else reused++;
}
assert.equal(added,17);assert.equal(reused,5);
let n=0;
for(const y of [1850,1870])for(const f of load('data/nineteenth-century-spatial-'+y+'-'+(y+9)+'.geojson').features.filter(f=>f.id?.startsWith('GIS-19C-T29-'))){
 n++;assert.equal(f.geometry.type,'Point');assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.territorial_claim,false);assert.equal(f.properties.historical_boundary_confirmed,false);assert.equal(f.properties.exclude_from_area_aggregation,true);assert(f.properties.source_urls.includes(f.properties.geometry_source));const d=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json');const e=d.events.find(e=>e.id===f.properties.related_event_ids[0]);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);
}
assert.equal(n,2);console.log('PASS T29: 22 sections, 17 new and 5 reused events, 2 evidence-backed points');
