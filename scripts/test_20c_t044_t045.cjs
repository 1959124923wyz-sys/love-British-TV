'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const idx=load('data/stories/serial/index.json'),t=idx.topics.find(x=>x.id==='E20-T044-KENYA-LAND-1900-1963'),a=load(t.article_file),h=load('data/stories/serial/e20-hola-kenya-1950-1959.json');
const events=new Map(),maps=new Map();
for(let y=1900;y<=1960;y+=10){const d=y+'-'+(y+9),c=load('data/stories/serial/chronology-'+d+'.json'),keys=new Set(c.sources.map(s=>s.id));for(const e of c.events){assert(!events.has(e.id),e.id);events.set(e.id,e);if(e.id.startsWith('E20-T044-'))assert(e.source_ids.every(k=>keys.has(k)),e.id);}if(y===1910||y===1920){const g=load('data/twentieth-century-spatial-'+d+'.geojson');for(const f of g.features.filter(f=>f.id.startsWith('kenya-t044-')))maps.set(f.properties.related_event_ids[0],f);}}
const keys=new Set(a.sources.map(s=>s.id)),body=a.sections.flatMap(s=>s.paragraphs).join(''),links=[...new Set([...body.matchAll(/\[\[([A-Z0-9-]+)\|/g)].map(x=>x[1]))];
assert.equal(a.sections.length,10);assert.equal(keys.size,30);assert.equal(links.length,21);assert.deepEqual(links,t.event_ids);assert(a.lead.length>=120);assert(a.sections.every(s=>s.paragraphs.length>=2&&s.source_keys.every(k=>keys.has(k))));
for(const id of links){const e=events.get(id);assert(e,id);if(id.startsWith('E20-T044-')){assert(e.source_ids.every(k=>keys.has(k)));assert.equal(e.fill_authorized,false);assert.equal(e.area_sqkm,null);if(e.lat!==null){const f=maps.get(id);assert(f,id);assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.geometry.type,'Point');assert.equal(f.properties.territorial_claim,false);assert.equal(f.properties.exclude_from_area_aggregation,true);assert.equal(f.properties.area_sqkm,null);}}}
assert.equal([...events.keys()].filter(k=>k.startsWith('E20-T044-')).length,14);assert.equal(maps.size,4);assert.equal(events.get('E20-T044-KAIM12').year,1912);assert.equal(events.get('E20-T044-KER19').year,1919);assert.equal(events.get('E20-T044-NGONG22').year,1922);assert.equal(events.get('E20-T044-SET62').year,1962);
assert.equal(idx.topics.filter(x=>x.id==='E20-KEN-HOLA').length,1);assert(h.sources.filter(s=>s.id.startsWith('E20-T045-SRC-')).length===4);assert.equal(h.sections.length,13);
if(t.status==='published')assert.equal(t.publication_review,'approved');
console.log('PASS T044/T045: 14 new events, 21 distinct story links, four localities, retained Hola topic.');

assert.equal(t.review_entry_required,true);
assert.deepEqual([...t.review_event_ids].sort(),[...events.keys()].filter(id=>id.startsWith('E20-T044-')).sort());
assert.deepEqual([...t.review_feature_ids].sort(),[...maps.values()].map(f=>f.id).sort());
assert.equal(idx.topics.find(x=>x.id==='E20-KEN-HOLA').review_entry_required,true);
assert(!t.review_event_ids.some(id=>!id.startsWith('E20-T044-')));

const gateApp=fs.readFileSync('app.js','utf8');
const gateSource=gateApp.slice(gateApp.indexOf('function modern20cReviewGate('),gateApp.indexOf('async function fetchModernAtlas('));
const gateFn=new Function('reviewParams',gateSource+'\nreturn modern20cReviewGate;');
const gatePublic=gateFn({get:()=>null})(1900,idx),gatePreview=gateFn({get:()=>'1'})(1900,idx);
assert(t.review_event_ids.every(id=>gatePublic.eventIds.has(id)));assert(t.review_feature_ids.every(id=>gatePublic.featureIds.has(id)));
assert.equal(gatePreview.eventIds.size,0);assert.equal(gatePreview.featureIds.size,0);
assert.equal(gateFn({get:()=>null})(1800,null).eventIds.size,0);
const approvedRegistry=JSON.parse(JSON.stringify(idx));for(const t of approvedRegistry.topics)if(t.review_entry_required){t.status='published';t.publication_review='approved';}
assert.equal(gateFn({get:()=>null})(1900,approvedRegistry).eventIds.size,0);
assert.equal(gateFn({get:()=>null})(1900,approvedRegistry).featureIds.size,0);
