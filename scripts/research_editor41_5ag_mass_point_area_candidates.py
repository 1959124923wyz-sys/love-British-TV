#!/usr/bin/env python3
"""Refresh the 5AG 479-site / 165-candidate regional research inventory.

This is a spatial-temporal research shortlist only. A polygon containing or
near a point does NOT establish that the historical activity, site, military
action, trade relationship or land jurisdiction has this polygon's footprint.
Never promote any point or invent historical area from this heuristic.
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/eighteenth-century-mass-schematic-zones-1700-1799.json"
TARGET = ROOT / "docs/research/18C_5AG_479_MASS_POINT_AREA_CANDIDATES.json"
M = json.loads(SOURCE.read_text(encoding="utf-8"))
# Freeze the 5AG 479-point published source inventory. Later 5AH Carolina settlements
# belong to an independent addendum; they must not retroactively rewrite 165 candidates.
ADDED_IN_5AH = {"CAROLINA_CHARLESTOWN_1700_1711", "CAROLINA_BATH_TOWN_1705_1711", "CAROLINA_NEW_BERN_1710_1711"}
all_points = [s for s in M["regional_sites"] if s.get("geometry", {}).get("type") == "Point"]
points = [s for s in all_points if s["id"] not in ADDED_IN_5AH]
assert len(all_points) in (479, 482) and len(points) == 479
assert not (ADDED_IN_5AH & {s["id"] for s in points})
polygons = [s for s in M["regional_zones"] if s.get("geometry", {}).get("type") in ("Polygon", "MultiPolygon")]

def overlap(first, second):
    return any(a["start_year"] <= b["end_year"] and b["start_year"] <= a["end_year"]
               for a in first for b in second)

def find_candidates(p):
    lon, lat = p["geometry"]["coordinates"]
    cos_lat = math.cos(math.radians(lat))
    matches = []
    for z in polygons:
        w, s, e, n = z["bbox"]
        width, height = (e - w) * 111.2 * cos_lat, (n - s) * 111.2
        if width * height > 25 or not overlap(p["periods"], z["periods"]):
            continue
        lon0 = max(w, min(lon, e))
        lat0 = max(s, min(lat, n))
        distance = math.hypot((lon - lon0) * 111.2 * cos_lat, (lat - lat0) * 111.2)
        if distance >= 1:
            continue
        matches.append({
            "polygon_id": z["id"], "polygon_title": z["title"],
            "polygon_kind": z["kind"],
            "bbox_edge_km": round(distance, 3),
            "bbox_area_upper_bound_sqkm": round(width * height, 3),
            "source_urls": z["source_urls"][:2],
            "polygon_years": [
                min(t["start_year"] for t in z["periods"]),
                max(t["end_year"] for t in z["periods"])
            ]
        })
    return sorted(matches, key=lambda x: x["bbox_edge_km"])[:5]

rows = []
for p in points:
    candidates = find_candidates(p)
    if not candidates:
        continue
    rows.append({
        "point_id": p["id"],
        "point_title": p["title"],
        "coordinates": p["geometry"]["coordinates"],
        "point_kind": p["kind"],
        "point_years": [p["periods"][0]["start_year"], p["periods"][-1]["end_year"]],
        "point_source_urls": p["source_urls"][:2],
        "shortlisted_polygon_candidates": candidates,
        "upgrade_status": "unverified_spatial_neighbour_only",
        "must_preserve_original_point": True
    })

risk = [
    ("PITT_FORT_MAIN", "1764 Bouquet Blockhouse must not be substituted for 1763 full Fort Pitt."),
    ("NIAGARA_1764_COUNCIL", "A council gathering's site or legal effect exceeds the visible Fort Niagara walls."),
    ("MANILA_SAN_DIEGO_BREACH", "A specific military breach is not identical to the whole Manila fort or old city."),
    ("MADRAS_ST_MARY_CHURCH", "A church within Fort St George is not the complete fortification perimeter."),
    ("SIERRA_BUNCE_SLAVE_YARD", "An enslaved people's holding yard inside a fortified trading compound needs its own spatial evidence."),
]
assert len(points) == 479 and len(polygons) == 280, "Update baseline and audit if repository size changes"
assert len(rows) == 165 and len({r["point_id"] for r in rows}) == 165, "Candidate baseline changed"
assert len([x for x in rows if x["shortlisted_polygon_candidates"][0]["bbox_edge_km"] == 0]) == 80
assert all(any(x["point_id"] == point_id for x in rows) for point_id, _ in risk)
out = {
    "schema": "editor41_5ag_extended_historic_point_area_candidate_audit_v1",
    "scope": "479 mass regional historic site points only; separate 77 sites remain governed by 5AE candidate inventory",
    "generator_policy": "Point-to-polygon shortlist from 1km edge-to-rectangle proximity and any overlapping year. Geometric bbox proximity alone is NOT evidence that the source polygon is identical to the point's documented historical phenomenon.",
    "reviewed_mass_point_count": len(points),
    "source_polygon_count": len(polygons),
    "shortlisted_mass_point_count": len(rows),
    "no_near_candidate_mass_point_count": len(points) - len(rows),
    "supplementary_5ae_point_count": 77,
    "total_distinct_sites_in_two_audits": 556,
    "auto_promotions": 0,
    "manual_matching_required": True,
    "area_aggregation_forbidden": True,
    "high_risk_examples": [{"point_id": p, "warning": w} for p, w in risk],
    "candidate_sites": rows
}
TARGET.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"PASS 5AG source-derived shortlist: {len(points)} point records, {len(rows)} candidates, 0 auto-promotions")
