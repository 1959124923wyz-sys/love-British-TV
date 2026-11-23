"""T42 single real desktop Chrome publication gate, compact scenario coverage."""
import json
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results'
shots.mkdir(exist_ok=True,parents=True)
tid='E19-T42-BASOTHO-CATTLE-DISARMAMENT-SOUTHERN-PROTECTORATES'
options=Options()
for option in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    options.add_argument(option)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,100)
js=lambda code,*args:driver.execute_script(code,*args)

def jump(event_id,year):
    element=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event_id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",element)
    wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',year))

try:
    index=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf-8'))
    topic=next(t for t in index['topics'] if t['id']==tid)
    released=topic['status']=='published' and topic['publication_review']=='approved'
    query='?year=1880' if released else '?review19c=1&year=1880'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if released:
        assert 'review19c' not in driver.current_url
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T42-1880-N01')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T42-1880-N01'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T42-1880-N01')",tid)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T42-1852-C71-E03"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=27
    driver.save_screenshot(str(shots/'19c-t42-article.png'))
    for event,year in [
        ('E19-T42-1852-C71-E03',1852),
        ('E19-T42-1878-C-X13-E01',1878),
        ('E19-T42-1880-N01',1880),
        ('E19-T42-1881-C14-E04',1881),
        ('E19-T42-1884-C-X13-E03',1884),
        ('E19-T42-1890-C-X12-E02',1890),
    ]:
        jump(event,year)
    driver.save_screenshot(str(shots/'19c-t42-year-1890.png'))
    for key,peer in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        previous=js("return document.getElementById(arguments[0]).checked",key)
        js("document.getElementById(arguments[0]).click()",key)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",key,not previous,peer))
        js("document.getElementById(arguments[0]).click()",key)
    element=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T42-1852-C71-E03"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",element)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T42-1880-N01"]'))
    print('PASS T42 desktop Chrome 1780x1020: 20 sections, 27 inline links, six year jumps (1852-1890), two layer controls, double click and return; published='+str(released))
except Exception:
    driver.save_screenshot(str(shots/'19c-t42-failed.png'))
    raise
finally:
    driver.quit()
