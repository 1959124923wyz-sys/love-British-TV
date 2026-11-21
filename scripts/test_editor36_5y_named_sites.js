#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const J=p=>JSON.parse(read(p));
const g=J('data/eighteenth-century-b39-gulf-surat-factories.json');
const i=J('data/eighteenth-century-b37-india-ocean.json');
const d=J('data/eighteenth-century-editor36-5y-named-sites.json');
const js=read('js/eighteenth-batch39-spatial.js'),html=read('index.html');
assert.equal(d.schema,'atlas-18c-editor36-5y-named-sites-v1');
assert.equal(d.sites.length,25);
assert.equal(new Set(d.sites.map(x=>x.id)).size,25);
assert.equal(d.retired_zone_ids.length,57);
assert.equal(new Set(d.retired_zone_ids).size,57);
const old=[...g.zones,...i.zones], sites=[...g.sites,...i.sites],newById=new Map(d.sites.map(x=>[x.id,x]));
const replaced=old.filter(x=>newById.has(x.superseded_by));
assert.equal(replaced.length,57);
assert.equal(replaced.filter(x=>x.id.startsWith('B39-G-')).length,36);
assert.equal(replaced.filter(x=>x.id.startsWith('B37-I-')).length,21);
assert.deepEqual(new Set(replaced.map(x=>x.id)),new Set(d.retired_zone_ids));
for(const o of replaced){const n=newById.get(o.superseded_by);assert(n.records.some(r=>r.legacy_id===o.id&&r.title===o.title),'archive provenance lost: '+o.id);assert.equal(o.area_sqkm,null);assert(o.bbox&&o.source_urls.length);assert(o.cartography_handoff);}
for(const p of sites){if(d.retired_zone_ids.includes(p.linked_zone_id))assert(newById.has(p.superseded_by),p.id);}
for(const x of d.sites){
 assert(x.id.startsWith('EDITOR36_5Y_')&&x.title&&x.records.length&&x.source_urls.every(s=>s.startsWith('https://')),x.id);
 assert(x.historical_locality_anchor&&x.territorial_control_verified===false&&x.area_sqkm===null&&!x.geometry,x.id);
 assert.equal(x.coordinate_basis,'modern_named_locality_anchor_not_historical_building_survey');
 assert(!('location_uncertainty_km' in x),'invented metric');
 assert(x.coordinates.length===2&&x.coordinates.every(Number.isFinite)&&Math.abs(x.coordinates[0])<=180&&Math.abs(x.coordinates[1])<=90,x.id);
 for(const p of x.periods)assert(p.start_year>=1700&&p.end_year<=1799&&p.start_year<=p.end_year,x.id);
}
const site=id=>newById.get('EDITOR36_5Y_'+id);
assert.deepEqual(site('BUSHIRE').periods,[{start_year:1763,end_year:1768},{start_year:1775,end_year:1799}]);
assert.deepEqual(site('KUWAIT').periods,[{start_year:1793,end_year:1795}]);
assert.deepEqual(site('BASRA').periods,[{start_year:1703,end_year:1792},{start_year:1795,end_year:1799}]);
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
assert.equal(active(site('BUSHIRE'),1770),false);
assert.equal(active(site('BASRA'),1794),false);
assert.equal(active(site('KUWAIT'),1794),true);
assert.equal(active(site('KUWAIT'),1799),false);
const retired1799=replaced.filter(z=>active(z,1799));
assert.equal(retired1799.length,26);
assert(js.includes('eighteenth-century-editor36-5y-named-sites.json'));
assert(js.includes('points.length!==108'));
assert(js.includes('newNamedSites=named.sites'));
assert(html.includes('editor36-5y-20261121'));
console.log('PASS 5Y: 57 former rectangles archived; 25 sourced locality anchors with original individual records, historic trade-factory chronology and no invented polygon');
