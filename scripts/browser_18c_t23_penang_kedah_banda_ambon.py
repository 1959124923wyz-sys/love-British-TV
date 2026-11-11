#!/usr/bin/env python3
"""Real 1780x1020 desktop: T23 Balambangan Sulu defence, Penang treaty, Andaman, Molucca spice forts."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
o=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):o.add_argument(flag)
d=webdriver.Chrome(options=o);wait=WebDriverWait(d,80)
def js(script,*args):return d.execute_script(script,*args)
def year(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
story='E18-T23-EIC-PENANG-KEDAH-ANDAMAN-AMBON-BANDA-1768-1796'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1786')
 wait.until(lambda x:year(1786))
 wait.until(lambda x:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T23-1786-AUG11-FLAG')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T23-1786-AUG11-FLAG').lat===5.41123")
 assert js("return window.atlasStoryBridge.eventById('E18C-T23-1775-BALAMBANGAN-SULU').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-T23-1796-MAR9-BANDA-CAPITULATION').lat===-4.51478")
 row='#eventList [data-eid="E18C-T23-1786-AUG11-FLAG"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",row))
 d.find_element(By.CSS_SELECTOR,row).click()
 enter='#dossierBody [data-story-open="'+story+'"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",enter))
 d.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda x:js("return document.querySelectorAll('.major-story-article .story-event-link').length===36"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===36")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 d.save_screenshot(str(shots/'18c29-1786-penang-conquest-treaty-contested.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 for eid,y,fn in [
  ('1775-BALAMBANGAN-SULU',1775,'1775-sulu-resistance-balambangan'),
  ('1789-CHATHAM-CLEAR',1789,'1789-andaman-forest-indigenous'),
  ('1791-TREATY-ANNUITY',1791,'1791-kedah-six-thousand-spanish'),
  ('1791-TREATY-FUGITIVES',1791,'1791-slave-fugitive-return'),
  ('1796-ANDAMAN-ABANDON',1796,'1796-andaman-abandon'),
  ('1796-MAR9-BANDA-CAPITULATION',1796,'1796-banda-dutch-capture'),
  ('1796-AMBON-CLOVE-MONOPOLY',1796,'1796-ambon-cloves')
 ]:
  el=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T23-'+eid+'"]')
  el.click();wait.until(lambda x:year(y))
  assert js("return window.atlasReadViewport().zoom")==zoom
  d.save_screenshot(str(shots/('18c29-'+fn+'.png')))
 target=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T23-1796-MAR9-BANDA-CAPITULATION"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",target)
 wait.until(lambda x:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 d.save_screenshot(str(shots/'18c29-1796-banda-dossier-and-return.png'))
 d.get('http://127.0.0.1:8765/?year=1796')
 wait.until(lambda x:year(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T23-1796-MAR9-BANDA-CAPITULATION')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda x:year(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS 29-topic T23 genuine 1780x1020 Chromium: 36 chapter links; 1775,1786,1789,1791,1796; sourced colonial resistance, treaty, 1796 fort, 16C published regression')
except Exception:
 d.save_screenshot(str(shots/'18c29-t23-desktop-failure.png'))
 raise
finally:d.quit()
