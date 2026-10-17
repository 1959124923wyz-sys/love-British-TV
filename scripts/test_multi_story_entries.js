#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const idx=JSON.parse(fs.readFileSync(path.join(root,'data/stories/index.json'),'utf8')).stories;
const ui=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
new vm.Script(ui);
const byEvent=new Map();
for(const s of idx)for(const id of s.event_ids||[]){
 const v=byEvent.get(id)||[];if(!v.includes(s.id))v.push(s.id);byEvent.set(id,v);
}
const shared=[...byEvent].filter(([id,ids])=>ids.length>1);
assert.deepEqual(shared.slice().sort((a,b)=>a[0].localeCompare(b[0)),[
 ['1580S-E029',['munster-desmond-1579-1586','munster-plantation-land-grants-and-aftermath-1584-1589']],
 ['ARM1588-STREEDAGH-STORM',['bingham-connacht-military-exactions-1586-1591','spanish-armada-invasion-channel-battles-and-war-1585-1599']],
 ['ARM1588-STREEDAGH-SHORE-KILLING',['bingham-connacht-military-exactions-1586-1591','spanish-armada-invasion-channel-battles-and-war-1585-1599']],
 ['ARM1588-ROSCLOGHER-REFUGE',['bingham-connacht-military-exactions-1586-1591','spanish-armada-invasion-channel-battles-and-war-1585-1599']],
 ['GAP1588-SLIGO-ARMADA-EXECUTIONS',['bingham-connacht-military-exactions-1586-1591','spanish-armada-invasion-channel-battles-and-war-1585-1599']]
].sort((a,b)=>a[0].localeCompare(b[0])));
for(const id of shared.map(([id])=>id))assert.equal(JSON.parse(fs.readFileSync(path.join(root,'data/atlas-1580-1589.json'),'utf8')).events.filter(e=>e.id===id).length,1,'Shared article associations do not duplicate underlying events');
assert(ui.includes("const metas=(storyByEvent.get(item.id)||[])")&&ui.includes("metas.map(meta=>"));
assert(ui.includes("metas.length===1?")&&ui.includes("data-story-source"));
console.log('PASS multi-story: the same 1586 grant has two ordered article buttons; no duplicated atlas event; single-story cards retain their existing footer');
