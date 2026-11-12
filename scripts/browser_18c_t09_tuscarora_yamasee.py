#!/usr/bin/env python3
"""Real 1780x1020 Chromium: 21st colonial captive-trade topic and 20 earlier plus 16C history."""
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
topic='E18-T09-TUSCARORA-YAMASEE-INDIGENOUS-CAPTIVITY-1702-1732'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1715')
 wait.until(lambda d:at(1715))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T09-1715-CHARLESTON-GOVERNOR-MILITIA')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T09-1713-MAR23-NEOHEROKA-BURNING').lat===null")
 assert js("return Math.abs(window.atlasStoryBridge.eventById('E18C-T09-1715-CHARLESTON-GOVERNOR-MILITIA').lat-32.77632)<0.001")
 selector='#eventList [data-eid="E18C-T09-1715-CHARLESTON-GOVERNOR-MILITIA"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
 driver.find_element(By.CSS_SELECTOR,selector).click()
 entry='#dossierBody [data-story-open="'+topic+'"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===23"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===23")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c21-1715-Yamasee-war-colonial-trade-violence.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T09-1710-NEW-BERN-SETTLEMENT"]').click()
 wait.until(lambda d:at(1710))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-T09-1710-NEW-BERN-SETTLEMENT'"))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-35.10816)<0.5&&Math.abs(c.lng+77.03449)<0.5"))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c21-1710-NewBern-colonial-settlement.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T09-1712-APR-PEACE-BREACH-CAPTIVES"]').click()
 wait.until(lambda d:at(1712))
 driver.save_screenshot(str(shots/'18c21-1712-Barnwell-violated-peace-enslavement.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T09-1713-MAR23-NEOHEROKA-BURNING"]').click()
 wait.until(lambda d:at(1713))
 driver.save_screenshot(str(shots/'18c21-1713-Neoheroka-burning-950-killed-or-captured.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T09-1716-SC-GOVERNMENT-TRADE-MONOPOLY"]').click()
 wait.until(lambda d:at(1716))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-32.77632)<0.5&&Math.abs(c.lng+79.93275)<0.5"))
 driver.save_screenshot(str(shots/'18c21-1716-Colonial-Indian-trade-monopoly.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T09-1723-NC-FREED-PERSON-DEPORT"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1723))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c21-1723-NorthCarolina-freed-person-reenslavement-law.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1715))
 driver.get('http://127.0.0.1:8765/?year=1715')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T09-1715-APR15-YAMASEE-RISING')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS T09 21-story Chromium: 23 chapter links, 1710 New Bern, 1712 Barnwell enslavement, 1713 Nooheroka deaths/captives distinction, 1716 British trade monopoly, 1723 archival double-click and history return; original 20 stories and 16C unaffected.')
except Exception:
 driver.save_screenshot(str(shots/'18c21-T09-browser-failure.png'))
 raise
finally:driver.quit()
