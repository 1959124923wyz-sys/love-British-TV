#!/usr/bin/env python3
"""1780px Chromium: source-denominated population table and historic people/ship navigation."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
o=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):o.add_argument(a)
browser=webdriver.Chrome(options=o);wait=WebDriverWait(browser,70)
def js(t,*args):return browser.execute_script(t,*args)
def hit(eid,year,lat,lng,label):
    sel=f'.major-story-article [data-story-event="{eid}"]'
    wait.until(lambda d:js('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    wait.until(lambda d:js("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.6&&Math.abs(p.lng-arguments[1])<0.6",lat,lng))
    browser.save_screenshot(str(out/f'editor12-e6t11-{label}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1694')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1694'"))
    wait.until(lambda d:js('return !!document.querySelector(\'#eventList [data-eid="1690S-E130"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1690S-E130"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T11-VOYAGES"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T11-VOYAGES"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===18"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===19"))
    assert js("return document.querySelectorAll('.story-statistics .story-stat-table tbody tr').length===5")
    assert js("return document.querySelector('.story-statistics').textContent.includes('428,262')")
    assert js("return document.querySelector('.story-statistics').textContent.includes('279')")
    assert js("return document.querySelector('.story-statistics').textContent.includes('19,341')")
    assert js("return document.querySelector('.story-statistics').textContent.includes('1700年')")
    assert js("return document.querySelector('.story-statistics').textContent.includes('58%')")
    assert js("return document.querySelector('.story-statistics').textContent.includes('14%')")
    assert js("return document.querySelector('.story-statistics').textContent.includes('18.73')")
    browser.save_screenshot(str(out/'editor12-e6t11-population-denominators.png'))
    hit('1610S-E024',1619,37.024,-76.344,'1619-privateering-arrival')
    hit('1660S-E122',1668,18.01,-77.29,'1668-escape')
    hit('1670S-E123',1675,18.01,-77.29,'1675-executions')
    hit('1680S-E121',1688,37.2707,-76.7075,'1688-monopoly-seizure')
    hit('1690S-E024',1694,6.357,2.086,'hannibal-whydah')
    hit('1690S-E130',1694,13.096,-59.614,'hannibal-barbados')
    hit('1690S-E131',1698,51.4545,-2.588,'beginning-bristol')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0")
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1690S-E130"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',el)
    wait.until(lambda d:js('return !!document.querySelector("#dossierBody [data-story-back]")'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T11-VOYAGES"]\')'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1694'"))
    print('PASS E6-T11 desktop: 25-year population counts, RAC 279 voyages, demographic subsample / price, 1619 privateering seizure and arrival, 1668/1675 resistance, 1688 monopoly seizure, 1694 Hannibal endpoints, 1698 Bristol and return.')
except Exception:
    browser.save_screenshot(str(out/'editor12-e6t11-browser-error.png'))
    raise
finally:
    browser.quit()
