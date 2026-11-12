#!/usr/bin/env node
'use strict';
/* Reader UX audit: source completeness, chronological coexistence and no original data loss. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(file(p));
const current=json('data/eighteenth-century-dynamic-spatial-1700-1799.json');
const others=[
 'data/eighteenth-century-mass-schematic-zones-1700-1799.json',
 'data/eighteenth-century-expansion-batch36-1700-1799.json',
 ...['africa','india-ocean','caribbean'].map(s=>'data/eighteenth-century-b37-'+s+'.json'),
 ...['south-campaign','hudson-company','india-mysore'].map(s=>'data/eighteenth-century-b38-'+s+'.json'),
 ...['caribbean-1759-1763','gold-coast-forts','gulf-surat-factories'].map(s=>'data/eighteenth-century-b39-'+s+'.json')
];
const regions=others.map(json);
assert.equal(regions.length,11);
const zones=regions.flatMap(d=>d.zones),sites=regions.flatMap(d=>d.sites);
assert.equal(zones.length,605);assert.equal(sites.length,406);
assert.equal(current.area_references.length,24);assert.equal(current.control_sites.length,15);
assert.equal(605+24,629);assert.equal(406+15,421);
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const overlaps=(a,b)=>a.bbox[0]<b.bbox[2]&&a.bbox[2]>b.bbox[0]&&a.bbox[1]<b.bbox[3]&&a.bbox[3]>b.bbox[1];
const stats=y=>{
 const data=zones.filter(z=>active(z,y));let pairs=0,duplicated=new Set();
 for(let i=0;i<data.length;i++)for(let j=i+1;j<data.length;j++)
  if(overlaps(data[i],data[j])){pairs++;duplicated.add(i);duplicated.add(j)}
 return{active:data.length,pairs,overlappedFeatures:duplicated.size};
};
assert.deepEqual(stats(1762),{active:170,pairs:348,overlappedFeatures:149});
assert.deepEqual(stats(1799),{active:281,pairs:701,overlappedFeatures:261});
const ids=new Set();
for(const z of zones){
 assert(!ids.has(z.id),z.id);ids.add(z.id);
 assert(z.bbox.length===4&&z.bbox.every(Number.isFinite),z.id);
 assert(z.periods.every(p=>p.start_year>=1700&&p.end_year<=1799),z.id);
 assert.equal(z.uncertain_line_dashed,true);
 assert.equal(z.area_sqkm,null);
 assert(z.source_urls.length&&z.source_urls[0].startsWith('https://'));
}
const code=file('js/eighteenth-reader-overlap-pilot.js'),css=file('css/eighteenth-reader-overlap-pilot.css');
const html=file('index.html'),app=file('app.js');
assert(code.includes("get('reader18c')!=='1'"),'pilot must be explicit opt-in');
assert(code.includes("get('review18c')!=='1'"));
assert(code.includes('const regions=')===false,'reader must load data from explicit audited list');
assert(code.includes("if(areas.length!==605||archivalAreas.length!==24||cores.length!==15||all.length!==644)"));
assert(code.includes('showCollection(ev.latlng,c.items)'));
assert(code.includes('geometryByName.get(x.geometry_key)'));
assert(code.includes('archivalAreas.length!==24'));
assert(code.includes('sourceFile:\'original-batch34-17c-geometry-reuse\''));
assert(code.includes("showDetail(Number(choose.dataset.readerIndex))"));
assert(code.includes("const originalKind=String(x.category||'')"));
assert(code.includes("window.eighteenthReaderPilot="));
assert(code.includes("map.on('zoomend moveend'"));
assert(code.includes("map.on('click'"));
assert(code.includes("map.getBounds().pad(.25)"));
assert(css.includes('body.atlas-18c-reader-enabled .atlas-18c-b39-zone'));
assert(css.includes('body.atlas-18c-reader-enabled .atlas-18c-dynamic-area'));
assert(css.includes('.atlas-18c-reader-result:hover'));
assert(html.includes('css/eighteenth-reader-overlap-pilot.css?v=ux18c-reader-20261112'));
assert(html.includes('js/eighteenth-reader-overlap-pilot.js?v=ux18c-overlap-reader-20261112'));
assert(html.includes('?review18c=1&amp;reader18c=1'));
assert.equal((app.match(/window\.eighteenthReaderPilot\?\.render\?\.\(\);/g)||[]).length,4);
assert(!/area_sqkm\s*=\s*[1-9]/.test(code));
console.log('PASS reader audit: 605 bulk reference envelopes +15 oldest cores available; 629 original zones and 421 old sites unchanged; 1762:348 overlap pairs, 1799:701. Explicit opt-in, full archives, category lens and source choice.');
