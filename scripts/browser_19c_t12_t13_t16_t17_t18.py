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
 ("E19-T12-HIGHLAND-CLEARANCES-CROFTER-LAND-1811-1883",1814,"E19-T12-1814-A09-E02","E19-T12-1883-A26-E05",1883,11),
 ("E19-T13-BRITISH-LABOUR-REPRESSION-TRANSPORTATION-1817-1855",1819,"E19-T13-1819-A12-E03","E19-T13-1855-C25-E06",1855,22),
 ("E19-T16-EASTERN-INDIA-LAND-ADIVASI-RESISTANCE-1814-1899",1817,"E19-T16-1817-B14-E04","E19-T16-1899-B23-E03",1899,12),
 ("E19-T17-BENGAL-INDIGO-ASSAM-TEA-COERCION-1840-1882",1860,"E19-T17-1860-B03-E04","E19-T17-1882-B07-E05",1882,12),
 ("E19-T18-CEYLON-LAND-PLANTATIONS-PADDY-TAX-1815-1892",1848,"E19-CF-1848-WAGE-CASES","E19-T18-1892-B65-E06",1892,11),
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
  if tid.startswith('E19-T16-'):
   wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-23.34316)<2&&Math.abs(c.lng-85.3094)<2'))
  before=js("return document.getElementById('mapLayerEvents').checked")
  js("document.getElementById('mapLayerEvents').click()")
  wait.until(lambda _:js("return document.getElementById('mapLayerEvents').checked===arguments[0]",not before))
  js("document.getElementById('mapLayerEvents').click()")
  assert js("return document.getElementById('mapLayerEvents').checked") is before
 print('PASS five topics: desktop 1780x1020, 68 article links, dated event jumps, Ranchi camera and layer toggles')
except Exception:
 driver.save_screenshot(str(out/'19c-release-failure.png'))
 raise
finally:driver.quit()
