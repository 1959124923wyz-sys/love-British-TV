#!/usr/bin/env python3
"""Real desktop Chromium audit: Mi’kma’ki, two Port Royal locations, English/Scottish/French exchange and dated war."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for v in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'): opt.add_argument(v)
browser=webdriver.Chrome(options=opt);wait=WebDriverWait(browser,75)
def run(js,*args): return browser.execute_script(js,*args)
def visit(eid,year,lat,lng,tag):
    sel=f'.major-story-article [data-story-event="{eid}"]'
    wait.until(lambda d:run('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:run('return window.atlasStoryBridge.activeFocusId()===arguments[0]',eid))
    wait.until(lambda d:run('const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.45&&Math.abs(p.lng-arguments[1])<0.45',lat,lng))
    assert run('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T10-ACADIA"]\')')
    browser.save_screenshot(str(out/f'editor9-acadia-{tag}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1690')
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1690'"))
    wait.until(lambda d:run('return !!document.querySelector(\'#eventList [data-eid="1690S-E095"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1690S-E095"]').click()
    wait.until(lambda d:run('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T10-ACADIA"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T10-ACADIA"]').click()
    wait.until(lambda d:run("return document.querySelectorAll('.major-story-article .story-section').length===18"))
    wait.until(lambda d:run("return document.querySelectorAll('.major-story-article .story-event-link').length===21"))
    browser.save_screenshot(str(out/'editor9-acadia-1690-article.png'))
    visit('1600S-E091',1605,44.71146,-65.60947,'first-habitation')
    visit('1610S-E014',1613,44.71146,-65.60947,'argall-attack-first-site')
    visit('1620S-E021',1629,44.74185,-65.51861,'distinct-scottish-charles')
    visit('1630S-E004',1632,44.74185,-65.51861,'scottish-withdrawal')
    visit('1650S-E093',1654,45.273,-66.063,'sedgwick-saint-john')
    visit('1650S-E017',1654,44.74185,-65.51861,'english-port-royal')
    visit('1670S-E004',1670,44.74185,-65.51861,'return-to-france')
    visit('1670S-E096',1672,45.855,-64.26,'siknikt-beaubassin')
    visit('1680S-E096',1682,45.11,-64.312,'grand-pre-farms')
    visit('1690S-E095',1690,44.74185,-65.51861,'phips-brief-raid')
    visit('1690S-E033',1696,45.85,-64.25,'english-beaubassin-raid')
    visit('1690S-E098',1697,52.0349,4.32785,'ryswick-diplomacy')
    assert run("return document.querySelectorAll('#map path.atlas-territory-solid').length===0"),'non-evidenced British sovereignty filled territory'
    el=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1690S-E097"]')
    run('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',el)
    wait.until(lambda d:run('return !!document.querySelector("#dossierBody [data-story-back]")'))
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1696'"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:run('return !!document.querySelector(\'.major-story-article[data-story-id="E6-T10-ACADIA"]\')'))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1690'"))
    print('PASS ACADIA 1605 vs 1629 distinct sites; 1613 Argall, 1632 retreat, 1654 capture, 1670 return, 1690 brief plunder, 1696 Mi’kmaq defence, 1697 treaty, full double click archive, year return.')
except Exception:
    browser.save_screenshot(str(out/'editor9-acadia-navigation-error.png'))
    raise
finally:
    browser.quit()
