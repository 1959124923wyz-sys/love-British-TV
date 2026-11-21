#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const claims=load('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson');
const studies=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
const mapped=load('data/seventeenth-century-editor43-5ai-localized-geometries-1600-1699.geojson');
const disposition=load('docs/research/17C_5AI_26_RECTANGLE_DISPOSITIONS.json');
const byOld=new Map();
for(const f of mapped.features){
 const id=f.properties.supersedes_visual_reference;
 if(!byOld.has(id))byOld.set(id,[]);
 byOld.get(id).push(f);
}
assert.equal(byOld.size,26);
const pointOnly=new Set([...byOld].filter(([,v])=>v.every(f=>f.geometry.type==='Point')).map(([id])=>id));
const polygonUpgraded=new Set([...byOld].filter(([,v])=>v.some(f=>f.geometry.type==='Polygon')).map(([id])=>id));
assert.equal(pointOnly.size,23);
assert.equal(polygonUpgraded.size,3);
assert.equal([...pointOnly].filter(x=>x.startsWith('claim-')).length,11);
assert.equal([...pointOnly].filter(x=>x.startsWith('17c-')).length,12);
const original=[...claims.features,...studies.features];
for(const id of pointOnly){
 const f=original.find(x=>x.id===id);
 assert(f&&f.geometry.type==='Polygon'&&f.properties.source_urls?.length,id);
 assert(f.properties.start_year<=f.properties.end_year,id);
 assert(byOld.get(id).every(x=>x.properties.source_urls.length&&x.geometry.type==='Point'),id);
}
for(const id of polygonUpgraded)assert(!pointOnly.has(id),id);
assert.equal(disposition.original_rectangles,26);
assert(app.includes("const pointOnlyClaimIds=new Set("));
assert(app.includes("const pointOnlyStudyIds=new Set("));
assert(app.includes("className:'atlas-17c-5aj-reference-outline atlas-17c-5aj-claim-outline'"));
assert(app.includes("className:'atlas-17c-5aj-reference-outline atlas-17c-5aj-study-outline'"));
assert.equal((app.match(/atlas-17c-5aj-reference-outline/g)||[]).length,2);
for(const part of app.split("className:'atlas-17c-5aj-reference-outline").slice(0,2)){
 assert(part.includes('fill:false,fillOpacity:0'),'No-filled-area rule');
 assert(part.includes("dashArray:'2 10'"),'Uncertain reference must be dashed');
}
assert(!app.includes('if(!selected.length)return;'), 'Do not discard point-only upgrades when no old claims are selected');
console.log('PASS 5AJ: 23 dated source-linked study/claim context outlines, 3 natural-island upgrades kept, no territorial fill');
