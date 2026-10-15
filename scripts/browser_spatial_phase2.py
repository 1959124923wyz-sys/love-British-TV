#!/usr/bin/env python3
"""Phase II independent Chromium point-line-area chronological smoke test.

Works against local GitHub Actions checkout. Produces real browser screenshots;
a passing data audit alone is never called a complete historic GIS validation.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

OUT = Path(__file__).resolve().parents[1] / "browser-phase2-results"
OUT.mkdir(exist_ok=True)
opt = Options()
opt.add_argument("--headless=new")
opt.add_argument("--no-sandbox")
opt.add_argument("--disable-dev-shm-usage")
opt.add_argument("--window-size=1600,1000")
driver = webdriver.Chrome(options=opt)
try:
    wait = WebDriverWait(driver, 40)
    driver.get("http://127.0.0.1:8765/?year=1579")
    wait.until(lambda d: d.execute_script(
        "return document.getElementById('bigYear')?.textContent==='1579' &&"
        "document.getElementById('eventCount')?.textContent.endsWith('项') &&"
        "!document.querySelector('#eventList .loading')"))
    def count(classname):
        return driver.execute_script(
            "return document.querySelectorAll(arguments[0]).length", classname)
    def seek(year):
        driver.execute_script("""
          const t=document.getElementById('jumpYear');
          t.value=String(arguments[0]);
          t.dispatchEvent(new Event('change',{bubbles:true}));
        """, year)
        wait.until(lambda d: d.execute_script(
            "return document.getElementById('bigYear').textContent===arguments[0]",
            str(year)))
        assert not driver.find_elements("css selector", "#boundaryWarning"), \
            "App reported a map/data failure"
    def check(year, present=(), absent=()):
        seek(year)
        for rule in present:
            assert count(rule)>0, f"{year}: missing historical map layer {rule}"
        for rule in absent:
            assert count(rule)==0, f"{year}: outdated/wrong historical layer {rule}"
        driver.save_screenshot(str(OUT / f"map-{year}.png"))
        print("PASS browser year", year, "positive", present, "negative", absent)
    check(1579, present=(".atlas-voyage-hit",),
          absent=(".atlas-tenth-invasion-impact", ".atlas-trinidad-1595-impact"))
    check(1580, present=(".atlas-tenth-invasion-impact",),
          absent=(".atlas-tenth-land-policy-impact",))
    check(1584, present=(".atlas-tenth-land-policy-impact",),
          absent=(".atlas-tenth-invasion-impact",))
    check(1586, present=(".atlas-tenth-port-raid-impact", ".atlas-tenth-land-policy-impact"))
    check(1595, present=(".atlas-trinidad-1595-impact", ".atlas-nine-years-war-study",
                         ".atlas-eleventh-research-area"),
          absent=(".atlas-essex-1599-schematic",))
    # A 1595 single-year raid cannot persist to 1598. San Juan was occupied
    # temporarily in 1598, not in 1599 or across the entire island.
    check(1598, present=(".atlas-caribbean-urban-occupation", ".atlas-nine-years-war-study"),
          absent=(".atlas-trinidad-1595-impact",))
    check(1599, present=(".atlas-essex-1599-schematic",),
          absent=(".atlas-caribbean-urban-occupation",
                  ".atlas-trinidad-1595-impact"))
    # Pale historical research has independent archive IDs. A real Leaflet
    # SVG click must now expose Ellis's publication in the public dossier,
    # without claiming the Pale shape is a verified outer boundary.
    seek(1595)
    clicked = driver.execute_script("""
      const paths=[...document.querySelectorAll('.leaflet-territory-pane path')];
      const target=paths.find(el =>
        (el.getAttribute('stroke')||'').toLowerCase()==='#c7a16e');
      if(!target)return false;
      target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
      return true;
    """)
    assert clicked, "Uncertain Irish Pale research polygon missing on map"
    wait.until(lambda d: d.execute_script("""
      return document.querySelector('#dossierBody a[href*="cambridge.org/core/books/irelands-english-pale"]')!==null
    """))
    print("PASS browser Pale research map click opens independent Ellis book citation")
    # Two approved public switches. Military influence geography obeys "版图"
    # without taking down the event list or rewinding the year.
    seek(1595)
    driver.execute_script("""
      const v=document.getElementById('mapLayerTerritory');
      v.checked=false;v.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    assert count(".atlas-trinidad-1595-impact")==0, "Area remains when territory switched off"
    assert driver.execute_script("return document.getElementById('bigYear').textContent")=="1595"
    driver.execute_script("""
      const v=document.getElementById('mapLayerTerritory');
      v.checked=true;v.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    assert count(".atlas-trinidad-1595-impact")>0, "Area failed to return after toggle"
    print("PASS: historic shapes/date/toggle regressions and screenshots")
finally:
    driver.quit()
