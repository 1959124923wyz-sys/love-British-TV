#!/usr/bin/env python3
"""Real Chromium regression for Drake 1577–1580 major story, dates and cross-decade travel."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'frobisher-drake-browser-results';OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1440,950']:opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,42)
def js(script,*args):return driver.execute_script(script,*args)
try:
    driver.get('http://127.0.0.1:8765/?year=1577')
    wait.until(lambda d:d.execute_script('return !!document.querySelector(\'#eventList [data-eid="1570S-E015"]\')'))
    opening=driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1570S-E015"]')
    js('arguments[0].scrollIntoView({block:"center"})',opening);opening.click()
    wait.until(lambda d:d.execute_script('return !!document.querySelector(".major-story-enter")'))
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",'1577—1580年德雷克环球航行、太平洋劫掠与当地抵抗'))
    assert js('return document.querySelectorAll(".story-section").length>=14')
    for eid,year in [('DRA1578-CAPE-VERDE-PILOT-CAPTURE',1578),('PAC1578-LA-SERENA-DEFENSE',1578),('DRA1579-CALLAO-INTELLIGENCE',1579),('DRA1579-TERNATE-SULTAN-CLOVES',1579),('DRA1580-JAVA-LANDCALL',1580),('1580S-E006',1580)]:
        el=driver.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
        js('arguments[0].scrollIntoView({block:"center"})',el);el.click()
        wait.until(lambda d:d.execute_script('return document.querySelector("#bigYear")?.textContent===arguments[0]',str(year)))
        wait.until(lambda d:d.execute_script('return !!document.querySelector(".major-story-article")'))
    driver.save_screenshot(str(OUT/'34-drake-story-cross-year.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    print('PASS: Drake 1577-1580 cross-year major story, historic resistance and navigation')
except Exception:
    driver.save_screenshot(str(OUT/'failure.png'))
    raise
finally:
    driver.quit()
