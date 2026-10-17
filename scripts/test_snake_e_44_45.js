#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),j=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),t=p=>fs.readFileSync(path.join(root,p),'utf8');
const a=j('data/atlas-1590-1599.json'),s=j('data/stories/index.json').stories,h=t('index.html'),css=t('css/dark-atlas-v2.css');
assert.equal(a.events.length,55);assert.equal(a.sources.length,87);assert.equal(a.routes.length,4);assert.equal(a.colonial_polygons.length,0);
const src=new Set(a.sources.map(x=>x.id));
for(const id of ["BRA1591-CAVENDISH-ILHA-GRANDE-LOOT","BRA1592-CAVENDISH-VITORIA-REPELLED","BRA1592-CAVENDISH-SANTOS-REPELLED","PAC1594-HAWKINS-ATACAMES-DEFEAT","CAR1595-RIOHACHA-PEARLS-CAPTIVES","CAR1595-SANTA-MARTA-BURNING","CAR1595-NOMBRE-DE-DIOS-RANSACK","CAR1596-NOMBRE-DE-DIOS-FIRE"]){
 const e=a.events.find(x=>x.id===id);assert(e,id);
 assert(e.source_ids.length&&e.source_ids.every(x=>src.has(x)));
 assert.equal(e.colonial_profit,null);assert.equal(e.actual_English_land_area_sqkm,null);assert.equal(e.actual_English_territory_created,false);
}
for(const r of a.routes){assert.equal(r.route_kind,'documented-endpoints-connection');assert.equal(r.real_historical_track,false);assert(r.coords.every(p=>p.length===2&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180));}
for(const slug of ["brazil-coast-raids-trade-conflict-1591-1595","hawkins-drake-final-pacific-caribbean-1594-1596"]){
 const meta=s.find(x=>x.id===slug);assert(meta&&meta.status==='published');
 const story=j(meta.file);assert(story.sections.length>=8&&story.sections.flatMap(x=>x.paragraphs).join('').length>=3000);
}
assert.equal((h.match(/id="mapLayerSwitch"/g)||[]).length,1);
assert(h.indexOf('id="mapLayerSwitch"')<h.indexOf('<main class="map-stage"'));
assert(!h.includes('yearArrivalMapCount')&&!h.includes('项目仓库 ↗'));
assert(css.includes('.masthead > #mapLayerSwitch')&&css.includes('.map-stage > .map-top > .map-year-card'));
console.log('PASS SnakeE 44/45 historical events, citations, route classification and approved compact layout');
