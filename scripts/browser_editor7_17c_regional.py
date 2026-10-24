#!/usr/bin/env python3
"""Desktop test: historical geography envelopes are actually visible and dated."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(arg)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,50)
def js(s,*args):return browser.execute_script(s,*args)
def year(y):
    browser.get('http://127.0.0.1:8765/?year='+str(y))
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",y))
    if y>=1600: wait.until(lambda d:js("return document.querySelectorAll('#map .atlas-17c-evidence-cue').length>0"))
def count(cls):
    return js("return document.querySelectorAll('#map path.'+arguments[0]).length",cls)
def assert_shapes(n_area,n_link):
    wait.until(lambda d:count('atlas-17c-regional-area')==n_area and count('atlas-17c-regional-link')==n_link)
    if js("return window.atlasReadViewport().zoom<5"):
        assert count('atlas-17c-regional-zoom-hint')==n_area,"low-zoom province/battle study must remain visible as fixed screen circle"
    assert js("return [...document.querySelectorAll('#map path.atlas-17c-regional-area')].every(el=>el.getAttribute('stroke-dasharray')!==null||el.style.strokeDasharray!=='')"),'area should be dashed'
try:
    year(1609)
    assert_shapes(1,0)
    year(1613)
    assert_shapes(1,1)
    browser.save_screenshot(str(out/'editor7-regional-1613-ulster-corporate.png'))
    year(1616)
    assert_shapes(0,1)
    year(1622)
    assert_shapes(1,1)
    browser.save_screenshot(str(out/'editor7-regional-1622-persian-hormuz-qeshm.png'))
    year(1629)
    assert_shapes(1,0) # Acadia: two different Port-Royal archaeological sites, NOT sovereignty
    year(1635)
    assert_shapes(1,0)
    year(1649)
    assert_shapes(1,0)
    year(1650)
    assert_shapes(1,0)
    browser.save_screenshot(str(out/'editor7-regional-1650-irish-resistance.png'))
    year(1653)
    assert_shapes(3,0)
    assert count('atlas-17c-evidence-cue')>=2
    browser.save_screenshot(str(out/'editor7-regional-1653-three-county-survey-studies.png'))
    # Event layer and geography layer remain independent.
    js("""let x=document.getElementById('mapLayerEvents');x.checked=false;
          x.dispatchEvent(new Event('change',{bubbles:true}));""")
    assert_shapes(3,0)
    js("""let x=document.getElementById('mapLayerTerritory');x.checked=false;
          x.dispatchEvent(new Event('change',{bubbles:true}));""")
    assert_shapes(0,0)
    year(1658)
    assert_shapes(1,1) # one sourced Jamaica Rio Nuevo 1658 reader frame AND an unrelated evidenced Bengal trade line; no trade area polygon
    year(1690)
    assert_shapes(3,1) # Acadia: Phips Port-Royal transient raid reader box
    browser.save_screenshot(str(out/'editor7-regional-1690-boyne-battle.png'))
    year(1691)
    assert_shapes(1,0)
    year(1692)
    assert_shapes(0,0)
    year(1696)
    assert_shapes(1,0) # Acadia: dated Church raid Beaubassin, not ongoing occupation
    year(1599)
    assert count('atlas-17c-regional-area')==0
    assert js("return document.getElementById('eventCount').textContent!=='0项'")
    print('PASS: 1609/1613/1616/1622/1635/1649/1650/1653/1658/1690/1691 dashed-study year gates, independent map switches, 1599 retained')
except Exception:
    browser.save_screenshot(str(out/'editor7-regional-studies-failure.png'))
    raise
finally:
    browser.quit()
