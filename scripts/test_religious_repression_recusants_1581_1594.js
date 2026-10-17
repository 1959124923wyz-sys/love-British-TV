#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=J('data/atlas-1580-1589.json'),b=J('data/atlas-1590-1599.json'),idx=J('data/stories/index.json').stories,ids=[
'DOM1581-RECUSANCY-CROWN-FINES','DOM1581-CAMPION-TYBURN-EXECUTION','DOM1582-SALFORD-RECUSANTS-IMPRISONED','DOM1585-JESUITS-SEMINARY-PRIESTS-ACT','DOM1585-NORTON-PORT-OATH-RECOMMENDATIONS',
'DOM1591-LANCASHIRE-RECUSANCY-REPORT','DOM1593-CATHOLIC-RECUSANTS-FIVE-MILE-LAW','DOM1593-RELIGION-CONVENTICLES-ACT','DOM1594-BURGHLEY-RECUSANT-SEIZURE-PLANS'];
assert.equal(a.events.length,71);assert.equal(a.sources.length,118);
assert.equal(b.events.length,62);assert.equal(b.sources.length,96);
assert.equal(idx.length,38);
const sid='elizabethan-recusancy-fines-priests-confinement-1581-1594',meta=idx.find(x=>x.id===sid);
assert(meta&&meta.status==='published');
const story=J(meta.file),body=story.sections.flatMap(s=>s.paragraphs).join('');
assert(story.id===sid&&story.sections.length>=10&&body.length>=4200);
assert(story.sources.length>=13&&story.sources.every(x=>x.url.startsWith('https://')&&x.access));
const keys=new Set(story.sources.map(s=>s.id));assert(story.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.length>=2&&s.source_keys.every(id=>keys.has(id))));
assert.deepEqual(meta.event_ids,ids);assert.deepEqual(story.related_event_ids,ids);
const inline=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);
assert.deepEqual(inline,ids,'All nine legal / judicial events must have a clickable story link in correct order');
const docs=new Map([...a.events,...b.events].map(e=>[e.id,e]));
for(const id of ids){
 const e=docs.get(id),atlas=e?.year>=1590?b:a;
 assert(e,id);assert(e.source_ids.length>=2&&e.source_ids.every(k=>atlas.sources.some(s=>s.id===k)),id+' source reference');
 assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.actual_English_territory_created,false);assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
}
assert.deepEqual([docs.get(ids[1]).lat,docs.get(ids[1]).lng],[51.513103,-0.160364]);
assert(docs.get(ids[1]).geo_precision.includes('memorial_not_exact_1581'));
assert(docs.get(ids[1]).description.includes('1585年才获得批准'));
for(const id of ids.filter(x=>x!==ids[1])){assert.equal(docs.get(id).lat,null,id+' proposed/uncertain action not mapped');assert.equal(docs.get(id).lng,null);}
assert(docs.get(ids[0]).description.includes('每四周20英镑')&&docs.get(ids[0]).description.includes('不等于'));
assert(docs.get(ids[2]).description.includes('3月29日')&&docs.get(ids[2]).description.includes('名单不是全国'));
assert(docs.get(ids[3]).date_label.startsWith('1585年')&&docs.get(ids[3]).date_label.includes('1584'));
assert(docs.get(ids[4]).description.includes('书面建议本身不能证明'));
assert(docs.get(ids[5]).description.includes('报告还指控'));
assert(docs.get(ids[6]).date_label.startsWith('1593年')&&docs.get(ids[6]).date_label.includes('1592'));
assert(docs.get(ids[7]).description.includes('两部不同法令'));
assert(docs.get(ids[8]).description.includes('真实执行'));
assert(body.includes('实际交付')&&body.includes('实际完成调查')&&body.includes('国库'));
assert(!a.routes.some(r=>r.id.includes('RECUS'))&&!b.routes.some(r=>r.id.includes('RECUS')));
assert.equal(a.colonial_polygons.length,0);assert.equal(b.colonial_polygons.length,0);
console.log('PASS recusancy 1581–1594: 11 story sections, nine law+named-person/primary memorandum records, authentic 1582 Salford custody, Tyburn monument only, legal liabilities separate from Exchequer receipt, no imaginary 5-mile control polygon');
