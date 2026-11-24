"""T12 T13 T16 T17 T18 independent genuine desktop Chrome publication QA."""
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
topics=[
 ("E19-T24-ADEN-GULF-OMAN-PERSIAN-WAR-1809-1899",1809,"E19-G09-FIRE","E19-T24-1899-MUSCAT-ULTIMATUM",1899,14),
]
idx=json.loads((root/'data/stories/serial/index.json').read_text('utf8'))
base=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/').rstrip('/')+'/'
try:
 for n,(tid,start,eid,final,y_final,num) in enumerate(topics):
  topic=next(x for x in idx['topics'] if x['id']==tid)
  published=topic['status']=='published' and topic['publication_review']=='approved'
  url=base+('?year='+str(start) if published else '?review19c=1&year='+str(start))
  driver.get(url)
  wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
  wait.until(lambda _:js('return !!window.atlasStoryBridge?.eventById(arguments[0]) && !!window.HistoryStories?.openStory',eid))
  js('window.HistoryStories.openStory(arguments[0],false,arguments[1])',tid,eid)
  wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=num)
  assert driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+eid+'"]')
  driver.save_screenshot(str(out/('19c-release-t'+str(n)+'-opened.png')))
  el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+final+'"]')
  js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
  wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',y_final))
  assert driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
  driver.save_screenshot(str(out/('19c-release-t'+str(n)+'-jump.png')))
  assert not published or 'review19c=1' not in driver.current_url
  before=js("return document.getElementById('mapLayerEvents').checked")
  js("document.getElementById('mapLayerEvents').click()")
  wait.until(lambda _:js("return document.getElementById('mapLayerEvents').checked===arguments[0]",not before))
  js("document.getElementById('mapLayerEvents').click()")
  assert js("return document.getElementById('mapLayerEvents').checked") is before
 print('PASS T24 desktop 1780x1020 dated links and map layer toggles')
except Exception:
 driver.save_screenshot(str(out/'19c-release-failure.png'))
 raise
finally:driver.quit()
