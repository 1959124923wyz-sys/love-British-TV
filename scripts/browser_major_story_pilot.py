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
        wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article .story-section:nth-of-type(8)')"))
    except Exception:
        print("STORY DEBUG",driver.execute_script("""return {body:document.getElementById('dossierBody')?.innerText?.slice(0,600),
          year:document.getElementById('bigYear')?.textContent,
          active:!!document.querySelector('.major-story-article'),
          storyClass:document.getElementById('workspace')?.className};"""),flush=True)
        print("BROWSER CONSOLE",driver.get_log('browser'),flush=True)
        driver.save_screenshot(str(OUT/'story-load-failed.png'))
        raise
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article .story-section'))==8
    assert driver.execute_script("return document.querySelector('.major-story-article').textContent.length>3000")
    assert driver.execute_script("return document.querySelector('.story-sources') && !document.querySelector('.story-sources').open")
    driver.save_screenshot(str(OUT/"02-long-story-1580-desktop.png"))
    # Banner-free reading; short child dossier has a link, not duplicated research.
    assert driver.execute_script("return !document.querySelector('#storyStatus,.story-status')")
    assert driver.execute_script("return !document.querySelector('.milestone-dot')")
    def click_story_event(event_id):
        link=driver.find_element(By.CSS_SELECTOR,'[data-story-event="'+event_id+'"]')
        driver.execute_script("arguments[0].scrollIntoView({block:'center'})",link)
        link.click()
    # Clicking a located event must focus without dismissing the long article.
    click_story_event('1580S-E003')
    wait.until(lambda d:d.execute_script("return window.atlasStoryBridge.activeFocusId()==='1580S-E003'"))
    assert driver.execute_script("return !!document.querySelector('.major-story-article')")
    assert driver.execute_script("return document.getElementById('bigYear').textContent==='1580'")
    assert driver.execute_script("return !document.querySelector('.story-status')")
    driver.save_screenshot(str(OUT/"03-inline-event-single-click-map-focus.png"))
    # Double click still opens the individual dossier, but not its redundant research foldout.
    link=driver.find_element(By.CSS_SELECTOR,'[data-story-event="1580S-E003"]')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",link)
    ActionChains(driver).double_click(link).perform()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-back]') && document.querySelector('#dossierBody h2')?.textContent.includes('卡里加福伊尔')"))
    assert not driver.execute_script("return !!document.querySelector('.source-details')")
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    driver.save_screenshot(str(OUT/"04-back-to-full-story.png"))
    # Cross-chapter past event goes to 1579, then a later event automatically advances to 1580.
    click_story_event('1570S-E030')
    wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent==='1579' && window.atlasStoryBridge.activeFocusId()==='1570S-E030'"))
    assert driver.execute_script("return !!document.querySelector('.major-story-article')")
    click_story_event('1580S-E003')
    wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent==='1580' && window.atlasStoryBridge.activeFocusId()==='1580S-E003'"))
    assert driver.execute_script("return !!document.querySelector('.major-story-article')")
    driver.save_screenshot(str(OUT/"05-auto-year-jump-with-map-focus.png"))
    # A future event without surveyable coordinates advances to 1584, but does not pan
    # to a guessed location. The single click opens a tiny non-modal detail card.
    click_story_event('1580S-E013')
    wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent==='1584' && !!document.querySelector('.story-event-preview')"))
    assert driver.execute_script("return !!document.querySelector('.major-story-article')")
    assert driver.execute_script("return !document.querySelector('.story-status,[data-story-year]')")
    assert driver.execute_script("return document.querySelector('.story-event-preview h3').textContent.includes('土地清查')")
    driver.save_screenshot(str(OUT/"06-unlocated-event-preview-1584.png"))
    driver.find_element(By.CSS_SELECTOR,'[data-story-preview-close]').click()
    assert driver.execute_script("return !document.querySelector('.story-event-preview')")
    # Even an event with no coordinates can be read in its standalone dossier.
    link=driver.find_element(By.CSS_SELECTOR,'[data-story-event="1580S-E013"]')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",link)
    ActionChains(driver).double_click(link).perform()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('[data-story-back]') && document.querySelector('#dossierBody h2')?.textContent.includes('土地清查')"))
    assert driver.execute_script("return !document.querySelector('.source-details')")
    driver.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    # Mobile layout: neither a third panel nor a screen-size popup.
    driver.set_window_size(410,860)
    wait.until(lambda d:d.execute_script("return window.innerWidth<680"))
    assert driver.execute_script("""const d=document.getElementById('dossier').getBoundingClientRect();
      return d.width>320 && d.width<=window.innerWidth && d.right<=window.innerWidth+4;""")
    click_story_event('1580S-E013')
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.story-event-preview')"))
    assert driver.execute_script("""const r=document.querySelector('.story-event-preview').getBoundingClientRect();
      return r.left>=0 && r.right<=innerWidth+2 && r.bottom<=innerHeight+2;""")
    driver.save_screenshot(str(OUT/"07-mobile-small-event-preview.png"))
    driver.find_element(By.CSS_SELECTOR,'[data-story-preview-close]').click()
    assert driver.execute_script("return !document.querySelector('.story-event-preview')")
    # Regression: The article's "return to original event" must never collapse
    # the dossier after readers have jumped through other years and events.
    # The opening event was 1580S-E002, not the last linked 1584 event.
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:d.execute_script("""return document.querySelector('#dossierBody h2')?.textContent.includes('佩勒姆与奥蒙德会师') &&
      document.getElementById('bigYear').textContent==='1580' &&
      !!document.querySelector('#dossierBody .major-story-entry')"""))
    assert driver.execute_script("return !document.getElementById('workspace').classList.contains('dossier-collapsed')")
    assert not driver.execute_script("return !!document.querySelector('.major-story-article')")
    driver.save_screenshot(str(OUT/"08-return-to-original-child-year-1580.png"))
    # Re-entering must capture this same child event once again.
    driver.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    wait.until(lambda d:d.execute_script("return !!document.querySelector('.major-story-article')"))
    driver.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:d.execute_script("""return document.querySelector('#dossierBody h2')?.textContent.includes('佩勒姆与奥蒙德会师')"""))
    print("PASS story pilot real browser: auto-year focus, popup, return to exact origin child and mobile")
finally:
    driver.quit()

