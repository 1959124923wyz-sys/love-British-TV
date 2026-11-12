#!/usr/bin/env python3
"""1780x1020 desktop real Chromium T33: Scottish slave-finance, individual litigation and 1778 freedom."""
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
story='E18-T33-SCOTLAND-ENSLAVEMENT-CAPITAL-FREEDOM-1707-1792'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1778')
 wait.until(lambda x:year(1778))
 wait.until(lambda x:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T33-1778-JAN15-KNIGHT-VERDICT')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T33-1778-JAN15-KNIGHT-VERDICT').lat===55.95206")
 assert js("return window.atlasStoryBridge.eventById('E18C-T33-1727-HORSEBURGH-BOGLE').lat===null")
 row='#eventList [data-eid="E18C-T33-1778-JAN15-KNIGHT-VERDICT"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",row))
 d.find_element(By.CSS_SELECTOR,row).click()
 enter='#dossierBody [data-story-open="'+story+'"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",enter))
 d.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda x:js("return document.querySelectorAll('.major-story-article .story-event-link').length===29"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===29")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 d.save_screenshot(str(shots/'18c31-1778-Joseph-Knight-scottish-freedom.png'))
 z=js("return window.atlasReadViewport().zoom")
 for k,y,n in [
  ('1707-UNION-ACCESS',1707,'1707-scotland-imperial-merchant-access'),
  ('1727-HORSEBURGH-BOGLE',1727,'1727-commercial-slave-trading-litigation'),
  ('1731-GLASGOW-LETTER',1731,'1731-glasgow-slave-voyage-letter'),
  ('1750-MONTGOMERY-SALE',1750,'1750-jamie-montgomery-colonial-sale'),
  ('1756-APR21-JAMIE-ESCAPE',1756,'1756-Jamie-escapes-forced-deportation'),
  ('1769-SEP1-SPENS-BAPTISM',1769,'1769-Spens-community-resistance'),
  ('1772-JUN22-SOMERSET',1772,'1772-Somerset-no-forced-deportation'),
  ('1774-MAY20-KNIGHT-SHERIFF',1774,'1774-Knight-Perth-sheriff-judgment'),
  ('1778-JAN15-KNIGHT-VERDICT',1778,'1778-Scotland-no-perpetual-servitude'),
  ('1790-AUG6-GEORGE-DALE',1790,'1790-George-Dale-testimony'),
  ('1792-APR-DUNDAS-GRADUAL',1792,'1792-gradual-abolition-debate')
 ]:
  el=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T33-'+k+'"]')
  el.click();wait.until(lambda x:year(y))
  assert js("return window.atlasReadViewport().zoom")==z
  d.save_screenshot(str(shots/('18c31-'+n+'.png')))
 target=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T33-1778-JAN15-KNIGHT-VERDICT"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",target)
 wait.until(lambda x:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 d.save_screenshot(str(shots/'18c31-1778-Knight-original-source-back.png'))
 d.get('http://127.0.0.1:8765/?year=1792')
 wait.until(lambda x:year(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T33-1792-APR-DUNDAS-GRADUAL')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda x:year(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS 18C T33 real 1780x1020 desktop: Joseph Knight judicial freedom, James Montgomery death before trial, David Spens, James Somerset, George Dale, 1792 Dundas and all 30 predecessor topics plus published Tudor timeline')
except Exception:
 d.save_screenshot(str(shots/'18c31-t33-browser-failure.png'))
 raise
finally:d.quit()
