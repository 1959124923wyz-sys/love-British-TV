#!/usr/bin/env python3
"""Map delivery/release contract for the British historical atlas.

Standard library only; structural and release-process gate, NOT a historical fact
checker or a substitute for actual Chromium screenshot review.
Historical chapters published before 1550 are grandfathered, not certified.
"""
from __future__ import annotations

import argparse
import json
import re
import tempfile
from pathlib import Path

SCHEMA = "aytv-cartography-release-v1"
BOARD = "aytv-cartography-delivery-board-v1"
STAGES = {"planned", "research_candidate", "editor_integrated",
          "release_approved", "published_verified", "legacy_integrated"}
DECISIONS = {"continued", "gained", "lost", "recovered", "disputed", "unknown",
             "split", "merged", "withdrawn"}
LAYERS = {"territory", "events"}
CLASSES = {"legal_sovereignty", "effective_occupation", "siege_dispute",
           "temporary_raid", "military_route", "claim_only", "political_relation"}
GEO_CLASSES = {"verified_period_polygon", "official_site_point", "dashed_schematic",
               "no_geometry", "historical_site_point", "historical_road_reference"}
ACCEPTED = {"release_approved", "published_verified"}
RELEASE_DIR = "editorial/cartography/releases"


def read_json(p: Path):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"{p}: failed to read JSON ({exc})") from exc


def path_file(root: Path, path, issues: list[str], where: str):
    if not isinstance(path, str) or not path.strip():
        issues.append(f"{where}: missing local source path")
        return None
    p = Path(path)
    if p.is_absolute() or ".." in p.parts or str(p).startswith("http"):
        issues.append(f"{where}: expected safe repository-relative path, got {path}")
        return None
    full = root / p
    if not full.is_file():
        issues.append(f"{where}: referenced file is missing: {path}")
        return None
    return full


def source_ids(obj):
    if isinstance(obj, list):
        entries = obj
    elif isinstance(obj, dict):
        entries = obj.get("records") or obj.get("sources") or []
    else:
        return set()
    if not isinstance(entries, list):
        return set()
    return {i.get("id") for i in entries if isinstance(i, dict) and isinstance(i.get("id"), str)}


def check_release_shape(release: dict, where: str, issues: list[str]):
    def ck(condition, why):
        if not condition:
            issues.append(f"{where}: {why}")
    ck(release.get("schema") == SCHEMA, "wrong release schema")
    ck(release.get("template_only") is False, "release is still marked template_only")
    period = release.get("period") or {}
    start, end = period.get("start"), period.get("end")
    good = (type(start) is int and type(end) is int and
            start <= end and 1490 <= start <= 2100 and end <= 2100)
    ck(good, "invalid period")
    ck(release.get("release_stage") in STAGES, "invalid release_stage")
    ck(isinstance(release.get("chapter_id"), str) and bool(release.get("chapter_id")),
       "chapter_id absent")
    ck(isinstance(release.get("unresolved_history_questions"), list),
       "unresolved_history_questions must be a list")
    years = release.get("critical_years")
    ck(isinstance(years, list) and all(type(y) is int for y in years),
       "critical_years must be integer list")
    if good and isinstance(years, list):
        ck(len(years) == len(set(years)), "duplicate critical_year")
        ck(all(start <= y <= end for y in years if type(y) is int),
           "critical_year outside period")
    return (start, end) if good else None


