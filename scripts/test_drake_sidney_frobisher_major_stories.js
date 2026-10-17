#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const a=read('data/atlas-1570-1579.json'),idx=read('data/stories/index.json').stories;
const events=new Map(a.events.map(x=>[x.id,x])),refs=new Set(a.sources.map(x=>x.id));
assert.ok(idx.length>=26);assert.equal(a.events.length,89);assert.equal(a.sources.length,94);assert.equal(a.routes.length,27);
for(const [id,start,end,minimum]of [
['drake-panama-mule-train-raid-1572-1573',1572,1573,7],
['sidney-pale-cess-connacht-military-campaign-1575-1578',1575,1578,11],
['frobisher-arctic-inuit-captives-mining-1576-1578',1576,1578,14]]){
const m=idx.find(x=>x.id===id);assert(m,'missing index '+id);
const s=read(m.file),text=s.sections.flatMap(x=>x.paragraphs).join(''),links=[...text.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)];
assert(s.start_year===start&&s.end_year===end&&s.sections.length>=10);
assert(text.length>=3000,'article too short '+id);
assert(links.length>=12,'need 12 grounded event hyperlinks in '+id);
assert(s.related_event_ids.length>=minimum);
assert.deepEqual(new Set(m.event_ids),new Set(s.related_event_ids));
const sources=new Set(s.sources.map(x=>x.id));
for(const sc of s.sections){assert(sc.paragraphs.length>=3&&sc.source_keys.length&&sc.source_keys.every(x=>sources.has(x)),id);}
for(const l of links)assert(m.event_ids.includes(l[1])&&events.has(l[1]),'link inaccessible '+l[1]);
for(const eid of s.related_event_ids)assert(events.has(eid),'map dossier absent '+eid);
}
const newIds=['DRA1572-PLYMOUTH-DEPARTURE','DRA1572-NOMBRE-DE-DIOS-WOUNDED','DRA1573-PANAMA-VIEJO-SILVER-ROAD','DRA1573-VENTA-DE-CRUCES-RAID','DRA1573-CIMARRON-LE-TESTU-ALLIANCE','SID1575-DROGHEDA-CESS','SID1577-LONDON-PALE-LAWYERS-JAILED','SID1577-DUBLIN-CASTLE-PALE-PETITION','SID1578-PALE-OPPONENTS-IMPRISONED','SID1578-SIDNEY-RECALL','FRO1576-RATCLIFFE-DEPARTURE','FRO1577-HARWICH-SECOND-VOYAGE','FRO1578-HARWICH-15-SHIP-MINING','FRO1578-KODLUNARN-STONE-HOUSE','FRO1578-DARTFORD-SMELTING'];
for(const id of newIds){let e=events.get(id);assert(e,'not added '+id);
assert(e.source_ids.length&&e.source_ids.every(x=>refs.has(x)),'dangling evidence '+id);
assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);
assert.equal(e.actual_English_territory_created,false);
assert.equal(e.historical_control_boundary_verified,false);
}
assert.deepEqual(newIds.filter(id=>events.get(id).lat===null).sort(),['DRA1573-CIMARRON-LE-TESTU-ALLIANCE','DRA1573-VENTA-DE-CRUCES-RAID'].sort());
assert.deepEqual([events.get('DRA1573-PANAMA-VIEJO-SILVER-ROAD').lat,events.get('DRA1573-PANAMA-VIEJO-SILVER-ROAD').lng],[9.006,-79.486]);
assert(!events.get('DRA1573-PANAMA-VIEJO-SILVER-ROAD').description.includes('1673年以后重建'),'Panama 1573 must be historic Panama Viejo, not modern Casco');
assert.deepEqual([events.get('FRO1578-KODLUNARN-STONE-HOUSE').lat,events.get('FRO1578-KODLUNARN-STONE-HOUSE').lng],[62.816667,-65.416667]);
for(const id of ['ch9-drake-1573-panama-viejo-nombre-de-dios-silver-cargo','ch9-frobisher-1577-harwich-kodlunarn-expedition','ch9-frobisher-1578-harwich-kodlunarn-mining-fleet','ch9-frobisher-1578-kodlunarn-to-dartford-ore']){
const r=a.routes.find(x=>x.id===id);assert(r&&r.coords.length>=2&&r.source_ids.every(x=>refs.has(x)));
assert.equal(r.certainty,'schematic-only-not-historical-track');assert.equal(r.verified_English_territorial_control,false);
assert(r.related_event_ids.every(e=>events.has(e)));
}
let first=a.routes.find(x=>x.id==='ch9-Frobisher-1576-1578-Harwich-Nunavut');
assert.deepEqual(first.coords[0],[51.511,-0.054],'1576 departure must be Ratcliffe, not 1577 Harwich');
assert.equal(a.colonial_polygons.length,0);
assert.equal(events.get('1570S-E035').year,1577);assert.equal(events.get('1570S-E036').year,1577);
console.log('PASS: stories 31–33, 15 documented extra events, 13 geocoded/2 deliberately unlocated, Panama Viejo UNESCO coordinates, four schematic travel/ore links, Inuit victim chronology.');
