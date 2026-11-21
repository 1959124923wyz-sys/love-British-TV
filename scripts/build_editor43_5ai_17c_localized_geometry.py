#!/usr/bin/env python3
"""Generate natural island coastlines + exact historical place anchors, not sovereignty boundaries.

Requirements: pyshp, shapely. Input Natural Earth 10m land 5.1.1.\nSource archive checksum is recorded in generated metadata for reproducibility.
Original 17C paper-claim and research-study GeoJSON datasets are immutable archives.
"""
import hashlib
import io
import json
import urllib.request
import zipfile
from pathlib import Path
import shapefile
from shapely.geometry import Point, mapping, shape

ROOT=Path(__file__).resolve().parents[1]
CLAIMS=ROOT/"data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson"
STUDIES=ROOT/"data/seventeenth-century-regional-studies-1600-1699.geojson"
OUT=ROOT/"data/seventeenth-century-editor43-5ai-localized-geometries-1600-1699.geojson"
URL="https://naturalearth.s3.amazonaws.com/10m_physical/ne_10m_land.zip"
claims=json.loads(CLAIMS.read_text(encoding="utf-8"))
studies=json.loads(STUDIES.read_text(encoding="utf-8"))
by_claim={f["id"]:f for f in claims["features"]}
by_study={f["id"]:f for f in studies["features"]}
STUDY_IDS={
"17c-ne-pequot-war-saybrook-mystic-1637-study",
"17c-va-first-war-jamestown-kecoughtan-1610-study",
"17c-jamaica-rio-nuevo-1658-reading-envelope",
"17c-ny-1643-pavonia-corlears-hook-education-only",
"17c-car-1680-charlestown-two-sites-nonmetric-reader",
"17c-hbc-1686-three-james-bay-forts-review-box",
"17c-acadia-1629-two-portroyal-sites-distinct",
"17c-acadia-1690-phips-portroyal-nonmetric-raid",
"17c-acadia-1696-beaubassin-nonmetric-raid",
"17c-editor10-newfoundland-1696-ferryland-raid",
"17c-editor10-newfoundland-1696-stjohns-raid",
"17c-editor11-nav-1667-medway-river-reading-frame"
}
COASTS=[
 # bbox/anchor are spatial index selectors ONLY, NEVER a human-crafted border.
 ("EDITOR43_5AI_ST_HELENA_ISLAND","claim-st-helena-1659",1659,1699,-5.715,-15.95,[-5.95,-16.22,-5.35,-15.68],"圣赫勒拿岛｜真实自然海岸"),
 ("EDITOR43_5AI_PROVIDENCIA_ISLAND","claim-providence-island-1630",1630,1640,-81.37,13.35,[-81.62,13.13,-81.12,13.65],"普罗维登西亚本岛｜真实自然海岸"),
 ("EDITOR43_5AI_ST_KITTS_ISLAND","claim-st-kitts-nevis-1623",1623,1631,-62.74,17.32,[-63.16,16.9,-62.3,17.65],"圣基茨本岛｜真实自然海岸"),
 ("EDITOR43_5AI_NEVIS_ISLAND","claim-st-kitts-nevis-1623",1628,1631,-62.59,17.15,[-62.82,17.00,-62.41,17.32],"尼维斯本岛｜真实自然海岸")
]
CLAIM_POINTS={
 "claim-quebec-kirke-1629":("1620S-E030","魁北克旧城｜1629—1632英军驻点"),
 "claim-rhode-island-1663":(None,"普罗维登斯聚落｜1663王室特许背景"),
 "claim-tangier-english-garrison-1662":("1660S-E123","丹吉尔港城｜1662—1683英方驻军"),
 "claim-cape-coast-castle-1665":("1660S-E124","海岸角城堡｜1665以后英商堡"),
 "claim-bombay-east-india-company-1668":("1660S-E046","孟买岛旧港｜1668公司驻点"),
 "claim-madras-fort-st-george-1640":("1630S-E020","马德拉斯圣乔治堡｜1640后商站"),
 "claim-eic-surat-factory-1612":("1610S-E026","苏拉特商馆｜莫卧儿治下英商据点"),
 "claim-eic-hugli-bengal-1651":("1650S-E033","胡格利英商馆｜1651后莫卧儿治下"),
 "claim-eic-calcutta-sutanati-1690":("1690S-E135","苏塔努蒂三村｜1690年代商站"),
 "claim-eic-bencoolen-1685":("1680S-E033","明古伦约克堡｜1687年建堡"),
 "claim-eic-bantam-1602":("1620S-E024","万丹商馆｜英荷商馆竞争")
}
assert len(COASTS)==4 and len(CLAIM_POINTS)==11 and len(STUDY_IDS)==12
assert len({t[1] for t in COASTS})==3
assert len({*CLAIM_POINTS,*[t[1] for t in COASTS]})==14

