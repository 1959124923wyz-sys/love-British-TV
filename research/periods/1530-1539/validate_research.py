#!/usr/bin/env python3
"""Reproducible static evidence audit of the 1530-1539 independent research package.

No static script certifies 16th-century borders; this catches vanished polity IDs,
speculative colonial polygons, bad date/source metadata and geography corruption.
"""
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

def load(fn):
    return json.loads((HERE / fn).read_text(encoding="utf-8"))

def require(x, message):
    if not x:
        raise AssertionError(message)

def itercoords(c):
    if isinstance(c, list) and c and isinstance(c[0], (int, float)):
        yield c
    elif isinstance(c, list):
        for p in c:
            yield from itercoords(p)

sources=load("SOURCE_REGISTRY.json")
events=load("CHRONOLOGY.json")
episodes=load("CONTROL_EPISODES.json")
finance=load("FINANCIAL_EVIDENCE.json")
ledger=load("TRANSITION_1529_1530.json")
outlines=load("MAP_REFERENCE_1530_1539.geojson")
cores=load("CONTROL_CORES_1530_1539.geojson")
polities=load("POLITICAL_RELATIONS_1530_1539.geojson")
sites=load("EVENT_SITES_1530_1539.geojson")
delta=load("MAP_DELTA_1530_1539.geojson")
atlas=load("ATLAS_REVIEW_CANDIDATE.json")
queue=load("ARCHIVAL_ACTION_QUEUE.json")
next_seed=load("NEXT_DECADE_1539_1540_RESEARCH_SEED.json")
prior=json.loads((ROOT/"data/atlas-1520-1529.json").read_text(encoding="utf-8"))
old_area=json.loads((ROOT/"data/territorial-footprints-1497-1529.geojson").read_text(encoding="utf-8"))
src_ids={s["id"] for s in sources["records"]}
require(len(src_ids)==len(sources["records"]), "source IDs duplicate")
require(len(src_ids)>=40, "expected at least 40 documentary source/lead IDs")
require(all(s.get("primary_original_examined") is False for s in sources["records"]), "originals read flag must not silently change")
require(1530==events["period"]["from"] and 1539==events["period"]["to"], "research decade mismatch")
event_ids={e["id"] for e in events["records"]}
require(len(event_ids)==len(events["records"]) and len(event_ids)>=24, "events missing or duplicate")
for e in events["records"]:
    require(1530<=e["year"]<=1539, "event wrong year "+e["id"])
    require(set(e["source_ids"])<=src_ids and e["source_ids"], "missing event source ID "+e["id"])
    require(e["control_effect"] and e["map_area_effect"], "missing event map impact "+e["id"])
    require(e["significance"]["level"] in (1,2,3), "invalid significance "+e["id"])
    if e.get("coordinate") is not None:
        v=e["coordinate"]
        require(-90<=v["lat"]<=90 and -180<=v["lng"]<=180, "bad coordinate "+e["id"])

prior_ids={p["id"] for p in prior["places"]}
require(len(prior_ids)==len(prior["places"])==7, "prior baseline changed, audit anew")
lead_ids={r["stable_id"] for r in ledger["records"]}
require(len(lead_ids)==len(ledger["records"])==8, "bad stable ID ledger")
require(prior_ids<=lead_ids, "disappearing prior polity ID across 1529/1530")
require(set(ledger["previous_snapshot"]["active_stable_ids"])==prior_ids, "previous snapshot mismatch")
require(len(ledger["annual_snapshots"])==10, "expected ten snapshots")
require([s["year"] for s in ledger["annual_snapshots"]]==list(range(1530,1540)), "gap in year snapshots")
require(all(set(s["carryover_named_place_ids"])==prior_ids for s in ledger["annual_snapshots"]), "polity vanished at new year")
require(all(not s["geometry_verified_new_control_polygons"] for s in ledger["annual_snapshots"]), "false conquest polygon")
require(any(e["id"]=="1530S-E004" and e["year"]==1535 for e in events["records"]), "Maynooth March 1535 missing")
require(any("霍尔" in e["title_zh"] and e["coordinate"] is None for e in events["records"]), "Newfoundland Hore should not get invented precise pin")
require(any("英语、衣着" in e["title_zh"] for e in events["records"]), "1537 anglicisation law missing")
require(not atlas["colonial_polygons"] and not atlas["routes"], "unapproved colony/route geometry added")

