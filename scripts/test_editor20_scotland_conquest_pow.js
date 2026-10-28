'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/stories/serial/index.json'),meta=index.topics.find(t=>t.id==='E6-T04-CONQUEST');
const parent=index.topics.find(t=>t.id==='E6-T04'),article=read('data/stories/serial/e6-t04-scotland-conquest-prisoners-1650-1652.json');
const evidence=read('data/research/editor20-scotland-1650-1652-prisoners-evidence-20261028.json');
assert.equal(index.topics.filter(t=>t.status==='published').length,25);
assert(parent.status==='research_only');assert.equal(meta.parent_topic_id,'E6-T04');
assert.equal(meta.status,'published');assert.equal(meta.publication_review,'approved');
assert.equal(article.id,meta.id);assert.equal(article.parent_serial_topic_id,meta.parent_topic_id);
assert.equal(article.schema,'atlas-major-story-v1');assert.equal(article.start_year,1650);assert.equal(article.end_year,1652);
assert.equal(article.sections.length,15);assert.equal(article.sources.length,16);assert.equal(article.topic_source_claims.length,15);
const keys=new Set(article.sources.map(x=>x.id));assert.equal(keys.size,16);
for(const s of article.sources){assert(s.url.startsWith('https://'));assert(s.access&&!s.access.includes('placeholder'));}
let eventCount=0,atlas=new Map(),eventKeys=new Map();
for(let y=1600;y<=1690;y+=10){const dec=read('data/atlas-'+y+'-'+(y+9)+'.json');
assert.deepEqual(dec.colonial_polygons,[],'historically false Scottish national polygon introduced');
for(let i=1;i<dec.events.length;i++)assert(dec.events[i].year>=dec.events[i-1].year,'out of order events');
const localSources=new Set(dec.sources.map(s=>s.id));assert.equal(localSources.size,dec.sources.length);
for(const e of dec.events){assert(!atlas.has(e.id),'duplicate event '+e.id);atlas.set(e.id,e);eventKeys.set(e.id,localSources);eventCount++;for(const source of e.source_ids||[])assert(localSources.has(source));}
}
const referenced=new Set();
for(const s of article.sections){assert(/^[一二三四五六七八九十]+、/.test(s.heading));assert(s.paragraphs.length>=3);assert(s.period_start_year>=1650&&s.period_end_year<=1652);
assert(s.source_keys.length>=1&&s.source_keys.every(k=>keys.has(k)));
for(const p of s.paragraphs){assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(p));for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]]+)\]\]/g)){assert(atlas.has(m[1]),'orphan map link '+m[1]);assert(m[2].length>=4);referenced.add(m[1]);}}
}
assert(article.sections.flatMap(x=>x.paragraphs).join('').length>=5000);
for(const id of meta.event_ids)assert(referenced.has(id),'topic linked map target missing '+id);
assert.equal(meta.event_ids.length,12);
const expected=[['1650S-E122',1650],['1650S-E123',1650],['1650S-E124',1650],['1650S-E125',1650],['1650S-E126',1651],['1650S-E127',1651],['1650S-E128',1651],['1650S-E129',1651],['1650S-E130',1651],['1650S-E131',1652],['1650S-E132',1652]];
for(const [id,year] of expected){const e=atlas.get(id);assert(e&&e.year===year);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
assert.strictEqual(e.actual_English_land_area_sqkm,null);assert.strictEqual(e.historical_control_boundary_verified,false);
assert.strictEqual(e.actual_English_territory_created,false);assert.strictEqual(e.exclude_point_buffer_from_area_statistics,true);
assert(e.geo_precision.startsWith('representative_'));assert(e.geolocation_limit_zh.includes('非事件精确现场'));
assert(e.source_ids.length>=1);for(const k of e.source_ids)assert(eventKeys.get(id).has(k));}
assert.equal(atlas.get('1650S-E123').lat,55.982271);
assert.equal(atlas.get('1650S-E126').lng,-3.411068);
assert.equal(atlas.get('1650S-E130').lat,52.170953);
assert.equal(atlas.get('1650S-E125').lat,42.468307);
const claims=Object.fromEntries(evidence.claims.map(c=>[c.id,c]));
assert.equal(claims.DUNBAR_DEAD.verified_total,null);assert.equal(claims.DURHAM_DEATHS.died_by_end_oct_about,1600);
assert.equal(claims.DUNDEE.verified_dead,null);assert.equal(claims.INVERKEITHING.verified_killed,null);
assert.equal(claims.UNITY1650.estimated_forced_indentures_to_massachusetts,150);
assert.equal(claims.CONTROL.modern_UK_in_1652,false);assert.equal(evidence.geography_policy.new_verified_polygons,0);
assert(article.reading_note.includes('1707'));assert(article.reading_note.includes('约150'));
console.log('PASS Editor20: 15 sections, 16 authoritative sources, 11 new mapped events, 12 clickable anchors, 1650–52 Scottish polity and forced indenture semantics; 25 stories, '+eventCount+' atlas records checked.');
