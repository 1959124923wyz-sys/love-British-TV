#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const atlas=J('data/atlas-1560-1569.json'),manifest=J('data/stories/index.json').stories;
const articleId='elizabethan-witchcraft-act-chelmsford-trials-1563-1566',meta=manifest.find(x=>x.id===articleId);
assert(meta&&meta.status==='published','Witch trial article must be publicly discoverable');
const article=J(meta.file),body=article.sections.flatMap(x=>x.paragraphs).join('');
const ids=[
'WITCH1563-ELIZABETH-STATUTE','WITCH1566-AGNES-CHELMFORD-GUILTY','WITCH1566-AGNES-EXECUTED',
'WITCH1566-ELIZABETH-FRAUNCES-ONE-YEAR','WITCH1566-JOAN-WATERHOUSE-ACQUITTED',
'WITCH1566-LORA-WYNCHESTER-ACQUITTED','WITCH1566-LONDON-PAMPHLET-PUBLICATION'];
assert.equal(atlas.events.length,60);assert.equal(atlas.sources.length,63);
assert.equal(manifest.length,37);
assert.equal(article.sections.length,10);assert(body.length>=3800);
assert.equal(article.sources.length,10);assert(article.lead.length>=120);
assert.deepEqual(article.related_event_ids,ids);assert.deepEqual(meta.event_ids,ids);
const articleKeys=new Set(article.sources.map(x=>x.id));
assert(article.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.length>=2&&s.source_keys.every(k=>articleKeys.has(k))));
assert(article.sources.every(x=>x.url.startsWith('https://')&&x.access));
const links=[...body.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)].map(x=>x[1]);
assert.deepEqual(links,ids,'Seven evidence-distinct events need clear inline links');
const map=new Map(atlas.events.map(e=>[e.id,e])),src=new Map(atlas.sources.map(s=>[s.id,s]));
for(const id of ids){
const e=map.get(id);assert(e,'missing '+id);assert(e.source_ids?.length>=2&&e.source_ids.every(s=>src.has(s)));
assert.equal(e.colonial_profit,null);
assert.equal(e.actual_English_land_area_sqkm,null);
assert.equal(e.actual_English_territory_created,false);
assert.equal(e.historical_control_boundary_verified,false);
assert.equal(e.exclude_point_buffer_from_area_statistics,true);
}
assert.equal(atlas.colonial_polygons.length,0);
for(const id of [ids[0],ids[2],ids[6]]){
assert.equal(map.get(id).lat,null,'unlocated legal/actual gallows/printing event must stay NULL');
assert.equal(map.get(id).lng,null);
}
for(const id of [ids[1],ids[3],ids[4],ids[5]]){
const e=map.get(id);
assert(Math.abs(e.lat-51.7347)<1e-6&&Math.abs(e.lng-0.4730)<1e-6);
assert(/modern_Chelmsford/.test(e.geo_precision)&&/not_original_court|not_verified_1566_courtroom/.test(e.geo_precision),'modern location must never be 1566 courtroom');
}
const agnes=map.get(ids[2]),fraunces=map.get(ids[3]),joan=map.get(ids[4]),lora=map.get(ids[5]);
assert(agnes.date_label.includes('7月29日')&&agnes.description.includes('绞死'));
assert(fraunces.description.includes('监禁整一年')&&fraunces.description.includes('不支持将她写成当日被处死'));
assert(joan.description.includes('无罪'));assert(lora.description.includes('无罪'));
assert(body.includes('约1569年才建成')&&body.includes('1791年')&&body.includes('法院建筑的年代'));
assert(body.includes('不能证明被告拥有巫术')||body.includes('不构成巫术确实存在'));
assert(!atlas.events.some(e=>e.id.startsWith('WITCH1566-')&&e.lat!==null&&e.lng!==null&&e.geo_precision.includes('verified_actual_court')));
console.log('PASS Tudor witchcraft 1563/1566: 10-section source-reviewed story, 7 judicial/legal/media events, 4 modern city anchors, gallows unknown, 1569/1791 building correction, no invented supernatural facts or control polygons');