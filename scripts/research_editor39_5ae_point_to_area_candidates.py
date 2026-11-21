#!/usr/bin/env python3
"""Audit where currently visible Eighteenth Century point markers can become sourced polygons.
Read-only heuristic shortlist: NEVER automatically infer a region or administrative control.
"""
import json,math
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def J(p):return json.loads((root/p).read_text())
mass=J("data/eighteenth-century-mass-schematic-zones-1700-1799.json")
shapes=[f for f in mass["regional_zones"] if f.get("geometry",{}).get("type") in ("Polygon","MultiPolygon")]
for f in J("data/eighteenth-century-editor39-5ae-source-areas.geojson")["features"]:
 if f["geometry"]["type"] in ("Polygon","MultiPolygon"):
  shapes.append(dict(f["properties"],id=f["id"],geometry=f["geometry"]))
for fn in ["data/eighteenth-century-editor37-5ab-physical-areas.geojson",
           "data/eighteenth-century-editor37-5ac-surveyed-geography.geojson"]:
 for f in J(fn)["features"]:
  if f["geometry"]["type"] in ("Polygon","MultiPolygon"):
   shapes.append(dict(f["properties"],id=f["id"],geometry=f["geometry"]))
sites=[]
for f in J("data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson")["features"]:
 if f["geometry"]["type"]=="Point":
  sites.append({"id":f["id"],"title":f["properties"]["title"],
   "coordinates":f["geometry"]["coordinates"],"periods":f["properties"]["periods"],"file":"5ad"})
for f in J("data/eighteenth-century-editor36-5y-named-sites.json")["sites"]:
 sites.append({"id":f["id"],"title":f["title"],"coordinates":f["coordinates"],"periods":f["periods"],"file":"5y"})
for fn in ["data/eighteenth-century-editor37-5ab-physical-areas.geojson",
           "data/eighteenth-century-editor37-5ac-surveyed-geography.geojson"]:
 for f in J(fn)["features"]:
  if f["geometry"]["type"]=="Point":
   sites.append({"id":f["id"],"title":f["properties"]["title"],
    "coordinates":f["geometry"]["coordinates"],"periods":f["properties"]["periods"],"file":fn.split("/")[-1]})
def all_xy(geometry):
 t=geometry["type"];raw=geometry["coordinates"]
 if t=="Polygon":return [q for r in raw for q in r]
 if t=="MultiPolygon":return [q for poly in raw for r in poly for q in r]
 return []
boxes=[]
for f in shapes:
 xy=all_xy(f["geometry"])
 if not xy:continue
 a=[min(p[0] for p in xy),min(p[1] for p in xy),max(p[0] for p in xy),max(p[1] for p in xy)]
 boxes.append((f,a))
def dist(p,box):
 lon,lat=p;w,s,e,n=box
 cl=max(w,min(lon,e));ct=max(s,min(lat,n))
 return math.hypot((lon-cl)*111.2*math.cos(math.radians(lat)),(lat-ct)*111.2)
def date_overlap(a,b):
 return any(x["start_year"]<=y["end_year"] and y["start_year"]<=x["end_year"] for x in a for y in b)
all_matches=[]
for p in sites:
 nearby=[]
 for f,b in boxes:
  km=dist(p["coordinates"],b)
  if km>2:continue
  if not date_overlap(p["periods"],f.get("periods") or p["periods"]):continue
  # Filter large historic provinces by footprint size, since a site cannot be the province.
  width=(b[2]-b[0])*111.2*math.cos(math.radians(p["coordinates"][1]))
  height=(b[3]-b[1])*111.2
  if width*height>25:continue
  nearby.append({"shape_id":f["id"],"title":f.get("title"),"nearest_bbox_km":round(km,3),
   "bbox_km":[round(width,2),round(height,2)],"source_urls":f.get("source_urls",[])[:2]})
 nearby.sort(key=lambda z:z["nearest_bbox_km"])
 if nearby:all_matches.append({**p,"candidate_polygons":nearby[:4]})
# Derive verified promotions from the authoritative crosswalk rather than resetting
# manually reviewed candidates to zero whenever this research utility is run.
promotions=J("data/eighteenth-century-editor39-5ae-point-area-promotions.json")
verified_ids={r["id"] for r in promotions["point_markers_replaced_by_existing_polygons"]}
listed_ids={x["id"] for x in all_matches}
assert verified_ids<=listed_ids,("promoted source sites missing",verified_ids-listed_ids)
for item in all_matches:
 item["promotion_status"]=(
  "promoted_existing_surveyed_polygon" if item["id"] in verified_ids
  else "requires_further_historical_scope_review"
 )
payload={"schema":"editor39_5ae_site_point_to_area_candidates_v1",
 "site_count":len(sites),
 "confirmed_upgrades":len(verified_ids),
 "confirmed_upgrade_ids":sorted(verified_ids),
 "pending_upgrades":len(all_matches)-len(verified_ids),
 "manual_verification_required":True,
 "candidate_site_count":len(all_matches),"candidates":all_matches}
out=root/"docs/research/18C_5AE_POINT_AREA_CANDIDATES.json"
out.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n")
print("POINTS",len(sites),"NEAR VERIFIED SOURCE POLYGONS",len(all_matches))
for item in all_matches[:50]:
 print(item["id"],item["title"],[(x["shape_id"],x["nearest_bbox_km"]) for x in item["candidate_polygons"]])
