#!/usr/bin/env python3
"""Desktop smoke for gated, UNPUBLISHED Acadian 18C map pilot.
Run the repo on http://127.0.0.1:8765/ with a static HTTP server first.
No production publication; screenshot results remain CI artifacts.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(arg)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,55)
def js(code,*args): return browser.execute_script(code,*args)
def at_year(y): return js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",y)
try:
    # All historical map logic uses the existing 16/17C viewer; pilot entry stays query-gated.
    browser.get('http://127.0.0.1:8765/?review18c=1&year=1755')
    wait.until(lambda d: at_year(1755))
    assert '研究试阅' in js("return document.querySelector('#chapterIntro')?.textContent||''")
    assert js("return window.atlasStoryBridge.active18cControlCoreIds().length===4")
    assert js("return window.atlasStoryBridge.active18cControlCoreIds().includes('ACD-CORE-FORT-CUMBERLAND-1755')")
    # Differentiate source-attested fort garrison end from continuous paper claims.
    js("window.atlasStoryBridge.setYear(1768)")
    wait.until(lambda d: at_year(1768))
    assert js("return window.atlasStoryBridge.active18cControlCoreIds().includes('ACD-CORE-FORT-CUMBERLAND-1755')")
    js("window.atlasStoryBridge.setYear(1769)")
    wait.until(lambda d: at_year(1769))
    assert not js("return window.atlasStoryBridge.active18cControlCoreIds().includes('ACD-CORE-FORT-CUMBERLAND-1755')")
    js("window.atlasStoryBridge.setYear(1710)")
    wait.until(lambda d: at_year(1710))
    assert js("return window.atlasStoryBridge.active18cControlCoreIds().length===1")
    js("window.atlasStoryBridge.setYear(1755)")
    wait.until(lambda d: at_year(1755))
    wait.until(lambda d: js("""return !!document.querySelector('#eventList [data-eid="E18C-ACD-1755-HALIFAX-ORDER"]')"""))
    initial_zoom=js("return window.atlasReadViewport().zoom")
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="E18C-ACD-1755-HALIFAX-ORDER"]').click()
    wait.until(lambda d: js("""return !!document.querySelector('#dossierBody .major-story-enter[data-story-open="E18-C07-ACADIA-DEPORTATION"]')"""))
    browser.find_element(By.CSS_SELECTOR,'.major-story-enter[data-story-open="E18-C07-ACADIA-DEPORTATION"]').click()
    wait.until(lambda d: js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-C07-ACADIA-DEPORTATION'"""))
    wait.until(lambda d: js("return document.querySelectorAll('.major-story-article .story-event-link').length>=19"))
    assert js("return document.querySelectorAll('.story-chronology-year').length>=8")
    browser.save_screenshot(str(out/'18c-acadia-review-1755-story.png'))
    # Cross-decade inline click: reader remains open; the year changes; map pans without changing zoom.
    browser.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ACD-1758-SKMAQN-ISLAND-EXPEL"]').click()
    wait.until(lambda d: at_year(1758))
    wait.until(lambda d: js("return window.atlasStoryBridge.activeFocusId()==='E18C-ACD-1758-SKMAQN-ISLAND-EXPEL'"))
    wait.until(lambda d: js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-46.19544)<0.5&&Math.abs(c.lng+63.13554)<0.5"""))
    assert js("return window.atlasReadViewport().zoom") == initial_zoom
    assert js("return !!document.querySelector('.major-story-article')")
    browser.save_screenshot(str(out/'18c-acadia-review-1758-map-pan.png'))
    # Double-click a different year from the story to open its separate original event dossier.
    target=browser.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-ACD-1755-GRANDPRE-EXPEL"]')
    js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
    wait.until(lambda d: at_year(1755))
    wait.until(lambda d: js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
    wait.until(lambda d: js("""return document.querySelector('.major-story-article')?.dataset.storyId==='E18-C07-ACADIA-DEPORTATION'"""))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d: at_year(1755))
    assert js("return document.querySelector('.major-story-article')===null")
    # Without opt-in, the century should remain capped to 1699 (as it was).
    browser.get('http://127.0.0.1:8765/?year=1755')
    wait.until(lambda d: at_year(1699))
    assert js("return window.atlasStoryBridge.eventById('E18C-ACD-1755-HALIFAX-ORDER')===null")
    # The already published 16C reader should still load unchanged.
    browser.get('http://127.0.0.1:8765/?year=1572')
    wait.until(lambda d: at_year(1572))
    assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(el=>el.dataset.eid==='1570S-E004')""")
    print('PASS: 18C opt-in year switch, linked Acadia narrative, map pan, double-click dossier/return, default year guard, 16C regression')
except Exception:
    browser.save_screenshot(str(out/'18c-acadia-review-failure.png'))
    raise
finally:
    browser.quit()
