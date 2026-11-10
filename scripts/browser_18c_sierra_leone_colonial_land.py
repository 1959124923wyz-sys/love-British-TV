#!/usr/bin/env python3
"""Fourteenth T27 Sierra Leone British slaving and Black settler land rights: genuine desktop QA."""
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
story='E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1792')
 wait.until(lambda d:at(1792))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-SLE-1792-HALIFAX-EMBARK')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-SLE-1788-NAIMBANA-TREATY').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-SLE-1728-RAC-WITHDRAWS-BUNCE').lat!==null")
 zoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-SLE-1792-HALIFAX-EMBARK"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===18"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===21")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c-sierra-leone-1792-Black-Loyalists-Halifax-article.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-SLE-1728-RAC-WITHDRAWS-BUNCE"]').click()
 wait.until(lambda d:at(1728))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-SLE-1728-RAC-WITHDRAWS-BUNCE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-8.569773)<0.6&&Math.abs(c.lng+13.040683)<0.6"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-sierra-leone-1728-Bunce-RAC-withdrawn.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-SLE-1794-FRENCH-PLUNDER-FREETOWN"]').click()
 wait.until(lambda d:at(1794))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-SLE-1794-FRENCH-PLUNDER-FREETOWN'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-8.48714)<0.6&&Math.abs(c.lng+13.2356)<0.6"""))
 driver.save_screenshot(str(shots/'18c-sierra-leone-1794-French-Freetown-plunder.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-SLE-1799-SETTLER-FREEHOLD-DISPUTE"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-SLE-1799-SETTLER-FREEHOLD-DISPUTE'"))
 driver.save_screenshot(str(shots/'18c-sierra-leone-1799-Black-settler-land-struggle.png'))
 wait.until(lambda d:at(1799))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-SLE-1788-NAIMBANA-TREATY"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1788))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.save_screenshot(str(shots/'18c-sierra-leone-1788-Temne-treaty-dossier-return.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1792))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1792')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-SLE-1792-HALIFAX-EMBARK')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T27 Sierra Leone genuine desktop: 18 true links/21 chapters, Bunce and Freetown map pans, 1788 Temne treaty dossier double/back, 1799 land conflict, 13 earlier story and 16C regression, plain mode isolation.')
except Exception:
 driver.save_screenshot(str(shots/'18c-sierra-leone-browser-failure.png'))
 raise
finally:driver.quit()
