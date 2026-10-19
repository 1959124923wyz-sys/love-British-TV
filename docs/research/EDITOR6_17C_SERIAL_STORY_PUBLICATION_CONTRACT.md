# 爱英TV｜17世纪跨十年/跨世纪专题上传与发布接口 v1
状态：研究分支待审｜总编辑：编辑6｜生效日期：2026-10-19

## 一、原则（严禁把十年章节当成历史进程截止日期）
全站保留原来的“世纪 → 十年 → 逐年”时间轴，\`data/chapters.json\` 每十年继续是固定导航单位。大事件改用独立 **serial topic / 母专题**：可以覆盖1594—1703、1600—1874、1627—1838等持续进程；只保存一份共享的长篇叙事正文和永久专题ID，而不是每十年复制一篇正文。各年度事件仍由当年atlas数据和地图审批决定是否出现，不因专题正文提到未来而在旧年份提前点亮地图。

**已存在的传统专题：** \`data/stories/index.json\` 与 \`data/stories/*.json\` 维持原样。17世纪新系列：\`data/stories/serial/index.json\`，由现有 \`js/history-stories.js\` **额外读取已批准条目**；初始15组均 \`research_only\`，不会自动出现在网页。一个专题开始于1600、延续至1700以后，不要求先有1600—1609十年章节页面；准备可从任何年代、任何模块开始。

## 二、永久母专题索引字段
- \`id\`：如 \`E6-T12\`；永久ID，不能以章节重编号。
- \`title\` / \`arc_family\` / \`lead_group\`：公众题名、跨世纪母进程、主要编写者。
- \`origin_year\`：有史料支持的历史背景或起源年份；不能等于本批搜集初始年份。
- \`historical_end_year\`：有可靠证据的制度或历史实体结束年；仍在继续、政治转化有歧义用 \`null\`。与“1699年结束本轮资料收集”严格区分。
- \`research_window\`：本次研究覆盖的 \`start_year/end_year\`，只描述取材范围，不代表政治/社会进程的起止。
- \`continuation_note\`、\`predecessor_ids\`、\`successor_ids\`：链接16世纪已发生史事及18世纪后续；后期扩充不得改旧 ID。
- \`segments\`：可选，表示这篇大叙事在十年导航中的位置（\`start_year\`, \`end_year\`, \`status\`, \`event_ids\`, \`prev_segment_id\`, \`next_segment_id\`），是**阅读和关联切片**，不是独立长文副本；不得用“时间窗末年”填作\`historical_end_year\`。
- \`event_ids\`：关联已审核的地图事件；**所有正式点击入口仅在对应年份事件真实上线后才显示**。同一行动在不同专题可相互关联，但不得在事件数据中重复造编号。
- \`article_file\`：长篇JSON的唯一正文文件；只准 \`data/stories/serial/<slug>.json\`；写在GitHub并通过校验后才能发布。
- \`status\`：\`research_only\` / \`editorial_review\` / \`published\`；若\`published\`还须\`publication_review:"approved"\`，否则前端忽略。
- \`source_register_path\`：可追溯专题证据台账；不构成正文直接被审查批准。

## 三、一次跨世纪专题如何上架（自动兼容现有十年结构）
1. 专题作者在独立分支写**一篇** \`data/stories/serial/<slug>.json\` 长篇正文，复用旧 \`atlas-major-story-v1\` 文章格式，包括\`id,title,subtitle,region,lead,sections[].paragraphs,sources\`等；正文的\`id\`必须严格等于母专题索引id。
2. 同批补索引 \`data/stories/serial/index.json\` 中对应项的 \`article_file\`、\`event_ids\`、实际关联年段和前后段ID。正文可以穿越多个世纪，**不需要十年切割**。
3. 作者提供 \`topic_source_claims\`（研究层的主张→来源键→原卷具体页/核验深度），向主编申请审核；重大伤亡、财政、土地面积和历史控制范围必须单独核原文。
4. 通过质量审查后，主编把索引项设为 \`status:"published",publication_review:"approved"\`，再运行 \`node scripts/test_serial_story_contract.js\` 与全部旧回归。未通过审校保留\`editorial_review\`，不硬上。
5. 经审核的**年度地图事件**仍使用既有 \`data/atlas-1600-1609.json\`、\`data/atlas-1610-1619.json\` ...；主编按实际数据审核发布哪个十年，与大专题正文出版相互独立。后续1700年和1800年继续复用一个母专题ID、同一正文，而非再次起新篇。
6. 正式可见：已有地图事件详情将自动得到该母专题阅读入口，前提是其ID列在已批准的 \`event_ids\` 中。未有正式地图事件的研究内容不能靠本接口偷偷多出地图图钉、殖民疆域或额外“已发生”计数。

## 四、时间断点示例
- 东印度公司：1600贸易公司成立；1858印度统治权移交；1874公司法定解散。三种历史概念分别标注，不把1600—1699本轮研究窗口当作公司历史截止。
- 跨大西洋贩奴与奴隶制度：1807英国奴隶贸易法、1834帝国废奴法生效、1838学徒制退出分别编号；不同地区及例外从原始立法核定。
- 苏格兰达连：首航1698、1699殖民困境、1700继续演变；1699不能被强制认为事件结束。苏格兰王国也不能因1603共主被标成“大不列颠王国”。
- 哈德孙湾公司：1670特许区域声索并不等于整块流域实际控制；York Fort早年遗址与今日第三代York Factory遗址不是同一城堡的精确坐标。

## 五、空间、史实与保存门槛
- 研究、原始录入、专题出版、GIS上图分四层。任何 \`research_only\` 记录不得直接进入正式 \`data/atlas\` 或主图。
- 发生点：史料有具名地，标注现代参考点精度；未知不造经纬度。线：有据真实行动顺序才画示意虚线。面：只允许有历史证据的区域，推测疆界只能虚线研究层，不可当实控面积。
- 任何具体失控或退出需要事件源证；\`last_documented_date\`、\`historic_end_date\`必须分开。
- 事件/法案原文与计划执行分开；王室、公司、地方殖民军、苏格兰独立政府、私掠者、海盗、当地合作方和抵抗者分别归责。
- 不修改已经批准的交互样式、颜色、手机端；每组Git独立分支，主编审核、CI和真实网页验收后合并到生产。
- 完整原始调查包可供他组调用；未上传的本地文件不得宣称GitHub已有。

## 六、提交给编辑6最小目录
\`\`\`
research/periods/1600-1699/<A|B|C>/
  TASK_BRIEF.md
  TOPIC_INDEX.md
  TOPIC_DRAFTS/*.md
  SOURCE_REGISTER.csv
  SOURCE_CLAIM_MATRIX.csv
  EVENT_CANDIDATES.json
  SPATIAL_CANDIDATES.geojson (仅有可靠空间对象时)
  CONTINUITY.md
  PROGRESS.md
  HANDOFF.md
\`\`\`
单篇审定后再转换为正式 JSON，不得将研究 markdown 直接当作公开专题正文。

## 七、独立专题目录（解决“先出专题、后填事件”）

正式年度地图数据没有准备好时也允许先发布已经完成史料审核的长篇母专题。只要母索引的 `status` 为 `published`、`publication_review` 为 `approved`，同时正式正文 `article_file` 已通过Schema审核，网页才自动启用顶部低调的「长期专题」入口。观众可以从独立目录进入文章，而不需要先发表其所属十年地图事件。目录没有审核通过的专题时，入口默认隐藏，不改变现有网页布局。后续发表具体年度事件后，原有事件卡片自动复用同一篇全文作为延伸阅读，并按实际年份逐年显示，不允许凭专题正文提前出现地图图钉或殖民地边界。旧十年导航、章节源文件和事件统计不变。
