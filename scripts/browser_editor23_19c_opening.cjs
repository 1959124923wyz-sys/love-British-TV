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
  assert.deepEqual(errors,[]);
  console.log('PASS Chrome: public and independent review navigation, 323 years, story cross-century/cross-decade navigation, pan and return, GIS clicks and hover, layer independence, no public warnings.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
