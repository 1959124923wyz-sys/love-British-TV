#!/usr/bin/env python3
"""Atlas45 desktop regression for historical 17C/18C decade headings and intros."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
shots=root/'browser-smoke-results'
shots.mkdir(exist_ok=True)
options=Options()
for flag in ('--headless=new','--no-sandbox','--disable-dev-shm-usage',
             '--disable-gpu','--window-size=1780,1020'):
 options.add_argument(flag)
driver=webdriver.Chrome(options=options)
wait=WebDriverWait(driver,120)
def js(code,*args):
 return driver.execute_script(code,*args)
def snap(label):
 driver.save_screenshot(str(shots/('atlas45-decade-'+label+'.png')))
try:
 driver.get('http://127.0.0.1:8765/?review18c=1&year=1497')
 wait.until(lambda _:js("return !!window.AtlasChapterNarratives?.forDecade(1600) && document.querySelector('#jumpYear')?.max === '1799'"))
 assert js("return document.querySelector('#chapterTitlePrimary').textContent + document.querySelector('#chapterTitleSecondary').textContent")=='大西洋远航与王室扩张'
 assert '1497' in js("return document.getElementById('chapterIntro').textContent")
 snap('1497-original-chapter-unchanged')
 for year in (1600,1610,1649,1675,1699,1700,1715,1739,1757,1770,1788,1799):
  js("""
   const el=document.getElementById('jumpYear');
   el.value=String(arguments[0]);
   el.dispatchEvent(new Event('change',{bubbles:true}));
  """,year)
  decade=year//10*10
  wait.until(lambda _:js("return Number(document.getElementById('bigYear').textContent)===arguments[0] && document.getElementById('chapterTitlePrimary').textContent===window.AtlasChapterNarratives.forDecade(arguments[0]).primary",year))
  state=js("""
   const y=arguments[0],dec=Math.floor(y/10)*10,x=window.AtlasChapterNarratives.forDecade(y);
   return {label:document.getElementById('chapterLabel').textContent,
           nav:document.getElementById('chapterNav').textContent,
           navName:document.getElementById('chapterNavName').textContent,
           title:document.getElementById('chapterTitlePrimary').textContent+
                 document.getElementById('chapterTitleSecondary').textContent,
           intro:document.getElementById('chapterIntro').textContent,
           period:document.getElementById('periodTitle').textContent,
           active:document.querySelector('#chapterTrack .chapter-segment.active')?.textContent || '',
           expected:x};
  """,year)
  assert state['title']==state['expected']['title'],(year,state)
  assert state['intro']==state['expected']['intro'],(year,state)
  assert len(state['intro'])>=65,(year,state)
  assert state['nav']=='历史地图 · 第'+str(11+(decade-1600)//10)+'章',(year,state)
  assert state['navName']==state['title'],(year,state)
  assert str(decade)+'—'+str(decade+9) in state['label'],(year,state)
  assert state['period']==state['title'],(year,state)
  assert state['title'] in state['active'],(year,state['active'])
  assert '本十年已收录' not in state['intro'],(year,state)
  if year in (1600,1699,1757,1799):
   snap(str(year)+'-chapter')
 # Jumping back to the original sixteenth-century chapters retains their titles.
 js("""
  const el=document.getElementById('jumpYear');
  el.value='1595';el.dispatchEvent(new Event('change',{bubbles:true}));
 """)
 wait.until(lambda _:js("return document.querySelector('#bigYear').textContent==='1595'"))
 assert js("return document.querySelector('#chapterTitlePrimary').textContent + document.querySelector('#chapterTitleSecondary').textContent")=='镇压、反抗与跨洋劫掠'
 snap('1595-original-16c-backward-navigation')
 print('PASS Atlas45 desktop: 1497 and 1595 original chapters, 12 sampled 1600–1799 years, synchronized decade names, narrative intros, navigation and statistics.')
except Exception:
 snap('FAILED')
 raise
finally:
 driver.quit()
