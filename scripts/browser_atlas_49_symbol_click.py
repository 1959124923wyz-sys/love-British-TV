#!/usr/bin/env python3
"""Actual desktop mouse: independent Leaflet SVG events must beat 18C area picker."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'browser-smoke-results'
OUT.mkdir(exist_ok=True)
opts=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
 opts.add_argument(flag)
browser=webdriver.Chrome(options=opts)
wait=WebDriverWait(browser,100)
def js(code,*args): return browser.execute_script(code,*args)
def click(x,y):
 for kind in ('mouseMoved','mousePressed','mouseReleased'):
  payload={'type':kind,'x':round(x),'y':round(y)}
  if kind!='mouseMoved':payload.update(button='left',clickCount=1)
  browser.execute_cdp_cmd('Input.dispatchMouseEvent',payload)
try:
 browser.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:js("return window.eighteenthOverlapDossier?.getAudit?.()?.loaded && !!window.AtlasPublicCopyGuard && Number(document.getElementById('bigYear').textContent)===1762 && window.eighteenthOverlapDossier.hitCountAt(23.14,-82.36)>=2"))
 result=js("""
  const host=window.__eighteenthSpatialHost, map=host.map;
  const lat=23.14,lng=-82.36;
  map.setView([lat,lng],9,{animate:false});
  const pane='atlas49IndependentMarkerPane';
  if(!map.getPane(pane))map.createPane(pane);
  map.getPane(pane).style.zIndex='780';
  map.getPane(pane).style.pointerEvents='auto';
  window.atlas49SymbolClicks=0;
  const renderer=L.svg({pane});
  window.atlas49TestMarker=L.circleMarker([lat,lng],{
    pane,renderer,radius:14,color:'#fff',weight:3,fillColor:'#c68bdc',
    fillOpacity:1,interactive:true,bubblingMouseEvents:false,
    className:'atlas49-independent-pin'
  }).on('click',()=>{window.atlas49SymbolClicks+=1;}).addTo(map);
  const local=map.latLngToContainerPoint([lat,lng]),rect=map.getContainer().getBoundingClientRect();
  const x=rect.left+local.x,y=rect.top+local.y,target=document.elementFromPoint(x,y);
  return {x,y,target:target?.outerHTML.slice(0,450),
     hits:window.eighteenthOverlapDossier.hitCountAt(lat,lng)};
 """)
 assert result['hits']>=2, result
 assert 'atlas49-independent-pin' in (result['target'] or ''),result
 click(result['x'],result['y'])
 wait.until(lambda _:js("return window.atlas49SymbolClicks===1"))
 audit=js("return window.eighteenthOverlapDossier.getAudit()")
 assert not audit['open'],(result,audit)
 browser.save_screenshot(str(OUT/'atlas49-independent-foreground-symbol.png'))
 js("window.atlas49TestMarker.remove()")
 position=js("""
  const map=window.__eighteenthSpatialHost.map;
  const p=map.latLngToContainerPoint([23.14,-82.36]),r=map.getContainer().getBoundingClientRect();
  return {x:r.left+p.x,y:r.top+p.y};
 """)
 click(position['x'],position['y'])
 wait.until(lambda _:js("return window.eighteenthOverlapDossier.getAudit().open"))
 audit=js("return window.eighteenthOverlapDossier.getAudit()")
 assert audit['selectedCount']>=2,audit
 assert not js("return window.AtlasPublicCopyGuard.visibleWarnings().length")
 browser.save_screenshot(str(OUT/'atlas49-transparent-background-opens-overlap.png'))
 print('PASS atlas49: independent SVG marker receives its own real desktop click; map region chooser does not steal it, and transparent background still opens multiple sourced 18C regions.')
except Exception:
 browser.save_screenshot(str(OUT/'atlas49-independent-click-FAILED.png'))
 raise
finally:
 browser.quit()
