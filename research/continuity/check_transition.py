#!/usr/bin/env python3
"""Validate evidence-aware cross-decade territory carryover; run from any cwd.

This is a research handoff audit, not a proof of historic territorial borders.
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ledger_path = ROOT / "research/continuity/TRANSITION_1519_1520.json"
prior_path = ROOT / "data/atlas-1510-1519.json"
city_path = ROOT / "data/french-urban-control-1500-1519.geojson"

ledger = json.loads(ledger_path.read_text(encoding="utf-8"))
prior = json.loads(prior_path.read_text(encoding="utf-8"))
city = json.loads(city_path.read_text(encoding="utf-8"))

assert ledger["schema"] == "territory-transition-v1"
assert ledger["previous_period"] == "1510-1519" and ledger["next_period"] == "1520-1529"
assert ledger["status"] == "research_audit_not_published"
assert ledger["policy"]["uncertain_geometry_as_solid_polygon_allowed"] is False
assert ledger["policy"]["previous_documented_until_is_termination_date"] is False

previous_ids = [p["id"] for p in prior["places"]]
records = ledger["records"]
transition_ids = [r["stable_id"] for r in records]
assert len(transition_ids) == len(set(transition_ids)), "Duplicated transition ID"
assert len(previous_ids) == len(set(previous_ids)), "Duplicated previous place ID"
assert len(previous_ids) == ledger["policy"]["expected_prior_places"]
assert set(previous_ids) <= set(transition_ids), "A prior political place was dropped across the decade"
valid_changes = {
    "continued", "expanded", "contracted", "transferred", "ended",
    "split_or_merged", "uncertain_continuity", "not_a_control_area"
}
for r in records:
    assert r["transition"] in valid_changes, (r["stable_id"], "invalid transition")
    assert r["source_ids"] and r["source_file"], (r["stable_id"], "missing provenance")
    assert r["geometry_status"] and r["publication_gate"], (r["stable_id"], "not publication-gated")
    assert r["next_period_review"]["status"], (r["stable_id"], "missing review")
    assert r["evidence_interval"], (r["stable_id"], "missing evidence interval")
    assert r["geometry_status"] != "verified_historical_polygon", "No actual historical polygons approved for this transition"

lookup = {r["stable_id"]: r for r in records}
for p in prior["places"]:
    entry = lookup[p["id"]]
    if p["end_year"] is None:
        assert entry["transition"] in {"continued", "uncertain_continuity", "transferred", "contracted", "split_or_merged"}, (
            p["id"], "unexplained termination")
    else:
        assert entry["transition"] in {"ended", "transferred", "split_or_merged"}, (
            p["id"], "former controlled place not ended")
assert len([r for r in records if r["stable_id"] in previous_ids and r["transition"] == "continued"]) == ledger["policy"]["continuing_prior_places_research"]
assert len([r for r in records if r["stable_id"] in previous_ids and r["transition"] == "ended"]) == ledger["policy"]["ended_prior_places"]

tournai = lookup["tournai-occupied-city-1513"]
assert tournai["transition"] == "ended"
assert tournai["evidence_interval"]["known_end_date"] == "1519-02"
tournai_city = next(f for f in city["features"] if f["properties"]["source_place_id"] == "tournai-occupied-city-1513")
assert tournai_city["properties"]["end_year"] == 1519
assert tournai_city["properties"]["end_month"] == 2
assert tournai_city["properties"]["historical_boundary_confirmed"] is False

calais = lookup["calais-crown"]
assert calais["transition"] == "continued"
assert "new conquest" not in calais["control_class"].lower()
guines = lookup["guines-crown-1520s"]
assert guines["transition"] == "continued"
assert guines["previous_status"] == "inside_existing_calais_frontier_not_separately_mapped"

assert all(f["properties"]["historical_boundary_confirmed"] is False for f in city["features"])
assert all(r.get("prevent_colonial_area_creation", False) for r in ledger["new_episode_watchlist"] if r["type"] == "voyage_without_colonial_administration")
print("OK: 1519→1520 control continuity; "
      f"{len(previous_ids)} prior states accounted for, "
      f"{len(records)} ledger records, history/evidence constraints preserved.")
