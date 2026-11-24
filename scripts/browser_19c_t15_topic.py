"""Desktop Chrome check for the T15 archive-to-map first integrated story."""
from pathlib import Path
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
root=Path(__file__).resolve().parents[1]
(root/"browser-smoke-results").mkdir(exist_ok=True)
options=Options()
for flag in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1780,1020"):
    options.add_argument(flag)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,95)
script=lambda code,*args:driver.execute_script(code,*args)
try:
    driver.get(os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")+"?year=1857")
    wait.until(lambda _:script("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:script("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T15-1857-BANARAS-DISARM')"))
    for id in ("E19-T15-1857-BANARAS-DISARM","E19-T15-1857-ALLAHABAD-LETTER","E19-T15-1858-JHANSI-STORM"):
        event=script("return window.atlasStoryBridge.eventById(arguments[0])",id)
        assert event and event["lat"] is not None,id
    script("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T15-1857-BANARAS-DISARM'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="E19-T15-INDIAN-UPRISING-REPRISALS"]'))>0)
    script("window.HistoryStories.openStory('E19-T15-INDIAN-UPRISING-REPRISALS',false,'E19-T15-1857-BANARAS-DISARM')")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T15-1858-JHANSI-STORM"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=34
    driver.save_screenshot(str(root/"browser-smoke-results"/"19c-t15-1857-story.png"))
    elem=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T15-1858-JHANSI-STORM"]')
    script("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",elem)
    wait.until(lambda _:script("return window.atlasStoryBridge.currentYear()===1858"))
    wait.until(lambda _:script("let p=window.atlasReadViewport().center;return Math.abs(p.lat-25.45778)<0.45&&Math.abs(p.lng-78.57556)<0.45"))
    assert script("return !!document.querySelector('.major-story-article')"),"Story lost on map jump"
    driver.save_screenshot(str(root/"browser-smoke-results"/"19c-t15-1858-jhansi-focused.png"))
    print("PASS desktop T15: historical event -> eight-section story -> 1858 jump -> Jhansi map center; article retained")
except Exception:
    driver.save_screenshot(str(root/"browser-smoke-results"/"19c-t15-failure.png"))
    raise
finally:
    driver.quit()
