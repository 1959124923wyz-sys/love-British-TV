'use strict';
// Maximal historical CHARITABLE DOCUMENTARY CLAIMS, NOT historic military control areas.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fc=json('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson');
assert.equal(fc.type,'FeatureCollection');assert.equal(fc.metadata.schema,'atlas-17c-expansive-claim-v1');
assert(fc.features.length>=53,'all previous 39 envelopes plus fourteen phase-five archival locations must remain');
assert.equal(fc.metadata.feature_count,fc.features.length,'metadata count must equal actual features');
const ids=new Set(),allowed=new Set(['charter','company','island','conquest','administrative']);
for(let f of fc.features){const p=f.properties;assert(f.id&&!ids.has(f.id));ids.add(f.id);
assert.equal(f.geometry.type,'Polygon');assert.equal(f.geometry.coordinates.length,1);
const ring=f.geometry.coordinates[0];assert(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1));
for(let k=1;k<ring.length;k++)assert.notDeepEqual(ring[k],ring[k-1],f.id+' must not contain zero-length edges');
for(const v of ring){assert(v.length===2&&v.every(Number.isFinite));assert(Math.abs(v[0])<=180&&Math.abs(v[1])<=90);}
assert(allowed.has(p.display_class));assert(p.start_year>=1600&&p.end_year<=1699&&p.end_year>=p.start_year);
assert.equal(p.historical_boundary_confirmed,false);assert.equal(p.boundary_verified,false);
assert.equal(p.fill_authorized,false);assert.equal(p.territorial_claim,false);assert.equal(p.expansive_claim_overlay_only,true);
assert.equal(p.area_sqkm,null);assert.equal(p.area_measurement_prohibited,true);
assert.equal(p.exclude_from_area_aggregation,true);assert.equal(p.actual_military_control_polygon,false);
assert.equal(p.occupying_every_location_verified,false);assert.equal(p.all_indigenous_rights_extinguished,false);
assert(p.source_urls.length>=1&&p.source_urls.every(url=>url.startsWith('https://')));
assert(p.description.length>=60);
}
const active=year=>fc.features.filter(f=>f.properties.start_year<=year&&year<=f.properties.end_year);
assert(active(1608).some(f=>f.id==='claim-ireland-crown-1600')&&active(1608).some(f=>f.id==='claim-virginia-first-charter-1606'),'pre-1609 sovereign legal claims and 1606 limited coastal grant now intentionally appear');
assert(active(1609).some(f=>f.id==='claim-virginia-company-1609'));
assert(!active(1609).some(f=>f.id==='claim-virginia-first-charter-1606'))
assert(!active(1625).some(f=>f.id==='claim-virginia-company-1609'),'company charter cannot outlive its 1624 termination');
assert(active(1629).some(f=>f.id==='claim-massachusetts-1629'));
assert(active(1654).some(f=>f.id==='claim-ireland-conquest-1653'));
assert(!active(1651).some(f=>f.id==='claim-scotland-commonwealth-1652'));
assert(active(1652).some(f=>f.id==='claim-scotland-commonwealth-1652'));
assert(!active(1660).some(f=>f.id==='claim-scotland-commonwealth-1652'),'Scottish 1660 restoration must end English occupation tint');
assert(active(1663).some(f=>f.id==='claim-carolina-1663'));
assert(!active(1665).some(f=>f.id==='claim-carolina-1663'));
assert(active(1665).some(f=>f.id==='claim-carolina-1665'));
assert(active(1670).some(f=>f.id==='claim-hudson-bay-1670'));
assert(!active(1680).some(f=>f.id==='claim-pennsylvania-1681'));
assert(active(1681).some(f=>f.id==='claim-pennsylvania-1681'));
// Phase 2 cross-year political and charter continuity: these are still schematic non-metric areas.
const has=(year,id)=>active(year).some(f=>f.id===id);
assert(has(1624,'claim-virginia-company-1609')&&!has(1624,'claim-virginia-crown-1625'));
assert(!has(1625,'claim-virginia-company-1609')&&has(1625,'claim-virginia-crown-1625'),'royal Virginia follows revoked company without loss of colonial story');
assert(!has(1631,'claim-maryland-1632')&&has(1632,'claim-maryland-1632'));
assert(has(1662,'claim-connecticut-1662')&&!has(1661,'claim-connecticut-1662'));
assert(has(1664,'claim-new-york-duke-1664')&&has(1672,'claim-new-york-duke-1664'));
assert(!has(1673,'claim-new-york-duke-1664')&&!has(1673,'claim-new-york-duke-1674'),'Dutch recapture cannot be shown as continued English rule');
assert(!has(1672,'claim-new-york-duke-1674')&&has(1674,'claim-new-york-duke-1674'),'English restored late 1674');
assert(has(1621,'claim-nova-scotia-scottish-1621')&&!has(1633,'claim-nova-scotia-scottish-1621'));
assert(has(1629,'claim-quebec-kirke-1629')&&!has(1633,'claim-quebec-kirke-1629'));
assert(!has(1691,'claim-massachusetts-province-1692')&&has(1692,'claim-massachusetts-province-1692'));
assert(has(1610,'claim-newfoundland-island-1610')&&has(1659,'claim-st-helena-1659'));
assert(has(1632,'claim-leeward-islands-1632')&&has(1663,'claim-rhode-island-1663'));
for(const f of fc.features)assert(!f.properties.area_sqkm&&f.properties.expansive_claim_overlay_only,'schematic areas must never become measured territory');
// Phase 3 macro colonial footprint continuity beyond North America; 1641, 1667, 1684 must not overclaim.
assert(has(1630,'claim-providence-island-1630')&&has(1640,'claim-providence-island-1630')&&!has(1641,'claim-providence-island-1630'));
assert(has(1650,'claim-surinam-willoughbyland-1650')&&has(1666,'claim-surinam-willoughbyland-1650')&&!has(1667,'claim-surinam-willoughbyland-1650'),'contested 1667/68 Suriname not shown as unbroken English control');
assert(has(1662,'claim-tangier-english-garrison-1662')&&has(1683,'claim-tangier-english-garrison-1662')&&!has(1684,'claim-tangier-english-garrison-1662'));
assert(!has(1664,'claim-cape-coast-castle-1665')&&has(1665,'claim-cape-coast-castle-1665'));
assert(!has(1667,'claim-bombay-east-india-company-1668')&&has(1668,'claim-bombay-east-india-company-1668'));
assert(!has(1639,'claim-madras-fort-st-george-1640')&&has(1640,'claim-madras-fort-st-george-1640'));
const repoEventIds=new Set();
for(let d=1600;d<=1690;d+=10)for(const e of json('data/atlas-'+d+'-'+(d+9)+'.json').events)repoEventIds.add(e.id);
for(const f of fc.features.filter(f=>['claim-surinam-willoughbyland-1650','claim-providence-island-1630','claim-tangier-english-garrison-1662','claim-cape-coast-castle-1665','claim-bombay-east-india-company-1668','claim-madras-fort-st-george-1640'].includes(f.id))){
 assert(f.properties.related_event_ids.length>0, f.id+' must link genuine published chronology events');
 for(const id of f.properties.related_event_ids)assert(repoEventIds.has(id),f.id+' references non-existent '+id);
}
// Phase 4: maximum documentary paper grants, island governance continuity and annual completeness.
assert(has(1600,'claim-ireland-crown-1600')&&has(1652,'claim-ireland-crown-1600'));
assert(!has(1653,'claim-ireland-crown-1600')&&has(1653,'claim-ireland-conquest-1653'),'the two separately labelled Ireland regimes must meet cleanly');
assert(!has(1605,'claim-virginia-first-charter-1606')&&has(1606,'claim-virginia-first-charter-1606'));
assert(has(1608,'claim-virginia-first-charter-1606')&&!has(1609,'claim-virginia-first-charter-1606'));
assert(has(1620,'claim-council-new-england-1620')&&has(1634,'claim-council-new-england-1620'));
assert(!has(1635,'claim-council-new-england-1620'),'surrender in 1635 ends former council legal grant');
assert(has(1620,'claim-plymouth-colony-1620')&&has(1691,'claim-plymouth-colony-1620')&&!has(1692,'claim-plymouth-colony-1620'));
assert(has(1623,'claim-st-kitts-nevis-1623')&&has(1631,'claim-st-kitts-nevis-1623')&&!has(1632,'claim-st-kitts-nevis-1623'));
assert(has(1632,'claim-leeward-islands-1632'),'the wider Leewards overlay must continue early St Kitts');
assert(has(1686,'claim-new-england-dominion-1686')&&has(1687,'claim-new-england-dominion-1686'));
assert(!has(1688,'claim-new-england-dominion-1686')&&has(1688,'claim-new-england-dominion-1688'));
assert(!has(1689,'claim-new-england-dominion-1688'),'Dominion overthrown in 1689');
const maxima=fc.features.find(f=>f.id==='claim-council-new-england-1620');
const west=Math.min(...maxima.geometry.coordinates[0].map(c=>c[0])),east=Math.max(...maxima.geometry.coordinates[0].map(c=>c[0]));
assert(west<=-124&&east>=-65,'1620 original sea-to-sea charter must stay continent-scale on map');
for(let y=1600;y<=1699;y++)assert(active(y).length>0,'documentary map should not accidentally blank out year '+y);
for(const f of fc.features.filter(f=>f.id.startsWith('claim-ireland-crown-')||f.id.startsWith('claim-virginia-first-')||f.id==='claim-council-new-england-1620'||f.id==='claim-plymouth-colony-1620'||f.id==='claim-st-kitts-nevis-1623'||f.id.startsWith('claim-new-england-dominion-'))){
 assert(f.properties.source_urls.length>0&&f.properties.area_sqkm===null&&f.properties.expansive_claim_overlay_only===true);
}
// Phase 5: New Jersey, Delaware, New Hampshire, Darien, Gambia, Mughal-licensed and Indonesian factories.
const phase5=[
 ['claim-new-jersey-proprietors-1664',1664,1672],
 ['claim-new-jersey-proprietors-1674',1674,1699],
 ['claim-delaware-duke-1664',1664,1672],
 ['claim-delaware-duke-1674',1674,1681],
 ['claim-delaware-penn-lower-counties-1682',1682,1699],
 ['claim-new-hampshire-royal-1679',1679,1685],
 ['claim-new-hampshire-royal-1692',1692,1699],
 ['claim-scottish-darien-1698',1698,1699],
 ['claim-gambia-james-island-1661',1661,1694],
 ['claim-eic-surat-factory-1612',1612,1685],
 ['claim-eic-hugli-bengal-1651',1651,1685],
 ['claim-eic-calcutta-sutanati-1690',1690,1699],
 ['claim-eic-bencoolen-1685',1685,1699],
 ['claim-eic-bantam-1602',1602,1681]
];
for(const [id,start,end] of phase5){
 const f=fc.features.find(f=>f.id===id);
 assert(f&&f.properties.start_year===start&&f.properties.end_year===end,'new phase-five dated region '+id);
 assert(!has(start-1,id)&&has(start,id)&&has(end,id)&&!has(end+1,id),'chronological boundaries for '+id);
 assert(f.properties.source_urls.length&&f.properties.area_sqkm===null&&!f.properties.territorial_claim);
 for(const eventId of f.properties.related_event_ids)assert(repoEventIds.has(eventId),id+' references non-existent event '+eventId);
}
for(const [y,ids] of [[1673,['claim-new-jersey-proprietors-1664','claim-new-jersey-proprietors-1674','claim-delaware-duke-1664','claim-delaware-duke-1674','claim-delaware-penn-lower-counties-1682']],
 [1686,['claim-new-hampshire-royal-1679','claim-new-hampshire-royal-1692']],
 [1682,['claim-eic-bantam-1602']],
 [1695,['claim-gambia-james-island-1661']]]){
 for(const id of ids)assert(!has(y,id),id+' must not claim uninterrupted English control in '+y);
}
assert(has(1698,'claim-scottish-darien-1698')&&has(1699,'claim-scottish-darien-1698'));
assert(has(1685,'claim-eic-bencoolen-1685')&&!has(1684,'claim-eic-bencoolen-1685'));
assert(has(1651,'claim-eic-hugli-bengal-1651')&&!has(1686,'claim-eic-hugli-bengal-1651'));
assert(has(1690,'claim-eic-calcutta-sutanati-1690')&&!has(1689,'claim-eic-calcutta-sutanati-1690'));
// A paper colony outline, a licensed Mughal factory and an unmeasured trade-post envelope
// must never enter sovereign polygons or a territorial area sum.
for(const f of fc.features)if(f.id.startsWith('claim-eic-')||f.id.startsWith('claim-delaware-')||f.id==='claim-scottish-darien-1698'){
 assert(f.properties.actual_military_control_polygon===false&&f.properties.exclude_from_area_aggregation===true);
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),css=fs.readFileSync(path.join(root,'css/dark-atlas-v2.css'),'utf8');
assert(app.includes('renderSeventeenthColonialClaims()'));
assert(app.includes('.sort((a,b)=>displaySpan(b)-displaySpan(a))'),'large polygon rendering must not cover clickable small colonies');assert(app.includes("groups.colonialClaims.clearLayers()"));
assert(app.includes("if(year<1600||!seventeenthColonialClaims"));assert(app.includes("'toggleTerritorialFootprints'"));
assert(app.includes("openTerritoryDossier(feature,'seventeenth-claim')"));
assert(app.includes("pane:'seventeenthColonialClaimsPane'"));assert(app.includes("data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson"));
assert(html.includes('class="swatch expansive-claim"'));assert(css.includes('.atlas-17c-expansive-claim'));
for(let d=1600;d<=1690;d+=10){const atlas=json('data/atlas-'+d+'-'+(d+9)+'.json');assert.deepEqual(atlas.colonial_polygons,[],'paper-only expansive overlays may not contaminate measured Atlas sovereign shapes');}
assert.equal(json('data/chapters.json').chapters.length,10);
console.log('PASS: 53 sourced broad paper colonial claim coloured polygons, year-scoped, source links and claim-only guards, no fabricated actual military control or changed Tudor boundaries.');
