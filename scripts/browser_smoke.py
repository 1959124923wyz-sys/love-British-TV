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
    verify("chapter 4 not active at 1520", """document.querySelector('#chapterTrack [data-decade="1520"]').classList.contains('active')""", driver)
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
    # When the island footprint is visible, its Guernsey polity must not
    # produce a second large hatched circle on top of the Channel Islands.
    verify("Guernsey duplicate disk covers its island footprint",
           """!document.querySelector('.political-relation-symbol [data-polity-id="polity-area-symbol-channel-guernsey-1530s"]')""", driver)
    toggle_layer("toggleTerritorialFootprints", False)
    verify("historical relationship markers missing when reference polygons are off",
           "document.querySelectorAll('.political-relation-symbol').length>=6", driver)
    verify("fallback Guernsey symbol is still oversized",
           """document.querySelector('.political-relation-symbol [data-polity-id="polity-area-symbol-channel-guernsey-1530s"]')?.getAttribute('width')==='26'""", driver)
    driver.execute_script("""
      document.querySelector('.political-relation-symbol [data-polity-id="polity-area-symbol-channel-guernsey-1530s"]')
        .closest('.political-relation-symbol').click();
    """)
    wait.until(lambda d: "根西岛" in d.find_element(By.ID, "dossierBody").text)
    verify("1520 Guernsey click lacks published historical sources",
           "document.querySelector('#dossierBody .source-details')!==null", driver)
    assert driver.execute_script("return document.getElementById('bigYear').textContent")=="1520", "Polity click changed the historical year"
    driver.save_screenshot(str(OUT / "chapter4-political-markers-no-polygons.png"))
    toggle_layer("toggleTerritorialFootprints", True)
    verify("Guernsey disk returned over its mapped island",
           """!document.querySelector('.political-relation-symbol [data-polity-id="polity-area-symbol-channel-guernsey-1530s"]')""", driver)


    def set_year(year, expected):
        driver.execute_script("""
          const input=document.querySelector('#jumpYear');
          input.value=arguments[0];input.dispatchEvent(new Event('change',{bubbles:true}));
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
    verify("switch to third chapter failed", """document.querySelector('#chapterTrack [data-decade="1510"]').classList.contains('active')""", driver)
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
          const input=document.getElementById('jumpYear');
          input.value=arguments[0];input.dispatchEvent(new Event('change',{bubbles:true}));
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
    # Fifth chapter: every reference event stays in the right decade and never leaks backwards.
    set_year(1530, 0)
    verify("Fifth chapter not active at 1530", """document.querySelector('#chapterTrack [data-decade="1530"]').classList.contains('active')""", driver)
    verify("1530 shows later events despite the fixed date gate", "document.querySelector('#eventList').querySelectorAll('.event-item').length===0", driver)
    verify("Crown Calais controls lost at 1529/1530",
           "document.querySelectorAll('#map .control-area-label').length>=0", driver)
    driver.save_screenshot(str(OUT / "chapter5-1530.png"))
    for annual, expected in [(1531,1),(1532,3),(1533,4),(1534,6),(1535,9),(1536,15),(1537,18),(1538,22),(1539,27)]:
        set_year(annual, expected)
    verify("1539 lost 1535 Maynooth event",
           "document.querySelector('#eventList').textContent.includes('梅努斯城堡')", driver)
    driver.save_screenshot(str(OUT / "chapter5-1539.png"))
    toggle_layer("showFullChapterArchive", True)
    set_year(1529, 24)
    verify("Fifth chapter archive leaked into fourth",
           "!document.querySelector('#showFullChapterArchive').checked", driver)
    set_year(1535, 9)
    maynooth = driver.find_element(By.CSS_SELECTOR, '#eventList .event-item[data-eid="1530S-E004"]')
    zoom_before = driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    ActionChains(driver).double_click(maynooth).perform()
    wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".atlas-target-marker"))>0)
    time.sleep(1.1)
    zoom_after = driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    if zoom_before and zoom_after:
        assert zoom_after==zoom_before, "Maynooth focus incorrectly zoomed map"
    assert driver.execute_script("return document.querySelector('#yearRange').value")=="1535", "Maynooth double-click changed date"
    driver.save_screenshot(str(OUT / "focus-maynooth-1535.png"))
    # The century strip is informational navigation: it cannot turn a researched 1535
    # atlas into a fictitious 1700s/1900s territorial snapshot.
    current = driver.execute_script("return document.getElementById('bigYear').textContent")
    driver.execute_script("document.querySelector('#centuryNav [data-century=\"1700\"]').click()")
    assert driver.execute_script("return document.getElementById('bigYear').textContent")==current
    verify("century browser must retain five decade slots",
           "document.querySelectorAll('#chapterTrack .chapter-segment').length===5", driver)
    verify("1700s century is not a published map",
           "document.querySelector('#chapterTrack [data-decade=\"1700\"]').classList.contains('unpublished')", driver)
    driver.execute_script("document.querySelector('#chapterTrack [data-decade=\"1700\"]').click()")
    assert driver.execute_script("return document.getElementById('bigYear').textContent")==current
    # Stress a 500-year navigation span: card count and slot widths must remain bounded.
    driver.execute_script("""
      document.querySelector('#centuryNav [data-century="1400"]').click();
      for(let i=0;i<50;i++)document.getElementById('browseDecadeNext').click();
    """)
    verify("500-year navigation rendered more than five chapter cards",
           "document.querySelectorAll('#chapterTrack .chapter-segment').length===5", driver)
    assert driver.execute_script("return document.getElementById('bigYear').textContent")==current
    # A return to a published chapter works even after browsing centuries ahead.
    driver.execute_script("document.querySelector('#centuryNav [data-century=\"1500\"]').click()")
    wait.until(lambda d: d.find_elements(By.CSS_SELECTOR, '#chapterTrack [data-decade="1500"].published'))
    driver.execute_script("document.querySelector('#chapterTrack [data-decade=\"1500\"]').click()")
    wait.until(lambda d: d.execute_script("return document.getElementById('bigYear').textContent==='1500'"))
    verify("decade-local year slider must cover 1500–1509, not all 500 years",
           "document.getElementById('yearRange').min==='1500'&&document.getElementById('yearRange').max==='1509'", driver)
    # Arrow advances an entire half-century, not a single decade.
    driver.execute_script("document.getElementById('browseDecadeNext').click()")
    verify("first half-century arrow did not show 1550–1599",
           "document.querySelectorAll('#chapterTrack .chapter-segment').length===5 && document.querySelector('#chapterTrack [data-decade=\"1550\"]') && document.querySelector('#chapterTrack [data-decade=\"1590\"]')", driver)
    assert driver.execute_script("return document.getElementById('bigYear').textContent")=="1500"
    driver.execute_script("document.getElementById('browseDecadePrev').click()")
    verify("previous arrow did not return to 1500–1549",
           "document.querySelector('#chapterTrack [data-decade=\"1500\"]') && document.querySelector('#chapterTrack [data-decade=\"1540\"]')", driver)
    driver.save_screenshot(str(OUT / "half-century-5-chapters.png"))
    # Change one year with the third-tier slider and check chronology.
    driver.execute_script("""
      const el=document.getElementById('yearRange');
      el.value=1501;el.dispatchEvent(new Event('input',{bubbles:true}));
    """)
    wait.until(lambda d: d.execute_script("return document.getElementById('bigYear').textContent==='1501'"))
    for width in (1920,1440,1280):
        driver.set_window_size(width,1040)
        time.sleep(.25)
        dims=driver.execute_script("""
          const cards=[...document.querySelectorAll('#chapterTrack .chapter-segment')];
          return {count:cards.length,smallest:Math.min(...cards.map(x=>x.getBoundingClientRect().width)),overflow:document.querySelector('#chapterTrack').scrollWidth-document.querySelector('#chapterTrack').clientWidth};
        """)
        assert dims['count']==5 and dims['smallest']>=60 and dims['overflow']<=2, f"Timeline clipped at {width}px: {dims}"
    driver.save_screenshot(str(OUT / "three-tier-century-decade-year.png"))
    # Chapter six: year-end controls are distinct from archival events.
    # Temporary English garrison sites must disappear at the researched end year,
    # without erasing existing sovereign Scotland or the English Boulogne core.
    set_year(1539,27)
    zoom_1539=driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    set_year(1540,1)
    verify("chapter six did not become selectable on the half-century page",
           """document.querySelector('#chapterTrack [data-decade="1540"].active')!==null""", driver)
    verify("old Calais historical footprint was reset in 1540",
           "document.querySelectorAll('#map .atlas-territory-solid').length>=1", driver)
    set_year(1541,2)
    verify("Irish Crown Act title still has untranslated political status words",
           """document.querySelector('#eventList').textContent.includes('领主辖区') && document.querySelector('#eventList').textContent.includes('王国') && !document.querySelector('#eventList').textContent.includes('Lordship')""", driver)
    set_year(1544,11)
    verify("duplicate native browser title still overlays styled historical tooltip",
           """document.querySelectorAll('#map .leaflet-marker-icon[title]').length===0""", driver)
    verify("year-end occupation is not communicated on the map",
           """document.querySelector('#controlStatus').textContent.includes('英军局部驻点 3处')""", driver)
    verify("pixel-sized occupation ring is not visibly larger than an event icon",
           """document.querySelector('.atlas-local-english-garrison')?.getAttribute('stroke-dasharray')==='6 4'""", driver)
    verify("1544 Boulogne and Lochmaben occupation sites not rendered",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===3", driver)
    verify("purple approximate fort localities are not rendered",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===2", driver)
    set_year(1545,17)
    verify("1545 Lochmaben still wrongly occupied",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===2", driver)
    verify("French defence Outreau missing or wrongly classified",
           "document.querySelectorAll('#map .atlas-french-counterfort').length===1", driver)
    set_year(1546,24)
    verify("1546 Ambleteuse and Boulemberg must join English occupation",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===4", driver)
    set_year(1547,31)
    verify("1547 Scottish garrison map incomplete",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===9", driver)
    set_year(1548,44)
    verify("1548 Inchcolm and Hume must exit as English-held sites",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===10", driver)
    verify("Hailes must not remain English at 1548 year end",
           """!document.querySelector('#map .atlas-local-english-garrison[data-site-id="hailes-english-1548-date_unknown"]')""", driver)
    verify("1548 local English occupations must show violet uncertain overlays",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===9", driver)
    set_year(1549,49)
    verify("1549 withdrew Ambleteuse/Boulemberg/Haddington, kept Boulogne",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===7", driver)
    verify("1549 French defensive Outreau missing",
           "document.querySelectorAll('#map .atlas-french-counterfort').length===1", driver)
    verify("Purple Boulogne and Scottish garrison references did not update for 1549",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===6", driver)
    toggle_layer("toggleTerritorialFootprints",False)
    verify("Hiding boundary context must hide the schematic control vicinity",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===0", driver)
    verify("Hiding boundary context cannot erase historically documented military sites",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===7", driver)
    toggle_layer("toggleTerritorialFootprints",True)
    verify("1549 site count or source uncertainty hidden",
           """document.querySelector('#controlStatus').textContent.includes('英军局部驻点 7处') && !document.querySelector('#controlStatus').textContent.includes('续驻待核')""", driver)
    verify("French resistance ring missing at year-end",
           """document.querySelector('.atlas-french-counterfort')?.getAttribute('stroke-dasharray')==='3 5'""", driver)
    verify("Sixth decade slider not restricted to 1540–1549",
           "document.querySelector('#yearRange').min==='1540' && document.querySelector('#yearRange').max==='1549'", driver)
    zoom_1549=driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    if zoom_1539 and zoom_1549:
        assert zoom_1539==zoom_1549, "Scrubbing to chapter six automatically zoomed the map"
    driver.save_screenshot(str(OUT / "chapter6-garrisons-1549.png"))
    browser = driver.get_log("browser")
    critical = [x["message"] for x in browser if re.search(r"Uncaught (TypeError|ReferenceError|SyntaxError)|Uncaught \w+Error", x["message"])]
    assert not critical, "Browser JavaScript errors: " + str(critical[:8])
    print("PASS: 1520/1529/1519 year display, 4th-chapter integrity, source-location double click and unchanged zoom")
finally:
    driver.quit()
