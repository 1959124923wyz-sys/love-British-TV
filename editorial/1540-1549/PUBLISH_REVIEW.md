# 第六章正式出版审核｜1540—1549

2026-10-13 · 主编3 · PR #27研究成果独立选择性接入

## 出版准入与实际边界

- 审核来源：调查分支 `research/territorial-1540-1549-20261013`，以 `ATLAS_REVIEW_CANDIDATE.json`、`CONTROL_TRANSITION_1539_1549.json`、`ACTIVE_CONTROL_PLACES_1540_1549.geojson`、`FRENCH_COUNTERFORTS_1540_1549.geojson` 和 `SOURCE_REGISTRY.json`为准。研究PR本身保持开放，用户允许调查员继续补齐。
- 正式出版文件：`data/atlas-1540-1549.json`：45条逐年事件、23处历史政治/军事地点（研究原22处政治／控制Point，加法军Outreau1处）、65项在Atlas中直接引用的来源，26项事件有现代地点参考坐标、19项没有准确地点而仅在史料列表呈现。研究来源总索引69项。
- 持续参考区域：原七片`territorial-footprints`几何全部不变，受支持的持续关系只把时间延续到1549；加来、吉讷具名城市控制Point和泽西／根西／马恩／独立苏格兰群岛特殊关系Point同步延伸。
- 军事图：`data/military-control-points-1540-1549.geojson`保留14处1540年代英军本地驻城／要塞Point和单列法国Outreau对抗堡垒Point，不使用研究分支的现代市镇“示意圆圈Polygon”冒充1540年代古测绘边线。年末状态以GIS属性`year_end_start/year_end_stop`与候审政治据点一致，现无可证新增历史确界Polygon。
- 拟制金额、1545英国内部税务、1549英王债务声明不得当作占领地殖民净利润；财政账目未获实证时页面不制造总额。
- 研究事件`date_label`中未加工的`year`统一换为中文读者可识别的年份；正式分类保留`research_category`以核查政治治理、占领／撤军、抵抗、经济财政事实差别。研究事件原ID全部保留。
- 既有英苏战争、爱尔兰地方政体、主权声索和实际统治严格分开。局部英军驻城不能改变苏格兰独立主权或把爱尔兰王国称号转成整个爱尔兰英国直辖疆界。

## 年度地图核验门槛

| 年末 | 英军本地战时据点数 | 法军Outreau防御点 | 关键操作 |
|---|---:|---:|---|
| 1540 | 0 | 0 | 旧政治身份和七片参考地区连续 |
| 1544 | 3 | 0 | 布洛涅、洛赫马本及Odre据点按资料出现 |
| 1545 | 2 | 1 | 洛赫马本退出；法国Outreau独立出现 |
| 1546 | 4 | 1 | Ambleteuse／Boulemberg英军据点出现 |
| 1547 | 8 | 1 | Broughty／Eyemouth／Inchcolm／Hume加入 |
| 1548 | 11 | 1 | Inchcolm、Hume退出，Haddington、Lauder等驻点加入 |
| 1549 | 7 | 1 | Ambleteuse／Boulemberg／Haddington退出，Boulogne城市仍被英军控制；Hailes未证实持续 |

**地理准确度**：现代城堡、海崖遗迹、街区坐标都只作Point参考，不得绘制为可测量1540年代英王领土。地图点面积固定在屏幕像素，绝不是古时受控公顷。

## 缺漏交给调查员

详细问题、19项未定位事件、22条研究行动、1550交接问题与档案验收规范请读 [RESEARCH_GAPS_TO_PR27.md](RESEARCH_GAPS_TO_PR27.md)。主编不修改PR #27原研究文件，新增史料由调查员在自己的分支提交后再次审核。

## 发布过程

独立主编分支`editorial/publish-chapter6-1540-1549-20261013` → 第六章数据／GIS → Node及Python时空审计 → Chromium年份、据点与旧功能浏览器回归 → 审核PR → 合并main → GitHub Pages完成。任何步骤若失败不能声称“已上线”。

设计兼容：正式v0.9聚合子图标、2026-10-13 v1.6.1半世纪五章翻页、地图不因年份改变视角、资料抽屉不随章节切换自动关闭。1540年代此时是1500—1549上半世纪第5个十年槽位，1550年代仍为未出版目录。
