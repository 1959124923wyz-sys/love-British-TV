#!/usr/bin/env python3
"""Real desktop Chromium: 1609 paper claim, 1652 English occupation of Scotland, 1670 HBC, 1681 Pennsylvania, layers toggle, original 1599."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
root=Path(__file__).resolve().parents[1];out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opt=Options()
for k in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1700,1000'):opt.add_argument(k)
d=webdriver.Chrome(options=opt);wait=WebDriverWait(d,85)
def j(s,*a):return d.execute_script(s,*a)
def goto(year,required,forbidden=None):
 d.get(f'http://127.0.0.1:8765/?year={year}')
 wait.until(lambda _:j("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
 wait.until(lambda _:j("return document.querySelectorAll('path.atlas-17c-expansive-claim').length>=arguments[0]",required))
 active=j("return [...document.querySelectorAll('path.atlas-17c-expansive-claim')].length")
 assert active>=required
 if forbidden:assert j("return !document.querySelector(arguments[0])",forbidden)
 d.save_screenshot(str(out/f'editor23-wide-paper-claims-{year}.png'))
 print('PASS',year,active,'large-area SVG polygons')
try:
 goto(1609,1)
 goto(1629,3)
 goto(1652,4)
 goto(1670,7)
 goto(1681,9)
 assert j("return document.getElementById('mapLayerTerritory').checked")
 d.find_element(By.ID,'mapLayerTerritory').click()
 wait.until(lambda _:j("return document.querySelectorAll('path.atlas-17c-expansive-claim').length===0"))
 d.find_element(By.ID,'mapLayerTerritory').click()
 wait.until(lambda _:j("return document.querySelectorAll('path.atlas-17c-expansive-claim').length>=9"))
 # Leaflet SVG feature listeners open the original-source dossier, not merely a decorative fill.
 j("""const el=[...document.querySelectorAll('path.atlas-17c-expansive-claim')].find(e=>
    e._leaflet_id!==undefined)||document.querySelector('path.atlas-17c-expansive-claim');
    el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:400,clientY:400}));""")
 wait.until(lambda _:j("return !!document.querySelector('#dossierBody .zone-source-links a.source-link')"))
 assert j("return document.getElementById('dossierBody').textContent.includes('声索')")
 d.save_screenshot(str(out/'editor23-wide-colonial-source-dossier.png'))
 goto(1690,8)
 d.get('http://127.0.0.1:8765/?year=1599')
 wait.until(lambda _:j("return document.getElementById('bigYear')?.textContent==='1599'"))
 assert j("return document.querySelectorAll('path.atlas-17c-expansive-claim').length===0")
 assert j("return document.getElementById('eventCount').textContent!=='0项'")
 print('PASS 1599 legacy atlas unaffected')
except Exception:
 d.save_screenshot(str(out/'editor23-wide-claim-error.png'));raise
finally:d.quit()
