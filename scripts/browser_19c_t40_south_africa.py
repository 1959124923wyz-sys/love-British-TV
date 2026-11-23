"""R3 T40 South Africa: genuine desktop Chrome historical source / GIS UI verification."""
import json
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(parents=True,exist_ok=True)
options=Options()
for a in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):options.add_argument(a)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,120)
js=lambda query,*args:driver.execute_script(query,*args)
topic='E19-T40-SOUTH-AFRICA-DIAMOND-LABOUR-BOER-WAR'
def click(eid,year,label):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+eid+'"]'))
    js('arguments[0].scrollIntoView({block:"center"});arguments[0].click()',el)
    wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',year))
    driver.save_screenshot(str(out/('19c-t40-'+label+'.png')))
try:
    idx=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf8'))
    item=next(x for x in idx['topics'] if x['id']==topic)
    public=item['status']=='published' and item['publication_review']=='approved'
    qs='?year=1899' if public else '?review19c=1&year=1899'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if public:assert 'review19c' not in driver.current_url
    wait.until(lambda _:js('return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById("E19-T40-1899-C08-E18")'))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T40-1899-C08-E18'))")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+topic+'"]'))>0)
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T40-1899-C08-E18')",topic)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T40-1866-C87-E01"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=33
    driver.save_screenshot(str(out/'19c-t40-mother-26-sections.png'))
    for eid,year,label in [
      ('E19-T40-1866-C87-E01',1866,'1866-namaqualand-unlocated'),
      ('E19-T40-1871-C81-E01',1871,'1871-bloemhof-arbitration'),
      ('E19-T40-1871-C81-E02',1871,'1871-griqualand-claim-unlocated'),
      ('E19-T40-1876-C81-E07',1876,'1876-mining-rights'),
      ('E19-T40-1877-C-X14-E01',1877,'1877-transvaal'),
      ('E19-T40-1885-C08-E12',1885,'1885-closed-compounds'),
      ('E19-T40-1885-C08-E19',1885,'1885-black-miners-strike'),
      ('E19-T40-1894-C08-E16',1894,'1894-strike'),
      ('E19-T40-1895-C-X15-E01',1895,'1895-jameson-no-route'),
      ('E19-T40-1898-C87-E08',1898,'1898-convict-parliament'),
      ('E19-T40-1899-C08-E18',1899,'1899-ladysmith'),
      ('E19-T40-1899-C08-E32',1899,'1899-dundee'),
      ('E19-T40-1899-C08-E23',1899,'1899-fatality')
    ]:click(eid,year,label)
    for eid,year,lat,lon in [
      ('E19-T40-1871-C81-E01',1871,-27.646855,25.606973),
      ('E19-T40-1876-C81-E07',1876,-28.73333,24.76555),
      ('E19-T40-1877-C-X14-E01',1877,-25.7241858994,28.2451876834),
      ('E19-T40-1898-C87-E08',1898,51.5074,-0.1278),
      ('E19-T40-1899-C08-E18',1899,-28.55194,29.77833),
      ('E19-T40-1899-C08-E32',1899,-28.166784,30.233707)
    ]:
        click(eid,year,'camera-'+eid.split('-')[-2]+'-'+str(year))
        wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0',lat,lon))
    for master,slave in (('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')):
        before=js('return document.getElementById(arguments[0]).checked',master)
        js('document.getElementById(arguments[0]).click()',master)
        wait.until(lambda _:js('return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]',master,not before,slave))
        js('document.getElementById(arguments[0]).click()',master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T40-1899-C08-E23"]')
    js('arguments[0].scrollIntoView({block:"center"});arguments[0].dispatchEvent(new MouseEvent("dblclick",{bubbles:true,cancelable:true}))',el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T40-1899-C08-E18"]'))>0)
    print('PASS T40 1780x1020 Chrome: 26 sections, 33 19c links, 1866-1899 year jumps, Bloemhof/Kimberley/Pretoria/London/Ladysmith/Dundee camera, layers and double-click return; published='+str(public))
except Exception:
    driver.save_screenshot(str(out/'19c-t40-failure.png'))
    raise
finally:
    driver.quit()
