#!/usr/bin/env python3
"""Interaction-oriented desktop/mobile browser audit, not a GIS coordinate test.

Tests what visitors can see and touch: clear initial map, discoverable event
drawer, one-tap event-to-map location, timeline and layer controls, responsive
dossier behavior and no zoom/year changes from explicit event positioning.
"""
import json
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "ux-browser-results"
OUT.mkdir(exist_ok=True)


def run_case(label, width, height, mobile):
    opt = Options()
    opt.add_argument("--headless=new")
    opt.add_argument("--no-sandbox")
    opt.add_argument("--disable-dev-shm-usage")
    opt.add_argument("--window-size=1440,950")
    if mobile:
        opt.add_experimental_option("mobileEmulation", {
            "deviceMetrics": {"width": width, "height": height, "pixelRatio": 1},
            "userAgent": "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 "
                         "(KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36",
        })
    driver = webdriver.Chrome(options=opt)
    wait = WebDriverWait(driver, 45)
    try:
        if not mobile:
            driver.set_window_size(width, height)
        driver.get("http://127.0.0.1:8765/?year=1579")
        wait.until(lambda d: d.execute_script(
            "return document.querySelector('#bigYear')?.textContent==='1579' &&"
            "document.querySelector('#eventCount')?.textContent.endsWith('项') &&"
            "document.querySelectorAll('#eventList .event-item').length>10"
        ))
        def js(code, *args):
            return driver.execute_script("return " + code, *args)
        def state():
            return js("""(() => {
              const box=id=>{const r=document.getElementById(id).getBoundingClientRect();
                return {x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),
                  right:Math.round(r.right),bottom:Math.round(r.bottom)};};
              return {viewport:{w:innerWidth,h:innerHeight},sidebarClosed:document.getElementById('workspace').classList.contains('sidebar-collapsed'),
                dossierClosed:document.getElementById('workspace').classList.contains('dossier-collapsed'),
                menu:box('mobileEventsToggle'),sidebar:box('sidebar'),dossier:box('dossier'),
                map:box('map'),timeline:box('timeYear'),timePanel:box('yearRange'),
                timeCard:box('bigYear'),layers:box('mapLayerSwitch'),
                eventCount:document.querySelectorAll('#eventList .event-item').length,
                zoom:window.atlasReadViewport().zoom};})()""")
        initial = state()
        print(label, "INITIAL", json.dumps(initial, ensure_ascii=False), flush=True)
        if mobile:
            assert initial["sidebarClosed"], "A full-width mobile sidebar covers map at entry"
            assert initial["dossierClosed"], "A mobile dossier covers map at entry"
            assert driver.find_element(By.ID, "mobileEventsToggle").is_displayed()
            menu = driver.find_element(By.ID, "mobileEventsToggle")
            assert menu.get_attribute("aria-expanded") == "false"
            driver.save_screenshot(str(OUT / f"{label}-map-first.png"))
            menu.click()
            assert driver.find_element(By.ID, "mobileEventsToggle").get_attribute("aria-expanded") == "true"
            assert not js("document.querySelector('#workspace').classList.contains('sidebar-collapsed')")
            # Wait for the drawer's real CSS transform, not just its instant ARIA flag.
            wait.until(lambda d: d.execute_script("""
                return document.querySelector('#sidebar').getBoundingClientRect().left >= -1
            """))
            driver.save_screenshot(str(OUT / f"{label}-event-drawer.png"))
        else:
            assert not driver.find_element(By.ID, "mobileEventsToggle").is_displayed()
            assert not initial["sidebarClosed"]
            driver.save_screenshot(str(OUT / f"{label}-map-first.png"))
        # Single click is still "read the story", not surprise pan/zoom.
        selected = driver.find_element(By.CSS_SELECTOR, "#eventList .event-item")
        event_id = selected.get_attribute("data-eid")
        before = js("window.atlasReadViewport()")
        selected.location_once_scrolled_into_view
        print(label, "PRECLICK", json.dumps(js("""(() => {
            const e=document.querySelector('#eventList .event-item');
            const a=e.getBoundingClientRect(), b=document.querySelector('#sidebar').getBoundingClientRect(),
                c=document.querySelector('.sidebar-main').getBoundingClientRect();
            return {selected:{x:a.x,y:a.y,w:a.width,h:a.height},sidebar:{x:b.x,y:b.y,w:b.width,h:b.height},
              scroll:{x:c.x,y:c.y,w:c.width,h:c.height,scrollTop:document.querySelector('.sidebar-main').scrollTop},
              style:{display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility},
              front:document.elementFromPoint(a.x+a.width/2,a.y+a.height/2)?.id || document.elementFromPoint(a.x+a.width/2,a.y+a.height/2)?.className};
        })()"""),ensure_ascii=False),flush=True)
        selected.click()
        wait.until(lambda d: d.execute_script(
            "return document.querySelector('#dossierBody .dossier-map-action button')!==null"))
        assert js("document.querySelector('#workspace').classList.contains('sidebar-collapsed')") == mobile, \
            "Mobile sidebar and dossier overlapped"
        after = js("window.atlasReadViewport()")
        assert before["zoom"] == after["zoom"], "Single-click event unexpectedly zoomed"
        locate = driver.find_element(By.CSS_SELECTOR, "#dossierBody [data-locate-event]")
        assert locate.is_enabled(), "First event in 1579 should have geographic reference"
        driver.save_screenshot(str(OUT / f"{label}-dossier.png"))
        locate.click()
        time.sleep(1.3)
        print(label, "POSTFOCUS", json.dumps(js("""(() => ({
          center:window.atlasReadViewport(),year:document.querySelector('#bigYear').textContent,
          focused:document.querySelectorAll('.atlas-target-marker, .atlas-target-aggregate').length,
          clusters:document.querySelectorAll('.atlas-aggregate').length,
          singlePins:document.querySelectorAll('.leaflet-marker-icon .map-pin').length,
          dossierClosed:document.querySelector('#workspace').classList.contains('dossier-collapsed'),
          sidebarClosed:document.querySelector('#workspace').classList.contains('sidebar-collapsed'),
          eventsChecked:document.querySelector('#mapLayerEvents').checked
        }))()"""), ensure_ascii=False), flush=True)
        wait.until(lambda d: d.execute_script("""
            return document.querySelector('.atlas-target-marker, .atlas-target-aggregate')!==null
        """))
        assert js("document.querySelector('#bigYear').textContent") == "1579"
        assert js("window.atlasReadViewport().zoom") == before["zoom"], "One-click locate modified map zoom"
        if mobile:
            assert js("document.querySelector('#workspace').classList.contains('dossier-collapsed')"), \
                "Mobile locate moved underneath a blocking right dossier"
        else:
            assert not js("document.querySelector('#workspace').classList.contains('dossier-collapsed')"), \
                "Desktop locate must not hide the dossier"
        driver.save_screenshot(str(OUT / f"{label}-located-{event_id}.png"))
        # App's top-right historical category switches must remain available.
        assert driver.find_element(By.ID, "mapLayerTerritory").is_selected()
        assert driver.find_element(By.ID, "mapLayerEvents").is_selected()
        print(label, "PASS mobile menu, drawer exclusivity, dossier CTA, map focus, unchanged year/zoom", flush=True)
    finally:
        driver.quit()


run_case("desktop-1440", 1440, 950, False)
run_case("mobile-390", 390, 844, True)
run_case("mobile-375", 375, 667, True)
print("PASS all visitor-focused browser UX checks", flush=True)
