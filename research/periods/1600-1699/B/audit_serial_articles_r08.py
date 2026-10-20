#!/usr/bin/env python3
"""Editor6 R08 B story gates: syntax and provenance only; never grants publication."""
import csv
import json
from pathlib import Path
import re

HERE=Path(__file__).resolve().parent
ARTICLE=HERE/"SERIAL_ARTICLES/E6-T07-barbados-eastern-caribbean.json"
MATRIX=HERE/"SOURCE_CLAIM_MATRIX.csv"
BAN=(r"本轮",r"下轮",r"下阶段",r"待审",r"待核",r"待补",
     r"主编",r"编辑6",r"(?i)GIS",r"(?i)Polygon",
     r"不能上线",r"研究窗口",r"地图上",r"本研究",
     r"尚待",r"后续更新")
def check(p,m):
    assert p["schema"]=="atlas-major-story-v1"
    assert p["id"]==p["parent_serial_topic_id"]=="E6-T07"
    assert p["editorial_status"]=="draft_research_only"
    assert p["historical_end_year"] is None
    assert (p["start_year"],p["end_year"])==(1625,1692)
    assert p["related_event_ids"]==[]
    sect={s["id"]:s for s in p["sections"]};assert len(sect)==len(p["sections"])
    sources={s["id"]:s for s in p["sources"]};assert len(sources)==len(p["sources"])
    claims={c["claim_id"]:c for c in p["topic_source_claims"]}
    assert len(claims)==len(p["topic_source_claims"])
    paras=[p["lead"]]+[q for s in p["sections"] for q in s["paragraphs"]]
    for par in paras:
        assert len(par)>30
        assert all(not re.search(pattern,par) for pattern in BAN),par
    for s in p["sections"]:
        assert p["start_year"]<=s["period_start_year"]<=s["period_end_year"]<=p["end_year"]
        assert len(s["paragraphs"])>=2
        assert s["source_keys"] and set(s["source_keys"])<=sources.keys()
        sc=[c for c in claims.values() if c["section_id"]==s["id"]]
        assert sc, s["id"]
        assert set(s["source_keys"])=={k for c in sc for k in c["source_keys"]},s["id"]
    edge=set()
    for c in claims.values():
        assert c["publication_approval"] is False
        for k in ("assertion_type","claim_summary","original_document_page","verification_depth","conflicting_evidence_or_limits"):
            assert c.get(k), (c["claim_id"],k)
        for sid in c["source_keys"]:
            assert sid in sources
            edge.add((c["claim_id"],c["section_id"],sid,sources[sid]["url"]))
    mr={(r["claim_id"],r["section_id"],r["source_id"],r["source_url"]) for r in m}
    assert edge==mr and len(m)==len(mr)
    assert all(r["publication_approval"]=="false" for r in m)
    assert "1667" in " ".join(sect["dual-1661"]["paragraphs"])
    print(f"PASS: article has {len(sect)} sections; {len(claims)} claims, {len(edge)} source edges; years {p['start_year']}-{p['end_year']}")
if __name__=="__main__":
    story=json.loads(ARTICLE.read_text(encoding="utf-8"))
    with MATRIX.open(encoding="utf-8",newline="") as f: matrix=list(csv.DictReader(f))
    check(story,matrix)
    print("PUBLISH STATUS: blocked pending Editor6 approval and mother-topic completion")
