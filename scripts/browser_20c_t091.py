import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'): opts.add_argument(arg)
driver=webdriver.Chrome(options=opts);wait=WebDriverWait(driver,120)
js=lambda q,*args:driver.execute_script(q,*args)
out=Path('browser-smoke-results');out.mkdir(exist_ok=True)
base=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')
topic='E20-CORK-BURNING';first='E20-CORK-BURN';new='E20-T091-BAL20'
try:
 driver.get(base+'?year=1920')
 wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'&&!!window.atlasStoryBridge?.eventById(arguments[0])&&window.HistoryStories?.isLinkedEvent({id:'E20-T030-MANDATE'},'event')",first))
 wait.until(lambda _:js("return !!window.atlasStoryBridge.eventById(arguments[0])",new))
 assert js("return window.atlasStoryBridge.activeSpatialHasEvent(arguments[0])",new)
 pending='E20-T068-CARIBBEAN-LABOUR-1934-1939'
 driver.execute_async_script("const done=arguments[arguments.length-1];Promise.resolve(window.HistoryStories.openStory(arguments[0],false,arguments[1])).then(()=>done(true),()=>done(false))",pending,'E20-T068-NUM34')
 assert not driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
 js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",first)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
 js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",topic,first)
 for event,y,lat,lng in [(new,1920,53.60846,-6.1831),('E20-T091-PROV22',1922,None,None),('E20-SALT-CORK-OPEN',1936,None,None)]:
  el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event+'"]'))
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
  wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",y))
  if lat is not None: wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2&&Math.abs(c.lng-arguments[1])<2",lat,lng))
  driver.save_screenshot(str(out/(event+'.png')))
 el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+new+'"]')
 js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
 js("document.querySelector('[data-story-back]').click()")
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+new+'"]'))>0)
 print('PASS T091 real ordinary-entry desktop publication, locality, cross-decade navigation')
finally:
 driver.quit()
