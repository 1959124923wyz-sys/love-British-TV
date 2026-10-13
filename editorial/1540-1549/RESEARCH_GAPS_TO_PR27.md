> **2026-10-13主编3新增核查结论**：最新增量见 [REFRESH_20261013.md](REFRESH_20261013.md)。原清单Hailes 1548/49“尚未确定”的表述已被HES官方资料纠正——**1548年英军夺取后同年苏军收复，1548年末不再英占**。Dundee 1547年末短期英占及1548年再攻也已补入。缺乏古代实测军界和地图授权的问题仍未解决。

# 爱英TV｜第六章1540—1549未完成史料与疆界调查清单
2026-10-13 · 主编3正式发布审核附录，提供 PR #27 调查员继续研究；不否定已上架的史料。

**已出版的审查基线：** `data/atlas-1540-1549.json` 的49事件、23地点（包含英军短时控制的邓迪及1处法军Outreau，Hailes不再作为1548年末英占据点）、73条已选来源；研究来源索引已扩展至82项。**0片得到古代实测证明的新控制区Polygon**。第六章事件中30项有地点参考，19项在历史资料页中保留而不强配坐标。现有连续七片参考多边形仅沿用前五章旧形状，最新正式地图还保存15项英法据点GIS Point（14英军+1法军，含1547年末邓迪、已去除Hailes1548年末英占）。

## P0：优先真正改变地图准确性的缺口

1. **法国布洛涅及加来—吉讷历史实控古界**：1544—1550年Boulonnais实际城市、周围庄园和外围驻军控制范围未取得完整可授权、带年款的地理配准图。查 British Library `Cotton Augustus I ii 75/77`、Murphy 2019第3—5章引档、英方/法方当时军事地图。地图只绘地点；不拿现代市镇圈替代当年英军军政边境。旧Calais Pale继续虚线。
2. **苏格兰英军局部控制范围和结束时点**：1547 Eyemouth Richard Lee旧防御图、Broughty与Forthill遗址、1548 Haddington/Lauder/Dunglass驻军图、Hume 1548年底收复的证据边界。苏格兰仍是独立国家，个别城堡被英军占领不是整郡主权转移。核清旧城堡与现代遗址的区别。
3. **Hailes Castle 1548同年收复已得到官方二级来源支持**：HES说明英军夺城后苏军当年收复，现已纠正1548及1549年末英军控制。余项是**精确收复月日及原始书信档页**，不能凭此前二手“8月”说法补造日期。资料编号`SC-HES-HAILES-SOS-2019`。
4. **1549→1550持续状态继承**：Boulogne、Broughty、Eyemouth、Lauder、Dunglass、Tour d'Ordre、Forthill在1549年末的状态应分别带入1550研究种子；Ambleteuse/Boulemberg/Haddington/Inchcolm/Lochmaben/Hume不得“复活”。查1550实际归还、拆堡与撤军日期，不能仅根据现代介绍推测精确日。
5. **政治法权≠实控地理**：1541爱尔兰王国称号、1542 O'Neill、1543 Thomond/Clanricarde爵位、1546 O'Connor/O'More用兵须按地方实控/朝贡关系建立点、纹理或有据局部区域。爱尔兰全岛不允许因英王称号自动上色。参照 `IRISH_EFFECTIVE_CONTROL_RELATIONS_1540_1549.json`。
6. **布洛涅市区平民/地产受影响程度**：1545英军占用低城住房、修士建筑和迁居军屯有史料，但完整户数、地产清单及地租税收实证缺失；1546年“5000人”是政策计划上限，不能写成核实驱逐5000人。

## P1：当前19项未定位事件（源事件不必都强制放一个Pin）

> 第六章现有49事件，其中30项有不同精度的GIS代表点，19项不绘未经核实地点。**Pinkie战场和Tantallon城堡已获HES官方现代登记点**，但新增的Dundee 1547短时控制及1548年8月再次攻入仍没有经审核的整体城区战事精确坐标。原清单随正式Atlas实况更新如下。

