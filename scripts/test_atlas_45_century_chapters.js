#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const copy=require('../js/century-chapter-narratives.js');
const html=read('index.html'),app=read('app.js');

assert.equal(Object.keys(copy.chapters).length,20,'1600–1799 must include 20 independently authored decade introductions');
assert.equal(copy.forDecade(1599),null);
assert.equal(copy.forDecade(1800),null);
for(let year=1600;year<=1790;year+=10){
 const text=copy.forDecade(year);
 assert(text,`missing decade ${year}`);
 assert.equal(copy.forDecade(year+9),text,`end of ${year}s should show the same chapter`);
 assert.equal(text.title,text.primary+text.secondary);
 assert(text.primary.length>=3&&text.secondary.length>=3,`short or empty chapter heading ${year}`);
 assert(text.intro.length>=65&&text.intro.length<=250,`intro too short or long ${year}`);
 assert(!/本十年(已入库|收录多个|收录\d|有\d)|候审历史节点/.test(text.intro),`statistics used as chapter introduction: ${year}`);
 assert(!/(?:疆界未经|配准|虚线为概略|面积不能叠加|示意区块)/.test(text.intro),`historical narrative contains cartographic editorial warning ${year}`);
}
assert(copy.forDecade(1600).intro.includes('詹姆斯敦'));
assert(copy.forDecade(1640).intro.includes('德罗赫达'));
assert(copy.forDecade(1660).intro.includes('皇家非洲公司'));
assert(copy.forDecade(1750).intro.includes('普拉西'));
assert(copy.forDecade(1770).intro.includes('孟加拉大饥荒'));
assert(copy.forDecade(1780).intro.includes('Zong'));
assert(copy.forDecade(1790).intro.includes('提普苏丹'));

// Representative historical anchors are all in the existing referenced datasets.
const hasEvent=(p,term)=>JSON.parse(read(p)).events.some(e=>e.name.includes(term));
for(const [p,term] of [
 ['data/atlas-1600-1609.json','詹姆斯敦'],
 ['data/atlas-1640-1649.json','德罗赫达'],
 ['data/atlas-1660-1669.json','非洲'],
 ['data/atlas-1670-1679.json','梅塔科姆'],
 ['data/stories/serial/chronology-preview-scotland-1700-1799.json','1707'],
 ['data/stories/serial/chronology-preview-bengal-1750-1779.json','普拉西'],
 ['data/stories/serial/chronology-preview-australia-1700-1799.json','1788'],
 ['data/stories/serial/chronology-preview-mysore-1700-1799.json','1799']
 ])assert(hasEvent(p,term),`historical event anchor absent: ${p}: ${term}`);

const newScript='js/century-chapter-narratives.js?v=';
assert(html.includes(newScript),'new 17C/18C chapter file not loaded');
assert(html.indexOf(newScript)<html.indexOf('app.js?v='),'chapter copy must load before map app');
assert(html.includes('app.js?v=atlas45'),'map app cache URL must change');
assert(app.includes('window.AtlasChapterNarratives?.forDecade(d)?.title'));
assert(app.includes('window.AtlasChapterNarratives?.forDecade(year)'));
for(const field of ['chapterTitlePrimary','chapterTitleSecondary','chapterIntro','chapterNav','chapterNavName','chapterLabel']){
 assert(app.includes("$('"+field+"').textContent"),'chapter field missing: '+field);
}
assert(app.includes("const decadeTotal=atlas.events.length"),'event statistics must remain intact');
assert(app.includes("status:d>=1700?'topic_preview'"),'original research status must remain intact');
assert(app.includes("$('chapterIntro').textContent=atlasFirstMerged.intro"),'16C chapter introduction must stay untouched');
console.log('PASS: all 20 historical decade chapters have independent titles and substantial intros; index and navigation wired; source events, 16C chapters and review statuses preserved.');
