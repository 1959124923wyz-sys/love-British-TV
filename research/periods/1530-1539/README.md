# 爱英TV｜1530—1539年历史事件与疆域研究（调查员接班）

**阶段：研究资料和GIS已完整分批保存 GitHub 独立分支，待编辑审核。** 编制日期2026-10-13。数据基线为正式主干 `main/data/atlas-1520-1529.json`，并按`AGENTS.md`及`docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md`完成十年继承，未修改`main`。

## 地图研究结论

1. **加来Calais与吉讷Guînes**：英王要塞城市和边境据点延续，1533—40年Lisle相关SP3史料继续核实行政存在；外围边界尚无当期可验证历史测量图，**延续上一期虚线地名范围**。
2. **爱尔兰**：1534年都柏林城堡未被杰拉德叛军攻下；1535年梅努斯城堡被英王军占取；1536/37家族地产和庄园法权被追夺。重大但**不等于整郡永久军政控制**。1536–37爱尔兰议会与1537文化同化法令是政治法权和镇压，不能据此画爱尔兰全岛橙色。
3. **威尔士**：27 Hen VIII c26《威尔士法律法》官方编年1535，历史叙述往往记1536施行，将边区领主制和司法纳入英格兰法律郡县。只有**现代威尔士地理轮廓作虚线定位参考**，不冒称当期边区法界或新征服。
4. **苏格兰**：独立；詹姆斯五世1537年改建布莱克尼斯城堡、1538年林利斯哥宫工程，**不得当成英王殖民占据**；马恩岛、泽西、根西保持特殊制度的区别。
5. **英格兰1539海防**：多佛、迪尔、波特兰等是英格兰**本土**军备加强；1539开工不能提前显示1540/45竣工的墙线。
6. **1536纽芬兰Richard Hore航行**：加拿大权威传记认定航次发生，Hakluyt所述精确线路及生存故事有争议。仅保留史事，无精确海航线、更无英国北美殖民区。

## 文件交接

| 文件 | 用途 |
| --- | --- |
| [SOURCE_REGISTRY.json](SOURCE_REGISTRY.json) | 60条来源与研究线索，区分现代官方史址、法规原文、学术论文、未读原档 |
| [CHRONOLOGY.json](CHRONOLOGY.json) | 27条候审事件；年份可逐年揭示；尚未确认地图坐标的事件保留于历史档案 |
| [ATLAS_REVIEW_CANDIDATE.json](ATLAS_REVIEW_CANDIDATE.json) | 直接供主编选择的第四章后续 **第五章候审事件/地点/来源**，27事件、8持续政治地点、55直接引用；无批准控制区polygon |
| [TRANSITION_1529_1530.json](TRANSITION_1529_1530.json) | 1529→1530所有7个正式地点继承 + 独立苏格兰；10个逐年快照；1535梅努斯、威尔士和土地法权转移另列 |
| [MAP_REFERENCE_1530_1539.geojson](MAP_REFERENCE_1530_1539.geojson) | 7块旧图轮廓原样沿用 + 1块现代威尔士虚线法律地理示意（**不是实测16世纪边界**） |
| [CONTROL_CORES_1530_1539.geojson](CONTROL_CORES_1530_1539.geojson) | 加来、吉讷、都柏林3处可显示的小型城市核心Point |
| [POLITICAL_RELATIONS_1530_1539.geojson](POLITICAL_RELATIONS_1530_1539.geojson) | 泽西、根西、马恩、奥克尼、设得兰5处不同法权/独立苏格兰Point |
| [EVENT_SITES_1530_1539.geojson](EVENT_SITES_1530_1539.geojson) | 12个已取得现代官方/研究地图定位的事件点 |
| [MAP_DELTA_1530_1539.geojson](MAP_DELTA_1530_1539.geojson) | 已证局部梅努斯堡易手事件 + 威尔士法权变更现代范围，仅2项，**没有经核的新增殖民领土面** |
| [CONTROL_EPISODES.json](CONTROL_EPISODES.json) | 17类军政/地方领主/自治/独立政体状态 |
| [FINANCIAL_EVIDENCE.json](FINANCIAL_EVIDENCE.json) | 9种财政资产方向（另含私人裁决年收益及寺院养老金）：现金、债务、地租、罚没和王室军费不得相加成“掠夺总利润” |
| [ARCHIVAL_ACTION_QUEUE.json](ARCHIVAL_ACTION_QUEUE.json) | 17个后续查档任务，P0 9个，围绕实际疆界 |
| [validate_research.py](validate_research.py) | 自动数据审查脚本，主编可复核 |

运行：`python3 research/periods/1530-1539/validate_research.py`。本轮数据合并入正式网站前，审稿人需阅读 [EDITOR_HANDOFF.md](EDITOR_HANDOFF.md)。

## 研究限制

- 没有亲自审读16世纪原手稿完整原件；引用了官方现存史料说明、法规条目及部分专业学术文献。
- 轮廓GeoJSON的数字顶点是现代地理参考，并非伪造的1530年代历史土地测量；基尔代尔真正没收的各庄园仍应分别证实。
- Source ID无实证现地经纬度的历史事件不强行绘点。所有地图建议均保留`verified_historical_border=false`及`fill_authorized=false`。
- 1535《威尔士法律法》的会期名称与1536通称须说明，具体法界需要按条款列出原边区领主名后才可升级。
- 1530年代爱尔兰仍为英王的Lordship of Ireland；**1541年取得King of Ireland称号属于下一历史十年**。

## 独立网页研究预览（新增）

[interactive_research_preview.html](interactive_research_preview.html) 支持1530—1539年的逐年事件揭示、八处具名政治位置（新增根西的既存制度点）、八块概略地理参考，并实现**双击左侧事件平滑定位＋高亮、不改缩放**。预览与主站完全分离，须在克隆文件后通过本地HTTP服务启动（如在仓库根目录运行 `python3 -m http.server 8000`，打开 `http://localhost:8000/research/periods/1530-1539/interactive_research_preview.html`）。其GIS文件是研究示意，尚未经过真实浏览器人工验收。CI增加Node.js语法检查。

## 已制作1539→1540研究继承种子

[NEXT_DECADE_1539_1540_RESEARCH_SEED.json](NEXT_DECADE_1539_1540_RESEARCH_SEED.json)记录截至1539研究的**8条稳定政治身份**及需向1540年代交接的状态，保留图尔奈1519退出，并把**1541爱尔兰国王称号、1542威尔士第二法令及苏格兰王位继承**列为下一时期需证实的事项。**不得把种子当成1540已通过的历史控制地图**。自动检查程序已经核验这8条记录没有被新年代遗漏。

## PR #25主编清单补缺（2026-10-13）

新增的12个事件地图地点、根西作为第八处既存具名政治关系、1531Leixlip私人庄园史料及1535威尔士法令13组接受郡县，请先阅读 [PR25_DEFICIENCY_RESOLUTION_20261013.md](PR25_DEFICIENCY_RESOLUTION_20261013.md) 和 [WELSH_MARCHER_1535_STATUTORY_SHIRES.json](WELSH_MARCHER_1535_STATUTORY_SHIRES.json)，以及 [LOCAL_DOCUMENTED_SITES_1530_1539.geojson](LOCAL_DOCUMENTED_SITES_1530_1539.geojson)。目前主干已经另行发布初版1530—1539，**这份新研究增量不能直接用旧文件覆盖现有主站内容**。
