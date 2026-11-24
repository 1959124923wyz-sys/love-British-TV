"""T57 independent true desktop Chrome: released 1846–1898 Canada residential schools and status law, 1780x1020."""
import json
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results'
screens.mkdir(exist_ok=True,parents=True)
tid='E19-T57-CANADA-INDIGENOUS-STATUS-RESIDENTIAL-SCHOOLS-1842-1899'
opts=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(flag)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,100)
js=lambda script,*args:driver.execute_script(script,*args)
def jump(event,year):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
try:
    idx=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf-8'))
    topic=next(t for t in idx['topics'] if t['id']==tid)
    released=topic['status']=='published' and topic['publication_review']=='approved'
    query='?year=1883' if released else '?review19c=1&year=1883'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if released:
        assert 'review19c' not in driver.current_url
    event='E19-T57-1883-BATTLEFORD'
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T57-1883-BATTLEFORD')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T57-1883-BATTLEFORD'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T57-1883-BATTLEFORD')",tid)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T57-1846-NARROWS"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=24
    driver.save_screenshot(str(screens/'19c-t57-schools-24-links.png'))
    for event,year in [
        ('E19-T57-1846-NARROWS',1846),
        ('E19-T57-1848-ALNWICK',1848),
        ('E19-T57-1851-ELGIN',1851),
        ('E19-T57-1855-ALNWICK-EPIDEMIC',1855),
        ('E19-T57-1857-LAND-ENFRANCHISE',1857),
        ('E19-T57-1869-ENFRANCHISE-ACT',1869),
        ('E19-T57-1879-DAVIN',1879),
        ('E19-T57-1884-LEBRET',1884),
        ('E19-T57-1894-COMPULSION',1894),
        ('E19-T57-1898-STAR-BLANKET',1898),
    ]:
        jump(event,year)
    driver.save_screenshot(str(screens/'19c-t57-schools-year-1899.png'))
    for key,peer in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        initial=js("return document.getElementById(arguments[0]).checked",key)
        js("document.getElementById(arguments[0]).click()",key)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",key,not initial,peer))
        js("document.getElementById(arguments[0]).click()",key)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T57-1883-BATTLEFORD"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T57-1883-BATTLEFORD"]'))
    print('PASS T57 real desktop Chrome 1780x1020: 24 links, ten event jumps 1846-1898, two layers, double click/return, release='+str(released))
except Exception:
    driver.save_screenshot(str(screens/'19c-t57-desktop-failed.png'))
    raise
finally:
    driver.quit()
