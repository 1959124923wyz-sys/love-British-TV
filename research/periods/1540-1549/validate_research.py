#!/usr/bin/env python3
"""1540s cartography research QA: structural, chronology, source & border-honesty checks.

This DOES NOT independently verify all original Tudor archival manuscripts or
certify that hand-sketched historical regional bounds equal 1540s actual land.
"""
import json, math
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]

def read(n):
    return json.loads((HERE/n).read_text(encoding="utf8"))

def require(ok,msg):
    if not ok: raise AssertionError(msg)

def coords(obj):
    if isinstance(obj,list) and obj and isinstance(obj[0],(int,float)):
        yield obj
    elif isinstance(obj,list):
        for x in obj: yield from coords(x)

src=read("SOURCE_REGISTRY.json")
chron=read("CHRONOLOGY.json")
ctl=read("CONTROL_TRANSITION_1539_1549.json")
areas=read("MAP_REFERENCE_OUTLINES_1540_1549.geojson")
points=read("ACTIVE_CONTROL_PLACES_1540_1549.geojson")
delta=read("MAP_DELTA_1540_1549.geojson")
atlas=read("ATLAS_REVIEW_CANDIDATE.json")
fin=read("FINANCIAL_EVIDENCE.json")
todo=read("ARCHIVAL_ACTION_QUEUE.json")
prior=json.loads((ROOT/"data/atlas-1520-1529.json").read_text(encoding="utf8"))
prior_geos=json.loads((ROOT/"data/territorial-footprints-1497-1529.geojson").read_text(encoding="utf8"))

ids={s["id"] for s in src["records"]}
require(len(ids)==len(src["records"])>=40,"sources duplicate/missing")
require(all(not s["original_sixteenth_century_manuscript_read"] for s in src["records"]), "direct original-source examination unexpectedly claimed")
require(len(chron["records"])>=27 and chron["count"]==len(chron["records"]),"chronology incomplete")
assert len({e["id"] for e in chron["records"]})==len(chron["records"])
for e in chron["records"]:
    require(1540<=e["year"]<=1549,"bad historic event year "+e["id"])
    require(e["visible_from"]==e["year"],"future event prematurely appears "+e["id"])
    require(e["source_ids"] and set(e["source_ids"])<=ids, "unknown event source "+e["id"])
    require(e["historical_precise_area_claim"] is False,"event alleges verified ancient area "+e["id"])
    if e.get("coordinate"):
        require(-180<=e["coordinate"]["lng"]<=180 and -90<=e["coordinate"]["lat"]<=90,"bad event coordinates")

previous_ids={p["id"] for p in prior["places"]}
research_previous={r["stable_id"] for r in ctl["previous_political_identifiers"]}
require(len(previous_ids)==7 and previous_ids<research_previous, "7 prior 1529 polities / kingdom Scotland not inherited")
require(len(ctl["previous_political_identifiers"])==8 and "kingdom-of-scotland" in research_previous, "independent Scotland omitted")
require(len(ctl["year_end_snapshots"])==10,"year slices missing")
require([r["year"] for r in ctl["year_end_snapshots"]]==list(range(1540,1550)),"year gap")
require(all(set(s["carried_1539_stable_ids"])==research_previous for s in ctl["year_end_snapshots"]),"old territory inexplicably disappears")
episode_ids=[p["id"] for p in ctl["real_new_or_changed_place_episodes"]]
require(len(episode_ids)==len(set(episode_ids))>=8,"garrison episodes duplicated/missing")
episodes={p["id"]:p for p in ctl["real_new_or_changed_place_episodes"]}
def snap(y): return ctl["year_end_snapshots"][y-1540]
for y in range(1540,1550):
    s=snap(y);active=set(s["new_active_episode_ids"])
    require(not s["false_new_province_area_polygons"],"invented new province")
    require(("boulogne-english-1544-1550" in active)==(y>=1544), "English Boulogne should remain after 1544 until 1549")
    require(("broughty-english-1547-1550" in active)==(y>=1547), "Broughty garrison timeline wrong")
    require(("eyemouth-fort-English-1547-1550" in active)==(y>=1547), "Eyemouth English fort timeline wrong")
    require(("lauder-english-1548-1550" in active)==(y>=1548), "Lauder wrong")
    require(("inchcolm-english-1547-1548" in active)==(y==1547), "Inchcolm 1548 withdrawal failure")
    require(("haddington-english-1548-1549" in active)==(y==1548), "Haddington 1549 withdrawal failure")
    require(("hailes-english-1548-date_unknown" in active)==(y==1548), "Hailes unproved 1549 incorrectly confirmed/ended")
require("hailes-english-1548-date_unknown" in snap(1549)["uncertain_continuity_episode_ids"], "Hailes 1549 unresolved status hidden")
require("tournai-occupied-city-1513" not in episode_ids, "Tournai 1519 ghost control")
require(all(e["polygon_verified"] is False for e in episodes.values()),"historical polygon forged")