def validate_ready(root: Path, record: dict, issues: list[str]):
    period = record["period"]
    start, end = period["start"], period["end"]
    key = f"{start}-{end}"

    def fail(condition, reason):
        if not condition:
            issues.append(f"publish {key}: {reason}")

    if record.get("release_stage") not in ACCEPTED:
        issues.append(f"publish {key}: chapter has been marked published but "
                      f"release_stage={record.get('release_stage')!r} is not approved")
        return

    paths = {}
    for field in ("atlas_path", "yearend_reference_path", "source_registry_path",
                  "map_delta_path"):
        path = path_file(root, record.get(field), issues, f"{key}/{field}")
        if path:
            paths[field] = path
    if len(paths) != 4:
        return

    atlas, src, yearend, delta = (read_json(paths[f]) for f in
                                  ("atlas_path", "source_registry_path",
                                   "yearend_reference_path", "map_delta_path"))
    fail(isinstance(atlas, dict) and
         isinstance(atlas.get("events"), list) and
         isinstance(atlas.get("places"), list), "atlas needs events and places")
    idset = source_ids(src)
    fail(bool(idset), "no source registry IDs")
    records = (yearend.get("annual_snapshots") or
               yearend.get("year_end_snapshots") or [])
    if not isinstance(records, list):
        records = []
    snapshot_years = [s.get("year") for s in records if isinstance(s, dict)]
    fail(snapshot_years == list(range(start, end + 1)),
         f"year-end snapshots must cover every year exactly once: {start}..{end}")

    features = delta.get("features") if isinstance(delta, dict) else None
    fail(delta.get("type") == "FeatureCollection" if isinstance(delta, dict) else False,
         "map_delta must be a GeoJSON FeatureCollection")
    fail(isinstance(features, list), "map_delta.features missing")
    if isinstance(features, list):
        all_feature_ids = []
        for feat in features:
            p = feat.get("properties") or {}
            geom = feat.get("geometry") or {}
            all_feature_ids.append(feat.get("id") or p.get("stable_id"))
            refs = p.get("source_ids") or []
            fail(bool(refs) and all(r in idset for r in refs),
                 f"delta feature {feat.get('id')}: unknown/empty source_ids")
            gt = geom.get("type")
            is_area = gt in {"Polygon", "MultiPolygon"}
            if is_area:
                verified = p.get("historical_boundary_confirmed") is True
                authorized = p.get("fill_authorized") is True
                if authorized:
                    fail(verified, f"{feat.get('id')}: authorized polygon lacks proven period boundary")
                    refs2 = p.get("approval_source_ids") or []
                    fail(bool(refs2) and all(s in idset for s in refs2),
                         f"{feat.get('id')}: authorized area lacks approval-source IDs")
                else:
                    fail(p.get("area_sqkm") is None,
                         f"{feat.get('id')}: reference polygon cannot have historic area")
            if gt in {"LineString", "MultiLineString"}:
                fail(p.get("area_sqkm") is None,
                     f"{feat.get('id')}: military direction line has area")
        fail(len(all_feature_ids) == len(set(all_feature_ids)),
             "duplicate map delta feature IDs")

    years = record.get("critical_years") or []
    fail(start in years and end in years,
         "critical_years must include first and last years")
    changes = record.get("material_changes") or []
    fail(bool(changes), "no material_changes or explicit defended no-change record")
    for change in changes:
        date = change.get("year")
        fail(type(date) is int and start <= date <= end,
             f"invalid material change year: {change.get('id')}")
        fail(change.get("change") in DECISIONS,
             f"invalid transition classification: {change.get('id')}")
        fail(change.get("control_class") in CLASSES,
             f"invalid control class: {change.get('id')}")
        fail(change.get("map_layer") in LAYERS,
             f"invalid map layer: {change.get('id')}")
        fail(change.get("geometry_status") in GEO_CLASSES,
             f"invalid geometry/evidence status: {change.get('id')}")
        refs = change.get("source_ids") or []
        fail(bool(refs) and all(x in idset for x in refs),
             f"material change missing registered citations: {change.get('id')}")
        if change.get("geometry_status") != "verified_period_polygon":
            fail(change.get("area_counting_allowed") is False,
                 f"unverified change counted as real area: {change.get('id')}")

    readiness = record.get("map_readiness") or {}
    for field in ("source_citations_reviewed", "annual_snapshots_checked",
                  "pr_editor_cherry_pick_confirmed", "two_public_layers_verified",
                  "period_change_diffs_verified"):
        fail(readiness.get(field) is True, f"map_readiness.{field} not passed")

    visual = record.get("visual_acceptance") or {}
    fail(visual.get("status") == "passed", "real browser visual_acceptance not passed")
    tested = visual.get("tested_critical_years") or []
    fail(set(years).issubset(tested), "no visual screenshot checks for all critical years")
    for viewport in ("desktop", "mobile"):
        check = visual.get(viewport) or {}
        fail(check.get("status") == "passed", f"{viewport} screenshot acceptance not passed")
        link = check.get("evidence_url")
        fail(isinstance(link, str) and link.startswith("https://"),
             f"{viewport} missing reviewable screenshot/report link")
        fail(set(years).issubset(check.get("tested_years") or []),
             f"{viewport} missing critical-year evidence")
    fail(bool(visual.get("reviewer")) and bool(visual.get("reviewed_at")),
         "visual reviewer/date absent")

    ci = record.get("ci_acceptance") or {}
    fail(ci.get("status") == "passed" and
         bool(re.match(r"^https://github\.com/[^/]+/[^/]+/actions/runs/\d+",
                       str(ci.get("run_url") or ""))),
         "verified GitHub Actions run URL required")

    approval = record.get("approval") or {}
    fail(approval.get("decision") == "approved" and bool(approval.get("chief_editor"))
         and bool(approval.get("approved_at")),
         "named chief editor approval/date required")
    boundary = record.get("boundary_provenance") or {}
    fail(type(boundary.get("true_period_polygon_count")) is int and
         boundary["true_period_polygon_count"] >= 0,
         "must distinguish verified versus schematic historic polygons")
    fail(isinstance(record.get("unresolved_history_questions"), list),
         "unresolved issues must be transparently recorded")
    fail(record.get("uncertainty_disposition") == "preserve_unknown_and_block_solid_fill",
         "cannot auto-fill unknown war boundaries")


