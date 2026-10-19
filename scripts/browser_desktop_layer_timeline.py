#!/usr/bin/env python3
"""Desktop-only Chromium regression for two public layers, bounded year navigation,
and 1585–86 Drake assault-location cues. The test uses actual DOM and SVG sizes.
"""
import json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "browser-smoke-results"
OUT.mkdir(exist_ok=True)
opts = Options()
for option in ("--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
               "--disable-gpu", "--window-size=1620,1040"):
    opts.add_argument(option)
driver = webdriver.Chrome(options=opts)
wait = WebDriverWait(driver, 50)


def js(code, *args):
    return driver.execute_script("return " + code, *args)


def year(y):
    js("""(() => {
      const input=document.querySelector('#jumpYear');
      input.value=arguments[0];
      input.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    })()""", str(y))
    wait.until(lambda d: js(
        "document.querySelector('#bigYear')?.textContent===arguments[0]",
        str(y)))
    wait.until(lambda d: js(
        "document.querySelector('#yearRange')?.value===arguments[0]",
        str(y)))


def set_public_layer(which, enabled):
    js("""(() => {
      const checkbox=document.getElementById(arguments[0]);
      checkbox.checked=arguments[1];
      checkbox.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    })()""", which, enabled)


try:
    driver.get("http://127.0.0.1:8765/?year=1497")
    wait.until(lambda d: js("document.querySelector('#eventCount')?.textContent!=='0项' && "
                            "document.querySelector('#map .candidate-pin')!==null"))
    assert js("document.querySelector('#prevYear').disabled"), "1497 previous-year arrow must be disabled"
    assert not js("document.querySelector('#nextYear').disabled"), "1497 next-year arrow should work"
    visible_candidates = js("document.querySelectorAll('#map .candidate-pin').length")
    assert visible_candidates >= 1, "Expected documented first-voyage candidate locations"
    before = js("window.atlasReadViewport()")
    set_public_layer("mapLayerEvents", False)
    assert js("document.querySelectorAll('#map .candidate-pin').length") == 0, (
        "Hiding events left 1497 hypothetical landing candidate markers visible")
    assert js("document.querySelectorAll('#map .atlas-voyage-hit').length") == 0, (
        "Hiding events left voyage hit targets visible")
    assert js("document.querySelector('#mapLayerTerritory').checked"), (
        "Events switch changed independent territory switch")
    assert js("window.atlasReadViewport().zoom") == before["zoom"], (
        "Layer switch changed map zoom")
    driver.save_screenshot(str(OUT / "1497-event-layer-hidden.png"))
    set_public_layer("mapLayerEvents", True)
    assert js("document.querySelectorAll('#map .candidate-pin').length") == visible_candidates, (
        "Landing candidates did not return when event layer was enabled")
    set_public_layer("mapLayerTerritory", False)
    assert js("document.querySelectorAll('#map .candidate-pin').length") == visible_candidates, (
        "Territory switch unexpectedly hid event landing candidates")
    set_public_layer("mapLayerTerritory", True)

    year(1599)
    assert not js("document.querySelector('#nextYear').disabled"), (
        "1599 can now advance to an explicitly marked seventeenth-century topic preview")
    assert not js("document.querySelector('#prevYear').disabled")
    year(1600)
    assert js("document.querySelector('#yearStartLabel').textContent") == "1600"
    assert js("document.querySelector('#yearEndLabel').textContent") == "1609"
    assert js("document.querySelector('#chapterIntro').textContent") == "年代介绍待定"
    assert js("document.querySelector('#eventCount').textContent") == "1项"
    year(1599)  # All previously published Tudor map and UI checks still apply.

    year(1586)
    assert not js("document.querySelector('#nextYear').disabled")
    assert not js("document.querySelector('#prevYear').disabled")
    recorded = json.loads(
        (ROOT / "data/tenth-land-dispossession-and-raids-1584-1589.geojson")
        .read_text(encoding="utf-8"))
    expected = [f for f in recorded["features"]
                if f["properties"]["zone_type"] == "english_crown_privateering_port_raid_schematic"
                and f["properties"]["start_year"] <= 1586 <= f["properties"]["end_year"]]
    assert expected, "The target year needs verified historical raid entries"
    wait.until(lambda d: js(
        "document.querySelectorAll('#map path.atlas-tenth-port-raid-impact').length"
    ) >= 1)
    info = js("""(() => [...document.querySelectorAll('#map path.atlas-tenth-port-raid-impact')]
      .map(el=>{
        const r=el.getBoundingClientRect();
        return {width:r.width,height:r.height,fill:el.getAttribute('fill'),
          cls:el.getAttribute('class')};
      }))()""")
    assert len(info) <= len(expected), "Extra undocumented raid footprints were rendered"
    assert all(x["width"] <= 26 and x["height"] <= 26 for x in info), (
        "A 1585–86 raid was drawn as a large screen-space affected-area ellipse: " + str(info))
    assert all(x["fill"] == "none" for x in info), (
        "A short port raid must remain a hollow point cue, not a filled damaged region")
    assert all("atlas-schematic-screen-cue" in x["cls"] for x in info)
    driver.save_screenshot(str(OUT / "1586-port-raids-point-cues.png"))
    print("PASS desktop: event/territory layer independence, candidate visibility, "
          "historical-to-preview 1599/1600 controls and small unfilled Drake port cues")
except Exception:
    driver.save_screenshot(str(OUT / "desktop-layer-timeline-error.png"))
    raise
finally:
    driver.quit()
