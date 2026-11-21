const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1780,height:1020}});
  page.setDefaultTimeout(45000);
  const root=(process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/');
  await page.goto(root+'?review18c=1&review19c=1&year=1799',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.eighteenthEditor37FiveAB?.getAudit()?.loaded===true);
  await page.waitForFunction(()=>document.querySelector('#workspace')?.dataset.atlasReady==='true');
  const state=()=>page.evaluate(()=>window.eighteenthEditor37FiveAB.getAudit());
  const set=async y=>{
   await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
   await page.waitForFunction(y=>window.eighteenthEditor37FiveAB.getAudit().year===y,y);
  };
  await set(1799);let a=await state();
  assert.equal(a.featureCount,26);assert.equal(a.physicalPolygons,7);
  assert.equal(a.physicalLines,4);assert.equal(a.historicSites,15);
  assert.equal(a.activeIds.length,22);assert.equal(a.visibleLayers,22);
  assert(!await page.evaluate(()=>window.eighteenthBatch36Spatial.getAudit().activeZoneIds.includes('B36-Z079')));
  assert(!await page.evaluate(()=>window.eighteenthBatch39Spatial.getAudit().activeZoneIds.includes('B39-A-Z036')));
  await set(1762);a=await state();
  assert(a.activeIds.includes('EDITOR37_5AB_GUADELOUPE_SUGAR_SHORE'));
  assert(a.activeIds.includes('EDITOR37_5AB_TOBAGO_1762_SHORE'));
  assert(!a.activeIds.includes('EDITOR37_5AB_1763_FRENCH_RESTORED_ISLANDS'));
  await set(1763);a=await state();
  assert(a.activeIds.includes('EDITOR37_5AB_1763_FRENCH_RESTORED_ISLANDS'));
  assert(!a.activeIds.includes('EDITOR37_5AB_GUADELOUPE_SUGAR_SHORE'));
  await set(1772);a=await state();assert(!a.activeIds.includes('EDITOR37_5AB_BEYIN_FORT_AFTER_1773'));
  await set(1773);a=await state();assert(a.activeIds.includes('EDITOR37_5AB_BEYIN_FORT_AFTER_1773'));
  await set(1787);a=await state();assert(!a.activeIds.includes('EDITOR37_5AB_GUNTUR'));
  await set(1788);a=await state();assert(a.activeIds.includes('EDITOR37_5AB_GUNTUR'));
  await set(1799);a=await state();
  await page.evaluate(()=>window.__eighteenthSpatialHost.map.setView([5.10,-1.24],8));
  await page.waitForFunction(()=>!!document.querySelector('[data-editor37-5ab-id="EDITOR37_5AB_CAPE_COAST"]'));
  await page.evaluate(()=>{
   document.querySelector('[data-editor37-5ab-id="EDITOR37_5AB_CAPE_COAST"]').dispatchEvent(
    new MouseEvent('click',{bubbles:true,cancelable:true}));
  });
  await page.waitForFunction(()=>document.querySelector('#dossierBody')?.textContent?.includes('海岸角城堡'));
  const info=await page.locator('#dossierBody').innerText();
  assert(info.includes('历史来源'));
  assert.equal(await page.evaluate(()=>window.AtlasPublicCopyGuard.visibleWarnings().length),0);
  const shots=path.join(__dirname,'..','browser-smoke-results');fs.mkdirSync(shots,{recursive:true});
  await page.screenshot({path:path.join(shots,'18c-5ab-gold-coast-1799-dossier.png')});
  await set(1800);a=await state();
  assert.equal(a.visibleLayers,4);assert.equal(a.activeIds.length,4);
  await set(1801);a=await state();assert.equal(a.visibleLayers,0);
  await set(1699);a=await state();assert.equal(a.visibleLayers,0);
  console.log('PASS Editor37 5AB browser: 7 polygons, 4 physical curves, 15 sites, 26 zones retired, historic dates, archive click, 1799->1800.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
