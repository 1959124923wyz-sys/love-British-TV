# 爱英TV｜GitHub / AI 调查员接手入口

本仓库用于逐年、逐十年绘制英格兰、苏格兰及1707年之后英国相关的殖民统治、经济网络、军事行动、抵抗与独立。**所有调查智能体、编辑与主编，开展新历史时期前应先阅读以下规范。**

## 第一优先级：地图疆域与时间连续性

**每十年不得重置控制区；每次切片必须从上期最后一年继承控制关系，再根据史料逐项确认持续、扩张、收缩、转移、结束或未核实。** 没有新的文献不等于控制消失；上一期还有标记不等于当期已证实真实边界。任何变化都应有日期、地域、主体和来源。地图绘画优先于新增事件数量。

**详尽、可执行的调查工作纲领：** [docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md](docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md)

**历史地理绘画规范：** [docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md](docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md)

**跨十年控制关系的底层规则：** [docs/TERRITORY_CONTINUITY_RULE.md](docs/TERRITORY_CONTINUITY_RULE.md)

**已批准的网站交互规则：** [docs/APPROVED_MAP_INTERACTION_STANDARD.md](docs/APPROVED_MAP_INTERACTION_STANDARD.md)

**新章节研究→编辑→地图→视觉→上线的长期交付门禁：** [docs/CARTOGRAPHY_RELEASE_PIPELINE.md](docs/CARTOGRAPHY_RELEASE_PIPELINE.md)。**从1550年起**，主编在 `data/chapters.json` 将章节标为 `published` 之前，必须按 `editorial/cartography/releases/YYYY-YYYY.json` 完成可追踪的逐年控制、史料ID、地图Delta、两个图层和桌面/移动端验收；`scripts/validate_cartography_delivery.py` 已加入既有CI与Pages发布流程。只完成研究PR或GitHub结构QA不得声称地图已上线。

## 开工前执行

1. 先读取上一期地图 JSON、控制图层、虚线参考层、研究控制数据和上一期`PROGRESS.md`，不要仅凭当前章节事件决定领土。
2. 读取 [research/continuity/README.md](research/continuity/README.md) 与最近期末的控制区状态，列出前期每一处 `stable_id`。
3. 复制 [过渡模板](research/continuity/templates/DECADE_TRANSITION_TEMPLATE.json)，建立本次十年的控制去向记录；同时附带主编需要的 [交接模板](research/continuity/templates/EDITOR_HANDOFF_TEMPLATE.md)。
4. 调查并绘制可靠范围。真正历史控制区域才允许经过批准的实心面；城堡/城市屏幕圆形不代表古代面积；历史疆界不确定一律虚线。苏格兰1707年前是独立政体，不可误归英属殖民区。
5. 以精确日期判断年末状态、保留原始证据。**证据最后记载年份与历史控制结束年份必须分开。**
6. 提交独立Git分支，分批保存资料并记录SHA；运行核查脚本后创建草稿PR交主编。**不要擅自覆盖 `main`；不要把未部署的内容声称已上线。**

## 永久禁止

- 因十年跨越导致原控制区无端消失，或因单次战斗凭空扩大整块殖民版图。
- 将现代行政边界、示意凸包、法令地点折线或屏幕符号直接当古代实测辖区，或从中计算历史殖民面积。
- 把新的地图地名标签误记为实际“新征服”，把本地自治/独立政体统一改成英王直接殖民。
- 捏造来源、数字、战争疆界、撤军日期、海上航迹或殖民收益；删除无法证明的疑点而不记录。
- 只提交大量事件、不提交前后年代政治与空间变化说明。

## 已研究的连续性基线

- [1497—1529年33份年末状态及地理差异](research/continuity/CONTROL_TIMELINE_1497_1529.json)
- [1529→1530年待调查承接清单](research/continuity/TRANSITION_1529_1530_RESEARCH_SEED.json)
- [主编集成交接](research/continuity/EDITOR_HANDOFF_1497_1529.md)

这些文件是带来源与审核等级的**历史研究基线**，而非证明所有边界均精准。用户确认的“十年不重置、关注真实疆域变化”的规则适用于往后所有研究年代；规范与连续研究基线已通过主编无冲突整理（PR #15）进入 `main`；第四章候审事件与未经核准的历史疆界仍处于审核阶段，不能作为正式地图事实直接发布。

如遇既有指令冲突：**史料真实性和疆域类型区分优先；已批准的地图交互由主编负责保持；未确认的数据交由下一调查员继续核查。**