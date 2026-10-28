'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const ix=read('data/stories/serial/index.json'),led=read('data/research/editor22-four-17c-gap-evidence-20261028.json');
assert.equal(ix.topics.filter(t=>t.status==='published').length,29);assert(led.source_count>=27);
const expected={
'E6-T09-PENNSYLVANIA':{sections:10,ids:['1680S-E129','1680S-E130','1680S-E131','1680S-E132','1680S-E133','1690S-E140']},
'E6-T10-QUEBEC-KIRKE':{sections:9,ids:['1620S-E030','1620S-E032','1630S-E026','1630S-E027']},
'E6-T16-ATLANTIC-ISLANDS':{sections:10,ids:['1600S-E092','1610S-E095','1610S-E096','1610S-E097','1620S-E002','1620S-E031','1640S-E095','1670S-E125','1680S-E134']},
'E6-T09-NE-DOMINION':{sections:10,ids:['1680S-E135','1680S-E136','1680S-E137','1680S-E138','1680S-E139','1680S-E020','1690S-E141']}};
const atlas=new Map(),seenSrc=new Set();
for(let yr=1600;yr<=1690;yr+=10){let d=read('data/atlas-'+yr+'-'+(yr+9)+'.json');assert.deepEqual(d.colonial_polygons,[]);let refs=new Set(d.sources.map(s=>s.id));assert.equal(refs.size,d.sources.length);for(let i=1;i<d.events.length;i++)assert(d.events[i-1].year<=d.events[i].year);
for(let e of d.events){assert(!atlas.has(e.id),'duplicate map event '+e.id);atlas.set(e.id,e);for(let source of e.source_ids||[])assert(refs.has(source),'missing '+source);}
}
let chapters=0,links=0,ids=new Set();
for(let [id,x] of Object.entries(expected)){
const meta=ix.topics.find(t=>t.id===id);assert(meta&&meta.status==='published'&&meta.publication_review==='approved');assert.deepEqual(meta.event_ids,x.ids);
assert(['E6-T09','E6-T10',undefined].includes(meta.parent_topic_id));if(meta.parent_topic_id)assert.equal(ix.topics.find(t=>t.id===meta.parent_topic_id).status,'research_only');
let s=read(meta.article_file);assert.equal(s.id,id);assert.equal(s.schema,'atlas-major-story-v1');assert.equal(s.sections.length,x.sections);assert(s.sources.length>=5);assert(s.sections.flatMap(y=>y.paragraphs).join('').length>=3000);
const src=new Set(s.sources.map(x=>x.id));assert.equal(src.size,s.sources.length);assert(s.sources.every(x=>x.url.startsWith('https://')&&x.access));assert(s.topic_source_claims.length>=x.sections);
const hits=new Set;for(let sect of s.sections){chapters++;assert(/^[一二三四五六七八九十]+、/.test(sect.heading));assert(sect.source_keys.every(x=>src.has(x)));for(let p of sect.paragraphs){assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(p));for(let m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){assert(atlas.has(m[1]));hits.add(m[1]);links++;}}}
for(let x of meta.event_ids)assert(hits.has(x),'missing anchor '+id+':'+x);
}
const newEvents=['1600S-E092','1610S-E095','1610S-E096','1610S-E097','1620S-E030','1620S-E031','1620S-E032','1630S-E026','1630S-E027','1640S-E095','1670S-E125','1680S-E129','1680S-E130','1680S-E131','1680S-E132','1680S-E133','1680S-E134','1680S-E135','1680S-E136','1680S-E137','1680S-E138','1680S-E139','1690S-E140','1690S-E141'];
for(let id of newEvents){const e=atlas.get(id);assert(e,'new event missing '+id);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert(e.geo_precision.startsWith('representative_'));assert(e.geolocation_limit_zh.includes('非事件精确现场')&&e.geolocation_limit_zh.includes('不表示'));assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.historical_control_boundary_verified,false);assert.equal(e.actual_English_territory_created,false);assert.equal(e.exclude_point_buffer_from_area_statistics,true);assert.equal(e.position_is_historical_survey,false);}
assert(led.critical_claims.some(c=>c.key==='BAHAMAS_1647_49'&&c.exact_date_verified===false));
assert(led.critical_claims.some(c=>c.key==='PENN_SHACKAMAXON'&&c.confirmed_signed_treaty===false));
assert(led.critical_claims.some(c=>c.key==='DOMINION_1686'&&c.jurisdiction_claim_polygon_verified===false));
assert(led.critical_claims.some(c=>c.key==='BERMUDA_LABOR'&&c.racial_chattel_status_evidence===null));
assert.equal(chapters,39);
console.log('PASS Editor22: 29 published topics, 4 new 39-chapter historic gap stories, 24 new non-territorial point events and '+links+' clickable anchors, 27+ authoritative sources and all old decade structures verified.');
