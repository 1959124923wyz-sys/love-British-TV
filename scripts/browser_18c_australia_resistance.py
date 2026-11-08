#!/usr/bin/env python3
"""Sixth 18C Australia's actual desktop Leaflet + linked historical story UI review."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 opt.add_argument(arg)
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,60)
def js(script,*args):return driver.execute_script(script,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):
 js("window.atlasStoryBridge.setYear(arguments[0])",y)
 wait.until(lambda d:at(y))
story="E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799"
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1788')
 wait.until(lambda d:at(1788))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-AUS-1788-SYDNEY-COVE')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-AUS-1787-NSW-135-MERIDIAN').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-AUS-1795-HAWKESBURY-MILITARY').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-AUS-1788-NORFOLK-KINGSTON').lat!==null")
 zoom=js("return window.atlasReadViewport().zoom")
 event='#eventList [data-eid="E18C-AUS-1788-SYDNEY-COVE"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",event))
 driver.find_element(By.CSS_SELECTOR,event).click()
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-open=\"E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799\"]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799"]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===23"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===21")
 driver.save_screenshot(str(shots/'18c-australia-1788-sydney-first-fleet-article.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-AUS-1770-COOK-PAPER-CLAIM"]').click()
 wait.until(lambda d:at(1770))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-AUS-1770-COOK-PAPER-CLAIM'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat+10.715029)<0.6&&Math.abs(c.lng-142.39298)<0.6"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-australia-1770-paper-claim-island-reference.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-AUS-1792-PEMULWUY-PROSPECT"]').click()
 wait.until(lambda d:at(1792))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-AUS-1792-PEMULWUY-PROSPECT'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat+33.81966)<0.6&&Math.abs(c.lng-150.92176)<0.6"""))
 driver.save_screenshot(str(shots/'18c-australia-1792-pemulwuy-prospect-reference.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-AUS-1795-HAWKESBURY-MILITARY"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1795))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1788))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799)
 assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1788')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-AUS-1788-SYDNEY-COVE')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS Australia 18C desktop: 23 story links, 21 chapters, 1770 claim and 1792 resistance panning, 1795 empty-coordinate dossier double click/back, original entry return, ordinary mode isolation, Tudor atlas legacy regression')
except Exception:
 driver.save_screenshot(str(shots/'18c-australia-browser-failure.png'))
 raise
finally:driver.quit()
