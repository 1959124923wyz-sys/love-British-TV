#!/usr/bin/env node
'use strict';const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const root=path.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const defs=[
['data/atlas-1530-1539.json','DOM1531-EGYPTIANS-EXPULSION-ACT',1531,45,90],
['data/atlas-1550-1559.json','DOM1554-EGYPTIANS-ACT-EXCLUSION',1554,41,70],
['data/atlas-1560-1569.json','DOM1563-EGYPTIANS-EXECUTION-LAW',1563,60,63]
];
const map=new Map();for(const[p,id,year,count,sources]of defs){const a=J(p);assert.equal(a.events.length,count);assert.equal(a.sources.length,sources);const e=a.events.find(x=>x.id===id);assert(e&&e.year===year);map.set(id,e);assert.equal(e.lat,null);assert.equal(e.lng,null);assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.actual_English_territory_created,false);assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);assert.equal(e.source_ids.length,2);assert(e.source_ids.every(id=>a.sources.some(x=>x.id===id)));assert.equal(a.colonial_polygons.length,0)}
const idx=J('data/stories/index.json').stories,id='tudor-egyptians-discriminatory-laws-mobility-1531-1598',meta=idx.find(x=>x.id===id);assert(meta&&meta.status==='published'&&idx.length>=35);
const story=J(meta.file),prose=story.sections.flatMap(x=>x.paragraphs).join(''),links=[...prose.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(m=>m[1]);
assert.equal(story.sections.length,9);assert(prose.length>=3000);assert(story.sources.length>=5);assert.deepEqual(meta.event_ids,defs.map(x=>x[1]));assert.deepEqual(new Set(story.related_event_ids),new Set(meta.event_ids));
assert(story.sources.every(x=>/^https:\/\//.test(x.url)&&x.access));const keys=new Set(story.sources.map(x=>x.id));assert(story.sections.every(x=>x.paragraphs.length>=2&&x.source_keys.every(s=>keys.has(s))));
assert(links.length>=3&&links.every(id=>map.has(id)));assert(prose.includes('不能仅凭第一层证据直接推导第四层的数量'));assert(prose.includes('约克'));assert.equal(idx.filter(x=>x.event_ids.includes('DOM1563-EGYPTIANS-EXECUTION-LAW')).length,1);
console.log('PASS discriminatory Tudor legislation: 1531/1554/1563 accurately linked, judicial statistics not invented, 9 sections, 3 unlocated statutes, 0 colonial polygons');