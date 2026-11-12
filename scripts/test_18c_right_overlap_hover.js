#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const j=p=>JSON.parse(read(p));
const regions=[
 'data/eighteenth-century-mass-schematic-zones-1700-1799.json',
 'data/eighteenth-century-expansion-batch36-1700-1799.json',
 ...['africa','india-ocean','caribbean'].map(s=>'data/eighteenth-century-b37-'+s+'.json'),
 ...['south-campaign','hudson-company','india-mysore'].map(s=>'data/eighteenth-century-b38-'+s+'.json'),
 ...['caribbean-1759-1763','gold-coast-forts','gulf-surat-factories'].map(s=>'data/eighteenth-century-b39-'+s+'.json')
];
const data=regions.map(j),old34=j('data/eighteenth-century-dynamic-spatial-1700-1799.json');
const zones=data.flatMap(x=>x.zones),sites=data.flatMap(x=>x.sites);
assert.equal(regions.length,11);
assert.equal(zones.length,605);assert.equal(sites.length,406);
assert.equal(old34.area_references.length,24);assert.equal(old34.control_sites.length,15);
assert.equal(zones.length+old34.area_references.length,629);
assert.equal(sites.length+old34.control_sites.length,421);
const active=(x,y)=>x.periods.some(p=>p.start_year<=y&&y<=p.end_year);
const bboxPoint=(b,lng,lat)=>lng>=b[0]&&lng<=b[2]&&lat>=b[1]&&lat<=b[3];
const havana=zones.filter(x=>active(x,1762)&&bboxPoint(x.bbox,-82.36,23.14));
assert(havana.length>=4,'1762 Havana test point should intersect >=4 independent source rectangles');
assert(havana.some(x=>x.title.includes('Havana')),JSON.stringify(havana.slice(0,4).map(x=>x.title)));
const year1799=zones.filter(x=>active(x,1799));
assert(year1799.length>=250,'expect heavily overlapping archive for later periods');
assert(zones.every(x=>x.uncertain_line_dashed===true&&x.area_sqkm===null),'original geographic uncertainty preserved');
const js=read('js/eighteenth-overlap-right-dossier.js'),css=read('css/eighteenth-overlap-right-dossier.css');
const html=read('index.html'),app=read('app.js');
assert(js.includes("get('review18c')!=='1'"),'only 18C study map can intercept');
assert(!js.includes('reader18c'), 'no separate reader mode');
assert(!html.includes('eighteenth-reader-overlap-pilot.js')&&!html.includes('reader18c=1'));
assert(js.includes("map.getContainer().addEventListener('click',captureMapClick,true)"));
assert(js.includes('map.mouseEventToLatLng(e)'));
assert(js.includes('function polygonInside('));
assert(js.includes("function showCollection")===false);
assert(js.includes("area_sqkm")&&js.includes("areas.length!==629||sites.length!==421"));
assert(js.includes("for(const zone of data.zones"));
assert(js.includes("for(const site of data.sites"));
assert(js.includes("map.createPane(glowPane)"));
assert(js.includes("style.pointerEvents='none'"));
assert(js.includes("function glow(record)"));
assert(js.includes("geometryLayer(record,base).addTo(glowGroup)"));
assert(js.includes("card.addEventListener('pointerenter',()=>glow(record))"));
assert(js.includes("card.addEventListener('focusin',()=>glow(record))"));
assert(js.includes("button.addEventListener('click'"));
assert(js.includes("source_urls")&&js.includes("历史文献与来源"));
assert(js.includes("host.openPanel('dossier')"),'right panel reused');
assert(!js.includes("host.openPanel('sidebar')"),'left panel should remain uninvolved');
assert(js.includes("selectedCount:activeRecords.length,selected,focused"));
assert(css.includes('.atlas-18c-overlap-card:hover'));
assert(css.includes('.atlas-18c-overlap-glow{'));
assert(css.includes('drop-shadow'));
assert(html.includes('css/eighteenth-overlap-right-dossier.css'));
assert(html.includes('js/eighteenth-overlap-right-dossier.js'));
assert.equal((app.match(/window\.eighteenthOverlapDossier\?\.render\?\.\(\);/g)||[]).length,4);
const afterRefs=old34.area_references.filter(x=>!x.source_urls.length);
assert.equal(afterRefs.length,0);
console.log('PASS 18c UX: original 629 schematic zone records and 421 dated point records intact; 1762 Havana >=4 overlapping zones, right dossier, pointer-hover glow and concise source descriptions, no obsolete reader mode.');
