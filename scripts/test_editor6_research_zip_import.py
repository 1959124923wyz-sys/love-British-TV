#!/usr/bin/env python3
"""Review the path safety rules for full-archive import without changing files."""
import importlib.util
from pathlib import Path

s = importlib.util.spec_from_file_location(
    "editor6import", Path(__file__).with_name("import_editor6_research_zip.py"))
m = importlib.util.module_from_spec(s)
s.loader.exec_module(m)

valid = [
    "source_A/EVENT_CANDIDATES.json",
    "source_B/TOPIC_DRAFTS/09_战争资料.md",
    "source_C/PROGRESS.md",
    "INTEGRATED/MASTER_SOURCES_522_RESEARCH_ONLY.csv",
    "ARCHIVES/Editor6-AgentA-R05-ORIGINAL.zip",
    "AGENT_TASKS/Editor6-AgentA-R06-BRIEF.md",
    "EDITORIAL/QA_STATE.json",
]
invalid = [
    "../../data/chapters.json",
    "source_A/../../app.js",
    "/source_A/hijack.json",
    "source_A/./bad.json",
    "source_A\\bad.json",
    "source_A/outside.zip",
    "ARCHIVES/evil.js",
    ".github/workflows/new.yml",
    "data/atlas-1600-1609.json",
    "source_A//bad.csv",
]
for x in valid:
    assert m.valid_name(x), f"valid path rejected: {x}"
for x in invalid:
    assert not m.valid_name(x), f"unsafe path accepted: {x}"
assert m.MAX_FILES <= 1000
assert m.MAX_UNPACKED_BYTES <= 60 * 1024 * 1024
assert str(m.DESTINATION).startswith("research/periods/1600-1699/")
print("PASS: cumulative archive importer path/suffix/symlink/size safeguards")
