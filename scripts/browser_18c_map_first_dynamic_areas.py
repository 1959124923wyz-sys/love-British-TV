#!/usr/bin/env python3
"""Real 1780x1020 Chromium: year-dependent dashed admin envelopes, paper claims and city-core occupations."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results';screens.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(arg)
d=webdriver.Chrome(options=opt);wait=WebDriverWait(d,100)
def js(script,*args):return d.execute_script(script,*args)
def audit():return js('return window.eighteenthSpatial?.getAudit?.()')
def snap(name):d.save_screenshot(str(screens/'18c-map-34-'+name+'.png'))
def set_year(y):
 js('setYear(arguments[0])',y)
 wait.until(lambda x:x.find_element(By.CSS_SELECTOR,'#bigYear').text==str(y))
 wait.until(lambda x:audit()['activeYear']==y)
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1704')
 wait.until(lambda x:bool(audit()) and audit()['loaded'])
 assert audit()['areaReferences']==24 and audit()['documentedCityCores']==15,audit()
 for yr,expected,missing,name in [
  (1704,['GIBRALTAR'],['HAVANA','MANILA','MENORCA'],'1704-gibraltar'),
  (1749,['MENORCA'],['HAVANA','MANILA'],'1749-minorca-madras-restored'),
  (1756,['GIBRALTAR'],['MENORCA','HAVANA'],'1756-france-takes-minorca-and-madras'),
  (1762,['HAVANA','MANILA'],['PENANG','ST_EUSTATIUS'],'1762-havana-manila-short-occupation'),
  (1763,['MANILA','MENORCA'],['HAVANA'],'1763-havana-returned-minorca-restored'),
  (1776,['NEW_YORK_CITY'],['HAVANA','MANILA'],'1776-american-revolution'),
  (1781,['ST_EUSTATIUS','MENORCA'],['HAVANA','MANILA'],'1781-statia-temporary-british-occupation'),
  (1782,['GIBRALTAR'],['ST_EUSTATIUS','MENORCA'],'1782-minorca-lost-statia-lost'),
  (1798,['MENORCA','PENANG','CAPE_TOWN'],['HAVANA','MANILA'],'1798-british-port-network')
 ]:
  set_year(yr)
  a=audit();assert all(s in a['activeSites'] for s in expected),(yr,a)
  assert all(s not in a['activeSites'] for s in missing),(yr,a)
  assert a['visibleAreaLayerObjects']>0 and a['visibleSiteLayerObjects']>0,(yr,a)
  if yr==1776:assert 'VIRGINIA' not in a['activeAreas'] and 'PENNSYLVANIA' not in a['activeAreas']
  if yr==1763:assert 'MADRAS' in a['activeAreas'] and 'CALCUTTA' in a['activeAreas']
  if yr==1756:assert 'MADRAS' not in a['activeAreas'] and 'CALCUTTA' not in a['activeAreas']
  snap(name)
 set_year(1762)
 assert js('return document.querySelectorAll(".atlas-18c-dynamic-area").length')>=10
 assert js('return document.querySelectorAll(".atlas-18c-dynamic-core").length')>=3
 # User can click a spatial symbol and see evidence/precision, independent of event cards.
 first=d.find_element(By.CSS_SELECTOR,'.atlas-18c-dynamic-core')
 d.execute_script('arguments[0].dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))',first)
 wait.until(lambda x:js('return document.querySelector("#dossierBody")?.textContent.includes("18世纪地图优先")'))
 assert '平方公里' in d.find_element(By.CSS_SELECTOR,'#dossierBody').text
 snap('1762-clickable-occupation-dossier')
 # The top-level territory switch controls ALL geographic fills and garrison symbols.
 d.find_element(By.CSS_SELECTOR,'#mapLayerTerritory').click()
 wait.until(lambda x:audit()['visibleAreaLayerObjects']==0 and audit()['visibleSiteLayerObjects']==0)
 snap('1762-territory-disabled-event-only')
 d.find_element(By.CSS_SELECTOR,'#mapLayerTerritory').click()
 wait.until(lambda x:audit()['visibleAreaLayerObjects']>0 and audit()['visibleSiteLayerObjects']>0)
 set_year(1572)
 assert audit()['visibleAreaLayerObjects']==0 and audit()['visibleSiteLayerObjects']==0
 assert js('return [...document.querySelectorAll("#eventList [data-eid]")].some(x=>x.dataset.eid==="1570S-E004")')
 snap('1572-legacy-published-map-intact')
 d.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda x:x.find_element(By.CSS_SELECTOR,'#bigYear').text=='1699')
 assert js('return !window.eighteenthSpatial')
 print('PASS 18C 24 reference outlines + 15 occupied site symbols, 1704/1749/1756/1762/1763/1776/1781/1782/1798, clicks/territory toggle/16C and unreleased concealment, real 1780x1020 Chromium')
except Exception:
 d.save_screenshot(str(screens/'18c-map-34-FAILED.png'))
 raise
finally:d.quit()
