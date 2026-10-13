# 爱英TV｜第七章1550—1559史料、GIS和年度政治控制研究

研究日期：2026-10-13。GitHub独立分支：`research/territorial-1550-1559-20261013`。第六章PR #27仍为研究草案，因此第七章**从main独立分支创建，按PR #27的1549年终控制种子跨分支承接**，不能认为历史上的1549→1550已经自动接入正式网站。

## 十年史实与重大地图逆转

| 年份 | 确认历史变化 | 地图机制 |
| --- | --- | --- |
| 1550 | 布劳蒂英军城堡被法苏联军收复；Forthill英军堡垒拆除；英法1550年3月24日签署布洛涅归还条约，4月25日由法国正式接管 | 英占城镇点退去、位置保留为法国或苏格兰控制。Odre旧灯塔炮台随布洛涅转手，具体堡内交割日未核。Eyemouth、Lauder、Dunglass、Hailes离去日不足证，**保持未确认状态** |
| 1553 | 英商Richard Chancellor航抵俄罗斯白海，Thomas Wyndham西非航次 | 商业与航海层，无英国占领区，缺精准古航海记录则不臆造船路 |
| 1554–55 | John Lok几内亚航次，1555年带回5名被奴役非洲人；1555英国Muscovy Company特许 | 人口奴役特殊事件层与贸易公司点；俄罗斯和西非不是英属殖民地 |
| 1555–57 | William Towerson西非航次，涉及葡萄牙控制的Elmina与其他几内亚港区 | 港区归属必须区分葡萄牙、非洲本地政权与英商贸易接触 |
| 1556–57 | 玛丽一世爱尔兰中部Queen's County、King's County殖民立法与剥夺O'More/O'Connor土地；当地抵抗持续 | Fort Protector和Fort Governor两处**已有军堡**作为实际控制Point，殖民法定新县与全郡实际占领不混同；不得整个现代郡实填橙色 |
| 1558 | 法国夺取Calais（通常记1月7日），随后夺Guînes；Risban、Nieulay等英国旧城防系统转归法国 | 英国长期Calais/Guînes城区驻军终止，保留同一地理地点，**1558年改成法国控制色**；Pale界没有实测历史Polygon，保持虚线 |
| 1559 | 英法4月2日卡托-康布雷齐条约准许法国继续占据Calais等地8年，约定未来返还附50万金埃居担保 | 1559及1560都**不应该恢复英王加来颜色**。50万是担保，不是已付给英国现金 |

## 编辑器可调用的文件

- `SOURCE_REGISTRY.json`：**45条**权威史料、大学学术研究、英国博物馆、英法条约历史文书与官方地理遗产索引。每条区别已读公开页与未阅原档。
- `CHRONOLOGY.json`：**22条**按事件真实发生年份出现的历史事件。部分年份无可靠新事件不伪造补数。
- `CONTROL_TRANSITION_1549_1559.json`：**9项1549政治身份**跨年不断档，10份1550—1559年度快照，4处1550英军退出、4处苏格兰未确认撤退情况、2项1558法国收复。
- `POLITICAL_CONTROL_SITES_1550_1559.geojson`：**15处Point**，包含9具名政体标记和6处实际城防/殖民据点研究点。所有Point坐标为现代历史地名或遗产保护位置，古代堡垒范围不能据此计算。
- `MAP_REFERENCE_OUTLINES_1550_1559.geojson`：**8片旧地图参考**，GIS几何与第六章相同（7项早期现代沿海地理/岛屿及威尔士法律参考）。标记1558加来控制从英方切到法方，全部虚线或纹理，**英国历史实控精准Polygon=0**。
- `MAP_DELTA_1550_1559.geojson`：**11处**退军、法方收复、1556爱尔兰法定安置和1559和约对应地图点。
- `IRISH_MIDLANDS_PLANTATION_1556.json`：两郡殖民制度、O'More/O'Connor原地方权力、已有军事据点、军事控制与土地授予证据分离。
- `TRADE_AND_FORCED_LABOUR_NETWORKS_1550_1559.json`：6组西非与白海航次、Muscovy公司1555成立、Lok1555年5名被奴役者。没找到能证明船舶实际经纬度的原日志时，`route_polyline:null`。
- `FINANCIAL_EVIDENCE.json`：8类数字/资产变化，包含1550布洛涅40万金埃居条约额、1559加来50万金埃居担保、约翰·洛克被奴役5人、人身自由剥夺、爱尔兰没收土地、1559威廉·格雷私人赎金等；**币种、现金、条约保证及名义本金不得相加，真实净掠夺利润null**。
- `ATLAS_REVIEW_CANDIDATE.json`：主编候审**22事件、15地点、37条直接使用的文献引用**；旧地图 `colonial_polygons:[]`和无证船迹`routes:[]`。
- `ARCHIVAL_ACTION_QUEUE.json`：16项紧要补档，7项P0；无法短时查实无需为了凑数阻塞地图制作。
- `TRANSITION_1559_1560_RESEARCH_SEED.json`：第八章必须继承法国实际控制的Calais/Guînes、独立苏格兰、仍在争夺的爱尔兰中部、继续存在的海岛政体与商业网络。
- `interactive_research_preview.html`：Leaflet独立1550—1559年可拖动时间轴、点按事件侧栏、双击仅平移不改变缩放，研究预览**不代表主站已上线**。
- `validate_research.py`：结构、逐年控制、史料关联、英法状态、爱尔兰法定未取得全郡军管、财政口径和未伪造古代GIS硬性验证。

