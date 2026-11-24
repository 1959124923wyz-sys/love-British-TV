#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dirs=fs.readdirSync(path.join(root,'data/stories/serial')).filter(p=>/^chronology-18\d\d-18\d\d\.json$/.test(p));
const c=dirs.map(p=>load('data/stories/serial/'+p));
const all=c.flatMap(x=>x.events), events=new Map(all.map(e=>[e.id,e]));
const sources=new Set(c.flatMap(x=>x.sources.map(s=>s.id)));
const pts=dirs.flatMap(p=>load('data/nineteenth-century-spatial-'+p.slice(11,-5)+'.geojson').features);
const index=load('data/stories/serial/index.json');
const targets=[{"topic":"T01","id":"E19-T01-ABOLITION-COMPENSATION-APPRENTICESHIP-SUGAR-1801-1899","n":25,"added":18,"points":9,"chapters":["T01.1","T01.2","T01.3","T01.4","T01.5"]},{"topic":"T02","id":"E19-T02-LIBERATED-AFRICANS-APPRENTICESHIP-1800-1875","n":25,"added":24,"points":7,"chapters":["T02.1","T02.2","T02.3","T02.4"]},{"topic":"T03","id":"E19-T03-INDIAN-INDENTURE-PLANTATION-LABOUR-1834-1899","n":32,"added":16,"points":6,"chapters":["T03.1","T03.2","T03.3","T03.4","T03.5","T03.6"]}];
const total=new Set();
for(const t of targets){
 const r=load('research/19c/consolidated/'+t.topic+'_VERIFIED_EVENT_GIS_REGISTER.json'),a=load(r.article_file),idx=index.topics.find(x=>x.id===t.id);
 assert(idx&&idx.status==='published'&&idx.publication_review==='approved');
 assert.equal(a.id,t.id);assert.equal(a.sections.length,t.n);assert(a.lead.length>=120);assert(a.sections.flatMap(s=>s.paragraphs).join('').length>=3000);
 assert.deepEqual(new Set(a.sections.map(s=>s.narrative_chapter)),new Set(t.chapters));
 const sk=new Set(a.sources.map(s=>s.id));assert.equal(sk.size,a.sources.length);for(const s of a.sources)assert(s.url.startsWith('https://')&&s.access);
 const links=a.sections.flatMap(s=>[...s.paragraphs.join('\n').matchAll(/\[\[(E19-[A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]));
 assert.equal(links.length,t.n);assert.equal(new Set(links).size,t.n);assert.deepEqual(new Set(links),new Set(idx.event_ids));assert.deepEqual(new Set(links),new Set(r.links.map(x=>x.id)));
 for(const s of a.sections){assert.equal(s.paragraphs.length,3);assert(s.source_keys.length&&s.source_keys.every(k=>sk.has(k)));}
 for(const l of r.links){assert(events.has(l.id),l.id);assert.equal(events.get(l.id).year,l.year,l.id);assert(!total.has(l.id),l.id);total.add(l.id);}
 assert.equal(r.events.length,t.added);assert.equal(all.filter(e=>e.id.startsWith('E19-'+t.topic+'-')).length,t.added);
 for(const e of r.events){const found=events.get(e.id);assert.deepEqual(found,e);assert(e.source_ids.every(k=>sources.has(k)&&sk.has(k)),e.id);assert.equal(e.visible_from,e.year);assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.area_sqkm,null);assert((e.lat===null&&e.lng===null)||(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.geo_precision.includes('not_historic')));}
 const p=pts.filter(f=>f.properties.stable_id?.startsWith('GIS-19C-'+t.topic+'-'));assert.equal(p.length,t.points);for(const f of p){assert.equal(f.geometry.type,'Point');assert(f.geometry.coordinates.every(Number.isFinite));assert(f.properties.related_event_ids.every(id=>events.has(id)));assert(f.properties.source_ids.every(k=>sources.has(k)));assert.equal(f.properties.territorial_claim,false);assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);assert.equal(f.properties.exclude_from_area_aggregation,true);}
 console.log('PASS',t.topic,t.n,'interactive events',t.added,'new',t.points,'GIS points');
}
