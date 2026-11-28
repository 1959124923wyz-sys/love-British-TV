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
 for topic,first,year,minimum,items in [
 ('E20-T085-SOLOMONS-LABOUR-LAND-MAASINA-1901-1978','E20-T085-AUKI47',1947,31,[('E20-T085-TULAGI',1914,-9.103056,160.150556),('E20-T085-KWAI27',1927,-9.01748,160.953917),('E20-T085-CONTRACT',1940,-9.01748,160.953917),('E20-T085-AUKI47',1947,-8.767778,160.697778),('E20-T085-ULA49',1949,-9.785662,161.970522),('E20-T085-COUNCIL53',1953,-8.767778,160.697778),('E20-EXIT-SOLOMON',1978,None,None)]),
 ('E20-T086-NEW-HEBRIDES-CONDOMINIUM-LAND-LABOUR-1906-1980','E20-T086-URIP',1921,18,[('E20-T086-LORIG19',1919,-13.666667,167.666667),('E20-T086-URIP',1921,-16.07076,167.45085),('E20-T086-RAT',1922,-17.73648,168.31366),('E20-T086-NAG',1960,-15.40061,167.10752),('E20-T086-COURT78',1978,-17.73648,168.31366),('E20-T086-IND',1980,None,None)])]:
  driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year='+str(year))
  wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
  decade=(year//10)*10
  records=json.loads(Path(f'data/stories/serial/chronology-{decade}-{decade+9}.json').read_text(encoding='utf-8'))['events']
  registry=json.loads(Path('data/stories/serial/index.json').read_text(encoding='utf-8'))
  hidden={eid for t in registry['topics'] if t.get('review_entry_required') and not (t.get('status')=='published' and t.get('publication_review')=='approved') for eid in t.get('review_event_ids',[])}
  sentinel=next(e['id'] for e in records if e['id'] not in hidden and e['id']!=first)
  wait.until(lambda _:js("return window.atlasStoryBridge?.currentYear()===arguments[0]&&window.atlasStoryBridge?.activeHasEvent(arguments[1])&&window.HistoryStories?.isLinkedEvent({id:'E20-T030-MANDATE'},'event')&&typeof window.atlasStoryBridge.activeSpatialHasEvent==='function'",year,sentinel))
  assert js("return !!window.atlasStoryBridge.eventById(arguments[0])",first), 'approved event missing at ordinary entry'
  assert js("return window.atlasStoryBridge.activeSpatialHasEvent(arguments[0])",first), 'approved geometry missing at ordinary entry'
  # A review-only article can reuse public events without owning any hidden event IDs.
  pending=next(t for t in registry['topics'] if t.get('review_entry_required') and not (t['status']=='published' and t.get('publication_review')=='approved') and t.get('event_ids'))
  assert not driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+pending['id']+'"]')
  driver.execute_async_script("const done=arguments[arguments.length-1];Promise.resolve(window.HistoryStories.openStory(arguments[0],false,arguments[1])).then(()=>done(true),()=>done(false))",pending['id'],(pending.get('review_event_ids') or pending['event_ids'])[0])
  assert not driver.find_elements(By.CSS_SELECTOR,'.major-story-article'), 'unapproved topic leaked by direct openStory'
  wait.until(lambda _:js("return window.HistoryStories?.isLinkedEvent({id:arguments[0]},'event')&&window.atlasStoryBridge?.activeHasEvent(arguments[0])",first))
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
