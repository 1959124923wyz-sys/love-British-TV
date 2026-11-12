#!/usr/bin/env python3
"""Batch37 actual 1780x1020 desktop Chromium regression across 3 independent datasets."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results'
screens.mkdir(exist_ok=True)
o=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 o.add_argument(arg)
driver=webdriver.Chrome(options=o)
wait=WebDriverWait(driver,100)
def js(s,*a):return driver.execute_script(s,*a)
def b37():return js('return window.eighteenthBatch37Spatial?.getAudit?.()')
def b36():return js('return window.eighteenthBatch36Spatial?.getAudit?.()')
def b35():return js('return window.eighteenthMassSpatial?.getAudit?.()')
def b34():return js('return window.eighteenthSpatial?.getAudit?.()')
def snapshot(name):driver.save_screenshot(str(screens/('18c-b37-'+name+'.png')))
def set_year(year):
 js("const i=document.querySelector('#jumpYear');i.value=String(arguments[0]);i.dispatchEvent(new Event('change',{bubbles:true}));",year)
 wait.until(lambda d:d.find_element(By.ID,'bigYear').text==str(year))
 wait.until(lambda _:b37()['year']==year)
def active(word):return any(word in t for t in b37()['activeZoneTitles'])
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1700')
 wait.until(lambda _:b37() and b37()['loaded'] and b36() and b36()['loaded'] and b35() and b35()['loaded'] and b34() and b34()['loaded'])
 wait.until(lambda _:js("return document.querySelector('#jumpYear')?.max==='1799'"))
 d=b37()
 assert (d['zoneCount'],d['siteCount'],d['phases'])==(141,108,257),d
 assert b34()['areaReferences']==24 and b35()['zoneCount']==81 and b36()['zoneCount']==130
 examples=[
  (1700,['海岸角Cape Coast英国','Fort Charles旧英国堡'],['Beyin Fort Apollonia','马德拉斯Fort St George法军占城'],'1700-forts'),
  (1731,['阿诺马布旧英堡拆毁','Fort Marlborough Bencoolen'],['1757后阿诺马布'],'1731-anomabu'),
  (1746,['马德拉斯Fort St George法军占城','1744—1778 Bunce Island'],['马德拉斯Fort St George英公司旧驻城'],'1746-madras-french'),
  (1757,['1757后阿诺马布','1757后加尔各答Fort William'],['Beyin Fort Apollonia'], '1757-coastal'),
  (1767,['Old Calabar英商协助伏击','Beyin的Nzema首领'],['Beyin Fort Apollonia'],'1767-calabar'),
  (1768,['Beyin Fort Apollonia','Calabar与利物浦贩奴贸易网'],['Old Calabar英商协助伏击'],'1768-africa'),
  (1775,['Balambangan苏禄力量攻占','英马战争孟买周边'],['1773—1774 Balambangan'],'1775-sulu'),
  (1779,['James Island法国海军摧毁','1779 Bunce Island'],['Gambia James Island英商'],'1779-french-attacks'),
  (1781,['St Eustatius Oranjestad','1781英军在Padang'],['1795 Malacca'],'1781-navy'),
  (1783,['Grenada St George恢复英国','Dominica Roseau英方复占'],['1779—1782法国夺取'],'1783-treaties'),
  (1794,['Victor Hugues夺回Guadeloupe','英军短占Guadeloupe'],['1796英军攻占Saint Lucia'],'1794-guadeloupe'),
  (1795,['1795 Malacca荷兰旧港','英国占Martinique Fort de France'],['1796 Banda'],'1795-trading-ports'),
  (1796,['1796 Ambon','1796 Banda','Saint Lucia Fort Charlotte'],['1773—1774 Balambangan'],'1796-shifting-seas'),
  (1797,['Trinidad Port of Spain','Baliceaux岛Garifuna'],['Gambia James Island英商'],'1797-caribbean'),
  (1799,['1799后South Canara','1796 Banda','Sierra Leone河港'],['St Eustatius Oranjestad'],'1799-colonies')
 ]
 for year,present,missing,name in examples:
  set_year(year);d=b37()
  assert d['visibleAreas']>0 and d['visibleSites']>0,(year,d)
  assert all(active(t) for t in present),(year,'missing',present,d['activeZoneTitles'])
  assert all(not active(t) for t in missing),(year,'extra',missing,d['activeZoneTitles'])
  snapshot(name)
 set_year(1767)
 assert js("return document.querySelectorAll('.atlas-18c-b37-zone').length")>20
 assert js("return document.querySelectorAll('.atlas-18c-b37-site').length")>10
 js("document.querySelector('.atlas-18c-b37-site').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));")
 wait.until(lambda _: '第37批' in driver.find_element(By.ID,'dossierBody').text)
 snapshot('dossier-source-click')
 js("const c=document.querySelector('#toggleControlAreas');c.checked=false;c.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _: b37()['visibleAreas']==0 and b37()['visibleSites']==0)
 assert b36()['visibleZoneLayers']==0 and b35()['visibleZoneLayers']==0 and b34()['visibleAreaLayerObjects']==0
 snapshot('all-areas-hidden')
 js("const c=document.querySelector('#toggleControlAreas');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:b37()['visibleAreas']>0)
 set_year(1572)
 assert b37()['visibleAreas']==0 and b37()['visibleSites']==0
 snapshot('1572-original-map')
 driver.get('http://127.0.0.1:8765/?year=1767')
 wait.until(lambda d:d.find_element(By.ID,'bigYear').text=='1699')
 assert not js('return Boolean(window.eighteenthBatch37Spatial)')
 print('PASS Batch37 real 1780x1020 Chrome: 141/108/257, 15 sample years, 3 datasets, dossier, integrated territory toggle, 1572 backward and non-preview isolation.')
except Exception:
 snapshot('FAILED')
 raise
finally:
 driver.quit()
