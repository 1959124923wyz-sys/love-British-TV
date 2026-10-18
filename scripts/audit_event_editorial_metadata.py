#!/usr/bin/env python3
"""Audit published editorial metadata without fabricating historical explanations.

Existing omissions are an explicitly frozen, nonblocking review backlog. New
omissions in edited/added published events fail --strict. This does NOT judge
whether a rationale is historically well supported; editors must verify sources.
"""
import argparse
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / "data/legacy-editorial-metadata-exceptions-20261018.json"
FIELDS = (
    "missing_rationale",
    "missing_review_status",
    "missing_position_type",
    "missing_geography_label",
    "missing_geo_precision",
)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def absent(value):
    return not isinstance(value, str) or not value.strip()


def audit():
    registry = load(ROOT / "data/chapters.json")
    baseline = load(BASELINE)
    if baseline.get("schema") != "atlas-legacy-editorial-metadata-exceptions-v1":
        raise ValueError("Unknown reviewed legacy metadata baseline schema")
    allowed = {}
    for field in FIELDS:
        ids = baseline.get(field)
        if not isinstance(ids, list) or not all(isinstance(i, str) and i for i in ids):
            raise ValueError("Malformed editorial exception identifiers: " + field)
        if len(set(ids)) != len(ids):
            raise ValueError("Duplicate editorial exception identifiers: " + field)
        allowed[field] = set(ids)

    current = defaultdict(set)
    period_rows = []
    global_ids = set()
    for chapter in registry["chapters"]:
        if chapter.get("status") != "published":
            continue
        events = load(ROOT / chapter["source"])["events"]
        per_period = {"start": chapter["start"], "end": chapter["end"],
                      "events": len(events), "located_events": 0,
                      **{key: 0 for key in FIELDS}}
        for event in events:
            event_id = event.get("id")
            if not isinstance(event_id, str) or not event_id:
                raise ValueError("Published event without stable ID")
            if event_id in global_ids:
                raise ValueError("Duplicate published event ID: " + event_id)
            global_ids.add(event_id)
            significance = event.get("significance") or {}
            if not isinstance(significance, dict) or significance.get("level") not in (1, 2, 3):
                raise ValueError("Invalid significance tier: " + event_id)
            checks = {
                "missing_rationale": absent(significance.get("rationale")),
                "missing_review_status": absent(significance.get("review_status")),
            }
            lat, lng = event.get("lat"), event.get("lng")
            if (lat is None) != (lng is None):
                raise ValueError("Incomplete coordinate pair: " + event_id)
            if lat is not None:
                per_period["located_events"] += 1
                checks.update({
                    "missing_position_type": absent(event.get("position_type")),
                    "missing_geography_label": absent(event.get("geography_label")),
                    "missing_geo_precision": absent(event.get("geo_precision")),
                })
            for field, missing in checks.items():
                if missing:
                    current[field].add(event_id)
                    per_period[field] += 1
        period_rows.append(per_period)

    new_missing = {key: sorted(current[key] - allowed[key]) for key in FIELDS}
    remaining_legacy = {key: len(current[key] & allowed[key]) for key in FIELDS}
    resolved_legacy = {key: len(allowed[key] - current[key]) for key in FIELDS}
    result = {
        "schema": "atlas-editorial-metadata-audit-v1",
        "published_event_count": len(global_ids),
        "published_chapters": len(period_rows),
        "current_missing_counts": {key: len(current[key]) for key in FIELDS},
        "previously_reviewed_legacy_missing": remaining_legacy,
        "resolved_legacy_missing": resolved_legacy,
        "new_unapproved_missing": new_missing,
        "by_chapter": period_rows,
        "interpretation": ("Existing missing fields are editorial review debt, not "
                           "evidence of a false event. New gaps are blocked; "
                           "historical justifications must be source-verified by editors."),
    }
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true",
                        help="Fail on newly introduced omissions, not already inventoried legacy gaps")
    parser.add_argument("--out", type=Path, help="Optional JSON report destination")
    args = parser.parse_args()
    result = audit()
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n",
                            encoding="utf-8")
    print(json.dumps({
        "published_event_count": result["published_event_count"],
        "current_missing_counts": result["current_missing_counts"],
        "resolved_legacy_missing": result["resolved_legacy_missing"],
        "new_unapproved_missing": result["new_unapproved_missing"],
    }, ensure_ascii=False, indent=2))
    if args.strict and any(result["new_unapproved_missing"].values()):
        raise SystemExit("FAIL: new published events cannot omit required editorial fields")


if __name__ == "__main__":
    main()
