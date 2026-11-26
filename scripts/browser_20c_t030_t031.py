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
 ('E20-T030-IRAQ-OCCUPATION-MANDATE-1914-1932','E20-T030-REVOLT',1920,20,[('E20-T030-BASRA',1914,30.50852,47.7804),('E20-T030-BAGHDAD',1917,33.34058,44.40088),('E20-T030-REVOLT',1920,32.02594,44.34625),('E20-T030-PUNITIVE',1920,None,None),('E20-T030-CIVIL',1924,31.99289,44.92552),('E20-T030-ADMIT',1932,46.20222,6.14569)]),
 ('E20-T031-IRAQ-BASES-OIL-1941-1932-1958','E20-T031-WATHBA',1948,17,[('E20-T030-ADMIT',1932,46.20222,6.14569),('E20-T031-FALLUJAH',1941,33.34913,43.78599),('E20-T031-PORT',1948,50.79899,-1.09125),('E20-T031-OIL51',1951,None,None),('E20-T031-HANDOVER',1955,33.3836,43.5864),('E20-T031-REPUBLIC',1958,33.34058,44.40088)])]:
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
 print('PASS T030/T031 desktop: ordinary-year entry, historical chronology, cross-decade map focus and double-click return')
except Exception:
 driver.save_screenshot(str(out/'20c-t030-t031-failure.png'))
 raise
finally: driver.quit()
