const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1780,height:1020}});page.setDefaultTimeout(45000);
 await page.goto((process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/')+'?review18c=1&review19c=1&year=1780',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.eighteenthEditor37FiveAC?.getAudit()?.loaded===true);
 await page.waitForFunction(()=>document.querySelector('#workspace')?.dataset.atlasReady==='true');
 const audit=()=>page.evaluate(()=>window.eighteenthEditor37FiveAC.getAudit());
 const set=async y=>{await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
  await page.waitForFunction(y=>window.eighteenthEditor37FiveAC.getAudit().year===y,y)};
 await set(1780);let a=await audit();assert.equal(a.featureCount,38);
 assert.equal(a.polygonCount,22);assert.equal(a.riverCoastCount,5);assert.equal(a.pointCount,11);
 assert(a.activeIds.includes('EDITOR37_5AC_ABPP_32'));assert(a.activeIds.includes('EDITOR37_5AC_ABPP_28'));
 assert(!await page.evaluate(()=>window.eighteenthBatch38Spatial.getAudit().activeZoneIds.includes('B38-S-Z023')));
 await set(1755);a=await audit();
 assert(a.activeIds.includes('EDITOR37_5AC_FORT_CUMBERLAND_CHIGNECTO'));
 assert(a.activeIds.includes('EDITOR37_5AC_GRAND_PRE'));
 assert(!a.activeIds.includes('EDITOR37_5AC_ABPP_28'));
 await set(1760);a=await audit();assert(a.activeIds.includes('EDITOR37_5AC_WANDIWASH'));
 await set(1777);a=await audit();
 assert(a.activeIds.includes('EDITOR37_5AC_ABPP_69'));
 assert(a.activeIds.includes('EDITOR37_5AC_ABPP_45'));
 await set(1781);a=await audit();
 assert(a.activeIds.includes('EDITOR37_5AC_ABPP_7'));
 assert(a.activeIds.includes('EDITOR37_5AC_ABPP_23'));
 assert(a.activeIds.includes('EDITOR37_5AC_PORTO_NOVO'));
 await page.evaluate(()=>window.__eighteenthSpatialHost.map.setView([35.14,-81.8],11,{animate:false}));
 await page.waitForFunction(()=>!!document.querySelector('[data-editor37-5ac-id="EDITOR37_5AC_ABPP_23"]'));
 await page.evaluate(()=>{
  document.querySelector('[data-editor37-5ac-id="EDITOR37_5AC_ABPP_23"]').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
 });
 await page.waitForFunction(()=>document.querySelector('#dossierBody')?.textContent?.includes('考彭斯'));
 assert((await page.locator('#dossierBody').innerText()).includes('历史来源'));
 assert.equal(await page.evaluate(()=>window.AtlasPublicCopyGuard.visibleWarnings().length),0);
 await set(1799);a=await audit();assert(!a.activeIds.includes('EDITOR37_5AC_ABPP_7'));
 await set(1800);a=await audit();assert.equal(a.activeIds.filter(x=>x.includes('COAST')||x.includes('RIVER')||x.includes('SHORE')).length,5);
 await set(1801);a=await audit();assert.equal(a.visibleLayers,0);
 await set(1699);a=await audit();assert.equal(a.visibleLayers,0);
 console.log('PASS Editor37 5AC Chromium: ABPP study areas, Royal Collection India sites, Acadian expulsion, 1780/1781/1800 and archive clicks.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
