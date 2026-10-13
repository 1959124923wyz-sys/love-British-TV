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