base_geometry={f["id"]:f["geometry"] for f in prior_geos["features"]}
require(len(base_geometry)==7, "prior old map baseline changed")
require(len(areas["features"])==13,"expected 8 inherited context incl Wales and 5 rough circles")
for f in areas["features"]:
    p=f["properties"]
    require(p.get("historical_boundary_confirmed") is False and p.get("fill_authorized") is False, "schematic reference misapproved")
    require(p.get("area_sqkm") is None and p.get("area_calculation_allowed") is False,"fake historic area")
    if f["id"] in base_geometry:
        require(f["geometry"]==base_geometry[f["id"]],"previous polygon mutated")
    elif "schematic-envelope" in f["id"]:
        require(p["geometry_role"].startswith("SCHEMATIC_") and p["draw_mode"]=="dashed_context_only", "rough fort circle being used as historic border")
        require(len(f["geometry"]["coordinates"][0])>=30,"schematic circle missing vertices")
    else:
        require(f["id"].startswith("wales-marcher") and p["historically_new_conquest"] is False, "extra historic polygons unsupported")
    for pt in coords(f["geometry"]["coordinates"]):
        require(math.isfinite(pt[0]) and math.isfinite(pt[1]) and abs(pt[0])<=180 and abs(pt[1])<=90,"invalid GIS coords")
require(areas["metadata"]["verified_historical_period_control_polygons"]==0, "historical area certified without contemporary surveyed plan")

require(len(points["features"])==14 and len({f["properties"]["stable_id"] for f in points["features"]})==14, "lost old polity or new garrison point")
for f in points["features"]:
    p=f["properties"]
    require(f["geometry"]["type"]=="Point" and p["area_polygon_verified"] is not True if "area_polygon_verified" in p else f["geometry"]["type"]=="Point","invalid place symbol")
    require(p["year_end_start"]<=p["year_end_stop"],"invalid year-end interval")
    require(-180<=f["geometry"]["coordinates"][0]<=180 and -90<=f["geometry"]["coordinates"][1]<=90,"bad site")
require(next(x for x in points["features"] if x["properties"]["stable_id"]=="inchcolm-english-1547-1548")["properties"]["year_end_stop"]==1547, "Inchcolm still appears in 1548")
require(next(x for x in points["features"] if x["properties"]["stable_id"]=="haddington-english-1548-1549")["properties"]["year_end_stop"]==1548, "Haddington still appears in 1549")

require(len(delta["features"])>=10 and delta["metadata"]["verified_new_historical_territorial_polygons"]==0,"missing map deltas / invented borders")
for f in delta["features"]:
    require(f["geometry"]["type"]=="Point" and set(f["properties"]["source_ids"])<=ids,"delta invalid source or point")
require(len(atlas["events"])==len(chron["records"]) and len(atlas["places"])==14,"candidate event/site counts diverge")
candidate_ids={x["id"] for x in atlas["sources"]}
require(len(candidate_ids)==len(atlas["sources"]),"candidate source duplicates")
for e in atlas["events"]:
    require(e["year"]==e["visible_from"],"candidate future spoiler")
    require(set(e["source_ids"])<=candidate_ids,"candidate missing source")
    require(e["significance"]["level"] in (1,2,3),"significance invalid")
for p in atlas["places"]:
    require(set(p["source_ids"])<=candidate_ids,"candidate place missing source")
require(not atlas["colonial_polygons"] and not atlas["routes"], "unapproved polygon/route")
require(atlas["editorial_gate"]["verified_historic_conquered_control_area_polygons"]==0, "conquest polygons guessed")
require(len(fin["financial_objects"])==6, "finance source gaps")
levy=next(f for f in fin["financial_objects"] if f["id"]=="FIN-1545-BENEVOLENCE")
require(levy["value"]==119581 and "estimate" in levy["valuation_status"], "1545 estimated levy label broken")
debt=next(f for f in fin["financial_objects"] if f["id"]=="FIN-1549-ROYAL-DEBT-CLAIM")
require(debt["value_operator"]==">" and "claim" in debt["valuation_status"],"1549 rhetorical debt converted to audited profit")
require(fin["verified_exact_Boulogne_net_profit"] is None,"fake Boulogne profit")
require(todo["task_count"]>=20,"unfinished archive queue lost")

print("PASS research 1540–1549: 8 historical identities inherited, 8 dated control episodes, "
      "10 year-end snapshots, 27+ historical events, 13 dashed/symbolic area references, "
      "14 control point sites, corrected Inchcolm/Haddington/Hailes endings and uncertain continuation, "
      "40+ source/lead records and 6 strictly labelled finance studies; ZERO invented exact ancient borders.")
