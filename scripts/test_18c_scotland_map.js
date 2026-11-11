#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const d=load('data/stories/serial/chronology-preview-scotland-1700-1799.json'),
 a=load('data/stories/serial/e18-t31-t32-scotland-union-culloden-1700-1799.json'),
 idx=load('data/stories/serial/preview-18c-index.json'),
 pub=load('data/stories/serial/index.json'),chap=load('data/chapters.json'),
 sc31=load('research/18c/consolidated/series/T31.json'),
 sc32=load('research/18c/consolidated/series/T32.json'),
 status=load('research/continuity/1700-1707-scotland/STATE_AND_DARIEN_ACTOR_TRANSITIONS.json');
const crosswalk=read('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
const app=read('app.js'),reader=read('js/history-stories.js'),html=read('index.html');
assert.equal(chap.chapters.at(-1).end,1599);
assert.equal(idx.stories.length,25);
assert.deepEqual(idx.stories.slice(0,6).map(x=>x.id),[
 'E18-C07-ACADIA-DEPORTATION','E18-T14-T15-BENGAL-1756-1773',
 'E18-T03-T04-JAMAICA-MAROONS-1718-1799',
 'E18-T01-T02-ATLANTIC-ZONG-1711-1799',
 'E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799',
 'E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799'
]);
assert.equal(idx.stories[6].id,a.id);
assert.equal(idx.stories[6].status,'research_preview');
assert.equal(idx.stories[6].publication_review,'not_submitted');
assert.equal(a.id,'E18-T31-T32-SCOTLAND-UNION-CULLODEN-1700-1799');
assert.equal(a.publication_status,'research_only');
assert.equal(a.publication_approval,'not_submitted');
assert.equal(a.editorial_status,'research_preview_not_published');
assert(!pub.topics.some(x=>x.id===a.id));
for(const id of a.predecessor_story_ids)assert(pub.topics.some(t=>t.id===id&&t.status==='published'),'E6 Scottish predecessor missing: '+id);
assert.deepEqual(a.predecessor_story_ids,['E6-T04-DARIEN','E6-T04-CONQUEST','E6-T04-GLENCOE']);
assert.equal(a.sections.length,19);
assert.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),57);
assert.equal(d.schema,'atlas-18c-scotland-union-jacobite-preview-v1');
assert.equal(d.editorial_status,'research_preview_not_published');
assert.equal(d.events.length,23);
assert.equal(d.sources.length,37);
assert.equal(d.sources.filter(x=>x.original_registry_key?.startsWith('C:')).length,24);
assert.equal(d.sources.filter(x=>x.original_registry_key===null).length,13);
assert.equal(d.places.length,0);assert.equal(d.routes.length,0);assert.equal(d.colonial_polygons.length,0);
assert.equal(d.publication.actual_control_polygons_approved,0);
const src=new Set(d.sources.map(s=>s.id)),articleSrc=new Set(a.sources.map(s=>s.id));
assert.equal(src.size,37);assert.equal(articleSrc.size,37);
const groups=new Map([...sc31.groups,...sc32.groups].map(g=>[g.id,g]));
assert.equal(groups.size,9);
assert.equal(status.transitions.length,6);
assert(status.transitions.every(t=>t.polygon_allowed===false));
assert(status.transitions.some(t=>t.entity.startsWith('Scottish Company Darien')&&t.effective_year===1700&&t.retain_1700_everlasting===false));
assert(status.transitions.some(t=>t.entity.includes('Kingdom of Scotland')&&t.effective_date==='1707-05-01'&&t.new_actor==='Kingdom of Great Britain'));
assert(status.transitions.some(t=>t.entity==='Kingdom of Ireland'&&t.new_actor==='Kingdom of Ireland'));
const byId=new Map();let points=0,direct=0,promoted=0;
for(const e of d.events){
 assert(/^E18C-SCT-[A-Z0-9-]+$/.test(e.id)&&!byId.has(e.id),e.id);
 byId.set(e.id,e);
 assert(e.year>=1700&&e.year<=1799&&e.start_year===e.year&&e.end_year===e.year);
 assert.equal(e.publication_status,'research_only');
 assert.equal(e.actual_English_land_area_sqkm,null);
 assert.equal(e.area_sqkm,null);
 assert.equal(e.historical_control_boundary_verified,false);
 assert.equal(e.fill_authorized,false);
 assert.equal(e.territorial_claim,false);
 assert.equal(e.position_is_historical_survey,false);
 assert.equal(e.exclude_point_buffer_from_area_statistics,true);
 assert(e.source_ids.length>0&&e.source_ids.every(id=>src.has(id)));
 assert(e.research_original_record_ids.length>0);
 for(const id of e.research_original_record_ids)
  assert(crosswalk.includes('\n'+id+','),'Original 1126 archive record lost '+id);
 if(e.research_merge_group_id!==null){
  const g=groups.get(e.research_merge_group_id);
  assert(g,'research group does not exist for '+e.id);
  assert(g.source_years.includes(e.year),'research group year mismatch '+e.id);
  assert(e.research_original_record_ids.some(id=>g.original_candidate_ids.includes(id)),
   'original member must be in same real group '+e.id);
  direct++;
 }else{
  promoted++;assert.equal(e.research_provenance_kind,'editor15_narrative_archive_promoted_with_official_cross_check');
 }
 if(e.lat===null){assert.equal(e.lng,null);assert.equal(e.representative_map_point,false)}
 else{points++;assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));
  assert.equal(e.representative_map_point,true)}
}
assert.equal(points,5);
assert.equal(direct,17);assert.equal(promoted,6);
const pointLoci={
 '1700-DARIEN-SURRENDER':[8.916667,-77.7],
 '1715-SHERIFFMUIR':[56.203429,-3.919211],
 '1719-GLENSHIEL':[57.170256,-5.316893],
 '1745-GLENFINNAN-STANDARD':[56.869196,-5.437078],
 '1746-CULLODEN':[57.478796,-4.104178]
};
for(const [suffix,coord] of Object.entries(pointLoci)){
 assert.deepEqual([byId.get('E18C-SCT-'+suffix).lat,byId.get('E18C-SCT-'+suffix).lng],coord);
}
for(const suffix of ['1705-ALIENS-ACT','1706-ARTICLES','1707-GREAT-BRITAIN-UNION','1707-EQUIVALENT',
 '1746-PRISONERS-TRANSPORT','1747-FORFEITED-ESTATES','1752-CROWN-ANNEXED-ESTATES','1792-YEAR-OF-SHEEP'])
 assert.equal(byId.get('E18C-SCT-'+suffix).lat,null,'no single historical GPS for policy/region '+suffix);
