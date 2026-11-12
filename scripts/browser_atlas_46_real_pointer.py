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
  const lat=arguments[0],lon=arguments[1],which=arguments[2],
    host=window.__eighteenthSpatialHost,map=host.map;
  map.setView([lat,lon],which==='havana'?9:7,{animate:false});
  const base=map.latLngToContainerPoint([lat,lon]),
    rect=map.getContainer().getBoundingClientRect(),api=window.eighteenthOverlapDossier;
  const margin=45;let choice=null;
  for(const dx of [0,24,-24,40,-40,64,-64]){
   for(const dy of [0,24,-24,40,-40,64,-64]){
    const local=L.point(base.x+dx,base.y+dy);
    if(local.x<margin||local.y<margin||local.x>rect.width-margin||local.y>rect.height-margin)continue;
    const x=rect.left+local.x,y=rect.top+local.y,el=document.elementFromPoint(x,y);
    if(!el||el.closest('.leaflet-marker-icon,.leaflet-control-container,.leaflet-tooltip,.leaflet-popup'))continue;
    const ll=map.containerPointToLatLng(local),hits=api.hitCountAt(ll.lat,ll.lng);
    if(hits<arguments[3])continue;
    const candidate={x,y,element:el.outerHTML.slice(0,400),hits,
       sampleLat:ll.lat,sampleLon:ll.lng};
    if(!choice || candidate.hits>choice.hits)choice=candidate;
   }
  }
  return choice||{error:'no unobstructed interactive map pixel',base:base,point:[lat,lon]};
 """,lat,lon,selector,need)
 assert 'error' not in res,(year,selector,res)
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
