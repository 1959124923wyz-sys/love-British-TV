#!/usr/bin/env python3
"""1550s Love-British-TV research gate: source IDs, controller dates, geo honesty.

This validates structured files. It is NOT proof of seeing actual Tudor original
manuscript maps or a license to portray modern Irish shires as English control.
"""
import json, math
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
def load(x): return json.loads((HERE/x).read_text(encoding="utf8"))
def check(test,msg):
    if not test: raise AssertionError(msg)
src=load("SOURCE_REGISTRY.json")
events=load("CHRONOLOGY.json")
atlas=load("ATLAS_REVIEW_CANDIDATE.json")
ctl=load("CONTROL_TRANSITION_1549_1559.json")
points=load("POLITICAL_CONTROL_SITES_1550_1559.geojson")
areas=load("MAP_REFERENCE_OUTLINES_1550_1559.geojson")
delta=load("MAP_DELTA_1550_1559.geojson")
irish=load("IRISH_MIDLANDS_PLANTATION_1556.json")
ships=load("TRADE_AND_FORCED_LABOUR_NETWORKS_1550_1559.json")
money=load("FINANCIAL_EVIDENCE.json")
queue=load("ARCHIVAL_ACTION_QUEUE.json")
seed=load("TRANSITION_1559_1560_RESEARCH_SEED.json")
prior=json.loads((ROOT/"data/territorial-footprints-1497-1529.geojson").read_text(encoding="utf8"))

sources={s["id"] for s in src["records"]}
check(src["count"]==len(sources)==len(src["records"])>=40, "duplicate source, or incomplete source registry")
check(not any(s["sixteenth_century_original_manuscript_read"] for s in src["records"]), "unexpected original manuscript verification claim")
check(events["count"]==len(events["records"])>=20, "historical chronology short or count mismatched")
check(len({e["id"] for e in events["records"]})==len(events["records"]), "duplicate event IDs")
check(len(atlas["events"])==len(events["records"]), "atlas event mismatch")
check(len(atlas["places"])==len(points["features"])==15, "named site count mismatch")
candidate={s["id"] for s in atlas["sources"]}
check(len(candidate)==len(atlas["sources"]), "duplicate candidate source")
for e in events["records"]:
    check(1550<=e["year"]<=1559, "year out of range: "+e["id"])
    check(e["visible_from"]==e["year"],"future event visible too early "+e["id"])
    check(e["source_ids"] and set(e["source_ids"])<=sources,"missing historical event source "+e["id"])
    check(e["actual_historical_boundary_verified"] is False, "precise border invented "+e["id"])
for e in atlas["events"]:
    check(e["visible_from"]==e["year"] and set(e["source_ids"])<=candidate, "candidate event future spoiler or missing source "+e["id"])
for p in atlas["places"]:
    check(p["source_ids"] and set(p["source_ids"])<=candidate,"missing site bibliography "+p["id"])
    check(p["area_polygon_verified"] is False,"invented site polygon "+p["id"])
check(not atlas["colonial_polygons"] and not atlas["routes"],"unverified ancient surveyed polygons or exact voyage paths")
check(atlas["editorial_gate"]["verified_historical_conquered_control_area_polygons"]==0,"editor certified unsurveyed land")

oldids={p["stable_id"] for p in ctl["inherited_political_identities"]}
check(len(oldids)==9,"not 9 inherited Chapter6 named political identities")
check("kingdom-of-scotland" in oldids and "channel-guernsey" in oldids,"Scotland/Guernsey continuity dropped")
snap=ctl["year_end_snapshots"]
check(len(snap)==10 and [s["year"] for s in snap]==list(range(1550,1560)), "annual status slices missing")
for s in snap:
    y=s["year"]
    check(set(s["retained_1549_political_identity_ids"])==oldids,"identity disappeared after change of sovereignty "+str(y))
    expected={"calais-crown","guines-crown-1520s"} if y<=1557 else set()
    check(set(s["English_control_Calais_Guines"])==expected,"English Calais erroneously persists after 1557 "+str(y))
    check(set(s["French_control_former_English_Calais_Guines"])==(set() if y<=1557 else {"calais-crown","guines-crown-1520s"}),"French Calais recovery not shown from 1558 "+str(y))
    check(s["Irish_1556_plantation_legal_claim"]==(y>=1556),"Irish legal Plantation year wrong")
    check(s["verified_actual_English_occupation_of_whole_modern_Laois_Offaly"] is False, "fabricated all-Ireland counties")
    check(s["active_1549_English_Boulogne_Broughty_outworks_yearend"] is False,"1550 English garrisons resurrected")
    check(s["Scottish_kingdom_remains_independent"] is True,"Scotland annexed after localized fortress")
