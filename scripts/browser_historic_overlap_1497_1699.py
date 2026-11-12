#!/usr/bin/env python3
"""Real Chromium desktop: scale native right-hand multi-zone hover glow from 18C
to source-backed 1497–1699 territory polygons without remapping old history.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
folder=root/'browser-smoke-results';folder.mkdir(exist_ok=True)
opt=Options()
for arg in ('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):
 opt.add_argument(arg)
d=webdriver.Chrome(options=opt)
wait=WebDriverWait(d,110)
def js(s,*args):return d.execute_script(s,*args)
def audit():return js('return window.historicOverlapDossier?.getAudit?.()')
def snap(name):d.save_screenshot(str(folder/('historic-overlap-'+name+'.png')))
def year(y):
 js("""const f=document.querySelector('#jumpYear');f.value=String(arguments[0]);
   f.dispatchEvent(new Event('change',{bubbles:true}));""",y)
 wait.until(lambda _:d.find_element(By.ID,'bigYear').text==str(y))
 wait.until(lambda _:audit() and audit()['year']==y)
def click_feature(group=None):
 """Pick a polygon from LIVE sourced map layer, synthesize a proper coordinate click
 on its original SVG path after moving the map to an interior candidate point."""
 result=js(r"""
  const M=window.__historicOverlapHost, map=M.map,rows=M.visibleAreaFeatures().filter(q=>q.layer._path&&q.feature.geometry);
  const g=arguments[0],targets=g?rows.filter(q=>q.group===g):rows;
  if(!targets.length)return {ok:false,count:rows.length,group:g};
  const inside=(poly,lon,lat)=>{
   const ring=poly[0],pointInRing=r=>{
    let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){
     const a=r[i],b=r[j];if((a[1]>lat)!=(b[1]>lat)&&lon<(b[0]-a[0])*(lat-a[1])/(b[1]-a[1])+a[0])c=!c;
    }return c;
   };
   return pointInRing(ring)&&!poly.slice(1).some(pointInRing);
  };
  const hit=(feature,lon,lat)=>{
   const geo=feature.geometry;
   if(geo.type==='Polygon')return inside(geo.coordinates,lon,lat);
   if(geo.type==='MultiPolygon')return geo.coordinates.some(x=>inside(x,lon,lat));
   return false;
  };
  let candidate=null;
  for(const item of targets){
   const coords=[];const grab=z=>{if(Array.isArray(z)&&typeof z[0]==='number'&&typeof z[1]==='number'){coords.push(z);return}if(Array.isArray(z))z.forEach(grab)};
   grab(item.feature.geometry.coordinates);if(!coords.length)continue;
   const west=Math.min(...coords.map(z=>z[0])),east=Math.max(...coords.map(z=>z[0]));
   const south=Math.min(...coords.map(z=>z[1])),north=Math.max(...coords.map(z=>z[1]));
   for(let j=1;j<=7;j++)for(let k=1;k<=7;k++){
    const lon=west+(east-west)*j/8,lat=south+(north-south)*k/8;
    if(!hit(item.feature,lon,lat))continue;
    const hits=rows.filter(q=>hit(q.feature,lon,lat));
    const next={hits:hits.length,lon,lat,group:item.group,title:item.feature.properties?.name};
    if(!candidate||next.hits>candidate.hits)candidate=next;
   }
  }
  if(!candidate)return {ok:false,reason:'none-inside',count:targets.length};
  map.setView([candidate.lat,candidate.lon],Math.max(map.getZoom(),5),{animate:false});
  const now=M.visibleAreaFeatures().filter(x=>x.layer._path&&hit(x.feature,candidate.lon,candidate.lat));
  const selected=now.find(x=>x.group===g)||now[0];if(!selected)return {ok:false,reason:'no-svg-after-pan'};
  const box=map.getContainer().getBoundingClientRect(),px=map.latLngToContainerPoint([candidate.lat,candidate.lon]);
  selected.layer._path.dispatchEvent(new MouseEvent('click',{
   bubbles:true,cancelable:true,clientX:box.left+px.x,clientY:box.top+px.y
  }));
  return {ok:true,expected:now.length,featureGroup:selected.group,title:selected.feature.properties?.name,
   coordinate:[candidate.lon,candidate.lat],selectedTargetConnected:selected.layer._path.isConnected};
 """,group)
 assert result['ok'],result
 wait.until(lambda _:audit()['open'] and audit()['selectedCount']>=1)
 return result
try:
 d.get('http://127.0.0.1:8765/?year=1609')
 wait.until(lambda _:audit() and audit()['year']==1609 and audit()['liveAreas']>0)
 assert not js("return Boolean(window.eighteenthReaderPilot)")
 assert not js("return Boolean(window.eighteenthOverlapDossier)")
 assert audit()['groups'].get('colonialClaims',0)>0,audit()
 a=click_feature('colonialClaims')
 assert audit()['selectedCount']>=1
 assert js("return document.querySelectorAll('#atlasHistoricOverlapPanel .atlas-18c-overlap-card').length")==audit()['selectedCount']
 assert js("return document.querySelectorAll('.atlas-18c-overlap-glow').length")>=1
 assert '历史文献与来源' in d.find_element(By.ID,'dossierBody').text
 snap('1609-virginia-claims-right-dossier')
 if audit()['selectedCount']>=2:
  first=audit()['selected']
  chosen=js("""
   const el=document.querySelectorAll('[data-historic-index]')[1];
   el.dispatchEvent(new PointerEvent('pointerenter',{bubbles:false}));
   return el.dataset.historicOverlapId;
  """)
  wait.until(lambda _:audit()['focused']==chosen)
  assert audit()['selected']==first
  assert js("return getComputedStyle(document.querySelector('.atlas-18c-overlap-glow')).filter")!='none'
  snap('1609-hover-second-claim-glow')
  js("document.querySelectorAll('[data-historic-index]')[1].dispatchEvent(new PointerEvent('pointerleave',{bubbles:false}));")
  wait.until(lambda _:audit()['focused']==first)
  js("document.querySelectorAll('[data-historic-open]')[1].click()")
  wait.until(lambda _:audit()['selected']==chosen)
  assert js("return document.querySelectorAll('#atlasHistoricOverlapPanel .atlas-18c-overlap-detail').length")==1
  assert audit()['focused']==chosen
  snap('1609-click-second-claim-source')
 for y in [1613,1642,1655,1689,1699]:
  year(y)
  assert audit()['enabled']
  assert audit()['liveAreas']>0,(y,audit())
  if y in (1613,1655,1699):snap(str(y)+'-late-colonial-history')
 year(1613)
 b=click_feature('seventeenthStudies')
 assert '历史区域' in d.find_element(By.ID,'dossierBody').text
 assert audit()['focused']==audit()['selected']
 snap('1613-ulster-source-study-hover')
 for y in [1497,1513,1534,1544,1558,1569,1572,1588,1595,1599]:
  year(y)
  assert audit()['enabled']
  assert audit()['liveAreas']>0,(y,audit())
  if y in (1497,1544,1558,1595):snap(str(y)+'-tudor-original-map')
 year(1544)
 c=click_feature('territory')
 assert audit()['selectedCount']>=1
 assert audit()['focused']==audit()['selected']
 snap('1544-tudor-multiregion-right-source')
 js("document.querySelector('#mapLayerTerritory').click();")
 wait.until(lambda _:not audit()['open'] and audit()['glowCount']==0)
 assert not js("return document.querySelector('#atlasHistoricOverlapPanel')"),'stale source cards after map disabled'
 js("document.querySelector('#mapLayerTerritory').click();")
 year(1655)
 assert audit()['liveAreas']>0
 # 18C remains the original already-accepted separate source module in research preview.
 d.get('http://127.0.0.1:8765/?review18c=1&year=1762')
 wait.until(lambda _:js("return window.eighteenthOverlapDossier?.getAudit?.()?.loaded") and
  d.find_element(By.ID,'bigYear').text=='1762')
 assert not audit()['enabled']
 assert js("return window.eighteenthOverlapDossier.getAudit().areas") ==629
 assert js("return window.eighteenthOverlapDossier.getAudit().sites")==421
 snap('1762-existing-eighteenth-map-unchanged')
 print('PASS native original-map right overlap rollout: 1497–1599 Tudor areas, 1609–1699 charter polygons and 1613 regional studies, hover glow, historical sources, map toggles, preserved 18C 629/421.')
except Exception:
 snap('FAILED')
 raise
finally:
 d.quit()
