#!/usr/bin/env python3
"""Chromium historical story smoke: Le Havre, three Hawkins slaving voyages."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'lehavre-hawkins-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1480,960']:
    opts.add_argument(arg)
d=webdriver.Chrome(options=opts)
w=WebDriverWait(d,45)
def js(c,*a):return d.execute_script(c,*a)
def start(year,event,title):
    d.get('http://127.0.0.1:8765/?year='+str(year))
    w.until(lambda x:x.execute_script("return !!document.querySelector('#eventList [data-eid=\\\"'+arguments[0]+'\\\"]')",event))
    e=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+event+'"]')
    js('arguments[0].scrollIntoView({block:"center"})',e)
    e.click()
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
    d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    w.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
    assert js("return document.querySelectorAll('.story-section').length>=10")
    assert js("return document.querySelector('.story-sources summary')?.textContent.includes('参考资料')")
def focus(event,year):
    e=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+event+'"]')
    js('arguments[0].scrollIntoView({block:"center"})',e)
    e.click()
    w.until(lambda x:x.execute_script("return document.querySelector('#bigYear')?.textContent===arguments[0]",str(year)))
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
try:
    start(1562,'1560S-E007','1562—1563年英军占领勒阿弗尔与法军反攻')
    focus('LEH1562-WARWICK-FORT',1562)
    focus('LEH1563-INGOUVILLE-FRENCH-CAMP',1563)
    focus('LEH1563-JULY-SURRENDER',1563)
    d.save_screenshot(str(OUT/'01-le-havre-english-garrison-french-siege.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    start(1562,'1560S-E005','1562—1568年霍金斯三次跨大西洋贩奴航行')
    focus('HW1563-ISABELLA-SLAVE-SALE',1563)
    focus('HW1563-MONTE-CRISTI-SALE',1563)
    focus('1560S-E010',1564)
    focus('1560S-E020',1568)
    focus('1560S-E021',1568)
    d.save_screenshot(str(OUT/'02-hawkins-three-slaving-voyages.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    print('PASS Le Havre occupied/recovered control and three Hawkins slave voyages with synchronized map years and source links')
except Exception:
    d.save_screenshot(str(OUT/'error.png'))
    raise
finally:
    d.quit()
