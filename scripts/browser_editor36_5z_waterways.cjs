const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1780,height:1020}});
  page.setDefaultTimeout(45000);
  const url=(process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/')+'?review18c=1&review19c=1&year=1799';
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.eighteenthEditor36FiveZ?.getAudit()?.loaded===true);
  await page.waitForFunction(()=>document.querySelector('#workspace')?.dataset.atlasReady==='true');
  const set=async y=>{
   await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
   await page.waitForFunction(y=>window.eighteenthEditor36FiveZ.getAudit().year===y,y);
  };
  const state=()=>page.evaluate(()=>window.eighteenthEditor36FiveZ.getAudit());
  await set(1799);
  let a=await state();
  assert.equal(a.areaCount,10);assert.equal(a.lineCount,8);
  assert.equal(a.activeIds.length,18);assert.equal(a.visibleLayers,18);
  await set(1731);a=await state();assert(!a.activeIds.includes('EDITOR36_5Z_LAKE_OF_WOODS'));
  await set(1732);a=await state();assert(a.activeIds.includes('EDITOR36_5Z_LAKE_OF_WOODS'));
  await set(1762);a=await state();assert(!a.activeIds.includes('EDITOR36_5Z_LAKE_HURON'));
  await set(1763);a=await state();assert(a.activeIds.includes('EDITOR36_5Z_LAKE_HURON'));
  await set(1773);a=await state();assert(!a.activeIds.includes('EDITOR36_5Z_SASKATCHEWAN_RIVER'));
  await set(1774);a=await state();assert(a.activeIds.includes('EDITOR36_5Z_SASKATCHEWAN_RIVER'));
  await set(1799);a=await state();assert.equal(a.visibleLayers,18);
  assert(!await page.evaluate(()=>window.eighteenthBatch38Spatial.getAudit().activeZoneIds.includes('B38-H-Z018')));
  assert(!await page.evaluate(()=>window.eighteenthBatch36Spatial.getAudit().activeZoneIds.includes('B36-Z030')));
  await page.evaluate(()=>window.__eighteenthSpatialHost.map.setView([52.6,-97.7],6));
  await page.waitForFunction(()=>document.querySelectorAll('.atlas-18c-5z-lake[data-hydro-id="EDITOR36_5Z_LAKE_WINNIPEG"]').length>0);
  await page.evaluate(()=>{
   document.querySelector('.atlas-18c-5z-lake[data-hydro-id="EDITOR36_5Z_LAKE_WINNIPEG"]').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  });
  await page.waitForFunction(()=>document.querySelector('#dossierBody')?.textContent?.includes('温尼伯湖'));
  assert((await page.locator('#dossierBody').innerText()).includes('历史来源'));
  assert.equal(await page.evaluate(()=>window.AtlasPublicCopyGuard.visibleWarnings().length),0);
  const shots=path.join(__dirname,'..','browser-smoke-results');fs.mkdirSync(shots,{recursive:true});
  await page.screenshot({path:path.join(shots,'18c-5z-1799-waterways.png')});
  await set(1800);a=await state();assert.equal(a.activeIds.length,18);assert.equal(a.visibleLayers,18);
  await set(1801);a=await state();assert.equal(a.activeIds.length,0);assert.equal(a.visibleLayers,0);
  await set(1699);a=await state();assert.equal(a.visibleLayers,0);
  console.log('PASS 5Z desktop historical waterways: physical outlines, portage evidence, year changes, original source dossier and 1799→1800.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
