#!/usr/bin/env python3
"""Generic source-aware territory transition check. Standard library only.
Usage:
  python3 scripts/validate_control_transition.py --previous data/atlas-1510-1519.json --transition research/continuity/transitions/TRANSITION_1519_1520.json
  python3 scripts/validate_control_transition.py --self-test
This checks structural and chronological consistency, NOT historic truth, archival facts or browser rendering.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

TRANSITIONS = {"continued", "expanded", "contracted", "transferred", "ended",
               "split_or_merged", "uncertain_continuity", "not_a_control_area"}
STATUS = {"confirmed_active", "confirmed_ended", "disputed", "unverified"}
NEW_TYPES = {"existing_site_newly_mapped", "documented_new_control", "not_a_control_area"}
DATE = re.compile(r"^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$")


def audit(previous: dict, data: dict) -> list[str]:
    errors: list[str] = []
    def fail(where: str, condition: bool, why: str):
        if not condition:
            errors.append(f"{where}: {why}")

    fail("schema", data.get("schema") == "territory-transition-v2", "unsupported version")
    fail("template", data.get("template_only") is False, "copy and fill template; not a real research record")
    period = data.get("period") or {}
    a, b, c, d = (period.get(k) for k in ("previous_from", "previous_to", "next_from", "next_to"))
    valid_period = all(type(n) is int for n in (a, b, c, d)) and a <= b and c <= d and c == b + 1
    fail("period", valid_period, "two consecutive numeric year windows are required")
    if not valid_period:
        return errors

    declared = data.get("previous_snapshot") or {}
    fail("previous_snapshot", declared.get("year") == b, "previous snapshot year must be prior period end")
    active = declared.get("active_stable_ids") or []
    exits = declared.get("historical_exits_kept_in_archive") or []
    fail("previous_snapshot", len(active) == len(set(active)) and len(exits) == len(set(exits)),
         "duplicate prior stable identities")
    fail("previous_snapshot", set(active).isdisjoint(exits),
         "a prior entity cannot be both active and historical exit")

    if isinstance(previous.get("places"), list):
        known_previous = {p.get("id") for p in previous["places"]}
    elif isinstance(previous.get("year_end_snapshots"), list):
        matched = [x for x in previous["year_end_snapshots"] if x.get("year") == b]
        known_previous = set(matched[0].get("active_stable_ids", [])) if matched else set()
        # A previous ledger may preserve entities that ended earlier in its stable_states.
        known_previous |= {x.get("stable_id") for x in previous.get("stable_states", [])}
    else:
        known_previous = set()
        errors.append("previous source: expected .places or .year_end_snapshots")
    fail("previous_snapshot", bool(declared.get("source_file")),
         "required traceable previous source reference")
    fail("previous_snapshot", set(active) | set(exits) == known_previous,
         f"previous identity loss/new fake identities; missing={sorted(str(x) for x in known_previous-set(active)-set(exits))}, surplus={sorted(str(x) for x in (set(active)|set(exits))-known_previous)}")

    records = data.get("records") or []
    ids = [r.get("stable_id") for r in records]
    fail("records", len(ids) == len(set(ids)), "duplicate stable_id")
    fail("records", set(ids) == set(active),
         f"each active predecessor MUST have exactly one fate (missing={sorted(str(x) for x in set(active)-set(ids))})")
    new_items = data.get("new_entities") or []
    new_ids = [x.get("stable_id") for x in new_items]
    fail("new_entities", len(new_ids) == len(set(new_ids)), "duplicate new stable_id")
    fail("new_entities", set(new_ids).isdisjoint(set(active)|set(exits)),
         "new label duplicates a historical stable ID: use same stable_id/parent link")
    for r in records:
        rid = str(r.get("stable_id"))
        t = r.get("transition")
        fail(rid, t in TRANSITIONS, "invalid/blank transition")
        fail(rid, r.get("next_status") in STATUS, "unknown next status")
        fail(rid, bool(r.get("previous_control_class")) and bool(r.get("new_control_class")),
             "control classes must be distinguished")
        fail(rid, bool(r.get("previous_controller")), "previous controller required")
        fail(rid, bool(r.get("source_ids")) and bool(r.get("source_file_paths")),
             "source IDs and source file path required even when continuity uncertain")
        for k in ("historic_start_date", "historic_end_date", "last_documented_date", "change_effective_date"):
            value = r.get(k)
            if value is not None:
                fail(rid + "." + k, isinstance(value, str) and bool(DATE.fullmatch(value)),
                     "use YYYY, YYYY-MM, YYYY-MM-DD or null, never a guessed full date")
        if t == "ended":
            fail(rid, r.get("historic_end_date") is not None,
                 "confirmed end must carry an explicitly sourced historical termination date")
            fail(rid, r.get("next_status") == "confirmed_ended", "ended requires confirmed_ended")
        if t == "uncertain_continuity":
            fail(rid, r.get("next_status") in {"unverified", "disputed"},
                 "uncertain is not confirmed active/terminated")
        if t in {"transferred", "expanded", "contracted", "ended"}:
            fail(rid, bool(r.get("change_effective_date")), "document a date/at least year for territory change")
        g = r.get("geography") or {}
        fail(rid, g.get("historical_boundary_confirmed", False) is not True or g.get("actual_historical_control_polygon_verified", False) is True,
             "boundary-confirmed cannot contradict polygon evidence")
        if g.get("fill_authorized") or g.get("draw_mode") == "verified_solid":
            fail(rid, g.get("actual_historical_control_polygon_verified") is True
                 and g.get("period_reverified") is True and bool(g.get("current_geometry_source"))
                 and bool(g.get("source_period_or_map_year", g.get("geometry_source_period"))),
                 "solid historical area requires date-specific audited geometry and geometry source")
        if not g.get("actual_historical_control_polygon_verified", False):
            fail(rid, g.get("fill_authorized") is False and g.get("measured_area_sqkm") is None,
                 "inferred boundaries cannot be solid or receive computed colonial area")
        if g.get("draw_mode") == "dashed_reference":
            fail(rid, g.get("fill_authorized") is False,
                 "dashed unknown geographic reference must not be an actual filled control area")
    for x in new_items:
        rid = str(x.get("stable_id"))
        typ = x.get("classification")
        fail("new " + rid, typ in NEW_TYPES, "new entity must distinguish new maps from new control")
        fail("new " + rid, bool(x.get("source_ids")) and bool(x.get("source_file_paths")),
             "source provenance required")
        entered = x.get("first_explicitly_mapped_year")
        fail("new " + rid, type(entered) is int and c <= entered <= d, "first mapped year must be in next period")
        if typ == "existing_site_newly_mapped":
            fail("new " + rid, bool(x.get("parent_stable_id")), "old territory subsite must link parent ID")
            fail("new " + rid, x.get("actual_acquisition_date") is None,
                 "new marker is NOT a newly conquered territory")
        if typ == "documented_new_control":
            fail("new " + rid, bool(x.get("actual_acquisition_date")),
                 "newly controlled site needs a dated source-supported event")
        g = x.get("geometry") or {}
        if g.get("fill_authorized") or g.get("draw_mode") == "verified_solid":
            fail("new " + rid, g.get("actual_historical_control_polygon_verified") is True,
                 "no solid control polygon from city centroid or a presumed regional hull")
        if not g.get("actual_historical_control_polygon_verified", False):
            fail("new " + rid, g.get("measured_area_sqkm") is None,
                 "no historical area figures from map symbols or modern place envelope")

    annual = data.get("annual_snapshots") or []
    fail("annual_snapshots", [x.get("year") for x in annual] == list(range(c, d + 1)),
         "one year-end snapshot required for EACH year in new period")
    categories = ("confirmed_active_stable_ids", "unverified_continuity_stable_ids", "confirmed_ended_stable_ids")
    for snap in annual:
        year = snap.get("year")
        lists = [set(snap.get(k) or []) for k in categories]
        covered = set().union(*lists)
        expected = set(active) | {x.get("stable_id") for x in new_items
                                  if type(x.get("first_explicitly_mapped_year")) is int
                                  and x["first_explicitly_mapped_year"] <= year}
        fail("year " + str(year), covered == expected,
             "lost or fabricated historical entity in annual snapshot")
        fail("year " + str(year), sum(map(len, lists)) == len(covered),
             "an entity cannot be simultaneously confirmed/unverified/ended")
        fail("year " + str(year), set(snap.get("independent_political_entities") or []) <= covered,
             "independent entity must also be listed as a tracked political status")
    editor = data.get("editorial") or {}
    fail("editorial", bool(editor.get("source_registry_file")) and bool(editor.get("handoff_file")),
         "require source registry and editor handoff path")
    carto = data.get("cartography") or {}
    fail("cartography", type(carto.get("verified_new_or_changed_control_polygons")) is int,
         "declare verified polygon count; zero is valid")
    return errors


def self_test() -> None:
    # SYNTHETIC, fictional identifiers; not historical project evidence.
    old = {"places": [{"id": "fake-alfa"}, {"id": "fake-exit"}]}
    record = {"stable_id": "fake-alfa", "previous_controller": "fictional",
              "new_controller": "fictional", "previous_control_class": "town",
              "new_control_class": "town", "transition": "continued",
              "next_status": "confirmed_active", "historic_start_date": None,
              "historic_end_date": None, "last_documented_date": "1900",
              "change_effective_date": None, "source_ids": ["fake-source"],
              "source_file_paths": ["synthetic/example"],
              "geography": {"fill_authorized": False, "measured_area_sqkm": None,
                            "actual_historical_control_polygon_verified": False,
                            "draw_mode": "city_core_symbol"}}
    fixture = {"schema": "territory-transition-v2", "template_only": False,
               "period": {"previous_from": 1890, "previous_to": 1899,
                          "next_from": 1900, "next_to": 1909},
               "previous_snapshot": {"year": 1899, "source_file": "synthetic/old",
                                      "active_stable_ids": ["fake-alfa"],
                                      "historical_exits_kept_in_archive": ["fake-exit"]},
               "records": [record], "new_entities": [],
               "annual_snapshots": [{"year": y, "confirmed_active_stable_ids": ["fake-alfa"],
                                     "unverified_continuity_stable_ids": [],
                                     "confirmed_ended_stable_ids": [],
                                     "independent_political_entities": []}
                                    for y in range(1900, 1910)],
               "editorial": {"source_registry_file": "synthetic/sources",
                             "handoff_file": "synthetic/handoff"},
               "cartography": {"verified_new_or_changed_control_polygons": 0}}
    assert not audit(old, fixture), audit(old, fixture)
    from copy import deepcopy
    bad = deepcopy(fixture)
    bad["records"] = []
    assert any("records" in e for e in audit(old, bad))
    bad = deepcopy(fixture)
    bad["records"][0]["geography"]["fill_authorized"] = True
    assert any("solid" in e for e in audit(old, bad))
    bad = deepcopy(fixture)
    bad["annual_snapshots"][0]["confirmed_active_stable_ids"] = []
    assert any("year 1900" in e for e in audit(old, bad))
    print("PASS: generic continuity validation self-test; synthetic examples only.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--previous", type=Path)
    parser.add_argument("--transition", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    if not args.previous or not args.transition:
        parser.error("--previous and --transition are required unless --self-test")
    old = json.loads(args.previous.read_text(encoding="utf-8"))
    current = json.loads(args.transition.read_text(encoding="utf-8"))
    failures = audit(old, current)
    if failures:
        for error in failures:
            print("FAIL:", error, file=sys.stderr)
        return 1
    print("PASS:", args.transition, "— 100% old control identities tracked, annual snapshots and geometric gates valid.")
    print("Warning: machine-checked continuity does not certify historical truth or browser deployment.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
