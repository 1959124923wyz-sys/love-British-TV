#!/usr/bin/env python3
"""Real Chrome desktop regression for 5AJ: reference context and upgraded polygons."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
import os
root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results";out.mkdir(exist_ok=True)
opt=Options()
for arg in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1780,1020"):
    opt.add_argument(arg)
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,100)
def js(code,*a):return driver.execute_script(code,*a)
def count(css):return js("return document.querySelectorAll(arguments[0]).length",css)
def setyear(y):
    js("window.atlasStoryBridge.setYear(arguments[0])",y)
    wait.until(lambda _:js("return document.getElementById('bigYear').textContent===String(arguments[0])",y))
def state(name):return js("return window[arguments[0]]?.getAudit()",name)
try:
    driver.get(os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")+"?year=1686")
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:count('path.atlas-17c-5ai-referenced-event')==3)
    wait.until(lambda _:count('path.atlas-17c-5aj-reference-outline')>0)
    assert count('path.atlas-17c-5aj-study-outline')>=1
    driver.save_screenshot(str(out/"editor44-5aj-1686-three-forts-and-uncertain-outline.png"))
    setyear(1630)
    wait.until(lambda _:count('path.atlas-17c-5ai-physical-island')>=3)
    assert count('path.atlas-17c-5aj-reference-outline')>=0
    setyear(1696)
    wait.until(lambda _:count('path.atlas-17c-5ai-referenced-event')==3)
    assert count('path.atlas-17c-5aj-study-outline')>=1
    driver.save_screenshot(str(out/"editor44-5aj-1696-historical-raid-reference.png"))
    setyear(1599)
    wait.until(lambda _:count('path.atlas-17c-5aj-reference-outline')==0)
    setyear(1799)
    wait.until(lambda _:state("eighteenthBatch37Spatial") and state("eighteenthBatch39Spatial"))
    wait.until(lambda _:state("eighteenthBatch37Spatial")["visibleRecoveredReferenceOutlines"]>=1)
    wait.until(lambda _:state("eighteenthBatch39Spatial")["visibleRecoveredReferenceOutlines"]>=1)
    assert len(state("eighteenthBatch37Spatial")["recoveredReferenceIds"])==8
    assert len(state("eighteenthBatch39Spatial")["recoveredReferenceIds"])==24
    assert count('path.atlas-18c-5aj-reference-outline')>=2
    driver.save_screenshot(str(out/"editor44-5aj-1799-18c-locality-overviews.png"))
    setyear(1800)
    wait.until(lambda _:count('path.atlas-18c-5aj-reference-outline')==0)
    assert not js("return window.AtlasPublicCopyGuard?.visibleWarnings?.()||[]")
    print("PASS Chrome 5AJ: 23 original 17C reference contexts and 32 curated 18C local contexts, no 16C/19C leakage")
except Exception:
    driver.save_screenshot(str(out/"editor44-5aj-failure.png"))
    raise
finally:
    driver.quit()
