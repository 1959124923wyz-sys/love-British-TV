#!/usr/bin/env python3
"""Thirteenth T26 West African slave forts, coercion and agency: genuine desktop Chromium QA."""
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
story='E18-T26-WEST-AFRICA-SLAVE-FORTS-1727-1792'
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1752')
 wait.until(lambda d:at(1752))
 wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-WAF-1752-CASTLE-SLAVES-TRANSFER')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1788-DOLBEN-SHIP-LIMITS').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1779-JAMES-ISLAND-DESTRUCTION').lat!==null")
 zoom=js("return window.atlasReadViewport().zoom")
 card='#eventList [data-eid="E18C-WAF-1752-CASTLE-SLAVES-TRANSFER"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",card))
 driver.find_element(By.CSS_SELECTOR,card).click()
 entry=f'#dossierBody [data-story-open="{story}"]'
 wait.until(lambda d:js("return !!document.querySelector(arguments[0])",entry))
 driver.find_element(By.CSS_SELECTOR,entry).click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===17"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===20")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 driver.save_screenshot(str(shots/'18c-westafrica-1752-Britain-castle-slaves-company-property-article.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1757-ANOMABO-PRISON"]').click()
 wait.until(lambda d:at(1757))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-WAF-1757-ANOMABO-PRISON'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-5.174119)<0.6&&Math.abs(c.lng+1.119103)<0.6"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 driver.save_screenshot(str(shots/'18c-westafrica-1757-Anomabo-British-slave-prison.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1779-SAINT-LOUIS-RECAPTURE"]').click()
 wait.until(lambda d:at(1779))
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-WAF-1779-SAINT-LOUIS-RECAPTURE'"))
 wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-16.02778)<0.6&&Math.abs(c.lng+16.50444)<0.6"""))
 driver.save_screenshot(str(shots/'18c-westafrica-1779-British-Saint-Louis-loss.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1779-JAMES-ISLAND-DESTRUCTION"]').click()
 wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-WAF-1779-JAMES-ISLAND-DESTRUCTION'"))
 driver.save_screenshot(str(shots/'18c-westafrica-1779-James-Fort-destruction.png'))
 driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1788-DOLBEN-SHIP-LIMITS"]').click()
 wait.until(lambda d:at(1788))
 target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-WAF-1776-FUUTA-TOORO-RESISTANCE"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda d:at(1776))
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 driver.save_screenshot(str(shots/'18c-westafrica-1776-Fuuta-Tooro-resistance-no-floating-menu.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda d:at(1752))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 driver.get('http://127.0.0.1:8765/?year=1752')
 wait.until(lambda d:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-WAF-1752-CASTLE-SLAVES-TRANSFER')===null")
 driver.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda d:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T26 West Africa genuine desktop: 17 story links/20 chapters, site pans Anomabo/Saint-Louis/James, law event null GPS, 1776 African resistance double dossier/back, 16C regression and plain-mode isolation.')
except Exception:
 driver.save_screenshot(str(shots/'18c-westafrica-browser-failure.png'))
 raise
finally:driver.quit()
