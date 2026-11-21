#!/usr/bin/env python3
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
mass=json.loads((root/"data/eighteenth-century-mass-schematic-zones-1700-1799.json").read_text())
terms={"MYSORE_TELLICHERRY_FORT","MADRAS_ST_GEORGE_SIEGE","ARCOT_FORT_CORE",
 "PITT_BOUQUET_BLOCKHOUSE","FORT_ANNE_ROYAL_PORT","GOLD_COAST_APOLLONIA_FORT"}
items={z["id"]:z for z in mass["regional_zones"]}
p={}
for k in terms:
 z=items[k]
 p[k]={"title":z.get("title"),"kind":z.get("kind"),"periods":z.get("periods"),
 "source_urls":z.get("source_urls"),"geometry_type":z["geometry"]["type"],
 "first_coordinates":str(z["geometry"]["coordinates"])[:150],
 "narrative":z.get("note")}
s=(root/"docs/research/18C_5AE_PROMOTION_EVIDENCE.json")
s.write_text(json.dumps(p,ensure_ascii=False,indent=2)+"\n")
print("INSPECTED",len(p),"historical fort geometry records")
