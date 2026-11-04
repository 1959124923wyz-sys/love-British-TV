#!/usr/bin/env python3
"""Editor15 desktop: source-backed, cross-decade chronology in published long story."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

out=Path(__file__).resolve().parents[1]/'browser-smoke-results'
out.mkdir(exist_ok=True)
opts=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1700,1000'):
    opts.add_argument(flag)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,65)
def js(code,*args):return browser.execute_script(code,*args)
try:
    browser.get('http://127.0.0.1:8765/?year=1649')
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1649'"))
    wait.until(lambda _:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(el=>el.dataset.eid==='1640S-E016')"))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1640S-E016"]').click()
    wait.until(lambda _:js("return !!document.querySelector('[data-story-open=\"E6-T02\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-open="E6-T02"]').click()
    wait.until(lambda _:js("return document.querySelectorAll('.major-story-article .story-section').length===15"))
    assert js("return !!document.querySelector('.major-story-article .story-chronology:not([open])')")
    browser.find_element(By.CSS_SELECTOR,'.major-story-article .story-chronology > summary').click()
    assert js("return document.querySelector('.story-chronology').open")
    assert js("return document.querySelector('.story-chronology').textContent.includes('1640年代') && document.querySelector('.story-chronology').textContent.includes('1650年代')")
    original=js("return document.querySelector('.major-story-article').dataset.storyId")
    # Choose a real source-linked event from the 1650s; no synthetic year pin.
    selected=js("""return [...document.querySelectorAll('.story-chronology [data-story-event]')]
      .find(el=>window.atlasStoryBridge.eventById(el.dataset.storyEvent)?.year>=1650)?.dataset.storyEvent""")
    assert selected,'published source item from next decade missing'
    js("""const node=document.querySelector('.story-chronology [data-story-event="'+arguments[0]+'"]');
      node.scrollIntoView({block:'center'});node.click();""",selected)
    wait.until(lambda _:js("return Number(document.getElementById('bigYear').textContent)>=1650"))
    assert js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",original)
    assert js("return Number(document.getElementById('bigYear').textContent)===window.atlasStoryBridge.eventById(arguments[0]).year",selected)
    assert js("return window.atlasStoryBridge.activeEventWindow().to===Number(document.getElementById('bigYear').textContent)")
    browser.save_screenshot(str(out/'editor15-17c-source-year-index.png'))
    # Original 16C readers must not be given a 17C index.
    browser.get('http://127.0.0.1:8765/?year=1497')
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1497'"))
    wait.until(lambda _:js("return !!window.HistoryStories && !!window.atlasStoryBridge"))
    js("window.HistoryStories.openStory('cabot-bristol-atlantic-voyages-1496-1498',false)")
    wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId==='cabot-bristol-atlantic-voyages-1496-1498'"))
    assert js("return !document.querySelector('.major-story-article .story-chronology')")
    print('PASS Editor15: published 17C topic has clickable sourced 1640s/1650s years; 16C original intact')
except Exception:
    browser.save_screenshot(str(out/'editor15-story-chronology-error.png'))
    raise
finally:
    browser.quit()
