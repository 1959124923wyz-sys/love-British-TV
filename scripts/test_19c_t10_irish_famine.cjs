#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T10-IRISH-FAMINE-EVICTIONS-ESTATES';
const story=load('data/stories/serial/e19-t10-irish-famine-evictions-estates-1842-1861.json');
const index=load('data/stories/serial/index.json');
const entry=index.topics.find(t=>t.id===id), old=index.topics.find(t=>t.id==='E19-IR-FAMINE-RELIEF');
assert(entry&&story.id===id);
assert(['editorial_review','published'].includes(entry.status));
assert(['not_submitted','approved'].includes(entry.publication_review));
assert(old&&old.event_ids.length===34,'legacy famine study retained');
assert.equal(story.sections.length,26);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),78);
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>6500);
assert.deepEqual(story.sections.reduce((v,s)=>(v[s.narrative_chapter]=(v[s.narrative_chapter]||0)+1,v),{}),{'T10.1':14,'T10.2':12});
const sourceIds=new Set(story.sources.map(s=>s.id));
assert.equal(sourceIds.size,story.sources.length,'no duplicate source ID');
for(const s of story.sources)assert(s.url.startsWith('https://')&&s.title&&s.publisher&&s.access,s.id);
const claimIds=new Set(story.topic_source_claims.map(c=>c.section_id));
const links=[];
for(const sec of story.sections){
  assert.equal(sec.paragraphs.length,3,sec.id);
  assert(sec.source_keys.length>=2&&sec.source_keys.every(id=>sourceIds.has(id)),sec.id);
  assert(claimIds.has(sec.id),sec.id);
  assert(sec.period_start_year>=1842&&sec.period_end_year<=1861,sec.id);
  for(const p of sec.paragraphs)for(const match of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g))links.push(match[1]);
}
const unique=[...new Set(links)];
assert.equal(unique.length,32,'verified unique linked events');
assert.deepEqual(new Set(unique),new Set(entry.event_ids));
const newIds=[
  'E19-IR-1861-DERRYVEAGH-EXECUTION',
  'E19-IR-1861-DERRYVEAGH-COMMONS-12APR',
  'E19-IR-1861-DERRYVEAGH-OFFICIAL-RETURN',
  'E19-IR-1861-LETTERKENNY-RELIEF-APPEALS'];
assert.equal(new Set(unique.filter(x=>!old.event_ids.includes(x))).size,4,'four newly researched 1861 events');
for(const x of unique)assert(old.event_ids.includes(x)||newIds.includes(x),'unknown new ID '+x);
const records=load('data/stories/serial/chronology-1840-1849.json').events.concat(load('data/stories/serial/chronology-1860-1869.json').events);
const eventById=new Map(records.map(e=>[e.id,e]));
for(const x of unique)assert(eventById.has(x)&&eventById.get(x).source_ids.length,'missing live event '+x);
for(const x of newIds){const e=eventById.get(x);assert.equal(e.year,1861);assert(e.source_ids.some(s=>s.startsWith('19C-T10-')));}
assert(eventById.get('E19-IR-1861-DERRYVEAGH-COMMONS-12APR').description.includes('280'));
assert(eventById.get('E19-IR-1861-DERRYVEAGH-OFFICIAL-RETURN').description.includes('244'));
const source60=new Set(load('data/stories/serial/chronology-1860-1869.json').sources.map(s=>s.id));
const f=load('data/nineteenth-century-spatial-1860-1869.geojson').features.filter(x=>x.id?.startsWith('t10-'));
assert.equal(f.length,1,'one new verifiable named city point, no invented eviction parcels');
const point=f[0],a=point.properties;
assert.equal(point.geometry.type,'Point');
assert.deepEqual(point.geometry.coordinates,[-7.73333,54.95]);
assert.deepEqual(a.related_event_ids,['E19-IR-1861-LETTERKENNY-RELIEF-APPEALS']);
assert(a.source_ids.length>=2&&a.source_ids.every(s=>source60.has(s)));
assert.equal(a.source_ids.length,a.source_urls.length);
assert.equal(a.historical_boundary_confirmed,false);
assert.equal(a.fill_authorized,false);
assert.equal(a.territorial_claim,false);
assert.equal(a.area_sqkm,null);
assert.equal(a.exclude_from_area_aggregation,true);
assert(a.geo_precision.includes('not_'));
const textBody=story.sections.flatMap(x=>x.paragraphs).join('\n');
for(const phrase of ['1847年','四分之一','302万','1849年','1861年','244人','43名户主','47份','500万英亩','1858年'])assert(textBody.includes(phrase),phrase);
for(const t of ['E19-T05-MORANT-BAY-MARTIAL-LAW-CROWN-COLONY','E19-T14-SINDH-PUNJAB-AWADH-CONQUEST-EXPROPRIATION','E19-T37-MAQDALA-EXPEDITION-LOOTING','E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE'])assert.equal(index.topics.find(x=>x.id===t)?.status,'published','prior published work preserved '+t);
console.log('PASS 19C T10: 26 sections / 78 paragraphs / '+story.sources.length+' sources / 32 linked events / four 1861 nodes / one accurately located named point');
