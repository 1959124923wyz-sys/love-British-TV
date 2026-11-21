const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1780,height:1020}});
  page.setDefaultTimeout(45000);
  const mockPNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==','base64');
  await page.route('**/ImageServer/exportImage*',route=>
   route.fulfill({status:200,contentType:'image/png',body:mockPNG}));
  await page.goto((process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/')+
   '?review18c=1&review19c=1&year=1790',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.atlasHistoricalSurvey5AF?.getAudit()?.loaded===true);
  await page.waitForFunction(()=>document.querySelector('#workspace')?.dataset.atlasReady==='true');
  const audit=()=>page.evaluate(()=>window.atlasHistoricalSurvey5AF.getAudit());
  const set=async y=>{
   await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
   await page.waitForFunction(y=>window.atlasHistoricalSurvey5AF.getAudit().year===y,y);
  };
  await set(1790);
  let a=await audit();
  assert.equal(a.source_archive_reference,'NMC 17879');
  assert.equal(a.source_map_year,1790);
  assert.equal(a.visible,false);
  assert.equal(a.enabled,false);
  assert.equal(a.real_eighteenth_century_control_polygon,false);
  assert.equal(await page.locator('#showNiagara1790Survey').isEnabled(),true);
  await page.locator('#mapModeHelp summary').click();
  await page.locator('#showNiagara1790Survey').check();
  await page.waitForFunction(()=>window.atlasHistoricalSurvey5AF.getAudit().visible===true);
  a=await audit();
  assert.equal(a.enabled,true);
  assert.equal(await page.locator('img.leaflet-image-layer').count(),1);
  assert((await page.locator('img.leaflet-image-layer').getAttribute('src')).includes('bboxSR=4326'));
  assert((await page.locator('img.leaflet-image-layer').getAttribute('src')).includes('imageSR=4326'));
  await set(1791);
  a=await audit();
  assert.equal(a.visible,false);
  assert.equal(a.enabled,false);
  assert.equal(await page.locator('#showNiagara1790Survey').isDisabled(),true);
  await set(1790);
  assert.equal(await page.locator('#showNiagara1790Survey').isEnabled(),true);
  assert.equal((await audit()).visible,false);
  await page.locator('#showNiagara1790Survey').check();
  await page.waitForFunction(()=>window.atlasHistoricalSurvey5AF.getAudit().visible===true);
  await page.locator('#showNiagara1790Survey').uncheck();
  assert.equal((await audit()).visible,false);
  await set(1799);
  assert.equal((await audit()).visible,false);
  assert.equal(await page.locator('#showNiagara1790Survey').isDisabled(),true);
  console.log('PASS 5AF desktop: 1790 original survey opt-in overlays the map, supports source attribution and automatically hides on other years.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
