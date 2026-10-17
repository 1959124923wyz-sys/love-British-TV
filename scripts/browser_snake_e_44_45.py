#!/usr/bin/env python3
"""Regress 44/45 entry points and approved compact atlas header/map geometry in Chromium."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
OUT=Path(__file__).resolve().parents[1]/'snake-e-44-45-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1440,950'):
    opts.add_argument(arg)
d=webdriver.Chrome(options=opts)
wait=WebDriverWait(d,45)
def js(s,*a):return d.execute_script(s,*a)
try:
    d.get('http://127.0.0.1:8765/?year=1591')
    wait.until(lambda b:b.execute_script("return document.querySelector('#bigYear')?.textContent==='1591'"))
    layout=js("""
    const stage=document.querySelector('.map-stage'),header=document.querySelector('.masthead');
    const switches=document.querySelector('#mapLayerSwitch'),card=document.querySelector('.map-year-card');
    const m=stage.getBoundingClientRect(),c=card.getBoundingClientRect(),t=switches.getBoundingClientRect();
    return {inMap:stage.contains(card),outsideMap:header.contains(switches)&&!stage.contains(switches),
      mapTop:Math.abs(c.top-m.top)<=2,mapLeft:Math.abs(c.left-m.left)<=2,
      togglesAbove:t.bottom<=m.top+2,
      noMapHint:!document.getElementById('yearArrivalMapCount'),
      noRepo:!document.body.textContent.includes('项目仓库'),
      controlsOn:document.getElementById('mapLayerTerritory').checked&&document.getElementById('mapLayerEvents').checked};
    """)
    assert all(layout.values()),layout
    # Verify identical top-left anchoring when the UI switches to its mobile layout.
    d.set_window_size(390,844)
    mobile=js("""
    const stage=document.querySelector('.map-stage').getBoundingClientRect(),
          card=document.querySelector('.map-year-card').getBoundingClientRect();
    return {top:Math.abs(card.top-stage.top)<=2,left:Math.abs(card.left-stage.left)<=2,
            withinMap:card.right<=stage.right+2};
    """)
    assert all(mobile.values()),mobile
    d.set_window_size(1440,950)
    d.find_element(By.CSS_SELECTOR,'#mapLayerEvents').click()
    assert not js("return document.getElementById('mapLayerEvents').checked")
    d.find_element(By.CSS_SELECTOR,'#mapLayerEvents').click()
    for y,eid,story in (
        (1591,'BRA1591-CAVENDISH-ILHA-GRANDE-LOOT','brazil-coast-raids-trade-conflict-1591-1595'),
        (1594,'PAC1594-HAWKINS-ATACAMES-DEFEAT','hawkins-drake-final-pacific-caribbean-1594-1596')
    ):
        d.get('http://127.0.0.1:8765/?year='+str(y))
        wait.until(lambda b:b.execute_script("return document.querySelector('#bigYear')?.textContent===arguments[0]",str(y)))
        sel='#eventList [data-eid="'+eid+'"]'
        wait.until(lambda b:b.execute_script('return !!document.querySelector(arguments[0])',sel))
        item=d.find_element(By.CSS_SELECTOR,sel)
        js("arguments[0].scrollIntoView({block:'center'})",item); item.click()
        btn='[data-story-open="'+story+'"]'
        wait.until(lambda b:b.execute_script('return !!document.querySelector(arguments[0])',btn))
        d.find_element(By.CSS_SELECTOR,btn).click()
        wait.until(lambda b:b.execute_script("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
        assert js("return document.querySelectorAll('.story-section').length")>=8
        d.save_screenshot(str(OUT/(story+'.png')))
    print('PASS 44/45: header controls outside map, year card inside upper-left, no stale new-event label; both story entry points work')
except Exception:
    d.save_screenshot(str(OUT/'failure.png'))
    raise
finally:
    d.quit()
