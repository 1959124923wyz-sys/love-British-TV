#!/usr/bin/env python3
"""Regression for Rut 1527 and Kildare 1534–37 longform, real Chromium."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'rut-kildare-browser-results'
OUT.mkdir(exist_ok=True)
opt=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1480,960']:
    opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
w=WebDriverWait(d,42)
def js(q,*a):return d.execute_script(q,*a)
def year(y):w.until(lambda x:x.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(y)))
def begin(y,eid,title):
    d.get('http://127.0.0.1:8765/?year='+str(y))
    w.until(lambda x:x.execute_script("""return !!document.querySelector('#eventList [data-eid="'+arguments[0]+'"]')""",eid))
    e=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e)
    e.click()
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
    d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    w.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
def click(eid,y):
    e=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e)
    e.click()
    year(y)
    w.until(lambda x:x.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    assert js("return !!document.querySelector('.major-story-article')"),'article unexpectedly closed'
try:
    begin(1527,'1527-JOHN-RUT-STJOHNS','1527年约翰·拉特北大西洋探航')
    assert js("return document.querySelectorAll('.story-section').length===9")
    click('RUT1527-PLYMOUTH-DEPARTURE',1527)
    click('RUT1527-MONA-ENGLISH-VESSEL',1527)
    click('RUT1527-SANTO-DOMINGO-ENGLISH-VESSEL',1527)
    d.save_screenshot(str(OUT/'01-rut-documentary-voyage.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1527)
    w.until(lambda x:x.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('约翰')"))
    begin(1534,'1530S-E003','1534—1537年基尔代尔叛乱与王室报复')
    assert js("return document.querySelectorAll('.story-section').length===10")
    click('KIL1534-STMARYS-RENOUNCEMENT',1534)
    click('KIL1534-ARTANE-ALEN-KILLED',1534)
    click('KIL1535-MAYNOOTH-GARRISON-EXECUTIONS',1535)
    click('KIL1537-TYBURN-EXECUTIONS',1537)
    target=d.find_element(By.CSS_SELECTOR,'[data-story-event="KIL1537-TYBURN-EXECUTIONS"]')
    js("arguments[0].scrollIntoView({block:'center'})",target)
    ActionChains(d).double_click(target).perform()
    w.until(lambda x:x.execute_script("return !!document.querySelector('[data-story-back]')"))
    d.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
    d.save_screenshot(str(OUT/'02-kildare-war-and-london-justice.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1534)
    w.until(lambda x:x.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('基尔代尔')"))
    print('PASS Rut 1527 and Kildare 1534–37: documentary-only Caribbean links, site focus, historic year switching, double-click and original-event return')
except Exception:
    d.save_screenshot(str(OUT/'error.png'))
    raise
finally:
    d.quit()
