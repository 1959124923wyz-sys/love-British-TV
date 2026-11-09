#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const events=load('data/stories/serial/chronology-preview-ireland-1700-1799.json');
const article=load('data/stories/serial/e18-t29-t30-ireland-penal-rebellion-1704-1799.json');
const index=load('data/stories/serial/preview-18c-index.json'),published=load('data/stories/serial/index.json');
const chapters=load('data/chapters.json'),controls=load('research/continuity/1798-ireland/CONTROL_EPISODES_1798.json');
const t29=load('research/18c/consolidated/series/T29.json'),t30=load('research/18c/consolidated/series/T30.json');
const originals=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html');
assert.equal(chapters.chapters.at(-1).end,1599,'Fifth 18C review is not a published chapter');
assert.equal(index.stories.length,8);
assert.deepEqual(index.stories.slice(0,4).map(x=>x.id),
 ['E18-C07-ACADIA-DEPORTATION','E18-T14-T15-BENGAL-1756-1773',
  'E18-T03-T04-JAMAICA-MAROONS-1718-1799','E18-T01-T02-ATLANTIC-ZONG-1711-1799']);
assert.equal(index.stories[4].id,article.id);
assert.equal(index.stories[4].status,'research_preview');
assert.equal(index.stories[4].publication_review,'not_submitted');
assert(!published.topics.some(t=>t.id===article.id));
for(const id of article.predecessor_story_ids)assert(published.topics.find(x=>x.id===id&&x.status==='published'),'17C predecessor missing '+id);
assert.equal(article.id,'E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799');
assert.equal(article.publication_status,'research_only');
assert.equal(article.publication_approval,'not_submitted');
assert.equal(article.editorial_status,'research_preview_not_published');
assert.equal(article.sections.length,16);
assert.equal(article.sections.reduce((n,s)=>n+s.paragraphs.length,0),48);
assert.equal(events.schema,'atlas-18c-ireland-penal-rebellion-preview-v1');
assert.equal(events.editorial_status,'research_preview_not_published');
assert.equal(events.events.length,20);
assert.equal(events.sources.length,29);
assert.equal(events.places.length,0);assert.equal(events.routes.length,0);assert.equal(events.colonial_polygons.length,0);
const src=new Set(events.sources.map(x=>x.id)),articlesrc=new Set(article.sources.map(x=>x.id));
assert.equal(src.size,29);assert.equal(articlesrc.size,29);
assert.equal(controls.mapping_contract.fill_authorized,false);
assert.equal(controls.mapping_contract.territorial_polygons_created,0);
assert.equal(controls.mapping_contract.area_sqkm,null);
assert.equal(controls.episodes.length,7);
assert(controls.episodes.every(ep=>ep.map_points_not_polygon&&ep.start_date>=String(1798)&&ep.end_on_or_before<=String(1798)+'-12-31'));
assert(controls.episodes.some(ep=>ep.stable_id==='IRL-1798-ENNISCORTHY-REBELS'&&ep.end_on_or_before==='1798-06-21'));
assert(controls.episodes.some(ep=>ep.stable_id==='IRL-1798-ANTRIM-CONTESTED'&&ep.end_on_or_before==='1798-06-07'));
const group=new Map([...t29.groups,...t30.groups].map(g=>[g.id,g]));
assert.equal(group.size,10,'T29/T30 selection must not fabricate merge groups');
const seen=new Map();let points=0,linkedCount=0;
for(const ev of events.events){
 assert(/^E18C-IRL-[A-Za-z0-9-]+$/.test(ev.id)&&!seen.has(ev.id));
 seen.set(ev.id,ev);
 assert(ev.year>=1700&&ev.year<=1799&&ev.year===ev.start_year&&ev.year===ev.end_year);
 assert.equal(ev.publication_status,'research_only');
 assert.equal(ev.historical_control_boundary_verified,false);
 assert.equal(ev.actual_English_land_area_sqkm,null);assert.equal(ev.area_sqkm,null);
 assert.equal(ev.fill_authorized,false);assert.equal(ev.territorial_claim,false);
 assert.equal(ev.exclude_point_buffer_from_area_statistics,true);
 assert(ev.source_ids.length>0&&ev.source_ids.every(k=>src.has(k)));
 assert(Array.isArray(ev.research_original_record_ids));
 if(ev.research_merge_group_id!==null){
   const g=group.get(ev.research_merge_group_id);assert(g,'fictitious group '+ev.id);
   assert(g.source_years.includes(ev.year));
   assert(ev.research_original_record_ids.some(id=>g.original_candidate_ids.includes(id)));
 }else assert.equal(ev.research_original_record_ids.length,0);
 for(const id of ev.research_original_record_ids)assert(originals.includes('\n'+id+','),'missing 1126 original id '+id);
 if(ev.lat===null){assert.equal(ev.lng,null);assert.equal(ev.representative_map_point,false)}
 else{assert(Number.isFinite(ev.lat)&&Number.isFinite(ev.lng));assert.equal(ev.representative_map_point,true);points++}
}
assert.equal(points,8);
for(const suffix of ['1704-PENAL-LAW','1720-DECLARATORY-ACT','1797-COUNTERINSURGENCY','1798-MAY-UPRISING','1798-SCULLABOGUE','1798-LOYALIST-REPRISALS']){
 assert.equal(seen.get('E18C-IRL-'+suffix).lat,null,'no false single-coordinate regional law/massacre center');
}
assert(seen.get('E18C-IRL-1798-DUNLAVIN-EXECUTIONS').source_ids.includes('18IR-IR18'));
assert(seen.get('E18C-IRL-1798-SCULLABOGUE').research_merge_group_id==='E18-MRG-T30-03');
assert(seen.get('E18C-IRL-1798-DUNLAVIN-EXECUTIONS').research_merge_group_id==='E18-MRG-T30-04');
assert(seen.get('E18C-IRL-1798-VINEGAR-HILL').research_merge_group_id==='E18-MRG-T30-02');
assert(article.sections.some(s=>s.paragraphs.join('').includes('起义方')));
assert(article.sections.some(s=>s.paragraphs.join('').includes('亲政府武装')));
const linked=[];
for(const section of article.sections){
 assert(section.paragraphs.length===3);assert(section.source_keys.length>0);
 for(const sid of section.source_keys)assert(articlesrc.has(sid),'broken article source '+sid);
 for(const paragraph of section.paragraphs)
  for(const m of paragraph.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g)){
    assert(seen.has(m[1]),'unregistered story/map ID '+m[1]);linked.push(m[1]);
  }
}
assert.equal(linked.length,20);
assert.equal(new Set(linked).size,20);
assert.deepEqual(new Set(linked),new Set(article.related_event_ids));
assert.deepEqual(new Set(linked),new Set(index.stories[4].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-ireland-1700-1799.json'"));
assert(app.includes('ireland18cReady=true'));
assert(reader.includes('draft.stories?.length===8'));
assert(reader.includes("storyMeta.has('E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799')"));
assert(html.includes('18c-scotland-union-20261108'));
console.log('PASS fifth Ireland T29/T30: 20 dated research events, 29 sources, 16 chapters 48 paragraphs/20 real links, 8 modern history refs, 7 date-bounded rebel control episodes and 0 fake polygons; old four stories preserved.');
