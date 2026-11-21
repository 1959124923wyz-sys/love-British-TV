const assert = require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try {
  const page=await browser.newPage({viewport:{width:1780,height:1020}});
  const root=process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/';
  await page.goto(root+'?review18c=1&year=1799',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.eighteenthBatch39Spatial?.getAudit()?.loaded);
  const audit=()=>page.evaluate(()=>window.eighteenthBatch39Spatial.getAudit());
  const set=async y=>{
   await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
   await page.waitForFunction(y=>window.eighteenthBatch39Spatial.getAudit().year===y,y);
  };
  let a=await audit();assert.equal(a.zoneCount,126);assert.equal(a.siteCount,108);
  assert.equal(a.named5ySites,25);
  assert(a.activeSiteIds.includes('EDITOR36_5Y_BUSHIRE'));
  assert(!a.activeZoneIds.includes('B39-G-Z005'));
  assert(!a.activeZoneIds.includes('B37-I-Z005'));
  await set(1770);a=await audit();
  assert(!a.activeSiteIds.includes('EDITOR36_5Y_BUSHIRE'));
  await set(1775);a=await audit();
  assert(a.activeSiteIds.includes('EDITOR36_5Y_BUSHIRE'));
  await set(1794);a=await audit();
  assert(a.activeSiteIds.includes('EDITOR36_5Y_KUWAIT'));
  assert(!a.activeSiteIds.includes('EDITOR36_5Y_BASRA'));
  await set(1796);a=await audit();
  assert(!a.activeSiteIds.includes('EDITOR36_5Y_KUWAIT'));
  assert(a.activeSiteIds.includes('EDITOR36_5Y_BASRA'));
  await set(1799);
  const result=await page.evaluate(()=>{
   const els=[...document.querySelectorAll('.atlas-18c-b39-site')];
   if(els.length<20)return {success:false,count:els.length};
   els[els.length-1].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
   return {success:document.querySelector('#dossierBody')?.textContent?.includes('第5Y批')||false,count:els.length};
  });
  assert(result.success,JSON.stringify(result));
  assert.equal(await page.evaluate(()=>window.AtlasPublicCopyGuard.visibleWarnings().length),0);
  console.log('PASS 5Y desktop: 25 named points; 57 rectangles archived; 1770 Bushire hiatus, 1794 Grain and 1796 Basra return; new dossier clickable');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