assert.equal(byId.get('E18C-SCT-1705-ALIENS-ACT').research_merge_group_id,null);
assert.equal(byId.get('E18C-SCT-1700-DARIEN-SURRENDER').research_merge_group_id,'E18-MRG-T31-01');
assert.equal(byId.get('E18C-SCT-1707-SCOTTISH-RATIFICATION').research_merge_group_id,'E18-MRG-T31-02');
assert.equal(byId.get('E18C-SCT-1746-CULLODEN').research_merge_group_id,'E18-MRG-T32-04');
assert.equal(byId.get('E18C-SCT-1748-HERITABLE-COURTS-END').research_merge_group_id,'E18-MRG-T32-05');
assert.equal(byId.get('E18C-SCT-1792-YEAR-OF-SHEEP').research_merge_group_id,'E18-MRG-T32-06');
assert(a.quantitative_claims.some(x=>x.value.includes('110比67')));
assert(a.quantitative_claims.some(x=>x.value.includes('398,085')));
assert(a.quantitative_claims.some(x=>x.value.includes('53庄园')));
const linked=[];
for(const section of a.sections){
 assert.equal(section.paragraphs.length,3);
 assert(section.source_keys.length>0);
 for(const id of section.source_keys)assert(articleSrc.has(id));
 for(const p of section.paragraphs)
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){
   assert(byId.has(m[1]),'unregistered interactive story map node '+m[1]);
   linked.push(m[1]);
  }
}
assert.equal(linked.length,23);assert.equal(new Set(linked).size,23);
assert.deepEqual(new Set(linked),new Set(a.related_event_ids));
assert.deepEqual(new Set(linked),new Set(idx.stories[6].event_ids));
assert(app.includes("fetch('data/stories/serial/chronology-preview-scotland-1700-1799.json'"));
assert(app.includes('scotland18cReady=true'));
assert(reader.includes('draft.stories?.length===25'));
assert(reader.includes("storyMeta.has('E18-T31-T32-SCOTLAND-UNION-CULLODEN-1700-1799')"));
assert(html.includes('18c-scotland-union-20261108'));
console.log('PASS 18C Scotland: 23 dated events, 37 sources (24 original registry), 19 sections/57 paragraphs/23 interactive links, 5 verified modern place refs incl 3 HES EPSG27700 conversions, 9 merged groups, six history transitions, no imaginary polygons and all six earlier 18C subjects preserved.');
