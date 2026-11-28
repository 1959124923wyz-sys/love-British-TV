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
 ('E20-MAL-BATANG-KALI','E20-T020-TRAS',1951,61,[('E20-T020-TRAS',1951,3.742,101.8112),('E20-T020-IPOH',1952,4.5975,101.0901),('E20-T020-TM',1952,3.681,101.5198),('E20-T020-REOPEN',1954,3.742,101.8112),('E20-T020-BALING',1955,5.6780611,100.917703),('E20-T020-RETURN',1957,3.742,101.8112),('E20-T020-END60',1960,None,None),('E20-T020-POLICY',1950,None,None)])]:
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
 print('PASS T020 desktop: ordinary-year entry, dated map points, cross-decade links and double-click return')
except Exception:
 driver.save_screenshot(str(out/'20c-t020-failure.png'))
 raise
finally: driver.quit()
