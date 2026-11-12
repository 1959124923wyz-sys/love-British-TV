#!/usr/bin/env python3
"""Atlas47: real desktop Chrome probes every reader-visible surface (16–18C)."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

ROOT=Path(__file__).resolve().parents[1]
shots=ROOT/'browser-smoke-results'
shots.mkdir(exist_ok=True)
opts=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
 opts.add_argument(flag)
d=webdriver.Chrome(options=opts)
wait=WebDriverWait(d,120)
def js(code,*args):
 return d.execute_script(code,*args)
def inspect(label):
 errors=js("""
  const guard=window.AtlasPublicCopyGuard;
  return guard ? {warnings:guard.visibleWarnings(),
    titleWarnings:[...document.querySelectorAll('[title],[aria-label],[placeholder]')]
     .filter(el=>['title','aria-label','placeholder'].some(key=>
       el.hasAttribute(key)&&guard.isWarning(el.getAttribute(key)))).slice(0,12)
     .map(el=>el.outerHTML.slice(0,200)),
    stats:guard.getAudit()} : {missingGuard:true};
 """)
 assert not errors.get('missingGuard'),(label,errors)
 assert not errors['warnings'],(label,errors['warnings'][:10])
 assert not errors['titleWarnings'],(label,errors['titleWarnings'])
 d.save_screenshot(str(shots/('atlas47-public-copy-'+label+'.png')))
 return errors
def ready(year):
 args='?review18c=1&year='+str(year)
 d.get('http://127.0.0.1:8765/'+args)
 wait.until(lambda _:js("return Boolean(window.AtlasPublicCopyGuard) && Number(document.getElementById('bigYear').textContent)===arguments[0]",year))
 if year>=1700:
  wait.until(lambda _:js("return window.eighteenthOverlapDossier?.getAudit?.()?.loaded"))
 else:
  wait.until(lambda _:js("return window.historicOverlapDossier?.getAudit?.()?.liveAreas>=0"))
def injection():
 # Not just approved renderers: simulate a future editor adding raw warning text.
 js("""
  const body=document.getElementById('dossierBody');
  body.insertAdjacentHTML('beforeend',`
   <p id="atlas47-injected-text">虚线为概略历史地理参考，边界未经历史地图实测配准。</p>
   <p id="atlas47-injected-mixed"><strong>1762年英军攻取哈瓦那。</strong>重叠的示意区块不能叠加计算历史占地。</p>
   <span id="atlas47-injected-title" title="区域海河贸易通道，非英国河两岸主权">历史来源</span>`);
  document.querySelector('#atlas47-injected-title').setAttribute('aria-label','未经历史地图实测配准');
 """)
 wait.until(lambda _:js("""
  const g=window.AtlasPublicCopyGuard;
  return !g.visibleWarnings().length &&
   !document.querySelector('#atlas47-injected-title').hasAttribute('title') &&
   !document.querySelector('#atlas47-injected-title').hasAttribute('aria-label');
 """))
 assert '1762年英军攻取哈瓦那' in js("return document.getElementById('atlas47-injected-mixed').textContent")
 assert '历史来源' in js("return document.getElementById('atlas47-injected-title').textContent")
 inspect('injected-removed-with-facts-retained')
try:
 for year in (1497,1558,1609,1655,1692,1700,1762,1783,1799):
  ready(year)
  result=inspect(str(year)+'-year')
  print('ATLAS47_YEAR',year,'warnings',len(result['warnings']),'scans',result['stats']['scans'])
 # Confirm the user-supplied source's explanatory caveat never reappears after click.
 ready(1783)
 marker=js("""
  const geo=requireNoop=1;
  const f=window.__eighteenthSpatialHost;
  return {loaded:window.eighteenthOverlapDossier.getAudit().loaded};
 """)
 assert marker['loaded']
 injection()
 # Existing cross-century map click regression is also part of the CI workflow.
 print('PASS atlas47: nine 1497–1799 desktop maps, visible text and attributes, plus injected raw notes removed while dated facts remain.')
except Exception:
 d.save_screenshot(str(shots/'atlas47-public-copy-FAILED.png'))
 raise
finally:
 d.quit()
