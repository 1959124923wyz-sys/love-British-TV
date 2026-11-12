#!/usr/bin/env python3
"""Reader-first 18C overlap map pilot: real 1780x1020 Chrome with source drill-down."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results'
shots.mkdir(exist_ok=True)
options=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 options.add_argument(arg)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,100)
def js(code,*args):return driver.execute_script(code,*args)
def audit():return js('return window.eighteenthReaderPilot?.getAudit?.()')
def screenshot(label):driver.save_screenshot(str(shots/('18c-reader-'+label+'.png')))
def jump(year):
 js("const input=document.querySelector('#jumpYear');input.value=String(arguments[0]);input.dispatchEvent(new Event('change',{bubbles:true}));",year)
 wait.until(lambda d:d.find_element(By.ID,'bigYear').text==str(year))
 wait.until(lambda d:audit() and audit()['year']==year)
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&reader18c=1&year=1762')
 wait.until(lambda d:audit() and audit()['ready'] and js("return document.querySelector('#jumpYear')?.max==='1799'"))
 a=audit()
 assert (a['areas'],a['archivalAreas'],a['legacyCores'])==(605,24,15),a
 assert a['activeAreas']==170,a
 assert a['legacyHidden'] and a['theme']=='control' and a['mode']=='reader',a
 assert js("return document.querySelectorAll('.atlas-18c-reader-zone').length")>0
 assert js("return document.querySelectorAll('.atlas-18c-reader-pin').length")>0
 assert js("return getComputedStyle(document.querySelector('.atlas-18c-b39-zone')).opacity")=='0'
 screenshot('1762-simplified')
 js("document.querySelector('.atlas-18c-reader-pin').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));")
 wait.until(lambda _: '这里有' in driver.find_element(By.ID,'dossierBody').text)
 assert js("return document.querySelectorAll('#dossierBody .atlas-18c-reader-result').length")>0
 screenshot('1762-overlap-chooser')
 js("document.querySelector('#dossierBody .atlas-18c-reader-result').click()")
 wait.until(lambda _: '这里发生了什么' in driver.find_element(By.ID,'dossierBody').text)
 assert '可核查的历史资料' in driver.find_element(By.ID,'dossierBody').text
 assert js("return document.querySelectorAll('#dossierBody a[href^=https]').length")>0
 screenshot('1762-history-source')
 js("document.querySelector('#dossierBody [data-reader-back]').click()")
 wait.until(lambda _: '这里有' in driver.find_element(By.ID,'dossierBody').text)
 jump(1763)
 assert audit()['activeAreas']==183,audit()
 assert audit()['mode']=='reader'
 screenshot('1763-return-and-treaty')
 js("const t=document.querySelector('#atlas18cTheme');t.value='conflict';t.dispatchEvent(new Event('change',{bubbles:true}));")
 assert audit()['theme']=='conflict'
 assert audit()['visibleGroups']>0
 screenshot('1763-conflict-only')
 js("const t=document.querySelector('#atlas18cTheme');t.value='finance';t.dispatchEvent(new Event('change',{bubbles:true}));")
 assert audit()['theme']=='finance'
 screenshot('1763-finance-only')
 js("const t=document.querySelector('#atlas18cTheme');t.value='control';t.dispatchEvent(new Event('change',{bubbles:true}));")
 js("document.querySelector('#atlas18cOriginal').click()")
 assert audit()['mode']=='raw' and not audit()['legacyHidden']
 assert js("return getComputedStyle(document.querySelector('.atlas-18c-b39-zone')).opacity")!='0'
 screenshot('1763-original-629-raw-overlays')
 js("document.querySelector('#atlas18cOriginal').click()")
 assert audit()['mode']=='reader' and audit()['legacyHidden']
 js("const s=document.querySelector('#atlas18cQuery');s.value='Bushire';s.dispatchEvent(new Event('input',{bubbles:true}));")
 js("document.querySelector('#atlas18cFind').click()")
 wait.until(lambda _: 'Bushire' in driver.find_element(By.ID,'dossierBody').text)
 assert js("return document.querySelectorAll('#dossierBody [data-reader-index]').length")>0
 screenshot('1763-source-keyword-search')
 js("document.querySelector('#dossierBody [data-reader-index]').click()")
 wait.until(lambda _: '可核查的历史资料' in driver.find_element(By.ID,'dossierBody').text)
 js("document.querySelector('#atlas18cQuery').value='';document.querySelector('#atlas18cQuery').dispatchEvent(new Event('input',{bubbles:true}));")
 js("const c=document.querySelector('#toggleControlAreas');c.checked=false;c.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleGroups']==0)
 assert audit()['legacyHidden']
 screenshot('1763-all-territories-off')
 js("const c=document.querySelector('#toggleControlAreas');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleGroups']>0)
 jump(1572)
 assert audit()['visibleGroups']==0
 screenshot('1572-old-atlas-preserved')
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:js("return document.querySelector('#jumpYear')?.max==='1799'"))
 assert not js("return Boolean(window.eighteenthReaderPilot)")
 assert not js("return document.body.classList.contains('atlas-18c-reader-enabled')")
 assert js("return document.querySelectorAll('.atlas-18c-b39-zone').length")>0
 screenshot('1762-unchanged-review-mode')
 driver.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda d:d.find_element(By.ID,'bigYear').text=='1699')
 assert not js('return Boolean(window.eighteenthReaderPilot)')
 print('PASS 18C reader pilot, 605 archive frames +15 oldest cores, 1762/1763 active counts, on-map overlap chooser, deep historical sources, filters, raw comparison, keyword search, archive controls, 1572 and default isolation.')
except Exception:
 screenshot('FAILED')
 raise
finally:
 driver.quit()
