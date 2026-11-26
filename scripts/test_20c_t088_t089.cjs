const fs=require('node:fs'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reg=load('research/20c/T088_T089_EVIDENCE_REGISTER.json');
const es=new Map(reg.events.map(e=>[e.id,e])),ss=new Map(reg.sources.map(s=>[s.id,s]));
assert.equal(es.size,34);assert.equal(ss.size,25);
const actual=new Set(),points=new Set();
for(let y=1900;y<2000;y+=10){
 const c=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),g=load('data/twentieth-century-spatial-'+y+'-'+(y+9)+'.geojson');
 const sources=new Set(c.sources.map(x=>x.id));
 for(const e of c.events.filter(e=>es.has(e.id))){
  const r=es.get(e.id);assert(!actual.has(e.id));actual.add(e.id);assert.equal(e.year,r.year);assert(e.year>=y&&e.year<=y+9);assert.equal(e.name,r.name);assert.equal(e.description,r.description);assert.deepEqual(e.source_ids,r.source_ids);assert(e.source_ids.every(id=>ss.has(id)&&sources.has(id)));assert.deepEqual([e.lng,e.lat],r.point?r.point.slice(0,2):[null,null]);assert.equal(e.area_sqkm,null);
 }
 for(const f of g.features.filter(f=>/^e20-t08[89]-/.test(f.id))){
  assert(!points.has(f.id));points.add(f.id);const p=f.properties;
  assert.equal(f.geometry.type,'Point');assert.equal(p.related_event_ids.length,1);
  const e=es.get(p.related_event_ids[0]);assert(e?.point);assert.equal(f.id,e.id.toLowerCase()+'-reference');
  assert.deepEqual(f.geometry.coordinates,e.point.slice(0,2));assert.equal(p.start_year,e.year);assert.equal(p.end_year,e.year);assert(e.year>=y&&e.year<=y+9);
  assert.deepEqual(p.source_ids,e.source_ids);assert.deepEqual(p.source_urls,e.source_ids.map(id=>ss.get(id).url));assert(p.source_ids.every(id=>sources.has(id)));
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.territorial_claim,false);assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 }
}
assert.equal(actual.size,34);assert.equal(points.size,10);
for(const e of es.values())assert.equal(points.has(e.id.toLowerCase()+'-reference'),!!e.point);
const idx=load('data/stories/serial/index.json'),topics=idx.topics.filter(t=>/^E20-T08[89]-/.test(t.id));
assert.equal(topics.length,2);let count=0;
for(const t of topics){
 assert.equal(t.status,'editorial_review');assert.equal(t.publication_review,'not_submitted');assert.equal(t.review_entry_required,true);
 const a=load(t.article_file);assert.equal(a.id,t.id);assert(a.lead.length>=120);const src=new Set(a.sources.map(x=>x.id));const linked=[];
 for(const sec of a.sections){assert(sec.paragraphs.length>=2);assert(sec.source_keys.every(id=>src.has(id)));assert(sec.period_start_year>=a.start_year&&sec.period_end_year<=a.end_year);
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)){assert(es.has(m[1]));linked.push(m[1]);}}
 assert.deepEqual(linked,t.event_ids);assert.deepEqual(linked,t.review_event_ids);assert.deepEqual(t.review_feature_ids,linked.filter(id=>es.get(id).point).map(id=>id.toLowerCase()+'-reference'));
 assert(a.topic_source_claims.every(x=>x.source_keys.every(id=>src.has(id))));count+=a.sections.length;
}
assert.equal(count,34);
const treaty=reg.quantitative.find(x=>x.unit==='GBP');assert.equal(treaty.schedule.reduce((n,p)=>n+p[1],0),treaty.value);assert.equal(treaty.value,20000000);
assert.equal(reg.quantitative.find(x=>x.unit==='AUD').value,13500000);
assert.equal(reg.quantitative.find(x=>x.unit==='km²').value,76420);
const app=fs.readFileSync('app.js','utf8'),gate=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas('));
const getGate=new Function('reviewParams',gate+'\nreturn modern20cReviewGate;');
const publicGate=getGate({get:()=>null})(1950,idx),reviewGate=getGate({get:()=> '1'})(1950,idx);
assert([...actual].every(id=>publicGate.eventIds.has(id)));assert([...points].every(id=>publicGate.featureIds.has(id)));assert.equal(reviewGate.eventIds.size,0);assert.equal(reviewGate.featureIds.size,0);
assert.equal(getGate({get:()=>null})(1800,null).eventIds.size,0);
const half=JSON.parse(JSON.stringify(idx));let approved=half.topics.find(t=>t.id===topics[0].id);approved.status='published';approved.publication_review='approved';
const halfGate=getGate({get:()=>null})(1950,half);
assert(approved.event_ids.every(id=>!halfGate.eventIds.has(id)));assert(topics[1].event_ids.every(id=>halfGate.eventIds.has(id)));
assert(fs.readFileSync('js/history-stories.js','utf8').includes("topic.review_entry_required!==true||review.get('review20c')==='1'"));
console.log('PASS T088/T089: 34 cited events, 25 sources, 10 points, 34 sections, payment reconciliation and visibility gate');
