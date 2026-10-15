#!/usr/bin/env python3
"""Independent point/line/area audit for the published 1497–1599 atlas.

Read-only: does not fabricate polygons, change sources or declare a schematic
surface to be occupied territory. Run: python3 scripts/audit_spatial_semantics.py
For a machine report: --out /tmp/atlas-spatial-audit.json
--strict returns nonzero only for structural errors, not unsettled historical questions.
"""
import argparse
import collections
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
APP = (ROOT / "app.js").read_text(encoding="utf-8")
VERSION = "phase2-spatial-audit-v1"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def coordinate_pairs(coords):
    if not isinstance(coords, list):
        raise ValueError("coordinates must be an array")
    if len(coords) >= 2 and all(isinstance(v, (int, float)) for v in coords[:2]):
        yield coords
    else:
        for item in coords:
            yield from coordinate_pairs(item)


def polygon_rings(geometry):
    kind = geometry["type"]
    if kind == "Polygon":
        return geometry["coordinates"]
    if kind == "MultiPolygon":
        return [r for poly in geometry["coordinates"] for r in poly]
    return []


def contains(point, polygon):
    """Only used for audit hints, never for claiming a historic perimeter."""
    x, y = point
    ring = polygon[0]
    result = False
    for i in range(len(ring)):
        ax, ay = ring[i - 1][:2]
        bx, by = ring[i][:2]
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            result = not result
    if not result:
        return False
    for hole in polygon[1:]:
        if contains(point, [hole]):
            return False
    return True


