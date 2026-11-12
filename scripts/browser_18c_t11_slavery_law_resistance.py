#!/usr/bin/env python3
"""Twentieth topic 1780x1020 real desktop: colonial slavery laws, 1712 New York, Stono, 1741 trials."""
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
topic='E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1712')
 wait.until(lambda d:at(1712))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T11-1712-NEW-YORK-MAIDEN-RISING')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T11-1739-STONO-SEPTEMBER-RISING').lat===null")
 assert js("return Math.abs(window.atlasStoryBridge.eventById('E18C-T11-1712-NEW-YORK-MAIDEN-RISING').lat-40.71427)<0.001")
 selector='#eventList [data-eid="E18C-T11-1712-NEW-YORK-MAIDEN-RISING"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
 driver.find_element(By.CSS_SELECTOR,selector).click()
 entry='#dossierBody [data-story-open="'+topic+'"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===26"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===26")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c20-1712-NewYork-uprising-trial-and-executions.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T11-1705-VIRGINIA-SLAVE-PROPERTY"]').click()
 wait.until(lambda d:at(1705))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-T11-1705-VIRGINIA-SLAVE-PROPERTY'"))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-37.271)<0.6&&Math.abs(c.lng+76.7059)<0.6"))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c20-1705-Virginia-slave-property-law-modern-Williamsburg.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T11-1739-STONO-MILITIA-KILLINGS"]').click()
 wait.until(lambda d:at(1739))
 driver.save_screenshot(str(shots/'18c20-1739-Stono-British-colonial-militia-killings.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T11-1740-SOUTH-CAROLINA-NEGRO-ACT"]').click()
 wait.until(lambda d:at(1740))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-32.77632)<0.5&&Math.abs(c.lng+79.93275)<0.5"))
 driver.save_screenshot(str(shots/'18c20-1740-South-Carolina-slave-code.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T11-1741-NEW-YORK-CARIBBEAN-TRANSPORT"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1741))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c20-1741-NewYork-hangings-and-deportation-dossier-return.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1712))
 driver.get('http://127.0.0.1:8765/?year=1712')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T11-1712-NEW-YORK-MAIDEN-RISING')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS T11 20-story desktop + 16C: 26 links, 26 chapters, 1705 Williamsburg reference, 1739 militia, 1740 slave law, 1741 dossier/back and no dynamic TOC regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c20-T11-browser-failure.png'))
 raise
finally:driver.quit()
