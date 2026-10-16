#!/usr/bin/env python3
"""Verify cross-chapter Calais longform and both sides of the 1522-23 Scottish war in Chromium."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'scots-calais-browser-results'
OUT.mkdir(exist_ok=True)
opt=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1480,960']:
    opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
w=WebDriverWait(d,42)
def js(q,*a):return d.execute_script(q,*a)
def year(y):w.until(lambda x:x.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(y)))
def begin(y,eid,title):
    d.get('http://127.0.0.1:8765/?year='+str(y))
    w.until(lambda x:x.execute_script("""return !!document.querySelector('#eventList [data-eid="'+arguments[0]+'"]')""",eid))
    e=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e)
    e.click()
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
    d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
    w.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
def click(eid,y):
    e=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
    js("arguments[0].scrollIntoView({block:'center'})",e)
    e.click()
    year(y)
    w.until(lambda x:x.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
    assert js("return !!document.querySelector('.major-story-article')")
try:
    begin(1523,'1523-JEDBURGH-SACK','1522—1523年英苏战争与边境焦土袭掠')
    assert js("return document.querySelectorAll('.story-section').length===9")
    click('SC1522-KELSO-RAID',1522)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===1"),'1522 Morlaix raid route should be visible, Scottish counterattack not yet'
    click('1523-FERNIEHIRST-DEMOLISHED',1523)
    click('SC1523-ALBANY-COLDSTREAM-MUSTER',1523)
    assert js("return document.querySelectorAll('#map .atlas-voyage-hit').length===1"),'1523 Coldstream→Wark Scots/French action should appear alone'
    target=d.find_element(By.CSS_SELECTOR,'[data-story-event="1523-WARK-SCOTS-FRENCH-SIEGE"]')
    js("arguments[0].scrollIntoView({block:'center'})",target)
    ActionChains(d).double_click(target).perform()
    w.until(lambda x:x.execute_script("return !!document.querySelector('[data-story-back]')"))
    d.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
    d.save_screenshot(str(OUT/'01-scotland-anglo-french-reprisal.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1523)
    w.until(lambda x:x.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('杰德堡')"))
    begin(1505,'1505-CALAIS-STAPLE-ROYAL-PAYMENTS','1497—1558年加来—吉讷英王飞地')
    assert js("return document.querySelectorAll('.story-section').length===10")
    click('1525-GUINES-COMMISSION',1525)
    # No coordinates for the legislative event; it opens an in-article locality-free popup.
    click('1525-NEWEMBRIDGE-REFORTIFICATION',1525)
    click('CAL1542-GARRISON-ACCOUNTS',1542)
    click('1550S-E018',1558)
    click('1550S-E019',1558)
    click('1500-CALAIS-ETAPLES',1500)
    d.save_screenshot(str(OUT/'02-calais-guines-cross-decade-story.png'))
    d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    year(1505)
    w.until(lambda x:x.execute_script("return document.querySelector('#dossierBody h2')?.textContent.includes('加来羊毛')"))
    d.set_window_size(410,850)
    assert js("return document.querySelectorAll('.milestone-dot').length===0")
    print('PASS 1522–23 both army actors, 1497–1558 continuous narrative, event focus, era rewinds, double-click and original child return')
except Exception:
    d.save_screenshot(str(OUT/'error.png'))
    raise
finally:d.quit()
