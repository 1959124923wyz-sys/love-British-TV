"""R3 T40 Southern Africa documentary mining and 1899 war, real desktop Chrome QA."""
import json,os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True,parents=True)
opts=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(flag)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda code,*args:driver.execute_script(code,*args)
tid='E19-T40-SOUTHERN-AFRICA-MINES-CONVICT-LABOUR-BOER-WAR'

def open_event(eid,year,label):
    sel='.major-story-article [data-story-event="'+eid+'"]'
    el=wait.until(lambda _: driver.find_element(By.CSS_SELECTOR,sel))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    assert driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
    driver.save_screenshot(str(out/('19c-t40-'+label+'.png')))

try:
    idx=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf8'))
    topic=next(x for x in idx['topics'] if x['id']==tid)
    published=topic['status']=='published' and topic['publication_review']=='approved'
    query='?year=1899' if published else '?review19c=1&year=1899'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if published:assert 'review19c' not in driver.current_url
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T40-1898-C87-E08')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T40-1898-C87-E08'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T40-1898-C87-E08')",tid)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T40-1871-C81-E02"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=33
    driver.save_screenshot(str(out/'19c-t40-mother-22-sections.png'))
    for eid,year,label in [
        ('E19-T40-1866-C87-E01',1866,'1866-namaqualand-convicts'),
        ('E19-T40-1871-C81-E02',1871,'1871-griqualand-annexation'),
        ('E19-T40-1876-C81-E07',1876,'1876-mine-claim-limit'),
        ('E19-T40-1877-C-X14-E01',1877,'1877-transvaal-annexation'),
        ('E19-T40-1881-C-X14-E02',1881,'1881-pretoria-convention'),
        ('E19-T40-1885-C08-E12',1885,'1885-closed-compound'),
        ('E19-T40-1885-C08-E19',1885,'1885-miner-protest'),
        ('E19-T40-1888-C87-E03',1888,'1888-convict-law'),
        ('E19-T40-1894-C08-E16',1894,'1894-miners-strike'),
        ('E19-T40-1895-C-X15-E01',1895,'1895-jameson-raid-unlocated'),
        ('E19-T40-1897-C-X15-E02',1897,'1897-raid-inquiry'),
        ('E19-T40-1898-C87-E08',1898,'1898-parliament-convicts'),
        ('E19-SAW-1899-WAR',1899,'1899-reused-war-node'),
        ('E19-T40-1899-C08-E23',1899,'1899-muthan-narrainen')]:
        open_event(eid,year,label)
    for eid,year,lat,lng in [
        ('E19-T40-1877-C-X14-E01',1877,-25.74486,28.18783),
        ('E19-T40-1885-C08-E12',1885,-28.73226,24.76232),
        ('E19-T40-1898-C87-E08',1898,51.5074,-0.1278),
        ('E19-T40-1899-C08-E23',1899,-28.55874,29.77896)]:
        open_event(eid,year,'camera-'+eid.split('-')[-1]+'-'+str(year))
        wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0',lat,lng))
    for main,slave in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        old=js("return document.getElementById(arguments[0]).checked",main)
        js("document.getElementById(arguments[0]).click()",main)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",main,not old,slave))
        js("document.getElementById(arguments[0]).click()",main)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T40-1898-C87-E08"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T40-1871-C81-E02"]'))
    print('PASS T40 desktop Chrome 1780x1020: 22 sections, 33 linked events, 1866-1899, 4 city camera anchors, layers, dblclick and back; published='+str(published))
except Exception:
    driver.save_screenshot(str(out/'19c-t40-failure.png'))
    raise
finally:
    driver.quit()
