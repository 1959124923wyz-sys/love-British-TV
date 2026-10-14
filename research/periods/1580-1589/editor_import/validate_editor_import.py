#!/usr/bin/env python3
"""Validate Chapter 10 chief-editor Atlas/GeoJSON import package, fail closed.

Does not verify historic manuscripts or infer land territory polygons.
Produces EDITOR_QA.json only when all inter-file invariants pass.
"""
from __future__ import annotations
import datetime
import json
import pathlib
import sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
EDI=ROOT/"editor_import"
def read(name,editor=True):
    return json.loads(((EDI if editor else ROOT)/name).read_text(encoding="utf8"))
def require(test,message):
    if not test: raise AssertionError(message)
def verify():
    atlas=read("ATLAS_EVENT_REVIEW_CANDIDATE.json")
    geo=read("CONTROL_AND_VIOLENCE_PLACES_1580_1589.geojson")
    delta=read("VIOLENCE_AND_CONTROL_DELTA_1580_1589.geojson")
    paths=read("VIOLENT_EXTRACTION_ROUTE_REFERENCES_1580_1589.geojson")
    ledger=read("PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json")
    notes=read("HISTORICAL_DETAIL_NOTES_1580_1589.json")
    trans=read("CONTROL_TRANSITION_1579_1589.json",False)
    archival=read("ARCHIVAL_ACTION_QUEUE.json",False)
    srcreg=read("SOURCE_REGISTRY.json",False)
    old=read("EVENT_CANDIDATES_1580_1589.json",False)
    maps=read("PRIMARY_MAP_SOURCE_CATALOG.json",False)
    events=atlas["events"]
    all_sources={s["id"] for s in atlas["sources"]}
    require(len(all_sources)==len(atlas["sources"])>=68,"Source ID uniqueness / count")
    require(all(s.get("url","").startswith("https://") for s in atlas["sources"]),"Source URL")
    require(all_sources=={s["id"] for s in srcreg["sources"]},"Atlas missing new research sources")
    require(len(events)==len(old["events"])==28,"Atlas event count mismatch")
    require(len({e["id"] for e in events})==28,"Duplicate event IDs")
    originalids={e["id"] for e in old["events"]}
    require({e["research_event_id"] for e in events}==originalids,"Lost research historical event")
    require(len(notes["records"])==28 and set(notes["records"])=={e["id"] for e in events},"Missing historical-document foldout records")
    require(atlas["period"]["from"]==1580 and atlas["period"]["to"]==1589,"Wrong decade")
    require(atlas.get("colonial_polygons")==[],"No audited historic occupation polygon available")
    require(atlas.get("routes")==[],"Route overlays belong in separately-labelled schematic layer")
    require(len(geo["features"])==len(atlas["places"])==16,"Modern geosite count mismatch")
    require(geo["metadata"]["real_1580s_English_occupation_polygons"]==0,"False historical territory")
    placepoints={f["id"]:f for f in geo["features"]}
    by_research={e["research_event_id"]:e for e in events}
    mapped=0
    for e in events:
        require(1580<=e["year"]<=1589 and e["start_year"]==e["visible_from"]==e["year"],"Year-time chronology "+e["id"])
        require(e["icon_code"] in "POL EXP TER WAR REP SLV LAB ECO DIS FAM RES ABO IND INF CLM DOC".split(),"Unsupported icon")
        require(e["source_ids"] and all(i in all_sources for i in e["source_ids"]),"Missing source for "+e["id"])
        require(e["significance"]["level"] in (1,2,3),"Invalid importance")
        require(e["actual_English_territory_created"] is False and e["historical_control_boundary_verified"] is False,"Fabricated occupied area "+e["id"])
        require(e["colonial_profit"] is None,"Unverified royal profit")
        require(set(notes["records"][e["id"]]["source_ids"])==set(e["source_ids"]),"Foldout source mismatch "+e["id"])
        if e["lat"] is not None:
            mapped+=1
            require(isinstance(e["lng"],(int,float)),"Missing lon")
            hit=[f for f in geo["features"] if e["research_event_id"] in f["properties"]["event_ids"]]
            require(len(hit)==1,"Place ID mapping error: "+e["id"])
            require(hit[0]["geometry"]["coordinates"]==[e["lng"],e["lat"]],"Map point atlas mismatch "+e["id"])
        else:
            require(e["lng"] is None,"Lon without lat "+e["id"])
    require(mapped==16,"Exactly 16 source-linked locations expected")
    aqu=by_research["ch10-1585-aquascogoc-arson"]
    require(aqu["date_label"].startswith("1585年07月18"),"NCDNCR state-marker 18 July 1585 date not applied")
    require("C10-S61" in aqu["source_ids"],"State heritage source missing")
    smer=by_research["ch10-1580-smerwick"]
    require("C10-S56" in smer["source_ids"],"OPW sourced Smerwick omitted")
    require(len(delta["features"])==len(events) and delta["metadata"]["historical_polygon_count"]==0,"Invalid year-delta or historic territorial claim")
    for f in delta["features"]:
        p=f["properties"]
        require(p["source_ids"] and all(x in all_sources for x in p["source_ids"]),"Delta source")
        require(p["area_sqkm"] is None and p["fill_authorized"] is False,"Fake colored historic area")
        require(f["geometry"] is None or f["geometry"]["type"]=="Point","Delta only points or null")
    require(len(paths["features"])==6,"Expected six source-backed schematic path stages")
    for f in paths["features"]:
        p=f["properties"];g=f["geometry"]
        require(g["type"]=="LineString" and len(g["coordinates"])==2,"Real ship GPS was not measured")
        require(p["render_style"].startswith("dashed") and p["original_16c_route_points_measured"] is False,"Inferred line displayed as real route")
        require(p["source_ids"] and all(x in all_sources for x in p["source_ids"]),"Route unsupported")
        require(p["route_corridor_controlled_by_England"] is False and p["carried_captives_on_this_entire_segment_proven"] is False,"Implausible territorial/slave route claim")
    require(len(ledger["records"])==18,"Expected separate 18 audited-but-unconfirmed economic evidence lines")
    by_kind={f["kind"]:f for f in ledger["records"]}
    require(ledger["summary"]["royal_net_gbp"] is None and ledger["summary"]["slave_sales_profit_gbp"] is None,"Imaginary royal or slavery profits")
    require("sale_of_enslaved_people" in by_kind and by_kind["sale_of_enslaved_people"]["quantity"] is None,"No primary sale ledger exists")
    upper=[r for r in ledger["records"] if r["id"]=="C10-M17"]
    require(len(upper)==1 and upper[0]["quantity"]==30000 and "upper_limit" in upper[0]["kind"],"1582 mortality should be report upper bound, not census")
    require(all(r["do_not_sum_with_other_rows"] for r in ledger["records"]),"Reports overlap")
    require(len(trans["year_end_states"])==10 and [s["year_end"] for s in trans["year_end_states"]]==list(range(1580,1590)),"Missing annual political continuity")
    require(all(s["valid_historic_english_occupation_polygons"]==0 for s in trans["year_end_states"]),"Invalid inferred colonial polygons")
    require(all(any(t["stable_id"]=="loughrea-english-warders-1576-1580" and t["year"]==1580 for t in trans["transitions"]) for _ in [0]),"Missing 1580 Loughrea English exit")
    require(archival["total"]==len(archival["actions"])==18,"Archival queue count")
    require(all(m.get("polygon_fill_authorized") is False for m in maps["maps"]),"Historical map outlines not verified")
    return {
      "schema":"ch10_editor_import_qa_v1",
      "run_date":"2026-10-14",
      "status":"PASS",
      "review_stage":"data_integrity_only_not_manuscript_authentication_or_online_browser_visual_validation",
      "counts":{"historical_events":len(events),"sources":len(all_sources),"atlas_places":len(geo["features"]),"delta_features":len(delta["features"]),"georeferenced_modern_point_events":mapped,"unlocated_event_geometries":len(events)-mapped,"schematic_route_segments":len(paths["features"]),"money_and_human_violence_records":len(ledger["records"]),"year_end_states":len(trans["year_end_states"]),"historical_detail_notes":len(notes["records"]),"original_cartographic_sources":len(maps["maps"]),"archival_queue":archival["total"],"certified_true_colonial_polygon_count":0},
      "checks":["All source IDs resolved","Chronological year gates","Unlocated events retain null GPS","Aquascogoc 18 July NCDNCR source","Smerwick and Carrigafoyle are independent casualties","St Leger mortality = reported scholarly upper bound","Human transport evidence ≠ legal sale or slave-trade profit","No route claimed measured navigation","No current borders promoted to historical sovereignty","1580 Loughrea controller changes","All foldout detail note IDs valid"],
      "unresolved":["Historically measured Munster seignory grant boundaries","1580s true colonial military territorial polygons","Spanish original captive depositions and English sale accounts","1586 booty share audited royal net","1582 all-death census"],
      "ready_for_chief_editor_review":True,
      "released_to_main":False
    }

def main():
    qa=verify()
    out=EDI/"EDITOR_QA.json"
    out.write_text(json.dumps(qa,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("PASS editor import QA:",json.dumps(qa["counts"],ensure_ascii=False))
if __name__=="__main__":
    try:main()
    except Exception as exc:
        print("FAIL CH10 EDITOR QA:",str(exc),file=sys.stderr)
        raise SystemExit(1)
