#!/usr/bin/env python3
"""Actual 1780x1020 Chromium: 1770 taxation, 1771 stolen farmer seed and 1772 Purnea petitions, 25 older topics."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(a)
d=webdriver.Chrome(options=opt);wait=WebDriverWait(d,60)
def js(s,*args):return d.execute_script(s,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
topic='E18-T15-BENGAL-FAMINE-TAX-PEASANT-PETITIONS-1770-1772'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1770')
 wait.until(lambda x:at(1770))
 wait.until(lambda x:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T15-1770-APR24-PYKES')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T15-1770-APR24-PYKES').lat===25.74664")
 assert js("return window.atlasStoryBridge.eventById('E18C-T15-1771-AUG28-SEED').lat===null")
 sel='#eventList [data-eid="E18C-T15-1770-APR24-PYKES"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",sel))
 d.find_element(By.CSS_SELECTOR,sel).click()
 entry='#dossierBody [data-story-open="'+topic+'"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",entry))
 d.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda x:js("return document.querySelectorAll('.major-story-article .story-event-link').length===26"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===26")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 d.save_screenshot(str(shots/'18c26-1770-Rangpur-Pyke-unpaid-colonial-tax-agents.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T15-1770-MAY23-SUJAN"]').click()
 wait.until(lambda x:at(1770))
 wait.until(lambda x:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-25.24446)<0.6&&Math.abs(c.lng-86.97183)<0.6"))
 assert zoom==js("return window.atlasReadViewport().zoom")
 d.save_screenshot(str(shots/'18c26-1770-Sujan-Singh-30000-tax-2500-paid.png'))
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T15-1771-AUG28-SEED"]').click()
 wait.until(lambda x:at(1771))
 wait.until(lambda x:js("return !!document.querySelector('.story-event-preview')"))
 d.save_screenshot(str(shots/'18c26-1771-East-India-Company-agents-take-farmers-seed.png'))
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T15-1772-AUG5-PEASANTS"]').click()
 wait.until(lambda x:at(1772))
 wait.until(lambda x:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-25.77895)<0.6&&Math.abs(c.lng-87.47422)<0.6"))
 d.save_screenshot(str(shots/'18c26-1772-Purnea-farmer-petitions-grain-seizure-branding.png'))
 link=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T15-1772-AUG24-DUCAREL"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",link)
 wait.until(lambda x:at(1772))
 wait.until(lambda x:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 d.save_screenshot(str(shots/'18c26-1772-Ducarel-denial-dossier-original-peasant-testimony-return.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda x:at(1770))
 d.get('http://127.0.0.1:8765/?year=1770')
 wait.until(lambda x:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T15-1771-AUG28-SEED')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda x:at(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS T15 26th Bengal desktop: 26 date-backed chapters, 1770 Rangpur taxes, 1771 confiscated seed, 1772 Purnea farmer petitions vs Ducarel denial, no fake polygons and old 25-topic/16C regression.')
except Exception:
 d.save_screenshot(str(shots/'18c26-T15-browser-failure.png'))
 raise
finally:
 d.quit()
