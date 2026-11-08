#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../research/18c/consolidated');
const groups=JSON.parse(fs.readFileSync(path.join(base,'MERGED_EPISODE_GROUPS.json'),'utf8')).groups;
const manifest=JSON.parse(fs.readFileSync(path.join(base,'CONSOLIDATION_MANIFEST.json'),'utf8'));
assert.equal(manifest.original_events,1126);assert.equal(groups.length,162);
const tier={main_candidate:0,topic_only:0,article_only:0};
const ids=new Set(),original=new Set();
for(const g of groups){
 assert(!ids.has(g.id));ids.add(g.id);tier[g.map_display_tier]++;
 assert(g.start_year>=1700&&g.end_year<=1799&&g.start_year<=g.end_year);
 assert.equal(g.geometry,null);assert.equal(g.event_site_lat,null);assert.equal(g.event_site_lon,null);
 assert.equal(g.mapping_approved,false);assert.equal(g.history_verified,false);
 assert.equal(g.publication_status,'not_submitted');assert.equal(g.territorial_polygons.length,0);
 assert.equal(g.candidate_subevents.length,g.original_candidate_count);
 for(const x of g.candidate_subevents){assert(!original.has(x.original_id));original.add(x.original_id);}
 for(const x of g.source_keys)assert(/^[ABC]:/.test(x));
}
assert.deepEqual(tier,{main_candidate:82,topic_only:58,article_only:22});
assert.equal(original.size,315);
for(let i=1;i<=35;i++){
 const id='T'+String(i).padStart(2,'0');
 const set=JSON.parse(fs.readFileSync(path.join(base,'series',id+'.json'),'utf8'));
 assert.deepEqual(set.groups.map(x=>x.id),groups.filter(x=>x.story_arc_id===id).map(x=>x.id));
}
assert.equal(fs.readFileSync(path.join(base,'ORIGINAL_TO_GROUP.csv'),'utf8').trimEnd().split('\n').length,316);
assert.equal(fs.readFileSync(path.join(base,'COMPLETE_1126_ARCHIVE_CROSSWALK.csv'),'utf8').trimEnd().split('\n').length,1127);
assert.equal(fs.readFileSync(path.join(base,'18C_Consolidated_Research_Handoff_20261108.zip')).subarray(0,2).toString(),'PK');
const sourceArchives=[{"name":"assistant_A_americas_round8.zip","size":1436728,"sha256":"75be4b7845da3d879958fb248797a1cdcfa86d562bccab45ec959483bfb72ec5"},{"name":"assistant_B_asia_africa_round7.zip","size":992322,"sha256":"7bb1ec8d55b2b576c47ddab64c95bd06998778bb07787e257655231a680c8b74"},{"name":"assistant_C_continuity_round8.zip","size":711148,"sha256":"24f180645cca22f21e0d515164ed3214878d8c6f18dc81af56d758c2be1d96da"}];
const crypto=require('node:crypto');
for(const f of sourceArchives){
 const buf=fs.readFileSync(path.join(base,'raw_sources',f.name));
 assert.equal(buf.length,f.size);assert.equal(buf.subarray(0,2).toString(),'PK');
 assert.equal(crypto.createHash('sha256').update(buf).digest('hex'),f.sha256);
}
console.log('PASS: 1126 originals preserved, 315 selected assigned once to 162 research groups, 35 series files, no approved geometry');
