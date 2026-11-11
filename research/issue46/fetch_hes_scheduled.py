#!/usr/bin/env python3
"""Issue #46: download *modern scheduled-monument designation* GeoJSON from HES.

These polygons are NOT historical English occupation territory. Designed for
research-only reference and provenance, never for colonial area statistics.
No invented buffers, squares, hulls, or inferred border geometry.
"""
from __future__ import annotations

import argparse
import json
import math
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

SERVICE = "https://inspire.hes.scot/arcgis/rest/services/HES/Scheduled_Monuments/MapServer/0/query"
IDS = {
    "SM3190": {"name": "Eyemouth English 1547 / French 1557", "focus": [-2.09, 55.877], "year_start": 1547, "year_stop": 1549},
    "SM3191": {"name": "Dunglass English 1548–49 camp", "focus": [-2.38, 55.938], "year_start": 1548, "year_stop": 1549},
    "SM1718": {"name": "Roxburgh Castle, only a subset was English 1547 artillery fort", "focus": [-2.457, 55.596], "year_start": 1547, "year_stop": 1549},
}
DEFAULT_OUTPUT = pathlib.Path("research/issue46/HES_OFFICIAL_MODERN_SCHEDULED_REFERENCE.geojson")
ATTRIBUTION = (
    "Contains Historic Environment Scotland and OS data © Historic Environment Scotland "
    "and Crown Copyright and database right 2026, licensed under the Open Government Licence v3.0."
)

def _request_json(params):
    url = SERVICE + "?" + urllib.parse.urlencode(params)
    error = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "LoveBritishTV-Issue46-Research/1.0", "Accept": "application/geo+json,application/json"})
            with urllib.request.urlopen(req, timeout=35) as resp:
                payload = json.load(resp)
            if not isinstance(payload, dict) or "error" in payload:
                raise RuntimeError("HES returned ArcGIS error: " + repr(payload)[:500])
            return payload
        except (urllib.error.URLError, TimeoutError, ValueError, RuntimeError) as exc:
            error = exc
            if attempt < 2:
                time.sleep(attempt + 1)
    raise RuntimeError(f"HES query not successful after retries: {error}")

def download():
    params = {
        "where": "DES_REF IN ('SM3190','SM3191','SM1718')",
        "outFields": "DES_REF,DES_TITLE,PRECISION,ACCURACY,CAP_SCALE,LINK",
        "outSR": "4326",
        "returnGeometry": "true",
        "f": "geojson",
    }
    data = _request_json(params)
    if data.get("type") != "FeatureCollection":
        raise ValueError("Expected GeoJSON FeatureCollection, got: " + repr(data.get("type")))
    return data

def validate_geometry(geometry, sid):
    if not isinstance(geometry, dict) or geometry.get("type") not in ("Polygon", "MultiPolygon"):
        raise ValueError(f"{sid}: expected Polygon/MultiPolygon")
    coords = geometry.get("coordinates")
    if not isinstance(coords, list) or not coords:
        raise ValueError(f"{sid}: missing polygon coordinates")
    polygons = [coords] if geometry["type"] == "Polygon" else coords
    focus = IDS[sid]["focus"]
    count = 0
    for polygon in polygons:
        for ring in polygon:
            if len(ring) < 4 or ring[0] != ring[-1]:
                raise ValueError(f"{sid}: ring must be closed and have >=4 points")
            for xy in ring:
                if not (isinstance(xy, list) and len(xy) >= 2 and
                        isinstance(xy[0], (float, int)) and isinstance(xy[1], (float, int)) and
                        math.isfinite(xy[0]) and math.isfinite(xy[1])):
                    raise ValueError(f"{sid}: invalid coordinate")
                if abs(xy[0] - focus[0]) > 0.07 or abs(xy[1] - focus[1]) > 0.05:
                    raise ValueError(f"{sid}: polygon point unexpectedly far from official site: {xy}")
                count += 1
    if count > 200000:
        raise ValueError(f"{sid}: absurd vertex count")
    return count

