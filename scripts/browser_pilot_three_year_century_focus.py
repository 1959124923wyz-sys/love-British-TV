#!/usr/bin/env python3
"""Actual desktop Chromium: original atlas, 3-year and century source view."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True)
opts=Options()
for f in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1840,1060'):
    opts.add_argument(f)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,100)
def js(code,*args): return browser.execute_script(code,*args)
try:
    browser.get('http://127.0.0.1:8765/?year=1649&topicPilot=E6-T02')
    wait.until(lambda _:js("return window.atlasStoryBridge?.focusedTopicId?.()==='E6-T02'"))
    wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E6-T02'"))
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1649'"))
    assert js("return document.querySelector('.workspace').classList.contains('topic-focus')")
    assert js("return !document.querySelector('.workspace').classList.contains('sidebar-collapsed')")
    assert js("return window.atlasStoryBridge.activeEventWindow().from===1647")
    assert js("return window.atlasStoryBridge.activeEventWindow().to===1649")
    assert js("return window.atlasStoryBridge.activeEventWindow().ids.includes('1640S-E028')")
    assert js("return [...document.querySelectorAll('#eventList [data-eid]')].every(el=>window.atlasStoryBridge.activeEventWindow().ids.includes(el.dataset.eid))")
    assert js("return document.querySelectorAll('.major-story-article .story-section').length===15")
    browser.save_screenshot(str(out/'pilot-topic-real-map-1649-three-years.png'))
    js("window.atlasStoryBridge.setYear(1650)")
    wait.until(lambda _:js("return window.atlasStoryBridge.activeEventWindow().from===1648"))
    assert js("return window.atlasStoryBridge.activeEventWindow().ids.includes('1640S-E016')")
    assert not js("return window.atlasStoryBridge.activeEventWindow().ids.includes('1640S-E028')")
    browser.find_element(By.ID,'showCenturyEventPanorama').click()
    wait.until(lambda _:js("return window.atlasStoryBridge.activeEventWindow().mode==='century'"))
    assert js("return window.atlasStoryBridge.activeEventWindow().from===1600 && window.atlasStoryBridge.activeEventWindow().to===1699")
    assert js("return window.atlasStoryBridge.activeEventWindow().ids.length===17")
    assert js("return document.querySelectorAll('#eventList [data-eid]').length===17")
    assert js("return document.querySelector('.major-story-article')?.dataset.storyId==='E6-T02'")
    assert js("return document.querySelector('#seventeenthEventWindowRange').textContent.includes('疆域仍只代表1650年')")
    browser.save_screenshot(str(out/'pilot-topic-century-source-only-and-year-territory.png'))
    js("document.querySelector('#eventList [data-eid=\"1650S-E021\"]').click()")
    wait.until(lambda _:js("return document.getElementById('bigYear').textContent==='1656'"))
    wait.until(lambda _:js("return document.getElementById('dossierBody').textContent.includes('Down Survey')"))
    assert js("return window.atlasStoryBridge.focusedTopicId()==='E6-T02'")
    browser.find_element(By.ID,'topicFocusOpen').click()
    wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E6-T02'"))
    assert js("return !document.querySelector('.workspace').classList.contains('sidebar-collapsed')")
    browser.find_element(By.ID,'showCenturyEventPanorama').click()
    assert js("return window.atlasStoryBridge.activeEventWindow().mode==='rolling3'")
    assert js("return window.atlasStoryBridge.activeEventWindow().from===1654")
    browser.find_element(By.ID,'topicFocusExit').click()
    assert js("return window.atlasStoryBridge.focusedTopicId()===null")
    browser.save_screenshot(str(out/'pilot-topic-exit-restores-ordinary-atlas.png'))
    browser.get('http://127.0.0.1:8765/?year=1699')
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1699'"))
    browser.find_element(By.ID,'showCenturyEventPanorama').click()
    wait.until(lambda _:js("return window.atlasStoryBridge.activeEventWindow().mode==='century'"))
    assert js("return window.atlasStoryBridge.activeEventWindow().ids.length>=500")
    assert js("return document.querySelectorAll('#eventList [data-eid]').length>=500")
    browser.save_screenshot(str(out/'pilot-full-17c-100-year-event-panorama.png'))
    browser.get('http://127.0.0.1:8765/?year=1599')
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1599'"))
    assert js("return document.getElementById('seventeenthEventTools').hidden")
    assert js("return document.querySelectorAll('#eventList .event-item').length>0")
    print('PASS isolated original-map subject pilot: 1649 3-year, 1600-1699 source archive, 1656 date jump, original 1599')
except Exception:
    browser.save_screenshot(str(out/'pilot-editor15-error.png'))
    raise
finally:
    browser.quit()
