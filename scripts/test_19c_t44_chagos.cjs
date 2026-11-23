#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const tid='E19-T44-CHAGOS-PLANTATIONS-COAL-INDENTURE-LAND-1835-1888';
const filename='data/stories/serial/e19-t44-chagos-plantations-coal-indenture-1835-1888.json';
const story=load(filename),registry=load('data/stories/serial/index.json'),topic=registry.topics.find(t=>t.id===tid);
const manifest=load('research/19c/consolidated/T44_CASE_CROSSWALK.json');
assert(topic&&story.id===tid&&topic.article_file===filename);
assert.equal(story.sections.length,35);assert.equal(story.sections.reduce((x,s)=>x+s.paragraphs.length,0),105);
assert.deepEqual(story.sections.reduce((o,s)=>(o[s.narrative_chapter]=(o[s.narrative_chapter]||0)+1,o),{}),{'T44.1':9,'T44.2':10,'T44.3':16});
assert.equal(story.sources.length,21);assert.equal(story.topic_source_claims.length,35);
assert.equal(manifest.events.length,35);assert.equal(manifest.events.filter(x=>!x.already_in_site).length,33);assert.equal(manifest.reuse_existing.length,2);
assert.deepEqual(new Set(manifest.reuse_existing),new Set(['E19-CHAGOS-1835-APPRENTICESHIP','E19-MAU-1839-APPRENTICESHIP-END']));
assert(!manifest.events.some(e=>e.year>=1900),'no 1967–1973 backdating');
const sourceIds=new Set(story.sources.map(s=>s.id));assert.equal(sourceIds.size,21);
for(const s of story.sources)assert(s.url.startsWith('https://')&&s.access,s.id);
const sectids=new Set(story.sections.map(s=>s.id));assert.equal(sectids.size,35);
for(const s of story.sections){
 assert.equal(s.paragraphs.length,3,s.id);
 assert(s.source_keys.length>0&&s.source_keys.every(k=>sourceIds.has(k)),s.id);
 assert(s.paragraphs.every(p=>p.length>=42),s.id);
 assert(s.period_start_year>=1835&&s.period_end_year<=1888,s.id);
}
for(const c of story.topic_source_claims)assert(sectids.has(c.section_id)&&c.source_keys.length&&c.source_keys.every(k=>sourceIds.has(k)));
const links=[...story.sections.flatMap(s=>s.paragraphs).join('\n').matchAll(/\[\[(E19-[A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)].map(m=>m[1]);
assert.equal(links.length,35);assert.equal(new Set(links).size,35);
assert.deepEqual(new Set(links),new Set(topic.event_ids));
assert.deepEqual(new Set(links),new Set(manifest.events.map(x=>x.id)));
const chronicles=[1830,1850,1860,1880].map(n=>load('data/stories/serial/chronology-'+n+'-'+(n+9)+'.json'));
const events=chronicles.flatMap(x=>x.events);const existing=new Set(events.map(x=>x.id));
assert(links.every(id=>existing.has(id)),'every article link resolves to a real historical event');
const added=events.filter(x=>x.id.startsWith('E19-T44-'));
assert.equal(added.length,33);assert.equal(new Set(added.map(x=>x.id)).size,33);
const reg=new Set(chronicles.flatMap(x=>x.sources.map(s=>s.id)));
for(const e of added){
 assert.equal(e.lat,null);assert.equal(e.lng,null);
 assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.territorial_claim,false);assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
 assert(e.source_ids.length&&e.source_ids.every(x=>sourceIds.has(x)&&reg.has(x)),e.id);
 assert(e.year>=1835&&e.year<=1888);
}
const joined=story.sections.flatMap(s=>s.paragraphs).join('');
for(const value of ['431','147,519','40名','1.20卢比','15,100吨','7,000吨','两英亩','四英亩','六英亩','1,400英镑'])assert(joined.includes(value),'historical numeric source claim missing '+value);
assert(!added.some(x=>/1967|1973|驱逐/.test(x.id)),'twentieth-century expulsions must be postscript only');
const geoFiles=[1830,1850,1860,1880].map(n=>load('data/nineteenth-century-spatial-'+n+'-'+(n+9)+'.geojson'));
const pts=geoFiles.flatMap(x=>x.features).filter(f=>f.id?.startsWith('t44-'));
assert.equal(pts.length,8);
for(const f of pts){
 assert.equal(f.geometry.type,'Point',f.id);
 assert(f.geometry.coordinates.length===2&&f.geometry.coordinates.every(Number.isFinite),f.id);
 const p=f.properties;assert(p.related_event_ids.length===1&&existing.has(p.related_event_ids[0]),f.id);
 assert(p.source_ids.length===2&&p.source_urls.length===2&&p.source_ids.every(x=>reg.has(x)));
 assert(p.source_urls.every(u=>u.startsWith('https://')));
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.territorial_claim,false);assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.geo_precision.includes('not_historic'),f.id);
}
const two=added.find(x=>x.id==='E19-T44-1865-N09'),four=added.find(x=>x.id==='E19-T44-1865-N10');
assert(two.description.includes('两英亩')&&four.description.includes('四英亩'),'conflicting land concession lengths documented separately');
const et=added.find(x=>x.id==='E19-T44-1883-C11-E18');assert(et.description.includes('40名索马里'),'source count 40');
console.log('PASS T44: 35 sections, 105 paragraphs, 21 source entries, 35 links / 33 new + 2 reused events / 8 NGA-GeoNames points, all historical land parcels and labour camps not geocoded');
