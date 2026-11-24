"""T29 independent genuine desktop Chrome publication QA."""
import os,json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True,parents=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,90)
js=lambda code,*args:driver.execute_script(code,*args)
plan=json.loads((root/'research/19c/consolidated/T32_T35_T39_T59_RELEASE_PLAN.json').read_text('utf8'))
idx=json.loads((root/'data/stories/serial/index.json').read_text('utf8'))
base=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/').rstrip('/')+'/'
selected=os.environ.get('ATLAS_QA_TOPIC')
try:
 for report in plan['reports']:
  t=report['topic']
  if selected and selected!=t:continue
  topic=next(x for x in idx['topics'] if x['id']==report['id'])
  assert topic['status']=='published' and topic['publication_review']=='approved'
  mapped=report['mapped']
  driver.get(base+'?year='+str(mapped['year']))
  wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
  wait.until(lambda _:js('return !!window.atlasStoryBridge?.eventById(arguments[0]) && !!window.HistoryStories?.openStory',mapped['event_id']))
  js('window.HistoryStories.openStory(arguments[0],false,arguments[1])',report['id'],mapped['event_id'])
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=report['sections'])
  links={x.get_attribute('data-story-event') for x in driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]')}
  assert set(topic['event_ids'])<=links
  driver.save_screenshot(str(out/(t+'-opened.png')))
  for node in [report['first'],report['last'],mapped]:
   el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+node['event_id']+'"]')
   js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
   wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',node['year']))
   assert driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
  assert js('return Number.isFinite(window.atlasStoryBridge.eventById(arguments[0]).lat)',mapped['event_id'])
  assert 'review19c=1' not in driver.current_url
  driver.save_screenshot(str(out/(t+'-mapped.png')))
  before=js("return document.getElementById('mapLayerEvents').checked")
  js("document.getElementById('mapLayerEvents').click()")
  wait.until(lambda _:js("return document.getElementById('mapLayerEvents').checked===arguments[0]",not before))
  js("document.getElementById('mapLayerEvents').click()")
  assert js("return document.getElementById('mapLayerEvents').checked") is before
  print('PASS '+t+' genuine desktop 1780x1020: all dated links, cross-year navigation, map toggle')
except Exception:
 driver.save_screenshot(str(out/((selected or 'batch')+'-failure.png')))
 raise
finally:driver.quit()
