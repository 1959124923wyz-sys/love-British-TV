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
base=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')
try:
 for topic,first,year,target,target_year in [('E20-SOUTH-AFRICAN-WAR-CAMPS','E20-SAW-1900-BLO-CAMP',1900,'E20-T059-SCHOOL01',1901),('E20-KEN-HOLA','E20-KEN-LAW59',1959,'E20-T045-END60',1960)]:
  driver.get(base+'?year='+str(year))
  wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
  wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById(arguments[0])",first))
  js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",first)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
  pending='E20-T056-NYASALAND-LAND-LABOUR-1900-1964'
  assert not driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+pending+'"]')
  driver.execute_async_script("const done=arguments[arguments.length-1];Promise.resolve(window.HistoryStories.openStory(arguments[0],false,arguments[1])).then(()=>done(true),()=>done(false))",pending,'E20-T056-LAND04')
  assert not driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
  js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",topic,first)
  el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+target+'"]'))
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
  wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]&&!!window.atlasStoryBridge.eventById(arguments[1])",target_year,target))
  driver.save_screenshot(str(out/(target+'.png')))
  el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+target+'"]')
  js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
  js("document.querySelector('[data-story-back]').click()")
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+target+'"]'))>0)
 print('PASS T059/T045 ordinary-entry desktop historical links and return')
finally:
 driver.quit()
