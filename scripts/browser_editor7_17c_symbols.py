#!/usr/bin/env python3
"""Desktop: 17c impact-symbol presence, source periods and layer-independence."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results";out.mkdir(exist_ok=True)
opts=Options()
for flag in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1660,1000"):
    opts.add_argument(flag)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,50)
def js(code,*args):return browser.execute_script(code,*args)
def load_year(y):
    browser.get('http://127.0.0.1:8765/?year='+str(y))
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",y))
    wait.until(lambda d:js("return document.querySelectorAll('#map path.atlas-17c-evidence-cue').length>0"))
def count(kind):
    return js("return document.querySelectorAll('#map path.atlas-17c-'+arguments[0]).length",kind)
def evidence(kind):
    return js("return document.querySelectorAll('#map path.atlas-17c-'+arguments[0]+'').length",kind)
def toggle_layer(id,checked):
    js("""let x=document.getElementById(arguments[0]);x.checked=arguments[1];
      x.dispatchEvent(new Event('change',{bubbles:true}));""",id,checked)
try:
    load_year(1613)
    assert evidence('economic-network')>=3, "company's Asian trade sites not on map"
    assert evidence('land-dispossession')==0, "future Ireland confiscation shown in 1613"
    browser.save_screenshot(str(out/'editor7-1613-eic-asian-commercial-cues.png'))

    load_year(1622)
    assert evidence('military-impact')>=1,"Hormuz Safavid-EIC campaign missing"
    browser.save_screenshot(str(out/'editor7-1622-hormuz-contested-company-war.png'))

    load_year(1642)
    assert evidence('land-dispossession')==1,"1642 Irish land financing not shown"
    load_year(1653)
    assert evidence('land-dispossession')>=2,"Dublin and Connacht property-transplantation evidence missing"
    assert evidence('economic-network')>=1,"trade network must coexist independently with land-dispossession"
    browser.save_screenshot(str(out/'editor7-1653-ireland-confiscation-connacht.png'))
    toggle_layer('mapLayerEvents',False)
    assert evidence('land-dispossession')>=2,"territorial/land policy cues incorrectly depend on events layer"
    toggle_layer('mapLayerTerritory',False)
    assert evidence('land-dispossession')==0,"land cues must disappear with territory off"
    toggle_layer('mapLayerTerritory',True)
    wait.until(lambda d:evidence('land-dispossession')>=2)

    load_year(1660)
    assert evidence('land-dispossession')==0,"1650s transplantation must not appear as an active 1660 policy"
    load_year(1665)
    assert evidence('land-dispossession')==1,"Restoration property settlement is hidden or duplicated"
    assert evidence('local-governance')>=1,"Madras corporate core absent"
    browser.save_screenshot(str(out/'editor7-1665-ireland-restoration-property.png'))

    load_year(1691)
    assert evidence('land-dispossession')==1,"Limerick property-right promise missing"
    assert evidence('military-impact')>=2,"Williamite war site cues missing"
    assert not js("return !!document.getElementById('serialStoriesButton')"),"do not add independent story controls"
    browser.save_screenshot(str(out/'editor7-1691-limerick-treaty-and-war.png'))

    load_year(1698)
    assert evidence('land-dispossession')==1,"1695–97 statute consequences absent"
    assert evidence('economic-network')>=1 or evidence('local-governance')>=1
    print("PASS: 1613 EIC sites; 1622 contested warfare; 1642 and 1653 Irish land policies; 1660 policy gap; 1665 restoration; 1691 treaty; 1698 religious limits; map toggles")
except Exception:
    browser.save_screenshot(str(out/'editor7-17c-symbol-check-error.png'))
    raise
finally:
    browser.quit()
