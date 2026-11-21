#!/usr/bin/env python3
"""5AK real desktop Chrome: original 403 source frames, dated point/outline co-visibility."""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True)
options=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    options.add_argument(flag)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,90)

def js(script,*a):return driver.execute_script(script,*a)
def audit():return js("return window.eighteenthEditor45FiveAK?.getAudit()")
def counts():
    return js("return document.querySelectorAll('path.atlas-18c-5ak-reference-outline').length")
def set_year(y):
    js("window.atlasStoryBridge.setYear(arguments[0])",y)
    wait.until(lambda _:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",y))
    wait.until(lambda _:audit() is not None and audit()['year']==y)

try:
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+'?year=1686')
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:audit() is not None and audit()['loaded'])
    assert audit()['records']==56,audit()
    assert not audit()['activeIds'] and counts()==0
    set_year(1754)
    assert 'B36-Z004' not in audit()['activeIds']
    set_year(1755)
    wait.until(lambda _: 'B36-Z004' in audit()['activeIds'] and counts()>0)
    assert counts()==audit()['visibleOutlines']
    driver.save_screenshot(str(out/'editor45-5ak-1755-acadian-source-context.png'))
    set_year(1764)
    assert 'B36-Z059' not in audit()['activeIds']
    set_year(1765)
    wait.until(lambda _: 'B36-Z059' in audit()['activeIds'])
    assert counts()==audit()['visibleOutlines']
    driver.save_screenshot(str(out/'editor45-5ak-1765-bengal-diwanis.png'))
    set_year(1780)
    wait.until(lambda _: 'B38-S-Z022' in audit()['activeIds'])
    assert counts()==audit()['visibleOutlines']
    set_year(1781)
    assert 'B38-S-Z022' not in audit()['activeIds']
    set_year(1799)
    wait.until(lambda _: 'B36-Z059' in audit()['activeIds'])
    assert audit()['areaStatisticsSupported'] is False
    assert counts()==audit()['visibleOutlines']
    driver.save_screenshot(str(out/'editor45-5ak-1799-fiscal-overviews.png'))
    set_year(1800)
    wait.until(lambda _:counts()==0)
    assert not audit()['activeIds']
    assert not js("return window.AtlasPublicCopyGuard?.visibleWarnings?.()||[]")
    print('PASS Chrome 5AK: 56 cited historic source outlines with year gates; 16C/19C clean, no metric/territory fill.')
except Exception:
    driver.save_screenshot(str(out/'editor45-5ak-failure.png'))
    raise
finally:
    driver.quit()
