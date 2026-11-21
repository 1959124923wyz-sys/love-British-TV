#!/usr/bin/env python3
"""Replace only identified unsurveyed rectangles with source-backed geo/point features.
All old dates, descriptions, raw bbox, references and proxy sites retained.
Large mass JSON receives minimal text insertions rather than rewriting 4+ MB.
"""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
masspath=ROOT/"data/eighteenth-century-mass-schematic-zones-1700-1799.json"
source=ROOT/"data/eighteenth-century-editor39-5ae-source-areas.geojson"
geo=json.loads(source.read_text())
assert geo["metadata"]["schema"]=="atlas-editor39-5ae-verified-geography-v1"
gis={f["id"] for f in geo["features"]}
mass=json.loads(masspath.read_text())
published={f["id"] for f in mass["regional_zones"]+mass["regional_lines"]+mass["regional_sites"]}
known=gis | published | {
 "EDITOR37_5AB_CIRCARS_BAY_SHORE","EDITOR37_5AB_GOLD_COAST_SHORE",
 "EDITOR37_5AC_COROMANDEL_COAST","EDITOR36_5Y_SURAT",
 "EDITOR38_5AD_BENARES_REVENUE"
}
SMALL={
 "B36-Z023":"EDITOR39_5AE_PROCLAMATION_NORTH",
 "B36-Z024":"EDITOR39_5AE_PROCLAMATION_SOUTH",
 "B36-Z088":"EDITOR39_5AE_COORG_MADIKERI_FORT",
 "B36-Z093":"MYSORE_SOUTHERN_CESSION_1799",
 "B36-Z110":"JAMAICA_MAIN_ISLAND",
 "B36-Z121":"EDITOR39_5AE_ST_VINCENT_ISLAND_CONTEXT",
 "B36-Z122":"EDITOR39_5AE_BALICEAUX_GARIFUNA_ISLAND",
 "B38-H-Z007":"EDITOR39_5AE_YORK_HUDSON_SHORE",
 "B38-H-Z016":"EDITOR39_5AE_RIVER_COPPERMINE",
 "B38-H-Z025":"EDITOR39_5AE_HUDSON_NORTH_SHORE",
 "B38-S-Z022":"EDITOR39_5AE_LENUD_FERRY_MARKER",
 "B38-S-Z033":"EDITOR39_5AE_CAROLINA_ATLANTIC_SHORE",
 "B38-S-Z048":"EDITOR39_5AE_CAROLINA_ATLANTIC_SHORE"
}
MASS={
 "OHIO_PROCLAMATION":"EDITOR39_5AE_PROCLAMATION_NORTH",
 "BELIZE_LOGGING":"EDITOR39_5AE_BELIZE_CARIBBEAN_SHORE",
 "NORTHERN_CIRCARS":"EDITOR37_5AB_CIRCARS_BAY_SHORE",
 "CARNATIC_RELATIONS":"EDITOR37_5AC_COROMANDEL_COAST",
 "SURAT_FACTORY":"EDITOR36_5Y_SURAT",
 "BENARES_ESTATES":"EDITOR38_5AD_BENARES_REVENUE",
 "SENEGAL_FORTS":"SENEGAL_NDAR_SAINT_LOUIS_FORT",
 "GOLD_COAST_TRADE":"EDITOR37_5AB_GOLD_COAST_SHORE",
 "FALKLAND_PAPER":"EDITOR39_5AE_FALKLANDS_ISLANDS_1774",
 "CORSICA_1794":"EDITOR39_5AE_CORSICA_ISLAND_1794"
}
need={"MYSORE_SOUTHERN_CESSION_1799","JAMAICA_MAIN_ISLAND"}
assert set(SMALL.values())|set(MASS.values()) <= known | need
# Backstop existing 18C source table IDs.
for key in need:assert key in published
paths=[
 "data/eighteenth-century-expansion-batch36-1700-1799.json",
 "data/eighteenth-century-b38-hudson-company.json",
 "data/eighteenth-century-b38-south-campaign.json"
]
replaced=set()
for path in paths:
 p=ROOT/path;data=json.loads(p.read_text())
 n=0;site_count=0
 for z in data["zones"]:
  if z["id"] in SMALL:
   assert not z.get("superseded_by") and z.get("bbox") and not z.get("geometry")
   assert z.get("source_urls") and z.get("periods")
   z["superseded_by"]=SMALL[z["id"]];replaced.add(z["id"]);n+=1
 for s in data["sites"]:
  if s.get("linked_zone_id") in SMALL:
   assert not s.get("superseded_by")
   s["superseded_by"]=SMALL[s["linked_zone_id"]];site_count+=1
 if n:
  p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
 print("UPDATED",path,n,"zones",site_count,"source site proxies")
assert replaced==set(SMALL),set(SMALL)-replaced
# On the heavy file only add a single property under the unique original id.
d=mass
lookup={z["id"]:z for z in d["zones"]}
assert set(MASS)<=set(lookup)
raw=masspath.read_text()
def insert_field(raw,id,new):
 pat=re.compile(r'(?m)^(?P<indent>[ \t]*)"id": "'+re.escape(id)+r'",\r?\n')
 hit=list(pat.finditer(raw))
 assert len(hit)==1,(id,len(hit))
 h=hit[0];indent=h.group("indent")
 return raw[:h.end()]+indent+'"superseded_by": "'+new+'",\n'+raw[h.end():]
for id,new in MASS.items():
 z=lookup[id]
 assert z.get("bbox") and not z.get("geometry") and not z.get("superseded_by")
 assert z.get("source_urls") and z.get("periods")
 raw=insert_field(raw,id,new)
mass_sites=0
for s in d.get("sites",[]):
 if s.get("linked_zone_id") in MASS:
  assert not s.get("superseded_by")
  raw=insert_field(raw,s["id"],MASS[s["linked_zone_id"]]);mass_sites+=1
changed=json.loads(raw)
for id,new in MASS.items():
 old=lookup[id];now=next(z for z in changed["zones"] if z["id"]==id)
 assert now.pop("superseded_by")==new and old==now
for s in d["sites"]:
 v=next(x for x in changed["sites"] if x["id"]==s["id"])
 if s.get("linked_zone_id") in MASS:
  assert v.pop("superseded_by")==MASS[s["linked_zone_id"]]
 assert s==v
assert len(changed["zones"])==81 and len(changed["sites"])==42
masspath.write_text(raw)
print("UPDATED massive map",len(MASS),"zones",mass_sites,"source sites; preserved all properties")
# Recount all listed 1700-1799 JSON the same way as the historical ledger.
unresolved=[]
for path in sorted((ROOT/"data").glob("eighteenth-century-*.json")):
 d=json.loads(path.read_text())
 for z in d.get("zones",[]):
  if z.get("bbox") and not z.get("geometry") and not z.get("superseded_by"):
   unresolved.append((path.name,z))
remaining_1799=sum(any(p["start_year"]<=1799<=p["end_year"] for p in z["periods"])
 for _,z in unresolved)
assert len(unresolved)==3 and remaining_1799==1,(len(unresolved),remaining_1799)
print("PASS 5AE: source evidence replaced",len(SMALL)+len(MASS),"old boxes;",
 "unresolved",len(unresolved),"in 1799",remaining_1799,
 "left:",[(f,z["id"]) for f,z in unresolved])
