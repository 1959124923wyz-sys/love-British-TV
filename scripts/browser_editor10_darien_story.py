#!/usr/bin/env python3
"""Headless desktop review of Scottish Darien company and Guna 1699 treaty; never claim Scottish Panama sovereignty."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for x in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):opt.add_argument(x)
browser=webdriver.Chrome(options=opt);wait=WebDriverWait(browser,70)
def js(code,*args):return browser.execute_script(code,*args)
def hit(eid,yr,lat,lng,name):
    sel=f'.major-story-article [data-story-event="{eid}"]'
    wait.until(lambda d:js('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",yr))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    wait.until(lambda d:js("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.55&&Math.abs(p.lng-arguments[1])<0.55",lat,lng))
    browser.save_screenshot(str(out/f'editor10-darien-{name}-{yr}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1698')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1698'"))
    wait.until(lambda d:js('return !!document.querySelector(\'#eventList [data-eid="1690S-E122"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1690S-E122"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T04-DARIEN"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T04-DARIEN"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===16"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===15"))
    browser.save_screenshot(str(out/'editor10-darien-article-1698.png'))
    hit('1690S-E026',1695,55.952,-3.189,'scottish-legal-company')
    hit('1690S-E029',1696,55.9533,-3.1883,'subscription')
    hit('1690S-E122',1698,55.981,-3.177,'leith-departure')
    hit('1690S-E123',1698,8.916667,-77.7,'guna-coast-arrival')
    hit('1690S-E125',1699,8.916667,-77.7,'guna-treaty')
    hit('1690S-E126',1699,55.952,-3.189,'edinburgh-supply-pledge')
    hit('1690S-E127',1699,8.916667,-77.7,'july-abandonment')
    hit('1690S-E128',1699,10.423,-75.55,'spanish-report')
    hit('1690S-E129',1699,8.916667,-77.7,'november-second-colony')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0"),'no fake 17th century Scottish colonial real boundary'
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1690S-E125"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',el)
    wait.until(lambda d:js('return !!document.querySelector("#dossierBody [data-story-back]")'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T04-DARIEN"]\')'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1698'"))
    print('PASS Darien desktop: 1695 independent Scottish company, 1696 shareholders, 1698 Leith and Guna coastal arrival, 1699 independent treaty, July evacuation and November second arrival, dossier and year-return.')
except Exception:
    browser.save_screenshot(str(out/'editor10-darien-error.png'))
    raise
finally:
    browser.quit()
