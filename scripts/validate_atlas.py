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
assert "PILOT v1.3" in html

# Third chapter 1510–1519 uses reviewed provenance and year-end governance statuses.
third = json.loads((ROOT/"data/atlas-1510-1519.json").read_text(encoding="utf-8"))
assert third["period"] == {"from":1510,"to":1519,"next":1520}
assert len(third["events"]) == 15 and len(third["places"]) == 7
assert len(third["sources"]) == 22
assert not third["colonial_polygons"] and not third["routes"]
third_source_ids = {row["id"] for row in third["sources"]}
assert len(third_source_ids) == len(third["sources"])
for src in third["sources"]:
    assert urlsplit(src["url"]).scheme in ("http","https")
ids_third = set()
for rec in third["events"]+third["places"]:
    assert rec["id"] not in ids_third, rec["id"]
    ids_third.add(rec["id"])
    assert rec["icon_code"] in svg_codes, rec["id"]
    assert rec["source_ids"] and all(sid in third_source_ids for sid in rec["source_ids"]), rec["id"]
    assert (rec["lat"] is None) == (rec["lng"] is None), rec["id"]
    if rec["lat"] is not None:
        assert -90 <= rec["lat"] <= 90 and -180 <= rec["lng"] <= 180
for e in third["events"]:
    assert 1510 <= e["year"] <= 1519 and 1510 <= e["start_year"] <= e["end_year"] <= 1519
    assert e["significance"]["level"] in (1,2,3)
    assert not e.get("colonial_profit")
for q in third["places"]:
    assert q["state_type"] == "political_relationship"
    assert q["start_year"] <= q["observed_through_year"] <= 1519
    assert q["end_year"] is None or q["end_year"] >= q["observed_through_year"]
tournai = next(p for p in third["places"] if p["id"] == "tournai-occupied-city-1513")
assert tournai["start_year"] == 1513 and tournai["observed_through_year"] == 1518
assert tournai["end_year"] == 1519 and tournai["end_month"] == 2
assert {e["id"] for e in third["events"]} & ids_later == set()
assert {"1513-FLODDEN","1513-TOURNAI-OCCUPATION","1518-TOURNAI-CESSION","1519-TOURNAI-RETURN","1517-RASTELL-ABORTED-COLONIZATION"} <= {e["id"] for e in third["events"]}
assert all(e["id"] in details["records"] for e in third["events"])
assert all(p["id"] in details["records"] for p in third["places"])
refgeo = json.loads((ROOT/"data/geography-1510-1519-hypotheses.geojson").read_text(encoding="utf-8"))
assert refgeo["type"] == "FeatureCollection" and len(refgeo["features"]) == 1
geo_layer = refgeo["features"][0]
assert geo_layer["geometry"]["type"] == "Polygon"
assert geo_layer["properties"]["fill_authorized"] is False
assert geo_layer["properties"]["active_years"] == [1513,1514,1515,1516,1517,1518]
assert "data/atlas-1510-1519.json" in app
assert "data/geography-1510-1519-hypotheses.geojson" in app
assert "year>=1513&&year<=1518" in app
assert 'id="chapterThree"' in html and 'max="1519"' in html
assert "renderEventList();renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderPoints();renderHypotheses();renderMilestones()" in app
assert (ROOT/"research/periods/1510-1519/PROGRESS.md").is_file()
assert (ROOT/"editorial/1510-1519/DECISION_MATRIX.json").is_file()
# MAP-FIRST French urban control polygons are explicitly symbols, not surveyed historic city walls.
cores = json.loads((ROOT/"data/french-urban-control-1500-1519.geojson").read_text(encoding="utf-8"))
assert cores["type"] == "FeatureCollection" and len(cores["features"]) == 2
assert cores["cartographic_semantics"]["prohibit_for_area_calculations"] is True
a_core,b_core = cores["features"]
assert a_core["properties"]["source_place_id"] == "calais-crown"
assert b_core["properties"]["source_place_id"] == "tournai-occupied-city-1513"
assert (a_core["properties"]["start_year"],a_core["properties"]["observed_through_year"]) == (1497,1519)
assert (b_core["properties"]["start_year"],b_core["properties"]["observed_through_year"],b_core["properties"]["end_year"],b_core["properties"]["end_month"]) == (1513,1518,1519,2)
for f in cores["features"]:
    assert f["geometry"]["type"] == "Point"
    assert f["properties"]["visual_role"] == "schematic_controlled_city_area"
    assert f["properties"]["historical_boundary_confirmed"] is False
    assert f["properties"]["source_ids"]
