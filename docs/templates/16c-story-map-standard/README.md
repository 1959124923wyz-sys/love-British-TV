# 16世纪重大历史专题、影响区与地图互动：永久制作范式

**2026-10-21｜编辑审核纲领 v1.0｜适用所有新专题与地图研究｜桌面优先。**

**源项目中真正已上线的16世纪范例**是本纲领的唯一代码参照，不再允许把没有正文事件超链接的纯文章当作完整“重大专题”提交。

## 导览与文件

- [ZIP：16世纪专题原始范例及操作规范](16C_stories_cartography_interaction_reference.zip)（自动从当前GitHub主干提取源文件、代码片段、史料研究地图及既有规范打包，仓库持续保存）。
- 本纲领直接附于`AGENTS.md`，调查员开工前阅读；压缩包有原始示例、源代码摘录和SHA256溯源清单。
- 主要范例：`data/stories/drake-panama-mule-train-raid-1572-1573.json`、`data/stories/munster-desmond-1579-1586.json`、`data/stories/hawkins-lovell-atlantic-enslavement-1562-1569.json`。
- 地理范例：`data/nine-years-war-operational-impact-1594-1599.geojson`、`data/early-war-colonial-impact-1544-1575.geojson`、`data/eleventh-influence-areas-1590-1599.geojson`、`data/war-occupied-zones-1540-1549.geojson`、`data/political-relations-1570-1579.geojson`。
- 技术范例：`js/history-stories.js`、`app.js`（ZIP摘出4个关键渲染/定位函数）、`css/history-stories.css`；测试`scripts/test_major_story_pilot.js`及后来的`scripts/test_editor7_17c_inline_story_map.js`。

## 一、长篇专题必须是能导航的历史过程

**结构：** 史实背景、各方动机与融资 → 有据年月的行动节点 → 非英国政治主体的抵抗与反击 → 直接战争/贸易影响 → 统治/立法/产权变化 → 受害者处境与长期后果 → 交代历史阶段结尾（不是编造历史自然终止）。

- 章节ID稳定，`sections[].paragraphs`写自然、书面的历史叙述；`source_keys`按每节绑定已核来源，`sources`具作者、机构、标题、URL、原件/目录阅读深度，重大主张另列来源矩阵。档案目录≠逐页阅读；法令允许没产≠已经把每块地产交割。
- **正文必须嵌入真实地图事件链接**，例如16世纪已发表的`[[1570S-E021|丁格尔登陆与战争爆发]]`、`[[1570S-E030|阿斯基顿遭袭]]`，这些事件都来自当前正式Atlas。链接须散布在事件发生、抵抗、转折与后果相关段落，而非只堆在文章开头。
- **链接锚文本必须是一段有信息量的历史事件词句，而不是日期按钮。** 16世纪《亨利八世出兵法国》的范例是`[[1513-THEROUANNE-SIEGE|英格兰军队与哈布斯堡盟军开始围攻泰鲁阿讷]]`，不是`[[1513-THEROUANNE-SIEGE|1513年]]`。正文先自然交代“1513年”，把超链接放在“谁采取什么行动／在哪里发生什么／获得何种结果”上。已可解释事件的正式史名（如《利默里克条约》、博因河战役）允许直接链接；仅有年份、单独年份加月份、无意义的“这里”“查看”或与目标事件不相符的孤立地名均不合格。不得通过把事件标题生硬粘贴进句子、重复动作或捏造史实来凑链接。例：“1689年，[[1680S-E035|莫卧儿方面夺取维沙卡帕特南和马苏利帕特南的英商商馆]]”；不写“[[1680S-E035|1689年]]……”。
- **必须检查目标事件的真实主体、行为和地理含义。** 例如1672年皇家交易所付款指示不能用`[[1670S-E008|公司在伦敦集资]]`概括；应写约克公爵对拟购买被奴役人口的种植园主提出预付款要求。链接标签不能将“同地发生的另一件事”或“仅时间接近的其他事件”冒充本事件。缺乏符合事实的对应事件时，保留普通文字和来源，不凭空创建事件ID或关联公司。
- 只有实际已登记的历史事件、准确对应的年份和有来源的现代具名地点才准连接；允许没有可靠位置的事件保持文字档案，不准发明坐标凑链接。**严禁往JSON正文注入HTML onclick**。
- 新专题`data/stories/serial/index.json`母题按仓库的`published + approved`门禁审核；跨十年长篇保持同一个稳定ID和返回路径，不按十年拆成重复文章。

## 二、影响区到底该怎么画

| 历史对象 | 对应16世纪范例 | 表现 | 禁止推断 |
| --- | --- | --- | --- |
| 经核政治控制区域 | 加来城市/真正可审历史边界 | 有边界证据才实色控制面 | 地名凸包即实测边疆 |
| 已证据点驻军/治理 | 都柏林行政中心、英军城堡 | **Point + 固定屏幕像素控制符号** | 圆半径即历史疆域面积 |
| 具名地方军行动/破坏 | 1594–1595恩尼斯基林、1598黄渡口、1544利斯爱丁堡 | 低透明度+**虚线Polygon研究区** | 框内每处发生战斗、英国拥有全郡 |
| 地方反抗、重新夺堡 | 九年战争按`year_stages`区分1594/1595 | 独立年份与政治主体 | 英军战败竟变英国新增殖民区 |
| 行动顺序/航海联系 | 德雷克1572点到点，九年战争路线 | 有证方向的**虚线LineString** | 任意线是船舶GPS、现代公路或沿线受害区 |
| 商馆/贸易与外交 | 非政治控制的公司商业关系 | 青绿点/关联线 | 公司有通商许可即在当地拥有主权 |

无实际历史边线、只依靠有据具名地名制作的研究几何，强制`historical_boundary_confirmed:false`、`fill_authorized:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`，适当补`territorial_claim:false`，不得进入`colonial_polygons`，也不得生成任何虚假的平方公里数。每条多边形保留`source_ids/source_urls`、`related_event_ids`、`named_anchors`、`mapping_method`、`start_year/end_year`、`uncertainty`等。面积符号**屏幕像素单位**，不是地面公里。

不同政治状态有不同配色/纹理：英国直接控制/城核、特殊属地、独立苏格兰/当地政治体、地方抵抗、公司贸易、战场等不能一色涂满。史料仅证明城市发生短期袭击，不能生成永久英国殖民行政区。

**跨年代稳定控制：** 新十年必须对旧`stable_id`给出continued/ended/transferred/uncertain等去向。年滑块是当年年末状态；事件按实际年份显示，驻军/有据管治按起止时段持续。证据最后记载年不同于史实证实的撤离日期。

坐标注意：GeoJSON为`[lon,lat]`，某些16世纪`atlas-*.json routes[].coords`实际是`[lat,lon]`。必须阅读前端解析器再转换，不得直接复制。

## 三、16世纪已经运行的互动逻辑，必须复用

