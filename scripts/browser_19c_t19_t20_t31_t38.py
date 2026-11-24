"""Four source-reviewed India, East Africa and Cape stories: real 1780x1020 desktop Chrome, normal year links."""
import json,os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results'
screens.mkdir(exist_ok=True,parents=True)
for code,entry,year in [('T19','E19-T19-1866-B41-E01',1866),('T20','E19-T20-1849-B69-E01',1849),('T31','E19-T31-1890-C10-E15',1890),('T38','E19-T38-1894-C60-E01',1894)]:
    reg=json.loads((root/'research/19c/consolidated'/f'{code}_VERIFIED_EVENT_GIS_REGISTER.json').read_text(encoding='utf8'))
    tid=reg['story_id']
    opts=Options()
    for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
        opts.add_argument(flag)
    driver=webdriver.Chrome(options=opts)
    wait=WebDriverWait(driver,100)
    js=lambda script,*args:driver.execute_script(script,*args)
    try:
        driver.get(os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8765/')+f'?year={year}')
        wait.until(lambda _:js('return document.getElementById("workspace")?.dataset.atlasReady==="true"'))
        assert 'review19c' not in driver.current_url
        wait.until(lambda _:js("return !!window.HistoryStories?.openStory&&!!window.atlasStoryBridge?.eventById(arguments[0])",entry))
        js("window.atlasStoryBridge.openEvent(window.atlasStoryBridge.eventById(arguments[0]))",entry)
        wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-open="'+tid+'"]'))
        js("window.HistoryStories.openStory(arguments[0],false,arguments[1])",tid,entry)
        wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+entry+'"]'))
        assert len(driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event]'))>=len(reg['links'])
        driver.save_screenshot(str(screens/f'19c-{code.lower()}-article.png'))
        links=sorted(reg['links'],key=lambda l:l['year'])
        positions=sorted(set(round(i*(len(links)-1)/9) for i in range(10)))
        for pos in positions:
            l=links[pos];el=wait.until(lambda _:driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+l['id']+'"]'))
            js("arguments[0].scrollIntoView({block:'center'});arguments[0].click()",el)
            wait.until(lambda _:js("return window.atlasStoryBridge.currentYear()===arguments[0]",l['year']))
        for key,peer in [('mapLayerTerritory','toggleTerritorialFootprints'),('mapLayerEvents','toggleEvents')]:
            initial=js("return document.getElementById(arguments[0]).checked",key)
            js("document.getElementById(arguments[0]).click()",key)
            wait.until(lambda _:js("return document.getElementById(arguments[0]).checked===arguments[1]&&document.getElementById(arguments[2]).checked===arguments[1]",key,not initial,peer))
            js("document.getElementById(arguments[0]).click()",key)
        el=driver.find_element(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+entry+'"]')
        js("arguments[0].scrollIntoView({block:'center'});arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}))",el)
        wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'[data-story-back]'))
        js("document.querySelector('[data-story-back]').click()")
        wait.until(lambda _:driver.find_elements(By.CSS_SELECTOR,'.major-story-article [data-story-event="'+entry+'"]'))
        driver.save_screenshot(str(screens/f'19c-{code.lower()}-return.png'))
        print('PASS',code,len(reg['links']),'links, ten jumps, two layers, double-click/return')
    except Exception:
        driver.save_screenshot(str(screens/f'19c-{code.lower()}-failed.png'))
        raise
    finally:
        driver.quit()
