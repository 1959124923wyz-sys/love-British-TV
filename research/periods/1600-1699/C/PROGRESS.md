# PROGRESS｜Agent C 丙01｜R06 batch 01｜2026-10-19

**GitHub分支**：`research/1600-1699-c-r06-agent01-20261019`，Issue #166；研究提交，不向main直接推送。

## 已完成实质工作
- 恢复完整R05共享Archive（211个文件），R05 C组78文件无损快照；制作丙组R06累计ZIP（外层 `Editor6-AgentC-1600-1699-R06-FULL.zip`）。该本地ZIP含 `ALL_ROUNDS` 旧档与 `CURRENT` 整合版，SHA256和ZIP CRC校验通过。
- R05 C组累计118事件及143来源，R06整合后125事件及155来源；新增C17-E119..E125和C144..C155见本分支delta及本地整合包。
- 1686–1690 Berkeley Castle日志官方编目港次14个，全部空坐标，未推断航海GPS、贩运人口与占领面积。
- 单列1678–1679苏拉特印度商人向公司两笔贷款 Rs45,000和Rs25,000，及1669年王室£10租金首付收据。
- 两篇原型符合研究层文章接口：E6-T12东印度公司、E6-T15财政信用。均 `draft_research_only`，段落 `source_keys` 与原文献键互联，未获出版批准。

## 尚未完成/不冒充
- 旧R05全部二进制归档在**本地R06累计ZIP**与ChatGPT Library旧包中。本Git分支上传可检索增量文本，不等同整份ZIP已经GitHub归档。
- 各馆藏档案的**原始卷页尚未全文研读**，目前多数是官方馆藏目录。BoE提供机构官方信息但非税务总账全文。
- SlaveVoyages完整逐船CSV及T70原账未核对，不增加人口总量与伪船次ID。
- 不写`data/atlas`、不发布网站、不改地图交互、不合并main。

## R06完整归档已永久保存（2026-10-19追加）
- 已成功上传ChatGPT Library：`/爱英TV/Editor6-AgentC-1600-1699-R06-FULL.zip`，此前本地R06完整包CRC与MANIFEST SHA256逐条通过。
- ZIP本身仍**未以二进制形式上传到GitHub**；本分支用于研究资料审阅。后续R07可直接在Library找到完整R06并继续累计。

## R07累计计划与首篇长篇实质编辑（2026-10-19）
- 已成功制作并校验完整 R07 ZIP，ChatGPT Library `/爱英TV/Editor6-AgentC-1600-1699-R07-FULL.zip`，文件SHA256 `fe13b554f2a5efaca4ecc4114c975cffe62a48d53df639d9bcad496677f226e8`，共179个ZIP文件。
- 全量包原样嵌入上一轮R06完整ZIP、继续保留R05 211文件；R07研究候选仍125项，来源从155扩至158项：BoE银行与奴役贸易研究C156、1694董事名册C157、1873法定解散法条C158。
- **首篇 E6-T15 已在完整ZIP的CURRENT/SERIAL_ARTICLES/下编辑为8节16段v0.2**，仍标记draft_research_only；E6-T12正文将历史结束时间修正为1874，与编辑6母索引统一，研究窗口仍只写至1699。
- `R07_SERIAL_EDITORIAL_ROADMAP.md`、`R07_EDITORIAL_TRACKER.csv`、`R07_E6_T15_PUBLICATION_GATES.md`已在本Git分支保存，可逐篇追踪。**新全文JSON仍以R07全量ZIP为最新版本；本PR原`SERIAL_ARTICLES_R06`路径保留R06研究快照，勿当R07最新全文**。
- R07包保存在Library，**不是GitHub二进制附件**，网站并未上线任何新叙事或地图。下一轮须从R07完整包继续累计，编辑6审校后另作正式发布PR。