baseline={f["id"]:f for f in old_area["features"]}
require(len(baseline)==7, "base feature count unexpectedly changed")
require(len(outlines["features"])==8, "seven inherited reference polygons + modern legal-Wales overlay needed")
for f in outlines["features"]:
    p=f["properties"]
    require(p.get("historical_boundary_confirmed") is False and p.get("fill_authorized") is False, "uncertain polygon flagged exact "+str(f["id"]))
    require(p.get("area_sqkm") is None and p.get("area_calculation_allowed") is False, "area size fabricated "+str(f["id"]))
    if f["id"] in baseline:
        require(f["geometry"]==baseline[f["id"]]["geometry"], "previous geometry silently modified "+str(f["id"]))
        require(p["period_from"]==1530 and p["period_to"]==1539, "decade range wrong "+str(f["id"]))
    else:
        require("wales-marcher" in f["id"] and p.get("historically_new_conquest") is False, "new alleged empire territory unsupported "+str(f["id"]))
        require(p.get("source_ids")==["WAL-UK-LEG-1535"], "Welsh legal overlay lacks statute")
        require(f["geometry"]["type"]=="MultiPolygon", "modern Welsh context must be multipart reference geometry")
    for pt in itercoords(f["geometry"]["coordinates"]):
        require(len(pt)>=2 and all(math.isfinite(x) for x in pt[:2]) and -180<=pt[0]<=180 and -90<=pt[1]<=90, "coordinate out of range "+str(f["id"]))
require(len(cores["features"])==3 and {f["properties"]["source_place_id"] for f in cores["features"]}=={"calais-crown","guines-crown-1520s","dublin-pale"}, "Crown urban cores wrong")
require(all(f["geometry"]["type"]=="Point" for f in cores["features"]), "symbolic city core must be Point")
require(len(polities["features"])==4 and all(f["properties"]["source_place_id"]!="dublin-pale" for f in polities["features"]), "distinct political relationships changed")
require({f["properties"]["source_place_id"] for f in polities["features"]}=={"channel-jersey","isle-of-man","orkney-scotland","shetland-scotland"}, "Scottish islands or dependencies missing")
for f in polities["features"]:
    if f["properties"]["source_place_id"] in ("orkney-scotland","shetland-scotland"):
        require("scottish" in f["properties"]["political_relation"], "Scots incorrectly labelled English")
require(len(sites["features"])==len([e for e in events["records"] if e.get("coordinate")]), "geocoded candidate events out of sync")
for f in sites["features"]:
    require(f["properties"]["source_event_id"] in event_ids, "event site not in chronology")
    require(f["geometry"]["type"]=="Point", "site is not Point")
    require(set(f["properties"]["source_ids"])<=src_ids, "event site missing source")
require(delta["metadata"]["actual_verified_new_English_colonial_area_polygons"]==0, "fictional gained land")
for f in delta["features"]:
    require(f["properties"].get("fill_authorized") is False, "historic area secretly filled")
    require(set(f["properties"]["source_ids"])<=src_ids, "unresolved delta source")
require(len(atlas["events"])==len(events["records"]), "editorial event count")
require({e["id"] for e in atlas["events"]}==event_ids, "candidate event lost")
require({p["id"] for p in atlas["places"]}==prior_ids, "candidate political site lost")
atlas_src={s["id"] for s in atlas["sources"]}
require(all(set(x["source_ids"])<=atlas_src for x in atlas["events"]+atlas["places"]), "atlas link broken")
require(all(e["visible_from"]==e["year"] for e in atlas["events"]), "events appear before year")
require(all(p["observed_through_year"]==1539 for p in atlas["places"]), "wrong atlas decade")
require(not atlas["colonial_polygons"], "must not publish unconfirmed ancient polygon")
require(len(episodes["records"])>=15 and all(x["actual_historical_polygon"] is None for x in episodes["records"]), "unverified estate conquest")
require(len(finance["records"])>=7 and all(x["amount_value"] is None for x in finance["records"]), "fake finance numerical figures")
require(len(queue["tasks"])>=17, "archival queue lost")
require(next_seed["from_snapshot_year"]==1539, "next-decade seed wrong year")
require({r["stable_id"] for r in next_seed["incoming_stable_ids"]}==lead_ids, "one of the 1539 inherited polities was dropped from 1540 research seed")
require(next_seed["new_1540_year_end_snapshot"] is None and next_seed["verified_new_1540_polygon_count"]==0, "fabricated 1540 atlas state")
print("PASS 1530-1539: sources=%d events=%d atlas_sources=%d geography=8 (7 inherited+Wales legal only) "
      "political_cores=3 relationships=4 event_sites=%d change_features=%d control_episodes=%d "
      "fiscal_objects=%d priorities=%d year_slices=10 ; zero fictional actual-control polygons."
      %(len(src_ids),len(event_ids),len(atlas_src),len(sites["features"]),len(delta["features"]),len(episodes["records"]),len(finance["records"]),len(queue["tasks"])))
