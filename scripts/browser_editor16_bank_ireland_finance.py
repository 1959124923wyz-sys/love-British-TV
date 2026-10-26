#!/usr/bin/env python3
"""Desktop 17C fiscal-credit and Ireland war/debt stories: real event map navigation."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

out=Path(__file__).resolve().parents[1]/"browser-smoke-results"
out.mkdir(exist_ok=True)
opts=Options()
for flag in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1680,1000"):
    opts.add_argument(flag)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,55)
def js(code,*args):return browser.execute_script(code,*args)
def open_story(year,event,topic,chapters,word):
    browser.get(f"http://127.0.0.1:8765/?year={year}")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid===arguments[0])",event))
    browser.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{event}"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody button[data-story-open=\"'+arguments[0]+'\"]')",topic))
    browser.find_element(By.CSS_SELECTOR,f'#dossierBody button[data-story-open="{topic}"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===arguments[0]",chapters))
    assert js("return document.querySelector('.major-story-article').textContent.includes(arguments[0])",word)
    assert js("return !!document.querySelector('.major-story-article .story-sources')")
    assert js("return document.querySelectorAll('.major-story-article .story-event-link').length>=7")
    browser.save_screenshot(str(out/f"editor16-{topic}-{year}.png"))
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    assert js("return document.getElementById('bigYear').textContent===String(arguments[0])",year)
    print("PASS",topic,year,"event",event,"chapters",chapters)
try:
    open_story(1694,"1690S-E023","E6-T15",13,"John Houblon")
    open_story(1649,"1640S-E016","E6-T02",15,"Erasmus Smith")
    # 16C old map remains unaffected after serial entries.
    browser.get("http://127.0.0.1:8765/?year=1599")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1599'"))
    assert js("return document.getElementById('eventCount').textContent!=='0项'")
    print("PASS E6-T02 & E6-T15: 13+15 chapters, 1694 & 1649 docs, dossier return, prior century preserved")
except Exception:
    browser.save_screenshot(str(out/"editor16-browser-error.png"))
    raise
finally:
    browser.quit()
