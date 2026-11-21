#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const J=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const registry=J('data/eighteenth-century-editor44-5aj-reference-fallbacks.json');
const named=J('data/eighteenth-century-editor36-5y-named-sites.json');
const original=[
 ...J('data/eighteenth-century-b37-india-ocean.json').zones,
 ...J('data/eighteenth-century-b39-gulf-surat-factories.json').zones
];
const byOld=new Map(original.map(o=>[o.id,o]));
const bySite=new Map(named.sites.map(o=>[o.id,o]));
assert.equal(registry.schema,'atlas-18c-5aj-selected-point-only-area-context-v1');
assert.equal(registry.restored_small_locality_reference_count,32);
assert.equal(registry.records.length,32);
assert.equal(registry.excluded_nonlocal_or_new_mapped_reference_count,25);
assert.equal(new Set(registry.records.map(x=>x.id)).size,32);
assert.equal(registry.records.filter(x=>x.id.startsWith('B37-')).length,8);
assert.equal(registry.records.filter(x=>x.id.startsWith('B39-')).length,24);
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const visible=(id,y)=>{
 const entry=registry.records.find(x=>x.id===id);if(!entry)return false;
 return active(byOld.get(id),y)&&active(bySite.get(entry.site_id),y);
};
for(const r of registry.records){
 const o=byOld.get(r.id),site=bySite.get(r.site_id);assert(o&&site,r.id);
 assert.equal(o.superseded_by,r.site_id,r.id);
 assert(site.records.some(x=>x.legacy_id===r.id),r.id);
 assert(named.retired_zone_ids.includes(r.id),r.id);
 assert.deepEqual(o.bbox,r.bbox,r.id);
 assert.deepEqual(o.periods,r.periods,r.id);
 assert.deepEqual(o.source_urls,r.source_urls,r.id);
 assert.equal(o.area_sqkm,null);assert.equal(r.area_sqkm,null);
 assert.equal(r.historical_boundary_confirmed,false);
 assert.equal(r.geographic_role,'nonmetric_hollow_source_locality_context');
 assert(o.bbox[2]-o.bbox[0]<=0.6+1e-9&&o.bbox[3]-o.bbox[1]<=0.6+1e-9,r.id);
 assert(site.periods.some(p=>o.periods.some(q=>p.start_year<=q.end_year&&q.start_year<=p.end_year)));
}
assert(!registry.records.some(x=>['B39-G-Z004','B39-G-Z006','B39-G-Z012','B39-G-Z045','B37-I-Z055'].includes(x.id)));
assert(visible('B39-G-Z005',1775));
assert(!visible('B39-G-Z005',1770));
assert(!visible('B39-G-Z018',1796));
assert(visible('B39-G-Z018',1795));
for(const jsPath of ['js/eighteenth-batch37-spatial.js','js/eighteenth-batch39-spatial.js']){
 const js=fs.readFileSync(path.join(__dirname,'..',jsPath),'utf8');
 assert(js.includes('eighteenth-century-editor44-5aj-reference-fallbacks.json'));
 assert(js.includes('atlas-18c-5aj-reference-outline'));
 assert(js.includes("dashArray:'2 10',lineCap:'round',fill:false,fillOpacity:0"));
 assert(js.includes('site?.periods.some('));
 assert(js.includes("originalById.get(x.id)"));
 assert(js.includes('visibleRecoveredReferenceOutlines'));
}
console.log('PASS 5AJ 18C: 32 small cited outlines reinstated; 25 oversized/precision-sensitive items excluded; dated sites and area metrics protected');
