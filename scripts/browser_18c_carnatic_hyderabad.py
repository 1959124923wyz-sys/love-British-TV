#!/usr/bin/env python3
"""Tenth T19 British/French Carnatic, Hyderabad subsidiary treaty and Kattabomman real desktop atlas regression."""
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
def js(s,*args):return driver.execute_script(s,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda d:at(y))
story='E18-T19-CARNATIC-HYDERABAD-PALAYAKKARAR-1746-1799'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1798')
 wait.until(lambda d:at(1798))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-CKT-1798-HYDERABAD-SUBSIDIARY-TREATY')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-CKT-1798-HYDERABAD-SUBSIDIARY-TREATY').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-CKT-1799-PANCHALANKURICHI-FORT-ATTACK').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-CKT-1760-WANDIWASH-BATTLE').lat!==null")
 oldZoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-CKT-1798-HYDERABAD-SUBSIDIARY-TREATY"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 enter=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",enter))
 driver.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===14"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===18")
 driver.save_screenshot(str(shots/'18c-carnatic-1798-hyderabad-treaty-longstory.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CKT-1760-WANDIWASH-BATTLE"]').click()
 wait.until(lambda d:at(1760))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-CKT-1760-WANDIWASH-BATTLE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-12.504167)<0.6&&Math.abs(c.lng-79.605556)<0.6"""))
 assert oldZoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-carnatic-1760-royal-collection-wandiwash.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CKT-1761-PONDICHERRY-SURRENDER"]').click()
 wait.until(lambda d:at(1761))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-CKT-1761-PONDICHERRY-SURRENDER'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-11.93)<0.6&&Math.abs(c.lng-79.83)<0.6"""))
 driver.save_screenshot(str(shots/'18c-carnatic-1761-french-pondicherry-surrender.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CKT-1746-MADRAS-FRENCH-CAPTURE"]').click()
 wait.until(lambda d:at(1746))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-CKT-1746-MADRAS-FRENCH-CAPTURE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-13.087778)<0.6&&Math.abs(c.lng-80.278333)<0.6"""))
 driver.save_screenshot(str(shots/'18c-carnatic-1746-madras-french-capture.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CKT-1763-PARIS-FRENCH-FACTORIES"]').click()
 wait.until(lambda d:at(1763))
 assert js("return document.querySelector('.major-story-article')!==null")
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-CKT-1799-KATTABOMMAN-EXECUTION"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1799))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1798))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1798')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-CKT-1798-HYDERABAD-SUBSIDIARY-TREATY')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T19 desktop: 14 mapped reading links/18 chapters; 1760 Wandiwash, 1761 French Pondicherry surrender, 1746 Madras royal map-point pan, 1763 null treaty, 1799 double dossier/back and 1798 original return, normal map isolation and sixteenth-century event regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c-carnatic-browser-failure.png'))
 raise
finally:
 driver.quit()
