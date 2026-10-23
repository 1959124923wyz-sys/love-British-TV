#!/usr/bin/env python3
"""Real desktop Chrome: 1655 Jamaica story links into 1658 Rio Nuevo, laws and 1699 resistance, 16C reader parity."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(arg)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,60)
def js(code,*args):return browser.execute_script(code,*args)
def link(event,year,lat,lng,label):
    selector=f'.major-story-article [data-story-event="{event}"]'
    wait.until(lambda d:js("return !!document.querySelector(arguments[0])",selector))
    browser.find_element(By.CSS_SELECTOR,selector).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",event))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;
     return Math.abs(c.lat-arguments[0])<0.5&&Math.abs(c.lng-arguments[1])<0.5""",lat,lng))
    assert js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T08\"]')")
    browser.save_screenshot(str(out/f'editor7-jamaica-{label}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1655')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1655'"))
    wait.until(lambda d:js('return !!document.querySelector(\'#eventList [data-eid="1650S-E018"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1650S-E018"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T08"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T08"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-section').length===14"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===21"))
    browser.save_screenshot(str(out/'editor7-jamaica-1655-article.png'))
    link('1650S-E090',1658,18.41,-77.0137,'rio-nuevo')
    link('1670S-E090',1674,17.992,-76.955,'slave-law')
    link('1690S-E091',1699,17.992,-76.955,'maroon-hunting-law')
    link('1690S-E012',1692,17.941,-76.84,'port-royal')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0")
    target=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1680S-E090"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',target)
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    assert js("return document.getElementById('bigYear').textContent==='1683'")
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T08\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear').textContent==='1655'"))
    print('PASS Jamaica: 1655 entry, 1658 battle, 1674 slave-law, 1699 pursuit statute, 1692 disaster map pan, 1683 double-open and 1655 return')
except Exception:
    browser.save_screenshot(str(out/'editor7-jamaica-navigation-error.png'))
    raise
finally:
    browser.quit()