all_events={}
for decade in range(1600,1700,10):
    d=json.loads((ROOT/f"data/atlas-{decade}-{decade+9}.json").read_text(encoding="utf-8"))
    for e in d["events"]:
        assert e["id"] not in all_events
        all_events[e["id"]]=e

req=urllib.request.Request(URL,headers={"User-Agent":"LoveBritishTVAtlas-Research/5AI (+Natural Earth PD)"})
with urllib.request.urlopen(req,timeout=90) as r:
    content=r.read()
assert len(content)>100000, "Natural Earth download unexpectedly small"
digest=hashlib.sha256(content).hexdigest()
with zipfile.ZipFile(io.BytesIO(content)) as z:
    shp=next(n for n in z.namelist() if n.lower().endswith(".shp"))
    stem=shp[:-4]
    files={ext:io.BytesIO(z.read(next(n for n in z.namelist() if n.lower()==stem.lower()+ext)))
           for ext in (".shp",".shx",".dbf")}
    reader=shapefile.Reader(shp=files[".shp"],shx=files[".shx"],dbf=files[".dbf"])
    lands=[]
    for rec in reader.iterShapes():
        geom=shape(rec.__geo_interface__)
        if geom.is_valid and geom.geom_type in ("Polygon","MultiPolygon"):
            lands.extend([geom] if geom.geom_type=="Polygon" else list(geom.geoms))
assert len(lands)>400

features=[]
for new_id,old_id,start,end,lon,lat,expected_bbox,label in COASTS:
    p=Point(lon,lat)
    choices=[g for g in lands if g.contains(p)]
    if not choices:
        choices=sorted((g for g in lands if g.distance(p)<0.024),key=lambda g:g.distance(p))[:1]
    assert len(choices)==1, f"Natural Earth ambiguous or missing source island {new_id} {len(choices)}"
    island=choices[0]
    assert island.area>0
    minx,miny,maxx,maxy=island.bounds
    w,s,e,n=expected_bbox
    assert w<=minx<maxx<=e and s<=miny<maxy<=n, (new_id,island.bounds)
    assert (maxx-minx)>.012 and (maxy-miny)>.012
    simplified=island.simplify(0.000095,preserve_topology=True)
    assert simplified.is_valid and simplified.geom_type=="Polygon"
    assert simplified.area/island.area>.998
    coords=mapping(simplified)["coordinates"]
    assert len(coords[0])>=7 and len(coords[0])<1500,(new_id,len(coords[0]))
    old=by_claim[old_id]
    assert old["properties"]["start_year"]<=start<=end<=old["properties"]["end_year"]
    feature={"type":"Feature","id":new_id,"geometry":{"type":"Polygon","coordinates":coords},
    "properties":{
      "stable_id":new_id,"supersedes_visual_reference":old_id,
      "name":label,"start_year":start,"end_year":end,
      "description":old["properties"]["description"],"summary_zh":old["properties"]["summary_zh"],
      "display_kind":"natural_island_coastline",
      "geometry_precision":"natural_earth_10m_land_5_1_1_modern_physical_coastline",
      "geometry_verified_as_historical_border":False,"historical_boundary_confirmed":False,
      "territorial_claim":False,"territorial_control_verified":False,"fill_authorized":False,
      "area_sqkm":None,"exclude_from_area_aggregation":True,"uncertain_line_dashed":True,
      "country_control_not_inferred":True,"historic_evidence_urls":old["properties"]["source_urls"],
      "geometry_source_url":URL,"dataset_source_url":"https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/",
      "source_urls":old["properties"]["source_urls"]+["https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/"],
      "related_event_ids":old["properties"]["related_event_ids"],
      "geometry_sha256":hashlib.sha256(json.dumps(coords,separators=(",",":")).encode()).hexdigest(),
      "geolocation_limit_zh":"现代自然地理海岸线，作为岛屿位置背景；历史英法、荷英、地方权属按同期事件与驻点核定。"
    }}
    features.append(feature)

