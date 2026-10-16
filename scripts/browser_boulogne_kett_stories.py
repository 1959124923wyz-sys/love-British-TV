#!/usr/bin/env python3
"""Chromium: Boulogne war and Kett rebellion immersive history stories."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'boulogne-kett-browser-results';OUT.mkdir(exist_ok=True)
opt=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1480,960']:opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
w=WebDriverWait(d,42)
def js(code,*args):return d.execute_script(code,*args)
def year(y):w.until(lambda x:x.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(y)))
def begin(y,eid,title):
 d.get('http://127.0.0.1:8765/?year='+str(y))
 w.until(lambda x:x.execute_script("return !!document.querySelector('#eventList [data-eid=\"'+arguments[0]+'\"]')",eid))
 e=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]')
 js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
 w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
 d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
 w.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
 assert js("return document.querySelectorAll('.story-section').length>=10")
 assert not js("return document.querySelector('.story-sources')?.open")
 assert js("return document.querySelector('.story-sources summary')?.textContent.includes('参考资料')")
def click(eid,y):
 e=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
 js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
 year(y)
 if eid in ('1540S-038','1540S-036','1540S-040'):
  w.until(lambda x:x.execute_script("return !!document.querySelector('.story-event-preview')"))
 else:
  w.until(lambda x:x.execute_script("return window.atlasStoryBridge.activeFocusId()===arguments[0]",eid))
 assert js("return !!document.querySelector('.major-story-article')")
try:
 begin(1544,'1540S-006','1544—1550年布洛涅战争：夺城、军屯与撤出')
 click('1540S-038',1545)
 click('1540S-036',1545)
 click('1540S-040',1546)
 click('1540S-031',1546)
 click('1540S-033',1549)
 click('1550S-E004',1550)
 d.save_screenshot(str(OUT/'01-boulogne-english-french-forts-and-withdrawal.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 year(1544)
 begin(1549,'GAP1549-NORFOLK-WYMONDHAM','1549年诺福克凯特起义与王室镇压')
 click('GAP1549-NORFOLK-MOUSEHOLD',1549)
 click('KET1549-BISHOPS-BRIDGE',1549)
 click('KET1549-PALACE-PLAIN',1549)
 click('GAP1549-KETT',1549)
 target=d.find_element(By.CSS_SELECTOR,'[data-story-event="GAP1549-NORFOLK-ROBERT-KETT-EXEC"]')
 js("arguments[0].scrollIntoView({block:'center'})",target)
 ActionChains(d).double_click(target).perform()
 w.until(lambda x:x.execute_script("return !!document.querySelector('[data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
 w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
 d.save_screenshot(str(OUT/'02-kett-1549-city-and-royal-executions.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 year(1549)
 print('PASS Boulogne/Kett article focus: years, city/fort French actors, Kett domestic conflict, double click and origin return')
except Exception:
 d.save_screenshot(str(OUT/'error.png'))
 raise
finally:d.quit()
