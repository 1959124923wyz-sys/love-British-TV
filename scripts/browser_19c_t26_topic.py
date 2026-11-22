"""T26 desktop longitudinal historical story + map regression (Selenium, 1780x1020)."""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results"
out.mkdir(parents=True,exist_ok=True)
options=Options()
for flag in ("--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--window-size=1780,1020"):
    options.add_argument(flag)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,115)
js=lambda src,*args:driver.execute_script(src,*args)
topic='E19-T26-OPIUM-WARS-CHINA-TREATY-PORTS'
def focus(event_id,year,lat,lon,filename):
    selector='.major-story-article [data-story-event="'+event_id+'"]'
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,selector))>0)
    el=driver.find_element(By.CSS_SELECTOR,selector)
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    wait.until(lambda _:js("let p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.48&&Math.abs(p.lng-arguments[1])<0.48",lat,lon))
    assert js("return !!document.querySelector('.major-story-article')"),"Story closed on event jump"
    driver.save_screenshot(str(out/filename))
try:
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?review19c=1&year=1839')
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T26-1877-ICHANG-OPEN')"))
    for event_id in ('E19-T26-1843-SHANGHAI-OPEN','E19-T26-1868-ANPING-ASSAULT','E19-T26-1877-ICHANG-OPEN','E19-T26-1885-OPIUM-ADDITIONAL'):
        event=js("return window.atlasStoryBridge.eventById(arguments[0])",event_id)
        assert event and event.get('lat') is not None,event_id+' missing mapped point'
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-OP-1839-HUMEN-DESTRUCTION'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-OP-1839-HUMEN-DESTRUCTION')",topic)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T26-1843-SHANGHAI-OPEN"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=99,'Missing inline links'
    driver.save_screenshot(str(out/'19c-t26-1839-master-story.png'))
    focus('E19-T26-1843-SHANGHAI-OPEN',1843,31.2323,121.4691,'19c-t26-1843-shanghai.png')
    focus('E19-T26-1868-ANPING-ASSAULT',1868,23.001509,120.16062,'19c-t26-1868-anping.png')
    focus('E19-T26-1877-ICHANG-OPEN',1877,30.7,111.28,'19c-t26-1877-yichang.png')
    focus('E19-T26-1885-OPIUM-ADDITIONAL',1885,51.5,-0.125,'19c-t26-1885-london.png')
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T26-1868-ANPING-ASSAULT"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    assert js("return window.atlasStoryBridge.currentYear()===1868"),"Double click did not jump to original event year"
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T26-1877-WUHU-OPEN"]'))>0)
    js("window.atlasStoryBridge.setYear(1899)")
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===1899"))
    assert js("return !!document.querySelector('.leaflet-container')"),"1899 map missing"
    driver.save_screenshot(str(out/'19c-t26-1899-ports.png'))
    print("PASS T26 Chrome: 1839 story -> 1843 Shanghai -> 1868 Anping -> 1877 Yichang -> 1885 London, double-click/back, 1899 map")
except Exception:
    driver.save_screenshot(str(out/'19c-t26-failure.png'))
    raise
finally:
    driver.quit()
