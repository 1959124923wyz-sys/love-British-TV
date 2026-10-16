#!/usr/bin/env python3
"""Real Chrome QA for immediately locating fresh events after a year change."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

out=Path(__file__).resolve().parents[1] / "annual-arrival-browser-evidence"
out.mkdir(exist_ok=True)
options=Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1440,950")
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,40)
try:
    driver.get("http://127.0.0.1:8765/?year=1511")
    wait.until(lambda d:d.execute_script("""
      return document.getElementById('bigYear')?.textContent==='1511' &&
             document.querySelector('#eventCount')?.textContent.endsWith('项') &&
             document.getElementById('yearArrivalSummary')?.textContent.includes('本年')
    """))
    def js(statement):
        return driver.execute_script("return "+statement)
    def year(value):
        driver.execute_script("""
          const field=document.querySelector('#yearRange');
          field.value=arguments[0];
          field.dispatchEvent(new Event('input',{bubbles:true}));
        """,value)
        wait.until(lambda d:d.execute_script(
            "return document.getElementById('bigYear').textContent===arguments[0]",str(value)))
    def hits():
        return js("""({
          singles:document.querySelectorAll('.leaflet-marker-icon .map-pin.atlas-new-this-year').length,
          clusters:document.querySelectorAll('.leaflet-marker-icon .atlas-cluster-new-this-year').length,
          labels:[...document.querySelectorAll('.atlas-cluster-new-count')].map(x=>x.textContent),
          newRows:document.querySelectorAll('#eventList .event-new-this-year').length,
          yearBanner:document.getElementById('yearArrivalSummary').textContent,
          mapHint:document.getElementById('yearArrivalMapCount').textContent
        })""")
    before=js("window.atlasReadViewport()")
    first=hits()
    assert first["newRows"]==0 and not first["singles"] and not first["clusters"],first
    assert "无新增" in first["yearBanner"],first
    driver.save_screenshot(str(out/"1511-no-new-objects.png"))
    year(1512)
    after=js("window.atlasReadViewport()")
    assert after["zoom"]==before["zoom"],"Scrubbing one year changed map zoom"
    assert after["center"]==before["center"],"Scrubbing unexpectedly recentered map"
    current=hits()
    assert current["newRows"]==5 and "5 项" in current["yearBanner"],current
    assert current["singles"]+current["clusters"]>=1,"1512 Omagh new event is invisible on the map"
    assert js("document.querySelector('#eventList .event-item')?.dataset.eid") in (
        "1512-OMAGH-ODONNELL","KILDARE1512-ROSCOMMON","KILDARE1512-DUNGANNON-ODONNELL","KILDARE1512-ATHLONE-CROSSING","KILDARE1512-BELFAST-ASSAULT"
    ),"A current-year event must be first regardless of significance ranking"
    assert js("document.querySelector('#eventList .year-arrival-tag')?.textContent")=="本年新"
    driver.save_screenshot(str(out/"1512-Omagh-highlight.png"))
    # Respect two public layer switches: hiding events hides their new emblem.
    driver.execute_script("""
      const box=document.querySelector('#mapLayerEvents');
      box.checked=false;box.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    hidden=hits()
    assert hidden["singles"]==0 and hidden["clusters"]==0,hidden
    assert hidden["newRows"]==5,"Hiding map points cannot delete historical archives"
    assert "图层已关闭" in hidden["mapHint"],hidden
    driver.execute_script("""
      const box=document.querySelector('#mapLayerEvents');
      box.checked=true;box.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    assert hits()["singles"]+hits()["clusters"]>=1
    year(1513)
    y1513=hits()
    assert y1513["newRows"]==4, y1513
    assert y1513["singles"]+y1513["clusters"]>=1, y1513
    driver.save_screenshot(str(out/"1513-multiple-new-events.png"))
    year(1511)
    rewound=hits()
    assert rewound["newRows"]==0 and rewound["singles"]==0 and rewound["clusters"]==0,rewound
    driver.save_screenshot(str(out/"1511-rewind-clears-new.png"))
    print("PASS 1511->1512 Omagh, Roscommon and Dungannon sourced arrivals; 1513 annual set; backward reset and map-layer gates",flush=True)
finally:
    driver.quit()
