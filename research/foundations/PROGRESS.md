# PROGRESS · 爱英TV信息搜集人1号（基础资料第2批）
**2026-10-11｜分支：`research/control-foundations-02-20261011`｜工作目的：可靠的“实际控制”疆界数据工程地基**

## 完成情况
已将研究结果逐个文件直接创建并保存到 GitHub，未改 main，未绘制未经确认的殖民统治面。完成9个文件和9次阶段性Git提交（以下为截至本日志写作的提交历史）：

| 提交SHA | 保存的成果 |
|---|---|
| `85ee811290384ba7dce7b2c09b937941530484f6` | `ARCHIVAL_SOURCES_BATCH_A.json`：15条国家档案馆/图书馆/大学目录入口（TNA SP/CO、BL IOR、TCD） |
| `d36f009164792c2b8a871026cb98453d62e14e97` | `SPATIAL_DATA_AND_LICENSES.json`：7项GIS/地名/地图项目的年代与许可 |
| `dbbb37f49b17c6955f8fb65d8513b5ea2eef69e2` | `IRELAND_PALE_1470_1550_EVIDENCE.json`：6条学术摘要支撑论断；无polygon |
| `7be3124f721beb743e4dd54a571cb0275e65f132` | `FISCAL_AND_EXTRACTION_SOURCES.json`：11条财政来源及2条待核议会数据示例 |
| `5371ab9ee5e06affa5d5abd9846a93987f783189` | `HISTORICAL_ACTOR_TRANSITIONS.json`：6条历史政治主体转折与精确日期口径 |
| `989bf310d0a8d1969070366007a684949a2c5bdb` | `RESEARCH_EVIDENCE_STANDARD.md`：完整证据/控制判定/财务/地理/版权规范 |
| `056085f7edbb23dbb606ace52359b7c72dccae11` | `CONTROL_EPISODE_SCHEMA.v1.json`：候选控制片段的JSON Schema（待维护者审核） |
| `1fc46eb87ce38966712bf80152b1782b8f845777` | `README.md`：跨研究员阅读顺序、分工及合并规则 |
| `c5d4f23ef08b1a0f8f47227f0fd96b88925aaffc` | `CROSS_BRANCH_CORRECTIONS.md`：已有旧研究文档易误读事项与CShapes许可澄清 |

所有9个文件都位于 `research/foundations/`。与本项目现有 `research/collector-01-foundations-20261011`、`research/control-evidence-foundation-20261011` 两分支相互补充，但不修改它们的内容。

## 对未来研究有决定性影响的结果
- TNA的 `SP60—67` 爱尔兰国事文件时间从1509年开始，单靠这个目录**无法**解决1490年代英王有效统治疆界。
- Ellis（2021）专著的经审读摘要显示1495年English Pale法律称呼、四个受服从郡与实际行政范围不一致、1488年局部军事边界线索。可信度为`academic_abstract_checked`；一手文书和完整地图尚缺。
- `IOR/X` 是单独的英国图书馆印度事务地图系列；不应只检索公司特许状 `IOR/A/1` 或经济文书 `IOR/L/E`。
- Natural Earth 官方允许公有领域地图再利用，能作现代参照。CShapes 2.0（美国国会图书馆下载版）标注 CC BY-NC-SA 4.0；WHG多来源许可+令牌；都柏林Down Survey GIS未获批再分发；不应默认为同一版权层级。
- 1823年议会辩论举出一些殖民地方税收、地方支出及英军支出的分账数字，反映“殖民控制=财政纯获利”不能自动成立。经济研究应研究实际受益人和资金流向，而非用既有主题筛掉矛盾数据。

## 遗留事项（按先后顺序）
1. 查 Ellis 完整章节和书内的历史附图目录，追查1495/1488爱尔兰法令原文、历史税收及军事记录，尤其如何界定虚线范围。
2. 确认 Ireland Pale 区域地图如有可再分发的权利、是否需手工数字化；历史地名有重名，不能凭当代GPS拼接出1490年代准确polygon。
3. 对 Jamestown 1607 限定为定居点控制单元，找到同期治理/驻军、Powhatan地方权力资料之前，不以现代Virginia州界做实心橙色。
4. 为 TNA各类 CO 蓝皮书寻找确切可访问卷次/年度与单个殖民地的账目科目；英国本土拨款、地方税收和私人获利始终分开。
5. 真实控制数据按国家/公司/保护国/军港/局部军占分类，每片疆界分成有起讫日期的 episode。留空不等于“没有别国治理”。
6. 其他同事复用 `research/foundations/README.md` 按专题领分支；网页维护者审阅Draft PR之后，选择性合并来源与规范，不直接上线任何本批候选polygon。

## 证据状态和权利说明
本批完成的是 **权威来源入口及少量学术摘要论断** 的基础研究，不是原始档案的系统逐件数字化。第三方GIS/历史地图再分发权利逐库注明未核或条件许可。部分历史地理仍只有文字摘要，没有可证明的闭合疆界，因此本批刻意生成了**0个新控制区多边形**。

**下一位研究员请从 `README.md` 开始。**
