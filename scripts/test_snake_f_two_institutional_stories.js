#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/stories/index.json').stories;
const all=new Map();
for(const period of ['1497-1509','1510-1519','1520-1529','1530-1539','1540-1549','1550-1559','1560-1569','1570-1579','1580-1589','1590-1599']){
  for(const ev of read('data/atlas-'+period+'.json').events)all.set(ev.id,ev);
}
const cases=[
  ['laois-offaly-crown-plantation-martial-law-1547-1566',
    ['1550S-E011','1550S-E012','1550S-E013','1550S-E014','1550S-E015']],
  ['marian-heresy-trials-burnings-1554-1558',
    ['MR1555-HERESY-LAWS-EFFECTIVE','MR1555-JOHN-ROGERS-SMITHFIELD','MR1555-OXFORD-RIDLEY-LATIMER','MR1556-OXFORD-CRANMER']]
];
assert.equal(index.length,30,'Two new full-length stories on top of 28 published baseline');
for(const [id,expected] of cases){
 const meta=index.find(x=>x.id===id);
 assert(meta && meta.status==='published');
 assert.deepEqual(meta.event_ids,expected);
 const st=read(meta.file);
 assert.equal(st.id,id);
 assert.equal(st.schema,'atlas-major-story-v1');
 assert(st.lead.length>=120 && st.sections.length>=8);
 assert(st.sections.flatMap(x=>x.paragraphs).join('').length>=3000);
 assert(st.sources.length>=5 && st.sources.every(x=>x.url.startsWith('https://')&&x.access));
 const keys=new Set(st.sources.map(x=>x.id));
 assert(st.sections.every(x=>x.paragraphs.length>=2&&x.source_keys.every(k=>keys.has(k))));
 const links=[...st.sections.flatMap(x=>x.paragraphs).join('').matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);
 assert(new Set(links).size>=expected.length-1);
 assert(links.every(x=>expected.includes(x) && all.has(x)));
 assert(expected.every(x=>all.has(x)),'no invented map pin for '+id);
 assert.deepEqual(new Set(st.related_event_ids),new Set(expected));
}
const laois=read('data/stories/'+cases[0][0]+'.json');
const marian=read('data/stories/'+cases[1][0]+'.json');
assert(laois.sections.flatMap(x=>x.paragraphs).join('').includes('实际服从'));
assert(marian.sections.flatMap(x=>x.paragraphs).join('').includes('约280人'));
assert(!marian.sections.flatMap(x=>x.paragraphs).join('').includes('305人'));
console.log('PASS Snake F: 2 linked sourced stories, 9 existing atlas events, 0 new boundary polygons');
