#!/usr/bin/env python3
"""Editor21 real Chromium smoke of Williamite Ireland 1689-1691 series and return navigation."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opts=Options()
for v in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1750,1050'):opts.add_argument(v)
d=webdriver.Chrome(options=opts);w=WebDriverWait(d,65)
def js(c,*args):return d.execute_script(c,*args)
def open_story(year,eid,token):
 d.get(f'http://127.0.0.1:8765/?year={year}')
 w.until(lambda _:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
 w.until(lambda _:js("return !!document.querySelector('#eventList [data-eid=\"'+arguments[0]+'\"]')",eid))
 d.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{eid}"]').click()
 w.until(lambda _:js('return !!document.querySelector("#dossierBody [data-story-open=\\"E6-T03-WILLIAMITE-WAR\\"]")'))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E6-T03-WILLIAMITE-WAR"]').click()
 w.until(lambda _:js("return document.querySelectorAll('.major-story-article .story-section').length===15"))
 assert js("return document.querySelector('.major-story-article').textContent.includes(arguments[0])",token)
 assert js("return document.querySelectorAll('.major-story-article .story-event-link').length>=20")
 assert js("return document.querySelectorAll('.major-story-article .story-sources').length===1")
 d.save_screenshot(str(out/f'editor21-williamite-{year}-{eid}.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 w.until(lambda _:js('return !!document.querySelector("#dossierBody [data-story-open=\\"E6-T03-WILLIAMITE-WAR\\"]")'))
 print('PASS Editor21',year,eid)
try:
 open_story(1689,'1680S-E127','德里')
 open_story(1690,'1690S-E001','波因河')
 open_story(1691,'1690S-E138','没收')
 open_story(1691,'1690S-E009','利默里克')
 d.get('http://127.0.0.1:8765/?year=1599')
 w.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1599'"))
 assert js("return document.getElementById('eventCount').textContent!=='0项'")
 print('PASS 1599 unchanged historical baseline')
except Exception:
 d.save_screenshot(str(out/'editor21-williamite-error.png'));raise
finally:d.quit()
