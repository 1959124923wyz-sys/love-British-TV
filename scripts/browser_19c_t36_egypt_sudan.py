"""19C R3 T36 real Chrome historical Egypt-Sudan atlas desktop verification."""
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
js=lambda code,*args:driver.execute_script(code,*args)
tid='E19-T36-EGYPT-SUDAN-BOMBARDMENT-CONQUEST-CONDOMINIUM'

def click(eid,year,label):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+eid+'"]'))
    js('arguments[0].scrollIntoView({block:"center"});arguments[0].click()',el)
    wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',year))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article'))>0
    driver.save_screenshot(str(out/('19c-t36-'+label+'.png')))

try:
    idx=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf8'))
    topic=next(x for x in idx['topics'] if x['id']==tid)
    published=topic['status']=='published' and topic['publication_review']=='approved'
    qs='?year=1898' if published else '?review19c=1&year=1898'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if published:assert 'review19c' not in driver.current_url
    wait.until(lambda _:js('return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById("E19-T36-1898-C09-E09")'))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T36-1898-C09-E09'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T36-1898-C09-E09')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T36-1882-C09-E04"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=33
    driver.save_screenshot(str(out/'19c-t36-mother-24-sections.png'))
    for eid,year,label in [
       ('E19-T36-1875-C09-E01',1875,'1875-suez-shares'),
       ('E19-T36-1876-C09-E19',1876,'1876-debt-harbour'),
       ('E19-T36-1882-C09-E04',1882,'1882-alexandria-bomb'),
       ('E19-T36-1882-C09-E05',1882,'1882-tel-el-kebir'),
       ('E19-T36-1885-C09-E17',1885,'1885-claims-total'),
       ('E19-T36-1897-C09-E24',1897,'1897-wadi-halfa-rail'),
       ('E19-T36-1897-C09-E25',1897,'1897-kerma-unlocated'),
       ('E19-T36-1898-C09-E07',1898,'1898-villages-shrine'),
       ('E19-T36-1898-C09-E08',1898,'1898-battle-unlocated'),
       ('E19-T36-1898-C09-E09',1898,'1898-omdurman-occupation'),
       ('E19-T36-1898-C09-E30',1898,'1898-fashoda'),
       ('E19-T36-1898-C09-E33',1898,'1898-nasir-nuer'),
       ('E19-T36-1899-C09-E11',1899,'1899-condominium'),
       ('E19-T36-1899-C09-E13',1899,'1899-battle-death-estimate')
    ]:click(eid,year,label)
    for eid,year,lat,lng in [
        ('E19-T36-1882-C09-E04',1882,31.2001,29.9187),
        ('E19-T36-1882-C09-E05',1882,30.54556,31.77806),
        ('E19-T36-1897-C09-E24',1897,21.79577,31.37129),
        ('E19-T36-1897-C09-E26',1897,19.533333,33.316667),
        ('E19-T36-1898-C09-E09',1898,15.64453,32.47773),
        ('E19-T36-1898-C09-E33',1898,8.61527778,33.0675)]:
        click(eid,year,'camera-'+eid.split('-')[-1]+'-'+str(year))
        wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0',lat,lng))
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        old=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not old,slave))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T36-1898-C09-E07"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T36-1898-C09-E09"]'))>0)
    print('PASS T36 desktop Chrome 1780x1020: 24 sections, 33 source links, 1875-1899, Alexandria/Egypt/Nile/Fashoda/Nasir, camera/layers/dblclick, published='+str(published))
except Exception:
    driver.save_screenshot(str(out/'19c-t36-failure.png'))
    raise
finally:
    driver.quit()
