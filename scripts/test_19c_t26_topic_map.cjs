#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const topicID='E19-T26-OPIUM-WARS-CHINA-TREATY-PORTS';
const story=load('data/stories/serial/e19-t26-opium-wars-china-treaty-ports-1839-1899.json');
const index=load('data/stories/serial/index.json');
const meta=index.topics.find(x=>x.id===topicID);
assert(meta&&story.id===topicID&&meta.article_file.endsWith('e19-t26-opium-wars-china-treaty-ports-1839-1899.json'));
assert.equal(meta.status,'editorial_review');assert.equal(meta.publication_review,'not_submitted');
assert.equal(story.sections.length,14);
assert.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),44);
assert.equal(story.sources.length,29);
assert.deepEqual(new Set(story.related_story_ids),new Set(['E19-OPIUM-TRADE-CRISIS','E19-OPIUM-WAR-TREATY-PORTS','E19-SECOND-OPIUM-WAR-CANTON','E19-PEKING-LOOT-AND-CONVENTION']));
const refs=new Map(story.sources.map(s=>[s.id,s]));
assert.equal(refs.size,story.sources.length);
for(const s of story.sources){assert(s.url?.startsWith('https://')&&s.label&&s.access,s.id+' source provenance');}
for(const section of story.sections){
 assert(section.source_keys.length>0&&section.source_keys.every(id=>refs.has(id)),section.id+' sources');
 assert(story.topic_source_claims.some(c=>c.section_id===section.id),section.id+' source claim');
 for(const p of section.paragraphs)assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length,'unbalanced event tokens');
}
const years=[1830,1840,1850,1860,1870,1880,1890],events=new Map,geos=new Map,ids=new Set;
for(const y of years){
 const chronology=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),local=new Set(chronology.sources.map(x=>x.id));
 assert(chronology.events.length>0&&local.size===chronology.sources.length,'sources unique '+y);
 for(const e of chronology.events){assert(!events.has(e.id),'duplicate cross-decade event '+e.id);events.set(e.id,e);}
 const geo=load('data/nineteenth-century-spatial-'+y+'-'+(y+9)+'.geojson');
 for(const f of geo.features.filter(f=>f.id.startsWith('t26-'))){
  assert(!ids.has(f.id),'duplicate GIS ID');ids.add(f.id);
  assert.equal(f.properties.historical_boundary_confirmed,false,f.id);
  assert.equal(f.properties.fill_authorized,false,f.id);
  assert.equal(f.properties.territorial_claim,false,f.id);
  assert.equal(f.properties.area_sqkm,null,f.id);
  assert.equal(f.properties.exclude_from_area_aggregation,true,f.id);
  assert(f.properties.start_year>=y&&f.properties.end_year<=y+9,'out-of-decade dates '+f.id);
  assert(f.properties.source_ids.length&&f.properties.source_ids.every(id=>local.has(id)),'unregistered sources '+f.id);
  assert(f.properties.source_urls.length&&f.properties.source_urls.every(url=>url.startsWith('https://')),'missing source URL '+f.id);
  assert(f.properties.mapping_method&&f.properties.named_anchors?.length,'missing mapping audit '+f.id);
  if(f.geometry.type==='Point'){
   const [lng,lat]=f.geometry.coordinates;
   assert(Number.isFinite(lng)&&Math.abs(lng)<=180&&Number.isFinite(lat)&&Math.abs(lat)<=90,f.id+' invalid coordinate');
   assert(f.properties.legal_status&&f.properties.political_controller,f.id+' must distinguish sovereign vs treaty jurisdiction');
   if(f.id.includes('-fiveport-')||f.id.includes('-chefooport-'))assert.equal(f.properties.political_controller,'qing',f.id+' treaty port is Qing territory');
  }else{
   assert.equal(f.geometry.type,'LineString',f.id+' geometry type');
   assert.equal(f.properties.dash_only,true);assert.equal(f.properties.outline_style,'dashed');
   assert.equal(f.properties.area_sqkm,null);
  }
 }
 geos.set(y,geo.features.filter(f=>f.id.startsWith('t26-')));
}
const token=/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g;
const links=story.sections.flatMap(s=>s.paragraphs.flatMap(p=>Array.from(p.matchAll(token),m=>({id:m[1],title:m[2],section:s.id}))));
assert.equal(links.length,99);assert.equal(new Set(links.map(x=>x.id)).size,99);
assert.deepEqual(new Set(meta.event_ids),new Set(links.map(x=>x.id)),'index must cover every inline link');
for(const x of links){assert(events.has(x.id),'unresolved link '+x.id);assert(x.title.trim().length>2,'meaningless anchor '+x.id);}
const fresh=[...events.values()].filter(e=>e.id.startsWith('E19-T26-'));
assert.equal(fresh.length,23,'23 new cited events');
assert.deepEqual(fresh.reduce((a,e)=>(a[Math.floor(e.year/10)*10]=(a[Math.floor(e.year/10)*10]||0)+1,a),{}),{'1840':5,'1860':8,'1870':7,'1880':3});
for(const e of fresh){
 assert(e.source_ids?.length&&e.research_v6_event_ids?.length,'new event needs original research IDs '+e.id);
 assert.equal(e.fill_authorized,false,e.id);
 assert.equal(e.area_sqkm,null,e.id);
}
for(const id of ['E19-T26-1875-MARGARY','E19-T26-1887-OPIUM-ANNOUNCE']){assert.equal(events.get(id).lat,null);assert.equal(events.get(id).lng,null);}
assert(/11月初/.test(events.get('E19-T26-1843-AMOY-OPEN').date_label),'Xiamen competing date must be retained');
assert(/约定/.test(events.get('E19-T26-1876-CHEFOO-COMPENSATION').date_label),'promised amount must not be called received');
assert(/争议/.test(events.get('E19-T26-1887-OPIUM-DISPUTE').name),'disputed retroactivity must not be receipt');
const t26=[...geos.values()].flat();
assert.equal(t26.length,48);
assert.equal(t26.filter(f=>f.geometry.type==='Point').length,46);
assert.equal(t26.filter(f=>f.geometry.type==='LineString').length,2);
const five=['canton','amoy','shanghai','ningpo','fuzhou'];
const four=['ichang','wuhu','wenzhou','beihai'];
for(const y of [1840,1850,1860,1870,1880,1890]){
 for(const id of five){let f=geos.get(y).find(f=>f.id==='t26-fiveport-'+id+'-'+y+'s');assert(f,'five ports continuity '+y+' '+id);assert(f.properties.legal_status!=='british_cession');}
 for(const id of four){let f=geos.get(y).find(f=>f.id==='t26-chefooport-'+id+'-'+y+'s');assert(Boolean(f)===Boolean(y>=1870),'Chefoo no pre-1877 retroactivity '+y+' '+id);if(f)assert(f.properties.start_year=== (y===1870?1877:y));}
}
for(const id of [...five.map(x=>'fiveport-'+x),...four.map(x=>'chefooport-'+x)]){
 const groups=t26.filter(x=>x.properties.stable_id==='t26-'+id);
 assert.equal(new Set(groups.map(x=>x.properties.stable_id)).size,1);
 assert.equal(groups.length,id.startsWith('fiveport')?6:3,id+' slices');
}
const anping=t26.find(x=>x.id==='t26-anping-fort-1860s');
assert(anping&&Math.abs(anping.geometry.coordinates[0]-120.16062)<1e-6&&Math.abs(anping.geometry.coordinates[1]-23.001509)<1e-6);
assert(/not_1868/.test(anping.properties.mapping_method)||/not surveyed 1868/.test(anping.properties.mapping_method));
const board=read('research/19c/consolidated/TOPIC_WORKBOARD.csv').split('\n').find(x=>x.startsWith('T26,'));
assert(board&&board.includes('review_ready'),'T26 status must be updated');
const reader=read('js/history-stories.js'),app=read('app.js');
assert(reader.includes('data-story-event')&&reader.includes('navigateToEventYear')&&reader.includes('doubleOpen'));
assert(app.includes('...serialPreviewByDecade.values()')&&app.includes('renderNineteenthSpatial()'));
for(const file of ['docs/research/19C_T26_CHINA_OPIUM_TREATY_PORTS_GIS_AUDIT.md','research/19c/consolidated/T26_NEXT_ACTIONS.md']){
 assert(fs.existsSync(path.join(root,file)),file+' audit/TODO required');
}
console.log('PASS T26: 14 sections, 44 paragraphs, 99 live event tokens, 23 new records, 48 map objects / six decades, Qing port continuity and source discipline');
