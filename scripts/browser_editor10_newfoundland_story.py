#!/usr/bin/env python3
"""Real desktop Chromium: John Guy, Beothuk encounter, Ferryland, French Plaisance and dated 1696 destruction."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(a)
browser=webdriver.Chrome(options=opt);wait=WebDriverWait(browser,75)
def js(code,*args):return browser.execute_script(code,*args)
def click_link(eid,yr,lat,lng,label):
    sel=f'.major-story-article [data-story-event="{eid}"]'
    wait.until(lambda d:js('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",yr))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    wait.until(lambda d:js("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.45&&Math.abs(p.lng-arguments[1])<0.45",lat,lng))
    assert js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T10-NEWFOUNDLAND"]\')')
    browser.save_screenshot(str(out/f'editor10-newfoundland-{label}-{yr}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1696')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1696'"))
    wait.until(lambda d:js('return !!document.querySelector(\'#eventList [data-eid="1690S-E100"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1690S-E100"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T10-NEWFOUNDLAND"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T10-NEWFOUNDLAND"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===16"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===16"))
    browser.save_screenshot(str(out/'editor10-newfoundland-1696-article.png'))
    click_link('1610S-E005',1610,47.55,-53.22,'cupids')
    click_link('1610S-E091',1612,48.0,-53.499167,'beothuk-1612')
    click_link('1610S-E092',1612,47.6796861,-53.2535888,'easton-1612')
    click_link('1620S-E028',1621,47.023926,-52.884649,'ferryland-1621')
    click_link('1630S-E022',1638,47.023926,-52.884649,'kirke-1638')
    click_link('1660S-E096',1662,47.2705222,-53.9050916,'plaisance-1662')
    click_link('1690S-E099',1694,47.023926,-52.884649,'defended-1694')
    click_link('1690S-E100',1696,47.023926,-52.884649,'sacked-1696')
    click_link('1690S-E034',1696,47.561,-52.712,'stjohns-1696')
    click_link('1690S-E103',1699,51.499,-0.124,'statute-1699')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0"),'unsupported seventeenth-century English province fill'
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1690S-E101"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}))',el)
    wait.until(lambda d:js('return !!document.querySelector("#dossierBody [data-story-back]")'))
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1696'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T10-NEWFOUNDLAND"]\')'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1696'"))
    print('PASS NEWFOUNDLAND: 10 geographic event navigations, year-specific 1694/1696 Ferryland, 1662 France, 1699 law, dossier double-click and origin restoration')
except Exception:
    browser.save_screenshot(str(out/'editor10-newfoundland-navigation-error.png'))
    raise
finally:
    browser.quit()
