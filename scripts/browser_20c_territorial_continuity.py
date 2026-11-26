#!/usr/bin/env python3
"""Real desktop gate: every dated 20C territorial feature must render, not just exist in JSON."""
import json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "browser-smoke-results"
OUT.mkdir(exist_ok=True)
paths = [
    ROOT / "data/twentieth-century-territorial-areas.geojson",
    ROOT / "data/twentieth-century-territorial-islands-batch2.geojson",
    ROOT / "data/twentieth-century-territorial-local-batch3.geojson",
    ROOT / "data/twentieth-century-india-provinces-1900-1930.geojson",
    ROOT / "data/twentieth-century-india-provinces-1931-1946.geojson",
    *sorted((ROOT / "data/cshapes-20c").glob("*.geojson")),
]
features = [f for path in paths for f in json.loads(path.read_text())["features"]]
expected = {y: {f["id"] for f in features if f["properties"]["start_year"] <= y <= f["properties"]["end_year"]}
            for y in range(1900, 2000)}
assert all(expected.values()) and len(expected[1929]) >= 90
options = Options()
for flag in ("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--window-size=1780,1020"):
    options.add_argument(flag)
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 180)
def js(code, *args):
    return driver.execute_script(code, *args)
def select_year(y):
    js("""const el=document.getElementById('jumpYear');
    el.value=String(arguments[0]);el.dispatchEvent(new Event('change',{bubbles:true}));""", y)
    wait.until(lambda _: js("return Number(document.getElementById('bigYear').textContent)===arguments[0]", y))
def snapshot():
    return js("""return window.__historicOverlapHost.visibleAreaFeatures()
      .filter(r=>r.group==='nineteenthAreas').map(r=>{
        const p=r.feature.properties, el=r.layer.getElement?.();
        return {id:r.feature.id, start:p.start_year,end:p.end_year,
          svg:!!el?.isConnected, dash:el?.getAttribute('stroke-dasharray'),
          fill:Number(el?.getAttribute('fill-opacity')||0),
          clickable:el?.classList.contains('leaflet-interactive'),
          description:!!p.summary_zh, sources:(p.source_ids||[]).every(id=>!!window.__historicOverlapHost.sourceForId(id))};
      });""")
try:
    # Ordinary reader URL, no review flag; test the exact year reported by the user.
    driver.get("http://127.0.0.1:8765/?year=1929")
    wait.until(lambda _: js("""return document.getElementById('workspace')?.dataset.atlasReady==='true'
        && !!window.historicOverlapDossier && Number(document.getElementById('jumpYear').max)===1999
        && Number(document.getElementById('bigYear').textContent)===1929"""))
    assert js("return document.getElementById('mapLayerTerritory').checked")
    js("window.__historicOverlapHost.map.setView([15,5],2,{animate:false})")
    driver.save_screenshot(str(OUT / "atlas20c-1929-initial.png"))
    all_ids = {f["id"] for f in features}
    for y in range(1900, 2000):
        select_year(y)
        rows = [r for r in snapshot() if r["id"] in all_ids]
        actual = {r["id"] for r in rows}
        assert actual == expected[y], (y, "missing", sorted(expected[y]-actual), "stale", sorted(actual-expected[y]))
        assert len(rows) == len(actual), (y, "duplicate live shapes")
        bad = [r for r in rows if not (r["svg"] and r["dash"] and r["fill"] > 0 and r["clickable"]
               and r["description"] and r["sources"] and r["start"] <= y <= r["end"])]
        assert not bad, (y, "invisible/noninteractive/unsourced area", bad[:10])
        if y in (1900, 1914, 1920, 1929, 1937, 1942, 1945, 1947, 1948, 1956, 1960, 1963, 1967, 1971, 1982, 1996, 1997, 1999):
            driver.save_screenshot(str(OUT / f"atlas20c-{y}.png"))
            print("ATLAS20C_RENDERED", y, len(actual), flush=True)

    select_year(1929)
    # Verify the reader's layer switch, including restoration of every expected shape.
    driver.find_element(By.ID, "mapLayerTerritory").click()
    assert not [r for r in snapshot() if r["id"] in all_ids], "territory switch did not hide polygons"
    driver.find_element(By.ID, "mapLayerTerritory").click()
    assert {r["id"] for r in snapshot() if r["id"] in all_ids} == expected[1929]
    # Use real pointer clicks on a documented Nigerian colonial region, not a synthetic dossier call.
    if js("return document.getElementById('mapLayerEvents').checked"):
        driver.find_element(By.ID, "mapLayerEvents").click()
    js("window.__historicOverlapHost.map.setView([9,8],5,{animate:false})")
    wait.until(lambda _: js("return window.historicOverlapDossier.hitCountAt(9,8)>0"))
    ActionChains(driver).move_to_element(driver.find_element(By.ID, "map")).click().perform()
    wait.until(lambda _: js("return !!document.querySelector('#atlasHistoricOverlapPanel .atlas-18c-overlap-detail')"))
    assert "尼日利亚" in js("return document.getElementById('dossierBody').innerText")
    assert js("return !!document.querySelector('#atlasHistoricOverlapPanel .atlas-18c-overlap-detail p')")
    assert js("return !!document.querySelector('#atlasHistoricOverlapPanel .atlas-18c-overlap-sources a[href^=\"https://\"]')")
    if js("return !!window.AtlasPublicCopyGuard"):
        assert not js("return window.AtlasPublicCopyGuard.visibleWarnings()")
    driver.save_screenshot(str(OUT / "atlas20c-1929-nigeria-click.png"))
    print("PASS: all 100 years, exact visible feature IDs, dashed fills, sources, layer switch and real desktop area click.", flush=True)
except Exception:
    driver.save_screenshot(str(OUT / "atlas20c-FAILED.png"))
    print(json.dumps(driver.get_log("browser")[-35:], ensure_ascii=False), flush=True)
    raise
finally:
    driver.quit()
