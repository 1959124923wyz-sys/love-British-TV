#!/usr/bin/env python3
"""Headless Chromium verification of the desktop four-chapter atlas.

This is complementary to source/data checks. Network tiles are not historical data
and their transient failures are excluded from assertions.
"""
from pathlib import Path
import re
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "browser-smoke-results"
OUT.mkdir(exist_ok=True)
opts = Options()
opts.add_argument("--headless=new")
opts.add_argument("--disable-gpu")
opts.add_argument("--disable-dev-shm-usage")
opts.add_argument("--no-sandbox")
opts.add_argument("--window-size=1620,1040")
opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})

def verify(label, expression, driver):
    assert driver.execute_script("return " + expression), label

driver = webdriver.Chrome(options=opts)
try:
    wait = WebDriverWait(driver, 30)
    driver.get("http://127.0.0.1:8765/?year=1520")
    wait.until(lambda d: d.execute_script("return document.querySelector('#eventCount')?.textContent==='4项'"))
    verify("chapter 4 not active at 1520", "document.querySelector('#chapterFour').classList.contains('active')", driver)
    verify("1520 list leaked 1529 historical event", "!document.querySelector('#eventList').textContent.includes('吉讷边区法规鼓励')", driver)
    verify("modern representative 1520s locations lost dashed uncertainty markers",
           "document.querySelectorAll('#map .map-pin.uncertain').length>=1", driver)
    driver.save_screenshot(str(OUT / "chapter4-1520.png"))
    # With research Pale hidden, the documented Dublin relation must get its own glyph.
    def toggle_layer(layer_id, enabled):
        driver.execute_script("""
          const control=document.getElementById(arguments[0]);
          control.checked=arguments[1];
          control.dispatchEvent(new Event('change',{bubbles:true}));
        """, layer_id, enabled)
        time.sleep(0.2)
    toggle_layer("toggleHypotheses", False)
    verify("Dublin's historical relation vanished when Pale hypothesis was hidden",
           "document.querySelectorAll('.political-relation-symbol').length>=1", driver)
    toggle_layer("toggleHypotheses", True)
    toggle_layer("toggleTerritorialFootprints", False)
    verify("historical relationship markers missing when reference polygons are off",
           "document.querySelectorAll('.political-relation-symbol').length>=5", driver)
    driver.save_screenshot(str(OUT / "chapter4-political-markers-no-polygons.png"))
    toggle_layer("toggleTerritorialFootprints", True)


    def set_year(year, expected):
        driver.execute_script("""
          const slider=document.querySelector('#yearRange');
          slider.value=arguments[0];slider.dispatchEvent(new Event('input',{bubbles:true}));
        """, year)
        wait.until(lambda d: d.execute_script("return document.querySelector('#yearRange').value===arguments[0] && document.querySelector('#eventCount').textContent===arguments[1]", str(year), f"{expected}项"))
        time.sleep(0.25)

    set_year(1529, 24)
    verify("1529 final event missing", "document.querySelector('#eventList').textContent.includes('吉讷边区法规鼓励')", driver)
    driver.save_screenshot(str(OUT / "chapter4-1529.png"))
    # Full-chapter previews are opt-in per decade; returning to an earlier decade
    # must not leak future 1520s events into the 1510s or vice versa.
    toggle_layer("showFullChapterArchive", True)
    set_year(1519, 15)
    verify("complete-archive preview leaked into a new chapter",
           "!document.querySelector('#showFullChapterArchive').checked", driver)
    verify("switch to third chapter failed", "document.querySelector('#chapterThree').classList.contains('active')", driver)
    set_year(1520, 4)
    verify("reentry 1520 changed number of events", "document.querySelector('#eventCount').textContent==='4项'", driver)
    set_year(1513, 6)
    flodden = driver.find_element(By.CSS_SELECTOR, '#eventList .event-item[data-eid="1513-FLODDEN"]')
    before = driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    ActionChains(driver).double_click(flodden).perform()
    wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".atlas-target-marker"))>0)
    assert driver.execute_script("return document.querySelector('#yearRange').value")=="1513", "Event double-click changed selected history year"
    time.sleep(1.1)
    after = driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    if before and after:
        assert before==after, f"Event locator changed tile zoom {before}->{after}"
    driver.save_screenshot(str(OUT / "focus-flodden-1513.png"))

    # A visible SVG route must win the pointer hit-test over kingdom and territorial polygons.
    def route_check(target_year, route_name):
        driver.execute_script("""
          const slider=document.getElementById('yearRange');
          slider.value=arguments[0];slider.dispatchEvent(new Event('input',{bubbles:true}));
        """, target_year)
        wait.until(lambda d: d.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(target_year)))
        wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".leaflet-voyage-pane .atlas-voyage-hit")) >= 1)
        payload=driver.execute_script("""
          const line=document.querySelector('.leaflet-voyage-pane .atlas-voyage-hit');
          const halfway=line.getPointAtLength(line.getTotalLength()*0.5);
          const mapped=halfway.matrixTransform(line.getScreenCTM());
          const front=document.elementFromPoint(mapped.x,mapped.y);
          return {isFront:front===line||line.contains(front),insideViewport:mapped.x>0&&mapped.y>0&&mapped.x<innerWidth&&mapped.y<innerHeight};
        """)
        assert payload['insideViewport'], "Route midpoint outside map viewport: " + str(payload)
        assert payload['isFront'], "Another map layer intercepts route pointer at viewport center: " + str(payload)
        driver.execute_script("""
          const line=document.querySelector('.leaflet-voyage-pane .atlas-voyage-hit');
          const halfway=line.getPointAtLength(line.getTotalLength()*0.5);
          const mapped=halfway.matrixTransform(line.getScreenCTM());
          line.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:mapped.x,clientY:mapped.y}));
        """)
        wait.until(lambda d: route_name in d.find_element(By.ID, "dossierBody").text)
        return driver.find_element(By.ID, "dossierBody").text

    first_route=route_check(1497,"1497年航行方向示意")
    assert "非卡博特实际GPS轨迹" in first_route, "1497 route's uncertainties not visible"
    driver.save_screenshot(str(OUT / "interactive-voyage-1497.png"))
    second_route=route_check(1527,"1527年约翰·拉特远航")
    assert "不表示船只实际航行轨迹" in second_route, "1527 endpoint connection risks being misinterpreted as an actual track"
    driver.save_screenshot(str(OUT / "voyage-endpoints-1527.png"))

    toggle_layer("toggleEvents", False)
    verify("a hidden event layer kept a previously focused marker visible",
           "document.querySelectorAll('.atlas-target-marker').length===0", driver)
    toggle_layer("toggleEvents", True)
    browser = driver.get_log("browser")
    critical = [x["message"] for x in browser if re.search(r"Uncaught (TypeError|ReferenceError|SyntaxError)|Uncaught \w+Error", x["message"])]
    assert not critical, "Browser JavaScript errors: " + str(critical[:8])
    print("PASS: 1520/1529/1519 year display, 4th-chapter integrity, source-location double click and unchanged zoom")
finally:
    driver.quit()
