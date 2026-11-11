# 爱英TV｜第七章（1550—1559）独立史料与地图研究

**研究分支** `research/territorial-1550-1559-20261013` · **草稿审稿 PR #33**：<https://github.com/1959124923wyz-sys/love-British-TV/pull/33>。承接第六章PR #27的`TRANSITION_1549_1550_RESEARCH_SEED.json`。本目录不等同网站已上线。

## 主要变迁与地图判断

- **1550年**：布洛涅1550年3月24日归还条约，**4月25日法国实际进城接收**；苏格兰法苏军1550年收复布劳蒂堡垒，Forthill英国炮垒当年拆除。这些地方英军驻守在**1550年末消失**，政治和地理地点并不消失。Eyemouth、Lauder、Dunglass、Hailes有关英军退出的具体年月尚未足证，不用橙色虚构续驻。
- **1556年**：英王殖民爱尔兰莱伊什（Queen’s County）及奥法利（King’s County）法定郡与土地没收、移民安置；同名行政郡**不是已经确证实际英占的现代全郡**。两个军堡Fort Governor（1546已有）、Fort Protector（1547–48已有）用Point表示真实较小据点，领主抵抗保留在事件层。
- **1558年**：法国夺取英占加来（历史常用1月7日）与吉讷（1月，确切日期待核）；现代地标Risban／Nieulay等作为1558法方城防地理参考；加来旧Pale虚线范围**改法国控制类型**，不能在1558后继续橙色。
- **1559年**：英法4月2日和约规定法国继续实际占加来，可能未来归还的8年期限≠1559英军重占。50万金埃居仅为约定保证条件。
- **非洲与俄罗斯**：1555年John Lok自几内亚带回5名遭奴役者。1553白海Chancellor航次及1555莫斯科公司英国特许，1555—57 Towerson西非贸易，**均不意味着俄国、西非和葡萄牙Elmina成为英国殖民领土**。没有符合史料要求的完整经纬度船迹，保持原航路`null`。

## 文件与直接用途

| 文件 | 内容 |
|---|---|
| [EDITOR_HANDOFF.md](EDITOR_HANDOFF.md) | 主编逐年地图部署说明、争议和审查优先级 |
| [SOURCE_REGISTRY.json](SOURCE_REGISTRY.json) | **45条**史料、官方地图与学术档案线索 |
| [CHRONOLOGY.json](CHRONOLOGY.json) | **22条**分年历史事件 |
| [CONTROL_TRANSITION_1549_1559.json](CONTROL_TRANSITION_1549_1559.json) | **9个继承政体、十个年末快照**，控制权转换与不确定状态 |
| [POLITICAL_CONTROL_SITES_1550_1559.geojson](POLITICAL_CONTROL_SITES_1550_1559.geojson) | **15个**现代地点／历史堡垒与政治Point，1558年法国颜色切换 |
| [MAP_REFERENCE_OUTLINES_1550_1559.geojson](MAP_REFERENCE_OUTLINES_1550_1559.geojson) | **8处**以前研究的虚线或纹理不精确参考形状；旧几何原样保留 |
| [MAP_DELTA_1550_1559.geojson](MAP_DELTA_1550_1559.geojson) | **11条**军驻退出、爱尔兰殖民行政和法军收复事件地理变化 |
| [IRISH_MIDLANDS_PLANTATION_1556.json](IRISH_MIDLANDS_PLANTATION_1556.json) | Laois/Offaly两郡设立与军堡实控、土地剥夺、地方抵抗严格分层 |
| [TRADE_AND_FORCED_LABOUR_NETWORKS_1550_1559.json](TRADE_AND_FORCED_LABOUR_NETWORKS_1550_1559.json) | **6组**商业航次／强迫人口运输，1555莫斯科公司，航线不给假GeoJSON |
| [FINANCIAL_EVIDENCE.json](FINANCIAL_EVIDENCE.json) | **8项**不同会计类别的和约、担保、私人资金、掠夺及支出线索，不混算收益 |
| [ATLAS_REVIEW_CANDIDATE.json](ATLAS_REVIEW_CANDIDATE.json) | 主编候审数据：**22事件、15地点、37项直接引用**，准确古代控制Polygon=0 |
| [ARCHIVAL_ACTION_QUEUE.json](ARCHIVAL_ACTION_QUEUE.json) | **16项**查档问题（7项P0），缺乏证据者保留不确定、无需发布阻塞 |
| [TRANSITION_1559_1560_RESEARCH_SEED.json](TRANSITION_1559_1560_RESEARCH_SEED.json) | 第八章1560开始的控制权和旧区域继续显示种子 |
| [interactive_research_preview.html](interactive_research_preview.html) | 独立Leaflet地图逐年时间轴、按年换英法颜色和左侧事件详情 |
| [validate_research.py](validate_research.py) | 史料ID、GIS连续性、英法控制翻转、财政口径和未伪造航迹数据QA |
| [PROGRESS.md](PROGRESS.md) | GitHub提交与断点恢复记录 |

