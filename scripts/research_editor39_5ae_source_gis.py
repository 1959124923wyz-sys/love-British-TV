#!/usr/bin/env python3
"""5AE: source GIS only. Digitized 1763 Royal Proclamation line and Natural Earth coast.
The script never draws political areas from a reference bbox, routes from two points,
or georeferences historic maps without ground-control points.
"""
import json,urllib.request,urllib.parse
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ARC="https://services1.arcgis.com/VAI453sU9tG9rSmh/ArcGIS/rest/services/UsHist_13Colonies_features/FeatureServer/1"
NECOAST="https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_coastline.json"
NERIVERS="https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/physical/ne_10m_rivers_lake_centerlines.json"
NPS="https://www.nps.gov/subjects/teachingwithhistoricplaces/upload/Teaching-American-Indian-History-with-Primary-Sources-Compliant-1-2_508.pdf"
LINE_REFS=[ARC,"https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/proclamation-line-of-1763",NPS]
features=[]
sources=[]
def fetch(url):
 req=urllib.request.Request(url,headers={"User-Agent":"LoveBritishTV-5AE-evidence-audit/1.0"})
 with urllib.request.urlopen(req,timeout=90) as r:return json.loads(r.read())
def base(fid,title,kind,periods,summary,urls,precision,source_id=None):
 p={"stable_id":fid,"title":title,"kind":kind,"periods":periods,
  "historical_context":summary,"source_urls":list(dict.fromkeys(urls)),
  "geometry_precision":precision,"historical_boundary_confirmed":False,
  "territorial_control_verified":False,"uncertain_line_dashed":True,
  "area_sqkm":None,"exclude_from_area_aggregation":True}
 if source_id:p["source_geometry_id"]=source_id
 return p
def add(fid,geom,properties):
 assert geom["type"] in ("MultiLineString","LineString","Polygon","MultiPolygon","Point")
 features.append({"type":"Feature","id":fid,"geometry":geom,"properties":properties})
def valid(p):return isinstance(p,(list,tuple)) and len(p)>=2 and all(isinstance(v,(float,int)) and abs(v)<=180 if i==0 else abs(v)<=90 for i,v in enumerate(p[:2]))
def coords_from(geom):
 t=geom["type"];v=geom["coordinates"]
 if t=="LineString":return[v]
 if t=="MultiLineString":return v
 if t=="Polygon":return v
 if t=="MultiPolygon":return[r for poly in v for r in poly]
 return []
def runs_in_box(lines,box,min_len=4):
 west,south,east,north=box;out=[]
 for line in lines:
  cur=[]
  for c in line:
   good=valid(c) and west<=c[0]<=east and south<=c[1]<=north
   if good:cur.append([round(c[0],6),round(c[1],6)])
   else:
    if len(cur)>=min_len:out.append(cur)
    cur=[]
  if len(cur)>=min_len:out.append(cur)
 return out
def lines_geo(d):
 lines=[]
 for f in d["features"]:
  if not f.get("geometry"):continue
  for line in coords_from(f["geometry"]):
   if line and isinstance(line[0],(list,tuple)) and valid(line[0]):lines.append(line)
 return lines
def source_line(fid,title,periods,context,box,lines,urls,purpose,minimum=4):
 segs=runs_in_box(lines,box,minimum)
 if not segs:return
 prop=base(fid,title,purpose,periods,context,urls,
  "verbatim_source_GIS_vertices_clipped_at_bbox_without_interpolation")
 prop.update({"source_vertices":sum(len(x) for x in segs),"source_parts":len(segs),
   "source_coverage_box":box,"source_crossings_not_connected":True})
 add(fid,{"type":"MultiLineString","coordinates":segs},prop)
 print("SOURCED LINE",fid,"parts",len(segs),"vertices",prop["source_vertices"])
 return fid

# GIS base source: NPS-origin 1763 Proclamation line aligned by Maps.com to Natural Earth 10m.
# Do not invent source-to-source straight chords, only uninterrupted native vertices.
q=ARC+"/query?"+urllib.parse.urlencode({"where":"1=1","outFields":"*","outSR":"4326","f":"geojson"})
arc=fetch(q)
if arc.get("type")!="FeatureCollection":raise RuntimeError("1763 ArcGIS source not GeoJSON")
proclamation=lines_geo(arc)
if not proclamation:raise RuntimeError("1763 ArcGIS polyline empty")
sources.append({"url":q,"provider":"Maps.com from US National Park Service, Natural Earth 1:10m",
 "records":len(arc["features"]),"vertices":sum(map(len,proclamation))})
