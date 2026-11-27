const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reg=read('research/20c/T066_EVIDENCE_REGISTER.json'),geo=read('research/20c/T066_CANDIDATE_GIS.geojson'),index=read('data/stories/serial/index.json');
const es=new Map(reg.events.map(e=>[e.id,e])),ss=new Map(reg.sources.map(s=>[s.id,s])),features=new Map(geo.features.map(f=>[f.id,f]));
assert.equal(es.size,29);assert.equal(ss.size,24);assert.equal(features.size,14);assert.equal(reg.quantitative.length,27);
const observed=new Set(),observedPoints=new Set(),reused=new Set();
for(let d=1900;d<=1990;d+=10){
 const c=read('data/stories/serial/chronology-'+d+'-'+(d+9)+'.json'),g=read('data/twentieth-century-spatial-'+d+'-'+(d+9)+'.geojson'),ids=new Set(c.sources.map(s=>s.id));
 for(const e of c.events){if(reg.reused_event_ids.includes(e.id))reused.add(e.id);if(!es.has(e.id))continue;assert(!observed.has(e.id));observed.add(e.id);const {responsibility,...expected}=es.get(e.id);assert.deepEqual(e,expected);assert(e.year>=d&&e.year<=d+9);assert(e.source_ids.every(id=>ids.has(id)&&ss.has(id)));assert.equal(e.area_sqkm,null);}
 for(const f of g.features.filter(f=>/^e20-t066-/.test(f.id))){assert(!observedPoints.has(f.id));observedPoints.add(f.id);assert.deepEqual(f,features.get(f.id));const p=f.properties,e=es.get(p.related_event_ids[0]);assert(e&&p.related_event_ids.length===1);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.geometry.type,'Point');assert.equal(p.start_year,e.year);assert.equal(p.end_year,e.year);assert(e.year>=d&&e.year<=d+9);assert.equal(p.territorial_claim,false);assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);assert.deepEqual(p.source_urls,p.source_ids.map(id=>ss.get(id).url));assert(p.source_ids.every(id=>ids.has(id)));}
}
assert.equal(observed.size,29);assert.equal(observedPoints.size,14);assert.equal(reused.size,2);
const t=index.topics.find(t=>t.id==='E20-T066-CHAGOS-FORCED-DISPLACEMENT-1964-1998'),a=read(t.article_file);
assert.equal(t.status,'editorial_review');assert.equal(t.publication_review,'not_submitted');assert.equal(t.review_entry_required,true);assert.equal(a.sections.length,17);assert(a.lead.length>=120);const sources=new Set(a.sources.map(s=>s.id));
const links=[...a.sections.flatMap(s=>s.paragraphs).join('').matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)].map(m=>m[1]);
assert.equal(new Set(links).size,31);assert.deepEqual(links,t.event_ids);assert(links.every(id=>es.has(id)||reused.has(id)));
assert.deepEqual(new Set(t.review_event_ids),observed);assert.deepEqual(new Set(t.review_feature_ids),observedPoints);
for(const s of a.sections){assert(s.paragraphs.length>=2);assert(s.source_keys.every(id=>sources.has(id)));assert(s.period_start_year>=a.start_year&&s.period_end_year<=a.end_year);for(const p of s.paragraphs)assert(!/地图不填充|地图使用|地图仅呈现|地理参考点|地籍界线|推测区域|本世纪时间轴/.test(p),s.id);}
for(const q of reg.quantitative){assert(ss.has(q.source_id)&&es.has(q.event_id)&&Number.isFinite(q.value));}
assert.equal(reg.quantitative.filter(q=>q.event_id==='E20-T066-LAST73').reduce((n,q)=>n+q.value,0),133);
assert.equal(reg.quantitative.filter(q=>q.event_id==='E20-T066-DISBURSE77').reduce((n,q)=>n+q.value,0),595);
assert.equal(reg.territorial_phases[0].to,1975);assert.deepEqual(reg.territorial_phases[1].returned,['Aldabra','Farquhar','Desroches']);
const app=fs.readFileSync('app.js','utf8'),gate=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas(')),getGate=new Function('reviewParams',gate+'\nreturn modern20cReviewGate;');
const pub=getGate({get:()=>null})(1960,index),rev=getGate({get:()=> '1'})(1960,index);assert([...observed].every(id=>pub.eventIds.has(id)));assert([...observedPoints].every(id=>pub.featureIds.has(id)));assert([...reused].every(id=>!pub.eventIds.has(id)));assert.equal(rev.eventIds.size,0);assert.equal(rev.featureIds.size,0);
const approved=JSON.parse(JSON.stringify(index));const topic=approved.topics.find(x=>x.id===t.id);topic.status='published';topic.publication_review='approved';const release=getGate({get:()=>null})(1960,approved);assert([...observed].every(id=>!release.eventIds.has(id)));assert([...observedPoints].every(id=>!release.featureIds.has(id)));
assert(fs.readFileSync('js/history-stories.js','utf8').includes("topic.review_entry_required!==true||review.get('review20c')==='1'"));
console.log('PASS T066: source, chronology, GIS, distinct finance and candidate gate');
