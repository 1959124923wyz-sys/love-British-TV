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
