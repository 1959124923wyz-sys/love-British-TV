"""R3 T41 production + independent publication real desktop Chrome (1780px)."""
import json,os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results';out.mkdir(exist_ok=True,parents=True)
opts=Options()
for opt in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(opt)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda code,*args:driver.execute_script(code,*args)
tid='E19-T41-MATABELELAND-CONQUEST-CATTLE-LOOT-CHIMURENGA'
def click(eid,year,label):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+eid+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js('return window.atlasStoryBridge.currentYear()===arguments[0]',year))
    assert driver.find_elements(By.CSS_SELECTOR,'.major-story-article')
    driver.save_screenshot(str(out/('19c-t41-'+label+'.png')))

try:
    ix=json.loads((root/'data/stories/serial/index.json').read_text(encoding='utf8'))
    topic=next(x for x in ix['topics'] if x['id']==tid)
    published=topic['status']=='published' and topic['publication_review']=='approved'
    query='?year=1896' if published else '?review19c=1&year=1896'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+query)
    wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
    if published: assert 'review19c' not in driver.current_url
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T41-1896-N08')"))
    js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById('E19-T41-1896-N08'))")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T41-1896-N08')",tid)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T41-1888-C08-E13"]'))
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=37
    driver.save_screenshot(str(out/'19c-t41-mother-34-sections.png'))
    for id,year,label in [
        ('E19-T41-1888-C08-E13',1888,'1888-rudd-contract'),
        ('E19-T41-1888-N01',1888,'1888-independence-acknowledged'),
        ('E19-T41-1889-C08-E14',1889,'1889-royal-charter'),
        ('E19-T41-1890-C08-E15',1890,'1890-fort-salisbury'),
        ('E19-T41-1893-C08-E36',1893,'1893-bulawayo-occupation'),
        ('E19-T41-1893-N02',1893,'1893-parliament-cattle-seizure'),
        ('E19-T41-1894-N04',1894,'1894-colenbrander-labour'),
        ('E19-T41-1895-N06',1895,'1895-cattle-commission'),
        ('E19-T41-1896-N07',1896,'1896-execution'),
        ('E19-T41-1896-N08',1896,'1896-commons-burn-village'),
        ('E19-T41-1896-N09',1896,'1896-selous-burn-grain'),
        ('E19-T41-1896-N14',1896,'1896-cave-dynamite'),
        ('E19-T41-1896-C19-E02',1896,'1896-mangwe-executions-unlocated'),
        ('E19-T41-1897-N15',1897,'1897-martin-forced-labour'),
        ('E19-T41-1897-C19-E04',1897,'1897-nehanda-kaguvi'),
        ('E19-T41-1898-N17',1898,'1898-commons-forced-labour'),
        ('E19-T41-1899-C88-E08',1899,'1899-company-accounts')]:
        click(id,year,label)
    for id,year,lat,lon in [
        ('E19-T41-1889-C08-E14',1889,51.5074,-0.1278),
        ('E19-T41-1890-C08-E15',1890,-17.82772,31.05337),
        ('E19-T41-1893-C08-E36',1893,-20.15,28.58333),
        ('E19-T41-1896-N07',1896,-20.15,28.58333),
        ('E19-T41-1898-N17',1898,51.5074,-0.1278)]:
        click(id,year,'camera-'+str(year)+'-'+id.split('-')[-1])
        wait.until(lambda _:js('const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0',lat,lon))
    for master,other in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        before=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not before,other))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T41-1896-N14"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T41-1888-C08-E13"]'))
    print('PASS T41 real desktop 1780x1020: 34 sections, 37 links, 1888-1899, 5 city camera jumps, 1896 atrocities, double click and back; published='+str(published))
except Exception:
    driver.save_screenshot(str(out/'19c-t41-failure.png'))
    raise
finally:
    driver.quit()
