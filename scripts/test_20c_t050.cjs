const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reg=read('research/20c/T050_EVIDENCE_REGISTER.json'),geo=read('research/20c/T050_CANDIDATE_GIS.geojson'),idx=read('data/stories/serial/index.json');
const es=new Map(reg.events.map(e=>[e.id,e])),ss=new Map(reg.sources.map(s=>[s.id,s])),ps=new Map(geo.features.map(p=>[p.id,p]));
assert.equal(es.size,24);assert.equal(ss.size,23);assert.equal(ps.size,12);assert.equal(reg.quantitative.length,10);
const found=new Set(),points=new Set(),reuseFound=new Set();
for(let y=1900;y<=1990;y+=10){
 const c=read('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),g=read('data/twentieth-century-spatial-'+y+'-'+(y+9)+'.geojson'),src=new Map(c.sources.map(s=>[s.id,s]));
 for(const e of c.events){if(reg.reuse.some(x=>x.id===e.id)){assert(!reuseFound.has(e.id));reuseFound.add(e.id);}if(!es.has(e.id))continue;
  assert(!found.has(e.id));found.add(e.id);const {responsibility,...expected}=es.get(e.id);assert.deepEqual(e,expected);
  assert(e.year>=y&&e.year<=y+9);assert(e.source_ids.every(id=>src.has(id)&&ss.has(id)));assert.equal(e.area_sqkm,null);assert.equal(e.fill_authorized,false);
 }
 for(const p of g.features.filter(p=>/^e20-t050-/.test(p.id))){
  assert(!points.has(p.id));points.add(p.id);const exp=ps.get(p.id),{publication_status,...props}=exp.properties;assert.deepEqual(p,{...exp,properties:props});
  const e=es.get(p.properties.related_event_ids[0]);assert(e);assert.equal(p.geometry.type,'Point');assert.deepEqual(p.geometry.coordinates,[e.lng,e.lat]);assert.equal(p.properties.start_year,e.year);assert.equal(p.properties.end_year,e.year);assert(e.year>=y&&e.year<=y+9);assert(p.properties.source_ids.every(k=>src.has(k)&&ss.has(k)));assert.deepEqual(p.properties.source_urls,p.properties.source_ids.map(k=>ss.get(k).url));assert.equal(p.properties.historical_boundary_confirmed,false);assert.equal(p.properties.territorial_claim,false);assert.equal(p.properties.fill_authorized,false);assert.equal(p.properties.area_sqkm,null);assert.equal(p.properties.exclude_from_area_aggregation,true);
 }
}
assert.equal(found.size,24);assert.equal(points.size,12);assert.equal(reuseFound.size,2);
const t=idx.topics.find(t=>t.id==='E20-T050-NIGERIA-TAX-LABOUR-1914-1960'),a=read(t.article_file);
assert.equal(t.status,'editorial_review');assert.equal(t.publication_review,'not_submitted');assert.equal(t.review_entry_required,true);assert.deepEqual(a,read('research/20c/T050_ARTICLE_CANDIDATE.json'));assert.equal(a.sections.length,15);const src=new Set(a.sources.map(s=>s.id));
assert(a.sections.flatMap(s=>s.paragraphs).join('').replace(/\[\[[^|]+\|([^\]]+)\]\]/g,'$1').length>=3000,'publication prose minimum');
const links=a.sections.flatMap(s=>s.paragraphs.flatMap(p=>[...p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)].map(m=>m[1])));
assert.equal(new Set(links).size,26);assert.deepEqual(links,t.event_ids);assert.deepEqual(new Set(t.review_event_ids),found);assert.deepEqual(new Set(t.review_feature_ids),points);
for(const s of a.sections){assert(s.paragraphs.length>=2);assert(s.source_keys.every(k=>src.has(k)));}
for(const q of reg.quantitative){assert(ss.has(q.source_id));assert(es.has(q.event_id));assert(Number.isFinite(q.value));}
const app=fs.readFileSync('app.js','utf8'),gate=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas(')),getGate=new Function('reviewParams',gate+'\nreturn modern20cReviewGate;');
const pub=getGate({get:()=>null})(1900,idx),rev=getGate({get:()=> '1'})(1900,idx);assert([...found].every(id=>pub.eventIds.has(id)));assert([...points].every(id=>pub.featureIds.has(id)));assert([...reuseFound].every(id=>!pub.eventIds.has(id)));assert.equal(rev.eventIds.size,0);assert.equal(rev.featureIds.size,0);
const approved=JSON.parse(JSON.stringify(idx));const at=approved.topics.find(x=>x.id===t.id);at.status='published';at.publication_review='approved';const release=getGate({get:()=>null})(1900,approved);assert([...found].every(id=>!release.eventIds.has(id)));assert([...points].every(id=>!release.featureIds.has(id)));
assert(fs.readFileSync('js/history-stories.js','utf8').includes("topic.review_entry_required!==true||review.get('review20c')==='1'"));
console.log('PASS T050: 24 new events, 2 reused, 23 sources, 10 scoped statistics, 12 points, 15 sections and isolation');
