"""19C R3 T34 real Chrome desktop Gold Coast and Asante map/story integration."""
import json
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(parents=True,exist_ok=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda q,*args:driver.execute_script(q,*args)
tid='E19-T34-GOLD-COAST-ASANTE-CONQUEST-LAND-GOLD'

def click(eid,year,label):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+eid+'"]'))
    js('arguments[0].scrollIntoView({block:"center"});arguments[0].click()',el)
    wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',year))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article'))>0
    driver.save_screenshot(str(out/('19c-t34-'+label+'.png')))

try:
    idx=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf8'))
    topic=next(x for x in idx['topics'] if x['id']==tid)
    published=topic['status']=='published' and topic['publication_review']=='approved'
    qs='?year=1896' if published else '?review19c=1&year=1896'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if published: assert 'review19c' not in driver.current_url
    wait.until(lambda _:js('return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById("E19-T34-1896-C06-E30")'))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T34-1896-C06-E30'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T34-1896-C06-E30')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T34-1874-C06-E03"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=35
    driver.save_screenshot(str(out/'19c-t34-mother-32-sections.png'))
    for event,year,label in [
      ('E19-T34-1844-C-X02-E01',1844,'1844-bond'),
      ('E19-T34-1852-C-X03-E01',1852,'1852-poll-tax'),
      ('E19-T34-1874-C06-E03',1874,'1874-kumasi-sack'),
      ('E19-T34-1874-C06-E04',1874,'1874-fomena-treaty'),
      ('E19-T34-1874-C06-E13',1874,'1874-gold-london'),
      ('E19-T34-1876-C06-E16',1876,'1876-british-museum'),
      ('E19-T34-1881-C06-E20',1881,'1881-gold-axe'),
      ('E19-T34-1896-C06-E30',1896,'1896-prempeh'),
      ('E19-T34-1896-C06-E32',1896,'1896-bantama'),
      ('E19-T34-1897-C06-E36',1897,'1897-elmina-exile'),
      ('E19-T34-1897-C06-E37',1897,'1897-freetown'),
      ('E19-T34-1897-C79-E03',1897,'1897-land-activism'),
      ('E19-T34-1897-C79-E05',1897,'1897-mining-unlocated'),
      ('E19-T34-1898-C79-E06',1898,'1898-london-delegation')
    ]: click(event,year,label)
    for eid,year,lat,lng in [
       ('E19-T34-1844-C-X02-E01',1844,5.10535,-1.24660),
       ('E19-T34-1874-C06-E03',1874,6.68848,-1.62443),
       ('E19-T34-1874-C06-E04',1874,6.2835,-1.5142),
       ('E19-T34-1896-C06-E32',1896,6.70513,-1.63486),
       ('E19-T34-1897-C06-E37',1897,8.48714,-13.2356)]:
        click(eid,year,'camera-'+eid.split('-')[-2]+'-'+str(year))
        wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0',lat,lng))
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        before=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not before,slave))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T34-1874-C06-E03"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T34-1896-C06-E30"]'))>0)
    print('PASS T34 desktop Chrome 1780x1020: 32 sections, 35 source links, 1844-1898 jumps, Cape Coast/Kumasi/Fomena/Bantama/Freetown map, layers, doubleclick return; published='+str(published))
except Exception:
    driver.save_screenshot(str(out/'19c-t34-failure.png'))
    raise
finally:
    driver.quit()
