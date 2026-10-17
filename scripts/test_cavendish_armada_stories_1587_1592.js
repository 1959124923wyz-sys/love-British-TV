#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('data/atlas-1580-1589.json'),b=read('data/atlas-1590-1599.json');
const index=read('data/stories/index.json').stories,all=new Map([...a.events,...b.events].map(e=>[e.id,e]));
const specs=[
['cavendish-pacific-brazil-privateering-1587-1592',1587,1592,14],
['spanish-armada-ireland-wrecks-killings-refuge-1588',1588,1588,14]];
assert.equal(index.length,24);
assert.equal(a.events.length,46);assert.equal(a.sources.length,90);assert.equal(a.routes.length,9);
assert.equal(b.events.length,45);assert.equal(b.sources.length,77);assert.equal(b.routes.length,2);
for(const [id,from,to,min]of specs){
 const item=index.find(s=>s.id===id);assert(item,'story not indexed '+id);
 const story=read(item.file);const full=story.sections.flatMap(s=>s.paragraphs).join('');
 assert.equal(story.start_year,from);assert.equal(story.end_year,to);assert(story.sections.length>=min);assert(full.length>=3000,'article too short '+id);
 assert(story.sources.length>=5);assert.deepEqual(new Set(item.event_ids),new Set(story.related_event_ids));
 assert(new Set(item.event_ids).size===item.event_ids.length);
 for(const e of item.event_ids){assert(all.has(e),'unmapped '+e);assert(all.get(e).year>=from&&all.get(e).year<=to)}
 let n=0;for(const match of full.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]]+)\]\]/g)){assert(item.event_ids.includes(match[1]),'orphan link '+match[1]);n++}assert(n>=12,'missing story map references');
 for(const section of story.sections){assert(section.paragraphs.length>=2);assert(section.source_keys.every(k=>story.sources.some(s=>s.id===k)));}
}
const addedA=['CAV1587-PUNA-SPANISH-COUNTERATTACK','CAV1587-SANTAANA-ASIAN-CAPTIVES','CAV1588-PLYMOUTH-RETURN','ARM1588-KINNAGOE-TRINIDAD-VALENCERA','ARM1588-INISHOWEN-LOCAL-KILLINGS','ARM1588-GIRONA-GIANTS-CAUSEWAY-WRECK','ARM1588-PEDRO-BLANCO-ONEILL-SERVICE'];
const addedB=['CAV1591-PLYMOUTH-DEPARTURE','CAV1591-ILHA-GRANDE-HOUSE-RAIDS','CAV1592-MAGELLAN-FAILED-PASSAGE','CAV1592-SANTOS-REATTACK-REPELLED','CAV1592-VITORIA-REPELLED','CAV1592-SAO-SEBASTIAO-KNIVET','CAV1592-DEATH-AT-SEA'];
for(const [atlas,ids]of [[a,addedA],[b,addedB]]){
 const source=new Set(atlas.sources.map(s=>s.id));
 for(const id of ids){const e=all.get(id);assert(e);assert(e.source_ids.length&&e.source_ids.every(s=>source.has(s)),id+' lacks citation');assert.equal(e.actual_English_territory_created,false);assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.historical_control_boundary_verified,false);}
 assert.equal(atlas.colonial_polygons.length,0);
}
for(const id of ['CAV1587-SANTAANA-ASIAN-CAPTIVES','ARM1588-INISHOWEN-LOCAL-KILLINGS','ARM1588-PEDRO-BLANCO-ONEILL-SERVICE','CAV1592-DEATH-AT-SEA']){assert.equal(all.get(id).lat,null);assert.equal(all.get(id).lng,null);}
const stage=a.events.filter(e=>e.id.startsWith('ARM1588-')||e.id==='GAP1588-SLIGO-ARMADA-EXECUTIONS');
const georg=stage.find(e=>e.id==='GAP1588-SLIGO-ARMADA-EXECUTIONS'),storm=stage.find(e=>e.id==='ARM1588-STREEDAGH-STORM'),girona=stage.find(e=>e.id==='ARM1588-GIRONA-GIANTS-CAUSEWAY-WRECK');
assert(georg.description.includes('至少700')||georg.description.includes('至少700名'));
assert(storm.description.includes('1,100')||storm.description.includes('1,100人'));
assert(girona.description.includes('五人')||girona.description.includes('五人获救'));
const historicalRoutes=[...a.routes,...b.routes].filter(r=>r.id.startsWith('ch10-cavendish-')||r.id.startsWith('ch11-cavendish-'));
assert.equal(historicalRoutes.length,4);
assert.deepEqual(new Set(historicalRoutes.map(r=>r.voyage_id)),new Set(['cavendish-first-1586-1588','cavendish-second-1591-1592']));
for(const r of historicalRoutes){assert.equal(r.coords.length,2);assert.equal(r.certainty,'schematic-only-not-historical-track');assert.equal(r.actual_area_sqkm,null);assert.equal(r.verified_English_territorial_control,false);assert(r.related_event_ids.every(x=>all.has(x)));}
const escape=a.routes.find(r=>r.id==='ch10-cuellar-1588-streedagh-rosclogher-refuge');
assert(escape&&escape.coords.length===2&&escape.related_event_ids.every(x=>all.has(x)));
const regions=read('data/century-violence-regions-1544-1589.geojson').features.filter(x=>x.id.startsWith('ir-armada-1588-'));
assert.equal(regions.length,4,'retain four old dashed reading regions; no arbitrary additional polygons');
assert(regions.every(f=>f.properties.fill_authorized===false&&f.properties.territorial_claim===false&&f.properties.area_sqkm===null));
const story40=read('data/stories/cavendish-pacific-brazil-privateering-1587-1592.json');
assert(story40.lead.includes('1586年')&&story40.lead.includes('1591年'),'distinct expeditions must be explicit');
console.log('PASS: Topics 40–41, 28 narrative sections, 14 additive sourced events, two separate Cavendish voyages, Girona storm versus ≥700 Crown executions, preexisting dashed non-territorial zones retained.');
