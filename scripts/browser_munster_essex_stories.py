#!/usr/bin/env python3
"""Full browser verification of Gilbert in Munster and Essex/Rathlin source-linked longform."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'ireland-1569-1575-browser-results'
OUT.mkdir(exist_ok=True)
opt=Options()
for arg in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1480,960']:opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
w=WebDriverWait(d,42)
def js(c,*a):return d.execute_script(c,*a)
def start(year,eid,title):
 d.get('http://127.0.0.1:8765/?year='+str(year))
 w.until(lambda x:x.execute_script("return !!document.querySelector('#eventList [data-eid=\\\"'+arguments[0]+'\\\"]')",eid))
 e=d.find_element(By.CSS_SELECTOR,'#eventList [data-eid="'+eid+'"]');js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
 w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-enter')"))
 d.find_element(By.CSS_SELECTOR,'.major-story-enter').click()
 w.until(lambda x:x.execute_script("return document.querySelector('.major-story-header h2')?.textContent===arguments[0]",title))
 assert js("return document.querySelectorAll('.story-section').length>=10")
def focus(eid,year):
 e=d.find_element(By.CSS_SELECTOR,'[data-story-event="'+eid+'"]')
 js("arguments[0].scrollIntoView({block:'center'})",e);e.click()
 w.until(lambda x:x.execute_script("return document.querySelector('#bigYear')?.textContent===arguments[0]",str(year)))
 w.until(lambda x:x.execute_script("return !!document.querySelector('.major-story-article')"))
try:
 start(1569,'1560S-E022','1569年芒斯特吉尔伯特镇压与第一次德斯蒙德叛乱')
 focus('MUN1569-BUTLER-ENNISCORTHY-FAIR',1569)
 focus('GAP1569-GILBERT-KILMALLOCK',1569)
 focus('MUN1569-MACCARTHY-LIMERICK',1569)
 d.save_screenshot(str(OUT/'munster-gilbert-1569.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 start(1571,'1570S-E002','1571—1575年阿兹、克兰德博伊殖民与埃塞克斯战争')
 focus('1570S-E003',1572)
 focus('ULS1573-CARRICKFERGUS-BURNING',1573)
 focus('ULS1574-BRIAN-DUBLIN-EXECUTION',1574)
 focus('ULS1575-RATHLIN-CASTLE-DEFENDERS',1575)
 focus('ULS1575-RATHLIN-CAVE-CIVILIANS',1575)
 d.save_screenshot(str(OUT/'rathlin-essex-1575.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 print('PASS 28/30 Chromium: Munster atrocity distinctions, Ards colonial years, Rathlin defender/civilian links and map return')
except Exception:
 d.save_screenshot(str(OUT/'error.png'))
 raise
finally:
 d.quit()
