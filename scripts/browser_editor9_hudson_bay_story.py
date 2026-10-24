#!/usr/bin/env python3
"""Desktop Chromium: 1670 charter to James Bay/West Hudson fur, war, original year restoration."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'): opt.add_argument(a)
browser=webdriver.Chrome(options=opt);wait=WebDriverWait(browser,70)
def run(src,*args):return browser.execute_script(src,*args)
def focus(eid,year,lat,lng,caption):
    selector=f'.major-story-article [data-story-event="{eid}"]'
    wait.until(lambda d:run('return !!document.querySelector(arguments[0])',selector))
    browser.find_element(By.CSS_SELECTOR,selector).click()
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:run('return window.atlasStoryBridge.activeFocusId()===arguments[0]',eid))
    wait.until(lambda d:run("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.5&&Math.abs(p.lng-arguments[1])<0.5",lat,lng))
    assert run("return !!document.querySelector('.major-story-article[data-story-id=\\\"E6-T10-HBC\\\"]')")
    browser.save_screenshot(str(out/f'editor9-hbc-{caption}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1670')
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1670'"))
    wait.until(lambda d:run('return !!document.querySelector(\'#eventList [data-eid="1670S-E095"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1670S-E095"]').click()
    wait.until(lambda d:run('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T10-HBC"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T10-HBC"]').click()
    wait.until(lambda d:run("return document.querySelectorAll('.major-story-article .story-section').length===15"))
    wait.until(lambda d:run("return document.querySelectorAll('.major-story-article .story-event-link').length===19"))
    browser.save_screenshot(str(out/'editor9-hbc-1670-article.png'))
    focus('1660S-E095',1668,51.49,-78.76,'nonsuch')
    focus('1670S-E095',1670,51.4995,-0.1247,'charter')
    focus('1670S-E060',1677,52.225,-81.675,'albany')
    focus('1680S-E006',1684,57.015,-92.45,'york')
    focus('1680S-E013',1686,51.272,-80.641,'french-james-bay')
    focus('1680S-E095',1689,58.7667,-94.1667,'churchill-burned')
    focus('1690S-E021',1694,57.015,-92.45,'french-york')
    focus('1690S-E030',1696,57.015,-92.45,'english-york')
    focus('1690S-E036',1697,57.015,-92.45,'french-recapture')
    assert run("return document.querySelectorAll('#map path.atlas-territory-solid').length===0"),'an unauthorized sovereignty polygon appeared'
    item=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1680S-E014"]')
    run('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',item)
    wait.until(lambda d:run('return !!document.querySelector("#dossierBody [data-story-back]")'))
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1686'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:run("return !!document.querySelector('.major-story-article[data-story-id=\\\"E6-T10-HBC\\\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1670'"))
    print('PASS HBC desktop: 1670 charter entry; 1668 Nonsuch, 1677 Albany, 1684 York, 1686 three-fort French attack, 1689 Churchill, 1694 French, 1696 English, 1697 French, double-open archive and 1670 return')
except Exception:
    browser.save_screenshot(str(out/'editor9-hbc-navigation-error.png'))
    raise
finally:
    browser.quit()
