#!/usr/bin/env node
'use strict';
// An event's historical authenticity does not prove that its modern coordinate
// identifies the exact 16th-century scene. Never silently give modern reference
// geocodes the appearance of a verified historic site boundary.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sets=['data/atlas-1500-1509.json','data/atlas-1510-1519.json','data/atlas-1520-1529.json'].map(p=>JSON.parse(read(p)));
for(const file of ['app.js','app-continuity-1497-1529-preview.js']){
 const code=read(file);
 const fn=code.match(/const isUncertain=item=>\{[\s\S]*?\n\};/)?.[0];
 assert.ok(fn,file+': missing geographic precision guard');
 const isUncertain=vm.runInNewContext(fn+'\nisUncertain');
 const events=sets.flatMap(x=>x.events);
 const byId=new Map(events.map(e=>[e.id,e]));
 for(const id of ['1513-FLODDEN','1520-SURREY-LIEUTENANT','1521-MONASTERORIS','1523-WARK-SCOTS-FRENCH-SIEGE']){
  assert.equal(isUncertain(byId.get(id)),true,file+': reference coordinate appears precise: '+id);
 }
 assert.equal(isUncertain(byId.get('1500-CALAIS-ETAPLES')),false,
  file+': an explicitly documented city must not be labelled uncertain without evidence');
 const modern=events.filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng) &&
  /(modern|representative|approximate|not-exact|reference)/i.test(e.geo_precision||''));
 assert.ok(modern.length>=20,'Expected enough geo-referenced events for a meaningful audit');
 for(const e of modern)assert.equal(isUncertain(e),true,file+': approximate historical location published solid: '+e.id);
 assert.ok(code.includes("(isUncertain(item)?' uncertain':'')"),file+': marker missing uncertain style flag');
}
console.log('PASS: representative or modern-reference 1510–1529 geocodes consistently display dashed, with no invented coordinates');
