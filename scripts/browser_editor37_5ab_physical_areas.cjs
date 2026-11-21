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
  // Preserve original date-specific source at the Dutch Patience Fort.
  const clickAt=async (lat,lon)=>{
   const pos=await page.evaluate(([lat,lon])=>{
    const map=window.__eighteenthSpatialHost.map;
    const xy=map.latLngToContainerPoint([lat,lon]);
    const bounds=map.getContainer().getBoundingClientRect();
    return [bounds.left+xy.x,bounds.top+xy.y];
   },[lat,lon]);
   await page.mouse.click(...pos);
  };
  for(const [y,stage] of [[1782,/忍耐堡.*英军攻占/],[1785,/忍耐堡.*荷方恢复据点/]]){
   await set(y);
   await page.evaluate(()=>window.__eighteenthSpatialHost.map.setView([5.286231,-0.728184],15,{animate:false}));
   await clickAt(5.286231,-0.728184);
   await page.locator('#dossierBody h2').filter({hasText:stage}).or(page.locator(
    '[data-overlap-id="18c:GOLD_COAST_APAM_PATIENCE_FORT"] .atlas-18c-overlap-title'
   ).filter({hasText:stage})).waitFor();
  }
  await set(1799);
  await page.evaluate(()=>window.__eighteenthSpatialHost.map.setView([5.5467,-0.18272],15,{animate:false}));
  await clickAt(5.5467,-0.18272);
  await page.locator('#dossierBody h2').filter({hasText:/奥苏.*王室暂停撤堡令/}).or(page.locator(
   '[data-overlap-id="18c:GOLD_COAST_ACCRA_CHRISTIANSBORG"] .atlas-18c-overlap-title'
  ).filter({hasText:/奥苏.*王室暂停撤堡令/})).waitFor();
  await set(1800);a=await state();
  assert.equal(a.visibleLayers,4);assert.equal(a.activeIds.length,4);
  await set(1801);a=await state();assert.equal(a.visibleLayers,0);
  await set(1699);a=await state();assert.equal(a.visibleLayers,0);
  console.log('PASS Editor37 5AB browser: 7 polygons, 4 physical curves, 15 sites, 26 zones retired, historic dates, archive click, 1799->1800.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
