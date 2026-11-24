"""Diagnostics only: report exceptions and chronology readiness; not a publication test."""
import time,json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
o=Options()
for a in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--window-size=1780,1020'):o.add_argument(a)
o.set_capability('goog:loggingPrefs',{'browser':'ALL'})
d=webdriver.Chrome(options=o)
try:
 d.get('http://127.0.0.1:8765/?year=1800')
 for sec in [2,5,10]:
  time.sleep(sec)
  state=d.execute_script("""return {ready:document.getElementById('workspace')?.dataset.atlasReady,
    bigYear:document.getElementById('bigYear')?.textContent,
    bridge:!!window.atlasStoryBridge,
    bridgeYear:window.atlasStoryBridge?.currentYear?.(),
    history:!!window.HistoryStories,
    t04:!!window.atlasStoryBridge?.eventById?.('E19-T04-1896-A25-E02'),
    t07:!!window.atlasStoryBridge?.eventById?.('E19-T07-1806-A41-E01'),
    resourceScripts:[...document.scripts].map(x=>x.src).filter(Boolean).slice(-20)}""")
  print('DIAGNOSTIC',sec,json.dumps(state,ensure_ascii=False),flush=True)
  print('BROWSER_ERRORS',json.dumps(d.get_log('browser'),ensure_ascii=False)[-15000:],flush=True)
finally:d.quit()
