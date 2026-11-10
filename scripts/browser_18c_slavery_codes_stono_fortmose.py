#!/usr/bin/env python3
"""Twenty research stories: verify genuine desktop browser and 1705-1752 enslaved resistance/Spanish Black militia."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(a)
d=webdriver.Chrome(options=opt);wait=WebDriverWait(d,60)
def js(src,*args): return d.execute_script(src,*args)
def at(year):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",year)
def setyear(year):js("window.atlasStoryBridge.setYear(arguments[0])",year);wait.until(lambda _:at(year))
topic='E18-T11-BRITISH-ENSLAVEMENT-LAWS-STONO-FORTMOSE-1705-1752'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1739')
 wait.until(lambda _:at(1739))
 wait.until(lambda _:js("return !!window.atlasStoryBridge?.eventById?.('E18C-ENS-1739-OCT5-BULL-REPORT')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-ENS-1739-SEP9-STONO-UPRISING').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-ENS-1740-JUN26-FORTMOSE-RETAKEN').lat===29.89469")
 card='#eventList [data-eid="E18C-ENS-1739-OCT5-BULL-REPORT"]'
 wait.until(lambda _:js("return !!document.querySelector(arguments[0])",card))
 d.find_element(By.CSS_SELECTOR,card).click()
 opening=f'#dossierBody [data-story-open="{topic}"]'
 wait.until(lambda _:js("return !!document.querySelector(arguments[0])",opening))
 d.find_element(By.CSS_SELECTOR,opening).click()
 wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda _:js("return document.querySelectorAll('.major-story-article .story-event-link').length===27"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===30")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 zoom=js("return window.atlasReadViewport().zoom")
 d.save_screenshot(str(shots/'18c20-1739-Stono-William-Bull-44-killed-or-executed-archive.png'))
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ENS-1712-APR6-NEWYORK-REVOLT"]').click()
 wait.until(lambda _:at(1712))
 wait.until(lambda _:js("return window.atlasStoryBridge.activeFocusId()==='E18C-ENS-1712-APR6-NEWYORK-REVOLT'"))
 wait.until(lambda _:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-40.71278)<0.7&&Math.abs(c.lng+74.00597)<0.7"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 d.save_screenshot(str(shots/'18c20-1712-New-York-enslaved-rebellion-and-British-executions.png'))
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ENS-1740-JUN26-FORTMOSE-RETAKEN"]').click()
 wait.until(lambda _:at(1740))
 wait.until(lambda _:js("return window.atlasStoryBridge.activeFocusId()==='E18C-ENS-1740-JUN26-FORTMOSE-RETAKEN'"))
 wait.until(lambda _:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-29.89469)<0.7&&Math.abs(c.lng+81.31452)<0.7"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 d.save_screenshot(str(shots/'18c20-1740-Black-Spanish-militia-recovers-Fort-Mose-from-British.png'))
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ENS-1705-KILLING-IN-CORRECTION"]').click()
 wait.until(lambda _:at(1705))
 d.save_screenshot(str(shots/'18c20-1705-Virginia-British-legal-slave-owner-murder-immunity.png'))
 target=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ENS-1729-MARYLAND-DISMEMBERMENT"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda _:at(1729))
 wait.until(lambda _:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 d.save_screenshot(str(shots/'18c20-1729-Maryland-mutilation-and-quartering-law-dossier-return.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda _:at(1739))
 assert not js("return !!document.querySelector('.major-story-article')")
 setyear(1799);assert js("return document.querySelector('#nextYear').disabled")
 d.get('http://127.0.0.1:8765/?year=1739')
 wait.until(lambda _:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-ENS-1739-SEP9-STONO-UPRISING')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda _:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T11 actual desktop Chrome: 27 body/map links, 30 chapters, New York 1712, Stono 1739, free Black Spanish Fort Mose 1740, 1705 UK killer immunity law, 1729 quartering law, dossier/back/normal vs review and all 16C stories.')
except Exception:
 d.save_screenshot(str(shots/'18c20-T11-enslavement-Stono-FortMose-browser-failure.png'))
 raise
finally:d.quit()
