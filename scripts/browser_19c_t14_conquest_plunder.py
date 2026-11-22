"""T14 real desktop Chrome: 1843 Sindh / 1849 Punjab / 1858 Awadh expropriation."""
from pathlib import Path
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(parents=True,exist_ok=True)
option=Options()
for a in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    option.add_argument(a)
driver=webdriver.Chrome(options=option)
wait=WebDriverWait(driver,120)
js=lambda s,*args:driver.execute_script(s,*args)
tid='E19-T14-SINDH-PUNJAB-AWADH-CONQUEST-EXPROPRIATION'

def click_and_focus(id,year,lat,lon,photo):
    element=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",element)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    if lat is not None:
        wait.until(lambda _:js("let c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<0.9&&Math.abs(c.lng-arguments[1])<0.9",lat,lon))
    driver.save_screenshot(str(out/photo))

try:
    qs='?year=1843' if os.environ.get('T14_PUBLISHED')=='1' else '?review19c=1&year=1843'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-SIN-1843-MIANI')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-SIN-1843-MIANI'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-SIN-1843-MIANI')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-AWD-1858-QAS"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))==51
    driver.save_screenshot(str(out/'19c-t14-29-chapters.png'))
    click_and_focus('E19-SIN-1843-MIANI',1843,25.465339,68.428253,'19c-t14-sindh-miani.png')
    click_and_focus('E19-SIN-1843-HYDERABAD-TREASURY',1843,25.3844,68.3727,'19c-t14-hyderabad-treasury.png')
    click_and_focus('E19-SIK-1849-KOH-I-NOOR',1849,31.558,74.35071,'19c-t14-punjab-diamond.png')
    click_and_focus('E19-AWD-1856-ANNEX',1856,26.8381,80.9346,'19c-t14-awadh-annex.png')
    click_and_focus('E19-AWD-1858-QAS',1858,26.85639,80.92848,'19c-t14-kaiserbagh-looting.png')
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        before=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not before,slave))
        driver.save_screenshot(str(out/('19c-t14-layer-'+master+'.png')))
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]",master,before))
    element=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-SIK-1849-STATE-PROPERTY-CONFISCATION"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",element)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-AWD-1858-QAS"]'))>0)
    for year in (1859,1875):
        js("window.atlasStoryBridge.setYear(arguments[0])",year)
        wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
        driver.save_screenshot(str(out/('19c-t14-year-'+str(year)+'.png')))
    print('PASS T14 Chrome: 51 audited reused links across Sindh, Punjab and Awadh; 3 dates/2 layers/back')
except Exception:
    driver.save_screenshot(str(out/'19c-t14-failure.png'))
    raise
finally:
    driver.quit()