## 预览和质量约束

在仓库根目录执行`python3 -m http.server 8000`，再访问`http://localhost:8000/research/periods/1550-1559/interactive_research_preview.html`。**GitHub文件链接是HTML源码，不是已部署的公网互动地图**。页内历史范围均保留虚线、低透明度、禁止计算占领区平方公里。点击事件浏览证据，双击定位只平移地图，不改变缩放。正式主站接入和视觉验收由主编另行开展。

可在仓库根目录运行`python3 research/periods/1550-1559/validate_research.py`。专项GitHub Actions为**手动触发**，避免此前维护人员关闭的自动研究失败通知再启动。已执行过从GitHub远端读取后的数据一致性审查，尚不称手动Python CI或浏览器人工审查已经通过。

**最高历史准确性约束：声称的行政疆域、现代海岸／郡界和实际1540年代或1550年代军队能收税控地的范围属于不同概念。不确定疆域只能虚线、Point或留空。原始16世纪可核精确军政Polygon数为0。**


## 战争动态控制层｜主编候审入口（2026-10-13）

依照“主权底色、英/法实际控制、蓝紫等双方交战带、孤立据点”的项目战争地图四层方案，本章新增以下**未发布、具有确定来源ID和精度标记**的数据：

- [WAR_MAP_SPEC_1550s.md](WAR_MAP_SPEC_1550s.md) — 主编按规则调用，区分示意、实控、交战、外军盟驻。
- [WAR_CONTROL_ZONES_CANDIDATE_1550_1559.geojson](WAR_CONTROL_ZONES_CANDIDATE_1550_1559.geojson) — 6个控制候选，含旧Pale英法分期复用虚线参考。
- [WAR_CONTESTED_ZONES_CANDIDATE_1550_1559.geojson](WAR_CONTESTED_ZONES_CANDIDATE_1550_1559.geojson) — 4个交战／撤退／殖民争夺候选。
- [WAR_FRONT_NOTES_1550_1559.json](WAR_FRONT_NOTES_1550_1559.json) — 10个年末快照与15个阶段变化。
- [WAR_ISOLATED_OUTPOSTS_CANDIDATE_1550_1559.json](WAR_ISOLATED_OUTPOSTS_CANDIDATE_1550_1559.json) — 8个独立军堡阶段。

**所有估算外缘均非史实实测边界。** 除仓库已有加来Pale旧参考Polygon可用于编辑审核后的低透明虚线**示意**外，无法可靠定界的苏格兰、爱尔兰战争带均以`geometry:null`留待新史料核定，严禁自动圆圈缓冲、现代县界套色、根据英军点位拼接伪占领区。第七章不能画成持续向北扩张：1550英军据堡退潮，1558英王加来区失去，1556爱尔兰出现局部殖民争夺。详细见 [EDITOR_HANDOFF.md](EDITOR_HANDOFF.md) 末节。