for fid,title,box in [
 ("EDITOR39_5AE_PROCLAMATION_NORTH","1763年王室公告线｜阿巴拉契亚北段",[-85.1,38.95,-76.1,45.2]),
 ("EDITOR39_5AE_PROCLAMATION_SOUTH","1763年王室公告线｜阿巴拉契亚南段",[-87.2,32.5,-78.1,39.0])
]:
 source_line(fid,title,[{"start_year":1763,"end_year":1775}],
  "1763年10月7日王室公告试图限制阿巴拉契亚山脉西侧殖民者的未经批准迁入。1768年后多项边界条约改变相关土地交涉及移居条件。",
  box,proclamation,LINE_REFS,"historic_proclamation_line",3)

# Physical geography: separate raw shore segments from worldwide Natural Earth 1:50m.
# Clipped paths remain physically measured edges, never ships' routes or concession borders.
try:
 coast=fetch(NECOAST)
 coastlines=lines_geo(coast);sources.append({"url":NECOAST,"provider":"Natural Earth 1:50m coastlines",
  "records":len(coast.get("features",[]))})
 for fid,title,box,years,ctx in [
  ("EDITOR39_5AE_BELIZE_CARIBBEAN_SHORE","伯利兹海岸线｜采木与航运沿岸自然地理",
   [-89.20,16.7,-87.0,19.0],[{"start_year":1783,"end_year":1800}],
   "1783年英国与西班牙条约规定英人采伐染料木的许可，1786年协定扩大许可。采伐及木材出口主要围绕伯利兹河口、近岸水道和港口展开。"),
  ("EDITOR39_5AE_YORK_HUDSON_SHORE","哈德孙湾西南岸｜约克工厂海湾自然地理",
   [-96.3,55.5,-87.1,61.2],[{"start_year":1713,"end_year":1800}],
   "约克工厂所在海湾沿岸是英国哈德孙湾公司商业船只抵达的地区；实际海上航迹随季节、冰况及航行而异。"),
  ("EDITOR39_5AE_HUDSON_NORTH_SHORE","哈德孙湾北岸｜王室公司纸面特许地理",
   [-105.0,58.0,-79.0,66.2],[{"start_year":1700,"end_year":1800}],
   "1670年英王向哈德孙湾公司授予独占商业权利，实际沿岸商站、原住民族治理与大范围的特许主张存在差别。"),
  ("EDITOR39_5AE_CAROLINA_ATLANTIC_SHORE","卡罗来纳沿海曲折岸线｜独立战争交通地理",
   [-82.0,30.8,-78.5,35.2],[{"start_year":1780,"end_year":1781}],
   "1780—1781年英军在查尔斯敦、萨凡纳、卡姆登等驻地之间调拨兵员和物资；各河口与港口运输地理不同于军队实际行军线路。")
 ]:
  source_line(fid,title,years,ctx,box,coastlines,[NECOAST,
   "https://parks.canada.ca/lhn-nhs/mb/yorkfactory/info/commemoration" if "HUDSON" in fid or "YORK" in fid else
   "https://www.loc.gov/item/86692594/" if "BELIZE" in fid else
   "https://www.nps.gov/cowp/learn/historyculture/southerncampaign.htm"],
   "physical_coastline",5)
except Exception as e:print("OPTIONAL COASTLINE source download failed",repr(e))
# Named original source rivers; no misleading straight route across land/sea.
try:
 rivers=fetch(NERIVERS)
 named={}
 for item in rivers.get("features",[]):
  p=item.get("properties") or {}
  name=" ".join(str(v) for k,v in p.items() if "name" in k.lower() and isinstance(v,str))
  for word in ["Santee","Hondo","Belize","Sibun","Coppermine"]:
   if word.lower() in name.lower() and item.get("geometry"):
    named.setdefault(word,[]).extend(coords_from(item["geometry"]))
 for word,box,title,yearspan,reference in [
  ("Santee",[-81.5,32.7,-79.5,34.5],"桑蒂河｜1780年莱努德渡口历史战地", [{"start_year":1780,"end_year":1781}],"https://nationalregister.sc.gov/SurveyReports/HC08002.pdf"),
  ("Hondo",[-90.1,17.7,-87.7,19.2],"洪多河｜1783年采木许可北侧界河",[{"start_year":1783,"end_year":1800}],"https://www.loc.gov/item/86692594/"),
  ("Belize",[-89.9,16.9,-87.7,18.2],"伯利兹河｜1783及1786年采木许可界河",[{"start_year":1783,"end_year":1800}],"https://www.loc.gov/item/86692594/"),
  ("Sibun",[-89.1,16.7,-87.7,17.65],"锡本河｜1786年扩展采木许可南界",[{"start_year":1786,"end_year":1800}],"https://www.loc.gov/item/86692594/"),
  ("Coppermine",[-119.0,64.0,-110.0,69.0],"铜矿河｜1771年马托纳比带领赫恩到达",[{"start_year":1771,"end_year":1772}],"https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=1140")
 ]:
  print("NATURAL EARTH river candidates",word,len(named.get(word,[])))
  source_line("EDITOR39_5AE_RIVER_"+word.upper(),title,yearspan,
   "历史文献记录了该河与相关军事或商业事件的联系；河道为自然地理资料。",
   box,named.get(word,[]),[NERIVERS,reference],"physical_river",4)
 sources.append({"url":NERIVERS,"provider":"Natural Earth 1:10m named rivers",
  "named_segments":{word:len(data) for word,data in named.items()}})
