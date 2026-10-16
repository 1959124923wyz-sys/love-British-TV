#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=x=>fs.readFileSync(path.join(root,x),'utf8');
const data=JSON.parse(read('data/drake-circumnavigation-1577-1580.json'));
const geometry=require('../js/voyage-geometry.js');
const chapter9=JSON.parse(read('data/atlas-1570-1579.json'));
const chapter10=JSON.parse(read('data/atlas-1580-1589.json'));
const app=read('app.js'),html=read('index.html');
new vm.Script(app,{filename:'app.js'});
new vm.Script(read('js/voyage-geometry.js'),{filename:'js/voyage-geometry.js'});
assert.equal(data.voyage_id,'drake-circumnavigation-1577-1580');
assert.deepEqual([data.begin_year,data.end_year],[1577,1580]);
assert.equal(data.routes.length,14);
const used=new Set();
const sources=new Set([...chapter9.sources,...chapter10.sources].map(s=>s.id));
for(let i=0;i<data.routes.length;i++){
 const r=data.routes[i];
 assert.ok(!used.has(r.id),'duplicate route ID');used.add(r.id);
 assert.equal(r.segment_order,i+1);
 assert.ok([1578,1579,1580].includes(r.year),'no post-1580 route or implied 1577 Cape Verde arrival');
 assert.equal(r.certainty,'schematic-only-not-historical-track');
 assert.equal(r.verified_English_territorial_control,false);
 assert.equal(r.actual_area_sqkm,null);
 assert.equal(r.schematic_render_interpolation,true);
 assert.equal(r.route_kind,'schematic-privateering-voyage');
 assert.ok(r.source_ids?.length&&r.source_ids.every(id=>sources.has(id)),'cross-chapter source missing '+r.id);
 assert.ok(r.coords.every(([lat,lon])=>Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180));
 if(i)assert.deepEqual(data.routes[i-1].coords.at(-1),r.coords[0],'broken historical waypoint '+r.id);
 assert.ok(!/GPS(?!.*不是)/.test(r.note)||r.certainty.includes('not-historical-track'));
}
const visible=yr=>data.routes.filter(x=>x.year<=yr && yr>=data.begin_year&&yr<=data.end_year);
assert.deepEqual([visible(1577).length,visible(1578).length,visible(1579).length,visible(1580).length,visible(1581).length],[0,7,11,14,0]);
assert.deepEqual(visible(1579).at(-1).coords.at(-1),data.waypoints.ternate.coord,'1579 must terminate in Ternate');
assert.deepEqual(visible(1580).at(-1).coords.at(-1),data.waypoints.plymouth.coord,'return only after 1580');
const trans=data.routes.find(r=>r.crosses_antimeridian);
assert.ok(trans&&trans.year===1579&&trans.coords.length===3);
assert.deepEqual(trans.coords[1],data.waypoints.philippines.coord,'Philippines orientation in 1579 crossing, not an exact landfall');
const u=geometry.unwrapCoordinates(trans.coords);
assert.ok(u[0][1]>-180&&u[1][1]<-180,'Pacific route must continue west beyond -180, not travel across Africa');
for(let i=1;i<u.length;i++)assert.ok(Math.abs(u[i][1]-u[i-1][1])<=180,'longitude unwrapping failed');
const segments=geometry.routeGeometryForWorldWrap(trans);
assert.equal(segments.length,3,'render other world copies for map panning across the Pacific');
for(let k=0;k<segments.length;k++){
 const line=segments[k],offset=geometry.copiedWorldOffsets[k];
 assert.ok(line.length>3,'the trans-Pacific line needs smooth rendering waypoints');
 assert.ok(line.every(([lat,lon])=>Number.isFinite(lat)&&Number.isFinite(lon)),'coordinate finite');
 assert.ok(Math.abs(line[0][1]-(u[0][1]+offset))<1e-9);
 assert.ok(Math.abs(line.at(-1)[1]-(u.at(-1)[1]+offset))<1e-9);
 for(let j=1;j<line.length;j++)assert.ok(Math.abs(line[j][1]-line[j-1][1])<=8.00001,'world map chord or invalid interpolated gap');
}
const ordinary=data.routes.find(x=>x.id==='drake-1578-mocha-valparaiso');
assert.strictEqual(geometry.routeGeometryForWorldWrap(ordinary),ordinary.coords,'non-seam routes must preserve original chart coordinates');
assert.deepEqual(data.duplicate_old_route_ids.slice().sort(),[
 'ch9-Drake-1578-Mocha-Valparaiso','ch9-Drake-1578-Valparaiso-LaSerena',
 'ch9-Drake-1579-Callao-California','ch9-Drake-1579-California-Ternate'
].sort());
for(const id of data.duplicate_old_route_ids)assert.ok(chapter9.routes.some(r=>r.id===id),'old route not present '+id);
assert.ok(app.includes('drakeCircumnavigation.duplicate_old_route_ids.includes(r.id)'),'duplicate historical route strokes not suppressed');
assert.ok(app.includes('window.AtlasVoyageGeometry.routeGeometryForWorldWrap(r)'),'new antimeridian rendering not active');
assert.ok(app.includes('year>=1577&&year<=1580'),'the voyage must persist across decade but stop after its end');
assert.ok(app.includes("fetch('data/drake-circumnavigation-1577-1580.json'"),'patch file not loaded');
assert.ok(html.includes('js/voyage-geometry.js?v=drake-dateline-v1'),'geometry helper not loaded before app');
assert.ok(html.indexOf('js/voyage-geometry.js')<html.indexOf('src="app.js'),'script order wrong');
assert.equal(chapter9.routes.length,20,'original ninth-period incident/routes must remain intact');
assert.equal(chapter10.routes.length,6,'do not overwrite separate Drake 1585 Caribbean expedition or chapter10');
console.log('PASS: Drake 14 schematic voyage legs, all joins continuous, 1579 Pacific wrapped + 1580-only return, no fabricated stop/GPS/territory, earlier incidents preserved');
