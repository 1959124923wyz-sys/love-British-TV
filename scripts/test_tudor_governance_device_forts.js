#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=path.resolve(__dirname,'..'),j=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const a=j('data/atlas-1530-1539.json'),b=j('data/atlas-1540-1549.json'),idx=j('data/stories/index.json').stories,notes=j('data/historical-detail-notes.json').records;
const all=new Map([...a.events,...b.events].map(e=>[e.id,e]));
const definitions=[
{id:'tudor-wales-ireland-legal-restructuring-1536-1542',need:['1530S-E007','1530S-E009','1530S-E014','1530S-E024','1540S-002','1540S-044'],end:1542},
{id:'henry-viii-device-forts-coastal-defence-1539-1547',need:['1530S-E019','1530S-E020','1530S-E021','1530S-E022','FORT1539-WALMER-CONSTRUCTION','FORT1539-PENDENNIS-WORKS','FORT1540-STMAWES-CASTLE','FORT1540-DEAL-DOWNS-COMPLETE','FORT1540-WALMER-GARRISON','FORT1541-SANDSFOOT-CASTLE','FORT1541-HURST-CASTLE','FORT1542-HURST-GARRISON','FORT1544-HURST-COMPLETE','FORT1547-DEAL-GUN-INVENTORY','FORT1547-PORTLAND-GUN-INVENTORY'],end:1547}];
assert.ok(idx.length>=14,'Ten prior stories must be preserved with two new dossiers');
for(const target of definitions){
 const meta=idx.find(q=>q.id===target.id);assert(meta,'unindexed historical topic '+target.id);
 const s=j(meta.file);assert.equal(s.id,meta.id);assert.equal(s.title,meta.title);
 assert.equal(s.end_year,target.end);
 assert.deepEqual(new Set(s.related_event_ids),new Set(meta.event_ids));
 assert.deepEqual(new Set(s.related_event_ids),new Set(target.need));
 const prose=s.sections.flatMap(t=>t.paragraphs).join('');
 assert(prose.length>=3000 && s.lead.length>=120);
 assert(s.sections.length>=9 && s.sources.length>=7);
 assert(!/对地图来说|图钉|读者需要|本地图|请注意地图/.test(prose),'GIS editorial copy leaked into reader prose');
 const refs=new Set(s.sources.map(q=>q.id));let links=0;
 for(const sec of s.sections){
  assert(sec.paragraphs.length>=2);
  assert(sec.source_keys.every(k=>refs.has(k)),'unlinked source');
  for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
   assert(target.need.includes(m[1]),'unowned inline child '+m[1]);links++;
  }
 }
 assert(links>=12,'insufficient story event links');
 for(const id of target.need)assert(all.has(id),'missing official event '+id);
 console.log('PASS article',target.id,prose.length+' chars',links+' links');
}
assert.equal(a.events.length,44);assert.equal(a.sources.length,88);
assert.equal(b.events.length,107);assert.equal(b.sources.length,145);
assert.equal(a.colonial_polygons.length,0);assert.equal(b.colonial_polygons.length,0);
const legal=['1530S-E007','1530S-E009','1530S-E014','1530S-E024','1540S-002','1540S-044'];
for(const id of legal)assert(all.get(id).geographic_rule!=='conquered_territory','legal statute cannot create new control area');
assert.equal(all.get('1540S-002').year,1541);
assert.equal(all.get('1540S-044').year,1542,'Conn O’Neill 1542 submission must never backdate to 1541');
assert.equal(all.get('1530S-E007').lat,null,'multi-site Welsh legislation cannot be mapped as a single battle pin');
for(const id of definitions[1].need.filter(q=>q.startsWith('FORT'))){
 const e=all.get(id);assert(e,'missing '+id);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),id+' should have verified heritage site');
 assert(e.source_ids.length>=1 && e.source_ids.every(sid=>(e.year<1540?a:b).sources.some(x=>x.id===sid)),id+' cited sources not registered');
 assert(notes[id],id+' missing research note');
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.colonial_profit,null);
 assert.match(e.geographic_rule,/domestic|royal_defence/);
}
assert.equal(all.get('1530S-E022').lat,51.115042,'Archcliffe official NGR modern site absent');
assert.equal(all.get('FORT1540-WALMER-GARRISON').year,1540);
assert.equal(all.get('FORT1541-HURST-CASTLE').year,1541);
assert.equal(all.get('FORT1542-HURST-GARRISON').year,1542);
assert.equal(all.get('FORT1544-HURST-COMPLETE').year,1544);
assert(all.get('FORT1547-DEAL-GUN-INVENTORY').description.includes('57'));
assert(all.get('FORT1547-PORTLAND-GUN-INVENTORY').description.includes('15'));
assert.equal(a.routes.length,0);assert.equal(b.routes.length,0);
console.log('PASS 12/13: verified statutes and original actors, 11 new historical coastal site milestones, no new occupation land polygon or fabricated military routes');
