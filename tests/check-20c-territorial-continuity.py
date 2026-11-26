#!/usr/bin/env python3
"""Verify the twentieth-century map's dated regional data and loader contract."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
paths = [ROOT / "data/twentieth-century-territorial-areas.geojson",
         ROOT / "data/twentieth-century-territorial-islands-batch2.geojson",
    ROOT / "data/twentieth-century-territorial-local-batch3.geojson",
         *sorted((ROOT / "data/cshapes-20c").glob("*.geojson"))]
app = (ROOT / "app.js").read_text()
all_features, ids, source_ids = [], set(), set()
for path in paths:
    d = json.loads(path.read_text())
    assert path.relative_to(ROOT).as_posix() in app, path
    assert d["type"] == "FeatureCollection"
    assert d["metadata"]["schema"] == "atlas-20c-territorial-areas-v1"
    assert d["metadata"]["historical_area_statistics"] is False
    local_sources = {s["id"] for s in d["sources"]}
    assert len(local_sources) == len(d["sources"])
    assert not local_sources & source_ids
    source_ids.update(local_sources)
    for s in d["sources"]:
        assert s["label"] and s["url"].startswith("https://")
    for f in d["features"]:
        p, g = f["properties"], f["geometry"]
        assert f["id"] not in ids
        ids.add(f["id"])
        assert p["name"] and p["stable_id"] and p["summary_zh"]
        assert 1900 <= p["start_year"] <= p["end_year"] <= 1999
        assert p["historical_boundary_confirmed"] is False
        assert p["fill_authorized"] is False
        assert p["dash_only"] is True
        assert p["exclude_from_area_aggregation"] is True
        assert p["area_sqkm"] is None
        assert p["source_ids"] and set(p["source_ids"]) <= local_sources
        assert isinstance(p["related_event_ids"], list)
        assert g["type"] in ("Polygon", "MultiPolygon")
        polygons = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        assert polygons
        for polygon in polygons:
            assert polygon
            for ring in polygon:
                assert len(ring) >= 4 and ring[0] == ring[-1]
                assert all(len(pt) == 2 and -180 <= pt[0] <= 180 and -90 <= pt[1] <= 90 for pt in ring)
        all_features.append(f)
event_ids = set()
for start in range(1900, 2000, 10):
    chronology = json.loads((ROOT / f"data/stories/serial/chronology-{start}-{start+9}.json").read_text())
    assert chronology["period"] == {"from": start, "to": start+9}
    event_ids.update(e["id"] for e in chronology["events"])
for f in all_features:
    assert set(f["properties"]["related_event_ids"]) <= event_ids
counts = {}
for year in range(1900, 2000):
    current = [f["properties"]["stable_id"] for f in all_features
               if f["properties"]["start_year"] <= year <= f["properties"]["end_year"]]
    assert current and len(current) == len(set(current)), year
    counts[year] = len(current)
assert counts[1920] >= 90
assert counts[1997] < counts[1996]  # Hong Kong handover
print(f"{len(all_features)} dated footprints; {len(source_ids)} source registrations")
print("All 100 years pass interval, source, geometry-structure and uniqueness checks.")
print({y: counts[y] for y in (1900, 1920, 1945, 1960, 1980, 1996, 1997, 1999)})

# Coercive-policy jurisdictions and inherited confiscation footprints are
# separately identified, dated and must never enter sovereignty statistics.
policy = [f for f in all_features if f["properties"].get("topic_id") == "E20-T077"]
raupatu = [f for f in all_features if f["properties"].get("topic_id") == "E20-T079"]
assert len(policy) >= 20 and len(raupatu) >= 29
for f in policy + raupatu:
    p = f["properties"]
    assert p["territorial_claim"] is False
    assert p["inherited_geometry_feature_id"] and p["spatial_semantics"]
    assert p["display_kind"] == ("coercive_policy" if f in policy else "land_dispossession")
def active(stable, y):
    return [f["properties"] for f in all_features if f["properties"]["stable_id"] == stable
            and f["properties"]["start_year"] <= y <= f["properties"]["end_year"]]
assert active("au-policy-wa", 1905)[0]["start_year"] == 1905
assert active("au-policy-wa", 1962) and not active("au-policy-wa", 1963)
assert active("au-policy-qld", 1939)[0]["start_year"] == 1939
assert not active("au-policy-qld", 1965)
assert active("au-policy-nt", 1911)[0]["start_year"] == 1911
assert active("au-policy-nt", 1957)[0]["start_year"] == 1957
assert not active("au-policy-nt", 1964)
assert active("nz-raupatu-legacy-waikato", 1995)[0]["start_year"] == 1995
assert active("nz-raupatu-legacy-eastern-bay", 1999)[0]["start_year"] == 1999
print("PASS: local coercive-law jurisdiction and historical confiscation-claim phase checks.")
