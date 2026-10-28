'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/stories/serial/index.json'),articles=index.topics.filter(x=>x.status==='published');
const meta=index.topics.find(x=>x.id==='E6-T03-WILLIAMITE-WAR'),mother=index.topics.find(x=>x.id==='E6-T03');
const land=index.topics.find(x=>x.id==='E6-T03-LAND-1642-1698');
assert.equal(articles.length,29);assert(mother&&mother.status==='research_only');
assert(land&&land.status==='published');assert(meta&&meta.parent_topic_id==='E6-T03'&&meta.status==='published'&&meta.publication_review==='approved');
const d=read(meta.article_file),ledger=read('data/research/editor21-williamite-war-1689-1691-evidence-20261028.json');
assert.equal(d.id,meta.id);assert.equal(d.schema,'atlas-major-story-v1');assert.equal(d.start_year,1689);assert.equal(d.end_year,1691);
assert.equal(d.sections.length,15);assert.equal(d.sources.length,13);assert.equal(d.topic_source_claims.length,15);assert.equal(meta.event_ids.length,20);
const sources=new Set(d.sources.map(x=>x.id));assert.equal(sources.size,13);
for(const s of d.sources)assert(s.url.startsWith('https://')&&s.access);
const atlas=new Map();for(let decade=1600;decade<=1690;decade+=10){const yr=read('data/atlas-'+decade+'-'+(decade+9)+'.json');const sk=new Set(yr.sources.map(x=>x.id));assert.equal(sk.size,yr.sources.length);assert.deepEqual(yr.colonial_polygons,[],'no invented Ireland administrative sovereignty polygon');
for(let i=1;i<yr.events.length;i++)assert(yr.events[i].year>=yr.events[i-1].year);
for(const e of yr.events){assert(!atlas.has(e.id),'duplicate event '+e.id);atlas.set(e.id,e);for(const s of e.source_ids||[])assert(sk.has(s),'missing registered source '+s);}
}
let linkCount=0;const hits=new Set();
for(const sec of d.sections){assert(/^[一二三四五六七八九十]+、/.test(sec.heading));assert(sec.period_start_year>=d.start_year&&sec.period_end_year<=d.end_year);assert(sec.paragraphs.length===3);
assert(sec.source_keys.length>=2&&sec.source_keys.every(k=>sources.has(k)));
for(const p of sec.paragraphs){assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(p));
for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){assert(atlas.has(m[1]),'unregistered map link '+m[1]);assert(m[2].length>=4,'bare year link');hits.add(m[1]);linkCount++;}}
}
assert(d.sections.flatMap(s=>s.paragraphs).join('').length>=4800);
for(const id of meta.event_ids)assert(hits.has(id),'article missing link '+id);
for(const c of d.topic_source_claims)assert(c.publication_approval&&c.source_keys.every(k=>sources.has(k)));
const newEvents=[['1680S-E126',1689],['1680S-E127',1689],['1680S-E128',1689],['1690S-E136',1690],['1690S-E137',1691],['1690S-E138',1691],['1690S-E139',1691]];
for(const [id,year] of newEvents){const e=atlas.get(id);assert(e&&e.year===year);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
assert(e.geo_precision.startsWith('representative_'));assert(e.geolocation_limit_zh.includes('非事件精确现场'));
assert.strictEqual(e.historical_control_boundary_verified,false);assert.strictEqual(e.actual_English_land_area_sqkm,null);assert.strictEqual(e.actual_English_territory_created,false);assert.strictEqual(e.exclude_point_buffer_from_area_statistics,true);}
assert.equal(ledger.verified.find(x=>x.key==='LAND1691').confiscated_area_sqkm,null);
assert.equal(ledger.verified.find(x=>x.key==='MILITARY_DEPARTURE').departed_people_exact,null);
assert.equal(ledger.verified.find(x=>x.key==='CLAUSE_OMISSION').all_catholics_protected,false);
assert.equal(ledger.verified.find(x=>x.key==='AUG1691').confirmed_killed,null);
assert(d.reading_note.includes('旧历'));assert(d.reading_note.includes('誊写遗漏'));
assert(d.sections.find(x=>x.id==='treaty-law').paragraphs.join('').includes('George Clarke'));
assert(d.sources.some(x=>x.url.includes('celt.ucc.ie/published/E703001-010')));
console.log('PASS Editor21: 15 Irish Williamite War chapters / 13 reliable story sources / 20 map anchors / 7 new non-polygon events / 29 prior-approved historical stories.');
