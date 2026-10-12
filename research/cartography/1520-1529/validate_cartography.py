#!/usr/bin/env python3
"""Editor reproducible QA for the 1520–1529 historical cartography research package.

Checks data structures, provenance references and temporal consistency.
NOT an original-source historical assessment or measured ancient boundary verification.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

def read(name):
    return json.loads((HERE / name).read_text(encoding="utf-8"))

def assert_true(ok, message):
    if not ok:
        raise AssertionError(message)

def coords_iter(node):
    if isinstance(node, list) and node and all(isinstance(n, (float, int)) for n in node):
        yield node
    elif isinstance(node, list):
        for child in node:
            yield from coords_iter(child)

def inside(point, ring):
    x,y = point
    parity=False
    for i in range(len(ring)):
        x1,y1=ring[i-1]
        x2,y2=ring[i]
        if (y1>y) != (y2>y):
            intersect=x1+(x2-x1)*(y-y1)/(y2-y1)
            if x<intersect:
                parity=not parity
    return parity

atlas=read("ATLAS_EDITOR_CANDIDATE_1520_1529.json")
outlines=read("APPROXIMATE_REFERENCE_OUTLINES_1520_1529.geojson")
cores=read("CONTROL_CORES_1520_1529.geojson")
sites=read("EVENT_SITES_1520_1529.geojson")
delta=read("CONTROL_CHANGE_1520_1529.geojson")
trans=read("CONTROL_TRANSITION_1519_1529.json")
source_index=read("SOURCE_PROVENANCE_INDEX.json")
carto_sources=read("SOURCES_AND_CARTOGRAPHIC_LIMITS.json")
source_ids={s["id"] for s in source_index["sources"]}
assert_true(len(source_ids)==len(source_index["sources"]), "duplicate source IDs")
assert_true(source_index["distinct_source_ids"]==len(source_ids), "source index count")
assert_true(all(s["id"] in source_ids for s in carto_sources["synthesis"]), "new literature missing from source index")

assert_true(atlas["period"]["from"]==1520 and atlas["period"]["to"]==1529, "invalid period")
assert_true(len(atlas["events"])==24, "candidate event count changed, update provenance")
assert_true(len(atlas["places"])==7, "candidate polity place count changed, review required")
assert_true(len(atlas["sources"])==49, "candidate source count changed, review required")
assert_true(not atlas["colonial_polygons"] and not atlas["routes"], "unsourced exact territory or route")
atlas_ids=[e["id"] for e in atlas["events"]]
assert_true(len(set(atlas_ids))==len(atlas_ids), "duplicate event IDs")
assert_true(len({p["id"] for p in atlas["places"]})==7,"duplicate candidate place")
editor_src={s["id"] for s in atlas["sources"]}
for obj in atlas["events"]+atlas["places"]:
    assert_true(obj["source_ids"], "missing citation on "+obj["id"])
    assert_true(set(obj["source_ids"])<=editor_src, "broken candidate source IDs on "+obj["id"])
    assert_true(set(obj["source_ids"])<=source_ids, "missing provenance index IDs on "+obj["id"])
for ev in atlas["events"]:
    assert_true(1520<=ev["year"]<=1529, "event not in decade "+ev["id"])
    assert_true(ev["year"]==ev.get("visible_from",ev["year"]),"event must not appear early "+ev["id"])
    assert_true((ev["lat"] is None)==(ev["lng"] is None), "incomplete coordinates "+ev["id"])
    if ev["lat"] is not None:
        assert_true(-90<=ev["lat"]<=90 and -180<=ev["lng"]<=180, "invalid GPS "+ev["id"])
    assert_true(ev.get("significance",{}).get("level") in (1,2,3),"unreviewed importance "+ev["id"])

prior=json.loads((ROOT / "data/atlas-1510-1519.json").read_text(encoding="utf-8"))
prev_places=prior["places"]
prev_ids={p["id"] for p in prev_places}
transition_ids=[r["stable_id"] for r in trans["records"]]
assert_true(len(prev_places)==7 and set(transition_ids)==prev_ids, "prior 1510s seven places not fully accounted")
assert_true(len(transition_ids)==len(set(transition_ids)), "duplicate transition stable identity")
assert_true(len([r for r in trans["records"] if r["transition"]=="continued"])==6, "expected six continuing political places")
assert_true(len([r for r in trans["records"] if r["transition"]=="ended"])==1, "Tournai must be only ended former place")
terminated=[r for r in trans["records"] if r["transition"]=="ended"]
assert_true(terminated[0]["stable_id"]=="tournai-occupied-city-1513" and terminated[0]["historical_end_year"]==1519 and terminated[0]["historical_end_month"]==2, "Tournai must leave by February 1519")
assert_true("tournai-occupied-city-1513" not in {x["id"] for x in atlas["places"]}, "Tournai improperly carried to 1520")
assert_true(all(r["source_ids"] for r in trans["records"]), "missing transition evidence")
assert_true(all(set(r["source_ids"])<=source_ids for r in trans["records"]), "transition source ID unresolved")
assert_true(len(trans["annual_snapshots"])==10,"must have ten annual snapshots")
assert_true([s["year"] for s in trans["annual_snapshots"]]==list(range(1520,1530)), "annual snapshots gap")
assert_true(all(len(s["active_candidate_places"])==7 for s in trans["annual_snapshots"]), "active political place wrongly reset across decade")
assert_true(all(not s["new_polygon_conquest_ids"] for s in trans["annual_snapshots"]), "fictional conquered province")
assert_true(len(trans["newly_separate_map_markers"])==1 and trans["newly_separate_map_markers"][0]["stable_id"]=="guines-crown-1520s", "Guînes must be separately mapped OLD possession")

earlier=json.loads((ROOT / "data/territorial-footprints-1497-1519.geojson").read_text(encoding="utf-8"))
baseline={f["id"]:f for f in earlier["features"]}
assert_true(len(outlines["features"])==7,"exactly seven inherited approximate geographic extents")
for f in outlines["features"]:
    p=f["properties"]
    assert_true(f["id"] in baseline,"fabricated historic region "+f["id"])
    assert_true(f["geometry"]==baseline[f["id"]]["geometry"],"geographic footprint silently redrawn "+f["id"])
    assert_true(p["historical_boundary_confirmed"] is False and p["fill_authorized"] is False,"approx boundary misrepresented "+f["id"])
    assert_true(p["prohibit_area_calculations"] is True and p["measured_area_sqkm"] is None, "fictional area size "+f["id"])
    assert_true(p["period_from"]==1520 and p["period_to"]==1529, "reference visible out of year "+f["id"])
    assert_true(p["draw_style"] in ("dashed_reference","patterned_political_reference"),"illegal solid border "+f["id"])
    assert_true(set(p.get("new_research_support_ids",[]))<=source_ids,"new source missing "+f["id"])
    for pos in coords_iter(f["geometry"]["coordinates"]):
        assert_true(len(pos)>=2 and -180<=pos[0]<=180 and -90<=pos[1]<=90, "invalid old polygon coords "+f["id"])
    if p["historical_control_type"]=="scottish_crown_territory":
        assert_true("independent_scottish" in p["display_group"], "Scots improperly put into English rule "+f["id"])

assert_true(len(cores["features"])==3 and all(f["geometry"]["type"]=="Point" for f in cores["features"]), "three map cores must be Point symbols")
assert_true({f["properties"]["stable_id"] for f in cores["features"]}=={"calais-crown","guines-crown-1520s","dublin-pale"}, "core IDs incompatible with timeline")
for layer in (cores,sites,delta):
    for f in layer["features"]:
        p=f["properties"]
        assert_true(f["geometry"]["type"]=="Point", "unconfirmed area painted "+str(f.get("id")))
        assert_true(set(p["source_ids"])<=source_ids, "missing source reference "+str(f.get("id")))
        pos=f["geometry"]["coordinates"]
        assert_true(-180<=pos[0]<=180 and -90<=pos[1]<=90, "invalid point coords "+str(f.get("id")))
        assert_true(not p.get("actual_control_polygon",False), "point pretends to prove polygon")

assert_true(len(sites["features"])==10, "site research points lost")
guines=next(f for f in cores["features"] if f["properties"]["stable_id"]=="guines-crown-1520s")["geometry"]["coordinates"]
ardres=next(f for f in delta["features"] if f["id"]=="delta-1520-ardres-french-frontier")["geometry"]["coordinates"]
calais_ring=next(f for f in outlines["features"] if f["id"].startswith("calais-pale"))["geometry"]["coordinates"][0]
assert_true(inside(guines,calais_ring),"Guînes no longer lies within inherited visual hull (data drift)")
assert_true(not inside(ardres,calais_ring),"French Ardres now swallowed by visual hull (review required)")
assert_true(all(f["properties"].get("no_map_control_area_generated") for f in delta["features"]), "map delta creates unsourced control")
assert_true(delta["metadata"]["new_verified_controlling_polygons"]==0,"unsourced new control areas")

print("PASS: 24 candidate events; 7 continuing/ended political identities accounted; "
      "10 annual snapshots; 7 dashed or patterned approximate regions; "
      "3 verified named-place symbols; 10 event sites; 5 change points; "
      f"{len(source_ids)} citable source IDs; zero verified 1520s border polygons.")
