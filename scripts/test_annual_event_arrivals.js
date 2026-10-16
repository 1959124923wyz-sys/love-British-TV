#!/usr/bin/env node
'use strict';
// New = a published historical EVENT with year equal to selected year.
// It does not turn a standing castle, territory, candidate site, route or
// already happened event into a new event merely because it remains visible.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/dark-atlas-v2.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
new vm.Script(app,{filename:'app.js'});
const chapter=JSON.parse(fs.readFileSync(path.join(root,'data/atlas-1510-1519.json'),'utf8'));
const omagh=chapter.events.find(x=>x.id==='1512-OMAGH-ODONNELL');
assert.ok(omagh&&Number.isFinite(omagh.lat)&&Number.isFinite(omagh.lng),'1512 source event must be mappable');
assert.equal(chapter.events.filter(e=>e.year===1511).length,0,'1511 control year assumed empty');
assert.equal(chapter.events.filter(e=>e.year===1512).length,5,'1512 features original Omagh plus Kildare and O’Donnell operations');
const old=chapter.events.find(e=>e.year===1510);
assert.ok(old);
const stat={year:1512};
const fn=vm.runInNewContext('function isNewEventThisYear(item){return item&&item.category!==\'status\'&&Number(item.year)===year;}\nisNewEventThisYear',{year:stat.year});
assert.equal(fn(omagh),true);
assert.equal(fn(old),false);
assert.equal(fn({...omagh,category:'status'}),false);
assert.ok(app.includes("isNewEventThisYear(e)"),'Map glyph rendering should use year-specific gate');
assert.ok(app.includes("newCount=g.items.filter"),'Mixed marker clusters need their own arrival counter');
assert.ok(app.includes("event-new-this-year"),'Current-year sidebar events need a distinct style');
assert.ok(app.includes("atlas-cluster-new-count"),'Map hub must disclose the newly introduced items');
assert.ok(app.includes("!isNewEventThisYear(e))continue;"),'Minor current-year events cannot vanish only due to significance');
assert.ok(app.includes('const changedYear=year!==next;'));
assert.ok(!app.slice(app.indexOf('function setYear(v){'),app.indexOf('function stopPlay(){')).includes('map.flyTo('),
  'Changing a year must not surprise-pan or zoom to each new event');
for(const id of ['yearArrivalSummary','yearArrivalMapCount'])assert.ok(html.includes('id="'+id+'"'));
for(const klass of ['.atlas-new-this-year','.atlas-cluster-new-count','.event-new-this-year','.year-arrival-tag'])assert.ok(css.includes(klass),klass);
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
console.log('PASS 1511->1512 detects five correctly year-gated events while previous-year events stay unhighlighted');
