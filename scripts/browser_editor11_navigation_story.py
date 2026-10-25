#!/usr/bin/env python3
"""Desktop Chromium navigation for 17C maritime rivalry; no mobile design."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(flag)
browser=webdriver.Chrome(options=opt);wait=WebDriverWait(browser,65)
def js(code,*args):return browser.execute_script(code,*args)
def focus(event,year,lat,lng,tag):
    sel=f'.major-story-article [data-story-event="{event}"]'
    wait.until(lambda d:js('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",event))
    wait.until(lambda d:js("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.55&&Math.abs(p.lng-arguments[1])<0.55",lat,lng))
    browser.save_screenshot(str(out/f'editor11-nav-{tag}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1651')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1651'"))
    wait.until(lambda d:js('return !!document.querySelector(\'#eventList [data-eid="1650S-E010"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1650S-E010"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T14-NAV"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T14-NAV"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===16"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===24"))
    browser.save_screenshot(str(out/'editor11-nav-1651-article.png'))
    focus('1660S-E037',1667,51.394,0.52,'medway')
    focus('1670S-E120',1672,52.33,1.67,'solebay')
    focus('1670S-E014',1674,40.705,-74.013,'york-return')
    focus('1680S-E120',1688,50.395,-3.513,'brixham')
    focus('1690S-E121',1698,51.4995,-0.1247,'1698-law')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0")
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1660S-E037"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',el)
    wait.until(lambda d:js('return !!document.querySelector("#dossierBody [data-story-back]")'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T14-NAV"]\')'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1651'"))
    print('PASS Navigation Acts desktop: 1651 entry, 1667 Medway, 1672 Solebay, 1674 New York, 1688 invasion, 1698 statute, dossier and return.')
except Exception:
    browser.save_screenshot(str(out/'editor11-nav-error.png'))
    raise
finally:
    browser.quit()
