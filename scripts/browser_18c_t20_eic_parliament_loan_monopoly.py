#!/usr/bin/env python3
"""1780x1020 desktop Chromium T20 1773 Company rescue, 1748 pepper, 1784 parliamentary supervision."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
options=Options()
for flag in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'): options.add_argument(flag)
d=webdriver.Chrome(options=options);wait=WebDriverWait(d,60)
def js(s,*args):return d.execute_script(s,*args)
def year(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
story='E18-T20-EIC-PARLIAMENT-LOAN-MONOPOLY-1702-1793'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1773')
 wait.until(lambda x:year(1773))
 wait.until(lambda x:js("return !!window.atlasStoryBridge?.eventById?.('E18C-T20-1773-LOAN')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-T20-1748-PEPPER').lat===null")
 assert js("return window.atlasStoryBridge.eventById('E18C-T20-1773-LOAN').lat===51.50853")
 row='#eventList [data-eid="E18C-T20-1773-LOAN"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",row))
 d.find_element(By.CSS_SELECTOR,row).click()
 enter='#dossierBody [data-story-open="'+story+'"]'
 wait.until(lambda x:js("return !!document.querySelector(arguments[0])",enter))
 d.find_element(By.CSS_SELECTOR,enter).click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 wait.until(lambda x:js("return document.querySelectorAll('.major-story-article .story-event-link').length===29"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===29")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 d.save_screenshot(str(shots/'18c28-1773-government-1400000-loan-chapters.png'))
 for eid,y,fn in [('1709-MAY7',1709,'1709-eic-merged'),('1748-PEPPER',1748,'1748-pepper-commercial-not-annexed'),('1767-PAYMENT',1767,'1767-treasury-payment'),('1773-BOSTON',1773,'1773-boston-tea-protests'),('1784-INDIA-ACT',1784,'1784-six-government-board'),('1793-CHARTER',1793,'1793-parliament-renewal')]:
  element=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T20-'+eid+'"]')
  element.click()
  wait.until(lambda x:year(y))
  d.save_screenshot(str(shots/('18c28-'+fn+'.png')))
 target=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-T20-1773-LOAN"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",target)
 wait.until(lambda x:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda x:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
 d.save_screenshot(str(shots/'18c28-1773-loan-dossier-return.png'))
 d.get('http://127.0.0.1:8765/?year=1793')
 wait.until(lambda x:year(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-T20-1773-LOAN')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda x:year(1572))
 assert js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')")
 print('PASS 18C T20 desktop 29 chapter links, 1709/1748/1767/1773/1784/1793 jumping and 16C published regression')
except Exception:
 d.save_screenshot(str(shots/'18c28-t20-browser-failure.png'))
 raise
finally:d.quit()
