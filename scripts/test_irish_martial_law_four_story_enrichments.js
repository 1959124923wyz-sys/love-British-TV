#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cases=[
 ['laois-offaly-crown-plantation-martial-law-1547-1566','phase-8','同年11月爱尔兰行政机关','martial-edwards'],
 ['ards-clandeboye-essex-rathlin-colonisation-1571-1575','phase-5','1573年12月30日','edwards-martial-systems'],
 ['sidney-pale-cess-connacht-military-campaign-1575-1578','phase-6','弗朗西斯·阿加德','edwards-martial-systems'],
 ['bingham-connacht-military-exactions-1586-1591','phase-12','1591年10月','edwards-martial-systems']
];
const index=get('data/stories/index.json').stories;
for(const [id,sec,needle,key] of cases){
 const meta=index.find(x=>x.id===id);assert(meta&&meta.status==='published',id);
 const s=get(meta.file),section=s.sections.find(q=>q.id===sec),src=s.sources.find(x=>x.id===key);
 assert(section&&src,sec);
 assert(src.url==='https://historyireland.com/beyond-reform-martial-law-the-tudor-reconquest-of-ireland/');
 assert(src.access&&section.source_keys.includes(key));
 assert(section.paragraphs.length>=4&&section.paragraphs.some(p=>p.includes(needle)));
 assert(section.paragraphs.some(p=>/不能|并不|不等于/.test(p)));
 assert.deepEqual(new Set(s.related_event_ids),new Set(meta.event_ids));
 assert.equal(s.schema,'atlas-major-story-v1');
}
console.log('PASS 4 existing Tudor Ireland stories: 1556 Sussex draft vs London rejection, 1573 Essex commission, 1576 Agard authority and 1586–1591 legal restrictions; no invented map area or event');
