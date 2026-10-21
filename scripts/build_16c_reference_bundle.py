#!/usr/bin/env python3
"""Build reproducible ZIP from actually published sixteenth-century atlas materials.
No dependencies outside stdlib. All examples remain research, not new borders.
"""
import json, hashlib, subprocess
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from argparse import ArgumentParser

ROOT=Path(__file__).resolve().parents[1]
PREFIX="爱英TV_16世纪专题地图交互指导纲领"
GROUPS={
"01_正式规范":[
 "AGENTS.md",
 "docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md",
 "docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md",
 "docs/HISTORICAL_SPATIAL_REVIEW_CHECKLIST.md",
 "docs/APPROVED_MAP_INTERACTION_STANDARD.md",
 "docs/TERRITORY_CONTINUITY_RULE.md",
 "docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md",
 "docs/MAJOR_HISTORY_STORY_PILOT.md"],
"02_16世纪已经发表的专题":[
 "data/stories/drake-panama-mule-train-raid-1572-1573.json",
 "data/stories/munster-desmond-1579-1586.json",
 "data/stories/hawkins-lovell-atlantic-enslavement-1562-1569.json",
 "data/stories/index.json"],
"03_16世纪真实地图案例":[
 "data/nine-years-war-operational-impact-1594-1599.geojson",
 "data/early-war-colonial-impact-1544-1575.geojson",
 "data/eleventh-influence-areas-1590-1599.geojson",
 "data/war-occupied-zones-1540-1549.geojson",
 "data/political-relations-1570-1579.geojson",
 "data/territorial-footprints-1570-1579.geojson",
 "data/atlas-1570-1579.json"],
"04_专题与地图交互源程序":[
 "js/history-stories.js","css/history-stories.css"],
"05_史料地理及互动测试":[
 "scripts/test_major_story_pilot.js",
 "scripts/test_editor7_17c_inline_story_map.js",
 "scripts/audit_spatial_semantics.py",
 "scripts/validate_control_transition.py"]
}
def extract_function(source,name):
 start=source.index("function "+name+"(")
 left=source.index("{",start)
 level=0
 for i in range(left,len(source)):
  if source[i]=="{":level+=1
  if source[i]=="}":
   level-=1
   if level==0:return source[start:i+1]+"\n"
 raise ValueError("JS function end missing: "+name)
def make(output):
 contents={}
 for category,paths in GROUPS.items():
  for p in paths:
   contents[f"{PREFIX}/{category}/{p}"]=(ROOT/p).read_bytes()
 contents[f"{PREFIX}/00_先读_标准纲领.md"]=(ROOT/"docs/templates/16c-story-map-standard/README.md").read_bytes()
 app=(ROOT/"app.js").read_text(encoding="utf-8")
 snips=[extract_function(app,s) for s in [
  "renderNineYearsWarImpact","renderEarlyRegionalImpactAreas",
  "renderControlAreas","focusEventFromSidebar"]]
 contents[f"{PREFIX}/04_专题与地图交互源程序/app.js_四项历史地图函数摘录.js"]="\n\n".join(snips).encode()
 stories=json.loads((ROOT/"data/stories/munster-desmond-1579-1586.json").read_text())
 if not any("[[" in p for s in stories["sections"] for p in s["paragraphs"]):
  raise ValueError("Published Tudor story is missing linkable event text")
 zones=json.loads((ROOT/"data/nine-years-war-operational-impact-1594-1599.geojson").read_text())
 for f in zones["features"]:
  p=f["properties"]
  if f["geometry"]["type"]=="Polygon" and (
   p["historical_boundary_confirmed"] is not False or
   p["fill_authorized"] is not False or
   p["area_sqkm"] is not None):
   raise ValueError("Unreviewed actual-area semantics in cited zone")
 head=subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT,text=True).strip()
 entries=[{"path":p,"size":len(b),"sha256":hashlib.sha256(b).hexdigest()}
          for p,b in sorted(contents.items())]
 manifest={"title":"爱英TV十六世纪写作、影响区和互动原始模板",
  "repository":"1959124923wyz-sys/love-British-TV",
  "source_commit":head,
  "note":"These are verified repository snapshots, not new territory claims.",
  "files":entries}
 contents[f"{PREFIX}/MANIFEST.json"]=(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n").encode()
 contents[f"{PREFIX}/SHA256SUMS.txt"]="".join(
  f'{v["sha256"]}  {v["path"]}\n' for v in entries).encode()
 output.parent.mkdir(parents=True,exist_ok=True)
 with ZipFile(output,"w",ZIP_DEFLATED,compresslevel=9) as z:
  for name,b in sorted(contents.items()):
   info=ZipInfo(name,(2026,10,21,0,0,0))
   info.compress_type=ZIP_DEFLATED
   info.create_system=3
   info.external_attr=(0o644<<16)
   z.writestr(info,b,compress_type=ZIP_DEFLATED,compresslevel=9)
 with ZipFile(output) as z:
  assert z.testzip() is None
  assert len(z.namelist())==len(contents)
 print(json.dumps({"path":str(output),"files":len(contents),
  "sha256":hashlib.sha256(output.read_bytes()).hexdigest()},ensure_ascii=False))
if __name__=="__main__":
 parser=ArgumentParser()
 parser.add_argument("--output",default="docs/templates/16c-story-map-standard/16C_stories_cartography_interaction_reference.zip")
 args=parser.parse_args()
 make(ROOT/args.output)
