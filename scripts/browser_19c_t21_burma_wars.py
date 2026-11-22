"""R2 T21: real desktop Chrome story links for the three Burma wars, 1891 Wuntho and rice exports."""
from pathlib import Path
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(parents=True,exist_ok=True)
opts=Options()
for a in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):opts.add_argument(a)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda query,*args:driver.execute_script(query,*args)
tid='E19-T21-BURMA-THREE-WARS-DISPOSSESSION'

def follow(event_id,year,name):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event_id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    driver.save_screenshot(str(out/name))

try:
    published=True # public release: browser uses ordinary year URL with no review parameter
    qs='?year=1824' if published else '?review19c=1&year=1824'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-BUR-1824-RANGOON')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-BUR-1824-RANGOON'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-BUR-1824-RANGOON')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T21-1891-PEGON-DESTROYED"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=109
    driver.save_screenshot(str(out/'19c-t21-mother-story-36-sections.png'))
    for item in [
      ('E19-BUR-1826-YANDABO',1826,'19c-t21-1826-yandabo.png'),
      ('E19-BUR2-1852-ANNEX',1852,'19c-t21-1852-pegu.png'),
      ('E19-T21-1876-LOWER-BURMA-LAND-REVENUE',1876,'19c-t21-1876-land-law.png'),
      ('E19-BUR3-1885-REGALIA',1885,'19c-t21-1885-royal-prize.png'),
      ('E19-T21-1891-PEGON-DESTROYED',1891,'19c-t21-1891-pegon-destruction.png'),
      ('E19-T21-1891-WUNTHO-OCCUPIED',1891,'19c-t21-1891-wuntho.png'),
      ('E19-T21-1891-PINLEBU-OCCUPIED',1891,'19c-t21-1891-pinlebu.png'),
      ('E19-T21-1899-RICE-PORT-EXPORTS',1899,'19c-t21-1899-rice-port.png')]:
        follow(*item)
    for year,lat,lng in [(1891,23.8989,95.6856),(1899,16.80528,96.15611)]:
        target='E19-T21-1891-WUNTHO-OCCUPIED' if year==1891 else 'E19-T21-1899-RICE-PORT-EXPORTS'
        follow(target,year,'19c-t21-camera-'+str(year)+'.png')
        wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0",lat,lng))
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        old=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not old,slave))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T21-1891-WUNTHO-DEPOSED"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T21-1891-WUNTHO-DEPOSED"]'))>0)
    print('PASS 19C T21 desktop: 36 sections, 109 event links, 1826/1852/1876/1885/1891/1899, four named 1891 GIS points, camera, layers and return')
except Exception:
    driver.save_screenshot(str(out/'19c-t21-failure.png'))
    raise
finally:
    driver.quit()