def audit(root: Path) -> list[str]:
    issues: list[str] = []
    release_dir = root / RELEASE_DIR
    files = sorted(release_dir.glob("????-????.json"))
    if not files:
        return ["No release cards found: editor/cartography release system absent"]
    records = {}
    for path in files:
        release = read_json(path)
        key = check_release_shape(release, str(path.relative_to(root)), issues)
        if key:
            if key in records:
                issues.append(f"duplicate release periods {key}")
            records[key] = release
            if path.stem != f"{key[0]}-{key[1]}":
                issues.append(f"{path.name}: filename does not match years")

    boardpath = root / "editorial/cartography/DELIVERY_BOARD.json"
    board = read_json(boardpath)
    if board.get("schema") != BOARD:
        issues.append("delivery board schema mismatch")
    stages = set(STAGES) | {"visual_verified", "released_verified"}
    tracked = board.get("tracked_chapters") or []
    if len(tracked) != len({r.get("id") for r in tracked}):
        issues.append("delivery board has duplicate chapter IDs")
    for row in tracked:
        if row.get("status") not in stages:
            issues.append(f"board chapter {row.get('id')}: invalid stage")
        years = row.get("period") or []
        if len(years) != 2 or tuple(years) not in records:
            issues.append(f"board chapter {row.get('id')}: missing release record")
        if not row.get("next_action"):
            issues.append(f"board chapter {row.get('id')}: no next action")

    chapters = read_json(root / "data/chapters.json").get("chapters", [])
    for ch in chapters:
        if ch.get("status") != "published" or ch.get("start", 0) < 1550:
            continue  # historical legacy baseline is never falsely re-certified
        key = (ch["start"], ch["end"])
        record = records.get(key)
        if not record:
            issues.append(f"published chapter {key} missing release card")
            continue
        if record.get("chapter_id") != ch.get("id"):
            issues.append(f"published chapter {key} identity mismatch")
        matching = [r for r in tracked if r.get("id") == ch.get("id")]
        if not matching or matching[0].get("status") not in {
                "editor_integrated", "visual_verified", "released_verified"}:
            issues.append(f"published chapter {key} not acknowledged on delivery board")
        if not matching or matching[0].get("published_in_repo") is not True:
            issues.append(f"published chapter {key} missing publication board acknowledgement")
        validate_ready(root, record, issues)
    return issues


def self_test():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / RELEASE_DIR).mkdir(parents=True)
        (root / "data").mkdir()
        (root / "data/chapters.json").write_text(json.dumps({"chapters": [
            {"id": "chapterSeventh", "start": 1550, "end": 1559, "status": "published"}
        ]}), encoding="utf-8")
        (root / "editorial/cartography/DELIVERY_BOARD.json").write_text(
            json.dumps({"schema": BOARD, "tracked_chapters": [
                {"id": "chapterSeventh", "period": [1550, 1559],
                 "status": "research_candidate", "published_in_repo": False,
                 "next_action": "Await source review"}
            ]}), encoding="utf-8")
        card = {"schema": SCHEMA, "template_only": False, "chapter_id": "chapterSeventh",
                "period": {"start": 1550, "end": 1559}, "release_stage": "research_candidate",
                "critical_years": [1550, 1558, 1559], "unresolved_history_questions": []}
        (root / RELEASE_DIR / "1550-1559.json").write_text(json.dumps(card), encoding="utf-8")
        # Leave a legacy release card so removing chapter seven tests the
        # missing-per-period guard rather than just the empty-directory guard.
        baseline = dict(card, chapter_id="chapterSixth",
                        period={"start": 1540, "end": 1549},
                        release_stage="legacy_integrated", critical_years=[1540, 1549])
        (root / RELEASE_DIR / "1540-1549.json").write_text(json.dumps(baseline), encoding="utf-8")
        errs = audit(root)
        assert any("not approved" in i for i in errs), errs
        assert any("not acknowledged" in i for i in errs), errs

        # A future published chapter cannot be silently omitted.
        (root / RELEASE_DIR / "1550-1559.json").unlink()
        errs = audit(root)
        assert any("missing release card" in i for i in errs), errs
        print("PASS cartography contract self-test: unapproved and missing future chapter blocked")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        self_test()
        return
    issues = audit(args.root)
    for i in issues:
        print("FAIL", i)
    if issues:
        raise SystemExit(f"FAIL cartography delivery gate: {len(issues)} issue(s)")
    print("PASS cartography delivery gate: current records valid; "
          "future published chapters require editor acceptance and visual proof")


if __name__ == "__main__":
    main()
