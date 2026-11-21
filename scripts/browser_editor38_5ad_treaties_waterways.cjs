const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1780,height:1020}});
  page.setDefaultTimeout(45000);
  await page.goto((process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/')+
   '?review18c=1&review19c=1&year=1780',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.eighteenthEditor38FiveAD?.getAudit()?.loaded===true);
  await page.waitForFunction(()=>document.querySelector('#workspace')?.dataset.atlasReady==='true');
  const audit=()=>page.evaluate(()=>window.eighteenthEditor38FiveAD.getAudit());
  const set=async y=>{
   await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
   await page.waitForFunction(y=>window.eighteenthEditor38FiveAD.getAudit().year===y,y);
  };
  let a=await audit();assert.equal(a.featureCount,27);
  assert.equal(a.pointCount,26);assert.equal(a.waterwayCount,1);
  await set(1763);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_FORT_PITT_1763'));
  assert(a.activeIds.includes('EDITOR38_5AD_PRESQUE_ISLE_1763'));
  assert(!a.activeIds.includes('EDITOR38_5AD_BELIZE_HONDO_1783'));
  await set(1765);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_JAMAICA_ST_MARY'));
  await set(1774);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_CUMBERLAND_HOUSE_CREE'));
  assert(a.activeIds.includes('EDITOR38_5AD_HAYES_SASKATCHEWAN_WATERWAYS'));
  await set(1780);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_ROCKY_MOUNT_1780'));
  assert(a.activeIds.includes('EDITOR38_5AD_FISHING_CREEK_1780'));
  assert(a.activeIds.includes('EDITOR38_5AD_ARCOT_1780'));
  await set(1783);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_BELIZE_HONDO_1783'));
  assert(a.activeIds.includes('EDITOR38_5AD_BELIZE_RIVER_1783'));
  assert(!a.activeIds.includes('EDITOR38_5AD_BELIZE_SIBUN_1786'));
  await set(1786);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_BELIZE_SIBUN_1786'));
  await page.evaluate(()=>window.__eighteenthSpatialHost.map.setView([17.497,-88.191],10,{animate:false}));
  await page.waitForFunction(()=>!!document.querySelector('[data-editor38-5ad-id="EDITOR38_5AD_BELIZE_RIVER_1783"]'));
  await page.evaluate(()=>{
   document.querySelector('[data-editor38-5ad-id="EDITOR38_5AD_BELIZE_RIVER_1783"]')
    .dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  });
  await page.waitForFunction(()=>document.querySelector('#dossierBody')?.textContent?.includes('伯利兹河口'));
  assert((await page.locator('#dossierBody').innerText()).includes('历史来源'));
  assert.equal(await page.evaluate(()=>window.AtlasPublicCopyGuard.visibleWarnings().length),0);
  await set(1799);a=await audit();
  assert(a.activeIds.includes('EDITOR38_5AD_TANJORE_1799'));
  assert(a.activeIds.includes('EDITOR38_5AD_ANJENGO_FORT'));
  await set(1800);a=await audit();
  assert.deepEqual(a.activeIds,['EDITOR38_5AD_HAYES_SASKATCHEWAN_WATERWAYS']);
  await set(1801);a=await audit();assert.equal(a.visibleLayers,0);
  await set(1699);a=await audit();assert.equal(a.visibleLayers,0);
  console.log('PASS Editor38 5AD Chromium: sourced river topology, 1763/1774/1780, Belize 1783/1786, India 1799, 1800 and source clicking.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