def inspect():
    defects = []
    stats = collections.Counter()
    per_chapter = []
    def report(level, code, location, explanation):
        defects.append({"level": level, "code": code, "where": location,
                        "explanation": explanation})
    chapters = load(DATA / "chapters.json")["chapters"]
    valid_sources, valid_events = set(), set()
    for chapter in chapters:
        if chapter.get("status") != "published":
            continue
        path = ROOT / chapter["source"]
        atlas = load(path)
        events, routes = atlas.get("events", []), atlas.get("routes", [])
        ids = {s["id"] for s in atlas.get("sources", [])}
        valid_sources |= ids
        local_ids = set()
        for e in events:
            key = path.name + ":" + str(e.get("id"))
            if e.get("id") in valid_events or e.get("id") in local_ids:
                report("ERROR", "duplicate_event_id", key,
                       "Event ID reused across published chapters")
            local_ids.add(e.get("id"))
            valid_events.add(e.get("id"))
            la, lo = e.get("lat"), e.get("lng")
            if (la is None) != (lo is None) or (la is not None and
                (not isinstance(la, (int, float)) or not isinstance(lo, (int, float))
                 or not math.isfinite(la) or not math.isfinite(lo)
                 or abs(la) > 90 or abs(lo) > 180)):
                report("ERROR", "invalid_event_coordinates", key,
                       "Latitude/longitude missing on only one axis or outside WGS84 range")
            if isinstance(e.get("start_year"), int) and isinstance(e.get("end_year"), int) and e["start_year"] > e["end_year"]:
                report("ERROR", "reversed_event_years", key, "Start year after end year")
            for src in e.get("source_ids", []):
                if src not in ids:
                    report("ERROR", "orphan_event_source", key,
                           "Published event source ID not in its published chapter: " + src)
        for r in routes:
            key = path.name + ":" + str(r.get("id"))
            for src in r.get("source_ids", []):
                if src not in ids:
                    report("ERROR", "orphan_route_source", key, "Route source not in chapter: " + src)
            coords = r.get("coords", [])
            if not isinstance(coords, list) or len(coords) < 2:
                report("ERROR", "short_route", key, "Route has fewer than two positions")
                continue
            for pt in coords:
                if (not isinstance(pt, list) or len(pt) != 2 or
                    any(not isinstance(v, (int, float)) or not math.isfinite(v) for v in pt) or
                    abs(pt[0]) > 90 or abs(pt[1]) > 180):
                    report("ERROR", "invalid_route_coordinate", key, "Leaflet route coordinates must be [lat, lon]")
                    break
            if not r.get("segments"):
                for a, b in zip(coords, coords[1:]):
                    if isinstance(a, list) and isinstance(b, list) and len(a) == len(b) == 2:
                        if isinstance(a[1], (int, float)) and isinstance(b[1], (int, float)) and abs(a[1] - b[1]) > 180:
                            report("REVIEW", "route_dateline_wrap", key,
                                   "Longitude jump >180 degrees without explicit dateline segments")
                            break
            else:
                segments = r["segments"]
                if not all(isinstance(seg, list) and len(seg) >= 2 for seg in segments):
                    report("ERROR", "invalid_route_segments", key, "Empty dateline segment")
                elif len(segments) == 2:
                    left, right = segments[0][-1], segments[1][0]
                    if abs(abs(left[1]) - 180) > .01 or abs(abs(right[1]) - 180) > .01 or abs(left[0] - right[0]) > .01:
                        report("REVIEW", "dateline_segment_seam", key,
                               "Two Pacific dateline segments do not meet on opposite ±180° meridians")
        stats["events"] += len(events)
        stats["routes"] += len(routes)
        stats["published_chapters"] += 1
        stats["event_map_points"] += sum(e.get("lat") is not None for e in events)
        per_chapter.append({"period": f"{chapter['start']}-{chapter['end']}",
                            "events": len(events), "routes": len(routes),
                            "located_events": sum(e.get("lat") is not None for e in events)})
    # Distinguish public event sources from reviewed independent spatial-archive
    # citations. Their IDs legitimately differ; official bibliography links
    # must be checked as well before reporting a public map dossier gap.
    registry_path = DATA / "spatial-citation-registry.json"
    if registry_path.exists():
        for citation in load(registry_path).get("sources", []):
            if isinstance(citation.get("id"), str) and re.match(r"^https://", citation.get("url", "")):
                valid_sources.add(citation["id"])
    active_geo = set(re.findall(r"fetch\(['\"]data/([^'\"]+\.geojson)['\"]", APP))
    per_geo = []
    for path in sorted(DATA.glob("*.geojson")):
        geo = load(path)
        if geo.get("type") != "FeatureCollection":
            report("ERROR", "not_a_feature_collection", path.name, "Expected GeoJSON FeatureCollection")
            continue
        features = geo.get("features", [])
        file_ids = set()
        counts = collections.Counter()
        active = path.name in active_geo
        stats["all_geojson_files"] += 1
        stats["active_geojson_files"] += int(active)
        for index, f in enumerate(features):
            identity = str(f.get("id") or f.get("properties", {}).get("id") or index)
            key = path.name + ":" + identity
            if identity in file_ids:
                report("ERROR", "duplicate_geojson_id", key, "Repeated ID inside the same GIS file")
            file_ids.add(identity)
            p = f.get("properties", {})
            g = f.get("geometry")
            if g is None:
                if not p.get("geometry_ref"):
                    report("ERROR", "null_geometry_without_reference", key,
                           "Geometry is null without a canonical geometry_ref")
                else:
                    counts["inherited_reference"] += 1
                continue
            kind = g.get("type")
            counts[kind] += 1
            try:
                positions = list(coordinate_pairs(g["coordinates"]))
            except (KeyError, TypeError, ValueError, RecursionError):
                report("ERROR", "invalid_geometry", key, "Invalid or missing coordinate hierarchy")
                continue
            if not positions or any(len(x) < 2 or not all(isinstance(v, (int, float)) and math.isfinite(v) for v in x[:2])
                                    or abs(x[0]) > 180 or abs(x[1]) > 90 for x in positions):
                report("ERROR", "wgs84_coordinate_range", key, "Invalid GeoJSON [lon, lat] coordinates")
            if kind in ("Polygon", "MultiPolygon"):
                for ring in polygon_rings(g):
                    if len(ring) < 4 or ring[0] != ring[-1]:
                        report("ERROR", "unclosed_polygon", key,
                               "Polygon ring must have 4+ points and close exactly")
                        break
                stats["all_stored_polygon_features"] += 1
                if active:
                    stats["active_polygon_features"] += 1
                if p.get("historical_boundary_confirmed") is False:
                    stats["schematic_or_reference_polygons"] += 1
                    if p.get("fill_authorized") is True or p.get("territorial_claim") is True:
                        report("ERROR", "misleading_verified_control", key,
                               "Unverified historical polygon marked for territorial fill/claim")
                    if p.get("area_sqkm", None) is not None or p.get("actual_area_sqkm", None) is not None:
                        report("ERROR", "schematic_area_number", key,
                               "Unverified polygon may not carry factual area numbers")
                if p.get("zone_type") == "english_invasion_impact_schematic":
                    if not (p.get("method") or p.get("mapping_method") or p.get("geometry_provenance")):
                        report("REVIEW", "no_impact_shape_method", key,
                               "Impact region lacks documentation of how its outline was drawn")
                    if len(p.get("named_anchors", [])) < 2 and not p.get("historic_region_label"):
                        report("REVIEW", "weak_impact_anchors", key,
                               "Local invasion-impact surface lacks two named anchors or an explicit historical region")
                    for anchor in p.get("named_anchors", []):
                        lon = anchor.get("lon", anchor.get("lng"))
                        lat = anchor.get("lat")
                        if kind == "Polygon" and isinstance(lat, (int, float)) and isinstance(lon, (int, float)):
                            if not contains((lon, lat), g["coordinates"]):
                                report("REVIEW", "anchor_outside_impact_region", key,
                                       "Named historical anchor lies outside the illustrative polygon: " + str(anchor.get("name")))
            elif kind not in ("Point", "MultiPoint", "LineString", "MultiLineString"):
                report("REVIEW", "unexpected_geotype", key, "Unrecognized geographic geometry type: " + str(kind))
            if (isinstance(p.get("start_year"), int) and isinstance(p.get("end_year"), int)
                    and p["start_year"] > p["end_year"]):
                report("ERROR", "reversed_gis_years", key, "GIS start year after end year")
            # Research hypotheses use openHypothesis(source_path), not the
            # published Atlas listSources() lookup; do not misreport these
            # independent archive IDs as broken public links.
            if (active and not path.name.startswith("geography-") and
                    kind in ("Polygon", "MultiPolygon", "LineString") and p.get("source_ids")):
                linked = any(src in valid_sources for src in p.get("source_ids", []))
                external = any(isinstance(url, str) and url.startswith("https://")
                               for url in p.get("source_urls", []))
                if not linked and not external:
                    report("REVIEW", "unclickable_public_area_citations", key,
                           "Feature has source IDs but no published source mapping or source_urls; "
                           "the openTerritoryDossier link builder may display no clickable history citations")
            if active:
                for src in p.get("source_ids", []):
                    if src not in valid_sources:
                        report("REVIEW", "geo_source_outside_published_index", key,
                               "Source ID not in current chapter registry; may be an independent archive ID: " + src)
                for ev_id in p.get("related_event_ids", []):
                    if ev_id not in valid_events:
                        report("REVIEW", "gis_event_link_unmatched", key,
                               "Related event ID not found in published events: " + ev_id)
            if (active and kind in ("Polygon", "MultiPolygon") and
                    not p.get("source_ids") and not p.get("source_urls")
                    and not p.get("historic_source_urls") and
                    not p.get("designation_source_url") and not p.get("data_source_url")):
                report("REVIEW", "gis_without_source_link", key,
                       "Map area lacks source links in the feature; could be elsewhere in research")
        stats["all_geojson_features"] += len(features)
        if active:
            stats["active_geojson_features"] += len(features)
        per_geo.append({"file": path.name, "loaded_directly_by_app": active,
                        "features": len(features), "geometry_counts": dict(counts)})
    outcome = dict(collections.Counter(x["level"] for x in defects))
    by_code = dict(collections.Counter(x["code"] for x in defects))
    return {"schema": VERSION, "published_span": [1497, 1599],
            "counts": dict(stats), "findings_by_level": outcome,
            "findings_by_code": by_code,
            "chapters": per_chapter, "geojson": per_geo,
            "findings": defects, "interpretation": {
                "ERROR": "Objective data or geometry contract violation",
                "REVIEW": "Needs a source, mapping-method, or UI check; not automatically historical error",
                "limits": "Modern coast and schematic polygons do not prove actual 16th-century rule; automated checks cannot verify manuscripts, damage footprints or browser rendering."
            }}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--strict", action="store_true", help="Nonzero exit only on ERROR")
    args = parser.parse_args()
    audit = inspect()
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Spatial red-team audit: " + json.dumps({
        "counts": audit["counts"], "findings_by_level": audit["findings_by_level"],
        "findings_by_code": audit["findings_by_code"],
        "priority_samples": [x for x in audit["findings"] if x["code"] != "geo_source_outside_published_index"][:20]
    }, ensure_ascii=False, indent=2))
    if args.strict and audit["findings_by_level"].get("ERROR", 0):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
