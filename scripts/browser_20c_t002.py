import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'): opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda q,*args:driver.execute_script(q,*args)
out=Path('browser-smoke-results');out.mkdir(exist_ok=True)
tid='E20-T002-INDIA-LAND-REVENUE-1900-1947';first='E20-T002-CHAM'
try:
 driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year=1917')
 wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
 wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById(arguments[0])",first))
 js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",first)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
 js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",tid,first)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=25)
 for event,year,lat,lng in [(first,1917,26.648617,84.916558),('E20-T002-KHED',1918,22.693853,72.861567),('E20-T002-SEIZURE',1928,21.122973,73.111506),('E20-T002-DEBT',1936,None,None),('E20-T002-BILL',1947,None,None),('E20-T002-PUN',1900,None,None)]:
  el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event+'"]')
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
  wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
  if lat is not None: wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2&&Math.abs(c.lng-arguments[1])<2",lat,lng))
  driver.save_screenshot(str(out/('20c-t002-'+str(year)+'.png')))
 el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+first+'"]')
 js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
 js("document.querySelector('[data-story-back]').click()")
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=25)
 print('PASS T002 desktop chronology, five decades, map points, article return')
except Exception:
 driver.save_screenshot(str(out/'20c-t002-failure.png'))
 raise
finally: driver.quit()
