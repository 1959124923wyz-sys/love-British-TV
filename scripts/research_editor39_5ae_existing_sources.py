#!/usr/bin/env python3
"""Inventory actual published coastline and historic treaty geometry in repository.
Read-only probe: no inference from a bounding box. Outputs abbreviated source anchors for 5AE.
"""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
FILES=[
"data/eighteenth-century-mass-schematic-zones-1700-1799.json",
"data/nineteenth-century-territorial-areas-batch7.geojson",
"data/nineteenth-century-spatial-1800-1819.geojson",
"data/eighteenth-century-editor37-5ab-physical-areas.geojson",
"data/eighteenth-century-editor37-5ac-surveyed-geography.geojson",
"data/eighteenth-century-editor36-5z-waterways.geojson",
]
WORDS=("vincent","ballice","garifuna","carib","proclamation","boundary","appalach",
"belize","black creek","new river","hondo","sibun","lenu","ferry","hudson","hearne",
"treaty","kingstown","greene","charleston","slave lake","coppermine")
def vertices(x):
 if not isinstance(x,list):return 0
 if len(x)>1 and all(isinstance(t,(int,float)) for t in x[:2]):return 1
 return sum(vertices(t) for t in x)
def bbox(coords):
 out=[]
 def walk(x):
  if isinstance(x,list) and len(x)>1 and isinstance(x[0],(int,float)) and isinstance(x[1],(int,float)):out.append(x[:2])
  elif isinstance(x,list):
   for z in x:walk(z)
 walk(coords)
 return [round(min(q[0] for q in out),5),round(min(q[1] for q in out),5),round(max(q[0] for q in out),5),round(max(q[1] for q in out),5)] if out else None
output={"schema":"editor39_5ae_geometry_inventory_v1","files":[]}
for path in FILES:
 f=ROOT/path
 if not f.exists():raise RuntimeError("missing "+path)
 d=json.loads(f.read_text())
 groups={k:d.get(k,[]) for k in ["regional_zones","regional_lines","coastal_rights","zones","features","control_sites","approved_actual_control_polygons"] if isinstance(d.get(k),list)}
 entries=[]
 for name,items in groups.items():
  for item in items:
   prop=item.get("properties",item);raw=" ".join(str(prop.get(k,"")) for k in ["id","stable_id","title","name","description","kind","map_source","source_key"])
   hit=[w for w in WORDS if w in raw.lower()]
   if not hit:continue
   geo=item.get("geometry") or {}
   entries.append({"group":name,"id":item.get("id"),"title":prop.get("title") or prop.get("name"),
    "hits":hit,"kind":prop.get("kind"),"type":geo.get("type"),
    "vertices":vertices(geo.get("coordinates",[])),"bbox":bbox(geo.get("coordinates",[])),
    "precision":prop.get("geometry_precision") or prop.get("source_geometry") or prop.get("source_dataset"),
    "source_urls":(prop.get("source_urls") or [])[:3],
    "periods":prop.get("periods") or []})
 output["files"].append({"path":path,"size_bytes":f.stat().st_size,"counts":{k:len(v) for k,v in groups.items()},"matches":entries})
p=ROOT/"docs/research/18C_5AE_EXISTING_GEOMETRY_INVENTORY.json"
p.parent.mkdir(parents=True,exist_ok=True)
p.write_text(json.dumps(output,ensure_ascii=False,indent=2)+"\n")
print("WROTE",p,"matching",sum(len(f["matches"]) for f in output["files"]))
for file in output["files"]:
 print(file["path"],file["counts"],[(x["id"],x["type"],x["vertices"],x["bbox"]) for x in file["matches"][:24]])

# All known 18C JSON source records with unresolved legacy bounding boxes,
# including the large 4MB bulk dataset (read locally, never truncated).
old=[]
for p in sorted((ROOT/"data").glob("eighteenth-century-*.json")):
 try:d=json.loads(p.read_text())
 except Exception as e:raise RuntimeError("Unreadable JSON "+str(p)) from e
 for z in d.get("zones",[]):
  if isinstance(z.get("bbox"),list) and not z.get("geometry") and not z.get("superseded_by"):
   old.append({"file":str(p.relative_to(ROOT)),"id":z.get("id"),"title":z.get("title"),
    "kind":z.get("kind"),"periods":z.get("periods"),"bbox":z.get("bbox"),
    "source_urls":z.get("source_urls",[])})
p=ROOT/"docs/research/18C_5AE_OLD_RECTANGLE_INVENTORY.json"
p.write_text(json.dumps({"schema":"editor39_5ae_unresolved_rectangles_v1","count":len(old),
 "active_1799":sum(any(q["start_year"]<=1799<=q["end_year"] for q in z.get("periods",[])) for z in old),
 "records":old},ensure_ascii=False,indent=2)+"\n")
print("UNRESOLVED legacy boxes",len(old),"active1799",
 sum(any(q["start_year"]<=1799<=q["end_year"] for q in z.get("periods",[])) for z in old))

# Concise lookup for all 18C published true polygons/lines; useful for eliminating
# redundant rectangles without duplicated or invented geometry.
mass=json.loads((ROOT/"data/eighteenth-century-mass-schematic-zones-1700-1799.json").read_text())
all_geos=[]
for kind in ["regional_zones","regional_lines","coastal_rights","regional_sites"]:
 for z in mass.get(kind,[]):
  g=z.get("geometry") or {}
  if g.get("type") not in {"Point","Polygon","MultiPolygon","LineString","MultiLineString"}:continue
  all_geos.append({"id":z.get("id"),"group":kind,"title":z.get("title"),"kind":z.get("kind"),
   "geometry_type":g.get("type"),"vertices":vertices(g.get("coordinates",[])),
   "bbox":bbox(g.get("coordinates",[])),"periods":z.get("periods"),
   "source_urls":(z.get("source_urls") or [])[:3]})
p=ROOT/"docs/research/18C_5AE_ALL_PUBLISHED_SHAPES.json"
p.write_text(json.dumps({"schema":"editor39_5ae_all_published_source_shapes_v1","count":len(all_geos),
 "shapes":all_geos},ensure_ascii=False,indent=2)+"\n")
print("PUBLISHED polygon/line/point GIS anchors",len(all_geos))

words=("carolin","surat","benar","senegal","gold","coast","circars","carnatic",
 "corsic","falkland","austral","new south wales","hudson","belize","jamaica",
 "mysore","georgia","niagara","kingstown","ballice","vincent")
short=[{"id":x["id"],"title":x["title"],"type":x["geometry_type"],
 "group":x["group"],"vertices":x["vertices"],"bbox":x["bbox"],
 "years":[(p.get("start_year"),p.get("end_year")) for p in x.get("periods") or []]}
 for x in all_geos if any(w in (str(x["id"])+" "+str(x["title"])).lower() for w in words)]
p=ROOT/"docs/research/18C_5AE_HISTORIC_SHAPE_SHORTLIST.json"
p.write_text(json.dumps({"schema":"editor39_5ae_shortlist_v1","count":len(short),"shapes":short},ensure_ascii=False,indent=1)+"\n")
print("GEOGRAPHIC shortlist",len(short))
