"""T51 independent true desktop Chrome: released 1843–1899 Pacific labour chain, 1780x1020."""
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
tid='E19-T51-PACIFIC-LABOUR-GUANO-JURISDICTION-1843-1899'
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
    query='?year=1897' if released else '?review19c=1&year=1897'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if released:
        assert 'review19c' not in driver.current_url
    event='E19-T51-1897-TESTIMONY'
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T51-1897-TESTIMONY')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T51-1897-TESTIMONY'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T51-1897-TESTIMONY')",tid)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T51-1871-NUKULAU"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=32
    driver.save_screenshot(str(screens/'19c-t51-labour-32-links.png'))
    for event,year in [
        ('E19-T51-1843-GUANO',1843),
        ('E19-T51-1861-LEASE',1861),
        ('E19-T51-1863-DON-JUAN',1863),
        ('E19-T51-1871-NUKULAU',1871),
        ('E19-T51-1872-COMMUTE',1872),
        ('E19-T51-1873-RETURN',1873),
        ('E19-FIJ-1875-PACIFIC-ACT',1875),
        ('E19-T51-1885-INQUIRY',1885),
        ('E19-T51-1896-PRODUCTION',1896),
        ('E19-T51-1899-LABOUR-SHORTAGE',1899),
    ]:
        jump(event,year)
    driver.save_screenshot(str(screens/'19c-t51-labour-year-1899.png'))
    for key,peer in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        initial=js("return document.getElementById(arguments[0]).checked",key)
        js("document.getElementById(arguments[0]).click()",key)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",key,not initial,peer))
        js("document.getElementById(arguments[0]).click()",key)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T51-1897-TESTIMONY"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T51-1897-TESTIMONY"]'))
    print('PASS T51 real desktop Chrome 1780x1020: 32 links, ten event jumps 1843-1899, two layers, double click/return, release='+str(released))
except Exception:
    driver.save_screenshot(str(screens/'19c-t51-desktop-failed.png'))
    raise
finally:
    driver.quit()
