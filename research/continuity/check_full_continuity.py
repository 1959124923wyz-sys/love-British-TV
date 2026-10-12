#!/usr/bin/env python3
"""1497–1529 control continuity and cartographic uncertainty audit.
Only reads the main-branch source files plus the research/continuity/staged artifacts.
Never publishes, overwrites, guesses historical frontiers or changes the website.
python3 research/continuity/check_full_continuity.py
"""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[2]
def load(p): return json.loads((R/p).read_text(encoding="utf-8"))
L=load("research/continuity/CONTROL_TIMELINE_1497_1529.json")
C=load("research/continuity/staged/french-urban-control-1497-1529.geojson")
P=load("research/continuity/staged/political-relations-1500-1529.geojson")
G=load("research/continuity/staged/geography-hypotheses-1500-1529.geojson")
S=load("research/continuity/staged/atlas-1520-1529.json")
B=load("data/atlas-1500-1509.json")
T=load("data/atlas-1510-1519.json")
names=[s["stable_id"] for s in L["stable_states"]]
lookup={s["stable_id"]:s for s in L["stable_states"]}
assert len(names)==len(set(names))==9,"non-unique state IDs"
years=L["year_end_snapshots"]
assert [x["year"] for x in years]==list(range(1497,1530)),"not exactly 33 continuous years"
prior={x["id"] for x in B["places"]}
next_old={x["id"] for x in T["places"]}
assert len(prior)==6 and next_old==prior|{"tournai-occupied-city-1513"}
assert {x["id"] for x in S["places"]}==prior|{"guines-crown-1520s"}
assert S["period"]=={"from":1520,"to":1529,"next":1530}
assert S["editorial_status"]=="CONTINUITY_INTEGRATION_STAGE_NOT_APPROVED_OR_PUBLISHED"
assert len(S["events"])==24 and len(S["places"])==7
assert S["colonial_polygons"]==[],"no fabricated actual geography"
source_ids={src["id"] for src in S["sources"]}
assert source_ids
for record in S["events"]+S["places"]:
    assert record["source_ids"] and set(record["source_ids"])<=source_ids,record["id"]
for year in years:
    active=set(year["active_stable_ids"])
    assert active=={s["stable_id"] for s in L["stable_states"] if year["year"] in s["year_end_active"]}
    assert set(year["direct_English_royal"]).isdisjoint({"orkney-scotland","shetland-scotland","kingdom-of-scotland","isle-of-man","channel-jersey"})
    if 1500<=year["year"]<=1519:
        assert prior<=active,(year["year"],"older six lost")
    if 1520<=year["year"]<=1529:
        assert prior<=active,(year["year"],"continual prior states vanished")
        assert "guines-crown-1520s" in active
    if 1513<=year["year"]<=1518:
        assert "tournai-occupied-city-1513" in active
    else:
        assert "tournai-occupied-city-1513" not in active
assert lookup["tournai-occupied-city-1513"]["known_historic_end"]=="1519-02"
assert lookup["guines-crown-1520s"]["map_group_id"]=="calais-crown"
assert "newly acquired land" in lookup["guines-crown-1520s"]["scope_warning"].lower()
assert not any(x["stable_id"]=="kingdom-of-scotland" and x["map_relation"].startswith("English") for x in L["stable_states"])
assert len(L["changes"])==6
assert len(C["features"])==3 and len(P["features"])==5 and len(G["features"])==4
cp={f["properties"]["source_place_id"]:f["properties"] for f in C["features"]}
pp={f["properties"]["source_place_id"]:f["properties"] for f in P["features"]}
assert set(cp)=={"calais-crown","tournai-occupied-city-1513","guines-crown-1520s"}
assert set(pp)==prior-{"calais-crown"}
assert cp["calais-crown"]["observed_through_year"]==1529
assert cp["tournai-occupied-city-1513"]["observed_through_year"]==1518
assert cp["tournai-occupied-city-1513"]["historic_end_date"]=="1519-02"
assert cp["guines-crown-1520s"]["is_new_territory"] is False
for p in [*cp.values(),*pp.values()]:
    assert p["historical_boundary_confirmed"] is False
    assert p["actual_area_sqkm"] is None, "invented area measurement"
    if p.get("source_place_id")!="tournai-occupied-city-1513" and "observed_through_year" in p:
        assert p["observed_through_year"]==1529
for f in G["features"]:
    p=f["properties"]
    assert p["fill_authorized"] is False and p["actual_control_polygon"] is False
    assert not p.get("historic_area_measured_km2")
    if f["geometry"]["type"]=="Polygon":
        ring=f["geometry"]["coordinates"][0]
        assert ring[0]==ring[-1],"polygon ring not closed"
    if "TOURNAISIS" in str(p.get("id","")):
        assert p["valid_years"]==list(range(1513,1519))
    else:
        assert p["valid_years"]==list(range(1500,1530))
print("PASS: 33 annual snapshots 1497–1529; 9 stable identities; 6 transitions; 6 inherited states; Tournai exit; Guines existing border site; 0 actual polygons.")
print("GATE: research stage only; exact borders, 1520s source review and frontend rendering need editor approval.")
