const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reg=read('research/20c/T074_EVIDENCE_REGISTER.json'),geo=read('research/20c/T074_CANDIDATE_GIS.geojson'),idx=read('data/stories/serial/index.json');
const es=new Map(reg.events.map(e=>[e.id,e])),ss=new Map(reg.sources.map(s=>[s.id,s])),ps=new Map(geo.features.map(p=>[p.id,p]));
assert.equal(es.size,34);assert.equal(ss.size,36);assert.equal(ps.size,8);assert.equal(reg.quantitative.length,20);
const found=new Set(),points=new Set();
for(let y=1900;y<=1990;y+=10){
 const c=read('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),g=read('data/twentieth-century-spatial-'+y+'-'+(y+9)+'.geojson'),src=new Map(c.sources.map(s=>[s.id,s]));
 for(const e of c.events.filter(e=>es.has(e.id))){
  assert(!found.has(e.id));found.add(e.id);const {responsibility,...expected}=es.get(e.id);assert.deepEqual(e,expected);
  assert(e.year>=y&&e.year<=y+9);assert(e.source_ids.every(id=>src.has(id)&&ss.has(id)));assert.equal(e.area_sqkm,null);assert(!/原109题|母题截止|编审|地图不/.test(e.description+e.date_label));
 }
 for(const p of g.features.filter(p=>/^e20-t074-/.test(p.id))){
  assert(!points.has(p.id));points.add(p.id);const exp=ps.get(p.id),{publication_status,...props}=exp.properties;assert.deepEqual(p,{...exp,properties:props});
  const e=es.get(p.properties.related_event_ids[0]);assert(e);assert.equal(p.geometry.type,'Point');assert.deepEqual(p.geometry.coordinates,[e.lng,e.lat]);assert.equal(p.properties.start_year,e.year);assert.equal(p.properties.end_year,e.year);assert(e.year>=y&&e.year<=y+9);assert(p.properties.source_ids.every(k=>src.has(k)&&ss.has(k)));assert.deepEqual(p.properties.source_urls,p.properties.source_ids.map(k=>ss.get(k).url));assert.equal(p.properties.historical_boundary_confirmed,false);assert.equal(p.properties.territorial_claim,false);assert.equal(p.properties.fill_authorized,false);assert.equal(p.properties.area_sqkm,null);assert.equal(p.properties.exclude_from_area_aggregation,true);
 }
}
assert.equal(found.size,34);assert.equal(points.size,8);
const t=idx.topics.find(t=>t.id==='E20-T074-BRITISH-CHILD-MIGRATION-1902-1998'),a=read(t.article_file);
assert.equal(t.status,'published');assert.equal(t.publication_review,'approved');assert.equal(t.review_entry_required,true);assert.equal(a.sections.length,18);assert(a.sections.flatMap(s=>s.paragraphs).join('').replace(/\[\[[^|]+\|([^\]]+)\]\]/g,'$1').length>=3000);const src=new Set(a.sources.map(s=>s.id));
const links=a.sections.flatMap(s=>s.paragraphs.flatMap(p=>[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)].map(m=>m[1])));
assert.equal(new Set(links).size,34);assert.deepEqual(links,t.event_ids);assert.deepEqual(new Set(t.review_event_ids),found);assert.deepEqual(new Set(t.review_feature_ids),points);
for(const s of a.sections){assert(s.paragraphs.length>=2);assert(s.source_keys.every(k=>src.has(k)));for(const p of s.paragraphs)assert(!/原109题|母题截止|地图不填充|地图使用|推测区域|地理参考点/.test(p),s.id);}
for(const q of reg.quantitative){assert(ss.has(q.source_id));assert(q.event_id?es.has(q.event_id):q.scope_context===true);assert(Number.isFinite(q.value));}
assert.equal(reg.quantitative.find(q=>q.unit==='planned_children').value,50000);assert.equal(reg.quantitative.find(q=>q.metric.includes('八家获准组织')).value,3170);assert.equal(reg.quantitative.find(q=>q.metric.includes('名额')&&q.unit==='places').value,2117);
const app=fs.readFileSync('app.js','utf8'),gate=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas(')),getGate=new Function('reviewParams',gate+'\nreturn modern20cReviewGate;');
const pub=getGate({get:()=>null})(1900,idx),rev=getGate({get:()=> '1'})(1900,idx);assert([...found].every(id=>!pub.eventIds.has(id)));assert([...points].every(id=>!pub.featureIds.has(id)));assert.equal(rev.eventIds.size,0);assert.equal(rev.featureIds.size,0);
const pending=JSON.parse(JSON.stringify(idx));const at=pending.topics.find(x=>x.id===t.id);at.status='editorial_review';at.publication_review='not_submitted';const release=getGate({get:()=>null})(1900,pending);assert([...found].every(id=>release.eventIds.has(id)));assert([...points].every(id=>release.featureIds.has(id)));
assert(fs.readFileSync('js/history-stories.js','utf8').includes("topic.review_entry_required!==true||review.get('review20c')==='1'"));
console.log('PASS T074: 34 events, 36 sources, 20 scoped statistics, 8 point features, 18 sections and isolation');
