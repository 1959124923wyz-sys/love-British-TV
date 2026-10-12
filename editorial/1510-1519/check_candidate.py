#!/usr/bin/env python3
"""Check editor intake for 1510–1519. Structural validation, NOT historical verification.
Run from repo root: python3 editorial/1510-1519/check_candidate.py
This script has no network access and never changes main or publishes the website.
"""
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent

def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def verify():
    d=read(HERE/"ATLAS_REVIEW_CANDIDATE.json")
    dec=read(HERE/"DECISION_MATRIX.json")
    pro=read(HERE/"SOURCE_PROVENANCE.json")
    codes={x["code"] for x in read(ROOT/"data/icon-categories.json")["categories"]}
    prior=read(ROOT/"data/atlas-1500-1509.json")
    sources=d["sources"]
    ids={s["id"] for s in sources}
    assert len(ids)==len(sources), "Duplicate source ID"
    assert len(pro["refs"])==len(sources), "Source provenance missing"
    assert ids=={x["source_id"] for x in pro["refs"]}, "Source provenance mismatch"
    assert d["period"]=={"from":1510,"to":1519,"next":1520}, "Wrong ten-year interval"
    assert d["editorial_status"].startswith("CURATED_CANDIDATES_ONLY"), "Must remain preview status"
    assert d["colonial_polygons"]==[], "No unapproved 1510s territorial polygons"
    assert d["routes"]==[], "No imagined voyages"

    ids_all=set()
    for s in sources:
        assert urlsplit(s["url"]).scheme=="https", s["id"]
    for kind in ("events","places"):
        for e in d[kind]:
            assert e["id"] not in ids_all, ("Duplicate ID",e["id"])
            ids_all.add(e["id"])
            assert e["icon_code"] in codes, ("Unapproved icon",e["id"])
            assert e["source_ids"] and all(x in ids for x in e["source_ids"]), ("Missing evidence",e["id"])
            lat,lng=e.get("lat"),e.get("lng")
            assert (lat is None)==(lng is None), ("Partial coordinates",e["id"])
            if lat is not None:
                assert -90<=lat<=90 and -180<=lng<=180,e["id"]
    for e in d["events"]:
        assert 1510<=e["year"]<=1519,e["id"]
        assert e["start_year"]==e["end_year"]==e["year"],e["id"]
        assert e["significance"]["level"] in (1,2,3),e["id"]
        assert e["significance"].get("review_status")=="provisional",e["id"]
        assert e.get("colonial_profit") is False,e["id"]
        assert e.get("editorial_status")=="pending-editorial-review",e["id"]
    for e in d["places"]:
        assert e["start_year"]<=1519<=e["end_year"] if e["end_year"] is not None else e["start_year"]<=1519,e["id"]
        assert e["observed_through_year"]>=1518,e["id"]
    t=next(x for x in d["places"] if x["id"]=="tournai-occupied-city-1513")
    assert (t["start_year"],t["observed_through_year"],t["end_year"],t["end_month"])==(1513,1518,1519,2)
    assert "1518" in next(x["description"] for x in d["events"] if x["id"]=="1518-TOURNAI-CESSION")
    assert not ({x["id"] for x in prior["events"]}&{x["id"] for x in d["events"]}),"Collision with prior decade"
    assert len(dec["mapping"])==dec["counts"]["research_events"]==19
    mapped={x["editor_candidate_id"] for x in dec["mapping"] if x["editor_candidate_id"]}
    assert mapped=={x["id"] for x in d["events"]},"Every staged event needs research genealogy"
    assert dec["counts"]["hold_in_research"]==4,"Research hold count"
    assert len(d["places"])==7 and len(d["events"])==15, "The intake changed; review stage content and update checksum expectations"
    assert any(x["id"]=="1517-RASTELL-ABORTED-COLONIZATION" and x["lat"] is None for x in d["events"])
    rastell=next(x for x in sources if x["id"]=="DCB-RASTELL-1517")
    assert rastell["url"].endswith("/rastell_john_1F.html"),"Wrong DCB URL (1F vs 1E)"
    # 1513–1519 Tournaisis spatial handoff: verify its only polygon is explicitly illustrative.
    extent=read(HERE/"TOURNAISIS_OPTIONAL_OVERLAY.geojson")
    assert extent["type"]=="FeatureCollection"
    shapes=extent["features"]
    polygon=[f for f in shapes if f["geometry"]["type"]=="Polygon"]
    actual_city=[f for f in shapes if f["properties"].get("id")=="TOURNAI-ENGLISH-CITY-RULE-CERTAIN"]
    assert len(shapes)==19 and len(polygon)==1 and len(actual_city)==1
    p=polygon[0]["properties"]
    assert p["approval"]=="never_render_as_published_actual_control"
    assert p["fill_authorized"] is False and p["visualization_only"] is True
    assert p["year_end_snapshot_while_english_present"]==[1513,1514,1515,1516,1517,1518]
    assert (p["start_year"],p["start_month"],p["end_year"],p["end_month"])==(1513,9,1519,2)
    ring=polygon[0]["geometry"]["coordinates"][0]
    assert ring[0]==ring[-1] and len(ring)>=4, "Unclosed polygon"
    assert all(3.0<=c[0]<=4.0 and 50.0<=c[1]<=51.0 for c in ring), "Unexpected polygon location"
    src={s["id"] for s in extent["meta"]["source_registry"]}
    assert len(src)==len(extent["meta"]["source_registry"]), "Duplicate boundary sources"
    for f in shapes:
        for id in f["properties"].get("source_ids",[]):
            assert id in src, (f["properties"]["id"],id)
        coord_source=f["properties"].get("coord_source_id")
        assert not coord_source or coord_source in src, f["properties"]["id"]
    assert actual_city[0]["geometry"]["type"]=="Point"
    assert actual_city[0]["properties"]["end_month"]=="1519-02"
    assert extent["meta"]["geometry_status"]=="no_approved_actual_historical_boundary_geometry"
    return len(d["events"]),len(d["places"]),len(d["sources"])

if __name__=="__main__":
    events,places,sources=verify()
    print(f"OK: {events} events, {places} political places, {sources} sources; 0 historical polygons.")
    print("NOTE: machine validity is not archaeological/archival approval or website deployment.")
