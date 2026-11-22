"""T46 Australian frontier preview: real desktop Chrome history-story & GIS navigation."""
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
for option in ("--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--window-size=1780,1020"):
    opts.add_argument(option)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda code,*args:driver.execute_script(code,*args)
topic="E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE"

def focus(eid,year,lat,lng,proof):
    locator='.major-story-article [data-story-event="'+eid+'"]'
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,locator))>0)
    el=driver.find_element(By.CSS_SELECTOR,locator)
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    if lat is not None:
        wait.until(lambda _:js("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.60&&Math.abs(p.lng-arguments[1])<0.60",lat,lng))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article'))>0
    driver.save_screenshot(str(out/proof))

try:
    driver.get(os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")+"?year=1829")
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    assert "review19c" not in driver.current_url, "Published T46 must work without preview URL flag"
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T46-1874-BARROW-ATTACK')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T46-1829-PERTH-FOUNDATION'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T46-1829-PERTH-FOUNDATION')",topic)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T46-1838-MYALL-TRIAL-FIRST"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))==39
    driver.save_screenshot(str(out/"19c-t46-1829-25-section-story.png"))
    focus("E19-T46-1829-PERTH-FOUNDATION",1829,-31.9523,115.8613,"19c-t46-1829-perth.png")
    focus("E19-T46-1835-BOURKE-PROCLAMATION",1835,-33.86785,151.20732,"19c-t46-1835-bourke.png")
    focus("E19-T46-1838-MYALL-TRIAL-FIRST",1838,-33.86785,151.20732,"19c-t46-1838-myall-court.png")
    focus("E19-QNP-1857-HORNET",1857,-25.757,149.407,"19c-t46-1857-hornet.png")
    focus("E19-T46-1868-FLYING-FOAM-ORDERS",1868,-20.76667,117.15,"19c-t46-1868-murujuga.png")
    focus("E19-T46-1874-BARROW-ATTACK",1874,-21.52956,133.889588,"19c-t46-1874-barrow.png")
    # A sensitive and disputed Bunuba site is text/date-linked, not given invented battlefield GPS.
    focus("E19-T46-1897-TUNNEL",1897,None,None,"19c-t46-1897-bunuba.png")
    js("window.atlasStoryBridge.setYear(1868)")
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===1868"))
    for master,slave in (("mapLayerTerritory","toggleTerritorialFootprints"),("mapLayerEvents","toggleEvents")):
        before=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1] && document.getElementById(arguments[2]).checked===arguments[1]",master,not before,slave))
        driver.save_screenshot(str(out/("19c-t46-layer-"+master+".png")))
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]",master,before))
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T46-1838-MYALL-TRIAL-FIRST"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,"[data-story-back]"))>0)
    assert js("return window.atlasStoryBridge.currentYear()===1838")
    driver.find_element(By.CSS_SELECTOR,"[data-story-back]").click()
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T46-1874-BARROW-ATTACK"]'))>0)
    js("window.atlasStoryBridge.setYear(1899)")
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===1899"))
    assert js("return !!document.querySelector('.leaflet-container')")
    driver.save_screenshot(str(out/"19c-t46-1899-continuity.png"))
    print("PASS T46 published no-review Chrome: 25 sections, 39 links, Perth->Myall->Hornet->Murujuga->Barrow->Bunuba, layer toggles, double click/back, 1899")
except Exception:
    driver.save_screenshot(str(out/"19c-t46-failure.png"))
    raise
finally:
    driver.quit()
