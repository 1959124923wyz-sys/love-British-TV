#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),J=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const atlas=J('data/atlas-1560-1569.json'),index=J('data/stories/index.json').stories,regions=J('data/century-violence-regions-1544-1589.geojson');
const oldGarrisons=J('data/eighth-control-sites-1560-1569.geojson').features;
assert.equal(atlas.events.length,53);assert.equal(atlas.sources.length,41);assert.equal(atlas.routes.length,16);
assert.equal(index.length,18);
const events=new Map(atlas.events.map(e=>[e.id,e])),sources=new Set(atlas.sources.map(s=>s.id));
for(const [id,sy,ey,minimum] of [
 ['le-havre-english-occupation-french-siege-1562-1563',1562,1563,10],
 ['john-hawkins-three-atlantic-slaving-voyages-1562-1568',1562,1568,19]
]){
 const meta=index.find(s=>s.id===id);assert(meta,id);
 const story=J(meta.file),body=story.sections.flatMap(s=>s.paragraphs).join('');
 assert.equal(story.start_year,sy);assert.equal(story.end_year,ey);
 assert(story.sections.length>=10&&body.length>=3000, 'incomplete factual longform '+id);
 assert(story.lead.length>=120,'lead '+id);
 assert(story.related_event_ids.length>=minimum);
 assert.deepEqual(new Set(meta.event_ids),new Set(story.related_event_ids));
 const local=new Set(story.sources.map(s=>s.id));
 let links=0;
 for(const sec of story.sections){
  assert(sec.paragraphs.length>=3,'explain military/societal cause and result');
  assert(sec.source_keys.length>0&&sec.source_keys.every(id=>local.has(id)));
  for(const p of sec.paragraphs)for(const a of p.matchAll(/\[\[([A-Za-z0-9-]+)\|[^\]\n]+\]\]/g)){
   assert(meta.event_ids.includes(a[1]),'unregistered narrative map link '+a[1]);links++;
  }
 }
 assert(links>=12,'reader requires 12 accessible original map event links: '+id);
 for(const id of story.related_event_ids)assert(events.has(id),'historical event omitted '+id);
}
for(const id of ['LEH1562-HUGUENOTS-SEIZE','LEH1562-WARWICK-FORT','LEH1563-RESIDENTS-EXPEL','LEH1563-INGOUVILLE-FRENCH-CAMP','LEH1563-NOTREDAME-ARTILLERY','LEH1563-LEURE-CHURCH-DESTRUCTION','LEH1563-PLAGUE-GARRISON','LEH1563-JULY-SURRENDER','HW1563-ISABELLA-SLAVE-SALE','HW1563-PUERTO-PLATA-SALE','HW1563-MONTE-CRISTI-SALE','HW1565-CURACAO-PORT','HW1565-PADSTOW-RETURN','HW1568-DOMINICA-LANDFALL','HW1568-CARTAGENA-REFUSAL']){
 const e=events.get(id);assert(e&&e.source_ids.length>0&&e.source_ids.every(s=>sources.has(s)),id);
 assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng),id);
 assert.equal(e.colonial_profit,null);assert.equal(e.area_polygon_verified,false);
 assert.equal(e.actual_English_territory_created,false,'new auxiliary event is not an independent English land annexation');
}
assert.equal(events.get('1560S-E007').year,1562);
assert.equal(events.get('1560S-E009').year,1563);
assert.equal(oldGarrisons.length,2,'Original annual 1562 occupied and 1563 French restoration nodes must remain separate');
assert(oldGarrisons.some(f=>f.properties.controller_group==='english'&&f.properties.start_year===1562&&f.properties.end_year===1562));
assert(oldGarrisons.some(f=>f.properties.controller_group==='french'&&f.properties.start_year===1563&&f.properties.end_year===1569));
const x=regions.features.filter(f=>f.id.startsWith('fr-havre-156'));
assert.equal(x.length,2,'Separate year-specific local conflict envelopes');
assert.equal(regions.features.length,28);
for(const f of x){
 let p=f.properties;assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.fill_authorized,false);
 assert.equal(p.territorial_claim,false);assert.equal(p.area_sqkm,null);assert.equal(p.exclude_from_area_aggregation,true);
 assert(p.source_ids.every(s=>sources.has(s)));
 assert(p.related_event_ids.every(id=>events.has(id)));
 assert.deepEqual(f.geometry.coordinates[0][0],f.geometry.coordinates[0].at(-1));
}
const first=atlas.routes.find(x=>x.id==='ch8-1562-63-SIERRALEONE-HISPANIOLA');
assert.deepEqual(first.coords,[[8.49,-13.23],[19.884,-71.102],[19.796,-70.691],[19.848,-71.654]],
 'First slaving expedition has Hakluyt-attested three sale ports');
assert.equal(first.certainty,'schematic-only-not-historical-track');
assert(atlas.routes.every(r=>r.certainty==='schematic-only-not-historical-track'));
const ui=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert(ui.includes('readerFriendly(p)')&&!ui.includes('esc(article.map_note)'),'scholarly cartographic notes remain hidden from story text');
console.log('PASS story24/25: 2 source-led 3000+ Chinese histories, 15 sourced nodes, three slave-sale ports, 1562 English garrison and 1563 French recovery and 2 dashed non-territorial areas');
