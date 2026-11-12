#!/usr/bin/env python3
"""Batch 38: real 1780×1020 desktop Chrome time-synchronized 18C map and all legacy overlay regression."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results';screens.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
wait=WebDriverWait(d,100)
def js(code,*args):return d.execute_script(code,*args)
def audit():return js('return window.eighteenthBatch38Spatial?.getAudit?.()')
def b37():return js('return window.eighteenthBatch37Spatial?.getAudit?.()')
def b36():return js('return window.eighteenthBatch36Spatial?.getAudit?.()')
def b35():return js('return window.eighteenthMassSpatial?.getAudit?.()')
def b34():return js('return window.eighteenthSpatial?.getAudit?.()')
def shot(name):d.save_screenshot(str(screens/('18c38-'+name+'.png')))
def year(y):
 js("const x=document.querySelector('#jumpYear');x.value=String(arguments[0]);x.dispatchEvent(new Event('change',{bubbles:true}));",y)
 wait.until(lambda x:x.find_element(By.ID,'bigYear').text==str(y))
 wait.until(lambda x:audit() and audit()['year']==y)
def has(t):return any(t in s for s in audit()['activeZoneTitles'])
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1780')
 wait.until(lambda _:audit() and audit()['loaded'] and b37() and b37()['loaded'] and b36() and b36()['loaded'] and b35() and b35()['loaded'] and b34() and b34()['loaded'])
 wait.until(lambda _:js("return document.querySelector('#jumpYear')?.max==='1799'"))
 assert (audit()['zoneCount'],audit()['siteCount'],audit()['phases'])==(127,90,217),audit()
 assert b37()['zoneCount']==141 and b36()['zoneCount']==130 and b35()['zoneCount']==81 and b34()['areaReferences']==24
 examples=[
  (1714,['1714年后York Factory'],['Prince of Wales Fort英军'],'1714-york-recovered'),
  (1731,['Prince of Wales Fort英公司石堡建设'],['Churchill River Post英国公司'],'1731-stone-fort-start'),
  (1756,['1756年Bengal纳瓦卜','1714年后York Factory'],['1757年Clive重新攻取'],'1756-calcutta-lost'),
  (1757,['1757年Clive重新攻取','1757年Plassey'],['1756年Bengal纳瓦卜'],'1757-calcutta-recapture'),
  (1761,['1761年Pondicherry法国商馆'],['1765年后Pondicherry'],'1761-india-war'),
  (1765,['1765年公司获得Bengal','1765年后Pondicherry法属'],['1761年Pondicherry法国商馆'],'1765-diwan-french-recovery'),
  (1774,['1774 Cumberland House'],['1782法国舰队攻取'],'1774-hbc-inland'),
  (1780,['1780年英军在卡姆登','1780年Ninety Six','1780年Fort Watson'],['1781年Fort Watson美军'],'1780-british-garrisons'),
  (1781,['1781年Fort Watson美军','1781年Fort Cornwallis投降','1780—1781 Charleston'],['1780年Fort Watson英方'],'1781-forts-fall'),
  (1782,['1782法国舰队攻取','1782年Charleston撤军'],['Prince of Wales Fort英军商堡'],'1782-twin-retreat'),
  (1783,['1783—1787 York Factory','1783后Fort Churchill'],['1782法国舰队攻取'],'1783-trading-rebuild'),
  (1784,['1784年Tipu Sultan','1784年Burma征服Arakan'],['1780年英军在卡姆登'],'1784-mangalore-treaty'),
  (1788,['1788后York Factory III'],['1783—1787 York Factory'],'1788-york-new-post'),
  (1796,['1796年Niagara河','1796—1799加拿大河岸Fort George'],['Niagara旧英军堡延迟'],'1796-niagara-retreat'),
  (1799,['1799年Seringapatam英军','1799年Mysore保留本地王室'],['1784年Tipu Sultan'],'1799-mysore-partition'),
 ]
 for yr,present,absent,name in examples:
  year(yr)
  q=audit()
  assert q['visibleAreas']>0 and q['visibleSites']>0,(yr,q)
  assert all(has(x) for x in present),(yr,'missing',present,q['activeZoneTitles'])
  assert all(not has(x) for x in absent),(yr,'unexpected',absent,q['activeZoneTitles'])
  shot(name)
 year(1780)
 assert js("return document.querySelectorAll('.atlas-18c-b38-zone').length")>8
 assert js("return document.querySelectorAll('.atlas-18c-b38-site').length")>7
 js("document.querySelector('.atlas-18c-b38-site').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));")
 wait.until(lambda _: '第38批' in d.find_element(By.ID,'dossierBody').text)
 shot('dossier-original-source')
 js("const c=document.querySelector('#toggleControlAreas');c.checked=false;c.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleAreas']==0 and audit()['visibleSites']==0)
 assert b37()['visibleAreas']==0 and b36()['visibleZoneLayers']==0 and b35()['visibleZoneLayers']==0 and b34()['visibleAreaLayerObjects']==0
 shot('all-5-layer-sets-hidden')
 js("const c=document.querySelector('#toggleControlAreas');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleAreas']>0)
 year(1572)
 assert audit()['visibleAreas']==0 and audit()['visibleSites']==0
 shot('1572-pre18c-map-regression')
 d.get('http://127.0.0.1:8765/?year=1780')
 wait.until(lambda x:x.find_element(By.ID,'bigYear').text=='1699')
 assert not js('return Boolean(window.eighteenthBatch38Spatial)')
 print('PASS Batch38 real 1780x1020 Chrome, 15 dates, 127 areas,90 cores,217 phases, old 34-37 dynamic overlays, click dossier, toggles, 1572, preview isolation')
except Exception:
 shot('FAILED')
 raise
finally:
 d.quit()
