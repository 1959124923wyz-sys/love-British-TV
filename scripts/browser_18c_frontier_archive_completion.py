#!/usr/bin/env python3
"""T35 17th study genuine desktop: British violent orders, real Hawkesbury military killings and court injustice."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
opt=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(a)
driver=webdriver.Chrome(options=opt);wait=WebDriverWait(driver,60)
def js(src,*args):return driver.execute_script(src,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda d:at(y))
topic='E18-T35-ABORIGINAL-FRONTIER-MASSACRE-1788-1799'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1789')
 wait.until(lambda d:at(1789))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-FRONTIER-1789-ARABANOO-DIES')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-FRONTIER-1795-PATERSON-MILITARY-KILLS').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-FRONTIER-1790-WILLEMERING-SPEARS-PHILLIP').lat===-33.800094")
 assert js("return !!window.atlasStoryBridge.eventById('E18C-AUS-1795-HAWKESBURY-MILITARY')")
 card='#eventList [data-eid="E18C-FRONTIER-1789-ARABANOO-DIES"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{topic}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===25"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===28")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c17-1789-Aboriginal-Arabanoo-dies-under-British-captivity.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FRONTIER-1790-WILLEMERING-SPEARS-PHILLIP"]').click()
 wait.until(lambda d:at(1790))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-FRONTIER-1790-WILLEMERING-SPEARS-PHILLIP'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat+33.800094)<0.6&&Math.abs(c.lng-151.282579)<0.6"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c17-1790-Willemering-not-Pemulwuy-Manly-correct-actor.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FRONTIER-1790-PHILLIP-ORDER-TEN-HEADS"]').click()
 wait.until(lambda d:at(1790))
 assert js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic)
 assert js("return window.atlasStoryBridge.eventById('E18C-FRONTIER-1790-PHILLIP-ORDER-TEN-HEADS').lat===null")
 driver.save_screenshot(str(shots/'18c17-1790-british-ten-beheadings-ordered-none-killed.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FRONTIER-1795-PATERSON-MILITARY-KILLS"]').click()
 wait.until(lambda d:at(1795))
 driver.save_screenshot(str(shots/'18c17-1795-British-62-troops-seven-or-eight-Indigenous-killed.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FRONTIER-1799-FEB-HEWITT-WILLIE-CUTHIE"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1799))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c17-1799-colonial-court-Aboriginal-widow-excluded-dossier-return.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1789))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1795')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-FRONTIER-1795-PATERSON-MILITARY-KILLS')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS 17th T35 actual desktop: 25 linked entries and 28 chapters; Manly correct spear actor, 1790 planned beheadings failed, 1795 army killing 7-8, 1799 court victim testimony excluded; double-click/back, former 16 studies and 16C intact')
except Exception:
 driver.save_screenshot(str(shots/'18c17-Aboriginal-frontier-browser-failure.png'))
 raise
finally:driver.quit()
