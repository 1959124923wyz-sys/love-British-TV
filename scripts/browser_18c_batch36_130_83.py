#!/usr/bin/env python3
"""Real desktop browser regression: 18C batch36 high-volume dynamic shapes."""
import pathlib
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=pathlib.Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results'
screens.mkdir(exist_ok=True)
options=Options()
for x in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 options.add_argument(x)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,90)
def js(code,*args):return driver.execute_script(code,*args)
def audit():return js('return window.eighteenthBatch36Spatial?.getAudit?.()')
def phase35():return js('return window.eighteenthMassSpatial?.getAudit?.()')
def phase34():return js('return window.eighteenthSpatial?.getAudit?.()')
def screenshot(s):driver.save_screenshot(str(screens/('18c-map36-'+s+'.png')))
def set_year(y):
 before=js("return {year:document.querySelector('#bigYear').textContent,input:document.querySelector('#jumpYear').value,max:document.querySelector('#jumpYear').max,min:document.querySelector('#jumpYear').min,notices:document.querySelector('#timelineNotice')?.textContent}")
 js("const el=document.querySelector('#jumpYear');el.value=String(arguments[0]);el.dispatchEvent(new Event('change',{bubbles:true}));",y)
 after=js("return {year:document.querySelector('#bigYear').textContent,input:document.querySelector('#jumpYear').value,max:document.querySelector('#jumpYear').max,min:document.querySelector('#jumpYear').min,notices:document.querySelector('#timelineNotice')?.textContent}")
 print('YEAR NAV',y,'BEFORE',before,'AFTER',after,flush=True)
 WebDriverWait(driver,12).until(lambda d:d.find_element(By.ID,'bigYear').text==str(y))
 wait.until(lambda _:audit() and audit()['year']==y)
def has(word):return any(word in v for v in audit()['activeZoneTitles'])
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:audit() and audit()['loaded'] and phase35() and phase35()['loaded'] and phase34() and phase34()['loaded'])
 # Leaflet layers may fetch faster than the unpublished 18C chronology and year-input cap.
 # Await the actual year navigation controller before automated year changes.
 wait.until(lambda _:js("return document.querySelector('#jumpYear')?.max==='1799' && Boolean(document.querySelector('#jumpYear')?.value)"))
 assert (audit()['zoneCount'],audit()['siteCount'],audit()['phaseCount'])==(130,83,221),audit()
 assert phase35()['zoneCount']==81 and phase34()['areaReferences']==24
 cases=[
 (1700,['大阴郁沼泽','罗亚尔港'],['博塞茹尔堡','1765后伯德万'],'1700-refuge-slavery'),
 (1739,['阿康蓬马龙','第一次马龙战争'],['塔基起义'],'1739-maroon-treaty'),
 (1755,['大普雷阿卡迪亚人','博塞茹尔堡'],['1757普拉西'],'1755-acadian-displacement'),
 (1760,['塔基起义','万迪瓦什'],['1764布克萨尔'],'1760-colonial-resistance'),
 (1763,['阿巴拉契亚北部禁垦','底特律原住民围困'],['塔基起义'],'1763-first-nations'),
 (1765,['伯德万地区','科罗曼提起义'],['1768斯坦威克斯堡原住民'],'1765-fiscal-transfer'),
 (1768,['斯坦威克斯堡原住民与英方会盟','纳迪亚地区'],['塔基起义'],'1768-border-treaty'),
 (1777,['萨拉托加','布兰迪万河'],['约克镇英军投降'],'1777-war'),
 (1781,['彭萨科拉','荷兰纳加帕蒂南'],['迈索尔割让丁迪古尔'],'1781-occupation-war'),
 (1782,['波纳尼英迈','法扎巴德'],['萨拉托加'],'1782-india-mysore'),
 (1792,['割让丁迪古尔','被围及割让条约'],['格林纳达费东'],'1792-mysore-partition'),
 (1795,['第二次马龙战争','格林纳达费东','英军太子港'],['哥印拜陀划归'],'1795-caribbean-resistance'),
 (1796,['在加拿大一侧筑防','费东起义高地'],['阿巴拉契亚北部禁垦'],'1796-forts-resistance'),
 (1799,['哥印拜陀划归','南卡纳拉沿海','库格王公'],['英军热雷米'],'1799-mysore'),
 ]
 for year,show,missing,label in cases:
  set_year(year)
  status=audit()
  assert status['visibleZoneLayers']>0 and status['visibleSiteLayers']>0,(year,status)
  assert all(has(word) for word in show),(year,'missing',show,status['activeZoneTitles'])
  assert all(not has(word) for word in missing),(year,'unexpected',missing,status['activeZoneTitles'])
  screenshot(label)
 set_year(1762)
 assert js("return document.querySelectorAll('.atlas-18c-b36-zone').length")>5
 assert js("return document.querySelectorAll('.atlas-18c-b36-site').length")>5
 js("document.querySelector('.atlas-18c-b36-site').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));")
 wait.until(lambda d:'第36批动态地理' in d.find_element(By.ID,'dossierBody').text)
 screenshot('click-dated-source')
 js("const t=document.querySelector('#toggleControlAreas');t.checked=false;t.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleZoneLayers']==0 and audit()['visibleSiteLayers']==0)
 assert phase35()['visibleZoneLayers']==0 and phase34()['visibleAreaLayerObjects']==0
 screenshot('all-territory-toggles-off')
 js("const t=document.querySelector('#toggleControlAreas');t.checked=true;t.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleZoneLayers']>0)
 set_year(1572)
 assert audit()['visibleZoneLayers']==0 and audit()['visibleSiteLayers']==0
 screenshot('tudor-1572-protected')
 driver.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda d:d.find_element(By.ID,'bigYear').text=='1699')
 assert not js('return Boolean(window.eighteenthBatch36Spatial)')
 print('PASS batch36 130 reference zones, 83 labelled cores, 221 phases across 14 historical samples, historical dossier, 18C controls, 1572 old layers, hidden default.')
except Exception:
 screenshot('FAILED')
 raise
finally:
 driver.quit()
