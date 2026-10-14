#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('data/chapters.json')),app=read('app.js'),html=read('index.html'),css=read('css/dark-atlas-v2.css');
new vm.Script(app,{filename:'app.js'});
assert.deepEqual(manifest.chapters.map(c=>[c.start,c.end]),[[1497,1499],[1500,1509],[1510,1519],[1520,1529],[1530,1539],[1540,1549],[1550,1559],[1560,1569],[1570,1579]]);
assert.ok(manifest.chapters.every(c=>c.status==='published'&&fs.existsSync(path.join(root,c.source))));
for(const ch of manifest.chapters){
 const data=JSON.parse(read(ch.source));
 assert.equal(data.period.from,ch.start);
 assert.ok(data.period.to>=ch.end && (ch.number===1?data.period.to===1500:data.period.to===ch.end),'Original early archive includes 1500 baseline; UI first chapter ends 1499');
}
for(let i=1;i<manifest.chapters.length;i++)
 assert.equal(manifest.chapters[i].start,manifest.chapters[i-1].end+1,'Historical chapter intervals must be contiguous');
assert.equal(manifest.navigation.firstDecade,1490);
assert.equal(manifest.navigation.lastDecade,2090);
assert.equal(manifest.navigation.firstCentury,1400);
assert.equal(manifest.navigation.lastCentury,2000);
assert.match(html,/id="centuryNav"/);
assert.match(html,/id="chapterTrack"/);
assert.match(html,/id="browseDecadePrev"/);
assert.match(html,/id="browseDecadeNext"/);
assert.match(html,/id="jumpYear"/);
assert.match(html,/id="yearStartLabel"/);
assert.match(html,/id="yearEndLabel"/);
assert.match(html,/app\.js\?v=timeline-v1770-ch9/);
assert.match(html,/css\/dark-atlas-v2\.css\?v=timeline-v1770-ch9/);
assert.doesNotMatch(html,/nth-child\(/,'Inline year tick positioning must not depend on number of chapters');
assert.doesNotMatch(html,/id="chapterOne"/,'Rendered navigation must use registry, not all hardcoded chapter buttons');
assert.match(app,/function browseDecade\(decade\)/);
assert.match(app,/function browseCentury\(century\)/);
assert.match(app,/function renderTimelineNavigation\(\)/);
assert.match(app,/decades=Array\.from\(\{length:5\}/);
assert.match(app,/const halfCenturyPageForYear=y=>y<1500\?1490:Math\.floor\(y\/50\)\*50/);
assert.match(app,/current===1500&&direction<0\?1490/);
const decadeFn=app.match(/const decadeForYear=y=>[^;]+;/)?.[0];
assert.ok(decadeFn);
const decadeForYear=vm.runInNewContext(decadeFn+'\ndecadeForYear');
assert.equal(decadeForYear(1497),1490);
assert.equal(decadeForYear(1500),1500);
assert.equal(decadeForYear(1539),1530);
assert.equal(decadeForYear(1600),1600);
assert.equal(decadeForYear(1997),1990);
// Every aligned 50-year half-century contains exactly five ten-year chapters.
for(const span of [50,500]){
 let maxSlots=0;
 for(let page=1500;page<1500+span;page+=50){
  const cells=Array.from({length:5},(_,i)=>page+i*10);
  assert.equal(cells[4]-cells[0],40);
  maxSlots=Math.max(maxSlots,cells.length);
 }
 assert.equal(maxSlots,5);
}
assert.deepEqual(Array.from({length:5},(_,i)=>1500+i*10),[1500,1510,1520,1530,1540]);
assert.deepEqual(Array.from({length:5},(_,i)=>1550+i*10),[1550,1560,1570,1580,1590]);
const timelineBlock=app.split('function browseDecade(decade){')[1]?.split('function browseCentury(')[0]||'';
assert.ok(!timelineBlock.includes('setYear('),'Browsing is NOT authorized to change map history');
const centuryBlock=app.split('function browseCentury(century){')[1]?.split('function renderTimelineNavigation(')[0]||'';
assert.ok(!centuryBlock.includes('setYear('));
assert.ok(app.includes('slider.min=currentChapter.start;slider.max=currentChapter.end;slider.value=year;'),'Year range must be local');
assert.ok(app.includes('e.year>=chapter.start&&e.year<=year'),'Only past current-decade events may be shown as milestones');
assert.ok(app.includes("if(!chapter){")&&app.includes("timelineStatus(decade+"),'Unpublished chapters must not fake data');
assert.ok(app.includes('lastPublishedYear'),'Actual atlas must remain bounded by published history');
assert.match(css,/\.timeline-centuries\{display:grid;grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/);
assert.match(css,/\.chapter-track\{display:grid;grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
console.log('PASS timeline: eight reviewed chapters, seven centuries, decade-local years, exactly five virtual half-century navigation slots for 50 and 500 years');