## 真正影响准确性的主要史料争议

1. **布劳蒂1550具体收复日**：苏格兰官方遗产资料可证明1550年，但传说的2月12日尚未从同时期军事档案核实。
2. **埃茅斯、劳德尔、Dunglass和Hailes的1550年驻军确切存续**：PR #27只给部分1550撤军的研究线索，原文末日不足据。此章清单保持`uncertain`，**既不擅自宣称当年收复，也不把英军橙色延续到1560**。
3. **加来Pale边缘真实地界**：早期GIS为史料城镇凸包与现代海岛参考，未拥有真正1558年重测量界线。1558之后地理位置依旧存在，只是变更法国主权，而英国实际领土颜色退去。
4. **爱尔兰王室殖民宣称与实际军事据地**：原Fort Governor早在1546、Fort Protector在1547–48已经有英军据点，1556法律增加没收与设郡而没有证据支持整个现代Laois/Offaly已实控。另National Inventory记某些现存墙线约1560，不能当1547原墙。
5. **1550/1559条约货币、英商资本和人口奴役**：40万与50万金埃居属于不同年份不同义务。私人资本£6000来自19世纪史家概述且未原账核对，5位被奴役者是人口计数。不得伪造英国政府净收益。
6. **航线真实性**：1554 Lok船队的出海日期、Dover、Rye、Dartmouth和Madeira地名见Hakluyt印刷叙述；缺全部测绘航线，因此暂时建立有序地点资料而不伪造可交互舰船轨迹。

## 批次保存与质控

已于独立分支分批保存来源→1549→1559控制台账→22事件→15地点→地图参考/Delta→爱尔兰殖民专题→奴役和商贸→财务分类→主编候审Atlas→质量验证→地图独立预览。另已建立Draft PR，**仅提交研究文件而非主站`main/data`与前端代码**。

当前GitHub远端数据重新读取、独立JavaScript一致性审查结果：**PASS（0处数据结构/来源及重要年份遗漏）**。但独立Python验证脚本与前端独立预览的Node语法已配置为**手动GitHub Actions工作流**，目前未自动触发；不可把常规主站UI规范检查等同研究脚本跑过。浏览器视觉和16世纪手稿还需主编审核。

## 史料速查

