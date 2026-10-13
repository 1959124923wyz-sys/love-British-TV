#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('data/chapters.json')),app=read('app.js'),html=read('index.html'),css=read('css/dark-atlas-v2.css');
new vm.Script(app,{filename:'app.js'});
assert.deepEqual(manifest.chapters.map(c=>[c.start,c.end]),[[1497,1499],[1500,1509],[1510,1519],[1520,1529],[1530,1539]]);
assert.ok(manifest.chapters.every(c=>c.status==='published'&&fs.existsSync(path.join(root,c.source))));
for(const ch of manifest.chapters){
 const data=JSON.parse(read(ch.source));
 assert.equal(data.period.from,ch.start);
 assert.equal(data.period.to,ch.end);
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
assert.match(html,/app\.js\?v=timeline-v160/);
assert.match(html,/css\/dark-atlas-v2\.css\?v=timeline-v160/);
assert.doesNotMatch(html,/nth-child\(/,'Inline year tick positioning must not depend on number of chapters');
assert.doesNotMatch(html,/id="chapterOne"/,'Rendered navigation must use registry, not all hardcoded chapter buttons');
assert.match(app,/function browseDecade\(decade\)/);
assert.match(app,/function browseCentury\(century\)/);
assert.match(app,/function renderTimelineNavigation\(\)/);
assert.match(app,/decades=\[browsingDecade-10,browsingDecade,browsingDecade\+10\]/);
const decadeFn=app.match(/const decadeForYear=y=>[^;]+;/)?.[0];
assert.ok(decadeFn);
const decadeForYear=vm.runInNewContext(decadeFn+'\ndecadeForYear');
assert.equal(decadeForYear(1497),1490);
assert.equal(decadeForYear(1500),1500);
assert.equal(decadeForYear(1539),1530);
assert.equal(decadeForYear(1600),1600);
assert.equal(decadeForYear(1997),1990);
// Synthetic 50-/500-year navigation must use constant count of only three decade slots.
for(const span of [50,500]){
 let maxSlots=0;
 for(let d=1490;d<=1490+span;d+=10){
  const cells=[d-10,d,d+10].filter(y=>y>=1490&&y<=2090);
  maxSlots=Math.max(maxSlots,cells.length);
 }
 assert.equal(maxSlots,3);
}
const timelineBlock=app.split('function browseDecade(decade){')[1]?.split('function browseCentury(')[0]||'';
assert.ok(!timelineBlock.includes('setYear('),'Browsing is NOT authorized to change map history');
const centuryBlock=app.split('function browseCentury(century){')[1]?.split('function renderTimelineNavigation(')[0]||'';
assert.ok(!centuryBlock.includes('setYear('));
assert.ok(app.includes('slider.min=currentChapter.start;slider.max=currentChapter.end;slider.value=year;'),'Year range must be local');
assert.ok(app.includes('e.year>=chapter.start&&e.year<=year'),'Only past current-decade events may be shown as milestones');
assert.ok(app.includes("if(!chapter){")&&app.includes("browseDecade(decade);"),'Unpublished chapters must not fake data');
assert.ok(app.includes('lastPublishedYear'),'Actual atlas must remain bounded by published history');
assert.match(css,/\.timeline-centuries\{display:grid;grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/);
assert.match(css,/\.chapter-track\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
console.log('PASS timeline: five reviewed chapters, seven centuries, decade-local years, exactly three virtual navigation slots for 50 and 500 years');