| 年 | 事件ID | 未定位历史事件 | 已关联来源ID |
|---|---|---|---|
| 1542 | `1540S-003` | 苏格兰王权继承：玛丽女王时代开始 | SC-HES-2026-WOOIN, SC-HES-2022-HADDINGTON |
| 1542 | `1540S-044` | 乌尔斯特领主康恩·奥尼尔（Conn O'Neill）接受英王封号，保留地方统治网络 | IE-DIB-CONN-ONEILL-1542 |
| 1543 | `1540S-004` | 苏格兰婚约与英苏关系破裂引起战争 | SC-HES-2022-HADDINGTON, SC-HES-2026-WOOIN |
| 1543 | `1540S-005` | 爱尔兰托蒙德与克兰里卡德爵位授封 | IE-NLI-THOMOND-1543, IE-NLI-THOMOND-1543-MS, IE-NLI-THOMOND-1543-01JUL, IE-CLARE-LIBRARY-THOMOND-1543 |
| 1544 | `1540S-007` | 英军在法国布洛涅辖地使用军事威慑与土地控制 | FR-MURPHY-2019-IMP, FR-MURPHY-2019-SETTLE |
| 1544 | `1540S-008` | 英军侵袭苏格兰，战火波及城镇及周边 | SC-HES-2026-WOOIN |
| 1545 | `1540S-036` | 法军在布洛涅对岸乌特罗（Outreau）高地修建围城要塞 | FR-HELIOT-1958-OUTREAU-FRENCH, FR-OUTREAU-MODERN-LOCALITY |
| 1545 | `1540S-037` | 布洛涅英军建立“红堡”（Fort Rouge）海防炮台 | FR-HELIOT-1958-PLANS-PAGES |
| 1545 | `1540S-009` | 英王政府征收“自愿捐纳”筹集布洛涅战争费用 | GB-TNA-1545-BENEVOLENCE, GB-TNA-1545-FUNDING |
| 1545 | `1540S-038` | 英军在布洛涅低城区修筑港口要塞（Citadelle），征用居民地产 | FR-HELIOT-1958-PLANS-PAGES, FR-HELIOT-1958-POPULATION-DISPLACEMENT |
| 1546 | `1540S-012` | 英王再次征集军费以保卫加来、布洛涅 | GB-TNA-1546-CONTRIB |
| 1546 | `1540S-039` | 英军修建克莱门茨海岸工事（Clements Bulwark）保护布洛涅港 | FR-HELIOT-1958-PLANS-PAGES, FR-OPENEDITION-BOULOGNE-BULWARK |
| 1546 | `1540S-040` | 英军占领布洛涅后要求限制城内人口，并考虑驱逐留守平民 | FR-HELIOT-1958-POPULATION-DISPLACEMENT |
| 1546 | `1540S-045` | 英王政府向爱尔兰中部奥康纳（O’Connor）与奥莫尔（O’More）领主地进兵 | IE-HEFFERNAN-1546-MIDLANDS, IE-ELLIS-2016-LEINSTER |
| 1547 | `1540S-013` | 英格兰王位更替，爱德华六世即位 | SC-HES-2022-HADDINGTON, FR-MURPHY-2019-BOULOGNE |
| 1547 | `1540S-ED-DUNDEE-1547-CONTROL` | 英军进驻邓迪，1547年末曾短暂控制城镇 | SC-STANDREWS-DUNDEE-STMARY-1548, SC-DRISCOLL-1995-DUNDEE-LAW-1548 |
| 1548 | `1540S-022` | 苏法联盟推动玛丽女王赴法 | SC-HES-2026-WOOIN, SC-HES-2022-HADDINGTON |
| 1548 | `1540S-C3-NEW-DUNDEE-AUG-1548` | 英军再次攻入邓迪，城镇遭受火灾破坏 | SC-DRISCOLL-1995-DUNDEE-LAW-1548, SC-HES-2026-DUNDEE-BURNING |
| 1549 | `1540S-025` | 布洛涅英军军费与苏格兰驻军造成英王财政负担 | GB-TNA-1549-EDWARD-DEBT |

外交、王室整体法令与全国财政问题原则上保留年表即可；区域战争应先拆出有史料的具名战场和城镇。现在**具来源但仍无旧要塞坐标的项目**主要包括法军Outreau炮台、Boulogne旧Citadelle/Clements Bulwark及1548年Dundee第二次攻城的实际地理范围。不可把现代市区Polygon当战争侵占。临时英军地点旁的紫色低透明虚线形状全部为示意位置、不能进行面积统计。

## P1：财政与剥夺核算待核

研究文件 `research/periods/1540-1549/FINANCIAL_EVIDENCE.json` 现含8项财政对象。英国本土1545“自愿捐纳”估计£119,581、1549英王声称继承债务超过£300,000、休姆修堡£700的地方叙述都不是英占布洛涅的净殖民利润。布洛涅庄园地租、住房征占、军事支出实际账表需要逐宗档号、年份、受益方与币种；没有审核数字时保持`null`，禁止相加成“帝国掠夺总额”。

## 原研究档案行动清单（保留22项原编号）

以下直接承袭PR #27原始队列，不代表原文手稿已读：