except Exception as e:print("OPTIONAL RIVERS download failed",repr(e))

# Verbatim existing source-backed historic island and 1773 Carib treaty topology.
m=json.loads((ROOT/"data/eighteenth-century-mass-schematic-zones-1700-1799.json").read_text())
idx={x["id"]:x for x in [*m["regional_zones"],*m["regional_lines"]]}
for sourceid,id,title,context,kind,years in [
 ("BALICEAUX_GARIFUNA_DETENTION_ISLAND","EDITOR39_5AE_BALICEAUX_GARIFUNA_ISLAND",
 "巴利索岛｜1796—1797加里富纳拘留与强制驱逐",
 "1796年英国殖民军将加里富纳居民成批押往巴利索岛。1797年英国船队强行将幸存者转送罗阿坦岛。",
 "forced_deportation_island",[{"start_year":1796,"end_year":1797}]),
 ("ST_VINCENT_MAIN_ISLAND_18C","EDITOR39_5AE_ST_VINCENT_ISLAND_CONTEXT",
 "圣文森特本岛｜加里富纳土地、英法战争与英国殖民扩张",
 "圣文森特岛的加里富纳和卡利纳戈社群与英国殖民当局发生长期土地冲突。1773年订立条约后矛盾延续，1795—1796年再次战争，1797年大批加里富纳人被殖民政府强行流放。",
 "indigenous_land_island_context",[{"start_year":1763,"end_year":1797}]),
 ("ST_VINCENT_CARIB_TREATY_DIVIDE","EDITOR39_5AE_ST_VINCENT_1773_TREATY_DIVIDE",
 "圣文森特｜1773年加里富纳土地条约界线",
 "1773年2月英方与加里富纳人签订条约，界定保留地的一部分；殖民扩张和当地反抗继续发生。",
 "historic_indigenous_treaty_line",[{"start_year":1773,"end_year":1778}])
]:
 orig=idx[sourceid];geom=orig["geometry"]
 p=base(id,title,kind,years,context,orig["source_urls"],
  "verbatim_existing_historic_map_registered_geometry_not_colonial_area",sourceid)
 p["source_vertices"]=sum(len(line) for line in coords_from(geom))
 add(id,geom,p)
 print("REUSED HISTORICAL GIS",id,geom["type"],p["source_vertices"])
output={"type":"FeatureCollection","metadata":{
 "schema":"atlas-editor39-5ae-verified-geography-v1",
 "source_primary_1763_arcgis":ARC,"source_primary_1773_st_vincent":"https://www.loc.gov/item/74691610/",
 "source_gis_sources":sources,"area_aggregation_forbidden":True,
 "no_invented_concession_polygons":True,"no_invented_sea_or_army_routes":True,
 "feature_count":len(features),"historic_polygons":len([f for f in features if f["geometry"]["type"] in ("Polygon","MultiPolygon")]),
 "natural_lines":len([f for f in features if f["properties"]["kind"] in ("physical_coastline","physical_river")])
 }, "features":features}
assert len(features)>=5 and any(f["id"]=="EDITOR39_5AE_BALICEAUX_GARIFUNA_ISLAND" for f in features)
out=ROOT/"data/eighteenth-century-editor39-5ae-source-areas.geojson"
out.write_text(json.dumps(output,ensure_ascii=False,separators=(",",":"))+"\n")
print("PUBLISHED SOURCE-ONLY GIS",len(features),"features",out.stat().st_size,"bytes")
