#!/usr/bin/env node
'use strict';
// Offline regression: native sidebar double-click, strict source-coordinate gate,
// unchanged year/zoom, singleton/flyout marker highlighting. Not a screenshot test.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),previewHtml=read('preview-continuity-1497-1529.html');
const css=read('css/dark-atlas-v2.css');
const data=JSON.parse(read('data/atlas-1510-1519.json'));
const flodden=data.events.find(e=>e.id==='1513-FLODDEN');
const rastell=data.events.find(e=>e.id==='1517-RASTELL-ABORTED-COLONIZATION');
assert.ok(flodden&&rastell,'Known source-backed test cases must exist');
for(const file of ['app.js','app-continuity-1497-1529-preview.js']){
 const app=read(file);
 new vm.Script(app,{filename:file});
 const occurred=app.match(/function occurredByYear\(item,selectedYear\)\{[^}]*\}/)?.[0];
 const start=app.indexOf('function canLocateEvent(item,atYear){');
 const end=app.indexOf('function focusEventFromSidebar(item){',start);
 assert.ok(start>=0&&end>start,file+': target coordinate validator absent');
 const locationGate=vm.runInNewContext(occurred+'\n'+app.slice(start,end)+'\ncanLocateEvent');
 assert.equal(locationGate(flodden,1513),true,'Confirmed Flodden location should be navigable');
 assert.equal(locationGate(flodden,1512),false,'Cannot locate future event');
 assert.equal(locationGate(rastell,1519),false,'Rastell voyage has null coordinates and must not be assigned imaginary site');
 assert.equal(locationGate({...flodden,lat:91},1519),false,'Invalid geographic coordinates rejected');
 const focus=app.split('function focusEventFromSidebar(item){')[1]?.split('function expandCluster(')[0]||'';
 const sidebar=app.split('function renderEventList(){')[1]?.split('function canLocateEvent(')[0]||'';
 assert.ok(sidebar.includes("node.addEventListener('dblclick'"),file+': no double-click handler');
 assert.ok(sidebar.includes("node.addEventListener('click'"),file+': previous single-click lost');
 assert.ok(focus.includes('map.panTo(position,{animate:true'),file+': no smooth pan');
 assert.ok(focus.includes('map.invalidateSize({pan:false})'),file+': side panel resizing not accounted for');
 assert.ok(!/map\.(setZoom|flyTo|setView)\s*\(/.test(focus),file+': locate changed zoom');
 assert.ok(!/\bsetYear\s*\(/.test(focus),file+': locator modified historical timeline');
 assert.ok(focus.includes('renderPoints()'),file+': visual markers not recomputed');
 assert.ok(app.includes("className:item.id===focusedEventId?'atlas-target-marker'"),file+': no singleton SVG target');
 assert.ok(app.includes("className:'atlas-flyout-icon'+(item.id===focusedEventId?"),file+': no grouped SVG target');
 assert.ok(app.includes('if(targetGroup&&targetGroup.items.length>1)expandCluster(targetGroup,true)'),file+': grouped event not revealed');
 assert.ok(app.includes("focusedEventId&&!chosen.events.some"),file+': selected target survives after switching chapters');
 assert.ok(app.includes("focusedEventId=null;focusRequestToken++;"),file+': closed dossier retains a stale highlight');
}
assert.match(css,/\.leaflet-marker-icon\.atlas-target-marker \.map-pin\s*\{/);
assert.match(css,/\.atlas-aggregate\.atlas-target-aggregate\s*\{/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.ok(html.includes('app.js?v=chapter5-v150'),'Production browser must get current JS');
assert.ok(previewHtml.includes('app-continuity-1497-1529-preview.js?v=atlas-find-v135'),'Preview browser must get current JS');
console.log('PASS: sidebar double-click locates valid events, keeps zoom and year, emphasizes singleton and grouped marker');
