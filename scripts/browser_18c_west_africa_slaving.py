#!/usr/bin/env python3
"""Actual 1780x1020 Chromium T26 West African enslaved persons law/fort Atlas + 12 story regressions."""
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
story='E18-T26-WEST-AFRICAN-SLAVING-FORTS-LAWS-1727-1795'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1758')
 wait.until(lambda d:at(1758))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-WAF-1758-BRITISH-CAPTURE-SAINT-LOUIS')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1750-CASTLE-SLAVES-TREATED-AS-PROPERTY').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1783-FORT-JAMES-BRITISH-TREATY-CLAIM').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1779-FRENCH-DESTROY-FORT-JAMES').lat!==null")
 oldZoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-WAF-1758-BRITISH-CAPTURE-SAINT-LOUIS"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===21"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===19")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 assert js("return document.querySelector('.major-story-article').textContent.includes('castle slaves')")
 driver.save_screenshot(str(shots/'18c-west-africa-1750-British-enslaved-fort-labor-and-law-story.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1758-BRITISH-CAPTURE-GOREE"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-WAF-1758-BRITISH-CAPTURE-GOREE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-14.66722)<0.6&&Math.abs(c.lng+17.40083)<0.6"""))
 assert oldZoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-west-africa-1758-british-captured-goree-slaving-fort.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1758-BRITISH-CAPTURE-SAINT-LOUIS"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-WAF-1758-BRITISH-CAPTURE-SAINT-LOUIS'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-16.02778)<0.6&&Math.abs(c.lng+16.50444)<0.6"""))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1779-FRENCH-DESTROY-FORT-JAMES"]').click()
 wait.until(lambda d:at(1779))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-WAF-1779-FRENCH-DESTROY-FORT-JAMES'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-13.31764)<0.6&&Math.abs(c.lng+16.36135)<0.6"""))
 driver.save_screenshot(str(shots/'18c-west-africa-1779-destroyed-fort-james-unesco.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1788-DOLBEN-SLAVE-SHIP-REGULATION"]').click()
 wait.until(lambda d:at(1788))
 assert js("return document.querySelector('.major-story-article')!==null")
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1791-ABOLITION-DEFEATED"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1791))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.save_screenshot(str(shots/'18c-west-africa-1791-abolition-rejected-no-floating-reader.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1758))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1758')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1758-BRITISH-CAPTURE-SAINT-LOUIS')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T26 desktop: 19 chapters, 21 interactive map passages, Saint-Louis/Goree/Fort James real UNESCO geo references, 1788 slave-ship law/1791 double dossier and original-year return, no dynamic TOC, normal mode isolation and sixteenth-century event regression.')
except Exception:
 driver.save_screenshot(str(shots/'18c-west-africa-browser-failure.png'))
 raise
finally:driver.quit()
