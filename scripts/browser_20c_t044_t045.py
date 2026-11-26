import os
import json
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
 topic='E20-T044-KENYA-LAND-1900-1963'
 first='E20-T044-RES22'
 driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year=1922')
 wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
 decade=(1922//10)*10
 records=json.loads(Path(f'data/stories/serial/chronology-{decade}-{decade+9}.json').read_text(encoding='utf-8'))['events']
 registry=json.loads(Path('data/stories/serial/index.json').read_text(encoding='utf-8'))
 hidden={eid for t in registry['topics'] if t.get('review_entry_required') and not (t.get('status')=='published' and t.get('publication_review')=='approved') for eid in t.get('review_event_ids',[])}
 sentinel=next(e['id'] for e in records if e['id'] not in hidden and e['id']!=first)
 wait.until(lambda _:js("return window.atlasStoryBridge?.currentYear()===arguments[0]&&window.atlasStoryBridge?.activeHasEvent(arguments[1])&&window.HistoryStories?.isLinkedEvent({id:'E20-T030-MANDATE'},'event')&&typeof window.atlasStoryBridge.activeSpatialHasEvent==='function'",1922,sentinel))
 assert not js("return !!window.atlasStoryBridge.eventById(arguments[0])",first), 'candidate event leaked to ordinary entry'
 assert not driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]')
 assert not js("return window.atlasStoryBridge.activeSpatialHasEvent(arguments[0])",first), 'candidate geometry leaked'
 driver.execute_async_script("const done=arguments[arguments.length-1];Promise.resolve(window.HistoryStories.openStory(arguments[0],false,arguments[1])).then(()=>done(true),()=>done(false))",topic,first)
 assert not driver.find_elements(By.CSS_SELECTOR,'.major-story-article'), 'candidate article leaked by direct openStory'
 driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?review20c=1&year=1922')
 wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
 wait.until(lambda _:js("return window.HistoryStories?.isLinkedEvent({id:arguments[0]},'event')&&window.atlasStoryBridge?.activeHasEvent(arguments[0])",first))
 js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",first)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
 js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",topic,first)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=21)
 for event,y,lat,lng in [('E20-T044-KAIM12',1912,0.13521,34.94167),('E20-T044-KER19',1919,-0.37,35.28),('E20-T044-NGONG22',1922,-1.4,36.633333),('E20-T044-RES22',1922,-0.916667,36.583333),('E20-KEN-LAW59',1959,-1.2921,36.8219),('E20-T044-SET62',1962,None,None),('E20-EXIT-KENYA',1963,None,None)]:
  el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event+'"]')
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
  wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",y))
  if lat is not None: wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2&&Math.abs(c.lng-arguments[1])<2",lat,lng))
  driver.save_screenshot(str(out/(event+'.png')))
 el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+first+'"]')
 js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
 js("document.querySelector('[data-story-back]').click()")
 wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=21)
 print('PASS Kenya desktop history, locality focus, 1960s transitions and return')
except Exception:
 driver.save_screenshot(str(out/'20c-t044-t045-failure.png'))
 raise
finally: driver.quit()
