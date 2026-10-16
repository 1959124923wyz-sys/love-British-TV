#!/usr/bin/env python3
"""Chromium regression: 1536–1542 Tudor law and 1539–1547 coastal fort dossier clicks."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tudor-forts-browser-results'
OUT.mkdir(exist_ok=True)
o=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1480,960']:
    o.add_argument(arg)
d=webdriver.Chrome(options=o);wait=WebDriverWait(d,42)
def js(code,*args):return d.execute_script(code,*args)
def year(y):wait.until(lambda x:x.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(y)))
def begin(y,eid,title):
    d.get('http://127.0.0.1:8765/?year='+str(y))
    wait.until(lambda x:x.execute_script("return !!document.querySelector('#eventList [data-eid=\"'+arguments[0]+'\"]')",eid))
    item=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",item);item.click()
    wait.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
    d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
def click(eid,y):
    item=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",item);item.click()
    year(y)
    wait.until(lambda x:x.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    assert js("return !!document.querySelector('.major-story-article')")
try:
    begin(1536,'1530S-E009','1536—1542年都铎王权在威尔士和爱尔兰的制度重组')
    assert js("return document.querySelectorAll('.story-section').length===10")
    click('1530S-E024',1537)
    click('1540S-002',1541)
    click('1530S-E009',1536)
    d.save_screenshot(str(OUT/'01-wales-ireland-legal-chronology.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1536)
    begin(1539,'1530S-E020','1539—1547年亨利八世海岸堡垒与入侵防务')
    assert js("return document.querySelectorAll('.story-section').length===10")
    click('FORT1539-WALMER-CONSTRUCTION',1539)
    click('FORT1540-WALMER-GARRISON',1540)
    click('FORT1541-HURST-CASTLE',1541)
    click('FORT1542-HURST-GARRISON',1542)
    click('FORT1544-HURST-COMPLETE',1544)
    click('FORT1547-DEAL-GUN-INVENTORY',1547)
    item=d.find_element(By.CSS_SELECTOR,'[data-story-event="FORT1547-PORTLAND-GUN-INVENTORY"]')
    js("arguments[0].scrollIntoView({block:'center'})",item)
    ActionChains(d).double_click(item).perform()
    wait.until(lambda x:x.execute_script("return !!document.querySelector('[data-story-back]')"))
    d.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
    d.save_screenshot(str(OUT/'02-forts-build-garrison-guns.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1539)
    print('PASS 12/13 Chromium: statute chronology, forts construction vs garrison, annual jumps, return to original child')
except Exception:
    d.save_screenshot(str(OUT/'error.png'))
    raise
finally:
    d.quit()
