#!/usr/bin/env python3
"""Real Chromium pilot: long story, map focus, double click dossier, return and chronology."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"story-pilot-browser-results"
OUT.mkdir(exist_ok=True)
opt=Options()
for arg in ["--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1550,950"]:
    opt.add_argument(arg)
opt.set_capability('goog:loggingPrefs', {'browser':'ALL'})
driver=webdriver.Chrome(options=opt)
wait=WebDriverWait(driver,45)
try:
    driver.get("http://127.0.0.1:8765/?year=1580")
    wait.until(lambda d:d.execute_script("""return document.querySelector('#bigYear')?.textContent==='1580' &&
      document.querySelector('#eventList .event-item[data-eid="1580S-E002"]') &&
      window.HistoryStories?.eventLinkMarkup?.({id:'1580S-E002'},'event').length>20"""))
    item=driver.find_element(By.CSS_SELECTOR,'#eventList .event-item[data-eid="1580S-E002"]')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",item)
    item.click()
    wait.until(lambda d: d.execute_script("return !!document.querySelector('.major-story-entry .major-story-enter')"))
    assert driver.execute_script("return document.getElementById('bigYear').textContent==='1580'")
    driver.save_screenshot(str(OUT/"01-short-event-and-story-entry.png"))
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    try:
        wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article .story-section:nth-of-type(9)')"))
    except Exception:
        print("STORY DEBUG",driver.execute_script("""return {body:document.getElementById('dossierBody')?.innerText?.slice(0,600),
          year:document.getElementById('bigYear')?.textContent,
          active:!!document.querySelector('.major-story-article'),
          storyClass:document.getElementById('workspace')?.className};"""),flush=True)
        print("BROWSER CONSOLE",driver.get_log('browser'),flush=True)
        driver.save_screenshot(str(OUT/'story-load-failed.png'))
        raise
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article .story-section'))==9
    assert driver.execute_script("return document.querySelector('.major-story-article').textContent.length>3000")
    assert driver.execute_script("return document.querySelector('.story-sources') && !document.querySelector('.story-sources').open")
    driver.save_screenshot(str(OUT/"02-long-story-1580-desktop.png"))
    # A single click must focus the existing event, without replacing the long-form article.
    link=driver.find_element(By.CSS_SELECTOR,'[data-story-event="1580S-E003"]')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",link)
    link.click()
    wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()==='1580S-E003'"))
    assert driver.execute_script("return !!document.querySelector('.major-story-article')")
    assert driver.execute_script("return document.getElementById('bigYear').textContent==='1580'")
    driver.save_screenshot(str(OUT/"03-inline-event-single-click-map-focus.png"))
    # Double click opens an event dossier and adds a return-to-article control.
    link=driver.find_element(By.CSS_SELECTOR,'[data-story-event="1580S-E003"]')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",link)
    ActionChains(driver).double_click(link).perform()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-back]') && document.querySelector('#dossierBody h2')?.textContent.includes('卡里加福伊尔')"))
    assert not driver.execute_script("return !!document.querySelector('.major-story-article')")
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    driver.save_screenshot(str(OUT/"04-return-to-story.png"))
    # Future events never appear on the 1580 map without explicit year change.
    future=driver.find_element(By.CSS_SELECTOR,'[data-story-event="1580S-E013"]')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",future)
    future.click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-year=\"1580S-E013\"]')"))
    assert driver.execute_script("return document.getElementById('bigYear').textContent==='1580'")
    driver.find_element(By.CSS_SELECTOR,'[data-story-year="1580S-E013"]').click()
    wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent==='1584'"))
    assert driver.execute_script("return !!document.querySelector('.major-story-article')")
    driver.save_screenshot(str(OUT/"05-explicit-year-jump-keeps-story.png"))
    # Responsive: article remains inside existing drawer, no third overlay or yellow dots.
    driver.set_window_size(410,860)
    wait.until(lambda d:d.execute_script("return window.innerWidth<680"))
    assert driver.execute_script("""const d=document.getElementById('dossier').getBoundingClientRect();
      return d.width>320 && d.width<=window.innerWidth && d.right<=window.innerWidth+4;""")
    assert driver.execute_script("return document.querySelectorAll('.milestone-dot').length===0")
    driver.save_screenshot(str(OUT/"06-story-on-mobile.png"))
    print("PASS story pilot real browser: single focus, double detail, return, chronology, mobile")
finally:
    driver.quit()

