# 1500—1510｜跨对话研究交接入口

研究员1号 · 2026-10-12 · 分支：research/territorial-1500-1510-20261012  
正式统计时段1500—1509；1510年作为下一阶段衔接，避免事件和财政跨年代重复。

## 请依次阅读
1. [CONTROL_AND_CHRONOLOGY_REVIEW.md](CONTROL_AND_CHRONOLOGY_REVIEW.md)：整体历史叙述、地图控制范围和经济口径，优先阅读。
2. [CONTROL_CANDIDATES.json](CONTROL_CANDIDATES.json) 和 [SCOTLAND_CONTROL.json](SCOTLAND_CONTROL.json)：6个英王相关地区，4个苏格兰相关独立国家/群岛/条约条目；所有多边形为空。
3. [EVENTS_AND_ECONOMY_CANDIDATES.json](EVENTS_AND_ECONOMY_CANDIDATES.json)：13个事件与款项候选。每项有来源、事件年份及不确定说明。
4. [TRADE_ARCHIVES_AND_CORRECTIONS.json](TRADE_ARCHIVES_AND_CORRECTIONS.json)：最关键的会计与商业术语澄清，以及8份新源。
5. [SOURCES.json](SOURCES.json)、[SOURCES_SUPPLEMENT.json](SOURCES_SUPPLEMENT.json)、[SCOTLAND_AND_IRISH_SEA_SOURCES.json](SCOTLAND_AND_IRISH_SEA_SOURCES.json)：对应11+15+8个早期文献来源；苏格兰控制资料中另新增7个研究来源，共49个不重复ID。

## 四个接力研究专题
A. **加来属地**：TNA E36/269–272、DL28/2/1–11、E315/407；BL Add Ch 74072–75；建立1500—1509城堡/兵营/行政设施和地理疆界的可复核证据；法国地方档案协查。
B. **爱尔兰English Pale**：先查1500年前后王权在都柏林/四个服从郡的司法、财政和驻军以及1504年诺克多战役；先前资料在research/control-foundations-02-20261011；不要因战胜当地领主便将战场周边涂色。
C. **布里斯托尔英葡商团**：Henry VII 1501/1502个人授权、2025年发表的早期商团诉讼、1502年Gabriel购船、1505年Michael号安达卢西亚商贸诉讼；不能把海上商业和专利变成北美殖民地。
D. **苏格兰与群岛**：英苏1502和平条约NRS SP6/31、奥克尼/设得兰苏格兰王权、后1493西部希布里底群岛Clan Donald势力。1503联姻没有统一国家。

## 研究结果的可信范围
- 机构目录和公开文书转录可核；大量馆藏原始文件尚未逐页检查，不能谎称已完全验原本。
- 1500年布里斯托尔商人公司是地方商人自治组织，1501/1502获西航专利的是具名个人集团，不是殖民行政法人。
- 1500/1502年的航海王室金钱属于奖励/拨款，1505的20英镑是年金授权，法国每半年25000法郎属于外交条约约定义务；都不能简单统计为“英殖民利润”。
- 研究库内没有新批准的历史殖民地polygon，也未复制未核许可的第三方地图。
- 数据和政治控制类型保持分离，真正上图前需要各片地域的历史界线、实际政府运作及版权审核。
- 源ID检查通过，但机器不能证明历史论断的真实性。

请在各自独立研究分支写PROGRESS.md保存Git提交SHA并通过草稿PR交接，禁止直接更改main。下一位同事只要先读本文件和[CONTROL_AND_CHRONOLOGY_REVIEW.md](CONTROL_AND_CHRONOLOGY_REVIEW.md)，即可接力，无需回顾聊天。


## 第二轮深入研究成果（2026-10-12）
**请优先阅读 [DEEP_FINDINGS_CALAISES_AND_IRELAND.md](DEEP_FINDINGS_CALAISES_AND_IRELAND.md)，为第二轮最新总结。**
- [CALAIS_DEEP_SOURCES.json](CALAIS_DEEP_SOURCES.json)：13条加来具体原始档号和历史测图研究索引。
- [CALAIS_CONTROL_FINANCE_DEEP_EVIDENCE.json](CALAIS_CONTROL_FINANCE_DEEP_EVIDENCE.json)：7条加来驻军、教区/控制、经费分配与历史地图不可跨年代使用的提醒。1502城堡驻军名册号 E101/55/23。
- [CALAIS_STAPLE_CROWN_REMITTANCES.json](CALAIS_STAPLE_CROWN_REMITTANCES.json)：5条财政研究来源、4条学者账目重建；重点 E101/201/28。1505—09用于薪饷平均约£5,784/年、入英王之手约£4,020/年，1500—09向王室累计接近£32,000。**全部原账待核，不是殖民净利润，重叠数字不能相加。**
- [CALAIS_PARISH_AND_MAP_DATING_INDEX.json](CALAIS_PARISH_AND_MAP_DATING_INDEX.json)：5条历史地理来源、13个历史地名及堡垒候选；1482—83年土地租册 E315/407并不能生成1500年确定疆界；后来的1556地图也不得倒推。
- [IRELAND_PALE_DEEP_EVIDENCE.json](IRELAND_PALE_DEEP_EVIDENCE.json)：7条史学与档案入口、8条文书支持的英格兰Pale行政与军事权力论断；中世纪名义郡≠现代郡≠实际统治。
- [GAELIC_ANNALS_LOCAL_POWER_EVENTS.json](GAELIC_ANNALS_LOCAL_POWER_EVENTS.json)：《四大师编年史》8条1503—09爱尔兰地方政权、攻占城堡和临时进军史事；已按UCC CELT**正式刊行版编号校正**。
- [CASTLE_CONTROL_TURNOVER_1503_1512.json](CASTLE_CONTROL_TURNOVER_1503_1512.json)：1507 Carrickfergus及1509 Omagh由《阿尔斯特编年史》再核对；1512 Omagh重建作为下一期证据，而非1509英方长期领有。
- [NEXT_AGENT_ARCHIVAL_ACTION_QUEUE.json](NEXT_AGENT_ARCHIVAL_ACTION_QUEUE.json)：11项下一位同事可直接执行的档号级研究任务。

**史料分级**：加来驻军551/553和商人财政£5,784/£4,020/£32,000来自Grummitt学术著作对英国国家档案馆卷册的整理，当前尚未直接见到原始账册或兵员名册，不得标为原件核证；爱尔兰编年史仅以独立文字转述保存，未复制第三方受限原文。此次仍为0个可批准的1500—09殖民控制面。
