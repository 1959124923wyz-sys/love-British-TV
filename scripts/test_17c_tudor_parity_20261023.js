'use strict';
// 2026-10-23 editor: compare all published 17C story contracts and research GIS
// with genuine 16C production patterns; never invent historical borders or events.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=load('data/stories/serial/index.json');
const topics=index.topics.filter(t=>t.status==='published');
assert.equal(topics.length,16,'audit exactly fifteen approved serial stories, not all 17C research topics');
const events=new Map();
for(let decade=1600;decade<=1690;decade+=10){
 const atlas=load('data/atlas-'+decade+'-'+(decade+9)+'.json');
 assert.deepEqual(atlas.colonial_polygons,[],'no unwarranted seventeenth-century sovereignty polygon');
 for(const e of atlas.events){assert(!events.has(e.id));events.set(e.id,e);}
}
for(const e of load('data/stories/serial/chronology-preview-1600-1699.json').events){
 assert(!events.has(e.id));events.set(e.id,e);
}
const rules={
 'E6-T03-LAND-1642-1698':29,
 'E6-T04-GLENCOE':9,
 'E6-T07-BARBADOS':15,
 'E6-T12':24,
 'E6-T13':15,
 'E6-T06':33,
 'E6-T05':36,
 'E6-T08':21,
 'E6-T09-NY':17,
 'E6-T09-CAR':25,
 'E6-T10-HBC':19,
 'E6-T10-ACADIA':21,
 'E6-T10-NEWFOUNDLAND':16,
 'E6-T14-NAV':24,
 'E6-T04-DARIEN':15,
 'E6-T11-VOYAGES':18
};
let total=0;
for(const meta of topics){
 assert.equal(meta.publication_review,'approved');
 const d=load(meta.article_file);
 assert.equal(d.id,meta.id);
 const keys=new Set(d.sources.map(x=>x.id));
 assert.equal(keys.size,d.sources.length);
 const numeral=/^[一二三四五六七八九十]+、/;
 const hits=[];
 for(const s of d.sections){
  assert(numeral.test(s.heading),'Tudor-style numbered historical chapter missing: '+meta.id+' '+s.id);
  assert(s.source_keys.length>0&&s.source_keys.every(key=>keys.has(key)),'source provenance missing');
  for(const p of s.paragraphs){
   assert(!/<script|on(click|mouseover)\s*=/i.test(p),'story JSON must not embed executable markup');
   for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g)){
    const ev=events.get(m[1]);
    assert(ev,'orphaned link: '+m[1]);
    assert(Number.isInteger(ev.year)&&Number.isFinite(ev.lat)&&Number.isFinite(ev.lng),'linked item cannot pan map: '+m[1]);
    const anchor=m[2].trim();
    // 16C published example: a linked phrase names an action, not a bare date.
    // Keep year outside the link in surrounding prose where appropriate.
    assert(!/^(?:1[5-9]\d{2})(?:年(?:\d{1,2}月(?:\d{1,2}日)?)?)?$/.test(anchor),
      'bare year is not a popular-history event link: '+meta.id+'/'+s.id+' '+anchor);
    assert(!/^(?:1[5-9]\d{2})$/.test(anchor),'numeric-only historical link: '+meta.id+' '+anchor);
    assert(anchor.length>=4,'click target has no reader-facing historical meaning: '+meta.id+' '+anchor);
    hits.push(m[1]);
   }
   assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length,'broken inline token');
  }
 }
 assert(hits.length>=rules[meta.id],meta.id+' expected mapped paragraphs regressed');
 total+=hits.length;
}
const ir=load('data/stories/serial/e6-t03-ireland-land-1642-1698.json');
assert(ir.sections.find(s=>s.id==='conquest-1649').paragraphs.join(' ').includes('[[1650S-E013|戈尔韦遭封锁后投降]]'));
const gl=load('data/stories/serial/e6-t04-glencoe.json');
assert(gl.sections.find(s=>s.id==='succession').paragraphs.join(' ').includes('[[E6-GLENCOE-1692|'));
const bar=load('data/stories/serial/e6-t07-barbados.json');
const prop=bar.sections.find(s=>s.id==='property-1668-1672');
assert(prop&&prop.source_keys.length===2&&prop.paragraphs.some(p=>p.includes('[[1660S-E038|')));
assert(prop.paragraphs.some(p=>p.includes('[[1670S-E006|')));
assert(bar.sources.some(s=>s.url==='https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1668'));
assert(bar.sources.some(s=>s.url==='https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1672'));
assert(bar.topic_source_claims.some(c=>c.section_id==='property-1668-1672'&&c.original_document_page));
const bg=index.topics.find(t=>t.id==='E6-T07-BARBADOS');
assert(bg.event_ids.includes('1660S-E038'),'new chapter must open from 1668 public map event');
const eic=load('data/stories/serial/e6-t12-east-india-company.json');
assert(eic.sections.find(s=>s.id==='corporate-power').paragraphs.join(' ').includes('[[1670S-E064|'));
const rac=load('data/stories/serial/e6-t13-royal-african-company.json');
assert(!index.topics.find(t=>t.id==='E6-T13').event_ids.includes('1690S-E024'),'Hannibal must not become RAC-owned');
assert(rac.sections.find(x=>x.id==='royal-capital').paragraphs.join(' ').includes('[[1670S-E008|约克公爵要求'),
  '1672 Royal Exchange prepayment must link its real event, not incorrectly label it as generic London fundraising');
