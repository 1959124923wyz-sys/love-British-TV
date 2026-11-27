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
try:
 for topic,first,year,minimum,items in [
 ('E20-T032-PALESTINE-MANDATE-LAND-REPRESSION-1917-1939','E20-T032-JAFFA',1936,20,[('E20-T032-OCC',1917,31.76904,35.21633),('E20-T032-EFFECT',1923,None,None),('E20-T032-JAFFA',1936,32.05043,34.75224),('E20-T032-EXILE',1937,-4.67643,55.47426),('E20-T032-WHITE',1939,51.50853,-0.12574)]),
 ('E20-T033-PALESTINE-DETENTION-IMMIGRATION-WITHDRAWAL-1939-1949','E20-T033-CYPRUS',1946,22,[('E20-T032-WHITE',1939,51.50853,-0.12574),('E20-T033-REG111',1945,None,None),('E20-T033-CYPRUS',1946,35.00304,32.98791),('E20-T033-EXODUS',1947,53.55073,9.99302),('E20-T033-JEREXIT',1948,31.76904,35.21633),('E20-T033-HAIFA',1948,32.81303,34.99928),('E20-T033-CLOSE',1949,35.00304,32.98791),('E20-T033-BIRTH',1949,35.17284,33.35397)])]:
  driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year='+str(year))
  wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
  wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById(arguments[0])",first))
  js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",first)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
  js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",topic,first)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=minimum)
  for event,y,lat,lng in items:
   el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event+'"]')
   js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
   wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",y))
   if lat is not None: wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2&&Math.abs(c.lng-arguments[1])<2",lat,lng))
   driver.save_screenshot(str(out/(event+'.png')))
  el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+first+'"]')
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
  js("document.querySelector('[data-story-back]').click()")
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=minimum)
 print('PASS T032/T033 desktop: ordinary-year entry, historical chronology, cross-decade map focus and double-click return')
except Exception:
 driver.save_screenshot(str(out/'20c-t032-t033-failure.png'))
 raise
finally: driver.quit()
