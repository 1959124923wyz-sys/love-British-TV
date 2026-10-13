# 帝国的代价 · 英格兰—苏格兰—大不列颠—联合王国殖民扩张历史地图

> **当前正式视觉与交互基线：v0.9（2026-10-12，用户已批准）。**
> 未来年代扩展、资料上线和维护修复统一沿用 [正式地图交互规范](docs/APPROVED_MAP_INTERACTION_STANDARD.md)。该规范优先于下方旧版本功能纪要。地图表现为数字主点按需展开透明SVG事件小点、简介置顶、邻点避让、十年章节事件完整保留、持续状态跨章延续。
> 可回退代码快照：[approved-ui-v0.9 基线分支](../../tree/baseline/approved-ui-v0.9-20261012)。主干可继续增加史实资料，但新交互须遵循批准规范并通过CI校验。

基于可核验史料、精确年份、历史主体与不确定性标记的全球动态地图。

## 当前已出版范围（2026-10-13，正式上线以Pages为准）

- 1497—1549年六个历史章节，半世纪每页五张十年目录；逐年筛选真实史事与控制点。
- [第六章正式史料](data/atlas-1540-1549.json) / [地图点源数据](data/military-control-points-1540-1549.geojson) / [历史准入审核](editorial/1540-1549/PUBLISH_REVIEW.md) / [调查补缺清单](editorial/1540-1549/RESEARCH_GAPS_TO_PR27.md)。
- 1540年代英军局部堡垒和法国对抗据点采用具名地点Point，仍没有可靠的精准历史疆域Polygon；原地图参考轮廓只连续延伸不改变古界。

## 第六章史料与局部军控紫色图层更新（2026-10-13）

- 第六章已审核史实共49项，直接收录73条可追索文献。增补邓迪1547年底短暂英占和1548年两次战争影响、Hailes1548年苏军同年收复，以及Pinkie、Tantallon经过精度限定的官方现代遗址参考坐标。
- [新增史料详细审核](editorial/1540-1549/REFRESH_20261013.md)；[独立概略军控范围](data/war-control-vicinity-1540-1549.geojson)。后者仅为调查员明示不准确的现代地点任意半径示意；紫色虚线弱填充，非真实占领边界，无法面积计算。放大后不继续显示此不精确范围。
- 研究员仍需查布洛涅实际军政边境、苏格兰营地外廓、1548年邓迪第二次占领持续期限及档案许可。正式地图不把苏格兰大块变为英格兰国土。

## 战时控制与交战示意图层（第六章，2026-10-13）

1540年代地图补充可点击的英军驻点概略范围（紫色虚线）和根据有据战事地点手工构建的交战区阅读示意（蓝紫交错纹理）；它们逐年变化，点击可阅读双方、年份、具体事件和来源。**这些形状不是已复原的16世纪实测边界，不可以用于占领面积统计**。法理主权仍和实际军政控制区分开。有关地图数据、交互优先级、调查缺口与制图精度见[战争控制与争夺区制图规范](docs/WAR_CONTROL_AND_CONTESTED_ZONES.md)。

## 地图链接

- **GitHub Pages 正式地址（仓库 Pages 服务启用并成功部署后）**：https://1959124923wyz-sys.github.io/love-British-TV/
- **即时临时预览（第三方 raw.githack；可能先显示一次安全确认页）**：https://raw.githack.com/1959124923wyz-sys/love-British-TV/main/index.html

若正式地址暂时不可访问：仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**；随后在 Actions 中查看 Publish historical atlas 的运行情况。

## 首批试运行

**1497—1500**：英王亨利七世支持的约翰·卡博特远航、第一次北美登陆地假说、1498年二次远航、王室对海外土地的象征性主张。北美不绘制无证据支持的殖民统治区。航线为方向示意，不是史实精确路径。


## 正式获批图标规范（2026-10-12）

以下三个文件为所有研究与网页维护对话的**正式约定**：

