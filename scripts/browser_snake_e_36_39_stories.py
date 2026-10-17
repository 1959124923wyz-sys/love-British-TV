#!/usr/bin/env python3
"""Browser regression: Snake E stories 36-39, year links and original event return."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'snake-e-36-39-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1440,950']:
    opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,50)
cases=[
    (1587,'MUN1587-LAND-CLAIMS-COMMISSION','munster-plantation-land-grants-and-aftermath-1584-1589','1590S-E026',1598),
    (1585,'1580S-E014','roanoke-colony-native-conflict-disappearance-1585-1590','1590S-E003',1590),
    (1585,'1580S-E016','drake-great-west-indian-raid-1585-1586','DRW1586-CAPE-SAN-ANTONIO',1586),
    (1586,'GAP1586-SLIGO-EXACTIONS','bingham-connacht-military-exactions-1586-1591','BING1590-BALLYMOTE-ATTACK',1590),
]
try:
    for start_year,entry,slug,link,year in cases:
        driver.get('http://127.0.0.1:8765/?year='+str(start_year))
        entry_selector='#eventList [data-eid="'+entry+'"]'
        wait.until(lambda d:d.execute_script('return !!document.querySelector(arguments[0])',entry_selector))
        opening=driver.find_element(By.CSS_SELECTOR,entry_selector)
        driver.execute_script('arguments[0].scrollIntoView({block:"center"})',opening)
        opening.click()
        button='[data-story-open="'+slug+'"]'
        wait.until(lambda d:d.execute_script('return !!document.querySelector(arguments[0])',button))
        driver.find_element(By.CSS_SELECTOR,button).click()
        wait.until(lambda d:d.execute_script('return document.querySelector(".major-story-article")?.dataset.storyId===arguments[0]',slug))
        selector='[data-story-event="'+link+'"]'
        wait.until(lambda d:d.execute_script('return !!document.querySelector(arguments[0])',selector))
        el=driver.find_element(By.CSS_SELECTOR,selector)
        driver.execute_script('arguments[0].scrollIntoView({block:"center"})',el)
        el.click()
        wait.until(lambda d:d.execute_script('return document.querySelector("#bigYear")?.textContent===arguments[0]',str(year)))
        wait.until(lambda d:d.execute_script('return !!document.querySelector(".major-story-article")'))
        driver.save_screenshot(str(OUT/(slug+'.png')))
        driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
        wait.until(lambda d:d.execute_script('return !document.querySelector(".major-story-article")'))
    print('PASS: Snake E 36-39 stories open, jump to linked years and return to source events')
except Exception:
    driver.save_screenshot(str(OUT/'failure.png'))
    raise
finally:
    driver.quit()
