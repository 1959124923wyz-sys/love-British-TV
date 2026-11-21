"""Read-only desktop smoke for archive-only 19C handoff.

Existing Atlas 1800, 1857, 1899 chronology navigation must remain usable.
The archived research files must not enter the public UI automatically.
"""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

root = Path(__file__).resolve().parents[3]
out = root / "browser-smoke-results"
out.mkdir(exist_ok=True)
options = Options()
for flag in ("--headless=new", "--disable-gpu", "--no-sandbox",
             "--disable-dev-shm-usage", "--window-size=1780,1020"):
    options.add_argument(flag)
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 100)
def script(s, *args):
    return driver.execute_script(s, *args)
try:
    driver.get(os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8765/")+"?year=1800")
    wait.until(lambda _:script("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:script("return !!window.atlasStoryBridge?.setYear"))
    for year in (1800,1857,1899):
        script("window.atlasStoryBridge.setYear(arguments[0])",year)
        wait.until(lambda _:script("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
        assert script("return !!document.querySelector('.leaflet-container')"),"Map missing"
        driver.save_screenshot(str(out/f"19c-handoff-{year}-desktop.png"))
    assert "research/19c/consolidated/" not in script(
        "return [...document.scripts].map(x=>x.src).join('|')"), "Archive loaded as public UI"
    print("PASS 19C research-only Chrome: 1800/1857/1899 still navigate and display map; archives not auto-loaded")
except Exception:
    driver.save_screenshot(str(out/"19c-handoff-failure.png"))
    raise
finally:
    driver.quit()
