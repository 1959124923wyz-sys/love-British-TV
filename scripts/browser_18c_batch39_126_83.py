#!/usr/bin/env python3
"""18C batch39 real desktop Chrome: 16 years, source drill-down, territories and legacy regressions."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results'
screens.mkdir(exist_ok=True)
opt=Options()
for x in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 opt.add_argument(x)
d=webdriver.Chrome(options=opt)
wait=WebDriverWait(d,120)
def js(c,*args):return d.execute_script(c,*args)
def audit(n):return js("return window[arguments[0]]?.getAudit?.()",n)
def b39():return audit('eighteenthBatch39Spatial')
def year(n):
 js("const c=document.querySelector('#jumpYear');c.value=String(arguments[0]);c.dispatchEvent(new Event('change',{bubbles:true}));",n)
 wait.until(lambda x:x.find_element(By.ID,'bigYear').text==str(n))
 wait.until(lambda x:b39() and b39()['year']==n)
def shot(s):d.save_screenshot(str(screens/('18c39-'+s+'.png')))
def has(term):return any(term in t for t in b39()['activeZoneTitles'])
cases=[[1700,["Anomabu Fort Charles英商旧堡","荷兰Sekondi Fort Orange"],["Otuam Tantumquery","Bushire英东印度公司Residency"],"1700-goldcoast-rivals"],[1730,["Otuam Tantumquery英商堡垒","Anomabu Fort Charles英商旧堡"],["Prampram Fort Vernon"],"1730-tantum"],[1742,["Prampram Fort Vernon","荷兰Sekondi Fort Orange"],["Winneba贸易堡"],"1742-vernon"],[1750,["Winneba贸易堡","英方在Whydah"],["Anomabu Fort William英堡完工"],"1750-british-goldcoast"],[1757,["Anomabu Fort William英堡完工","Otuam Tantumquery"],["法国瓜德罗普岛英军短期占领"],"1757-anomabu-new-fort"],[1759,["法国瓜德罗普岛英军短期占领","Prampram Fort Vernon"],["Bushire英东印度公司Residency开办"],"1759-guadeloupe"],[1762,["英国占Martinique法属殖民岛","Havana英军短期占港","Saint Lucia英国短期占据"],["瓜德罗普归还法国"],"1762-caribbean-capture"],[1763,["瓜德罗普归还法国","Bushire英东印度公司Residency开办","Havana撤出与西班牙恢复"],["英国占Martinique法属殖民岛"],"1763-treaty-reversals"],[1768,["Beyin Apollonia英方筑堡","Bushire英东印度公司Residency开办"],["Bushire Residency临时停办"],"1768-beyin-fort"],[1769,["Bushire Residency临时停办","Beyin Apollonia英方筑堡"],["Bushire英东印度公司Residency开办"],"1769-bushire-dormant"],[1775,["Bushire英国公司驻地重开","Thana东印度公司行政日志"],["Bushire Residency临时停办"],"1775-bushire-resumes"],[1782,["Saint Kitts法军短占","荷兰Sekondi Fort Orange"],["1783年Ada丹麦"],"1782-french-sugar-islands"],[1783,["Ada丹麦Fort Kongenstein","Havana撤出与西班牙恢复"],["Saint Kitts法军短占"],"1783-danish-post"],[1794,["Guadeloupe法国革命军夺回","Bushire英国公司驻地重开"],["Saint Kitts法军短占"],"1794-guadeloupe-restored"],[1798,["Baghdad东印度公司政治Residency成立","Grain/Kuwait收容公司交易站"],["法国瓜德罗普岛英军短期占领"],"1798-baghdad-kuwait"],[1799,["Baghdad东印度公司政治Residency成立","Prampram Fort Vernon"],["Havana英军短期占港"],"1799-factories"]]
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1759')
 wait.until(lambda _:all(audit(x) and audit(x)['loaded'] for x in (
  'eighteenthBatch39Spatial','eighteenthBatch38Spatial','eighteenthBatch37Spatial',
  'eighteenthBatch36Spatial','eighteenthMassSpatial','eighteenthSpatial')))
 wait.until(lambda _:js("return document.querySelector('#jumpYear')?.max==='1799'"))
 q=b39()
 assert (q['zoneCount'],q['siteCount'],q['phases'])==(126,83,209),q
 assert audit('eighteenthBatch38Spatial')['zoneCount']==127
 assert audit('eighteenthBatch37Spatial')['zoneCount']==141
 assert audit('eighteenthBatch36Spatial')['zoneCount']==130
 assert audit('eighteenthMassSpatial')['zoneCount']==81
 assert audit('eighteenthSpatial')['areaReferences']==24
 for n,present,absent,label in cases:
  year(n)
  s=b39()
  assert s['visibleAreas']>0 and s['visibleSites']>0,(n,s)
  assert all(has(x) for x in present),(n,'missing',present,s['activeZoneTitles'])
  assert all(not has(x) for x in absent),(n,'unexpected',absent,s['activeZoneTitles'])
  shot(label)
 year(1762)
 assert js("return document.querySelectorAll('.atlas-18c-b39-zone').length")>10
 assert js("return document.querySelectorAll('.atlas-18c-b39-site').length")>5
 js("document.querySelector('.atlas-18c-b39-site').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));")
 wait.until(lambda _: '第39批' in d.find_element(By.ID,'dossierBody').text)
 assert '历史来源' in d.find_element(By.ID,'dossierBody').text
 shot('source-dossier-click')
 js("const t=document.querySelector('#toggleControlAreas');t.checked=false;t.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:b39()['visibleAreas']==0 and b39()['visibleSites']==0)
 for name,field in [('eighteenthBatch38Spatial','visibleAreas'),('eighteenthBatch37Spatial','visibleAreas'),
    ('eighteenthBatch36Spatial','visibleZoneLayers'),('eighteenthMassSpatial','visibleZoneLayers'),
    ('eighteenthSpatial','visibleAreaLayerObjects')]:
  assert audit(name)[field]==0,(name,audit(name))
 shot('all-six-18c-area-layers-off')
 js("const t=document.querySelector('#toggleControlAreas');t.checked=true;t.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:b39()['visibleAreas']>0)
 year(1572)
 assert b39()['visibleAreas']==0 and b39()['visibleSites']==0
 shot('1572-prior-atlas-preserved')
 d.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda x:x.find_element(By.ID,'bigYear').text=='1699')
 assert not js('return Boolean(window.eighteenthBatch39Spatial)')
 print('PASS batch39 real 1780x1020 desktop: 126 outlines,83 icons,209 phases; 16 year flips, 6 legacy overlay generations, source-click, toggle, Tudor and public nonpreview.')
except Exception:
 shot('FAILED')
 raise
finally:
 d.quit()
