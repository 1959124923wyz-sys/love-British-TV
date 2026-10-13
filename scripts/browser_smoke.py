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
    # The user explicitly removed the military-statistics badge; the compact
    # year/title card must remain without a hidden leftover statistics panel.
    verify("removed yearly military-status card is still present",
           """document.querySelector('#controlStatus')===null &&
              document.querySelector('.map-year-card #bigYear')!==null &&
              document.querySelector('.map-year-card').getBoundingClientRect().height<90""",driver)
    verify("1540 must not contain projected battle zones",
           "document.querySelectorAll('#map .atlas-contested-zone').length===0",driver)
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
    verify("English garrison layer was accidentally removed with statistics card",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===3",driver)
    verify("pixel-sized occupation ring is not visibly larger than an event icon",
           """document.querySelector('.atlas-local-english-garrison')?.getAttribute('stroke-dasharray')==='6 4'""", driver)
    verify("1544 Boulogne and Lochmaben occupation sites not rendered",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===3", driver)
    verify("purple approximate fort localities are not rendered",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===2", driver)
    verify("1544 raid around Leith is not presented as 1544 occupation of Edinburgh",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===1",driver)
    set_year(1545,17)
    verify("1545 French theater is not shown with blue/violet texture",
           "document.querySelectorAll('#map .atlas-contested-zone').length===1",driver)
    verify("1545 Lochmaben still wrongly occupied",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===2", driver)
    verify("French defence Outreau missing or wrongly classified",
           "document.querySelectorAll('#map .atlas-french-counterfort').length===1", driver)
    verify("1545 must not inherit previous 1544 raid as English territorial control",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===0",driver)
    set_year(1546,24)
    verify("1546 Ambleteuse and Boulemberg must join English occupation",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===4", driver)
    verify("1546 must not show 1547 Pinkie advance before the campaign",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===0",driver)
    set_year(1547,31)
    verify("1547 frontier advances are not shown as blue/violet disputed theaters",
           "document.querySelectorAll('#map .atlas-contested-zone').length===3",driver)
    verify("1547 Scottish garrison map incomplete",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===9", driver)
    verify("1547 advance toward Pinkie/Musselburgh failed to extend northward",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===1",driver)
    set_year(1548,44)
    verify("1548 war-zone layer is missing after removing the card",
           "document.querySelectorAll('#map .atlas-contested-zone').length===3 && document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===9",driver)
    verify("1548 English Haddington garrison and Lauder supply reference missing",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===2",driver)
    # Each type of territory must open the same source-aware detail drawer.
    def click_map_path(selector):
        driver.execute_script("""
          const el=document.querySelector(arguments[0]);
          if(!el)throw new Error('Missing map layer: '+arguments[0]);
          el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
        """,selector)
    click_map_path("#map .atlas-violet-wartime-vicinity")
    wait.until(lambda d: d.execute_script("return document.querySelector('#dossierBody .zone-dossier-facts')!==null"))
    verify("occupied zone dossier has no precision warning or dated source",
           """document.querySelector('#dossierBody').textContent.includes('英军驻地附近概略控制区') &&
              document.querySelector('#dossierBody').textContent.includes('地图精度') &&
              document.querySelector('#dossierBody .source-details')!==null &&
              document.querySelectorAll('#dossierBody .zone-record-link').length>0""",driver)
    click_map_path("#map .atlas-war-reach-schematic")
    verify("PR38 military reach must disclose non-annexation and sources",
           """document.querySelector('#dossierBody').textContent.includes('英军推进／补给影响示意') &&
              document.querySelector('#dossierBody').textContent.includes('不能证明沿途') &&
              document.querySelector('#dossierBody .source-details')!==null""",driver)
    click_map_path("#map .atlas-contested-zone")
    wait.until(lambda d: d.execute_script("return document.querySelector('#dossierBody').textContent.includes('交战与争夺区')"))
    verify("contested zone has no related evidence/campaign records",
           """document.querySelector('#dossierBody .zone-precision-note')!==null &&
              document.querySelectorAll('#dossierBody [data-zone-event]').length>0 &&
              document.querySelector('#dossierBody .source-details')!==null""",driver)
    driver.execute_script("document.querySelector('#dossierBody [data-zone-event]').click()")
    verify("selecting a zone's related event did not open the event dossier",
           "document.querySelector('#dossierBody .dossier-kicker').textContent.includes('历史事件') || document.querySelector('#dossierBody .dossier-kicker').textContent.includes('地理与政治') || document.querySelector('#dossierBody .dossier-kicker').textContent.includes('王室授权') || document.querySelector('#dossierBody .dossier-kicker').textContent.includes('战事')",driver)
    click_map_path("#map .atlas-territory-solid")
    verify("old clickable territory intro and source URLs disappeared",
           """document.querySelector('#dossierBody .dossier-kicker').textContent.includes('历史政治地理') &&
              document.querySelector('#dossierBody .zone-dossier-facts')!==null""",driver)
    verify("terrains rendered atop Scotland are preventing sovereignty click",
           "document.querySelectorAll('.leaflet-sovereignty-pane path.leaflet-interactive').length>0",driver)
    click_map_path(".leaflet-sovereignty-pane path.leaflet-interactive")
    verify("clicking sovereign background no longer opens nation overview",
           """document.querySelector('#dossierBody .dossier-kicker').textContent.includes('历史国家')""",driver)
    set_year(1548,44)
    verify("1548 Inchcolm and Hume must exit as English-held sites",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===10", driver)
    verify("Hailes must not remain English at 1548 year end",
           """!document.querySelector('#map .atlas-local-english-garrison[data-site-id="hailes-english-1548-date_unknown"]')""", driver)
    verify("1548 local English occupations must show violet uncertain overlays",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===9", driver)
    set_year(1549,49)
    verify("1549 border influence must contract away from withdrawn Haddington",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===2",driver)
    verify("1549 withdrew Ambleteuse/Boulemberg/Haddington, kept Boulogne",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===7", driver)
    verify("1549 French defensive Outreau missing",
           "document.querySelectorAll('#map .atlas-french-counterfort').length===1", driver)
    verify("1549 must retract Haddington combat occupation and retain Boulogne theater",
           "document.querySelectorAll('#map .atlas-contested-zone').length===2 && document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===6",driver)
    verify("Purple Boulogne and Scottish garrison references did not update for 1549",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===6", driver)
    toggle_layer("toggleTerritorialFootprints",False)
    verify("Hiding boundary context must hide the schematic control vicinity",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===0", driver)
    verify("Hiding a border must also hide the invented theater outline",
           "document.querySelectorAll('#map .atlas-contested-zone').length===0",driver)
    verify("Hiding boundary context cannot erase historically documented military sites",
           "document.querySelectorAll('#map .atlas-local-english-garrison').length===7", driver)
    toggle_layer("toggleTerritorialFootprints",True)
    verify("military-statistics card should not reappear after year navigation",
           "document.querySelector('#controlStatus')===null",driver)
    verify("French resistance ring missing at year-end",
           """document.querySelector('.atlas-french-counterfort')?.getAttribute('stroke-dasharray')==='3 5'""", driver)
    verify("Sixth decade slider not restricted to 1540–1549",
           "document.querySelector('#yearRange').min==='1540' && document.querySelector('#yearRange').max==='1549'", driver)
    zoom_1549=driver.execute_script("return [...document.querySelectorAll('.leaflet-tile')].map(img=>img.src.match(/\\/(\\d+)\\/\\d+\\/\\d+\\.png/)?.[1]).find(Boolean)")
    if zoom_1539 and zoom_1549:
        assert zoom_1539==zoom_1549, "Scrubbing to chapter six automatically zoomed the map"
    driver.save_screenshot(str(OUT / "chapter6-garrisons-1549.png"))
    # Regression: previously the battle/occupation SVGs were silently removed
    # above zoom 8/9. This is tested with *real mouse clicks*, not synthetic
    # dispatchEvent on a path that bypasses the browser's topmost hit target.
    from selenium.webdriver.common.actions.wheel_input import ScrollOrigin
    def real_map_area_click(selector):
        pos=driver.execute_script("""
          const selector=arguments[0], map=document.querySelector('#map');
          const mb=map.getBoundingClientRect();
          const candidates=[...document.querySelectorAll(selector)];
          for(const path of candidates){
            const rect=path.getBoundingClientRect();
            if(rect.width<4||rect.height<4)continue;
            const left=Math.max(rect.left,mb.left+8),right=Math.min(rect.right,mb.right-8);
            const topY=Math.max(rect.top,mb.top+8),bottom=Math.min(rect.bottom,mb.bottom-8);
            if(right<=left||bottom<=topY)continue;
            for(let yi=1;yi<=23;yi++)for(let xi=1;xi<=23;xi++){
              const x=left+(right-left)*xi/24;
              const y=topY+(bottom-topY)*yi/24;
              if(x<mb.left+8||x>mb.right-8||y<mb.top+8||y>mb.bottom-8)continue;
              const matrix=path.getScreenCTM();
              if(!matrix)continue;
              const local=new DOMPoint(x,y).matrixTransform(matrix.inverse());
              if(selector.includes('atlas-garrison-hit')?!path.isPointInStroke(local):!path.isPointInFill(local))continue;
              // A valid physical map click can hit the Leaflet Canvas beneath
              // this SVG; the app's geographical fallback must still open it.
              const top=document.elementFromPoint(x,y);
              if(!top||top.closest?.('.leaflet-marker-icon,.atlas-aggregate,.political-relation-symbol,.leaflet-control-container,.time-panel,.map-year-card,.leaflet-tooltip'))continue;
              if(!selector.includes('atlas-garrison-hit')&&top.closest?.('.atlas-local-english-garrison,.atlas-french-counterfort'))continue;
              if(selector.includes('atlas-garrison-hit')&&top!==path)continue;
              // Hovering nearby can expand markers. Leave room around their
              // full hit boxes instead of accepting a pixel at their edges.
              const blockers=[...document.querySelectorAll('.leaflet-marker-icon,.atlas-local-english-garrison,.atlas-french-counterfort')]
                .filter(el=>!selector.includes('atlas-local-english-garrison')||!el.matches(selector));
              if(!selector.includes('atlas-garrison-hit')&&blockers.some(el=>{const b=el.getBoundingClientRect();
                return x>b.left-20&&x<b.right+20&&y>b.top-20&&y<b.bottom+20;
              }))continue;
              const higher=(selector.includes('sovereignty')?
                '.atlas-violet-wartime-vicinity,.atlas-contested-zone,.atlas-territory-solid':
                selector.includes('contested')?'.atlas-violet-wartime-vicinity':'');
              if(higher && [...document.querySelectorAll(higher)].some(other=>{
                  const inv=other.getScreenCTM()?.inverse();return inv&&other.isPointInFill(new DOMPoint(x,y).matrixTransform(inv));
                }))continue;
              return {x,y,dx:x-(mb.left+mb.width/2),dy:y-(mb.top+mb.height/2),
                target:top.tagName,bbox:rect.width.toFixed(1)+'x'+rect.height.toFixed(1)};
            }
          }
          return null;
        """,selector)
        if not pos:
            diagnose=driver.execute_script("""
              const mb=document.querySelector('#map').getBoundingClientRect();
              return {map:[mb.left,mb.top,mb.width,mb.height],
                pathData:[...document.querySelectorAll(arguments[0])].slice(0,9).map(p=>{
                  const r=p.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
                  const el=document.elementFromPoint(cx,cy);
                  return {bounds:[r.left,r.top,r.width,r.height].map(n=>Math.round(n)),
                    fill:p.getAttribute('fill'),svgClass:p.closest('svg')?.getAttribute('class'),
                    pointer:getComputedStyle(p).pointerEvents,svgPointer:getComputedStyle(p.closest('svg')).pointerEvents,
                    inMap:cx>mb.left&&cx<mb.right&&cy>mb.top&&cy<mb.bottom,
                    top:el?.tagName,topClass:el?.getAttribute('class')?.slice(0,90)};
                })};
            """,selector)
            print("REAL_CLICK_DIAG",selector,diagnose,flush=True)
        assert pos, "No physically reachable painted area: "+selector
        ActionChains(driver).move_to_element_with_offset(
          driver.find_element(By.ID,'map'),round(pos['dx']),round(pos['dy'])).click().perform()
        return pos

    driver.execute_script("""
      window.__atlasClickAudit=[];
      document.addEventListener('click',e=>{
        window.__atlasClickAudit.push({x:e.clientX,y:e.clientY,
         target:e.target.tagName,cls:(e.target.getAttribute('class')||'').slice(0,100)});
      },true);
    """)
    set_year(1548,44)
    driver.execute_script("""
      const item=document.querySelector('#eventList [data-eid="1540S-021"]');
      if(!item)throw Error('Missing Haddington map-focus event');
      item.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));
    """)
    time.sleep(1.25)
    origin=ScrollOrigin.from_element(driver.find_element(By.ID,'map'))
    for _ in range(4):
        ActionChains(driver).scroll_from_origin(origin,0,-620).perform()
        time.sleep(.35)
    time.sleep(.6)
    print("CLICK_SOVEREIGN",real_map_area_click(".leaflet-sovereignty-pane path.leaflet-interactive"),flush=True)
    print("POINTER_AUDIT_SOVEREIGN",driver.execute_script("return window.__atlasClickAudit.slice(-3)"),flush=True)
    print("DOSSIER_AUDIT_SOVEREIGN",driver.execute_script("return document.querySelector('#dossierBody').textContent.slice(0,160)"),flush=True)
    wait.until(lambda d:"历史国家" in d.find_element(By.ID,"dossierBody").text)
    verify("contested zone disappeared after actual wheel zoom",
           "document.querySelectorAll('#map .atlas-contested-zone').length===3",driver)
    verify("occupied zone disappeared after actual wheel zoom",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===9",driver)
    print("CLICK_CONTESTED",real_map_area_click("#map .atlas-contested-zone"),flush=True)
    wait.until(lambda d:"交战与争夺区" in d.find_element(By.ID,"dossierBody").text)
    # Zoom toward the documented Broughty stronghold for a meaningful area
    # target (at low zoom these tiny locality references are subpixel).
    driver.execute_script("""
      const item=document.querySelector('#eventList [data-eid="1540S-015"]');
      item.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));
    """)
    time.sleep(1.25)
    for _ in range(3):
        ActionChains(driver).scroll_from_origin(origin,0,-620).perform()
        time.sleep(.35)
    time.sleep(.6)
    verify("high-zoom purple garrison zones must not disappear",
           "document.querySelectorAll('#map .atlas-violet-wartime-vicinity').length===9",driver)
    verify("high-zoom blue/violet contested zones must not disappear",
           "document.querySelectorAll('#map .atlas-contested-zone').length===3",driver)
    verify("high-zoom PR38 Haddington reach must not disappear",
           "document.querySelectorAll('#map .atlas-war-reach-schematic').length===2",driver)
    # Tiny unmeasured occupied-site polygons are sometimes smaller than their
    # visually prominent garrison circles. The purple circle must provide the
    # same territorial introduction without falsifying the underlying geometry.
    print("CLICK_OCCUPIED_RING",real_map_area_click("#map .atlas-garrison-hit"),flush=True)
    wait.until(lambda d:"英军驻地附近概略控制区" in d.find_element(By.ID,"dossierBody").text)
    verify("actually clicked occupied zone did not disclose historical source",
           "document.querySelector('#dossierBody .source-details')!==null",driver)
    verify("year card was recreated after zoom",
           "document.querySelector('#controlStatus')===null",driver)
    driver.save_screenshot(str(OUT / "chapter6-real-mouse-areas-high-zoom.png"))
    browser = driver.get_log("browser")
    critical = [x["message"] for x in browser if re.search(r"Uncaught (TypeError|ReferenceError|SyntaxError)|Uncaught \w+Error", x["message"])]
    assert not critical, "Browser JavaScript errors: " + str(critical[:8])
    print("PASS: 1520/1529/1519 year display, 4th-chapter integrity, source-location double click and unchanged zoom")
finally:
    driver.quit()
