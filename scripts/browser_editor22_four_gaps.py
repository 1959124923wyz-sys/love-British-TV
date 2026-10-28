#!/usr/bin/env python3
"""Editor22 actual desktop Chromium: four 17th century published stories across 4 regions and 1599 regression."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]; out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opts=Options()
for v in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1750,1050'):opts.add_argument(v)
driver=webdriver.Chrome(options=opts); wait=WebDriverWait(driver,70)
def js(code,*args):return driver.execute_script(code,*args)
def story(year,eid,tid,title,chapters,minlinks):
 driver.get(f'http://127.0.0.1:8765/?year={year}')
 wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
 wait.until(lambda _:js("return !!document.querySelector('#eventList [data-eid=\"'+arguments[0]+'\"]')",eid))
 driver.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{eid}"]').click()
 wait.until(lambda _:js("return !!document.querySelector('#dossierBody [data-story-open=\"'+arguments[0]+'\"]')",tid))
 driver.find_element(By.CSS_SELECTOR,f'#dossierBody [data-story-open="{tid}"]').click()
 wait.until(lambda _:js("return document.querySelectorAll('.major-story-article .story-section').length===arguments[0]",chapters))
 assert js("return document.querySelector('.major-story-article').textContent.includes(arguments[0])",title)
 assert js("return document.querySelectorAll('.major-story-article .story-event-link').length>=arguments[0]",minlinks)
 assert js("return document.querySelectorAll('.major-story-article .story-sources').length===1")
 driver.save_screenshot(str(out/f'editor22-{year}-{eid}.png'))
 driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda _:js("return !!document.querySelector('#dossierBody [data-story-open=\"'+arguments[0]+'\"]')",tid))
 print('PASS',year,eid,tid)
try:
 story(1612,'1610S-E095','E6-T16-ATLANTIC-ISLANDS','圣乔治',10,9)
 story(1629,'1620S-E030','E6-T10-QUEBEC-KIRKE','魁北克',9,4)
 story(1647,'1640S-E095','E6-T16-ATLANTIC-ISLANDS','伊柳塞拉',10,9)
 story(1681,'1680S-E129','E6-T09-PENNSYLVANIA','佩恩',10,6)
 story(1689,'1680S-E139','E6-T09-NE-DOMINION','波士顿',10,7)
 driver.get('http://127.0.0.1:8765/?year=1599')
 wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1599'"))
 assert js("return document.getElementById('eventCount').textContent!=='0项'")
 print('PASS Editor22 pre-1600 historic baseline')
except Exception:
 driver.save_screenshot(str(out/'editor22-error.png'));raise
finally:driver.quit()
