#!/usr/bin/env python3
"""Real Chromium reader regression: Drake Panama, Sidney Ireland cess, Frobisher Inuit."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'drake-sidney-frobisher-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1440,950']:opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,42)
def js(c,*args):return driver.execute_script(c,*args)
def start(year,eid,title):
    driver.get('http://127.0.0.1:8765/?year='+str(year))
    wait.until(lambda d:d.execute_script("return !!document.querySelector('#eventList [data-eid=\\\"'+arguments[0]+'\\\"]')",eid))
    e=driver.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-enter')"))
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
    assert js("return document.querySelectorAll('.story-section').length>=10")
def focus(eid,year):
    e=driver.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
    wait.until(lambda d:d.execute_script("return document.querySelector('#bigYear')?.textContent===arguments[0]",str(year)))
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
try:
    start(1572,'DRA1572-PLYMOUTH-DEPARTURE','1572—1573年德雷克巴拿马运银线路袭掠')
    focus('DRA1572-NOMBRE-DE-DIOS-WOUNDED',1572)
    focus('DRA1573-PANAMA-VIEJO-SILVER-ROAD',1573)
    driver.save_screenshot(str(OUT/'31-panama-silver-road.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    start(1575,'1570S-E033','1575—1578年锡德尼爱尔兰强征军需与康诺特军事巡行')
    focus('1570S-E023',1576)
    focus('SID1577-LONDON-PALE-LAWYERS-JAILED',1577)
    focus('SID1578-PALE-OPPONENTS-IMPRISONED',1578)
    driver.save_screenshot(str(OUT/'32-sidney-cess.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    start(1576,'1570S-E012','1576—1578年弗罗比舍北极探航、因纽特人被掳与矿业骗局')
    focus('1570S-E035',1577)
    focus('1570S-E036',1577)
    focus('FRO1578-KODLUNARN-STONE-HOUSE',1578)
    focus('FRO1578-DARTFORD-SMELTING',1578)
    driver.save_screenshot(str(OUT/'33-frobisher-inuit-and-mining.png'))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    print('PASS 31, 32, 33 source-linked stories and map year navigation')
except Exception:
    driver.save_screenshot(str(OUT/'failure.png'))
    raise
finally:
    driver.quit()
