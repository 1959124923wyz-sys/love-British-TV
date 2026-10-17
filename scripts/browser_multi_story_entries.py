#!/usr/bin/env python3
"""Chromium: a single 1586 grant can open either of two existing stories and return."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
BASE='http://127.0.0.1:8765/?year=1586'
STORY_IDS=['munster-desmond-1579-1586','munster-plantation-land-grants-and-aftermath-1584-1589']
out=Path(__file__).resolve().parents[1]/'multi-story-browser-results'
out.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1460,960'):opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,50)
def js(s,*args):return driver.execute_script(s,*args)
def inspect(mode):
 driver.get(BASE)
 wait.until(lambda d:d.execute_script("return document.querySelector('#bigYear')?.textContent==='1586'"))
 item='#eventList .event-item[data-eid="1580S-E029"]'
 wait.until(lambda d:d.execute_script("return !!document.querySelector(arguments[0])",item))
 el=driver.find_element(By.CSS_SELECTOR,item)
 js("arguments[0].scrollIntoView({block:'center'})",el)
 el.click()
 wait.until(lambda d:d.execute_script("return document.querySelectorAll('#dossierBody .major-story-entry [data-story-open]').length===2"))
 choices=js("return Array.from(document.querySelectorAll('#dossierBody .major-story-entry [data-story-open]'),x=>[x.dataset.storyOpen,x.dataset.storySource])")
 assert choices==[[x,'1580S-E029'] for x in STORY_IDS],choices
 for i,story in enumerate(STORY_IDS):
  button='#dossierBody [data-story-open="'+story+'"]'
  e=driver.find_element(By.CSS_SELECTOR,button)
  js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
  wait.until(lambda d:d.execute_script("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
  assert js("return document.querySelectorAll('.major-story-article .story-section').length")>=8
  driver.save_screenshot(str(out/(mode+'-story-'+str(i+1)+'.png')))
  driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
  wait.until(lambda d:d.execute_script("return document.querySelector('#bigYear')?.textContent==='1586' && document.querySelectorAll('#dossierBody .major-story-entry [data-story-open]').length===2"))
 assert js("return document.querySelectorAll('#eventList [data-eid=\\"1580S-E029\\"]').length")<=1
 print('PASS',mode,'both articles open/return to the same 1586 event')
try:
 inspect('desktop')
 driver.set_window_size(410,860)
 inspect('mobile')
finally:
 driver.quit()
