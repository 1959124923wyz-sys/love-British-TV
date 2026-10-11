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
assert not a.get("colonial_polygons"), "Never paint unverified 1497 colonies"
geo = json.loads((ROOT/"data/modern-uk-regions.topojson").read_text(encoding="utf-8"))
assert geo["type"] == "Topology"
names = {g["properties"]["AREANM"] for g in geo["objects"]["UKregionmerc"]["geometries"]}
assert {"Scotland", "Wales", "London", "Northern Ireland"} <= names
for asset in ("index.html", "app.js", "style.css", "README.md", "CHANGELOG.md", "RESEARCH_HANDOFF.md"):
    assert (ROOT/asset).stat().st_size > 0, asset
print(f"OK: {len(a['events'])} events, {len(a['sources'])} references, {len(names)} modern UK regions")
