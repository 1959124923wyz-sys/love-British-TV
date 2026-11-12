#!/usr/bin/env python3
"""Audit existing editor-15 source registries against T29/T30 group keys.
Print only source-matched records and provenance. No unverified content created."""
import json,zipfile,pathlib,sys
R=pathlib.Path(__file__).resolve().parents[1]
S=R/"research/18c/consolidated"
chosen=set()
for arc in ("T29","T30"):
    data=json.loads((S/f"series/{arc}.json").read_text())
    for g in data["groups"]:
        for e in g["candidate_subevents"]:
            chosen.update(e.get("source_keys") or [])
        for v in g.get("source_keys",[]):
            chosen.add(v)
with zipfile.ZipFile(S/"18C_Consolidated_Research_Handoff_20261108.zip") as z:
    for a in "ABC":
        data=json.loads(z.read(f"18c_consolidation/SOURCES_{a}.json"))
        items=data["sources"]
        if isinstance(items,dict):
            items=[dict(value, id=id) if isinstance(value,dict) else dict(id=id,entry=value)
                   for id,value in items.items()]
        print("REGISTRY",a,"entries",len(items))
        matches=[]
        for item in items:
            if not isinstance(item,dict):continue
            keys=set()
            for field in ("id","source_id","key","source_key","ref","source_code","code"):
                v=item.get(field)
                if v is not None:keys.update((str(v),a+":"+str(v)))
            if any(v in chosen for v in keys):matches.append(item)
        print("MATCHED",a,len(matches))
        for item in matches:print("SOURCE",a,json.dumps(item,ensure_ascii=False)[:2500])
        if a=="C":
            expected={v for v in chosen if v.startswith("C:")}
            used=set()
            for item in matches:
                for field in ("id","source_id","key","source_key","ref","source_code","code"):
                    if item.get(field) is not None:used.add("C:"+str(item[field]))
            missing=sorted(expected-used)
            print("C-MISSING",json.dumps(missing,ensure_ascii=False))
            if missing:sys.exit(2)
