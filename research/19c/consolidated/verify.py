"""Check the handover tables, source links and supporting files."""
import csv
from hashlib import sha256
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent

def read_table(path):
    with (ROOT / path).open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

def require(condition, message):
    if not condition:
        raise ValueError(message)

def unique_index(rows, key, filename):
    indexed = {row[key]: row for row in rows}
    require("" not in indexed and len(indexed) == len(rows), f"{filename}: invalid {key}")
    return indexed

def main():
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    tables = {Path(name).stem: read_table(name) for name in manifest["csv_tables"]}
    for name, metadata in manifest["csv_tables"].items():
        require(len(tables[Path(name).stem]) == metadata["rows"], f"{name}: row count differs")
    case_rows = unique_index(tables["case-crosswalk"], "原案号", "case-crosswalk")
    for case in case_rows.values():
        section_ids = case["现专题及章节"].split("、") if case["现专题及章节"] else []
        require(bool(section_ids) == (case["编辑处理"] != "移出主目录"), case["原案号"])
    sections = unique_index(tables["topics-and-sections"], "章节号", "topics-and-sections")
    topic_ids = {r["专题号"] for r in sections.values()}
    require({p.stem for p in (ROOT / "topics").glob("T*.md")} == topic_ids, "Topic files")
    for row in sections.values():
        require(row["章节号"].split(".")[0] == row["专题号"], row["章节号"])
        require(set(row["原案号"].split("、")) <= case_rows.keys(), row["章节号"])
        require(set(row["互见专题"].split("、")) <= topic_ids, row["章节号"])
    event_rows = unique_index(tables["events"], "事件编号", "events")
    source_rows = unique_index(tables["sources"], "引用键", "sources")
    reading_rows = unique_index(tables["reading-events"], "事件编号", "reading-events")
    excluded_rows = unique_index(tables["excluded-events"], "原事件号", "excluded-events")
    require(not (event_rows.keys() & excluded_rows.keys()), "An excluded event appears in the chronology")
    require(reading_rows.keys() == {k for k, row in event_rows.items() if row["层级"] == "导读节点"}, "Reading list")
    for ident, row in event_rows.items():
        slot, case = row["章节号"], row["原案号"]
        require(row["专题号"] == sections[slot]["专题号"], ident)
        require(slot in case_rows[case]["现专题及章节"].split("、"), ident)
        identifiers = row["可对齐史料编号"].split("、")
        require(all(identifiers), ident)
        for evidence in identifiers:
            source_key = f"{case[0]}/{evidence}"
            evidence_slots = source_rows[source_key]["关联章节"].split("；")
            require(f"{slot}（事件原引）" in evidence_slots, f"{ident}: {source_key}")
        if row["并读事件号"]:
            require(row["并读事件号"] in event_rows, f"{ident}: paired event missing")
    for ident, row in excluded_rows.items():
        require(row["原案号"] in case_rows and bool(row["处理理由"]), ident)
    for row in tables["map-leads"]:
        require(row["专题"] in case_rows, "Map lead refers to unknown case")
        require(set(row["关联章节"].split("、")) <= sections.keys(), "Map lead refers to unknown section")
    for row in tables["supporting-materials"]:
        path = ROOT / row["阅读副本"]
        require(path.is_relative_to(ROOT / "materials") and path.is_file(), row["阅读副本"])
        if row["类别"] != "批次数字节选":
            require(sha256(path.read_bytes()).hexdigest() == row["原件SHA256"], row["阅读副本"])
    files = [ROOT / "README.md", ROOT / "PROGRESS.md", ROOT / "tables/cross-topic-evidence.md", *(ROOT / "topics").glob("*.md")]
    for path in files:
        for raw in re.findall(r"\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
            parsed = urlsplit(raw)
            if not parsed.scheme and parsed.path and not parsed.netloc:
                destination = path.parent / unquote(parsed.path)
                require(destination.exists(), f"{path.name}: missing {raw}")
    print(f"Validated {len(topic_ids)} topics, {len(sections)} sections, {len(event_rows)} chronology rows and {len(source_rows)} sources.")

if __name__ == "__main__":
    main()
