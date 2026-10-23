#!/usr/bin/env python3
"""Regression of original 16C interactive in-paragraph story links on 17C articles."""
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
wait=WebDriverWait(browser,45)
def js(code,*args):return browser.execute_script(code,*args)
def open_story(year,event_id,topic,minimum_links):
    browser.get('http://127.0.0.1:8765/?year='+str(year))
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",year))
    wait.until(lambda d:js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid===arguments[0])""",event_id))
    browser.find_element(By.CSS_SELECTOR,f'#eventList [data-eid="{event_id}"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.find_element(By.CSS_SELECTOR,f'#dossierBody .major-story-enter[data-story-open="{topic}"]').click()
    wait.until(lambda d:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length>=arguments[0]",minimum_links))
def click_link(target_year,target_id,lat,lng,prefix):
    selector=f'.major-story-article .story-event-link[data-story-event="{target_id}"]'
    browser.find_element(By.CSS_SELECTOR,selector).click()
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent===String(arguments[0])",target_year))
    wait.until(lambda d:js("return window.atlasStoryBridge.activeFocusId()===arguments[0]",target_id))
    wait.until(lambda d:js("""const c=window.atlasReadViewport().center;
            return Math.abs(c.lat-arguments[0])<0.5&&Math.abs(c.lng-arguments[1])<0.5""",lat,lng))
    assert js("return document.querySelector('.major-story-article')!==null"),'one click should preserve article reading'
    browser.save_screenshot(str(out/f'editor7-inline-{prefix}-{target_year}-map-pan.png'))
try:
    open_story(1642,'1640S-E029','E6-T03-LAND-1642-1698',20)
    click_link(1649,'1640S-E016',53.718,-6.349,'ireland')
    # Double click should open the true event dossier without losing a way back.
    target=browser.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="1650S-E037"]')
    browser.execute_script('arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}));',target)
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
    assert js("return document.getElementById('bigYear').textContent==='1653'")
    browser.find_element(By.CSS_SELECTOR,'[data-story-back]').click()
    wait.until(lambda d:js("return !!document.querySelector('.major-story-article[data-story-id=\"E6-T03-LAND-1642-1698\"]')"))
    browser.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
    wait.until(lambda d:js("return document.getElementById('bigYear').textContent==='1642'"))
    assert js("return document.querySelector('#dossierBody h2')?.textContent.includes('冒险家法')")
    open_story(1600,'1600S-E014','E6-T12',18)
    click_link(1622,'1620S-E009',27.07,56.458,'eic')
    click_link(1677,'1670S-E064',18.94,72.84,'eic-mumbai-mint')
    open_story(1625,'1620S-E015','E6-T07-BARBADOS',10)
    click_link(1664,'1660S-E022',17.992,-76.955,'barbados')
    click_link(1668,'1660S-E038',13.096,-59.614,'barbados-property-law')
    click_link(1672,'1670S-E006',13.096,-59.614,'barbados-debt-law')
    open_story(1672,'1670S-E007','E6-T13',12)
    click_link(1665,'1660S-E045',5.2025,-1.090278,'rac')
    open_story(1692,'E6-GLENCOE-1692','E6-T04-GLENCOE',7)
    click_link(1695,'1690S-E027',55.952,-3.189,'glencoe')
    # 16C known-good event link rendered by the same engine must still exist.
    browser.get('http://127.0.0.1:8765/?year=1572')
    wait.until(lambda d:js("return document.getElementById('bigYear')?.textContent==='1572'"))
    wait.until(lambda d:js("return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')"))
    browser.find_element(By.CSS_SELECTOR,'#eventList [data-eid="1570S-E004"]').click()
    wait.until(lambda d:js("return !!document.querySelector('#dossierBody .major-story-enter')"))
    browser.find_element(By.CSS_SELECTOR,'.major-story-enter[data-story-open="drake-panama-mule-train-raid-1572-1573"]').click()
    wait.until(lambda d:js("return document.querySelectorAll('.major-story-article .story-event-link').length>=15"))
    print("PASS 16C-equivalent: five published 17C stories, Barbados property-law jumps, EIC Bombay mint, cross-decade pan, double click and return, original 16C reader")
except Exception:
    browser.save_screenshot(str(out/'editor7-inline-story-navigation-failure.png'))
    raise
finally:
    browser.quit()
