#!/usr/bin/env python3
"""Jamaica Maroon cross-century source-linked 18C review smoke (desktop Chromium)."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

home=Path(__file__).resolve().parents[1]
shots=home/'browser-smoke-results'
shots.mkdir(exist_ok=True)
options=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    options.add_argument(arg)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,60)
def js(cmd,*args):return driver.execute_script(cmd,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):
    js("window.atlasStoryBridge.setYear(arguments[0])",y)
    wait.until(lambda d:at(y))
try:
    driver.get('http://127.0.0.1:8765/?review18c=1&year=1796')
    wait.until(lambda d:at(1796))
    wait.until(lambda d:js("return window.atlasStoryBridge?.active18cMaroonCoreIds!==undefined"))
    assert js("return window.atlasStoryBridge.active18cMaroonCoreIds().length===2")
    assert js("return window.atlasStoryBridge.eventById('E18C-JAM-1796-APR-DEPORTATION').lat===null")
    assert js("return window.atlasStoryBridge.eventById('E18C-JAM-1796-JUL-HALIFAX').lat!==null")
    assert not js("return window.atlasStoryBridge.eventById('E18C-JAM-1800-SIERRA-LEONE')"),'1800 not placed in 18C calendar'
    year(1738)
    assert js("return window.atlasStoryBridge.active18cMaroonCoreIds().length===0")
    year(1739)
    assert js("return window.atlasStoryBridge.active18cMaroonCoreIds().length===1")
    year(1740)
    assert js("return window.atlasStoryBridge.active18cMaroonCoreIds().length===2")
    year(1795)
    assert js("return window.atlasStoryBridge.active18cMaroonCoreIds().length===2"),'Trelawny War cannot erase all Maroon communities'
    year(1796)
    wait.until(lambda d:js("""return !!document.querySelector('#eventList [data-eid="E18C-JAM-1796-JUL-HALIFAX"]')"""))
    zoom=js("return window.atlasReadViewport().zoom")
    driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="E18C-JAM-1796-JUL-HALIFAX"]').click()
    wait.until(lambda d:js("""return !!document.querySelector('#dossierBody [data-story-open="E18-T03-T04-JAMAICA-MAROONS-1718-1799"]')"""))
    driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E18-T03-T04-JAMAICA-MAROONS-1718-1799"]').click()
    wait.until(lambda d:js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T03-T04-JAMAICA-MAROONS-1718-1799'"""))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===17"))
    assert js("return document.querySelectorAll('.major-story-article .story-section').length===16")
    driver.save_screenshot(str(shots/'18c-jamaica-maroon-1796-halifax-history.png'))
    # Even a land/right autonomy point must be differentiated from a British control polygon.
    driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-JAM-1739-ACCOMPONG-COMMUNITY"]').click()
    wait.until(lambda d:at(1739))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-JAM-1739-ACCOMPONG-COMMUNITY'"))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-18.2333)<0.6&&Math.abs(c.lng+77.75)<0.6"""))
    assert zoom==js("return window.atlasReadViewport().zoom")
    assert js("return !!document.querySelector('.major-story-article')")
    driver.save_screenshot(str(shots/'18c-jamaica-maroon-1739-accompong-pan.png'))
    driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-JAM-1760-TAKY-REVOLT"]').click()
    wait.until(lambda d:at(1760))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-JAM-1760-TAKY-REVOLT'"))
    assert zoom==js("return window.atlasReadViewport().zoom")
    # No-coordinate legislative event still opens original readable archive on double-click.
    target=driver.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-JAM-1788-MAROON-COURTS"]')
    js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
    wait.until(lambda d:at(1788))
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    driver.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
    wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T03-T04-JAMAICA-MAROONS-1718-1799'"))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:at(1796))
    assert not js("return !!document.querySelector('.major-story-article')")
    year(1799)
    assert js("return document.querySelector('#nextYear').disabled")
    # Neither late 18C content nor three research chapter files appear on ordinary published site.
    driver.get('http://127.0.0.1:8765/?year=1796')
    wait.until(lambda d:at(1699))
    assert js("return window.atlasStoryBridge.eventById('E18C-JAM-1796-APR-DEPORTATION')===null")
    driver.get('http://127.0.0.1:8765/?year=1572')
    wait.until(lambda d:at(1572))
    assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
    print('PASS: Jamaica 1796 story, 1739/1740 Maroon autonomy points, cross-year 1760 Tacky pan, 1788 no-coordinate law dossier and return, 1799 limit, no-opt-in guard and 16C regression')
except Exception:
    driver.save_screenshot(str(shots/'18c-jamaica-maroon-browser-failure.png'))
    raise
finally:
    driver.quit()