def convert(data):
    found = {}
    for feature in data.get("features", []):
        p = feature.get("properties") or {}
        sid = str(p.get("DES_REF") or "").upper()
        if sid not in IDS:
            raise ValueError(f"Unexpected HES designation {sid!r}")
        if sid in found:
            raise ValueError(f"Duplicate HES designation {sid}")
        validate_geometry(feature.get("geometry"), sid)
        audit = IDS[sid]
        found[sid] = {
            "type": "Feature",
            "id": "hes-modern-scheduled-" + sid.lower(),
            "geometry": feature["geometry"],
            "properties": {
                "designation_ref": sid,
                "title_from_hes": p.get("DES_TITLE"),
                "hes_precision": p.get("PRECISION"),
                "hes_accuracy": p.get("ACCURACY"),
                "hes_capture_scale": p.get("CAP_SCALE"),
                "hes_link": p.get("LINK"),
                "geometry_role": "MODERN_LEGAL_SCHEDULED_MONUMENT_EXTENT_NOT_16C_BORDER",
                "historical_english_period_relevant": [audit["year_start"], audit["year_stop"]],
                "fort_phase_boundary_separately_verified": False,
                "historical_boundary_confirmed": False,
                "fill_authorized": False,
                "area_sqkm": None,
                "area_statistics_forbidden": True,
                "controller_for_polygon": None,
                "map_style": "archaeological_reference_dashed_outline_only",
                "name_zh": {"SM3190": "埃茅斯古迹保护区", "SM3191": "邓格拉斯古迹保护区", "SM1718": "罗克斯堡古迹保护区"}[sid],
                "historical_caution": ("The legal area can include later works and prehistoric/medieval phases. "
                                      "It is not verified English-occupied ground for 1547–1550."),
                "designation_source_url": "https://portal.historicenvironment.scot/designation/" + sid,
                "data_source_url": SERVICE,
            },
        }
    if set(found) != set(IDS):
        raise ValueError(f"Missing HES sites: {sorted(set(IDS)-set(found))}")
    return {
        "type": "FeatureCollection",
        "name": "HES modern scheduled area references 1547-1550 (NOT occupation polygons)",
        "metadata": {
            "source": SERVICE,
            "publisher": "Historic Environment Scotland",
            "attribution": ATTRIBUTION,
            "license": "Open Government Licence v3.0 (HES spatial downloads)",
            "spatial_reference": "EPSG:4326",
            "source_geometry_epoch": "modern legal protection; NOT Tudor",
            "verified_historical_control_polygon_count": 0,
            "eligible_as_verified_occupied_area": False,
            "issue46_resolved": False,
            "area_statistics_forbidden": True,
            "outlines_only": True,
        },
        "features": [found[sid] for sid in IDS],
    }

def self_test():
    def square(x, y, width=0.001):
        return {"type": "Polygon", "coordinates": [[[x,y],[x+width,y],[x+width,y+width],[x,y+width],[x,y]]]}
    mocked = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "properties": {"DES_REF": sid, "DES_TITLE": "TEST ONLY"}, "geometry": square(*cfg["focus"])}
        for sid, cfg in IDS.items()
    ]}
    actual = convert(mocked)
    assert len(actual["features"]) == 3
    assert actual["metadata"]["verified_historical_control_polygon_count"] == 0
    assert all(not f["properties"]["fill_authorized"] for f in actual["features"])
    assert all(f["properties"]["area_sqkm"] is None for f in actual["features"])
    bad = json.loads(json.dumps(mocked))
    bad["features"][0]["geometry"]["coordinates"][0][1][0] = -20
    try:
        convert(bad)
    except ValueError:
        pass
    else:
        raise AssertionError("Malformed/far-away geometry was accepted")
    print("PASS: fixture only, no network data, 3 research polygons but 0 historical territory polygons")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=pathlib.Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    out = convert(download())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {len(out['features'])} modern statutory polygons (zero historical occupation polygons): {args.output}")

if __name__ == "__main__":
    main()
