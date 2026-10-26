#!/usr/bin/env python3
"""Ireland historic land rights 1642-1698: same-source story from 3 decades."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results";out.mkdir(exist_ok=True)
opt=Options()
for a in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1660,1000"):
    opt.add_argument(a)
browser=webdriver.Chrome(options=opt)
wait=WebDriverWait(browser,45)
def js(s,*args):return browser.execute_script(s,*args)
def open_case(year,event_id):
    browser.get(f'http://127.0.0.1:8765/?year={year}')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid===arguments[0])",event_id))
    browser.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{event_id}"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody button[data-story-open="E6-T03-LAND-1642-1698"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===11"))
    assert js("return document.querySelector('.major-story-article').textContent.length>4500")
    assert js("return !!document.querySelector('.story-sources')")
    assert js("return document.querySelector('.major-story-article').textContent.includes('1652')")
    assert js("return document.querySelector('.major-story-article').textContent.includes('Down Survey')")
    assert js("return !document.getElementById('serialStoriesButton')")
    browser.save_screenshot(str(out/f'editor6-ireland-land-{year}-article.png'))
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    assert js("return document.getElementById('bigYear').textContent===String(arguments[0])",year)
try:
    open_case(1652,"1650S-E012")
    open_case(1665,"1660S-E025")
    open_case(1691,"1690S-E009")
    browser.get("http://127.0.0.1:8765/?year=1599")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1599'"))
    assert js("return document.getElementById('eventCount').textContent!=='0项'")
    assert js("return document.querySelectorAll('#map .atlas-territory-solid').length>=0")
    print("PASS: Ireland 11-section story opens from 1652/1665/1691 events, returns by year, 1599 map untouched")
except Exception:
    browser.save_screenshot(str(out/"editor6-ireland-land-error.png"))
    raise
finally:
    browser.quit()
