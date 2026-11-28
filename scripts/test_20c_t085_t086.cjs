const fs=require('node:fs'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reg=load('research/20c/T085_T086_PRODUCTION_REGISTER.json');
const es=new Map(reg.events.map(e=>[e.id,e])),ss=new Map(reg.sources.map(s=>[s.id,s])),ps=new Map(reg.points.map(p=>[p.id,p]));
assert.equal(es.size,48);assert.equal(ss.size,53);assert.equal(ps.size,15);
const actual=new Set(),points=new Set(),reuse=new Set(reg.reused_event_ids);
for(let y=1900;y<2000;y+=10){
 const c=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json'),g=load('data/twentieth-century-spatial-'+y+'-'+(y+9)+'.geojson');
 const sources=new Map(c.sources.map(s=>[s.id,s]));
 for(const e of c.events.filter(e=>es.has(e.id))){
  assert(!actual.has(e.id));actual.add(e.id);assert.deepEqual(e,es.get(e.id));assert(e.year>=y&&e.year<=y+9);
  assert(e.source_ids.every(id=>ss.has(id)&&sources.has(id)));assert.equal(e.area_sqkm,null);
 }
 for(const f of g.features.filter(f=>/^e20-t08[56]-/.test(f.id))){
  assert(!points.has(f.id));points.add(f.id);assert.deepEqual(f,ps.get(f.id));
  const p=f.properties,e=es.get(p.related_event_ids[0]);assert(e);assert.equal(p.related_event_ids.length,1);
  assert.equal(f.geometry.type,'Point');assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(p.start_year,e.year);assert.equal(p.end_year,e.year);assert(e.year>=y&&e.year<=y+9);
  assert(p.source_ids.every(id=>sources.has(id)));assert.deepEqual(p.source_urls,p.source_ids.map(id=>ss.get(id).url));
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.territorial_claim,false);assert.equal(p.fill_authorized,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 }
}
assert.equal(actual.size,48);assert.equal(points.size,15);
for(const e of es.values())assert.equal(points.has(e.id.toLowerCase()+'-reference'),Number.isFinite(e.lat)&&Number.isFinite(e.lng));
const idx=load('data/stories/serial/index.json'),topics=idx.topics.filter(t=>/^E20-T08[56]-/.test(t.id));
assert.equal(topics.length,2);let count=0,totalLinks=0;
const sorted=a=>[...a].sort();
for(const t of topics){
 assert.equal(t.status,'published');assert.equal(t.publication_review,'approved');assert.equal(t.review_entry_required,true);
 const a=load(t.article_file);assert.equal(a.id,t.id);const src=new Set(a.sources.map(x=>x.id));const linked=[];assert(a.sections.flatMap(s=>s.paragraphs).join('').replace(/\[\[[^|]+\|([^\]]+)\]\]/g,'$1').length>=3000,'publication prose minimum');
 for(const sec of a.sections){assert(sec.paragraphs.length>=2);assert(sec.source_keys.every(id=>src.has(id)));assert(sec.period_start_year>=a.start_year&&sec.period_end_year<=a.end_year);
 for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)){assert(es.has(m[1])||reuse.has(m[1]));linked.push(m[1]);}}
 assert.deepEqual(linked,t.event_ids);assert.deepEqual(sorted(linked.filter(id=>es.has(id))),sorted(t.review_event_ids));assert.deepEqual(sorted(t.review_feature_ids),sorted(linked.filter(id=>points.has(id.toLowerCase()+'-reference')).map(id=>id.toLowerCase()+'-reference')));
 assert(a.topic_source_claims.every(x=>x.source_keys.every(id=>src.has(id))));count+=a.sections.length;totalLinks+=linked.length;
}
assert.equal(count,32);assert.equal(totalLinks,49);
const rows=reg.regional_contracts.rows;
for(const r of rows)assert.equal(r[1]+r[2]+r[3],r[4]);
assert.deepEqual([1,2,3,4].map(i=>rows.reduce((n,r)=>n+r[i],0)),[15247,23792,15071,54110]);
assert.equal(rows.find(r=>r[0]==='Malaita')[4],36596);assert.equal(reg.regional_contracts.no_data.length,2);
assert.equal(reg.annual_labour.rows.length,16);assert(reg.annual_labour.rows.every((r,i)=>r[0]===1924+i&&r[1]<=r[2]));
const app=fs.readFileSync('app.js','utf8'),gate=app.slice(app.indexOf('function modern20cReviewGate('),app.indexOf('async function fetchModernAtlas('));
const getGate=new Function('reviewParams',gate+'\nreturn modern20cReviewGate;');
const publicGate=getGate({get:()=>null})(1950,idx),reviewGate=getGate({get:()=> '1'})(1950,idx);
assert([...actual].every(id=>!publicGate.eventIds.has(id)));assert([...points].every(id=>!publicGate.featureIds.has(id)));assert([...reuse].every(id=>!publicGate.eventIds.has(id)));assert.equal(reviewGate.eventIds.size,0);assert.equal(reviewGate.featureIds.size,0);
const pending=JSON.parse(JSON.stringify(idx));for(const t of pending.topics.filter(t=>/^E20-T08[56]-/.test(t.id))){t.status='editorial_review';t.publication_review='not_submitted';}
const pendingGate=getGate({get:()=>null})(1950,pending);assert([...actual].every(id=>pendingGate.eventIds.has(id)));assert([...points].every(id=>pendingGate.featureIds.has(id)));assert([...reuse].every(id=>!pendingGate.eventIds.has(id)));
const half=JSON.parse(JSON.stringify(pending));let approved=half.topics.find(t=>t.id===topics[0].id);approved.status='published';approved.publication_review='approved';
const halfGate=getGate({get:()=>null})(1950,half);assert(approved.review_event_ids.every(id=>!halfGate.eventIds.has(id)));assert(topics[1].review_event_ids.every(id=>halfGate.eventIds.has(id)));
assert(fs.readFileSync('js/history-stories.js','utf8').includes("topic.review_entry_required!==true||review.get('review20c')==='1'"));
console.log('PASS T085/T086: 48 new events, 1 reuse, 53 sources, 15 reference points, 32 sections, 24 table rows, visibility gate');
