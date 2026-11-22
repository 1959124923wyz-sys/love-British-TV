"""R3 T33 West Africa 1851–1899 desktop historical sources and map verification."""
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'browser-smoke-results'
out.mkdir(parents=True,exist_ok=True)
opts=Options()
for arg in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
    opts.add_argument(arg)
driver=webdriver.Chrome(options=opts)
wait=WebDriverWait(driver,120)
js=lambda code,*args: driver.execute_script(code,*args)
tid='E19-T33-LAGOS-NIGER-BENIN-COMPANY-CONQUEST'

def click_event(event_id,year,photo):
    el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+event_id+'"]'))
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
    wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",year))
    driver.save_screenshot(str(out/photo))

try:
    # Draft editorial review must be opened explicitly; public version uses ?year=... without review19c.
    published=os.environ.get('ATLAS_T33_PUBLISHED','0')=='1'
    qs='?year=1887' if published else '?review19c=1&year=1887'
    driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+qs)
    wait.until(lambda _:js("return document.getElementById('workspace')?.dataset.atlasReady==='true'"))
    wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById('E19-T33-1887-JAJA-DETAINED')"))
    js("window.HistoryStories.openStory(arguments[0],false,'E19-T33-1887-JAJA-DETAINED')",tid)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T33-1895-AKASSA-ATTACK"]'))>0)
    assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=39
    driver.save_screenshot(str(out/'19c-t33-mother-26-sections.png'))
    for item in [
      ('E19-T33-1851-LAGOS-ATTACK',1851,'19c-t33-1851-lagos.png'),
      ('E19-T33-1861-LAGOS-CESSION',1861,'19c-t33-1861-lagos.png'),
      ('E19-T33-1887-JAJA-DETAINED',1887,'19c-t33-1887-opobo.png'),
      ('E19-T33-1892-IJEBU-ODE',1892,'19c-t33-1892-ijebu.png'),
      ('E19-T33-1894-EBROHIMI-FALL',1894,'19c-t33-1894-unlocated.png'),
      ('E19-T33-1895-AKASSA-ATTACK',1895,'19c-t33-1895-akassa.png'),
      ('E19-T33-1897-BIDA',1897,'19c-t33-1897-bida.png'),
      ('E19-T33-1897-ILORIN',1897,'19c-t33-1897-ilorin.png'),
      ('E19-BEN-1897-LOOT',1897,'19c-t33-1897-benin.png'),
      ('E19-T33-1899-NIGER-ACT',1899,'19c-t33-1899-royal-niger.png')]:
        click_event(*item)
    for eid,year,lat,lng in [
       ('E19-T33-1887-JAJA-DETAINED',1887,4.51291,7.53826),
       ('E19-T33-1892-IJEBU-ODE',1892,6.819444,3.917311),
       ('E19-T33-1895-AKASSA-ATTACK',1895,4.32544,6.06599),
       ('E19-T33-1897-ILORIN',1897,8.4964,4.548)]:
        click_event(eid,year,'19c-t33-camera-'+str(year)+'-'+eid.split('-')[-1]+'.png')
        wait.until(lambda _:js("const c=window.atlasReadViewport().center;return Math.abs(c.lat-arguments[0])<2.0&&Math.abs(c.lng-arguments[1])<2.0",lat,lng))
    for master,slave in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
        old=js("return document.getElementById(arguments[0]).checked",master)
        js("document.getElementById(arguments[0]).click()",master)
        wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",master,not old,slave))
        js("document.getElementById(arguments[0]).click()",master)
    el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T33-1897-BIDA"]')
    js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))>0)
    js("document.querySelector('[data-story-back]').click()")
    wait.until(lambda _:len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="E19-T33-1897-BIDA"]'))>0)
    print('PASS T33 Chrome 1780x1020 1851–1899 / 39 history links / Opobo-Ijebu-Akassa-Ilorin camera / layer toggle / doubleclick return')
except Exception:
    driver.save_screenshot(str(out/'19c-t33-failure.png'))
    raise
finally:
    driver.quit()
