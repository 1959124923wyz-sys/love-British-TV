#!/usr/bin/env python3
"""Atlas46: broad, reproducible audit of map/editorial notes across the Git tree.
Report findings rather than deleting source research. Requires Python stdlib only.
"""
from __future__ import annotations
import collections
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "browser-smoke-results"
OUT.mkdir(exist_ok=True)
IGNORE = {".git", "node_modules", "__pycache__", "browser-smoke-results"}
EXTS = {".json", ".geojson", ".html", ".js", ".css", ".md", ".txt", ".yaml", ".yml"}
# Intentionally expansive: many findings are conservative false positives. Keep
# categories distinct; original provenance/precision stays in the archived data.
RULES = {
 "虚线、线框与色块": r"虚线|虚框|实线|点划线|轮廓|示意区块|色块|填色|示意框|参考框|矩形|包络|buffer|bbox",
 "未核边界、几何与坐标": r"未配准|未经.{0,10}(?:配准|测绘|实测)|非.{0,8}(?:实测|历史边界|精确|精准|地籍)|经纬度|地理精度|地理参考|近似位置|代表性位置|现代坐标|参考坐标|未实测|边界.{0,12}(?:示意|近似|配准)",
 "控制、主权及占地提醒": r"不.{0,4}(?:代表|等于|意味着|构成|表示|推定).{0,28}(?:控制|占领|统治|主权|领土|驻军|占地)|非.{0,15}(?:英国|英方).{0,15}(?:主权|领土|控制)|(?:河两岸|贸易通道|河道).{0,22}(?:主权|实控)|(?:控制|主权|领土).{0,12}(?:不等于|未必|不能)",
 "计算面积与重叠限制": r"不可.{0,18}(?:面积|叠加|合计|占地)|不能.{0,18}(?:面积|叠加|计算|合计|统计)|不.{0,5}(?:累计|叠加|相加|计入)|面积.{0,12}(?:不可|不能|不得|不代表|仅供|参考)|平方公里|area_sqkm",
 "读者编辑提示": r"本地图|原地图|地图仅|图上|图中|读者|研究预览|研究试阅|候审版图|未审版图|未发表|待核|仅供参考|只作定位|仅作示意|展示.{0,12}(?:示意|参考)|地图.{0,15}(?:示意|参考|概略)",
 "学术式限定语": r"不应.{0,25}(?:推|当作|解读)|不得.{0,30}(?:解释|推|视作|按)|并非.{0,20}(?:整个|全部|精准|实际|主权)|无法.{0,10}(?:据此|证明|推定)|概略|仅代表|不能据此|不等于.{0,20}(?:治理|占领|主权|面积)"
}
REGEX={k:re.compile(v,re.I) for k,v in RULES.items()}
SENTENCE=re.compile(r"[。；;！？!？\n]+")
FINDINGS=[]
files_scanned=0
def track(path,locator,content,field_kind):
 for raw in SENTENCE.split(str(content)):
  text=raw.strip()
  if not text: continue
  matched=[k for k,regex in REGEX.items() if regex.search(text)]
  if not matched: continue
  if len(text)>260: text=text[:255]+"…"
  FINDINGS.append({"file":path,"where":locator,"type":field_kind,
                   "groups":matched,"text":text})
def visit(node,path,locator):
 if isinstance(node,dict):
  for key,value in node.items():
   visit(value,path,locator+"."+str(key))
 elif isinstance(node,list):
  for i,value in enumerate(node):
   visit(value,path,locator+"["+str(i)+"]")
 elif isinstance(node,str):
  key=locator.split(".")[-1]
  kind=("public-data" if re.search(r"(?:note|summary|description|title|label|caption|tooltip|public|name)",key,re.I)
        else "archive-metadata")
  track(path,locator,node,kind)
for fp in ROOT.rglob("*"):
 if not fp.is_file() or any(part in IGNORE for part in fp.relative_to(ROOT).parts) or fp.suffix.lower() not in EXTS:
  continue
 relative=fp.relative_to(ROOT).as_posix()
 try:
  raw=fp.read_text(encoding="utf-8")
 except (UnicodeDecodeError,OSError):
  continue
 files_scanned+=1
 if fp.suffix.lower() in (".json",".geojson"):
  try: visit(json.loads(raw),relative,"$")
  except (ValueError,RecursionError):
   for n,line in enumerate(raw.splitlines(),1): track(relative,str(n),line,"unparsed-text")
 else:
  for n,line in enumerate(raw.splitlines(),1): track(relative,str(n),line,"source-text")
group_count=collections.Counter(k for item in FINDINGS for k in item["groups"])
byfile=collections.Counter(item["file"] for item in FINDINGS)
bytype=collections.Counter(item["type"] for item in FINDINGS)
public=[x for x in FINDINGS if x["type"]=="public-data" or x["file"].startswith(("js/","css/")) or x["file"] in ("app.js","index.html","style.css")]
stats={
 "files_scanned":files_scanned,
 "all_candidate_snippets":len(FINDINGS),
 "candidate_public_fields_or_frontend_source":len(public),
 "by_type":dict(bytype),
 "by_group":dict(group_count),
 "files_with_hits":len(byfile),
 "top_files":byfile.most_common(70)
}
(OUT/"atlas46-editorial-copy-audit.json").write_text(json.dumps({"stats":stats,"findings":FINDINGS},ensure_ascii=False,indent=2),encoding="utf-8")
md=["# 第46批 全仓疑似制图／编审提示审计","",f"- 扫描文本文件：{files_scanned}",
 f"- 全仓广义候选片段：{len(FINDINGS)}",f"- 读者候选数据字段／前端源码：{len(public)}",
 f"- 涉及文件：{len(byfile)}","",
 "## 分类（同一片段可命中多个分类）"]
md.extend(f"- {name}：{count}" for name,count in group_count.most_common())
md+=["","## 命中最多的文件"]
md.extend(f"- {count}　`{p}`" for p,count in byfile.most_common(80))
md+=["","## 读者候选字段／前端源代码部分实例（优先复查）",""]
for x in public[:300]:
 md.append(f"- `{x['file']}:{x['where']}` [{','.join(x['groups'])}] {x['text']}")
(OUT/"atlas46-editorial-copy-audit.md").write_text("\n".join(md),encoding="utf-8")
print("ATLAS46_AUDIT_STATS="+json.dumps(stats,ensure_ascii=False))
for rec in public[:65]:
 print("ATLAS46_PUBLIC_EXAMPLE="+json.dumps(rec,ensure_ascii=False))
