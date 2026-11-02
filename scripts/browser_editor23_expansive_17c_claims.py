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
 goto(1600,1)  # English Crown's paper claim over Ireland, even amid resistance
 goto(1602,1)  # English factory at Bantam (trade licence, NOT Java sovereignty)
 goto(1606,2)  # First Virginia coast-charter eligibility corridor
 goto(1609,1)
 goto(1612,2)  # Surat trading permission from Mughal authority
 goto(1620,7)  # Sea-to-sea Council for New England and separate Plymouth colony
 goto(1623,8)  # St Kitts broad island visual claim; not all British-controlled
 goto(1629,3)
 goto(1651,4)  # English Hugli factory under Mughal jurisdiction
 goto(1652,4)
 goto(1664,5)  # Separate New Jersey and Delaware documentary provinces
 goto(1673,5)  # Dutch recovery: do not retain English New Jersey and Delaware sub-layers
 goto(1674,5)  # English political jurisdiction returns
 goto(1670,7)
 goto(1681,9)
 goto(1682,9)  # Penn's Delaware Lower Counties
 goto(1685,9)  # Company post at Bencoolen, separate from Mughal or Dutch sovereignty
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
 goto(1688,12)  # Separate enlarged Dominion alongside prior colonial claims
 goto(1690,8)
 goto(1698,8)  # Scottish New Caledonia at Darien and Bengal early Calcutta
 goto(1699,8)
 d.get('http://127.0.0.1:8765/?year=1599')
 wait.until(lambda _:j("return document.getElementById('bigYear')?.textContent==='1599'"))
 assert j("return document.querySelectorAll('path.atlas-17c-expansive-claim').length===0")
 assert j("return document.getElementById('eventCount').textContent!=='0项'")
 print('PASS 1599 legacy atlas unaffected')
except Exception:
 d.save_screenshot(str(out/'editor23-wide-claim-error.png'));raise
finally:d.quit()
