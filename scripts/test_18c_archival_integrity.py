#!/usr/bin/env python3
"""Audit editor15's preserved 18C research archive; no network and no data mutation."""
from __future__ import annotations
import csv
import hashlib
import json
import pathlib
import zipfile
from collections import Counter

ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/"research/18c/consolidated"
load=lambda path: json.loads((BASE/path).read_text(encoding="utf-8"))
def csv_read(path):
    with (BASE/path).open(encoding="utf-8-sig",newline="") as stream:
        return list(csv.DictReader(stream))
manifest=load("CONSOLIDATION_MANIFEST.json")
groups=load("MERGED_EPISODE_GROUPS.json")["groups"]
links=csv_read("ORIGINAL_TO_GROUP.csv")
archive=csv_read("COMPLETE_1126_ARCHIVE_CROSSWALK.csv")
assert len(groups)==manifest["merged_event_groups"]==162
assert len(links)==manifest["selected_first_pass"]==315
assert len(archive)==manifest["original_events"]==1126
assert len({g["id"] for g in groups})==162
assert len({r["original_id"] for r in links})==315
assert len({r["original_id"] for r in archive})==1126
assert Counter(g["map_display_tier"] for g in groups)==manifest["display_counts"]
assert Counter(r["consolidation_disposition"] for r in archive)=={
  "assigned_to_group":315,"story_narrative_evidence":432,
  "low_value_archive":363,"historical_or_chronology_deferred":16}
group_by_id={g["id"]:g for g in groups}
link_by_id={r["original_id"]:r for r in links}
archive_by_id={r["original_id"]:r for r in archive}
all_members=[]
for g in groups:
    assert g["story_arc_id"] in {f"T{i:02d}" for i in range(1,36)}
    assert len(g["original_candidate_ids"])==g["original_candidate_count"]
    assert all(isinstance(u,str) and u.startswith("https://") for u in g["source_urls"])
    all_members.extend(g["original_candidate_ids"])
assert len(all_members)==315
assert len(set(all_members))==315
assert set(all_members)==set(link_by_id)
for original_id,row in link_by_id.items():
    assert row["merged_group_id"] in group_by_id
    assert original_id in group_by_id[row["merged_group_id"]]["original_candidate_ids"]
    full=archive_by_id[original_id]
    assert full["merged_group_id"]==row["merged_group_id"]
    assert full["consolidation_disposition"]=="assigned_to_group"
    assert full["final_display_tier"]==row["final_display_tier"]
for row in archive:
    if row["consolidation_disposition"]!="assigned_to_group":
        assert not row["merged_group_id"]
series_seen=[]
for n in range(1,36):
    number=f"T{n:02d}"
    data=load(f"series/{number}.json")
    assert data["story_arc_id"]==number
    members=data["groups"]
    assert len(members)==len([g for g in groups if g["story_arc_id"]==number])
    assert {g["id"] for g in members}=={g["id"] for g in groups if g["story_arc_id"]==number}
    assert data["main_map_candidates"]==sum(g["map_display_tier"]=="main_candidate" for g in members)
    assert data["topic_mode_candidates"]==sum(g["map_display_tier"]=="topic_only" for g in members)
    assert data["narrative_only_groups"]==sum(g["map_display_tier"]=="article_only" for g in members)
    series_seen.append((number,len(members)))
assert len(series_seen)==35
assert next(c for id,c in series_seen if id=="T33")==0
assert sum(bool(c) for _,c in series_seen)==34

expected_zip_sha256={
 "assistant_A_americas_round8.zip":"75be4b7845da3d879958fb248797a1cdcfa86d562bccab45ec959483bfb72ec5",
 "assistant_B_asia_africa_round7.zip":"7bb1ec8d55b2b576c47ddab64c95bd06998778bb07787e257655231a680c8b74",
 "assistant_C_continuity_round8.zip":"24f180645cca22f21e0d515164ed3214878d8c6f18dc81af56d758c2be1d96da"}
zip_info={}
for name,expected_sha in expected_zip_sha256.items():
    zpath=BASE/"raw_sources"/name
    actual_sha=hashlib.sha256(zpath.read_bytes()).hexdigest()
    assert actual_sha==expected_sha, f"Original research ZIP SHA mismatch: {name}"
    with zipfile.ZipFile(zpath) as z:
        assert z.testzip() is None, f"Corrupt raw original research archive: {name}"
        assert len(z.namelist())>0
        zip_info[name]={"sha256":actual_sha,"members":len(z.namelist()),"bytes":zpath.stat().st_size}
bundle=BASE/manifest["zip_file"]
assert bundle.exists()
with zipfile.ZipFile(bundle) as z:
    assert z.testzip() is None
    included=[pathlib.PurePosixPath(n).name for n in z.namelist()]
    for name in ("MERGED_EPISODE_GROUPS.json","COMPLETE_1126_ARCHIVE_CROSSWALK.csv",
                 "ORIGINAL_TO_GROUP.csv","EDITOR_HANDOFF.md","CONSOLIDATION_MANIFEST.json"):
        assert name in included, f"Missing expected consolidated ZIP file: {name}"
    print("Consolidated ZIP members",len(included),
          "source-registry-like",len([n for n in included if "source" in n.lower() and "registr" in n.lower()]))
    print("Consolidated ZIP index:",json.dumps(z.namelist(),ensure_ascii=False))
print("PASS 18C original archive: 35 series (T33 empty), 162 merged groups, "
      "315 one-to-one original mappings, 1126 retained records, "
      "3 byte-identical source ZIP SHA256 and CRC checks, complete consolidated ZIP.")
print("Original ZIP verification:",json.dumps(zip_info,ensure_ascii=False,sort_keys=True))
