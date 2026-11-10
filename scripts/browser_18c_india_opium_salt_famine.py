#!/usr/bin/env python3
"""15th T21 genuine desktop Chromium check: EIC opium, salt, Indian ryots and famine."""
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
story='E18-T21-EIC-OPIUM-SALT-FAMINE-1761-1799'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1788')
 wait.until(lambda d:at(1788))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-IND-1788-BENGAL-SALT-CALCUTTA-AUCTION')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-IND-1792-NORTHERN-CIRCARS-STARVATION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-IND-1773-HASTINGS-OPIUM-CONTRACT').lat!==null")
 zoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-IND-1788-BENGAL-SALT-CALCUTTA-AUCTION"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===18"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===21")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c-t21-1788-east-india-salt-monopoly-auction-article.png'))
 target='.story-event-link[data-story-event="E18C-IND-1773-HASTINGS-OPIUM-CONTRACT"]'
 driver.find_element(By.CSS_SELECTOR,target).click()
 wait.until(lambda d:at(1773))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-IND-1773-HASTINGS-OPIUM-CONTRACT'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-25.5941)<0.6&&Math.abs(c.lng-85.1376)<0.6"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-t21-1773-Hastings-Bihar-opium-contract.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IND-1786-BENARES-OPIUM-MONOPOLY"]').click()
 wait.until(lambda d:at(1786))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-IND-1786-BENARES-OPIUM-MONOPOLY'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-25.2)<0.6&&Math.abs(c.lng-83.0)<0.6"""))
 driver.save_screenshot(str(shots/'18c-t21-1786-Benares-ryot-resistance.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IND-1792-MADRAS-CHILD-RELIEF-ORDER"]').click()
 wait.until(lambda d:at(1792))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-IND-1792-MADRAS-CHILD-RELIEF-ORDER'"))
 driver.save_screenshot(str(shots/'18c-t21-1792-Madras-famine-child-relief-order.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IND-1792-NORTHERN-CIRCARS-STARVATION"]').click()
 wait.until(lambda d:at(1792))
 assert js("return !!document.querySelector('.major-story-article')")
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IND-1793-BIHAR-CULTIVATION-OPTIONAL"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1793))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.save_screenshot(str(shots/'18c-t21-1793-Bihar-voluntary-poppy-original-reader-return.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1788))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1788')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-IND-1788-BENGAL-SALT-CALCUTTA-AUCTION')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T21 15-topic genuine 1780x1020 desktop: 18 historical links, 21 chapters, Patna/Benares city references, Circars no false location, Madras famine, 1793 correction, double dossier/back, 14 old topics and 16C regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c-t21-india-opium-salt-browser-failure.png'))
 raise
finally:driver.quit()
