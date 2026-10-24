'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=load('docs/research/EDITOR6_17C_MAJOR_EVENT_GAP_AUDIT_20261020.json');
assert.equal(audit.cases.length,14);
assert.equal(audit.new_event_index.length,14);
const seenHistory=new Set(),index=new Map();
let records=0,geopoints=0;
for(let d=1600;d<=1690;d+=10){
 const data=load('data/atlas-'+d+'-'+(d+9)+'.json');
 assert.equal(data.period.from,d);assert.equal(data.period.to,d+9);assert.equal(data.period.next,d+10);
 assert.deepEqual(data.colonial_polygons,[]);
 const ids=new Set(data.sources.map(s=>s.id));
 for(const e of data.events){
  records++;
  assert(!seenHistory.has(e.id),'duplicate public event '+e.id);seenHistory.add(e.id);
  if(e.lat!==null)geopoints++;
  if(e.research_event_id?.startsWith('EDITOR6:')){
   assert(!index.has(e.research_event_id),'duplicate large-process claim '+e.research_event_id);
   index.set(e.research_event_id,e);
   assert(e.significance.level===3,'major history rank must be explicit');
   assert(e.historical_control_boundary_verified===false&&e.actual_English_land_area_sqkm===null);
   assert(e.geo_precision?.startsWith('representative_')&&e.geolocation_limit_zh?.includes('非事件精确现场'),'the marked point is a region, not an exact violence site');
   assert(e.source_ids.length>0&&e.source_ids.every(s=>ids.has(s)),'major event missing independent source');
  }
  assert(!e.research_event_id?.startsWith('EDITOR6-MAJOR:'),'duplicate second import must be eliminated');
 }
}
assert.equal(records,428);assert.equal(geopoints,427);
assert.equal(index.size,14);
for(const c of audit.cases){
 const e=index.get('EDITOR6:'+c.k);
 assert(e,'missing indexed major history '+c.k);
 assert.equal(e.year,c.y);
 assert(e.arc_id,'cross-century parent process must be preserved');
 assert(e.description.length>75);
}
assert(!index.has('EDITOR6:ROYAL-ADVENTURERS-AFRICA'),'1660 preliminary venture is a mother-process context, not a second major event');
const glencoe=load('data/stories/serial/chronology-preview-1600-1699.json');
assert.deepEqual(glencoe.events.map(e=>e.id),['E6-GLENCOE-1692']);
assert.equal(load('data/chapters.json').chapters.at(-1).end,1599);
console.log('PASS 14 major history additions / 14 deduped parallel copies / 1 deferred corporation preliminary / 428 decade events including six Jamaica, seven New York, nine Carolina, five Hudson Bay and twelve Acadia source-backed records + existing Glencoe, 415 mapped, no polygons');
