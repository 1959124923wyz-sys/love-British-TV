#!/usr/bin/env python3
"""Historical atlas data integrity checks (not a historical truth validator)."""
import json
from pathlib import Path
from urllib.parse import urlsplit
ROOT = Path(__file__).resolve().parent.parent
a = json.loads((ROOT/"data/atlas-1497-1500.json").read_text(encoding="utf-8"))
assert a["period"] == {"from": 1497, "to": 1500}
assert len(a["events"]) >= 6 and len(a["sources"]) >= 5
src_ids = {s["id"] for s in a["sources"]}
assert len(src_ids) == len(a["sources"])
for s in a["sources"]:
    assert urlsplit(s["url"]).scheme == "https", s["id"]
ids = set()
for key in ("events", "candidates", "routes", "polities"):
    for record in a[key]:
        assert record["id"] not in ids, record["id"]
        ids.add(record["id"])
        for src in record.get("source_ids", []):
            assert src in src_ids, (record["id"], src)
        if key == "events":
            assert 1496 <= record["year"] <= 1500
            assert -90 <= record["lat"] <= 90
            assert -180 <= record["lng"] <= 180
            assert record["start_year"] <= record["end_year"]
        if key == "routes":
            assert record["certainty"] in ("illustrative", "highly-uncertain")
            assert len(record["coords"]) >= 2
            for lat, lng in record["coords"]:
                assert -90 <= lat <= 90 and -180 <= lng <= 180
        if key == "candidates":
            assert -90 <= record["lat"] <= 90 and -180 <= record["lng"] <= 180
for e in a["events"]:
    significance = e.get("significance")
    assert isinstance(significance, dict), ("Missing significance", e["id"])
    assert type(significance.get("level")) is int and significance["level"] in (1,2,3), ("Invalid tier",e["id"])
    assert significance.get("rationale"), ("Missing reason",e["id"])
assert a.get("visual_system",{}).get("importance_independent_of_certainty") is True
# Approved category vocabulary and sprite must remain in sync with event records.
catalog = json.loads((ROOT/"data/icon-categories.json").read_text(encoding="utf-8"))
assert catalog["version"] == "2.0-approved"
categories = catalog["categories"]
assert len(categories) == 16
symbol_codes = [entry["code"] for entry in categories]
assert len(set(symbol_codes)) == 16
assert len(set(entry["key"] for entry in categories)) == 16
sprite = (ROOT/"assets/atlas-icons.svg").read_text(encoding="utf-8")
from xml.etree import ElementTree as ET
icons = ET.fromstring(sprite)
svg_codes = {el.get("id") for el in icons.iter() if el.tag.endswith("symbol")}
assert set(symbol_codes) == svg_codes, (set(symbol_codes) ^ svg_codes)
for e in a["events"]:
    assert e["icon_code"] in svg_codes, e["id"]
assert a["visual_system"]["version"] == "2.0-approved"
# Collector 1 preview: 1500–1509 must never contain invented control polygons or speculative 1508 tracks.
later = json.loads((ROOT/"data/atlas-1500-1509.json").read_text(encoding="utf-8"))
assert later["period"]["from"] == 1500 and later["period"]["to"] == 1509
assert not later["colonial_polygons"], "Do not infer unverified Calais / Pale polygons"
assert not later["routes"], "No sourced new exact voyages"
assert len(later["events"]) >= 20 and len(later["places"]) >= 5
later_sources = {v["id"] for v in later["sources"]}
assert len(later_sources) == len(later["sources"])
for src in later["sources"]:
    assert urlsplit(src["url"]).scheme in ("http","https"), src["id"]
ids_later=set()
for rec in later["events"]+later["places"]:
    assert rec["id"] not in ids_later, rec["id"]
    ids_later.add(rec["id"])
    assert rec["icon_code"] in svg_codes, rec["id"]
    assert rec["source_ids"] and all(src in later_sources for src in rec["source_ids"]), rec["id"]
    if rec["lat"] is None or rec["lng"] is None:
        assert rec["lat"] is None and rec["lng"] is None, rec["id"]
    else:
        assert -90 <= rec["lat"] <= 90 and -180 <= rec["lng"] <= 180, rec["id"]
for ev in later["events"]:
    assert 1500 <= ev["start_year"] <= ev["end_year"] <= 1509, ev["id"]
    assert ev["significance"]["level"] in (1,2,3), ev["id"]
    assert ev.get("colonial_profit") is not True, ev["id"]
