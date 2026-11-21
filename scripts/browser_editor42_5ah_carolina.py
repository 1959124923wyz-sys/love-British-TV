#!/usr/bin/env python3
"""Real desktop Chrome verification for 5AH historical year transitions."""
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

options=Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1780,1020")
browser=webdriver.Chrome(options=options)
try:
    root=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")
    browser.get(root+"?review18c=1&review19c=1&year=1700")
    wait=WebDriverWait(browser,70)
    wait.until(lambda d:d.execute_script(
        "return window.eighteenthMassSpatial?.getAudit()?.loaded===true && "
        "document.querySelector('#workspace')?.dataset.atlasReady==='true'"))
    def audit(y):
        browser.execute_script("window.atlasStoryBridge.setYear(arguments[0]);",y)
        wait.until(lambda d:d.execute_script(
            "return window.eighteenthMassSpatial.getAudit().year===arguments[0]",y))
        return browser.execute_script("return window.eighteenthMassSpatial.getAudit();")
    for y in range(1700,1712):
        a=audit(y)
        assert "CAROLINA_PROPRIETORS" not in a["activeZones"],str(y)+": original claimant rectangle is wrongly showing"
        s=set(a["activeRegionalSites"])
        assert "CAROLINA_CHARLESTOWN_1700_1711" in s,y
        assert ("CAROLINA_BATH_TOWN_1705_1711" in s)==(y>=1705),y
        assert ("CHARLESTON_FORT_JOHNSON" in s)==(y>=1708),y
        assert ("CAROLINA_NEW_BERN_1710_1711" in s)==(y>=1710),y
    at1712=audit(1712)
    assert not set(at1712["activeRegionalSites"]).intersection({
        "CAROLINA_CHARLESTOWN_1700_1711","CAROLINA_BATH_TOWN_1705_1711",
        "CAROLINA_NEW_BERN_1710_1711"})
    a=audit(1783)
    assert "GREAT_LAKES_POSTS" not in a["activeZones"]
    assert {"FORT_NIAGARA_MAIN","DETROIT_FORT_LERNOULT","MACKINAC_ISLAND_FORT"}.issubset(
        a["activeRegionalZones"])
    a=audit(1788)
    assert "NSW_CROWN_CLAIM" not in a["activeZones"]
    assert "SYDNEY_MARINE_CAMP_1788" in a["activeRegionalZones"]
    a=audit(1799)
    assert "CAROLINA_PROPRIETORS" not in a["activeZones"]
    assert "NSW_CROWN_CLAIM" not in a["activeZones"]
    has_copy_guard=browser.execute_script("return typeof window.AtlasPublicCopyGuard?.visibleWarnings === 'function'")
    if has_copy_guard:
        assert browser.execute_script("return window.AtlasPublicCopyGuard.visibleWarnings().length") == 0
    print("PASS Chrome 5AH: all 12 dated 1700-1711 transitions, no claimant rectangle, 1712 boundary, 5AG fort/NSW preserved, 1799 unchanged")
finally:
    browser.quit()
