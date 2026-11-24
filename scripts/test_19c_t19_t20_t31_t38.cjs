#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dirs=fs.readdirSync(path.join(root,'data/stories/serial')).filter(p=>/^chronology-18\d\d-18\d\d\.json$/.test(p));
const c=dirs.map(p=>load('data/stories/serial/'+p)),all=c.flatMap(x=>x.events),events=new Map(all.map(e=>[e.id,e]));
const sources=new Set(c.flatMap(x=>x.sources.map(s=>s.id))),pts=dirs.flatMap(p=>load('data/nineteenth-century-spatial-'+p.slice(11,-5)+'.geojson').features),index=load('data/stories/serial/index.json');
const targets=[{"topic":"T19","id":"E19-T19-INDIA-FAMINES-COLONIAL-RELIEF-1866-1899","article_file":"data/stories/serial/e19-t19-india-famines-colonial-relief-1866-1899.json","sections":14,"added":14,"points":3,"sources":17,"reuse":0,"chapters":{"T19.1":4,"T19.2":10}},{"topic":"T20","id":"E19-T20-INDIA-FISCAL-RAILWAY-RESOURCE-TRANSFER-1849-1899","article_file":"data/stories/serial/e19-t20-india-fiscal-railway-resource-transfer-1849-1899.json","sections":19,"added":19,"points":9,"sources":31,"reuse":0,"chapters":{"T20.1":8,"T20.2":6,"T20.3":5}},{"topic":"T31","id":"E19-T31-EAST-AFRICA-COMPANY-PROTECTORATES-RAILWAY-1884-1899","article_file":"data/stories/serial/e19-t31-east-africa-company-protectorates-railway-1884-1899.json","sections":20,"added":20,"points":7,"sources":31,"reuse":0,"chapters":{"T31.1":9,"T31.2":6,"T31.3":4,"T31.4":1}},{"topic":"T38","id":"E19-T38-CAPE-FRONTIER-DISPOSSESSION-LABOUR-1850-1899","article_file":"data/stories/serial/e19-t38-cape-frontier-dispossession-labour-1850-1899.json","sections":20,"added":16,"points":4,"sources":23,"reuse":4,"chapters":{"T38.1":7,"T38.2":5,"T38.3":8}}];
for(const t of targets){
 const r=load('research/19c/consolidated/'+t.topic+'_VERIFIED_EVENT_GIS_REGISTER.json'),a=load(r.article_file),idx=index.topics.find(x=>x.id===t.id);
 assert(idx&&idx.status==='published'&&idx.publication_review==='approved');
 assert.equal(a.id,t.id);assert.equal(a.sections.length,t.sections);assert(a.lead.length>=120);assert(a.sections.flatMap(s=>s.paragraphs).join('').length>=3000);
 assert.deepEqual(new Set(a.sections.map(s=>s.narrative_chapter)),new Set(Object.keys(t.chapters)));
 const sk=new Set(a.sources.map(s=>s.id));assert.equal(sk.size,t.sources);for(const s of a.sources)assert(s.url.startsWith('https://')&&s.access);
 const links=a.sections.flatMap(s=>[...s.paragraphs.join('\n').matchAll(/\[\[(E19-[A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]));
 assert.equal(links.length,t.sections);assert.equal(new Set(links).size,t.sections);assert.deepEqual(links,idx.event_ids);assert.deepEqual(links,r.links.map(x=>x.id));
 for(const s of a.sections){assert.equal(s.paragraphs.length,3);assert(s.source_keys.length&&s.source_keys.every(k=>sk.has(k)));}
 for(const l of r.links){assert(events.has(l.id),l.id);assert.equal(events.get(l.id).year,l.year,l.id);}
 assert.equal(r.events.length,t.added);assert.equal(r.links.filter(l=>l.reuse_existing).length,t.reuse);assert.equal(all.filter(e=>e.id.startsWith('E19-'+t.topic+'-')).length,t.added);
 for(const e of r.events){assert.deepEqual(events.get(e.id),e);assert(e.source_ids.every(k=>sources.has(k)&&sk.has(k)),e.id);assert.equal(e.visible_from,e.year);assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.area_sqkm,null);assert((e.lat===null&&e.lng===null)||(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.geo_precision.includes('not_historic')));}
 const p=pts.filter(f=>f.properties.stable_id?.startsWith('GIS-19C-'+t.topic+'-'));assert.equal(p.length,t.points);assert.equal(r.features.length,t.points);for(const f of p){assert.deepEqual(r.features.find(x=>x.id===f.id),f);assert.equal(f.geometry.type,'Point');assert(f.geometry.coordinates.every(Number.isFinite));assert(f.properties.related_event_ids.every(id=>events.has(id)));assert(f.properties.source_ids.every(k=>sources.has(k)));assert.equal(f.properties.territorial_claim,false);assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);assert.equal(f.properties.exclude_from_area_aggregation,true);}
 console.log('PASS',t.topic,t.sections,'interactive events',t.added,'new',t.points,'GIS points');
}
