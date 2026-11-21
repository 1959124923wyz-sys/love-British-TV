#!/usr/bin/env python3
"""Read-only period/geometry audit for Carolina 1700-1711.
All map polygons remain unchanged; a place in a large latitude/longitude
bounding box is not enough to prove English control or match a settlement.
"""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/"data/eighteenth-century-mass-schematic-zones-1700-1799.json"
OUT=ROOT/"docs/research/18C_5AH_CAROLINA_EXISTING_GEOMETRY_AUDIT.json"
M=json.loads(DATA.read_text(encoding="utf-8"))
# Interior large range only for candidate screening, NOT mapped territory.
BBOX=[-84,31,-75,37]
YEAR_START,YEAR_END=1700,1711

def during(r):
    return any(p["start_year"]<=YEAR_END and p["end_year"]>=YEAR_START
               for p in r.get("periods",[]))
def bbox_of(r):
    if r.get("bbox"):
        return r["bbox"]
    g=r.get("geometry") or {}
    if g.get("type")=="Point":
        x,y=g["coordinates"]
        return [x,y,x,y]
    if g.get("type") not in ("Polygon","MultiPolygon"):
        return None
    def coords(q):
        if isinstance(q,(list,tuple)) and len(q)>=2 and isinstance(q[0],(float,int)) and isinstance(q[1],(float,int)):
            yield (q[0],q[1])
        elif isinstance(q,(list,tuple)):
            for k in q:
                yield from coords(k)
    xy=list(coords(g["coordinates"]))
    return [min(x for x,y in xy),min(y for x,y in xy),max(x for x,y in xy),max(y for x,y in xy)]
def in_window(b):
    return bool(b and b[0]<BBOX[2] and b[2]>BBOX[0] and b[1]<BBOX[3] and b[3]>BBOX[1])
def row(o,layer):
    b=bbox_of(o)
    geom=o.get("geometry") or {}
    return {
      "id":o["id"],"title":o.get("title"),"kind":o.get("kind"),
      "layer":layer,"geometry_type":geom.get("type") or "rectangle_reference",
      "bbox":b,"periods":o.get("periods"),
      "source_urls":o.get("source_urls",[])[:4],
      "uncertain_line_dashed":o.get("uncertain_line_dashed"),
      "territorial_control_verified":o.get("territorial_control_verified"),
      "superseded_by":o.get("superseded_by"),
      "area_sqkm":o.get("area_sqkm"),
    }
layers=["zones","regional_zones","regional_sites","sites"]
period_rows={}
for layer in layers:
    arr=M.get(layer,[])
    period_rows[layer]=[row(o,layer) for o in arr if during(o) and in_window(bbox_of(o))]
    period_rows[layer].sort(key=lambda x:x["id"])
# Same-place and year candidates still require historic identity/manual cadastral proof.
text_keys=("carolina","charles","charleston","albemarle","bath","berne","bern","newburn","pamlico","neuse","edenton","chowan","carteret","y amassee")
name_hits={}
for layer in layers:
    name_hits[layer]=[row(o,layer) for o in M.get(layer,[])
        if any(q in (str(o.get("id",""))+" "+str(o.get("title",""))).lower() for q in text_keys)]
    name_hits[layer].sort(key=lambda x:x["id"])

old=next(z for z in M["zones"] if z["id"]=="CAROLINA_PROPRIETORS")
assert old.get("bbox")==[-83.8,31.3,-75.5,36.7]
assert old.get("periods")==[{"start_year":1700,"end_year":1711}]
assert old.get("superseded_by") is None
assert old.get("territorial_control_verified") is False
out={
 "schema":"editor42_5ah_1700_1711_existing_carolina_footprint_audit_v1",
 "read_only":True,"years":[YEAR_START,YEAR_END],
 "candidate_window_bbox":BBOX,
 "candidate_window_caveat":"Research selection rectangle only. This is not the charter, historic land boundary, British military control, indigenous border, or area statistic.",
 "chronology_base_original_zone":row(old,"zones"),
 "year_overlapping_local_records_count":{k:len(v) for k,v in period_rows.items()},
 "year_overlapping_local_records":period_rows,
 "toponym_hits_count":{k:len(v) for k,v in name_hits.items()},
 "toponym_hits":name_hits,
 "primary_same_period_map_sources":[
  {"year":1709,"author":"John Lawson","record":"A New Voyage to Carolina (map and contemporary description)","url":"https://www.loc.gov/item/02018519/","use":"coast/rivers/known towns, not proprietary or exact land parcel geometry"},
  {"year":1711,"author":"Thomas Nairne; Maurice Mathews; John Love","record":"A compleat description of the province of Carolina","url":"https://www.loc.gov/item/2004626926/","use":"improved part and coast separately, not a polygon of British command"},
  {"year":1700,"author":"State Archives of North Carolina","record":"Colonial Court Records (1665-1787), Land Office and pre-1800 grants","url":"https://appx.archives.ncdcr.gov/findingaids/SR_401_Colonial_Court_Records_G_.html","use":"specific grants require matched dated recorded plats before geometries"}],
 "do_not_substitute_1712_north_carolina_administration":True,
 "no_new_polygon_claimed":True,
 "no_automatic_supersession":True}
OUT.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("PASS 5AH historical footprint audit; candidates="+str(out["year_overlapping_local_records_count"]))
