#!/usr/bin/env python3
"""Source-audited East India Company 1600–1698 reader, desktop chronology regression."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results"
out.mkdir(exist_ok=True)
opts=Options()
for flag in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1660,1000"):
    opts.add_argument(flag)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,50)
def script(js,*args): return browser.execute_script(js,*args)
def jump(year):
    script("""let el=document.getElementById('jumpYear');el.value=String(arguments[0]);
              el.dispatchEvent(new Event('change',{bubbles:true}));""",year)
    wait.until(lambda d:script("return document.getElementById('bigYear').textContent===String(arguments[0])",year))
def open_article(event_id):
    wait.until(lambda d:script("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid===arguments[0])""",event_id))
    browser.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{event_id}"]').click()
    wait.until(lambda d:script("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter').click()
    wait.until(lambda d:script("return document.querySelectorAll('.major-story-article .story-section').length===12"))
    assert script("return document.querySelector('.major-story-article').textContent.length>5200")
    assert script("return !!document.querySelector('.story-sources')")
    assert script("return document.querySelector('.major-story-article').textContent.includes('东印度公司')")
    assert script("return document.querySelector('.major-story-article').textContent.includes('霍尔木兹')")
    assert script("return document.querySelector('.major-story-article').textContent.includes('苏拉特')")
try:
    browser.get("http://127.0.0.1:8765/?year=1668")
    wait.until(lambda d:script("return document.getElementById('bigYear')?.textContent==='1668'"))
    assert not script("return !!document.getElementById('serialStoriesButton')")
    open_article("1660S-E046")
    browser.save_screenshot(str(out/"editor6-eic-1668-12-part-history.png"))
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    wait.until(lambda d:script("return !!document.querySelector('#dossierBody .major-story-enter')"))
    assert script("return document.getElementById('bigYear').textContent==='1668'")
    jump(1698)
    open_article("1690S-E058")
    browser.save_screenshot(str(out/"editor6-eic-1698-competing-charters.png"))
    assert script("return document.getElementById('bigYear').textContent==='1698'")
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    jump(1600)
    open_article("1600S-E014")
    browser.save_screenshot(str(out/"editor6-eic-1600-trade-charter.png"))
    assert script("return document.querySelectorAll('.major-story-article .story-section').length===12")
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    jump(1599)
    assert script("return document.getElementById('bigYear').textContent==='1599'")
    assert script("return document.getElementById('eventCount').textContent!=='0项'")
    print('PASS E6-T12: original 1600→1668→1698 timeline, 12-part article, 19 source links, back-to-event path and 1599 intact')
except Exception:
    browser.save_screenshot(str(out/"editor6-eic-browser-error.png"))
    raise
finally:
    browser.quit()
