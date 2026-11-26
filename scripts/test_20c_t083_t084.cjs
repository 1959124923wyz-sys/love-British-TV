const fs=require('node:fs'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const root='research/20c/',reg=load(root+'T083_T084_EVENT_REGISTER.json');
assert.equal(reg.events.length,40);assert.equal(reg.sources.length,42);
const source=new Map(reg.sources.map(s=>[s.id,s])),events=new Map(reg.events.map(e=>[e.id,e]));
assert.equal(source.size,42);assert.equal(events.size,40);
const actual=new Map(),points=new Map();
for(let y=1900;y<2000;y+=10){
 const c=load('data/stories/serial/chronology-'+y+'-'+(y+9)+'.json');
 const s=new Set(c.sources.map(x=>x.id));
 for(const e of c.events){if(events.has(e.id)){assert(!actual.has(e.id));assert.deepEqual(e,events.get(e.id));assert(e.year>=y&&e.year<=y+9);assert(e.source_ids.every(k=>s.has(k)&&source.has(k)));actual.set(e.id,e);}}
 const g=load('data/twentieth-century-spatial-'+y+'-'+(y+9)+'.geojson');
 for(const f of g.features.filter(f=>f.id.startsWith('phosphate-'))){
  assert(!points.has(f.id));points.set(f.id,f);
  const p=f.properties;assert.equal(f.geometry.type,'Point');assert.equal(p.start_year,p.end_year);assert(p.start_year>=y&&p.end_year<=y+9);
  assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
  assert.equal(p.related_event_ids.length,1);const e=events.get(p.related_event_ids[0]);assert(e);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(e.year,p.start_year);assert.deepEqual(p.source_urls,p.source_ids.map(k=>source.get(k).url));
 }
}
assert.equal(actual.size,40);assert.equal(points.size,18);
for(const e of reg.events){const located=Number.isFinite(e.lat)&&Number.isFinite(e.lng);assert.equal([...points.values()].filter(f=>f.properties.related_event_ids.includes(e.id)).length,located?1:0);if(!located){assert.equal(e.lat,null);assert.equal(e.lng,null);}}
const idx=load('data/stories/serial/index.json');
const all=new Set();
for(const [id,n] of [['E20-T083-BANABA-PHOSPHATE-1900-1997',23],['E20-T084-NAURU-PHOSPHATE-1906-1994',21]]){
 const t=idx.topics.find(t=>t.id===id);assert(t);assert.equal(t.status,'editorial_review');const a=load(t.article_file);assert.equal(a.id,id);
 const s=new Set(a.sources.map(x=>x.id));assert.equal(s.size,a.sources.length);assert(a.sections.length>=14);
 const prose=a.sections.flatMap(s=>s.paragraphs).join('');assert(prose.replace(/\[\[[^|]+\|([^\]]+)\]\]/g,'$1').length>=3000);
 const links=[...new Set([...prose.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]]+\]\]/g)].map(m=>m[1]))];assert.equal(links.length,n);assert.deepEqual(t.event_ids,links);
 for(const id of links){assert(events.has(id)||reg.existing_event_ids.includes(id));all.add(id);}
 for(const sec of a.sections){assert(sec.period_start_year>=a.start_year&&sec.period_end_year<=a.end_year&&sec.period_start_year<=sec.period_end_year);assert(sec.source_keys.every(k=>s.has(k)));assert(sec.paragraphs.length>=2);}
 for(const c of a.topic_source_claims){assert(a.sections.some(s=>s.id===c.section_id));assert(c.source_keys.every(k=>s.has(k)));assert(c.original_document_page||c.verification_depth);}
}
assert.equal(all.size,41);
const finance=fs.readFileSync(root+'T083_BANABA_FINANCE_1959_1968.csv','utf8').trim().split('\n').slice(1).map(l=>l.split(','));
assert.equal(finance.length,10);assert.deepEqual(finance[0].slice(0,4),['1959','1052000','233725','29216']);assert.deepEqual(finance.at(-1),['1968','2559000','921418','162415','','14094']);assert.equal(finance.filter(r=>r[4]==='15000').length,6);
const tax=fs.readFileSync(root+'T083_BANABA_TAX_SHARE_1946_1968.csv','utf8').trim().split('\n').slice(1);assert.equal(tax.length,23);assert(tax.includes('1949 (9 months),15.74'));assert.equal(tax.at(-1),'1968,54.24');
assert.equal(events.get('E20-T084-IND68').year,1968);assert.equal(events.get('E20-T084-TRANSFER70').year,1970);
console.log('PASS T083/T084: 40 events, 42 source keys, 18 point records, 41 distinct story links and two original financial tables');

const candidates=idx.topics.filter(t=>/^E20-T08[34]-/.test(t.id));
assert(candidates.every(t=>t.review_entry_required===true));
assert.deepEqual([...new Set(candidates.flatMap(t=>t.review_event_ids))].sort(),[...events.keys()].sort());
assert.deepEqual([...new Set(candidates.flatMap(t=>t.review_feature_ids))].sort(),[...points.keys()].sort());
assert(!candidates.some(t=>t.review_event_ids.includes('E20-EXIT-KIRIBATI')));

const gateApp=fs.readFileSync('app.js','utf8');
const gateSource=gateApp.slice(gateApp.indexOf('function modern20cReviewGate('),gateApp.indexOf('async function fetchModernAtlas('));
const gateFn=new Function('reviewParams',gateSource+'\nreturn modern20cReviewGate;');
const gatePublic=gateFn({get:()=>null})(1900,idx),gatePreview=gateFn({get:()=>'1'})(1900,idx);
assert([...events.keys()].every(id=>gatePublic.eventIds.has(id)));assert([...points.keys()].every(id=>gatePublic.featureIds.has(id)));
assert.equal(gatePreview.eventIds.size,0);assert.equal(gatePreview.featureIds.size,0);
assert.equal(gateFn({get:()=>null})(1800,null).eventIds.size,0);
const approvedRegistry=JSON.parse(JSON.stringify(idx));for(const t of approvedRegistry.topics)if(t.review_entry_required){t.status='published';t.publication_review='approved';}
assert.equal(gateFn({get:()=>null})(1900,approvedRegistry).eventIds.size,0);
assert.equal(gateFn({get:()=>null})(1900,approvedRegistry).featureIds.size,0);

const halfRegistry=JSON.parse(JSON.stringify(idx));const halfTopic=halfRegistry.topics.find(t=>t.id.startsWith('E20-T083-'));halfTopic.status='published';halfTopic.publication_review='approved';
const halfGate=gateFn({get:()=>null})(1900,halfRegistry);assert(!halfGate.eventIds.has('E20-PHOS-AGREE19'));assert(halfGate.eventIds.has('E20-T084-IND68'));assert.equal([...events.keys()].filter(id=>halfGate.eventIds.has(id)).length,18);assert.equal([...points.keys()].filter(id=>halfGate.featureIds.has(id)).length,7);
