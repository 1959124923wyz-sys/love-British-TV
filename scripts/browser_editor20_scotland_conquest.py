#!/usr/bin/env python3
"""Editor20 desktop Chrome QA: new Scotland conquest + Dunbar POW forced-transport links."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opts=Options()
for a in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1750,1050'):opts.add_argument(a)
d=webdriver.Chrome(options=opts);w=WebDriverWait(d,65)
def js(x,*args):return d.execute_script(x,*args)
def story(year,eid,contains):
 d.get(f'http://127.0.0.1:8765/?year={year}')
 w.until(lambda _:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
 w.until(lambda _:js("return !!document.querySelector('#eventList [data-eid=\"'+arguments[0]+'\"]')",eid))
 d.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{eid}"]').click()
 w.until(lambda _:js('return !!document.querySelector("#dossierBody [data-story-open=\\"E6-T04-CONQUEST\\"]")'))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-open="E6-T04-CONQUEST"]').click()
 w.until(lambda _:js("return document.querySelectorAll('.major-story-article .story-section').length===15"))
 assert js("return document.querySelector('.major-story-article').textContent.includes(arguments[0])",contains)
 assert js("return document.querySelectorAll('.major-story-article .story-event-link').length>=12")
 assert js("return document.querySelectorAll('.major-story-article .story-sources').length===1")
 d.save_screenshot(str(out/f'editor20-scotland-{year}-{eid}.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 w.until(lambda _:js('return !!document.querySelector("#dossierBody [data-story-open=\\"E6-T04-CONQUEST\\"]")'))
 print('PASS Editor20',year,eid)
try:
 story(1650,'1650S-E123','邓巴')
 story(1650,'1650S-E125','Saugus')
 story(1651,'1650S-E129','邓迪')
 story(1652,'1650S-E131','邓诺特')
 d.get('http://127.0.0.1:8765/?year=1599')
 w.until(lambda _:js("return document.getElementById('bigYear')?.textContent==='1599'"))
 assert js("return document.getElementById('eventCount').textContent!=='0项'")
 print('PASS original sixteenth century historical map unaffected')
except Exception:
 d.save_screenshot(str(out/'editor20-scotland-error.png'))
 raise
finally:d.quit()