def active_city_symbols(y):
    return {f["properties"]["source_place_id"] for f in cores["features"]
        if f["properties"]["start_year"]<=y<=f["properties"]["observed_through_year"]}
assert active_city_symbols(1512) == {"calais-crown"}
assert active_city_symbols(1513) == {"calais-crown","tournai-occupied-city-1513"}
assert active_city_symbols(1518) == {"calais-crown","tournai-occupied-city-1513"}
assert active_city_symbols(1519) == {"calais-crown"}
assert "function renderControlAreas()" in app
assert "controlAreaPane" in app
assert "calais(f)&&['Polygon','MultiPolygon'].includes(f.geometry?.type)" in app
assert "renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderPoints();renderHypotheses()" in app
assert 'id="toggleControlAreas"' in html
assert (ROOT/"docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md").is_file()
# v1.3: real coastline polygons and research-grade approximate historic territorial envelopes.
footprints=json.loads((ROOT/"data/territorial-footprints-1497-1519.geojson").read_text(encoding="utf-8"))
assert footprints["type"] == "FeatureCollection" and len(footprints["features"]) == 7
control=next(f for f in footprints["features"] if f["id"] == "calais-pale-sourced-places-approx-1497-1519")
assert control["properties"]["start_year"] == 1497 and control["properties"]["observed_through_year"] == 1519
assert control["properties"]["geometry_role"] == "attested_settlement_envelope_not_surveyed_border"
assert control["properties"]["display_group"] == "control"
assert sum(f["properties"]["display_group"]=="political" for f in footprints["features"]) == 5
assert sum(f["properties"]["display_group"]=="research" for f in footprints["features"]) == 1
for f in footprints["features"]:
    assert f["geometry"]["type"] in ("Polygon","MultiPolygon"), f["id"]
    assert f["properties"]["historical_boundary_precision"], f["id"]
    assert f["properties"]["start_year"]<=1500 and f["properties"]["observed_through_year"]>=1519
    polygons=f["geometry"]["coordinates"] if f["geometry"]["type"]=="MultiPolygon" else [f["geometry"]["coordinates"]]
    assert polygons and all(ring[0]==ring[-1] for poly in polygons for ring in poly), f["id"]
assert "function renderTerritories()" in app
assert "map.createPane('territoryPane')" in app and "ensureTerritorialPatterns()" in app
assert "const years=[...new Set(all.filter(e=>e.id!=='status-1500').map(e=>e.year).filter(y=>y>=1497&&y<=year))]" in app
assert 'id="toggleTerritorialFootprints"' in html
assert (ROOT/"data/TERRITORIAL_FOOTPRINT_SOURCES.md").is_file()

# v1.2 political relationship coverage and chronological-event reveal.
relations=json.loads((ROOT/"data/political-relations-1500-1519.geojson").read_text(encoding="utf-8"))
assert relations["type"]=="FeatureCollection" and len(relations["features"])==5
relation_types={f["properties"]["political_relation"] for f in relations["features"]}
assert {"crown_dependency","autonomous_lordship","scottish_crown_territory","crown_administration_core"} <= relation_types
assert all(f["geometry"]["type"]=="Point" and f["properties"]["historic_polygon_verified"] is False for f in relations["features"])
assert "function renderPoliticalRelationAreas()" in app
assert "if((atlas===atlasEarly&&e.year>1499)||e.year>year)continue;" in app
assert "year>=1502?'1502':'—'" in app
assert "year>=1513?'1513':'—'" in app
assert "fullArchive||e.year<=year" in app
assert 'id="showFullChapterArchive"' in html
assert 'id="togglePoliticalRelations"' in html



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
