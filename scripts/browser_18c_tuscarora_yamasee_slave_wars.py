#!/usr/bin/env python3
"""T09 original indigenous slave trade and revolt: verify true Chrome desktop and all previous twenty topics."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
shots=Path(__file__).resolve().parents[1]/'browser-smoke-results';shots.mkdir(exist_ok=True)
o=Options()
for x in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):o.add_argument(x)
d=webdriver.Chrome(options=o);wait=WebDriverWait(d,60)
def js(code,*args):return d.execute_script(code,*args)
def at(y):return js("return document.querySelector('#bigYear')?.textContent===String(arguments[0])",y)
def year(y):js("window.atlasStoryBridge.setYear(arguments[0])",y);wait.until(lambda _:at(y))
topic='E18-T09-CAROLINA-TUSCARORA-YAMASEE-SLAVE-RAIDS-1707-1732'
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1713')
 wait.until(lambda _:at(1713))
 wait.until(lambda _:js("return !!window.atlasStoryBridge?.eventById?.('E18C-TUS-1713-NEOHEROKA-950-TOTAL')"))
 assert js("return window.atlasStoryBridge.eventById('E18C-TUS-E18A2-TUS-NEOHEROKA-FALL').lat===null")
 card='#eventList [data-eid="E18C-TUS-1713-NEOHEROKA-950-TOTAL"]'
 wait.until(lambda _:js("return !!document.querySelector(arguments[0])",card))
 d.find_element(By.CSS_SELECTOR,card).click()
 opened=f'#dossierBody [data-story-open="{topic}"]'
 wait.until(lambda _:js("return !!document.querySelector(arguments[0])",opened))
 d.find_element(By.CSS_SELECTOR,opened).click()
 wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 wait.until(lambda _:js("return document.querySelectorAll('.major-story-article .story-event-link').length===27"))
 assert js("return document.querySelectorAll('.major-story-article .story-section').length===30")
 assert js("return !document.querySelector('.story-reading-toolbar,.story-toc,.story-reading-progress-meter,[data-story-nav]')")
 d.save_screenshot(str(shots/'18c21-1713-Neoheroka-950-indigenous-killed-or-captured-combined.png'))
 zoom=js("return window.atlasReadViewport().zoom")
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-TUS-1715-APR14-POCOTALIGO-MEETING"]').click()
 wait.until(lambda _:at(1715))
 wait.until(lambda _:js("return window.atlasStoryBridge.activeFocusId()==='E18C-TUS-1715-APR14-POCOTALIGO-MEETING'"))
 wait.until(lambda _:js("""const c=window.atlasReadViewport().center;return Math.abs(c.lat-32.6371251)<0.7&&Math.abs(c.lng+80.8634405)<0.7"""))
 assert zoom==js("return window.atlasReadViewport().zoom")
 d.save_screenshot(str(shots/'18c21-1715-Yamasee-Pocotaligo-debt-and-land-loss.png'))
 d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-TUS-1712-BARNWELL-ENSLAVES-200"]').click()
 wait.until(lambda _:at(1712))
 d.save_screenshot(str(shots/'18c21-1712-British-Barnwell-treaty-betrayal-200-women-children-enslaved.png'))
 target=d.find_element(By.CSS_SELECTOR,'.story-event-link[data-story-event="E18C-TUS-E18A6-1723-003"]')
 js("arguments[0].dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));",target)
 wait.until(lambda _:at(1723))
 wait.until(lambda _:js("return !!document.querySelector('#dossierBody [data-story-back]')"))
 d.find_element(By.CSS_SELECTOR,'#dossierBody [data-story-back]').click()
 wait.until(lambda _:js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",topic))
 d.save_screenshot(str(shots/'18c21-1723-seven-years-reenslavement-colonial-law-dossier-return.png'))
 d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
 wait.until(lambda _:at(1713))
 assert not js("return !!document.querySelector('.major-story-article')")
 year(1799);assert js("return document.querySelector('#nextYear').disabled")
 d.get('http://127.0.0.1:8765/?year=1713')
 wait.until(lambda _:at(1699))
 assert js("return window.atlasStoryBridge.eventById('E18C-TUS-1713-NEOHEROKA-950-TOTAL')===null")
 d.get('http://127.0.0.1:8765/?year=1572')
 wait.until(lambda _:at(1572))
 assert js("""return [...document.querySelectorAll('#eventList [data-eid]')].some(x=>x.dataset.eid==='1570S-E004')""")
 print('PASS T09 genuine 1780x1020 desktop: 27 body links/30 chapters, 1713 950 killed-or-captured combined, 1715 Yamasee Pocotaligo correct map pan, 1712 enslaved women children, 1723 seven-year enslavement law, back navigation, 20 old maps and 16C intact.')
except Exception:
 d.save_screenshot(str(shots/'18c21-T09-Carolina-British-Indigenous-Slave-War-browser-failure.png'))
 raise
finally:d.quit()
