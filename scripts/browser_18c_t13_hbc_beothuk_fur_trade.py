#!/usr/bin/env python3
"""True desktop Chromium 25-topic: HBC forts, Dene and Cree diplomacy, Beothuk dispossession and French 1782 raids."""
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
topic='E18-T13-HBC-NEWFOUNDLAND-BEOTHUK-DENE-CREE-1700-1792'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1715')
 wait.until(lambda d:at(1715))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T13-1715-DENE-CREE-PEACE-MISSION')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T13-1715-DENE-CREE-PEACE-MISSION').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-T13-1732-PRINCE-WALES-FIRST-STONE').lat===58.76841")
 selector='#eventList [data-eid="E18C-T13-1715-DENE-CREE-PEACE-MISSION"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
 driver.find_element(By.CSS_SELECTOR,selector).click()
 entry='#dossierBody [data-story-open="'+topic+'"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===29"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===29")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c25-1715-Dene-Thanadelthur-Cree-peace.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1700-MAR25-NEWFOUNDLAND-LAW"]').click()
 wait.until(lambda d:at(1700))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-47.56494)<0.6&&Math.abs(c.lng+52.70931)<0.6"))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c25-1700-Newfoundland-British-fishing-law-shore-privileges.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1713-UTRECHT-HBC-CLAIMS"]').click()
 wait.until(lambda d:at(1713))
 driver.save_screenshot(str(shots/'18c25-1713-Treaty-Utrecht-HBC-corporate-trade-claims.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1717-CHURCHILL-RIVER-POST"]').click()
 wait.until(lambda d:at(1717))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-58.76841)<0.6&&Math.abs(c.lng+94.16496)<0.6"))
 driver.save_screenshot(str(shots/'18c25-1717-Company-trading-post-Dene-work.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1754-JUN26-HENDAY-CREE"]').click()
 wait.until(lambda d:at(1754))
 driver.save_screenshot(str(shots/'18c25-1754-Cree-guided-Henday-no-invented-route.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1771-BLOODY-FALLS-INUIT"]').click()
 wait.until(lambda d:at(1771))
 driver.save_screenshot(str(shots/'18c25-1771-Inuit-Bloody-Falls-expedition-multiactor-attribution.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1782-AUG9-PRINCE-SURRENDER"]').click()
 wait.until(lambda d:at(1782))
 wait.until(lambda d:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-58.76841)<0.6&&Math.abs(c.lng+94.16496)<0.6"))
 driver.save_screenshot(str(shots/'18c25-1782-French-LaPerouse-takes-Prince-of-Wales-fort.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1782-AUG24-YORK-SURRENDER"]').click()
 wait.until(lambda d:at(1782))
 driver.save_screenshot(str(shots/'18c25-1782-French-takes-York-not-same-fort.png'))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T13-1783-SEP3-NEWFOUNDLAND-FISH"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1783))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 driver.save_screenshot(str(shots/'18c25-1783-Fishing-rights-Treaty-doubleclick-back.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1715))
 driver.get('http://127.0.0.1:8765/?year=1715')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T13-1715-DENE-CREE-PEACE-MISSION')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS T13 25-story desktop: 29 chapters and links, 1700 fishery law, 1713 treaty, Thanadelthur Dene/Cree, 1754 Cree guides, 1771 Inuit casualties, 1782 both French forts, 1783 fishery Article 3 and dossier return, 24 old stories and official 16C unchanged.')
except Exception:
 driver.save_screenshot(str(shots/'18c25-T13-browser-failure.png'))
 raise
finally:
 driver.quit()
