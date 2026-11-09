#!/usr/bin/env python3
"""Eighth T17 Mysore source-verified story and real desktop historic map interaction."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(arg)
driver=webdriver.Chrome(options=opt);wait=WebDriverWait(driver,60)
def js(code,*args):return driver.execute_script(code,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda d:at(y))
story='E18-T17-MYSORE-WARS-PARTITION-1767-1799'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1799')
 wait.until(lambda d:at(1799))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-MYS-1799-SERINGAPATAM-STORM')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-MYS-1799-MYSORE-PARTITION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-MYS-1780-POLLILUR-MYSORE-VICTORY').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-MYS-1781-POLLILUR-COMPANY-VICTORY').lat!==null")
 initial_zoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-MYS-1799-SERINGAPATAM-STORM"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===12"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===16")
 driver.save_screenshot(str(shots/'18c-mysore-1799-fourth-war-longstory.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MYS-1781-POLLILUR-COMPANY-VICTORY"]').click()
 wait.until(lambda d:at(1781))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-MYS-1781-POLLILUR-COMPANY-VICTORY'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-12.833333)<0.6&&Math.abs(c.lng-79.716667)<0.6"""))
 assert initial_zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-mysore-1781-RCT-Pollilur.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MYS-1792-SERINGAPATAM-TREATY"]').click()
 wait.until(lambda d:at(1792))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-MYS-1792-SERINGAPATAM-TREATY'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-12.414)<0.6&&Math.abs(c.lng-76.704)<0.6"""))
 driver.save_screenshot(str(shots/'18c-mysore-1792-multipartite-treaty.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MYS-1799-MYSORE-PARTITION"]').click()
 wait.until(lambda d:at(1799))
 assert js("return document.querySelector('.major-story-article')!==null")
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MYS-1799-MYSORE-SUBSIDIARY-TREATY"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1799))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1799')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-MYS-1799-SERINGAPATAM-STORM')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS Mysore 18C desktop: 12 links, sixteen chapters, 1781 RCT village pan, 1792 UNESCO island pan, 1799 legal null-site, double dossier/back, ordinary mode isolation and 16C rollback.')
except Exception:
 driver.save_screenshot(str(shots/'18c-mysore-browser-failure.png'))
 raise
finally:driver.quit()
