"""Cross-chat 19C editorial handoff integrity gate.

Source archive tables remain immutable inputs. Workboards may change only task
status, assignee and next action, not topic IDs or source-derived counts.
"""
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
def rows(name):
    with (ROOT / name).open(encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))

def require(condition, message):
    if not condition:
        raise AssertionError(message)

def linked_chapters(raw):
    return set(re.findall(r"T\d{2}\.\d+", raw or ""))

def linked_topics(raw):
    return set(re.findall(r"T\d{2}", raw or ""))

def unique(items, key, filename):
    result = {row[key]: row for row in items}
    require(len(result) == len(items) and all(result.keys()), filename + " duplicate/missing ID")
    return result

def main():
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    orig_sections = unique(rows("tables/topics-and-sections.csv"), "章节号", "sections")
    topic_board = unique(rows("TOPIC_WORKBOARD.csv"), "专题号", "topic workboard")
    chapter_board = unique(rows("CHAPTER_WORKBOARD.csv"), "章节号", "chapter workboard")
    map_leads = rows("tables/map-leads.csv")
    questions = rows("tables/open-questions.csv")
    sources = rows("tables/sources.csv")
    require(len(topic_board) == 59 and len(chapter_board) == 150, "59 topics / 150 chapters")
    require(set(chapter_board) == set(orig_sections), "Missing or extra chapters")
    require(set(topic_board) == {r["专题号"] for r in orig_sections.values()}, "topic ID mismatch")
    require(len(map_leads) == 1317 and len(questions) == 353 and len(sources) == 1520, "Archive source counters")
    require(manifest["counts"]["topics"] == 59 and manifest["counts"]["sections"] == 150, "manifest mismatch")
    priority = Counter()
    m_by_chapter, q_by_chapter, m_by_topic, q_by_topic, source_by_topic = (
        Counter(), Counter(), Counter(), Counter(), Counter())
    for rows_, bychapter, bytopic in (
        (map_leads, m_by_chapter, m_by_topic),
        (questions, q_by_chapter, q_by_topic)):
        for row in rows_:
            chapters = linked_chapters(row["关联章节"])
            require(bool(chapters) and chapters <= set(orig_sections), "Invalid section mapping "+row["关联章节"])
            for c in chapters:
                bychapter[c] += 1
            for topic in {orig_sections[c]["专题号"] for c in chapters}:
                bytopic[topic] += 1
    for s in sources:
        topics = linked_topics(s["专题号"])
        require(bool(topics) and topics <= set(topic_board), "Invalid source topic "+s["引用键"])
        for t in topics:
            source_by_topic[t] += 1
    accepted_topic_states = {"needs_fact_review", "in_progress", "review_ready", "approved", "blocked"}
    accepted_gis_states = {"untriaged", "in_progress", "review_ready", "approved", "blocked"}
    accepted_site_states = {"not_checked", "already_published", "published_new", "no_article_needed", "blocked"}
    accepted_work_states = {"pending", "in_progress", "review_ready", "approved", "blocked"}
    for id_, row in topic_board.items():
        original = [r for r in orig_sections.values() if r["专题号"] == id_]
        ref = original[0]
        require(row["研究归档状态"] == "archived", id_+" research status")
        require(row["地区"] == ref["地区"] and row["专题"] == ref["专题"], id_+" topic title")
        require(row["优先级"] == ref["编审顺位"], id_+" priority")
        priority[row["优先级"]] += 1
        require(row["主线时段"] == ref["主线时段"], id_+" dates")
        require(int(row["章节数"]) == len(original), id_+" section count")
        require(set(row["章节号"].split("、")) == {s["章节号"] for s in original}, id_+" section IDs")
        require(int(row["年表记录"]) == sum(int(s["保留年表记录数"]) for s in original), id_+" events")
        require(int(row["导读节点"]) == sum(int(s["导读节点数"]) for s in original), id_+" reading")
        require(int(row["制图线索"]) == m_by_topic[id_], id_+" map leads")
        require(int(row["待核问题"]) == q_by_topic[id_], id_+" questions")
        require(int(row["关联史料索引"]) == source_by_topic[id_], id_+" source cross references")
        require(row["正文编审状态"] in accepted_topic_states, id_+" story state")
        require(row["地图与史料GIS状态"] in accepted_gis_states, id_+" GIS state")
        require(row["正式站去重状态"] in accepted_site_states, id_+" site state")
        require(row["已发布章节核对"] in accepted_site_states, id_+" publication state")
        require((ROOT/"topics"/(id_+".md")).is_file(), id_+" missing topic research")
        require(bool(row["下一步"].strip()), id_+" missing next action")
        if row["已发布章节核对"] in {"published_new", "already_published"}:
            require(bool(row["最近验收PR"]), id_+" published without supporting PR")
    require(priority == {"首批": 27, "后续": 32}, "original first/later priority changed")
    for cid, row in chapter_board.items():
        orig = orig_sections[cid]
        require(row["专题号"] == orig["专题号"] and row["章节"] == orig["章节"], cid+" title")
        require(row["地区"] == orig["地区"], cid+" area")
        require(row["关联原案号"] == orig["原案号"], cid+" source case")
        require(int(row["年表记录"]) == int(orig["保留年表记录数"]), cid+" event count")
        require(int(row["导读节点"]) == int(orig["导读节点数"]), cid+" reading count")
        require(int(row["关联制图线索"]) == m_by_chapter[cid], cid+" map count")
        require(int(row["关联待核问题"]) == q_by_chapter[cid], cid+" question count")
        require(row["研究归档状态"] == "archived", cid+" research stage")
        for f in ("原始证据核查", "长篇专题正文", "GIS位置和权利范围", "地图交互", "桌面CI"):
            require(row[f] in accepted_work_states | {"not_run"}, cid+" invalid stage "+f)
        require(row["正式发布"] in accepted_site_states, cid+" publication state")
        require(bool(row["下一步"].strip()), cid+" missing next action")
        if row["正式发布"] in {"published_new", "already_published"}:
            require(bool(row["负责人PR"]), cid+" published without release PR")
    for p in ("README.md", "START_HERE.md", "PROGRESS.md"):
        require((ROOT/p).is_file(), p+" missing")
    print("PASS 19C handoff: 59 topic workboard entries / 150 chapter entries; "
          "1317 map leads / 353 gaps cross-referenced; 27 first-priority topics. "
          "Research statuses kept separate from formal publication.")

if __name__ == "__main__":
    main()
