#!/usr/bin/env python3
"""Real desktop 19-story: 1795 Fédon British Royal Navy attacks, 1796 repressive enslaver law, 1797 capital chain law and Haiti port mapping."""
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
def js(src,*args):return driver.execute_script(src,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda d:at(y))
topic='E18-T06-FEDON-GRENADA-HAITI-BRITISH-REPRESSION-1789-1798'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1795')
 wait.until(lambda d:at(1795))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-FED-1795-GRENVILLE-ATTACK')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-FED-1795-APR2-PIERRE-ALEXANDRE-EXECUTION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-FED-1793-JEREMIE-ENSLAVEMENT').lat===18.65")
 card='#eventList [data-eid="E18C-FED-1795-GRENVILLE-ATTACK"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{topic}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===25"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===28")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c19-1795-Fedon-Grenville-liberation-and-collateral-violence.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FED-1795-MAR15-LINDSAY-ATTACK"]').click()
 wait.until(lambda d:at(1795))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-FED-1795-MAR15-LINDSAY-ATTACK'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-12.16462)<0.5&&Math.abs(c.lng+61.72965)<0.5"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c19-1795-British-naval-Lindsay-suppression-Gouyave.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FED-1796-JUN7-ENSLAVED-REBEL-LAW"]').click()
 wait.until(lambda d:at(1796))
 driver.save_screenshot(str(shots/'18c19-1796-British-colonial-enslaved-insurgent-chain-penal-law.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FED-1794-PORT-AU-PRINCE-CAPTURE"]').click()
 wait.until(lambda d:at(1794))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-FED-1794-PORT-AU-PRINCE-CAPTURE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-18.54349)<0.8&&Math.abs(c.lng+72.33881)<0.8"""))
 driver.save_screenshot(str(shots/'18c19-1794-British-occupied-Port-au-Prince-not-whole-Haiti.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-FED-1797-MAY13-CHAINS-ESCAPE-DEATH-LAW"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1797))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c19-1797-British-death-penalty-for-escaping-chain-labour.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1795))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1795')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-FED-1795-GRENVILLE-ATTACK')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T06 19-story desktop: 25 links 28 chapters, 1795 British navy counterinsurgency and Fédon, 1796 slave law, 1794 occupied Haiti town GPS, 1797 chain-labour capital law dossier/back, 18 old stories and 16C unaffected.')
except Exception:
 driver.save_screenshot(str(shots/'18c19-Fedon-British-Grenada-Haiti-browser-failure.png'))
 raise
finally:driver.quit()