assert "1508-1509-SEBASTIAN-VOYAGE-QUESTION" not in ids_later
# Prevent regression where one co-located item overwrote a different historical record.
assert {"1501-1502-INDIGENOUS-AT-COURT","1502-PERPETUAL-PEACE"} <= ids_later
assert {"1503-CARRICKFERGUS","1507-CARRICKFERGUS-O-NEILL",
        "1508-ENNISKILLEN","1509-OMAGH"} <= ids_later
assert len({e["id"] for e in later["events"]}) == len(later["events"])
for place in later["places"]:
    assert place["state_type"] == "political_relationship"
    assert place["start_year"] <= 1500
    assert place["observed_through_year"] >= 1509
    assert place["end_year"] is None
assert later["presentation"]["chapter"]["event_visibility"] == "all-significant-events-throughout-chapter"
assert later["presentation"]["chapter"]["state_visibility"] == "persists-while-supported"

# V0.7: 21 visible events at Britain/Ireland map zoom, separate atlas geography hypotheses and
# source-backed second-level historical notes.
assert all(-90 <= e["lat"] <= 90 and -180 <= e["lng"] <= 180 for e in later["events"])
assert len(later["events"]) >= 21
details = json.loads((ROOT/"data/historical-detail-notes.json").read_text(encoding="utf-8"))
required_notes = {e["id"] for e in a["events"] + later["events"] + later["places"]}
assert required_notes <= set(details["records"])
for id in required_notes:
    note = details["records"][id]
    assert note.get("context") and note.get("source_ids")
hypotheses = json.loads((ROOT/"data/geography-1500-hypotheses.geojson").read_text(encoding="utf-8"))
assert hypotheses["type"] == "FeatureCollection"
assert len(hypotheses["features"]) == 3
assert {f["geometry"]["type"] for f in hypotheses["features"]} == {"Polygon", "LineString"}
for shape in hypotheses["features"]:
    assert shape["properties"]["fill_authorized"] is False
    assert shape["properties"]["display_mode"] == "independent_dashed_hypothesis"
app = (ROOT/"app.js").read_text(encoding="utf-8")
html = (ROOT/"index.html").read_text(encoding="utf-8")
css = (ROOT/"css/dark-atlas-v2.css").read_text(encoding="utf-8")
# v0.8: compact numeric hub is intentional; original v0.7 full-map fan must not return.
assert "function expandCluster(group,pin=false)" in app
assert "atlas-aggregate" in app and "clusterExpanded" in app
assert "map.containerPointToLatLng" in app and "map.latLngToContainerPoint" in app
assert "Math.ceil(Math.sqrt(n))" not in app
assert "uncertain-badge" not in app
assert "calais(f)?3.4:2.7" in app
assert "fillOpacity:f.geometry.type==='LineString'?0:calais(f)?.12:.07" in app
# v0.9: regression checks for transparent fan-out and readable event descriptions.
assert "map.createPane('eventTooltipPane')" in app
assert "map.getPane('eventTooltipPane').style.zIndex='820'" in app
assert "otherPoints=clusterObstacles" in app
assert "occlusion*5" in app
assert "atlas-flyout-icon" in app
assert "closeTooltip()" in app
assert "移至主标记或点击，展开具体事件图标" not in app
assert "expanded-event" in app
assert "leaflet-marker-icon.atlas-flyout-icon" in css
assert "background:transparent!important" in css
assert ".leaflet-tooltip-pane{" in css and "z-index:820!important" in css
assert "PILOT v0.9" in html

assert "data/historical-detail-notes.json" in app and "renderHypotheses()" in app
assert 'id="toggleHypotheses"' in html and 'id="mapControls"' in html
assert html.index('id="mapControls"') < html.index('<main class="map-stage"')
assert "leaflet-control-attribution{display:block!important" in css


for f in ("research/periods/1500-1510/PROGRESS.md",
          "research/periods/1500-1510/CONTROL_AND_CHRONOLOGY_REVIEW.md"):
    assert (ROOT/f).is_file(), f

assert not a.get("colonial_polygons"), "Never paint unverified 1497 colonies"
geo = json.loads((ROOT/"data/modern-uk-regions.topojson").read_text(encoding="utf-8"))
assert geo["type"] == "Topology"
names = {g["properties"]["AREANM"] for g in geo["objects"]["UKregionmerc"]["geometries"]}
assert {"Scotland", "Wales", "London", "Northern Ireland"} <= names
for asset in ("index.html", "app.js", "style.css", "README.md", "CHANGELOG.md", "RESEARCH_HANDOFF.md"):
    assert (ROOT/asset).stat().st_size > 0, asset
print(f"OK: {len(a['events'])} events, {len(a['sources'])} references, {len(names)} modern UK regions")
