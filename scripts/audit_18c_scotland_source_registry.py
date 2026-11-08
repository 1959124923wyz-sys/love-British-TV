#!/usr/bin/env python3
"""Validate source-first T31/T32 Scotland historical research from editor15 unchanged ZIP."""
import json,zipfile,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
base=root/"research/18c/consolidated"
groups=[g for t in ("T31","T32") for g in json.loads((base/f"series/{t}.json").read_text())["groups"]]
sources={s for g in groups for x in g["candidate_subevents"] for s in x.get("source_keys",[]) if s.startswith("C:")}
with zipfile.ZipFile(base/"18C_Consolidated_Research_Handoff_20261108.zip") as z:
    registry=json.loads(z.read("18c_consolidation/SOURCES_C.json"))["sources"]
    if isinstance(registry,list):registry={s["id"]:s for s in registry}
    used={s[2:] for s in sources}
    missing=used-set(registry)
    assert not missing,"Missing registered original source keys "+str(missing)
    assert len(groups)==9
    for s in sorted(used):print("SCOTLAND_C_SOURCE",s,json.dumps(registry[s],ensure_ascii=False))
    print("PASS SCOTLAND T31/T32: 9 original merge groups,",len(used),"unique original assistant C source keys, no unmatched refs")
