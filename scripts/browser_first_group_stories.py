#!/usr/bin/env python3
"""Chromium reader regression for first-group Cabot and Kildare source-linked articles."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'first-group-major-story-browser-evidence'
OUT.mkdir(exist_ok=True)
options=Options()
for setting in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1500,950'):
    options.add_argument(setting)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,40)
def js(script,*args):return driver.execute_script(script,*args)
def year(yr):wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(yr)))
def link(eid,yr):
    elem=driver.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",elem)
    elem.click()
    year(yr)
    wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    assert js("return !!document.querySelector('.major-story-article')"),"reading article should stay open"
def open_from(yr,eid,title):
    driver.get('http://127.0.0.1:8765/?year='+str(yr))
    wait.until(lambda d:d.execute_script("""return !!document.querySelector('#eventList [data-eid="'+arguments[0]+'"]')""",eid))
    event=driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",event)
    event.click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-enter')"))
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
try:
    open_from(1497,'bristol-sail-1497','1496—1498年卡博特北大西洋探险')
    assert js("return document.querySelectorAll('.story-section').length===9")
    assert js("return document.querySelector('.major-story-article').innerText.length>3100")
    link('departure-1498',1498)
    link('bristol-sail-1497',1497)
    # The 1496 patent lives in the first published 1497 frame: never invent an unserved 1496 atlas.
    patent=driver.find_element(By.CSS_SELECTOR,'[data-story-event="patent-1496"]')
    js("arguments[0].scrollIntoView({block:'center'})",patent)
    patent.click()
    year(1497)
    wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()==='patent-1496'"))
    driver.save_screenshot(str(OUT/'01-cabot-1496-patent-and-1497-map.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1497)
    wait.until(lambda d:d.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('马修号')"))
    assert js("return !!document.querySelector('.major-story-entry')")
    open_from(1504,'1504-KNOCKDOE','1503—1519年基尔代尔伯爵与爱尔兰领主战争')
    assert js("return document.querySelectorAll('.story-section').length===10")
    link('KILDARE1512-ATHLONE-CROSSING',1512)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===1"),"1512 Athlone–Roscommon relation should be visible in its own year"
    link('KILDARE1512-ROSCOMMON',1512)
    link('KILDARE1512-BELFAST-ASSAULT',1512)
    link('KILDARE1514-COLERAINE-ODONNELL',1514)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===0"),"1512 military relation must not persist to 1514"
    link('KILDARE1516-KILLYBEGS-CANNON-SHIP',1516)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===1"),"1516 Killybegs–Sligo relation should appear in source year"
    link('KILDARE1516-COLLOONEY-ODONNELL',1516)
    link('1507-CARRICKFERGUS-O-NEILL',1507)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===0"),"future route must disappear on rewind"
    target=driver.find_element(By.CSS_SELECTOR,'[data-story-event="1507-CARRICKFERGUS-O-NEILL"]')
    js("arguments[0].scrollIntoView({block:'center'})",target)
    ActionChains(driver).double_click(target).perform()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-back]')"))
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    driver.save_screenshot(str(OUT/'02-kildare-1512-1516-and-rewind.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1504)
    wait.until(lambda d:d.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('诺克多')"))
    driver.set_window_size(410,850)
    assert js("return !document.querySelector('.story-status') && document.querySelectorAll('.milestone-dot').length===0")
    print('PASS first-group articles: Cabot 1496→1498, Kildare 1504↔1516, map focus, old patent clamped, original-event return and mobile')
except Exception:
    driver.save_screenshot(str(OUT/'error.png'))
    print('BROWSER_DIAGNOSTICS',driver.get_log('browser')[-5:])
    raise
finally:
    driver.quit()
