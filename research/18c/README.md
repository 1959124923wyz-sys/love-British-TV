# 18世纪研究目录（1700—1799）

当前状态：**研究进行中，不在正式地图发表。** 依照 [AGENTS](../../AGENTS.md)、[16世纪专题/地图范例纲领](../../docs/templates/16c-story-map-standard/README.md)、[跨十年承接](../../docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md) 和[历史空间图层审查](../../docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md) 分批调查。

## 2026-11-08三位助手初筛
- [35个长篇系列与1126条原始候审记录分类汇总](INITIAL_TRIAGE_20261108.json)；[中文编辑原则与审核结论](../../docs/research/EDITOR_18C_INITIAL_TRIAGE_20261108.md)。原始1126条逐行分类与ZIP、Excel在对应对话附件中保存，尚未进入正式地图。

## 2026-11-08合并事件交接
- [可直接供地图编辑同事使用的合并后研究包](consolidated/README.md)：315条精选记录整为162组合并候审事件，含完整ZIP、315映射、1126去向与35个系列文件；每个组仍需历史、空间和时序核验才能发布。

## 第三批18世纪地图试阅（2026-11-08）
- [牙买加马龙长期抵抗、奴役法和1796放逐地图交接](../../docs/research/EDITOR_18C_JAMAICA_MAROON_MAP_20261108.md)：17候审事件、16节专题、5个现代具名事件点、2个马龙政治自主参考点。仅供独立分支`?review18c=1`使用。
- 前两批阿卡迪亚、孟加拉候审专题均保持，当前18世纪试阅共3条独立历史主线；正式地图未更新。

## 研究入口
- [105项专题母题与结构化ID](MAJOR_TOPICS.json) — 全部`research_only`。
- [88条机构/学术资料登记与阅读层级](SOURCE_REGISTRY.json) — 含原始文献目录，但**未将目录当逐页原卷**。
- [正式主编总清单与实证界限](../../docs/research/EDITOR_18C_MASTER_RESEARCH_20261105.md)。
- [36篇17世纪全部专题跨世纪承接总表](CROSS_CENTURY_STORY_CONTINUITY.json)（29篇已发表、7个研究母题；区别真正跨年行动、制度延续、历史后果及已结束系列）。
- [10件有来源的新世纪事件候审资料](CROSS_CENTURY_REVIEW_EVENTS.json)（全部为空坐标、未正式上图）。
- [跨世纪核查方法与达连1700等重点证据报告](../../docs/research/EDITOR_18C_17C_LONG_SERIES_HANDOFF_20261106.md)。
- [1699→1700连续性研究种子](TRANSITION_1699_1700_RESEARCH_SEED.json) — 27个17世纪末已显示的**法理/地理示意形**逐项待核；不是27个已证实国土。
- [工作进度及审计分流](PROGRESS.md)、[下一轮交接](HANDOFF_20261105.md)。
- [第一批阿卡迪亚专题证据矩阵](../../docs/research/EDITOR_18C_ACADIAN_1755_CASE_20261105.md)（已完成研究候审）。
- [第一批非出版地图候审点位](ACADIAN_REVIEW_POINTS.geojson)（14处已录入）；[候审史事](ACADIAN_REVIEW_EVENTS.json)（18件）与[专题完整初稿](ACADIAN_REVIEW_STORY.json)（10节，18个候审锚点）。

## 状态与出版
母题列表只是研究问题。候审事件上图必须是原始机构文献可支持的真实发生年份、具名行动与参考地点。现代纪念遗址GPS只是位置参照，不是1755年精确拘留建筑；此项目不绘制未经实测的“全阿卡迪亚驱逐面积”。跨17/18世纪既有控制关系须承接，不因年表截断便错误结束。

正式 `data/chapters.json` 和主站依然只正式发布1497—1599章节与现有17世纪专题；本研究分支绝不自动改写 `main`、`data/atlas-1700-1709.json` 或任何生产图层。要新增18世纪正式地图，须先编制1700年末持续性台账，按年份对十年章节生成经核对Atlas，通过Node/Chromium和严格GIS审计之后才合并。
