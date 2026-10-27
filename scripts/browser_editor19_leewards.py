#!/usr/bin/env python3
"""Editor19 desktop Chromium: verified Leewards Kalinago article and annual map integration."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]; out=root/"browser-smoke-results";out.mkdir(exist_ok=True)
options=Options()
for a in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1710,1020"):options.add_argument(a)
browser=webdriver.Chrome(options=options)
wait=WebDriverWait(browser,65)
def js(s,*arg):return browser.execute_script(s,*arg)
def check(year,event,term):
    browser.get(f"http://127.0.0.1:8765/?year={year}")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return !!document.querySelector('#eventList [data-eid=\"'+arguments[0]+'\"]')",event))
    browser.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{event}"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-open=\"E6-T07-LEEWARD\"]')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E6-T07-LEEWARD"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===11"))
    assert js("return document.querySelector('.major-story-article').textContent.includes(arguments[0])",term)
    assert js("return document.querySelectorAll('.major-story-article .story-event-link').length>=13")
    assert js("return document.querySelectorAll('.major-story-article .story-sources').length===1")
    browser.save_screenshot(str(out/f"editor19-leewards-{year}.png"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-open=\"E6-T07-LEEWARD\"]')"))
    print("PASS",year,event,term)
try:
    check(1626,"1620S-E017","Tegreman")
    check(1632,"1630S-E025","蒙特塞拉特")
    check(1671,"1670S-E124","1500")
    browser.get("http://127.0.0.1:8765/?year=1599")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1599'"))
    assert js("return document.getElementById('eventCount').textContent!=='0项'")
    print("PASS 1599 historical atlas baseline retained")
except Exception:
    browser.save_screenshot(str(out/"editor19-leewards-browser-error.png"))
    raise
finally:
    browser.quit()
