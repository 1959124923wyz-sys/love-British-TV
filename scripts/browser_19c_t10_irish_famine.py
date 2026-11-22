"""T10 1780x1020 actual Chrome: famine relief, 1849 sale law, 1861 Derryveagh/Letterkenny."""
from pathlib import Path
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True,parents=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda q,*args:driver.execute_script(q,*args)
tid='E19-T10-IRISH-FAMINE-EVICTIONS-ESTATES'

def click_event(event_id,year,photo):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event_id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    driver.save_screenshot(str(out/photo))

try:
    published=os.environ.get('T10_PUBLISHED')=='1'
    qs='?year=1847' if published else '?review19c=1&year=1847'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-IR-1847-QUARTER-ACRE-RULE')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-IR-1847-QUARTER-ACRE-RULE'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-IR-1847-QUARTER-ACRE-RULE')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-IR-1861-DERRYVEAGH-OFFICIAL-RETURN"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))==32
    driver.save_screenshot(str(out/'19c-t10-26-sections.png'))
    click_event('E19-IR-1846-BALLINLASS-EVICTION',1846,'19c-t10-1846-ballinlass.png')
    click_event('E19-IR-1847-QUARTER-ACRE-RULE',1847,'19c-t10-1847-poor-law.png')
    click_event('E19-IR-1849-DOOLOUGH-RELIEF-WALK',1849,'19c-t10-1849-doolough.png')
    click_event('E19-IR-1849-INCUMBERED-ESTATES-ACT',1849,'19c-t10-1849-estates-act.png')
    click_event('E19-IR-1861-LETTERKENNY-RELIEF-APPEALS',1861,'19c-t10-1861-letterkenny.png')
    wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-54.95)<1.4&&Math.abs(c.lng+7.73333)<1.4"))
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        old=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not old,slave))
        driver.save_screenshot(str(out/('19c-t10-layer-'+master+'.png')))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-IR-1861-DERRYVEAGH-OFFICIAL-RETURN"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-IR-1861-DERRYVEAGH-EXECUTION"]'))>0)
    for year in (1862,1869):
        js("window.atlasStoryBridge.setYear(arguments[0])",year)
        wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    driver.save_screenshot(str(out/'19c-t10-1869-continuity.png'))
    print('PASS T10 Chrome desktop: 26 sections, 32 event links, 1846/1847/1849/1861 years, town GIS, layer toggles, double click and back')
except Exception:
    driver.save_screenshot(str(out/'19c-t10-failure.png'))
    raise
finally:
    driver.quit()
