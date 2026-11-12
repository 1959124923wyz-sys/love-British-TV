#!/usr/bin/env python3
"""Full 1497–1799 calendar sweep: check DOM text and a11y attributes each year."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True)
opt=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
 opt.add_argument(flag)
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,150)
def js(s,*args):return driver.execute_script(s,*args)
bad=[]
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1497')
 wait.until(lambda _:js("return !!window.AtlasPublicCopyGuard && document.querySelector('#jumpYear')?.max==='1799'"))
 for year in range(1497,1800):
  js("""
   const i=document.getElementById('jumpYear');i.value=String(arguments[0]);
   i.dispatchEvent(new Event('change',{bubbles:true}));
  """,year)
  wait.until(lambda _:js("return Number(document.getElementById('bigYear').textContent)===arguments[0]",year))
  result=js("""
   const g=window.AtlasPublicCopyGuard,offending=g.visibleWarnings();
   const attrs=[];
   for(const el of document.querySelectorAll('[title],[aria-label],[placeholder]')){
    for(const name of ['title','aria-label','placeholder']){
     if(el.hasAttribute(name)&&g.isWarning(el.getAttribute(name))){
      attrs.push({tag:el.tagName,name,value:el.getAttribute(name).slice(0,200)});
     }
    }
   }
   return {offending:offending.slice(0,10),attrs:attrs.slice(0,10)};
  """)
  if result['offending'] or result['attrs']:
   bad.append({'year':year,'issues':result})
  if year%10==0 or year in (1497,1599,1699,1799):
   print('ATLAS47_FULL_YEAR',year,'warnings',len(result['offending']),
         'attribute_warnings',len(result['attrs']),flush=True)
  if year in (1497,1599,1655,1762,1799):
   driver.save_screenshot(str(out/('atlas47-fullyear-'+str(year)+'.png')))
 assert not bad,'Reader-facing editorial notes in dated views: '+str(bad[:25])
 print('PASS atlas47 full-year sweep: all 303 years 1497–1799, no banned reader text or a11y attribute text.',flush=True)
except Exception:
 driver.save_screenshot(str(out/'atlas47-fullyear-FAILED.png'))
 raise
finally:
 driver.quit()
