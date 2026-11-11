#!/usr/bin/env python3
"""1780x1020 real desktop Chromium for T28 Havana, disputed Port Egmont, Maltese autonomous resistance."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
options=Options()
for f in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):options.add_argument(f)
d=webdriver.Chrome(options=options);wait=WebDriverWait(d,80)
def js(s,*a):return d.execute_script(s,*a)
def yr(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
story='E18-T28-HAVANA-EGMONT-MALTA-1762-1799'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1770')
 wait.until(lambda x:yr(1770))
 wait.until(lambda x:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T28-1770-JUN10-EGMONT-CAPTURE')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T28-1770-JUN10-EGMONT-CAPTURE').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-T28-1762-JUN6-HAVANA').lat===23.13302")
 row='#eventList [data-eid="E18C-T28-1770-JUN10-EGMONT-CAPTURE"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",row))
 d.find_element(By.CSS_SELECTOR,row).click()
 enter='#dossierBody [data-story-open="'+story+'"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",enter))
 d.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda x:js("return document.querySelectorAll('.major-story-article .story-event-link').length===33"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===33")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 d.save_screenshot(str(shots/'18c30-1770-Spanish-Port-Egmont-capture.png'))
 z=js("return window.atlasReadViewport().zoom")
 for key,year,name in [
  ('1762-JUN6-HAVANA',1762,'1762-Havana-blockade'),
  ('1762-ENSLAVED-LABOUR',1762,'1762-British-enslaved-labor'),
  ('1762-JUL30-MORRO',1762,'1762-Morro-fort'),
  ('1763-HAVANA-RETURN',1763,'1763-Havana-restituted-Spain'),
  ('1771-JAN22-DECLARATIONS',1771,'1771-Port-Egmont-sovereignty-reservation'),
  ('1774-BRITISH-LEAVE',1774,'1774-Port-Egmont-British-garrison-gone'),
  ('1798-SEP2-REVOLT',1798,'1798-Maltese-autonomous-revolt'),
  ('1798-OCT28-GOZO',1798,'1798-Gozo-French-surrender'),
  ('1799-BRITISH-NAVAL-BLOCKADE',1799,'1799-British-allied-sea-blockade'),
  ('1799-BALL-NEAPOLITAN',1799,'1799-Ball-Neapolitan-authority')
 ]:
  el=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T28-'+key+'"]')
  el.click();wait.until(lambda x:yr(year))
  assert js("return window.atlasReadViewport().zoom")==z
  d.save_screenshot(str(shots/('18c30-'+name+'.png')))
 x=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T28-1774-BRITISH-LEAVE"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",x)
 wait.until(lambda x:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 d.save_screenshot(str(shots/'18c30-1774-Port-Egmont-source-return.png'))
 d.get('http://127.0.0.1:8765/?year=1799')
 wait.until(lambda x:yr(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T28-1798-SEP2-REVOLT')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda x:yr(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS 30-topic T28 real 1780x1020 desktop: 33 chapters/Atlas links, 1762/1763 Havana, 1770/1771/1774 contested Egmont, 1798 Maltese uprising and 1799 foreign blockade, prior 29 and published 16C')
except Exception:
 d.save_screenshot(str(shots/'18c30-t28-browser-failure.png'))
 raise
finally:d.quit()
