#!/usr/bin/env python3
"""Research-only B/R06 article and source-claim gate (not a publication approval)."""
from pathlib import Path
import csv
import json
import sys
import zipfile
import hashlib

ROOT = Path(__file__).resolve().parent
ARTICLE = ROOT / "SERIAL_ARTICLES/E6-T07-barbados-eastern-caribbean.json"
MATRIX = ROOT / "SOURCE_CLAIM_MATRIX_R06.csv"
ADDITIONS = ROOT / "SOURCE_REGISTER_R06_ADDITIONS.csv"

def require(test, message):
    if not test:
        raise ValueError(message)

def loadcsv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

def validate():
    a = json.loads(ARTICLE.read_text(encoding="utf-8-sig"))
    require(a.get("schema") == "atlas-major-story-v1" and a.get("id") == "E6-T07", "wrong article schema/id")
    require(a.get("parent_serial_topic_id") == a["id"], "broken parent id")
    require(a.get("editorial_status") == "draft_research_only", "research article falsely published")
    require(a.get("historical_end_year") is None, "1699 cannot be historic end")
    require(a.get("related_event_ids") == [], "unverified atlas event ids introduced")
    sources = a["sources"]
    source_ids = [x["id"] for x in sources]
    require(len(source_ids) == len(set(source_ids)), "duplicate article source")
    srclookup = {x["id"]: x for x in sources}
    section_ids = [x["id"] for x in a["sections"]]
    require(len(section_ids) == len(set(section_ids)), "duplicate section id")
    claims = a["topic_source_claims"]
    claim_ids = [c["claim_id"] for c in claims]
    require(len(claim_ids) == len(set(claim_ids)), "duplicate claim id")
    edges = set()
    for sec in a["sections"]:
        require(sec["paragraphs"] and sec["source_keys"], "section missing text or source")
        require(all(k in srclookup for k in sec["source_keys"]), "section source missing")
        require(any(c["section_id"] == sec["id"] for c in claims), "section missing claim: " + sec["id"])
    for c in claims:
        require(c["section_id"] in section_ids, "claim section absent")
        require(c.get("publication_approval") is False, "publication approval cannot be self-set")
        require(c["source_keys"], "claim without sources")
        for sid in c["source_keys"]:
            require(sid in srclookup, "dangling claim source: " + sid)
            edges.add((c["claim_id"], c["section_id"], sid, srclookup[sid]["url"]))
    rows = loadcsv(MATRIX)
    listed = {(r["claim_id"],r["section_id"],r["source_id"],r["source_url"]) for r in rows}
    require(len(rows)==len(listed) and edges==listed, "article-to-CSV claim edge mismatch")
    require(all(r["topic_id"]==a["id"] and r["publication_approval"]=="false" for r in rows), "invalid matrix status")
    added = loadcsv(ADDITIONS)
    added_ids = {s["source_id"] for s in added}
    require(added_ids == {"B6-SLP-BARBADOS-WITNESS", "B6-BARBADOS-PARLIAMENT-HISTORY"}, "R06 additions differ")
    require("B6-SLP-BARBADOS-WITNESS" in srclookup, "1661 version scholarly caveat missing")
    caveat = " ".join(a["sections"][1]["paragraphs"])
    require("1667" in caveat and "1661" in caveat and "修订" in caveat, "missing manuscript revision warning")
    print("PASS research article",a["id"],len(a["sections"]),"sections",len(claims),"claims",len(edges),"edges",len(source_ids),"article sources")

if __name__ == "__main__":
    try: validate()
    except Exception as exc:
        print("FAIL R06", str(exc), file=sys.stderr)
        sys.exit(1)
