#!/usr/bin/env python3
"""Read-only 1126 original 18C research-row -> 162 merger groups -> all live 18C chronology audit.

An original candidate mapped only by group is not claimed to have its individual content verified.
A group named in provenance but not attached to an event remains a documentary mention, not map linkage.
No HTTP calls, no mutation of historical inputs; deterministic complete CSV and JSON + Markdown artifacts.
"""
from __future__ import annotations
import argparse
import collections
import csv
import hashlib
import json
import pathlib
import zipfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/"research/18c/consolidated"
READER=ROOT/"data/stories/serial"
MANIFEST=BASE/"CONSOLIDATION_MANIFEST.json"
ARCHIVE=BASE/"18C_Consolidated_Research_Handoff_20261108.zip"
CROSSWALK=BASE/"COMPLETE_1126_ARCHIVE_CROSSWALK.csv"
MERGES=BASE/"MERGED_EPISODE_GROUPS.json"
STATUS={"assigned_to_group":315,"story_narrative_evidence":432,"low_value_archive":363,"historical_or_chronology_deferred":16}
HEADERS=("original_id","assistant","original_title","year","arc","topic","original_grade","source_ids","source_urls","root_provenance","consolidation_disposition","merged_group_id","final_display_tier")
CSV_COLS=("original_id","arc","year","assistant","original_title","disposition","tier","merged_group_id","audit_status","linked_event_ids","provenance_only_dataset_ids","source_ids","source_urls","research_followup")
def read_json(p):
    return json.loads(p.read_text(encoding="utf-8"))
def read_csv(p):
    with p.open("r",encoding="utf-8-sig",newline="") as f:
        return list(csv.DictReader(f))
def pretty(o):
    return json.dumps(o,ensure_ascii=False,indent=2,sort_keys=True)+"\n"
def items(s):
    if isinstance(s,str):
        return [s] if s else []
    return [str(x) for x in s] if isinstance(s,list) else []
def unique(s):
    return sorted(set(s))

