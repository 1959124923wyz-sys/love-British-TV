#!/usr/bin/env python3
"""22nd 18C true desktop browser: British colonial conquest, Cherokee burning, Fort Pitt and Paxton killings."""
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
topic='E18-T08-SEVEN-YEARS-CHEROKEE-PONTIAC-PAXTON-1740-1775'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1763')
 wait.until(lambda d:at(1763))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T08-E18A-1763-C12-01')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T08-E18A-1763-C12-01').lat===42.33143")
 assert js("return window.atlasStoryBridge.eventById('E18C-T08-1761-CHEROKEE-GRANT').lat===null")
 selector='#eventList [data-eid="E18C-T08-E18A-1763-C12-01"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
 driver.find_element(By.CSS_SELECTOR,selector).click()
 entry='#dossierBody [data-story-open="'+topic+'"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===32"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===32")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c22-1763-Pontiac-Detroit-indigenous-resistance.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T08-1758-DUQUESNE"]').click()
 wait.until(lambda d:at(1758))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-T08-1758-DUQUESNE'"))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-40.44062)<0.6&&Math.abs(c.lng+79.99589)<0.6"))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c22-1758-British-Fort-Pitt-and-OHIO-land.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T08-1760-CHEROKEE-MONTGOMERY"]').click()
 wait.until(lambda d:at(1760))
 driver.save_screenshot(str(shots/'18c22-1760-British-Cherokee-town-crop-burning.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T08-1763-POX-BLANKETS"]').click()
 wait.until(lambda d:at(1763))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-40.44062)<0.6&&Math.abs(c.lng+79.99589)<0.6"))
 driver.save_screenshot(str(shots/'18c22-1763-British-smallpox-hospital-blankets-Fort-Pitt.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T08-E18A-1763-C14-02"]').click()
 wait.until(lambda d:at(1763))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-40.03788)<0.6&&Math.abs(c.lng+76.30551)<0.6"))
 driver.save_screenshot(str(shots/'18c22-1763-Paxton-Lancaster-Conestoga-massacre.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T08-E18A8-1773-GA-AUGUSTA-DEBT-CESSION"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1773))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c22-1773-Augusta-indigenous-debt-land-cession-dossier.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1763))
 driver.get('http://127.0.0.1:8765/?year=1763')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T08-1763-POX-BLANKETS')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS T08 22 topics: 32 links and chapters, 1763 Pontiac Detroit, 1758 Fort Pitt, 1760 Cherokee destruction, 1763 germ warfare and Paxton massacre, 1773 land dossier/back, preserved original 21 stories plus published 16C.')
except Exception:
 driver.save_screenshot(str(shots/'18c22-T08-browser-failure.png'))
 raise
finally:driver.quit()
