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
    verify("chapter 4 not active at 1520", "document.querySelector('#chapterFour').classList.contains('active')", driver)
    verify("1520 list leaked 1529 historical event", "!document.querySelector('#eventList').textContent.includes('吉讷边区法规鼓励')", driver)
    driver.save_screenshot(str(OUT / "chapter4-1520.png"))

    def set_year(year, expected):
        driver.execute_script("""
          const slider=document.querySelector('#yearRange');
          slider.value=arguments[0];slider.dispatchEvent(new Event('input',{bubbles:true}));
        """, year)
        wait.until(lambda d: d.execute_script("return document.querySelector('#yearRange').value===arguments[0] && document.querySelector('#eventCount').textContent===arguments[1]", str(year), f"{expected}项"))
        time.sleep(0.25)

    set_year(1529, 24)
    verify("1529 final event missing", "document.querySelector('#eventList').textContent.includes('吉讷边区法规鼓励')", driver)
    driver.save_screenshot(str(OUT / "chapter4-1529.png"))
    set_year(1519, 15)
    verify("switch to third chapter failed", "document.querySelector('#chapterThree').classList.contains('active')", driver)
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
    browser = driver.get_log("browser")
    critical = [x["message"] for x in browser if re.search(r"Uncaught (TypeError|ReferenceError|SyntaxError)|Uncaught \w+Error", x["message"])]
    assert not critical, "Browser JavaScript errors: " + str(critical[:8])
    print("PASS: 1520/1529/1519 year display, 4th-chapter integrity, source-location double click and unchanged zoom")
finally:
    driver.quit()
