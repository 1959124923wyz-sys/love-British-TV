#!/usr/bin/env node
'use strict';
// PR #10 intake preview gate. Structural and annual-data checks, not historical truth.
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const parse=p=>JSON.parse(read(p));
const app=read('app-continuity-1497-1529-preview.js');
const html=read('preview-continuity-1497-1529.html');
new vm.Script(app,{filename:'app-continuity-1497-1529-preview.js'});
assert.match(html,/id="chapterFour"/);
assert.match(html,/max="1529"/);
assert.match(html,/RESEARCH PREVIEW/);
assert.match(html,/app-continuity-1497-1529-preview\.js\?v=/);
for(const id of ['toggleTerritorialFootprints','togglePoliticalRelations','toggleHypotheses','showFullChapterArchive'])
 assert.ok(html.includes('id="'+id+'"'),'missing '+id);
assert.ok(app.includes("function occurredByYear(item,selectedYear)"),'use current reviewed chronology engine');
assert.ok(app.includes("!occurredByYear(e,year)"),'event pins must not reveal future years');
assert.ok(app.includes("fullArchive||occurredByYear(e,year)"),'sidebar must gate by year');
assert.ok(app.includes("if(!occurredByYear(r,year))continue;"),'voyage routes must be time gated');
assert.ok(app.includes('y>=1497&&y<=year'),'milestone future leak');
assert.ok(app.includes('(y-1497)/32*100'),'four-decade timeline positions');
assert.ok(app.includes("selectedItemYear>next"),'rewind future dossier bug');
assert.ok(!app.includes("workspace.classList.add('dossier-collapsed');syncPanels();}\n year=next"),'cross chapter closes dossier');
for(const file of [
 'research/continuity/staged/atlas-1520-1529.json',
 'research/continuity/staged/geography-hypotheses-1500-1529.geojson',
 'research/continuity/staged/french-urban-control-1497-1529.geojson',
 'research/continuity/staged/political-relations-1500-1529.geojson',
 'research/continuity/staged/territorial-footprints-1497-1529.geojson'
])assert.ok(app.includes(file),'preview missing '+file);
const fourth=parse('research/continuity/staged/atlas-1520-1529.json');
const previous=parse('data/atlas-1510-1519.json');
const control=parse('research/continuity/staged/french-urban-control-1497-1529.geojson');
const relations=parse('research/continuity/staged/political-relations-1500-1529.geojson');
const hypotheses=parse('research/continuity/staged/geography-hypotheses-1500-1529.geojson');
const footprints=parse('research/continuity/staged/territorial-footprints-1497-1529.geojson');
const timeline=parse('research/continuity/CONTROL_TIMELINE_1497_1529.json');
assert.equal(fourth.editorial_status,'CONTINUITY_INTEGRATION_STAGE_NOT_APPROVED_OR_PUBLISHED');
assert.deepEqual(fourth.period,{from:1520,to:1529,next:1530});
const sources=new Set(fourth.sources.map(s=>s.id));assert.equal(sources.size,fourth.sources.length);
for(const rec of [...fourth.events,...fourth.places]) {
 assert.ok(rec.source_ids?.length&&rec.source_ids.every(id=>sources.has(id)),rec.id+': missing sources');
 if(rec.year!=null) assert.ok(rec.year>=1520&&rec.year<=1529,rec.id+': invalid event year');
}
for(let y=1520;y<=1529;y++){
 const visible=fourth.events.filter(e=>e.year<=y);
 assert.ok(visible.every(e=>e.year<=y),'future item visible');
 assert.ok(visible.length<=fourth.events.length);
 const places=control.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year);
 assert.ok(places.some(f=>f.properties.source_place_id==='calais-crown'),y+': lost Calais');
 assert.ok(places.some(f=>f.properties.source_place_id==='guines-crown-1520s'),y+': lost existing Guines subsite');
 assert.ok(!places.some(f=>f.properties.source_place_id==='tournai-occupied-city-1513'),y+': Tournai still occupied');
 assert.equal(relations.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year).length,5,y+': historic relationships lost');
 assert.equal(footprints.features.filter(f=>f.properties.start_year<=y&&y<=f.properties.observed_through_year).length,7,y+': shoreline reference vanished');
}
assert.equal(timeline.year_end_snapshots.length,33);
assert.deepEqual(timeline.year_end_snapshots.map(s=>s.year),Array.from({length:33},(_,i)=>1497+i));
for(const feature of hypotheses.features) {
 const p=feature.properties;
 assert.equal(p.fill_authorized,false,'unverified region cannot become solid colonial territory');
 assert.ok(p.source_path && fs.existsSync(path.join(root,p.source_path)),'missing local archive: '+p.id);
 if(String(p.id).includes('TOURNAISIS')) assert.deepEqual(p.valid_years,[1513,1514,1515,1516,1517,1518]);
}
assert.ok(footprints.features.every(f=>f.properties.verified_1520s_historical_border===false &&
 f.properties.verified_area_sqkm===null),'modern reference shoreline misreported as surveyed 1520s territory');
assert.ok(previous.places.some(p=>p.id==='tournai-occupied-city-1513'));
console.log('PASS: unpublished PR10 preview runs approved 4-chapter chronology, carries 1520s political status and keeps all unverified boundaries distinct.');
