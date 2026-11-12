#!/usr/bin/env python3
"""Reproduce the user-reported Newfoundland single-outline click bug in real Chrome.
Then prove 18C isolated envelope and overlapping Havana stay clickable with clean details.
"""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
root=Path(__file__).resolve().parents[1]
screens=root/'browser-smoke-results';screens.mkdir(exist_ok=True)
opt=Options()
for v in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--window-size=1780,1020'):
 opt.add_argument(v)
d=webdriver.Chrome(options=opt)
wait=WebDriverWait(d,110)
def js(s,*a):return d.execute_script(s,*a)
def check(p):return wait.until(p)
def snap(s):d.save_screenshot(str(screens/('atlas44-single-click-'+s+'.png')))
def text():return d.find_element(By.ID,'dossierBody').text
def clean():
 t=text()
 for q in ('重叠的示意区块各有独立史料','不能将多层颜色叠加计算历史占地',
  '边界未经历史地图实测配准','虚线为概略历史地理参考',
  '殖民省行政外缘不等于各地持续驻军','整岛外廓展示','未经历史地图配准',
  '本地图不代表实际控制面积'):
  assert q not in t,(q,t[:1200])
try:
 d.get('http://127.0.0.1:8765/?year=1610')
 check(lambda _:js("return window.historicOverlapDossier?.getAudit?.()?.liveAreas>0"))
 # The exact Newfoundland amber dashed charter polygon shown in the screenshot.
 p=js(r"""
  const host=window.__historicOverlapHost,api=window.historicOverlapDossier;
  const item=host.visibleAreaFeatures().find(x=>x.feature.id==='claim-newfoundland-island-1610');
  if(!item)return {error:'newfoundland-not-visible',groups:api.getAudit().groups};
  const geom=item.feature.geometry;
  const ring=geom.coordinates[0];
  const inside=(lon,lat)=>{
   let found=false;
   for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const a=ring[i],b=ring[j];
    if((a[1]>lat)!==(b[1]>lat)&&lon<(b[0]-a[0])*(lat-a[1])/(b[1]-a[1])+a[0])found=!found;
   }
   return found;
  };
  const xs=ring.map(q=>q[0]),ys=ring.map(q=>q[1]);
  const box=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
  let candidate=null;
  for(let i=1;i<=18;i++)for(let j=1;j<=18;j++){
   const lon=box[0]+(box[2]-box[0])*i/19,lat=box[1]+(box[3]-box[1])*j/19;
   if(!inside(lon,lat))continue;
   const hits=api.hitCountAt(lat,lon);
   if(!candidate||hits<candidate.hits)candidate={lon,lat,hits};
  }
  if(!candidate)return {error:'no-geo-interior'};
  host.map.setView([candidate.lat,candidate.lon],6,{animate:false});
  const px=host.map.latLngToContainerPoint([candidate.lat,candidate.lon]);
  const rect=host.map.getContainer().getBoundingClientRect();
  host.map.getContainer().dispatchEvent(new MouseEvent('click',{
   bubbles:true,cancelable:true,clientX:rect.left+px.x,clientY:rect.top+px.y
  }));
  return candidate;
 """)
 assert not p.get('error'),p
 check(lambda _:js("return window.historicOverlapDossier.getAudit().open"))
 assert js("return window.historicOverlapDossier.getAudit().selectedCount")>=1,p
 check(lambda _: '纽芬兰' in text())
 assert '纽芬兰' in text(),(p,text()[:1200])
 if p['hits']==1:
  assert js("return window.historicOverlapDossier.getAudit().selectedCount")==1
  assert js("return window.historicOverlapDossier.getAudit().openedVia")=='transparent-single'
 assert '1610' in text() and '1662' in text() and '贝奥图克' in text()
 assert js("return document.querySelectorAll('#atlasHistoricOverlapPanel .atlas-18c-overlap-glow').length")==0
 assert js("return document.querySelectorAll('.atlas-18c-overlap-glow').length")>=1
 assert js("return document.querySelectorAll('#atlasHistoricOverlapPanel [data-historic-open]').length")>=1
 clean()
 snap('1610-newfoundland-click-interior')
 # 17C isolated one-zone sample (other than Newfoundland if its historical layers overlap).
 if p['hits']!=1:
  unique=js(r"""
   const host=window.__historicOverlapHost,api=window.historicOverlapDossier;
   const rows=host.visibleAreaFeatures().filter(x=>x.feature.geometry?.type==='Polygon');
   let result=null;
   for(const x of rows){
    const ring=x.feature.geometry.coordinates[0],xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]);
    const lo=Math.min(...xs),hi=Math.max(...xs),so=Math.min(...ys),no=Math.max(...ys);
    for(let i=1;i<=7&&!result;i++)for(let j=1;j<=7&&!result;j++){
     const lon=lo+(hi-lo)*i/8,lat=so+(no-so)*j/8;
     if(api.hitCountAt(lat,lon)===1)result={lon,lat};
    }
    if(result)break;
   }
   if(result){
    host.map.setView([result.lat,result.lon],6,{animate:false});
    const px=host.map.latLngToContainerPoint([result.lat,result.lon]),r=host.map.getContainer().getBoundingClientRect();
    host.map.getContainer().dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,
     clientX:r.left+px.x,clientY:r.top+px.y}));
   }
   return result;
  """)
  assert unique,'no isolated seventeenth-century displayed region'
  check(lambda _:js("return window.historicOverlapDossier.getAudit().openedVia==='transparent-single'"))
  assert js("return window.historicOverlapDossier.getAudit().selectedCount")==1
  clean()
  snap('1610-isolated-early-region-single-click')
 # 18C isolated region: search the ACTUAL archived bbox array for a one-hit coordinate.
 d.get('http://127.0.0.1:8765/?review18c=1&year=1700')
 check(lambda _:js("return window.eighteenthOverlapDossier?.getAudit?.()?.loaded") and
  js("return document.querySelector('#jumpYear')?.max==='1799'"))
 single=d.execute_async_script(r"""
  const done=arguments[arguments.length-1];
  (async()=>{
   const regions=['data/eighteenth-century-mass-schematic-zones-1700-1799.json',
    'data/eighteenth-century-expansion-batch36-1700-1799.json',
    ...['africa','india-ocean','caribbean'].map(x=>'data/eighteenth-century-b37-'+x+'.json'),
    ...['south-campaign','hudson-company','india-mysore'].map(x=>'data/eighteenth-century-b38-'+x+'.json'),
    ...['caribbean-1759-1763','gold-coast-forts','gulf-surat-factories'].map(x=>'data/eighteenth-century-b39-'+x+'.json')];
   const data=await Promise.all(regions.map(async p=>(await fetch(p)).json()));
   const api=window.eighteenthOverlapDossier,host=window.__eighteenthSpatialHost;
   let chosen=null;
   for(const z of data.flatMap(x=>x.zones)){
    if(!z.periods.some(p=>p.start_year<=1700&&p.end_year>=1700))continue;
    const [w,s,e,n]=z.bbox;
    for(const k of [.2,.35,.5,.65,.8])for(const t of [.2,.35,.5,.65,.8]){
     const lon=w+(e-w)*k,lat=s+(n-s)*t;
     if(api.hitCountAt(lat,lon)===1){chosen={lon,lat,id:z.id,title:z.title};break}
    }
    if(chosen)break;
   }
   if(chosen){
    host.map.setView([chosen.lat,chosen.lon],7,{animate:false});
    const px=host.map.latLngToContainerPoint([chosen.lat,chosen.lon]),r=host.map.getContainer().getBoundingClientRect();
    host.map.getContainer().dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,
      clientX:r.left+px.x,clientY:r.top+px.y}));
   }
   done(chosen||{error:'no-single-active-bbox'});
  })().catch(e=>done({error:String(e)}));
 """)
 assert not single.get('error'),single
 check(lambda _:js("return window.eighteenthOverlapDossier.getAudit().open"))
 assert js("return window.eighteenthOverlapDossier.getAudit().selectedCount")==1,single
 assert js("return window.eighteenthOverlapDossier.getAudit().lastActivation")=='map-background-single'
 assert js("return document.querySelectorAll('#atlas18cOverlapPanel .atlas-18c-overlap-card').length")==1
 assert js("return window.eighteenthOverlapDossier.getAudit().glowCount")>=2
 clean()
 snap('1700-eighteenth-single-click')
 # Keep the previously accepted multi-source overlap behavior at 1762 Havana.
 js("""const t=document.querySelector('#jumpYear');t.value='1762';t.dispatchEvent(new Event('change',{bubbles:true}));""")
 check(lambda _:d.find_element(By.ID,'bigYear').text=='1762')
 js("""
  const host=window.__eighteenthSpatialHost,ll=L.latLng(23.14,-82.36);
  host.map.setView(ll,9,{animate:false});
  const p=host.map.latLngToContainerPoint(ll),r=host.map.getContainer().getBoundingClientRect();
  host.map.getContainer().dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,
    clientX:r.left+p.x,clientY:r.top+p.y}));
 """)
 check(lambda _:js("return window.eighteenthOverlapDossier.getAudit().selectedCount>=4"))
 assert js("return window.eighteenthOverlapDossier.getAudit().lastActivation")=='map-background-overlap'
 clean()
 snap('1762-havana-multiple-records-clean')
 print('PASS: Newfoundland 1610 direct isolated polygon click; eighteenth-century 1700 single region, Havana 1762 overlap, hover glow, source chronology and all old academic map remarks absent.')
except Exception:
 snap('FAILED')
 raise
finally:
 d.quit()