check(len(ctl["confirmed_1550_end_of_English_occupation"])==4,"Boulogne/Broughty/Forthill/Tour d'Ordre exit missing")
check(len(ctl["unresolved_1550_departure_and_local_continuity"])==4,"undocumented 1550 departures incorrectly certified")
check({x["stable_id"] for x in ctl["French_1558_recoveries"]}=={"calais-crown","guines-crown-1520s"},"1558 French conquest not transferred")

baseline={f["id"]:f["geometry"] for f in prior["features"]}
check(len(baseline)==7 and len(areas["features"])==8,"8 inherited no new fake polygons")
for f in areas["features"]:
    p=f["properties"]
    check(p["historical_boundary_confirmed"] is False and p["fill_authorized"] is False and p["area_calculation_allowed"] is False,"historic outline portrayed certain")
    check(p["area_sqkm"] is None,"historic area statistic not sourced")
    if f["id"] in baseline:
        check(f["geometry"]==baseline[f["id"]],"historical inherited GIS geometry shifted")
    if f["id"].startswith("calais-pale"):
        check(p["French_control_change_year"]==1558,"Calais pale stays English after French conquest")
check(areas["metadata"]["authorised_new_exact_Tudor_control_polygons"]==0,"unsourced border polygon approved")
check(len(delta["features"])==11,"map deltas do not match approved historic changes")
check(all(f["geometry"]["type"]=="Point" for f in points["features"]+delta["features"]),"modern fort exact area falsely created")
for f in points["features"]+delta["features"]:
    lng,lat=f["geometry"]["coordinates"]
    check(math.isfinite(lng) and math.isfinite(lat) and -180<=lng<=180 and -90<=lat<=90,"coordinate not valid")
    check(set(f["properties"]["source_ids"])<=sources,"site or map change source outside registry")
site={f["properties"]["stable_id"]:f["properties"] for f in points["features"]}
check(site["calais-crown"]["French_controller_year_start"]==1558,"Calais controller not switched in 1558")
check(site["guines-crown-1520s"]["French_controller_year_start"]==1558,"Guines controller not switched in 1558")
check(site["fort-risban-calais-1558"]["French_controller_year_start"]==1558,"Risban not French after 1558")
check(site["fort-nieulay-calais-1558"]["French_controller_year_start"]==1558,"Nieulay not French after 1558")
check(site["irish-fort-governor-1550s"]["previously_existing_fort_before_1550"],"Fort Governor invented in 1556")
check(site["irish-fort-protector-1550s"]["previously_existing_fort_before_1550"],"Fort Protector invented in 1556")
check(len(irish["new_1556_legislative_shires"])==2,"Irish 1556 law towns missing")
check(all(not x["actual_1556_full_modern_county_English_Crown_conquest_proven"] for x in irish["new_1556_legislative_shires"]),"legal county mistaken for military control")
check(irish["map_policy"]["actual_1556_land_grant_polygons_approved"]==0,"unknown plots faked")
check(len(ships["trips"])==6 and all(t["route_polyline"] is None for t in ships["trips"]),"fake nautical ship tracks")
check(ships["human_rights_layer"]["enslaved_people_John_Lok_return_year"]==1555 and ships["human_rights_layer"]["count"]==5,"Lok forced-slavery data lost")
check(len(money["objects"])==8 and money["colonial_realized_net_profit_GBP"] is None,"false colonial profits")
check(all(not x["reportable_as_English_colonial_net_profit"] for x in money["objects"]),"mixed unlike financial classes into profits")
check("NOT_cash" in next(x for x in money["objects"] if x["id"]=="FIN-1559-CALAIS-FUTURE-500K-SURETY")["amount_status"],"Calais 1559 treaty surety mistakenly considered cash")
check(queue["count"]>=16 and seed["from_year_end"]==1559,"archive queue or next decade handoff missing")
preview=(HERE/"interactive_research_preview.html").read_text(encoding="utf8")
check("French_control_change_year" in preview and "French_controller_year_start" in preview,"map preview does not switch French actual control in 1558")
check("POLITICAL_CONTROL_SITES_1550_1559.geojson" in preview,"map loads wrong source file")
check({"calais-crown","guines-crown-1520s"}<={x["stable_id"] for x in seed["political_place_identities"]},"France-held former English forts vanish in next decade")
print("PASS 1550s research: %s sources, %s events, 15 named sites, 11 dated map deltas, 8 dashed existing geographic outlines, 10 yearly snapshots, 9 inherited political identities, 2 legally contested Irish colony shires, 6 voyage references, zero fabricated period territorial polygons." % (len(sources),len(events["records"])))
