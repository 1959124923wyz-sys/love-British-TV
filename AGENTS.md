# 爱英TV｜GitHub / AI 调查员接手入口

本仓库用于逐年、逐十年绘制英格兰、苏格兰及1707年之后英国相关的殖民统治、经济网络、军事行动、抵抗与独立。**所有调查智能体、编辑与主编，开展新历史时期前应先阅读以下规范。**

## 16世纪成熟范例：所有后续重大专题必须模仿（2026-10-21生效）

**正式制作模板：** [16世纪专题写法、影响区画法、正文互动、地图镜头及出版审查纲领](docs/templates/16c-story-map-standard/README.md)，配套 [完整原始范例 ZIP](docs/templates/16c-story-map-standard/16C_stories_cartography_interaction_reference.zip) 及 [2026-10-22 接手核查与操作记录](docs/templates/16c-story-map-standard/HANDOFF_20261022.md)。所有历史调查员、地图制作者、主编及后来接手的智能体必须先对照包内**已上线16世纪故事、九年战争影响区、交互源代码及测试**，再制作任何新重大专题。

强制底线：**正文必须使用已核史实事件的 `[[ID|自然语言]]` 超链接**，单击能切到相应年份并移动地图、双击能进事件档案和返回；**军事/殖民影响区只有有据具名局部区域才允许虚线淡色示意**，无经核历史边界不能宣称实控Polygon或计算面积。所有新时期先查政治控制和跨年代延续，不能用商馆许可替代主权。GitHub按研究、文章、GIS、浏览器QA分批保存；全部通过后合并并核验Pages部署。

## 维护接手提醒（2026-10-18）

正式出版范围、章号与数据量应以当下的 `data/chapters.json`、各章 Atlas 及 `data/stories/index.json` 为准，不能以旧 `PROJECT_STATUS.md` 段落、尚未合并的研究 PR 或旧章号推断当前状态。截至2026-10-23，16世纪专题及地图已正式发布；1600—1699系列专题已在 `data/stories/serial/index.json` 中标记八篇 `published`（爱尔兰土地、格伦科、巴巴多斯、东印度公司、皇家非洲公司、新英格兰原住民战争与战俘奴役、弗吉尼亚波瓦坦战争与世袭奴役、牙买加征服与马龙抵抗和奴役法律），其余仍有 `research_only` 候审母题。新英格兰专题的史料、地图标识、浏览器验收和研究缺口见 [E6-T06交接](docs/research/EDITOR7_E6_T06_NEW_ENGLAND_INDIGENOUS_WARS_20261023.md)。弗吉尼亚专题的1646/1677两份条约全文、奴役法律、地图规范与交接见 [E6-T05交接](docs/research/EDITOR7_E6_T05_VIRGINIA_POWHATAN_WARS_20261023.md)。牙买加专题的1658 Rio Nuevo战争、1661—1699奴役法律原文及山区马龙自主与18世纪年代禁忌见 [E6-T08交接](docs/research/EDITOR7_E6_T08_JAMAICA_MAROON_20261023.md)。17世纪专题发布不等于1600—1699全部年份的版图、事件和空间数据均已完成审核，必须分别核对数据与已批准的图层。

研究分支与 `main` 的同一年代文件可能已大幅分化。**只按事件 ID、来源和几何变化择优移植，不得用旧研究包完整替换新版章节，亦不得批量合并或关闭旧 PR。** 所有 GIS 与版图变更必须通过严格空间审核（`python3 scripts/audit_spatial_semantics.py --strict`），`ERROR` 阻止合并/发布，`REVIEW` 记录为待调查，不应通过删去真实疑点来追求零警告。具体清理优先级与核实数据见 [2026-10-18维护交接](docs/MAINTENANCE_TRIAGE_20261018.md)。

## 第一优先级：地图疆域与时间连续性

**每十年不得重置控制区；每次切片必须从上期最后一年继承控制关系，再根据史料逐项确认持续、扩张、收缩、转移、结束或未核实。** 没有新的文献不等于控制消失；上一期还有标记不等于当期已证实真实边界。任何变化都应有日期、地域、主体和来源。地图绘画优先于新增事件数量。

**详尽、可执行的调查工作纲领：** [docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md](docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md)

**历史地理绘画规范：** [docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md](docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md)

**点—线—区、军事影响区与具名地落图强制规范（2026-10-15）：** [docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md](docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md) · [逐项审查清单](docs/HISTORICAL_SPATIAL_REVIEW_CHECKLIST.md)。史料已确认的历史地名可落现代参考城市坐标，不能因缺16世纪城墙GPS长期留空；有据顺序才画线，区域行动证据才画淡色虚线影响区，均不当实测领土。**本仓库后续所有调查与制图PR必须遵照执行。**

**跨十年控制关系的底层规则：** [docs/TERRITORY_CONTINUITY_RULE.md](docs/TERRITORY_CONTINUITY_RULE.md)

**已批准的网站交互规则：** [docs/APPROVED_MAP_INTERACTION_STANDARD.md](docs/APPROVED_MAP_INTERACTION_STANDARD.md)

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