1. 点击正式历史事件档案，相关重大专题入口由`HistoryStories.eventLinkMarkup`生成。
2. `js/history-stories.js`中`renderInline`解析`[[事件ID|词句]]`，安全转义为`.story-event-link[data-story-event]`金色正文链接。
3. **单击**根据真实目标事件`item.year`切换年轴，调用`atlasStoryBridge.focusEvent`，由`focusEventFromSidebar`执行Leaflet `map.panTo([lat,lng])`；文章保持可读，镜头平滑移动、不擅自变焦。
4. **双击**进入原事件档案，返回按钮恢复原专题；另一个返回按钮恢复打开专题时的入口事件和年份。
5. 空坐标/未来事件不得让地图瞬移；有证现代城市代表坐标也不等于精确战场。
6. 17世纪跨年代地图ID查询已在PR #198修复，`app.js`的`eventById`必须查询`...serialPreviewByDecade.values()`，否则十个年代之间的链接会“点了没反应”。

**沿用且不得破坏：**「版图」「事件」双开关；世纪→十年→年份时轴；事件主标记聚合与展开；既有桌面左右栏目。不为手机另造冗余交互。

## 四、每位调查员和主编的最小交付清单

1. 资料：逐项claim→来源编号、卷页或档案目录、阅读深度、地理证据等级。
2. 正文：完整章节JSON、自然叙事、主要相关事件链接、注册母题索引。
3. GIS：有据控制/地点/方向线/地方军事影响面，明确“是否真实历史边界”；不能画的存研究缺口。
4. 年表：首次确认/结束/最后可证三个日期和每年的占领主体，跨年代连续台账。
5. 测试：静态合同、JSON与地图语义，桌面Chromium测试实际正文链接**跨年＋镜头中心到达目标＋双击＋返回**，地图开关、无证面积、旧16世纪范例无回退。
6. 版本：独立分支和分批commit，来源、方法及进度写HANDOFF，PR审核全绿后合并，必须确认Pages成功再称网站上线。

**否决：** 只有漂亮纯文字而没有段落内地图跳转；把地名包络当英王实控；公司交易变成殖民主权；引用来源而无法追踪主张；胡乱制造船舶航迹/伤亡数据；16世纪已有点击/缩放/年轴回归失败。

> 与仓库现有`docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md`、`docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md`、`docs/APPROVED_MAP_INTERACTION_STANDARD.md`、`docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md`共同执行。出现解释差异以史实及已批准UI规范为准，并记录主编裁定。

## 五、数量叙事与海上截掠的新版验收样例（2026-10-25）

17世纪已发表的 [E6-T11-VOYAGES 长篇](../../../data/stories/serial/e6-t11-atlantic-slave-voyages-quant-resistance.json) 和 [来源分母与研究约束](../../../data/research/e6-t11-transatlantic-slavery-1601-1700-estimates.json) 为本16世纪制作范式追加**跨时段统计**的审核实例；它们不修改16世纪既有历史结论。

- SlaveVoyages 的1601—1700年 Great Britain 船旗类别428,262人是**估计从非洲被强制登船的人数**，统计区间含1700年，不是1600—1699年精确人数、抵岸人数或航次数。25年汇总只进入文章显著列明来源的统计表，**不可**除以25推造逐年点线。
- 皇家非洲公司1680—1692年的279航次、84,498登船、65,157抵岸及差额19,341与1673—1688年另一组公司估算有时间交叉，不能相加；样本差额不能一律解释为被杀害的人数。年龄、性别比例来自部分航次样本，儿童约14%、男性约58%，不能伪装全体个人名单。
- 特定人群的历史售价（如研究中1680—1692牙买加某类别约£18.73）是特定历史时期和交易类别的估价证据，不代表所有人的均价、当代币值，更不是公司的净利润。
- 1619年 White Lion 与 Treasurer 在海上劫夺葡萄牙贩奴船上的非洲人，随后在弗吉尼亚交易，属于**中途截掠与继续贩卖**，不是英船自非洲始发的同口径登记，也不是救援。可链接既存 Atlas `1610S-E024` 的 Point Comfort 参考点，不能为坎佩切湾强填精确交战坐标或沿途船舶轨迹。
- 非洲海岸的贸易联系、欧洲王室特许和抵达美洲的私人暴利**均不构成整个地区的英王主权面**。数量和贸易关系不得用于推出Polygon或面积；对于没有史料还原的船上起义，要记录为待研究而不是凭概率生成具名航次。

参考出处、原始界限、检查方式记录于 [E6-T11审稿与交接](../../../docs/research/EDITOR12_E6_T11_ATLANTIC_SLAVERY_QUANT_20261025.md)；任何未来更新必须同时重跑 `scripts/test_editor12_e6_t11_quant_voyages.js` 与 `scripts/browser_editor12_e6_t11_quant_voyages.py`，并确认既有16世纪地图交互无回退。

## 六、可识别船上起义与非洲岸上解救：1699 / 1688 分级样例（2026-10-25）

