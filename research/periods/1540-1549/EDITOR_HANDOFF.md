# 主编接手｜第六章1540—1549年地图与事件（已在独立Git分支保存）

分支：`research/territorial-1540-1549-20261013`。参考上一章研究`research/territorial-1530-1539-20261013` / PR #25。当前所有文件**仅供审稿，不直接修改网站**。

## 立即整合顺序

1. **时间与政治底座**：先读`CONTROL_TRANSITION_1539_1549.json`。上年9项政治身份不重置（包括PR #25补录的根西以及独立苏格兰）：加来、吉讷、都柏林、泽西、马恩、奥克尼、设得兰及**独立苏格兰**。仍属法国的图尔奈1519已退出英王控制，1540年代禁止恢复英占。
2. **区域地图先画**：`MAP_REFERENCE_OUTLINES_1540_1549.geojson`继承前期8个不精确地理外壳，另外10个地区/要塞纯示意虚线范围。所有Feature均`historical_boundary_confirmed:false`、`fill_authorized:false`。实际历史统治的城市和堡垒用**Point像素面积符号**，不是这些虚线圈声称的历史辖区；不能直接纳入`colonial_polygons`。
3. **按年份显示真实占领城市/堡垒**：`ACTIVE_CONTROL_PLACES_1540_1549.geojson` 22地点每条有`year_end_start`、`year_end_stop`：
    - Boulogne 1544年9月13日英军取得—1549年末仍在占领
    - Ambleteuse 英军要塞 **1546—1548年末活跃，1549年8月25日法军收复**；不能把约1680年的Vauban堡垒当1546古堡
    - Boulemberg / Mont Lambert 英军炮台 **1546—1548年末活跃，1549年撤离**；现代山地居民点并非有测绘证据的1546炮台墙线
    - Broughty 1547—1549
    - Eyemouth 1547—1549
    - Inchcolm **1547年末活跃；1548年3月已撤离**
    - Haddington **1548年末活跃；1549撤离**
    - Lauder 1548—1549
    - Lochmaben Castle **1544年英军占领，1545年由苏格兰收复**：1545年末必须退出英占点
    - 东洛锡安Dunglass **1548—1549年英军营垒**：遗产登记现代坐标与真正山岗营垒有位置差，画概略点
    - Hume Castle **1547年9月22日被英军占领、1548年12月被苏格兰收复**：1548年末英军地图必须退出
    - Boulogne的Tour d'Ordre旧灯塔周围英军要塞 **1544年11月开始建设，1549年末仍占据**，历史海崖已侵蚀，概略地点不是真古界
    - Forthill **1548—1549年另有英军山顶要塞**，与Broughty Castle不同；现代Forthill街区中心为参考位置，1550年拆除
    - Guernsey **是PR #25新增独立政治地点但历史早已存在**，1540年继承，非本年新征服
    - Hailes **仅1548年获确证，1549存续未知**，不得自动画实色确定占领，也不得捏造撤军日期。
4. **苏格兰持续独立**：布劳蒂等英军堡垒只占据城市/城堡和附近要塞；仍在苏格兰王国政治版图内部。亲英苏格兰领主效忠、assurance不自动证明臣服的土地被英王直接行政接管。
**新增法国抵抗底图：**`FRENCH_COUNTERFORTS_1540_1549.geojson` 1处Outreau法国炮台，法国军队1545年进驻高地并筑堡，绝不归入英王占领层。法军Outreau、英王Boulogne及Odre/Ambleteuse/Mont Lambert等节点间的资料网络在`BOULOGNE_FORT_NETWORK_1544_1549.json`；所有线均为文献拓扑关系，没有已核实舰船轨迹。不同颜色显示法英战线，避免整个Outreau染殖民橙。
5. **爱尔兰法律主张与实控分开**：1541王室称号、1543 Thomond/Clanricarde授爵不能扩大都柏林实际Pale控制区到爱尔兰全岛。另请调用`IRISH_EFFECTIVE_CONTROL_RELATIONS_1540_1549.json`：1542 Conn O'Neill（Tyrone）名义授爵、1543 O'Brien（Thomond）与Burke（Clanricarde）封爵，以及1546王室进入O'Connor/O'More中部，分别区分封建称号、地方治理和军事入侵。可能的征服/间接藩属土地，应根据逐地方领主/驻军证据以虚线或纹理附属类型绘画。
6. **财政独立专题**：`FINANCIAL_EVIDENCE.json`保留1545年英国内部战事税源估计£119,581，1549年国王陈述继承债务**超过**£300,000；两者都不是布洛涅的殖民经济净收益。本轮新增Hume保存机构描述的英军修城费用£700（未经原始财政账本审核）；英王布洛涅军管剥夺低城民房和修士建筑（金额null）、1546人口上限5000是法令政策而非驱逐人数。无核定数字保持null。
7. **事件层按年揭示**：复制审核合适的`ATLAS_REVIEW_CANDIDATE.json`中45条事件，不要在1540年加载本十年所有事件。其中26条事件具有现代地点参考坐标，不足以画古国界；原`app.js`的视角/比例、左侧详情和双击定位高亮必须保留。
8. **自测**：在仓库根目录执行`python3 research/periods/1540-1549/validate_research.py`；正式网站需由主编执行浏览器验收，尤其年份**1546阿姆布勒特斯与Boulemberg新增、1548→1549两处外围炮台失去、1547→1548因奇科姆退出**、**1548→1549哈丁顿退出**、**1549→1550布洛涅等归还的下一章研究**。

