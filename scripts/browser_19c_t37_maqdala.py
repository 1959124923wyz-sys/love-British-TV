"""T37 desktop 1867-1872 Maqdala story and mapped-artefact regression."""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results"
out.mkdir(parents=True,exist_ok=True)
opts=Options()
for flag in ("--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--window-size=1780,1020"):
    opts.add_argument(flag)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,115)
js=lambda source,*args:driver.execute_script(source,*args)
topic="E19-T37-MAQDALA-EXPEDITION-LOOTING"
def focus(event_id,year,lat,lng,path):
    css='.major-story-article [data-story-event="'+event_id+'"]'
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,css))>0)
    el=driver.find_element(By.CSS_SELECTOR,css)
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    wait.until(lambda _:js("let p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.48&&Math.abs(p.lng-arguments[1])<0.48",lat,lng))
    assert js("return !!document.querySelector('.major-story-article')"),"Story closed on map jump"
    driver.save_screenshot(str(out/path))

try:
    driver.get(os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")+"?year=1867")
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    assert "review19c" not in driver.current_url, "T37 public release must work without preview query"
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T37-1868-DELANTA-AUCTION')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T37-1867-BOMBAY-DEPART'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T37-1867-BOMBAY-DEPART')",topic)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T37-1868-MAQDALA-STORM"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))==12,"Expected 12 live body links"
    driver.save_screenshot(str(out/"19c-t37-1867-long-story.png"))
    focus("E19-T37-1867-ZULA-BASE",1867,15.25,39.66667,"19c-t37-1867-zula.png")
    focus("E19-T37-1868-MAQDALA-STORM",1868,11.35,39.18333,"19c-t37-1868-maqdala.png")
    focus("E19-T37-1868-DELANTA-AUCTION",1868,11.58333,39.16667,"19c-t37-1868-delanta.png")
    focus("E19-T37-1871-CROWN-DEBATE",1871,51.5007,-0.1246,"19c-t37-1871-parliament.png")
    focus("E19-T37-1872-CROWN-DEPOSIT",1872,51.4966,-0.1722,"19c-t37-1872-crown.png")
    # Exercise real visitor map-layer toggles, restoring both after review.
    js("window.atlasStoryBridge.setYear(1868)")
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===1868"))
    for master,slave in (("mapLayerTerritory","toggleTerritorialFootprints"),("mapLayerEvents","toggleEvents")):
        before=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1] && document.getElementById(arguments[2]).checked===arguments[1]",master,not before,slave))
        driver.save_screenshot(str(out/("19c-t37-public-layer-"+master+".png")))
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1] && document.getElementById(arguments[2]).checked===arguments[1]",master,before,slave))
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T37-1868-MAQDALA-STORM"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,"[data-story-back]"))>0)
    assert js("return window.atlasStoryBridge.currentYear()===1868")
    driver.find_element(By.CSS_SELECTOR,"[data-story-back]").click()
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T37-1872-CROWN-DEPOSIT"]'))>0)
    js("window.atlasStoryBridge.setYear(1899)")
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===1899"))
    assert js("return !!document.querySelector('.leaflet-container')")
    driver.save_screenshot(str(out/"19c-t37-1899-map-no-permanent-maqdala-colony.png"))
    print("PASS T37 public no-preview Chrome: 1867 Zula -> 1868 Maqdala/Delanta -> 1871 Westminster -> 1872 South Kensington, double-click/back, 1899 continuity")
except Exception:
    driver.save_screenshot(str(out/"19c-t37-failure.png"))
    raise
finally:
    driver.quit()
