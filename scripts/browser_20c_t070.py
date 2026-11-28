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
topic="E20-T070-BRITISH-GUIANA-CONSTITUTION-1953-1966";first='E20-T070-VOTE53'
try:
 driver.get(base+'?year=1953')
 wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'&&window.HistoryStories?.isLinkedEvent({id:'E20-T030-MANDATE'},'event')"))
 assert not js("return !!window.atlasStoryBridge.eventById(arguments[0])",first)
 assert not js("return window.atlasStoryBridge.activeSpatialHasEvent(arguments[0])",first)
 driver.execute_async_script("const done=arguments[arguments.length-1];Promise.resolve(window.HistoryStories.openStory(arguments[0],false,arguments[1])).then(()=>done(true),()=>done(false))",topic,first)
 assert not driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
 driver.get(base+'?review20c=1&year=1953')
 wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'&&window.HistoryStories?.isLinkedEvent({id:arguments[0]},'event')&&window.atlasStoryBridge?.activeHasEvent(arguments[0])",first))
 assert js("return window.atlasStoryBridge.activeSpatialHasEvent(arguments[0])",first)
 js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",first)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
 js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",topic,first)
 for event,y,lat,lng in [('E20-T070-VOTE53',1953,6.7667,-58.1667),('E20-T070-RESTRICT54',1954,6.7667,-58.1667),('E20-T070-VOTE61',1961,6.7667,-58.1667),('E20-T070-CONF62',1962,51.5038,-0.1391),('E20-T070-VOTE64',1964,6.7667,-58.1667),('E20-EXIT-GUYANA',1966,None,None)]:
  el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event+'"]'))
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
  wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",y))
  if lat is not None: wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2&&Math.abs(((c.lng-arguments[1])%360+540)%360-180)<2",lat,lng))
  driver.save_screenshot(str(out/(event+'.png')))
 el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+first+'"]')
 js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
 js("document.querySelector('[data-story-back]').click()")
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+first+'"]'))>0)
 print('PASS T070 real desktop reader isolation, chronological navigation, location and return')
finally:
 driver.quit()
