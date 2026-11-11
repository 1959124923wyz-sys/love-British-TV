#!/usr/bin/env node
'use strict';
const A=require('node:assert/strict'),F=require('node:fs'),P=require('node:path');
const root=P.resolve(__dirname,'..'),rd=p=>F.readFileSync(P.join(root,p),'utf8'),J=p=>JSON.parse(rd(p));
const data=J('data/stories/serial/chronology-preview-t11-slavery-law-resistance-1702-1741.json');
const story=J('data/stories/serial/e18-t11-virginia-newyork-stono-slavery-1702-1741.json');
const geo=J('research/continuity/1702-1741-north-america-slavery/COLONIAL_LAW_REVOLT_MILITIA_TRANSITIONS.json');
const original=J('research/18c/consolidated/series/T11.json'),idx=J('data/stories/serial/preview-18c-index.json');
const app=rd('app.js'),reader=rd('js/history-stories.js'),html=rd('index.html'),css=rd('css/history-stories.css');
const cross=rd('research/18c/consolidated/COMPLETE_1126_ARCHIVE_CROSSWALK.csv');
A.equal(idx.stories.length,29);A.equal(idx.stories[19].id,story.id);A.equal(idx.stories[19].status,'research_preview');
A.equal(data.schema,'atlas-18c-t11-slavery-laws-resistance-v1');A.equal(data.editorial_status,'research_preview_not_published');
A.equal(data.events.length,26);A.equal(data.sources.length,47);
A.equal(data.sources.filter(s=>s.original_registry_key?.startsWith('A:')).length,21);
A.equal(original.groups.length,8);
A.equal(data.routes.length,0);A.equal(data.places.length,0);A.equal(data.colonial_polygons.length,0);
A.equal(data.publication.actual_control_polygons_approved,0);
A(data.sources.every(s=>s.url.startsWith('https://')&&s.original_manuscript_personally_inspected===false));
const names=new Set(data.sources.map(s=>s.id)),known=new Set(data.events.map(e=>e.id)),used=new Set;
const originalMap=new Map(original.groups.flatMap(g=>g.candidate_subevents.map(c=>[c.original_id,{group:g.id,year:c.year}])));
A.equal(originalMap.size,10);let points=0;
for(const e of data.events){
 A(/^E18C-T11-[A-Z0-9-]+$/.test(e.id)&&e.year>=1702&&e.year<=1741);
 A.equal(e.year,e.start_year);A.equal(e.year,e.end_year);A.equal(e.publication_status,'research_only');
 A(e.source_ids.length&&e.source_ids.every(s=>names.has(s)));
 A.equal(e.historical_control_boundary_verified,false);A.equal(e.fill_authorized,false);
 A.equal(e.area_sqkm,null);A.equal(e.actual_English_land_area_sqkm,null);
 A.equal(e.territorial_claim,false);A.equal(e.exclude_point_buffer_from_area_statistics,true);
 if(e.lat===null){A.equal(e.lng,null);A.equal(e.representative_map_point,false);}
 else {points++;A(Number.isFinite(e.lat)&&Number.isFinite(e.lng));A(e.representative_map_point);}
 if(e.research_merge_group_id===null)A.deepEqual(e.research_original_record_ids,[]);
 else for(const id of e.research_original_record_ids){
  A(!used.has(id));used.add(id);const o=originalMap.get(id);
  A(o&&o.group===e.research_merge_group_id&&o.year===e.year);
  A(cross.includes('\n'+id+','));
 }
}
A.equal(used.size,10);A.equal(points,6);A.equal(known.size,26);
A.equal(story.sections.length,26);A.equal(story.publication_status,'research_only');A.equal(story.publication_approval,'not_submitted');
let links=[];for(const sec of story.sections){A.equal(sec.paragraphs.length,3);A(sec.source_keys.length&&sec.source_keys.every(k=>names.has(k)));
 for(const par of sec.paragraphs)for(const m of par.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]+)\]\]/g)){A(known.has(m[1]),'bad inline event ID '+m[1]);links.push(m[1]);}}
A.equal(links.length,26);A.equal(new Set(links).size,26);
A.deepEqual(new Set(links),new Set(story.related_event_ids));A.deepEqual(new Set(links),new Set(idx.stories[19].event_ids));
A.equal(geo.transitions.length,26);
A(geo.transitions.every(e=>e.polygon_allowed===false&&e.area_sqkm===null&&e.territorial_control_verified===false));
A(app.includes("fetch('data/stories/serial/chronology-preview-t11-slavery-law-resistance-1702-1741.json'"));
A(app.includes('t11Slavery20Ready=true'));A(reader.includes('draft.stories?.length===29'));
A(reader.includes("storyMeta.has('E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741')"));
A(html.includes('18c20-t11-20261111'));
A(!reader.includes('story-reading-toolbar')&&!reader.includes('story-toc')&&!reader.includes('story-reading-progress-meter')&&!reader.includes('data-story-nav'));
A(!css.includes('.story-reading-toolbar')&&!css.includes('.story-toc'));
const E=tag=>data.events.find(e=>e.id==='E18C-T11-'+tag);
A(E('1705-VIRGINIA-KILLING-IMMUNITY').description.includes('免于刑责'));
A(E('1712-NEW-YORK-EXECUTIONS').description.includes('不同'));
A(E('1729-MARYLAND-MUTILATION-ACT').description.includes('准许'));
A(E('1739-STONO-SEPTEMBER-RISING').lat===null);
A(E('1740-BRITISH-FT-MOSE-ATTACK').lat===null);
A(E('1740-FT-MOSE-BLACK-COUNTERATTACK').research_original_record_ids.length===1);
console.log('PASS T11 twenty stories: 26 events, 47 sources, 26 chapters 78 paragraphs 26 inline links, 8 historic groups 10 original candidate records 21 A keys, 6 modern city refs, no fictitious historical colonial polygons.');
