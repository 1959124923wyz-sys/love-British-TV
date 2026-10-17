#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=J('data/stories/index.json').stories;
const mun=J('data/stories/munster-plantation-land-grants-and-aftermath-1584-1589.json');
const gui=J('data/stories/english-guinea-trade-enslaved-africans-1553-1557.json');
const atlas=J('data/atlas-1550-1559.json');
const ps=mun.sections.find(s=>s.id==='phase-3').paragraphs.join('');
assert(ps.includes('至少90户')&&ps.includes('1593年租额翻倍'));
assert(ps.includes('计划配额')&&!ps.includes('已实际迁入90户'));
assert(mun.sources.some(s=>s.url==='https://celt.ucc.ie/published/E580000-001/text005.html'));
const lk=gui.sections.find(s=>s.id==='phase-4').paragraphs.join('');
assert(lk.includes('[[1550S-E008|')&&lk.includes('三人于1556年返回非洲'));
assert(!lk.includes('没有留下与英国船长同样容易被保存的姓名')&&!lk.includes('他们不是自愿作为自由旅客登船'));
assert(gui.sources.some(s=>s.id==='kaufmann'&&s.url.includes('mirandakaufmann.com')));
const mary=gui.sections.find(s=>s.id==='phase-7');
assert(mary.source_keys.includes('vila-santa')&&mary.paragraphs.join('').includes('1556年5月19日'));
assert(gui.sources.some(s=>s.id==='vila-santa'&&s.url.includes('academic.oup.com')));
const e=atlas.events.find(e=>e.id==='1550S-E008');
assert(e&&e.source_ids.includes('AF-MIRANDA-KAUFMANN-LOK-1555'));
assert(atlas.events.length===41&&atlas.sources.length===70&&atlas.colonial_polygons.length===0);
for(const s of [mun,gui]){
 const ids=new Set(s.sources.map(x=>x.id));
 for(const sec of s.sections)assert(sec.source_keys.every(k=>ids.has(k)),s.id+': citation');
 assert(s.sections.flatMap(x=>x.paragraphs).join('').length>3000);
 const meta=idx.find(x=>x.id===s.id);
 assert(meta.event_ids.every(eid=>s.related_event_ids.includes(eid)),'Manifest-owned events must appear in the full article record');
}
console.log('PASS institutional phase1: rent/settler quotas distinct from real outcomes, Lok three returnees, Mary letters, all citations and map counts');
