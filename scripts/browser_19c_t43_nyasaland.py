"""T43 final independent real desktop Chrome smoke, 1780x1020, 1891–1896."""
import json
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results'
shots.mkdir(parents=True,exist_ok=True)
topic_id='E19-T43-NYASALAND-LAND-CLAIMS-GUNBOATS-ATROCITIES'
opts=Options()
for option in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(option)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,100)
js=lambda script,*args:driver.execute_script(script,*args)
def jump(event_id,year):
    element=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event_id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",element)
    wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',year))
try:
    index=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf-8'))
    topic=next(t for t in index['topics'] if t['id']==topic_id)
    published=topic['status']=='published' and topic['publication_review']=='approved'
    query='?year=1895' if published else '?review19c=1&year=1895'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if published:
        assert 'review19c' not in driver.current_url
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T43-1895-N22')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T43-1895-N22'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic_id+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T43-1895-N22')",topic_id)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T43-1891-C46-E01"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=37
    driver.save_screenshot(str(shots/'19c-t43-nyasaland-37-events.png'))
    for event,year in [
        ('E19-T43-1891-C46-E01',1891),
        ('E19-T43-1892-C-X10-E01',1892),
        ('E19-T43-1893-C46-E06',1893),
        ('E19-T43-1893-N07',1893),
        ('E19-T43-1894-C46-E07',1894),
        ('E19-T43-1895-N22',1895),
        ('E19-T43-1895-N24',1895),
        ('E19-T43-1895-C-X11-E01',1895),
        ('E19-T43-1896-N11',1896),
    ]:
        jump(event,year)
    driver.save_screenshot(str(shots/'19c-t43-1896-cash-tax.png'))
    for control,peer in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        previous=js("return document.getElementById(arguments[0]).checked",control)
        js("document.getElementById(arguments[0]).click()",control)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",control,not previous,peer))
        js("document.getElementById(arguments[0]).click()",control)
    element=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T43-1895-N22"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",element)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T43-1895-N22"]'))
    print('PASS T43 real 1780x1020 Chrome: 37 source-linked events, 9 year changes 1891-1896, two map layers, double-click return, formal published='+str(published))
except Exception:
    driver.save_screenshot(str(shots/'19c-t43-desktop-failure.png'))
    raise
finally:
    driver.quit()
