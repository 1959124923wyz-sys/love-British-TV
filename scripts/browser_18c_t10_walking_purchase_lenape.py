#!/usr/bin/env python3
"""Real 1780x1020 Chromium: Penn land fraud, 1737 deed / walking, Lenape diplomatic resistance, 22 predecessors and 16C."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
o=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):o.add_argument(a)
driver=webdriver.Chrome(options=o);wait=WebDriverWait(driver,60)
def js(s,*args):return driver.execute_script(s,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
topic='E18-T10-WALKING-PURCHASE-LENAPE-LANCASTER-EASTON-1734-1762'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1744')
 wait.until(lambda d:at(1744))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T10-1744-JUN30-GACHRADODOW')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T10-1737-SEP19-RUN').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-T10-1744-JUN30-GACHRADODOW').lat===40.03788")
 selector='#eventList [data-eid="E18C-T10-1744-JUN30-GACHRADODOW"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
 driver.find_element(By.CSS_SELECTOR,selector).click()
 entry='#dossierBody [data-story-open="'+topic+'"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===29"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===29")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c23-1744-Lancaster-six-nations-sovereignty.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T10-1737-AUG-STENTON"]').click()
 wait.until(lambda d:at(1737))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-39.95238)<0.6&&Math.abs(c.lng+75.16362)<0.6"))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c23-1737-Penn-stenton-Lenape-misleading-map.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T10-1737-AUG25-DEED"]').click()
 wait.until(lambda d:at(1737))
 driver.save_screenshot(str(shots/'18c23-1737-Aug25-deed-archived.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T10-1737-SEP19-RUN"]').click()
 wait.until(lambda d:at(1737))
 driver.save_screenshot(str(shots/'18c23-1737-Sep19-rigged-walking-land-fraud.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T10-1756-NOV12-TEEDYUSCUNG"]').click()
 wait.until(lambda d:at(1756))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-40.688432)<0.6&&Math.abs(c.lng+75.2207323)<0.6"))
 driver.save_screenshot(str(shots/'18c23-1756-Teedyuscung-Eastton-land-fraud-protest.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T10-1758-OCT-EASTON"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1758))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c23-1758-Easton-treaty-original-and-story-return.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1744))
 driver.get('http://127.0.0.1:8765/?year=1744')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T10-1737-SEP19-RUN')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS T10 23-story desktop: Lancaster independence and Lenape 1737 Aug25 vs Sep19, date-change, center/zoom, 1756 Teedyuscung 1758 Easton double-click/return, no floating TOC, 22 earlier 18C and 16C official unaffected.')
except Exception:
 driver.save_screenshot(str(shots/'18c23-T10-browser-failure.png'))
 raise
finally:driver.quit()
