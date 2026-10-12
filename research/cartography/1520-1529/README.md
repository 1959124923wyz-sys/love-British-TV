# 爱英TV｜1520—1529年历史地理与主编候审包

**用途：** 将调查1在PR #8的史料、PR #9的候选事件与PR #10的疆域连续性，整理为可直接用于第四章地图审核的独立地理数据。**当前均为研究候审，未修改主站 `main` 或GitHub Pages。**

**本期制图结论：** 加来/吉讷仍属英王控制的边境据点；都柏林是英王爱尔兰有限行政核心；根西、泽西是特殊王室属地，马恩是有自治权的领主制度；奥克尼/设得兰属于**独立苏格兰王国**。图尔奈已于1519年2月交还法国。1522–23年袭击、1521年局部城堡进驻和1527年北美远航，不构成有证据的新殖民省份。

| 首读文件 | 直接用途 |
| --- | --- |
| [EDITOR_HANDOFF.md](EDITOR_HANDOFF.md) | 主编最短接入步骤、实际地图效果和不能误用的界线 |
| [ATLAS_EDITOR_CANDIDATE_1520_1529.json](ATLAS_EDITOR_CANDIDATE_1520_1529.json) | 24事件、7政治地点、49条直接来源，均为审稿候选 |
| [APPROXIMATE_REFERENCE_OUTLINES_1520_1529.geojson](APPROXIMATE_REFERENCE_OUTLINES_1520_1529.geojson) | 7处概略范围：加来Pale和爱尔兰Pale使用虚线，5处海岛按不同政治制度显示纹理参考 |
| [CONTROL_CORES_1520_1529.geojson](CONTROL_CORES_1520_1529.geojson) | 加来、既有吉讷和都柏林3处城市/行政核心，**Point符号，不是实测占领区域** |
| [EVENT_SITES_1520_1529.geojson](EVENT_SITES_1520_1529.geojson) | 10个可追溯的现代遗址/城镇参考地点，可设为二级可选层 |
| [CONTROL_CHANGE_1520_1529.geojson](CONTROL_CHANGE_1520_1529.geojson) | 5条时间明确的控制或军事地理变化说明，0个虚构占领polygon |
| [CONTROL_TRANSITION_1519_1529.json](CONTROL_TRANSITION_1519_1529.json) | 1519七地点全量交代、1520—1529十份年度快照、1530研究接棒 |
| [SOURCE_PROVENANCE_INDEX.json](SOURCE_PROVENANCE_INDEX.json) | 合并研究原54条、地理23条、编辑49条以及本轮8条的**76个去重source ID**；部分旧source ID仍需补齐原始目录 |
| [SOURCES_AND_CARTOGRAPHIC_LIMITS.json](SOURCES_AND_CARTOGRAPHIC_LIMITS.json) | 8个历史地理研究入口、3组原档目录与文献适用年代/版权边界 |
| [interactive_map_preview.html](interactive_map_preview.html) | 独立Leaflet预览；同年历史事件逐步出现，切换年份保持地图视角 |
| [validate_cartography.py](validate_cartography.py) | 研究数据完整性与跨十年地图继承自测 |

## 边界必须怎么画

**有真实古地籍/军政管辖图且经核的控制Polygon：本次0个。** 不能为了有图而捏造准确边界。现有加来/爱尔兰Pale几何来自前期已存档地名包络，1520年代仅用**虚线、轻填色**展示大致位置；岛屿采用现代海岸线作为位置参考且保留异于英王直接统治的类别；已核的城市核心可以在具名地点绘制**小型实色面积符号**，像素半径不是土地面积。显示权属不代表这一外壳每一平方米都被史实确认为英军实际控制。

新标记 Guînes 为**既有英王据点新单列**，不是1520年新征服。1521–26 Newenhambridge 为已有设施加强；Monasteroris长期驻军日期不明，不能涂满今天的Offaly。1520英属Guînes与法属Ardres之间的中立外交会面不能被填成英属领土。

## 下一年度研究

1529年末持续关系已经逐项递交给1530年代，但**未宣称1530年的控制已经审定**。后续优先核：TNA E315/371–372（1556测量，不可直接反推1520）、Pas-de-Calais CPL1414的原图年代与许可、吉讷1529法令实施地区、爱尔兰Pale的当期行政边界和Monasteroris撤军。所有进一步结论必须更新来源、年限与GeoJSON后再发布。

## 工程与权限

研究分支可以增补资料，主编决定发布内容并维护正式 UI；本期不直接覆盖`app.js`、`index.html`或`data/`。预览在GitHub Pages/raw.githack之类HTTP环境可尝试，不要以本地 `file://`运行。
