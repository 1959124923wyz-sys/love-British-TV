# 爱英TV｜编辑6给甲、乙、丙的统一历史专题制作与送审规范（2026-10-19）

**适用：17世纪全部专题以及跨数十年至数百年的ARC历史进程。强制执行，不改变原十年章节。** 阅读甲组R07实际教训：[专项审核](EDITOR6_AGENT_A_R07_PUBLICATION_AUDIT_20261019.md)，并遵守 [跨世纪发布接口](EDITOR6_17C_SERIAL_STORY_PUBLICATION_CONTRACT.md)、[历史地理规范](../HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md)及 [仓库总纲](../../AGENTS.md)。

## 1. 三种内容绝不能混淆
1. **ARC长期进程**：历史身份稳定，1600或1699不是人为起止。记录真实政治与制度转换、最后来源记载、确切历史终止与下一世纪续接关系。
2. **可读专题**：独立历史故事，允许跨十年甚至跨世纪，但必须有内在联系、确证结局/阶段结果和完整来源。一件格伦科惨案可以在苏格兰长期历史系列下成为独立子篇，**不要为了凑“大专题”把法律制度、达连和格伦科硬合成一篇只写了一个事件的半成品**。如需新子专题ID须先申请编辑6，不得复制一个已写故事为多个ID。
3. **年度地图事件**：只有独立审定的具体史事才进入既有按十年存储的 atlas，并按事实发生年显示。母专题的几十年跨度不产生额外“英国疆域”或未来图钉。年度版图保持stable_id承接。

## 2. 写作流程：八个顺序步骤
1. **接棒**：先读取本组最近的 `RNN-FULL.zip`，查旧轮SHA、来源ID、事件ID、专题JSON及疑点，老资料不可因新轮交付丢失。
2. **界定故事**：拟“**起止年＋史学通用名称**”的读者题目，写清年代、历史主体、地点、政治环境、当地居民及抵抗者；不要在1620年代的英格兰行为里套1707以后才存在的政体。
3. **主张清单**：按时间/人物/实施行为/受害或相关群体/结果逐条列claim，绑定具体史料卷、页、全文链接、访问状态。书目仅证明有馆藏；法规宣布不等于执行；金额申请不等于拨付。
4. **成篇叙述**：正文自然讲人、制度和事件如何推进，介绍冲突、抵抗与后果。不要写“本研究/本轮/地图不应画/GIS精度/下轮补充”式编辑说明，放在后台 `reading_note`、`map_note`、`QUESTIONS`。
5. **JSON适配**：在 `CURRENT/SERIAL_ARTICLES/E6-Txx-<ascii-slug>.json` 维护研究稿，按既有 `data/stories/serial/ARTICLE_TEMPLATE_RESEARCH_ONLY.json` 编写。文章 `id` 对应长期登记ID，`sections[].source_keys` 必须关联稿内 sources 且对应总 SOURCE_REGISTER。
6. **时间审查**：`start_year/end_year` 表示**本文实际叙事覆盖**，各节 `period_start_year/period_end_year` 不得越出该时间窗（独立的前史/后续备注除外）；`historical_end_year` 仅在真实历史进程有可核实终止年时填写，绝不强制写1699。
7. **地图审查**：点需具名地并注明现代参照精度；航线需文献证实行动先后；不确定历史边界用有据虚线且禁止计面积；特许声索、贸易堡垒、短占、实际治理分开。`related_event_ids` 可以先是未发布研究候选，但母索引 `event_ids` 只能用真正已发表地图事件；**长期专题可以先于十年地图发表**，通过独立目录阅读。
8. **送审**：先运行本组JSON与ZIP结构自查，人工核查所有高风险历史断言；交还全文、来源claim矩阵、GIS候选、跨期延续、编审差异、未解决问题及完整累计ZIP。调查员只能标为`ready_for_editorial_review`，无权自行设正式母索引的`published+approved`。

## 3. 正式研究JSON必要字段
- 顶层：`schema=atlas-major-story-v1`, `id`, `parent_serial_topic_id`, `title`, `subtitle`, `region`, `start_year`, `end_year`, `historical_end_year`, `editorial_status=draft_research_only`, `lead`, `sections`, `sources`, `topic_source_claims`, `related_story_ids`, `related_event_ids`。
- 每节：`id`、`heading`、有据的`period_start_year/period_end_year`、`source_keys`、`paragraphs`；空泛段落不能以“待研究”凑数。
- 每项来源：`id`、确切馆藏/作者/题名的`label`、可打开的`url`、`access`（全文原件/转写/学术论文/官方解说/仅目录），并在claim矩阵保存原卷页码。
- 每个高风险claim：`claim_id`、对应章节、精确引文位置、断言属于计划/执行/申请/核付/损失估计的何种层次、出处访问深度、需要后续核对的相反证据及审核状态。
- 正式稿放在 `data/stories/serial/<ascii-slug>.json`，**不是**本地 CURRENT 目录；母索引 `article_file` 与 `id` 必须一一对应。新ID、状态与旧事件/主题之间的关系由编辑6统一审核。

## 4. 交付唯一完整累计ZIP
```
Editor6-AgentX-1600-1699-RNN-FULL.zip
  README_FIRST.md
  MANIFEST.json               # 每条完整路径/sha256/字节数/来源轮次
  CHANGELOG.md
  PROGRESS.md
  QA_REPORT.md
  HANDOFF.md
  ALL_ROUNDS/                # 所有上轮完整ZIP，无损保存
  CURRENT/
    SERIAL_ARTICLES/
    EDITORIAL/
    SOURCE_CLAIM_MATRIX.csv
    source_X/SOURCE_REGISTER.csv
    source_X/EVENT_CANDIDATES.json
    source_X/SPATIAL_CANDIDATES.geojson
    CONTINUITY.md
```
每次R08必须能从**这一份ZIP**恢复R01—R07所有资料；R09包括R08及以前所有资料。英文ASCII压缩包名，内部允许中文。实际测试CRC、MANIFEST完整性和SHA；旧稿修改需写变更记录并留旧轮原件。只有审核通过的研究材料才允许在GitHub独立分支保存，研究ZIP的存在不代表GitHub已经接收其二进制文件。

## 5. 统一上线门槛：逐项全部通过才交主编
- [ ] 题名与全文一致，历史阶段有真正的人物/行为/抵抗/结局，不是阶段编辑便条。
- [ ] 时段、母ID、前后篇、来源ID、唯一事件ID无冲突；前史和后世纪不断链。
- [ ] 关键伤亡、土地、奴役、财务数字有清楚分母与原卷页；目录没有冒充全文。
- [ ] 公众正文无工程术语/自我审稿话语，人物与机构首次出现有必要的中文说明。
- [ ] 已审 GIS 才允许点线面；不把临时袭击或公司特许变为大片实际殖民控制区。
- [ ] 文章先审证据再确定`publication_review`；未通过的保持`research_only`。
- [ ] GitHub PR、CI和实际网页检查通过；任何一个通过不替代其他条件。
- [ ] 最新完整累计 ZIP 的每个成员和上一轮快照SHA均可复核。

**甲组R07的具体修正方向：** [见完整审核](EDITOR6_AGENT_A_R07_PUBLICATION_AUDIT_20261019.md)。其他两组不得照搬其稿内“本轮未完”文字，必须把这类说明移到后台审查文件。
