#!/usr/bin/env python3
"""Browser regression: new Laois/Offaly and Marian persecution stories link to existing events."""
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root=Path(__file__).resolve().parents[1]
out=root/'snake-f-institutional-browser-results'
out.mkdir(exist_ok=True)
cases=[
 ('1556','1550S-E011','laois-offaly-crown-plantation-martial-law-1547-1566'),
 ('1555','MR1555-JOHN-ROGERS-SMITHFIELD','marian-heresy-trials-burnings-1554-1558')
]
opts=Options()
for a in ('--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1460,960'):
 opts.add_argument(a)
d=webdriver.Chrome(options=opts)
w=WebDriverWait(d,60)
def js(code,*args):
 return d.execute_script(code,*args)
def check(view):
 for year,event_id,story in cases:
  d.get('http://127.0.0.1:8765/?year='+year)
  w.until(lambda x: js("return document.querySelector('#bigYear')?.textContent===arguments[0]",year))
  if view=='mobile':
   d.find_element(By.ID,'mobileEventsToggle').click()
   # Sidebar opening is animated: class removal alone does not mean its
   # off-screen event rows can yet receive a genuine pointer click.
   w.until(lambda x: js("""const b=document.querySelector('#sidebar').getBoundingClientRect();
      return !document.querySelector('#workspace').classList.contains('sidebar-collapsed') &&
             b.width>170 && b.left>=-2 && b.right<=window.innerWidth+2;"""))
  css='#eventList .event-item[data-eid="'+event_id+'"]'
  w.until(lambda x: js("return !!document.querySelector(arguments[0])",css))
  el=d.find_element(By.CSS_SELECTOR,css)
  js("arguments[0].scrollIntoView({block:'center'})",el)
  w.until(lambda x: js("""const e=document.querySelector(arguments[0]),r=e.getBoundingClientRect();
     const b=document.querySelector('#sidebar').getBoundingClientRect();
     return r.width>50 && r.height>15 && r.left>=b.left-2 &&
            r.right<=b.right+2 && r.top>=0 && r.top<innerHeight;""",css))
  el.click()
  sel='#dossierBody [data-story-open="'+story+'"]'
  w.until(lambda x: js("return !!document.querySelector(arguments[0])",sel))
  btn=d.find_element(By.CSS_SELECTOR,sel)
  js("arguments[0].scrollIntoView({block:'center'})",btn)
  btn.click()
  w.until(lambda x: js("return document.querySelector('.major-story-article')?.dataset.storyId===arguments[0]",story))
  assert js("return document.querySelectorAll('.major-story-article .story-section').length")>=8
  d.save_screenshot(str(out/(view+'-'+year+'-'+story+'.png')))
  d.find_element(By.CSS_SELECTOR,'[data-story-return]').click()
  w.until(lambda x: js("return document.querySelector('#bigYear')?.textContent===arguments[0] && !!document.querySelector(arguments[1])",year,sel))
  print('PASS',view,year,story,'single event entry / longform / back')
try:
 check('desktop')
 d.set_window_size(410,860)
 check('mobile')
finally:
 d.quit()