- [16类历史事件图标规范 v2.0](docs/ICON_SYSTEM_V2_APPROVED.md)
- [可调用 SVG 图标库（POL / EXP / TER / WAR / REP / SLV / LAB / ECO / DIS / FAM / RES / ABO / IND / INF / CLM / DOC）](assets/atlas-icons.svg)
- [16类机器可读编码与配色](data/icon-categories.json)

基础颜色按照类别表达，图标大小表达历史重要性（三级），虚线/问号表达地点不确定性；相关概念不得混同。当前1497—1500的地图标记与侧栏已改为使用此SVG库。后续分支也必须复用相同标准。

## 多对话交接

- [PROJECT_STATUS.md](PROJECT_STATUS.md)：项目当前状态、已知问题与待办。
- [CHANGELOG.md](CHANGELOG.md)：正式变更日志。
- [RESEARCH_HANDOFF.md](RESEARCH_HANDOFF.md)：研究与网页维护的任务分工、分支与合并机制。
- [SOURCE_MATRIX.md](SOURCE_MATRIX.md)：资料来源。
- [数据文件](data/atlas-1497-1500.json)：机器可读史料和地理不确定性信息。
- [专题研究分支](../../tree/research/cabot-1497-1500)：研究日志 PROGRESS.md。

开发：静态 HTML + CSS + JavaScript / Leaflet；部署通过 GitHub Pages；本地英国区域轮廓基于 ONS 开放数据，**现代轮廓只用于定位，不代表1497年政治边界**。

网页使用 © OpenStreetMap contributors / © CARTO 底图；地域边界来源为 ONSvisual/topojson_boundaries，含 ONS/OS 开放地理数据，详见来源清单。

- [查看16种正式SVG图标（网页预览）](icon-gallery.html) — GitHub Pages 地址：https://1959124923wyz-sys.github.io/love-British-TV/icon-gallery.html

## 1500—1509：信息搜集员1号资料首次上线（2026-10-12）

- **地图时间范围已扩展到1497—1509年**；拖动滑块到1500年进入第二章。
- 新增公开正式数据：[1500—1509事件和代表性政治据点](data/atlas-1500-1509.json)，包括14条来源关联事件、6处有证据的具名地区位置与50条史料来源索引。
- 研究员原始成果 [research/periods/1500-1510/](research/periods/1500-1510/README.md) 完整按已提交状态快照入库；研究分支仍继续使用，不发生自动覆盖。
- [来源与制图审查](research/periods/1500-1510/CONTROL_AND_CHRONOLOGY_REVIEW.md) 指出 Calais March、English Pale 等区域的可复核边界尚未就绪，**目前没有新增任何殖民地实心控制多边形**。
- 史料上没有确认的1508—09卡博特远航轨迹不作为确定路线发布；钱款注明性质，王室航海拨款/年金与外交收款不计为殖民利润。



## 2026-10-12：v0.6 时间轴、持续状态与调查员新一批资料
- 新时间轴：分章节色带 + 年份里程碑。当前年份切换不再隐藏同章全部历史事件。
- 地图相近事件聚合选择，避免英苏条约挡住1501—1502年三名来自大西洋彼岸的人物记录。
- 新的数据：[1500—1509正式事件](data/atlas-1500-1509.json)（21条事件、6处政治据点、54条来源）。
- 调查员持续上传的文献：[1500—1509深入调查报告](research/periods/1500-1510/DEEP_FINDINGS_CALAISES_AND_IRELAND.md) 与 [假设地理包络研究](research/hypotheses/1500/README.md)；后者仅存档研究。
- 公众事件写作与十年分段的长期规范：[叙事与时间状态规范](docs/PUBLIC_NARRATIVE_AND_TIME_MODEL.md)。