| 优先级 | 任务编号 | 下一步应核对的原件或学术页码 | 研究来源线索 |
|---|---|---|---|
| P0 | 1540-Q01 | 英国图书馆 Cotton Augustus I ii 75, 77和其他1544-50年Boulonnais军事地图查馆藏图、原图年代、权利和法兰西地名 | `FR-BL-COTTON-1544-MAP-INDEX` |
| P0 | 1540-Q02 | Murphy 2019 Chapter4 source references：TNA王室定居委员会档案，逐庄园、租户地名核证 | `FR-MURPHY-2019-SETTLE` |
| P0 | 1540-Q03 | Murphy Chapters3,5 and 1546 treaty terms, garrison posts, pay records | `FR-MURPHY-2019-GARRISON` |
| P0 | 1540-Q04 | National Library of Scotland digital maps Richard Lee measured Eyemouth plan, plus Caldwell/Ewart 1980s excavation publication DOI and HES scheduled monument | `SC-NLS-1540S-MAPS` |
| P0 | 1540-Q05 | HES contemporary military source footnotes and National Library Scotland maps; war payroll muster | `SC-HES-2022-HADDINGTON` |
| P0 | 1540-Q06 | HES Broughty history and Haddington siege article, excavation identification of English 1547 detached Forthill earthworks | `SC-HES-BROUGHTY` |
| P0 | 1540-Q07 | HES 2017 article sources, British Library 1546 naval manuscript identification and garrison registers | `SC-HES-INCHCOLM` |
| P0 | 1540-Q08 | HES Trove NT53 47, RCAHMS 1924, Merriman 1975 historical fort plans | `SC-HES-LAUDER` |
| P0 | 1540-Q09 | HES siege 1548 and local Hugh Douglas sources, 1549 garrison musters | `SC-HES-2022-HAILES` |
| P0 | 1540-Q10 | Irish Parliament 1541 original session, National Archives Ireland record for Crown of Ireland Act officially 1542 c.1 | `IE-LEG-CROWN-1542` |
| P0 | 1540-Q11 | National Library Ireland Harleian MS6074 / Lambeth MS608 patents, local lordship maps including Clare and Galway actual holdings | `IE-NLI-THOMOND-1543` |
| P1 | 1540-Q12 | Scottish Parliament proceedings and HES citations, Year-specific effective treaty changes | `SC-HES-2026-WOOIN` |
| P1 | 1540-Q13 | Murphy 2019 Chapter2 and original Boulogne civilian/abbey letters | `FR-MURPHY-2019-IMP` |
| P1 | 1540-Q14 | TNA E370/2/23 enrolled 1545 benevolence account and E179 county returns | `GB-TNA-1545-BENEVOLENCE` |
| P1 | 1540-Q15 | TNA E179/185/233 commissioners, Treasury audited returns | `GB-TNA-1546-CONTRIB` |
| P1 | 1540-Q16 | TNA source original 1549 written royal reply to Western rebels and subsequent account reconciliation | `GB-TNA-1549-EDWARD-DEBT` |
| P1 | 1540-Q17 | Historic Environment Scotland Pinkie battlefield HES designation, campaign reports | `SC-HES-PINKIE` |
| P1 | 1540-Q18 | Treaty of Haddington parliament records, HES notes about Nunnery site | `SC-HES-2022-HADDINGTON` |
| P1 | 1540-Q19 | English Admiralty ship registers / Hakluyt critical editions, archival catalogue | `FR-MURPHY-2019-BOULOGNE` |
| P1 | 1540-Q20 | Next-year original surrender documents for Boulogne, Broughty, Lauder, Eyemouth, disputed Hailes | `SC-CALDWELL-EYEMOUTH` |
| P0 | 1540-Q21 | Start from Historic Environment Scotland Lochmaben Castle official chronology and NRHE 66315; examine 1544/45 Tudor / Scottish border letters and castle account rolls. Distinguish later modern Old Castle site NRHE 66314. | `SC-HES-LOCHMABEN-HISTORY`、`SC-HES-LOCHMABEN-SITE` |
| P0 | 1540-Q22 | HES official Designation GDL00154 documents English camp west of current Dunglass House used during Haddington 1548–49. Find contemporary Richard Lee/William Ridgeway plans, National Library Scotland maps, English garrison ledgers; separate earlier Dunglass burned castle from new English hill encampment. | `SC-HES-DUNGLASS-CAMP`、`SC-NLS-1540S-MAPS` |

## 交付规范

- 向原研究分支 `research/territorial-1540-1549-20261013` 分批提交新增 `SOURCE_REGISTRY.json`／对应 `CONTROL_TRANSITION_1539_1549.json`／GIS或增量调查结论；可在PR #27留言联动，**不直接改生产网页数据**。
- 对每项写明**已取得材料、无法取得材料、来源页码、真实控制时间、地图形状证据及是否可以合法公开重绘**，保留失败原因。
- 调查新城堡或法军防线时用独立 `stable_id` 和时间状态；如没有经证实边界，只提交Point、研究虚线、`fill_authorized:false`。
- 不合并已关闭的早期研究PR整包；调查新增补完由主编下一批逐项审核并选择性出版。编辑正式准入见 `editorial/1540-1549/PUBLISH_REVIEW.md`。
