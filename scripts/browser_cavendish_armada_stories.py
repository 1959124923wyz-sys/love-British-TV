#!/usr/bin/env python3
"""Real Chromium QA: 1587–1592 Cavendish separated voyages and 1588 Armada survivors."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'cavendish-armada-browser-results'
OUT.mkdir(exist_ok=True)
opt=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1440,950']:opt.add_argument(arg)
driver=webdriver.Chrome(options=opt);wait=WebDriverWait(driver,45)
def js(txt,*args):return driver.execute_script(txt,*args)
def open_story(year,eid,title):
    driver.get('http://127.0.0.1:8765/?year='+str(year))
    wait.until(lambda d:d.execute_script("return !!document.querySelector('#eventList [data-eid=\\\"'+arguments[0]+'\\\"]')",eid))
    item=driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js('arguments[0].scrollIntoView({block:"center"})',item);item.click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-enter')"))
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
    assert js("return document.querySelectorAll('.story-section').length>=14")
def focus(eid,year):
    el=driver.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js('arguments[0].scrollIntoView({block:"center"})',el);el.click()
    wait.until(lambda d:d.execute_script("return document.querySelector('#bigYear')?.textContent===arguments[0]",str(year)))
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
try:
    open_story(1587,'1580S-E025','1587—1592年卡文迪什跨洋私掠与巴西港口袭击')
    for eid,year in [
        ('CAV1587-PUNA-SPANISH-COUNTERATTACK',1587),
        ('CAV1588-PLYMOUTH-RETURN',1588),
        ('CAV1591-PLYMOUTH-DEPARTURE',1591),
        ('1590S-E005',1591),
        ('1590S-E009',1592),
        ('CAV1592-VITORIA-REPELLED',1592)]:
        focus(eid,year)
    driver.save_screenshot(str(OUT/'40-cavendish-two-independent-voyages.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    open_story(1588,'ARM1588-STREEDAGH-STORM','1588年西班牙舰队爱尔兰海难、幸存者遭杀害与庇护')
    for eid in ['ARM1588-GIRONA-GIANTS-CAUSEWAY-WRECK','ARM1588-ROSCLOGHER-REFUGE','ARM1588-CLARE-SPANISHPOINT-EXECUTIONS','GAP1588-SLIGO-ARMADA-EXECUTIONS']:
        focus(eid,1588)
    driver.save_screenshot(str(OUT/'41-armada-storm-killing-refuge-separated.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    print('PASS: 40 first 1586–88 and second 1591–92 voyage stories remain separate; 41 storm, Crown killings and Gaelic refuge keep distinct interactive events.')
except Exception:
    driver.save_screenshot(str(OUT/'failure.png'));raise
finally:
    driver.quit()
