#!/usr/bin/env python3
"""5AG: replace two non-historical geographic envelopes using existing dated GIS.

No new boundary construction, no area calculation, and no loss of original
historical records, legal claims, source URLs, or chronological narratives.
Idempotent on already-upgraded branches.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / "data/eighteenth-century-mass-schematic-zones-1700-1799.json"
raw = FILE.read_text(encoding="utf-8")
data = json.loads(raw)
zones = {z["id"]: z for z in data["zones"]}
shape_records = {z["id"]: z for z in data["regional_zones"]}
site_records = {s["id"]: s for s in data["regional_sites"]}
assert len(data["zones"]) == 81 and len(data["sites"]) == 42

# The first ID is a convenient cross-reference. Other independent footprints
# are verified in the test and crosswalk. No single shape is the entire zone.
REPLACEMENTS = {
    "GREAT_LAKES_POSTS": {
        "primary": "FORT_NIAGARA_MAIN",
        "polygons": [
            "FORT_NIAGARA_MAIN",
            "DETROIT_FORT_LERNOULT",
            "MACKINAC_ISLAND_FORT",
        ],
        "start": 1783, "end": 1795,
    },
    "NSW_CROWN_CLAIM": {
        "primary": "WARRANE_SYDNEY_COVE",
        "polygons": [
            "SYDNEY_MARINE_CAMP_1788",
            "SYDNEY_CONVICT_CAMPS_1788",
            "SYDNEY_GOVERNOR_GARDEN_1788",
            "PARRAMATTA_CONVICT_HUT_ROWS",
            "PARRAMATTA_GOVERNMENT_FARM_1792",
        ],
        "start": 1788, "end": 1799,
    },
}
for rid, item in REPLACEMENTS.items():
    record = zones[rid]
    assert record["bbox"] and not record.get("geometry")
    assert record["source_urls"] and record["periods"]
    assert record["area_sqkm"] is None and not record["territorial_control_verified"]
    assert record["periods"] == [
        {"start_year": item["start"], "end_year": item["end"]}
    ]
    assert record.get("superseded_by") in (None, item["primary"])
    for shape_id in item["polygons"]:
        source = shape_records[shape_id]
        assert source["geometry"]["type"] in ("Polygon", "MultiPolygon")
        assert source["area_sqkm"] is None and source["source_urls"]
    if rid == "NSW_CROWN_CLAIM":
        assert site_records[item["primary"]]["geometry"]["type"] == "Point"
        assert site_records[item["primary"]]["source_urls"]
    else:
        assert shape_records[item["primary"]]["geometry"]["type"] == "Polygon"
    if not record.get("superseded_by"):
        pattern = re.compile(r'(?m)^([ \t]*)"id": "' + re.escape(rid) + r'",\r?\n')
        assert len(pattern.findall(raw)) == 1, rid
        raw, n = pattern.subn(
            lambda m: m.group(0) + m.group(1) +
            '"superseded_by": "' + item["primary"] + '",\n', raw, count=1
        )
        assert n == 1
new = json.loads(raw)
assert len(new["zones"]) == 81 and len(new["sites"]) == 42
for z in data["zones"]:
    now = next(q for q in new["zones"] if q["id"] == z["id"])
    if z["id"] in REPLACEMENTS:
        extra = now.pop("superseded_by")
        assert extra == REPLACEMENTS[z["id"]]["primary"]
    assert z == now, z["id"]
assert new["regional_zones"] == data["regional_zones"]
assert new["regional_sites"] == data["regional_sites"]
unresolved = [z for z in new["zones"] if z.get("bbox") and
              not z.get("geometry") and not z.get("superseded_by")]
assert [z["id"] for z in unresolved] == ["CAROLINA_PROPRIETORS"], unresolved
assert not any(p["start_year"] <= 1799 <= p["end_year"]
               for z in unresolved for p in z["periods"])
FILE.write_text(raw, encoding="utf-8")
print("PASS 5AG: two 18C large reference envelopes retired; remaining one early Carolina charter reference. Original sources and 18C polygons preserved.")
