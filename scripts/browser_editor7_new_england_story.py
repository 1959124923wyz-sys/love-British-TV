#!/usr/bin/env python3
"""Desktop-only reading QA: Pequot/Metacom history matches Tudor inline-year-pan/double-open/return."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(arg)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,60)
def js(src,*args): return browser.execute_script(src,*args)
def map_click(id,year,lat,lng,tag):
    selector='.major-story-article [data-story-event="'+id+'"]'
    wait.until(lambda d: js("return !!document.querySelector(arguments[0])",selector))
    browser.find_element(By.CSS_SELECTOR,selector).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",id))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;
       return Math.abs(c.lat-arguments[0])<0.5&&Math.abs(c.lng-arguments[1])<0.5""",lat,lng))
    assert js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T06\"]')"),'single click lost long story'
    browser.save_screenshot(str(out / f'editor7-e6t06-{tag}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1637')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1637'"))
    wait.until(lambda d:js("return !!document.querySelector('#eventList [data-eid=\"1630S-E011\"]')"))
    wait.until(lambda d:js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length>=1"))
    assert not js("return !!document.querySelector('#map .atlas-territory-solid')"),'schematic battle region cannot become solid English sovereignty'
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1630S-E011"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter[data-story-open=\"E6-T06\"]')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T06"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===12"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===34"))
    assert js("return !!document.querySelector('.story-sources')")
    browser.save_screenshot(str(out/'editor7-e6t06-1637-original-story.png'))
    map_click('1670S-E017',1675,41.49,-71.58,'great-swamp')
    map_click('1670S-E061',1677,41.763,-72.685,'family-petition')
    map_click('1630S-E016',1638,41.764,-72.682,'hartford-treaty')
    assert js("return document.querySelectorAll('#map .atlas-territory-solid').length===0")
    target=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1670S-E048"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',target)
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    assert js("return document.getElementById('bigYear').textContent==='1676'")
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T06\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear').textContent==='1637'"))
    assert js("return document.querySelector('#dossierBody h2')?.textContent.includes('米斯蒂克')")
    print('PASS 17C Indigenous new story: 34 contextual events, Great Swamp 1675, family petition 1677, Hartford 1638, 1676 double-open and 1637 return; no solid colony polygon')
except Exception:
    browser.save_screenshot(str(out/'editor7-e6t06-browser-error.png'))
    raise
finally:
    browser.quit()
