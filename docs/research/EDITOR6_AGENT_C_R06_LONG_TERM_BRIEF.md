# 爱英TV｜编辑6下发第六轮起长期任务｜调查员丙

**主攻：非洲、亚洲、贩奴航次、海上战争及财政资本**

## 具体研究任务
母专题 E6-T11—T15。沿用前五轮所有调查成果，进一步核查东印度公司1600—1699商站的特许、司法/征税权限、印度洋强制劳工、1686—1690与莫卧儿帝国冲突，逐个辨认公司、王室、地方政体。核查非洲皇家冒险者公司和皇家非洲公司的股份、财务账簿、海岸堡垒、当地贸易中介及延续至18世纪的制度；船次依据SlaveVoyages和原始日志核对，禁止将所有航次估计人数都算作公司实际贩运量。航海法执法、英荷战争、非法海盗与有授权私掠、1694政府借贷、公司实际利润分别建账。

重点深挖：1680年代马德拉斯/苏门答腊拐带与强迫劳动文书，区分“提出、获批、执行及真实人数”；1690年代印度洋海盗与贸易争端；货币、航运、公司特许的证据等级。B负责美洲登陆后的劳动与当地法规，A负责爱尔兰/苏格兰内部镇压和地权。重复航次一律共享唯一ID和来源，互链而不重复计数。

## 每轮只交付一个全量累计ZIP
新的 R06-FULL 压缩包必须**包括 R01—R05 的全部成果与本轮新增**，此后 R07-FULL 必须包括 R01—R06 的全部成果和第七轮新材料。绝不能只提交本轮delta。使用纯ASCII外层文件名 `Editor6-AgentC-1600-1699-R06-FULL.zip`；内含 `ALL_ROUNDS/`（旧轮无损快照）、`CURRENT/`（最新整合版）、`MANIFEST.json`（文件sha256+大小+轮次）、`CHANGELOG.md`、`PROGRESS.md`、`HANDOFF.md`、`QA_REPORT.md`。保留每条来源的卷页、深度与核实情况。旧轮缺文件不得宣称已全量累积，须先接回第五轮ZIP。

发出前测试CRC、路径及SHA256、来源关系、文件数，无临时缓存；所有历史连续体用ARC母编号，E6-Txx专题用长期ID，十年是显示段落不是结束年份。不得将未经审查资料直接写入正式地图，不得自行合并main。GitHub研究分支另可按批保存成果，但不能冒充完整ZIP已远端存档。

## 相关标准
- docs/research/EDITOR6_17C_SERIAL_STORY_PUBLICATION_CONTRACT.md
- data/stories/serial/README.md
- AGENTS.md
- docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md
- docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md

后续第七、第八轮持续扩大范围，最终向编辑6交付一个可以解压复用、包含全部历史研究材料的累积总包。

## 正式长篇写作交付（新增强制项）
在既有专题MD研究底稿之外，至少把证据最完整的专题转写为 `CURRENT/SERIAL_ARTICLES/E6-Txx-<slug>.json`，严格参照GitHub的 `data/stories/serial/ARTICLE_TEMPLATE_RESEARCH_ONLY.json`。一篇历史进程只产生一份可读完整长篇，即使跨越十年、几十年、数百年，也不按每个十年硬分十篇。每节写具名人物、冲突与制度如何发生及实际后果，`sections[].source_keys` 必须对应真实核阅来源。完成稿仍标记 `draft_research_only`，不要自行设为 `published`，由编辑6与主编核定。正文之外保留 `topic_source_claims`、跨世纪 predecessor/successor、地图事件 ID、争议与精度，不把审稿备注写进公众文章。
