"""T45 independent true desktop Chrome: released 1803–1878 Palawa chain, 1780x1020."""
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
tid='E19-T45-PALAWA-WAR-REMOVAL-REMAINS-1803-1878'
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
    query='?year=1869' if released else '?review19c=1&year=1869'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if released:
        assert 'review19c' not in driver.current_url
    event='E19-T45-1869-N-LANNE-REMAINS'
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T45-1869-N-LANNE-REMAINS')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T45-1869-N-LANNE-REMAINS'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T45-1869-N-LANNE-REMAINS')",tid)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T45-1841-N-TRIAL"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=34
    driver.save_screenshot(str(screens/'19c-t45-palawa-34-links.png'))
    for event,year in [
        ('E19-RIS-POST',1803),
        ('E19-TAS-1828-MARTIAL-LAW',1828),
        ('E19-TAS-1830-BLACK-LINE',1830),
        ('E19-T45-1837-N-ARTHUR',1837),
        ('E19-T45-1841-N-TRIAL',1841),
        ('E19-TAS-1846-WYBALENNA-PETITION',1846),
        ('E19-T45-1847-N-CHILDREN',1847),
        ('E19-T45-1854-N-FANNY-MARRIAGE',1854),
        ('E19-T45-1869-N-LANNE-REMAINS',1869),
        ('E19-T45-1878-N-TRUG-REMAINS',1878),
    ]:
        jump(event,year)
    driver.save_screenshot(str(screens/'19c-t45-palawa-year-1878.png'))
    for key,peer in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        initial=js("return document.getElementById(arguments[0]).checked",key)
        js("document.getElementById(arguments[0]).click()",key)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",key,not initial,peer))
        js("document.getElementById(arguments[0]).click()",key)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T45-1869-N-LANNE-REMAINS"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T45-1869-N-LANNE-REMAINS"]'))
    print('PASS T45 real desktop Chrome 1780x1020: 34 links, ten event jumps 1803-1878, two layers, double click/return, release='+str(released))
except Exception:
    driver.save_screenshot(str(screens/'19c-t45-desktop-failed.png'))
    raise
finally:
    driver.quit()
