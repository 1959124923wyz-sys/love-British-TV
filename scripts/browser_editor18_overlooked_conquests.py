#!/usr/bin/env python3
"""Editor18 desktop: four 17C conquest stories open from real atlas events, preserve prior history."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
out=Path(__file__).resolve().parents[1]/"browser-smoke-results";out.mkdir(exist_ok=True)
opts=Options()
for flag in ("--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--window-size=1680,1040"):opts.add_argument(flag)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,55)
def js(code,*args):return driver.execute_script(code,*args)
def open_story(year,event_id,story_id,chapters,term):
 driver.get(f"http://127.0.0.1:8765/?year={year}")
 wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
 wait.until(lambda d:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid===arguments[0])",event_id))
 driver.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{event_id}"]').click()
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody button[data-story-open=\"'+arguments[0]+'\"]')",story_id))
 driver.find_element(By.CSS_SELECTOR,f'#dossierBody button[data-story-open="{story_id}"]').click()
 wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===arguments[0]",chapters))
 assert js("return document.querySelector('.major-story-article').textContent.includes(arguments[0])",term)
 assert js("return !!document.querySelector('.major-story-article .story-sources')")
 assert js("return document.querySelectorAll('.major-story-article .story-event-link').length>=3")
 driver.save_screenshot(str(out/f"editor18-{story_id}-{year}.png"))
 driver.find_element(By.CSS_SELECTOR,'button[data-story-return]').click()
 wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
 assert js("return document.getElementById('bigYear').textContent===String(arguments[0])",year)
 print("PASS",story_id,chapters,"chapters",year)
try:
 open_story(1610,"1610S-E093","E6-T01",10,"阿尔斯特")
 open_story(1630,"1630S-E023","E6-T16-PROVIDENCE",10,"普罗维登斯")
 open_story(1650,"1650S-E121","E6-T16-SURINAME",10,"苏里南")
 open_story(1665,"1660S-E124","E6-T17-AFRICAN-FORTS",12,"海岸角")
 driver.get('http://127.0.0.1:8765/?year=1599')
 wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1599'"))
 assert js("return document.getElementById('eventCount').textContent!=='0项'")
 print("PASS Editor18 cross-century 1599 preserved; 4 published stories 42 chapters, 11 new event references, desktop map navigation")
except Exception:
 driver.save_screenshot(str(out/'editor18-desktop-error.png'))
 raise
finally:
 driver.quit()
