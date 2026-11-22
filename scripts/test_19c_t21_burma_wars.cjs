#!/usr/bin/env node
'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='E19-T21-BURMA-THREE-WARS-DISPOSSESSION',file='data/stories/serial/e19-t21-burma-three-wars-wuntho-land-rice-1823-1899.json';
const story=read(file),idx=read('data/stories/serial/index.json'),topic=idx.topics.find(x=>x.id===id);
a(topic&&story.id===id);
a(['editorial_review','published'].includes(topic.status));
a(['not_submitted','approved'].includes(topic.publication_review));
a.equal(story.sections.length,36);
a.equal(story.sections.reduce((n,s)=>n+s.paragraphs.length,0),97);
a(story.sections.flatMap(s=>s.paragraphs).join('').length>12000);
a.equal(story.sources.length,93);
a.equal(story.topic_source_claims.length,36);
const keys=new Set(story.sources.map(s=>s.id));
a.equal(keys.size,story.sources.length);
for(const s of story.sources)a(s.url.startsWith('https://')&&s.title&&s.publisher&&s.access,s.id);
const secIds=new Set(story.sections.map(s=>s.id)),links=[];
for(const sec of story.sections){
 a(sec.paragraphs.length>=2&&sec.source_keys.length>=2,sec.id);
 a(sec.period_start_year>=1823&&sec.period_end_year<=1899,sec.id);
 for(const key of sec.source_keys)a(keys.has(key),sec.id+' source '+key);
 for(const p of sec.paragraphs){a(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(p),sec.id+' internal copy');
  for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\n]+?)\]\]/g))links.push(m[1]);}
}
for(const c of story.topic_source_claims){a(secIds.has(c.section_id));for(const k of c.source_keys)a(keys.has(k));}
const unique=new Set(links);a.equal(unique.size,109);a.deepEqual(unique,new Set(topic.event_ids));
const oldNames=['E19-BURMA-YANDABO','E19-BURMA-PEGU-ANNEXATION','E19-BURMA-THIRD-WAR'];
for(const id0 of oldNames){const o=idx.topics.find(x=>x.id===id0);a(o&&o.status==='editorial_review'&&o.publication_review==='not_submitted',id0);}
const years=[1820,1850,1870,1880,1890];const all=years.flatMap(y=>read('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json').events);
const byId=new Map(all.map(e=>[e.id,e]));
for(const id0 of unique){a(byId.has(id0),'broken history link '+id0);a(byId.get(id0).source_ids.length,'no source '+id0);}
const newEvents=[...unique].filter(id0=>id0.startsWith('E19-T21-'));
a.equal(newEvents.length,12);
a.equal(newEvents.filter(x=>x.includes('1891-')).length,10);
a(newEvents.includes('E19-T21-1876-LOWER-BURMA-LAND-REVENUE'));
a(newEvents.includes('E19-T21-1899-RICE-PORT-EXPORTS'));
const c70=read('data/stories/serial/chronology-1870-1879.json'),c90=read('data/stories/serial/chronology-1890-1899.json');
const available70=new Set(c70.sources.map(x=>x.id)),available90=new Set(c90.sources.map(x=>x.id));
for(const e of c70.events.filter(x=>x.id.startsWith('E19-T21-')))for(const k of e.source_ids)a(available70.has(k),k);
for(const e of c90.events.filter(x=>x.id.startsWith('E19-T21-')))for(const k of e.source_ids)a(available90.has(k),k);
a(byId.get('E19-T21-1891-KAWLIN-PAGODA').description.includes('全部守卫者'));
a(byId.get('E19-T21-1891-PEGON-DESTROYED').description.includes('摧毁'));
a(byId.get('E19-T21-1891-KYAING-HILL').description.includes('50'));
a(byId.get('E19-T21-1891-MANKIN-SHELLED').description.includes('炮击'));
a(byId.get('E19-T21-1899-RICE-PORT-EXPORTS').description.includes('1298445'));
const geo=read('data/nineteenth-century-spatial-1890-1899.geojson'),points=geo.features.filter(f=>f.id?.startsWith('t21-'));
a.equal(points.length,4);
const expected={
 't21-kawlin-town-wuntho-1891':[95.6777,23.79397],
 't21-pegon-modern-named-place-1891':[95.66254,23.81455],
 't21-wuntho-town-1891-annexation':[95.6856,23.8989],
 't21-pinlebu-1891-occupation':[95.38115,24.09043]
};
for(const f of points){
 a.equal(f.geometry.type,'Point');a.deepEqual(f.geometry.coordinates,expected[f.id]);
 const p=f.properties;
 a.equal(p.source_ids.length,p.source_urls.length);
 a(p.source_ids.every(x=>available90.has(x)),f.id);
 a(p.related_event_ids.every(x=>unique.has(x)),f.id);
 a.equal(p.historical_boundary_confirmed,false);a.equal(p.fill_authorized,false);
 a.equal(p.territorial_claim,false);a.equal(p.area_sqkm,null);
 a.equal(p.exclude_from_area_aggregation,true);a(p.geo_precision.includes('not_'),f.id);
}
for(const id0 of ['E19-T10-IRISH-FAMINE-EVICTIONS-ESTATES','E19-T14-SINDH-PUNJAB-AWADH-CONQUEST-EXPROPRIATION','E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE'])a.equal(idx.topics.find(x=>x.id===id0)?.status,'published');
console.log('PASS T21 Burma: 36 sections, 97 paragraphs, 93 sources, 109 source-backed event links (97 reused/12 new), 1891 violence, 1876 law, 1899 rice, 4 named points');
