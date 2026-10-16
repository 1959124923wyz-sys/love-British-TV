#!/usr/bin/env node
'use strict';
// Voyage hit-test and cartographic meaning regression; browser test checks actual route click.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const app=read('app.js');new vm.Script(app,{filename:'app.js'});
const early=JSON.parse(read('data/atlas-1497-1500.json'));
const last=JSON.parse(read('data/atlas-1520-1529.json'));
assert.equal(early.routes.length,2);
assert.ok(early.routes.some(r=>r.year===1497));
assert.ok(early.routes.some(r=>r.year===1498));
assert.equal(last.routes.length,5,'Preserve prior routes and separate English vessel sighting in Caribbean');
const route=last.routes[0];
assert.equal(route.id,'route1527-rut-endpoints-schematic');
assert.equal(route.year,1527);
assert.equal(route.route_kind,'documented-endpoints-connection');
assert.equal(route.coords.length,2);
assert.ok(route.note.includes('非实际航行')||route.note.includes('既非实际航行'));
assert.ok(route.source_ids.every(id=>last.sources.some(s=>s.id===id)),'1527 voyage line requires published citations');
const surrey=last.routes.find(x=>x.id==='IR1521-MONASTERORIS-TO-DUBLIN-RETURN');
assert(surrey&&surrey.route_kind==='documented-endpoints-connection'&&surrey.coords.length===2);
assert.deepEqual(surrey.valid_years,[1521]);
assert(last.routes.some(r=>r.id==='FR1522-CLOUET-HENVIC-MORLAIX-RAID'&&r.valid_years?.[0]===1522));
assert(last.routes.some(r=>r.id==='SC1523-COLDSTREAM-WARK-SCOTS-ADVANCE'&&r.actor==='Scotland_France_counteroffensive'&&r.valid_years?.[0]===1523));
for(let y=1520;y<=1529;y++)
 assert.equal(last.routes.filter(r=>r.id==='route1527-rut-endpoints-schematic'&&r.year<=y).length, y>=1527?1:0,'voyage prematurely visible or missing at '+y);
assert.ok(app.includes("map.createPane('voyagePane')"),'route pane missing');
assert.ok(app.includes("map.getPane('voyagePane').style.zIndex='480'"),'route does not sit above control polygons');
assert.ok(app.includes("const voyageRenderer=L.svg({pane:'voyagePane'})"),'interactive route renderer not guaranteed');
assert.ok(app.includes("className:'atlas-voyage-hit'"),'route needs a generous pointer hit area');
assert.ok(app.includes(".on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openDossier(r,'route')}"),
 'clickable voyage link must open source-backed dossier');
assert.ok(app.includes("const radius=Math.max(5.2,Math.min(8"),'historical city symbol still appears as an oversized halo');
assert.ok(!app.includes('radius:radius+10'), 'oversized inner city halo remained');
assert.ok(!app.includes('fillOpacity:.18,interactive:false'), 'ghost city circle persisted');
const ch7=JSON.parse(read('data/atlas-1550-1559.json'));
assert.equal(ch7.routes.length,9);
assert.equal(ch7.routes.filter(r=>r.route_kind==='coastal-commercial-reference-schematic').length,2);
assert.ok(ch7.routes.some(r=>r.route_kind==='schematic-human-transport-sea-corridor'&&r.year===1555));
assert.ok(app.includes("const coastal=r.route_kind==='coastal-commercial-reference-schematic'"));
assert.ok(ch7.routes.every(r=>r.source_ids.every(id=>ch7.sources.some(src=>src.id===id))));
console.log('PASS: route interaction pane, historical endpoint provenance, modest city symbols and yearly 1527 reveal');
