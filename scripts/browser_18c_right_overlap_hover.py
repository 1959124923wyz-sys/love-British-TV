#!/usr/bin/env python3
"""Real 1780x1020 desktop test of ORIGINAL eighteenth-century map right dossier.
Point click -> multiple overlapping references in the RIGHT side; card hover
highlights only that source footprint, mouseleave resets; sources and timeline.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results';shots.mkdir(exist_ok=True)
o=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 o.add_argument(arg)
d=webdriver.Chrome(options=o)
wait=WebDriverWait(d,120)
def js(code,*args):return d.execute_script(code,*args)
def audit():return js("return window.eighteenthOverlapDossier?.getAudit?.()")
def snap(s):d.save_screenshot(str(shots/('18c-right-overlap-'+s+'.png')))
def year(y):
 js("const el=document.querySelector('#jumpYear');el.value=String(arguments[0]);el.dispatchEvent(new Event('change',{bubbles:true}));",y)
 wait.until(lambda _:d.find_element(By.ID,'bigYear').text==str(y))
 wait.until(lambda _:audit() and audit()['year']==y)
try:
 d.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:audit() and audit()['loaded'] and
  js("return document.querySelector('#jumpYear')?.max==='1799'") and
  js("return window.eighteenthBatch39Spatial?.getAudit?.()?.loaded"))
 assert (audit()['areas'],audit()['sites'])==(629,421),audit()
 assert not js("return Boolean(window.eighteenthReaderPilot)")
 assert not js("return document.querySelector('#atlas18cReaderPanel')!==null")
 # Havana 1762 is independently supported by at least four overlapping B39 source rectangles.
 # Click on an original historical SVG area at map coordinates, preserving actual
 # mouse clientX/clientY so the capture handler sees the correct geographic point.
 outcome=js("""
  const map=window.__eighteenthSpatialHost.map;
  const ll=L.latLng(23.14,-82.36);
  map.setView(ll,9,{animate:false});
  const px=map.latLngToContainerPoint(ll),r=map.getContainer().getBoundingClientRect();
  const x=r.left+px.x,y=r.top+px.y;
  const allowed='.atlas-18c-dynamic-area,.atlas-18c-dynamic-core,.atlas-18c-mass-zone,.atlas-18c-mass-core,'+
   '.atlas-18c-b36-zone,.atlas-18c-b36-site,.atlas-18c-b37-zone,.atlas-18c-b37-site,'+
   '.atlas-18c-b38-zone,.atlas-18c-b38-site,.atlas-18c-b39-zone,.atlas-18c-b39-site';
  let target=document.elementFromPoint(x,y);
  const native=Boolean(target?.closest?.(allowed));
  if(!native)target=document.querySelector('.atlas-18c-b39-zone');
  if(!target)throw Error('No historic SVG reference target');
  target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:x,clientY:y}));
  return {native,tag:target.tagName,cx:x,cy:y};
 """)
 wait.until(lambda _:audit()['open'] and audit()['selectedCount']>=4)
 assert d.find_element(By.ID,'workspace').get_attribute('class').find('sidebar-collapsed')>=0
 assert 'dossier-collapsed' not in d.find_element(By.ID,'workspace').get_attribute('class')
 assert '此处涉及' in d.find_element(By.ID,'dossierBody').text
 count=audit()['selectedCount']
 assert js("return document.querySelectorAll('.atlas-18c-overlap-card').length")==count
 assert js("return document.querySelectorAll('.atlas-18c-overlap-card.is-selected').length")==1
 assert 'Havana' in d.find_element(By.ID,'dossierBody').text
 snap('1762-right-multiple-havana-records')
 assert audit()['glowCount']>=2
 first=audit()['selected']
 # Hover a DIFFERENT right-hand record, check glow tracks the hovered ID
 chosen=js("""
  const cards=[...document.querySelectorAll('.atlas-18c-overlap-card')];
  const card=cards[1];const ix=Number(card.dataset.overlapIndex);
  card.dispatchEvent(new PointerEvent('pointerenter',{bubbles:false}));
  return {ix,cardId:card.dataset.overlapId};
 """)
 wait.until(lambda _:audit()['focused']==chosen['cardId'])
 assert audit()['selected']==first,'hover must not unexpectedly change selected detail'
 assert audit()['glowCount']>=2
 assert js("return getComputedStyle(document.querySelector('.atlas-18c-overlap-glow')).filter")!='none'
 snap('1762-havana-second-card-hover-outline-glow')
 js("document.querySelectorAll('.atlas-18c-overlap-card')[1].dispatchEvent(new PointerEvent('pointerleave',{bubbles:false}));")
 wait.until(lambda _:audit()['focused']==first)
 js("document.querySelectorAll('[data-open-overlap]')[1].click();")
 wait.until(lambda _:audit()['selected']==chosen['cardId'])
 assert audit()['focused']==chosen['cardId']
 assert js("return document.querySelectorAll('.atlas-18c-overlap-card').length")==count
 assert js("return document.querySelectorAll('.atlas-18c-overlap-card.is-selected').length")==1
 assert js("return document.querySelectorAll('.atlas-18c-overlap-detail').length")==1
 assert js('return document.querySelectorAll(".atlas-18c-overlap-source-links a[href^=https]").length')>=1
 assert '历史文献与来源' in d.find_element(By.ID,'dossierBody').text
 snap('1762-selected-card-expanded-minimal-source-dossier')
 year(1763)
 assert audit()['open']
 assert audit()['selectedCount']>=1
 assert audit()['glowCount']>=2
 snap('1763-treaty-return-refreshed-overlap-list')
 js("document.querySelector('#mapLayerTerritory').click();")
 wait.until(lambda _:audit()['glowCount']==0 and not audit()['open'])
 assert not js("return document.querySelector('#atlas18cOverlapPanel')")
 snap('1763-territorial-map-hidden-no-stale-dossier')
 js("document.querySelector('#mapLayerTerritory').click();")
 assert js("return document.querySelector('#mapLayerTerritory').checked")
 year(1572)
 assert audit()['glowCount']==0
 snap('1572-original-historical-map-preserved')
 d.get('http://127.0.0.1:8765/?year=1762')
 wait.until(lambda _:d.find_element(By.ID,'bigYear').text=='1699')
 assert not js("return Boolean(window.eighteenthOverlapDossier)")
 assert not js("return Boolean(window.eighteenthReaderPilot)")
 print('PASS original-map right dossier: 629 outlines +421 sites, 1762 Havana >=4 records, hover real glow, click detailed source, 1763 refresh, territory gate, 1572 old map and public isolation. clickMethod='+str(outcome))
except Exception:
 snap('FAILED')
 raise
finally:
 d.quit()
