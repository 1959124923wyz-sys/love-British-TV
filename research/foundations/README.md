# 爱英TV｜信息搜集人1号：实际控制区研究地基（第2批）
**截至 2026-10-11｜研究分支 `research/control-foundations-02-20261011`｜仅供跨对话研究。**

## 一分钟读懂
项目计划以1490年代至当代的十年浏览刻度，展示英格兰/苏格兰/大不列颠/联合王国实际控制的地区，并在有史料时叠加政治变迁、土地剥夺、税收/贸易、强制劳动与抵抗事件。**实际控制范围优先于经济流动网络；早期海外特许不等于已经殖民。**

这是第二份独立研究基础包（前一包见 `research/control-evidence-foundation-20261011`、Draft PR #2）。为避免其他对话覆盖 main，所有新增文件位于本分支 `research/foundations/`，网页维护者审查后再选择性合并。

## 本批新增文件与用途

| 文件 | 任务与证据状况 |
|---|---|
| `ARCHIVAL_SOURCES_BATCH_A.json` | **15**个已核对官方档案馆、国家图书馆、大学项目的资料入口及系列号：TNA State Papers Ireland / Colonial Office / CO700、British Library IOR/A、IOR/L/E、IOR/X、IOR/R，TCD Down Survey等；都是**目录层核实，不代表逐卷阅读**。 |
| `SPATIAL_DATA_AND_LICENSES.json` | **7**个时空地图、地名索引和许可对象：Natural Earth、CShapes2、World Historical Gazetteer、NLS、GeoNames、Down Survey；哪些资料可再分发、哪些有不容忽视的限制。 |
| `IRELAND_PALE_1470_1550_EVIDENCE.json` | 以Steven G. Ellis的专著等为基础，列出1490年代英格兰Pale的**6个带出处历史论断**和4个未决档案任务；**0个可发布实控多边形**。 |
| `FISCAL_AND_EXTRACTION_SOURCES.json` | **11**个财政、奴隶贸易、奴隶主获赔及印度经济档案入口+2条仅示范的议会统计论断，区分当地公共财政、英国本土拨款、私人利润与净转移。 |
| `HISTORICAL_ACTOR_TRANSITIONS.json` | **6**个从1600到1922年英格兰、苏格兰、英国及东印度公司的政治主体变化节点；避免错误追认当时不存在的国名。 |
| `RESEARCH_EVIDENCE_STANDARD.md` | 控制分层、地理证据L0–L4、日期不确定性、来源与权益、数字口径及审核闸门。 |
| `CONTROL_EPISODE_SCHEMA.v1.json` | 拟议机器可读字段结构：史实论断、控制关系、参与主体、有效期、不确定地理、财务关联；**此结构尚未接入前端，需维护者审查迁移**。 |
| `PROGRESS.md` | 来源与提交SHA、剩余风险、下一轮研究优先级。 |

## 当前达到的研究成果
- 第一批目录来源用真实官方/学术网页逐项查过用途，包含可追溯URL及该机构自身规定的访问与再发布注意事项。
- 确认都柏林附近1490年代Pale不能用现代爱尔兰疆界、或四个历史郡的全部行政边界作为实控范围。1495年法令及1488年局部防御边界线索已与学术研究挂钩（全文与原始法律待核）。
- 明确不同账户口径——王室或殖民政府财政收支、地方商人获益、糖业私人利润等，不能简单相加为“英国赚到的钱”；原始文献有部分殖民地亏损的记录，因此应保留实际情况。
- 用英议会法律和研究说明1603、1707、1801、1858、1922等主体变化，而非按现代国名静态填图。
- 已建立某些地图的许可分类：Natural Earth公共领域；CShapes2美国国会图书馆版标明CC BY-NC-SA 4.0；WHG混合许可且API令牌；Down Survey须另行核实地图与GIS再使用权。
- **没有**声称已完整搜集几百年殖民边界，也没有下载或复制任何有疑问的第三方地图原件。

## 与已有工作如何兼容
1. **主地图**：`main/data/atlas-1497-1500.json` + `main/docs/EVENT_VISUAL_HIERARCHY.md`。现阶段仍是远航试运行，研究包不会自动成为上图事件。
2. **前一轮资料**：`research/collector-01-foundations-20261011`，Draft PR #1（卡博特及其他早期航行候选）。
3. **第一版控制方法**：`research/control-evidence-foundation-20261011`，Draft PR #2（11项资料入口、3个控制类型试点）。
4. **本批**：相对PR #2进一步核实和细化。来源ID避免在后续重整时被重新命名；任何映射由维护者实现。不应全量合并相同文献入口而造成重复。
5. 网页维护者可先评审**研究规范和来源目录**，可视化必须另外过年代与边界审核，不建议按 `control_episode` 的一项未审记录绘制填色。

## 其他研究员接棒的最佳方法
- **首位深入研究员**：专做 `1470–1550 English Pale`。从 `IRELAND_PALE_1470_1550_EVIDENCE.json` 出发，核原始1495/1488法令及其空间意义，找15世纪王权实际征税/军政记录。边界证据不足时仅绘局部虚线边段。
- **第二位**：专做1600—1700年早期北美/加勒比行政据点。先查 TNA CO 1/5 和 Colonial State Papers，再查美洲地方档案，证实城镇/驻军，绝不能按皇家特许一次性画满整个殖民地。
- **第三位**：英国图书馆 `IOR/A/1` 特许、`IOR/X` 历史地图、`IOR/L/E` 财政分离，寻找实际行政控制与收益流向的证据。
- **第四位**：19—20世纪CO/DO/FO官方地图与属地行政，再按CShapes2核对长时段外部疆界，但不把学术数据集自动视为原始史料。
- **共享QA**：史料目录补充对应件号/folio/页码、版本日期和版权；共享区域名称规范、同名地点歧义和行政失效时间。

## 交接工作程序
**source → claim → period → actor → control_facets → geometry/uncertainty → finance separately → review → PR → optional main merge。**

新增调查不要改变 `main` 或在现有研究分支中乱改。每位同事在自己的 `research/<topic>` 分支保存 `PROGRESS.md`，每个阶段确认Git提交成功才标记“已保存”。不知确切年份、人口或版图用 `null` 和待核标记，不得“猜个差不多”。
