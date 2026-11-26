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
 ('E20-T083-BANABA-PHOSPHATE-1900-1997','E20-T083-ARRIVE45',1945,23,[('E20-T083-DISC00',1900,-0.855,169.539),('E20-T083-ARRIVE45',1945,-16.50095,-179.9667),('E20-T083-ACCT68',1968,None,None),('E20-T083-TAR77',1977,1.3278,172.97696),('E20-T083-UK97',1997,None,None)]),
 ('E20-T084-NAURU-PHOSPHATE-1906-1994','E20-T084-IND68',1968,21,[('E20-T084-AGREE67',1967,-35.283,149.128),('E20-T084-IND68',1968,-0.55085,166.9252),('E20-T084-TRANSFER70',1970,None,None),('E20-T084-ICJ92',1992,52.077,4.299),('E20-T084-PLAN94',1994,-0.55085,166.9252)])]:
  driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year='+str(year))
  wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
  wait.until(lambda _:js("return !!window.atlasStoryBridge?.eventById&&!!window.HistoryStories?.openStory"))
  assert not js("return !!window.atlasStoryBridge.eventById(arguments[0])",first), 'candidate event leaked to ordinary entry'
  assert not driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]')
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
 print('PASS T083/T084 desktop chronological navigation and antimeridian-safe map focus')
except Exception:
 driver.save_screenshot(str(out/'20c-t083-t084-failure.png'))
 raise
finally: driver.quit()
