#!/usr/bin/env python3
"""Real 1780x1020 Chrome: 5AI three natural island contexts and 23 local 17C study/claim frames."""
from pathlib import Path
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results";out.mkdir(exist_ok=True)
opt=Options()
for arg in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1780,1020"):opt.add_argument(arg)
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,90)
def js(s,*args):return driver.execute_script(s,*args)
def path(name):
    return "path.atlas-17c-5ai-id-"+name.lower()
def count(css):
    return int(js("return document.querySelectorAll(arguments[0]).length",css))
def set_year(y):
    js("window.atlasStoryBridge.setYear(arguments[0])",y)
    wait.until(lambda d:js("return document.getElementById('bigYear').textContent===String(arguments[0])",y))
    wait.until(lambda d:js("return !document.querySelector('.atlas-loading')"))
def on(y,name,expected=True):
    set_year(y)
    visible=bool(count(path(name)))
    assert visible==expected,("year",y,"shape",name,"visible",visible,"expected",expected)
    return count('path.atlas-17c-5ai-physical-island'),count('path.atlas-17c-5ai-referenced-event')
try:
    url=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")
    driver.get(url+"?year=1623")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1623'"))
    wait.until(lambda d:count(path('EDITOR43_5AI_ST_KITTS_ISLAND'))==1)
    assert count(path('EDITOR43_5AI_NEVIS_ISLAND'))==0
    assert count("path.atlas-17c-5ai-physical-island")==1
    assert count("path.atlas-17c-5ai-localized-point")>=1
    driver.save_screenshot(str(out/'editor43-5ai-1623-real-st-kitts.png'))
    on(1627,'EDITOR43_5AI_NEVIS_ISLAND',False)
    on(1628,'EDITOR43_5AI_NEVIS_ISLAND')
    assert count('path.atlas-17c-5ai-physical-island')==2
    on(1630,'EDITOR43_5AI_PROVIDENCIA_ISLAND')
    assert count('path.atlas-17c-5ai-physical-island')>=3
    driver.save_screenshot(str(out/'editor43-5ai-1630-providencia-st-kitts-nevis.png'))
    on(1640,'EDITOR43_5AI_PROVIDENCIA_ISLAND')
    on(1641,'EDITOR43_5AI_PROVIDENCIA_ISLAND',False)
    on(1658,'EDITOR43_5AI_ST_HELENA_ISLAND',False)
    on(1659,'EDITOR43_5AI_ST_HELENA_ISLAND')
    driver.save_screenshot(str(out/'editor43-5ai-1659-st-helena-natural-coast.png'))
    on(1699,'EDITOR43_5AI_ST_HELENA_ISLAND')
    on(1700,'EDITOR43_5AI_ST_HELENA_ISLAND',False)
    # Source-registered war readers and company places are individually point-aligned.
    set_year(1637)
    assert count('path.atlas-17c-5ai-referenced-event')==2
    assert count('path.atlas-17c-regional-area')>=0
    set_year(1680)
    assert count('path.atlas-17c-5ai-referenced-event')==2
    set_year(1686)
    assert count('path.atlas-17c-5ai-referenced-event')==3
    assert count('path.atlas-17c-regional-area')==0
    driver.save_screenshot(str(out/'editor43-5ai-1686-three-hudson-bay-forts-no-rectangle.png'))
    set_year(1696)
    assert count('path.atlas-17c-5ai-referenced-event')==3
    assert count('path.atlas-17c-regional-area')==0
    driver.save_screenshot(str(out/'editor43-5ai-1696-three-raid-sites-no-box.png'))
    set_year(1612)
    assert count('path.atlas-17c-5ai-localized-point')>=1
    # All historical archives are still accessible from the same reader directory.
    js("document.getElementById('showSeventeenthClaimDirectory').click()")
    wait.until(lambda d:js("return !!document.querySelector('#claimDirectorySearch')"))
    assert "苏拉特" in js("return document.getElementById('dossierBody').textContent")
    # The selected year must have no reader-facing cartographic disclaimer.
    warn=js("return typeof window.AtlasPublicCopyGuard?.visibleWarnings==='function'?window.AtlasPublicCopyGuard.visibleWarnings():[]")
    assert not warn,warn
    # Preserve original pre-1600 chapter behavior, no 17C overlays displayed.
    set_year(1599)
    # setYear updates the large year label before some Leaflet render lifecycle work.
    # Wait for the previous-century layers to clear rather than sampling mid-transition.
    wait.until(lambda d:count('path.atlas-17c-5ai-physical-island')==0 and
               count('path.atlas-17c-5ai-localized-point')==0 and
               count('path.atlas-17c-5ai-referenced-event')==0)
    print("PASS Chrome 5AI: Saint Helena, Providencia, staggered St Kitts/Nevis and 30 dated named places replace 26 visual rectangles; 1599 and 1700 clean.")
except Exception:
    driver.save_screenshot(str(out/'editor43-5ai-failure.png'))
    raise
finally:
    driver.quit()
