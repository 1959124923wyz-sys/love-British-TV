#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),root=path.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=J('data/atlas-1560-1569.json'),b=J('data/atlas-1570-1579.json'),idx=J('data/stories/index.json').stories,geo=J('data/century-violence-regions-1544-1589.geojson');
const events=new Map([...a.events,...b.events].map(x=>[x.id,x]));
assert.equal(idx.length,21);assert.equal(a.events.length,43);assert.equal(a.sources.length,35);assert.equal(a.routes.length,17);
assert.equal(b.events.length,68);assert.equal(b.sources.length,83);assert.equal(b.routes.length,26);
const needs=[
['munster-gilbert-first-desmond-rebellion-1569',1569,1569,17],
['ards-clandeboye-essex-rathlin-colonisation-1571-1575',1571,1575,17]
];
for(const[id,start,end,minEvents]of needs){
 const meta=idx.find(m=>m.id===id);assert(meta,id+' missing index');
 const s=J(meta.file),prose=s.sections.flatMap(q=>q.paragraphs).join('');
 assert(s.sections.length>=10&&prose.length>=3000);
 assert.equal(s.start_year,start);assert.equal(s.end_year,end);assert(s.related_event_ids.length>=minEvents);
 assert.deepEqual(new Set(meta.event_ids),new Set(s.related_event_ids));
 const sources=new Set(s.sources.map(x=>x.id));let links=0;
 for(const q of s.sections){assert(q.paragraphs.length>=3&&q.source_keys.every(k=>sources.has(k)));
   for(const p of q.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
      links++;assert(s.related_event_ids.includes(m[1])&&events.has(m[1]),'invalid link '+m[1]);
   }
 }
 assert(links>=12,'missing contextual event navigation');
 for(const eid of s.related_event_ids)assert(events.has(eid),eid);
}
const newA=['MUN1569-CORK-KERRY-COLONIAL-GRANT','MUN1569-FITZMAURICE-KILMALLOCK','MUN1569-CORK-RELIGIOUS-ULTIMATUM','MUN1569-BUTLER-ENNISCORTHY-FAIR','MUN1569-ORMOND-ROYAL-CAMPAIGN'];
const newB=['ULS1572-ARDS-NEWMONASTERY-BURNINGS','ULS1573-CARRICKFERGUS-BURNING','ULS1574-CARRICKFERGUS-PLAGUE','ULS1574-BRIAN-DUBLIN-EXECUTION','ULS1575-BLACKWATER-RIVER-FORT','ULS1575-RATHLIN-CASTLE-DEFENDERS','ULS1575-RATHLIN-CAVE-CIVILIANS','ULS1575-CARRICKFERGUS-MACDONNELL','ULS1575-SMITH-ARDS-COLLAPSE'];
for(const[id,db]of [...newA.map(x=>[x,a]),...newB.map(x=>[x,b])]){let e=events.get(id);
 assert(e&&e.source_ids.length&&e.source_ids.every(k=>db.sources.some(s=>s.id===k)),id);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),id);
 assert.equal(e.actual_English_territory_created,false);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.colonial_profit,null);
}
for(const id of ['MUN1569-GARRYSTOWN-MASSACRE','MUN1569-HEADS-TERROR']){
 const e=events.get(id);assert(e&&e.lat===null&&e.lng===null,'never fabricate undocumented atrocity site '+id);
}
assert.equal(events.get('1570S-E009').year,1574);
assert.equal(events.get('ULS1574-BRIAN-DUBLIN-EXECUTION').year,1574,'legal execution separate from Belfast murder');
for(const id of ['ULS1575-RATHLIN-CASTLE-DEFENDERS','ULS1575-RATHLIN-CAVE-CIVILIANS']){
 assert.equal(events.get(id).year,1575);
 assert(events.get(id).category==='massacre');
}
for(const [db,ids]of [[a,['mun1569-royal-bruree-kilmallock-cork-direction']],[b,['uls1574-essex-tyrone-lifford-scorch-direction','uls1575-drake-carrickfergus-rathlin-assault']]]){
 for(const id of ids){const r=db.routes.find(x=>x.id===id);assert(r&&r.coords.length>=2&&r.certainty==='schematic-only-not-historical-track');
 assert(r.source_ids.every(k=>db.sources.some(s=>s.id===k))&&r.related_event_ids.every(x=>events.has(x)));
 assert.equal(r.verified_English_territorial_control,false);}
}
assert.equal(geo.features.length,28);
for(const id of ['ir-ards-1572-1575-smith-settlement-reading','ir-rathlin-1575-attack-civilian-refuge-reading']){
 const f=geo.features.find(q=>q.id===id);assert(f,id);const p=f.properties;
 assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.related_event_ids.every(x=>events.has(x)));
 assert(p.source_ids.every(k=>b.sources.some(s=>s.id===k)));
}
console.log('PASS history stories 28/30: 14 new locations; 3 named dashed army/sea axes; 2 non-sovereign research areas; original 1569 unlocated atrocities and Rathlin soldier/civilian separation');
