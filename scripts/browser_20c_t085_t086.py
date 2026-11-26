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
 ('E20-T085-SOLOMONS-LABOUR-LAND-MAASINA-1901-1978','E20-T085-AUKI47',1947,31,[('E20-T085-TULAGI',1914,-9.103056,160.150556),('E20-T085-KWAI27',1927,-9.01748,160.953917),('E20-T085-CONTRACT',1940,-9.01748,160.953917),('E20-T085-AUKI47',1947,-8.767778,160.697778),('E20-T085-ULA49',1949,-9.785662,161.970522),('E20-T085-COUNCIL53',1953,-8.767778,160.697778),('E20-EXIT-SOLOMON',1978,None,None)]),
 ('E20-T086-NEW-HEBRIDES-CONDOMINIUM-LAND-LABOUR-1906-1980','E20-T086-URIP',1921,18,[('E20-T086-LORIG19',1919,-13.666667,167.666667),('E20-T086-URIP',1921,-16.07076,167.45085),('E20-T086-RAT',1922,-17.73648,168.31366),('E20-T086-NAG',1960,-15.40061,167.10752),('E20-T086-COURT78',1978,-17.73648,168.31366),('E20-T086-IND',1980,None,None)])]:
  driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year='+str(year))
  wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
  wait.until(lambda _:js("return !!window.atlasStoryBridge?.eventById('E20-EXIT-SOLOMON')&&!!window.HistoryStories?.isLinkedEvent('E20-T030-MANDATE')"))
  assert not js("return !!window.atlasStoryBridge.eventById(arguments[0])",first), 'candidate event leaked to ordinary entry'
  assert not driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]')
  assert not js("return nineteenthSpatial?.features?.some(f=>f.properties.related_event_ids.includes(arguments[0]))",first), 'candidate geometry leaked'
  driver.execute_async_script("const done=arguments[arguments.length-1];Promise.resolve(window.HistoryStories.openStory(arguments[0],false,arguments[1])).then(()=>done(true),()=>done(false))",topic,first)
  assert not driver.find_elements(By.CSS_SELECTOR,'.major-story-article'), 'candidate article leaked by direct openStory'
  driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?review20c=1&year='+str(year))
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
   if lat is not None:
    wait.until(lambda _:js("const c=window.atlasReadViewport().center;const d=((c.lng-arguments[1])%360+540)%360-180;return Math.abs(c.lat-arguments[0])<2&&Math.abs(d)<2",lat,lng))
   driver.save_screenshot(str(out/(event+'.png')))
  el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+first+'"]')
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
  js("document.querySelector('[data-story-back]').click()")
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=minimum)
 print('PASS T085/T086 desktop chronological navigation and geographic focus')
except Exception:
 driver.save_screenshot(str(out/'20c-t085-t086-failure.png'))
 raise
finally: driver.quit()
