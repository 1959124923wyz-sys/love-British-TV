#!/usr/bin/env python3
"""Desktop Chrome: verify Tudor-parity serial story year jumps, map pan, event dossier and return."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True)
opts=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(flag)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,60)
def js(script,*args):return browser.execute_script(script,*args)
def navigate(event,year,lat,lng,label):
    selector=f'.major-story-article [data-story-event="{event}"]'
    wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
    browser.find_element(By.CSS_SELECTOR,selector).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",event))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;
        return Math.abs(c.lat-arguments[0])<0.5&&Math.abs(c.lng-arguments[1])<0.5""",lat,lng))
    assert js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T09-NY"]\')')
    browser.save_screenshot(str(out/f'editor9-ny-{label}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1664')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1664'"))
    wait.until(lambda d:js("return !!document.querySelector('#eventList [data-eid=\"1660S-E023\"]')"))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1660S-E023"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter[data-story-open=\"E6-T09-NY\"]')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T09-NY"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===14"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===17"))
    browser.save_screenshot(str(out/'editor9-ny-1664-article.png'))
    navigate('1640S-E090',1643,40.713,-74.055,'pavonia')
    navigate('1660S-E091',1664,40.705,-74.013,'mayken-freedom')
    navigate('1670S-E091',1670,40.581,-74.15,'staten-deed')
    navigate('1670S-E010',1673,40.705,-74.013,'dutch-return')
    navigate('1670S-E014',1674,40.705,-74.013,'english-return')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0")
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1680S-E091"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',el)
    wait.until(lambda d:js('return !!document.querySelector("#dossierBody [data-story-back]")'))
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1689'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T09-NY"]\')'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1664'"))
    print('PASS New York desktop: 1664 entry; 1643 Dutch violence, 1664 Mayken, 1670 deed, 1673 Dutch reconquest, 1674 English return, 1689 dossier + original 1664 return')
except Exception:
    browser.save_screenshot(str(out/'editor9-ny-navigation-error.png'))
    raise
finally:
    browser.quit()
