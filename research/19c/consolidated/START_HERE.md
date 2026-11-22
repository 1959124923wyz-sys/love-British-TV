**2026-11-22 新接力：R2 T21制作分支 `feat/19c-t21-burma-wars-wuntho-land-rice-20261122`，两章36节97段、93来源、109个互动年表锚点（97复用/12新增）、1891年温托镇压及4个具名地图Point。旧三篇英缅战争母篇及已做地图维持，尚待CI审查和独立出版。详[研究底册T21](topics/T21.md)与[证据GIS审计](../../../docs/research/19C_T21_BURMA_CONQUEST_WUNTHO_LAND_GIS_AUDIT.md)。这一条为制作状态，不能与T10已正式Pages发表相混。**

**正式最新进展（2026-11-22）：** R2 T10爱尔兰大饥荒、逐佃与土地转移已正式公开：[制作PR #518](https://github.com/1959124923wyz-sys/love-British-TV/pull/518) 49/49、[出版PR #519](https://github.com/1959124923wyz-sys/love-British-TV/pull/519) 48/48，Pages [#45003796678](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/45003796678) build/deploy均成功。T10.1/T10.2两章28节84段、50来源、34历史行动链接、6个1861年新增事件、1个Letterkenny具名点，母篇`published/approved`。普通网站1847/1861年入口无需预览参数；旧七节单篇保持编审以防重复。历史地籍、个户/实际受领资料仍按[T10未决原档](T10_NEXT_ACTIONS.md)调查，下一制作候选R2 T21/T48。

**2026-11-22追加：** 主编46已完成R2 T10大饥荒、逐佃与司法售地专题已合并制作PR [#518](https://github.com/1959124923wyz-sys/love-British-TV/pull/518)（merge SHA `c893dd3f88458c4f7591dc130674abdfa395df9`）：两章28节84段、50项来源、34个正文点击事件（28旧复用/6新增）、1861 Letterkenny现代城市参考点。用户已批准全部上线；正式出版 [PR #519](https://github.com/1959124923wyz-sys/love-British-TV/pull/519)（分支 `release/19c-t10-irish-famine-publication-20261122`） 正在候审，须等PR门禁绿、合并、Pages build/deploy实证后才更新已正式上线宣称。旧7节大饥荒稿维持编审避免重复。追档见 [T10_NEXT_ACTIONS](T10_NEXT_ACTIONS.md)。

**当前19世纪接力（2026-11-22）：** R2 T14「信德、旁遮普与阿瓦德武装征服及国家财产/土地掠夺」已制作三章29节87段、30资料来源、复用51正式年表节点和3新具名GIS点，原阿瓦德不确定旧界虚线。制作PR #515 49/49和出版PR #516 48/48均通过并合并；正式Pages #44999746867 build/deploy双成功，T14三章全部published_new，下一主制作候选T10；执行入口：[T14长期待办](T14_NEXT_ACTIONS.md)、[史料GIS审计](../../../docs/research/19C_T14_CONQUEST_PLUNDER_SOURCE_GIS_AUDIT.md)。T05已按#512/#513/#514双阶段出版及归档完成。

# 爱英TV｜19世纪接力总入口（必须先读）

**维护日期：2026-11-22｜适用时间：1800—1899｜仓库唯一正式研究入口：`research/19c/consolidated/`。**

**R2最新接力（2026-11-22）：** T05莫兰特湾1865戒严与王室殖民地已创建[制作PR #512](https://github.com/1959124923wyz-sys/love-British-TV/pull/512)，含两章18节、23历史事件及6 GIS，已47/47制作和46/46出版CI全通过，PR #512/#513均已合并，Pages #44992361081构建部署双成功，普通入口published/approved，下一优先T14。

**目标：** 让任何新的主编、史学调查员、专题作者、历史 GIS 制图人员和 QA 人员都能仅凭 GitHub 仓库继续完成十九世纪英国殖民扩张、掠夺、强制迁移、战争、财政转移、土地剥夺及当地抵抗的**可追溯史料专题＋逐年动态地图**。工作必须写回 GitHub，聊天只是工作指令，不是进度数据库。

**统一协作Issue：** [十九世纪59专题/150章总任务 #499](https://github.com/1959124923wyz-sys/love-British-TV/issues/499)。认领前核对该Issue和当前工作板，以免不同对话重复修改同一章节。

## 0. 新对话的六步接棒（不要要求用户上传或重新解释资料）

1. **从当前 `main` 开始**，阅读根目录 `AGENTS.md`、本文件、[研究目录](README.md)、[进度](PROGRESS.md)；确认 [研究主卷 `manifest.json`](manifest.json) 与 `python3 research/19c/consolidated/verify.py` 可通过。若仍是草稿 PR，先参照 [PR #463](https://github.com/1959124923wyz-sys/love-British-TV/pull/463) 的研究分支，**不得误以为 `main` 已有这批文件**。
2. **先看最新生产状态：** `data/stories/serial/index.json`、`data/stories/index.json`、`data/chapters.json`、`data/stories/serial/chronology-1800-1819.json` 至 `chronology-1890-1899.json`、`data/nineteenth-century-spatial-*.geojson` 及 `data/nineteenth-century-territorial-areas*.geojson`。这里早已有十九世纪年表和地理研究资产；**绝不可将归档数量等同于新增正式事件或尚未发表数量，也不得批量覆盖现有新版**。
3. **从两张活台账选择没有正在进行的任务：** [59专题状态表](TOPIC_WORKBOARD.csv)、[150章节状态表](CHAPTER_WORKBOARD.csv)；优先选择“首批”、未被其他 PR 领取、以及当前地图缺少真实轮廓的任务。可通过专题号、章节号与原案号定位 [原案去向](tables/case-crosswalk.csv)。
4. **一次任务做完整一组可审核产物：** 核史→成文→地图→跳转→桌面测试；若一期过大，拆成同一专题的史料 PR、正文 PR、GIS PR、CI PR，并在台账中注明先后依赖。绝不只写“持续研究”而不提交文件。
5. **每阶段在独立分支提交到 GitHub，开 PR**，描述原ID、引用键、确实核实的年代/范围、地图完成量、证据不足项和运行的测试；通过审查并合并到 `main`，GitHub Pages 部署成功后才能把正式发布标为完成。
6. **更新这两张 CSV、`PROGRESS.md` 和该专题对应的 [`topics/Txx.md`](topics/)**；交接必须留下下一位能直接执行的具体步骤、待调档号及下一批优先任务。若 GitHub 已有更新的主干，本文件的旧快照不能覆盖最新版。

## 1. 一套研究资料，两个互不混淆的状态

| 研究卷实存档案 | 数量 | 用途 |
| --- | ---: | --- |
| 专题 | **59** | `T01`—`T59`，涵盖七个地理主题群 |
| 章节 | **150** | `Txx.n`，后续可拆成多个发表批次 |
| 原案去向 | **273案** | 245案纳入正文、28案移出；原案仍可追溯 |
| 分章年表 | **1,980条** | 首先作研究证据，再与正式站去重 |
| 导读节点 | **314条** | 选取专题正文与可跳转地图锚点的候选 |
| 史料索引 | **1,520条** | 原案引证键、卷页、链接、适用范围 |
| 地图线索 | **1,317条** | **全部仍标为研究线索**，没有自动批准为地图面 |
| 需要继续查证 | **353条** | 史料原件、数字分母、路线和历史地理边线 |
| 保存的底稿文本 | **374份** | `materials/` 中的原案对照和数字节选 |
| 原件图片索引 | **179条** | **只有定位及哈希，上游ZIP的扫描原件未打包进仓库** |

**关键区别：** `research/19c/consolidated/topics/T15.md` 是可审研究底稿；站内正式专题必须依仓库 `data/stories/serial/index.json` 的 `published + approved` 审核状态为准。任何前人提出的年表、伤亡、被夺财产、地图范围都需按原件适用范围再次核查。

## 2. 两张状态台账：必须使用的精确含义

- [`TOPIC_WORKBOARD.csv`](TOPIC_WORKBOARD.csv)：59个专题一行。包含原主线、优先级、章号、年表/导读/地图线索数量、待核问题数量、研究状态、**专题正文状态、GIS 状态、已发布与既有事件 ID 去重状态、当前负责人 PR、下步动作**。关联史料数可因跨专题交叉引用而大于全卷去重来源数。
- [`CHAPTER_WORKBOARD.csv`](CHAPTER_WORKBOARD.csv)：150章一行。独立追踪原件复核、专题长文、历史地理、地图跳转、桌面 Chrome、正式站上线。最初均为 `research=archived`、`publication=not_checked`，含义是“**尚未与当前主分支逐一比对**”，不暗示现有地图没有相关内容。
- 工作流建议状态依次为：`pending` → `in_progress` → `review_ready` → `approved`；正式发表独立用 `not_checked` → `already_published`／`published_new`（均需链接发布 PR+CI+Pages）或 `no_article_needed`。发现已发布的条目应按证据先回填状态，避免重复创作。
- 研究位置与计数更新时**保留原案号、原事件号、史料引用键**，不私自给旧案重编号。每次修改 CSV，不得改写原来 `tables/*.csv` 的史料内容来凑状态。

## 3. 如何查证一个主张和制作一节

**按章节号 `T15.1` 为例：**

1. 先读 [T15专题底稿](topics/T15.md)；在 [章节表](tables/topics-and-sections.csv) 确认对应原案号和史实主线。
2. 按 `章节号` 过滤 [1,980条分章年表](tables/events.csv) 和 [314条导读节点](tables/reading-events.csv)；原事件号如 `B45-E01` 必须在新专题中有映射或解释为未采用。
3. 按 `原案号` 及引文键在 [1,520条史料](tables/sources.csv) 查原档页码、公开网址、可证范围；可能的扫描件以 [179件档案图片索引](tables/archive-images.csv) 定位上游 ZIP；查不到原件的具体句子或数字保留“待核”。
4. 对照 [353条未决问题](tables/open-questions.csv) 与 [证据查重](tables/cross-topic-evidence.md)，核查同一船、同一军行动、同一财政款项在别章出现的情况，**不累加重复数字或重复制图**。
5. 原有正式地图有事件时，只在时间、行动者、地点、后果全对应后复用正式 `ID`；如果没有合格 ID，新增有来源的事件并保持稳定，或者暂存研究，不伪造链接。

**写作结构：** 历史背景与政治主体 → 导致殖民剥夺的制度/动因 → 按年月编排的有组织行动（实施者、受影响者）→ 当地抵抗、证言、分歧 → 强制迁移/损失/战利品/征税的口径与去向 → 实际政治后果和后续变化。史实规模和破坏证据弱的零散案可归为背景，不强行抬升为同级专题；不同来源的冲突性记载保留归属。

## 4. 历史 GIS：优先画真实历史区域

1. 先读 [制图线索表](tables/map-leads.csv)：每条有 `关联章节`、原案号、历史地名、原地理表达、定位精度、已有地图ID、来源。原表部分有多个关联章节，按同一原案事实去重。
2. **分开制图的对象：** 有据殖民实控行政区、军队短期占据的城镇/堡墙、间接条约及附属国、原住民族持续政治地理、战场与暴力波及地点、铁路与航线、奴役/契约劳工迁移路线、货物/战利品运往地点。一个地点可同年有不同主体；先调查与现有19世纪GeoJSON的重合。
3. **先查权威图和当地记录**：条约附图、历史同年代省界/地籍/堡垒实测图、国立档案/馆藏地图、战场官方登记、近现代测绘（仅用作海岸、河道物理底图时标明其时间）。有当时真实边界才做有出处的Polygon。地点有证据但边缘未定，画具名点或**淡虚线、无填色的概略参考线**。没有可靠地理材料不得用现代省界、匀半径缓冲或随意多边形冒充殖民领土，亦不得算面积。
4. **年度连续性**：以1799年最后有效史实与1800年接续为起点，1809→1810→…→1899每十年逐条继承并核实控制主体、取得/结束日、实际占据与法律声索；英军夺占外国城市或公司取得商馆许可不自动变整省英治。所有争议地理线用虚线，真实行政控制另分层。
5. 输出有 `stable_id`、`periods`、`source_urls/source_ids`、`geometry_source`、`historical_boundary_confirmed`、`area_sqkm`、`exclude_from_area_aggregation`、`parent_stable_id` 的 GeoJSON 及制图审计；新地图点击事件必须有对应年与来源。桌面检查各年代以及地图区域互相覆盖的点击优先级。
6. **正式站页面只讲历史**：不把“虚线仅作参考”“图元不是国土”等制图免责声明灌进可见正文、鼠标提示、右侧详情或图例；这些审计事实保留在研究文档和数据字段。

强制读：[地图优先规范](../../../docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md)、[十年接续纲领](../../../docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md)、[16世纪长篇与地图互动标准](../../../docs/templates/16c-story-map-standard/README.md)、根目录 `AGENTS.md`。

## 5. 前四轮推荐制作顺序（可并行，但专题 ID 不可重号）

按 [初盘“首批”名单](README.md) 有条理先做证据链复杂、地图价值大的案例群；每轮由不同主编分支开展，**同一个章节只能有一个正在写的 PR**。建议：

| 制作轮 | 优先专题 | 需要同时解决的地图主线 |
| --- | --- | --- |
| R1 | **T15** 印度1857起义与报复；**T26** 鸦片战争/中国条约港；**T37** 马格达拉物件掠夺；**T46** 澳大利亚边疆暴力 | 城镇战事/驻军与报复；条约港法权和阶段易手；马格达拉与德兰塔拍卖/物件流向；澳洲殖民授地、社群土地与暴力事件 |
| R2 | **T05** 莫兰特湾戒严；**T14** 信德/旁遮普/阿瓦德；**T21** 英缅战争；**T48** 新西兰土地没收 | 戒严公告地点/日期；征服后不同省区实际接管；三期英缅占城/吞并；具名毛利地权与测量原图 |
| R3 | **T33** 拉各斯/尼日尔/贝宁；**T34** 黄金海岸/阿散蒂；**T36** 埃及与苏丹；**T40** 南非矿权与英布战争 | 西非实际堡港与战争地带、非洲当地政治领地；1882埃及占据与后续联统；南非矿权与军政区 |
| R4 | **T01/T02/T03** 废奴赔偿与劳工再转运；**T45/T47/T51** 澳洲强迁和太平洋劳工；**T53/T55/T57** 加拿大土地/铁路/寄宿学校 | 金额分母与具名支付去向、劳工船舶来源—目的地、拘押站、土地产权、铁路拨地、原住民管控地点 |

其余专题完整保留于59专题工作板，绝不因不在R1—R4而删除。每一轮可将专题拆为“史料核对 / 正文稿 / 绘图 / QA”四阶段；完整卷每轮验收后再安排下一轮。

## 6. 上线验收和交接格式

**在每个 PR 的描述/进度日志里记录：**

- 任务身份：`Txx`、章节号、原案号、原事件号、相关正式事件ID；负责分支与 PR。
- 本次成果：几节已核史实、文章交互节点、具名地图点、真实历史Polygon、淡虚线研究Polygon、线/河/港、实测制图出处分别计数。
- 证据：来源 `引用键`、官网链接/馆藏卷页、对应结论、不同证言及统计口径、哪些仍未找到原件。
- 时间：1799→1800接续及各十年点检、军政易手日期、研究最后可证日期、未核延续。
- 测试：`python3 research/19c/consolidated/verify.py`；`python3 research/19c/consolidated/verify_handoff.py`；`python3 scripts/audit_spatial_semantics.py --strict`；`node scripts/test_atlas_47_public_copy_guard.js`、`node scripts/lint_atlas_47_frontend_copy.js`、真实桌面 Chrome（正文点击→年份/镜头→双击事件→返回，尤其1800、1857、1899和跨十年）。
- 结果：合并SHA、部署GHA run、实际发布状态；未通过检查直接标 `blocked` 和具体报错，不能口头声称上线。

**新对话的一句话工作指令**可以是：“接力爱英TV19世纪，先读 `research/19c/consolidated/START_HERE.md`，按工作板选择下一组未完成任务，直接在GitHub完成史料审核、专题撰写、GIS和CI，更新进度。”无须用户自己操作代码。

---

**历史归档不是最终成品。** 它是可反查的59专题母表；正式历史叙事、地图和所有新数字，仍需各自通过来源及逐年地图审定。

## 7. R1已交付与下一轮执行入口（2026-11-22）

| 制作顺位 | 专题 | 合并、核验状态 | 下一步 |
| --- | --- | --- | --- |
| R1-A | T15 印度1857起义和报复 | PR #501已合并，34/34 PR CI及Pages通过；独立长文为编审预览 | 对照原18世纪后续历史地理及B45/B46原卷，详 T15与PROGRESS |
| R1-B | **T26 鸦片战争、赔款、条约港** | [PR #503](https://github.com/1959124923wyz-sys/love-British-TV/pull/503)已合并，35/35 PR CI及 [Pages](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44977462856) 构建部署成功；**14节、99内链、23新事件、48地图图元** | **[T26剩余任务（11个历史缺口）](T26_NEXT_ACTIONS.md)**；按条约港旧海关告示、安平史图、赔款收据、英法军令逐案补核 |
| R1-C | **T37 马格达拉劫掠与文物流向** | [PR #505](https://github.com/1959124923wyz-sys/love-British-TV/pull/505)基础制图36/36全绿；[PR #507](https://github.com/1959124923wyz-sys/love-British-TV/pull/507)正式上线35/35全绿，[Pages](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44981515205)部署成功；`published/approved` | [正式站1868年](https://1959124923wyz-sys.github.io/love-British-TV/?year=1868)（无预览参数）；[T37未决原卷](T37_NEXT_ACTIONS.md)继续核购买账与历史测图 |
| R1-D | **T46 澳洲边疆土地、骑警暴力与原住民抵抗** | [生产PR #509](https://github.com/1959124923wyz-sys/love-British-TV/pull/509)37/37全绿，[正式出版PR #510](https://github.com/1959124923wyz-sys/love-British-TV/pull/510)35/35全绿；[Pages #44985306164](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44985306164)构建部署成功；**published/approved** | [正式站1838年](https://1959124923wyz-sys.github.io/love-British-TV/?year=1838)（无需预览标志）；25节75段、39事件（29新增、10复用）、17 GIS；[17项原卷研究缺口](T46_NEXT_ACTIONS.md)持续调档 |

**正式状态不变：** T26母篇 `editorial_review/not_submitted`，其可在[19世纪年表1839年](https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1839)进入阅读。其余57个专题的实际制作状态仍由两张工作板逐项记录，下一智能体从未认领状态开始，不重复已完成的T15/T26。

## 2026-11-22 T37出版状态追加说明

T37独立长篇已公开上站（PR #507、35/35CI、Pages #44981515205），T37研究底本2项原问题和T37新增具体档案待核未勾销。下一顺位T46，按[T46五章任务清单](T46_NEXT_ACTIONS.md)认领独立制作PR，先去重正式Pinjarra/Myall Creek和重叠屠杀计数。

## 2026-11-22 R1完成生产阶段与R2接棒

T37已正式发布（#507）、T46五章已正式发布（#509制作37/37、#510出版35/35、Pages #44985306164）并录两张工作板为`published_new`；T15、T26仍按各自编审预览状态和原卷待核问题执行，不越权更改。下一主制作项选定[R2 T05 Morant Bay牙买加戒严镇压](T05_NEXT_ACTIONS.md)，已有2章、26研究事件、15空间线索、6原始待核问题和16史料索引。按同一套长期责任审核、实际文物/军令/法令地图、公示Chrome QA工作流完成。
