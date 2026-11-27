'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const idx=load('data/stories/serial/index.json'),events=new Map(),maps=new Map();
for(const d of ['1910-1919','1920-1929','1930-1939','1940-1949']){
 const c=load('data/stories/serial/chronology-'+d+'.json'),g=load('data/twentieth-century-spatial-'+d+'.geojson');
 const keys=new Set(c.sources.map(s=>s.id));assert.equal(keys.size,c.sources.length);
 for(const e of c.events){if(e.id.startsWith('E20-T032-')||e.id.startsWith('E20-T033-')){assert(!events.has(e.id),e.id);events.set(e.id,e);assert(e.source_ids.every(k=>keys.has(k)),e.id);maps.set(e.id,g.features);}}
}
for(const [n,count,ns] of [['032',20,27],['033',22,33]]){
 const m=load('research/20c/T'+n+'_EVENT_REGISTER.json'),t=idx.topics.find(t=>t.id===m.id),a=load(t.article_file),keys=new Set(a.sources.map(s=>s.id));
 assert.equal(a.id,t.id);assert.equal(a.sections.length,count);assert.equal(keys.size,ns);assert(a.lead.length>=120);
 assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
 const body=a.sections.flatMap(s=>s.paragraphs).join('');assert(body.replace(/\[\[[A-Z0-9-]+\|([^\]]+)\]\]/g,'$1').length>=3000);
 const links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(x=>x[1]))];assert.deepEqual(links,t.event_ids);assert.deepEqual(links,m.events.map(e=>e.id));
 for(const x of m.events){const e=events.get(x.id);assert(e,x.id);assert.equal(e.year,x.year);if(x.reuse)continue;
 assert.deepEqual(e.source_ids,x.source_ids);assert(e.source_ids.every(k=>keys.has(k)));assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);
 if(x.loc){const f=maps.get(x.id).find(f=>f.properties.related_event_ids?.includes(x.id));assert(f,x.id);assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.properties.territorial_claim,false);assert.equal(f.properties.fill_authorized,false);assert.equal(f.properties.area_sqkm,null);}
 else assert.equal(e.lat,null,x.id);
 }if(t.status==='published')assert.equal(t.publication_review,'approved');
}
assert.equal(events.size,41);
assert.equal([...events.values()].filter(e=>e.lat!==null).length,32);
assert.deepEqual([events.get('E20-T032-EXILE').lat,events.get('E20-T032-EXILE').lng],[-4.67643,55.47426]);
assert.equal(events.get('E20-T033-CLOSE').year,1949);
assert.match(events.get('E20-T033-BIRTH').date_label,/全期统计/);
let previous=1916;
for(const d of ['1910-1919','1920-1929','1930-1939','1940-1949']){
 const f=load('data/twentieth-century-spatial-'+d+'.geojson').features.find(f=>f.id==='palestine-jerusalem-administration');
 assert(f,d); assert.deepEqual(f.geometry.coordinates,[35.21633,31.76904]);
 for(const s of f.properties.year_stages){assert.equal(s.start_year,previous+1);previous=s.end_year;assert.equal(s.controller,'british');}
 assert.equal(f.properties.territorial_claim,false);
}
assert.equal(previous,1947);
console.log('PASS Palestine evidence, 41 unique events, 42 story links, locality points and political continuity');

const candidates=idx.topics.filter(t=>/^E20-T03[23]-/.test(t.id));
assert.equal(candidates.length,2);
const app=fs.readFileSync('app.js','utf8'),code=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas('));
const getGate=new Function('reviewParams',code+'\nreturn modern20cReviewGate;');
const pub=getGate({get:()=>null})(1900,idx),rev=getGate({get:()=>'1'})(1900,idx);
assert([...events.keys()].every(id=>pub.eventIds.has(id)));
assert(candidates.every(t=>t.review_entry_required&&t.review_feature_ids.every(id=>pub.featureIds.has(id))));
assert.equal(new Set(candidates.flatMap(t=>t.review_feature_ids)).size,16);
assert(!pub.featureIds.has('iraq-t030-t031-london-1920'));assert(!pub.featureIds.has('iraq-t030-t031-london-1930'));
for(const d of ['1920-1929','1930-1939']){
 const fs0=load('data/twentieth-century-spatial-'+d+'.geojson').features,iraq=fs0.find(f=>f.id==='iraq-t030-t031-london-'+d.slice(0,4));
 assert(iraq.properties.related_event_ids.every(id=>!/^E20-T03[23]-/.test(id)));assert(iraq.properties.source_ids.every(id=>!/^E20-T03[23]-/.test(id)));
}
assert.equal(rev.eventIds.size,0);assert.equal(rev.featureIds.size,0);
console.log('PASS candidate isolation: 41 event IDs, 16 feature IDs, shared public Iraq features preserved');
