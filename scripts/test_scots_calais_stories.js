#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),j=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const periods=['1497-1509','1510-1519','1520-1529','1530-1539','1540-1549','1550-1559','1560-1569','1570-1579','1580-1589','1590-1599'];
const atlases=periods.map(s=>j('data/atlas-'+s+'.json'));
const events=new Map(atlases.flatMap(d=>d.events).map(e=>[e.id,e]));
const index=j('data/stories/index.json').stories;
const targets=[
 ['anglo-scottish-war-border-raids-1522-1523',1522,1523,['SC1522-KELSO-RAID','SC1523-KELSO-ABBEY-ATTACK','SC1523-ALBANY-COLDSTREAM-MUSTER']],
 ['calais-guines-english-pale-1497-1558',1497,1558,['1500-CALAIS-ETAPLES','1505-CALAIS-STAPLE-ROYAL-PAYMENTS','1529-GUINES-LAWS','CAL1542-GARRISON-ACCOUNTS','1550S-E018','1550S-E019','1550S-E025','CAL1558-RISBAN-FRENCH-CAPTURE','CAL1558-NEWNHAM-FRENCH-CAPTURE']]
];
assert.ok(index.length>=10,'Preserve prior eight stories while accepting later verified articles');
for(const[id,start,end,needed]of targets){
 const meta=index.find(x=>x.id===id);assert(meta,id+' not indexed');
 const story=j(meta.file);assert.equal(story.id,id);assert.equal(story.title,meta.title);
 assert.equal(story.start_year,start);assert.equal(story.end_year,end);
 assert(story.sections.length>=8&&story.sources.length>=7);
 assert.deepEqual(new Set(story.related_event_ids),new Set(meta.event_ids));
 const txt=[story.lead,...story.sections.flatMap(x=>x.paragraphs)].join('');
 assert(txt.length>=3000,id+' prose too short');
 assert(!/对地图来说|读者需要|请注意地图|本地图|图钉|这意味着地图/.test(txt),'GIS editorial leaked into longform '+id);
 const keys=new Set(story.sources.map(s=>s.id));let links=0;
 for(const section of story.sections){
  assert(section.paragraphs.length>=2);
  for(const k of section.source_keys)assert(keys.has(k),'unlisted '+k);
  for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
   assert(events.has(m[1]),'unmatched event link '+m[1]);assert(meta.event_ids.includes(m[1]),'unowned inline event '+m[1]);links++;
  }
 }
 assert(links>=12,'historical article lacks live event links '+id);
 for(const eid of needed)assert(story.related_event_ids.includes(eid)&&events.has(eid),'important documented event absent '+eid);
 console.log('PASS narrative',id,'chars',txt.length,'links',links);
}
const fourth=atlases[2],sixth=atlases[4];
assert.equal(fourth.events.length,35);
assert.equal(fourth.routes.length,5);
assert.equal(sixth.events.length,107);
assert.equal(sixth.sources.length,145);
assert.equal(atlases[5].events.length,39,'preserve all historical 1550s events, including four documented Marian law and executions');
assert.equal(atlases[5].sources.length,67);
const routes={
'SC1523-COLDSTREAM-WARK-SCOTS-ADVANCE':{y:1523,actor:'Scotland_France_counteroffensive',points:2},
'FR1522-CLOUET-HENVIC-MORLAIX-RAID':{y:1522,actor:'England_raid',points:3}
};
for(const [id,spec]of Object.entries(routes)){
 const r=fourth.routes.find(x=>x.id===id);assert(r,'missing relation '+id);
 assert.deepEqual(r.valid_years,[spec.y]);assert.equal(r.year,spec.y);assert.equal(r.actor,spec.actor);
 assert.equal(r.coords.length,spec.points);assert.equal(r.historical_boundary_confirmed,false);assert.equal(r.territorial_claim,false);assert.equal(r.area_sqkm,null);
 for(const sid of r.source_ids)assert(fourth.sources.some(s=>s.id===sid));
}
for(const id of ['SC1522-KELSO-RAID','SC1523-KELSO-ABBEY-ATTACK','SC1523-ALBANY-COLDSTREAM-MUSTER','FR1522-CLOUET-CARANTEC-LANDING','FR1522-HENVIC-LEZIREUR-BURNING','CAL1542-GARRISON-ACCOUNTS','FR1542-MORLAIX-TAUREAU-FORT','CAL1558-RISBAN-FRENCH-CAPTURE','CAL1558-NEWNHAM-FRENCH-CAPTURE']){
 const e=events.get(id);assert(e&&Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert.equal(e.actual_English_land_area_sqkm,null);
 assert(j('data/historical-detail-notes.json').records[id],id+' missing archived note');
}
assert(!index.some(x=>x.id.includes('morlaix')),'C-ranked Morlaix must remain an event chain, not standalone article');
assert.equal(fourth.colonial_polygons.length,0);
assert.equal(sixth.colonial_polygons.length,0);
assert(index.find(x=>x.id==='calais-guines-english-pale-1497-1558').end_year===1558);
console.log('PASS two first-person narratives, two opposing military lines, C-rank Morlaix local points and Calais financial chronology');
