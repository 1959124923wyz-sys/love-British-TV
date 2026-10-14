#!/usr/bin/env python3
"""Chapter 10 research-only historical integrity QA.

Checks sources, year and political continuity, loss-vs-profit accounting,
map rights and literal no-fake-polygons policy. This is not manuscript review
or approval to publish source geometry.
"""
from __future__ import annotations
import json, pathlib, sys

P = pathlib.Path(__file__).resolve().parent

def read(filename):
    return json.loads((P/filename).read_text(encoding="utf-8"))
def require(cond, explanation):
    if not cond: raise AssertionError(explanation)
def audit():
    sources=read("SOURCE_REGISTRY.json")["sources"]
    events=read("EVENT_CANDIDATES_1580_1589.json")
    ledger=read("VIOLENCE_PLUNDER_CAPTIVITY_ECONOMIC_LEDGER.json")
    maps=read("PRIMARY_MAP_SOURCE_CATALOG.json")
    control=read("CONTROL_TRANSITION_1579_1589.json")
    actions=read("ARCHIVAL_ACTION_QUEUE.json")
    geometry=read("GEOGRAPHIC_EVENT_ANCHORS_1580_1589.geojson")

    ids=[s["id"] for s in sources]; idset=set(ids)
    require(len(ids)>=45 and len(ids)==len(idset),"Duplicate or missing chapter10 sources")
    require(all(s["url"].startswith("https://") for s in sources),"Source URL malformed")
    require(len(events["events"])>=20 and events["total"]==len(events["events"]),"Event count")
    valid_icons=set("POL EXP TER WAR REP SLV LAB ECO DIS FAM RES ABO IND INF CLM DOC".split())
    eid=[]
    for e in events["events"]:
        require(1580 <= e["year"] <= 1589, "Wrong event year: "+e["id"])
        require(e["source_ids"] and all(q in idset for q in e["source_ids"]), "Unresolved event reference "+e["id"])
        require(e["icon_code"] in valid_icons,"Bad icon "+e["id"])
        require(e["significance"]["level"] in (1,2,3),"Bad significance "+e["id"])
        require(e["inclusion"]=="candidate_not_in_main","Research included in main "+e["id"])
        require(e["geography"]["geometry"] is None,"Unreviewed fake coordinates "+e["id"])
        eid.append(e["id"])
    require(len(set(eid))==len(eid),"Duplicate historical event IDs")
    lookup={e["id"]:e for e in events["events"]}
    require(lookup["ch10-1580-loughrea-recapture"]["month_or_day"] is None,"Unsubstantiated Loughrea exact date")
    require(lookup["ch10-1586-drake-displaced-captives"]["month_or_day"] is None,"Unsupported captive dispatch month")
    require("C10-S41" in lookup["ch10-1586-drake-santo-domingo"]["source_ids"],"Santo Domingo amount missing source")
    require(len([e for e in events["events"] if e["year"]==1589])>=3,"Missing 1589 documented Galician attacks")

    records=ledger["records"]
    require(ledger["accounting_policy"]["british_crown_net_profit_gbp"] is None,"Invented state profit")
    require(ledger["accounting_policy"]["transatlantic_slave_sales_net_profit_1580s"] is None,"Invented slave-sale profit")
    for r in records:
        require(r["source_ids"] and all(x in idset for x in r["source_ids"]), "Ledger orphan")
        require(r["royal_profit_gbp"] is None,"Mixed ransom into supposed royal profit")
        require(r["may_sum_with_other_rows"] is False,"Conflicting evidence may not sum")
        require(r["event_id"] in lookup,"Ledger missing event "+r["event_id"])
    sales=[r for r in records if r["evidence_kind"]=="sale_of_enslaved_people"]
    require(sales and all(r["value_reported"] is None for r in sales),"Invented slave sales")
    require(maps["verified_authentic_16c_actual_control_polygons"]==0,"Invented historic territorial polygon")
    require(maps["validated_historical_claim_area_polygons"]==0,"Unapproved historical grants")
    require(all(m["polygon_fill_authorized"] is False for m in maps["maps"]),"Map catalogue promoted to occupation without licensing")
    require(len(control["year_end_states"])==10,"Ten year-end slices expected")
    require([z["year_end"] for z in control["year_end_states"]]==list(range(1580,1590)),"Ten annual snapshots continuity")
    require(all(z["valid_historic_english_occupation_polygons"]==0 for z in control["year_end_states"]),"Fake history polygon count")
    require(len(control["static_polities"])==9,"Inherited political IDs changed without editor review")
    require("loughrea-english-warders-1576-1580" in [t["stable_id"] for t in control["transitions"] if t["year"]==1580],"Loughrea recapture missing")
    require(geometry["type"]=="FeatureCollection" and len(geometry["features"])>=2,"Missing sourced research map references")
    for f in geometry["features"]:
        p=f["properties"]; xy=f["geometry"]["coordinates"]
        require(f["geometry"]["type"]=="Point" and len(xy)==2 and -180<xy[0]<180 and -90<xy[1]<90,"Bad historical reference point")
        require(p["event_id"] in lookup and all(q in idset for q in p["source_ids"]),"Orphan modern event location")
        require(p["historical_boundary_confirmed"] is False and p["fill_authorized"] is False and p["area_sqkm"] is None, "Site point falsely treated as a historical control area")
    require(actions["total"]==len(actions["actions"]),"Archive queue invalid")
    require(all(x["status"]=="pending" for x in actions["actions"]),"Unverified external archiving claims")
    print("PASS ch10 research integrity:",len(sources),"sources,",len(events["events"]),"events,",len(records),"ledger lines,",len(maps["maps"]),"map leads,",len(control["year_end_states"]),"annual states,",len(actions["actions"]),"pending archives,",len(geometry["features"]),"modern event anchors; historical polygons 0")

if __name__=="__main__":
    try:audit()
    except Exception as err:
        print("FAIL:",type(err).__name__,str(err),file=sys.stderr)
        raise SystemExit(1)
