'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=read('data/stories/serial/index.json');
const p=idx.topics.filter(x=>x.status==='published'),t=idx.topics.find(x=>x.id==='E6-T07-LEEWARD'),mother=idx.topics.find(x=>x.id==='E6-T07'),bar=idx.topics.find(x=>x.id==='E6-T07-BARBADOS');
assert.equal(p.length,29,'only one new approved story permitted');assert(mother&&mother.status==='research_only');assert(bar?.status==='published');
assert.equal(t.parent_topic_id,'E6-T07');assert(t.status==='published'&&t.publication_review==='approved');assert.equal(t.event_ids.length,13);
const story=read(t.article_file),evidence=read('data/research/editor19-leewards-kalinago-1666-captives-evidence-20261027.json');
assert.equal(story.id,'E6-T07-LEEWARD');assert.equal(story.start_year,1623);assert.equal(story.end_year,1699);assert.equal(story.sections.length,11);assert.equal(story.sources.length,12);assert.equal(story.topic_source_claims.length,11);
const sk=new Set(story.sources.map(s=>s.id));assert.equal(sk.size,12);for(const a of story.sources)assert(/^https:\/\//.test(a.url));
const maps=new Map();const seen=new Set();
for(let y=1600;y<=1690;y+=10){const a=read('data/atlas-'+y+'-'+(y+9)+'.json');
assert.deepEqual(a.colonial_polygons,[],'unverified colonial polygon cannot be rendered');
for(let i=1;i<a.events.length;i++)assert(a.events[i].year>=a.events[i-1].year,'year chronology must remain sorted');
const sourceIds=new Set(a.sources.map(s=>s.id));
for(const ev of a.events){assert(!seen.has(ev.id),'duplicate atlas id '+ev.id);seen.add(ev.id);maps.set(ev.id,ev);for(const k of ev.source_ids||[])assert(sourceIds.has(k),'missing source '+k);}
}
const linked=new Set();for(const s of story.sections){
assert(/^[一二三四五六七八九十]+、/.test(s.heading));assert(s.paragraphs.length===3);
assert(s.source_keys.length>=2&&s.source_keys.every(k=>sk.has(k)));
for(const tx of s.paragraphs){assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(tx));for(const m of tx.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]]+)\]\]/g)){assert(maps.has(m[1]),'unknown map anchor '+m[1]);linked.add(m[1]);}}
}
assert(story.sections.flatMap(s=>s.paragraphs).join('').length>=3500);
for(const eid of t.event_ids)assert(linked.has(eid),'index event must be mentioned with linked map action '+eid);
for(const c of story.topic_source_claims)assert(c.source_keys.every(k=>sk.has(k))&&c.publication_approval);
for(const [id,yr,la,lo] of [['1620S-E029',1628,17.151,-62.591],['1630S-E025',1632,16.74743,-62.23294],['1670S-E124',1671,17.296,-62.722]]){
const a=maps.get(id);assert(a&&a.year===yr);assert.equal(a.lat,la);assert.equal(a.lng,lo);
assert(a.geo_precision.startsWith('representative_'));assert(a.geolocation_limit_zh.includes('非事件精确现场'));
assert.equal(a.historical_control_boundary_verified,false);assert.equal(a.actual_English_land_area_sqkm,null);assert.equal(a.exclude_point_buffer_from_area_statistics,true);assert.equal(a.actual_English_territory_created,false);
}
for(const id of ['1660S-E033','1660S-E036'])assert(maps.get(id).source_ids.includes('1660S-S168'));
const claim=evidence.claims.find(x=>x.key==='CLA1671');assert(claim);assert.equal(claim.claim_antigua_montserrat,1500);assert.equal(claim.claim_st_christopher,400);assert.equal(claim.actual_abducted_confirmed,null);
assert(story.reading_note.includes('索赔'));assert(story.reading_note.includes('1900'));
assert(story.sections.find(x=>x.id==='bloodypoint').paragraphs.join('').includes('Tegreman'));
assert(!JSON.stringify(maps.get('1670S-E124')).includes('actual_captured_slaves":1900'));
console.log('PASS Editor19: 11 chapters, 12 source entries, 13 linked map events, 3 new non-territorial points; 29 published stories and all previous map events intact.');
