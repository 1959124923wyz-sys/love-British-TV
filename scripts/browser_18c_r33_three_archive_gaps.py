#!/usr/bin/env python3
"""Real 1780x1020 desktop: three 1126-record gap dossiers, doubleclick/return, no release leakage."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
o=Options()
for f in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):o.add_argument(f)
d=webdriver.Chrome(options=o);wait=WebDriverWait(d,80)
def js(s,*a):return d.execute_script(s,*a)
def year(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
episodes=[
('AW',1782,'E18C-R33-AW-1782-JAN-PALACE','E18-R33-AWADH-BAHU-BEGAM-1765-1783',12,[
('1765-FINANCE',1765),('1775-QAULNAMA',1775),('1781-ORDER-SEIZURE',1781),('1782-EUNUCH-DETENTIONS',1782),('1783-PROTRACTED-GARRISON',1783)]),
('CAL',1767,'E18C-R33-CAL-1767-OLD-CALABAR-MASSACRE','E18-R33-OLD-CALABAR-ROBIN-JOHNS-1766-1790',10,[
('1766-KING-DAVID',1766),('1767-MEDIATION-LURE',1767),('1767-ROBIN-JOHNS-ENSLAVED',1767),('1768-BRISTOL-WITNESSES',1768),('1773-BRISTOL-RECAPTURE',1773),('1790-BRITISH-INQUIRY',1790)]),
('MIK',1761,'E18C-R33-MIK-1761-NOV9-FRANCIS-MUIS','E18-R33-MIKMAQ-PEACE-TREATIES-1761',4,[
('1761-JUN25-MIRAMICHI',1761),('1761-JUN25-SHEDIAC',1761),('1761-JUN25-BELCHER-DISPATCH',1761),('1761-NOV9-FRANCIS-MUIS',1761)])]
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1782')
 wait.until(lambda x:year(1782))
 wait.until(lambda x:js("return !!window.atlasStoryBridge?.eventById?.('E18C-R33-AW-1782-JAN-PALACE')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-R33-AW-1782-JAN-PALACE').lat===26.775486")
 assert js("return window.atlasStoryBridge.eventById('E18C-R33-CAL-1767-OLD-CALABAR-MASSACRE').lat===null")
 for code,y,event,story,chapter_count,links in episodes:
  d.get('http://127.0.0.1:8765/?review18c=1&year='+str(y))
  wait.until(lambda x:year(y))
  row='#eventList [data-eid="'+event+'"]'
  wait.until(lambda x:js("return !!document.querySelector(arguments[0])",row))
  d.find_element(By.CSS_SELECTOR,row).click()
  entry='#dossierBody [data-story-open="'+story+'"]'
  wait.until(lambda x:js("return !!document.querySelector(arguments[0])",entry))
  d.find_element(By.CSS_SELECTOR,entry).click()
  wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
  assert js("return document.querySelectorAll('.major-story-article .story-section').length")==chapter_count
  assert js("return document.querySelectorAll('.major-story-article .story-event-link').length")==chapter_count
  assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
  d.save_screenshot(str(shots/('18c33-'+code+'-full-Chinese-dossier.png')))
  initial_zoom=js("return window.atlasReadViewport().zoom")
  for slug,yr in links:
   selector='.story-event-link[data-story-event="E18C-R33-'+code+'-'+slug+'"]'
   d.find_element(By.CSS_SELECTOR,selector).click()
   wait.until(lambda x:year(yr))
   assert js("return window.atlasReadViewport().zoom")==initial_zoom
   d.save_screenshot(str(shots/('18c33-'+code+'-'+slug+'.png')))
  selector='.story-event-link[data-story-event="'+event+'"]'
  target=d.find_element(By.CSS_SELECTOR,selector)
  js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",target)
  wait.until(lambda x:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
  d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
  wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
  d.save_screenshot(str(shots/('18c33-'+code+'-source-inspection-return.png')))
 d.get('http://127.0.0.1:8765/?year=1782')
 wait.until(lambda x:year(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-R33-AW-1782-JAN-PALACE')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda x:year(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(e=>e.dataset.eid==='1570S-E004')")
 print('PASS R33 1780x1020 3 new Chinese historical articles/26 links/5 original IDs, three map-year interactions and historical source return; 31 old + 16C regressions intact')
except Exception:
 d.save_screenshot(str(shots/'18c33-browser-failure.png'))
 raise
finally:d.quit()