- [法国国家图书馆1550布洛涅条款](https://catalogue.bnf.fr/ark:/12148/cb179788724)，[Héliot布洛涅4月25日交城](https://www.persee.fr/doc/rnord_0035-2624_1958_num_40_157_2255?pageId=T1_6)。
- [苏格兰历史环境局布劳蒂](https://www.historicenvironment.scot/visit/all/broughty-castle/history-and-stories/)。
- [Laois郡议会1547—48军堡](https://consult.laois.ie/ga/consultation/draft-laois-county-development-plan-2021-2027/chapter/chapter-12-built-and-cultural-heritage)、[国家考古机构Daingean1546 Fort Governor](https://www.archaeology.ie/app/uploads/2025/05/County_Offaly_Urban_Archaeology_Survey_1986.pdf)。
- [Cambridge加来1558落城](https://www.cambridge.org/core/books/abs/calais-garrison/fall-of-calais-in-1558/2330D21ED5D389BAFAE058D6C184ED25)、[History of Parliament 1558吉讷](https://historyofparliament.com/2024/04/30/prisoner-in-the-lords-william-grey/)。
- [Historic England 1555 John Lok奴役](https://historicengland.org.uk/research/inclusive-heritage/the-slave-trade-and-abolition/sites-of-memory/slave-traders-and-plantation-wealth/britain-and-the-slave-trade/)、[British Museum莫斯科公司1555](https://www.britishmuseum.org/collection/object/H_1928-0315-1)。
- [Larousse英法1559和约](https://www.larousse.fr/encyclopedie/divers/paix_du_Cateau-Cambr%C3%A9sis/112114)及[1559条约英译](https://en.wikisource.org/wiki/Treaty_of_Cateau-Cambr%C3%A9sis_(England_and_France))。


## 调查员3｜逐年疆域补缺与主编入图说明（2026-10-13）

本节覆盖先前首版研究后的**追加审计**；上方旧基线的“22事/15点/11变化/45来源/16待查”是当时计数。最新研究 **62来源、29史事、18地点Point、15地图变化Point、23原档任务**，10份逐年快照、9持续政治身份、8旧虚线参考区域不变，**真实考古/16世纪经过配准和授权可当领土的Polygon仍为0**。全部保留在 [PR #33](https://github.com/1959124923wyz-sys/love-British-TV/pull/33)，不直接更新正式 `main/data`。

### 最影响地图动态的年度控制时间表

| 时间 | 必须更新的控制关系 | 正确的地图形式 |
| --- | --- | --- |
| **1550** | 4月25日法国正式接布洛涅；2月苏法军夺回独立苏格兰布劳蒂及外围堡；**英军埃茅斯占领至1550年夏**，此后英军控制应消失；**邓巴Dunbar法国盟军1550年新修军堡**。此前Hailes已被苏军1548收复，绝不能沿用“1550英军未定”。 | Boulogne、Broughty、Eyemouth各自记录退出，不断层；邓巴仅HES古迹现代参考Point，无1550军堡真实墙界；苏格兰没有被法英兼并。 |
| **1551—1555** | 加来Calais、吉讷Guînes、此前**被遗漏的沼泽堡Hammes**英军持续据守；爱尔兰中部Fort Governor与Fort Protector从1540年代就存在，不能突然从1556“生成新占地”。 | Calais和Guînes用旧点及不确定旧Pale虚线；Hammes仅历史事实，无可靠古堡GPS，**暂不Pin**；爱尔兰现存堡址Point与盖尔地方统治区同时表达。 |
| **1556** | Queen’s County / King’s County殖民设郡法权、土地没收和英裔定居，与实际堡垒驻防分开；**因奇基斯岛Inchkeith苏法联合军堡1556—1564官方考古建设期**。 | 两旧英军据堡有证Point，现代Laois/Offaly县界不做实心英王占领；因奇基斯用HES考古位置Point，**苏格兰主权不变**。 |
| **1557** | **埃茅斯同一海岬转入新的法国盟军驻堡时期**，与1547—1550年英军旧炮堡截然不同；法国另筑线。 | 1557—1558英军橙色绝不可复活；法国驻军身份与苏格兰法定主权分开，不整片涂法国。 |
| **1558** | 英军加来防御网按次序失去：到**1月4日**Newnham Bridge、Risbank已由法军夺取（王室收藏馆引当日军报）；加来城中**1月7日城堡战事与1月8日完整收复**分别见王室收藏馆和加来市档案；1月吉讷失守，其后**Hammes城堡最后英军沿沼泽撤入佛兰德尔**。 | 依次记录外堡→城→吉讷→Hammes，不是1558年整块现代Pas-de-Calais突然画成历史精确Polygon。王室收藏馆称1558吉讷围城版画与BL Cotton Augustus I ii71同时代地图的城堡方位相互矛盾，**不拿版画描墙**。 |
| **1559** | 卡托和约不恢复加来英国实际控制；法国退出埃茅斯的谈判记于1559年7月（实体拆堡可能后来）；**利斯Leith法军9月筑防御工事**，进入1560研究持续。 | 保持Calais、Guînes及旧Hammes区域法国控制；Leith无1559可证真实墙址Pin，事件入左栏；Eyemouth法国驻军退出和工程拆除两件事分开。 |

### 值得立即审核的新史料（高价值古址）

- [HES 邓巴 Castle Park SM5960](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM5960)：1550法国盟军修筑防御堡；遗址可见壕沟，官方记1560拆除。考古参考NGR `NT 67833 79183`；现代180×170米保护地并非1550古堡实际堡墙。
- [HES 因奇基斯岛 SM3838](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM3838)：1556—1564苏法联合堡，原古工事遗迹尚存；现代保护区接近全岛，包含19／20世纪建筑，不能当1556法军“占领面积”。
- [英国图书馆 Cotton MS Caligula B X/1](https://searcharchives.bl.uk/catalog/041-003481449)：1559年9月利斯法军筑垒记于原稿目录，实际原页尚未亲阅，故不上伪坐标。
- [Royal Collection Calais 1558围城说明](https://militarymaps.rct.uk/other-16th-century-conflicts/view-of-the-siege-of-calais-1558-calais-nord-pas-de-calais-france-50deg5707n-01deg5122e-0)：引1558-01-04军报，支持Newnham/Rysbank前于城市的变色；[Guînes 1558围城说明](https://militarymaps.rct.uk/other-16th-century-conflicts/view-of-the-siege-of-guines-1558-guines-nord-pas-de-calais-france-50deg5201n-01deg5212e)说明Hammes最后英军离开，且当年版画的城堡方位不宜直接测绘。
- [苏格兰埃茅斯考古论文](https://doi.org/10.1179/pma.1997.002)、[Eyemouth Museum](https://eyemouthmuseum.co.uk/the-museum/eyemouth-fort/)：英军至1550夏、法军1557新筑、1559谈判撤离与更晚拆堡必须分开。
- [HES Hailes Castle官方文件](https://app-hes-pubs-prod-neu-01.azurewebsites.net/api/file/22c5de1a-d6b9-40e0-b131-b02800bb45fb)：1548英军夺取**同年苏军收复**，已在第六章PR27研究分支更正；第七章不得把它写成1550英军驻防未知。

### 对接主编的数据和不可逾越的地图准入线

- `TERRITORIAL_CONTINUITY_GAP_AUDIT_COLLECTOR3_20261013.json`：**11个**跨年取得、易手、退出或筑垒episode和10年末状态矩阵，是主编先看的跨章节地图控制权依据。除经考古确定所在地的三处苏格兰建筑参考Point外，**Hammes旧堡和1559 Leith新垒仍保持无坐标**。
- `CONTROL_TRANSITION_1549_1559.json`、`MAP_DELTA_1550_1559.geojson`、`POLITICAL_CONTROL_SITES_1550_1559.geojson`和`ATLAS_REVIEW_CANDIDATE.json` 已同步更新。用 `stable_id` 合并并按年份单独着色，1560必须沿用1559实际政权；不能因无数据清空或沿用英国橙色。
- **点≠面**：HES古迹法定保护边界、殖民法令县界、古城堡旧画中的城墙、现代堡垒的GPS点都不等于1550年代英国或法国直接实控面；边界没获得证实保持虚线与`fill_authorized:false`，不给精准面积。
- 原档待查清单扩大到**23项（P0共13项）**，最主要为Hammes古址、Guînes伪方位版画、1559 Eyemouth实际撤军日、Dunbar／Inchkeith／Leith军堡原档和1556定居者逐宗地契。地图按证据粒度逐步发布，不得捏造补齐。

研究源、候审事件、阶段报告及质量说明由调查员提交本PR，主编择要移植，不得整包覆盖与PR27已不一致的生产前端与历史数据。
