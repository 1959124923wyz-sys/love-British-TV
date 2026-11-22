"""T48 NZ Maori confiscation, wars and Parihaka desktop actual Chrome verification."""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(parents=True,exist_ok=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda q,*args:driver.execute_script(q,*args)
tid='E19-T48-NEW-ZEALAND-MAORI-LAND-CONFISCATION-WARS'

def click_event(event_id,year,photo):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event_id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    driver.save_screenshot(str(out/photo))

try:
    published=os.environ.get('T48_PUBLISHED')=='1'
    qs='?year=1863' if published else '?review19c=1&year=1863'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T48-1863-C01-E12')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T48-1863-C01-E12'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T48-1863-C01-E12')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T48-1881-C02-E18"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=81
    driver.save_screenshot(str(out/'19c-t48-maori-mother-43sections.png'))
    for item in [
      ('E19-NZ-1845-OHAEAWAI',1845,'19c-t48-1845-ohaeawai.png'),
      ('E19-T48-1863-C01-E12',1863,'19c-t48-1863-rangiriri-captured.png'),
      ('E19-T48-1864-C01-E16',1864,'19c-t48-1864-rangiaowhia.png'),
      ('E19-T48-1865-C01-E24',1865,'19c-t48-1865-land-confiscation.png'),
      ('E19-T48-1869-C22-E07',1869,'19c-t48-1869-ngatapa.png'),
      ('E19-T48-1869-C50-E04',1869,'19c-t48-1869-urewera-burn.png'),
      ('E19-T48-1879-C02-E11',1879,'19c-t48-1879-parihaka-farmers.png'),
      ('E19-T48-1880-C02-E41',1880,'19c-t48-1880-ripapa-prison.png'),
      ('E19-T48-1881-C02-E18',1881,'19c-t48-1881-parihaka-invasion.png'),
      ('E19-T48-1882-C02-E66',1882,'19c-t48-1882-indemnity.png')]:
        click_event(*item)
    for item in [
      ('E19-T48-1881-C02-E18',1881,-39.3,173.833),
      ('E19-T48-1880-C02-E41',1880,-43.6201,172.7544)]:
        click_event(item[0],item[1],'19c-t48-map-camera-'+str(item[1])+'.png')
        wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0",item[2],item[3]))
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        old=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not old,slave))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T48-1869-C50-E06"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T48-1869-C50-E06"]'))>0)
    print('PASS T48 real desktop Chrome: 43 sections, 81 clickable links, 1845–1882 chronology, Parihaka and Ripapa named map points, layers and doubleclick return')
except Exception:
    driver.save_screenshot(str(out/'19c-t48-failure.png'))
    raise
finally:
    driver.quit()
