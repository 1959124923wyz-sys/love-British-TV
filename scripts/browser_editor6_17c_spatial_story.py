#!/usr/bin/env python3
"""Desktop 17C: dated routes, non-sovereign military/economic cues, Barbados story."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results"
out.mkdir(exist_ok=True)
opts=Options()
for option in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1660,1000"):
    opts.add_argument(option)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,45)
def js(script,*args):
    return browser.execute_script(script,*args)
def jump(year):
    js("""const x=document.getElementById('jumpYear');x.value=String(arguments[0]);
    x.dispatchEvent(new Event('change',{bubbles:true}));""",year)
    wait.until(lambda d:js("return document.getElementById('bigYear').textContent===String(arguments[0])",year))
def toggle(which,checked):
    js("""let x=document.getElementById(arguments[0]);x.checked=arguments[1];
       x.dispatchEvent(new Event('change',{bubbles:true}));""",which,checked)
try:
    browser.get("http://127.0.0.1:8765/?year=1655")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1655'"))
    wait.until(lambda d:js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length>=2"))
    wait.until(lambda d:js("return document.querySelectorAll('#map .atlas-voyage-hit').length>=2"))
    assert not js("return !!document.getElementById('serialStoriesButton')")
    assert js("return document.querySelectorAll('#map .atlas-territory-solid').length===0"),"unverified 17C historical boundaries cannot be solid"
    browser.save_screenshot(str(out/"editor6-1655-sourced-military-economic-cues.png"))
    toggle('mapLayerTerritory',False)
    assert js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length===0")
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length>=2"),"event routes must survive territory off"
    toggle('mapLayerTerritory',True)
    wait.until(lambda d:js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length>=2"))
    toggle('mapLayerEvents',False)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===0"),"routes must hide with events"
    assert js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length>=2"),"territory cues independent of events"
    toggle('mapLayerEvents',True)
    jump(1649)
    wait.until(lambda d:js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length>=2"))
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length>=2")
    jump(1692)
    wait.until(lambda d:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1690S-E016')"))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1690S-E016"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===8"))
    assert js("return document.querySelector('.major-story-article').textContent.includes('巴巴多斯')")
    browser.save_screenshot(str(out/"editor6-1692-barbados-full-story.png"))
    print('PASS: 1655+1649 dated routes and cues; independent map toggles; published Barbados 8-section reader')
except Exception:
    browser.save_screenshot(str(out/"editor6-17c-browser-error.png"))
    raise
finally:
    browser.quit()
