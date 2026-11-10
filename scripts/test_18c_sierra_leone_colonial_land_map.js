#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path'),root=P.resolve(__dirname,'..');
const get=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(get(p));
const d=J('data/stories/serial/chronology-preview-sierra-leone-1728-1799.json'),a=J('data/stories/serial/e18-t27-sierra-leone-bunce-black-settlers-1728-1799.json'),idx=J('data/stories/serial/preview-18c-index.json'),t=J('research/18c/consolidated/series/T27.json'),geo=J('research/continuity/1728-1799-sierra-leone/BUNCE_FREETOWN_AFRICAN_LAND_CONTROL_TRANSITIONS.json'),old=J('data/stories/serial/index.json');
A.equal(idx.stories.length,19);A.equal(idx.stories[13].id,a.id);A.equal(idx.stories[13].status,'research_preview');A.equal(idx.stories[13].publication_review,'not_submitted');
A.equal(a.id,'E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799');A.equal(a.publication_status,'research_only');A.equal(a.publication_approval,'not_submitted');
A.deepEqual(a.predecessor_17c_story_ids,['E6-T13','E6-T17-AFRICAN-FORTS']);
A(old.topics.some(x=>x.id==='E6-T13'&&x.status==='published'));A(!old.topics.some(x=>x.id===a.id));
A.equal(t.groups.length,3);A.equal(t.groups.reduce((n,x)=>n+x.original_candidate_ids.length,0),4);
A.equal(d.events.length,18);A.equal(d.sources.length,33);A.equal(d.sources.filter(s=>s.original_registry_key?.startsWith('B:')).length,7);
A.equal(d.sources.filter(s=>s.original_registry_key===null).length,26);
A.equal(d.colonial_polygons.length,0);A.equal(d.routes.length,0);A.equal(d.places.length,0);
A.equal(geo.transitions.length,18);A(geo.transitions.every(x=>x.polygon_allowed===false&&x.area_sqkm===null));
A.equal(a.sections.length,21);A.equal(a.sections.reduce((n,s)=>n+s.paragraphs.length,0),63);
A.deepEqual(new Set(a.sources.map(x=>x.id)),new Set(d.sources.map(x=>x.id)));
const orig=new Map(t.groups.flatMap(g=>g.candidate_subevents.map(x=>[x.original_id,{group:g,child:x}])));
const ids=new Set(d.sources.map(s=>s.id)),seen=new Map,assigned=new Set;
let group=0,extra=0,points=0;
for(const e of d.events){
 A(!seen.has(e.id)&&/^E18C-SLE-[A-Z0-9-]+$/.test(e.id),e.id);seen.set(e.id,e);
 A(e.year>=1728&&e.year<=1799&&e.year===e.start_year&&e.year===e.end_year);
 A.equal(e.publication_status,'research_only');A.equal(e.historical_control_boundary_verified,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);A.equal(e.territorial_claim,false);A.equal(e.fill_authorized,false);
 A(e.source_ids.length&&e.source_ids.every(x=>ids.has(x)));
 if(e.research_merge_group_id){group++;for(const id of e.research_original_record_ids){
  A(!assigned.has(id));assigned.add(id);A(get('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv').includes('\n'+id+','));
  const match=orig.get(id);A(match&&match.group.id===e.research_merge_group_id&&match.child.year===e.year);
 }}else{extra++;A.deepEqual(e.research_original_record_ids,[]);}
 if(e.lat!==null){points++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.representative_map_point)}else{A.equal(e.lng,null);A.equal(e.representative_map_point,false)}
}
A.equal(group,3);A.equal(extra,15);A.equal(assigned.size,4);A.equal(points,13);
const by=x=>seen.get('E18C-SLE-'+x);
A.equal(by('1788-NAIMBANA-TREATY').lat,null);A.equal(by('1792-HALIFAX-EMBARK').lat,44.647401);A.equal(by('1799-SETTLER-FREEHOLD-DISPUTE').lat,8.48714);A.equal(by('1728-RAC-WITHDRAWS-BUNCE').lat,8.569773);
A(by('1794-FRENCH-PLUNDER-FREETOWN').control_state.includes('French'));
A(by('1728-BUNCE-DA-MOURA-RAID').control_state.includes('Afro-Portuguese'));
A(!d.events.some(e=>e.year===1800));A.equal(d.statistics.verified_departure_1792_black_loyalists,1196);A.equal(d.statistics.verified_departure_1792_ships,15);
let links=[];for(const section of a.sections){A.equal(section.paragraphs.length,3);A(section.source_keys.length&&section.source_keys.every(x=>ids.has(x)));
 for(const p of section.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(seen.has(m[1]),m[1]);links.push(m[1]);}}
A.equal(links.length,18);A.equal(new Set(links).size,18);A.deepEqual(new Set(links),new Set(idx.stories[13].event_ids));
const app=get('app.js'),ui=get('js/history-stories.js'),html=get('index.html'),css=get('css/history-stories.css');
A(app.includes("fetch('data/stories/serial/chronology-preview-sierra-leone-1728-1799.json'"));A(app.includes('sierraLeone18cReady=true'));
A(ui.includes('draft.stories?.length===19'));A(ui.includes("storyMeta.has('E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799')"));
A(html.includes('18c14-sierra-leone-20261110'));A(!ui.includes('story-reading-toolbar')&&!ui.includes('story-toc')&&!ui.includes('story-reading-progress-meter')&&!ui.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
console.log('PASS T27: 3 original groups/4 IDs/7 B keys, 18 events/33 sources, 21 chapters/63 paragraphs, 18 real links, 13 modern named-place anchor occurrences, no fake polygons, no early 1800 uprising, 13 previous topics intact.');
