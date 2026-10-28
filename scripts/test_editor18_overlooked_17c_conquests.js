'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const idx=read('data/stories/serial/index.json');
const stories=[
['E6-T01','data/stories/serial/e6-t01-ulster-plantation-1603-1641.json',10,7,7],
['E6-T16-SURINAME','data/stories/serial/e6-t16-suriname-1650-1667.json',11,8,6],
['E6-T16-PROVIDENCE','data/stories/serial/e6-t16-providence-island-1630-1641.json',10,9,3],
['E6-T17-AFRICAN-FORTS','data/stories/serial/e6-t17-cape-coast-tangier-1653-1684.json',12,13,6]
];
const events=new Map();let allColonialPolys=0;
for(let year=1600;year<=1690;year+=10){let a=read('data/atlas-'+year+'-'+(year+9)+'.json');let ss=new Set(a.sources.map(s=>s.id));assert.equal(ss.size,a.sources.length,'duplicate archive source IDs');for(let i=1;i<a.events.length;i++)assert(a.events[i].year>=a.events[i-1].year,'timeline must be annually ordered');for(const e of a.events){assert(!events.has(e.id),'duplicate Atlas IDs '+e.id);events.set(e.id,e);for(const key of e.source_ids||[])assert(ss.has(key),'unregistered source '+e.id+' '+key);}allColonialPolys+=a.colonial_polygons?.length||0;}
assert.equal(allColonialPolys,0,'17C land-colonial polygons require surveyed historical ownership evidence; none approved');
let totalchapters=0,sources=0;
for(const [id,fn,nchap,nsrc,links] of stories){
const a=read(fn),t=idx.topics.find(x=>x.id===id);
assert(t&&t.status==='published'&&t.publication_review==='approved');assert.equal(a.schema,'atlas-major-story-v1');assert.equal(a.id,id);assert.equal(t.article_file,fn);assert.equal(a.sections.length,nchap);assert.equal(a.sources.length,nsrc);assert.equal(t.event_ids.length,links);
assert(a.lead.length>=120);assert(a.sections.flatMap(s=>s.paragraphs).join('').length>=3000);
const sk=new Set(a.sources.map(s=>s.id)),mapped=new Set;
assert.equal(sk.size,nsrc);
for(const sec of a.sections){assert(sec.period_start_year>=a.start_year&&sec.period_end_year<=a.end_year);assert(sec.paragraphs.length>=3);for(const key of sec.source_keys)assert(sk.has(key));
for(const p of sec.paragraphs){assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(p));for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]]+)\]\]/g)){assert(events.has(m[1]),'missing event '+m[1]);assert(m[2].length>=4);mapped.add(m[1]);}}}
for(const eid of t.event_ids)assert(mapped.has(eid),'registered article event not clickable '+id+' '+eid);
assert(a.topic_source_claims.length>=nchap);
for(const c of a.topic_source_claims)assert(c.publication_approval&&c.source_keys.every(k=>sk.has(k)));
totalchapters+=nchap;sources+=nsrc;
}
const expected=[
['1610S-E093',1610],['1610S-E094',1613],['1630S-E023',1630],['1630S-E024',1633],['1640S-E094',1641],
['1650S-E121',1650],['1660S-E126',1667],['1660S-E127',1668],['1660S-E123',1662],['1660S-E124',1665],['1660S-E125',1667],['1680S-E124',1680],['1680S-E125',1684]
];
for(const [id,year] of expected){const e=events.get(id);assert(e&&e.year===year,'expected new source-audited event '+id);assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng));assert(e.source_ids.length>=1);assert(/参考|现代地名/.test(e.geolocation_limit_zh));assert.strictEqual(e.historical_control_boundary_verified,false);assert.equal(e.actual_English_land_area_sqkm,null);assert.strictEqual(e.exclude_point_buffer_from_area_statistics,true);}
const cape=events.get('1660S-E124');assert(cape.certainty.includes('disagreement')||cape.certainty.includes('source_'));assert(cape.name.includes('1664')&&cape.name.includes('1665'));
const tangier=events.get('1680S-E125');assert(tangier.name.includes('撤离'));assert.equal(tangier.year,1684);
const sur=read('data/stories/serial/e6-t16-suriname-1650-1667.json');assert.equal(sur.end_year,1668);assert(sur.reading_note.includes('约50'));assert(sur.reading_note.includes('1668'));
const prov=read('data/stories/serial/e6-t16-providence-island-1630-1641.json');assert.equal(prov.end_year,1641);assert(prov.reading_note.includes('百慕大'));
const ul=read('data/stories/serial/e6-t01-ulster-plantation-1603-1641.json');assert(ul.reading_note.includes('五郡'));assert.equal(ul.end_year,1641);
const bas=read('data/research/editor18-seventeenth-century-ulster-suriname-providence-african-forts-evidence-20261026.json');
assert(bas.cases.find(c=>c.id==='SUR1650_PLANTATION').period_sugar_plantation_count_exact_year_unknown);
assert.equal(bas.cases.find(c=>c.id==='PRO1630_COLONY').initial_capital_pledged_gbp,3800);
assert.deepEqual(bas.cases.find(c=>c.id==='CAPE1664_1665_CAPTURE').year_dispute,[1664,1665]);
assert.equal(idx.topics.filter(x=>x.status==='published').length,24);
console.log('PASS Editor18: four new major colonial history articles / '+totalchapters+' chapters / '+sources+' distinct source slots / '+expected.length+' dated map events; 1664-65 dispute preserved, non-metric geographic points, all 24 published topics intact.');
