const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const path=require('node:path');
const root=process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.ATLAS_TEST_CHROME;
const assetDir=process.env.ATLAS_TEST_CDN_MIRROR;
(async()=>{
 const args=['--no-sandbox','--ignore-certificate-errors'];
 if(process.env.ATLAS_TEST_SINGLE_PROCESS==='1')args.push('--no-zygote','--single-process');
 const browser=await chromium.launch({executablePath,args});
 try {
  const page=await browser.newPage({viewport:{width:1780,height:1020},ignoreHTTPSErrors:true});
  if(assetDir){
   const cdn=[
    ['https://unpkg.com/leaflet@1.9.4/dist/','leaflet.js'],
    ['https://unpkg.com/leaflet@1.9.4/dist/','leaflet.css'],
    ['https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/','topojson-client.min.js']
   ];
   for(const [host,file] of cdn)
    await page.route(host+file,r=>r.fulfill({path:path.join(assetDir,file)}));
  }
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const goto=async(params,year)=>{
   await page.goto(root+params,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(y=>document.querySelector('#bigYear')?.textContent===String(y)&&!!window.AtlasPublicCopyGuard,year,{timeout:30000});
  };
  const jump=async year=>{
   await page.evaluate(y=>{const i=document.querySelector('#jumpYear');i.value=y;i.dispatchEvent(new Event('change',{bubbles:true}));},year);
   await page.waitForFunction(y=>window.atlasStoryBridge.currentYear()===y,year);
  };
  const view=()=>page.evaluate(()=>window.atlasReadViewport());
  const link=id=>page.locator('.story-body [data-story-event="'+id+'"]').first();
  const selected=()=>page.evaluate(()=>window.atlasStoryBridge.selectedEventId());
  const focus=id=>page.evaluate(key=>window.atlasStoryBridge.activeFocusId()===key,id);
  const openEvent=async id=>{
   await page.locator('[data-eid="'+id+'"]').click();
   await page.waitForFunction(key=>window.atlasStoryBridge.selectedEventId()===key,id);
  };
  const openArticle=async id=>{
   await page.locator('[data-story-open="'+id+'"]').first().click();
   await page.locator('.major-story-article[data-story-id="'+id+'"]').waitFor();
  };
  const audit=()=>page.evaluate(()=>window.historicOverlapDossier.getAudit());
  const assertClean=async()=>{
   const found=await page.evaluate(()=>{
    const guard=window.AtlasPublicCopyGuard;
    return [...guard.visibleWarnings(),...Array.from(document.querySelectorAll('[title],[aria-label],[placeholder]')).flatMap(el=>
     ['title','aria-label','placeholder'].map(n=>el.getAttribute(n)).filter(guard.isWarning))];
   });
   assert.deepEqual(found,[]);
  };
  await goto('?year=1819',1819);
  assert.equal(await page.locator('#jumpYear').getAttribute('max'),'1819');
  await goto('?review18c=1&year=1799',1799);
  assert.equal(await page.locator('#jumpYear').getAttribute('max'),'1799');
  await goto('?year=1799',1799);
  assert.equal(await page.locator('#jumpYear').getAttribute('max'),'1819');
  await page.locator('#nextYear').click();
  assert.equal(await page.evaluate(()=>window.atlasStoryBridge.currentYear()),1800);
  assert.match(await page.locator('#chapterIntro').textContent(),/亚眠/);
  await jump(1802);
  const sites=()=>page.locator('.atlas-19c-site');
  assert.equal(await sites().count(),5);
  await jump(1803);
  const eventLabels=await page.locator('#eventList .event-item').allTextContents();
  assert(eventLabels.some(t=>t.includes('巴达维亚')));
  await jump(1806);
  await openEvent('E19-CAP-1806-BLAAUWBERG');
  await openArticle('E19-CAPE-OPENING');
  assert.match(await page.locator('.story-body').textContent(),/格雷厄姆斯敦/);
  const start=await view();
  await link('E19-CAP-1819-MAKHANDA').click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1819);
  await page.waitForFunction(()=>{const c=window.atlasReadViewport().center;return Math.abs(c.lat+33.3072)<.35&&Math.abs(c.lng-26.5273)<.35});
  assert(await focus('E19-CAP-1819-MAKHANDA'));
  assert.equal((await view()).zoom,start.zoom);
  assert.equal(await page.locator('.major-story-article').count(),1);
  await link('E19-CAP-1819-MAKHANDA').dblclick();
  await page.locator('[data-story-back]').waitFor();
  assert.equal(await selected(),'E19-CAP-1819-MAKHANDA');
  await page.locator('[data-story-back]').click();
  await page.locator('.major-story-article').waitFor();
  await page.locator('[data-story-return]').first().click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1806);
  assert.equal(await selected(),'E19-CAP-1806-BLAAUWBERG');
  await openArticle('E19-CAPE-OPENING');
  await link('E18C-CAP-1799-VANDELEUR-BOER-SUPPRESSION').click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1799);
  await page.locator('[data-story-return]').first().click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1806);
  assert.equal(await selected(),'E19-CAP-1806-BLAAUWBERG');
  await page.locator('#resetDossier').click();
  await jump(1819);
  assert.equal((await audit()).liveAreas,2);
  await page.evaluate(()=>window.__historicOverlapHost.map.setView([-33.3,26.9],8,{animate:false}));
  const clickAt=async(lat,lon)=>{
   const p=await page.evaluate(([lat,lon])=>{const m=window.__historicOverlapHost.map,r=m.getContainer().getBoundingClientRect(),p=m.latLngToContainerPoint([lat,lon]);return [p.x+r.left,p.y+r.top]},[lat,lon]);
   await page.mouse.click(...p);
  };
  await clickAt(-33.46,26.64);
  const west=page.locator('[data-historic-overlap-id="nineteenthAreas:cape-zuurveld"]');
  await west.waitFor();
  await west.hover();
  assert.equal((await audit()).focused,'nineteenthAreas:cape-zuurveld');
  const marks=await page.locator('.atlas-19c-area').evaluateAll(els=>els.map(e=>e.getAttribute('stroke-dasharray')));
  assert.deepEqual(marks,['7 6','7 6']);
  await clickAt(-33.32,27.26);
  const east=page.locator('[data-historic-overlap-id="nineteenthAreas:cape-keiskamma-lower-neutral-belt"]');
  await east.waitFor();
  await east.hover();
  assert.equal((await audit()).focused,'nineteenthAreas:cape-keiskamma-lower-neutral-belt');
  await east.locator('[data-area-event]').click();
  assert.equal(await selected(),'E19-CAP-1819-NEUTRAL-BELT');
  await page.locator('#mapLayerTerritory').uncheck();
  assert.equal(await page.locator('.atlas-19c-area').count(),0);
  assert(await page.evaluate(()=>window.atlasDensityAudit().qualifiedRecords>0));
  await page.locator('#mapLayerTerritory').check();
  await page.locator('#mapLayerEvents').uncheck();
  assert.equal(await page.evaluate(()=>window.atlasDensityAudit().qualifiedRecords),0);
  assert.equal(await page.locator('.atlas-19c-area').count(),2);
  await page.locator('#mapLayerEvents').check();
  await page.locator('#resetDossier').click();
  await jump(1815);
  await openEvent('E19-CEY-1815-CONVENTION');
  await openArticle('E19-KANDY-OPENING');
  await assertClean();
  await link('E19-CEY-1818-DEVASTATION').click();
  await page.locator('.story-event-preview').waitFor();
  assert.equal(await page.evaluate(()=>window.atlasStoryBridge.currentYear()),1818);
  await link('E19-CEY-1818-BADULLA').click();
  await page.waitForFunction(()=>{const c=window.atlasReadViewport().center;return Math.abs(c.lat-6.9802)<.35&&Math.abs(c.lng-81.0577)<.35});
  await link('E18C-CEY-1796-COLOMBO-FORT-ENTRY').click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1796);
  await page.locator('[data-story-return]').first().click();
  assert.equal(await selected(),'E19-CEY-1815-CONVENTION');
  for(let y=1497;y<=1819;y++){
   await jump(y);
   await assertClean();
  }
  await jump(1585);
  assert.equal(await page.locator('.atlas-19c-area,.atlas-19c-site').count(),0);
  await jump(1806);
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1806-ARCOT-VELLORE')));
  await goto('?year=1826',1819);
  assert.equal(await page.locator('[data-decade="1820"]').getAttribute('class').then(s=>s.includes('unpublished')),true);
  await goto('?review19c=1&year=1826',1826);
  assert.equal(await page.locator('#jumpYear').getAttribute('max'),'1849');
  assert.match(await page.locator('#chapterIntro').textContent(),/杨达波/);
  assert.match(await page.locator('[data-decade="1820"]').textContent(),/第33章/);
  await openEvent('E19-BUR-1826-YANDABO');
  await openArticle('E19-BURMA-YANDABO');
  assert.match(await page.locator('.story-body').textContent(),/一千万卢比/);
  const warStart=await view();
  await link('E19-BUR-1825-DANUBYU').click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1825);
  await page.waitForFunction(()=>{const c=window.atlasReadViewport().center;return Math.abs(c.lat-17.25684)<.35&&Math.abs(c.lng-95.59234)<.35});
  assert(await focus('E19-BUR-1825-DANUBYU'));
  assert.equal((await view()).zoom,warStart.zoom);
  await link('E19-BUR-1825-DANUBYU').dblclick();
  await page.locator('[data-story-back]').waitFor();
  assert.equal(await selected(),'E19-BUR-1825-DANUBYU');
  await page.locator('[data-story-back]').click();
  await page.locator('.major-story-article').waitFor();
  await page.locator('[data-story-return]').first().click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1826);
  assert.equal(await selected(),'E19-BUR-1826-YANDABO');
  await page.locator('#resetDossier').click();
  await page.evaluate(()=>window.__historicOverlapHost.map.setView([16.80528,96.15611],10,{animate:false}));
  const rangoonRing=()=>page.evaluate(()=>{
   const m=window.__historicOverlapHost.map,r=m.getContainer().getBoundingClientRect();
   const p=m.latLngToContainerPoint([16.80528,96.15611]);
   return document.elementFromPoint(p.x+r.left+21,p.y+r.top)?.getAttribute('stroke');
  });
  assert.equal(await rangoonRing(),'#c5a6f5');
  await jump(1827);
  assert.equal(await rangoonRing(),'#65c7b6');
  await jump(1820);
  assert.equal((await audit()).liveAreas,2);
  await page.evaluate(()=>window.__historicOverlapHost.map.setView([-33.3,26.9],8,{animate:false}));
  await clickAt(-33.46,26.64);
  await west.waitFor();
  await west.hover();
  assert.equal((await audit()).focused,'nineteenthAreas:cape-zuurveld');
  assert.match(await west.textContent(),/奥尔巴尼/);
  await jump(1822);
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1822-COLOMBO-KANDY')));
  const newTopics=[
   [1823,'E19-DEM-1823-BACHELORS-ADVENTURE','E19-DEMERARA-REVOLT','E19-DEM-1824-SMITH-PRISON',1824],
   [1828,'E19-TAS-1828-CAPE-GRIM-FEB','E19-TASMANIA-BLACK-WAR','E19-TAS-1827-QUAMBY-BROOK',1827],
   [1824,'E19-KIT-1824-DECEMBER-SIEGE','E19-KITTUR-CHENNAMMA','E19-KIT-1829-CHENNAMMA',1829],
   [1826,'E19-ASH-1826-KATAMANSO','E19-ASANTE-GOLD-COAST','E19-ASH-1824-NSAMANKOW',1824],
   [1824,'E19-HBC-1824-VANCOUVER-BLUFF','E19-HUDSON-BAY-PACIFIC','E19-HBC-1829-VANCOUVER-LOWER',1829],
   [1823,'E19-BEO-1823-BADGER-BAY','E19-BEOTHUK-SHANAWDITHIT','E19-BEO-1829-DRAWINGS',1829],
   [1829,'E19-KHA-1829-NONGKHLAW','E19-KHASI-TIROT-SING','E19-KHA-1826-PASSAGE',1826],
   [1824,'E19-BAT-1824-MARTIAL-LAW','E19-BATHURST-WIRADJURI','E19-BAT-1824-PARRAMATTA-MEETING',1824],
   [1820,'E19-GUL-1820-RAK-GENERAL-TREATY','E19-GULF-MARITIME-TREATY','E19-GUL-1823-BASAIDU',1823],
   [1828,'E19-DUAR-1828-BURI-GUMA','E19-BURI-GUMA-DUAR','E19-DUAR-1828-CHATGAREE',1828]
  ];
  for(const [year,entry,story,target,targetYear] of newTopics){
   await page.locator('#resetDossier').click();
   await jump(year);
   await openEvent(entry);
   await openArticle(story);
   await link(target).click();
   await page.waitForFunction(y=>window.atlasStoryBridge.currentYear()===y,targetYear);
   await link(target).dblclick();
   await page.locator('[data-story-back]').waitFor();
   assert.equal(await selected(),target);
   await assertClean();
   await page.locator('[data-story-back]').click();
   await page.locator('.major-story-article').waitFor();
   await page.locator('[data-story-return]').first().click();
   assert.equal(await selected(),entry);
  }
  await page.locator('#resetDossier').click();
  const pointStroke=async (lat,lng)=>{
   await page.evaluate(([lat,lng])=>window.__historicOverlapHost.map.setView([lat,lng],10,{animate:false}),[lat,lng]);
   return page.evaluate(([lat,lng])=>{
    const m=window.__historicOverlapHost.map;
    const bounds=m.getContainer().getBoundingClientRect();
    const point=m.latLngToContainerPoint([lat,lng]);
    return document.elementsFromPoint(point.x+bounds.left+21,point.y+bounds.top)
     .find(el=>el.classList.contains('atlas-19c-site'))?.getAttribute('stroke');
   },[lat,lng]);
  };
  await jump(1823);
  assert.equal(await pointStroke(15.60037,74.79097),'#65c7b6');
  await jump(1824);
  assert.equal(await pointStroke(15.60037,74.79097),'#c5a6f5');
  assert.equal(await pointStroke(45.625,-122.644),'#65c7b6');
  await jump(1829);
  assert.notEqual(await pointStroke(45.625,-122.644),'#65c7b6');
  assert.equal(await pointStroke(45.622603,-122.662425),'#65c7b6');
  await jump(1820);
  assert.equal(await pointStroke(26.9492,56.2691),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1820-RAK-QESHM')));
  await jump(1822);
  assert.notEqual(await pointStroke(26.9492,56.2691),'#c5a6f5');
  await jump(1823);
  assert.equal(await pointStroke(26.64804,55.28701),'#c5a6f5');
  await jump(1827);
  assert.equal((await audit()).liveAreas,2);
  await jump(1828);
  assert.equal((await audit()).liveAreas,3);
  await page.evaluate(()=>window.__historicOverlapHost.map.setView([26.74,92.075],9,{animate:false}));
  await clickAt(26.70,92.086);
  const duar=page.locator('[data-historic-overlap-id="nineteenthAreas:assam-buri-guma-duar-occupation"]');
  await duar.waitFor();
  await duar.hover();
  assert.equal((await audit()).focused,'nineteenthAreas:assam-buri-guma-duar-occupation');
  assert.match(await duar.textContent(),/布里古马/);
  await jump(1829);
  assert.equal((await audit()).liveAreas,3);
  for(let y=1820;y<=1829;y++){
   await jump(y);
   await assertClean();
   const density=await page.evaluate(()=>window.atlasDensityAudit());
   assert.deepEqual(density.groupedKeys,density.eligibleKeys);
  }
  await goto('?review19c=1&year=1830',1830);
  assert.match(await page.locator('#chapterLabel').textContent(),/第34章/);
  assert.match(await page.locator('#chapterIntro').textContent(),/牙买加/);
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1830-ORDER-WATERLOO-ECHO')));
  const chapter34Topics=[
   [1830,'E19-TAS-1830-BLACK-LINE-ORDER','E19-TASMANIA-BLACK-LINE-WYBALENNA','E19-TAS-1833-WYBALENNA',1833],
   [1832,'E19-JAM-1832-SHARPE-EXECUTION','E19-JAMAICA-BAPTIST-WAR-EMANCIPATION','E19-JAM-1838-EMANCIPATION',1838],
   [1835,'E19-CAP-1835-QUEEN-ADELAIDE','E19-CAPE-SIXTH-FRONTIER-WAR','E19-CAP-1830-WILLSHIRE-FAIR-END',1830],
   [1834,'E19-DUAR-1834-BURI-GUMA-RESTORATION','E19-BHUTAN-DUARS-NEGOTIATIONS','E19-DUAR-1838-PUNAKHA-MISSION',1838],
   [1831,'E19-NAN-1831-FIRST-EXPEDITION','E19-NANING-WAR','E19-NAN-1832-TABOH-OCCUPATION',1832],
   [1838,'E19-AFG-1838-SIMLA-DECLARATION','E19-FIRST-AFGHAN-WAR-KALAT','E19-KAL-1839-STORMING',1839],
   [1837,'E19-ADE-1837-DERIA-DOWLUT','E19-ADEN-CAPTURE','E19-ADE-1839-RESISTANCE',1839],
   [1839,'E19-OP-1839-HUMEN-DESTRUCTION','E19-OPIUM-TRADE-CRISIS','E19-OP-1839-CHUENPI-CLASH',1839],
   [1837,'E19-NSW-1837-NAMOI-POLICE','E19-NSW-GWYDIR-FRONTIER-MASSACRES','E19-NSW-1838-MYALL-CREEK',1838],
   [1834,'E19-WA-1834-PINJARRA-MASSACRE','E19-PINJARRA-MASSACRE','E19-WA-1834-STIRLING-DISPATCH',1834],
   [1838,'E19-WA-1838-WADJEMUP-PRISONERS','E19-WADJEMUP-PRISON-FOUNDATION','E19-WA-1839-WADJEMUP-PRISON-ANNOUNCEMENT',1839],
   [1831,'E19-IN-1831-KOL-RISING','E19-CHOTANAGPUR-KOL-BHUMIJ','E19-IN-1832-SILAGAI',1832],
   [1831,'E19-IN-1831-TITU-EARLY-CLASH','E19-TITU-MIR-BAMBOO-FORT','E19-IN-1831-TITU-BAMBOO-FORT',1831],
   [1834,'E19-COORG-1834-MERCARA-OCCUPATION','E19-COORG-ANNEXATION','E19-COORG-1837-REBELLION',1837],
   [1831,'E19-IRL-1831-NEWTOWNBARRY-TITHE','E19-IRISH-TITHE-WAR','E19-IRL-1834-GORTROE-TITHE',1834],
   [1834,'E19-CAPE-1834-SLAVERY-ABOLITION','E19-CAPE-EMANCIPATION-COMPENSATION','E19-CAPE-1838-APPRENTICESHIP-END',1838],
   [1834,'E19-MAU-1834-ATLAS-ARRIVAL','E19-MAURITIUS-CHAGOS-LABOUR','E19-CHAGOS-1835-APPRENTICESHIP',1835],
   [1837,'E19-GUI-1837-GLADSTONE-INDENTURE','E19-GUIANA-INDIAN-INDENTURE','E19-GUI-1838-VREED-EN-HOOP-LABOUR',1838],
   [1830,'E19-EXU-1830-SALT-BOAT','E19-EXUMA-POMPEY-RESISTANCE','E19-EXU-1838-FULL-EMANCIPATION',1838],
   [1834,'E19-TOL-1834-DORCHESTER-TRIAL','E19-TOLPUDDLE-TRANSPORTATION','E19-TOL-1838-FOUR-RETURN',1838],
   [1839,'E19-NEW-1839-WESTGATE-SHOOTING','E19-NEWPORT-CHARTIST-RISING','E19-NEW-1839-MONMOUTH-TRIAL-OPENS',1839]
  ];
  for(const [year,entry,story,target,targetYear] of chapter34Topics){
   if(await page.locator('#workspace:not(.dossier-collapsed)').count())
    await page.locator('#resetDossier').click();
   await jump(year);
   await openEvent(entry);
   await openArticle(story);
   await link(target).click();
   await page.waitForFunction(y=>window.atlasStoryBridge.currentYear()===y,targetYear);
   await link(target).dblclick();
   await page.locator('[data-story-back]').waitFor();
   assert.equal(await selected(),target);
   await assertClean();
   await page.locator('[data-story-back]').click();
   await page.locator('.major-story-article').waitFor();
   await page.locator('[data-story-return]').first().click();
   assert.equal(await selected(),entry);
  }
  await page.locator('#resetDossier').click();
  await jump(1833);
  await page.evaluate(()=>window.__historicOverlapHost.map.setView([26.74,92.075],9,{animate:false}));
  await clickAt(26.70,92.086);
  await duar.waitFor();
  await duar.hover();
  assert.equal((await audit()).focused,'nineteenthAreas:assam-buri-guma-duar-occupation');
  await page.locator('#resetDossier').click();
  await jump(1834);
  await page.evaluate(()=>{
   const map=window.__historicOverlapHost.map;
   map.stop().invalidateSize({pan:false}).setView([26.74,92.075],9,{animate:false});
  });
  await clickAt(26.70,92.086);
  const restoredDuar=page.locator('[data-historic-overlap-id="nineteenthAreas:assam-buri-guma-duar-restoration"]');
  await restoredDuar.waitFor();
  assert.match(await restoredDuar.textContent(),/不丹恢复管理/);
  assert.equal(await duar.count(),0);
  assert.equal(await page.locator('.atlas-19c-area[stroke="#65c7b6"][stroke-dasharray="7 6"]').count(),1);
  await page.locator('#resetDossier').click();
  await jump(1838);
  assert.equal(await pointStroke(49.20667,-122.63472),'#65c7b6');
  await jump(1839);
  assert.notEqual(await pointStroke(49.20667,-122.63472),'#65c7b6');
  assert.equal(await pointStroke(49.1686747,-122.5727865),'#65c7b6');
  assert.equal(await pointStroke(12.77522,45.03862),'#c5a6f5');
  assert.equal(await pointStroke(34.52813,69.17233),'#c5a6f5');
  const routeIds=await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds);
  assert(routeIds.includes('E19-ROUTE-1839-KANDAHAR-GHAZNI-KABUL'));
  assert(routeIds.includes('E19-ROUTE-1839-QUETTA-KALAT'));
  await jump(1838);
  assert.equal(await pointStroke(12.77522,45.03862),'#65c7b6');
  assert.notEqual(await pointStroke(34.52813,69.17233),'#c5a6f5');
  await jump(1832);
  assert.equal(await pointStroke(2.486103,102.189942),'#c5a6f5');
  await jump(1831);
  assert.equal(await pointStroke(2.486103,102.189942),'#65c7b6');
  assert.equal(await pointStroke(-32.05612,115.74127),'#c5a6f5');
  assert.notEqual(await pointStroke(-31.957833,115.861944),'#c5a6f5');
  await jump(1834);
  assert.equal(await pointStroke(-31.957833,115.861944),'#c5a6f5');
  await jump(1838);
  assert.notEqual(await pointStroke(-31.99526,115.53989),'#c5a6f5');
  await jump(1839);
  assert.equal(await pointStroke(-31.99526,115.53989),'#c5a6f5');
  assert.equal(await pointStroke(23.23241,87.07160),'#c5a6f5');
  await jump(1833);
  assert.equal(await pointStroke(12.4208474,75.7389661),'#65c7b6');
  assert(!(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1834-HEBBALE-MADIKERI'))));
  await jump(1834);
  assert.equal(await pointStroke(12.4208474,75.7389661),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1834-HEBBALE-MADIKERI')));
  assert.equal(await pointStroke(-20.16194,57.49889),'#c5a6f5');
  await jump(1830);
  assert.equal(await pointStroke(25.07564,-77.34458),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1830-STEVENSTONE-ROLLEVILLE')));
  await jump(1833);
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1830-STEVENSTONE-ROLLEVILLE')));
  await jump(1834);
  assert(!(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1830-STEVENSTONE-ROLLEVILLE'))));


  for(let y=1830;y<=1839;y++){
   await jump(y);
   await assertClean();
   const density=await page.evaluate(()=>window.atlasDensityAudit());
   assert.deepEqual(density.groupedKeys,density.eligibleKeys);
  }
  await goto('?review19c=1&year=1840',1840);
  assert.match(await page.locator('#chapterLabel').textContent(),/第35章/);
  assert.match(await page.locator('#chapterIntro').textContent(),/南京条约/);
  assert.match(await page.locator('[data-decade="1840"]').textContent(),/战后条约与殖民边疆/);
  const chapter35Topics=[
   [1840,'E19-OP-1840-DINGHAI-FIRST','E19-OPIUM-WAR-TREATY-PORTS','E19-OP-1842-NANKING-TREATY',1842],
   [1841,'E19-AFG-1841-KABUL-RISING','E19-AFGHAN-WAR-WITHDRAWAL-KALAT','E19-AFG-1842-KABUL-BAZAAR',1842],
   [1840,'E19-NEW-1840-DEATH-SENTENCE','E19-NEWPORT-TRANSPORTATION','E19-NEW-1840-MANDARIN-HOBART',1840],
   [1846,'E19-TAS-1846-WYBALENNA-PETITION','E19-WYBALENNA-PUTALINA','E19-TAS-1847-PUTALINA-REMOVAL',1847],
   [1841,'E19-WA-1841-WADJEMUP-LABOUR','E19-WADJEMUP-FORCED-LABOUR','E19-WA-1849-WADJEMUP-CLOSURE',1849],
   [1840,'E19-ADE-1840-MAY-ATTACK','E19-ADEN-LAHEJ-AGREEMENTS','E19-ADE-1843-LAHEJ-AGREEMENT',1843],
   [1841,'E19-DUAR-1841-ASSAM-TAKEOVER','E19-ASSAM-DUARS-TAKEOVER','E19-DUAR-1834-BURI-GUMA-RESTORATION',1834],
   [1843,'E19-HBC-1843-FORT-VICTORIA','E19-HBC-FRASER-OREGON','E19-HBC-1849-VANCOUVER-US-GARRISON',1849],
   [1840,'E19-CEY-1840-CROWN-LANDS','E19-CEYLON-LAND-MATALE','E19-CEY-1848-MATALE-SUPPRESSION',1848],
   [1842,'E19-SIN-1842-NEW-TERMS','E19-SINDH-ANNEXATION','E19-SIN-1843-MIANI',1843],
   [1845,'E19-SIK-1845-MUDKI','E19-FIRST-SIKH-WAR-TREATIES','E19-SIK-1846-AMRITSAR-TREATY',1846],
   [1848,'E19-SIK-1848-MULTAN-RISING','E19-SECOND-SIKH-WAR-ANNEXATION','E19-SIK-1849-KOH-I-NOOR',1849],
   [1840,'E19-NZ-1840-WAITANGI','E19-NZ-WAIRAU','E19-NZ-1843-WAIRAU-CLASH',1843],
   [1845,'E19-NZ-1845-KORORAREKA','E19-NZ-NORTHERN-WAR','E19-NZ-1846-RUA-ENTRY',1846],
   [1846,'E19-NZ-1846-BOULCOTT','E19-NZ-HUTT','E19-NZ-1848-RAUPARAHA-RETURN',1848],
   [1846,'E19-NZ-1846-WHANGANUI-GARRISON','E19-NZ-WHANGANUI','E19-NZ-1847-RUTLAND-EXECUTIONS',1847],
   [1848,'E19-NZ-1848-KEMP-DEED','E19-NZ-KEMP','E19-NZ-1849-TIRAMOREHU-LETTER',1849]
  ];
  for(const [year,entry,story,target,targetYear] of chapter35Topics){
   if(await page.locator('#workspace:not(.dossier-collapsed)').count())
    await page.locator('#resetDossier').click();
   await jump(year);
   await openEvent(entry);
   await openArticle(story);
   await link(target).click();
   await page.waitForFunction(y=>window.atlasStoryBridge.currentYear()===y,targetYear);
   await page.waitForFunction(id=>window.atlasStoryBridge.activeFocusId()===id,target);
   await link(target).dblclick();
   await page.locator('[data-story-back]').waitFor();
   assert.equal(await selected(),target);
   await assertClean();
   await page.locator('[data-story-back]').click();
   await page.locator('.major-story-article').waitFor();
   await page.locator('[data-story-return]').first().click();
   assert.equal(await selected(),entry);
  }
  await page.locator('#resetDossier').click();
  await jump(1839);
  await openEvent('E19-NEW-1839-MONMOUTH-TRIAL-OPENS');
  await openArticle('E19-NEWPORT-CHARTIST-RISING');
  await page.locator('[data-story-open="E19-NEWPORT-TRANSPORTATION"]').first().click();
  await page.locator('.major-story-article[data-story-id="E19-NEWPORT-TRANSPORTATION"]').waitFor();
  await link('E19-NEW-1840-MANDARIN-HOBART').click();
  await page.waitForFunction(()=>window.atlasStoryBridge.currentYear()===1840);
  await page.locator('#resetDossier').click();
  assert.equal(await pointStroke(30.0216,122.1026),'#c5a6f5');
  assert.equal(await pointStroke(34.52813,69.17233),'#c5a6f5');
  assert.equal(await pointStroke(12.77522,45.03862),'#c5a6f5');
  assert.notEqual(await pointStroke(22.28606,114.14767),'#c5a6f5');
  await jump(1841);
  assert.equal(await pointStroke(22.28606,114.14767),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1841-DINGHAI-ZHENHAI-NINGBO')));
  await jump(1842);
  assert.equal(await pointStroke(34.52813,69.17233),'#65c7b6');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1842-KABUL-GANDAMAK-JALALABAD')));
  await jump(1843);
  assert.equal(await pointStroke(22.28606,114.14767),'#c5a6f5');
  const hongKong=await page.evaluate(()=>{
   const map=window.__historicOverlapHost.map,bounds=map.getContainer().getBoundingClientRect();
   const point=map.latLngToContainerPoint([22.28606,114.14767]);
   return [point.x+bounds.left+21,point.y+bounds.top];
  });
  await page.mouse.click(...hongKong);
  await page.locator('#dossierBody h2').filter({hasText:'英国殖民政府'}).waitFor();
  await page.locator('#resetDossier').click();
  await jump(1842);
  assert.equal(await pointStroke(25.3844,68.3727),'#65c7b6');
  await jump(1843);
  assert.equal(await pointStroke(25.3844,68.3727),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1843-HYDERABAD-BOMBAY-CAPTIVES')));
  await jump(1845);
  assert.equal(await pointStroke(31.558,74.35071),'#65c7b6');
  assert.equal(await pointStroke(30.0216,122.1026),'#c5a6f5');
  assert.notEqual(await pointStroke(24.44449,118.06664),'#c5a6f5');
  await jump(1846);
  assert.equal(await pointStroke(31.32556,75.57917),'#c5a6f5');
  assert.equal(await pointStroke(34.08565,74.80555),'#65c7b6');
  assert.equal(await pointStroke(30.0216,122.1026),'#65c7b6');
  assert.equal(await pointStroke(-40.01739052,147.8818023),'#c5a6f5');
  await jump(1847);
  assert.notEqual(await pointStroke(-40.01739052,147.8818023),'#c5a6f5');
  assert.equal(await pointStroke(-43.10762,147.26944),'#c5a6f5');
  await jump(1848);
  assert.equal(await pointStroke(30.19679,71.47824),'#65c7b6');
  assert.equal(await pointStroke(7.4698,80.6217),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1848-KANDY-MATALE-SUPPRESSION')));
  assert.equal(await pointStroke(-31.99526,115.53989),'#c5a6f5');
  await jump(1849);
  assert.equal(await pointStroke(31.558,74.35071),'#c5a6f5');
  assert.equal(await pointStroke(30.19679,71.47824),'#c5a6f5');
  assert.notEqual(await pointStroke(7.4698,80.6217),'#c5a6f5');
  assert.notEqual(await pointStroke(-31.99526,115.53989),'#c5a6f5');
  assert.equal(await pointStroke(45.622603,-122.662425),'#65c7b6');
  await jump(1840);
  assert.equal(await pointStroke(-35.302508,174.120082),'#c5a6f5');
  await jump(1841);
  assert.notEqual(await pointStroke(-35.302508,174.120082),'#c5a6f5');
  assert.equal(await pointStroke(-36.84988,174.77042),'#c5a6f5');
  await jump(1846);
  assert.equal(await pointStroke(-41.099357,174.865747),'#c5a6f5');
  assert.equal(await pointStroke(-39.930902,175.052305),'#c5a6f5');
  assert(await page.evaluate(()=>window.atlasStoryBridge.activeEventWindow().routeIds.includes('E19-ROUTE-1846-MATAI-TAUA-HOROKIRI')));
  const ruaPosition=[-35.45641,174.14354];
  await page.evaluate(position=>window.__historicOverlapHost.map.setView(position,10,{animate:false}),ruaPosition);
  const ruaMarker=await page.evaluate(([lat,lon])=>{
   const map=window.__historicOverlapHost.map,b=map.getContainer().getBoundingClientRect();
   const p=map.latLngToContainerPoint([lat,lon]);
   return [p.x+b.left+29,p.y+b.top];
  },ruaPosition);
  await page.mouse.click(...ruaMarker);
  const ruaArea=page.locator('[data-historic-overlap-id="nineteenthAreas:nz-ruapekapeka-pa"]');
  await ruaArea.waitFor();
  await ruaArea.hover();
  assert.equal((await audit()).focused,'nineteenthAreas:nz-ruapekapeka-pa');
  await ruaArea.locator('[data-area-event="E19-NZ-1846-RUA-ENTRY"]').click();
  assert.equal(await selected(),'E19-NZ-1846-RUA-ENTRY');
  await page.locator('#resetDossier').click();
  await jump(1847);
  assert.equal(await page.evaluate(([lat,lng])=>window.historicOverlapDossier.hitCountAt(lat,lng),ruaPosition),0);
  for(let y=1840;y<=1849;y++){
   await jump(y);
   await assertClean();
   const density=await page.evaluate(()=>window.atlasDensityAudit());
   assert.deepEqual(density.groupedKeys,density.eligibleKeys);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS Chrome: 323 public years and 30 review years, 49 stories across chapters 33–35, map transitions, all qualified events reachable, no public warnings.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
