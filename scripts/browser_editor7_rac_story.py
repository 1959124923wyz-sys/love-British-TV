#!/usr/bin/env python3
"""Desktop 1618/1665/1672/1698 Royal African Company story and fort sites."""
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
def visit(y,eid):
    browser.get(f"http://127.0.0.1:8765/?year={y}")
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",y))
    wait.until(lambda d:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid===arguments[0])",eid))
    browser.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{eid}"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===13"))
    assert js("return document.querySelector('.major-story-article').textContent.includes('皇家非洲公司')")
    assert js("return document.querySelector('.major-story-article').textContent.includes('开普海岸')")
    assert js("return document.querySelector('.major-story-article').textContent.includes('1698')")
    assert js("return !!document.querySelector('.story-sources')")
    assert js("return document.querySelector('.major-story-article').textContent.length>4000")
    browser.save_screenshot(str(out/f"editor7-rac-{y}-long-story.png"))
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    assert js("return document.getElementById('bigYear').textContent===String(arguments[0])",y)
try:
    visit(1618,'1610S-E021')
    visit(1665,'1660S-E045')
    visit(1672,'1670S-E007')
    visit(1698,'1690S-E057')
    browser.get('http://127.0.0.1:8765/?year=1665')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1665'"))
    wait.until(lambda d:js("return document.querySelectorAll('#map path.atlas-17c-evidence-cue').length>0"))
    assert js("return document.querySelectorAll('#map path.atlas-17c-local-governance').length>=1")
    assert js("return document.querySelectorAll('#map path.atlas-17c-military-impact').length>=1")
    browser.save_screenshot(str(out/'editor7-rac-1665-two-ghanan-coastal-forts.png'))
    browser.get('http://127.0.0.1:8765/?year=1599')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1599'"))
    assert js("return document.getElementById('eventCount').textContent!=='0项'")
    assert not js("return !!document.getElementById('serialStoriesButton')")
    print('PASS E6-T13: 4 decade entry points, 13 public sections, returns to event, 1665 Ghana fort cues, 1599 preserved')
except Exception:
    browser.save_screenshot(str(out/'editor7-rac-browser-failure.png'))
    raise
finally:
    browser.quit()
