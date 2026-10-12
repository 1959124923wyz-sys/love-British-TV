#!/usr/bin/env python3
"""1520—1529 chief-editor review data validator.
Run from repo root: python3 editorial/1520-1529/check_candidate.py
Only checks structure/source consistency; historical truth requires research review.
"""
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent

def rd(p):
    return json.loads(p.read_text(encoding="utf-8"))

def check():
    atlas=rd(HERE/"ATLAS_REVIEW_CANDIDATE.json")
    mapping=rd(HERE/"DECISION_MATRIX.json")
    delta=rd(HERE/"SOURCE_DELTA_INDEX.json")
    geo=rd(HERE/"GEOGRAPHY_REFERENCE.geojson")
    categories={c["code"] for c in rd(ROOT/"data/icon-categories.json")["categories"]}
    previous=rd(ROOT/"data/atlas-1500-1509.json")
    assert atlas["period"]=={"from":1520,"to":1529,"next":1530}
    assert atlas["editorial_status"]=="CANDIDATES_ONLY_NOT_PUBLISHED_OR_EDITOR_APPROVED"
    assert atlas["routes"]==[] and atlas["colonial_polygons"]==[]
    events,places,sources=atlas["events"],atlas["places"],atlas["sources"]
    assert (len(events),len(places),len(sources))==(24,7,40)
    srcids={s["id"] for s in sources}
    assert len(srcids)==len(sources)
    assert all(urlsplit(s["url"]).scheme=="https" for s in sources)
    record_ids=set()
    for rec in events+places:
        assert rec["id"] not in record_ids, rec["id"]
        record_ids.add(rec["id"])
        assert rec["icon_code"] in categories, rec["id"]
        assert rec["source_ids"] and all(i in srcids for i in rec["source_ids"]),rec["id"]
        lat,lng=rec["lat"],rec["lng"]
        assert (lat is None)==(lng is None),rec["id"]
        if lat is not None:
            assert -90<=lat<=90 and -180<=lng<=180,rec["id"]
    for e in events:
        assert 1520<=e["year"]<=1529 and e["start_year"]==e["end_year"]==e["year"],e["id"]
        assert e["significance"]["level"] in (1,2,3),e["id"]
        assert e["colonial_profit"] is False
        assert e["editorial_status"]=="pending_editorial_review"
    for p in places:
        assert p["start_year"]<=1529 and p["observed_through_year"]>=1529,p["id"]
    assert not any("tournai" in r["id"].lower() for r in places),"Tournai English-held role ended 1519"
    assert {e["id"] for e in events}.isdisjoint({e["id"] for e in previous["events"]})
    assert mapping["counts"]=={"research_events":27,"editorial_candidates":24,"held":3}
    assert len(mapping["mapping"])==24
    assert {m["editor_candidate_id"] for m in mapping["mapping"] if m["editor_candidate_id"]}=={e["id"] for e in events}
    assert delta["all_staged_source_records"]==len(sources)
    assert {r["id"] for r in delta["records"]}==srcids
    stj=next(e for e in events if e["id"]=="1527-JOHN-RUT-STJOHNS")
    assert (stj["lat"],stj["lng"])==(47.5655556,-52.6980556)
    assert "GEO-NRCAN-STJOHNS-HARBOUR" in stj["source_ids"]
    assert geo["meta"]["colonial_control_polygons_approved"]==0
    for f in geo["features"]:
        if f["geometry"]["type"]=="Polygon":
            p=f["properties"];ring=f["geometry"]["coordinates"][0]
            assert p["approval"]=="never_render_as_published_actual_control"
            assert p["fill_authorized"] is False
            assert ring[0]==ring[-1],p["id"]
    # Evidence-based sites added in the map-detail research pass.
    details=rd(HERE/"MAP_DETAIL_POINTS.geojson")
    locs=details["features"]
    assert len(locs)==9
    assert all(f["geometry"]["type"]=="Point" for f in locs)
    idset={f["properties"]["id"] for f in locs}
    assert len(idset)==9
    for f in locs:
        for srcid in f["properties"]["source_ids"]:
            assert any(s["id"]==srcid for s in sources),srcid
        assert f["properties"]["no_area_claim"] is True
    monasteroris=next(e for e in events if e["id"]=="1521-MONASTERORIS")
    assert (monasteroris["lat"],monasteroris["lng"])==(53.34635313,-7.08543742)
    assert "friary" in monasteroris["geo_precision"]
    assert len([x for x in events if x["id"] in ("1523-CESSFORD-SIEGE","1523-FERNIEHIRST-DEMOLISHED","1523-WARK-SCOTS-FRENCH-SIEGE")])==3
    assert all(e["lat"] is not None for e in events if e["id"] in ("1523-CESSFORD-SIEGE","1523-FERNIEHIRST-DEMOLISHED","1523-WARK-SCOTS-FRENCH-SIEGE"))
    assert any(e["id"]=="1529-GUINES-LAWS" for e in events)
    return len(events),len(sources),len(places)

if __name__=="__main__":
    e,s,p=check()
    print(f"OK - 1520s editorial candidates: {e} events; {s} sources; {p} places, 0 approved control polygons.")
    print("This script verifies data structure and chronology, not archival truth or deployment.")
