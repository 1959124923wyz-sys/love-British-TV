#!/usr/bin/env python3
"""Issue #46 historic English occupation area publication gate.

Fail closed: no historical occupation Polygon may be authorized on the basis
of modern HES Scheduled Monument outlines, NRHE Known Site Extents, guessed
buffers, corridor hulls, 1547-plan dimensions alone, or undated reconstruction.

Only scientifically attributed original fortification geometry should pass.
This script audits an optional historical polygon candidate (no candidate
exists yet). Does not produce any geographic shapes.
"""
from __future__ import annotations
import argparse
import json
import pathlib
import sys
from typing import Any

HERE=pathlib.Path(__file__).resolve().parent
LEGAL=HERE/"HES_OFFICIAL_MODERN_SCHEDULED_REFERENCE.geojson"
CANDIDATE=HERE/"HISTORIC_OCCUPATION_FOOTPRINTS_1547_1550.geojson"
FORBIDDEN_CONSTRUCTION=(
  "buffer", "convex", "hull", "arbitrary", "schematic",
  "scheduled", "statutory", "modern_legal",
  "administrative_county", "cartographic_illustration"
)
NEEDED=("stable_id","named_historic_fort","period_controller","historic_first_year",
  "historic_last_confirmed_year","source_record_id","source_original_date",
  "source_archive_url","survey_phase_id","geometry_digitization_method",
  "georeferencing_control_points","georeferencing_rmse_m","source_reuse_license",
  "reviewer","review_date","area_sqkm_prohibited_for_schematic")

def fail(msg): raise ValueError(msg)
def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def walk_coords(geom):
    t=geom["type"]
    polygons=[geom["coordinates"]] if t=="Polygon" else geom["coordinates"]
    for poly in polygons:
        for ring in poly:
            if len(ring)<4 or ring[0]!=ring[-1]: fail("Polygon ring unclosed or too short")
            for xy in ring:
                if len(xy)<2:fail("Malformed point")
                lon,lat=xy[:2]
                if not isinstance(lon,(int,float)) or not isinstance(lat,(int,float)) or not(-8<lon<-0.4 and 54<lat<59):
                    fail("Outside Scottish map bounds, or missing coordinates")
                yield xy
def validate(f,modern_geometries):
    props=f.get("properties") or {}
    if f.get("geometry",{}).get("type") not in ("Polygon","MultiPolygon"): fail("Historical territory must have polygon geometry")
    points=list(walk_coords(f["geometry"]))
    if len(points)<4: fail("Too few vertices")
    # Check against raw modern legal rings, not just object equality.
    norm=lambda x:json.dumps(x,sort_keys=True,separators=(",",":"))
    if norm(f["geometry"]) in modern_geometries:fail("Historical geometry is literally a modern legal protected extent")
    for field in NEEDED:
        if field not in props or props[field] in (None,"",[],{}):fail("Missing required historic polygon audit field: "+field)
    if props.get("historical_boundary_confirmed") is not True: fail("Not verified original-era boundary")
    if props.get("fill_authorized") is not True: fail("No historian-approved occupation fill")
    if props.get("controller_type")!="temporary_English_garrison": fail("Legal Scottish sovereignty and specific English temporary control must be distinct")
    if props.get("sovereign_state")!="Kingdom of Scotland":fail("Misrepresents sovereignty")
    if props.get("original_map_image_or_survey_verified") is not True:fail("Original map or survey not verified")
    if props.get("archaeological_phase_validated") is not True:fail("Phase and medieval / later fort differentiation missing")
    if props.get("redistribution_rights_verified") is not True:fail("Must verify usage rights")
    if props.get("historical_first_year")<1547 or props.get("historical_last_confirmed_year")>1550:fail("Historical fortified Tudor years outside Issue46 phase")
    if props["historical_last_confirmed_year"]<props["historical_first_year"]:fail("Chronology invalid")
    if not isinstance(props.get("georeferencing_rmse_m"),(int,float)) or props["georeferencing_rmse_m"]<0:fail("Invalid real measured georeferencing error")
    gcps=props["georeferencing_control_points"]
    if not isinstance(gcps,list) or len(gcps)<3 or any(not isinstance(q,dict) or not set(["historical_plan_xy","modern_easting_northing","anchor_reason"]).issubset(q) for q in gcps):
        fail("Require at least 3 actual historic-to-survey anchors")
    method=(props["geometry_digitization_method"]+" "+str(props.get("geometry_origin",""))).lower()
    if any(x in method for x in FORBIDDEN_CONSTRUCTION): fail("Inferred/proxy polygons cannot be historic occupied land")
    if props.get("historic_english_fort_polygon_part_of_sm1718") and not props.get("fort_subset_of_medieval_ruins_confirmed"):
        fail("Roxburgh requires historical fort subset of medieval castle")
    return props["stable_id"]

def audit(root=HERE,candidate=CANDIDATE):
    legal=root/"HES_OFFICIAL_MODERN_SCHEDULED_REFERENCE.geojson"
    legal_data=load(legal)
    if len(legal_data.get("features",[]))!=3:
        fail("Required HES modern provenance and feature count missing")
    modern={json.dumps(f["geometry"],sort_keys=True,separators=(",",":")) for f in legal_data["features"]}
    for f in legal_data["features"]:
        p=f.get("properties",{})
        if p.get("fill_authorized") is not False or p.get("historical_boundary_confirmed") is not False or p.get("area_sqkm") is not None:
            fail("Modern archaeology polygons improperly attributed as historic control")
    if not candidate.exists():
        print("PASS: 3 audited modern archaeology extents, 0 filed historic occupation polygons, Issue #46 remains OPEN")
        return False
    geo=load(candidate)
    if geo.get("type")!="FeatureCollection":fail("Invalid historical polygon collection")
    ids=set()
    for f in geo.get("features",[]):
        i=validate(f,modern)
        if i in ids:fail("Duplicate historic fort stable_id "+i)
        ids.add(i)
    if not ids:
        print("PASS: candidate file exists but no real historical occupation Polygon: Issue #46 remains OPEN")
        return False
    print("HISTORIC_POLYGON_RESEARCH_GATE_PASS",len(ids),"archive-qualified candidate(s) ONLY; separate main integration and browser approval required")
    return True

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--candidate",type=pathlib.Path,default=CANDIDATE)
    ap.add_argument("--test-blocking",action="store_true")
    args=ap.parse_args()
    if args.test_blocking:
        geo=load(LEGAL)
        failed=0
        for f in geo["features"]:
            try:validate(f,{json.dumps(f["geometry"],sort_keys=True,separators=(",",":"))})
            except ValueError: failed+=1
        assert failed==3
        print("PASS: 3/3 modern statutory outlines rejected as ancient occupied territories")
        return
    audit(candidate=args.candidate)

if __name__=="__main__":
    try:main()
    except (ValueError,KeyError,TypeError,json.JSONDecodeError) as ex:
        print("FAIL CLOSED:",str(ex),file=sys.stderr)
        raise SystemExit(1)
