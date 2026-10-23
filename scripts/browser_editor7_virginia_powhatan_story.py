#!/usr/bin/env python3
"""Desktop Chrome: Tudor-standard Virginia-Powhatan narrative and Leaflet camera navigation."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True)
opts=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
    opts.add_argument(arg)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,60)
def js(code,*args):return browser.execute_script(code,*args)
def click_link(event,year,lat,lng,label):
    sel=f'.major-story-article [data-story-event="{event}"]'
    wait.until(lambda d:js('return !!document.querySelector(arguments[0])',sel))
    browser.find_element(By.CSS_SELECTOR,sel).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js('return window.atlasStoryBridge.activeFocusId()===arguments[0]',event))
    wait.until(lambda d:js('''const c=window.atlasReadViewport().center;
       return Math.abs(c.lat-arguments[0])<0.5&&Math.abs(c.lng-arguments[1])<0.5''',lat,lng))
    assert js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T05\"]')")
    browser.save_screenshot(str(out/f'editor7-e6t05-{label}-{year}.png'))
try:
    browser.get('http://127.0.0.1:8765/?year=1607')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1607'"))
    wait.until(lambda d:js("return !!document.querySelector('#eventList [data-eid=\"1600S-E004\"]')"))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1600S-E004"]').click()
    wait.until(lambda d:js('return !!document.querySelector(\'#dossierBody .major-story-enter[data-story-open="E6-T05"]\')'))
    browser.find_element(By.CSS_SELECTOR,'#dossierBody .major-story-enter[data-story-open="E6-T05"]').click()
    wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId==='E6-T05'"))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length===36"))
    browser.save_screenshot(str(out/'editor7-e6t05-1607-article.png'))
    click_link('1610S-E002',1610,37.024,-76.344,'kecoughtan')
    click_link('1660S-E015',1662,37.209,-76.778,'partus-law')
    click_link('1670S-E027',1677,37.27,-76.706,'middle-plantation-treaty')
    assert js("return document.querySelectorAll('#map path.atlas-territory-solid').length===0")
    element=browser.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="1670S-E022"]')
    js('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',element)
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    assert js("return document.getElementById('bigYear').textContent==='1676'")
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T05\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear').textContent==='1607'"))
    print('PASS Virginia: 1607 entry, 1610 Kecoughtan / 1662 legal slavery / 1677 Middle Plantation camera, Occaneechi double click 1676 and story return, no sovereignty polygon')
except Exception:
    browser.save_screenshot(str(out/'editor7-e6t05-navigation-error.png'))
    raise
finally:browser.quit()
