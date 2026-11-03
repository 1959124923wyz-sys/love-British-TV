#!/usr/bin/env node
'use strict';
// Real-source contract: world events within rolling [year-3, year], INCLUDING
// the three records' previous source decade when selecting 1650 or 1690.
// This never changes political/colonial occupation geometry or underlying data.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const code=read('app.js'),html=read('index.html');
const archives=new Map();
for(let d=1600;d<=1690;d+=10)archives.set(d,json('data/atlas-'+d+'-'+(d+9)+'.json'));
const from=code.indexOf("let eventWindowMode17c='rolling4'");
const to=code.indexOf('function isNewEventThisYear(item)',from);
assert(from>0&&to>from,'rolling chronological helper should remain isolated for independent source testing');
const env={serialPreviewByDecade:archives,atlas:{events:[{id:'legacy-1599',year:1599}]},
 decadeForYear:y=>Math.floor(Number(y)/10)*10};
const get=vm.runInNewContext(code.slice(from,to)+'\n({seventeenthEventWindowStart,seventeenthEventsForWindow,seventeenthRoutesForWindow})',env);
const normalize=items=>Array.from(items,e=>e.id).sort();
const factual=(start,end)=>[...archives.values()].flatMap(d=>d.events)
 .filter(e=>e.year>=start&&e.year<=end);
const test=(y,start,mode='rolling4')=>{
 assert.equal(get.seventeenthEventWindowStart(y,mode),start,'window starts correctly for '+y+'/'+mode);
 const actual=Array.from(get.seventeenthEventsForWindow(y,mode));
 const expected=factual(start,y);
 assert.deepEqual(normalize(actual),normalize(expected),'every published event in '+start+'—'+y+' should be available exactly once');
 assert.equal(new Set(actual.map(e=>e.id)).size,actual.length,'duplicate event ID in '+y);
 assert(actual.every(e=>e.year<=y&&e.year>=start),'no future/expired event in '+y);
 for(const e of actual){
  const original=archives.get(Math.floor(e.year/10)*10);
  assert(original?.events.includes(e),'event is exact object from its published source decade');
  assert((e.source_ids||[]).every(id=>original.sources.some(s=>s.id===id)),
   e.id+' has an undocumented citation in native source-decade archive');
 }
 return actual;
};
const in1650=test(1650,1647);
const expectedPrevious=archives.get(1640).events.filter(e=>e.year>=1647&&e.year<=1649);
assert(expectedPrevious.length>=1);
assert.equal(in1650.filter(e=>e.year<1650).length,expectedPrevious.length,
 '1650 must actually contain prior-decade 1647-49 records');
const sourceRoutes1649=archives.get(1640).routes.filter(r=>r.year===1649);
assert(sourceRoutes1649.length>=2,'two attested 1649 Irish invasion campaign routes');
const routes1650=Array.from(get.seventeenthRoutesForWindow(1650));
for(const route of sourceRoutes1649)assert(routes1650.some(r=>r.id===route.id),
 '1650 rolling window must still show the dated 1649 campaign route from the preceding decade');
assert.equal(get.seventeenthRoutesForWindow(1653).some(r=>sourceRoutes1649.some(q=>q.id===r.id)),false,
 '1649 campaign cannot remain in the historical event map after its 4-year visibility window');
const following=test(1651,1648);
assert(following.every(e=>e.year!==1647),'1651 removes 1647 while retaining 1648-51');
assert(following.some(e=>e.year===1648)&&following.some(e=>e.year===1651));
test(1690,1687);test(1699,1696);test(1600,1600);test(1601,1600);test(1603,1600);test(1604,1601);
test(1650,1650,'year');test(1656,1650,'decade');test(1699,1690,'decade');
assert.equal(get.seventeenthEventsForWindow(1599)[0].id,'legacy-1599',
 'pre-1600 original map records remain untouched');
assert(html.includes('id="showRollingFourYears" aria-pressed="true"'),'4-year map view must be default');
assert(html.includes('id="showYearEventsOnly"')&&html.includes('id="showDecadeEventsToYear"'));
assert(code.includes("const windowEvents=tools17?seventeenthEventsForWindow(year)"));
assert(code.includes("for(const e of (year>=1600?seventeenthEventsForWindow(year):atlas.events))"));
assert(code.includes("const item=events.find(e=>e.id===node.dataset.eid)"),
 'clicking a cross-decade event should preserve the real event object and source');
assert(code.includes("focusEventFromSidebar(events.find(e=>e.id===node.dataset.eid))"));
assert(!code.slice(code.indexOf('function setYear(v){'),code.indexOf('function stopPlay(){'))
 .includes('map.flyTo('),'year switch must not change map zoom or focus');
console.log('PASS 17C rolling 4-year source-backed chronology: 1650=1647-1650 ('+
 in1650.length+' events), 1651=1648-1651 ('+following.length+
 ' events), 1690 crossover, 1699 truncation, 1600 clamp, legacy 1599 unchanged.');
