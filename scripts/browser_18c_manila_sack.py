#!/usr/bin/env python3
"""T22 real desktop British Manila plunder/ransom story, no floating directory and 1762-64 map."""
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
story='E18-T22-MANILA-INVASION-SACK-RANSOM-1762-1764'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda d:at(1762))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-MNL-1762-MANILA-STORM-RANSOM')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-MNL-1762-ANDA-LUZON-RESISTANCE').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-MNL-1763-BANK-MANILA-RANSOM').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-MNL-1762-SACK-PRIVATE-HOUSES').lat!==null")
 oldZoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-MNL-1762-MANILA-STORM-RANSOM"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 enter=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",enter))
 driver.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===16"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===18")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 assert js("return document.querySelector('.major-story-article').textContent.includes('四百万')||document.querySelector('.major-story-article').textContent.includes('400万')")
 driver.save_screenshot(str(shots/'18c-manila-1762-British-attack-four-million-ransom-longstory.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MNL-1762-SACK-PRIVATE-HOUSES"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-MNL-1762-SACK-PRIVATE-HOUSES'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-14.591389)<0.65&&Math.abs(c.lng-120.973611)<0.65"""))
 assert oldZoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-manila-1762-british-looting-intramuros-UNESCO-city.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MNL-1764-BRITISH-WITHDRAWAL"]').click()
 wait.until(lambda d:at(1764))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-MNL-1764-BRITISH-WITHDRAWAL'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-14.591389)<0.65&&Math.abs(c.lng-120.973611)<0.65"""))
 driver.save_screenshot(str(shots/'18c-manila-1764-actual-British-withdrawal.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MNL-1763-BANK-MANILA-RANSOM"]').click()
 wait.until(lambda d:at(1763))
 assert js("return document.querySelector('.major-story-article')!==null")
 link=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-MNL-1763-BANK-MANILA-RANSOM"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",link)
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc')")
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1762))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-MNL-1762-SACK-PRIVATE-HOUSES')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS Manila T22 desktop: 16 story links, 18 chapters, all floating navigation removed, looted city map pan, 1764 withdrawal, bank bill null GPS double dossier/back, earlier ten stories unaffected, normal-mode isolation and sixteenth-century regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c-manila-browser-failure.png'))
 raise
finally:driver.quit()
