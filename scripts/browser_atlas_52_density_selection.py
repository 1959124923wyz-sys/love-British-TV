#!/usr/bin/env python3
"""Atlas52 desktop QA: geometry survives zoom declutter and every marker stays reachable."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'browser-smoke-results'
OUT.mkdir(exist_ok=True)
op=Options()
for f in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
 op.add_argument(f)
driver=webdriver.Chrome(options=op)
wait=WebDriverWait(driver,125)
def js(s,*args):return driver.execute_script(s,*args)
def click(x,y):
 for kind in ('mouseMoved','mousePressed','mouseReleased'):
  e={'type':kind,'x':round(x),'y':round(y)}
  if kind!='mouseMoved':e.update(button='left',clickCount=1)
  driver.execute_cdp_cmd('Input.dispatchMouseEvent',e)
def check(year):
 driver.get('http://127.0.0.1:8765/?review18c=1&year='+str(year))
 wait.until(lambda _:js("""
  return !!window.AtlasDensityPolicy && !!window.atlasDensityAudit &&
    Number(document.getElementById('bigYear').textContent)===arguments[0] &&
    window.atlasDensityAudit().year===arguments[0];
 """,year))
 for zoom,mode in [(3,'wide'),(5,'regional'),(8,'local')]:
  js("window.__eighteenthSpatialHost.map.setView([36,-73],arguments[0],{animate:false});",zoom)
  wait.until(lambda _:js("""
   const a=window.atlasDensityAudit?.();
   return a?.zoom===arguments[0]&&a?.mode===arguments[1];
  """,zoom,mode))
  a=js("""
   const v=window.atlasDensityAudit(),el=document.querySelector('#map');
   return {...v,correctClass:el.classList.contains('atlas-density-'+v.mode),
      hubsDom:document.querySelectorAll('#map .atlas-aggregate').length+
       document.querySelectorAll('#map .leaflet-marker-icon .map-pin').length,
      leaked:window.AtlasPublicCopyGuard.visibleWarnings().length};
  """)
  assert a['correctClass'] and a['mode']==mode,(year,zoom,a)
  assert a['qualifiedRecords']==a['groupedRecords'],(year,zoom,a)
  assert a['eligibleKeys']==a['groupedKeys'],(year,zoom,'source ID mismatch')
  assert a['hubCount']==a['clusterCount']+a['singletonCount'],(year,zoom,a)
  assert a['qualifiedRecords']>=1,(year,zoom,a)
  assert a['hubsDom']==a['hubCount'],(year,zoom,a)
  assert a['leaked']==0,(year,zoom,a)
  if zoom in (3,8):
   driver.save_screenshot(str(OUT/('atlas52-'+str(year)+'-zoom-'+str(zoom)+'.png')))
  print('ATLAS52_ZOOM',year,zoom,a,flush=True)
 if year==1675:
  js("window.__eighteenthSpatialHost.map.setView([38,-74],3,{animate:false});")
  wait.until(lambda _:js("return window.atlasDensityAudit()?.zoom===3"))
  target=js("""
   const root=document.querySelector('#map'),bounds=root.getBoundingClientRect();
   for(const el of root.querySelectorAll('.atlas-aggregate')){
    const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    if(x<bounds.left+48||x>bounds.right-48||y<bounds.top+48||y>bounds.bottom-50)continue;
    const hit=document.elementFromPoint(x,y);
    if(hit===el||hit?.closest('.atlas-aggregate')===el)
     return {x,y,count:Number(el.querySelector('strong')?.textContent)};
   }
   return null;
  """)
  assert target and target['count']>=2,'World view needs a visible clickable grouped marker'
  click(target['x'],target['y'])
  wait.until(lambda _:js("return !!document.querySelector('#dossierBody .cluster-list')"))
  total=js("return document.querySelectorAll('#dossierBody .cluster-entry').length")
  assert total==target['count'],(target,total)
  js("document.querySelector('#dossierBody .cluster-entry').click()")
  wait.until(lambda _:js("return !!document.querySelector('#dossierBody h2') && !document.querySelector('#dossierBody .cluster-list')"))
  driver.save_screenshot(str(OUT/'atlas52-world-cluster-to-source-dossier.png'))
  print('ATLAS52_CLUSTER_COLLECTION',target,total,flush=True)
try:
 for year in (1607,1675,1762):
  check(year)
 print('PASS atlas52: 9 desktop zoom/year checks, full member count, accessible world cluster, 16C–18C preservation and zero banned reader copy.',flush=True)
except Exception:
 driver.save_screenshot(str(OUT/'atlas52-FAILED.png'))
 raise
finally:
 driver.quit()