## 2026-10-12 · v0.7 正式地图布局与地理参考预览
- [在线历史地图](https://1959124923wyz-sys.github.io/love-British-TV/)：地图仅保留紧凑年份卡与章节时间轴；右侧考证采用覆盖式抽屉。
- 1500—1509年度英国范围缩放显示全部21个事件图标和可证时段内6个政治关系据点；同一地点图标向上错列，而非数字圆圈。
- [调查员的三项地理参考线面](data/geography-1500-hypotheses.geojson)：独立淡色虚线，在1500—1509年可见，可在侧栏关闭。 [原30项研究素材](research/hypotheses/1500/HYPOTHESIS_ENVELOPES.geojson) 保留供继续考证。
- [第二级历史文献与考证库](data/historical-detail-notes.json)：34条记录，一层读故事、二层看具体档案和统计口径。
- [最新项目状态](PROJECT_STATUS.md) / [完整更新日志](CHANGELOG.md)。


### v0.8 · 地图浏览方式（2026-10-12）

多事件地区默认使用小型数字主标记；鼠标悬停或点击主标记展开独立史事SVG图标；点击空白收起。后续v0.9补足了展开层透明、悬停简介置顶和避让效果。此模式已获用户批准并作为长期基准。详见 [正式交互规范](docs/APPROVED_MAP_INTERACTION_STANDARD.md)、[更新日志](CHANGELOG.md) 与 [项目现状](PROJECT_STATUS.md)。


### 第三章：1510—1519年《王冠越过海峡》正式上线

[直接打开第三章](https://1959124923wyz-sys.github.io/love-British-TV/?year=1510) · [第三章史事数据](data/atlas-1510-1519.json) · [本期22条直接文献索引](data/atlas-1510-1519.json) · [图尔奈外围参考地理](data/geography-1510-1519-hypotheses.geojson)

本期公开15条历史事件、7处延续政治据点。英军驻图尔奈1513—1518年的年末政治状态与1519年交还事件相互区分；弗洛登战役并未改变苏格兰独立王国的主体。调查员与主编共29份源研究材料均已归档到 `research/periods/1510-1519/`、`editorial/1510-1519/`，可逐次继续补充。现行地图交互继续使用已批准的 v0.9 基线。


## 2026-10-12 · v1.2 时间推进与政治关系制图

- 地图与左侧事件改为**随时间轴逐年揭示**，例如1500年默认3/21事件；可主动勾选「查阅本章完整档案」查看全部，不影响当年的领土状态。
- 新增 [政治关系纹理面积符号数据](data/political-relations-1500-1519.geojson)：英王属地、马恩岛特殊领主制度、都柏林英王行政核心、苏格兰王权岛屿分别绘制，不将多种制度简化为英格兰本土实控。
- 加来与图尔奈可见的实色城市核心面积符号仍随年变化；新增威尔士差异化地图色与1510年代可查阅的1488 Pale历史地理参考。
- **[1497—1519领土绘制覆盖审计](docs/TERRITORIAL_COVERAGE_AUDIT_1497_1519.md)** 已逐项列出目前还没画成可靠历史边界的地区及下一步研究重点。历史地图绘制必须继续优先于事件点数量。

## 连续疆域研究底座与第四章候审预览

- [调查员跨十年控制关系纲领](docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md)与 [AGENTS.md](AGENTS.md) 是后续调查员开工入口。
- [1497—1529年33份年末控制台账](research/continuity/CONTROL_TIMELINE_1497_1529.json)、[1519→1520年过渡](research/continuity/transitions/TRANSITION_1519_1520_V2.json)和[1520年代候审数据](research/continuity/staged/atlas-1520-1529.json)已经作为独立研究档案保存。新章必须继承既有控制关系，不从空白重新制作。
- [第四章1497—1529独立预览](preview-continuity-1497-1529.html)仅用于主编审核；1520—1529年24条事件、49项来源尚未全部获得正式发布审核。正式首页仍以1497—1519年为准。
- 概略Pale与现代海岸线为参考地图，不是实测历史疆界。参见 [持续疆域研究审计](docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md)；研究数据与正式发布数据互不覆盖。
- 自检：`python3 scripts/validate_control_transition.py --self-test`、`python3 research/continuity/check_full_continuity.py`、`node scripts/test_continuity_preview.js`，并查看GitHub Actions。

### 地图事件快速定位

左侧事件**单击**打开历史档案；**双击**后地图平滑移动到事件已核实的代表位置，并高亮目标标记。定位不改变年份或缩放，滚轮放大由读者自主控制。若历史地点缺少可靠经纬度（例如1517年拉斯特尔未完成的北美远航计划），保留文献，但不捏造地图坐标。聚合事件会展开并突出被选中的具体SVG图标。

## 正式第四章：1520—1529年

主站 [帝国的代价](https://1959124923wyz-sys.github.io/love-British-TV/?year=1520) 时间轴已延伸到1529年。第四章史事默认逐年出现，累计24条历史记录和7处持续/细化政治据点。完整来源在 `data/atlas-1520-1529.json`，审查结论在 `editorial/1520-1529/PUBLISH_REVIEW.md`。历年真实疆域的持续性由 `research/continuity/CONTROL_TIMELINE_1497_1529.json` 与正式连续GeoJSON共同负责；所有推定边界仍为虚线或制度纹理，**本章没有新获证实的历史实控多边形**。

单击左栏事件打开资料；双击具名坐标事件，地图只平滑移动而不变焦，并高亮对应图标。没有可靠坐标的事件仍在列表中展示，不人为杜撰地点。此前研究预览 `preview-continuity-1497-1529.html` 留作原稿比较，不作为正式数据来源。

## 正式第五章：1530—1539年（资料仍持续补充）

- 正式地图年份扩展至1539；第五章采用逐年揭示，1530—1532年暂未收集到可正式录入的事件，但前期政治控制保持连续。1533—1539年逐年出现本章共24条事件。
- 已公布 `data/atlas-1530-1539.json`（7处延续政治关系，41项候审Atlas引用来源），并保留源自[PR #25](https://github.com/1959124923wyz-sys/love-British-TV/pull/25)的全部18份调查文件。
- 历史地图只沿用七片已有地理参考，未额外绘出威尔士当年的古边区面；已公开9个地点参考，15条没有可靠坐标的事件只保留文字。不得凭新法案、梅努斯局部攻取和北美远航推断为新殖民领土。
- [编辑发布审查和地图精度限制](editorial/1530-1539/PUBLISH_REVIEW.md)；**调查员继续补充的缺失数据、地图事项位于PR #25末尾**。

### 三级时间轴与未来五百年可扩展导航（v1.6）

地图底部按「世纪总览 → 3个固定宽度十年章节 → 当前十年一年一格」操作。按世纪浏览未来年代时，**不会把未发布的年份误当正式地图**；只有上架且带史料的章可单击跳转。直达输入框可输入1497—1539范围内的任意年份，回车直接定位到该年，并维持地图相机与已有史料栏。

发布章节登记在 `data/chapters.json`，设计与回归测试在 `docs/SCALABLE_TIMELINE_ARCHITECTURE_1497_PRESENT.md`、`scripts/test_timeline_scale.js` 和 `scripts/browser_smoke.py`。目前仍仅有五个正式章节，不代表其余十年已收集史料。

### 1530—1539年补充史料第二次审核

第五章依据研究PR #25最新独立增量更新为**27条事件、8个历史政治地点、55项直接引用、12个现代遗址/城市参考事件坐标**，新增根西王室属地既存制度点及1531/1532补档事件；13个法定威尔士辖区和分项财政证据已分别入 `data/welsh-legal-shires-1535.json`、`data/financial-evidence-1530-1539.json`，不冒充历史古界或实际殖民净利。

新版时间轴每页固定**5个十年章节**，按50年翻页（1500—1549→1550—1599）；1497—1499年是特殊独立序章。未来年代只能浏览章节目录，不能生成未经审核的地图状态。
