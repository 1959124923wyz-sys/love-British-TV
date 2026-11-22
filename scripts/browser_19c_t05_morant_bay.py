"""T05 real 1780x1020 desktop Chrome history-story/map navigation smoke."""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results"
out.mkdir(parents=True,exist_ok=True)
opt=Options()
for arg in ("--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--window-size=1780,1020"):
    opt.add_argument(arg)
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,120)
js=lambda code,*args:driver.execute_script(code,*args)
topic="E19-T05-MORANT-BAY-MARTIAL-LAW-CROWN-COLONY"
def focus(eid,year,lat,lng,proof):
    selector='.major-story-article [data-story-event="'+eid+'"]'
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,selector))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    if lat is not None:
        wait.until(lambda _:js("const p=window.atlasReadViewport().center;return Math.abs(p.lat-arguments[0])<0.65&&Math.abs(p.lng-arguments[1])<0.65",lat,lng))
    driver.save_screenshot(str(out/proof))
try:
    qs="?review19c=1&year=1865" if os.environ.get("T05_PUBLISHED")!="1" else "?year=1865"
    driver.get(os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")+qs)
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T05-1865-OCT11-MORANT-CLASH')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T05-1865-OCT11-MORANT-CLASH'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T05-1865-OCT11-MORANT-CLASH')",topic)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T05-1865-OCT24-BOGLE-EXECUTION"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))==23
    driver.save_screenshot(str(out/"19c-t05-18-sections.png"))
    focus("E19-T05-1865-OCT10-ARREST-ATTEMPT",1865,17.934921,-76.435375,"19c-t05-stony-gut.png")
    focus("E19-T05-1865-OCT11-MORANT-CLASH",1865,17.881448,-76.409267,"19c-t05-morant.png")
    focus("E19-T05-1865-OCT17-GORDON-SURRENDER",1865,17.997,-76.794,"19c-t05-kingston.png")
    focus("E19-T05-1866-FEB28-GOVERNMENT-BILL",1866,None,None,"19c-t05-1866.png")
    focus("E19-T05-1867-PARISH-REFORM",1867,17.997,-76.794,"19c-t05-1867.png")
    for master,slave in (("mapLayerTerritory","toggleTerritorialFootprints"),("mapLayerEvents","toggleEvents")):
        before=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not before,slave))
        driver.save_screenshot(str(out/("19c-t05-layer-"+master+".png")))
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]",master,before))
    element=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T05-1865-OCT23-GORDON-EXECUTION"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",element)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T05-1865-OCT24-BOGLE-EXECUTION"]'))>0)
    for year in (1875,1899):
        js("window.atlasStoryBridge.setYear(arguments[0])",year)
        wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
        driver.save_screenshot(str(out/("19c-t05-"+str(year)+".png")))
    print("PASS T05 Chrome 23 links, 1865/66/67/75/99, layer toggles and doubleclick/back")
except Exception:
    driver.save_screenshot(str(out/"19c-t05-failure.png"))
    raise
finally:
    driver.quit()
