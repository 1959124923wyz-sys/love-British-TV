#!/usr/bin/env node
'use strict';
/* 1497–1699 reader-facing overlap promotion: immutable archive and atlas guards. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const a=read('app.js'),html=read('index.html'),logic=read('js/historic-overlap-dossier-1497-1699.js');
const old=read('js/eighteenth-overlap-right-dossier.js'),css=read('css/eighteenth-overlap-right-dossier.css');
const claims=json('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson');
const studies=json('data/seventeenth-century-regional-studies-1600-1699.geojson');
const evidence=json('data/seventeenth-century-spatial-evidence-1600-1699.geojson');
const early=json('data/territorial-footprints-1497-1519.geojson');
const late=json('data/territorial-footprints-1590-1599.geojson');
const war=json('data/century-violence-regions-1544-1589.geojson');
assert.equal(claims.features.length,53);
assert.equal(studies.features.length,32);
assert.equal(evidence.features.length,191);
assert.equal(early.features.length,7);assert.equal(late.features.length,7);
assert.equal(war.features.length,28);
assert(claims.features.every(f=>f.geometry?.type==='Polygon'&&f.properties.source_urls?.length&&f.properties.area_sqkm===null),'53 17C claim polygon source & area semantics');
assert(studies.features.filter(f=>f.geometry.type==='Polygon').every(f=>
 f.properties.source_urls?.length&&f.properties.historical_boundary_confirmed===false&&f.properties.area_sqkm===null));
assert(early.features.every(f=>f.properties.source_ids?.length||f.properties.source_urls?.length));
assert(war.features.every(f=>f.properties.source_urls?.length&&f.properties.area_sqkm===null));
assert(claims.features.find(f=>f.id==='claim-virginia-company-1609').properties.end_year===1624);
assert(!logic.includes("reader18c=1")&&!html.includes('reader18c=1'));
assert(logic.includes("const host=window.__historicOverlapHost"));
assert(a.includes("window.__historicOverlapHost={"));
assert(a.includes("sourceForId:id=>sourcesById.get(id)||null"));
assert(a.includes("visibleAreaFeatures:()=>"));
for(const group of ['territory','colonialClaims','seventeenthStudies','archaeologyReference','warVicinity','warReach',
 'contestedZones','earlyRegionalImpact','invasionImpact','tenthExtraction','nineYearsWar','atlanticContact',
 'eleventhAreas','hypotheses','enslavementBands'])
 assert(a.includes("'"+group+"'"),'missing active map layer '+group);
assert(!logic.includes('sourcesById.set('));
assert(logic.includes("getLayers()")===false,'should access Leaflet groups via the explicit host only');
assert(logic.includes("const inGeom=(g,lon,lat)=>"));
assert(logic.includes("g?.type==='MultiPolygon'"));
assert(logic.includes('map.getContainer().contains(e.target)'));
assert(logic.includes("document.addEventListener('click',capture,true)"));
assert(logic.includes("map.on('click',ev=>"));
assert(logic.includes("if(at(ev.latlng).length>1)"));
assert(logic.includes("el.addEventListener('pointerenter',()=>outline(rec))"));
assert(logic.includes("el.addEventListener('pointerleave',()=>outline(activeRecords.find"));
assert(logic.includes("el.addEventListener('focusin',()=>outline(rec))"));
assert(logic.includes("new MutationObserver"));
assert(logic.includes("host.openPanel('dossier')"));
assert(logic.includes("historical_source_urls")===false);
assert(logic.includes("ref?.url"));
assert(logic.includes("window.historicOverlapDossier="));
assert(logic.includes("1497&&host.getYear()<=1699"));
assert(css.includes(".atlas-18c-overlap-card")&&css.includes(".atlas-18c-overlap-glow"));
assert(html.includes('js/eighteenth-overlap-right-dossier.js'));
assert(html.includes('js/historic-overlap-dossier-1497-1699.js'));
assert(html.indexOf('js/historic-overlap-dossier-1497-1699.js')>html.indexOf('js/eighteenth-overlap-right-dossier.js'));
assert(a.includes("renderHistoricalRegionGuide();window.historicOverlapDossier?.render?.();"));
assert.equal((a.match(/window\.eighteenthOverlapDossier\?\.render\?\.\(\);/g)||[]).length,4);
const original=json('data/eighteenth-century-dynamic-spatial-1700-1799.json');
assert.equal(original.area_references.length,24);assert.equal(original.control_sites.length,15);
assert(old.includes("areas.length!==629||sites.length!==421"));
console.log('PASS cross-century UX source audit: 53 seventeenth-century charters, 32 regional studies, 191 source cues, 7+7 Tudor periods, 28 war study polygons; live layer adapter and original 18C 629/421 preserved.');