for old_id,(event_id,label) in CLAIM_POINTS.items():
    old=by_claim[old_id]
    o=old["properties"]
    if event_id:
        e=all_events[event_id]
        assert isinstance(e["lng"],(int,float)) and isinstance(e["lat"],(int,float))
        lon,lat=e["lng"],e["lat"]
        assert event_id in o["related_event_ids"], (old_id,event_id)
    else:
        # Reuse extant published modern Providence locality, not a reconstructed charter outline.
        f=next(x for x in json.loads((ROOT/"data/seventeenth-century-spatial-evidence-1600-1699.geojson").read_text(encoding="utf-8"))["features"]
            if x["id"]=="17c-ne-providence-captivity-1676")
        lon,lat=f["geometry"]["coordinates"]
        assert old_id=="claim-rhode-island-1663"
    xy=old["geometry"]["coordinates"][0]
    assert min(z[0] for z in xy)<=lon<=max(z[0] for z in xy),(old_id,lon)
    assert min(z[1] for z in xy)<=lat<=max(z[1] for z in xy),(old_id,lat)
    new_id="EDITOR43_5AI_CLAIM_PLACE_"+old_id.upper().replace("-","_").replace("CLAIM_","")
    features.append({"type":"Feature","id":new_id,"geometry":{"type":"Point","coordinates":[lon,lat]},
    "properties":{
      "stable_id":new_id,"supersedes_visual_reference":old_id,"name":label,
      "start_year":o["start_year"],"end_year":o["end_year"],"display_kind":"named_historic_place",
      "description":o["description"],"summary_zh":o["summary_zh"],
      "geometry_precision":"documented_named_place_modern_reference_point",
      "historical_boundary_confirmed":False,"territorial_claim":False,
      "territorial_control_verified":False,"fill_authorized":False,
      "area_sqkm":None,"exclude_from_area_aggregation":True,"uncertain_line_dashed":True,
      "related_event_ids":o["related_event_ids"],"anchor_event_id":event_id,
      "source_urls":o["source_urls"],"label_type":o["label_type"],
      "geolocation_limit_zh":"由仓库已有史料地图事件的现代地名坐标定位，保留原法律／公司史料；不把地点点位变成产业辖区。"
    }})

for old_id in sorted(STUDY_IDS):
    old=by_study[old_id]
    o=old["properties"]
    assert o["anchor_places"]
    for i,place in enumerate(o["anchor_places"],1):
        event_id=place["source_event_id"]
        e=all_events[event_id]
        assert e["lng"]==place["lon"] and e["lat"]==place["lat"],(old_id,event_id)
        features.append({"type":"Feature","id":"EDITOR43_5AI_STUDY_"+old_id.upper().replace("-","_").replace("17C_","")+"_"+str(i),
        "geometry":{"type":"Point","coordinates":[place["lon"],place["lat"]]},
        "properties":{
          "stable_id":"EDITOR43_5AI_STUDY_"+old_id.upper().replace("-","_").replace("17C_","")+"_"+str(i),
          "supersedes_visual_reference":old_id,"name":place["name"],
          "start_year":o["start_year"],"end_year":o["end_year"],
          "description":o.get("description",""),"summary_zh":o.get("summary_zh",o.get("description","")),
          "display_kind":"dated_event_place",
          "geometry_precision":"source_registered_modern_atlas_event_point",
          "historical_boundary_confirmed":False,"territorial_claim":False,
          "territorial_control_verified":False,"fill_authorized":False,
          "area_sqkm":None,"exclude_from_area_aggregation":True,"uncertain_line_dashed":True,
          "related_event_ids":o["related_event_ids"],"anchor_event_id":event_id,
          "source_urls":o["source_urls"],
          "geolocation_limit_zh":"使用原研究区中已核来源事件的具名地点坐标；旧研究框原始坐标和史料保存在原GeoJSON。"
        }})

assert len(features)==4+11+sum(len(by_study[x]["properties"]["anchor_places"]) for x in STUDY_IDS)
assert len({f["id"] for f in features})==len(features)
mapped={f["properties"]["supersedes_visual_reference"] for f in features}
assert len(mapped)==26
assert mapped==STUDY_IDS | set(CLAIM_POINTS)|{t[1] for t in COASTS}
assert sum(f["geometry"]["type"]=="Polygon" for f in features)==4
out={"type":"FeatureCollection","metadata":{
    "schema":"atlas-17c-editor43-5ai-physical-islands-and-located-reference-sites-v1",
    "source_version":"Natural Earth 10m land v5.1.1",
    "source_url":URL,"natural_earth_zip_sha256":digest,
    "license_url":"https://www.naturalearthdata.com/about/terms-of-use/",
    "historical_polygons_authorized":0,
    "modern_physical_island_coastline_polygons":4,
    "original_rectangular_source_ids_retired_from_display":26,
    "original_claim_rectangles_retired":14,"original_study_rectangles_retired":12,
    "source_archives_unchanged":True,
    "unique_original_source_ids":sorted(mapped),
    "new_features_count":len(features),
    "no_historical_sovereignty_inferred":True,
    "notes":"Exact Natural Earth modern island coast plus dated original Atlas event localities, not historical British territory. All original 26 reference polygons remain source-preserved in their original files."
}, "features":features}
OUT.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("PASS 5AI: NE 10m ZIP",digest,"3 former island frames -> 4 coast polygons; other 23 frames ->",len(features)-4,"source-registered places")
