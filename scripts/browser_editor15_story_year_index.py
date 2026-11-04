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
    selected=js("""return [...document.querySelectorAll('.story-chronology [data-story-index-event]')]
      .find(el=>window.atlasStoryBridge.eventById(el.dataset.storyIndexEvent)?.year>=1650)?.dataset.storyIndexEvent""")
    assert selected,'published source item from next decade missing'
    js("""const node=document.querySelector('.story-chronology [data-story-index-event="'+arguments[0]+'"]');
      node.scrollIntoView({block:'center'});node.click();""",selected)
    wait.until(lambda _:js("return Number(document.getElementById('bigYear').textContent)>=1650"))
    assert js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",original)
    assert js("return Number(document.getElementById('bigYear').textContent)===window.atlasStoryBridge.eventById(arguments[0]).year",selected)
    assert js("return window.atlasStoryBridge.activeEventWindow().to===Number(document.getElementById('bigYear').textContent)")
    browser.save_screenshot(str(out/'editor15-17c-source-year-index.png'))
    # BUGFIX REGRESSION: returning from a source event must restore the expanded index.
    js("""const btn=document.querySelector('.story-chronology [data-story-index-event="'+arguments[0]+'"]');
      btn.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));""",selected)
    wait.until(lambda _:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
    wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E6-T02'"))
    assert js("return !!document.querySelector('.major-story-article .story-chronology[open]')")
    # BUGFIX REGRESSION: resolve an old article fetch after navigating to a new event.
    js("""window.__realPreviewFetch=window.fetch;
      window.fetch=(url,options)=>String(url).includes('e6-t15-bank-war-colonial-capital.json')
       ?new Promise(resolve=>{window.__finishPreviewFetch=()=>resolve({ok:false})})
       :window.__realPreviewFetch(url,options);
      window.HistoryStories.openStory('E6-T15',false);""")
    wait.until(lambda _:js("return typeof window.__finishPreviewFetch==='function'"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('1640S-E016'))")
    wait.until(lambda _:js("return document.getElementById('dossierBody').textContent.includes('德罗赫达')"))
    js("window.__finishPreviewFetch();")
    wait.until(lambda _:js("return !document.querySelector('#dossierBody .loading')"))
    assert js("return !document.getElementById('dossierBody').textContent.includes('历史专题暂时无法读取')")
    js("window.fetch=window.__realPreviewFetch")
    # Original 16C readers must not be given a 17C index.
    browser.get('http://127.0.0.1:8765/?year=1497')
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1497'"))
    wait.until(lambda _:js("return !!window.HistoryStories && !!window.atlasStoryBridge?.eventById?.('landfall-1497')"))
    # The optional manifest is loaded after the atlas. Wait for registration,
    # rather than calling openStory before its storyMeta index exists.
    wait.until(lambda _:js("return window.HistoryStories.eventLinkMarkup(window.atlasStoryBridge.eventById('landfall-1497'),'event').includes('cabot-bristol-atlantic-voyages-1496-1498')"))
    js("window.HistoryStories.openStory('cabot-bristol-atlantic-voyages-1496-1498',false)")
    wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId==='cabot-bristol-atlantic-voyages-1496-1498'"))
    assert js("return !document.querySelector('.major-story-article .story-chronology')")
    print('PASS Editor15: published 17C topic has clickable sourced 1640s/1650s years; 16C original intact')
except Exception:
    browser.save_screenshot(str(out/'editor15-story-chronology-error.png'))
    raise
finally:
    browser.quit()
