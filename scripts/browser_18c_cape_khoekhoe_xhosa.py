#!/usr/bin/env python3
"""Twelfth T25 true desktop Cape invasion, Khoikhoi land resistance and no dynamic TOC QA."""
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
story='E18-T25-CAPE-INVASION-KHOEKHOE-XHOSA-1795-1799'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1795')
 wait.until(lambda d:at(1795))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-CAP-1795-MUIZENBERG-NAVAL-BOMBARDMENT')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-CAP-1799-ZUURVELD-NEGOTIATED-RETENTION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-CAP-1795-PANDOER-SANDVLEI-COUNTERATTACK').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-CAP-1799-GRAAFF-REINET-BOER-REVOLT').lat!==null")
 oldZoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-CAP-1795-MUIZENBERG-NAVAL-BOMBARDMENT"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===17"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===19")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c-cape-1795-british-bombardment-and-pandoer-resistance-longstory.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CAP-1795-SIMONS-BAY-BRITISH-FLEET"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-CAP-1795-SIMONS-BAY-BRITISH-FLEET'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat+34.1782)<0.6&&Math.abs(c.lng-18.4202)<0.6"""))
 assert oldZoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-cape-1795-Simons-Bay-British-Navy.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CAP-1795-MUIZENBERG-NAVAL-BOMBARDMENT"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-CAP-1795-MUIZENBERG-NAVAL-BOMBARDMENT'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat+34.113)<0.6&&Math.abs(c.lng-18.465)<0.6"""))
 driver.save_screenshot(str(shots/'18c-cape-1795-royal-navy-bombarded-muizenberg.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CAP-1799-GRAAFF-REINET-BOER-REVOLT"]').click()
 wait.until(lambda d:at(1799))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-CAP-1799-GRAAFF-REINET-BOER-REVOLT'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat+32.249)<0.6&&Math.abs(c.lng-24.532)<0.6"""))
 driver.save_screenshot(str(shots/'18c-cape-1799-graaff-reinet-Boer-revolt.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CAP-1799-KHOEKHOE-CATTLE-LAND-GRIEVANCES"]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')!==null"))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CAP-1799-ZUURVELD-NEGOTIATED-RETENTION"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.save_screenshot(str(shots/'18c-cape-1799-khoekhoe-xhosa-land-rights-no-sticky-nav.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1795))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1795')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-CAP-1795-MUIZENBERG-NAVAL-BOMBARDMENT')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T25 Cape desktop: 17 true links, 19 chapters; 1795 Simon Bay and Muizenberg Royal Navy, 1799 Graaff-Reinet & Khoikhoi land resistance, Zuurveld null GPS double dossier/back, no floating toolbar, source story intact, ordinary mode isolation and early 16C regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c-cape-browser-failure.png'))
 raise
finally:driver.quit()
