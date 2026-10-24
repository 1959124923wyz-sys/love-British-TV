#!/usr/bin/env python3
"""Real desktop Chromium: Carolina 1670 entry, historical-action hyperlinks, timeline and back navigation."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opt.add_argument(flag)
browser=webdriver.Chrome(options=opt);wait=WebDriverWait(browser,65)
def js(code,*args):return browser.execute_script(code,*args)
def focus(event,year,lat,lng,label):
    sel=f'.major-story-article [data-story-event="{event}"]'
    wait.until(lambda d:js('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",event))
    wait.until(lambda d:js("""const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.5&&Math.abs(p.lng-arguments[1])<0.5""",lat,lng))
    assert js("return !!document.querySelector('.major-story-article[data-story-id=\\\"E6-T09-CAR\\\"]')")
    browser.save_screenshot(str(out/f'editor9-car-{label}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1670')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1670'"))
    wait.until(lambda d:js('return !!document.querySelector(\'#eventList [data-eid="1670S-E002"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1670S-E002"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T09-CAR"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T09-CAR"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===15"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===25"))
    browser.save_screenshot(str(out/'editor9-car-1670-article.png'))
    focus('1660S-E093',1661,36.22,-76.44,'yeopim')
    focus('1670S-E002',1670,32.805,-79.984,'initial-town')
    focus('1670S-E093',1676,32.805,-79.984,'cusabo-deed')
    focus('1670S-E094',1677,36.30,-76.22,'culpeper')
    focus('1680S-E003',1680,32.776,-79.929,'new-charlestown')
    focus('1680S-E093',1686,32.43,-80.69,'spanish-raid')
    focus('1690S-E093',1696,32.776,-79.929,'new-slave-law')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0")
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1690S-E092"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',el)
    wait.until(lambda d:js('return !!document.querySelector("#dossierBody [data-story-back]")'))
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1690'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js("return !!document.querySelector('.major-story-article[data-story-id=\\\"E6-T09-CAR\\\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1670'"))
    print('PASS Carolina desktop: 1670 entry; Yeopim 1661, Cusabo 1675, Culpeper 1677, port 1680, 1686 Spain, 1696 law, 1690 dossier, return to 1670.')
except Exception:
    browser.save_screenshot(str(out/'editor9-car-navigation-error.png'))
    raise
finally:
    browser.quit()
