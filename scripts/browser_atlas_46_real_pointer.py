#!/usr/bin/env python3
"""Exercise 18C regions with actual Chrome pointer dispatch, not JS callbacks."""
import json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results'
shots.mkdir(exist_ok=True)
opt=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
 opt.add_argument(flag)
d=webdriver.Chrome(options=opt)
wait=WebDriverWait(d,110)
def js(src,*args): return d.execute_script(src,*args)
def point(x,y):
 d.execute_cdp_cmd('Input.dispatchMouseEvent',{'type':'mouseMoved','x':round(x),'y':round(y)})
 d.execute_cdp_cmd('Input.dispatchMouseEvent',{'type':'mousePressed','x':round(x),'y':round(y),'button':'left','clickCount':1})
 d.execute_cdp_cmd('Input.dispatchMouseEvent',{'type':'mouseReleased','x':round(x),'y':round(y),'button':'left','clickCount':1})
def sample(year,selector,need):
 d.get('http://127.0.0.1:8765/?review18c=1&year='+str(year))
 wait.until(lambda _:js("return window.eighteenthOverlapDossier?.getAudit?.()?.loaded && document.querySelector('#jumpYear')?.max==='1799'"))
 if selector=='havana':
  lat,lon=23.14,-82.36
 else:
  x=json.loads((root/'data/eighteenth-century-b38-hudson-company.json').read_text(encoding='utf-8'))
  z=next(a for a in x['zones'] if a['id']=='B38-H-Z006')
  lon=(z['bbox'][0]+z['bbox'][2])/2;lat=(z['bbox'][1]+z['bbox'][3])/2
 res=js("""
  const lat=arguments[0],lon=arguments[1],host=window.__eighteenthSpatialHost,
    map=host.map;
  map.setView([lat,lon],selector==='havana'?9:7,{animate:false});
  const p=map.latLngToContainerPoint([lat,lon]),r=map.getContainer().getBoundingClientRect();
  const x=r.left+p.x,y=r.top+p.y;
  return {x,y,element:document.elementFromPoint(x,y)?.outerHTML.slice(0,400),
    hits:window.eighteenthOverlapDossier.hitCountAt(lat,lon)};
 """.replace("selector==='havana'","arguments[2]==='havana'"),lat,lon,selector)
 assert res['hits']>=need,(year,selector,res)
 point(res['x'],res['y'])
 wait.until(lambda _:js("return window.eighteenthOverlapDossier.getAudit().open"))
 state=js("""
  return {audit:window.eighteenthOverlapDossier.getAudit(),
    title:document.querySelector('#atlas18cOverlapPanel')?.innerText.slice(0,4000) || ''};
 """)
 assert state['audit']['selectedCount']>=need,(year,selector,res,state)
 for forbidden in ('虚线为概略历史地理参考','边界未经历史地图实测配准',
                   '区域海河贸易通道，非英国河两岸主权',
                   '重叠的示意区块各有独立史料'):
  assert forbidden not in state['title'],(year,forbidden,state['title'])
 d.save_screenshot(str(shots/('atlas46-real-pointer-'+str(year)+'-'+selector+'.png')))
 print('ATLAS46_POINTER '+json.dumps({'year':year,'selector':selector,'x':res['x'],
   'y':res['y'],'hits':res['hits'],'target':res['element'],
   'selected':state['audit']['selectedCount'],'via':state['audit'].get('openedVia')},
   ensure_ascii=False))
try:
 sample(1762,'havana',2)
 sample(1783,'hudson-waterway',1)
 print('PASS atlas46: Chrome actual-pixel click opens Havana multiple regions and Hudson source-backed river trade corridor with no cartographic notice.')
except Exception:
 d.save_screenshot(str(shots/'atlas46-real-pointer-FAILED.png'))
 raise
finally:
 d.quit()
