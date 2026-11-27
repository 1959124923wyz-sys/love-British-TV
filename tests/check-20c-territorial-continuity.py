#!/usr/bin/env python3
"""Verify the twentieth-century map's dated regional data and loader contract."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
paths = [ROOT / "data/twentieth-century-territorial-areas.geojson",
         ROOT / "data/twentieth-century-territorial-islands-batch2.geojson",
    ROOT / "data/twentieth-century-territorial-local-batch3.geojson",
    ROOT / "data/twentieth-century-india-provinces-1900-1930.geojson",
    ROOT / "data/twentieth-century-india-provinces-1931-1946.geojson",
    ROOT / "data/twentieth-century-territorial-local-batch6.geojson",
    ROOT / "data/twentieth-century-territorial-canada-batch7.geojson",
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
    assert (p.get("inherited_geometry_feature_id") or p.get("upstream_geometry_feature_id")) and p["spatial_semantics"]
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

# Historical India layers: check each legal phase and distinguish direct
# provincial administration from princely-state relations.
india = [f for f in all_features if f["properties"].get("topic_id") == "E20-T002"]
assert len(india) == 273
for f in india:
    p = f["properties"]
    assert p["geometry_license"] == "LGPL-3.0"
    assert p["upstream_shp_sha"] and p["upstream_dbf_sha"]
    assert p["display_kind"] == ("political" if p["upstream_native"] == "1" else "administrative")
    assert p["end_year"] <= 1946 and p["territorial_claim"] is False
assert all(any(f["properties"]["start_year"] <= y <= f["properties"]["end_year"] for f in india) for y in range(1900, 1947))
assert active("india20-eastern-bengal-and-assam-province", 1905)
assert active("india20-eastern-bengal-and-assam-province", 1911)
assert not active("india20-eastern-bengal-and-assam-province", 1912)
assert active("india20-bihar-and-orissa-province", 1912)
assert not active("india20-bihar-and-orissa-province", 1936)
assert active("india20-sindh-province", 1936)
assert active("india20-hyderabad-states", 1946)
assert not active("india20-hyderabad-states", 1947)
print("PASS: historical India provinces, princely-state semantics, Bengal and 1936 changes, independence end.")

# Batch six: annual legal jurisdictions and independent-state legacy layers.
assert active("au-policy-act", 1911) and not active("au-policy-act", 1965)
assert not active("au-policy-jervis-bay", 1914) and active("au-policy-jervis-bay", 1915)
assert active("au-policy-nsw-pre-act", 1915) and not active("au-policy-nsw-pre-act", 1969)
assert not active("newfoundland-island-20c", 1949)
for stable in ("au-nsw-land-rights-legacy", "au-nt-land-rights-legacy", "nz-moriori-chatham-legacy", "banaba-island", "nauru-island"):
    assert active(stable, 1982)[0]["display_kind"] == "land_dispossession"
print("PASS: batch six jurisdictions and 1982 legacy layers.")

# Batch seven: Canadian historical border changes and land rights.
assert active("yukon-district", 1900)[0]["start_year"] == 1900
assert active("yukon-district", 1901)[0]["start_year"] == 1901
assert not active("alberta-province-20c", 1904) and active("alberta-province-20c", 1905)
assert not active("alberta-district", 1905)
assert active("british-columbia-polity", 1902)[0]["end_year"] == 1902
assert active("british-columbia-polity", 1903)[0]["start_year"] == 1903
assert active("manitoba-province", 1912)[0]["start_year"] == 1912
assert active("ontario-province", 1912)[0]["start_year"] == 1912
assert active("quebec-province", 1927)[0]["start_year"] == 1927
assert active("newfoundland-labrador-mainland", 1934)[0]["display_kind"] == "administrative"
assert not active("newfoundland-labrador-mainland", 1949)
assert active("yukon-land-claims-legacy", 1982)[0]["display_kind"] == "land_dispossession"
assert active("nunavut-1999-territory", 1999) and not active("nunavut-1999-territory", 1998)
print("PASS: Canadian provincial boundaries, 1982 land rights and Nunavut 1999.")

# Batch eight: year-end Hong Kong transition and Australian law-context layers.
for stable in ("hong-kong-main-island", "kowloon-south-peninsula", "stonecutters-island", "lantau-new-territories", "lamma-new-territories", "hong-kong-new-territories-mainland"):
    assert active(stable, 1981)[0]["end_year"] == 1981
    assert active(stable, 1982)[0]["related_event_ids"] == ["E20-B8-HK-NEG1982"]
    assert active(stable, 1983)[0]["end_year"] == 1983
    assert active(stable, 1984)[0]["related_event_ids"] == ["E20-EXIT-HKDECL"]
    assert active(stable, 1996) and not active(stable, 1997)
    assert active(stable, 1982)[0]["display_kind"] == "administrative"
assert not active("au-qld-land-rights-legacy", 1981)
assert active("au-qld-land-rights-legacy", 1982)[0]["related_event_ids"] == ["E20-B8-QLD-LAND1982"]
assert active("au-qld-land-rights-legacy", 1984)[0]["start_year"] == 1984
assert active("au-qld-land-rights-legacy", 1991)[0]["start_year"] == 1991
assert not active("au-wa-heritage-law-legacy", 1971) and active("au-wa-heritage-law-legacy", 1972)
for stable in ("au-qld-land-rights-legacy", "au-wa-heritage-law-legacy"):
    p = active(stable, 1982)[0]
    assert p["territorial_claim"] is False and p["dash_only"] and not p["fill_authorized"]
    assert p["display_kind"] == "land_dispossession" and p["spatial_semantics"]
print("PASS: batch eight Hong Kong transition and 1982 Australian law context.")
