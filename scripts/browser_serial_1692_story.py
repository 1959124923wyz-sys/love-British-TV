#!/usr/bin/env python3
"""Desktop regression: Glencoe story must open from decade slider, not new header UI."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/"browser-smoke-results"
out.mkdir(exist_ok=True)
opt=Options()
for a in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1660,1000"):
    opt.add_argument(a)
browser=webdriver.Chrome(options=opt)
wait=WebDriverWait(browser,45)
def run(src,*args): return browser.execute_script(src,*args)
def change_year(year):
    run("""const slider=document.getElementById('yearRange');
slider.value=arguments[0];slider.dispatchEvent(new Event('input',{bubbles:true}));""",str(year))
    wait.until(lambda d:run("return document.getElementById('bigYear').textContent===arguments[0]",str(year)))
try:
    browser.get("http://127.0.0.1:8765/?year=1692")
    wait.until(lambda d:run("return document.getElementById('bigYear')?.textContent==='1692'"))
    wait.until(lambda d:run("return !!document.querySelector('#eventList [data-eid=\"E6-GLENCOE-1692\"]')"))
    assert not run("return !!document.getElementById('serialStoriesButton')"),"Separate top story button must be removed"
    assert run("return document.getElementById('yearRange').min==='1690'")
    assert run("return document.getElementById('yearRange').max==='1699'")
    assert run("return document.getElementById('chapterIntro').textContent==='年代介绍待定'")
    assert run("return document.querySelectorAll('#eventList .event-item').length===1")
    assert run("return document.querySelectorAll('#map path.atlas-territory-solid').length===0"),"Unreviewed 17c control areas are visible"
    browser.save_screenshot(str(out/"1692-decade-slider-preview.png"))
    change_year(1691)
    assert run("return document.getElementById('eventCount').textContent==='0项'")
    change_year(1692)
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="E6-GLENCOE-1692"]').click()
    wait.until(lambda d:run("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.save_screenshot(str(out/"1692-normal-event-dossier.png"))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter').click()
    wait.until(lambda d:run("return document.querySelectorAll('.major-story-article .story-section').length===9"))
    assert run("return document.querySelector('.major-story-article').textContent.length>3000")
    assert run("return !!document.querySelector('.story-sources')")
    assert run("return document.querySelector('.major-story-article').textContent.includes('1695年6月至7月')")
    browser.save_screenshot(str(out/"1692-normal-nine-section-story.png"))
    browser.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
    wait.until(lambda d:run("return !!document.querySelector('#dossierBody .major-story-enter')"))
    # Century and decade cards work exactly as in the published Tudor atlas.
    browser.find_element(By.CSS_SELECTOR,'#centuryNav [data-century="1600"]').click()
    assert run("return !!document.querySelector('#chapterTrack [data-decade=\"1600\"]')")
    browser.find_element(By.CSS_SELECTOR,'#chapterTrack [data-decade="1600"]').click()
    wait.until(lambda d:run("return document.getElementById('bigYear').textContent==='1600'"))
    assert run("return document.getElementById('yearRange').min==='1600'")
    assert run("return document.getElementById('yearRange').max==='1609'")
    assert run("return document.getElementById('eventCount').textContent==='0项'")
    assert run("return document.getElementById('chapterIntro').textContent==='年代介绍待定'")
    # Jumping to already-published history must restore original data and boundaries.
    run("""const field=document.getElementById('jumpYear');field.value='1599';
field.dispatchEvent(new Event('change',{bubbles:true}));""")
    wait.until(lambda d:run("return document.getElementById('bigYear').textContent==='1599'"))
    assert run("return document.getElementById('eventCount').textContent!=='0项'")
    browser.save_screenshot(str(out/"1599-existing-atlas-still-works.png"))
    print("PASS: no standalone story entry; 17c decade and year slider; 1692 event-to-story; safe empty years; 1599 restoration")
except Exception:
    browser.save_screenshot(str(out/"1692-story-browser-error.png"))
    raise
finally:
    browser.quit()
