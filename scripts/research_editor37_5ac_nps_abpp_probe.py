#!/usr/bin/env python3
"""Source probe: read NPS ABPP actual Revolutionary War battlefield survey polygons.
Only prints NPS geodata into Actions log. No fabricated vertex, no spatial claims.
"""
import json,sys,urllib.parse,urllib.request,math
BASE="https://services1.arcgis.com/fBc8EJBxQRMcHlei/ArcGIS/rest/services/ABPP_BattlefieldBndry_Update_gdb/FeatureServer/7/query"
NEEDLES=[
"COWPENS","KINGS MOUNTAIN","CAMDEN","YORKTOWN","GUILFORD","BRANDYWINE",
"SARATOGA","WAXHAW","HANGING ROCK","ROCKY MOUNT","FISHING CREEK",
"MUSGROVE","EUTAW","MONCKS","LENUD","GREEN SPRING","WILLIAMSBURG",
"GLOUCESTER","CHARLOTTE","CHARLOTTESVILLE","AUGUSTA","NINETY SIX",
"FORT CORNWALLIS","STONY POINT","BLACKSTOCK","FIVE FORKS"
]
def get(params):
 url=BASE+"?"+urllib.parse.urlencode(params)
 req=urllib.request.Request(url,headers={"User-Agent":"BritishHistoricalAtlas-archiveResearch/1.0","Accept":"application/json"})
 with urllib.request.urlopen(req,timeout=80) as response:
  raw=response.read()
  if len(raw)>15000000:raise Exception("large response "+str(len(raw)))
  return json.loads(raw)
def dist2(p,a,b):
 vx=b[0]-a[0];vy=b[1]-a[1]
 if vx==vy==0:return (p[0]-a[0])**2+(p[1]-a[1])**2
 t=max(0,min(1,((p[0]-a[0])*vx+(p[1]-a[1])*vy)/(vx*vx+vy*vy)))
 return (p[0]-a[0]-t*vx)**2+(p[1]-a[1]-t*vy)**2
def rdp(line,tol):
 if len(line)<3:return line
 first,last=line[0],line[-1]
 best,maxi=-1,None
 for i in range(1,len(line)-1):
  score=dist2(line[i],first,last)
  if score>best:best=score;maxi=i
 if best>tol*tol:
  return rdp(line[:maxi+1],tol)[:-1]+rdp(line[maxi:],tol)
 return [first,last]
def ring_simplify(r):
 # 1:1 source points, vertex removal only; keep polygons closed.
 clean=[[round(v,6) for v in p[:2]] for p in r]
 if len(clean)<5:return clean
 if clean[0]==clean[-1]:clean=clean[:-1]
 # Ring start split to prevent bad closure; rotate point to a corner at extremes.
 idx=max(range(len(clean)),key=lambda i:clean[i][0])
 clean=clean[idx:]+clean[:idx]
 mid=len(clean)//2
 simplified=rdp(clean[:mid+1],0.00015)[:-1]+rdp(clean[mid:]+[clean[0]],0.00015)
 if simplified[0]!=simplified[-1]:simplified.append(simplified[0])
 return simplified if len(simplified)>=4 else clean+[clean[0]]
def simplify(geom):
 if geom["type"]=="Polygon": return {"type":"Polygon","coordinates":[ring_simplify(r) for r in geom["coordinates"]]}
 if geom["type"]=="MultiPolygon":return {"type":"MultiPolygon","coordinates":[[ring_simplify(r) for r in poly] for poly in geom["coordinates"]]}
 raise Exception("not polygon: "+str(geom["type"]))
def main():
 info=get({"where":"1=1","outFields":"OBJECTID_12,NAME,SITE,WAR,STATE,BOUNDARY,Acres","returnGeometry":"false","f":"json","resultRecordCount":2000})
 if "error" in info:raise Exception(str(info["error"]))
 summaries=[f.get("attributes",{}) for f in info.get("features",[])]
 print("@@ABPP_SUMMARY@@"+json.dumps({"total":len(summaries),"relevant":[a for a in summaries if any(n in (a.get("NAME") or "").upper() for n in NEEDLES)]},ensure_ascii=False,separators=(",",":")),flush=True)
 if not summaries: raise Exception("No ABPP features")
 for a in summaries:
  name=(a.get("NAME") or "").upper()
  if not any(n in name for n in NEEDLES):continue
  oid=a.get("OBJECTID_12")
  if oid is None:continue
  g=get({"where":"OBJECTID_12="+str(oid),"outFields":"OBJECTID_12,NAME,SITE,WAR,STATE,BOUNDARY,Acres",
         "returnGeometry":"true","f":"geojson","outSR":4326})
  if "error" in g:raise Exception(str(g["error"]))
  fs=g.get("features") or []
  if not fs:continue
  f=fs[0]
  out={"type":"Feature","geometry":simplify(f["geometry"]),"properties":f["properties"]}
  print("@@ABPP_FEATURE@@"+json.dumps(out,ensure_ascii=False,separators=(",",":")),flush=True)
 print("@@ABPP_DONE@@"+str(len(summaries)),flush=True)
if __name__=="__main__":main()
