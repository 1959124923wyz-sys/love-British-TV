#!/usr/bin/env python3
"""Desktop Chromium smoke for Western 1549 / West African 1553–1557 stories."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'prayerbook-guinea-browser-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1440,950']:
    opts.add_argument(arg)
d=webdriver.Chrome(options=opts)
w=WebDriverWait(d,45)
def js(code,*args):return d.execute_script(code,*args)
def open_story(year,event,title):
    d.get('http://127.0.0.1:8765/?year='+str(year))
    w.until(lambda x:x.execute_script("return !!document.querySelector('#eventList [data-eid=\\\"'+arguments[0]+'\\\"]')",event))
    e=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+event+'"]')
    js('arguments[0].scrollIntoView({block:"center"})',e)
    e.click()
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
    d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    w.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
    assert js("return document.querySelectorAll('.story-section').length>=10")
    assert js("return document.querySelector('.story-sources summary')?.textContent.includes('参考资料')")
def focus(id,year):
    e=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+id+'"]')
    js('arguments[0].scrollIntoView({block:"center"})',e)
    e.click()
    w.until(lambda x:x.execute_script("return document.querySelector('#bigYear')?.textContent===arguments[0]",str(year)))
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
try:
    open_story(1549,'GAP1549-WEST-SAMPFORD-OUTBREAK','1549年德文—康沃尔祈祷书起义与王室镇压')
    focus('PR1549-CLYST-BRIDGE',1549)
    focus('PR1549-EXETER-STTHOMAS-WELSH-EXEC',1549)
    d.save_screenshot(str(OUT/'western-prayer-book.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    open_story(1553,'1550S-E006','1553—1557年英国西非贸易与早期被奴役者押运')
    focus('GN1555-LOK-THAMES-RETURN',1555)
    focus('GN1556-TOWERSON-HARWICH-START',1556)
    focus('GN1557-TOWERSON-PORTUGUESE-FIGHT',1557)
    d.save_screenshot(str(OUT/'guinea-enslaved-return-ports.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    print('PASS: 1549 Western and 1553-1557 Guinea story interactive focus, source panel and year step')
except Exception:
    d.save_screenshot(str(OUT/'failure.png'))
    raise
finally:
    d.quit()
