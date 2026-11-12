#!/usr/bin/env python3
"""Fifth 18C opt-in Ireland Penal Law / 1798 rebellion full desktop Chromium smoke."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 opt.add_argument(arg)
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,60)
def js(v,*args):return driver.execute_script(v,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):
 js("window.atlasStoryBridge.setYear(arguments[0])",y)
 wait.until(lambda d:at(y))
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1798')
 wait.until(lambda d:at(1798))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-IRL-1798-VINEGAR-HILL')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-IRL-1798-DUNLAVIN-EXECUTIONS').lat!==null")
 assert js("return window.atlasStoryBridge.eventById('E18C-IRL-1798-SCULLABOGUE').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-IRL-1797-COUNTERINSURGENCY').lat===null")
 zoom=js("return window.atlasReadViewport().zoom")
 selector='#eventList [data-eid="E18C-IRL-1798-VINEGAR-HILL"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
 driver.find_element(By.CSS_SELECTOR,selector).click()
 wait.until(lambda d:js("""return !!document.querySelector('#dossierBody [data-story-open="E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799"]')"""))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799"]').click()
 wait.until(lambda d:js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799'"""))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===20"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===16")
 driver.save_screenshot(str(shots/'18c-ireland-1798-vinegar-hill-story.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IRL-1798-OULART"]').click()
 wait.until(lambda d:at(1798))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-IRL-1798-OULART'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-52.512104)<0.6&&Math.abs(c.lng+6.403327)<0.6"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-ireland-1798-oulart-referenced-hill.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IRL-1704-PENAL-LAW"]').click()
 wait.until(lambda d:at(1704))
 assert js("return !!document.querySelector('.major-story-article')")
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-IRL-1798-DUNLAVIN-EXECUTIONS"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1798))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799'"""))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1798))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799)
 assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1798')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-IRL-1798-VINEGAR-HILL')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS Ireland 18C: 1798/1704 year changes, Oulart site pan, Dunlavin double dossier/back, 20 inline links and 16 sections, ordinary website isolation, 16C Tudor atlas regression')
except Exception:
 driver.save_screenshot(str(shots/'18c-ireland-browser-failure.png'))
 raise
finally:driver.quit()
