#!/usr/bin/env python3
"""Ninth T18 real 1780x1020 Chromium atlas story/GIS regression and old-series continuity."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opts.add_argument(arg)
driver=webdriver.Chrome(options=opts);wait=WebDriverWait(driver,60)
def js(code,*args):return driver.execute_script(code,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda d:at(y))
story='E18-T18-MARATHA-ROHILLA-AWADH-1773-1782'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1781')
 wait.until(lambda d:at(1781))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-MRA-1781-BENARES-CHAIT-SINGH')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-MRA-1774-KATRA-ROHILLA-BATTLE').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-MRA-1779-WADGAON-CONVENTION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-MRA-1775-SURAT-TREATY').lat!==null")
 oldZoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-MRA-1781-BENARES-CHAIT-SINGH"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 enter=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",enter))
 driver.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===12"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===16")
 driver.save_screenshot(str(shots/'18c-maratha-1781-benares-tax-revolt-longstory.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MRA-1775-SURAT-TREATY"]').click()
 wait.until(lambda d:at(1775))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-MRA-1775-SURAT-TREATY'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-21.170240)<0.6&&Math.abs(c.lng-72.831062)<0.6"""))
 assert oldZoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-maratha-1775-surat-city-reference.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MRA-1773-BENARES-AWADH-TREATY"]').click()
 wait.until(lambda d:at(1773))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-MRA-1773-BENARES-AWADH-TREATY'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-25.28)<0.6&&Math.abs(c.lng-82.95)<0.6"""))
 driver.save_screenshot(str(shots/'18c-maratha-1773-awadh-benares-treaty.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MRA-1779-WADGAON-CONVENTION"]').click()
 wait.until(lambda d:at(1779))
 assert js("return document.querySelector('.major-story-article')!==null")
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MRA-1782-SALBAI-PEACE-TREATY"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1782))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1781))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1781')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-MRA-1781-BENARES-CHAIT-SINGH')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T18 desktop: 16 story chapters, 12 true events, 1775 Surat reference pan, 1773 Benares geographic center, 1779 null location, 1782 Salbai double dossier/back, original historical position return, ordinary draft isolation and 16C regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c-maratha-browser-failure.png'))
 raise
finally:driver.quit()