2026-10-25 完成 [PR #237](https://github.com/1959124923wyz-sys/love-British-TV/pull/237) 的全部30项独立检查并合并，更新正式 [E6-T11 专题正文](../../../data/stories/serial/e6-t11-atlantic-slave-voyages-quant-resistance.json) 与 [结构化证据](../../../data/research/e6-t11-transatlantic-slavery-1601-1700-estimates.json)。本规范及ZIP应继承以下证据分层，而不是复制所谓宏观“抵抗概率”制造虚假的十七世纪船次。

- **1699年已确证具名船上反抗：** [SlaveVoyages 单航次20173](https://www.slavevoyages.org/voyage/20173/variables) 的 `Albion Frigate`，官方具体航次编码 `African resistance: Slave insurrection`。登记被迫登船600人、1699-11-22抵巴巴多斯，`Total slaves disembarked IMP = 250`、`Slave deaths during middle passage IMP = 350`。**IMP表示数据库推算，350是整段途中死亡推算，绝非起义镇压所致死亡人数。** 原始档案T70/349仅由数据库引用栏确定，未逐页阅读时不可冒充查过原卷。对应Atlas `1690S-E132` 只用巴巴多斯**抵岸位置**作为现代参考，不能把起义定位于陆上或沿线海面。
- **1688年海岸反抗与释放：** [Sudhir Hazareesingh 著作出版商节录](https://academic.macmillan.com/academictrade/9780374611071/daringtobefree/) 与 [SlaveVoyages衍生航次99002记录](https://istwanou.net/entry/1688-attack-from-shore-on-an-unnamed-great-britain-ship-voyage-99002/) 显示卡拉巴尔地区非洲人从岸上袭击一艘英方贩奴船，被囚者得到释放；251为当时船上载有的被囚者报告人数，不是可逐人核实名单。该船**名称未知**、准确岸上袭击位置未核，官方99002直达记录本轮未独立读取；`1680S-E122` 为现代Calabar地区参考点，**不是起义精确现场**。岸上攻击和船上起义在数据库分类上不同，不能合并计算一个“起义死亡率”。
- **数值与地理双重门禁：** 每项人口数都注明 `observed`/ `estimated`/ `imputed (IMP)`，以及分母、时间窗、船旗和记录级别。每个不具测绘根据的参考点都必须设置 `historical_boundary_confirmed:false`、`territorial_claim:false`、`fill_authorized:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。不准用船数、营运资本或运送人数推造占领面积、跨洋GPS折线、起义准确战场。

回归要求：`node scripts/test_editor12_e6_t11_quant_voyages.js` 检查死亡字段IMP/事件归属；`python3 scripts/browser_editor12_e6_t11_quant_voyages.py` 检查桌面地图年份、原文链接、地图镜头、双击及返回。E6-T11母专题仍为`research_only`，不以两件案例假装穷尽全部反抗事件。

## 七、1681年囚禁场所反抗与1693—1696年英船起义：研究样本分母和原件层级（2026-10-25）

[PR #240](https://github.com/1959124923wyz-sys/love-British-TV/pull/240) 新增来源分级账本 [E6-T11抵抗逐例ledger](../../../data/research/e6-t11-resistance-case-ledger-1600-1699.json)，**仅是已找到的可靠案例，不能说成17世纪所有英国奴隶船反抗的完整列表**。

- **1681年James Fort / James Island冈比亚囚禁场所反抗**：David Eltis（剑桥大学出版社，2000年）第172页引RAC驻站John Kastell 1682-01-24信，记1681-11-24拘押105名男性非洲人反抗，殖民方**报告**34人死亡和40人受伤。原文件索引 **TNA T70/16 f.21** 只根据学术注脚确定，未亲自翻阅时不得标为已读原件；被囚者并未上跨大西洋奴隶船，严禁将34或40加进中途航海死亡人数。地图 `1680S-E123` 采用 [UNESCO詹姆斯岛遗址761-001的现代坐标](https://whc.unesco.org/en/list/761/maps/)，不是1681年室内冲突点、堡垒占地或英国在冈比亚的领土边界。
- **1693 America（航次9706）**：SlaveVoyages二次整理公开记录船长**John Brome**、421人强制登船、401人抵牙买加，船上起义；学术附录的“Brome”可能是把船长写成船名，**不能当另一条具名航次重复统计**。
- **1696 Adventure（航次20127）**：二次整理记录船长**Samuel Shering/Sherring**、238人强制登船、186人抵巴巴多斯，船上起义。两个病例的“登船数−抵岸数”分别是20和52，只表示**差额**，没有船上叛乱死亡的单独核验结果，既不能叫做“被镇压杀害人数”，也不能无条件叫做航程死亡总数。官方动态网页字段本轮无法抓取，必须标注**SlaveVoyages衍生二次资料**，而非谎称查阅了原始逐人登记。
- **1699 Albion Frigate口径复核**：Eric Robert Taylor《If We Must Die》2006年大学出版社历史学研究附录（[Project MUSE正式书目](https://muse.jhu.edu/book/16586)）经公开二次引录称起义中约28名被奴役者及1名船员死亡；原附录及其引证的商船档案尚未全卷查阅。**28／1应标二次史学研究记录，350是航次数据库的途中死亡IMP估算，两组不可相加。**

`1691 Charles`、`1699 Dragon`、`1699 Cothrington`以及`1688/1689 Osney`重复风险属于 **research_only** 待核名单，不能仅凭一份学术附录就虚构起义精确地图点、成功解救人数或历史船迹。主编应同时运行本专题静态与桌面测试及全站17C、Tudor旧地图语义门禁；严禁因新增历史事件而删除既有的来源分级或面积为null的测试。最新全面交接见 [E6-T11研究说明](../../../docs/research/EDITOR12_E6_T11_ATLANTIC_SLAVERY_QUANT_20261025.md)。

## 八、官方数据库版本化审读与反抗码值：E6-T11 2019版全量筛选范例（2026-10-25）

[已合并PR #243](https://github.com/1959124923wyz-sys/love-British-TV/pull/243) 第一次对官方SlaveVoyages **2019年扩展CSV**实行带SHA256的数据提取，记录在 [数据证据表](../../../data/research/e6-t11-slavevoyages-2019-resistance-census.json) 与 [可复现方法及交接](../../../docs/research/EDITOR13_E6_T11_OFFICIAL_2019_RESISTANCE_CENSUS_20261025.md)。源文件 `https://legacy.slavevoyages.org/documents/download/tastdb-exp-2019.csv` 22,182,700字节，SHA256 `3fbad142356e30a4662c7f455321d19b70d79770cfa0397278894bb9ae36096f`；码本 `https://legacy.slavevoyages.org/documents/download/SPSS_Codebook_2019.pdf`。

- `YEARAM=1600—1699`的**数据库推定抵岸年**过滤得到3,371条全旗航次行，其中`NATINIMP=7`英国推定船旗1,037行。这是2019快照**收录的记录**，不是估算17世纪全部英船贩奴航次数，也不能与1601—1700年428,262被迫登船人数或RAC 279航次相加。
- 官方码本的`RESISTANCE=1`表示**船上起义**；2表示**岸上袭击船**；3表示**岸上袭击船艇**。全船旗有抵抗码24件：20/2/2。英国推定船旗有抵抗码14件：其中**12件船上起义、2件岸袭船只**。空白**不是证据证明没有发生反抗**，缺年/被遗忘航次不属于这份分母，禁止将12/1037当历史全部起义发生率。
- 14件官方2019版英旗编码航次保存原船名（含两个未知）、船长、年份、航次ID、部分由数据库插补的登/抵岸人数、档案来源文字及核查限制。包括1691年`Charles` ID99009及1686年`Good Fellowship` ID9848岸袭船；1693年`America` ID9706、1696年`Adventure` ID20127、1699年`Albion Frigate` ID20173 已有的地图案例得到官方批量版本证据复核。 **Charles的179/158差额不等于21名起义死者**；二次史学所称17死未经T70原档查阅。1681年`Alexander`独立于1681年`James Fort`拘留所反抗。1688年Osney船名仍未知且有1689年史学记录去重风险。
- 官方CSV是可信的**数据发布机构原始公开产品**，不是17世纪纸本船籍或船长日志；数据库中`SOURCEA/B/C`只是指向TNA及出版档的**目录索引**，逐叶未查验必须明示未阅。2019版不是2026年实时更新总表，若换版本必须重新执行数据校验、记录变动、审旧船名/码值。
- 读者表格逐条显示数据库IMP估计人数，缺失字段为“未核实”；所有被奴役者人命差额不得自动称死亡、反抗牺牲或解救。对于只有船次有据而起义海上位置未知的事件，**先归入研究账本，不能把出海、抵岸港定位为战斗现场、不能画GPS曲线或英国领土Polygon**。

复核闸口：`node scripts/test_editor12_e6_t11_quant_voyages.js` 校验官方CSV提取SHA、原本18章/30源、14条英旗码值和前端表格，`python3 scripts/browser_editor12_e6_t11_quant_voyages.py` 在1780px桌面校验原25年人口估算表、14船折叠表、点击年轴、地图移动、双击与返回。**这只核查可证的研究子样本，E6-T11父级仍为research_only**。

## 九、官方2019／2020航次版次、档案来源截短与殖民镇压法令（2026-10-25）

[PR #246](https://github.com/1959124923wyz-sys/love-British-TV/pull/246) 首次用SlaveVoyages官方2019扩展CSV与2020 SPSS源文件作逐航次版本比较，严格依据`YEARAM=1600..1699`推定抵岸年与`NATINIMP=7`推定英国船旗，两个版本皆为全旗3,371条、英旗1,037条、英国推定旗船上起义码1共12条、岸袭船码2共2条。24条全部船旗的具抵抗编码船只在15个抽取字段完全不变。**相邻两个版本来自同一历史数据编纂工程，不能称互相独立的17世纪船籍原件核实；未编码不等于无反抗，14也不是所有实际反抗总次数。**

进一步逐船对比3,371条ID与主要字段，发现2020 SPSS的**36个`SOURCEA`卷页来源字符串被截成2019 CSV来源的真前缀**，没有发现其他此次抽取字段内容变化。复制原始档案索引必须优先保留**较完整的2019字段**，不能用2020版较短字符串臆造完整页码。全部36件对比及双文件SHA256见[永久数据](../../../data/research/e6-t11-official-2019-2020-snapshot-comparison.json)，复现工具`scripts/research_e6t11_compare_editions.py`。

在1699年，牙买加[UNB所刊法规转录](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1699)写明为追捕逃亡及反抗奴役的人：指挥官月薪£6、军士月薪£3、普通成员每月50先令，另有掠获激励。原文见1716年法律汇编，**1699年内具体颁布日未知**，法定津贴不能误作为实际总支出。另见两名获得有条件自由者Cornelius与Sawcy的**前奴役者**补偿£35与£30，不是给已获释者的解放金。正文跳转已存Atlas `1690S-E091` 的殖民行政机关参考位置，**不得由法律适用推造山区镇压实际范围或英国新殖民地地块**。

[Bristol Museums历史介绍](https://www.discoveringbristol.org.uk/slavery/routes/places-involved/britain/south-west-ports/)另记录1699年Topsham商船`Dragon`在非洲海岸发生船上反抗，原船东最后仅有14名被奴役者在巴巴多斯由其出售（另有皇家非洲公司代理人在同船载人）。**这不是整艘船幸存者总数，也不证明其他人必定死于起义**。该事不在SlaveVoyages 2019／2020英旗14件有编码集合中，强化“数据库观察下限”规则。Dragon船长另有Henry Taylor与Christopher Butcher两种二手记载，未读Tattersfield历史原卷前不做确证，也不画海上交战点或GPS航行线。`Trompeuse`（数据库2019/2020英旗推定码7）因Jean Hamlin在1683年法国海盗船史记载存在严重船籍归属风险，不可将推定代码偷换成稳定英王控制或公司隶属。

详见[本轮研究交接](../../../docs/research/EDITOR14_E6_T11_2020_CROSS_EDITION_AND_1699_COERCION_20261025.md)与[结构化法律及Dragon证据](../../../data/research/e6-t11-jamaica-1699-coercion-dragon-vessel-evidence.json)。新增文章采用18章、33项来源、25处正文地图内链；维持旧十六世纪点击定位、双击、返回、控制/影响区域分隔及严格 GIS 审核。父级E6-T11继续`research_only`。

## 十、E6-T12东印度公司：印度洋奴役、1698孟加拉三村权益及可增长历史事件基线（2026-10-26）

[已合并PR #249](https://github.com/1959124923wyz-sys/love-British-TV/pull/249) 在已发表1600—1698年E6-T12专题的12章、19源基础上增加3个实证章与3项来源，形成**15章／22源**的正式故事，而不再额外创建重复母题。同行评审的 [Journal of British Studies 2024年明古连研究](https://www.cambridge.org/core/journals/journal-of-british-studies/article/making-and-unmaking-of-a-presidency-envisioning-empire-in-british-bencoolen-16851825/4C0CA8C6BF1E88181DA0CEACBC33C47A) 引证公司1687年调拨圣赫勒拿被奴役者**10人的命令**与1689年马德拉斯赴马达加斯加获取被奴役者的活动：10是指令数，**不是已证实登船、抵岸、存活、死亡或利润统计**；1689船次的船名、载员、到达数量没有核实必须`null`。复用既有地图事件 `1680S-E017`和`1680S-E027`，不得编造船舶GPS轨迹、具体抓捕港或殖民主权海域。明古连胡椒的地方社群强迫种植同公司所属被奴役者须分类，禁止相加为虚构“总受害人数”。

1698年[剑桥大学出版社David Veevers章节摘要](https://www.cambridge.org/core/books/abs/origins-of-the-british-empire-in-asia-16001750/firm-settlement-in-this-place/2C131E2C18C1FEEF9C2D4A240477C2A6)与[1698年三村bainama历史契据译文再刊](https://blogheritagewalk.wordpress.com/2018/01/03/bainama-deed-of-transfer-of-zemindary-rights-of-calcutta-9-november-1698/)共同支持：东印度公司取得 Sutanuti / Dihi Kalikata / Gobindapur 在**莫卧儿孟加拉秩序下的扎明达里土地收益征收及管理权益**，译文记载向原权益持有人支付**1,300卢比**的转让对价。**不能叫1698年公司利润、实际征税总额、在整个孟加拉取得主权或“用1,300卢比买下现代加尔各答”。**原Add. MS.24039馆藏原件未亲阅，契据公历换算日期有11月8/9/10日分歧；年份1698已核，精确日不得随意确定。新Atlas事件 `1690S-E135` 使用沿用的苏塔努蒂/加尔各答区域**现代参考地名点**，`historical_control_boundary_verified=false`、`actual_English_territory_created=false`、`actual_English_land_area_sqkm=null`，无真实三村地籍Polygon。既有 `1690S-E059` 仍标1699年旧威廉堡营建，不再将其描述成1699年获得三村收益权。1698协议和1699筑堡为两个不同年度，二者亦不能自动推出整个城市的历史控制边界。

[结构化四件证据账本](../../../data/research/e6-t12-eic-indian-ocean-slavery-bengal-rights-1687-1699.json) 与 [研究交接](../../../docs/research/EDITOR15_E6_T12_INDIA_OCEAN_SLAVERY_BENGAL_20261026.md)为本题继续调查英国图书馆IOR/G、圣赫勒拿船货名册及莫卧儿敕令的入口。QA **不可把旧17世纪年表计数455条或1690年代91条写死**；实际新增1条有据事件后为456/92。今后约束应为**旧事件及原已审核219个不可移动的参考地理点必须保留，新增事件必须有独立研究ID、来源、严格年序和地图事实语法**。运行`node scripts/test_editor15_e6t12_slavery_bengal.js`、`node scripts/test_editor6_17c_batch01.js`、`node scripts/test_editor6_17c_georeference_r02.js`、`node scripts/test_editor6_17c_major_gap_r04.js`与`python3 scripts/audit_spatial_semantics.py --strict`；完整桌面回归仍须确认点击跳1698三村、双击档案与返回。

## 十一、E6-T15英格兰银行战争财政与E6-T02爱尔兰征服土地债权：制度性掠夺证据分层（2026-10-26）

[已合并PR #252](https://github.com/1959124923wyz-sys/love-British-TV/pull/252) 新增两个成熟17世纪重大故事（原母题直接发表，不造新并行目录），**合计21章、27来源，27条正文事件链接均引用已存在且核过史料的 Atlas 记录**：

**E6-T15（1660—1699）** 依据英格兰银行官方原始股票订户账目录 `M1/1`、`AC27/382`、`AC27/414`、1694特许状 `M6/48`、董事会议 `G4/1`、[官方1694借款FOI](https://www.bankofengland.co.uk/freedom-of-information/2020/details-of-the-bank-of-england-loan-to-the-government-in-1694)与[原法/税务FOI](https://www.bankofengland.co.uk/freedom-of-information/2015/28-august-2015-2)，区分1694政府**贷款120万英镑**、原始**8%年率**、税收支持**14万英镑法定年拨款**（其中向订户相关基金10万英镑，终身年金基金4万）。**不能把14万直接叫120万的纯年息，更不能称贷款股本全由奴隶贸易利润提供。**官方[认股者索引](https://www.bankofengland.co.uk/archive/index-to-original-subscribers-to-bank-stock-1694?sf149379530=1)称1,520单独姓名条目，另一官方机构说明称超过1,200名原股东；口径不同且未逐名去重，不能将1,520个条目等同1,520名奴隶贸易受益人。董事名单和皇家非洲公司存在的同时性不能被当作逐名交叉持股证明。18世纪银行直接受有奴隶种植园产权等事实**不得移植进1694地图**。

**E6-T02（1641—1658）** 核对[三一学院1641证词档](https://dh.tcd.ie/past-projects/1641-depositions/)、[英国国家陆军博物馆克伦威尔战争史](https://www.nam.ac.uk/explore/oliver-cromwell-lord-protector)、[克伦威尔1649信件历史评论](https://historyireland.com/the-letters-writings-and-speeches-of-oliver-cromwell/)、[剑桥1652—1654土地债权研究](https://www.cambridge.org/core/books/abs/conquest-and-land-in-ireland/towards-plantation-and-transportation-16521654/221642F0C095EDF36E7AAF8B1204A40D)及[三一学院Down Survey历史GIS项目](https://www.tcd.ie/history/research/centres/early-modern/down-survey.php)。1649年克伦威尔信自述德罗赫达城内约3,000守军、不到30人逃离，韦克斯福德约2,000遭杀害／溺死；**这是胜方自报、不是独立审核的平民和战役总死亡人数，更不能汇总成全战争死亡数**。同代记载的铁、木料、火炮、船只战利品没有确切售出净收益。资本形成顺序是1642年未来没收地产筹资→1649—1653年战争→1652/1653没产及军饷/投资人法定受偿→1654—1658年地籍测量及后续实际受领，禁止把四步绘为某一年的总英国土地实控Polygon。复辟之后争讼见原已出版的E6-T03-LAND，不复制相同地权专题。

共同的强制步骤：`[[ID|自然语言]]`单击地图转年与镜头、双击进史料/返回，年度地图中的已有德罗赫达、韦克斯福德、威斯敏斯特标点不是屠杀院落、银行办公楼或测量后的完整地籍边界。所有历史陆地实际控制面积仍为`null`，人命口径、政府贷款、股本、法定拨款、没产土地与债权分别建账。任何股东—皇家非洲公司—政府财政资金线均须具名股份及转账链，不得凭两家机构同期存在而虚构资金流。

研究结构化来源账本：[E6-T15/E6-T02各层金额与伤亡数字](../../../data/research/e6t15-e6t02-war-finance-land-forfeiture-evidence-20261026.json)，刊前手稿与继续搜集项目：[主编16正式交接](../../../docs/research/EDITOR16_E6T15_E6T02_WAR_FINANCE_IRELAND_20261026.md)。全部来源不等于原档已逐页检视，证据等级说明不可从正文/数据删除。

已通过PR全量24项检查。后续回归应运行`node scripts/test_editor16_bank_ireland_finance.js`、`node scripts/test_serial_story_contract.js`、`python3 scripts/browser_editor16_bank_ireland_finance.py`与`python3 scripts/audit_spatial_semantics.py --strict`。同一个1652没产法事件会挂载E6-T02征服篇与E6-T03-LAND土地篇两个合法入口；**浏览器测试务必显式按`data-story-open`文章ID选择，不能永远默认第一个进入的专题。**

## 十二、E6-T15/E6-T02具名金融网络与抽签土地数据：准许高质量二次史料，但不得捏造连线（2026-10-26）

本规范接续[Editor17具名商人与量化研究PR](https://github.com/1959124923wyz-sys/love-British-TV/pull/255)及[长期研究交接](../../../docs/research/EDITOR17_BANK_SLAVE_INVESTOR_IRELAND_LOTTERY_20261026.md)。历史材料的可信度按**机构原始文书、权威专业机构研究、同行评审史学全文、经研究者署名确认的新闻采访、未经核实网页**分层记录。**无需等待每一份古代手稿逐页亲阅才发布**；但是二次资料说了多少就只能据证断言多少，绝不能把未查的17世纪股东账、现金流或历史地界伪称已经验证。

### E6-T15：人物、机构与金钱三层证据

- [英国NatWest集团的Hankey & Co机构史](https://www.natwestgroup.com/heritage/companies/hankey-and-co.html)写明**1674年John Houblon和Samuel Hankey在Fenchurch Street共同从事西印度殖民贸易**，涉及牙买加、安提瓜及背风群岛，并明确这种贸易依赖被奴役的非洲劳动者，两名合伙人因此获益。[英格兰银行1694首批董事名录](https://www.bankofengland.co.uk/archive/directors-annual-lists-1694-1950)独立核对Houblon为首任总裁。此为**具名贸易合伙＋具名银行领导任职**的可证连接，不等于Houblon具名贩奴航次、银行股本中利润百分比，也不代表Hankey属于1694银行创办董事。
- 2026年9月[《卫报》对Michael Bennett／Register of British Slave Traders直接研究采访](https://www.theguardian.com/uk-news/ng-interactive/2026/sep/16/slave-trade-wealth-britain-financial-system-bank-of-england-enslaved-africans)载：历届银行董事中**24人**曾投资跨大西洋人口奴役贸易，其中**4人**属于1694年创办董事；**至少30位**银行最早的股票认购者涉足奴隶贸易投资。四人属于24人的子集，30与4可能有重叠；24人的董事履历涉及后世，**不能写成“1694年24名创办董事全部从事贩奴”**，亦不可在尚无公开四人名单时随便给四个董事贴同一标签。
- [英格兰银行创立账册展示](https://www.bankofengland.co.uk/museum/online-collections/archive-gallery/founding-documents)记威廉三世和玛丽二世1694年**共同**认股£10,000，2026研究报道两人亦曾持有皇家非洲公司股份。**共同£10,000≠各人£10,000，持有两家公司股票≠已查明从RAC到1694银行存在同额分红转账**。原1694国家£1,200,000贷款、8%利率及£140,000法定年拨款继续按各自会计字段记录，禁止将它们和同一批股东个人财富相加为“英国殖民直接净收益”。
- 地图仍使用已知`1690S-E023`1694银行成立的威斯敏斯特立法行政参考点，以及已有1672皇家非洲公司事件。**英国海上殖民商贸流量和私人账目关系不能等同新领土Polygon，也不能凭西印度贸易合伙想象出一条17世纪资金实测海运线**。

### E6-T02：给人名、金额、历史面积与统计分母各自标记

- [爱尔兰皇家学院Erasmus Smith权威人物传记](https://www.dib.ie/index.php/biography/smith-erasmus-a8139)记录1643年其父让渡**£300**战争投资权益，1653年折价收购扩成**£2,995名义权益**、抽签获授**10,404 Irish acres**位于Armagh/Down/Tipperary，后又扩大地产、1657年创办地产教育信托。£300可能已经包含在后来的£2,995之中；名义债权不是折价实际现金购买成本；**Irish acres不是英亩或平方公里，不可未经面积制校验就换算**。早期10,404也不可与后来的全部持有量简单相加。
- [2026年《International Organization》同行评审全文](https://www.cambridge.org/core/journals/international-organization/article/to-hell-or-to-connacht-expropriation-inequality-and-local-legacies-of-settler-colonialism/805564D91100463C60FFA47F603F93DC)考证1654年十郡士兵/冒险家受偿抽签，排除不符合条件的49个教区后形成**90个男爵领地、794个教区的分析样本**。1670年样本中军队获分区域由新教地主持有约**84%**土地、冒险家获分区域约**79%**（相差约5个百分点），绝非全爱尔兰“新占领5%面积”。原始受偿债权人至1670年亲自取得地产的比例不足四分之一，涉及权利买卖和不同地主，不得把1653年的每个抽签权人直接绘成1670年真实地产主人。
- 论文转引的全爱尔兰天主教持地从约50%降至约20%属历史综述，**不能同研究十郡84/79的不同分母拼接推导新国界**。有关地主集中度的零效果也不可省掉，群体身份变化不等于已证明所有土地都集中到少数人手中。
- [都柏林三一学院Down Survey／Books of Survey and Distribution数字地图](https://www.downsurvey.ie/about/)的确可按1641／1670地主与历史村镇关联；但未实际复制检验具体**原图、地权人、日期与边界**前，不可把现代郡域画为1654没产土地、也不能把Smith在三郡的授权总额机械拆分为虚构地块。缺几何来源以既有1652/53没产及1654—1658勘测历史**参考点**与文中比例表呈现；有史料但边界未定的区域使用虚线淡色并标“参考范围”，严格不得称实测实控面积。

永久审查文件：`data/research/e6t15-e6t02-person-network-and-1654-lottery-evidence-20261026.json`。验证工具：`node scripts/test_editor17_capital_people_land_lottery.js`、`node scripts/test_editor16_bank_ireland_finance.js`、`node scripts/test_serial_story_contract.js`及`python3 scripts/audit_spatial_semantics.py --strict`；桌面地图需核验1694/1649点入、全篇新段、双击及返回，旧16世纪地图与先刊土地专题不能回退。所有发生于1700年及以后的事件继续排除在本轮专题地图之外。

## 十三、17世纪陆地殖民与海上堡垒易手：阿尔斯特、苏里南、普罗维登斯岛、海岸角及丹吉尔（2026-10-26）

正式研究基于[Editor18的五地征服专题PR #258](https://github.com/1959124923wyz-sys/love-British-TV/pull/258)和[结构化出处账](../../../data/research/editor18-seventeenth-century-ulster-suriname-providence-african-forts-evidence-20261026.json)、[权威史学资料交接](../../../docs/research/EDITOR18_FIVE_OVERLOOKED_17C_CONQUESTS_20261026.md)。新做四篇逐年地图关联的重大专题，**只限17世纪，不能把英格兰王室、苏格兰王室及当地政治权力倒写成1707年后联合王国。** 强制采用权威大学出版、同行评审学术论文、国家档案馆与博物馆及考古报告；专业二手资料可发表，原始地契、舰队日志未直接阅览时标注验证深度，不要求为追求“原始档案”耽误整个历史调查。

### 各地数值与土地范围的强制口径

- **1609／1610阿尔斯特**：1609年六郡没收地调查计划与1610年五郡50余名English undertakers的学术研究具有**不同区域与人数分母**。1609年Bodley地图属真实王室土地调查文书，但未逐幅配准前不得用今天北爱尔兰的县界涂实“1610殖民面积”。1613年的德里城市考古具现代遗址参考坐标，不是1610年五郡授地统一签约地点，也不是整个爱尔兰地籍。
- **1650—1668苏里南**：荷兰国家档案馆早期英属糖业殖民“约50处糖园”是**某段发展期概述，并非1650年当年种植园数**。地图年份务必保留 **1667年初荷兰首次夺取苏里南，1667年10月英军短暂反夺，1668年荷方重掌主要殖民控制权** 的三条相异占领转换记录；剑桥《Journal of British Studies》脚注61直接回溯同期荷兰文书。还存在个别堡垒英军在1668年春的留守时间争议，不能把1668年4月等同所有驻军撤出确切日。三件事均使用可核现代Fort Willoughby/Zeelandia参考堡址点，不能把现代苏里南国界描作英属殖民地实控多边形，亦不能据一次欧洲和约抹掉原住民土地自主和遭奴役者继续遭强迫劳动。
- **1630—1641哥伦比亚Providencia**：Kupperman剑桥大学出版社的Providence Island Company史研究给出最初**£3,800资本承诺，约20名股东**；该数字是承诺总额，不是现金收齐或已实现净利润。1633年向荷兰贩奴商购买被奴役非洲人的董事指令≠确切实际购入人数。1634年Warwick报告遭奴役者Sander家庭被拆散的信件对象是**百慕大**，只能作同一出资者殖民奴役做法的比较资料，不得重写成Providencia岛事件。1641年西班牙夺取殖民地后英方军事控制终止；不要与美国罗德岛Providence混淆。
- **1664／1665年加纳海岸角Cape Coast**：加纳地区官方与专业考古研究对英军夺取年份存在1664和1665不同记载；档案第1阶段把年度定位在1665，标题和信源明确**“1664—1665年份待进一步核对”**，不得伪造“1655年7月某日攻陷”等精确日期。当地Fetu统治者以及瑞典、丹麦、荷兰、英国驻堡者的权利不同；1663 Royal Adventurers不等于1672重组后的Royal African Company。真实堡垒坐标不等于整个加纳黄金海岸的英属领土。
- **1661—1684年摩洛哥丹吉尔**：1661年葡萄牙婚约转让港口，英军1662年实际驻城；1680年摩洛哥军队围城，英王1684年弃守且摩洛哥恢复控制。英方地中海商贸与港堤筑防的国家财政投入**不自动等于获利**；不能把王室葡萄牙的对外特许写成整个摩洛哥军政实体主动接受英方统治，1684年以后不再延长英方驻港占领的地图时段。

### 通用技术与故事验收机制

殖民公司的特许、实际驻军控制、君主对外外交声索、当地原住民地权、英法荷西军事易手及奴役贸易人员是不同史实层。新地理事件必须满足`representative_map_point=true`、`geo_precision`以`representative_`开头、`geolocation_limit_zh`明确写`非事件精确现场`及`不表示`历史控制范围、`historical_control_boundary_verified=false`、`actual_English_land_area_sqkm=null`、`exclude_point_buffer_from_area_statistics=true`。历史时期界线来源缺失时仅用具名现代参考点，不画未经考古或史图测绘的多边形；真实有史料但争议的地界才可按准则制作**虚线＋显式不确定**的区域，且不能把这样的区域计入英王主权面积。

新增专题里的`[[ID|自然语言]]`点击必须调用有据已登记的17世纪年度事件，让年份滑块和镜头切换；全文来源与返航地图操作必须按既有桌面Chromium互相验证，避免用一条没有人名、船名和真实航次账的猜测连线绘出海上资本流。审查运行`node scripts/test_editor18_overlooked_17c_conquests.js`、`node scripts/test_serial_story_contract.js`、`node scripts/test_17c_tudor_parity_20261023.js`、`python3 scripts/audit_spatial_semantics.py --strict`及`python3 scripts/browser_editor18_overlooked_conquests.py`，并观察旧专题全站检查成功后才合并。年度Atlas新增事件允许经来源审核后使原基线计数增长，旧有地图锚点与文章不得回退。


## 十四、17世纪东加勒比Kalinago土地、英法殖民分区与1666—1671年被奴役者战争掳掠（2026-10-27）

[已核权威资料的E6-T07-LEEWARD正式专题PR #261](https://github.com/1959124923wyz-sys/love-British-TV/pull/261) 发布**11章、12项分篇来源、13个实际Atlas年度事件关联**，与现有E6-T07-BARBADOS子篇并列；母题E6-T07保持未完研究，不把17世纪以后的问题提前视为完成。永久交接为[Editor19背风群岛研究文件](../../../docs/research/EDITOR19_E6T07_LEEWARD_COLONIAL_CONQUEST_20261027.md)，结构化实证为[Editor19来源账](../../../data/research/editor19-leewards-kalinago-1666-captives-evidence-20261027.json)。

- **1623与1626卡利纳戈人**：圣基茨国家档案馆[Bloody Point](https://www.historicstkitts.kn/places/bloody-point)证明英法殖民者攻击、Tegreman遇害与Kalinago被迫退出部分土地；殖民者关于袭击预谋的说法是单方记载。**不能虚构1626年杀戮精确人数、把幸存卡利纳戈人写成民族灭绝、或者把现代圣基茨岛全境当做1626年英王实控面。**
- **1627、1629、1632年**：[圣基茨国家档案馆年表](https://www.historicstkitts.kn/timeline-history-of-st-kitts)记英法分区及西班牙袭击；[Cherry与Ryzewski考古专著](https://www.jstor.org/stable/j.ctv138ws8x.11)和[Brown University](https://sites.brown.edu/archaeology/fieldwork/montserrat/montserrats-archaeological-resources/)证实1632年蒙特塞拉特英方早期定居。学者提及约**800名爱尔兰契约及其他劳工**是二次转述的队伍规模，**不是到港逐人名单或1632年糖园奴役人口**。[Beckles《The Americas》](https://www.cambridge.org/core/journals/americas/article/abs/plantation-production-and-white-protoslavery-white-indentured-servants-and-the-colonisation-of-the-english-west-indies-16241645/86B4E777C5FE054DF931B07AF0E99BD8)指出早期烟草、棉与靛蓝劳作和较晚成熟糖业不能混同。
- **1666—1671年奴役者掳掠网络**：2026年《[Itinerario: Human Plunder](https://www.cambridge.org/core/journals/itinerario/article/human-plunder-slaving-raids-economic-warfare-and-mercantilism-in-the-french-caribbean-16651713/E04B5E1449BA2207661E50DFAAFECD7F)》依据TNA CO 1/20与CO 1/27指出1666年4月法国占领圣基茨英区并取得英殖民者控制的被奴役非洲人口，1668年英私掠者亦进行反掠；英总督1671年索赔称从安提瓜和蒙特塞拉特共掳**1,500人**、圣基茨**400人**。研究者明确认为数字明显夸大，故**1,500和400永远按「英方索赔数字」字段记账，实际人口数为null**；不许写实际共1,900人、单位价格、法国净利润或英殖民者已收到同额赔偿。
- **空间制图与交互**：新增1628尼维斯、1632蒙特塞拉特、1671殖民官员索赔三处**有据现代地名代表点**；既有1626冲突、1666法国攻占及1667《布雷达和约》继续对应原Atlas事件。所有新点必须保留\`geo_precision=representative_...\`、\`historical_control_boundary_verified=false\`、\`actual_English_land_area_sqkm=null\`、\`exclude_point_buffer_from_area_statistics=true\`。**1627法英分区不能拿现代区划推测填色，战争兵力分布也不能拿点缓冲区做面积。**真实可校准但残缺的历史边界才用虚线及「未确定」说明。
- **固定回归**：\`node scripts/test_editor19_leewards_kalinago.js\`、\`node scripts/test_serial_story_contract.js\`、\`node scripts/test_17c_tudor_parity_20261023.js\`、\`python3 scripts/audit_spatial_semantics.py --strict\`，并在桌面Chromium核对1626/1632/1671年点入正文、来源和返回地图；原1497—1599年地图、巴巴多斯分篇及其他22篇不得回退。原始英法分界测绘、各庄园名册、军官索赔的真实返还及售出记录仍是后续研究缺口。

## 十五、1650—1652年英格兰共和国军事征服苏格兰：战场、俘虏和北美强迫契约劳动（2026-10-28）

**对应 [Editor20苏格兰征服重大专题PR #264](https://github.com/1959124923wyz-sys/love-British-TV/pull/264)。** 15章长文、16项正式分篇文献、11条新年度地图事件、12项文章内可点击Atlas地图节点。全量来源账：[Editor20权威资料/统计分母账](../../../data/research/editor20-scotland-1650-1652-prisoners-evidence-20261028.json)；制作交接：[Editor20史实和地图执行规则](../../../docs/research/EDITOR20_SCOTLAND_CONQUEST_POW_1650_1652_20261028.md)。

### 史实与政治身份

- 1650年，入侵方是**英格兰共和国（Commonwealth of England）**军队，对手是具有独立政制和苏格兰议会的**苏格兰王国**。1650年7月入侵、9月邓巴、1651年7月因弗基辛、同年8月珀斯及斯特灵失守、9月邓迪与伍斯特、1652年5月邓诺特投降分别记年。**严禁倒写为1707年后联合王国内部行动，或画上今天苏格兰行政边界代表1650年英方实控**。剑桥[David L Smith关于克伦威尔军政统治的研究](https://www.repository.cam.ac.uk/items/6cb2fb45-2935-4f13-9281-1a06f8969141)和[爱丁堡大学苏格兰城市占领研究](https://era.ed.ac.uk/items/688deac2-5e66-43b0-b0f4-16cb9eb422f2)均应保留为证据。
- [苏格兰国家历史环境局邓巴战场清单BTL7](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL7)区分英方宣称约**3000战死、10000被俘**与苏格兰约**800战死**等不同口径；**绝不把英军胜方报告作为独立核实的真实总死亡数**。同机构[因弗基辛BTL23](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL23)关于2000战死及1500被俘等战争宣传数字也有苏格兰记载的不同口径，不得单一数据化。
- [杜伦大学考古](https://dur.ac.uk/departments/academic/archaeology/research/archaeology-research-projects/scottish-soldiers/)与[2020《PLOS ONE》同行评审分析](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0243369)核对战俘**约3900人强迫南下、约3000—3500抵达达勒姆、1650年10月底约1600人在拘押中死亡**，三者时期／分母不同；不能相减算出全部为某方故意杀死者。考古发现的少量遗骸不等于1600具全部已出土遗骸。
- [苏格兰档案机构邓迪篇](https://www.scottisharchives.org.uk/explore/dundee-city-archives/)支持1651年9月1日英军攻陷洗劫邓迪，但**死亡700至1500属于不同历史报道，真实总数未知**。[HES Broughty城堡史](https://www.historicenvironment.scot/visit/all/broughty-castle/history-and-stories/)指出若干洗劫细节来自地方传统，须与确证攻城日期分别记录。
- [剑桥古物学刊邓诺特城堡研究](https://www.cambridge.org/core/journals/antiquaries-journal/article/abs/scottish-regalia-and-dunnottar-castle/1F7981E87C7E4BECE218BB82B82B4877)可核1652年5月24日投降条款。苏格兰王室冠冕器物此前被转移；占领一座城堡不等于当年取得整个苏格兰的完整私人土地所有权。

### 劳动力、资本与地图纪律

- [马萨诸塞州政府历史博物馆](https://www.sec.state.ma.us/divisions/commonwealth-museum/exhibits/online/diversity-colonial-massachusetts/diversity-colonial-massachusetts-8.htm)记载约**150名**邓巴战俘于1650年由Unity运输至马萨诸塞；[美国国家公园Saugus铁厂史](https://www.nps.gov/articles/000/scottish-prisoners-at-the-iron-works.htm)确认一部分被迫从事铁业和木材劳动，契约常为约七年。**150是单船预计人数，不是铁厂每年实际用工、死亡人数或各被掳人的准确售价；公司净利润未知。** 须用明确的概念区分战俘的有期限强迫契约劳动与非洲裔人口遭受的终身、世袭、种族化动产奴役，而不能因二者都涉及强迫劳动就合并财产权字段。
- 官方战场清单的NGR经OSGB36/EPSG:27700→WGS84标准转换，仅形成历史**战斗景观代表点**。HES/HE战场保护区**不是英国主权或军事统治区**；登陆、围城、强迫行军与海上押送无逐年精确矢量证据不得凭直线或任意点缓冲推测路线/控制面积。所有新图钉维持`representative_map_point=true`、`historical_control_boundary_verified=false`、`actual_English_land_area_sqkm=null`、`exclude_point_buffer_from_area_statistics=true`。
- 验收运行`node scripts/test_editor20_scotland_conquest_pow.js`、`node scripts/test_serial_story_contract.js`、`node scripts/test_17c_tudor_parity_20261023.js`及`python3 scripts/audit_spatial_semantics.py --strict`。桌面Chromium真实点击1650年邓巴与Saugus、1651年邓迪、1652年邓诺特并核查返回1599年。所有已发表旧篇保留；E6-T04仍是未研究完的母题，不允许因征服子篇发表自动改标全部苏格兰史完成。

## 十六、1689—1691年爱尔兰威廉派战争：军占、条约保护范围与宗教财产之争（2026-10-28）

对应已核历史专题 **[Editor21 PR #267](https://github.com/1959124923wyz-sys/love-British-TV/pull/267)**，15个完整章节、13项正文来源、20条独立Atlas事件关联，含7条新年度事件；原E6-T03-LAND-1642-1698专篇继续专门记载土地剥夺与产权争讼，父专题E6-T03不因战争子篇发表而自动标记整体完成。证据账在`data/research/editor21-williamite-war-1689-1691-evidence-20261028.json`；交接在`docs/research/EDITOR21_WILLIAMITE_IRELAND_1689_1691_20261028.md`。

- **政治与军事史**：[英国国家陆军博物馆](https://www.nam.ac.uk/explore/battle-boyne)记詹姆斯二世1689年3月抵爱尔兰，德里和恩尼斯基伦成为威廉派抵抗据点；1689年8月朔姆贝格率军登陆、1690年6月威廉三世亲征。威廉军为含荷兰、丹麦、胡格诺派、德意志地区、英格兰、苏格兰和爱尔兰参战者的多国联盟，不应全部归为同一种族或宗教。**1690波因河胜利≠1691战争结束**：詹姆斯军主力有序撤离后仍有1690利默里克抵抗、1691阿斯隆、奥格里姆和利默里克第二次围城。
- **历法和分母**：[爱尔兰国家文物部门Oldbridge遗址](https://heritageireland.ie/places-to-visit/battle-of-the-boyne-visitor-centre-oldbridge-estate/)记波因河当时旧历**1690年7月1日**，现代7月12日纪念不是历史军令的旧历日。政府史迹说明兵力约36000对25000，[英国国家陆军博物馆](https://www.nam.ac.uk/explore/battle-boyne)另约37000对23000，均须注明来源和计数范围。奥格里姆战役总体死亡概数不能用没有名册佐证的媒体数字冒充确定死伤总数。
- **1691年10月3日《利默里克条约》**：务必直接核对[科克大学CELT民事和军事条款原始文献校订](https://celt.ucc.ie/published/E703001-010/text001.html)；**民事第一条**承诺天主教徒在爱尔兰既有法律和查理二世时代范围内的宗教活动，并以未来议会争取进一步保护，不是当日无限制宗教自由；**第二条**就特定居民与有条件服从威廉玛丽政权的人士给予地产/商贸权保护，要求效忠宣誓，**不是所有爱尔兰天主教徒永久保有全部地产**。**军事条款**规定允许有资格且愿意离境的军人及家庭移往英苏以外其他国家，不可将许可人数等同于真实登船和抵达总数。
- **文件文字异文**：对照[1692王室确认](https://celt.ucc.ie/published/E703001-015/text001.html)、[George Clarke备忘录](https://celt.ucc.ie/published/E703001-016/text003.html)与[Cambridge历史校勘研究](https://www.cambridge.org/core/journals/irish-historical-studies/article/original-draft-of-the-civil-articles-of-limerick-1691/F39DAD11BD37D6B09F8E95D2549D1766)。Clarke记第二条誊写漏掉“and all such as are under their protection in those counties”一语；必须标注这是特定文书的文字差异与后来补救，不可由此虚构已确认的所有实际获地名单。1692确认与1695—1698年后续限制法律要独立写明日期。
- **农业、土地与GIS**：[爱尔兰国家法令库早期公告目录](https://www.irishstatutebook.ie/eli/2015/act/23/enacted/en/print)收录1691年7月15日鼓励没收地佃户割草及8月4日鼓励康诺特农民返耕的通告；政府**主张、法律权利、实地执行、实际收成和没收面积**是不同字段，任何不可核量置为`null`。所有都柏林、德里、恩尼斯基伦、班戈湾、波因河、奥格里姆、阿斯隆和利默里克的地图点仅代表具名政治/事件地点。无同代分层军占地籍，**不得以现代爱尔兰整岛或郡县填色画出1690—1691某方实控**；仅有历史依据但边线仍不确定时用虚线，并注明调查来源。
- **回归**：`node scripts/test_editor21_williamite_ireland.js`、`node scripts/test_serial_story_contract.js`、`node scripts/test_17c_tudor_parity_20261023.js`、`python3 scripts/audit_spatial_semantics.py --strict`，桌面Chrome应能在1689德里、1690波因河、1691利默里克条约与农业公告进入同一篇，再退回地图，且1497—1599年旧界面保持不变。
