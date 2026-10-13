# 主编接手｜第六章1540—1549年地图与事件（已在独立Git分支保存）

分支：`research/territorial-1540-1549-20261013`。参考上一章研究`research/territorial-1530-1539-20261013` / PR #25。当前所有文件**仅供审稿，不直接修改网站**。

## 立即整合顺序

1. **时间与政治底座**：先读`CONTROL_TRANSITION_1539_1549.json`。上年8个政治身份不重置：加来、吉讷、都柏林、泽西、马恩、奥克尼、设得兰及**独立苏格兰**。仍属法国的图尔奈1519已退出英王控制，1540年代禁止恢复英占。
2. **区域地图先画**：`MAP_REFERENCE_OUTLINES_1540_1549.geojson`继承前期8个不精确地理外壳，另外5个地区/要塞纯示意虚线范围。所有Feature均`historical_boundary_confirmed:false`、`fill_authorized:false`。实际历史统治的城市和堡垒用**Point像素面积符号**，不是这些虚线圈声称的历史辖区；不能直接纳入`colonial_polygons`。
3. **按年份显示真实占领城市/堡垒**：`ACTIVE_CONTROL_PLACES_1540_1549.geojson` 16地点每条有`year_end_start`、`year_end_stop`：
    - Boulogne 1544—1549
    - Broughty 1547—1549
    - Eyemouth 1547—1549
    - Inchcolm **1547年末活跃；1548年3月已撤离**
    - Haddington **1548年末活跃；1549撤离**
    - Lauder 1548—1549
    - Lochmaben Castle **1544年英军占领，1545年由苏格兰收复**：1545年末必须退出英占点
    - 东洛锡安Dunglass **1548—1549年英军营垒**：遗产登记现代坐标与真正山岗营垒有位置差，画概略点
    - Hailes **仅1548年获确证，1549存续未知**，不得自动画实色确定占领，也不得捏造撤军日期。
4. **苏格兰持续独立**：布劳蒂等英军堡垒只占据城市/城堡和附近要塞；仍在苏格兰王国政治版图内部。亲英苏格兰领主效忠、assurance不自动证明臣服的土地被英王直接行政接管。
5. **爱尔兰法律主张与实控分开**：1541王室称号、1543 Thomond/Clanricarde授爵不能扩大都柏林实际Pale控制区到爱尔兰全岛。可能的征服/间接藩属土地，应根据逐地方领主/驻军证据以虚线或纹理附属类型绘画。
6. **财政独立专题**：`FINANCIAL_EVIDENCE.json`保留1545年英国内部战事税源估计£119,581，1549年国王陈述继承债务**超过**£300,000；两者都不是布洛涅的殖民经济净收益。无核定数字保持null。
7. **事件层按年揭示**：复制审核合适的`ATLAS_REVIEW_CANDIDATE.json`中30条事件，不要在1540年加载本十年所有事件。其中18条事件具有现代地点参考坐标，不足以画古国界；原`app.js`的视角/比例、左侧详情和双击定位高亮必须保留。
8. **自测**：在仓库根目录执行`python3 research/periods/1540-1549/validate_research.py`；正式网站需由主编执行浏览器验收，尤其年份**1547→1548因奇科姆退出**、**1548→1549哈丁顿退出**、**1549→1550布洛涅等归还的下一章研究**。

## 额外制图线索

- **布洛涅**：Murphy, `The Tudor Occupation of Boulogne` (2019), chapters 3–5，提及精确测绘、财政、居民定居。BL `Cotton Augustus I ii 75/77`地图档案线索先查史地图年代及许可证后可提升轮廓精度。
- **埃茅斯**：NLS官方图史记录1547英军原测绘图；Caldwell/Ewart考古论文，Site SM4577。现代200米级定位已提供，不应把1557法国重建形状当成1547英王堡墙。
- **洛赫马本与Dunglass**：苏格兰历史环境局核定Lochmaben Castle 1544年攻取、1545年由苏军收复（Trove NRHE 66315，不要误用Nearby Old Castle 66314）；Dunglass GDL00154记载1548—1549营垒，地点在东洛锡安而非西邓巴顿郡同名城堡。
- **哈丁顿**：HES官方说明1548围困、1549后撤，必须以城堡Point标记英军，据此不能称全东洛锡安英王直辖；Hailes/Lauder是不同权限的基地。
- **海岛及苏格兰**：之前继承形状为现代海岸线，不是1539/1549原始调查；岛屿政治关系层不能随英军短期基地而变成英格兰属地整岛永久权力。

来源账单`SOURCE_REGISTRY.json`与`ARCHIVAL_ACTION_QUEUE.json`提供逐条下钻。每一步若升级古边界，必须保存原始研究图来源、地名对照、适用年份和审核等级。

## 1550年代接棒

[TRANSITION_1549_1550_RESEARCH_SEED.json](TRANSITION_1549_1550_RESEARCH_SEED.json)已逐条继承1549年活跃地点与不确定Hailes，尤其Boulogne、Broughty、Eyemouth、Lauder、Dunglass的历史退出，以及Lochmaben已于1545年结束的短期英占。下一位调查员应核实际1550日期再画，不能提前在1549擦除，也不能误判1550年全部仍在英王手中。

**独立预览**：[interactive_research_preview.html](interactive_research_preview.html)，克隆仓库后在根目录运行`python3 -m http.server 8000`，用浏览器访问`/research/periods/1540-1549/interactive_research_preview.html`。这是调查工作预览，不是主站部署。
