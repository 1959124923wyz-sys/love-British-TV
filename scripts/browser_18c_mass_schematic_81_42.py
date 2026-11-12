#!/usr/bin/env python3
"""18C batch35 desktop browser regression. No app data is changed."""
import pathlib
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=pathlib.Path(__file__).resolve().parents[1]
screen=root/'browser-smoke-results'
screen.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
wait=WebDriverWait(d,90)
def js(s,*a):return d.execute_script(s,*a)
def audit():return js('return window.eighteenthMassSpatial?.getAudit?.()')
def old():return js('return window.eighteenthSpatial?.getAudit?.()')
def set_year(y):
 js("const i=document.querySelector('#jumpYear');i.value=String(arguments[0]);i.dispatchEvent(new Event('change',{bubbles:true}));",y)
 wait.until(lambda x:x.find_element(By.CSS_SELECTOR,'#bigYear').text==str(y))
 wait.until(lambda x:audit() and audit()['year']==y)
def shot(name):d.save_screenshot(str(screen/('18c-map-35-'+name+'.png')))
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:bool(audit()) and audit()['loaded'] and bool(old()) and old()['loaded'])
 # Leaflet layers may fetch faster than the unpublished 18C chronology and year-input cap.
 # Await the actual year navigation controller before automated year changes.
 wait.until(lambda _:js("return document.querySelector('#jumpYear')?.max==='1799' && Boolean(document.querySelector('#jumpYear')?.value)"))
 a=audit()
 assert (a['zoneCount'],a['coreCount'],a['timePhases'])==(81,42,149),a
 assert old()['areaReferences']==24 and old()['documentedCityCores']==15,old()
 cases=[
 (1704,['ST_KITTS','ANTIGUA','GIBRALTAR_PENINSULA'],['QUEBEC_1763','BENGAL_DIWANI'],'1704-atlantic'),
 (1759,['GUADELOUPE','CAPE_BRETON'],['BENGAL_DIWANI','ST_LUCIA'],'1759-war'),
 (1762,['HAVANA_HARBOR','MANILA_PORT','MARTINIQUE_1762'],['QUEBEC_1763'],'1762-global-raids'),
 (1763,['QUEBEC_1763','EAST_FLORIDA','GRENADA'],['HAVANA_HARBOR','GUADELOUPE'],'1763-treaty'),
 (1765,['BENGAL_DIWANI','BIHAR_DIWANI','ORISSA_DIWANI'],['PONDICHERRY_BRITISH'],'1765-diwani'),
 (1774,['QUEBEC_1774','FALKLAND_PAPER'],['QUEBEC_1763','PORT_EGMONT'],'1774-laws-vs-posts'),
 (1779,['SAVANNAH_GARRISON','ST_LUCIA'],['GRENADA','DOMINICA'],'1779-war'),
 (1783,['GRENADA','DOMINICA','NASSAU_PORT'],['EAST_FLORIDA','WEST_FLORIDA'],'1783-treaty'),
 (1788,['NSW_CROWN_CLAIM','SYDNEY_COVE','NORFOLK_SETTLEMENT'],['PORT_EGMONT'],'1788-pacific'),
 (1791,['UPPER_CANADA','LOWER_CANADA','NS_REVISED'],['QUEBEC_1774'],'1791-canada'),
 (1796,['CEYLON_COLOMBO','CEYLON_GALLE','CORSICA_1794'],['TRINIDAD_1797'],'1796-indian-ocean'),
 (1797,['TRINIDAD_1797','CEYLON_JAFFNA'],['ELBA_1796'],'1797-caribbean'),
 (1799,['MYSORE_1799_PARTITION','SERINGAPATAM_ZONE','PENANG_ISLAND'],['CORSICA_1794'],'1799-asia'),
 ]
 for y,show,hide,name in cases:
  set_year(y)
  a=audit()
  assert all(k in a['activeZones'] for k in show),(y,'missing',show,a)
  assert all(k not in a['activeZones'] for k in hide),(y,'incorrect',hide,a)
  assert a['visibleZoneLayers']>0 and a['visibleCoreLayers']>0,(y,a)
  shot(name)
 set_year(1762)
 assert js("return document.querySelectorAll('.atlas-18c-mass-zone').length")>5
 assert js("return document.querySelectorAll('.atlas-18c-mass-core').length")>4
 js("document.querySelector('.atlas-18c-mass-core').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));")
 wait.until(lambda x:'批量动态版图' in x.find_element(By.ID,'dossierBody').text)
 shot('core-opened-dossier')
 # layer-switch must clear both old and new modules
 js("const el=document.querySelector('#toggleControlAreas');el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleZoneLayers']==0 and audit()['visibleCoreLayers']==0)
 shot('layers-hidden')
 js("const el=document.querySelector('#toggleControlAreas');el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));")
 wait.until(lambda _:audit()['visibleZoneLayers']>0)
 set_year(1572)
 assert audit()['visibleZoneLayers']==0 and audit()['visibleCoreLayers']==0
 shot('1572-original-map-intact')
 d.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda x:x.find_element(By.ID,'bigYear').text=='1699')
 assert not js('return Boolean(window.eighteenthMassSpatial)'), 'research preview must stay gated'
 print('PASS 18C batch35 81 supplementary polygon areas,42 city cores, 13 year-sample dates, legend control, dossier, unpublished isolation and 16C regression')
except Exception:
 shot('FAILED')
 raise
finally:
 d.quit()
