#!/usr/bin/env python3
"""Real Chromium reading + chronological military GIS regression for Tournai and Surrey."""
from pathlib import Path
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tournai-surrey-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for a in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1510,950']:opts.add_argument(a)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,45)
def js(s,*args):return driver.execute_script(s,*args)
def year(y):wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(y)))
def story_from(y,eid,title):
    driver.get('http://127.0.0.1:8765/?year='+str(y))
    wait.until(lambda d:d.execute_script("""return !!document.querySelector('#eventList [data-eid="'+arguments[0]+'"]')""",eid))
    ev=driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",ev)
    ev.click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-enter')"))
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
def jump(eid,y):
    e=driver.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e)
    e.click()
    year(y)
    wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    assert js("return !!document.querySelector('.major-story-article')")
try:
    story_from(1513,'1513-THEROUANNE-SIEGE','1513—1519年英法战争与图尔奈占领')
    assert js("return document.querySelectorAll('.story-section').length===9")
    jump('FR1513-GUINEGATE-SPURS',1513)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===1"),'1513 French advance line should show'
    jump('FR1515-TOURNAI-HENRYVIII-CITADEL',1515)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===0"),'1513 campaign line leaked to 1515'
    jump('1519-TOURNAI-RETURN',1519)
    jump('FR1513-THEROUANNE-DESTRUCTION',1513)
    driver.save_screenshot(str(OUT/'01-tournai-year-war-fort-and-restoration.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1513)
    wait.until(lambda d:d.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('泰鲁阿讷')"))
    story_from(1520,'1520-SURREY-LEIX','1520—1522年萨里伯爵爱尔兰远征')
    assert js("return document.querySelectorAll('.story-section').length===9")
    jump('IR1520-SURREY-WOOD-QUAY-ARRIVAL',1520)
    jump('1521-MONASTERORIS',1521)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===1"),'1521 Irish return relation absent'
    jump('IR1521-SURREY-NAAS-DEFENCE',1521)
    jump('IR1521-SURREY-LEIX-SECOND-HOSTING',1521)
    target=driver.find_element(By.CSS_SELECTOR,'[data-story-event="IR1521-SURREY-LEIX-SECOND-HOSTING"]')
    js("arguments[0].scrollIntoView({block:'center'})",target)
    ActionChains(driver).double_click(target).perform()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-back]')"))
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    jump('1522-SURREY-END-IRELAND',1522)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===0"),'Surrey 1521 return must not persist'
    driver.save_screenshot(str(OUT/'02-surrey-year-recall-and-return.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1520)
    wait.until(lambda d:d.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('萨里伯爵进军')"))
    driver.set_window_size(410,840)
    assert js("return document.querySelectorAll('.milestone-dot').length===0")
    print('PASS Tournai/Surrey: sourced campaign points and links, strict 1513/1521 route years, both longforms, double click and restore')
except Exception:
    driver.save_screenshot(str(OUT/'error.png'))
    raise
finally:
    driver.quit()
