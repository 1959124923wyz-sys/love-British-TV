#!/usr/bin/env python3
"""Real Chromium regression for the 1543–1550 cross-chapter Scottish war longform."""
from pathlib import Path
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'rough-wooing-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ['--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1510,950']:
    opts.add_argument(arg)
opts.set_capability('goog:loggingPrefs', {'browser':'ALL'})
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,45)
def js(code,*args):return browser.execute_script(code,*args)
def waityear(year):
    wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(year)))
def clicklink(eid):
    el=browser.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",el)
    el.click()
try:
    browser.get('http://127.0.0.1:8765/?year=1544')
    wait.until(lambda d:d.execute_script("""return document.querySelector('#eventList [data-eid="GAP1544-MELROSE"]') &&
       window.HistoryStories?.eventLinkMarkup?.({id:'GAP1544-MELROSE'},'event').includes('粗暴')===false &&
       window.HistoryStories?.eventLinkMarkup?.({id:'GAP1544-MELROSE'},'event').includes('英苏战争')"""))
    source=browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="GAP1544-MELROSE"]')
    js("arguments[0].scrollIntoView({block:'center'})",source)
    source.click()
    wait.until(lambda d:d.execute_script("""return !!document.querySelector('#dossierBody [data-story-open="rough-wooing-anglo-scottish-war-1543-1550"]')"""))
    assert js("return document.querySelector('.major-story-enter').dataset.storySource==='GAP1544-MELROSE'")
    assert js("return !document.querySelector('#dossierBody .source-details')")
    browser.save_screenshot(str(OUT/'01-melrose-event-and-history-entry.png'))
    browser.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article') && document.querySelectorAll('.major-story-article .story-section').length===11"))
    assert js("return document.querySelector('.major-story-article').innerText.length>4300")
    assert js("return !document.querySelector('.story-status') && !document.querySelector('.story-sources').open")
    browser.save_screenshot(str(OUT/'02-anglo-scottish-war-longform.png'))
    # Each link must reuse existing map markers and advance time axis directly.
    for eid,year in [('GAP1545-ANCRUM',1545),('1540S-014',1547),('1540S-019',1548),('1550S-E001',1550)]:
        clicklink(eid)
        waityear(year)
        wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
        assert js("return !!document.querySelector('.major-story-article')")
    browser.save_screenshot(str(OUT/'03-1550-broughty-castle-recaptured.png'))
    # Double-click opens the independent record, and back restores reading.
    el=browser.find_element(By.CSS_SELECTOR,'[data-story-event="1550S-E001"]')
    js("arguments[0].scrollIntoView({block:'center'})",el)
    ActionChains(browser).double_click(el).perform()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-back]') && document.querySelector('#dossierBody h2')?.textContent.includes('布劳蒂')"))
    assert js("return !document.querySelector('.source-details')")
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    # Returning from history to the originating child restores 1544, not 1550.
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    waityear(1544)
    wait.until(lambda d:d.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('梅尔罗斯') && !!document.querySelector('.major-story-entry')"))
    assert js("return !document.getElementById('workspace').classList.contains('dossier-collapsed')")
    browser.save_screenshot(str(OUT/'04-return-to-1544-origin-melrose.png'))
    # Also accessible if reader starts in the following decade.
    js("""const ctl=document.getElementById('jumpYear');ctl.value='1550';ctl.dispatchEvent(new Event('change',{bubbles:true}));""")
    waityear(1550)
    assert js("""return !!document.querySelector('#eventList [data-eid="1550S-E001"]')""")
    # The article intentionally collapses the event-list sidebar to give map room.
    # Expand it via the existing user control before attempting a real pointer click.
    if js("return document.getElementById('workspace').classList.contains('sidebar-collapsed')"):
        browser.find_element(By.ID,'mobileEventsToggle').click()
        wait.until(lambda d:d.execute_script("""return !document.getElementById('workspace').classList.contains('sidebar-collapsed') &&
           document.getElementById('sidebar').getBoundingClientRect().width>=245"""))
    source=browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1550S-E001"]')
    js("arguments[0].scrollIntoView({block:'center'})",source)
    source.click()
    wait.until(lambda d:d.execute_script("""return !document.getElementById('workspace').classList.contains('dossier-collapsed') &&
       document.querySelector('#dossierBody h2')?.textContent.includes('布劳蒂') &&
       !!document.querySelector('.major-story-enter')"""))
    # The mutually exclusive event and dossier sidebar columns animate for 220ms.
    time.sleep(0.35)
    entry=browser.find_element(By.CSS_SELECTOR,'.major-story-enter')
    js("arguments[0].scrollIntoView({block:'center'})",entry)
    entry.click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    clicklink('1540S-014')
    waityear(1547)
    wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()==='1540S-014'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    waityear(1550)
    wait.until(lambda d:d.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('布劳蒂')"))
    browser.save_screenshot(str(OUT/'05-return-to-original-1550.png'))
    # Mobile should retain two-level UI: no extra map widgets or timeline circles.
    browser.set_window_size(410,850)
    wait.until(lambda d:d.execute_script("return innerWidth<680"))
    assert js("return document.querySelectorAll('.milestone-dot').length===0")
    assert js("return !document.querySelector('.story-status')")
    print('PASS Scottish war article: 11 sections, 1544↔1550 links, map focus, double-click, return to origin both directions and mobile')
except Exception:
    print('CHROMIUM LOGS',browser.get_log('browser'),flush=True)
    browser.save_screenshot(str(OUT/'error.png'))
    raise
finally:
    browser.quit()