def audit():
    rows=read_csv(CROSSWALK)
    manifest=read_json(MANIFEST)
    raw_groups=read_json(MERGES)["groups"]
    by_group={g["id"]:g for g in raw_groups}
    assert len(rows)==len({r["original_id"] for r in rows})==manifest["original_events"]==1126
    assert len(raw_groups)==len(by_group)==manifest["merged_event_groups"]==162
    assert collections.Counter(r["consolidation_disposition"] for r in rows)==STATUS
    assert len([r for r in rows if r["consolidation_disposition"]=="assigned_to_group"])==315
    assert all(set(HEADERS).issubset(r.keys()) for r in rows)
    ids={r["original_id"]:r for r in rows}
    for g in raw_groups:
        assert len(g["original_candidate_ids"])==len(set(g["original_candidate_ids"]))
        for oid in g["original_candidate_ids"]:
            assert oid in ids and ids[oid]["consolidation_disposition"]=="assigned_to_group",oid
            assert ids[oid]["merged_group_id"]==g["id"],oid
    assert sum(len(g["original_candidate_ids"]) for g in raw_groups)==315
    assert all(r["merged_group_id"] in by_group for r in rows if r["consolidation_disposition"]=="assigned_to_group")
    with zipfile.ZipFile(ARCHIVE) as z:
        assert z.testzip() is None
        zip_names=sorted(z.namelist())
    index=read_json(READER/"preview-18c-index.json")
    stories=index["stories"]
    assert len(stories)==31 and len({s["id"] for s in stories})==31
    coverage_arcs=set()
    for s in stories:
        story=read_json(ROOT/s["file"])
        assert story["id"]==s["id"] and story.get("publication_status")=="research_only"
        coverage_arcs.update(items(story.get("series_family")))
        if story["id"].startswith("E18-C07-"):
            coverage_arcs.add("T07")
    assert len(coverage_arcs)==35 and all("T%02d"%x in coverage_arcs for x in range(1,36))
    event_groups=collections.defaultdict(set)
    documented_groups=collections.defaultdict(set)
    explicit_records=collections.defaultdict(set)
    event_ids=set()
    dataset_files=[]
    all_event_count=0
    all_modern_pin_count=0
    for path in sorted(READER.glob("chronology-preview-*.json")):
        if path.name=="chronology-preview-1600-1699.json":
            continue
        data=read_json(path)
        ds_id=data.get("dataset_id",path.stem)
        dataset_files.append({"path":path.relative_to(ROOT).as_posix(),"dataset_id":ds_id,"events":len(data.get("events",[]))})
        provenance=data.get("provenance",{})
        for gid in items(provenance.get("research_merge_groups")):
            if gid in by_group:
                documented_groups[gid].add(ds_id)
        for ev in data.get("events",[]):
            eid=ev.get("id")
            assert isinstance(eid,str) and eid.startswith("E18C"),(path.name,eid)
            if eid in event_ids:
                raise AssertionError(f"Duplicate across chronology datasets: {eid}")
            event_ids.add(eid)
            all_event_count+=1
            if ev.get("lat") is not None:
                all_modern_pin_count+=1
            for gid in items(ev.get("research_merge_group_id")):
                if gid in by_group:
                    event_groups[gid].add(eid)
            for oid in items(ev.get("research_original_record_ids")):
                if oid in ids:
                    explicit_records[oid].add(eid)
            # Original archive citations in narrative/secondary relationships are not GIS map evidence.
    assert dataset_files
    status_count=collections.Counter()
    selected_status=collections.Counter()
    records=[]
    by_arc=collections.defaultdict(lambda:collections.Counter())
    group_status=collections.Counter()
    groups_report=[]
    for g in raw_groups:
        gid=g["id"]
        evs=unique(event_groups.get(gid,set()))
        meta=unique(documented_groups.get(gid,set()))
        state="event_group_link" if evs else ("dataset_provenance_only" if meta else "no_structured_chronology_link")
        group_status[state]+=1
        members=[ids[oid] for oid in g["original_candidate_ids"]]
        groups_report.append({"id":gid,"arc":g["story_arc_id"],"title":g.get("title_zh",""),"start_year":g.get("start_year"),"end_year":g.get("end_year"),"source_urls":g.get("source_urls",[]),"original_candidate_ids":g["original_candidate_ids"],"original_candidate_count":len(members),"main_candidate_count":sum(r["final_display_tier"]=="main_candidate" for r in members),"status":state,"linked_event_ids":evs,"provenance_dataset_ids":meta})
    for r in rows:
        oid=r["original_id"];disp=r["consolidation_disposition"];gid=r["merged_group_id"]
        ev=unique(explicit_records.get(oid,set()))
        group_events=unique(event_groups.get(gid,set()))
        meta=unique(documented_groups.get(gid,set()))
        if disp=="assigned_to_group":
            if ev:state="exact_original_id_event"
            elif group_events:state="group_level_event_link"
            elif meta:state="metadata_group_only"
            else:state="no_structured_event_link"
            selected_status[state]+=1
            if state=="exact_original_id_event":next_step="保留精确ID级地图映射；继续查原档及GIS"
            elif state=="group_level_event_link":next_step="事件只关联合并组，原候审单条尚未逐一机器配准；核是否已在正文覆盖"
            elif state=="metadata_group_only":next_step="仅数据集来源声明提及此组合，地图未见直接group事件关联；按原档逐项审核"
            else:next_step="当前专题虽覆盖母题，但本条缺机器级地图关联；优先独立补核或说明舍弃原因"
        elif disp=="historical_or_chronology_deferred":
            state="deferred_no_map_approval";next_step="按年月、实际责任主体、第一手来源逐条重审，不自动生成地图"
        elif disp=="story_narrative_evidence":
            state="narrative_only_original";next_step="正文辅助材料，必要时确认已在正文可查；不自动提升地图"
        else:
            state="low_priority_original";next_step="保留原始归档，不自动升级"
        status_count[state]+=1;by_arc[r["arc"]][state]+=1
        # Retain every source URL as provenance, but its appearance does not attest that original archive was opened.
        records.append({"original_id":oid,"arc":r["arc"],"year":r["year"],"assistant":r["assistant"],"original_title":r["original_title"],"disposition":disp,"tier":r["final_display_tier"],"merged_group_id":gid,"audit_status":state,"linked_event_ids":unique(ev or group_events),"provenance_only_dataset_ids":meta if not group_events else [],"source_ids":r["source_ids"],"source_urls":r["source_urls"],"research_followup":next_step})
    assert sum(selected_status.values())==315
    assert len(records)==1126 and sum(status_count.values())==1126
    assert sum(group_status.values())==162
    priority=[g for g in groups_report if g["status"]!="event_group_link"]
    priority.sort(key=lambda g:(0 if g["status"]=="no_structured_chronology_link" else 1,-g["main_candidate_count"],-g["original_candidate_count"],g["arc"],g["id"]))
    review_ids=sorted([r for r in records if r["disposition"]=="historical_or_chronology_deferred"],key=lambda r:(r["arc"],r["year"],r["original_id"]))
    summary={
       "schema":"atlas-18c-1126-consolidated-candidate-coverage-audit-v1",
       "snapshot":"2026-11-12",
       "branch_policy":"independent Draft branch; no main publication or geometry approval",
       "interpretation":"A chapter covering an arc is not proof every original record is a verified map event. Event-group links are not per-candidate confirmation; provenance-only is weaker. Legacy original source_urls are unverified archival pointers, not personally inspected originals.",
       "source_of_truth":{"manifest":str(MANIFEST.relative_to(ROOT)),"crosswalk":str(CROSSWALK.relative_to(ROOT)),"merged_groups":str(MERGES.relative_to(ROOT)),"zip_archive":str(ARCHIVE.relative_to(ROOT)),"original_zip_member_count":len(zip_names),"zip_sha256":hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()},
       "totals":{"archive_rows":1126,"A_rows":519,"B_rows":381,"C_rows":226,"selected_candidates":315,"narrative_only":432,"low_priority":363,"deferred":16,"merged_groups":162,"research_arcs":35,"indexed_stories":len(stories),"chronology_dataset_files":len(dataset_files),"unique_map_chronology_events":len(event_ids),"modern_reference_pin_occurrences":all_modern_pin_count},
       "coverage":{"selected_candidate_status":dict(sorted(selected_status.items())),"group_status":dict(sorted(group_status.items())),"all_original_status":dict(sorted(status_count.items()))},
       "archive_arc_counts":{arc:dict(sorted(stats.items())) for arc,stats in sorted(by_arc.items())},
       "selected_group_priorities":priority,
       "all_groups":sorted(groups_report,key=lambda g:g["id"]),
       "deferred_16_originals":review_ids,
       "all_1126_originals":records,
       "datasets":dataset_files
    }
    return summary

