"""T07 T08 T09 T11 independent genuine desktop Chrome publication QA."""
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
 ('E19-T07-RIO-DE-LA-PLATA-INVASION-BLOCKADE-1806-1850',1806,'E19-T07-1806-A41-E01','E19-T07-1845-A11-B7-E07',1845,10),
 ('E19-T08-FALKLANDS-GUIANA-BOUNDARY-1832-1899',1833,'E19-T08-1833-A11-E02','E19-T08-1899-A20-E05',1899,8),
 ('E19-T09-BRITISH-CAPITAL-LATIN-AMERICA-SLAVERY-MINING-1810-1882',1879,'E19-T09-1879-A17-E06','E19-T09-1882-A17-E09',1882,12),
 ('E19-T11-IRISH-LAND-WAR-COERCION-TRANSPORTATION-1803-1888',1887,'E19-T11-1887-A21-E04','E19-T11-1888-A21-E05',1888,10),
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
  if tid.startswith('E19-T07-'):
   wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat+34.61315)<2&&Math.abs(c.lng+58.37723)<2'))
  if tid.startswith('E19-T11-'):
   wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-52.26583)<2&&Math.abs(c.lng+8.26806)<2'))
  before=js("return document.getElementById('mapLayerEvents').checked")
  js("document.getElementById('mapLayerEvents').click()")
  wait.until(lambda _:js("return document.getElementById('mapLayerEvents').checked===arguments[0]",not before))
  js("document.getElementById('mapLayerEvents').click()")
  assert js("return document.getElementById('mapLayerEvents').checked") is before
 print('PASS 19C T07/T08/T09/T11 desktop 1780x1020: 40 article links across 4 stories, dated event jumps, 2 coordinate camera checks, 4 layer toggles and published URL state')
except Exception:
 driver.save_screenshot(str(out/'19c-release-failure.png'))
 raise
finally:driver.quit()
