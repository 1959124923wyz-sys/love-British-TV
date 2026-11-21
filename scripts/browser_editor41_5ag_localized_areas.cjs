const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1780,height:1020}});
  page.setDefaultTimeout(45000);
  await page.goto((process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/')+
    '?review18c=1&review19c=1&year=1783',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.eighteenthMassSpatial?.getAudit()?.loaded===true);
  await page.waitForFunction(()=>document.querySelector('#workspace')?.dataset.atlasReady==='true');
  const audit=()=>page.evaluate(()=>window.eighteenthMassSpatial.getAudit());
  const set=async y=>{
   await page.evaluate(y=>window.atlasStoryBridge.setYear(y),y);
   await page.waitForFunction(y=>window.eighteenthMassSpatial.getAudit().year===y,y);
  };
  await set(1783);
  let a=await audit();
  assert(!a.activeZones.includes('GREAT_LAKES_POSTS'));
  for(const id of ['FORT_NIAGARA_MAIN','DETROIT_FORT_LERNOULT','MACKINAC_ISLAND_FORT'])
   assert(a.activeRegionalZones.includes(id),'missing separate British fort '+id);
  await set(1788);
  a=await audit();
  assert(!a.activeZones.includes('NSW_CROWN_CLAIM'));
  for(const id of ['SYDNEY_MARINE_CAMP_1788','SYDNEY_CONVICT_CAMPS_1788',
                    'SYDNEY_GOVERNOR_GARDEN_1788'])
   assert(a.activeRegionalZones.includes(id));
  assert(a.activeRegionalSites.includes('WARRANE_SYDNEY_COVE'));
  await set(1789);
  a=await audit();
  assert(!a.activeZones.includes('NSW_CROWN_CLAIM'));
  assert(a.activeRegionalSites.includes('WARRANE_SYDNEY_COVE'));
  assert(!a.activeRegionalZones.includes('SYDNEY_MARINE_CAMP_1788'));
  await set(1790);
  assert((await audit()).activeRegionalZones.includes('PARRAMATTA_CONVICT_HUT_ROWS'));
  await set(1794);
  a=await audit();
  assert(!a.activeZones.includes('NSW_CROWN_CLAIM'));
  for(const id of ['HAWKESBURY_1794_GRANT_39','HAWKESBURY_1794_GRANT_50',
                   'HAWKESBURY_1794_GRANT_68'])
   assert(a.activeRegionalZones.includes(id));
  await set(1795);
  a=await audit();
  assert(!a.activeRegionalZones.includes('HAWKESBURY_1794_GRANT_50'));
  for(const id of ['FORT_NIAGARA_MAIN','DETROIT_FORT_LERNOULT','MACKINAC_ISLAND_FORT'])
   assert(a.activeRegionalZones.includes(id));
  await set(1796);
  a=await audit();
  assert(!a.activeZones.includes('GREAT_LAKES_POSTS'));
  assert(a.activeRegionalSites.includes('WARRANE_SYDNEY_COVE'));
  await set(1799);
  a=await audit();
  assert(!a.activeZones.includes('NSW_CROWN_CLAIM'));
  assert(!a.activeZones.includes('CAROLINA_PROPRIETORS'));
  assert(a.activeRegionalZones.includes('PARRAMATTA_GOVERNMENT_FARM_1792'));
  assert.equal(await page.evaluate(()=>window.AtlasPublicCopyGuard.visibleWarnings().length),0);
  await set(1705);
  assert((await audit()).activeZones.includes('CAROLINA_PROPRIETORS'),
   'do not remove the one still unverified Carolina charter envelope');
  console.log('PASS 5AG desktop: dated 1783-1795 three forts, 1788 Sydney camps, 1790-1799 Parramatta farms, no oversized legal rectangles in 1799; early Carolina retained.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