assert(eic.sections.find(x=>x.id==='mughal-war').paragraphs.join(' ').includes('[[1680S-E035|莫卧儿方面夺取'),
  '1689 link must identify a historical action rather than the year');
assert(bar.sections.find(x=>x.id==='settlement').paragraphs.join(' ').includes('[[1620S-E018|英格兰定居者'),
  '1627 should link the settlement act instead of just the year');

const area=load('data/seventeenth-century-regional-studies-1600-1699.geojson');
const site=load('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
assert.equal(area.metadata.feature_count,area.features.length);
assert.equal(site.metadata.feature_count,site.features.length);
assert.equal(area.features.length,32);
assert.equal(site.features.length,188);
const horn=area.features.filter(f=>f.properties.related_event_ids.includes('1620S-E009')||f.properties.related_event_ids.includes('1620S-E010'));
assert.equal(horn.length,2);
assert(horn.every(f=>f.properties.related_story_ids.includes('E6-T12')&&!f.properties.related_story_ids.includes('E6-T03-LAND-1642-1698')),'Safavid/EIC 1622 conflict misattributed to Ireland');
assert(!area.features.some(f=>f.geometry.type==='Polygon'&&f.properties.name.includes('孟加拉胡格利—卡西姆巴扎尔')),'two trade posts cannot imply affected geographical polygon');
assert(area.features.some(f=>f.geometry.type==='LineString'&&f.properties.name.includes('1658年胡格利')),'evidenced commercial connection must remain');
const ids=new Set();
for(const f of [...area.features,...site.features]){
 assert(!ids.has(f.id),'duplicate 17C study/point id');ids.add(f.id);
 const p=f.properties;
 assert.equal(p.historical_boundary_confirmed,false);
 assert.equal(p.territorial_claim,false);
 assert.equal(p.fill_authorized,false);
 assert.equal(p.area_sqkm,null);
 assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.source_urls?.length>0&&p.source_urls.every(u=>u.startsWith('https://')));
 for(const id of p.related_event_ids||[])assert(events.has(id),'map study references unknown event '+id);
}
const named={
 '17c-glen-fort-william-oath-1692':'1690S-E049',
 '17c-glen-inveraray-oath-1692':'1690S-E050',
 '17c-glen-massacre-site-1692':'E6-GLENCOE-1692',
 '17c-glen-edinburgh-parliament-1695':'1690S-E027'
};
for(const [id,eid] of Object.entries(named)){
 const f=site.features.find(f=>f.id===id),e=events.get(eid);
 assert(f&&e);
 assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat],'published atlas landmark coordinate must be copied, not guessed: '+id);
 assert(f.properties.related_story_ids.includes('E6-T04-GLENCOE'));
 assert.equal(f.properties.display_through_year,e.year);
}
const b=site.features.find(f=>f.id==='17c-barbados-slavery-legislation-1661-1692');
assert(b&&b.properties.episodes.length===6);
for(const [yr,ids] of [[1661,['1660S-E006']],[1668,['1660S-E038']],[1672,['1670S-E006']],[1676,['1670S-E024']],[1688,[]],[1692,['1690S-E016']]]){
 const active=b.properties.episodes.filter(x=>x.start_year<=yr&&yr<=x.end_year);
 assert.equal(active.length,1,'episode-year interpolation detected: '+yr);
 assert(ids.every(x=>active[0].related_event_ids.includes(x)));
}
for(const yr of [1662,1669,1673,1677,1687,1689,1691])
 assert(!b.properties.episodes.some(e=>e.start_year<=yr&&yr<=e.end_year),'historical statute cue leaked to unsupported year '+yr);
assert.equal(b.geometry.type,'Point');
assert.equal(b.properties.episodes.find(e=>e.start_year===1688).related_event_ids.length,0,'source-only 1688 law cannot link to nonexistent map event');
assert.equal(b.properties.episodes.find(e=>e.start_year===1688).source_only,true,'only explicit archival-source episodes can lack a published atlas event');
assert(fs.readFileSync(path.join(root,'app.js'),'utf8').includes('e.source_only!==true'),'source-only event gate must not reject entire 17C decades');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(app.includes('...serialPreviewByDecade.values()'));
assert(app.includes('map.panTo(position,{animate:true'));
assert(reader.includes('function renderInline(text)'));
assert(reader.includes('function doubleOpen(item)'));
assert(reader.includes('function returnToOrigin()'));
console.log('PASS 17C Tudor parity:',topics.length,'published stories,',total,'real map links; GIS research areas',area.features.length,'and',site.features.length,'cues; source-only 1688 law and pre-1707 Scottish polity protected');
