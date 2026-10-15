#!/usr/bin/env python3
"""Public map region discovery: verify sources & text are reachable by real clicks."""
import json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "regional-browser-evidence"
OUT.mkdir(exist_ok=True)
opt=Options()
opt.add_argument("--headless=new")
opt.add_argument("--no-sandbox")
opt.add_argument("--disable-dev-shm-usage")
opt.add_argument("--window-size=1440,920")
browser=webdriver.Chrome(options=opt)
wait=WebDriverWait(browser,40)
try:
    browser.get("http://127.0.0.1:8765/?year=1544")
    wait.until(lambda d:d.execute_script("return document.getElementById('bigYear')?.textContent==='1544' && document.querySelector('#eventCount')?.textContent.endsWith('项')"))
    def jump(y):
        browser.execute_script("""
           const input=document.getElementById('jumpYear');
           input.value=String(arguments[0]);
           input.dispatchEvent(new Event('change',{bubbles:true}));
        """,y)
        wait.until(lambda d:d.execute_script("return document.getElementById('bigYear').textContent===arguments[0]",str(y)))
    def titles():
        return [x.text for x in browser.find_elements(By.CSS_SELECTOR, "#historicalRegionList .historical-region-entry strong")]
    def press(label):
        buttons=browser.find_elements(By.CSS_SELECTOR,"#historicalRegionList .historical-region-entry")
        btn=next((x for x in buttons if label in x.text),None)
        assert btn is not None, f"{label} missing. Seen: {titles()}"
        browser.execute_script("arguments[0].scrollIntoView({block:'nearest'});",btn)
        btn.click()
        wait.until(lambda d: d.execute_script("""
          return document.querySelector('#dossierBody h2')?.textContent.includes(arguments[0])
        """,label))
        wait.until(lambda d: d.execute_script("""
          return !document.querySelector('#workspace').classList.contains('dossier-collapsed')
        """))
        body=browser.find_element(By.ID,"dossierBody")
        dossier_text=body.get_attribute('innerText')
        print("REGION DETAIL",label,"chars",len(dossier_text),"links",
              len(body.find_elements(By.CSS_SELECTOR,'a.source-link')),flush=True)
        assert len(dossier_text)>70,"Area needs substantive explanation"
        assert len(body.find_elements(By.CSS_SELECTOR, 'a.source-link'))>=1,"Area needs clickable primary/scholarly source"
        assert "该地区的历史状态按所选年份显示" not in dossier_text
        browser.save_screenshot(str(OUT/f"region-{browser.find_element(By.ID,'bigYear').text}.png"))
        print("PASS region", label, "clickable sourced story", flush=True)
    for year,needle in [(1544,"利斯—爱丁堡"),(1556,"莱伊什—奥法利"),(1573,"克兰德博伊"),(1575,"拉斯林岛"),(1580,"利默里克—凯里"),(1582,"芒斯特"),(1586,"圣多明各"),(1598,"黄渡口")]:
        jump(year)
        current=titles()
        assert any(needle in n for n in current), f"{year}: missing {needle}; {current}"
        if year in [1544,1556,1573,1575,1580,1582]:
            press(needle)
        if year in [1544,1556,1575,1580,1598]:
            browser.save_screenshot(str(OUT/f"area-list-{year}.png"))
        print("PASS region discovery year",year,"count",len(current),flush=True)
    jump(1576)
    assert not any("拉斯林岛" in x or "克兰德博伊" in x for x in titles()),"Expired attack persists"
    jump(1580)
    assert any("利默里克—凯里" in x for x in titles())
    browser.execute_script("""
       const x=document.getElementById('mapLayerTerritory');
       x.checked=false;x.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    assert not any("利默里克—凯里" in x for x in titles()),"Disabled area persists in reading guide"
    browser.execute_script("""
       const x=document.getElementById('mapLayerTerritory');
       x.checked=true;x.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    assert any("利默里克—凯里" in x for x in titles()),"Area guide failed to restore"
    assert browser.find_element(By.ID,"bigYear").text=="1580"
    print("PASS territory toggle & chronology keep region guide in sync",flush=True)
finally:
    browser.quit()
