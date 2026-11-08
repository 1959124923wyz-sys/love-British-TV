#!/usr/bin/env python3
"""Fourth 18C source-linked Atlantic/Zong map: actual desktop Chromium journey."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
base=Path(__file__).resolve().parents[1]
shots=base/'browser-smoke-results';shots.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,60)
def js(script,*args):return driver.execute_script(script,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):
    js("window.atlasStoryBridge.setYear(arguments[0])",y)
    wait.until(lambda d:at(y))
try:
    driver.get('http://127.0.0.1:8765/?review18c=1&year=1783')
    wait.until(lambda d:at(1783))
    wait.until(lambda d:js("return !!window.atlasStoryBridge?.eventById?.('E18C-ATL-1783-ZONG-INSURANCE-TRIAL')"))
    assert js("return window.atlasStoryBridge.eventById('E18C-ATL-1781-ZONG-MASS-KILLING').lat===null")
    assert js("return window.atlasStoryBridge.eventById('E18C-ATL-1781-ZONG-BLACK-RIVER').lat!==null")
    wait.until(lambda d:js("""return !!document.querySelector('#eventList [data-eid="E18C-ATL-1783-ZONG-INSURANCE-TRIAL"]')"""))
    zoom=js("return window.atlasReadViewport().zoom")
    driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="E18C-ATL-1783-ZONG-INSURANCE-TRIAL"]').click()
    wait.until(lambda d:js("""return !!document.querySelector('#dossierBody [data-story-open="E18-T01-T02-ATLANTIC-ZONG-1711-1799"]')"""))
    driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E18-T01-T02-ATLANTIC-ZONG-1711-1799"]').click()
    wait.until(lambda d:js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T01-T02-ATLANTIC-ZONG-1711-1799'"""))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===14"))
    assert js("return document.querySelectorAll('.major-story-article .story-section').length===15")
    driver.save_screenshot(str(shots/'18c-atlantic-zong-1783-lawsuit-article.png'))
    driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ATL-1781-ZONG-BLACK-RIVER"]').click()
    wait.until(lambda d:at(1781))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-ATL-1781-ZONG-BLACK-RIVER'"))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-18.0264)<0.6&&Math.abs(c.lng+77.8487)<0.6"""))
    assert zoom==js("return window.atlasReadViewport().zoom")
    assert js("return !!document.querySelector('.major-story-article')")
    driver.save_screenshot(str(shots/'18c-atlantic-zong-1781-black-river-reference.png'))
    driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ATL-1781-ZONG-MASS-KILLING"]').click()
    wait.until(lambda d:at(1781))
    assert js("return !!document.querySelector('.major-story-article')")
    # Original event dossier and article backtrack must survive the decade switch.
    target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ATL-1783-ZONG-INSURANCE-TRIAL"]')
    js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
    wait.until(lambda d:at(1783))
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
    wait.until(lambda d:js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T01-T02-ATLANTIC-ZONG-1711-1799'"""))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:at(1783))
    assert not js("return !!document.querySelector('.major-story-article')")
    year(1799)
    assert js("return document.querySelector('#nextYear').disabled")
    driver.get('http://127.0.0.1:8765/?year=1783')
    wait.until(lambda d:at(1699))
    assert js("return window.atlasStoryBridge.eventById('E18C-ATL-1783-ZONG-INSURANCE-TRIAL')===null")
    driver.get('http://127.0.0.1:8765/?year=1572')
    wait.until(lambda d:at(1572))
    assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
    print('PASS Atlantic/Zong: 14 links, 15 story sections, Black River pan, Zong unknown ocean position, 1783 double dossier/back, ordinary-site isolation and 16C regression')
except Exception:
    driver.save_screenshot(str(shots/'18c-atlantic-zong-browser-failure.png'))
    raise
finally:
    driver.quit()
