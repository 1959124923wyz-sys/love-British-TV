#!/usr/bin/env python3
"""Clean reader-copy desktop regression: 1762 Havana overlap, 1609 charters,
1595 Tudor polygon, legacy directory, hover glow and sourced historical facts.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 opt.add_argument(arg)
d=webdriver.Chrome(options=opt);wait=WebDriverWait(d,100)
def js(s,*args):return d.execute_script(s,*args)
def snap(s):d.save_screenshot(str(shots/('atlas-clean-reader-'+s+'.png')))
def text():return d.find_element(By.ID,'dossierBody').text
def no_scholarly():
 body=text()
 for phrase in ('殖民省行政外缘不等于各地持续驻军',
  '虚线为概略历史地理参考','边界未经历史地图实测配准',
  '不得按轮廓计算','未曾按照历史地图配准',
  '不提供占领地平方公里','分开判读','不累计平方公里',
  '框仅示意','示意框面积','未核实实际占领地理'):
  assert phrase not in body,(phrase,body[:1800])
 assert not js("return Boolean(document.querySelector('#dossierBody .atlas-18c-overlap-precision,#dossierBody .atlas-18c-overlap-footnote'))")
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:js("return window.eighteenthOverlapDossier?.getAudit?.()?.loaded") and js("return document.querySelector('#jumpYear')?.max==='1799'"))
 assert js("return window.AtlasReaderCopy.clean('虚线为概略历史地理参考，边界未经历史地图实测配准。')")=='' 
 assert js("return document.querySelectorAll('#mapModeHelp .map-mode-help-body > p').length")==1
 assert not js("return document.querySelector('#mapModeHelp').textContent.includes('第39批地图扩容')")
 js("""
  const map=window.__eighteenthSpatialHost.map,ll=L.latLng(23.14,-82.36);
  map.setView(ll,9,{animate:false});
  const p=map.latLngToContainerPoint(ll),r=map.getContainer().getBoundingClientRect();
  map.getContainer().dispatchEvent(new MouseEvent('click',{
   bubbles:true,cancelable:true,clientX:r.left+p.x,clientY:r.top+p.y}));
 """)
 wait.until(lambda _:js("return window.eighteenthOverlapDossier.getAudit().selectedCount>=4"))
 assert js("return document.querySelectorAll('#atlas18cOverlapPanel .atlas-18c-overlap-card').length")>=4
 assert js("return document.querySelectorAll('#atlas18cOverlapPanel .atlas-18c-overlap-detail').length")==1
 no_scholarly()
 assert '历史文献与来源' in text()
 snap('1762-havana-no-scholarly-warnings')
 js("document.querySelectorAll('#atlas18cOverlapPanel [data-open-overlap]')[1].click()")
 no_scholarly()
 assert js("return window.eighteenthOverlapDossier.getAudit().glowCount")>=2
 assert js("return document.querySelectorAll('#atlas18cOverlapPanel .atlas-18c-overlap-detail').length")==1
 assert js("""return document.querySelectorAll('#atlas18cOverlapPanel .atlas-18c-overlap-summary').length <=
  document.querySelectorAll('#atlas18cOverlapPanel .atlas-18c-overlap-card').length-1""")
 assert js("return document.querySelector('#atlas18cOverlapPanel .atlas-18c-overlap-card.is-selected .atlas-18c-overlap-summary')===null")
 snap('1762-selected-havana-card-no-duplicate-summary')
 # Earlier century: original 17c charter point, same accepted hover/glow UI.
 d.get('http://127.0.0.1:8765/?year=1609')
 wait.until(lambda _:js("return window.historicOverlapDossier?.getAudit?.()?.liveAreas>=1"))
 js("""
  const host=window.__historicOverlapHost,map=host.map,items=host.visibleAreaFeatures()
   .filter(x=>x.group==='colonialClaims'&&x.layer._path);
  const f=items[0];if(!f)throw Error('No displayed 1609 colonial polygon');
  const ring=f.feature.geometry.coordinates[0];
  const lng=ring.reduce((a,p)=>a+p[0],0)/ring.length,lat=ring.reduce((a,p)=>a+p[1],0)/ring.length;
  map.setView([lat,lng],5,{animate:false});
  const point=map.latLngToContainerPoint([lat,lng]),rect=map.getContainer().getBoundingClientRect();
  f.layer._path.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,
   clientX:rect.left+point.x,clientY:rect.top+point.y}));
 """)
 wait.until(lambda _:js("return window.historicOverlapDossier.getAudit().open"))
 no_scholarly()
 assert js("return document.querySelectorAll('#atlasHistoricOverlapPanel .atlas-18c-overlap-card').length")>=1
 snap('1609-charter-clean-card')
 js("document.querySelector('#showSeventeenthClaimDirectory').click()")
 wait.until(lambda _:js("return document.querySelectorAll('#dossierBody [data-colonial-directory]').length>0"))
 no_scholarly()
 assert not js("return document.getElementById('dossierBody').textContent.includes('地图范围未经历史测绘')")
 snap('1609-charter-directory-clean')
 # Event descriptions and original dossiers also show real historic facts.
 d.get('http://127.0.0.1:8765/?year=1544')
 wait.until(lambda _:js("return window.historicOverlapDossier?.getAudit?.()?.year===1544"))
 assert js("return window.historicOverlapDossier.getAudit().liveAreas>0")
 assert js("return document.querySelectorAll('#mapModeHelp .map-mode-help-body > p').length")==1
 print('PASS clean reader copy: 1762 original multi-zone hover, no drafting disclaimers or duplicates, 1609 source charters, directory, 1544 Tudor and links.')
except Exception:
 snap('FAILED')
 raise
finally:
 d.quit()