## 额外制图线索

- **布洛涅**：Murphy, `The Tudor Occupation of Boulogne` (2019), chapters 3–5，提及精确测绘、财政、居民定居。BL `Cotton Augustus I ii 75/77`地图档案线索先查史地图年代及许可证后可提升轮廓精度。
- **法国沿海**：Pierre Héliot, *Revue du Nord* 40(157) 1958, 5–38（Persée开放可见论文）确认John Rogers负责的Ambleteuse堡垒1546年4月开工、Mont Lambert炮台1546年5月开工；阿姆布勒特斯市镇官方史进一步确认1549年8月24—25日法军夺取城堡，Héliot记录其后Boulemberg英军撤离。Royal Collection Trust [RCIN 721017](https://militarymaps.rct.uk/other-16th-century-conflicts/view-of-boulogne-1549-boulogne-nord-pas-de-calais-france-50deg4300n-01deg3700e) 提供1549历史军事图对应线索；它并非可直接授权重绘的完整疆域测绘图。
- **埃茅斯**：NLS官方图史记录1547英军原测绘图；Caldwell/Ewart考古论文，Site SM4577。现代200米级定位已提供，不应把1557法国重建形状当成1547英王堡墙。
- **洛赫马本与Dunglass**：苏格兰历史环境局核定Lochmaben Castle 1544年攻取、1545年由苏军收复（Trove NRHE 66315，不要误用Nearby Old Castle 66314）；Dunglass GDL00154记载1548—1549营垒，地点在东洛锡安而非西邓巴顿郡同名城堡。
- **哈丁顿**：HES官方说明1548围困、1549后撤，必须以城堡Point标记英军，据此不能称全东洛锡安英王直辖；Hailes/Lauder是不同权限的基地。
- **海岛及苏格兰**：之前继承形状为现代海岸线，不是1539/1549原始调查；岛屿政治关系层不能随英军短期基地而变成英格兰属地整岛永久权力。

来源账单`SOURCE_REGISTRY.json`与`ARCHIVAL_ACTION_QUEUE.json`提供逐条下钻。每一步若升级古边界，必须保存原始研究图来源、地名对照、适用年份和审核等级。

## 1550年代接棒

[TRANSITION_1549_1550_RESEARCH_SEED.json](TRANSITION_1549_1550_RESEARCH_SEED.json)已逐条继承1549年活跃地点与不确定Hailes，尤其Boulogne、Broughty、Eyemouth、Lauder、Dunglass的历史退出；**Ambleteuse和Boulemberg已于1549退出，不可放入1550年的英军活跃据点**，以及Lochmaben已于1545年结束的短期英占。下一位调查员应核实际1550日期再画，不能提前在1549擦除，也不能误判1550年全部仍在英王手中。

**独立预览**：[interactive_research_preview.html](interactive_research_preview.html)，克隆仓库后在根目录运行`python3 -m http.server 8000`，用浏览器访问`/research/periods/1540-1549/interactive_research_preview.html`。这是调查工作预览，不是主站部署。

## 收尾检查已设为低成本

史料足够的两处英军法国外堡已经补齐：在 `CONTROL_TRANSITION_1539_1549.json`、`ACTIVE_CONTROL_PLACES_1540_1549.geojson`、`MAP_REFERENCE_OUTLINES_1540_1549.geojson`、`MAP_DELTA_1540_1549.geojson` 与 `ATLAS_REVIEW_CANDIDATE.json` 中同步了年份。`validate_research.py` 已写入1549年必须清除两处英占的硬性校验。

**本仓库1540年代独立研究工作流设置为手动触发，遵守原维护人员避免频繁失败邮件的安排，不擅自重新打开自动定时/Push检查。** 主编本地可运行 Python 验证；史料地图准确性仍需编辑审核，不能将代码结构通过当作史学原档验收。原图/城墙高精度尚未查得时保持虚线即可，**不作为本章发布阻塞项**。

## PR #27新一轮深挖交接（2026-10-13）

**请按 [DEEPENING_1540S_20261013.md](DEEPENING_1540S_20261013.md) 的表逐年上图。** 保存了Hume 1547→1548、Tour d'Ordre 1544→1549、Forthill 1548→1549、法军Outreau 1545→1549（与英军层独立）、根西1539→1549制度延续。新增11条按史料年份出现的军事、政治、强制迁居史事。总量已达69来源、45历史事件、22政治/要塞Point、18虚线位置参考、21控制变化Delta、15个控制Episode，0实测历史领土Polygon。原有Calais及英国海岛古界原样继承；主编勿因现代堡垒城墙和保护地Polygon已有现成坐标就把它们当1540年代疆域。

**当前分支自动化限制**：1540年代研究工作流维持手动触发，无擅自恢复自动搜索。新数据已从GitHub回读并独立检查关联ID、年度续存和英法敌对据点归属，但尚需主编浏览器人工验收，并不声称已取得16世纪原图全套审核。
