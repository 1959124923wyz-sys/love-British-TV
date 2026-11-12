#!/usr/bin/env python3
"""18th-century Bengal + 1699/1700 continuity editor desktop browser audit.
Research-only mode. Run a local static HTTP server on 127.0.0.1:8765 first.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results'
shots.mkdir(exist_ok=True)
opts=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(a)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,60)
def js(code,*args):return browser.execute_script(code,*args)
def at_year(y):return js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",y)
def set_year(y):
    js("window.atlasStoryBridge.setYear(arguments[0]);",y)
    wait.until(lambda d:at_year(y))

try:
    browser.get('http://127.0.0.1:8765/?review18c=1&year=1770')
    wait.until(lambda d:at_year(1770))
    wait.until(lambda d:js("return window.atlasStoryBridge?.active18cBengalCoreIds!==undefined"))
    assert '十八世纪' in js("return document.querySelector('#chapterTitlePrimary')?.textContent||''")
    assert js("return !!window.atlasStoryBridge.eventById('E18C-BNG-1770-FAMINE-REGIONAL')")
    assert js("return !window.atlasStoryBridge.eventById('E18C-BNG-1770-FAMINE-REGIONAL').representative_map_point")
    assert not js("return window.atlasStoryBridge.eventById('E18C-BNG-1770-FAMINE-REGIONAL').lat!==null")
    # No 1700 phantom British control of French York Factory.
    set_year(1700)
    assert js("return window.atlasStoryBridge.active18cContinuityIds().length===7")
    assert js("return window.atlasStoryBridge.active18cContinuityIds().includes('C1700-FRENCH-YORK')")
    assert js("return window.atlasStoryBridge.active18cBengalCoreIds().length===0")
    # EIC lost old Fort William in 1756, recaptured in 1757.
    set_year(1755)
    assert js("return window.atlasStoryBridge.active18cBengalCoreIds().includes('C1700-ENGLISH-CALCUTTA')")
    set_year(1756)
    assert not js("return window.atlasStoryBridge.active18cBengalCoreIds().includes('C1700-ENGLISH-CALCUTTA')")
    set_year(1757)
    assert js("return window.atlasStoryBridge.active18cBengalCoreIds().includes('C1700-ENGLISH-CALCUTTA')")
    assert not js("return window.atlasStoryBridge.active18cBengalCoreIds().includes('18C-BNG-MURSHIDABAD-REVENUE')")
    set_year(1765)
    assert js("return window.atlasStoryBridge.active18cBengalCoreIds().includes('18C-BNG-MURSHIDABAD-REVENUE')")
    set_year(1770)
    wait.until(lambda d:js('''return !!document.querySelector('#eventList [data-eid="E18C-BNG-1770-PURNEA-MORTALITY"]')'''))
    zoom_before=js("return window.atlasReadViewport().zoom")
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="E18C-BNG-1770-PURNEA-MORTALITY"]').click()
    wait.until(lambda d:js('''return !!document.querySelector('#dossierBody [data-story-open="E18-T14-T15-BENGAL-1756-1773"]')'''))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E18-T14-T15-BENGAL-1756-1773"]').click()
    wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T14-T15-BENGAL-1756-1773'"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length>=17"))
    assert js("return document.querySelectorAll('.major-story-article .story-section').length===15")
    browser.save_screenshot(str(shots/'18c-bengal-1770-primary-letter-story.png'))
    # Article in-paragraph events use the real 16C/17C map bridge.
    browser.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-BNG-1757-PLASSEY"]').click()
    wait.until(lambda d:at_year(1757))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-BNG-1757-PLASSEY'"))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-23.795)<0.6&&Math.abs(c.lng-88.249)<0.6"""))
    assert js("return window.atlasReadViewport().zoom")==zoom_before
    assert js("return !!document.querySelector('.major-story-article')"),'single click must retain the story'
    browser.save_screenshot(str(shots/'18c-bengal-1757-plassey-pan.png'))
    # 1765 fiscal grant is a year-linked record, not a new Bengal area polygon.
    browser.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-BNG-1765-DIWANI"]').click()
    wait.until(lambda d:at_year(1765))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()==='E18C-BNG-1765-DIWANI'"))
    assert js("return window.atlasReadViewport().zoom")==zoom_before
    # Double-click 1772 primary grievance dossier; return to original chapter.
    target=browser.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-BNG-1772-PURNEA-PETITIONS"]')
    js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
    wait.until(lambda d:at_year(1772))
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
    wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E18-T14-T15-BENGAL-1756-1773'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:at_year(1770))
    assert js("return !document.querySelector('.major-story-article')")
    # Unreviewed subject hidden outside the opt-in path.
    browser.get('http://127.0.0.1:8765/?year=1770')
    wait.until(lambda d:at_year(1699))
    assert js("return window.atlasStoryBridge.eventById('E18C-BNG-1770-PURNEA-MORTALITY')===null")
    # Original mature Tudor map still available and unaffected.
    browser.get('http://127.0.0.1:8765/?year=1572')
    wait.until(lambda d:at_year(1572))
    assert js('''return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')''')
    print('PASS Bengal 18C desktop: 1700 actor continuity, 1756/1757 EIC control gap, 1765 fiscal core, 15-section source story, cross-decade pan, double-click archive return, default review gate and Tudor map')
except Exception:
    browser.save_screenshot(str(shots/'18c-bengal-continuity-failure.png'))
    raise
finally:
    browser.quit()
