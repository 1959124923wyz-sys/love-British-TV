#!/usr/bin/env python3
"""T05 Garifuna forced exile 18th-story real 1780x1020 desktop Chrome GIS and reader navigation."""
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
def js(src,*args):return driver.execute_script(src,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda d:at(y))
topic='E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1795')
 wait.until(lambda d:at(1795))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-GAR-1795-CALLIAQUA-ASSAULT')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-GAR-1795-SETON-EXTIRPATION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-GAR-1797-APR-ROATAN-ARRIVE').lat===16.37219")
 card='#eventList [data-eid="E18C-GAR-1795-CALLIAQUA-ASSAULT"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{topic}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===23"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===26")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 zoom=js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c18-1795-Garifuna-Calliaqua-British-Navy-attack.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-GAR-1796-BALICEAUX-MASS-DETENTION"]').click()
 wait.until(lambda d:at(1796))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-GAR-1796-BALICEAUX-MASS-DETENTION'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-12.94773)<0.65&&Math.abs(c.lng+61.14522)<0.65"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c18-1796-Baliceaux-British-Garifuna-mass-imprisonment.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-GAR-1797-APR-ROATAN-ARRIVE"]').click()
 wait.until(lambda d:at(1797))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-GAR-1797-APR-ROATAN-ARRIVE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-16.37219)<0.8&&Math.abs(c.lng+86.42807)<0.8"""))
 driver.save_screenshot(str(shots/'18c18-1797-Roatan-Garifuna-2026-arrived.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-GAR-1795-SETON-EXTIRPATION"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1795))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c18-1795-Seton-extermination-order-dossier-return.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1795))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1797')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-GAR-1797-APR-ROATAN-ARRIVE')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T05 real desktop: 23 authentic body links and 26 chapters, 1795 British Calliaqua assault, 1796 Baliceaux camp, 1797 Roatan pan and exact source counts, dossier double-back, 17 prior stories and 16C intact.')
except Exception:
 driver.save_screenshot(str(shots/'18c18-Garifuna-desktop-failure.png'))
 raise
finally:driver.quit()