def to_md(report):
    total=report["totals"];cov=report["coverage"];sel=cov["selected_candidate_status"];grp=cov["group_status"]
    s=["# 第32批｜18世纪1126条原始候审资料→Atlas结构化覆盖审计","",
       "**口径：** 这是一份只读静态映射检查。索引有专题文章只说明题材已覆盖；真实Atlas事件关联仍需按合并组、原候审ID分层审计。它不自动确认任何原史料的真实性、殖民领土或损失数额。","",
       "## 固定研究输入","",
       f"- 原始档案：**{total['archive_rows']}** 条（A={total['A_rows']}、B={total['B_rows']}、C={total['C_rows']}），原162合并组、315入选候审、432正文辅助、363归档、16待核；原ZIP及1126 crosswalk读取不修改。",
       f"- 现有**{total['indexed_stories']}**篇专题文章已覆盖35个T01—T35主题，扫描**{total['chronology_dataset_files']}**份18世纪年代数据、**{total['unique_map_chronology_events']}**条唯一Atlas事件；现代参考点出现{total['modern_reference_pin_occurrences']}次，不当作历史坐标真值。",
       "",
       "## 原315项候审与Atlas的证据连接程度","",
       "| 映射层级 | 条数 | 判断 |","|---|---:|---|",
       f"| 明确原始候审ID关联事件 | {sel.get('exact_original_id_event',0)} | 最强的机器级直接可追溯（仍要研究史实） |",
       f"| 原候审所在合并组有事件 | {sel.get('group_level_event_link',0)} | 只证明主题组进入地图，单条仍待独立核对 |",
       f"| 仅数据集provenance提及合并组 | {sel.get('metadata_group_only',0)} | 尚未找到直接地图事件对应 |",
       f"| 没有结构化关联 | {sel.get('no_structured_event_link',0)} | 优先核对是否被遗漏或有证据应不收录 |","",
       "## 原162组合并组连接程度","",
       "| 等级 | 数量 |","|---|---:|",
       f"| 至少一条Atlas事件显式关联合并组 | {grp.get('event_group_link',0)} |",
       f"| 仅数据集声明提及 | {grp.get('dataset_provenance_only',0)} |",
       f"| 完全未发现结构化年代事件关联 | {grp.get('no_structured_chronology_link',0)} |","",
       "## 优先审查的未映射合并组","",
       "| 组合 | 年份 | 优先主图候审 | 合并组总候审 | 史料/地理处理 |","|---|---|---:|---:|---|"]
    for g in report["selected_group_priorities"][:40]:
        period=f"{g['start_year']}—{g['end_year']}" if g["start_year"]!=g["end_year"] else str(g["start_year"])
        s.append(f"| {g['id']}：{g['title'].replace('|','／')} | {period} | {g['main_candidate_count']} | {g['original_candidate_count']} | {g['status']} |")
    s.extend(["",
       "## 必须单独复核的16条年代／史实延期条目","",
       "| 原研究ID | 年份 | 弧线 | 原候审标题 |","|---|---:|---|---|"])
    for r in report["deferred_16_originals"]:
        s.append(f"| {r['original_id']} | {r['year']} | {r['arc']} | {r['original_title'].replace('|','／')} |")
    s.extend(["","## 正确使用审计结果","",
       "1. 对每一条标为未映射或仅metadata的原始候审，先检查既有中文正文是否已有描述，再读取机构/一手文献，明确行动者、真实日期和受害者立场。",
       "2. 只有已核日期、可信地点并通过现有测试的具体史实才能进入研究预览地图；**没有精确GIS的地点保持null，边界无据不画Polygon**。",
       "3. 除了原始合并组，不凭算法把原始候审重复拆分成多个'新事件'，不同时间点要有独立史料。任何从档案推演的利润、死亡人数、土地面积一律保持null。",
       "4. `research/18c/consolidated/`原始1126项、162合并组和ZIP是不可变基准；逐条机器审计清单见GitHub Actions artifact输出`all-1126-coverage.json`和`all-1126-coverage.csv`。",
       "",
       f"校验：`python3 scripts/audit_18c_1126_coverage.py --out-dir /tmp/18c1126-audit`。归档ZIP SHA256：`{report['source_of_truth']['zip_sha256']}`。",
       ""])
    return "\n".join(s)

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out-dir",default="18c-coverage-audit-results")
    p=parser.parse_args();out=ROOT/p.out_dir if not pathlib.Path(p.out_dir).is_absolute() else pathlib.Path(p.out_dir)
    out.mkdir(parents=True,exist_ok=True)
    report=audit()
    (out/"all-1126-coverage.json").write_text(pretty(report),encoding="utf-8")
    with (out/"all-1126-coverage.csv").open("w",encoding="utf-8-sig",newline="") as f:
        writer=csv.DictWriter(f,fieldnames=CSV_COLS);writer.writeheader()
        for r in report["all_1126_originals"]:
            writer.writerow({k:";".join(v) if isinstance(v,list) else v for k,v in r.items() if k in CSV_COLS})
    (out/"EDITOR20_18C_1126_STRUCTURED_COVERAGE_REPORT.md").write_text(to_md(report),encoding="utf-8")
    stats=report["coverage"]
    print("PASS 1126 ORIGINALS:",report["totals"])
    print("PASS 315 SELECTED MAPPING:",stats["selected_candidate_status"])
    print("PASS 162 MERGED GROUPS:",stats["group_status"])
    print("PRIORITY UNMAPPED GROUPS:",json.dumps([{k:x[k] for k in ("id","arc","status","main_candidate_count","original_candidate_count","title")} for x in report["selected_group_priorities"][:18]],ensure_ascii=False))
    print("PASS 16 CHRONOLOGY DEFERRED:",",".join(r["original_id"] for r in report["deferred_16_originals"]))
